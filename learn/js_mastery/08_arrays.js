/**
 * 08_arrays.js — map/filter/reduce/find, mutating vs returning.
 *
 * Run it:
 *     node 08_arrays.js
 */

const numbers = [3, 1, 4, 1, 5, 9, 2, 6];

// ---------------------------------------------------------------------------
// 1. map — transform every element into a NEW array (same length)
// ---------------------------------------------------------------------------
const doubled = numbers.map((n) => n * 2);
console.log("doubled:", doubled);
// Python: [n * 2 for n in numbers]

// ---------------------------------------------------------------------------
// 2. filter — keep only elements that pass a test (new array, <= length)
// ---------------------------------------------------------------------------
const evens = numbers.filter((n) => n % 2 === 0);
console.log("evens:", evens);
// Python: [n for n in numbers if n % 2 == 0]

// ---------------------------------------------------------------------------
// 3. reduce — fold the whole array down to ONE value
// ---------------------------------------------------------------------------
const total = numbers.reduce((accumulator, n) => accumulator + n, 0);
console.log("total:", total);
// Python: functools.reduce(lambda acc, n: acc + n, numbers, 0)
// or just sum(numbers) — Python has a builtin for this common case, JS doesn't.

// The second argument to reduce (0 here) is the STARTING value of the
// accumulator. Skipping it is legal but risky — with an empty array it
// throws instead of quietly returning a sensible default.

// ---------------------------------------------------------------------------
// 4. find / findIndex — the first match, or undefined/-1
// ---------------------------------------------------------------------------
console.log("find:", numbers.find((n) => n > 4));        // 5 (first one > 4)
console.log("findIndex:", numbers.findIndex((n) => n > 4));  // 4 (its index)
console.log("find none:", numbers.find((n) => n > 100));  // undefined

// ---------------------------------------------------------------------------
// 5. some / every — boolean tests over the whole array
// ---------------------------------------------------------------------------
console.log("some > 8:", numbers.some((n) => n > 8));     // true
console.log("every > 0:", numbers.every((n) => n > 0));   // true
console.log("every even:", numbers.every((n) => n % 2 === 0));  // false

// Python: any(n > 8 for n in numbers), all(n > 0 for n in numbers)

// ---------------------------------------------------------------------------
// 6. includes
// ---------------------------------------------------------------------------
console.log("includes 9:", numbers.includes(9));   // true
// Python: 9 in numbers

// ---------------------------------------------------------------------------
// 7. Chaining
// ---------------------------------------------------------------------------
const result = numbers
  .filter((n) => n % 2 === 0)   // [4, 4... wait, keep evens]
  .map((n) => n * 10)           // scale them up
  .reduce((a, b) => a + b, 0);  // sum
console.log("chained result:", result);

// Chaining reads left-to-right as a pipeline — filter, then map, then
// reduce. It's elegant for two or three steps. Beyond that, or once a step
// needs a multi-line body, break it back into a named variable per step —
// a chain that needs comments explaining each link has stopped paying for
// itself.

// ---------------------------------------------------------------------------
// 8. MUTATING methods (change the array in place) vs RETURNING methods (new array)
// ---------------------------------------------------------------------------
const original = [3, 1, 2];

// Mutating — these change `original` itself and often return something
// other than the new array:
const copy1 = [...original];   // spread — make a copy before mutating
copy1.push(4);                 // adds to end, returns new length
copy1.pop();                   // removes from end, returns removed item
copy1.sort();                  // sorts IN PLACE, returns the same array
copy1.splice(1, 1);            // removes elements in place
console.log("original untouched:", original);
console.log("copy1 after mutation:", copy1);

// Returning — these leave the original alone and hand back a new array:
const copy2 = original.slice(0, 2);    // a portion, original untouched
const copy3 = original.concat([9, 9]); // joined, original untouched
console.log("slice:", copy2, "| concat:", copy3, "| original still:", original);

// warn: .sort() without a comparator sorts as STRINGS by default, which is
// wrong for numbers:
console.log([10, 2, 33, 4].sort());               // [10, 2, 33, 4] -> WRONG order
console.log([10, 2, 33, 4].sort((a, b) => a - b)); // [2, 4, 10, 33] -> correct

// ---------------------------------------------------------------------------
// 9. Spread for copying and merging
// ---------------------------------------------------------------------------
const a = [1, 2];
const b = [3, 4];
const merged = [...a, ...b, 5];
console.log("merged:", merged);

// This is a SHALLOW copy — fine for arrays of numbers/strings, but if the
// elements are objects, the copy shares the same nested objects as the
// original. File 09 covers exactly why that matters.

console.log("\nNext: 09_objects_and_destructuring.js");
