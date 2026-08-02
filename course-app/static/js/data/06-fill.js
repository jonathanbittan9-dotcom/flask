/* ═══════════════════════════════════════════════════════════
   FILL DRILLS — tap the token that belongs in the blank.
   Each: { prompt, lang, code (with ___), opts, correct, why }
   ═══════════════════════════════════════════════════════════ */
const FILL = {

"flask:0": [
  { prompt: "Which status code does the server log for a path with no route?", lang: 'shell',
    code: '"GET /nope HTTP/1.1" ___', opts: ["200", "302", "404", "500"], correct: 2,
    why: "No rule matched, so Flask reports “not found”. Your code never ran." },
  { prompt: "Complete the loopback address the dev server binds to.", lang: 'text',
    code: 'http://___:5000/about', opts: ["0.0.0.0", "127.0.0.1", "192.168.1.1", "localhost.dev"], correct: 1,
    why: "127.0.0.1 is your own machine. Traffic to it never leaves the computer." },
  { prompt: "Your view raised an exception. Which code does the browser get?", lang: 'shell',
    code: '"GET /about HTTP/1.1" ___', opts: ["404", "400", "500", "204"], correct: 2,
    why: "5xx means the server failed — an uncaught Python exception becomes a 500." }
],
"flask:1": [
  { prompt: "Complete the application object.", lang: 'python',
    code: 'app = Flask(___)', opts: ["__name__", "__file__", '"app"', "self"], correct: 0,
    why: "Flask uses it to locate your project folder, which is how templates/ is found." },
  { prompt: "Return the body with an explicit status code.", lang: 'python',
    code: 'return "Not here", ___', opts: ['"404"', "404", "abort(404)", "None"], correct: 1,
    why: "A 2-tuple of (body, status). The status is a bare int, not a string." },
  { prompt: "Guard the server start so importing the file does not launch it.", lang: 'python',
    code: 'if __name__ == ___:\n    app.run(debug=True)', opts: ['"__main__"', '"hello"', '"flask"', "True"], correct: 0,
    why: "True only when the file is run directly — not when the Flask CLI imports it." }
],
"flask:2": [
  { prompt: "Build the URL for the `about` view instead of hardcoding it.", lang: 'python',
    code: 'href = ___("about")', opts: ["route_for", "url_for", "redirect", "link_to"], correct: 1,
    why: "url_for takes the endpoint name and rebuilds the path from the live URL map." },
  { prompt: "Give one function two URLs.", lang: 'python',
    code: '@app.route("/")\n@app.___("/index")\ndef home():', opts: ["route", "get", "url", "add"], correct: 0,
    why: "Decorators stack — both rules register against the same function." },
  { prompt: "Supply the required variable part.", lang: 'python',
    code: 'url_for("user_name", ___="itay")', opts: ["value", "arg", "name", "user"], correct: 2,
    why: "The keyword must match the variable in the rule, `/user/<name>`." }
],
"flask:3": [
  { prompt: "Capture a whole number from the URL.", lang: 'python',
    code: '@app.route("/user/<___:age>")', opts: ["num", "int", "integer", "digit"], correct: 1,
    why: "`int` matches digits only and hands your function a real Python int." },
  { prompt: "Accept a value that contains slashes.", lang: 'python',
    code: '@app.route("/show/<___:filename>")', opts: ["string", "any", "path", "file"], correct: 2,
    why: "`path` is the only converter that spans `/` separators." },
  { prompt: "Make the response valid — the function must return a string.", lang: 'python',
    code: 'def double(n):\n    return ___(n * 2)', opts: ["str", "int", "repr", "print"], correct: 0,
    why: "Flask cannot send a bare int as a body — it raises TypeError." }
],
"flask:4": [
  { prompt: "Read `?q=` safely, with a fallback.", lang: 'python',
    code: 'term = request.args.___("q", "nothing")', opts: ["get", "fetch", "read", "pop"], correct: 0,
    why: "Bracket access would raise a 400 when the key is missing; .get returns the default." },
  { prompt: "Convert `?page=` to an integer without a try/except.", lang: 'python',
    code: 'n = request.args.get("page", 1, ___=int)', opts: ["cast", "as", "type", "coerce"], correct: 2,
    why: "With type=, a failed conversion falls back to the default instead of raising." },
  { prompt: "Collect every repeated `?tag=` value.", lang: 'python',
    code: 'tags = request.args.___("tag")', opts: ["get", "getlist", "getall", "values"], correct: 1,
    why: "args is a MultiDict — .get returns only the first value, .getlist returns them all." }
],
"flask:5": [
  { prompt: "Render a template and pass a variable in.", lang: 'python',
    code: 'return ___("home.html", name="Human")', opts: ["render", "render_template", "template", "send_template"], correct: 1,
    why: "Every keyword after the filename becomes a variable inside the template." },
  { prompt: "Open the tag that prints a value in Jinja.", lang: 'jinja',
    code: '<h1>Hello, ___ name }}</h1>', opts: ["{%", "{{", "{#", "<%"], correct: 1,
    why: "Double braces print an expression; {% %} performs a statement." },
  { prompt: "Close the loop correctly.", lang: 'jinja',
    code: '{% for h in hobbies %}\n  <li>{{ h }}</li>\n{% ___ %}', opts: ["end", "endfor", "endloop", "next"], correct: 1,
    why: "Jinja closes blocks explicitly — indentation means nothing to it." }
],

"os:0": [
  { prompt: "Create a folder without failing if it already exists.", lang: 'python',
    code: 'os.makedirs(LOG_DIR, ___=True)', opts: ["force", "exist_ok", "ignore", "safe"], correct: 1,
    why: "That is exactly what lets your /about route call it on every request." },
  { prompt: "Which namespace holds path-string helpers?", lang: 'python',
    code: 'folder = os.___.dirname(p)', opts: ["file", "path", "dir", "sys"], correct: 1,
    why: "os.path builds and inspects path strings; os itself changes the disk." },
  { prompt: "Catch only the “file is not there” case.", lang: 'python',
    code: 'except ___:\n    print("missing")', opts: ["OSError", "IOError", "FileNotFoundError", "ValueError"], correct: 2,
    why: "Catching OSError would also swallow permission errors you did not plan for." }
],
"os:1": [
  { prompt: "Join path pieces portably.", lang: 'python',
    code: 'p = os.path.___("logs", "app.log")', opts: ["concat", "join", "add", "merge"], correct: 1,
    why: "It inserts the right separator for the platform and never doubles them up." },
  { prompt: "Get just the filename from a full path.", lang: 'python',
    code: 'name = os.path.___(p)', opts: ["filename", "basename", "leaf", "tail"], correct: 1,
    why: "dirname gives the folder; basename gives the final component." },
  { prompt: "Split the extension off a path.", lang: 'python',
    code: 'root, ext = os.path.___(p)', opts: ["splitext", "split", "rsplit", "suffix"], correct: 0,
    why: "It splits at the last dot only — 'a.tar.gz' yields '.gz', not '.tar.gz'." }
],
"os:2": [
  { prompt: "Anchor to the script, not the terminal.", lang: 'python',
    code: 'BASE_DIR = os.path.dirname(os.path.abspath(___))', opts: ["__file__", "__name__", "__main__", "os.getcwd()"], correct: 0,
    why: "__file__ is this source file's path. abspath removes any dependence on the working directory." },
  { prompt: "Complete the pathlib version.", lang: 'python',
    code: 'BASE_DIR = Path(__file__).___().parent', opts: ["absolute", "resolve", "expand", "real"], correct: 1,
    why: "resolve() covers abspath plus symlink resolution." },
  { prompt: "Join with pathlib.", lang: 'python',
    code: 'LOG_FILE = BASE_DIR ___ "logs" / "app.log"', opts: ["+", "/", ".", ","], correct: 1,
    why: "Path overloads the / operator for joining — no separators to get wrong." }
],
"os:3": [
  { prompt: "Read an environment variable with a default.", lang: 'python',
    code: 'port = os.___.get("PORT", "5000")', opts: ["env", "environ", "getenv", "vars"], correct: 1,
    why: "os.environ is the dict. (os.getenv is a shortcut that also works.)" },
  { prompt: "Environment values are always strings — convert explicitly.", lang: 'python',
    code: 'port = ___(os.environ.get("PORT", "5000"))', opts: ["int", "str", "float", "bool"], correct: 0,
    why: "There is no integer in os.environ. And bool(\"False\") is True, which bites people." },
  { prompt: "Complete the reloader guard from your hello.py.", lang: 'python',
    code: 'if os.environ.get("WERKZEUG_RUN_MAIN") != ___:', opts: ["True", '"true"', "1", "None"], correct: 1,
    why: "It must be compared to the string — every environment value is a string." }
],
"os:4": [
  { prompt: "listdir gives bare names — rebuild a usable path.", lang: 'python',
    code: 'for n in os.listdir(folder):\n    full = os.path.___(folder, n)', opts: ["join", "abspath", "resolve", "add"], correct: 0,
    why: "Forgetting this is the most common os mistake — getsize(n) then raises FileNotFoundError." },
  { prompt: "Find every .log file at any depth.", lang: 'python',
    code: 'glob.glob("___/*.log", recursive=True)', opts: ["*", "**", "...", "//"], correct: 1,
    why: "* stays inside one path segment; ** crosses them, but only with recursive=True." },
  { prompt: "Get entries that already know their type.", lang: 'python',
    code: 'with os.___(".") as entries:', opts: ["listdir", "scandir", "walk", "opendir"], correct: 1,
    why: "scandir returns DirEntry objects carrying type and metadata from the same pass." }
],

"js:0": [
  { prompt: "Print to the browser console.", lang: 'js',
    code: '___.log("hello");', opts: ["print", "console", "window", "document"], correct: 1,
    why: "console.log is the browser's equivalent of Python's print()." },
  { prompt: "Load an external script so it runs after the HTML is parsed.", lang: 'html',
    code: '<script ___ src="/static/js/app.js"><\/script>', opts: ["async", "defer", "lazy", "wait"], correct: 1,
    why: "defer waits for parsing to finish, so the elements your code touches exist." },
  { prompt: "Where must a secret like an API key live?", lang: 'python',
    code: 'SECRET = os.environ.get("API_KEY")   # ___ side', opts: ["browser", "server", "either", "client"], correct: 1,
    why: "Anything shipped to the browser is fully readable by anyone." }
],
"js:1": [
  { prompt: "Declare a name that will never be reassigned.", lang: 'js',
    code: '___ name = "Itay";', opts: ["var", "let", "const", "def"], correct: 2,
    why: "const by default; reach for let only when the name will point at something else." },
  { prompt: "This counter is reassigned, so which keyword?", lang: 'js',
    code: '___ count = 0;\ncount = count + 1;', opts: ["const", "let", "var", "final"], correct: 1,
    why: "Reassignment is the only trigger for let." },
  { prompt: "Which declaration leaks out of an if block?", lang: 'js',
    code: 'if (true) { ___ x = 1; }\nconsole.log(x);  // works', opts: ["let", "const", "var", "none"], correct: 2,
    why: "var is function-scoped and ignores braces — the reason it was replaced." }
],
"js:2": [
  { prompt: "Compare without type coercion.", lang: 'js',
    code: 'if (a ___ b) { }', opts: ["==", "===", "=", "~="], correct: 1,
    why: "=== compares value and type. \"5\" == 5 is true; \"5\" === 5 is false." },
  { prompt: "Detect an array — typeof cannot.", lang: 'js',
    code: 'if (___(value)) { }', opts: ["typeof", "Array.isArray", "instanceof", "Object.isArray"], correct: 1,
    why: "typeof [] is \"object\", the same as any other object." },
  { prompt: "Test for NaN safely.", lang: 'js',
    code: 'if (___(n)) { }', opts: ["n === NaN", "Number.isNaN", "isNull", "n == NaN"], correct: 1,
    why: "NaN is not equal to itself, so === can never detect it." }
],
"js:3": [
  { prompt: "Fall back only when the value is null or undefined.", lang: 'js',
    code: 'const port = userPort ___ 5000;', opts: ["||", "??", "&&", "|"], correct: 1,
    why: "|| would also discard a legitimate 0, since 0 is falsy." },
  { prompt: "Reach into an object that might not be there.", lang: 'js',
    code: 'const city = user___address?.city;', opts: [".", "?.", "!.", "->"], correct: 1,
    why: "Optional chaining short-circuits to undefined instead of throwing." },
  { prompt: "Integer division, JavaScript style.", lang: 'js',
    code: 'const half = Math.___(7 / 2);', opts: ["round", "trunc", "floor", "int"], correct: 2,
    why: "There is no // operator — JS has a single number type and / always gives a float." }
],
"js:4": [
  { prompt: "Check an array is non-empty.", lang: 'js',
    code: 'if (hobbies.___) { }', opts: ["size", "length", "count", "empty"], correct: 1,
    why: "The array itself is always truthy — even []. You must ask about length." },
  { prompt: "Complete the branch keyword.", lang: 'js',
    code: 'if (a) { }\n___ if (b) { }\nelse { }', opts: ["elif", "else", "elseif", "or"], correct: 1,
    why: "It is `else if`, two words — not Python's elif." },
  { prompt: "Catch null and undefined together.", lang: 'js',
    code: 'if (value ___ null) return "missing";', opts: ["===", "==", "=", "!=="], correct: 1,
    why: "The one idiomatic use of loose equality — it matches null and undefined only." }
],
"js:5": [
  { prompt: "Iterate over the values of an array.", lang: 'js',
    code: 'for (const h ___ hobbies) { }', opts: ["in", "of", "at", "from"], correct: 1,
    why: "for...of walks values; for...in walks keys, which are strings on an array." },
  { prompt: "Get index and value together.", lang: 'js',
    code: 'for (const [i, h] of hobbies.___()) { }', opts: ["enumerate", "entries", "pairs", "items"], correct: 1,
    why: "entries() yields [index, value] pairs — JavaScript's enumerate()." },
  { prompt: "Skip to the next iteration.", lang: 'js',
    code: 'if (n < 2) ___;', opts: ["break", "continue", "pass", "return"], correct: 1,
    why: "break leaves the loop entirely; continue jumps to the next pass." }
],

"css:0": [
  { prompt: "Link an external stylesheet.", lang: 'html',
    code: '<link ___="stylesheet" href="/static/css/style.css">', opts: ["type", "rel", "as", "role"], correct: 1,
    why: "rel describes the relationship — without it the browser will not apply the file." },
  { prompt: "Open the only valid CSS comment.", lang: 'css',
    code: '___ a note about this rule */', opts: ["//", "#", "/*", "<\!--"], correct: 2,
    why: "A // line is parsed as a broken declaration and can take a valid one with it." },
  { prompt: "Build the static URL in Jinja.", lang: 'jinja',
    code: "href=\"{{ ___('static', filename='css/style.css') }}\"", opts: ["static_for", "url_for", "path_for", "asset"], correct: 1,
    why: "It survives the app being mounted under a URL prefix; a hardcoded path would 404." }
],
"css:1": [
  { prompt: "Select only direct children.", lang: 'css',
    code: '.card ___ p { }', opts: [" ", ">", "+", "~"], correct: 1,
    why: "A space means any descendant; > means one level down only." },
  { prompt: "Style keyboard focus without hurting mouse users.", lang: 'css',
    code: '.cta:___ { outline: 2px solid; }', opts: ["focus", "focus-visible", "active", "hover"], correct: 1,
    why: "focus-visible shows the ring for Tab navigation but not on a mouse click." },
  { prompt: "A pseudo-element needs this or it never renders.", lang: 'css',
    code: '.note::before { ___: "→ "; }', opts: ["text", "content", "value", "before"], correct: 1,
    why: "Without content the pseudo-element is not generated at all." }
],
"css:2": [
  { prompt: "Which selector wins?", lang: 'css',
    code: 'p        { color: red; }   /* 0,0,1 */\n.___     { color: blue; }  /* 0,1,0 wins */', opts: ["p", "note", "html", "*"], correct: 1,
    why: "A single class outranks any number of element selectors — specificity is not decimal." },
  { prompt: "The last-resort override you should avoid.", lang: 'css',
    code: 'color: red ___;', opts: ["!force", "!important", "!override", "!win"], correct: 1,
    why: "The only way to beat it later is another !important — an arms race." },
  { prompt: "Which property is inherited by children?", lang: 'css',
    code: 'body { ___: #14201E; }   /* children get this free */', opts: ["padding", "border", "color", "background"], correct: 2,
    why: "Typography inherits; box properties do not — otherwise every child would redraw the border." }
],
"css:3": [
  { prompt: "Make width include padding and border.", lang: 'css',
    code: '*, *::before, *::after { box-sizing: ___; }', opts: ["content-box", "border-box", "padding-box", "margin-box"], correct: 1,
    why: "Then width: 300px means the element really occupies 300px." },
  { prompt: "10px top and bottom, 24px left and right.", lang: 'css',
    code: 'padding: ___;', opts: ["10px 24px", "24px 10px", "10px 24px 10px", "10px"], correct: 0,
    why: "Two values are vertical then horizontal. Four values run clockwise: T R B L." },
  { prompt: "Space children without margins collapsing.", lang: 'css',
    code: 'display: flex;\nflex-direction: column;\n___: 20px;', opts: ["margin", "spacing", "gap", "padding"], correct: 2,
    why: "gap sits between items only — never at the ends, and it never collapses." }
],
"css:4": [
  { prompt: "A unit that scales with the user's browser setting.", lang: 'css',
    code: 'font-size: 1.5___;', opts: ["px", "pt", "rem", "em"], correct: 2,
    why: "rem is relative to the root, so it honours a raised base font size without compounding." },
  { prompt: "Fluid type with a floor and a ceiling.", lang: 'css',
    code: 'font-size: ___(1.5rem, 1rem + 2.5vw, 3rem);', opts: ["minmax", "range", "clamp", "fit"], correct: 2,
    why: "Minimum, preferred, maximum — one declaration replacing several media queries." },
  { prompt: "Cap a text column at a readable measure.", lang: 'css',
    code: 'max-width: 65___;', opts: ["px", "ch", "em", "%"], correct: 1,
    why: "ch is the width of a '0', so 60–75ch lands near the ideal characters-per-line." }
],
"css:5": [
  { prompt: "The colour notation you can reason about.", lang: 'css',
    code: 'color: ___(174 79% 27%);', opts: ["rgb", "hex", "hsl", "cmyk"], correct: 2,
    why: "Hue, saturation, lightness — vary only lightness and you get a coherent palette." },
  { prompt: "Make the border follow the text colour automatically.", lang: 'css',
    code: 'border: 1px solid ___;', opts: ["inherit", "currentColor", "auto", "textColor"], correct: 1,
    why: "One :hover { color: white } then updates text and border together." },
  { prompt: "Minimum contrast ratio for body text.", lang: 'text',
    code: 'contrast(text, background) >= ___', opts: ["2:1", "3:1", "4.5:1", "7:1"], correct: 2,
    why: "3:1 covers large text and UI borders; body copy needs 4.5:1." }
]

};


