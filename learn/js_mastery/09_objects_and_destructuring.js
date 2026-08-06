/**
 * 09_objects_and_destructuring.js — objects, destructuring, spread, shallow-copy traps.
 *
 * Run it:
 *     node 09_objects_and_destructuring.js
 */

// ---------------------------------------------------------------------------
// 1. Objects — JavaScript's dict
// ---------------------------------------------------------------------------
const user = {
  name: "Itay",
  age: 25,
  hobbies: ["gaming", "coding"],
};

console.log(user.name);        // dot access — the common case
console.log(user["age"]);      // bracket access — needed for dynamic keys
const key = "hobbies";
console.log(user[key]);        // dot access can't do this — user.key would look for a literal "key" property

user.email = "itay@example.com";   // adding a new property, no declaration needed
console.log(user);

// Python: user = {"name": "Itay", "age": 25, ...}; user["name"] always
// works, but JS's dot-access sugar is used for anything with a valid
// identifier as a key — brackets only when the key is computed or has
// characters a plain identifier can't (spaces, hyphens, starts with a digit).

// ---------------------------------------------------------------------------
// 2. Object.keys / values / entries
// ---------------------------------------------------------------------------
console.log(Object.keys(user));    // ["name", "age", "hobbies", "email"]
console.log(Object.values(user));
console.log(Object.entries(user)); // [["name","Itay"], ["age",25], ...]

for (const [k, v] of Object.entries(user)) {
  console.log(`${k}: ${v}`);
}
// Python: for k, v in user.items():

// ---------------------------------------------------------------------------
// 3. Shorthand syntax
// ---------------------------------------------------------------------------
const name = "Dana";
const age = 30;
const shorthand = { name, age };   // same as { name: name, age: age }
console.log(shorthand);

const obj2 = {
  greet() { return "hi"; },   // method shorthand — no `function` keyword needed
};
console.log(obj2.greet());

// ---------------------------------------------------------------------------
// 4. Destructuring — unpacking an object into variables
// ---------------------------------------------------------------------------
const { name: userName, age: userAge } = user;   // renaming while unpacking
console.log(userName, userAge);

const { name: n2, city = "unknown" } = user;   // default for a missing key
console.log(n2, city);

function printUser({ name, age }) {   // destructuring directly in parameters
  console.log(`${name} is ${age}`);
}
printUser(user);

// ---------------------------------------------------------------------------
// 5. Destructuring arrays too
// ---------------------------------------------------------------------------
const [first, second, ...restHobbies] = user.hobbies;
console.log(first, second, restHobbies);

const [, secondOnly] = [10, 20, 30];   // skip with a blank slot
console.log(secondOnly);

// ---------------------------------------------------------------------------
// 6. Spread to copy and merge objects
// ---------------------------------------------------------------------------
const base = { role: "user", active: true };
const admin = { ...base, role: "admin" };   // spread first, override after
console.log(admin);   // { role: "admin", active: true } — later keys win

// Python equivalent: admin = {**base, "role": "admin"}

// ---------------------------------------------------------------------------
// 7. The shallow-copy trap
// ---------------------------------------------------------------------------
const original = { name: "Itay", address: { city: "Tel Aviv" } };
const shallowCopy = { ...original };

shallowCopy.name = "Dana";                 // fine — top-level, independent
shallowCopy.address.city = "Haifa";        // NOT fine — same nested object!

console.log("original.name:", original.name);           // "Itay" — untouched
console.log("original.address.city:", original.address.city);  // "Haifa" — CHANGED!

// Spread (and Object.assign, and Array's [...arr]) only copies ONE LEVEL
// deep. Any nested object or array inside is still the SAME object shared
// by both copies. To truly duplicate everything, nested structures included:
const deepCopy = structuredClone(original);
deepCopy.address.city = "Eilat";
console.log("after structuredClone, original.address.city:", original.address.city);  // unaffected

console.log("\nNext: 10_scope_and_closures.js");
