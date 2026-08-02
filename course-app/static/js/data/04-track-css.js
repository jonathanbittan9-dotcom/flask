COURSE.css = {
  name: "CSS",
  side: "client",
  lessons: [

/* ── 01 ─────────────────────────────────────────────── */
{
  t: "How CSS reaches the page",
  sub: "Three ways to attach styles, one of which you should actually use — and how it fits a Flask project.",
  blocks: [
    ['p', "HTML says what things **are**. CSS says what they **look like**. Keeping those separate is the reason a single stylesheet can restyle a hundred pages at once."],
    ['h', "The anatomy of a rule"],
    ['code', 'css', `h1 {
  color: #0E7C70;
  font-size: 2rem;
}`],
    ['ul', [
      "`h1` is the **selector** — which elements this applies to.",
      "Everything in `{ }` is the **declaration block**.",
      "`color` is a **property**, `#0E7C70` is its **value**, and the pair is a **declaration**.",
      "The semicolon ends each declaration. The last one may omit it, but do not — adding a line later will break it."
    ]],
    ['h', "Three ways to attach it"],
    ['code', 'html', `<\!-- 1. inline: highest priority, least reusable. Avoid. -->
<h1 style="color: teal">Hello</h1>

<\!-- 2. internal: fine for one-off pages and for learning -->
<style>
  h1 { color: teal; }
</style>

<\!-- 3. external: what you actually want -->
<link rel="stylesheet" href="/static/css/style.css">`],
    ['p', "Use the external stylesheet. One file, cached by the browser after the first load, applied to every page."],
    ['h', "In your Flask project"],
    ['p', "Flask serves anything in a `static/` folder automatically. Build the URL with `url_for` rather than hardcoding it, so the link keeps working if the app is ever mounted under a subpath:"],
    ['code', 'text', `learn/
  hello.py
  static/
    css/
      style.css
  templates/
    home.html`],
    ['code', 'jinja', `<link rel="stylesheet" href="{{ url_for('static', filename='css/style.css') }}">`],
    ['warn', "Changed your CSS and the page looks the same? The browser cached the old file. Hard-reload with **Ctrl+Shift+R**. This wastes more beginner time than any other single thing in CSS."],
    ['h', "Try it"],
    ['p', "Every CSS lesson on this track has a live editor. It styles a small fixed snippet — a `.card` containing an `h2`, a `p.note` and a `button.cta`. Edit, press Run, see the result."],
    ['lab', 'css', `.card {
  padding: 20px;
  border: 2px solid #0E7C70;
  border-radius: 6px;
}

h2 {
  color: #0E7C70;
  margin-top: 0;
}

.note {
  color: #596763;
}`],
    ['h', "Comments"],
    ['code', 'css', `/* This is the only comment syntax CSS has. */
/* There is no // line comment — it silently breaks the rule. */`]
  ],
  ex: [
    { q: "In the live editor, change the border colour to `#A96A22` and the border radius to `24px`. Run it.",
      a: "Both properties live on `.card`. Values update the moment you press Run — no reload, because the preview is re-rendered from your text each time." },
    { q: "Delete the closing `}` of the `h2` rule and run. What happens to the `.note` rule below it?",
      hint: "The parser has no way to know where one rule ends.",
      a: "The `h2` rule swallows what follows, and the `.note` rule stops applying. CSS fails **silently** — no error, just missing styles. A single missing brace can disable everything below it, which is why a syntax-highlighting editor is worth having." },
    { q: "Add `// make it big` as a comment inside the editor and run. Then use the correct syntax.",
      hint: "CSS has exactly one comment form.",
      a: "`//` is not valid CSS. The parser treats the line as a broken declaration and skips forward, which can take a valid declaration down with it. Only `/* ... */` works." },
    { q: "Create `static/css/style.css` in your Flask project and link it from `templates/home.html` using `url_for`. Verify it loads.",
      hint: "The browser devtools Network tab shows a 404 if the path is wrong.",
      a: "Put `<link>` inside `<head>`. Check it worked by adding something unmistakable like `body { background: #EDF0EE; }`. If nothing changes, open devtools → Network and look for `style.css` — a `404` means the file is not where Flask expects, a `200` means the path is fine and your selector is the problem.",
      code: ['jinja', `<head>
  <title>My Flask Home</title>
  <link rel="stylesheet" href="{{ url_for('static', filename='css/style.css') }}">
</head>`] },
    { q: "Why is `url_for('static', filename='css/style.css')` better than writing `/static/css/style.css` directly?",
      a: "Two reasons. It survives the app being mounted under a prefix (`/myapp/static/...`) — a hardcoded path would 404. And it goes through the same route map as everything else, so it stays consistent with how you build every other URL. The habit matters more than this one file: hardcoded URLs are the thing that quietly breaks when a project grows." }
  ]
},

/* ── 02 ─────────────────────────────────────────────── */
{
  t: "Selectors",
  sub: "Choosing exactly which elements a rule applies to.",
  blocks: [
    ['h', "The basics"],
    ['code', 'css', `h2          { }   /* every <h2> — type selector */
.note       { }   /* every element with class="note" */
#header     { }   /* the element with id="header" */
*           { }   /* everything */
h2, .note   { }   /* both — a selector list */`],
    ['p', "**Use classes for nearly everything.** Type selectors are too broad, and IDs are so specific they become impossible to override later."],
    ['h', "Combinators — relationships between elements"],
    ['tbl',
      ["Selector", "Means"],
      [
        ["`.card p`", "Any `p` **anywhere inside** `.card` (descendant)"],
        ["`.card > p`", "A `p` that is a **direct child** of `.card`"],
        ["`h2 + p`", "The `p` **immediately after** an `h2` (adjacent sibling)"],
        ["`h2 ~ p`", "**Every** `p` after an `h2`, same parent (general sibling)"]
      ]
    ],
    ['p', "The space in `.card p` is itself an operator — it means “descendant”. `.card.active` with no space is different: one element carrying **both** classes."],
    ['h', "Attribute selectors"],
    ['code', 'css', `[disabled]              { }   /* has the attribute at all */
[type="submit"]         { }   /* exact value */
[href^="https"]         { }   /* starts with */
[href$=".pdf"]          { }   /* ends with */
[class*="btn"]          { }   /* contains */`],
    ['h', "Pseudo-classes — state"],
    ['code', 'css', `button:hover      { }   /* pointer over it */
button:focus      { }   /* keyboard focus */
input:disabled    { }
li:first-child    { }
li:last-child     { }
li:nth-child(2n)  { }   /* every second one */
p:not(.note)      { }   /* every p that is not .note */`],
    ['warn', "Never remove focus styling with `outline: none` unless you replace it with something equally visible. Keyboard users navigate entirely by the focus ring — deleting it makes a site unusable for them. `:focus-visible` shows the ring for keyboard users while hiding it for mouse clicks."],
    ['h', "Pseudo-elements — parts of an element"],
    ['code', 'css', `.note::before { content: "→ "; }
.note::first-line { font-weight: 600; }`],
    ['p', "One colon for a **state** (`:hover`), two for a generated **part** (`::before`). A `::before` needs a `content` property or it will not render at all."],
    ['lab', 'css', `/* Try changing which elements these target. */
.card > h2 {
  color: #2F4E93;
  border-bottom: 2px solid #DFE5F3;
  padding-bottom: 8px;
}

.card p:not(.hidden) {
  color: #596763;
}

.cta:hover {
  background: #0E7C70;
  color: white;
  cursor: pointer;
}

.note::before {
  content: "→ ";
  color: #A96A22;
}`]
  ],
  ex: [
    { q: "In the live editor, write a rule that targets the button by its class and gives it a rounded border. Then target it by element type instead. Which is better here?",
      hint: "Both work on this snippet. Think about the page having a second button.",
      a: "`.cta { border-radius: 999px; }` and `button { border-radius: 999px; }` look identical in the preview, but the class version styles only the elements you opted in. A `button` rule catches every button on the page, including ones added later that were meant to look different. Prefer the class." },
    { q: "What is the difference between `.card .note`, `.card > .note` and `.card.note`?",
      a: "`.card .note` — a `.note` at any depth inside `.card`. `.card > .note` — a `.note` that is a direct child, one level down. `.card.note` — a single element carrying **both** classes at once. The whitespace is meaningful, which makes an accidental space a real bug." },
    { q: "Add a `:hover` and a `:focus-visible` style to the button. Test both — one with the mouse, one with the Tab key.",
      a: "Styling both matters: `:hover` covers pointer users, `:focus-visible` covers keyboard users. Using `:focus-visible` rather than `:focus` means the ring appears for Tab navigation but not on a mouse click, which is the behaviour people expect.",
      code: ['css', `.cta:hover {
  background: #0E7C70;
  color: white;
}
.cta:focus-visible {
  outline: 2px solid #0E7C70;
  outline-offset: 2px;
}`] },
    { q: "Write a selector for every external link on a page — an `<a>` whose `href` starts with `http`.",
      hint: "Attribute selectors support `^=` for “starts with”.",
      a: "A nice touch: pair it with a `::after` marker so external links are visually distinguishable without any extra HTML.",
      code: ['css', `a[href^="http"]::after {
  content: " ↗";
  font-size: .8em;
}`] },
    { q: "Style every second item in a list, and separately the last item only. Then explain why `:nth-child` counts differently from `:nth-of-type`.",
      hint: "One counts all siblings, the other counts siblings of the same tag.",
      a: "`:nth-child(2n)` looks at the element's position among **all** its siblings, so a stray `<div>` between the `<li>`s shifts the pattern. `:nth-of-type(2n)` counts only siblings with the same tag name, so it is unaffected. When a container holds mixed element types, `-of-type` is usually what you meant.",
      code: ['css', `li:nth-child(2n) { background: #E4E9E6; }
li:last-child   { font-weight: 600; }`] }
  ]
},

/* ── 03 ─────────────────────────────────────────────── */
{
  t: "The cascade and specificity",
  sub: "Why your rule is not applying — the single most common CSS frustration, explained properly.",
  blocks: [
    ['p', "When two rules set the same property on the same element, the browser resolves it in a fixed order. Learn the order and “why isn't my CSS working?” mostly stops happening."],
    ['h', "The resolution order"],
    ['ul', [
      "**Origin** — your stylesheet beats the browser's defaults.",
      "**Specificity** — the more specific selector wins. This is where most conflicts are decided.",
      "**Source order** — if specificity ties, the rule written **last** wins.",
      "`!important` sits above all of it. Treat it as a last resort."
    ]],
    ['h', "Counting specificity"],
    ['p', "Three numbers, compared left to right like version numbers: **(ids, classes, elements)**."],
    ['tbl',
      ["Selector", "Score", "Notes"],
      [
        ["`p`", "0,0,1", "one element"],
        ["`.note`", "0,1,0", "one class — beats any number of elements"],
        ["`.card p`", "0,1,1", ""],
        ["`.card .note`", "0,2,0", "beats `.card p`"],
        ["`#header`", "1,0,0", "one id beats any number of classes"],
        ["`:hover`, `[type=x]`", "counts as a class", ""],
        ["`::before`", "counts as an element", ""],
        ["`*`", "0,0,0", "adds nothing"],
        ["`:not(.x)`", "the argument counts, `:not` itself does not", ""]
      ]
    ],
    ['warn', "It is not decimal. `0,1,0` beats `0,0,15` — eleven element selectors still lose to one class. Left column first, always."],
    ['lab', 'css', `/* Both set the h2 colour. Which wins, and why? */
h2 {
  color: red;          /* 0,0,1 */
}

.card h2 {
  color: #2F4E93;      /* 0,1,1  -> this one */
}

/* Same specificity: last one wins. Swap them and re-run. */
.note { color: #A96A22; }
.note { color: #596763; }`],
    ['h', "Inheritance"],
    ['p', "Some properties pass down to children automatically — `color`, `font-family`, `font-size`, `line-height`, `text-align`. Most do not: `border`, `padding`, `background`, `width`. Setting `font-family` once on `body` is why you rarely repeat it."],
    ['p', "Inherited values lose to **any** rule that targets the element directly, no matter how weak. A `p { color: black }` beats an inherited blue from `body`."],
    ['h', "Escaping `!important`"],
    ['code', 'css', `.note { color: red !important; }   /* now nothing can override it normally */`],
    ['p', "It works, and it is almost always a mistake. It signals that specificity has got out of hand, and the only way to beat it later is another `!important` — an arms race. Fix the selector instead. The honest exceptions: overriding a third-party stylesheet you cannot edit, and utility classes."],
    ['h', "Keeping specificity low"],
    ['ul', [
      "Prefer a single class: `.card-title`, not `div.card > h2.title`.",
      "Avoid IDs in stylesheets. Keep them for JavaScript hooks and anchors.",
      "Never nest more than two or three levels deep.",
      "If you are reaching for `!important`, look for the over-specific rule that made you."
    ]]
  ],
  ex: [
    { q: "Score these: `.card h2`, `h2.title`, `#main h2`, `.card .title`.",
      a: "`.card h2` = 0,1,1. `h2.title` = 0,1,1 — a tie, so source order decides. `#main h2` = 1,0,1, which beats both. `.card .title` = 0,2,0, which beats both of the first two but still loses to the ID." },
    { q: "In the live editor, both `h2` and `.card h2` set a colour. Predict the winner, then swap their order and re-run.",
      hint: "Does source order matter when specificity differs?",
      a: "`.card h2` wins at 0,1,1 against 0,0,1 — and it keeps winning after you swap them. Source order is only consulted when specificity **ties**, which is exactly what happens with the two `.note` rules below." },
    { q: "You set `.note { color: green }` but the text is still grey. List three things to check before adding `!important`.",
      a: "**1.** Open devtools, inspect the element, and look at the Styles panel — a rule crossed out shows you exactly what overrode it and where. **2.** Check the selector actually matches: is the class spelled right, is it on the element you think? **3.** Check for a syntax error in a rule *above* yours — an unclosed brace disables everything after it. `!important` should come after all three, and usually you will not need it." },
    { q: "Add `!important` to the losing `h2` rule in the editor. It now wins. Explain why this is a trap.",
      a: "You have made that declaration unoverridable by any normal rule, including future ones written specifically to handle a special case. The only escape is another `!important` with higher specificity. Two or three rounds of that and the stylesheet becomes genuinely unmaintainable — which is why the fix is to lower the *winning* selector's specificity, not raise the loser's weight." },
    { q: "Which of `color`, `padding`, `font-family`, `border` are inherited? What is the practical consequence?",
      hint: "Think about which ones would look absurd if every child copied them.",
      a: "`color` and `font-family` inherit; `padding` and `border` do not. Imagine if they did — every nested element would draw its own copy of the parent's border, and padding would compound at every level. The practical consequence is that typography is set once high up (usually on `body`) and flows down, while box properties must be set on each element that needs them." }
  ]
},

/* ── 04 ─────────────────────────────────────────────── */
{
  t: "The box model",
  sub: "Every element is a rectangle. Understanding its four layers explains most unexpected layout.",
  blocks: [
    ['p', "From the inside out: **content**, then **padding**, then **border**, then **margin**."],
    ['code', 'text', `┌─────────────── margin ───────────────┐
│  ┌──────────── border ────────────┐  │
│  │  ┌────────  padding  ───────┐  │  │
│  │  │        content           │  │  │
│  │  └──────────────────────────┘  │  │
│  └────────────────────────────────┘  │
└──────────────────────────────────────┘`],
    ['ul', [
      "**padding** — space *inside* the border. Takes the element's background.",
      "**border** — the line itself.",
      "**margin** — space *outside*. Always transparent."
    ]],
    ['h', "The sizing trap"],
    ['p', "By default `width: 300px` sets the width of the **content box** only. Padding and border are added on top:"],
    ['code', 'css', `.box {
  width: 300px;
  padding: 20px;
  border: 2px solid;
}
/* actual rendered width: 300 + 20 + 20 + 2 + 2 = 344px */`],
    ['h', "The fix everyone applies"],
    ['code', 'css', `*, *::before, *::after {
  box-sizing: border-box;
}`],
    ['p', "Now `width: 300px` means the element occupies exactly 300px, with padding and border fitting **inside**. Put this at the top of every stylesheet you write. It is the first rule in the stylesheet for this very page."],
    ['h', "Shorthand order"],
    ['code', 'css', `padding: 10px;                    /* all four sides */
padding: 10px 20px;               /* vertical | horizontal */
padding: 10px 20px 30px;          /* top | horizontal | bottom */
padding: 10px 20px 30px 40px;     /* top right bottom left — clockwise */

padding-block: 10px;              /* top and bottom */
padding-inline: 20px;             /* left and right */`],
    ['note', "The four-value order is clockwise from the top: **T R B L**. Mnemonic: **TRouBLe**."],
    ['h', "Margin collapse"],
    ['p', "Adjacent **vertical** margins merge into one — the larger of the two, not their sum. A 30px bottom margin next to a 20px top margin gives 30px of space, not 50px. Horizontal margins never collapse."],
    ['warn', "Margin collapse is the reason spacing is often smaller than you expect. It disappears inside a flex or grid container, which is one more reason to use `gap` for spacing between siblings instead of margins on each one."],
    ['lab', 'css', `.card {
  box-sizing: border-box;
  width: 280px;
  padding: 20px;
  border: 3px solid #2F4E93;
  background: #DFE5F3;
}

/* Delete the box-sizing line and run again —
   the card gets wider than 280px. */

.cta {
  padding: 8px 20px;
  margin-top: 12px;
  border: 1px solid #2F4E93;
  background: white;
}`]
  ],
  ex: [
    { q: "An element has `width: 200px; padding: 15px; border: 5px solid`. How wide is it on screen with the default box-sizing, and with `border-box`?",
      a: "Default (`content-box`): 200 + 15 + 15 + 5 + 5 = **240px**. With `border-box`: exactly **200px**, with the content squeezed to 160px to make room. The margin is outside the box in both cases and never counts toward the width." },
    { q: "In the live editor, delete the `box-sizing` line and run. Describe what changes and why.",
      a: "The card grows to 280 + 40 padding + 6 border = 326px. Nothing about your `width` declaration changed — only what that number is measured against. This is exactly the surprise `border-box` was invented to remove." },
    { q: "Write a padding shorthand for 10px top, 24px left and right, 30px bottom.",
      hint: "Three values means top | horizontal | bottom.",
      a: "Both are correct; the three-value form is shorter, the logical-property form reads more clearly and adapts automatically to right-to-left languages — worth knowing if you ever build a Hebrew interface.",
      code: ['css', `padding: 10px 24px 30px;

/* or, more explicitly */
padding-block-start: 10px;
padding-inline: 24px;
padding-block-end: 30px;`] },
    { q: "Two stacked paragraphs: the first has `margin-bottom: 40px`, the second `margin-top: 20px`. How much space is between them?",
      hint: "They do not add.",
      a: "**40px** — the larger of the two. Vertical margins between adjacent siblings collapse into a single margin. If you genuinely need 60px, put the two in a flex column with `gap: 60px`, which does not collapse." },
    { q: "You want 20px of space between every child of a container. Compare `margin-bottom` on each child with `gap` on the container.",
      a: "`margin-bottom` on every child leaves an unwanted 20px hanging off the last one, needing a `:last-child { margin-bottom: 0 }` patch — and the margins may collapse with the container's own. `display: flex; flex-direction: column; gap: 20px` puts space **between** items only, never at the ends, and never collapses. Let the layout own the spacing." }
  ]
},

/* ── 05 ─────────────────────────────────────────────── */
{
  t: "Units that scale",
  sub: "px, rem, em, %, vh — and why the choice decides whether your page survives a zoom.",
  blocks: [
    ['h', "Absolute"],
    ['p', "`px` is the only absolute unit worth using. One CSS pixel is a fixed reference size — predictable, and correct for things that should not scale: borders, hairlines, small offsets."],
    ['h', "Relative to font size"],
    ['tbl',
      ["Unit", "Relative to", "Use for"],
      [
        ["`rem`", "the **root** font size (16px by default)", "almost everything: type, spacing, widths"],
        ["`em`", "the **current element's** font size", "spacing that should track its own text size"],
        ["`ch`", "the width of a `0` in the current font", "line lengths — `max-width: 65ch`"],
        ["`ex`", "the x-height", "rarely needed"]
      ]
    ],
    ['p', "**Default to `rem`.** A user who raises their browser's base font size for readability gets a page that scales with them. A page built in `px` ignores that setting entirely — an accessibility failure, not a style preference."],
    ['warn', "`em` compounds. Nest three elements each with `font-size: 1.2em` and the innermost is 1.73× the base. That runaway is why `rem` — which always refers to the root — is the safer default."],
    ['h', "Relative to the container"],
    ['code', 'css', `width: 50%;        /* half the parent's width */
width: 100vw;      /* full viewport width */
height: 100vh;     /* full viewport height */
height: 100dvh;    /* dynamic — accounts for mobile browser chrome */`],
    ['warn', "`100vw` includes the scrollbar's width on desktop, so a full-width element can trigger a horizontal scrollbar. `width: 100%` usually does what you actually meant."],
    ['h', "`clamp()` — the modern answer to responsive sizing"],
    ['code', 'css', `font-size: clamp(1.5rem, 1rem + 2vw, 3rem);
/*                minimum   preferred   maximum */`],
    ['p', "The middle value scales with the viewport; the outer two stop it going too small or too large. One declaration replaces a stack of media queries — the heading on this page uses exactly this."],
    ['lab', 'css', `.card {
  padding: 1.5rem;
  max-width: 30rem;
  border: 1px solid #D2D9D6;
}

h2 {
  /* resize the preview pane and watch it respond */
  font-size: clamp(1.2rem, 1rem + 2vw, 2.4rem);
  margin-top: 0;
}

.note {
  font-size: 0.875rem;
  max-width: 45ch;
}`],
    ['h', "Rules of thumb"],
    ['ul', [
      "Font sizes: `rem`.",
      "Spacing: `rem`, from a scale (0.25 / 0.5 / 1 / 1.5 / 2 / 3).",
      "Borders and hairlines: `px`.",
      "Text column width: `ch`, around 60–75.",
      "Full-height sections: `dvh` over `vh` on mobile.",
      "Fluid type: `clamp()`."
    ]]
  ],
  ex: [
    { q: "With a root font size of 16px, how many pixels are `1rem`, `1.5rem` and `0.875rem`?",
      a: "16px, 24px and 14px. The last is a common body-secondary size — `0.875rem` is preferred over `14px` because it still scales when a user changes their browser default." },
    { q: "Three nested divs each have `font-size: 1.2em`, starting from 16px. What is the innermost size? What if they used `rem`?",
      hint: "`em` multiplies at each level.",
      a: "With `em`: 16 × 1.2³ = **27.6px**, compounding at every level. With `rem`: **19.2px** at every level, because `rem` always refers to the root and never to the parent. This compounding is the single best argument for `rem` as the default." },
    { q: "In the live editor, change the `h2` to a fixed `font-size: 2rem`, then drag the preview narrower. Compare with the `clamp` version.",
      a: "The fixed version stays 32px and eventually crowds or overflows on a narrow pane. The `clamp` version shrinks smoothly down to its 1.2rem floor and grows to its 2.4rem ceiling, with no media queries involved." },
    { q: "Explain when `em` is the *right* choice over `rem`.",
      hint: "Think about a button whose padding should track its own text.",
      a: "When a value should scale with the element's **own** font size rather than the page's. Button padding is the classic case: `padding: 0.5em 1em` keeps the padding proportional whether that button is large or small, so one rule serves every size. Same for a `::before` icon sized in `em` — it stays aligned with the text it sits beside." },
    { q: "Write a fluid heading that is never smaller than 1.5rem, never larger than 3rem, and scales in between. Explain each of the three values.",
      hint: "The middle value needs a viewport unit to be fluid at all.",
      a: "**Minimum** 1.5rem — the floor on narrow screens. **Preferred** `1rem + 2.5vw` — a fixed base plus a viewport-relative part; including the `rem` term is what keeps the text scalable when a user zooms, which a pure `vw` value would break. **Maximum** 3rem — the ceiling on wide monitors, so the heading does not become absurd.",
      code: ['css', `h1 {
  font-size: clamp(1.5rem, 1rem + 2.5vw, 3rem);
}`] }
  ]
},

/* ── 06 ─────────────────────────────────────────────── */
{
  t: "Color",
  sub: "Hex, rgb, hsl and the modern functions — plus the contrast rule that is not optional.",
  blocks: [
    ['h', "The notations"],
    ['code', 'css', `color: #0E7C70;                    /* hex */
color: #0E7C70CC;                  /* hex + alpha */
color: rgb(14 124 112);            /* red green blue, 0-255 */
color: rgb(14 124 112 / 0.8);      /* with alpha */
color: hsl(174 79% 27%);           /* hue saturation lightness */
color: hsl(174 79% 27% / 0.8);`],
    ['h', "Why `hsl` is worth learning"],
    ['p', "Hex is opaque to a human reader — you cannot look at `#0E7C70` and know what changing it will do. `hsl` names the three things you actually want to adjust:"],
    ['ul', [
      "**Hue** 0–360 on the colour wheel: 0 red, 120 green, 240 blue.",
      "**Saturation** 0–100%: grey to vivid.",
      "**Lightness** 0–100%: black to white, with 50% the pure hue."
    ]],
    ['p', "That makes a coherent palette straightforward: hold hue and saturation, vary lightness, and you get a set of tints that genuinely belong together."],
    ['lab', 'css', `/* Same hue, different lightness — a real palette. */
.card {
  background: hsl(174 40% 96%);
  border: 1px solid hsl(174 40% 80%);
  padding: 1.25rem;
}
h2   { color: hsl(174 79% 22%); margin-top: 0; }
.note { color: hsl(174 15% 40%); }
.cta {
  background: hsl(174 79% 27%);
  color: white;
  border: 0;
  padding: .6rem 1.2rem;
  border-radius: 4px;
}
/* Change 174 to 25 everywhere and re-run: same design, new identity. */`],
    ['h', "Contrast is a requirement, not a preference"],
    ['p', "Text must be readable. The WCAG thresholds are the accepted standard:"],
    ['tbl',
      ["Content", "Minimum ratio"],
      [
        ["Body text", "**4.5:1** against its background"],
        ["Large text (18pt+/14pt bold)", "3:1"],
        ["UI borders, icons, focus rings", "3:1"]
      ]
    ],
    ['p', "Browser devtools check this for you: inspect an element, click the colour swatch in the Styles panel, and the contrast ratio is shown with a pass/fail mark."],
    ['warn', "Grey-on-grey is the most common failure. `#999` on white is 2.85:1 — it fails, even though it looks fine to someone with good eyesight on a good monitor. Muted text still needs to clear 4.5:1."],
    ['h', "`currentColor` and custom properties"],
    ['code', 'css', `.btn {
  color: #0E7C70;
  border: 1px solid currentColor;   /* follows color automatically */
}

:root {
  --accent: hsl(174 79% 27%);
  --accent-wash: hsl(174 40% 94%);
}
.cta { background: var(--accent); }`],
    ['p', "Custom properties are the foundation of theming — one definition, used everywhere, swapped in a single place for dark mode. Lesson 16 covers them fully."],
    ['h', "Colour alone is never enough"],
    ['p', "Around 1 in 12 men has some form of colour blindness. A red/green status indicator that carries no other signal is invisible to them. Always pair colour with a second cue: an icon, a label, a shape, a border style."]
  ],
  ex: [
    { q: "In the live editor, change every `174` to `25` and run. What changed and what stayed the same?",
      a: "The whole card shifts from teal to orange, but the *relationships* survive — the background is still a pale wash, the heading still dark, the button still mid-tone. That is the payoff of holding saturation and lightness constant and varying only hue." },
    { q: "Convert `hsl(174 79% 27%)` into a lighter tint and a darker shade of the same colour, without changing the hue.",
      hint: "Only one of the three numbers should move.",
      a: "Adjust lightness only. Dropping saturation slightly on very light tints often looks better, since a pale but fully saturated colour can read as garish.",
      code: ['css', `--accent-dark:  hsl(174 79% 18%);
--accent:       hsl(174 79% 27%);
--accent-light: hsl(174 45% 88%);`] },
    { q: "Use devtools to check the contrast of `#999999` text on `#FFFFFF`. Does it pass? What is the lightest grey that does?",
      hint: "Inspect the element, click the colour swatch in the Styles panel.",
      a: "`#999` gives roughly 2.85:1 and **fails** the 4.5:1 body-text threshold. About `#767676` is the lightest pure grey that passes on white. Devtools draws a line on the colour picker showing exactly where the threshold sits." },
    { q: "Why does `border: 1px solid currentColor` often beat repeating the hex value?",
      a: "It binds the border to whatever `color` resolves to on that element, including inherited and state-dependent values. A single `.btn:hover { color: white }` then updates the text and the border together — no second declaration, and no chance of the two drifting apart." },
    { q: "Design a three-colour status system for success, warning and error that still works for a colour-blind user. State your colours and your second cue.",
      hint: "Red and green are the pair most commonly confused.",
      a: "Colour alone fails here — red/green confusion is the most common form. Pairing each state with a distinct icon, an explicit text label, and a differing border weight means the information survives with the colour removed entirely. A good test: view the page in greyscale and check that every state is still identifiable.",
      code: ['css', `.status { border-left: 3px solid; padding-left: .75rem; }
.status--ok    { color: hsl(150 60% 28%); border-color: hsl(150 60% 38%); }
.status--warn  { color: hsl(38 85% 30%);  border-color: hsl(38 85% 45%); }
.status--error { color: hsl(0 65% 40%);   border-color: hsl(0 65% 50%); }

/* second cue: an icon or label, not colour alone */
.status--ok::before    { content: "✓ Success — "; }
.status--warn::before  { content: "! Warning — "; }
.status--error::before { content: "✕ Error — "; }`] }
  ]
},

/* ── planned ─────────────────────────────────────────── */
{ t: "Typography", sub: "Font stacks, scale, line height, measure — the craft that carries a page.",
  plan: "Choosing and loading typefaces, building a modular scale, and the spacing decisions that separate readable pages from tiring ones.",
  covers: ["Font stacks and system fonts", "`@font-face`, `font-display`, and loading cost", "A modular type scale", "`line-height`, `letter-spacing`, `text-wrap: balance`", "Measure: why 60–75 characters", "Weights, italics and faux-bold"] },

{ t: "Display and normal flow", sub: "Block, inline, inline-block — how the browser lays things out before you intervene.",
  plan: "Normal flow is the layout you get for free. Understanding it makes flexbox and grid feel like adjustments rather than magic.",
  covers: ["Block vs inline vs inline-block", "Why width and vertical margin do nothing on inline elements", "`display: none` vs `visibility: hidden` vs `hidden` attribute", "Replaced elements and images", "Formatting contexts in plain language"] },

{ t: "Flexbox", sub: "One-dimensional layout — the workhorse for rows, columns and toolbars.",
  plan: "The main axis / cross axis model, then every property in order, with a live editor for each.",
  covers: ["`flex-direction` and the two axes", "`justify-content` vs `align-items`", "`gap` instead of margins", "`flex-grow`, `flex-shrink`, `flex-basis`, and the `flex` shorthand", "`flex-wrap` and responsive rows", "Common patterns: navbar, centring, sidebar"] },

{ t: "Grid", sub: "Two-dimensional layout — rows and columns at the same time.",
  plan: "When grid beats flexbox, track sizing, named areas, and the auto-placement rules that make responsive grids possible without media queries.",
  covers: ["`grid-template-columns` and the `fr` unit", "`repeat()`, `minmax()`, `auto-fit` / `auto-fill`", "Named grid areas", "Placing items by line number", "Grid vs flexbox: how to choose", "A responsive card grid with no media queries"] },

{ t: "Positioning", sub: "static, relative, absolute, fixed, sticky — and the containing block that decides where things land.",
  plan: "The five position values, what each one is relative to, and the stacking rules that determine what covers what.",
  covers: ["The containing block concept", "`relative` as an anchor for `absolute`", "`fixed` vs `sticky`", "`z-index` and stacking contexts", "Why `z-index: 9999` sometimes still loses", "Dropdowns, tooltips and overlays"] },

{ t: "Backgrounds and borders", sub: "Gradients, shadows, radii — surface detail without extra markup.",
  plan: "Everything you can draw on an element's box, and how to keep it subtle rather than decorative.",
  covers: ["`background` shorthand and layering", "Linear and radial gradients", "`border-radius` including the slash syntax", "`box-shadow` and layered elevation", "`outline` vs `border`", "Restraint: when a shadow is doing nothing"] },

{ t: "Transitions", sub: "Making state changes feel intentional rather than abrupt.",
  plan: "Which properties can animate cheaply, timing functions, and the accessibility setting you must respect.",
  covers: ["`transition` shorthand: property, duration, easing, delay", "Which properties are cheap (transform, opacity) and which are not", "Easing curves and what they communicate", "Transitioning on hover and focus", "`prefers-reduced-motion`"] },

{ t: "Animations", sub: "`@keyframes` — motion that runs on its own.",
  plan: "Multi-step animation, when it beats a transition, and the performance rules that keep it at 60fps.",
  covers: ["`@keyframes` and percentage steps", "`animation` shorthand properties", "`animation-fill-mode` and why the element snaps back", "Loading indicators and skeletons", "Compositor-friendly properties only", "Respecting reduced motion"] },

{ t: "Responsive design", sub: "One stylesheet that works from a phone to a wide monitor.",
  plan: "Mobile-first method, breakpoints chosen from content rather than device names, and the modern CSS that removes most media queries entirely.",
  covers: ["The viewport meta tag", "`@media` and mobile-first `min-width` queries", "Choosing breakpoints from your content", "Fluid layouts with `minmax` and `clamp`", "Responsive images and `srcset`", "Testing without a device lab"] },

{ t: "Custom properties", sub: "Real variables in CSS — the basis of theming and design systems.",
  plan: "How custom properties differ from preprocessor variables, how they cascade and inherit, and how to build a light/dark theme with them.",
  covers: ["`--name` and `var(--name, fallback)`", "Cascading and inheritance — the key difference from Sass", "Scoping to a component", "Building a token system", "Light/dark theming with `prefers-color-scheme`", "Reading and setting them from JavaScript"] },

{ t: "Modern CSS worth knowing", sub: "`:has()`, container queries, nesting, `@layer` — the features that changed how CSS is written.",
  plan: "A tour of what has landed in browsers recently, what it replaces, and what is safe to use today.",
  covers: ["`:has()` — the parent selector", "Container queries vs media queries", "Native nesting", "`@layer` for cascade control", "`aspect-ratio`, `inset`, logical properties", "`color-mix()` and the new colour spaces"] },

{ t: "Organising a real stylesheet", sub: "Structure that survives a project growing past a few hundred lines.",
  plan: "Naming conventions, file structure, and the discipline that keeps CSS maintainable — ending with a stylesheet for your own Flask app.",
  covers: ["BEM and other naming conventions", "Splitting files and `@import` cost", "A reset or normalise layer", "Tokens → base → components → utilities", "Documenting a component", "Styling your Flask project end to end"] }

  ]
};

