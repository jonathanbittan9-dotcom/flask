# Lesson 02 — Routing & Parameters

**Goal:** get data out of the URL, in the right place, with the right type, and
reject bad input with a clear `400`/`404` instead of crashing.

---

## 1. Two places data lives in a URL

```
http://127.0.0.1:5000/books/42?format=short&lang=he
                     └──┬───┘ └───────────┬────────┘
                    path params      query string
```

| | Path parameter | Query parameter |
|---|---|---|
| Looks like | `/books/42` | `/books?genre=scifi` |
| Use it for | **which** thing: identity | **how** you want it: filter, sort, page, options |
| Required? | yes, the route doesn't match without it | usually optional, with a default |
| Flask | `@app.get("/books/<int:book_id>")` | `request.args.get("genre")` |

Rule of thumb: if removing it changes **what resource** you mean, it's a path param.
If it only changes **how you see** it, it's a query param.

## 2. Path parameters and converters

```python
@app.get("/books/<int:book_id>")
def get_book(book_id):        # book_id is already an int
    ...
```

| Converter | Matches | Python type |
|---|---|---|
| `<name>` / `<string:name>` | anything without `/` (default) | `str` |
| `<int:n>` | positive integers: `0`, `42` | `int` |
| `<float:x>` | `3.14` (**not** `3`, and not negatives) | `float` |
| `<path:p>` | like string but **allows `/`** | `str` |
| `<uuid:id>` | `a8098c1a-f86e-11da-bd1a-00112444be1e` | `uuid.UUID` |

If the converter doesn't match, e.g. `/books/abc` for `<int:book_id>`, Flask
returns **404** before your function runs. You get validation for free.

You noticed this in your old code: `/user/<name>` and `/user/<int:age>` can coexist,
and `/user/25` goes to the `int` one. Flask ranks routes so more specific converters
win. It works, but **avoid it in real APIs**: it's confusing to read.
`/users/<int:id>` and `/users/by-name/<name>` say what they mean.

### Converter gotcha: negatives

`<int:n>` does **not** match `-5`. Use `<int(signed=True):n>` if you need negatives.

## 3. Query parameters with `request.args`

`request.args` is a dict-like of query values. **Every value is a string.**

```python
request.args["page"]                  # KeyError → Flask answers 400 if missing. Avoid.
request.args.get("page")              # None if missing
request.args.get("page", "1")         # "1" if missing (still a string!)
request.args.get("page", 1, type=int) # converts to int; if missing OR not a valid int → 1
```

`type=int` is handy but **silent**: `?page=banana` quietly becomes the default.
Sometimes that's fine. When the user should be told, validate yourself:

```python
raw = request.args.get("page", "1")
if not raw.isdigit():
    return {"error": "page must be a positive integer"}, 400
page = int(raw)
```

Repeated keys (`?tag=a&tag=b`) → `request.args.getlist("tag")` → `["a", "b"]`.

## 4. Validation mindset

Everything from the URL is **untrusted input**. A professional endpoint:

1. Reads the input.
2. Checks it (type, range, allowed values).
3. Returns `400` with a helpful message if it's bad. Say *what* was wrong and *what* is allowed.
4. Only then does the real work.

Doing checks first and the main logic last (sometimes called "guard clauses") keeps the
happy path un-indented and easy to read.

## 5. Building URLs: `url_for`

You used `url_for` in templates. It builds a URL from the **function name**, not a hard-coded
string, so renaming a route doesn't break links:

```python
url_for("get_book", book_id=42)              # "/books/42"
url_for("list_books", genre="scifi")         # "/books?genre=scifi" (extra args → query)
```

In APIs you'll use it for the `Location` header when creating things (lesson 03).

---

## 6. Postman: params & variables

Run the demo:

```bash
flask --app lessons/02-routing-and-params/demo.py run --debug
```

### The Params tab

Type `{{base_url}}/books?genre=scifi&limit=2` and open the **Params** tab: Postman split it
into a key/value table. Edit the table and the URL updates, and vice versa.
Untick a row to disable a param without deleting it, which is great for testing defaults.

### Path variables

Write the URL as `{{base_url}}/books/:book_id`. A **Path Variables** table appears in the
Params tab. Fill `book_id = 2`. Now the request is reusable: change one cell, not the URL.

### Variables and scopes

`{{base_url}}` comes from the **Local** environment. Postman has several variable scopes,
and the narrower one wins:

```
Global  →  Collection  →  Environment  →  (Data)  →  Local
 widest                                         narrowest
```

For now: put **per-server** values (`base_url`, later tokens) in **environments**, and
**per-API constants** in **collection variables** (collection → Variables tab).

---

## Exercises: `exercise.py`

```bash
flask --app lessons/02-routing-and-params/exercise.py run --debug
pytest lessons/02-routing-and-params
```

| #    | Endpoint | Behavior |
|------|----------|----------|
| E2.1 | `GET /square/<n>` | Integer `n` (negatives allowed!). `200 {"n": n, "square": n*n}`. `/square/abc` → `404` (converter does it) |
| E2.2 | `GET /greet/<name>?lang=en` | `lang` is `en` (default) → `{"greeting": "Hello, <name>!"}`, `he` → `{"greeting": "Shalom, <name>!"}`. Any other lang → `400 {"error": "unsupported lang 'xx', use one of: en, he"}` |
| E2.3 | `GET /movies?limit=&offset=` | Paginate the `MOVIES` list. Defaults `limit=3`, `offset=0`. Both must be non-negative integers and `limit` ≤ `10`, otherwise `400 {"error": ...}`. Response: `{"items": [...], "total": len(MOVIES), "limit": .., "offset": ..}` |
| E2.4 | `GET /movies?genre=` | Combine with E2.3: optional `genre` filters **before** paginating, and `total` is the count *after* filtering. Case-insensitive (`?genre=SCIFI` works) |
| E2.5 | `GET /files/<path>` | `/files/docs/2026/notes.txt` → `{"parts": ["docs", "2026", "notes.txt"], "filename": "notes.txt", "extension": "txt"}`. No dot in filename → `"extension": null` |

Hint for E2.3: write one small helper `parse_non_negative_int(name, default)` and use it twice,
rather than copy-pasting the validation.

### Postman exercises (self-checked)

- **P2.1** Save `GET {{base_url}}/movies` in a **02 Exercises** folder with `limit`, `offset`, `genre`
  rows in the Params tab. Practice toggling them on/off and watch `total` and `items` change.
- **P2.2** Save `GET {{base_url}}/square/:n` using a **path variable**. Try `n = -7`, `n = 3.5`, `n = abc`.
  Write down the status for each and explain the `3.5` case.
- **P2.3** Create a **second environment** called `Local 5001` with `base_url = http://127.0.0.1:5001`.
  Start the exercise app with `--port 5001`. Switch environments and send. Same requests, different server.
  This is exactly how you'll switch between dev and production later.
- **P2.4** Add a collection variable `default_limit = 5` and use `limit={{default_limit}}` in a request.
  Hover the variable in the URL bar to see which scope it came from.

### Check yourself

1. `GET /movies?limit=5&limit=7`: what does `request.args.get("limit")` return?
2. Why is `/users/<int:id>/orders?status=open` better than `/users/orders/<status>?id=3`?
3. `request.args.get("page", 1, type=int)` with `?page=-2`. What do you get? Is that OK for pagination?
