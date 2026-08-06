/**
 * 12_dom_selecting.js — querySelector, traversal.
 *
 * This file needs a BROWSER, not Node — `document` doesn't exist in Node.
 * Open demo.html (same folder), press F12 -> Console, and paste this code
 * in, or uncomment the matching <script> line at the bottom of demo.html
 * and reload.
 */

// ---------------------------------------------------------------------------
// 1. The DOM is a tree
// ---------------------------------------------------------------------------
// When the browser parses your HTML, it builds an in-memory tree of objects
// — the Document Object Model. Every tag becomes a node you can find,
// read, and change from JavaScript. Flask sends the HTML text; the DOM is
// what the browser turns that text INTO once it arrives.

// ---------------------------------------------------------------------------
// 2. querySelector / querySelectorAll — the ones you want
// ---------------------------------------------------------------------------
// Same selector syntax as CSS (css_mastery/02_selectors.html) — if you can
// write a CSS selector, you can already do this.

const title = document.querySelector("#card-title");   // by id
console.log(title.textContent);                          // "Welcome"

const note = document.querySelector(".note");            // by class, first match
console.log(note.textContent);

const firstListItem = document.querySelector("#hobby-list li");   // descendant combinator
console.log(firstListItem.textContent);

const allListItems = document.querySelectorAll("#hobby-list li");  // ALL matches
console.log("count:", allListItems.length);

// ---------------------------------------------------------------------------
// 3. Why a NodeList is not quite an array
// ---------------------------------------------------------------------------
// querySelectorAll returns a NodeList — array-LIKE (has .length, works with
// for...of), but missing most array methods like .map() and .filter()
// directly:
console.log(typeof allListItems.map);   // "undefined" — no .map on a NodeList

const asRealArray = Array.from(allListItems);        // convert explicitly...
const asRealArray2 = [...allListItems];              // ...or spread it
console.log(asRealArray.map((li) => li.textContent));   // now .map works

for (const li of allListItems) {   // for...of DOES work directly on a NodeList
  console.log("hobby:", li.textContent, "id:", li.dataset.id);
}

// ---------------------------------------------------------------------------
// 4. getElementById — the older way, still fine for a single lookup by id
// ---------------------------------------------------------------------------
const titleAgain = document.getElementById("card-title");   // no "#" prefix here
console.log(titleAgain === title);   // true — same element, found two ways

// querySelector is more flexible (any CSS selector, not just #id) and is
// the one to reach for by default; getElementById is marginally faster and
// you'll still see it in older code.

// ---------------------------------------------------------------------------
// 5. Traversal: moving relative to an element you already have
// ---------------------------------------------------------------------------
const card = document.querySelector(".card");
console.log(card.children);              // its direct child elements
console.log(card.children.length);       // 3: h2, p, button

const button = document.querySelector("#cta-button");
console.log(button.parentElement);              // the .card div
console.log(button.parentElement.className);    // "card"
console.log(button.closest(".card"));           // nearest ancestor matching a selector
                                                  // (works even from deep inside nested tags)

// ---------------------------------------------------------------------------
// 6. Why selection fails when the script runs too early
// ---------------------------------------------------------------------------
// If a <script> tag sits in <head> instead of just before </body> (or lacks
// `defer`), it runs BEFORE the HTML below it has been parsed — so
// document.querySelector("#hobby-list") returns null, and the very next
// line throws "Cannot read properties of null". This is the single most
// common beginner DOM error. Fix: move the script tag to just before
// </body>, or add the `defer` attribute to a <script src="...">.

const missing = document.querySelector("#does-not-exist");
console.log("missing element:", missing);   // null, not an error by itself —
                                             // the error comes from the NEXT
                                             // line trying to use it, e.g.
                                             // missing.textContent

console.log("\nNext: 13_dom_changing.js");
