/**
 * 03_types_and_coercion.js — the 7 types, typeof, ==/===, and coercion.
 *
 * Run it:
 *     node 03_types_and_coercion.js
 */

// ---------------------------------------------------------------------------
// 1. The primitives
// ---------------------------------------------------------------------------
//   Type          Example                  Python equivalent
//   string        "hi", 'hi', `hi`         str
//   number        42, 3.14, -0.5           int AND float — JS has ONE numeric type
//   boolean       true, false              True, False (note the lowercase)
//   undefined     a declared-but-unset var  roughly None, but see section 2
//   null          deliberate "no value"    None
//   bigint        9007199254740993n        Python's unbounded int
//   symbol        Symbol("id")             no equivalent
//
// Everything else — arrays, functions, dates, {} — is an OBJECT.

// ---------------------------------------------------------------------------
// 2. undefined vs null
// ---------------------------------------------------------------------------
let notYetSet;
console.log("declared but unassigned:", notYetSet);            // undefined
let deliberatelyEmpty = null;
console.log("deliberately empty:", deliberatelyEmpty);          // null

// undefined = the LANGUAGE's "nobody set this": an unassigned variable, a
// missing function argument, an absent object property, a function with no
// return statement.
// null = YOUR "deliberately empty". JavaScript itself never produces null on
// its own. Practical rule: read both, but only ever WRITE null yourself.

// ---------------------------------------------------------------------------
// 3. typeof
// ---------------------------------------------------------------------------
console.log(typeof "hi");         // "string"
console.log(typeof 42);           // "number"
console.log(typeof true);         // "boolean"
console.log(typeof undefined);    // "undefined"
console.log(typeof null);         // "object"  <- a famous 1995 bug, never fixed
console.log(typeof [1, 2]);       // "object"  <- use Array.isArray() instead
console.log(typeof console.log);  // "function"

// ---------------------------------------------------------------------------
// 4. Coercion — the part with the bad reputation
// ---------------------------------------------------------------------------
// JavaScript converts types automatically when an operator needs it to.
// `+` is the troublemaker, because it means BOTH addition and string
// concatenation:
console.log("5" + 3);      // "53"  — either side is a string -> concatenate
console.log("5" - 3);      // 2     — `-` has no string meaning -> converts to number
console.log(1 + "2" + 3);  // "123" — left to right: 1+"2" is "12", then "12"+3
console.log(1 + 2 + "3");  // "33"  — 1+2 is 3 BEFORE the string shows up
console.log([] + {});      // "[object Object]" — both sides convert to strings

// Python raises TypeError for "5" + 3. JavaScript silently produces "53".
// This is the single biggest source of confusing bugs moving between the
// two languages — an operator that quietly changes meaning based on types.

// ---------------------------------------------------------------------------
// 5. == vs ===
// ---------------------------------------------------------------------------
console.log("5" == 5);            // true  — coerces before comparing
console.log("5" === 5);           // false — different types, done, no coercion
console.log(null == undefined);   // true
console.log(null === undefined);  // false
console.log(0 == "");             // true (!)
console.log(NaN === NaN);         // false (!) — NaN is defined as unequal to everything

// ALWAYS use === and !==. The one defensible use of == is `x == null`, which
// conveniently tests for null OR undefined in a single comparison.

// ---------------------------------------------------------------------------
// 6. Converting on purpose
// ---------------------------------------------------------------------------
console.log(Number("42"));       // 42
console.log(Number("beans"));    // NaN
console.log(parseInt("42px"));   // 42 — stops at the first non-digit character
console.log(String(42));         // "42"
console.log(Boolean(""));        // false

// The safe NaN check is Number.isNaN, not the older global isNaN:
console.log(Number.isNaN(Number("beans")));  // true
console.log(isNaN("beans"));                  // also true, but isNaN("") is
                                               // true too because it coerces
                                               // FIRST — rarely what you want.

console.log("\nNext: 04_operators_and_truthiness.js");
