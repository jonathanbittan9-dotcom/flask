/**
 * 01_where_js_runs.js
 *
 * Before any syntax: WHERE does this code execute, and why does that matter?
 *
 * Run it:
 *     node 01_where_js_runs.js
 */

// ---------------------------------------------------------------------------
// 1. Two machines, two moments in time
// ---------------------------------------------------------------------------
//
// hello.py runs on YOUR machine (the server). It produces HTML and sends it
// over the network. The moment it finishes, Python's job is done — the
// request/response cycle is over.
//
// JavaScript, when it's loaded from a <script> tag in a browser, runs on the
// VISITOR's machine, AFTER that HTML has already arrived. Two different
// computers, two different points in time. Right now you're running this
// particular file with Node.js instead of a browser — Node is "JavaScript,
// but on a server, with no page around it" — which is why this specific file
// behaves a lot like a Python script. Files 12+ need an actual browser,
// because they touch the page itself.

console.log("This is running via Node — no browser, no HTML page involved.");

// ---------------------------------------------------------------------------
// 2. What each side can see
// ---------------------------------------------------------------------------
//
//                      Python / Flask              JavaScript in a browser
//   Runs on             your server                 the visitor's browser
//   Runs when           a request arrives            after the page loads
//   Can see              the database, the filesystem, secrets   only what the HTML/JS sent to the page
//   Visible to the user   never                       ENTIRELY — View Source shows it all
//
// That last row is the one beginners miss. Anything you put in JavaScript
// that ships to the browser can be read by anyone with two clicks (F12 →
// Sources). Never put a password, API key, or database credential there —
// those belong in os.environ on the Flask side, exactly like you already do.

// ---------------------------------------------------------------------------
// 3. console.log is your print()
// ---------------------------------------------------------------------------
console.log("hello from JavaScript");
console.log(2 + 2);
console.log("multiple", "values", "like", "Python's", "print");

// In a browser, press F12 and pick the Console tab — you can type JS there
// directly and see it run instantly, no file needed. That's the fastest
// feedback loop you have while learning, exactly like a Python REPL.

// ---------------------------------------------------------------------------
// 4. Getting JS onto an actual page (for later — just read this for now)
// ---------------------------------------------------------------------------
//
//   <!-- inline: fine for learning -->
//   <script>
//     console.log("hello from the browser");
//   </script>
//
//   <!-- external: what real projects use -->
//   <script src="/static/js/app.js"></script>
//
// Put <script> tags just before </body>, or add the `defer` attribute. A
// script placed in <head> runs BEFORE the HTML below it exists on the page,
// so it can't find any element it's trying to touch yet. Lesson 12 shows
// exactly what that failure looks like.

// ---------------------------------------------------------------------------
// 5. Where the two sides meet
// ---------------------------------------------------------------------------
//
// The connection point is data. Flask sends JSON from a route, JavaScript
// asks for it with `fetch(...)`, and the page updates without a reload.
// That's the destination this whole series builds toward — file 20 wires it
// directly into hello.py.

console.log("\nNext: 02_variables.js");
