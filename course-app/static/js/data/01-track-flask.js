COURSE.flask = {
  name: "Flask",
  side: "server",
  lessons: [

/* ── 01 ─────────────────────────────────────────────── */
{
  t: "The request–response cycle",
  sub: "Before any Flask syntax: what actually happens between pressing Enter in the address bar and seeing a page.",
  blocks: [
    ['p', "A web server does exactly one thing, over and over: it waits for a **request**, and it sends back a **response**. Everything Flask offers — routes, templates, sessions — is scaffolding around that single exchange."],
    ['h', "The round trip"],
    ['ul', [
      "You type `http://127.0.0.1:5000/about` and press Enter.",
      "The browser opens a connection to the machine at `127.0.0.1` on port `5000` and sends a request: the **method** (`GET`) and the **path** (`/about`).",
      "Flask looks at `/about` and asks: which function did somebody register for this path?",
      "That function runs and returns a value — a string, or rendered HTML.",
      "Flask wraps the value in an HTTP response with a **status code** and sends it back. The browser draws it."
    ]],
    ['p', "Your `about()` function in `hello.py` is step 4. Flask handles 1, 2, 3 and 5 for you. That is the whole deal."],
    ['h', "Reading a URL"],
    ['tbl',
      ["Piece", "Example", "What it does"],
      [
        ["scheme", "`http://`", "Which protocol to speak."],
        ["host", "`127.0.0.1`", "Which machine. This one always means *my own computer*."],
        ["port", "`:5000`", "Which program on that machine. Flask's dev server defaults to 5000."],
        ["path", "`/about`", "Which resource. **This is what Flask routes on.**"],
        ["query", "`?q=flask`", "Extra parameters. Not part of the path — lesson 05."]
      ]
    ],
    ['note', "`127.0.0.1` is *localhost* — a loopback address that never leaves your machine. Nobody else on the internet can reach your dev server, which is exactly what you want while learning."],
    ['h', "Status codes"],
    ['p', "Every response carries a three-digit code. You will see these constantly in the terminal where Flask is running:"],
    ['code', 'shell', `127.0.0.1 - - [01/Aug/2026 14:02:11] "GET /about HTTP/1.1" 200 -
127.0.0.1 - - [01/Aug/2026 14:02:19] "GET /nope HTTP/1.1" 404 -`],
    ['ul', [
      "**2xx** — it worked. `200 OK` is the normal one.",
      "**3xx** — go somewhere else. `302 Found` is a redirect.",
      "**4xx** — you (the client) made a mistake. `404 Not Found`, `400 Bad Request`.",
      "**5xx** — the server made a mistake. `500 Internal Server Error` means your Python raised an exception."
    ]],
    ['warn', "A `500` is *your* bug, a `404` is usually a typo in the URL or a missing route. Learning to tell them apart from the terminal log will save you hours."]
  ],
  ex: [
    { q: "Start your server with `python hello.py`, visit `/about`, then visit `/banana`. Read the terminal log for both. What two status codes appear, and why?",
      hint: "Flask logs one line per request, with the code at the end.",
      a: "`/about` logs `200` because a route is registered for that path. `/banana` logs `404` because no route matches, so Flask has nothing to call and reports “not found”. Note that the 404 is not an error in your code — it is a correct answer to a request for something that does not exist." },
    { q: "For the URL `http://127.0.0.1:5000/user/25?loud=yes`, name the host, the port, the path and the query string.",
      a: "Host `127.0.0.1`, port `5000`, path `/user/25`, query string `loud=yes`. Only the **path** decides which function runs — the query string is data passed to it." },
    { q: "Deliberately break a route: add `return 1/0` as the first line of `about()`, reload `/about`, and note the status code in the terminal.",
      hint: "Dividing by zero raises `ZeroDivisionError`.",
      a: "You get `500`, and because `debug=True` the browser shows an interactive traceback instead of a blank page. This is the fastest way to internalise “5xx means my Python raised”. Remove the line afterwards." },
    { q: "Without changing any code, why does visiting `http://127.0.0.1:5001/about` fail while port 5000 works?",
      a: "`app.run()` binds the dev server to port 5000 by default, so nothing is listening on 5001 and the browser cannot even open a connection. You would get a connection-refused error from the browser, not a Flask 404 — Flask never sees the request at all. You can change it with `app.run(debug=True, port=5001)`." },
    { q: "In your own words, and without using the word “website”, describe what `hello.py` is.",
      a: "It is a program that listens on a port, and for each incoming request maps a URL path to a Python function whose return value becomes the response body. Getting comfortable with that framing makes every later Flask feature easier to place." }
  ]
},

/* ── 02 ─────────────────────────────────────────────── */
{
  t: "Your first app, line by line",
  sub: "Four lines make a working web server. Here is what each one is actually doing.",
  blocks: [
    ['code', 'python', `from flask import Flask

app = Flask(__name__)

@app.route("/")
def home():
    return "Hello!"

if __name__ == "__main__":
    app.run(debug=True)`],
    ['h', "`app = Flask(__name__)`"],
    ['p', "This creates the application object. Everything else attaches to `app`. The argument `__name__` is a built-in Python variable holding the current module's name — when you run `python hello.py` directly it is the string `\"__main__\"`."],
    ['p', "Flask uses it to work out where your project lives on disk, which is how it later finds the `templates/` and `static/` folders without you telling it. Pass the wrong thing and template lookup breaks, so always pass `__name__`."],
    ['h', "`@app.route(\"/\")`"],
    ['p', "A **decorator**. The `@` line runs `app.route(\"/\")`, which returns a function that takes your `home` function and registers it in Flask's URL map under the path `/`. Then it hands `home` back unchanged."],
    ['p', "So the decorator does not modify your function — it **registers** it. That is why the function body is plain Python with no web-specific machinery in it."],
    ['note', "The function name (`home`) is not the URL. The string in `@app.route(...)` is the URL. The name is used internally as the *endpoint* name, which matters later for `url_for()`."],
    ['h', "The return value"],
    ['p', "Whatever you return becomes the response body. Return a plain string and Flask sends it with status `200` and content type `text/html`. Return a tuple like `return \"Nope\", 404` and you control the status too."],
    ['h', "`if __name__ == \"__main__\":`"],
    ['p', "This block runs only when the file is executed directly, not when it is imported by another module. It is the standard Python guard, and it is where `app.run()` belongs so that importing `hello.py` from a test file does not accidentally start a server."],
    ['h', "`debug=True`"],
    ['ul', [
      "**Auto-reload** — save a file and the server restarts itself.",
      "**Interactive debugger** — a 500 shows a traceback in the browser you can click through.",
      "It starts a *second* process to do the reloading, which is why your top-level code runs twice. Your `WERKZEUG_RUN_MAIN` check in `hello.py` exists precisely to work around that."
    ]],
    ['warn', "Never run with `debug=True` on a real server. The interactive debugger lets anyone who can reach the page execute Python on your machine."]
  ],
  ex: [
    { q: "Add a route `/ping` that returns the string `pong`. Visit it.",
      a: "Three lines, placed anywhere above the `if __name__` block:",
      code: ['python', `@app.route("/ping")
def ping():
    return "pong"`] },
    { q: "Make a route `/teapot` that returns the text `I'm a teapot` with status code **418**.",
      hint: "Return a tuple: body first, status second.",
      a: "Flask unpacks a 2-tuple as `(body, status)`. Check the terminal log — it will show `418`.",
      code: ['python', `@app.route("/teapot")
def teapot():
    return "I'm a teapot", 418`] },
    { q: "Two functions, same route: register `@app.route(\"/x\")` on both `def a()` and `def b()`. What happens when you start the server?",
      hint: "The endpoint name comes from the function name — but the URL is the URL.",
      a: "Flask raises `AssertionError: View function mapping is overwriting an existing endpoint function` at import time, before the server starts. Two different functions cannot claim the same endpoint name. Notably you *can* map two different URLs to the same function by stacking two `@app.route` decorators." },
    { q: "Print something at the top level of `hello.py` (outside any function), then run with `debug=True`. How many times does it print, and why?",
      hint: "Look at your existing `WERKZEUG_RUN_MAIN` guard.",
      a: "Twice. The reloader runs your module in a parent process, then spawns a child process that runs it again and actually serves requests. Flask sets the environment variable `WERKZEUG_RUN_MAIN=true` only in the child, which is how your existing guard makes the log line fire exactly once." },
    { q: "Run the app with the Flask CLI instead of `python hello.py`. Does the `if __name__ == \"__main__\"` block execute?",
      hint: "PowerShell: `$env:FLASK_APP = \"hello.py\"; flask run --debug`",
      a: "No. The CLI **imports** `hello.py` rather than running it as a script, so `__name__` is `\"hello\"`, not `\"__main__\"`. The guard is false, `app.run()` never runs, and the CLI starts the server itself. This is exactly why the guard exists — without it you would get a server inside a server." }
  ]
},

/* ── 03 ─────────────────────────────────────────────── */
{
  t: "Routes and URL rules",
  sub: "How Flask decides which function answers a request — matching, ordering, trailing slashes.",
  blocks: [
    ['p', "Every `@app.route` adds a **rule** to Flask's URL map. When a request arrives, Flask walks the map and picks the rule that matches the path. Understanding the matching rules removes most beginner confusion."],
    ['h', "The trailing slash rule"],
    ['p', "This trips up everybody, so learn it once:"],
    ['tbl',
      ["Rule", "Request to `/x`", "Request to `/x/`"],
      [
        ["`@app.route(\"/x\")`", "200 OK", "**404** — no redirect"],
        ["`@app.route(\"/x/\")`", "**308** redirect to `/x/`", "200 OK"]
      ]
    ],
    ['p', "A rule ending in a slash behaves like a directory: Flask redirects the slashless version to it. A rule without a slash behaves like a file: the version with a slash is simply not found. When in doubt, define routes **without** the trailing slash, as you have been doing."],
    ['h', "One function, several URLs"],
    ['p', "Decorators stack. Both paths hit the same function:"],
    ['code', 'python', `@app.route("/")
@app.route("/home")
def home():
    return "Hello!"`],
    ['h', "`url_for` — never hardcode a URL"],
    ['p', "`url_for` takes an **endpoint name** (by default the function name) and builds the URL from the route map:"],
    ['code', 'python', `from flask import url_for

@app.route("/where")
def where():
    return url_for("home")      # -> "/"`],
    ['p', "The payoff: change the route string and every `url_for` call follows automatically. Hardcoded `\"/home\"` strings silently rot."],
    ['h', "Seeing the map"],
    ['p', "Flask can print every rule it knows. Run this in PowerShell from your project folder:"],
    ['code', 'shell', `$env:FLASK_APP = "hello.py"; flask routes`],
    ['code', 'text', `Endpoint   Methods  Rule
---------  -------  -----------------------
about      GET      /about
home       GET      /
search     GET      /search
static     GET      /static/<path:filename>
user_age   GET      /user/<int:age>
user_name  GET      /user/<name>`],
    ['note', "The `static` rule appears even though you never wrote it — Flask registers it automatically so `static/` files can be served. More on that in lesson 09."]
  ],
  ex: [
    { q: "Add `@app.route(\"/about/\")` (with a trailing slash) alongside your existing `/about`. Visit both `/about` and `/about/`. What does the terminal show?",
      hint: "Watch for a 308 in the log.",
      a: "You will hit the “View function mapping is overwriting an existing endpoint” error if both decorate functions named the same. Give the second one a different function name and you will see `/about` return 200 from the first rule, while `/about/` matches the second. Remove the duplicate afterwards — one canonical URL per resource is the right habit." },
    { q: "Stack two decorators so that both `/` and `/index` render your home page.",
      a: "Decorators apply bottom-up but both register against the same function, so order does not matter here:",
      code: ['python', `@app.route("/")
@app.route("/index")
def home():
    hobbies = {"gaming", "coding", "reading"}
    return render_template("home.html", name="Human", hobbies=hobbies)`] },
    { q: "Run `flask routes`. How many rules exist that you did not write yourself, and what are they for?",
      a: "One: `static`, mapped to `/static/<path:filename>`. Flask adds it at construction time so that CSS, JS and images placed in a `static/` folder are served without any code from you." },
    { q: "Write a `/links` route that returns two real anchor tags built with `url_for` rather than hardcoded paths.",
      hint: "`url_for` takes the **function name**, not the URL.",
      a: "Because the hrefs are generated, renaming `/about` to `/about-us` in the decorator updates this page for free:",
      code: ['python', `from flask import url_for

@app.route("/links")
def links():
    return (
        '<a href="' + url_for("home") + '">home</a> '
        '<a href="' + url_for("about") + '">about</a>'
    )`] },
    { q: "Call `url_for(\"user_name\")` with no other arguments. Predict what happens, then try it.",
      hint: "That rule has a required variable part.",
      a: "It raises `BuildError` — Flask cannot construct `/user/<name>` without knowing `name`. You must supply it: `url_for(\"user_name\", name=\"itay\")` gives `/user/itay`. Any keyword that is *not* part of the rule gets appended as a query string instead: `url_for(\"home\", q=\"hi\")` gives `/?q=hi`." }
  ]
},

/* ── 04 ─────────────────────────────────────────────── */
{
  t: "Dynamic routes and converters",
  sub: "Capturing part of the URL as a function argument — and why `/user/25` and `/user/itay` land in different functions.",
  blocks: [
    ['p', "Angle brackets in a rule capture a piece of the path and pass it to your function as an argument. This is your existing code:"],
    ['code', 'python', `@app.route("/user/<name>")
def user_name(name):
    return "hello " + name

@app.route("/user/<int:age>")
def user_age(age):
    return "next year you will be " + str(age + 1) + " years old"`],
    ['p', "The part before the colon is the **converter**. It does two jobs: it restricts what the rule will match, and it converts the captured text into a Python type."],
    ['h', "The built-in converters"],
    ['tbl',
      ["Converter", "Matches", "You receive"],
      [
        ["`<name>`", "any text without a `/`", "`str`"],
        ["`<int:n>`", "digits only", "`int`"],
        ["`<float:n>`", "digits with a decimal point", "`float`"],
        ["`<path:p>`", "text **including** `/`", "`str`"],
        ["`<uuid:u>`", "a UUID string", "`uuid.UUID`"]
      ]
    ],
    ['h', "Why the order in your file does not matter"],
    ['p', "You might expect `/user/<name>` to win for `/user/25` because it is defined first. It does not. Werkzeug sorts rules by **specificity**, not by definition order: a rule with a tighter converter is tried before a looser one. `int` is tighter than the default string converter, so `/user/25` reaches `user_age`."],
    ['warn', "This means you cannot fix a route conflict by reordering the decorators. If two rules genuinely overlap, make them distinct — `/user/<name>` and `/user/age/<int:age>` — rather than relying on precedence you did not choose."],
    ['h', "The `int` converter rejects, it does not crash"],
    ['p', "`/user/3.5` does not match `<int:age>` — the dot is not a digit. It falls through to `<name>` and you get “hello 3.5”. Conversion failure is a *non-match*, never a `ValueError`."],
    ['h', "Defaults and multiple parts"],
    ['code', 'python', `@app.route("/greet")
@app.route("/greet/<name>")
def greet(name="stranger"):
    return "shalom " + name

@app.route("/post/<int:year>/<slug>")
def post(year, slug):
    return "post " + slug + " from " + str(year)`]
  ],
  ex: [
    { q: "Visit `/user/25`, `/user/itay`, `/user/3.5` and `/user/-4`. Predict which function answers each *before* you load it.",
      hint: "Is a minus sign a digit?",
      a: "`/user/25` → `user_age`, which answers “next year you will be 26 years old”. `/user/itay` → `user_name`. `/user/3.5` → `user_name`, because `<int:>` matches digits only. `/user/-4` → `user_name` too: the built-in `int` converter does not accept a leading minus, so it falls through to the string rule and prints “hello -4”." },
    { q: "Add `/double/<int:n>` returning `n * 2`. Then visit `/double/7` and `/double/seven`.",
      hint: "Watch what status code the second one produces.",
      a: "`/double/7` returns `14` — and note it must be `str(n * 2)`, since Flask cannot send a bare `int` as a response body. `/double/seven` returns **404**, because no rule matches at all.",
      code: ['python', `@app.route("/double/<int:n>")
def double(n):
    return str(n * 2)`] },
    { q: "Why does `return n * 2` (without `str()`) fail, while `return \"hello \" + name` works?",
      a: "Flask accepts a string, bytes, a `Response`, a dict/list (auto-JSON) or a tuple. A bare `int` is none of those, so it raises `TypeError: The view function did not return a valid response`. Returning `2` would also be ambiguous — is it a body or a status code?" },
    { q: "Build a route that accepts a file path with slashes in it, so `/show/docs/notes/todo.txt` works as one argument.",
      hint: "Only one converter matches `/`.",
      a: "`<path:...>` is the only converter that allows slashes. A plain `<filename>` would 404 on that URL because it stops at the first slash.",
      code: ['python', `@app.route("/show/<path:filename>")
def show(filename):
    return "you asked for " + filename`] },
    { q: "Make `/greet` and `/greet/<name>` both work, with `/greet` alone saying “shalom stranger”. Then explain what `url_for(\"greet\")` returns and why.",
      hint: "Stack two rules on one function and give the parameter a Python default.",
      a: "`url_for(\"greet\")` returns `/greet` — with no `name` supplied, Flask builds the shortest rule that it can satisfy. `url_for(\"greet\", name=\"itay\")` returns `/greet/itay`. The Python default is what makes the argument optional inside the function; the second decorator is what makes the shorter URL exist.",
      code: ['python', `@app.route("/greet")
@app.route("/greet/<name>")
def greet(name="stranger"):
    return "shalom " + name`] }
  ]
},

/* ── 05 ─────────────────────────────────────────────── */
{
  t: "Query strings with request.args",
  sub: "The `?q=flask` part of a URL — reading it safely, and knowing when to use it instead of a route variable.",
  blocks: [
    ['p', "Everything after `?` is the **query string**: a set of `key=value` pairs the browser sends along with the path. It is not part of the path, so it needs no route of its own. This is the route you just wrote:"],
    ['code', 'python', `from flask import request

@app.route("/search")
def search():
    term = request.args.get("q", "nothing")
    return "you searched for: " + term`],
    ['h', "`request` is a magic global"],
    ['p', "You import one `request` object, but it is not shared between visitors. Flask swaps in the correct request per incoming connection behind the scenes (a *context local*). Inside a view function, `request` always refers to the request currently being handled."],
    ['warn', "That magic has one hard edge: touching `request` outside a request — at import time, or in a background thread — raises `RuntimeError: Working outside of request context`."],
    ['h', "`.get()` versus `[]`"],
    ['tbl',
      ["Expression", "`?q=flask`", "No `q` at all"],
      [
        ["`request.args.get(\"q\")`", "`\"flask\"`", "`None`"],
        ["`request.args.get(\"q\", \"nothing\")`", "`\"flask\"`", "`\"nothing\"`"],
        ["`request.args[\"q\"]`", "`\"flask\"`", "**400 Bad Request**"]
      ]
    ],
    ['p', "Use `.get()` with a default. It is the same API as a Python dict, and it means a missing parameter is a normal case rather than an error page."],
    ['h', "Everything arrives as a string"],
    ['p', "`?page=2` gives you the string `\"2\"`, not the integer `2`. Ask for conversion explicitly, and `args.get` will hand back the default if conversion fails:"],
    ['code', 'python', `page = request.args.get("page", 1, type=int)
# ?page=2      -> 2
# ?page=beans  -> 1   (conversion failed, default used)
# (missing)    -> 1`],
    ['h', "Repeated keys"],
    ['p', "`request.args` is a `MultiDict`. For `?tag=a&tag=b`, plain access gives the **first** value; `getlist` gives all of them:"],
    ['code', 'python', `request.args.get("tag")      # "a"
request.args.getlist("tag")  # ["a", "b"]`],
    ['h', "Path or query string?"],
    ['ul', [
      "**Path** — identifies *which resource*: `/user/itay`, `/post/2026/hello`.",
      "**Query string** — modifies *how you want it*: `?sort=new&page=2&q=flask`.",
      "Rule of thumb: if removing it would make the URL meaningless, it belongs in the path."
    ]]
  ],
  ex: [
    { q: "Visit `/search?q=flask`, then `/search` with no query, then `/search?q=`. What does each return, and why is the third one different from the second?",
      hint: "An empty value is still a value.",
      a: "`you searched for: flask`, then `you searched for: nothing`, then `you searched for: ` — an empty string. `?q=` means the key **is** present with an empty value, so `.get` returns `\"\"` rather than the default. Guard with `term = request.args.get(\"q\") or \"nothing\"` if you want empty to count as missing." },
    { q: "Extend `/search` to also read a `sort` parameter defaulting to `\"old\"`, and report both values.",
      a: "Test with `/search?q=flask&sort=new` — the `&` separates pairs.",
      code: ['python', `@app.route("/search")
def search():
    term = request.args.get("q", "nothing")
    sort = request.args.get("sort", "old")
    return "you searched for: " + term + " (sorted by " + sort + ")"`] },
    { q: "Write `/page` that reads `?n=` as an integer and returns `n * 10`. Make `/page?n=beans` return `10` instead of crashing.",
      hint: "`args.get` takes a `type=` argument.",
      a: "With `type=int`, a failed conversion falls back to the default rather than raising — no `try/except` needed.",
      code: ['python', `@app.route("/page")
def page():
    n = request.args.get("n", 1, type=int)
    return str(n * 10)`] },
    { q: "Add a route `/tags` that lists every `tag` in the query string, so `/tags?tag=a&tag=b&tag=c` returns `a, b, c`.",
      hint: "`.get()` only ever gives you one.",
      a: "`getlist` returns `[]` when the key is absent, so `/tags` alone returns an empty string — worth handling if you want a friendlier message.",
      code: ['python', `@app.route("/tags")
def tags():
    return ", ".join(request.args.getlist("tag"))`] },
    { q: "Explain why `/user/itay` uses a route variable but `/search?q=flask` uses a query string. Then say which one `?page=2` belongs in.",
      a: "`/user/itay` identifies **which** user — remove `itay` and the URL points at nothing. `q=flask` refines a search that still makes sense without it (`/search` is a valid, empty search). `?page=2` is a refinement of an existing listing, so it belongs in the query string too — that is why real sites use `/products?page=2`, not `/products/page/2`." }
  ]
},

/* ── 06 ─────────────────────────────────────────────── */
{
  t: "Templates and Jinja2",
  sub: "Getting HTML out of your Python file and into `templates/`, with real data passed in.",
  blocks: [
    ['p', "Returning HTML as a Python string stops scaling almost immediately. `render_template` reads a file from `templates/`, fills in the gaps, and returns the finished HTML."],
    ['code', 'python', `from flask import render_template

@app.route("/")
def home():
    hobbies = {"gaming", "coding", "reading"}
    return render_template("home.html", name="Human", hobbies=hobbies)`],
    ['p', "Every keyword argument after the filename becomes a variable inside the template. `name=\"Human\"` makes `{{ name }}` available; `hobbies=hobbies` makes `{{ hobbies }}` available."],
    ['h', "Where Flask looks"],
    ['p', "`templates/` must sit next to the file where you called `Flask(__name__)` — that is the whole reason `__name__` matters. Flask does not search anywhere else:"],
    ['code', 'text', `learn/
  hello.py            <- Flask(__name__) here
  templates/
    home.html         <- render_template("home.html")`],
    ['h', "The two delimiters"],
    ['ul', [
      "`{{ ... }}` **prints** an expression. `{{ name }}`, `{{ 2 + 2 }}`, `{{ user.email }}`.",
      "`{% ... %}` **does** something — a statement that produces no output on its own. `{% if %}`, `{% for %}`, `{% block %}`.",
      "`{# ... #}` is a comment, stripped from the output."
    ]],
    ['p', "Your `home.html` uses both. `{% if hobbies %}` decides whether the list appears, and `{{ hobbie }}` prints each item:"],
    ['code', 'jinja', `<h1>Hello, {{ name }}</h1>
{% if hobbies %}
  <ul>
    {% for hobbie in hobbies %}
    <li>{{ hobbie }}</li>
    {% endfor %}
  </ul>
{% else %}
  <p>go to touch some grass</p>
{% endif %}`],
    ['warn', "Every `{% for %}` needs `{% endfor %}` and every `{% if %}` needs `{% endif %}`. Jinja does not use indentation to close blocks the way Python does — forgetting one gives `TemplateSyntaxError`."],
    ['h', "Autoescaping keeps you safe"],
    ['p', "If `name` were `<script>alert(1)<\/script>`, Jinja prints it as visible text rather than running it. It escapes `<`, `>`, `&` and quotes in every `{{ }}` in an `.html` file automatically. This single default blocks the most common web vulnerability there is (XSS)."],
    ['note', "You can opt out with `{{ value|safe }}` — only ever do that for HTML you generated yourself, never for anything a visitor typed."],
    ['h', "Filters"],
    ['p', "A pipe transforms a value on the way out. They chain left to right:"],
    ['code', 'jinja', `{{ name|upper }}                  {# HUMAN #}
{{ hobbies|length }}              {# 3 #}
{{ hobbies|join(", ") }}          {# gaming, coding, reading #}
{{ missing|default("unknown") }}  {# unknown #}
{{ name|lower|capitalize }}       {# Human #}`]
  ],
  ex: [
    { q: "Your `hobbies` set in `hello.py` is currently empty (the items are commented out). Load `/` and note what appears, then uncomment them and reload.",
      hint: "Look at the `{% else %}` branch of the template.",
      a: "Empty renders “go to touch some grass”, because an empty set is falsy in Jinja exactly as in Python. Uncommenting gives you a three-item `<ul>`. Note that a `{...}` set has no guaranteed order, so the items may render in a different order each run — use a list `[...]` if order matters." },
    { q: "Pass a third variable `year=2026` from `home()` and print it in the template inside a `<footer>`.",
      a: "Add it to the `render_template` call, then use `{{ year }}` in the HTML:",
      code: ['python', `return render_template("home.html", name="Human", hobbies=hobbies, year=2026)`] },
    { q: "In `home.html`, print the number of hobbies and the list joined by commas, on one line.",
      hint: "Two filters: one counts, one joins.",
      a: "With three hobbies this renders “3 hobbies: gaming, coding, reading”.",
      code: ['jinja', `<p>{{ hobbies|length }} hobbies: {{ hobbies|join(", ") }}</p>`] },
    { q: "Call `render_template(\"home.html\", name=\"Human\")` without passing `hobbies` at all. Predict the result before running it.",
      hint: "Jinja does not raise on missing names the way Python does.",
      a: "It renders the `{% else %}` branch, no error. An undefined variable in Jinja is a special `Undefined` object that is falsy and prints as an empty string. Convenient, but it means typos fail silently — `{{ nmae }}` renders nothing rather than complaining." },
    { q: "Pass `name=\"<b>Human</b>\"` and load the page. Explain what you see, then make the bold actually apply and say why that is risky.",
      hint: "The filter is called `safe`.",
      a: "You see the literal text `<b>Human</b>` on the page — autoescaping turned `<` into `&lt;`. Writing `{{ name|safe }}` renders it as real bold. It is risky because if `name` ever comes from user input (a form, a query string), a visitor could inject `<script>` and run code in every other visitor's browser. Only use `|safe` on markup you constructed yourself." }
  ]
},

/* ── planned ─────────────────────────────────────────── */
{ t: "Jinja logic: loops, tests, macros", sub: "Beyond if/for — `loop.index`, `{% set %}`, whitespace control, and macros for reusable snippets.",
  plan: "Deeper Jinja: the `loop` object inside `{% for %}`, `{% set %}` for locals, `is` tests, whitespace control with `{%-`, and writing macros so a card or a form field is defined once.",
  covers: ["`loop.index`, `loop.first`, `loop.last`, `loop.length`", "`{% for ... %}{% else %}` for empty collections", "`{% set %}` and scoping gotchas", "`{% macro %}` and `{% import %}`", "Whitespace control and readable output"] },

{ t: "Template inheritance", sub: "One `base.html` with the shell, every page filling in the blocks.",
  plan: "Stop repeating the `<head>` and nav on every page. `{% extends %}`, `{% block %}`, `{{ super() }}`, and `{% include %}` for partials.",
  covers: ["`base.html` with named blocks", "`{% extends %}` and block overriding", "`{{ super() }}` to append rather than replace", "`{% include %}` vs `{% extends %}`", "Structuring a `templates/` folder as it grows"] },

{ t: "Static files and url_for", sub: "Serving your own CSS and JavaScript — and connecting the CSS track to the Flask track.",
  plan: "The `static/` folder, `url_for('static', filename=...)`, cache busting, and why hardcoding `/static/style.css` breaks the moment you deploy under a subpath.",
  covers: ["The auto-registered `static` route", "`url_for('static', filename='css/style.css')`", "Folder layout for css/js/img", "Browser caching and cache-busting query strings", "Wiring your first stylesheet into `home.html`"] },

{ t: "HTTP methods and forms", sub: "GET vs POST, `<form>`, and `request.form` — letting people type into your app.",
  plan: "The natural next step after query strings: real forms. `methods=[\"GET\", \"POST\"]`, reading `request.form`, and the POST/Redirect/GET pattern that stops double submissions.",
  covers: ["`methods=` on a route and `request.method`", "`request.form` vs `request.args`", "Building an HTML `<form>` that targets a route", "Why POST for changes, GET for reads", "POST → redirect → GET"] },

{ t: "Redirects and flash messages", sub: "Sending someone elsewhere, and telling them what just happened.",
  plan: "`redirect()`, `url_for()` together, plus the flash-message system for one-shot notifications that survive a redirect.",
  covers: ["`redirect(url_for(...))`", "302 vs 301 vs 308", "`flash()` and `get_flashed_messages()`", "Rendering flashes in `base.html`", "Categories for success/error styling"] },

{ t: "Sessions and cookies", sub: "Remembering a visitor between requests when HTTP itself remembers nothing.",
  plan: "Why HTTP is stateless, what a cookie actually is, and how Flask's signed-cookie `session` works — including what it does and does not protect.",
  covers: ["`SECRET_KEY` and why it must be secret", "`session[...]` read/write/pop", "Signed ≠ encrypted: the contents are readable", "Cookie flags: HttpOnly, Secure, SameSite", "Server-side sessions when data outgrows a cookie"] },

{ t: "Error handling and custom pages", sub: "Turning the default 404 into something that belongs to your app.",
  plan: "`@app.errorhandler`, `abort()`, and the difference between an expected 404 and an unexpected 500.",
  covers: ["`@app.errorhandler(404)` and returning a tuple", "`abort(404)` from inside a view", "Handling `500` without leaking tracebacks", "`HTTPException` and custom exceptions", "Logging errors instead of printing them"] },

{ t: "Returning JSON: your first API", sub: "Serving data instead of pages — the half your JavaScript track will talk to.",
  plan: "`jsonify`, returning dicts directly, status codes for APIs, and reading a JSON request body. This is the lesson that connects the Flask track to the `fetch` lesson on the JS side.",
  covers: ["`jsonify()` and dict auto-conversion", "Content-Type and why it matters", "`request.get_json()` for incoming JSON", "REST-shaped URLs and verbs", "Testing an endpoint with curl and the browser"] },

{ t: "Talking to a database", sub: "SQLite and Flask-SQLAlchemy — where data lives once a Python dict is not enough.",
  plan: "From a hardcoded list to a real table: SQLite with the standard library, then Flask-SQLAlchemy models, queries and a first migration.",
  covers: ["`sqlite3` basics and connection lifecycle", "Defining a model with Flask-SQLAlchemy", "Create/read/update/delete from a view", "`g` and teardown for connections", "Why parameterised queries, never string concatenation"] },

{ t: "Blueprints and the app factory", sub: "Splitting one big `hello.py` into modules that can be tested and reused.",
  plan: "The refactor every growing Flask app makes: `create_app()`, blueprints per feature, and circular-import avoidance.",
  covers: ["Why a module-level `app` becomes a problem", "`create_app()` as a factory", "`Blueprint` and `register_blueprint`", "`url_for` with blueprint-qualified endpoints", "A project layout that scales"] },

{ t: "Configuration and environments", sub: "Dev, test and production settings without editing code between them.",
  plan: "`app.config`, config objects, environment variables and `.env` files — connecting directly to the `os.environ` lesson on the os track.",
  covers: ["`app.config` and `from_object` / `from_envvar`", "Secrets via environment variables, never in git", "`python-dotenv` and `.env`", "Per-environment config classes", "`DEBUG`, `TESTING`, `SECRET_KEY`"] },

{ t: "Testing with test_client", sub: "Checking your routes without a browser or a running server.",
  plan: "`app.test_client()` lets you make requests in-process. Writing your first pytest suite against the routes you already have.",
  covers: ["`app.test_client()` and `client.get('/about')`", "Asserting on `status_code` and `data`", "pytest fixtures for an app and client", "Testing POST and form data", "Why the app factory makes testing easy"] },

{ t: "Security essentials", sub: "The handful of mistakes that actually get Flask apps broken into.",
  plan: "A practical pass over XSS, CSRF, secret management, password hashing and safe redirects — what the defaults already protect and what they do not.",
  covers: ["Autoescaping and the real cost of `|safe`", "CSRF tokens and Flask-WTF", "Hashing passwords with werkzeug.security", "Open-redirect and path-traversal traps", "Keeping `debug=True` off any public server"] },

{ t: "File uploads", sub: "Accepting a file safely — the route most beginners get wrong.",
  plan: "`enctype=\"multipart/form-data\"`, `request.files`, `secure_filename`, size limits, and why you never trust a filename from a browser.",
  covers: ["The form encoding that makes uploads work", "`request.files` and `FileStorage`", "`secure_filename` and path traversal", "`MAX_CONTENT_LENGTH`", "Where uploaded files should actually live"] },

{ t: "Going to production", sub: "Why `app.run()` is not a real server, and what replaces it.",
  plan: "The dev server versus WSGI. Running under waitress or gunicorn, environment config, logging, and a pre-flight checklist.",
  covers: ["What WSGI is and why Flask needs it", "waitress on Windows, gunicorn on Linux", "A reverse proxy in front", "Production logging and error reporting", "A deployment checklist you can actually follow"] }

  ]
};

