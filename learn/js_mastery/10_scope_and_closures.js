/**
 * 10_scope_and_closures.js — scope chain, closures, the classic loop bug.
 *
 * Run it:
 *     node 10_scope_and_closures.js
 */

// ---------------------------------------------------------------------------
// 1. Global, function, and block scope
// ---------------------------------------------------------------------------
const globalVar = "visible everywhere in this file";

function outer() {
  const functionVar = "visible anywhere inside outer()";

  if (true) {
    const blockVar = "visible only inside this { }";
    console.log(globalVar, functionVar, blockVar);
  }
  // blockVar is not visible here.
}
outer();

// ---------------------------------------------------------------------------
// 2. The scope chain and shadowing
// ---------------------------------------------------------------------------
// Looking up a name walks OUTWARD: current block -> enclosing function ->
// ... -> global. The first match wins. A name declared in an inner scope
// SHADOWS (hides) an outer one with the same name:
const label = "outer label";
function shadowDemo() {
  const label = "inner label";   // shadows the outer `label` completely
  console.log(label);
}
shadowDemo();
console.log(label);   // outer is untouched — the inner one never leaked out

// ---------------------------------------------------------------------------
// 3. What a closure actually is
// ---------------------------------------------------------------------------
// A closure is a function that REMEMBERS the variables around it, even
// after the outer function that created them has already returned.
function makeCounter() {
  let count = 0;              // this variable would normally disappear
                               // once makeCounter() finishes...
  return function () {
    count += 1;                // ...but this inner function still reaches it
    return count;
  };
}

const counter1 = makeCounter();
console.log(counter1());   // 1
console.log(counter1());   // 2
console.log(counter1());   // 3

const counter2 = makeCounter();   // a completely separate `count`
console.log(counter2());   // 1 — independent from counter1

// makeCounter() has already returned by the time counter1() is called. Its
// local `count` should be gone — but the returned function "closed over"
// it, keeping it alive for as long as something can still reach it. This is
// how private state works in JS without a class (file 16 covers the class
// version).

// ---------------------------------------------------------------------------
// 4. The classic var-in-a-loop bug
// ---------------------------------------------------------------------------
const varFunctions = [];
for (var i = 0; i < 3; i++) {
  varFunctions.push(() => i);   // captures the VARIABLE, not its value at push time
}
console.log("with var:", varFunctions.map((fn) => fn()));   // [3, 3, 3] — all the same!

const letFunctions = [];
for (let j = 0; j < 3; j++) {
  letFunctions.push(() => j);   // `let` makes a FRESH binding each iteration
}
console.log("with let:", letFunctions.map((fn) => fn()));   // [0, 1, 2] — correct

// With `var`, there's only ONE `i` for the entire loop (function-scoped),
// and every closure shares that same variable — by the time any of them
// run, the loop has finished and `i` is 3. With `let`, each pass through
// the loop gets its OWN `j`, so each closure remembers a different one.
// This single difference is one of the strongest arguments for never using
// `var` (file 02).

// ---------------------------------------------------------------------------
// 5. Closures for private state and counters — a realistic use
// ---------------------------------------------------------------------------
function createBankAccount(initialBalance) {
  let balance = initialBalance;   // not accessible from outside directly

  return {
    deposit(amount) { balance += amount; return balance; },
    withdraw(amount) {
      if (amount > balance) throw new Error("insufficient funds");
      balance -= amount;
      return balance;
    },
    getBalance() { return balance; },
  };
}

const account = createBankAccount(100);
console.log(account.deposit(50));    // 150
console.log(account.withdraw(30));   // 120
console.log(account.getBalance());   // 120
// There is no `account.balance` — the only way to touch it is through the
// methods that closed over it. This is JavaScript's version of a "private"
// attribute, achieved through scope rather than a language keyword.

console.log("\nNext: 11_strings_and_templates.js");
