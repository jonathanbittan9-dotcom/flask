/**
 * 21_modules.js — import/export, type="module", and module scope.
 *
 * THIS FILE IS A REFERENCE, not something you run with `node 21_modules.js`
 * directly (it would fail — see section 5 for why). Read it, then try the
 * three-file example described in section 6.
 */

// ---------------------------------------------------------------------------
// 1. Named vs default exports
// ---------------------------------------------------------------------------
// // math.js
// export function add(a, b) { return a + b; }      // named export — can have many per file
// export function subtract(a, b) { return a - b; }
// export const PI = 3.14159;
//
// export default function multiply(a, b) { return a * b; }  // default — at most ONE per file
//
// // main.js
// import multiply, { add, subtract, PI } from "./math.js";   // default has no { }, named do
// import { add as sum } from "./math.js";                     // rename on the way in
// import * as math from "./math.js";                          // grab everything as one object
//
// Prefer NAMED exports as your default habit — they force an explicit name
// at both ends, which makes "find every usage" (and refactoring tools)
// actually work. Reserve `export default` for a file whose whole purpose
// IS one thing, like a single component or a single class.

// ---------------------------------------------------------------------------
// 2. <script type="module"> and defer semantics
// ---------------------------------------------------------------------------
// <script type="module" src="/static/js/main.js"></script>
//
// Setting type="module" does three things automatically:
//   - Enables import/export syntax at all (a plain <script> can't use it)
//   - Behaves like `defer` was set — runs after the HTML is parsed, and
//     preserves order relative to other module scripts
//   - Runs in STRICT mode automatically (see section 3)

// ---------------------------------------------------------------------------
// 3. Module scope and strict mode by default
// ---------------------------------------------------------------------------
// A plain <script> puts everything it declares at the top level into the
// GLOBAL scope — two plain scripts can accidentally collide on a variable
// name. Inside a module, top-level declarations are scoped to THAT FILE
// only — nothing leaks out unless you explicitly `export` it. This is the
// real fix for "my two scripts are stepping on each other's variables,"
// not a coding-discipline workaround.
//
// Strict mode (automatic in modules) turns several silent JS mistakes into
// loud errors instead — assigning to an undeclared variable, duplicate
// parameter names, and a few others. It's the same category of tradeoff as
// `let`/`const` throwing instead of `var`'s silent `undefined`.

// ---------------------------------------------------------------------------
// 4. Circular imports
// ---------------------------------------------------------------------------
// a.js imports from b.js, and b.js imports from a.js — legal, but the
// value you get from the circular import may be incomplete/undefined
// depending on WHEN in each file's execution the import is read, because
// one of the two files is necessarily still mid-evaluation when the other
// asks for it. It's rare enough not to worry about proactively — just know
// the symptom ("works sometimes, undefined other times, no error") if it
// ever happens.

// ---------------------------------------------------------------------------
// 5. Why file:// breaks modules and a server doesn't
// ---------------------------------------------------------------------------
// Browsers block ES module imports over the file:// protocol as a security
// measure — the same reason 20_fetch_flask_api.js needs a real server.
// Modules only work when the page is actually served over http:// (or
// https://) — exactly what `python hello.py` gives you. This is also why
// this specific file can't just be `node`-run like files 01-11 and 16-19:
// it uses import/export syntax with no module system wired up around it,
// and demonstrates concepts (like <script type="module">) that only mean
// anything on an actual served page.

// ---------------------------------------------------------------------------
// 6. Try it for real, in three small files
// ---------------------------------------------------------------------------
// In this folder, create:
//
//   greetings.mjs
//     export function greet(name) { return `Hello, ${name}!`; }
//
//   main.mjs
//     import { greet } from "./greetings.mjs";
//     console.log(greet("Itay"));
//
// Then run:  node main.mjs
// The .mjs extension tells Node "treat this file as a module" without
// needing a full project setup — the fastest way to see import/export
// actually work outside a browser.

console.log("This file is reference material — see section 6 for a runnable example.");
console.log("Next: 22_where_to_go_next.md");
