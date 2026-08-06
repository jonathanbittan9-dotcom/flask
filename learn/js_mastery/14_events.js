/**
 * 14_events.js — addEventListener, the event object, bubbling, delegation, preventDefault.
 *
 * Needs a browser. Open demo.html, F12 -> Console, paste this in (or use the
 * commented <script> line in demo.html). Then actually click things.
 */

// ---------------------------------------------------------------------------
// 1. addEventListener and the event object
// ---------------------------------------------------------------------------
const button = document.querySelector("#cta-button");

button.addEventListener("click", function (event) {
  console.log("clicked!", event.type, event.target);
});
// `event` carries details about what happened: event.type ("click"),
// event.target (the exact element that triggered it), and much more
// depending on the event kind (event.key for keyboard, event.clientX/Y for
// mouse position, etc).

// ---------------------------------------------------------------------------
// 2. Bubbling, capturing, stopPropagation
// ---------------------------------------------------------------------------
// A click on the button also fires on everything it's nested inside — the
// event BUBBLES upward through ancestors by default:
const card = document.querySelector(".card");
card.addEventListener("click", () => console.log("card heard a click (bubbled up)"));
document.body.addEventListener("click", () => console.log("body heard a click (bubbled up)"));
// Click the button and all three listeners fire, innermost first:
//   "clicked! click <button>"  ->  "card heard a click"  ->  "body heard a click"

function stopHere(event) {
  event.stopPropagation();   // prevents the bubble from reaching ancestors
  console.log("this click will NOT reach card or body");
}
// button.addEventListener("click", stopHere);   // uncomment to see the effect

// Capturing is the opposite direction (outside-in) and is opt-in via a
// third argument: element.addEventListener("click", handler, { capture: true }).
// You'll use it far less often than bubbling.

// ---------------------------------------------------------------------------
// 3. Event delegation — one listener for many, even future, elements
// ---------------------------------------------------------------------------
const list = document.querySelector("#hobby-list");

list.addEventListener("click", (event) => {
  if (event.target.tagName === "LI") {          // only react to clicks ON an <li>
    event.target.classList.toggle("done");
    console.log("toggled:", event.target.textContent);
  }
});
// Instead of attaching a listener to every single <li> (and having to
// remember to attach one to every NEW <li> added later, like the ones
// 13_dom_changing.js appended), attach ONE listener to the shared parent
// and use bubbling to catch clicks from any child, including ones that
// didn't exist yet when the listener was set up. This is the standard
// pattern for lists, tables, and anything dynamically generated.

// ---------------------------------------------------------------------------
// 4. preventDefault — stopping the browser's built-in behavior
// ---------------------------------------------------------------------------
const links = document.querySelectorAll("a");
// (demo.html has no <a> tags, but here's the shape for when you add one)
for (const link of links) {
  link.addEventListener("click", (event) => {
    event.preventDefault();   // stops the browser from actually navigating
    console.log("would have gone to:", link.href, "but didn't");
  });
}
// The most common real use: intercepting a form submit before it reloads
// the page — 15_forms.js does exactly this against demo.html's form.

// ---------------------------------------------------------------------------
// 5. Removing listeners and avoiding leaks
// ---------------------------------------------------------------------------
function onceHandler() {
  console.log("this only runs once");
  button.removeEventListener("click", onceHandler);   // must be the SAME function reference
}
button.addEventListener("click", onceHandler);
// Or, more simply, for a listener that should only ever fire once:
button.addEventListener("click", () => console.log("built-in once"), { once: true });

// removeEventListener needs the exact same function reference that was
// passed to addEventListener — an inline arrow function can never be
// removed later, because you have no reference to it anymore. If you'll
// need to remove a listener eventually, give it a name.

console.log("\nAll listeners attached — click the button and the list items in demo.html.");
console.log("Next: 15_forms.js");
