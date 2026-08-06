/**
 * 02_variables.js — let, const, var, and naming.
 *
 * Run it:
 *     node 02_variables.js
 */

// ---------------------------------------------------------------------------
// 1. The rule: const by default, let when you must reassign
// ---------------------------------------------------------------------------
const name = "Itay";     // NEW: cannot be reassigned after this line
let count = 0;            // NEW: can be reassigned
count = count + 1;
var old = "avoid this";   // NEW: legacy — see section 3

console.log(name, count, old);

// Reach for `const` first. Switch to `let` only when you genuinely need to
// reassign. This isn't style pedantry — `const` tells a reader "this name
// will never point at something else," which removes a whole category of
// "where did this change?" questions. Python has no equivalent of this:
// `NAME = "itay"` in Python is just a convention everyone has to honor by
// hand; JavaScript's `const` is enforced by the engine.

// ---------------------------------------------------------------------------
// 2. const locks the BINDING, not the value
// ---------------------------------------------------------------------------
const hobbies = ["gaming", "coding"];
hobbies.push("reading");        // fine — same array, new contents
console.log("hobbies:", hobbies);

try {
  hobbies = ["other"];          // TypeError: Assignment to constant variable
} catch (e) {
  console.log("reassigning hobbies failed:", e.message);
}

// `const` only stops you from pointing `hobbies` at a DIFFERENT array or
// value. The array itself is still fully mutable — .push(), .pop(), direct
// index assignment all work. Same story for objects (file 09).

// ---------------------------------------------------------------------------
// 3. Why var is out
// ---------------------------------------------------------------------------
// - `var` is scoped to the whole FUNCTION, ignoring { } blocks. `let` and
//   `const` are scoped to the block — what you'd expect coming from Python's
//   indentation-based blocks (though Python doesn't even have block scope —
//   an `if` doesn't create a new scope there at all).
// - `var` allows silently redeclaring the same name. `let` makes that an
//   error.
// - `var` is "hoisted" and reads as `undefined` before its line runs. `let`
//   and `const` throw instead — a far more useful failure, because a loud
//   crash beats a silent wrong answer.

function scopeDemo() {
  if (true) {
    let blockScoped = "only visible inside this if";
    var functionScoped = "visible for the whole function";
  }
  // blockScoped is NOT visible here — would throw ReferenceError.
  console.log("functionScoped leaked out:", functionScoped);
}
scopeDemo();

// ---------------------------------------------------------------------------
// 4. Naming conventions
// ---------------------------------------------------------------------------
// - camelCase for variables and functions   (JS)   vs   snake_case (Python)
// - PascalCase for classes                  (same idea as Python)
// - SCREAMING_SNAKE_CASE for true constants (same idea as Python)
// - Names are case-sensitive, may contain letters, digits, `_` and `$`, and
//   cannot start with a digit.

const userName = "itay";          // not user_name
const MAX_RETRIES = 3;
class HttpClient {}                // not Http_client or http_client

console.log(userName, MAX_RETRIES, HttpClient.name);

console.log("\nNext: 03_types_and_coercion.js");
