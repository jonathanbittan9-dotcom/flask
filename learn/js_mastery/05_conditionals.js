/**
 * 05_conditionals.js — if/else, ternary, switch, and truthiness traps.
 *
 * Run it:
 *     node 05_conditionals.js
 */

// ---------------------------------------------------------------------------
// 1. if / else if / else
// ---------------------------------------------------------------------------
function ageGroup(age) {
  if (age >= 18) {
    return "adult";
  } else if (age >= 13) {
    return "teen";
  } else {
    return "child";
  }
}
console.log(ageGroup(25), ageGroup(15), ageGroup(5));

// - Parentheses around the condition are REQUIRED (Python's `if age >= 18:`
//   has none).
// - Braces define the block. Indentation means nothing to the JS parser —
//   unlike Python, where indentation IS the block.
// - It's `else if`, two words — not Python's `elif`.
// - No colon at the end of the line.
//
// Braces are technically optional for a single statement, but omitting them
// is how real bugs happen when someone later adds a second line to a branch
// that looks like it's inside the if but isn't. Always use them.

// ---------------------------------------------------------------------------
// 2. Truthiness — where it differs from Python
// ---------------------------------------------------------------------------
//   Value          JavaScript      Python
//   0              falsy           falsy
//   ""             falsy           falsy
//   null / None    falsy           falsy
//   []             TRUTHY          falsy
//   {}             TRUTHY          falsy
//   "0"            TRUTHY          truthy
//   NaN            falsy           —

if ([]) console.log("[] is truthy in JS — surprising if you know Python");
if ({}) console.log("{} is truthy too");

const hobbies = [];
if (hobbies.length) {
  console.log("has hobbies");
} else {
  console.log("empty — check .length, not the array itself");
}

// This is why {% if hobbies %} works as expected in a Jinja template (Jinja
// follows Python's rules) but the equivalent `if (hobbies)` in JavaScript
// would ALWAYS be true, even for an empty array. Check `.length` instead.

// ---------------------------------------------------------------------------
// 3. The ternary
// ---------------------------------------------------------------------------
const count = 1;
const label = count === 1 ? "item" : "items";
console.log(label);

// Condition first, then ?, then the true-value, then :, then the false-value.
// Python's version reads in a different order:
//   label = "item" if count == 1 else "items"
//
// Use a ternary for producing a VALUE. Use a real if for a branch that DOES
// things (side effects). Don't nest ternaries — they get unreadable fast.

// ---------------------------------------------------------------------------
// 4. switch
// ---------------------------------------------------------------------------
function handle(method) {
  switch (method) {
    case "GET":
      return "handling GET";
    case "POST":
    case "PUT":
      return "handling write";
    default:
      return "unknown method";
  }
}
console.log(handle("GET"), handle("POST"), handle("DELETE"));

// Forget `break` and execution FALLS THROUGH into the next case. Occasionally
// useful (as with POST/PUT above, which share a `return` before hitting a
// break — returning exits the function, so no break was needed there), but
// far more often a bug in a switch that just logs or assigns per case.
// switch also compares with ===, so `case "5"` never matches the number 5.

let value = "5";
switch (value) {
  case 5:
    console.log("number five");
    break;
  default:
    console.log("no match — switch uses strict equality");
}

console.log("\nNext: 06_loops.js");
