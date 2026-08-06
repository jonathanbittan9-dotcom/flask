/**
 * 04_operators_and_truthiness.js — arithmetic, logic, &&/||/??, optional chaining.
 *
 * Run it:
 *     node 04_operators_and_truthiness.js
 */

// ---------------------------------------------------------------------------
// 1. Arithmetic
// ---------------------------------------------------------------------------
console.log(10 + 3);   // 13
console.log(10 - 3);   // 7
console.log(10 * 3);   // 30
console.log(10 / 3);   // 3.3333333333333335 — no integer division in JS
console.log(10 % 3);   // 1
console.log(10 ** 3);  // 1000

console.log(Math.floor(10 / 3));   // 3 — this is Python's `//`, spelled differently
console.log(Math.round(3.7));      // 4
console.log(Math.max(1, 9, 4));    // 9

// There is no `//` operator. `10 / 3` always produces a float, because
// JavaScript has exactly one number type. And just like Python's floats,
// 0.1 + 0.2 === 0.3 is false — that's IEEE-754 floating point, identical
// in both languages.
console.log(0.1 + 0.2 === 0.3);   // false
console.log(0.1 + 0.2);           // 0.30000000000000004

// ---------------------------------------------------------------------------
// 2. Comparison and logic
// ---------------------------------------------------------------------------
// a === b   a !== b   a < b   a >= b        (same shape as Python)
// a && b    -> AND, Python's "and"
// a || b    -> OR,  Python's "or"
// !a        -> NOT, Python's "not"

// ---------------------------------------------------------------------------
// 3. Short-circuit: && and || return a VALUE, not a boolean
// ---------------------------------------------------------------------------
// Just like Python, they hand back one of their actual operands rather than
// true/false. This is used constantly:
const userName = "";
const displayName = userName || "anonymous";   // fallback if falsy
console.log("displayName:", displayName);

const user = { isAdmin: true };
user.isAdmin && console.log("showing admin panel");  // runs only if truthy

// WARNING: || treats EVERY falsy value as "missing" — including 0 and "".
const userCount = 0;
const shown = userCount || 10;   // 10 — wrong! 0 was a real, legitimate value
console.log("with ||, a real 0 becomes:", shown);

// ---------------------------------------------------------------------------
// 4. ?? — nullish coalescing (the fix)
// ---------------------------------------------------------------------------
// ?? falls back ONLY for null and undefined, leaving 0 and "" alone:
console.log("with ??:", userCount ?? 10);   // 0 — right

const missing = undefined;
console.log("missing ??:", missing ?? 10);  // 10

// ---------------------------------------------------------------------------
// 5. Optional chaining ?.
// ---------------------------------------------------------------------------
const person = { address: { city: "Tel Aviv" } };
const noAddress = {};

console.log(person.address?.city);           // "Tel Aviv"
console.log(noAddress.address?.city);        // undefined, NOT a thrown TypeError
console.log(noAddress.address?.city ?? "unknown");  // "unknown"

// ?. and ?? pair naturally: reach in safely, then supply a default. Together
// they replace most defensive if-chains you'd otherwise write by hand.

// ---------------------------------------------------------------------------
// 6. Assignment shorthands
// ---------------------------------------------------------------------------
let count = 0;
count += 1;      // 1
count++;         // 2 — return then increment
++count;         // 3 — increment then return
console.log("count:", count);

let total = 5;
total *= 2;
console.log("total:", total);

let displayLabel = "";
displayLabel ||= "anon";   // assign if falsy
console.log("displayLabel:", displayLabel);

let maybeNull = null;
maybeNull ??= "default";   // assign if null/undefined
console.log("maybeNull:", maybeNull);

// There's no ++ in Python. When in doubt, prefer `count += 1` — it's
// unambiguous, unlike the pre/post-increment distinction of ++count vs
// count++.

console.log("\nNext: 05_conditionals.js");
