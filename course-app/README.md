# Four Tracks to Mastery

A self-paced course across **Flask**, **Python `os`**, **JavaScript** and **CSS**,
built as a local Flask app. Duolingo-style lessons with hearts and XP, a lesson
path per track, and a coding playground that actually runs your code.

The lesson plan is placed against *your* existing code — several lessons start
already ticked off, and each says which of your files it was judged from.

---

## Running it

```powershell
pip install -r requirements.txt
python app.py
```

**Your browser opens by itself** a second or so later, at
<http://127.0.0.1:5055>. Nothing else pops up — this is a web app, so the
"window" is a browser tab. The terminal stays open running the server; press
**Ctrl+C** there to stop it.

In VS Code, press **F5** instead — same thing, with the debugger attached so
breakpoints in `app.py` work.

A few knobs:

| Want | Do |
|---|---|
| Not to open a browser | `$env:NO_BROWSER = "1"` before running |
| A specific port | `$env:COURSE_PORT = "8080"` before running |

If 5055 is busy — usually an older copy still running — it walks up to the next
free port and tells you which one it picked, rather than failing.

---

## Project layout

```
course-app/
  app.py                  Flask app: serves the course, runs Python snippets
  requirements.txt
  templates/
    index.html            the page shell — markup only, ~60 lines
  static/
    css/
      reset.css
      course.css          the whole stylesheet
    js/
      data/               lesson content, split so files stay editable
        00-course.js        the COURSE object
        01-track-flask.js   Flask lessons
        02-track-os.js      os lessons
        03-track-js.js      JavaScript lessons
        04-track-css.js     CSS lessons
        05-quiz.js          multiple-choice questions
        06-fill.js          fill-in-the-blank drills
        07-placement.js     which lessons you already know, and why
        08-attach.js        wires the above onto the lessons
        09-lesson-content.js  lessons written after the first release
      engine.js           rendering, sessions, playground, progress
  tools/
    build_single.py       bundles everything into one shareable HTML file
  .vscode/                F5 to debug, recommended extensions, editor settings
```

**Load order matters.** The data files are plain scripts, not modules, so they
share one global scope and must load in the numbered order — `templates/index.html`
lists them explicitly. If you add a data file, add its `<script>` tag there too.

---

## Editing lessons

Everything about a lesson lives in one object. A written lesson looks like:

```js
{
  t: "Query strings with request.args",
  sub: "One-line summary shown under the title.",
  blocks: [ ... ],   // the teaching content
  ex:     [ ... ],   // 5 written exercises with reveal-able solutions
  quiz:   [ ... ],   // 4 multiple-choice questions
  fill:   [ ... ]    // 3 tap-the-missing-token drills
}
```

A lesson that is only planned has `plan` and `covers` instead of `blocks`, and
renders as an honest "not written yet" placeholder.

### Block types

| Block | Renders |
|---|---|
| `['p', text]` | a paragraph |
| `['h', text]` | a subheading |
| `['ul', [items]]` | a bullet list |
| `['code', lang, source]` | a highlighted, copyable code block |
| `['note', text]` | a "why it matters" aside |
| `['warn', text]` | a "watch out" aside |
| `['tbl', [headers], [rows]]` | a table |
| `['lab', 'css'\|'js', source]` | a live editor that runs |

Inside any text, `` `backticks` `` become inline code and `**stars**` become bold.

### Two sequences that will silently kill the page

Lesson content talks about script tags and HTML comments, so these appear in the
source. Both must stay escaped:

- write `<\/script>` — **never** a literal `</script>`
- write `<\!--` — **never** a literal `<!--` without a matching `-->`

JavaScript reads `\/` as `/` and `\!` as `!`, so the text still displays
correctly. But a browser ends a `<script>` element at the first literal
`</script>` it sees, even inside a string, and an unmatched `<!--` flips the
parser into a state where the real closing tag stops working. Either one turns
the entire page into a syntax error that renders nothing. `tools/build_single.py`
refuses to write a bundle where this has gone wrong.

---

## The playground

Files are saved in your browser's local storage under `mastery.files.v1`,
separately from course progress, so clearing one never destroys the other.

| Language | Runs |
|---|---|
| JavaScript | in a sandboxed iframe, `console.log` piped to the pane |
| CSS / HTML | live preview combining `index.html` + `styles.css` + `app.js` |
| Python | via `POST /api/run` on this server |

Opened as a standalone file (see below) there is no server, so the Python tab
becomes editor-only and says so. Everything else still works.

---

## Sharing it as one file

```powershell
python tools/build_single.py
```

Writes `dist/course.html` — one self-contained file, no server and no internet
needed. Double-click it. Python execution is the only thing that needs the
server, so that tab is idle there.

---

## The `/api/run` endpoint

It executes whatever Python it is sent. That is what a REPL is, and it is only
ever your own code on your own machine — but it means **this server must stay
local**:

- it binds to `127.0.0.1`, so nothing outside this computer can reach it
- snippets run in `scratch/` with an 8-second timeout
- the child runs with `PYTHONUTF8=1`, so Hebrew and other non-ASCII output
  survives instead of arriving as mojibake

Do not add `host="0.0.0.0"` and do not put this on a public server.

---

## Progress and storage

| Key | Holds |
|---|---|
| `mastery.progress.v2` | lessons done, XP, streak, quiz scores, achievements |
| `mastery.files.v1` | your playground files and pane layout |
| `mastery.theme.v1` | light or dark |

All in browser local storage, per browser. Clearing site data resets progress;
the **Clear placement** button on the dashboard just re-locks the lessons that
were pre-ticked from reading your repo.
