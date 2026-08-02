/* ═══════════════════════════════════════════════════════════
   ENGINE
   ═══════════════════════════════════════════════════════════ */
const KEY = 'mastery.progress.v2';
const KEY_V1 = 'mastery.progress.v1';

/* XP awarded once per lesson, per reason. */
const XP = { lesson: 20, quizPass: 30, quizPerfect: 10 };
const PASS_MARK = 0.75;

const LEVELS = [
  { at: 0,    name: 'Curious' },
  { at: 120,  name: 'Beginner' },
  { at: 320,  name: 'Apprentice' },
  { at: 640,  name: 'Practitioner' },
  { at: 1100, name: 'Journeyman' },
  { at: 1750, name: 'Craftsman' },
  { at: 2600, name: 'Expert' },
  { at: 3700, name: 'Master' }
];

const ACHIEVEMENTS = [
  { id: 'first-lesson', icon: '🎯', name: 'First steps',      how: 'Complete any lesson',
    test: s => s.done.size >= 1 },
  { id: 'first-quiz',   icon: '✅', name: 'Checked out',       how: 'Pass your first lesson check',
    test: s => passedQuizCount(s) >= 1 },
  { id: 'perfect',      icon: '💎', name: 'Flawless',          how: 'Score 100% on a lesson check',
    test: s => Object.values(s.scores).some(v => v.correct === v.total && v.total > 0) },
  { id: 'polyglot',     icon: '🧩', name: 'Polyglot',          how: 'Complete a lesson in all four tracks',
    test: s => TRACK_IDS.every(t => [...s.done].some(k => k.startsWith(t + ':'))) },
  { id: 'server-side',  icon: '🗄️', name: 'Server sider',      how: 'Complete 5 Flask or os lessons',
    test: s => countSide(s, 'server') >= 5 },
  { id: 'client-side',  icon: '🖥️', name: 'Browser sider',     how: 'Complete 5 JavaScript or CSS lessons',
    test: s => countSide(s, 'client') >= 5 },
  { id: 'streak-3',     icon: '🔥', name: 'Three in a row',    how: 'Study three days running',
    test: s => s.streak.best >= 3 },
  { id: 'streak-7',     icon: '⚡', name: 'Week strong',        how: 'Study seven days running',
    test: s => s.streak.best >= 7 },
  { id: 'quiz-10',      icon: '🏅', name: 'Ten checks passed', how: 'Pass ten lesson checks',
    test: s => passedQuizCount(s) >= 10 },
  { id: 'halfway',      icon: '🧭', name: 'Halfway',           how: 'Complete half the written lessons',
    test: s => s.done.size >= Math.ceil(writtenCount() / 2) }
];

const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

