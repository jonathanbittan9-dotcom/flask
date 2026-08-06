/**
 * 18_promises.js — the event loop, callbacks, Promise, .then/.catch/.finally.
 *
 * Run it:
 *     node 18_promises.js
 */

// ---------------------------------------------------------------------------
// 1. The event loop, briefly
// ---------------------------------------------------------------------------
// JavaScript runs on a SINGLE thread — only one line of your code executes
// at any instant, unlike Python's threading/multiprocessing options. But it
// isn't blocking: slow work (a network request, a timer, reading a file in
// Node) is handed off to the browser/Node runtime, and your code moves on
// immediately. When that slow work finishes, its callback gets queued up
// to run once the current code finishes. This queueing system is the
// "event loop".

console.log("1: first");
setTimeout(() => console.log("3: from setTimeout, runs LATER"), 0);
console.log("2: second");
// Output order is 1, 2, 3 — NOT 1, 3, 2 — even with a 0ms delay. setTimeout
// always defers to AFTER all currently-running synchronous code finishes,
// no matter how small the delay.

// ---------------------------------------------------------------------------
// 2. Callbacks and callback hell
// ---------------------------------------------------------------------------
function fetchUserCallback(id, onDone) {
  setTimeout(() => onDone({ id, name: "Itay" }), 10);   // simulates a slow operation
}

fetchUserCallback(1, (user) => {
  console.log("got user:", user.name);
  // A second dependent async step means nesting ANOTHER callback inside
  // this one, and a third nests inside that — each step indented deeper
  // than the last. That pyramid shape is "callback hell": hard to read,
  // hard to handle errors in consistently. Promises exist specifically to
  // flatten this back out.
});

// ---------------------------------------------------------------------------
// 3. new Promise, .then, .catch, .finally
// ---------------------------------------------------------------------------
function fetchUserPromise(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (id > 0) {
        resolve({ id, name: "Itay" });   // success — hands a value forward
      } else {
        reject(new Error("invalid id"));  // failure — hands an error forward
      }
    }, 10);
  });
}

fetchUserPromise(1)
  .then((user) => console.log("promise resolved:", user.name))
  .catch((error) => console.log("promise rejected:", error.message))
  .finally(() => console.log("promise settled, one way or the other"));

fetchUserPromise(-1)
  .then((user) => console.log("this never runs"))
  .catch((error) => console.log("caught:", error.message));

// A Promise is an object representing a value that ISN'T ready yet, but
// will be eventually — either successfully (resolved) or not (rejected).
// .then() chains a step for success; .catch() handles failure; .finally()
// runs regardless, for cleanup that has to happen either way.

// Chaining .then() calls (each returning a new promise) is what replaces
// nested callbacks:
fetchUserPromise(1)
  .then((user) => fetchUserPromise(user.id + 1))   // chain: use one result to start the next
  .then((nextUser) => console.log("chained:", nextUser))
  .catch((error) => console.log("any step's error lands here:", error.message));

// ---------------------------------------------------------------------------
// 4. Promise.all / allSettled / race
// ---------------------------------------------------------------------------
Promise.all([fetchUserPromise(1), fetchUserPromise(2), fetchUserPromise(3)])
  .then((users) => console.log("Promise.all — all three:", users.map((u) => u.name)));
// Promise.all runs everything CONCURRENTLY and waits for ALL to succeed —
// much faster than awaiting them one at a time when they don't depend on
// each other. If even ONE rejects, the whole Promise.all rejects immediately.

Promise.allSettled([fetchUserPromise(1), fetchUserPromise(-1)])
  .then((results) => console.log("allSettled — every outcome:", results));
// allSettled never short-circuits — it waits for every promise and reports
// each one's status ("fulfilled" or "rejected") individually. Use this when
// partial failure is fine and you want to see everything that happened.

// ---------------------------------------------------------------------------
// 5. Why setTimeout(fn, 0) doesn't run immediately
// ---------------------------------------------------------------------------
// Already demonstrated in section 1 — "0ms" means "as soon as possible
// AFTER the current call stack empties," not "right now." This queueing
// behavior is exactly what makes JavaScript non-blocking on a single thread:
// slow operations get out of the way instead of freezing everything else.

setTimeout(() => console.log("\n(all timers above have now fired)\nNext: 19_async_await.js"), 50);
