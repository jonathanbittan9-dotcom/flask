/**
 * 20_fetch_flask_api.js — calling hello.py's routes with fetch. The lesson
 * where both tracks (Flask and JS) finally meet.
 *
 * Needs a browser AND a running server:
 *   1. In a terminal, from the `learn/` folder: python hello.py
 *   2. Open http://127.0.0.1:5000/ (or demo.html) in a browser, F12 -> Console
 *   3. Paste this file's code in.
 *
 * fetch() is blocked by browser security from being called by opening this
 * .js file directly (file://) or by Node without extra setup — it needs a
 * real page served over http:// to have something to be "same-origin" with.
 */

// ---------------------------------------------------------------------------
// 1. fetch with GET and JSON parsing
// ---------------------------------------------------------------------------
// hello.py doesn't have a JSON API route yet in this project — the calls
// below assume you've added one. A minimal example to add to hello.py:
//
//   @app.route("/api/hobbies")
//   def api_hobbies():
//       return {"hobbies": ["gaming", "coding", "reading"]}
//
// Flask automatically serializes a dict returned from a route into a JSON
// response — no separate import needed for this simple case.

fetch("/api/hobbies")
  .then((response) => response.json())   // .json() ALSO returns a promise — parsing takes a moment
  .then((data) => console.log("hobbies from Flask:", data.hobbies))
  .catch((error) => console.log("fetch failed:", error.message));

// Or with async/await (file 19), which is the style you'll use most:
async function loadHobbies() {
  const response = await fetch("/api/hobbies");
  const data = await response.json();
  console.log("hobbies (async/await):", data.hobbies);
}
loadHobbies();

// ---------------------------------------------------------------------------
// 2. POSTing JSON and setting headers
// ---------------------------------------------------------------------------
// A matching Flask route for this:
//
//   from flask import request
//   @app.route("/api/hobbies", methods=["POST"])
//   def add_hobby():
//       data = request.get_json()
//       new_hobby = data.get("hobby")
//       # ... save it somewhere ...
//       return {"added": new_hobby}, 201

async function addHobby(hobby) {
  const response = await fetch("/api/hobbies", {
    method: "POST",
    headers: { "Content-Type": "application/json" },   // tells Flask's request.get_json() what to expect
    body: JSON.stringify({ hobby }),                     // fetch sends TEXT — you must stringify yourself
  });
  const data = await response.json();
  console.log("server confirmed:", data.added);
}
addHobby("swimming");

// ---------------------------------------------------------------------------
// 3. Why fetch does NOT reject on a 404 or 500
// ---------------------------------------------------------------------------
async function loadMissing() {
  const response = await fetch("/api/does-not-exist");
  console.log("status:", response.status);      // 404
  console.log("response.ok:", response.ok);      // false
  // fetch's promise only rejects on a NETWORK failure (no connection, DNS
  // failure, CORS block) — a 404 or 500 is still a successful HTTP
  // round-trip as far as fetch is concerned. You must check response.ok
  // (or response.status) yourself:
  if (!response.ok) {
    console.log(`request failed with status ${response.status}`);
    return;
  }
}
loadMissing();

async function loadHobbiesSafely() {
  try {
    const response = await fetch("/api/hobbies");
    if (!response.ok) {
      throw new Error(`server returned ${response.status}`);
    }
    const data = await response.json();
    return data.hobbies;
  } catch (error) {
    // catches BOTH network failures (fetch itself rejects) AND the
    // manually-thrown "bad status" error above — one place to handle both.
    console.log("could not load hobbies:", error.message);
    return [];
  }
}

// ---------------------------------------------------------------------------
// 4. Rendering results into the DOM (ties back to files 12-13)
// ---------------------------------------------------------------------------
async function renderHobbies() {
  const list = document.querySelector("#hobby-list");   // from demo.html
  if (!list) return;   // guard: this page might not have that element

  list.textContent = "";   // clear any existing content first
  const hobbies = await loadHobbiesSafely();
  for (const hobby of hobbies) {
    const li = document.createElement("li");
    li.textContent = hobby;      // textContent, not innerHTML — file 13's rule still applies
                                   // to data that came from a network response, same as user input
    list.append(li);
  }
}

// ---------------------------------------------------------------------------
// 5. Loading and error states users can understand
// ---------------------------------------------------------------------------
async function renderHobbiesWithFeedback() {
  const status = document.querySelector("#status");     // from demo.html
  if (!status) return;

  status.textContent = "Loading...";
  try {
    await renderHobbies();
    status.textContent = "";
  } catch (error) {
    status.textContent = "Could not load hobbies. Try refreshing.";
  }
}
renderHobbiesWithFeedback();

// ---------------------------------------------------------------------------
// 6. CORS, and why it doesn't bite here
// ---------------------------------------------------------------------------
// CORS (Cross-Origin Resource Sharing) blocks JavaScript on one origin
// (protocol + domain + port) from freely reading responses from a
// DIFFERENT origin, unless that server explicitly allows it. Calling
// fetch("/api/hobbies") from a page Flask itself served on
// http://127.0.0.1:5000 is SAME-origin — no CORS involved at all. You'd
// only hit CORS calling a genuinely different server (a public weather API
// from your own page, for instance), and the fix lives on the SERVER
// you're calling (it must send an Access-Control-Allow-Origin header), not
// in your fetch call.

console.log("\nNext: 21_modules.js");
