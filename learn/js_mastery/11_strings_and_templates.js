/**
 * 11_strings_and_templates.js — template literals, string methods, a first regex.
 *
 * Run it:
 *     node 11_strings_and_templates.js
 */

// ---------------------------------------------------------------------------
// 1. Template literals — backticks, the default quoting style
// ---------------------------------------------------------------------------
const name = "Itay";
const age = 25;

const message = `${name} is ${age} years old`;   // interpolation with ${...}
console.log(message);
// Python's f-string: f"{name} is {age} years old" — same idea, backtick
// instead of an f-prefix.

const multiLine = `line one
line two
line three`;    // backticks preserve real newlines, no \n needed
console.log(multiLine);

console.log(`2 + 2 = ${2 + 2}`);   // any expression goes inside ${...}

// Single and double quotes ('...' and "...") still work and behave
// identically to each other — they just can't interpolate. Prefer backticks
// as the default; reach for '...' only for tiny literal strings with no
// interpolation, out of habit more than necessity.

// ---------------------------------------------------------------------------
// 2. split / join
// ---------------------------------------------------------------------------
const csv = "gaming,coding,reading";
const hobbies = csv.split(",");
console.log(hobbies);                 // ["gaming", "coding", "reading"]
console.log(hobbies.join(" | "));     // "gaming | coding | reading"
// Python: csv.split(","), " | ".join(hobbies) — note join lives on the
// separator in Python but on the array in JS.

// ---------------------------------------------------------------------------
// 3. trim / replace / replaceAll
// ---------------------------------------------------------------------------
console.log(`"${"  padded  ".trim()}"`);          // "padded"
console.log("hello world".replace("world", "JS"));       // replaces first match
console.log("a-b-a-b".replaceAll("a", "X"));              // replaces every match
// .replace with a plain string only touches the FIRST occurrence — a common
// surprise. replaceAll (or a /g regex, below) is what "replace everywhere" means.

// ---------------------------------------------------------------------------
// 4. includes / startsWith / slice
// ---------------------------------------------------------------------------
const url = "https://example.com/api/users";
console.log(url.includes("api"));            // true
console.log(url.startsWith("https"));        // true
console.log(url.endsWith("users"));          // true
console.log(url.slice(8, 19));               // "example.co" — [start, end)
console.log(url.slice(-5));                  // "users" — negative counts from the end

// Python: "api" in url, url.startswith("https"), url[8:19] — same ideas,
// method-call syntax instead of a slice operator.

// ---------------------------------------------------------------------------
// 5. padStart — formatting numbers
// ---------------------------------------------------------------------------
console.log(String(7).padStart(3, "0"));     // "007"
console.log(String(42).padStart(5, "0"));    // "00042"
// Python: f"{7:03d}" or str(7).zfill(3) — JS has no format-spec mini
// language, padStart/padEnd cover the common cases directly.

// ---------------------------------------------------------------------------
// 6. A first look at regular expressions
// ---------------------------------------------------------------------------
const pattern = /\d+/;              // one or more digits
console.log(pattern.test("room 42"));      // true — .test() returns a boolean
console.log("room 42".match(pattern));     // the match details, or null

const allDigits = /\d+/g;           // the g flag = match ALL occurrences, not just the first
console.log("3 cats, 12 dogs".match(allDigits));   // ["3", "12"]

console.log("3 cats, 12 dogs".replace(/\d+/g, "N"));   // "N cats, N dogs"

// Regex literals in JS use /pattern/flags — no import needed, unlike
// Python's `import re; re.search(...)`. Common flags: g (global, all
// matches), i (case-insensitive). A full regex tutorial is out of scope
// here — the point is knowing this exists and reads similarly to Python's.

console.log("\nNext: 12_dom_selecting.js — open demo.html in a browser for this one");
