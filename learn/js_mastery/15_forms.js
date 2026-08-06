/**
 * 15_forms.js — reading input, FormData, live validation.
 *
 * Needs a browser. Open demo.html, F12 -> Console, paste this in (or use the
 * commented <script> line in demo.html). Then type in the form and submit it.
 */

// ---------------------------------------------------------------------------
// 1. Reading input.value
// ---------------------------------------------------------------------------
const emailInput = document.querySelector("#email-input");
const status = document.querySelector("#status");

console.log("current value:", emailInput.value);   // whatever's typed right now, always a string

// For a checkbox or radio, read .checked instead of .value:
//   const isChecked = document.querySelector("#some-checkbox").checked;

// ---------------------------------------------------------------------------
// 2. The 'input' event — fires on every keystroke
// ---------------------------------------------------------------------------
emailInput.addEventListener("input", (event) => {
  console.log("typing:", event.target.value);
});

// ---------------------------------------------------------------------------
// 3. Live validation as the user types
// ---------------------------------------------------------------------------
emailInput.addEventListener("input", () => {
  const looksValid = emailInput.value.includes("@") && emailInput.value.includes(".");
  status.textContent = emailInput.value.length === 0
    ? ""
    : looksValid ? "looks okay" : "needs an @ and a .";
  status.style.color = looksValid ? "green" : "#A96A22";
});
// This is a UX nicety, not real validation — "@." would pass this check.
// It exists to give instant feedback, not to be the actual gatekeeper.

// ---------------------------------------------------------------------------
// 4. The 'submit' event and preventDefault
// ---------------------------------------------------------------------------
const form = document.querySelector("#signup-form");

form.addEventListener("submit", (event) => {
  event.preventDefault();   // stop the browser's default full-page reload + navigation

  const email = emailInput.value.trim();
  if (!email.includes("@")) {
    status.textContent = "Please enter a valid email.";
    status.style.color = "red";
    return;   // stop here — don't "submit" a bad value
  }

  status.textContent = `Would send "${email}" to the server now.`;
  status.style.color = "green";
  console.log("submitted:", email);

  // In a real app, this is exactly where 20_fetch_flask_api.js's fetch()
  // call goes — POST the data to a Flask route instead of just logging it.
});

// ---------------------------------------------------------------------------
// 5. FormData — reading a whole form at once
// ---------------------------------------------------------------------------
// For a form with several fields, reading each input individually gets
// tedious. FormData collects everything by its `name` attribute in one go:
form.addEventListener("submit", (event) => {
  const data = new FormData(form);          // must run before event.preventDefault()'s
                                              // effects matter — FormData just reads
                                              // the form's current state
  console.log("FormData email:", data.get("email"));
  console.log("as a plain object:", Object.fromEntries(data));
});

// ---------------------------------------------------------------------------
// 6. Why the server must validate anyway
// ---------------------------------------------------------------------------
// Nothing here is trustworthy from Flask's point of view. A visitor can
// open DevTools and call fetch() directly, bypassing this form and every
// check in it entirely. Client-side validation is purely for a nicer,
// faster experience — the real gatekeeping happens in hello.py, exactly
// the way request.form.get(...) is already checked there. Client-side
// validation is a courtesy; server-side validation is the actual rule.

console.log("\nType in the email field and submit the form in demo.html to see this run.");
console.log("Next: 16_classes.js");
