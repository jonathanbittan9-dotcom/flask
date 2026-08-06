# Where to go next

You've now covered the language itself, the DOM, events, forms, classes,
errors, and async code — the actual foundation. This file is an honest map
of what's beyond it, so the next steps feel like informed choices rather
than a wall of unfamiliar names.

## npm and package.json

`npm` (Node Package Manager) is how the JS ecosystem shares code — the
rough equivalent of `pip` and `requirements.txt`. `package.json` lists a
project's dependencies and scripts:

```json
{
  "name": "my-project",
  "scripts": { "start": "node server.js" },
  "dependencies": { "express": "^4.18.0" }
}
```

`npm install <package>` downloads a package into `node_modules/` and
records it in `package.json`, same spirit as `pip install` recording into
`requirements.txt` — except npm does the recording automatically.

## What a bundler is actually for

A bundler (Vite, esbuild, webpack) takes many `import`-connected `.js`
files and combines them into one (or a few) optimized files for
production — smaller, fewer network requests, older-browser-compatible.
`tools/build_single.py` in `course-app/` does something conceptually
similar for that project's HTML.

You don't need one for anything in this series — real `<script
type="module">` files work fine directly in a modern browser. Reach for a
bundler once a project has enough files, or enough non-JS assets (CSS
modules, images, TypeScript) that manual `<script>` tags become the
bottleneck, not before.

## When a framework earns its complexity

React, Vue, and Svelte solve ONE real problem: keeping a complex page's
DOM in sync with changing data, without you hand-writing every
`textContent`/`classList` update from files 12-13. That's a genuine
problem once a page has many interdependent pieces of state — a dashboard,
a chat app, a multi-step form with live validation across fields.

It is NOT a problem `hello.py`-sized projects have yet. Introducing a
framework before you feel that pain firsthand means learning its
abstractions with nothing yet to hang them on. The DOM/events skills from
files 12-15 are also exactly what these frameworks compile DOWN to
underneath — nothing here gets thrown away.

## TypeScript in one page

TypeScript is JavaScript with optional type annotations, checked before
your code runs:

```typescript
function greet(name: string): string {
  return `Hello, ${name}!`;
}
greet(42);   // caught before running: Argument of type 'number' is not
             // assignable to parameter of type 'string'.
```

It compiles down to plain JS — browsers never run TypeScript directly.
The type errors it catches are the same category of bug `def greet(name:
str) -> str:` type hints catch in `core_language_mastery.py` — real, but
optional, and worth adding once a project is big enough that "what shape
is this object supposed to have?" stops being obvious from reading it.

## Reading MDN effectively

https://developer.mozilla.org (MDN) is the JS/CSS/HTML reference to trust
over random blog posts — it's maintained by browser vendors and documents
actual browser support per feature. Habit worth building: whenever a method
here (`.map`, `fetch`, `classList`) feels underexplained, search
`mdn <method name>` — the page will have a "Browser compatibility" table
at the bottom, worth a glance before relying on something very new.

## A realistic next project

Wire `js_mastery/20_fetch_flask_api.js`'s pattern into your actual
`hello.py`: add a real JSON route, call it from `templates/home.html` with
`fetch`, and render the result into the page without a reload. That one
small feature exercises the DOM (13), events (14 — a button triggers it),
`fetch` (20), and error handling (17) all together — the whole point this
series built toward.