/* inline markup: `code` and **bold** — applied to already-escaped text */
function inline(t) {
  return esc(t)
    .replace(/`([^`]+)`/g, (_, c) => '<code>' + c + '</code>')
    .replace(/\*\*([^*]+)\*\*/g, (_, c) => '<strong>' + c + '</strong>');
}

/* ── Syntax highlighting ─────────────────────────────────── */
const GRAMMAR = {
  python: {
    com: /#[^\n]*/,
    str: /(?:'''[\s\S]*?'''|"""[\s\S]*?"""|[rbfu]{0,2}'(?:\\.|[^'\\])*'|[rbfu]{0,2}"(?:\\.|[^"\\])*")/,
    dec: /@[\w.]+/,
    ctl: /\b(?:if|elif|else|for|while|break|continue|return|yield|try|except|finally|raise|with|pass|assert|in|not|and|or|is)\b/,
    kw: /\b(?:def|class|import|from|as|lambda|global|nonlocal|del|async|await|None|True|False)\b/,
    var: /\b(?:self|cls)\b/,
    fn: /\b[A-Za-z_]\w*(?=\()/,
    type: /\b(?:str|int|float|bool|list|dict|set|tuple|bytes|object|Exception|ValueError|TypeError|OSError|FileNotFoundError|FileExistsError|PermissionError|RuntimeError|KeyError|Flask|Path)\b/,
    num: /\b\d+(?:\.\d+)?\b/
  },
  js: {
    com: /(?:\/\/[^\n]*|\/\*[\s\S]*?\*\/)/,
    str: /(?:`(?:\\.|[^`\\])*`|'(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*")/,
    ctl: /\b(?:if|else|for|while|do|switch|case|break|continue|return|try|catch|finally|throw|await|yield|of|in|new|typeof|instanceof|delete|void)\b/,
    kw: /\b(?:const|let|var|function|class|extends|async|import|export|default|from|static|get|set|super|null|undefined|true|false)\b/,
    var: /\b(?:this|arguments)\b/,
    fn: /\b[A-Za-z_$][\w$]*(?=\()/,
    type: /\b(?:Array|Object|String|Number|Boolean|Math|JSON|Promise|Map|Set|Error|Date|RegExp|Symbol|console|document|window|localStorage)\b/,
    num: /\b\d+(?:\.\d+)?\b/
  },
  css: {
    com: /\/\*[\s\S]*?\*\//,
    str: /(?:'(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*")/,
    kw: /@[\w-]+/,
    sel: /(?:[.#][A-Za-z_-][\w-]*|::?[a-z-]+(?:\([^()]*\))?|\[[^\]]*\])/,
    prop: /\b[a-z-]+(?=\s*:)/,
    num: /(?:#[0-9a-fA-F]{3,8}\b|\b\d*\.?\d+(?:px|rem|em|%|vh|vw|dvh|s|ms|fr|ch|deg|ex)?\b)/,
    fn: /\b[a-z-]+(?=\()/
  },
  html: {
    com: /&lt;!--[\s\S]*?--&gt;/,
    str: /(?:'(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*")/,
    tag: /(?:&lt;\/?[\w-]+|\/?&gt;)/,
    attr: /\b[\w-]+(?==)/,
    num: /\b\d+(?:\.\d+)?\b/
  }
};
GRAMMAR.jinja = {
  com: /(?:&lt;!--[\s\S]*?--&gt;|\{#[\s\S]*?#\})/,
  ctl: /(?:\{%[\s\S]*?%\})/,
  kw: /(?:\{\{[\s\S]*?\}\})/,
  str: /(?:'(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*")/,
  tag: /(?:&lt;\/?[\w-]+|\/?&gt;)/,
  attr: /\b[\w-]+(?==)/,
  num: /\b\d+(?:\.\d+)?\b/
};
GRAMMAR.shell = {
  com: /#[^\n]*/,
  str: /(?:'(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*")/,
  var: /\$env:[\w]+|\$\w+/,
  kw: /\b(?:python|pip|flask|cd|git|node|curl|npm|set)\b/,
  num: /\b\d+(?:\.\d+)?\b/
};
GRAMMAR.text = {};

/* First match wins, so comments and strings must be tried before words. */
const ORDER = ['com', 'str', 'dec', 'sel', 'prop', 'attr', 'tag', 'ctl', 'kw', 'var', 'fn', 'type', 'num'];

/* Escape for element text only. Unlike esc(), quotes are left alone — the
   result goes inside <pre>/<code>, never into an attribute, and the string
   patterns below have to be able to see their own opening quote. */
const escCode = s => String(s).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));

function highlight(lang, src) {
  const g = GRAMMAR[lang] || GRAMMAR.text;
  const escaped = escCode(src);
  const parts = ORDER.filter(k => g[k]);
  if (!parts.length) return escaped;
  const rx = new RegExp(parts.map(k => '(' + g[k].source + ')').join('|'), 'g');
  let out = '', last = 0, m;
  while ((m = rx.exec(escaped)) !== null) {
    if (m[0] === '') { rx.lastIndex++; continue; }
    out += escaped.slice(last, m.index);
    const which = parts[m.slice(1).findIndex(v => v !== undefined)];
    out += '<span class="tok-' + which + '">' + m[0] + '</span>';
    last = m.index + m[0].length;
  }
  return out + escaped.slice(last);
}

/* ── Block rendering ─────────────────────────────────────── */
let labSeq = 0;
function renderBlock(b) {
  const [kind] = b;
  if (kind === 'p') return '<p>' + inline(b[1]) + '</p>';
  if (kind === 'h') return '<h3>' + inline(b[1]) + '</h3>';
  if (kind === 'ul') return '<ul>' + b[1].map(i => '<li>' + inline(i) + '</li>').join('') + '</ul>';
  if (kind === 'note' || kind === 'warn') {
    return '<div class="aside' + (kind === 'warn' ? ' warn' : '') + '">' +
      '<span class="tag">' + (kind === 'warn' ? 'Watch out' : 'Why it matters') + '</span>' +
      inline(b[1]) + '</div>';
  }
  if (kind === 'code') {
    return '<div class="block"><div class="block-top"><span class="lang">' + esc(b[1]) + '</span>' +
      '<button class="copy" data-copy>Copy</button></div>' +
      '<pre><code>' + highlight(b[1], b[2]) + '</code></pre>' +
      '<textarea hidden data-src>' + esc(b[2]) + '</textarea></div>';
  }
  if (kind === 'tbl') {
    return '<div class="tbl-wrap"><table><thead><tr>' +
      b[1].map(h => '<th>' + inline(h) + '</th>').join('') + '</tr></thead><tbody>' +
      b[2].map(r => '<tr>' + r.map(c => '<td>' + inline(c) + '</td>').join('') + '</tr>').join('') +
      '</tbody></table></div>';
  }
  if (kind === 'lab') {
    const id = 'lab' + (++labSeq);
    const isCss = b[1] === 'css';
    return '<div class="lab" data-lab="' + b[1] + '" id="' + id + '">' +
      '<div class="lab-top"><span class="lang">' + (isCss ? 'Live CSS — edit and run' : 'Live JavaScript — edit and run') + '</span>' +
      '<div class="lab-actions"><button class="ghost-btn" data-reset>Reset</button>' +
      '<button class="run-btn" data-run>Run</button></div></div>' +
      '<textarea spellcheck="false" data-editor>' + esc(b[2]) + '</textarea>' +
      '<textarea hidden data-initial>' + esc(b[2]) + '</textarea>' +
      (isCss ? '<iframe data-out sandbox="allow-scripts" title="Live preview"></iframe>'
             : '<div class="console" data-out><span class="muted">Press Run to execute.</span></div>') +
      '</div>';
  }
  return '';
}

/* ── State ───────────────────────────────────────────────── */
const TRACK_IDS = Object.keys(COURSE);

let state = {
  view: 'home',                 // 'home' | 'lesson'
  track: TRACK_IDS[0],
  lesson: 0,
  filter: '',
  done: new Set(),              // "track:index" of completed lessons
  scores: {},                   // "track:index" -> { correct, total }
  answers: {},                  // "track:index" -> [chosen index | null, ...]
  xp: 0,
  awarded: new Set(),           // "track:index:reason" — stops double-paying XP
  badges: new Set(),
  placed: new Set(),            // pre-completed by the placement, not by you
  streak: { days: 0, best: 0, last: null }
};

const uid = (tr, i) => tr + ':' + i;
/* Local calendar date, not UTC — otherwise the streak flips at the wrong hour. */
const today = () => {
  const d = new Date();
  return d.getFullYear() + '-' +
    String(d.getMonth() + 1).padStart(2, '0') + '-' +
    String(d.getDate()).padStart(2, '0');
};
const dayNumber = d => Math.floor(new Date(d + 'T00:00:00').getTime() / 86400000);

const totalLessons = () => TRACK_IDS.reduce((n, t) => n + COURSE[t].lessons.length, 0);
const writtenCount = () => TRACK_IDS.reduce((n, t) => n + COURSE[t].lessons.filter(l => l.blocks).length, 0);
const trackDone = t => COURSE[t].lessons.reduce((n, _, i) => n + (state.done.has(uid(t, i)) ? 1 : 0), 0);
const trackWritten = t => COURSE[t].lessons.filter(l => l.blocks).length;

function passedQuizCount(s) {
  return Object.values(s.scores).filter(v => v.total > 0 && v.correct / v.total >= PASS_MARK).length;
}
function countSide(s, side) {
  return [...s.done].filter(k => {
    const t = COURSE[k.split(':')[0]];
    return t && t.side === side;
  }).length;
}
function quizPassed(id) {
  const v = state.scores[id];
  return !!v && v.total > 0 && v.correct / v.total >= PASS_MARK;
}
function levelFor(xp) {
  let i = 0;
  while (i + 1 < LEVELS.length && xp >= LEVELS[i + 1].at) i++;
  const cur = LEVELS[i], next = LEVELS[i + 1] || null;
  return {
    index: i + 1,
    name: cur.name,
    into: xp - cur.at,
    span: next ? next.at - cur.at : 0,
    toNext: next ? next.at - xp : 0,
    pct: next ? (xp - cur.at) / (next.at - cur.at) * 100 : 100
  };
}

function load() {
  let raw = null;
  try { raw = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { /* unreadable */ }

  if (!raw) {
    /* Carry over progress from the first version of this page. */
    try {
      const old = JSON.parse(localStorage.getItem(KEY_V1) || 'null');
      if (old && Array.isArray(old.done)) {
        raw = { done: old.done, track: old.track, lesson: old.lesson, xp: old.done.length * XP.lesson };
      }
    } catch (e) { /* nothing to migrate */ }
  }

  if (!raw) applyPlacement();          /* first visit — start from what you already know */

  if (raw) {
    if (Array.isArray(raw.placed)) state.placed = new Set(raw.placed);
    if (Array.isArray(raw.done)) state.done = new Set(raw.done);
    if (Array.isArray(raw.awarded)) state.awarded = new Set(raw.awarded);
    if (Array.isArray(raw.badges)) state.badges = new Set(raw.badges);
    if (raw.scores) state.scores = raw.scores;
    if (raw.answers) state.answers = raw.answers;
    if (typeof raw.xp === 'number') state.xp = raw.xp;
    if (raw.streak) state.streak = Object.assign(state.streak, raw.streak);
    if (raw.track && COURSE[raw.track]) state.track = raw.track;
    if (typeof raw.lesson === 'number') state.lesson = raw.lesson;
  }

  const t = COURSE[state.track];
  if (!t || state.lesson >= t.lessons.length) state.lesson = 0;
  touchStreak();
}

/* Mark everything the placement rates "known" as already done. No XP is
   paid for these — you did the work in your own repo, not here. */
function applyPlacement() {
  Object.entries(PLACEMENT).forEach(([id, p]) => {
    if (p.level !== 'known') return;
    const [tr, i] = id.split(':');
    if (!COURSE[tr] || !COURSE[tr].lessons[+i] || !COURSE[tr].lessons[+i].blocks) return;
    state.done.add(id);
    state.placed.add(id);
  });
}

function resetPlacement() {
  state.placed.forEach(id => state.done.delete(id));
  state.placed.clear();
  save();
  render({ animate: true });
  toast('↺', 'Placement cleared', 'Every lesson is locked again from the start');
}

const placementOf = id => PLACEMENT[id] || null;

/* ── Backup ──────────────────────────────────────────────────
   Browser storage is keyed to the exact address, so progress does not
   follow you between ports, browsers or profiles. These two let you
   carry it across by hand.                                            */
/* The address progress is filed under. Guarded — there is no location when
   the page is opened straight off disk in some hosts. */
function storageOrigin() {
  try {
    if (window.location && window.location.origin && window.location.origin !== 'null') {
      return window.location.origin;
    }
  } catch (e) { /* no location here */ }
  return 'this file';
}

function exportProgress() {
  let payload;
  try {
    payload = {
      format: 'four-tracks-progress',
      version: 2,
      exportedFrom: storageOrigin(),
      progress: JSON.parse(localStorage.getItem(KEY) || '{}'),
      files: JSON.parse(localStorage.getItem(FILES_KEY) || 'null')
    };
  } catch (e) {
    toast('!', 'Export failed', 'Could not read saved progress');
    return;
  }

  const text = JSON.stringify(payload, null, 2);
  try {
    const blob = new Blob([text], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'four-tracks-progress.json';
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast('⬇', 'Exported', 'four-tracks-progress.json');
  } catch (e) {
    toast('!', 'Export failed', e.message);
  }
}

function importProgress(text) {
  let payload;
  try { payload = JSON.parse(text); }
  catch (e) { toast('!', 'Import failed', 'That is not a JSON file'); return; }

  if (!payload || payload.format !== 'four-tracks-progress' || !payload.progress) {
    toast('!', 'Import failed', 'Not a Four Tracks backup file');
    return;
  }

  try {
    localStorage.setItem(KEY, JSON.stringify(payload.progress));
    if (payload.files) localStorage.setItem(FILES_KEY, JSON.stringify(payload.files));
  } catch (e) {
    toast('!', 'Import failed', 'Storage is not writable here');
    return;
  }

  /* Rebuild in-memory state from what was just written. */
  state.done = new Set();
  state.placed = new Set();
  state.awarded = new Set();
  state.badges = new Set();
  state.scores = {};
  state.answers = {};
  state.xp = 0;
  state.streak = { days: 0, best: 0, last: null };
  session = null;

  load();
  loadFiles();
  render({ animate: true });
  toast('⬆', 'Imported', state.done.size + ' lessons, ' + state.xp + ' XP restored');
}

function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify({
      done: [...state.done],
      awarded: [...state.awarded],
      badges: [...state.badges],
      placed: [...state.placed],
      scores: state.scores,
      answers: state.answers,
      xp: state.xp,
      streak: state.streak,
      track: state.track,
      lesson: state.lesson
    }));
  } catch (e) { /* private mode — progress just won't persist */ }
}

/* Called on load and after any scoring action. */
function touchStreak() {
  const now = today();
  const last = state.streak.last;
  if (last === now) return;
  if (last && dayNumber(now) - dayNumber(last) === 1) state.streak.days += 1;
  else state.streak.days = 1;
  state.streak.last = now;
  state.streak.best = Math.max(state.streak.best || 0, state.streak.days);
}

/* Award XP once for a given (lesson, reason) pair. */
function award(id, reason, amount) {
  const key = id + ':' + reason;
  if (state.awarded.has(key)) return 0;
  state.awarded.add(key);
  state.xp += amount;
  return amount;
}

function checkBadges() {
  const fresh = [];
  ACHIEVEMENTS.forEach(a => {
    if (state.badges.has(a.id)) return;
    let ok = false;
    try { ok = a.test(state); } catch (e) { ok = false; }
    if (ok) { state.badges.add(a.id); fresh.push(a); }
  });
  return fresh;
}

/* Next unfinished written lesson, for the Continue card. */
function nextUp() {
  for (const t of TRACK_IDS) {
    const ls = COURSE[t].lessons;
    for (let i = 0; i < ls.length; i++) {
      if (ls[i].blocks && !state.done.has(uid(t, i))) return { track: t, lesson: i, item: ls[i] };
    }
  }
  return null;
}

/* ── Rail rendering ──────────────────────────────────────── */
function renderTracks() {
  const groups = { server: [], client: [] };
  TRACK_IDS.forEach(id => {
    const t = COURSE[id];
    const d = trackDone(id), n = t.lessons.length;
    groups[t.side].push(
      '<button class="track-btn" data-track="' + id + '" data-side="' + t.side + '" ' +
      'aria-pressed="' + (state.track === id ? 'true' : 'false') + '">' +
      '<span>' + esc(t.name) + '</span>' +
      '<span class="meter"><i style="width:' + Math.round(d / n * 100) + '%"></i></span>' +
      '<span class="count">' + d + '/' + n + '</span></button>'
    );
  });
  document.getElementById('grp-server').innerHTML = groups.server.join('');
  document.getElementById('grp-client').innerHTML = groups.client.join('');
}

function renderSyllabus() {
  const t = COURSE[state.track];
  const q = state.filter.trim().toLowerCase();
  const rows = t.lessons.map((l, i) => {
    const hay = (l.t + ' ' + (l.sub || '')).toLowerCase();
    const hide = q && !hay.includes(q);
    return '<button class="syl-item" data-i="' + i + '"' +
      (hide ? ' hidden' : '') +
      ' data-done="' + (state.done.has(uid(state.track, i)) ? 1 : 0) + '"' +
      ' data-planned="' + (l.blocks ? 0 : 1) + '"' +
      ' aria-current="' + (state.lesson === i ? 'true' : 'false') + '">' +
      '<span class="n">' + String(i + 1).padStart(2, '0') + '</span>' +
      '<span class="t">' + esc(l.t) + '</span></button>';
  });
  const anyVisible = t.lessons.some((l, i) => !q || (l.t + ' ' + (l.sub || '')).toLowerCase().includes(q));
  const el = document.getElementById('syllabus');
  el.innerHTML = rows.join('') + (anyVisible ? '' : '<p class="syl-empty">No lesson in this track matches “' + esc(state.filter) + '”. Try another track.</p>');
  el.style.setProperty('--hue', t.side === 'server' ? 'var(--server)' : 'var(--client)');
}

function renderOverall() {
  const total = totalLessons(), d = state.done.size;
  document.getElementById('overall-bar').style.width = (total ? d / total * 100 : 0) + '%';
  document.getElementById('overall-txt').textContent = d + ' / ' + total + ' done';

  const streakEl = document.getElementById('chip-streak');
  const days = state.streak.days || 0;
  /* Only rewrite when it changes — otherwise the flame animation restarts. */
  const label = '<span class="glyph">🔥</span>' + days + (days === 1 ? ' day' : ' days');
  if (streakEl.innerHTML !== label) streakEl.innerHTML = label;
  streakEl.classList.toggle('streak-live', days >= 2);
  streakEl.title = days >= 2
    ? days + ' consecutive days — best run ' + state.streak.best
    : 'Come back tomorrow to start a streak';

  const lv = levelFor(state.xp);
  document.getElementById('chip-level').innerHTML =
    '<span class="glyph">◆</span>Lv ' + lv.index + ' · ' + state.xp + ' XP';
  document.getElementById('chip-level').title =
    lv.name + (lv.toNext ? ' — ' + lv.toNext + ' XP to ' + LEVELS[lv.index].name : ' — top level');
}

/* ── Dashboard ───────────────────────────────────────────── */
function ring(pct, hue) {
  const r = 22, c = 2 * Math.PI * r;
  const off = c * (1 - pct / 100);
  /* Starts empty; playMeters() transitions it to data-target so the ring draws. */
  return '<svg class="ring" width="56" height="56" viewBox="0 0 56 56" aria-hidden="true" style="--hue:' + hue + '">' +
    '<circle class="bg" cx="28" cy="28" r="' + r + '"></circle>' +
    '<circle class="fg" cx="28" cy="28" r="' + r + '" ' +
    'stroke-dasharray="' + c.toFixed(1) + '" stroke-dashoffset="' + c.toFixed(1) + '" ' +
    'data-target="' + off.toFixed(1) + '" ' +
    'transform="rotate(-90 28 28)"></circle>' +
    '<text x="28" y="29" data-count="' + Math.round(pct) + '">0</text></svg>';
}

let freshBadges = new Set();

function renderHome(opts) {
  opts = opts || {};
  const lv = levelFor(state.xp);
  const up = nextUp();
  const written = writtenCount();
  const passed = passedQuizCount(state);
  const quizTotal = TRACK_IDS.reduce((n, t) => n + COURSE[t].lessons.filter(l => l.quiz).length, 0);

  const hour = new Date().getHours();
  const greeting = hour < 5 ? 'Still up' : hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const returning = state.done.size > 0 || state.xp > 0;

  let h = '<div class="home">';

  /* Hero */
  h += '<header class="hero"><div class="hero-left">' +
    '<span class="eyebrow">' + esc(greeting) + '</span>' +
    '<h2>' + (returning ? 'Pick up where you left off' : 'Start with lesson one') + '</h2>' +
    '</div><div class="xp-block">' +
    '<div class="xp-line"><strong>Level ' + lv.index + ' · ' + esc(lv.name) + '</strong>' +
    '<span><b data-count="' + state.xp + '">0</b> XP</span></div>' +
    '<div class="xp-track"><i style="width:0" data-target="' + Math.min(100, lv.pct).toFixed(1) + '%"></i></div>' +
    '<div class="xp-line"><span>' +
    (lv.toNext ? lv.toNext + ' XP to ' + esc(LEVELS[lv.index].name) : 'Top level reached') +
    '</span><span>🔥 ' + (state.streak.days || 0) + '-day streak</span></div>' +
    '</div></header>';

  /* Placement */
  if (state.placed.size) {
    h += '<div class="placement"><span class="pk">Placement · from reading your repo</span>' +
      '<p><strong>' + state.placed.size + ' lessons are already ticked off</strong> because your own code ' +
      'shows you can do them — routes and converters, query strings, Jinja loops, ' +
      '<code>os.path.join</code>, <code>makedirs(exist_ok=True)</code> and the <code>__file__</code> anchor. ' +
      'Each path node says which of your files it was judged from.</p>' +
      '<div class="pactions">' +
      '<button class="ghost-btn" data-reset-placement>Clear placement — start from lesson 1</button>' +
      '</div></div>';
  }

  /* Continue */
  if (up) {
    const t = COURSE[up.track];
    const hue = t.side === 'server' ? 'var(--server)' : 'var(--client)';
    h += '<button class="continue" data-open-lesson="' + up.track + ':' + up.lesson + '" style="--hue:' + hue + '">' +
      '<span class="play">▶</span><span class="meta">' +
      '<span class="kicker">' + (returning ? 'Continue' : 'Start here') + ' · ' + esc(t.name) +
      ' lesson ' + String(up.lesson + 1).padStart(2, '0') + '</span>' +
      '<span class="name">' + esc(up.item.t) + '</span>' +
      '<span class="why">' + esc(up.item.sub || '') + '</span>' +
      '</span><span class="arrow">→</span></button>';
  } else {
    h += '<div class="continue" style="--hue:var(--accent);cursor:default">' +
      '<span class="play">✓</span><span class="meta">' +
      '<span class="kicker">All written lessons complete</span>' +
      '<span class="name">Nothing left in the queue</span>' +
      '<span class="why">Ask me to write more lessons — 52 are mapped and waiting.</span>' +
      '</span></div>';
  }

  /* Stats */
  h += '<div class="home-sec"><h3>At a glance</h3><span class="rule"></span></div><div class="stats">' +
    '<div class="stat"><span class="v"><b data-count="' + state.done.size + '">0</b></span><span class="k">lessons done</span></div>' +
    '<div class="stat"><span class="v"><b data-count="' + passed + '">0</b><span style="font-size:.8rem;color:var(--muted)">/' + quizTotal + '</span></span><span class="k">checks passed</span></div>' +
    '<div class="stat"><span class="v"><b data-count="' + state.xp + '">0</b></span><span class="k">total XP</span></div>' +
    '<div class="stat"><span class="v"><b data-count="' + (state.streak.best || 0) + '">0</b></span><span class="k">best streak</span></div>' +
    '<div class="stat"><span class="v"><b data-count="' + state.badges.size + '">0</b><span style="font-size:.8rem;color:var(--muted)">/' + ACHIEVEMENTS.length + '</span></span><span class="k">achievements</span></div>' +
    '</div>';

  /* Tracks */
  h += '<div class="home-sec"><h3>Tracks</h3><span class="rule"></span>' +
    '<span style="font-family:var(--ff-mono);font-size:.66rem;color:var(--muted)">' +
    written + ' written · ' + totalLessons() + ' mapped</span></div><div class="track-grid">';
  TRACK_IDS.forEach(id => {
    const t = COURSE[id];
    const w = trackWritten(id), d = trackDone(id);
    const pct = w ? d / w * 100 : 0;
    const hue = t.side === 'server' ? 'var(--server)' : 'var(--client)';
    h += '<button class="track-card" data-open-track="' + id + '" data-side="' + t.side + '">' +
      ring(pct, hue) +
      '<span class="info"><span class="tside">' + (t.side === 'server' ? 'server' : 'browser') + '</span>' +
      '<span class="tname">' + esc(t.name) + '</span>' +
      '<span class="tmeta">' + d + ' of ' + w + ' written · ' + t.lessons.length + ' mapped</span>' +
      '</span></button>';
  });
  h += '</div>';

  /* Backup */
  h += '<div class="home-sec"><h3>Progress backup</h3><span class="rule"></span></div>' +
    '<div class="placement" style="border-left-color:var(--server)">' +
    '<span class="pk" style="color:var(--server)">Stored at ' + esc(storageOrigin()) + '</span>' +
    '<p>Your progress is saved by your browser <strong>against this exact address</strong>. ' +
    'A different port, a different browser, or a private window is a different store — ' +
    'the work does not transfer on its own. Export before you move, import after.</p>' +
    '<div class="pactions">' +
    '<button class="ghost-btn" data-export>Export progress</button>' +
    '<button class="ghost-btn" data-import>Import progress</button>' +
    '<input type="file" id="import-file" accept="application/json,.json" hidden>' +
    '</div></div>';

  /* Achievements */
  h += '<div class="home-sec"><h3>Achievements</h3><span class="rule"></span>' +
    '<span style="font-family:var(--ff-mono);font-size:.66rem;color:var(--muted)">' +
    state.badges.size + ' of ' + ACHIEVEMENTS.length + '</span></div><div class="badges">';
  ACHIEVEMENTS.forEach(a => {
    const got = state.badges.has(a.id);
    h += '<div class="badge' + (freshBadges.has(a.id) ? ' fresh' : '') + '" data-locked="' + (got ? 0 : 1) + '">' +
      '<span class="icon">' + a.icon + '</span><span class="btext">' +
      '<span class="bname">' + esc(a.name) + '</span>' +
      '<span class="bhow">' + esc(a.how) + '</span></span></div>';
  });
  h += '</div></div>';

  const crumbs = document.getElementById('crumbs');
  crumbs.style.setProperty('--hue', 'var(--accent)');
  crumbs.innerHTML = '<span class="dot"></span><span>Dashboard</span>';

  const view = document.getElementById('view');
  view.innerHTML = h;
  toTop();

  const home = view.querySelector('.home');
  if (opts.animate) {
    home.classList.add('anim-in');
    stagger(home, ':scope > *', '--i', 12);
  }
  if (opts.gained) {
    const bar = home.querySelector('.xp-track');
    if (bar) bar.classList.add('gaining');
  }
  playMeters(home);
  home.querySelectorAll('[data-count]').forEach(el => countUp(el, +el.dataset.count));
  freshBadges.clear();
}

/* ── Lesson rendering ────────────────────────────────────── */
function renderLesson(opts) {
  opts = opts || {};
  const t = COURSE[state.track];
  const i = state.lesson;
  const l = t.lessons[i];
  const hue = t.side === 'server' ? 'var(--server)' : 'var(--client)';

  document.getElementById('crumbs').innerHTML =
    '<span class="dot"></span><span>' + esc(t.name) + '</span><span>/</span>' +
    '<span class="side">' + (t.side === 'server' ? 'server side' : 'browser side') + '</span>';
  document.getElementById('crumbs').style.setProperty('--hue', hue);

  let html = '<article class="lesson" style="--hue:' + hue + '">' +
    '<header class="lesson-head">' +
    '<div class="eyebrow"><span>' + esc(t.name) + ' · Lesson ' + String(i + 1).padStart(2, '0') + '</span><span class="rule"></span></div>' +
    '<h2>' + esc(l.t) + '</h2>' +
    (l.sub ? '<p class="standfirst">' + inline(l.sub) + '</p>' : '') +
    (l.blocks ? '<div style="display:flex;gap:var(--s3);flex-wrap:wrap;margin-top:var(--s2)">' +
      '<button class="s-btn" data-start-session style="padding:var(--s2) var(--s5);font-size:.72rem">' +
      (state.done.has(uid(state.track, i)) ? 'Practise again' : 'Start the lesson') + '</button>' +
      '<button class="ghost-btn" data-track="' + state.track + '">Back to path</button></div>' : '') +
    '</header>';

  if (l.blocks) {
    html += '<div class="body">' + l.blocks.map(renderBlock).join('') + '</div>';
    if (l.ex && l.ex.length) {
      html += '<section class="drills"><div class="drills-head"><h3>Exercises</h3>' +
        '<span class="of">' + l.ex.length + ' drills · solutions hidden</span></div>';
      html += l.ex.map((e, n) => {
        let rev = '';
        if (e.hint) rev += '<p class="hint-txt">' + inline(e.hint) + '</p>';
        return '<div class="drill"><span class="idx">' + String(n + 1).padStart(2, '0') + '</span>' +
          '<div class="drill-body"><p class="q">' + inline(e.q) + '</p>' +
          '<div class="drill-tools">' +
          (e.hint ? '<button class="pill" data-toggle="hint" aria-expanded="false">Hint</button>' : '') +
          '<button class="pill" data-toggle="ans" aria-expanded="false">Show solution</button></div>' +
          (e.hint ? '<div class="reveal" data-panel="hint">' + rev + '</div>' : '') +
          '<div class="reveal" data-panel="ans">' +
          (e.a ? '<p class="ans">' + inline(e.a) + '</p>' : '') +
          (e.code ? renderBlock(['code', e.code[0], e.code[1]]) : '') +
          '</div></div></div>';
      }).join('');
      html += '</section>';
    }

    const id = uid(state.track, i);
    if (l.quiz) html += renderQuiz(l, id);

    const isDone = state.done.has(id);
    const gated = !!l.quiz && !quizPassed(id) && !state.done.has(id);
    html += '<div class="done-row">' +
      '<button class="done-btn" data-done-btn aria-pressed="' + isDone + '"' +
      (gated ? ' disabled title="Pass the lesson check to unlock"' : '') + '>' +
      (isDone ? '✓ Completed' : gated ? 'Locked until you pass the check' : 'Mark complete') + '</button>' +
      '<span class="of" style="font-family:var(--ff-mono);font-size:.7rem;color:var(--muted)">' +
      '<span class="kbd">←</span> <span class="kbd">→</span> move between lessons</span></div>';
  } else {
    html += '<div class="planned-note"><span class="tag">Not written yet — planned</span>' +
      '<p>' + inline(l.plan || 'This lesson is mapped into the sequence but the full text is not written yet.') + '</p>' +
      (l.covers ? '<ul>' + l.covers.map(c => '<li>' + inline(c) + '</li>').join('') + '</ul>' : '') +
      '<p style="color:var(--muted);font-size:.92rem">Ask me to write this one and it gets the same treatment as the rest: full explanation plus five exercises.</p>' +
      '</div>';
  }

  const prev = i > 0 ? t.lessons[i - 1] : null;
  const next = i < t.lessons.length - 1 ? t.lessons[i + 1] : null;
  html += '<nav class="pager">' +
    '<button data-go="-1"' + (prev ? '' : ' disabled') + '><span class="dir">← Previous</span>' +
    '<span class="ttl">' + (prev ? esc(prev.t) : 'Start of track') + '</span></button>' +
    '<button data-go="1"' + (next ? '' : ' disabled') + '><span class="dir">Next →</span>' +
    '<span class="ttl">' + (next ? esc(next.t) : 'End of track') + '</span></button>' +
    '</nav></article>';

  const view = document.getElementById('view');
  view.innerHTML = html;
  toTop();
  document.querySelectorAll('[data-lab]').forEach(initLab);

  if (opts.animate) {
    const article = view.querySelector('.lesson');
    article.classList.add('anim-in');
    stagger(article, ':scope > *', '--i', 8);
    stagger(article, '.body > *', '--j', 14);
  }
}

/* ── Quiz ────────────────────────────────────────────────── */
const LETTERS = ['A', 'B', 'C', 'D', 'E'];

function renderQuiz(l, id) {
  const qs = l.quiz;
  const answers = state.answers[id] || [];
  const answered = qs.filter((_, n) => answers[n] != null).length;
  const correct = qs.reduce((n, q, k) => n + (answers[k] === q.correct ? 1 : 0), 0);
  const finished = answered === qs.length;
  const passed = finished && correct / qs.length >= PASS_MARK;

  let h = '<section class="quiz"><div class="quiz-head"><h3>Review questions</h3>' +
    '<span class="of">' + qs.length + ' questions · the same set the lesson asks · ' +
    Math.round(PASS_MARK * 100) + '% to pass</span></div>';

  qs.forEach((q, n) => {
    const chosen = answers[n];
    const isAnswered = chosen != null;
    h += '<div class="q-item" data-q="' + n + '">' +
      '<div class="q-text"><span class="idx">' + String(n + 1).padStart(2, '0') + '</span>' +
      '<span>' + inline(q.q) + '</span></div><div class="q-opts">';

    q.opts.forEach((opt, o) => {
      let stateAttr = '';
      let verdict = '';
      if (isAnswered) {
        if (o === q.correct) { stateAttr = 'correct'; verdict = '✓'; }
        else if (o === chosen) { stateAttr = 'wrong'; verdict = '✕'; }
        else stateAttr = 'muted';
      }
      h += '<button class="opt" data-opt="' + n + ':' + o + '"' +
        (isAnswered ? ' disabled' : '') +
        (stateAttr ? ' data-state="' + stateAttr + '"' : '') + '>' +
        '<span class="mark">' + LETTERS[o] + '</span>' +
        '<span>' + inline(opt) + '</span>' +
        '<span class="verdict">' + verdict + '</span></button>';
    });

    h += '</div><div class="q-why"' + (isAnswered ? '' : ' hidden') + '>' +
      (isAnswered ? (chosen === q.correct ? '<strong>Correct.</strong> ' : '<strong>Not quite.</strong> ') + inline(q.why) : '') +
      '</div></div>';
  });

  const pct = qs.length ? correct / qs.length * 100 : 0;
  h += '<div class="quiz-foot">' +
    '<span class="score"><span class="bar' + (finished && !passed ? ' fail' : '') + '">' +
    '<i style="width:' + pct.toFixed(0) + '%"></i></span>' +
    '<strong>' + correct + ' / ' + qs.length + '</strong>' +
    '<span>' + (finished ? 'final' : answered + ' answered') + '</span></span>';

  if (finished) {
    h += '<p class="verdict-line ' + (passed ? 'pass' : 'fail') + '">' +
      (passed
        ? (correct === qs.length ? 'Perfect score — lesson unlocked.' : 'Passed — lesson unlocked.')
        : 'Below ' + Math.round(PASS_MARK * 100) + '%. Read the explanations, then retake.') +
      '</p><button class="pill" data-retake>Retake</button>';
  }
  h += '</div></section>';
  return h;
}

/* Patch one question in place — no full re-render, so nothing else replays. */
function patchQuestion(n, chosen, q) {
  const item = document.querySelector('.q-item[data-q="' + n + '"]');
  if (!item) return;
  const opts = item.querySelectorAll('.opt');
  opts.forEach((btn, idx) => {
    btn.disabled = true;
    const verdict = btn.querySelector('.verdict');
    if (idx === q.correct) { btn.dataset.state = 'correct'; verdict.textContent = '✓'; }
    else if (idx === chosen) { btn.dataset.state = 'wrong'; verdict.textContent = '✕'; }
    else btn.dataset.state = 'muted';
  });
  const picked = opts[chosen];
  if (picked && motionOK()) {
    picked.classList.add('just-answered');
    setTimeout(() => picked.classList.remove('just-answered'), 500);
  }
  const why = item.querySelector('.q-why');
  why.innerHTML = (chosen === q.correct ? '<strong>Correct.</strong> ' : '<strong>Not quite.</strong> ') + inline(q.why);
  why.hidden = false;
  if (motionOK()) {
    why.classList.add('opening');
    setTimeout(() => why.classList.remove('opening'), 360);
  }
}

function patchQuizFooter(l, id) {
  const sec = document.querySelector('.quiz');
  if (!sec) return;
  const foot = sec.querySelector('.quiz-foot');
  const answers = state.answers[id] || [];
  const answered = answers.filter(v => v != null).length;
  const correct = l.quiz.reduce((acc, q, k) => acc + (answers[k] === q.correct ? 1 : 0), 0);
  const finished = answered === l.quiz.length;
  const passed = finished && correct / l.quiz.length >= PASS_MARK;
  const pct = correct / l.quiz.length * 100;

  let h = '<span class="score"><span class="bar' + (finished && !passed ? ' fail' : '') + '">' +
    '<i style="width:' + pct.toFixed(0) + '%"></i></span>' +
    '<strong>' + correct + ' / ' + l.quiz.length + '</strong>' +
    '<span>' + (finished ? 'final' : answered + ' answered') + '</span></span>';
  if (finished) {
    h += '<p class="verdict-line ' + (passed ? 'pass' : 'fail') + '">' +
      (passed
        ? (correct === l.quiz.length ? 'Perfect score — lesson unlocked.' : 'Passed — lesson unlocked.')
        : 'Below ' + Math.round(PASS_MARK * 100) + '%. Read the explanations, then retake.') +
      '</p><button class="pill" data-retake>Retake</button>';
  }
  foot.innerHTML = h;
}

function patchDoneRow(l, id) {
  const btn = document.querySelector('[data-done-btn]');
  if (!btn) return;
  const isDone = state.done.has(id);
  const gated = !!l.quiz && !quizPassed(id) && !state.done.has(id);
  btn.disabled = gated;
  btn.setAttribute('aria-pressed', String(isDone));
  btn.textContent = isDone ? '✓ Completed' : gated ? 'Locked until you pass the check' : 'Mark complete';
  if (gated) btn.title = 'Pass the lesson check to unlock';
  else btn.removeAttribute('title');
}

function answerQuestion(n, o) {
  const i = state.lesson;
  const l = COURSE[state.track].lessons[i];
  const id = uid(state.track, i);
  if (!l.quiz) return;

  const answers = state.answers[id] ? state.answers[id].slice() : new Array(l.quiz.length).fill(null);
  if (answers[n] != null) return;                       // already answered
  answers[n] = o;
  state.answers[id] = answers;

  const answered = answers.filter(v => v != null).length;
  const correct = l.quiz.reduce((acc, q, k) => acc + (answers[k] === q.correct ? 1 : 0), 0);
  state.scores[id] = { correct, total: l.quiz.length };

  const levelBefore = levelFor(state.xp).index;
  const gained = [];
  let justPassed = false, perfect = false;

  if (answered === l.quiz.length) {
    touchStreak();
    if (correct / l.quiz.length >= PASS_MARK) {
      const a = award(id, 'quizPass', XP.quizPass);
      if (a) { gained.push(a + ' XP — check passed'); justPassed = true; }
      if (correct === l.quiz.length) {
        const b = award(id, 'quizPerfect', XP.quizPerfect);
        if (b) { gained.push(b + ' XP — perfect score'); perfect = true; }
      }
    }
  }

  const fresh = checkBadges();
  fresh.forEach(a => freshBadges.add(a.id));
  save();

  patchQuestion(n, o, l.quiz[n]);
  patchQuizFooter(l, id);
  patchDoneRow(l, id);
  renderChrome();

  gained.forEach(g => toast('⭑', 'Earned', g));
  if (justPassed) celebrate(perfect ? 'big' : 'small');
  const levelAfter = levelFor(state.xp).index;
  if (levelAfter > levelBefore) levelUp(levelAfter);
  fresh.forEach(a => toast(a.icon, 'Achievement unlocked', a.name));
}

function retakeQuiz() {
  const id = uid(state.track, state.lesson);
  const l = COURSE[state.track].lessons[state.lesson];
  delete state.answers[id];
  delete state.scores[id];
  save();

  const sec = document.querySelector('.quiz');
  if (sec) {
    sec.outerHTML = renderQuiz(l, id);
    const fresh = document.querySelector('.quiz');
    if (fresh && motionOK()) {
      fresh.classList.add('anim-in');
      stagger(fresh, ':scope > *', '--i', 8);
    }
    patchDoneRow(l, id);
    renderChrome();
  } else {
    render();
  }
}

/* ═══════════════════════════════════════════════════════════
   MOTION
   ═══════════════════════════════════════════════════════════ */
/* Guarded: some embedded webviews expose neither matchMedia nor scrollTo. */
const motionOK = () => {
  try { return !window.matchMedia('(prefers-reduced-motion: reduce)').matches; }
  catch (e) { return false; }
};
function toTop() {
  try { window.scrollTo(0, 0); } catch (e) { /* host has no scrollTo */ }
}

/* Give each child an index so CSS can stagger its entrance. */
function stagger(root, selector, varName, cap) {
  if (!root || !motionOK()) return;
  const kids = root.querySelectorAll(selector);
  for (let i = 0; i < kids.length; i++) {
    kids[i].style.setProperty(varName, String(Math.min(i, cap)));
  }
}

/* Count a number up to its value. Falls back to the final value instantly. */
function countUp(el, to, ms) {
  if (!el) return;
  if (!motionOK() || to <= 0) { el.textContent = String(to); return; }
  const dur = ms || 700;
  const start = performance.now();
  function step(now) {
    const t = Math.min(1, (now - start) / dur);
    const eased = 1 - Math.pow(1 - t, 3);
    el.textContent = String(Math.round(to * eased));
    if (t < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

/* Rings and bars render at zero, then transition to their real value. */
function playMeters(root) {
  if (!root) return;
  const rings = root.querySelectorAll('.ring .fg');
  const bars = root.querySelectorAll('.xp-track > i, .stat-bar > i');
  if (!motionOK()) {
    rings.forEach(c => c.setAttribute('stroke-dashoffset', c.dataset.target));
    bars.forEach(b => b.style.width = b.dataset.target);
    return;
  }
  requestAnimationFrame(() => requestAnimationFrame(() => {
    rings.forEach(c => c.setAttribute('stroke-dashoffset', c.dataset.target));
    bars.forEach(b => b.style.width = b.dataset.target);
  }));
}

/* Confetti — canvas particles, self-cleaning. */
let confettiRaf = 0;
function celebrate(size) {
  if (!motionOK()) return;
  const cv = document.getElementById('confetti');
  if (!cv || !cv.getContext) return;
  const ctx = cv.getContext('2d');
  const W = window.innerWidth, H = window.innerHeight;
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  cv.width = W * dpr; cv.height = H * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const colors = ['#0E7C70', '#45C4B2', '#2F4E93', '#8FA9E2', '#A96A22', '#E0A868'];
  const n = size === 'big' ? 140 : 72;
  const parts = [];
  for (let i = 0; i < n; i++) {
    parts.push({
      x: W / 2 + (Math.random() - 0.5) * W * 0.45,
      y: H * 0.34 + (Math.random() - 0.5) * 70,
      vx: (Math.random() - 0.5) * 7.5,
      vy: -5.5 - Math.random() * 7,
      g: 0.20 + Math.random() * 0.13,
      w: 5 + Math.random() * 6,
      h: 3 + Math.random() * 5,
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.32,
      c: colors[(Math.random() * colors.length) | 0],
      life: 0,
      max: 82 + Math.random() * 55
    });
  }

  cancelAnimationFrame(confettiRaf);
  function frame() {
    ctx.clearRect(0, 0, W, H);
    let alive = 0;
    for (const p of parts) {
      if (p.life > p.max) continue;
      alive++;
      p.life++;
      p.vy += p.g; p.vx *= 0.995;
      p.x += p.vx; p.y += p.vy; p.rot += p.vr;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.globalAlpha = Math.max(0, 1 - p.life / p.max);
      ctx.fillStyle = p.c;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    }
    if (alive) confettiRaf = requestAnimationFrame(frame);
    else ctx.clearRect(0, 0, W, H);
  }
  confettiRaf = requestAnimationFrame(frame);
}

/* ── Toasts ──────────────────────────────────────────────── */
function toast(icon, kicker, text, hold) {
  const box = document.getElementById('toasts');
  if (!box) return;
  const el = document.createElement('div');
  el.className = 'toast';
  el.innerHTML = '<span class="icon">' + icon + '</span><span class="tt">' +
    '<span class="tk">' + esc(kicker) + '</span><span class="tn">' + esc(text) + '</span></span>';
  box.appendChild(el);
  setTimeout(() => {
    el.classList.add('leaving');
    setTimeout(() => el.remove(), 320);
  }, hold || 3200);
}

function levelUp(level) {
  const name = LEVELS[Math.min(level, LEVELS.length) - 1].name;
  toast('🏆', 'Level ' + level + ' reached', name, 5000);
  celebrate('big');
}

/* ═══════════════════════════════════════════════════════════
   LESSON PATH — one node per lesson, unlocked in order
   ═══════════════════════════════════════════════════════════ */
function lessonState(track, i) {
  const l = COURSE[track].lessons[i];
  const id = uid(track, i);
  if (!l.blocks) return 'planned';
  if (state.placed.has(id) && state.done.has(id)) return 'known';
  if (state.done.has(id)) return 'done';
  const ls = COURSE[track].lessons;
  for (let k = 0; k < i; k++) {
    if (ls[k].blocks && !state.done.has(uid(track, k))) return 'locked';
  }
  return 'current';
}

/* Gentle zigzag, like a trail on a map. */
const PATH_OFFSETS = [0, 5, 9, 5, 0, -5, -9, -5];

function renderPath(opts) {
  opts = opts || {};
  const t = COURSE[state.track];
  const hue = t.side === 'server' ? 'var(--server)' : 'var(--client)';
  const wash = t.side === 'server' ? 'var(--server-wash)' : 'var(--client-wash)';
  const w = trackWritten(state.track), d = trackDone(state.track);

  const crumbs = document.getElementById('crumbs');
  crumbs.style.setProperty('--hue', hue);
  crumbs.innerHTML = '<span class="dot"></span><span>' + esc(t.name) + '</span><span>/</span>' +
    '<span class="side">' + (t.side === 'server' ? 'server side' : 'browser side') + '</span>';

  let h = '<div class="path" style="--hue:' + hue + ';--hue-wash:' + wash + '">' +
    '<header class="path-head">' +
    '<span class="eyebrow" style="font-family:var(--ff-mono);font-size:.68rem;letter-spacing:.14em;text-transform:uppercase">' +
    esc(t.name) + ' · ' + d + ' of ' + w + ' complete</span>' +
    '<h2>' + esc(t.name) + ' path</h2></header><div class="path-list">';

  t.lessons.forEach((l, i) => {
    const st = lessonState(state.track, i);
    const id = uid(state.track, i);
    const place = placementOf(id);
    const face = st === 'done' ? '✓' : st === 'known' ? '✓' : st === 'locked' ? '🔒'
      : st === 'planned' ? '·' : String(i + 1).padStart(2, '0');
    const x = PATH_OFFSETS[i % PATH_OFFSETS.length];
    const tag = st === 'current' ? ' · start here'
      : st === 'known' ? ' · already in your code'
      : st === 'planned' ? ' · not written yet'
      : (place && place.level === 'review' && st !== 'locked') ? ' · probably familiar' : '';
    h += '<div class="node-row" data-state="' + st + '" style="--x:' + x + '">' +
      '<button class="node" data-state="' + st + '" data-node="' + i + '"' +
      (st === 'locked' || st === 'planned' ? ' disabled' : '') +
      ' aria-label="' + esc(l.t) + '">' + face + '</button>' +
      '<span class="node-meta"><span class="n">Lesson ' + String(i + 1).padStart(2, '0') + tag + '</span>' +
      '<span class="t">' + esc(l.t) + '</span>' +
      (place && st !== 'locked'
        ? '<span class="s why-placed">' + esc(place.why) + '</span>'
        : (l.sub ? '<span class="s">' + esc(l.sub) + '</span>' : '')) + '</span>' +
      (l.blocks ? '<button class="node-notes" data-notes="' + i + '">Notes</button>' : '') +
      '</div>';
  });

  h += '</div></div>';
  const view = document.getElementById('view');
  view.innerHTML = h;
  toTop();

  if (opts.animate) {
    const list = view.querySelector('.path-list');
    list.classList.add('anim-in');
    stagger(list, ':scope > *', '--i', 14);
  }

  /* Returning from a finished lesson: pop the node that just turned green. */
  if (justFinished != null && motionOK()) {
    const node = view.querySelector('.node[data-node="' + justFinished + '"]');
    if (node) {
      node.classList.add('just-done');
      setTimeout(() => node.classList.remove('just-done'), 700);
    }
    justFinished = null;
  }
}

/* ═══════════════════════════════════════════════════════════
   SESSION — one step at a time, three hearts
   ═══════════════════════════════════════════════════════════ */
let session = null;
let justFinished = null;        /* lesson index to pop when the path reappears */
const HEARTS = 3;

/* Split lesson prose into small teaching cards, breaking at subheadings. */
function chunkBlocks(blocks) {
  const chunks = [];
  let cur = [];
  (blocks || []).forEach(b => {
    if ((b[0] === 'h' && cur.length) || cur.length >= 3) { chunks.push(cur); cur = []; }
    cur.push(b);
  });
  if (cur.length) chunks.push(cur);
  return chunks;
}

function buildSession(track, idx) {
  const l = COURSE[track].lessons[idx];
  const teach = chunkBlocks(l.blocks).map(b => ({ kind: 'teach', blocks: b }));
  const mcq = (l.quiz || []).map(q => ({ kind: 'mcq', q }));
  const fill = (l.fill || []).map(f => ({ kind: 'fill', f }));

  /* Alternate the two question types so a session never feels repetitive. */
  const qs = [];
  for (let a = 0, b = 0; a < mcq.length || b < fill.length;) {
    if (a < mcq.length) qs.push(mcq[a++]);
    if (b < fill.length) qs.push(fill[b++]);
  }

  const steps = [];
  let ti = 0;
  for (let k = 0; k < 2 && ti < teach.length; k++) steps.push(teach[ti++]);
  for (let qi = 0; qi < qs.length; qi++) {
    steps.push(qs[qi]);
    if (ti < teach.length && qi < qs.length - 1) steps.push(teach[ti++]);
  }
  /* Any teaching left over goes in just before the final question. */
  while (ti < teach.length) steps.splice(Math.max(0, steps.length - 1), 0, teach[ti++]);
  return steps;
}

function startSession(track, idx) {
  session = {
    track, idx,
    steps: buildSession(track, idx),
    at: 0, hearts: HEARTS, right: 0, wrong: 0,
    picked: null, checked: false, lastRight: false,
    gained: 0, status: 'run'
  };
  state.view = 'session';
  state.track = track;
  state.lesson = idx;
  save();
  document.querySelector('.app').dataset.mode = 'session';
  renderSession();
}

function leaveSession(toHome) {
  session = null;
  document.querySelector('.app').removeAttribute('data-mode');
  if (toHome) goHome();
  else { state.view = 'path'; save(); render({ animate: true }); }
}

function sessionStepBody(st) {
  if (st.kind === 'teach') {
    return '<div class="s-step s-teach"><span class="s-kicker">Concept</span>' +
      '<div class="body">' + st.blocks.map(renderBlock).join('') + '</div></div>';
  }
  if (st.kind === 'mcq') {
    let h = '<div class="s-step"><span class="s-kicker">Question</span>' +
      '<h2 class="s-prompt">' + inline(st.q.q) + '</h2><div class="choices">';
    st.q.opts.forEach((o, i) => {
      const picked = session.picked === i;
      let result = '';
      if (session.checked) {
        if (i === st.q.correct) result = ' data-result="right"';
        else if (picked) result = ' data-result="wrong"';
      }
      h += '<button class="choice' + (session.checked && result ? ' just-answered' : '') +
        '" data-choice="' + i + '"' +
        (picked ? ' data-picked="1"' : '') + result +
        (session.checked ? ' disabled' : '') + '>' +
        '<span class="k">' + LETTERS[i] + '</span><span>' + inline(o) + '</span></button>';
    });
    return h + '</div></div>';
  }
  /* fill */
  const f = st.f;
  const filled = session.picked != null;
  let slotResult = '';
  if (session.checked) slotResult = session.picked === f.correct ? ' data-result="right"' : ' data-result="wrong"';
  const shown = filled ? esc(f.opts[session.picked]) : '&nbsp;';
  const parts = f.code.split('___');
  const codeHtml = highlight(f.lang, parts[0]) +
    '<span class="slot" data-filled="' + (filled ? 1 : 0) + '"' + slotResult + '>' + shown + '</span>' +
    highlight(f.lang, parts.slice(1).join('___'));

  let h = '<div class="s-step"><span class="s-kicker">Fill the blank</span>' +
    '<h2 class="s-prompt">' + inline(f.prompt) + '</h2>' +
    '<div class="s-code">' + codeHtml + '</div><div class="tokens">';
  f.opts.forEach((o, i) => {
    h += '<button class="token" data-choice="' + i + '"' +
      (session.picked === i ? ' data-picked="1"' : '') +
      (session.checked ? ' disabled' : '') + '>' + esc(o) + '</button>';
  });
  return h + '</div></div>';
}

function sessionFooter(st) {
  if (st.kind === 'teach') {
    return '<div class="s-foot"><div class="s-foot-inner">' +
      '<div class="s-verdict"><span class="vw">Take it in, then carry on.</span></div>' +
      '<button class="s-btn" data-continue>Got it</button></div></div>';
  }
  if (!session.checked) {
    return '<div class="s-foot"><div class="s-foot-inner">' +
      '<div class="s-verdict"><span class="vw">' +
      (session.picked == null ? 'Pick an answer.' : 'Ready when you are.') + '</span></div>' +
      '<button class="s-btn" data-check' + (session.picked == null ? ' disabled' : '') + '>Check</button></div></div>';
  }
  const right = session.lastRight;
  const why = st.kind === 'mcq' ? st.q.why : st.f.why;
  const answer = st.kind === 'mcq' ? st.q.opts[st.q.correct] : st.f.opts[st.f.correct];
  const outOfHearts = !right && session.hearts <= 0;
  return '<div class="s-foot" data-verdict="' + (right ? 'right' : 'wrong') + '"><div class="s-foot-inner">' +
    '<div class="s-verdict"><span class="vt">' +
    (right ? '✓ Correct' : '✕ Not quite — the answer is ' + esc(answer)) + '</span>' +
    '<span class="vw">' + inline(why) + '</span></div>' +
    '<button class="s-btn' + (right ? '' : ' danger') + '" data-continue>' +
    (outOfHearts ? 'See results' : 'Continue') + '</button></div></div>';
}

function renderSession(opts) {
  opts = opts || {};
  const view = document.getElementById('view');
  const t = COURSE[session.track];
  const l = t.lessons[session.idx];
  const hue = t.side === 'server' ? 'var(--server)' : 'var(--client)';

  if (session.status === 'done' || session.status === 'failed') {
    const won = session.status === 'done';
    const total = session.right + session.wrong;
    const acc = total ? Math.round(session.right / total * 100) : 100;
    let h = '<div class="session" style="--hue:' + hue + '"><div class="s-end">' +
      '<span class="big">' + (won ? (session.wrong === 0 ? '🏆' : '🎉') : '💔') + '</span>' +
      '<h2>' + (won ? (session.wrong === 0 ? 'Flawless lesson' : 'Lesson complete') : 'Out of hearts') + '</h2>' +
      '<p>' + (won
        ? esc(l.t) + ' is done. It is ticked off on the path.'
        : 'Three wrong answers ends the session. Nothing is lost — run it again.') + '</p>';
    if (won) {
      h += '<div class="s-tally">' +
        '<div class="tally xp"><span class="tv">+<b data-count="' + session.gained + '">0</b></span><span class="tk">XP</span></div>' +
        '<div class="tally"><span class="tv"><b data-count="' + acc + '">0</b>%</span><span class="tk">accuracy</span></div>' +
        '<div class="tally"><span class="tv"><b data-count="' + (state.streak.days || 0) + '">0</b></span><span class="tk">day streak</span></div>' +
        '</div>';
    }
    h += '</div><div class="s-foot"><div class="s-foot-inner">' +
      '<div class="s-verdict"><span class="vw">' +
      (won ? 'Next lesson is unlocked on the path.' : 'Hearts reset every attempt.') + '</span></div>' +
      (won ? '' : '<button class="s-btn" data-retry>Try again</button>') +
      '<button class="s-btn" data-back-to-path>Back to path</button>' +
      '</div></div></div>';
    view.innerHTML = h;
    toTop();
    /* The tallies pop in staggered, so start each counter as its card lands. */
    view.querySelectorAll('.s-tally [data-count]').forEach((el, i) => {
      const to = +el.dataset.count;
      if (!motionOK()) { el.textContent = String(to); return; }
      setTimeout(() => countUp(el, to, 620), 420 + i * 110);
    });
    return;
  }

  const st = session.steps[session.at];
  const pct = session.at / session.steps.length * 100;
  const advanced = pct > (session.shownPct || 0);
  session.shownPct = pct;

  let hearts = '';
  for (let i = 0; i < HEARTS; i++) {
    hearts += '<span class="heart' + (opts.broke && i === session.hearts ? ' breaking' : '') +
      '" data-spent="' + (i < session.hearts ? 0 : 1) + '">♥</span>';
  }
  if (opts.broke && motionOK()) hearts += '<span class="heart-lost">-1</span>';

  view.innerHTML = '<div class="session" style="--hue:' + hue + '">' +
    '<div class="s-top">' +
    '<button class="s-quit" data-quit aria-label="Leave lesson">✕</button>' +
    '<span class="s-bar"' + (advanced && motionOK() ? ' data-advanced="1"' : '') +
    '><i style="width:' + pct.toFixed(1) + '%"></i></span>' +
    '<span class="hearts" title="' + session.hearts + ' of ' + HEARTS + ' hearts left">' + hearts + '</span>' +
    '</div><div class="s-stage">' + sessionStepBody(st) + '</div>' +
    sessionFooter(st) + '</div>';

  document.querySelectorAll('[data-lab]').forEach(initLab);
}

/* A number that rises out of the middle of the screen and fades. */
function popXp(amount) {
  if (!motionOK() || !amount) return;
  const el = document.createElement('div');
  el.className = 'xp-pop';
  el.textContent = '+' + amount + ' XP';
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1200);
}

function pickChoice(i) {
  if (!session || session.checked) return;
  const st = session.steps[session.at];
  if (!st || st.kind === 'teach') return;
  session.picked = i;
  const stage = document.querySelector('.s-stage');
  if (!stage) return;
  stage.querySelectorAll('.choice, .token').forEach((el, k) => {
    if (k === i) el.dataset.picked = '1'; else delete el.dataset.picked;
  });
  if (st.kind === 'fill') {
    const slot = stage.querySelector('.slot');
    if (slot) {
      slot.textContent = st.f.opts[i];
      slot.dataset.filled = '1';
    }
  }
  const btn = document.querySelector('[data-check]');
  if (btn) btn.disabled = false;
  const chosen = stage.querySelectorAll('.choice, .token')[i];
  if (chosen && motionOK()) {
    chosen.classList.add('pick-pop');
    setTimeout(() => chosen.classList.remove('pick-pop'), 300);
  }
}

function checkStep() {
  if (!session || session.checked) return;
  const st = session.steps[session.at];
  const correct = st.kind === 'mcq' ? st.q.correct : st.f.correct;
  const right = session.picked === correct;
  session.checked = true;
  session.lastRight = right;
  if (right) session.right++;
  else { session.wrong++; session.hearts--; }
  renderSession({ broke: !right });
}

function advanceStep() {
  if (!session) return;
  if (session.checked && !session.lastRight && session.hearts <= 0) {
    session.status = 'failed';
    renderSession();
    return;
  }
  session.at++;
  session.picked = null;
  session.checked = false;
  if (session.at >= session.steps.length) finishSession();
  else renderSession();
}

function finishSession() {
  const id = uid(session.track, session.idx);
  const total = session.right + session.wrong;
  const levelBefore = levelFor(state.xp).index;

  state.done.add(id);
  state.scores[id] = { correct: session.right, total: total || 1 };
  justFinished = session.idx;
  touchStreak();

  let gained = 0;
  gained += award(id, 'lesson', XP.lesson);
  gained += award(id, 'quizPass', XP.quizPass);
  if (session.wrong === 0) gained += award(id, 'quizPerfect', XP.quizPerfect);
  session.gained = gained;

  const fresh = checkBadges();
  fresh.forEach(a => freshBadges.add(a.id));
  save();

  session.status = 'done';
  renderSession();
  popXp(gained);
  celebrate(session.wrong === 0 ? 'big' : 'small');
  const levelAfter = levelFor(state.xp).index;
  if (levelAfter > levelBefore) levelUp(levelAfter);
  fresh.forEach(a => toast(a.icon, 'Achievement unlocked', a.name));
}

/* ═══════════════════════════════════════════════════════════
   PLAYGROUND
   Files persist in their own storage key, so clearing course
   progress never destroys code you wrote.
   ═══════════════════════════════════════════════════════════ */
const FILES_KEY = 'mastery.files.v1';
const LANG_OF = { py: 'python', js: 'js', css: 'css', html: 'html' };

const SEED_FILES = [
  { name: 'main.py', content:
'# Python runs on a server, not in the browser.\n' +
'# Start course_server.py and this button will really execute.\n\n' +
'import os\n\n' +
'BASE_DIR = os.path.dirname(os.path.abspath(__file__))\n' +
'print("running from:", BASE_DIR)\n\n' +
'for n in range(1, 4):\n' +
'    print(n, n * n)\n' },
  { name: 'app.js', content:
'// This runs for real, right here in the browser.\n' +
'const hobbies = ["gaming", "coding", "reading"];\n\n' +
'for (const [i, h] of hobbies.entries()) {\n' +
'  console.log(`${i + 1}. ${h}`);\n' +
'}\n\n' +
'console.log("total:", hobbies.length);\n' },
  { name: 'styles.css', content:
'body {\n  font-family: system-ui, sans-serif;\n  padding: 1.5rem;\n}\n\n' +
'h1 {\n  color: #0E7C70;\n}\n\n' +
'.card {\n  border: 2px solid #0E7C70;\n  border-radius: 8px;\n  padding: 1rem;\n}\n' },
  { name: 'index.html', content:
'<h1>Hello from the playground</h1>\n' +
'<div class="card">\n' +
'  <p>Edit index.html, styles.css and app.js, then press Run.</p>\n' +
'</div>\n' }
];

let files = [];
let activeFile = 0;
let labPane = 'split';          /* 'split' | 'editor' | 'output' */
let labZen = false;             /* code editor alone, filling the screen */
let saveTimer = 0;
let pyRunner = { checked: false, up: false };

const extOf = n => (n.split('.').pop() || '').toLowerCase();
const langOf = n => LANG_OF[extOf(n)] || 'text';

function loadFiles() {
  try {
    const raw = JSON.parse(localStorage.getItem(FILES_KEY) || 'null');
    if (raw && Array.isArray(raw.files) && raw.files.length) {
      files = raw.files;
      activeFile = Math.min(raw.active || 0, files.length - 1);
      if (raw.pane === 'editor' || raw.pane === 'output' || raw.pane === 'split') labPane = raw.pane;
      return;
    }
  } catch (e) { /* corrupt or unavailable */ }
  files = SEED_FILES.map(f => ({ name: f.name, content: f.content }));
  activeFile = 0;
}

function saveFiles(flash) {
  try { localStorage.setItem(FILES_KEY, JSON.stringify({ files, active: activeFile, pane: labPane })); }
  catch (e) { /* storage full or blocked */ }
  if (!flash) return;
  const pill = document.getElementById('saved-pill');
  if (!pill) return;
  pill.dataset.state = 'saved';
  pill.textContent = 'Saved';
  setTimeout(() => { if (pill.dataset.state === 'saved') pill.textContent = 'Saved'; }, 900);
}

function uniqueName(base) {
  let n = base, i = 2;
  while (files.some(f => f.name === n)) {
    const dot = base.lastIndexOf('.');
    n = dot > 0 ? base.slice(0, dot) + '-' + i + base.slice(dot) : base + '-' + i;
    i++;
  }
  return n;
}

/* Is the companion Flask runner listening? Probed once per page load. */
function probePython() {
  if (pyRunner.checked) return Promise.resolve(pyRunner.up);
  pyRunner.checked = true;
  /* Opened straight off disk there is no server to ask, and some hosts have
     no fetch at all — either way, answer "offline" rather than throwing. */
  if (typeof fetch !== 'function' ||
      (window.location && window.location.protocol === 'file:')) {
    pyRunner.up = false;
    return Promise.resolve(false);
  }
  return fetch('/api/run/health', { method: 'GET' })
    .then(r => r.ok ? r.json() : null)
    .then(j => { pyRunner.up = !!(j && j.ok); return pyRunner.up; })
    .catch(() => { pyRunner.up = false; return false; });
}

function renderLab(opts) {
  opts = opts || {};
  const crumbs = document.getElementById('crumbs');
  crumbs.style.setProperty('--hue', 'var(--accent)');
  crumbs.innerHTML = '<span class="dot"></span><span>Playground</span>';

  if (!files.length) loadFiles();
  const f = files[activeFile];
  const lang = langOf(f.name);

  let list = '';
  files.forEach((file, i) => {
    list += '<button class="file-item" data-file="' + i + '" data-lang="' + langOf(file.name) + '"' +
      ' aria-current="' + (i === activeFile ? 'true' : 'false') + '">' +
      '<span class="dot2"></span><span>' + esc(file.name) + '</span>' +
      '<span class="del" data-del="' + i + '" title="Delete file">✕</span></button>';
  });

  const isWeb = lang === 'css' || lang === 'html';
  const outLabel = lang === 'python' ? 'Output' : isWeb ? 'Preview' : 'Console';

  document.getElementById('view').innerHTML =
    '<div class="lab-view" data-zen="' + (labZen ? 1 : 0) + '">' +
      '<aside class="files"><div class="files-top"><span>Files</span>' +
        '<button class="icon-btn" data-new-file title="New file">+</button></div>' +
        '<div class="file-list">' + list + '</div>' +
        '<div style="padding:var(--s3);border-top:1px solid var(--line)">' +
        '<span style="font-family:var(--ff-mono);font-size:.58rem;color:var(--muted);line-height:1.5;display:block">' +
        'Saved in this browser. Course progress and files are stored separately.</span></div>' +
      '</aside>' +
      '<div class="editor-pane" data-pane="' + labPane + '">' +
        '<div class="editor-top">' +
          '<span class="fname">' + esc(f.name) + '</span>' +
          '<span class="saved-pill" id="saved-pill" data-state="saved">Saved</span>' +
          '<span class="spacer"></span>' +
          (lang === 'python'
            ? '<span class="runner-state" id="py-state" data-up="0">checking runner…</span>' : '') +
          '<button class="icon-btn" data-rename title="Rename" style="width:auto;padding:0 8px;font-size:.66rem;font-family:var(--ff-mono)">RENAME</button>' +
          '<button class="fs-btn" data-pane-toggle="editor" aria-pressed="' + (labPane === 'editor') + '">' +
            (labPane === 'editor' ? '<span>⤡</span>Restore split' : '<span>⤢</span>Expand') + '</button>' +
          '<button class="fs-btn" data-fullscreen aria-pressed="false"><span>⛶</span>Full screen</button>' +
          '<button class="run-btn" data-run-file>Run</button>' +
        '</div>' +
        '<textarea class="code-area" id="code-area" spellcheck="false">' + esc(f.content) + '</textarea>' +
        '<div class="out-pane"><div class="out-top"><span>' + outLabel + '</span>' +
          '<span class="spacer"></span>' +
          '<button class="fs-btn" data-pane-toggle="output" aria-pressed="' + (labPane === 'output') + '">' +
            (labPane === 'output' ? '<span>⤡</span>Restore split' : '<span>⤢</span>Expand') + '</button>' +
          '<button class="fs-btn" data-term-fullscreen><span>⛶</span>Full screen</button>' +
          '<button class="icon-btn" data-clear-out title="Clear">✕</button></div>' +
          '<div class="out-body" id="out-body">' +
            (isWeb ? '<iframe id="web-preview" sandbox="allow-scripts" title="Preview"></iframe>'
                   : '<pre><span class="muted">Press Run.</span></pre>') +
          '</div></div>' +
      '</div>' +
    '</div>';

  const area = document.getElementById('code-area');
  const ed = decorateEditor(area, lang, { gutter: true, fill: true });
  area.addEventListener('input', () => {
    files[activeFile].content = area.value;
    const pill = document.getElementById('saved-pill');
    if (pill) { pill.dataset.state = 'saving'; pill.textContent = 'Saving…'; }
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => saveFiles(true), 400);
  });
  area.addEventListener('keydown', e => {
    if (e.key === 'Tab') { e.preventDefault(); insertAtCursor(area, '    '); ed.paint(); }
    if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); saveFiles(true); }
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); runActiveFile(); }
  });

  if (lang === 'python') {
    probePython().then(up => {
      const el = document.getElementById('py-state');
      if (!el) return;
      el.dataset.up = up ? '1' : '0';
      el.textContent = up ? 'python runner online' : 'runner offline';
      el.title = up ? 'course_server.py is serving /api/run'
                    : 'Start course_server.py to execute Python here';
    });
  }
  if (isWeb) runActiveFile();
  syncFsButton();      /* the toolbar was just rebuilt — restore its state */
}

function outPre(html) {
  const body = document.getElementById('out-body');
  if (body) body.innerHTML = '<pre>' + html + '</pre>';
}

function runActiveFile() {
  const f = files[activeFile];
  const lang = langOf(f.name);
  saveFiles(true);

  if (lang === 'js') {
    const body = document.getElementById('out-body');
    body.innerHTML = '<pre></pre>';
    runJs(f.content, body.querySelector('pre'));
    return;
  }

  if (lang === 'css' || lang === 'html') {
    const frame = document.getElementById('web-preview');
    if (!frame) return;
    const html = (files.find(x => langOf(x.name) === 'html') || { content: '' }).content;
    const css = (files.find(x => langOf(x.name) === 'css') || { content: '' }).content;
    const js = (files.find(x => langOf(x.name) === 'js') || { content: '' }).content;
    frame.srcdoc = '<!doctype html><meta charset="utf-8"><style>' + css + '<\/style>' +
      html + '<script>try{' + js + '}catch(e){document.body.insertAdjacentHTML("beforeend",' +
      '"<pre style=\\"color:#b00\\">"+e+"<\/pre>")}<\/script>';
    return;
  }

  if (lang === 'python') {
    outPre('<span class="muted">running…</span>');
    probePython().then(up => {
      if (!up) {
        outPre('<span class="err">No Python runner reachable.</span>\n\n' +
          'A browser cannot execute Python on its own. To run it here, start the\n' +
          'companion server from your project folder:\n\n' +
          '    <b>python course_server.py</b>\n\n' +
          'then open <b>http://127.0.0.1:5055/course</b> and use this page from there.\n' +
          'Everything else — JavaScript, CSS, HTML — runs without it.');
        return;
      }
      fetch('/api/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: f.content })
      })
        .then(r => r.json())
        .then(res => {
          let out = '';
          if (res.stdout) out += esc(res.stdout);
          if (res.stderr) out += '<span class="err">' + esc(res.stderr) + '</span>';
          if (!out) out = '<span class="muted">Ran with no output. Use print() to show something.</span>';
          if (res.timed_out) out += '\n<span class="err">— stopped after the time limit</span>';
          outPre(out);
        })
        .catch(e => outPre('<span class="err">Runner error: ' + esc(e.message) + '</span>'));
    });
    return;
  }

  outPre('<span class="muted">No runner for .' + esc(extOf(f.name)) + ' files. ' +
    'Use .py, .js, .css or .html.</span>');
}

/* ── Full screen ─────────────────────────────────────────── */
function viewEl() { return document.getElementById('view'); }

function isMaxed() {
  const v = viewEl();
  return v.dataset.max === '1' || document.fullscreenElement === v;
}

function syncFsButton() {
  const on = isMaxed();

  const btn = document.querySelector('[data-fullscreen]');
  if (btn) {
    btn.setAttribute('aria-pressed', String(labZen));
    btn.innerHTML = labZen ? '<span>⤡</span>Exit full screen' : '<span>⛶</span>Full screen';
    btn.title = labZen
      ? 'Back to the workspace (Esc)'
      : 'Just the code editor, filling the screen';
  }

  const term = document.querySelector('[data-term-fullscreen]');
  if (term) {
    const termOn = on && labPane === 'output' && !labZen;
    term.setAttribute('aria-pressed', String(termOn));
    term.innerHTML = termOn ? '<span>⤡</span>Exit full screen' : '<span>⛶</span>Full screen';
    term.title = termOn ? 'Leave full screen (Esc)' : 'Fill the screen with just the terminal';
  }
}

/* One click: terminal only, filling the screen. */
function toggleTerminalFullscreen() {
  if (isMaxed()) {
    exitMaxed();
    labZen = false;
    labPane = 'split';
    saveFiles();
    renderLab();
    return;
  }
  labZen = false;
  labPane = 'output';
  saveFiles();
  renderLab();
  enterMaxed();
}

function togglePane(which) {
  labPane = (labPane === which) ? 'split' : which;
  saveFiles();
  renderLab();
}

function exitMaxed() {
  const v = viewEl();
  if (document.fullscreenElement === v && document.exitFullscreen) {
    try { document.exitFullscreen(); } catch (e) { /* already leaving */ }
  }
  delete v.dataset.max;
  syncFsButton();
}

function enterMaxed() {
  const v = viewEl();
  const fallback = () => { v.dataset.max = '1'; syncFsButton(); };
  const req = v.requestFullscreen || v.webkitRequestFullscreen || v.msRequestFullscreen;
  if (typeof req !== 'function') { fallback(); return; }

  let p;
  try { p = req.call(v); } catch (e) { fallback(); return; }

  if (p && typeof p.then === 'function') {
    p.then(syncFsButton).catch(fallback);          /* blocked by the host */
  } else {
    /* Older API with no promise — check whether it actually took. */
    setTimeout(() => (document.fullscreenElement === v ? syncFsButton() : fallback()), 60);
  }
}

/* The editor bar's ⛶ — the code editor alone, filling the screen. */
function toggleZen() {
  if (labZen || isMaxed()) {
    labZen = false;
    labPane = 'split';
    exitMaxed();
    saveFiles();
    renderLab();
    return;
  }
  labZen = true;
  labPane = 'editor';
  saveFiles();
  renderLab();
  enterMaxed();
}

function toggleFullscreen() {
  if (isMaxed()) exitMaxed(); else enterMaxed();
}

/* Pressing Esc leaves native fullscreen without telling us — resync. */
document.addEventListener('fullscreenchange', syncFsButton);

function goLab() {
  session = null;
  state.view = 'lab';
  save();
  render({ animate: true });
}

function render(opts) {
  opts = opts || {};
  const app = document.querySelector('.app');
  if (state.view === 'session' && session) {
    app.dataset.mode = 'session';
    renderSession(opts);
    return;
  }
  app.removeAttribute('data-mode');
  /* Full screen belongs to the playground — leaving it must not strand you
     in a maximised view with no visible way back. */
  if (state.view !== 'lab' && (isMaxed() || labZen)) { exitMaxed(); labZen = false; }
  renderTracks();
  renderSyllabus();
  renderOverall();
  if (state.view === 'home') renderHome(opts);
  else if (state.view === 'path') renderPath(opts);
  else if (state.view === 'lab') renderLab(opts);
  else renderLesson(opts);
}

/* Chrome only — the rail, chips and meters, without rebuilding the view. */
function renderChrome() {
  renderTracks();
  renderSyllabus();
  renderOverall();
}

/* ── Live labs ───────────────────────────────────────────── */
const CSS_DEMO = `<div class="card">
  <h2>Live preview</h2>
  <p class="note">Edit the CSS above, then press Run.</p>
  <button class="cta">A button</button>
</div>`;

function initLab(lab) {
  const kind = lab.dataset.lab;
  const editor = lab.querySelector('[data-editor]');
  const out = lab.querySelector('[data-out]');
  const initial = lab.querySelector('[data-initial]').value;

  function run() {
    if (kind === 'css') {
      out.srcdoc = '<!doctype html><meta charset="utf-8">' +
        '<style>body{font-family:system-ui,sans-serif;margin:12px;color:#14201E;background:#fff}</style>' +
        '<style>' + editor.value + '</style>' + CSS_DEMO;
    } else {
      out.innerHTML = '<span class="muted">running…</span>';
      runJs(editor.value, out);
    }
  }
  const ed = decorateEditor(editor, kind, { gutter: false });
  lab.querySelector('[data-run]').addEventListener('click', run);
  lab.querySelector('[data-reset]').addEventListener('click', () => { ed.setValue(initial); run(); });
  editor.addEventListener('keydown', e => {
    if (e.key === 'Tab') { e.preventDefault(); insertAtCursor(editor, '  '); ed.paint(); }
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); run(); }
  });
  if (kind === 'css') run();
}

/* ── Highlighted editor ──────────────────────────────────────
   Wraps an existing <textarea> in a coloured overlay: a <pre> painted
   underneath, the textarea on top with transparent text. Both layers share
   identical metrics via .ed-layer so the caret lands on the right glyph.  */
function decorateEditor(textarea, lang, opts) {
  opts = opts || {};
  if (textarea.dataset.decorated === '1') return textarea.edApi;

  const wrap = document.createElement('div');
  wrap.className = 'ed';
  wrap.dataset.gutter = opts.gutter ? '1' : '0';
  wrap.dataset.fill = opts.fill ? '1' : '0';

  const gutter = document.createElement('div');
  gutter.className = 'ed-gutter';
  gutter.setAttribute('aria-hidden', 'true');

  const body = document.createElement('div');
  body.className = 'ed-body';

  const pre = document.createElement('pre');
  pre.className = 'ed-hl ed-layer';
  pre.setAttribute('aria-hidden', 'true');
  const code = document.createElement('code');
  pre.appendChild(code);

  textarea.parentNode.insertBefore(wrap, textarea);
  wrap.appendChild(gutter);
  wrap.appendChild(body);
  body.appendChild(pre);
  body.appendChild(textarea);
  textarea.classList.add('ed-input', 'ed-layer');
  textarea.dataset.decorated = '1';

  let currentLang = lang;

  function paint() {
    /* The trailing newline keeps the last line paintable and the two
       layers the same height. */
    code.innerHTML = highlight(currentLang, textarea.value) + '\n';
    if (opts.gutter) {
      const lines = textarea.value.split('\n').length;
      let g = '';
      for (let i = 1; i <= lines; i++) g += i + '\n';
      gutter.textContent = g;
    }
    sync();
  }
  function sync() {
    pre.scrollTop = textarea.scrollTop;
    pre.scrollLeft = textarea.scrollLeft;
    if (opts.gutter) gutter.scrollTop = textarea.scrollTop;
  }

  textarea.addEventListener('input', paint);
  textarea.addEventListener('scroll', sync);
  paint();

  const api = {
    paint,
    setLang(l) { currentLang = l; paint(); },
    setValue(v) { textarea.value = v; paint(); }
  };
  textarea.edApi = api;
  return api;
}

function insertAtCursor(el, text) {
  const s = el.selectionStart, e = el.selectionEnd;
  el.value = el.value.slice(0, s) + text + el.value.slice(e);
  el.selectionStart = el.selectionEnd = s + text.length;
}

/* JS runs inside a sandboxed iframe, not eval — console is piped back by postMessage. */
let jsSeq = 0;
const jsTargets = new Map();
function runJs(src, out) {
  const token = 'run' + (++jsSeq);
  jsTargets.set(token, out);
  const frame = document.createElement('iframe');
  frame.setAttribute('sandbox', 'allow-scripts');
  frame.style.display = 'none';
  const runner = `<!doctype html><meta charset="utf-8"><script>
    var T = ${JSON.stringify(token)};
    function fmt(v){
      if (typeof v === 'string') return v;
      if (v instanceof Error) return v.name + ': ' + v.message;
      try { return JSON.stringify(v, function(k, x){ return typeof x === 'function' ? '[Function]' : x; }, 2); }
      catch (e) { return String(v); }
    }
    function post(kind, args){
      parent.postMessage({ token: T, kind: kind, text: args.map(fmt).join(' ') }, '*');
    }
    ['log','info','warn','error'].forEach(function(m){
      console[m] = function(){ post(m === 'error' ? 'err' : 'log', [].slice.call(arguments)); };
    });
    window.onerror = function(msg){ post('err', [msg]); };
    try { (0, eval)(${JSON.stringify(src)}); post('end', []); }
    catch (e) { post('err', [e]); post('end', []); }
  <\/script>`;
  frame.srcdoc = runner;
  document.body.appendChild(frame);
  setTimeout(() => {
    if (jsTargets.has(token)) {
      if (!out.dataset.got) {
        out.innerHTML = '<span class="err">This preview could not run in the page sandbox. ' +
          'Copy the code and paste it into your browser devtools console (F12) instead.</span>';
      }
      jsTargets.delete(token);
    }
    frame.remove();
  }, 2500);
}

window.addEventListener('message', e => {
  const d = e.data;
  if (!d || !d.token || !jsTargets.has(d.token)) return;
  const out = jsTargets.get(d.token);
  if (!out.dataset.got) { out.innerHTML = ''; out.dataset.got = '1'; }
  if (d.kind === 'end') {
    if (!out.textContent.trim()) out.innerHTML = '<span class="muted">Ran with no output. Use console.log() to print something.</span>';
    jsTargets.delete(d.token);
    delete out.dataset.got;
    return;
  }
  const line = document.createElement('div');
  if (d.kind === 'err') line.className = 'err';
  line.textContent = d.text;
  out.appendChild(line);
});

/* ── Events ──────────────────────────────────────────────── */
function go(track, lesson) {
  state.view = 'lesson';
  state.track = track;
  state.lesson = lesson;
  save();
  render({ animate: true });
}

function goHome(opts) {
  state.view = 'home';
  save();
  render(Object.assign({ animate: true }, opts || {}));
}

/* First unfinished written lesson in a track, else its first lesson. */
function entryPoint(trackId) {
  const ls = COURSE[trackId].lessons;
  for (let i = 0; i < ls.length; i++) {
    if (ls[i].blocks && !state.done.has(uid(trackId, i))) return i;
  }
  return 0;
}

function goPath(track) {
  session = null;
  state.view = 'path';
  state.track = track;
  save();
  render({ animate: true });
}

/* A written, unlocked lesson runs as a session; anything else opens its notes. */
function openLesson(track, i) {
  const st = lessonState(track, i);
  if (st === 'locked' || st === 'planned') {
    session = null;
    state.view = 'notes';
    state.track = track;
    state.lesson = i;
    save();
    render({ animate: true });
  } else {
    startSession(track, i);
  }
}

function openNotes(track, i) {
  session = null;
  state.view = 'notes';
  state.track = track;
  state.lesson = i;
  save();
  render({ animate: true });
}

document.addEventListener('click', e => {
  /* ── Session controls first — they take over the screen ── */
  if (session && state.view === 'session') {
    const choice = e.target.closest('.choice, .token');
    if (choice && !choice.disabled) { pickChoice(+choice.dataset.choice); return; }
    if (e.target.closest('[data-check]')) { checkStep(); return; }
    if (e.target.closest('[data-continue]')) { advanceStep(); return; }
    if (e.target.closest('[data-quit]') || e.target.closest('[data-back-to-path]')) { leaveSession(false); return; }
    if (e.target.closest('[data-retry]')) { startSession(session.track, session.idx); return; }
    return;
  }

  if (e.target.closest('#go-home')) { session = null; goHome(); return; }
  if (e.target.closest('#go-lab')) { goLab(); return; }

  /* ── Playground ── */
  const del = e.target.closest('[data-del]');
  if (del) {
    e.stopPropagation();
    const i = +del.dataset.del;
    if (files.length <= 1) { toast('!', 'Cannot delete', 'Keep at least one file'); return; }
    const name = files[i].name;
    files.splice(i, 1);
    if (activeFile >= files.length) activeFile = files.length - 1;
    saveFiles();
    renderLab();
    toast('🗑', 'Deleted', name);
    return;
  }
  const fileItem = e.target.closest('[data-file]');
  if (fileItem) { activeFile = +fileItem.dataset.file; saveFiles(); renderLab(); return; }
  if (e.target.closest('[data-new-file]')) {
    const raw = window.prompt('New file name (main.py, app.js, styles.css, index.html):', 'scratch.py');
    if (!raw) return;
    const name = uniqueName(raw.trim());
    files.push({ name, content: '' });
    activeFile = files.length - 1;
    saveFiles();
    renderLab();
    return;
  }
  if (e.target.closest('[data-rename]')) {
    const raw = window.prompt('Rename file:', files[activeFile].name);
    if (!raw) return;
    files[activeFile].name = uniqueName(raw.trim());
    saveFiles();
    renderLab();
    return;
  }
  const paneBtn = e.target.closest('[data-pane-toggle]');
  if (paneBtn) { togglePane(paneBtn.dataset.paneToggle); return; }
  if (e.target.closest('[data-term-fullscreen]')) { toggleTerminalFullscreen(); return; }
  if (e.target.closest('[data-fullscreen]')) { toggleZen(); return; }
  if (e.target.closest('[data-run-file]')) { runActiveFile(); return; }
  if (e.target.closest('[data-clear-out]')) {
    const body = document.getElementById('out-body');
    if (body && !body.querySelector('iframe')) body.innerHTML = '<pre><span class="muted">Cleared.</span></pre>';
    return;
  }
  if (e.target.closest('[data-reset-placement]')) { resetPlacement(); return; }

  if (e.target.closest('[data-export]')) { exportProgress(); return; }
  if (e.target.closest('[data-import]')) {
    const picker = document.getElementById('import-file');
    if (!picker) return;
    picker.onchange = () => {
      const file = picker.files && picker.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => importProgress(String(reader.result));
      reader.onerror = () => toast('!', 'Import failed', 'Could not read that file');
      reader.readAsText(file);
    };
    picker.click();
    return;
  }

  const cont = e.target.closest('[data-open-lesson]');
  if (cont) {
    const [t, i] = cont.dataset.openLesson.split(':');
    openLesson(t, +i);
    return;
  }

  const node = e.target.closest('[data-node]');
  if (node && !node.disabled) { openLesson(state.track, +node.dataset.node); return; }

  const notesBtn = e.target.closest('[data-notes]');
  if (notesBtn) { openNotes(state.track, +notesBtn.dataset.notes); return; }

  const openTrack = e.target.closest('[data-open-track]');
  if (openTrack) { goPath(openTrack.dataset.openTrack); return; }

  const opt = e.target.closest('.opt');
  if (opt && !opt.disabled) {
    const [n, o] = opt.dataset.opt.split(':');
    answerQuestion(+n, +o);
    return;
  }

  if (e.target.closest('[data-retake]')) { retakeQuiz(); return; }

  if (e.target.closest('[data-start-session]')) { startSession(state.track, state.lesson); return; }

  const track = e.target.closest('[data-track]');
  if (track) { goPath(track.dataset.track); return; }

  const syl = e.target.closest('.syl-item');
  if (syl) {
    openLesson(state.track, +syl.dataset.i);
    if (window.innerWidth <= 900) setRail(false);
    return;
  }

  const pager = e.target.closest('[data-go]');
  if (pager && !pager.disabled) {
    const n = state.lesson + (+pager.dataset.go);
    if (n >= 0 && n < COURSE[state.track].lessons.length) go(state.track, n);
    return;
  }

  const toggle = e.target.closest('[data-toggle]');
  if (toggle) {
    const panel = toggle.closest('.drill-body').querySelector('[data-panel="' + toggle.dataset.toggle + '"]');
    const open = panel.dataset.open === '1';
    panel.dataset.open = open ? '0' : '1';
    toggle.setAttribute('aria-expanded', String(!open));
    if (toggle.dataset.toggle === 'ans') toggle.textContent = open ? 'Show solution' : 'Hide solution';
    return;
  }

  const doneBtn = e.target.closest('[data-done-btn]');
  if (doneBtn && !doneBtn.disabled) {
    const id = uid(state.track, state.lesson);
    const l = COURSE[state.track].lessons[state.lesson];
    const levelBefore = levelFor(state.xp).index;
    let gained = 0;
    if (state.done.has(id)) {
      state.done.delete(id);                 /* un-marking keeps the XP already earned */
    } else {
      state.done.add(id);
      gained = award(id, 'lesson', XP.lesson);
      touchStreak();
    }
    const fresh = checkBadges();
    fresh.forEach(a => freshBadges.add(a.id));
    save();

    patchDoneRow(l, id);
    renderChrome();

    if (gained) {
      toast('⭑', 'Earned', gained + ' XP — lesson complete');
      celebrate('small');
    }
    const levelAfter = levelFor(state.xp).index;
    if (levelAfter > levelBefore) levelUp(levelAfter);
    fresh.forEach(a => toast(a.icon, 'Achievement unlocked', a.name));
    return;
  }

  const copy = e.target.closest('[data-copy]');
  if (copy) {
    const src = copy.closest('.block').querySelector('[data-src]').value;
    navigator.clipboard.writeText(src).then(
      () => { copy.textContent = 'Copied'; setTimeout(() => copy.textContent = 'Copy', 1400); },
      () => { copy.textContent = 'Press Ctrl+C'; setTimeout(() => copy.textContent = 'Copy', 1800); }
    );
    return;
  }

  const toggleRail = e.target.closest('#rail-toggle');
  if (toggleRail) { setRail(document.getElementById('rail').dataset.open !== '1'); return; }

  if (window.innerWidth <= 900 && !e.target.closest('#rail')) setRail(false);
});

function setRail(open) {
  document.getElementById('rail').dataset.open = open ? '1' : '0';
  document.getElementById('rail-toggle').setAttribute('aria-expanded', String(open));
}

document.getElementById('finder').addEventListener('input', e => {
  state.filter = e.target.value;
  renderSyllabus();
});

document.addEventListener('keydown', e => {
  /* e.target is not always an element — guard before calling matches(). */
  const t = e.target;
  if (t && typeof t.matches === 'function' && t.matches('input, textarea')) return;

  /* In a session: 1-4 picks an answer, Enter checks or continues, Esc leaves. */
  if (session && state.view === 'session') {
    if (e.key === 'Escape') { leaveSession(false); return; }
    if (e.key === 'Enter') {
      e.preventDefault();
      const check = document.querySelector('[data-check]:not(:disabled)');
      const cont = document.querySelector('[data-continue]');
      if (check) checkStep(); else if (cont) advanceStep();
      return;
    }
    if (/^[1-4]$/.test(e.key) && !session.checked) {
      const step = session.steps[session.at];
      if (step && step.kind !== 'teach') {
        const n = +e.key - 1;
        const count = step.kind === 'mcq' ? step.q.opts.length : step.f.opts.length;
        if (n < count) pickChoice(n);
      }
      return;
    }
    return;
  }

  /* In the playground Esc leaves full screen first, and only then the view. */
  if (state.view === 'lab') {
    if (e.key !== 'Escape') return;
    if (labZen || isMaxed()) {
      exitMaxed(); labZen = false; labPane = 'split'; saveFiles(); renderLab();
    } else if (labPane !== 'split') {
      labPane = 'split'; saveFiles(); renderLab();
    } else goHome();
    return;
  }

  if (e.key === 'Escape') { goHome(); return; }
  if (state.view !== 'notes' && state.view !== 'lesson') return;
  if (e.key === 'ArrowRight' && state.lesson < COURSE[state.track].lessons.length - 1) go(state.track, state.lesson + 1);
  if (e.key === 'ArrowLeft' && state.lesson > 0) go(state.track, state.lesson - 1);
});

/* Heartbeat. When this page is served by desktop.py, these pings are how the
   launcher knows the window is still open — it quits when they stop. Served
   any other way (or opened straight off disk) nothing is listening and the
   failures are ignored. */
(function heartbeat() {
  try {
    if (typeof fetch !== 'function') return;
    if (!window.location || window.location.protocol === 'file:') return;
  } catch (e) { return; }

  const ping = () => {
    try { fetch('/api/alive', { method: 'POST', keepalive: true }).catch(() => {}); }
    catch (e) { /* nothing listening */ }
  };
  ping();
  setInterval(ping, 5000);
})();

load();
loadFiles();
checkBadges();          /* backfill badges for progress made before they existed */
save();
render({ animate: true });


/* ── Theme toggle ────────────────────────────────────────── */
const THEME_KEY = 'mastery.theme.v1';
try {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved) document.documentElement.dataset.theme = saved;
} catch (e) { /* private mode */ }

document.getElementById('theme-toggle').addEventListener('click', () => {
  const root = document.documentElement;
  const current = root.dataset.theme ||
    (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  const next = current === 'dark' ? 'light' : 'dark';
  root.dataset.theme = next;
  try { localStorage.setItem(THEME_KEY, next); } catch (e) { /* private mode */ }
});
