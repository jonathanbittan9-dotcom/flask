# JavaScript mastery — beginner to advanced

Companion series to `core_language_mastery.py`. Same idea, different language:
one file per subject, run it, read the comments, see the output. Where a
concept has a Python equivalent (from `hello.py` / `core_language_mastery.py`)
the comments say so explicitly — you already know more than it feels like.

## How to run these

Most files (01–11, 16–19, 21) are plain JavaScript with no browser needed.
Install Node.js (https://nodejs.org, any LTS version), then from this folder:

```powershell
node 01_where_js_runs.js
```

Files 12–15 and 20 touch the DOM (the page itself) or `fetch` (network calls),
which only exist **in a browser**, not in Node. Those come with instructions
at the top of the file: open `demo.html` in a browser, open DevTools (F12) →
Console, and paste the code there, or link the file with a `<script>` tag.

## The roadmap

**Beginner — the language itself**
| # | File | Subject |
|---|------|---------|
| 01 | `01_where_js_runs.js` | Where JS runs, how it differs from Flask/Python, the console as your workbench |
| 02 | `02_variables.js` | `let`, `const`, `var`, naming rules |
| 03 | `03_types_and_coercion.js` | The 7 types, `typeof`, `==` vs `===`, coercion |
| 04 | `04_operators_and_truthiness.js` | Arithmetic, `&&`/`||`/`??`, optional chaining |
| 05 | `05_conditionals.js` | `if/else`, ternary, `switch`, truthiness traps |
| 06 | `06_loops.js` | `for...of`, `for...in`, classic `for`, `while` |

**Intermediate — building blocks**
| # | File | Subject |
|---|------|---------|
| 07 | `07_functions.js` | Declarations, expressions, arrows, defaults, rest/spread |
| 08 | `08_arrays.js` | `map`/`filter`/`reduce`/`find`, mutating vs returning |
| 09 | `09_objects_and_destructuring.js` | Objects, destructuring, spread, shallow-copy traps |
| 10 | `10_scope_and_closures.js` | Scope chain, closures, the classic loop bug |
| 11 | `11_strings_and_templates.js` | Template literals, string methods, a first regex |

**The browser — where JS actually lives**
| # | File | Subject |
|---|------|---------|
| 12 | `12_dom_selecting.js` | `querySelector`, traversal — needs `demo.html` |
| 13 | `13_dom_changing.js` | Editing text/attributes/classes, `textContent` vs `innerHTML` |
| 14 | `14_events.js` | `addEventListener`, bubbling, delegation, `preventDefault` |
| 15 | `15_forms.js` | Reading input, `FormData`, live validation |

**Advanced — real programs**
| # | File | Subject |
|---|------|---------|
| 16 | `16_classes.js` | `class`, `this`, `extends`, private fields |
| 17 | `17_errors.js` | `throw`/`try/catch`, custom errors |
| 18 | `18_promises.js` | The event loop, callbacks, `Promise`, `.then` |
| 19 | `19_async_await.js` | `async`/`await` syntax over promises |
| 20 | `20_fetch_flask_api.js` | Calling `hello.py`'s routes with `fetch` — needs a browser + `python hello.py` running |
| 21 | `21_modules.js` | `import`/`export`, `type="module"` |
| 22 | `22_where_to_go_next.md` | npm, bundlers, frameworks, TypeScript — an honest map |

Work through them in order — each one assumes everything above it. Cross off
a topic mentally once you can explain it without looking, not just once
you've run the file.
