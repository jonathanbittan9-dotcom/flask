COURSE.js = {
  name: "JavaScript",
  side: "client",
  lessons: [

/* ── 01 ─────────────────────────────────────────────── */
{
  t: "Where JavaScript runs",
  sub: "The other half of a web app — code that executes in the visitor's browser, after Flask has finished.",
  blocks: [
    ['p', "Flask runs on **your machine** and produces HTML. JavaScript runs on the **visitor's machine**, inside their browser, after that HTML arrives. Two different computers, two different moments in time. Almost every beginner confusion about web development traces back to blurring those two."],
    ['tbl',
      ["", "Python / Flask", "JavaScript"],
      [
        ["Runs on", "your server", "the visitor's browser"],
        ["Runs when", "a request arrives", "after the page loads"],
        ["Can see", "the database, the filesystem, secrets", "only what you sent to the page"],
        ["Can do", "anything on the server", "change the page without reloading it"],
        ["Visible to the user", "never", "**entirely** — View Source shows it all"]
      ]
    ],
    ['warn', "Never put a secret in JavaScript. Anyone can read it with two clicks. API keys, passwords and database credentials belong in `os.environ` on the server side."],
    ['h', "Getting JS onto a page"],
    ['code', 'html', `<\!-- inline: fine for learning -->
<script>
  console.log("hello from the browser");
<\/script>

<\!-- external: what real projects use -->
<script src="/static/js/app.js"><\/script>`],
    ['p', "Put `<script>` tags just before `</body>`, or add the `defer` attribute. A script in the `<head>` runs before the HTML below it exists, so it will not find the elements it is trying to touch."],
    ['h', "The console is your workbench"],
    ['p', "Press **F12** in your browser and pick the Console tab. You can type JavaScript there and see it run instantly. `console.log(...)` from your code prints there too — it is the browser's equivalent of `print()`."],
    ['lab', 'js', `// Press Run. Then edit and run again.
console.log("hello from the browser");
console.log(2 + 2);
console.log("Flask runs on the server, this does not");`],
    ['h', "Where the two meet"],
    ['p', "The connection point is data. Flask sends JSON, JavaScript asks for it with `fetch`, and the page updates without reloading. That is the goal this track builds toward — lesson 20 wires it directly to your Flask app."]
  ],
  ex: [
    { q: "Open the browser console with F12, type `2 + 2` and press Enter. Then type `console.log(2 + 2)`. Why does the second one show two lines?",
      hint: "The console prints both what the expression evaluated to and what the code logged.",
      a: "Typing `2 + 2` shows `4` — the console echoes the value of the last expression. `console.log(2 + 2)` prints `4`, then shows `undefined`, because `console.log` **returns** nothing after printing. That distinction between “printed” and “returned” matters a lot later." },
    { q: "In the live editor above, add `console.log(typeof console.log)`. What comes back?",
      a: "`\"function\"`. In JavaScript functions are values you can inspect, pass around and store in variables — a fact lesson 07 leans on heavily." },
    { q: "In `hello.py`'s `home()` you compute `hobbies` in Python. Could JavaScript read that variable directly? Explain.",
      hint: "Which machine is each one on?",
      a: "No. By the time the browser runs any JavaScript, your Python function has already finished and the server has moved on — the variable no longer exists anywhere the browser can reach. The only things JS can see are what Flask actually *sent*: the rendered HTML, and anything you deliberately embed as data or expose through an API endpoint." },
    { q: "Add a `<script>` tag to `templates/home.html` that logs the page title. Put it in the `<head>` first, then move it before `</body>`. What changes?",
      hint: "`document.title` exists early; a `<h1>` does not.",
      a: "`document.title` works in both positions because `<title>` is in the head and already parsed. But try `document.querySelector(\"h1\").textContent` from the head and you get `TypeError: ... is null` — the `<h1>` has not been parsed yet. Moving the script to just before `</body>` fixes it, and so does adding `defer` to a `<script src=...>` tag." },
    { q: "Name one job that must be done in Flask, one that must be done in JavaScript, and one that could sensibly go either way.",
      a: "**Must be Flask**: checking a password, reading the database, anything involving a secret — because the browser cannot be trusted. **Must be JavaScript**: reacting to a click, showing/hiding an element, validating a field as the user types — the server is not involved. **Either**: form validation, which in practice belongs in *both* — JavaScript for instant feedback, Flask for actual enforcement, because a determined visitor can bypass anything client-side." }
  ]
},

/* ── 02 ─────────────────────────────────────────────── */
{
  t: "Variables: let and const",
  sub: "Three ways to declare a variable, only two of which you should use.",
  blocks: [
    ['code', 'js', `const name = "Itay";     // cannot be reassigned
let count = 0;           // can be reassigned
count = count + 1;
var old = "avoid this";  // legacy — see below`],
    ['h', "The rule"],
    ['p', "**Reach for `const` by default. Switch to `let` only when you genuinely need to reassign.** This is not style pedantry: `const` tells a reader that a name will never point at something else, which removes a whole category of “where did this change?” questions."],
    ['h', "`const` does not mean frozen"],
    ['p', "`const` locks the **binding**, not the value. An object or array held by a `const` can still be modified — you just cannot point the name at a different object:"],
    ['code', 'js', `const hobbies = ["gaming", "coding"];
hobbies.push("reading");   // fine — same array, new contents
console.log(hobbies);      // ["gaming", "coding", "reading"]

hobbies = ["other"];       // TypeError: Assignment to constant variable`],
    ['note', "Python has no equivalent. In Python you would write `HOBBIES = [...]` in capitals and trust everyone to behave. JavaScript enforces the binding — but not the contents."],
    ['h', "Why `var` is out"],
    ['ul', [
      "`var` is scoped to the whole **function**, ignoring `{ }` blocks. `let` and `const` are scoped to the block, which is what you expect.",
      "`var` allows redeclaring the same name silently. `let` makes it an error.",
      "`var` is *hoisted* and readable as `undefined` before its line runs. `let` and `const` throw instead — a far more useful failure."
    ]],
    ['lab', 'js', `// Block scope: run this, then change let to var and run again.
if (true) {
  let inner = "block-scoped";
  console.log("inside:", inner);
}
try {
  console.log("outside:", inner);
} catch (e) {
  console.log("outside:", e.name, "-", e.message);
}`],
    ['h', "Naming"],
    ['ul', [
      "`camelCase` for variables and functions — not Python's `snake_case`.",
      "`PascalCase` for classes.",
      "`SCREAMING_SNAKE` for true module-level constants.",
      "Names are case-sensitive, may contain letters, digits, `_` and `$`, and cannot start with a digit."
    ]]
  ],
  ex: [
    { q: "Declare `const total = 10`, then try `total = 20`. What exact error appears?",
      a: "`TypeError: Assignment to constant variable.` — and note that it is a runtime error, thrown when the assignment line executes, not when the file is parsed." },
    { q: "Predict, then check: does `const list = [1, 2]; list.push(3);` throw?",
      hint: "What is `const` protecting — the name or the contents?",
      a: "It does not throw. `list` still refers to the same array; only its contents changed. To make the contents immutable too you would need `Object.freeze(list)`, after which `push` fails silently in loose mode and throws in strict mode." },
    { q: "In the live editor, run the block-scope example with `let`, then change it to `var`. Explain both results.",
      hint: "Which of the two respects `{ }`?",
      a: "With `let`, the outer read throws `ReferenceError: inner is not defined` — the binding died with the block. With `var`, the outer read prints `\"block-scoped\"`, because `var` ignores the `if` block entirely and attaches to the enclosing function or module scope. That leak is exactly why `var` was replaced." },
    { q: "What does this print, and what is the term for the behaviour?",
      hint: "`let` bindings exist but are unreachable before their declaration.",
      a: "`ReferenceError: Cannot access 'x' before initialization`. The region between the top of the block and the declaration is called the **temporal dead zone**. With `var` you would instead get `undefined` printed — a silent wrong answer rather than a loud error, which is worse.",
      code: ['js', `console.log(x);
let x = 5;`] },
    { q: "Rewrite this Python snippet in JavaScript, choosing `let` or `const` correctly for each name.",
      hint: "Which of the three names is ever reassigned?",
      a: "`greeting` and `hobbies` never get reassigned, so both are `const` — even though `hobbies` gets a new element pushed into it. Only `count` changes what it points at, so only `count` needs `let`.",
      code: ['js', `const greeting = "shalom";
const hobbies = ["gaming"];
let count = 0;

hobbies.push("coding");
count = hobbies.length;

console.log(greeting, hobbies, count);`] }
  ]
},

/* ── 03 ─────────────────────────────────────────────── */
{
  t: "Types and coercion",
  sub: "Seven types, and the automatic conversions that make JavaScript infamous.",
  blocks: [
    ['h', "The primitives"],
    ['tbl',
      ["Type", "Example", "Python equivalent"],
      [
        ["`string`", "`\"hi\"`, `'hi'`, `` `hi` ``", "`str`"],
        ["`number`", "`42`, `3.14`, `-0.5`", "`int` **and** `float` — JS has one numeric type"],
        ["`boolean`", "`true`, `false`", "`True`, `False` (lowercase in JS)"],
        ["`undefined`", "a variable declared but never assigned", "roughly `None`, but see below"],
        ["`null`", "a deliberate “no value”", "`None`"],
        ["`bigint`", "`9007199254740993n`", "Python's unbounded `int`"],
        ["`symbol`", "`Symbol(\"id\")`", "no equivalent"]
      ]
    ],
    ['p', "Everything else — arrays, functions, dates, `{}` — is an **object**."],
    ['h', "`undefined` vs `null`"],
    ['ul', [
      "`undefined` — the language's “nobody set this”: an unassigned variable, a missing argument, an absent object property, a function with no `return`.",
      "`null` — *your* “deliberately empty”. JavaScript never produces it on its own.",
      "Practical rule: read both, but only ever write `null`."
    ]],
    ['h', "`typeof`"],
    ['code', 'js', `typeof "hi"        // "string"
typeof 42          // "number"
typeof true        // "boolean"
typeof undefined   // "undefined"
typeof null        // "object"   <- a famous 1995 bug, never fixed
typeof [1, 2]      // "object"   <- use Array.isArray() instead
typeof console.log // "function"`],
    ['h', "Coercion — the part with the bad reputation"],
    ['p', "JavaScript converts types automatically when an operator needs it to. `+` is the troublemaker, because it means both addition and string concatenation:"],
    ['lab', 'js', `console.log("5" + 3);     // ?
console.log("5" - 3);     // ?
console.log(1 + "2" + 3); // ?
console.log(1 + 2 + "3"); // ?
console.log([] + {});     // ?`],
    ['p', "The rule for `+`: if **either** side is a string, it concatenates. Every other arithmetic operator converts to number instead. So `\"5\" + 3` is `\"53\"` but `\"5\" - 3` is `2`."],
    ['warn', "Python raises `TypeError` for `\"5\" + 3`. JavaScript silently produces `\"53\"`. This is the single biggest source of confusing bugs when moving between the two languages."],
    ['h', "`==` vs `===`"],
    ['code', 'js', `"5" == 5      // true   — coerces before comparing
"5" === 5     // false  — different types, done
null == undefined    // true
null === undefined   // false
0 == ""       // true (!)
NaN === NaN   // false (!)`],
    ['note', "**Always use `===` and `!==`.** The only defensible use of `==` is `x == null`, which conveniently tests for `null` *or* `undefined` at once."],
    ['h', "Converting on purpose"],
    ['code', 'js', `Number("42")       // 42
Number("beans")    // NaN
parseInt("42px")   // 42   — stops at the first non-digit
String(42)         // "42"
Boolean("")        // false`]
  ],
  ex: [
    { q: "Run the coercion lab above and explain each of the five results.",
      hint: "`+` concatenates if either side is a string; other operators convert to number.",
      a: "`\"5\" + 3` → `\"53\"` (concatenation). `\"5\" - 3` → `2` (`-` has no string meaning, so it converts). `1 + \"2\" + 3` → `\"123\"` — left to right: `1 + \"2\"` is `\"12\"`, then `\"12\" + 3` is `\"123\"`. `1 + 2 + \"3\"` → `\"33\"`, because `1 + 2` is `3` *before* the string appears. `[] + {}` → `\"[object Object]\"`, as both convert to strings." },
    { q: "Why is `typeof null` equal to `\"object\"`, and what should you use instead to detect an array?",
      a: "It is a bug from the first implementation of JavaScript in 1995 — `null` was represented with a type tag of zero, the same tag used for objects. Fixing it would break too much existing code. For arrays, use `Array.isArray([1,2])` → `true`, since `typeof` cannot distinguish them from plain objects." },
    { q: "List the falsy values in JavaScript. How many are there?",
      hint: "Everything not on the list is truthy.",
      a: "Exactly seven: `false`, `0`, `-0`, `0n`, `\"\"`, `null`, `undefined`, `NaN` (eight if you count `-0` and `0` separately). Crucially, `[]` and `{}` are **truthy** — unlike Python, where an empty list and an empty dict are falsy. `if (myArray)` is therefore always true; you want `if (myArray.length)`." },
    { q: "Predict each: `0 == \"\"`, `0 === \"\"`, `null == undefined`, `null === undefined`, `NaN === NaN`.",
      a: "`true`, `false`, `true`, `false`, `false`. The last one is deliberate — `NaN` is defined as not equal to anything, including itself. Test for it with `Number.isNaN(x)`." },
    { q: "Write a `toNumber(value, fallback = 0)` that converts a string to a number and returns the fallback for anything that will not convert.",
      hint: "`Number(\"beans\")` gives `NaN`, and `NaN` fails every comparison.",
      a: "`Number.isNaN` is the safe check — the older global `isNaN` coerces first, so `isNaN(\"beans\")` is `true` but `isNaN(\"\")` is `false`, which is rarely what you want. This is the JavaScript counterpart of `request.args.get(\"n\", 1, type=int)` on the Flask side.",
      code: ['js', `function toNumber(value, fallback = 0) {
  const n = Number(value);
  return Number.isNaN(n) ? fallback : n;
}

console.log(toNumber("42"));     // 42
console.log(toNumber("beans"));  // 0
console.log(toNumber("3.5", 1)); // 3.5`] }
  ]
},

/* ── 04 ─────────────────────────────────────────────── */
{
  t: "Operators and truthiness",
  sub: "Arithmetic, logic, and the short-circuit tricks that show up in every real codebase.",
  blocks: [
    ['h', "Arithmetic"],
    ['code', 'js', `10 + 3    // 13
10 - 3    // 7
10 * 3    // 30
10 / 3    // 3.3333333333333335   <- no integer division
10 % 3    // 1
10 ** 3   // 1000

Math.floor(10 / 3)   // 3   — Python's // is spelled like this
Math.round(3.7)      // 4
Math.max(1, 9, 4)    // 9`],
    ['warn', "There is no `//` operator. `10 / 3` always produces a float, because JavaScript has exactly one number type. And `0.1 + 0.2 === 0.3` is `false` — that is IEEE-754 floating point, identical in Python."],
    ['h', "Comparison and logic"],
    ['code', 'js', `a === b    a !== b    a < b    a >= b

a && b     // AND — Python's "and"
a || b     // OR  — Python's "or"
!a         // NOT — Python's "not"`],
    ['h', "Short-circuit: they return a value, not a boolean"],
    ['p', "Just like Python, `&&` and `||` hand back one of their operands rather than `true`/`false`. This is used constantly:"],
    ['code', 'js', `const name = userName || "anonymous";   // fallback if falsy
user.isAdmin && showAdminPanel();      // run only if truthy`],
    ['warn', "`||` treats **every** falsy value as missing — including `0` and `\"\"`. `const count = userCount || 10` turns a legitimate `0` into `10`. This is a real bug people ship."],
    ['h', "`??` — nullish coalescing"],
    ['p', "The fix. `??` falls back only for `null` and `undefined`, leaving `0` and `\"\"` alone:"],
    ['lab', 'js', `const count = 0;
console.log("with ||:", count || 10);   // 10  — wrong
console.log("with ??:", count ?? 10);   // 0   — right

const missing = undefined;
console.log("missing ??:", missing ?? 10);  // 10`],
    ['h', "Optional chaining `?.`"],
    ['code', 'js', `const city = user.address.city;      // TypeError if address is undefined
const city = user.address?.city;    // undefined instead of throwing
const city = user.address?.city ?? "unknown";`],
    ['p', "`?.` and `??` pair naturally: reach in safely, then supply a default. Together they replace most defensive `if` chains."],
    ['h', "Assignment shorthands"],
    ['code', 'js', `count += 1;    count++;     // increment
total *= 2;
name ||= "anon";     // assign if falsy
name ??= "anon";     // assign if null/undefined`],
    ['note', "There is no `++` in Python, and JavaScript has both `count++` (return then increment) and `++count` (increment then return). When in doubt use `count += 1` — it is unambiguous."]
  ],
  ex: [
    { q: "Predict `7 / 2`, `Math.floor(7 / 2)`, `7 % 2` and `-7 % 2`. Which one differs from Python?",
      hint: "Think about the sign of the remainder.",
      a: "`3.5`, `3`, `1`, and `-1`. The last one differs: Python's `-7 % 2` is `1`, because Python's modulo takes the sign of the **divisor**, while JavaScript's takes the sign of the **dividend**. This bites when doing wrap-around index maths with negative numbers." },
    { q: "Why does `const port = userPort || 5000` misbehave when `userPort` is `0`, and how do you fix it?",
      a: "`0` is falsy, so `||` discards it and you get `5000` — even though `0` was a real value the user supplied. Use `const port = userPort ?? 5000`, which only falls back for `null` and `undefined`." },
    { q: "Run the `??` lab, then add a case where `||` and `??` behave identically. When are they the same?",
      hint: "Which values are falsy but not nullish?",
      a: "They differ only for `0`, `-0`, `0n`, `\"\"`, `false` and `NaN` — falsy values that are not nullish. For every other value, including `null`, `undefined`, and anything truthy, the two produce the same answer. Try `const x = null; x || \"d\"` and `x ?? \"d\"` — both give `\"d\"`." },
    { q: "Rewrite this defensive chain as a single line using `?.` and `??`.",
      hint: "Optional chaining stops the whole chain the moment it hits null or undefined.",
      a: "The chain short-circuits to `undefined` at the first missing link, and `??` supplies the default. Note that `?.` protects only the property access immediately after it — `a?.b.c` still throws if `b` is undefined, so chain it at every uncertain step.",
      code: ['js', `// before
let city;
if (user && user.address && user.address.city) {
  city = user.address.city;
} else {
  city = "unknown";
}

// after
const city = user?.address?.city ?? "unknown";`] },
    { q: "Explain what `isAdmin && render()` does and why it appears so often in real code. What is its risk?",
      a: "`&&` evaluates the left side and, if falsy, returns it immediately **without** evaluating the right — so `render()` runs only when `isAdmin` is truthy. It is a compact conditional call. The risk is that the whole expression evaluates to the left operand when it is falsy, so in a context that renders its result (like a UI framework), `count && <List/>` with `count === 0` renders a literal `0` on the page. Convert to a real boolean with `count > 0 && ...` to avoid it." }
  ]
},

/* ── 05 ─────────────────────────────────────────────── */
{
  t: "Conditionals",
  sub: "`if`, `else if`, the ternary, and `switch` — with the truthiness traps that catch Python developers.",
  blocks: [
    ['code', 'js', `if (age >= 18) {
  console.log("adult");
} else if (age >= 13) {
  console.log("teen");
} else {
  console.log("child");
}`],
    ['ul', [
      "Parentheses around the condition are **required**.",
      "Braces define the block. Indentation means nothing to the parser.",
      "It is `else if`, two words — not Python's `elif`.",
      "No colon at the end of the line."
    ]],
    ['warn', "Braces are technically optional for a single statement, but omitting them causes real bugs when someone later adds a second line. Always use them."],
    ['h', "Truthiness, and where it differs from Python"],
    ['p', "`if (value)` converts `value` to a boolean. The falsy list is short — everything else is truthy:"],
    ['tbl',
      ["Value", "JavaScript", "Python"],
      [
        ["`0`", "falsy", "falsy"],
        ["`\"\"`", "falsy", "falsy"],
        ["`null` / `None`", "falsy", "falsy"],
        ["`[]`", "**truthy**", "falsy"],
        ["`{}`", "**truthy**", "falsy"],
        ["`\"0\"`", "**truthy**", "truthy"],
        ["`NaN`", "falsy", "—"]
      ]
    ],
    ['lab', 'js', `// Empty collections are TRUTHY in JavaScript.
if ([]) console.log("[] is truthy — surprising if you know Python");
if ({}) console.log("{} is truthy too");

const hobbies = [];
if (hobbies.length) {
  console.log("has hobbies");
} else {
  console.log("empty — check .length, not the array itself");
}`],
    ['p', "This is why `{% if hobbies %}` works as expected in your Jinja template (Jinja follows Python's rules) but the equivalent `if (hobbies)` in JavaScript would always be true. Check `.length` instead."],
    ['h', "The ternary"],
    ['code', 'js', `const label = count === 1 ? "item" : "items";

// Python's version reads in a different order:
// label = "item" if count == 1 else "items"`],
    ['p', "Condition first, then `?`, then the true value, then `:`, then the false value. Use it for a value; use a real `if` for a branch that *does* things."],
    ['h', "`switch`"],
    ['code', 'js', `switch (method) {
  case "GET":
    handleGet();
    break;
  case "POST":
  case "PUT":
    handleWrite();
    break;
  default:
    handleUnknown();
}`],
    ['warn', "Forget `break` and execution **falls through** into the next case. It is occasionally useful (as with `POST`/`PUT` above) but far more often a bug. `switch` also compares with `===`, so `case \"5\"` never matches the number `5`."]
  ],
  ex: [
    { q: "Write an `if/else if/else` that prints “empty”, “one” or “many” based on an array's length.",
      a: "Note `list.length` rather than `list` — the array itself is always truthy.",
      code: ['js', `const list = ["a", "b"];

if (list.length === 0) {
  console.log("empty");
} else if (list.length === 1) {
  console.log("one");
} else {
  console.log("many");
}`] },
    { q: "Why does `if ([])` run its block in JavaScript but `if []:` not run in Python?",
      a: "JavaScript's truthiness is defined by a fixed list of falsy values, and empty objects and arrays are not on it — every object is truthy. Python instead asks the object itself via `__bool__`/`__len__`, and a zero-length container reports false. So in JS you must ask about length explicitly." },
    { q: "Convert this to a ternary, then say when you would *not* do that.",
      hint: "Assigning one of two values is the ternary's job.",
      a: "Ternaries are for producing a **value**. Do not use one when the branches perform actions rather than yield values, and do not nest them more than one deep — nested ternaries are notoriously hard to read.",
      code: ['js', `// before
let status;
if (code === 200) { status = "ok"; } else { status = "error"; }

// after
const status = code === 200 ? "ok" : "error";`] },
    { q: "Predict the output, then run it. Explain the result.",
      hint: "Which comparison operator does `switch` use?",
      a: "It prints `\"no match\"`. `switch` compares with strict equality, so the string `\"5\"` never matches the number `5`. Either convert first with `Number(value)` or make the cases strings.",
      code: ['js', `const value = "5";
switch (value) {
  case 5:  console.log("number five"); break;
  default: console.log("no match");
}`] },
    { q: "Write a `describe(value)` that returns “missing” for `null`/`undefined`, “empty” for an empty string or empty array, and “present” otherwise. Explain your ordering.",
      hint: "You must test for nullish before you touch `.length`.",
      a: "Order matters: reading `.length` on `null` throws `TypeError`, so the nullish check has to come first. `value == null` with loose equality is the one idiomatic use of `==` — it catches `null` and `undefined` together.",
      code: ['js', `function describe(value) {
  if (value == null) return "missing";
  if (value.length === 0) return "empty";
  return "present";
}

console.log(describe(null));    // missing
console.log(describe(""));      // empty
console.log(describe([]));      // empty
console.log(describe("hi"));    // present`] }
  ]
},

/* ── 06 ─────────────────────────────────────────────── */
{
  t: "Loops",
  sub: "`for...of`, `for...in`, classic `for`, and `while` — plus which one you should actually reach for.",
  blocks: [
    ['h', "`for...of` — the one you want"],
    ['p', "This is the direct equivalent of Python's `for x in list:`. It iterates over **values**:"],
    ['code', 'js', `const hobbies = ["gaming", "coding", "reading"];

for (const hobby of hobbies) {
  console.log(hobby);
}`],
    ['p', "`const` inside the loop head is correct — each iteration creates a fresh binding, so there is nothing to reassign."],
    ['h', "`for...in` — almost never what you want"],
    ['p', "It iterates over **keys**, and for an array those keys are string indices:"],
    ['lab', 'js', `const hobbies = ["gaming", "coding"];

for (const i in hobbies) {
  console.log(i, typeof i);      // "0" string, "1" string
}

for (const h of hobbies) {
  console.log(h);                // the actual values
}`],
    ['warn', "`for...in` on an array gives you `\"0\"`, `\"1\"` as **strings**, and also walks inherited properties. Use it only for plain objects, and prefer `Object.keys(obj)` even then."],
    ['h', "The classic `for`"],
    ['code', 'js', `for (let i = 0; i < hobbies.length; i++) {
  console.log(i, hobbies[i]);
}`],
    ['p', "Three parts separated by semicolons: initialise, test before each pass, run after each pass. Use `let`, not `const` — `i` is reassigned every iteration. Reach for it when you need the index, or need to skip or step unusually."],
    ['h', "`while` and `do...while`"],
    ['code', 'js', `let n = 3;
while (n > 0) {
  console.log(n);
  n--;
}

do {
  console.log("runs at least once");
} while (false);`],
    ['h', "Getting index and value together"],
    ['code', 'js', `for (const [i, hobby] of hobbies.entries()) {
  console.log(i, hobby);          // like Python's enumerate()
}

hobbies.forEach((hobby, i) => console.log(i, hobby));`],
    ['h', "`break` and `continue`"],
    ['p', "Both work as in Python. One important difference: `break` and `continue` do **not** work inside `forEach`, because each iteration is a separate function call. If you need to stop early, use `for...of`."],
    ['h', "Choosing"],
    ['tbl',
      ["Use", "When"],
      [
        ["`for...of`", "The default. Iterating values of an array, string, Map or Set"],
        ["`.entries()` in `for...of`", "You need the index too, and might `break`"],
        ["classic `for`", "Counting, stepping by 2, iterating backwards"],
        ["`for...in`", "Keys of a plain object — and even then `Object.keys` is clearer"],
        ["`while`", "The number of iterations is not known in advance"],
        ["`.map` / `.filter`", "You are building a new array — lesson 08"]
      ]
    ]
  ],
  ex: [
    { q: "Loop over `[\"gaming\", \"coding\", \"reading\"]` and print each with its 1-based position, like `1. gaming`.",
      hint: "`.entries()` gives `[index, value]` pairs.",
      a: "Destructuring the pair in the loop head is idiomatic — lesson 09 covers that syntax properly.",
      code: ['js', `const hobbies = ["gaming", "coding", "reading"];

for (const [i, hobby] of hobbies.entries()) {
  console.log(\`\${i + 1}. \${hobby}\`);
}`] },
    { q: "Run the `for...in` lab. Why does `typeof i` report `\"string\"`, and what breaks if you write `i + 1`?",
      a: "Array indices are object keys, and object keys are always strings. So `i + 1` concatenates: `\"0\" + 1` is `\"01\"`, not `1`. That silent wrongness is the main reason to avoid `for...in` on arrays." },
    { q: "Write a loop that prints every second number from 10 down to 0.",
      hint: "The classic `for` lets you control all three parts.",
      a: "This is exactly the case where the classic `for` beats `for...of` — you are generating numbers, not iterating a collection.",
      code: ['js', `for (let i = 10; i >= 0; i -= 2) {
  console.log(i);
}`] },
    { q: "Try to `break` out of a `.forEach()` loop when you find `\"coding\"`. What happens, and what should you use instead?",
      hint: "What is the callback, structurally?",
      a: "`SyntaxError: Illegal break statement`. Each iteration is a function call, and `break` cannot cross a function boundary. Use `for...of` when you need early exit — or `.find()` / `.some()`, which stop on their own.",
      code: ['js', `for (const h of hobbies) {
  if (h === "coding") { console.log("found it"); break; }
}`] },
    { q: "Write a loop that sums `[3, 1, 4, 1, 5]`, skipping any number below 2. Then say which array method would replace the whole thing.",
      hint: "`continue` skips to the next iteration.",
      a: "`hobbies.filter(n => n >= 2).reduce((a, b) => a + b, 0)` does the same in one line — lesson 08 covers those. The loop version is fine and often more readable; the point is knowing both exist.",
      code: ['js', `const nums = [3, 1, 4, 1, 5];
let total = 0;

for (const n of nums) {
  if (n < 2) continue;
  total += n;
}
console.log(total);   // 12`] }
  ]
},

/* ── planned ─────────────────────────────────────────── */
{ t: "Functions and arrow functions", sub: "Declarations, expressions, arrows, defaults, rest — and hoisting.",
  plan: "Four ways to define a function, when each is appropriate, and the argument-handling features that replace Python's `*args`/`**kwargs`.",
  covers: ["Declaration vs expression vs arrow", "Hoisting: why declarations can be called before their line", "Default parameters and rest `...args`", "Returning early; implicit arrow returns", "Functions as values passed to other functions"] },

{ t: "Arrays and their methods", sub: "`map`, `filter`, `reduce`, `find`, `some`, `every` — the core of modern JavaScript.",
  plan: "The methods you will use every day, plus the mutating-vs-returning distinction that decides whether your original array survives.",
  covers: ["`map`, `filter`, `reduce` with real examples", "`find`, `findIndex`, `some`, `every`, `includes`", "Mutating (`push`, `sort`, `splice`) vs returning (`slice`, `concat`)", "Chaining, and when it becomes unreadable", "Spread `...` for copying and merging"] },

{ t: "Objects and destructuring", sub: "Key–value data, the JS equivalent of a Python dict — and how to unpack it cleanly.",
  plan: "Creating, reading and updating objects; shorthand syntax; destructuring in assignments and function parameters; shallow vs deep copies.",
  covers: ["Dot vs bracket access, and when you need brackets", "`Object.keys/values/entries`", "Destructuring with renames and defaults", "Spread to copy and merge objects", "Shallow copy traps with nested data"] },

{ t: "Scope and closures", sub: "Why an inner function remembers the variables around it, long after the outer one has returned.",
  plan: "The concept that unlocks callbacks, event handlers and module patterns. Built up from block scope rather than stated as a definition.",
  covers: ["Global, function and block scope", "The scope chain and shadowing", "What a closure actually is", "The classic `var`-in-a-loop bug", "Closures for private state and counters"] },

{ t: "Strings and template literals", sub: "Backticks, interpolation, and the string methods worth memorising.",
  plan: "Template literals as the default quoting style, plus the search-and-transform methods that come up constantly.",
  covers: ["Backticks, `${...}`, multi-line strings", "`split`, `join`, `trim`, `replace`, `replaceAll`", "`includes`, `startsWith`, `slice`", "`padStart` for formatting numbers", "A first look at regular expressions"] },

{ t: "Selecting DOM elements", sub: "Reaching into the HTML that Flask rendered.",
  plan: "The DOM as a tree, and the query methods for finding nodes in it — the bridge between your Jinja templates and your JavaScript.",
  covers: ["`querySelector` / `querySelectorAll`", "Why a NodeList is not quite an array", "`getElementById` and when it still makes sense", "Traversal: `parentElement`, `children`, `closest`", "Why selection fails when the script runs too early"] },

{ t: "Changing the DOM", sub: "Text, attributes, classes and structure — updating a page without reloading it.",
  plan: "Everything that mutates the page, plus the security distinction between `textContent` and `innerHTML`.",
  covers: ["`textContent` vs `innerHTML` and XSS", "`classList` add/remove/toggle", "`setAttribute`, `dataset`, `style`", "`createElement` and `append`", "Batching changes to avoid layout thrash"] },

{ t: "Events", sub: "Responding to clicks, keys and input — how a page becomes interactive.",
  plan: "`addEventListener`, the event object, bubbling, delegation, and `preventDefault` — including intercepting a form submit before it reaches Flask.",
  covers: ["`addEventListener` and the event object", "Bubbling, capturing, `stopPropagation`", "Event delegation for dynamic content", "`preventDefault` on links and forms", "Removing listeners and avoiding leaks"] },

{ t: "Forms and input", sub: "Reading what someone typed, validating it, and deciding what to send.",
  plan: "Client-side form handling that complements — never replaces — the Flask-side validation from the forms lesson.",
  covers: ["Reading `input.value` and checkbox state", "The `submit` and `input` events", "`FormData` and serialising a form", "Live validation and error messaging", "Why the server must validate anyway"] },

{ t: "Classes", sub: "Constructors, methods, inheritance — and how they differ from Python's.",
  plan: "The `class` syntax, what it is really doing over prototypes, and the `this` rules that trip everyone up.",
  covers: ["`class`, `constructor`, methods", "`this` and why arrow functions behave differently", "`extends` and `super`", "Static members and `#private` fields", "Prototypes underneath the syntax"] },

{ t: "Errors and try/catch", sub: "Throwing, catching, and failing usefully.",
  plan: "The error model, custom error types, and why an empty `catch` block is the worst thing in your codebase.",
  covers: ["`throw`, `try/catch/finally`", "The built-in `Error` types", "Custom errors by extending `Error`", "Catching narrowly instead of swallowing", "Errors inside async code"] },

{ t: "Callbacks and promises", sub: "How JavaScript handles work that has not finished yet.",
  plan: "The event loop, why JS is single-threaded but not blocking, callback nesting, and the Promise API that replaced it.",
  covers: ["The event loop and the task queue", "Callbacks and callback hell", "`new Promise`, `.then`, `.catch`, `.finally`", "`Promise.all` / `allSettled` / `race`", "Why `setTimeout(fn, 0)` does not run immediately"] },

{ t: "async / await", sub: "Writing asynchronous code that reads top to bottom.",
  plan: "Syntax over promises, error handling with try/catch, and the sequential-vs-parallel decision that determines how fast your page feels.",
  covers: ["`async` functions always return a promise", "`await` and what it actually pauses", "`try/catch` around `await`", "Sequential awaits vs `Promise.all`", "Top-level await and its limits"] },

{ t: "fetch: calling your Flask API", sub: "The lesson where both tracks finally meet.",
  plan: "Call the JSON endpoints from the Flask track, render the results into the page, handle errors and loading states. This is the capstone for both sides.",
  covers: ["`fetch` with GET and JSON parsing", "POSTing JSON and setting headers", "Why `fetch` does not reject on a 404", "Rendering results into the DOM", "CORS, and why it does not bite on same-origin", "Loading and error states users can understand"] },

{ t: "Modules", sub: "Splitting your JavaScript across files without globals.",
  plan: "ES modules: `import`/`export`, `type=\"module\"`, and how module scope differs from script scope.",
  covers: ["Named vs default exports", "`<script type=\"module\">` and defer semantics", "Module scope and strict mode by default", "Circular imports", "Why file:// breaks modules and a server does not"] },

{ t: "Where to go next", sub: "Tooling, frameworks, and how to keep learning after this track.",
  plan: "An honest map of the ecosystem: what npm, bundlers and frameworks solve, which problems you do not have yet, and what to learn in what order.",
  covers: ["npm and `package.json`", "What a bundler is actually for", "When a framework earns its complexity", "TypeScript in one page", "Reading MDN effectively", "A realistic next project"] }

  ]
};

