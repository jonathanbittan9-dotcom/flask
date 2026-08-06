/**
 * 17_errors.js — throw, try/catch/finally, custom errors.
 *
 * Run it:
 *     node 17_errors.js
 */

// ---------------------------------------------------------------------------
// 1. throw, try/catch/finally
// ---------------------------------------------------------------------------
function divide(a, b) {
  if (b === 0) {
    throw new Error("cannot divide by zero");   // like Python's `raise Exception(...)`
  }
  return a / b;
}

try {
  console.log(divide(10, 2));
  console.log(divide(10, 0));
  console.log("this line never runs");
} catch (error) {
  console.log("caught:", error.message);
} finally {
  console.log("finally always runs, error or not");
}

// ---------------------------------------------------------------------------
// 2. The built-in Error types
// ---------------------------------------------------------------------------
try {
  null.someProperty;                    // TypeError — reading a property of null
} catch (e) {
  console.log(e.constructor.name, "-", e.message);
}

try {
  undeclaredVariable;                   // ReferenceError — name doesn't exist
} catch (e) {
  console.log(e.constructor.name, "-", e.message);
}

try {
  JSON.parse("{not valid json}");       // SyntaxError — malformed input to parse
} catch (e) {
  console.log(e.constructor.name, "-", e.message);
}

// Every JS error is an object with (at least) .message and .name/constructor
// — check `error.constructor.name` or `error instanceof TypeError` to
// branch on WHICH kind of error you caught, same idea as Python's
// `except ValueError:` vs `except TypeError:`.

// ---------------------------------------------------------------------------
// 3. Custom errors by extending Error
// ---------------------------------------------------------------------------
class ValidationError extends Error {
  constructor(field, message) {
    super(message);
    this.name = "ValidationError";   // shows up in stack traces and error.name
    this.field = field;               // your own extra data on the error
  }
}

function validateAge(age) {
  if (age < 0) {
    throw new ValidationError("age", "age cannot be negative");
  }
  return age;
}

try {
  validateAge(-5);
} catch (e) {
  if (e instanceof ValidationError) {
    console.log(`validation failed on "${e.field}": ${e.message}`);
  } else {
    throw e;   // not ours — let it propagate, same as Python's bare `raise`
  }
}

// Directly parallel to Python's:
//   class ValidationError(Exception):
//       def __init__(self, field, message):
//           super().__init__(message)
//           self.field = field

// ---------------------------------------------------------------------------
// 4. Catching narrowly instead of swallowing
// ---------------------------------------------------------------------------
function risky() {
  throw new ValidationError("email", "missing @ symbol");
}

try {
  risky();
} catch (e) {
  if (!(e instanceof ValidationError)) {
    throw e;                     // re-throw anything we didn't expect
  }
  console.log("handled expected error:", e.message);
}

// An empty `catch (e) {}` is the worst thing you can put in a codebase — it
// silently discards evidence that something went wrong, turning a loud,
// traceable crash into a mysterious later symptom with no clue what caused
// it. At minimum, log it. Better: only catch the specific error type you
// know how to recover from, and let everything else propagate.

// ---------------------------------------------------------------------------
// 5. Errors inside async code — previewed, covered properly in 19
// ---------------------------------------------------------------------------
async function mightFail() {
  throw new Error("async errors are catchable too");
}

mightFail().catch((e) => console.log("caught from a promise:", e.message));
// A regular try/catch around synchronous code CANNOT catch an error thrown
// later, inside a callback or a promise — by the time it throws, the
// try block has already finished. File 18 explains why, and file 19
// shows the async/await syntax that makes try/catch work again for this case.

console.log("\nNext: 18_promises.js");
