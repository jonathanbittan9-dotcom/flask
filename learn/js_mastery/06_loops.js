/**
 * 06_loops.js — for...of, for...in, classic for, while, and which to reach for.
 *
 * Run it:
 *     node 06_loops.js
 */

// ---------------------------------------------------------------------------
// 1. for...of — the one you want (Python's `for x in list:`)
// ---------------------------------------------------------------------------
const hobbies = ["gaming", "coding", "reading"];

for (const hobby of hobbies) {
  console.log(hobby);
}
// `const` inside the loop head is correct — each iteration creates a fresh
// binding, so there's nothing to reassign.

// ---------------------------------------------------------------------------
// 2. for...in — almost never what you want
// ---------------------------------------------------------------------------
// It iterates over KEYS, and for an array those keys are string indices:
for (const i in hobbies) {
  console.log(i, typeof i);   // "0" string, "1" string, "2" string
}
// for...in on an array gives you "0", "1" as STRINGS, and also walks
// inherited properties. Use it only for plain objects, and even then prefer
// Object.keys(obj) — it's clearer and only shows the object's own keys.

// ---------------------------------------------------------------------------
// 3. The classic for
// ---------------------------------------------------------------------------
for (let i = 0; i < hobbies.length; i++) {
  console.log(i, hobbies[i]);
}
// Three parts separated by semicolons: initialize, test-before-each-pass,
// run-after-each-pass. Use `let`, not `const` — `i` is reassigned every
// iteration. Reach for this when you need the index directly, or need to
// skip / step unusually (e.g. every second element, or counting backwards).

// ---------------------------------------------------------------------------
// 4. while and do...while
// ---------------------------------------------------------------------------
let n = 3;
while (n > 0) {
  console.log("countdown:", n);
  n--;
}

do {
  console.log("do...while always runs at least once");
} while (false);

// ---------------------------------------------------------------------------
// 5. Getting index and value together
// ---------------------------------------------------------------------------
for (const [i, hobby] of hobbies.entries()) {
  console.log(i, hobby);          // like Python's enumerate()
}

hobbies.forEach((hobby, i) => console.log(i, hobby));

// ---------------------------------------------------------------------------
// 6. break and continue
// ---------------------------------------------------------------------------
// Both work as in Python. IMPORTANT: break and continue do NOT work inside
// .forEach() — each iteration is a separate function call, and you can't
// break out of a callback. If you need to stop early, use for...of instead.
for (const h of hobbies) {
  if (h === "coding") {
    console.log("found it, stopping");
    break;
  }
}

// NOTE: writing `break` directly inside a .forEach() callback is a
// SyntaxError the JS engine catches while parsing the *whole file* — so it
// would stop this entire script from running at all, before a single line
// executes. eval() defers parsing that fragment until this exact line runs,
// which is the only reason it's safe to demonstrate here:
try {
  eval(`hobbies.forEach((h) => { if (h === "coding") break; });`);
} catch (e) {
  console.log("as expected:", e.constructor.name, "-", e.message);
}

// ---------------------------------------------------------------------------
// 7. Choosing
// ---------------------------------------------------------------------------
//   Use                        When
//   for...of                   The default. Iterating values of an array,
//                               string, Map or Set.
//   .entries() in for...of      You need the index too, and might break.
//   classic for                 Counting, stepping by 2, iterating backwards.
//   for...in                    Keys of a plain object — and even then,
//                               Object.keys() is clearer.
//   while                       The number of iterations isn't known upfront.
//   .map / .filter / .reduce    You're building a NEW array — file 08.

console.log("\nNext: 07_functions.js (in js_mastery)");
