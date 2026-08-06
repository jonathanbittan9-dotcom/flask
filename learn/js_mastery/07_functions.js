/**
 * 07_functions.js — declarations, expressions, arrows, defaults, rest/spread.
 *
 * Run it:
 *     node 07_functions.js
 */

// ---------------------------------------------------------------------------
// 1. Function declaration
// ---------------------------------------------------------------------------
function greet(name) {
  return `Hello, ${name}!`;
}
console.log(greet("Itay"));

// Function declarations are HOISTED — the whole function is available
// before its line runs, anywhere in the enclosing scope:
console.log(hoisted());
function hoisted() {
  return "I can be called before my definition appears in the file";
}

// ---------------------------------------------------------------------------
// 2. Function expression
// ---------------------------------------------------------------------------
const greet2 = function (name) {
  return `Hi, ${name}!`;
};
console.log(greet2("Itay"));

// NOT hoisted the same way — `greet2` exists (as undefined) but calling it
// before this line throws, because the function body isn't attached yet:
try {
  notHoisted();
} catch (e) {
  console.log("as expected:", e.constructor.name, "-", e.message);
}
const notHoisted = function () {};

// ---------------------------------------------------------------------------
// 3. Arrow functions
// ---------------------------------------------------------------------------
const add = (a, b) => a + b;                 // implicit return, one expression
const square = (n) => { return n * n; };     // explicit return needs braces
const shout = (msg) => console.log(msg.toUpperCase());

console.log(add(2, 3));
console.log(square(4));
shout("this is fine");

// Arrows are the closest thing to a Python lambda, but far more common —
// used everywhere a short function is passed as an argument (file 08).
// Key difference from `function`: arrows don't have their own `this` —
// covered properly in 16_classes.js, since it only matters once objects
// and event handlers are involved.

// ---------------------------------------------------------------------------
// 4. Default parameters
// ---------------------------------------------------------------------------
function makeGreeting(name, greeting = "Hello") {
  return `${greeting}, ${name}!`;
}
console.log(makeGreeting("Itay"));
console.log(makeGreeting("Itay", "Shalom"));

// Equivalent to Python's `def make_greeting(name, greeting="Hello"):` —
// same idea, same position (after the required params).

// ---------------------------------------------------------------------------
// 5. Rest parameters — JavaScript's *args
// ---------------------------------------------------------------------------
function sum(...numbers) {
  return numbers.reduce((total, n) => total + n, 0);   // reduce: see file 08
}
console.log(sum(1, 2, 3, 4));

function describe(first, ...rest) {
  console.log("first:", first, "rest:", rest);
}
describe("a", "b", "c", "d");

// ---------------------------------------------------------------------------
// 6. Spread — the other direction, JavaScript's **kwargs-ish unpacking
// ---------------------------------------------------------------------------
const nums = [5, 10, 15];
console.log(Math.max(...nums));   // spreads the array into individual arguments

// ---------------------------------------------------------------------------
// 7. Returning early
// ---------------------------------------------------------------------------
function classify(n) {
  if (n < 0) return "negative";
  if (n === 0) return "zero";
  return "positive";
}
console.log(classify(-5), classify(0), classify(5));

// ---------------------------------------------------------------------------
// 8. Functions ARE values
// ---------------------------------------------------------------------------
console.log(typeof greet);    // "function"

function applyTwice(fn, value) {
  return fn(fn(value));
}
console.log(applyTwice((x) => x * 2, 3));   // (3*2)*2 = 12

// This is exactly like passing a function as an argument in Python — JS
// leans on it MUCH more heavily, because arrow functions are so lightweight
// to write inline. It's the foundation of everything in the next file.

console.log("\nNext: 08_arrays.js");
