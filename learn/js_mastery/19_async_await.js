/**
 * 19_async_await.js — writing asynchronous code that reads top to bottom.
 *
 * Run it:
 *     node 19_async_await.js
 */

function fetchUserPromise(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (id > 0) resolve({ id, name: "Itay" });
      else reject(new Error("invalid id"));
    }, 10);
  });
}

// ---------------------------------------------------------------------------
// 1. async functions always return a promise
// ---------------------------------------------------------------------------
async function greet() {
  return "hello";        // gets automatically WRAPPED in a resolved promise
}

console.log(greet());              // Promise { 'hello' } — NOT the string itself
greet().then((value) => console.log("unwrapped:", value));

// ---------------------------------------------------------------------------
// 2. await — and what it actually pauses
// ---------------------------------------------------------------------------
async function getUserName(id) {
  const user = await fetchUserPromise(id);   // pauses THIS function until the promise settles
  return user.name;                           // everything after await runs once it resolves
}

getUserName(1).then((name) => console.log("async/await result:", name));

// `await` only pauses the function it's written inside — the rest of the
// program keeps running. It's syntax that makes a promise chain READ like
// sequential code, without blocking anything:
console.log("this logs before 'async/await result' above, because getUserName paused, not the whole program");

// Directly comparable to how a Flask route stays synchronous top-to-bottom
// — `await` gives async JS that same readable shape, instead of the nested
// .then() chains from file 18.

// ---------------------------------------------------------------------------
// 3. try/catch around await — this is why file 17 mentioned it
// ---------------------------------------------------------------------------
async function safeGetUserName(id) {
  try {
    const user = await fetchUserPromise(id);
    return user.name;
  } catch (error) {
    return `error: ${error.message}`;   // a normal try/catch works again with await
  }
}

safeGetUserName(-1).then((result) => console.log(result));

// ---------------------------------------------------------------------------
// 4. Sequential awaits vs Promise.all — this decides how fast your code is
// ---------------------------------------------------------------------------
async function sequential() {
  const start = Date.now();
  const a = await fetchUserPromise(1);   // waits ~10ms...
  const b = await fetchUserPromise(2);   // ...THEN waits another ~10ms
  const c = await fetchUserPromise(3);   // ...THEN another ~10ms
  console.log("sequential took ~", Date.now() - start, "ms for 3 independent calls");
  return [a, b, c];
}

async function parallel() {
  const start = Date.now();
  const [a, b, c] = await Promise.all([   // all three start at once
    fetchUserPromise(1),
    fetchUserPromise(2),
    fetchUserPromise(3),
  ]);
  console.log("parallel took ~", Date.now() - start, "ms for the same 3 calls");
  return [a, b, c];
}

// Only reach for sequential awaits when each call genuinely NEEDS the
// previous result (like the chained fetchUserPromise example in file 18).
// When the calls are independent — like these three unrelated user
// lookups — awaiting them one at a time wastes real time for no reason.

async function main() {
  await sequential();
  await parallel();

  console.log("\nNext: 20_fetch_flask_api.js — needs a browser + `python hello.py` running");
}

main();

// ---------------------------------------------------------------------------
// 5. Top-level await and its limits
// ---------------------------------------------------------------------------
// Inside an ES module (file 21), `await` can be used at the TOP level of
// the file, with no wrapping async function — that's why this file wraps
// everything in main() instead: plain .js run via `node file.js` (a
// CommonJS script, not a module) doesn't allow top-level await.
