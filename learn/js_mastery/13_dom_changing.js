/**
 * 13_dom_changing.js — editing text/attributes/classes, textContent vs innerHTML.
 *
 * Needs a browser. Open demo.html, F12 -> Console, paste this in (or use the
 * commented <script> line in demo.html).
 */

// ---------------------------------------------------------------------------
// 1. textContent vs innerHTML — and why the choice matters for security
// ---------------------------------------------------------------------------
const note = document.querySelector("#card-note");

note.textContent = "Changed via textContent — always safe.";
// textContent treats its argument as PLAIN TEXT, always. Even if the string
// contains "<b>", it renders literally as the characters < b >, not as a tag.

note.innerHTML = "Changed via <strong>innerHTML</strong> — renders real tags.";
// innerHTML PARSES its argument as HTML. Useful when you deliberately want
// to insert markup — but if that string ever comes from user input (a
// comment, a username, a search box), innerHTML will happily execute a
// <script> tag or an onerror= attribute the user typed in. That's XSS
// (cross-site scripting), the exact same class of bug SQL injection is for
// databases. Rule: use textContent for anything from a user; reserve
// innerHTML for markup YOU wrote.

// ---------------------------------------------------------------------------
// 2. classList — add / remove / toggle
// ---------------------------------------------------------------------------
const items = document.querySelectorAll("#hobby-list li");
items[0].classList.add("done");           // mark the first hobby as done
console.log(items[0].className);          // "done"

items[0].classList.remove("done");        // undo it
items[1].classList.toggle("done");        // flip it on
items[1].classList.toggle("done");        // flip it off again
console.log(items[1].classList.contains("done"));   // false

// classList is almost always better than setting .className directly —
// .className = "done" WIPES any other classes the element had; classList
// methods only touch the one class you name.

// ---------------------------------------------------------------------------
// 3. setAttribute, dataset, style
// ---------------------------------------------------------------------------
const button = document.querySelector("#cta-button");

button.setAttribute("disabled", "");         // disable the button
console.log(button.disabled);                 // true — reflected as a property too
button.removeAttribute("disabled");           // re-enable it

console.log(items[0].dataset.id);             // "1" — reads data-id="1" from demo.html
items[0].dataset.status = "active";           // WRITES data-status="active" onto the element

button.style.backgroundColor = "#0E7C70";     // inline style — camelCase property names
button.style.color = "white";
// Inline styles set here win over a stylesheet's rules for the SAME
// property on the SAME element (see css_mastery/03_cascade_and_specificity.html
// — inline styles have a specificity higher than any selector). Prefer
// toggling a CSS class over setting .style directly when the change is
// something you'd call a "state" — it keeps the actual colors defined once,
// in your stylesheet, not scattered across JS files.

// ---------------------------------------------------------------------------
// 4. createElement and append — adding new elements
// ---------------------------------------------------------------------------
const list = document.querySelector("#hobby-list");

const newItem = document.createElement("li");
newItem.textContent = "swimming";
newItem.dataset.id = "4";
list.append(newItem);                 // adds at the end
console.log(list.children.length);    // 4 now

const firstItem = document.createElement("li");
firstItem.textContent = "priority hobby";
list.prepend(firstItem);              // adds at the start

// ---------------------------------------------------------------------------
// 5. Removing elements
// ---------------------------------------------------------------------------
firstItem.remove();   // an element can remove itself directly, no parent lookup needed

// ---------------------------------------------------------------------------
// 6. Batching changes to avoid layout thrash
// ---------------------------------------------------------------------------
// Each change to something visible on the page can force the browser to
// recompute layout. Changing 100 elements one at a time in a loop, each
// triggering a re-layout, is slow. Building the new content off-screen
// first and inserting it once is fast:
const fragment = document.createDocumentFragment();
for (let i = 0; i < 3; i++) {
  const li = document.createElement("li");
  li.textContent = `batched item ${i}`;
  fragment.append(li);          // added to the fragment, NOT the live page yet
}
list.append(fragment);          // ONE insertion into the real page, not three

console.log("\nNext: 14_events.js");
