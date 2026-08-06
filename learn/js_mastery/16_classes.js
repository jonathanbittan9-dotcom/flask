/**
 * 16_classes.js — class, this, extends, private fields.
 *
 * Run it:
 *     node 16_classes.js
 */

// ---------------------------------------------------------------------------
// 1. class, constructor, methods
// ---------------------------------------------------------------------------
class Book {
  constructor(title, author) {
    this.title = title;      // instance attribute — same idea as Python's self.title
    this.author = author;
  }

  describe() {                // instance method — no `self` parameter, `this` is implicit
    return `"${this.title}" by ${this.author}`;
  }
}

const book = new Book("Dune", "Frank Herbert");
console.log(book.describe());

// Directly parallel to your Python __init__ / self pattern from testlearn.py:
//   class Book:
//       def __init__(self, title, author):
//           self.title = title
//           self.author = author
//       def describe(self):
//           return f'"{self.title}" by {self.author}'

// ---------------------------------------------------------------------------
// 2. this — and why arrow functions behave differently
// ---------------------------------------------------------------------------
class Counter {
  constructor() {
    this.count = 0;
  }

  incrementRegular() {
    this.count++;
    return this.count;
  }
}

const counter = new Counter();
console.log(counter.incrementRegular());   // 1 — called as counter.incrementRegular(), `this` is counter

const detached = counter.incrementRegular;
try {
  detached();   // called with NO object in front of it — `this` is undefined here
} catch (e) {
  console.log("as expected:", e.constructor.name, "-", e.message);
}
// `this` in a regular function/method is decided by HOW it's called, not
// where it's defined. Detach a method from its object (pass it as a
// callback, assign it to a variable) and `this` breaks. This bites
// constantly with event handlers (file 14) and setTimeout.

class SafeCounter {
  constructor() {
    this.count = 0;
    // Binding in the constructor is one classic fix:
    this.incrementBound = this.incrementBound.bind(this);
  }
  incrementBound() {
    this.count++;
    return this.count;
  }
}
const safe = new SafeCounter();
const detachedSafe = safe.incrementBound;
console.log(detachedSafe());   // 1 — works, because .bind() locked `this` permanently

class ArrowCounter {
  count = 0;                          // class field — see section 4
  increment = () => {                  // arrow method — `this` comes from where it was
    this.count++;                      // DEFINED (the constructor's scope), never from
    return this.count;                 // how it's called. This is the modern fix.
  };
}
const arrowCounter = new ArrowCounter();
const detachedArrow = arrowCounter.increment;
console.log(detachedArrow());   // 1 — also works, no .bind() needed

// ---------------------------------------------------------------------------
// 3. extends and super
// ---------------------------------------------------------------------------
class Ebook extends Book {
  constructor(title, author, fileSizeMb) {
    super(title, author);        // must call super() before using `this` in a subclass
    this.fileSizeMb = fileSizeMb;
  }

  describe() {                    // overriding the parent method
    return `${super.describe()} (${this.fileSizeMb}MB ebook)`;
  }
}

const ebook = new Ebook("Dune", "Frank Herbert", 3.2);
console.log(ebook.describe());
console.log(ebook instanceof Book);   // true — Ebook IS-A Book

// Directly parallel to Python's:
//   class Ebook(Book):
//       def __init__(self, title, author, file_size_mb):
//           super().__init__(title, author)
//           self.file_size_mb = file_size_mb

// ---------------------------------------------------------------------------
// 4. Static members and #private fields
// ---------------------------------------------------------------------------
class Library {
  static totalBooks = 0;               // shared across ALL instances, like Python's class variables

  #catalog = [];                        // #-prefixed = truly private, not just convention

  addBook(book) {
    this.#catalog.push(book);
    Library.totalBooks++;
  }

  get bookCount() {                     // a getter — accessed like a property, not called
    return this.#catalog.length;
  }
}

const library = new Library();
library.addBook(book);
library.addBook(ebook);
console.log(library.bookCount);         // 2 — read like a property: library.bookCount, no ()
console.log(Library.totalBooks);        // 2 — accessed on the CLASS, not an instance

// Referencing library.#catalog outside the class is a SyntaxError the
// engine catches while PARSING — same story as the illegal `break` in
// 06_loops.js, it would stop this whole file from running before a single
// line executes. eval() defers parsing that fragment to this exact line:
try {
  eval("library.#catalog");
} catch (e) {
  console.log("as expected:", e.constructor.name, "- private fields are enforced by the language, not just convention");
}

// ---------------------------------------------------------------------------
// 5. Prototypes underneath the syntax
// ---------------------------------------------------------------------------
// `class` is convenient syntax over JavaScript's actual object model:
// prototypes. Every object has a hidden link to another object it falls
// back to for anything it doesn't have itself. `book.describe()` works
// because Book.prototype.describe exists, and `book` links to it:
console.log(Object.getPrototypeOf(book) === Book.prototype);   // true
console.log(typeof Book.prototype.describe);                    // "function"
// You'll rarely touch prototypes directly in modern code — `class` covers
// nearly everything — but recognizing the word explains phrases like
// "prototype chain" and "prototype pollution" you'll run into in the wild.

console.log("\nNext: 17_errors.js");
