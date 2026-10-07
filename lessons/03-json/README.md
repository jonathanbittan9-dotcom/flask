# Lesson 03 — JSON In, JSON Out

**Goal:** accept JSON request bodies safely: parse, validate, and respond with the right
status (`201`, `400`, `401`, `415`). Then start writing **automated tests inside Postman**.

---

## 1. A bug from your old code

This was in your old `flask-project/main.py`:

```python
@app.route('/submit', methods=['POST'])
def submit():
    data = request.get_json()
    name = data.get('name')
    password = data.get('password')
    if name == "jonathan" and password == 123:
        ...
```

Send it `{"name": "jonathan", "password": "123"}` from Postman and you get banned. Why?
In JSON, `"123"` (quotes) is a **string** and `123` is a **number**. Python compares
`"123" == 123` → `False`. The code only worked when the client happened to send a number.

There are three more hidden problems:

| Send this | What happens |
|---|---|
| No body, or body as **Text** instead of JSON | `get_json()` → Flask aborts with **415 Unsupported Media Type** (HTML error page, not JSON) |
| `{"name": "jonathan",` (broken JSON) | **400** HTML error page |
| `["jonathan", "123"]` (valid JSON, but a list) | `data.get` → `AttributeError` → **500**. Your server crashed on client input |

Every one of these is the client's mistake, and every one should get a clear JSON `4xx`.
This lesson is about making that happen.

## 2. How a JSON body arrives

```
POST /login HTTP/1.1
Content-Type: application/json        ← "the body is JSON, parse it as such"
Content-Length: 41

{"username": "jonathan", "password": "1234"}
```

The `Content-Type` header is a promise from the client. Flask uses it to decide how
to read the body:

| Flask API | Reads | When |
|---|---|---|
| `request.get_json()` | JSON body → `dict`/`list`/... | APIs (this course) |
| `request.form` | HTML form body | browser forms (your old todo app) |
| `request.args` | query string | lesson 02 |
| `request.data` | raw bytes | rarely |

### `get_json()` vs `get_json(silent=True)`

```python
data = request.get_json()               # wrong Content-Type → 415, bad JSON → 400 (HTML pages)
data = request.get_json(silent=True)    # either problem → returns None, you decide what to say
```

With `silent=True` you stay in control, so the error is in **your** JSON format.

## 3. Validating a body: the checklist

JSON gives you **any** shape. Check these, in order, and stop at the first failure:

1. **Is it a JSON object?** `isinstance(data, dict)`. Catches `None`, lists, numbers.
2. **Are required fields present?** Report *all* missing ones at once, which saves the client round-trips.
3. **Right types?** `isinstance(value, str)`.
   Watch out: in Python `bool` is a subclass of `int`, so `isinstance(True, int)` is `True`.
   To accept numbers but not booleans:
   `isinstance(x, (int, float)) and not isinstance(x, bool)`
4. **Right values?** Not empty after `.strip()`, in range, allowed choice…

Then do the work.

> Later (lesson 05+) we'll move validation into reusable helpers or a library such as
> `pydantic` or `marshmallow`. Writing it by hand once first is how you learn what those libraries do for you.

## 4. Status codes for writes

| Situation | Status | Body |
|---|---|---|
| Created a new thing | **201 Created** + `Location: /notes/7` header | the created object, including its new `id` |
| Action succeeded, nothing created | **200 OK** | result |
| Body malformed / failed validation | **400 Bad Request** | `{"error": "..."}` |
| Body isn't JSON at all (wrong Content-Type) | **415 Unsupported Media Type** | `{"error": "..."}` |
| Credentials wrong | **401 Unauthorized** | `{"error": "..."}`. Don't say *which* of username/password was wrong, since that helps attackers |
| Resource id doesn't exist | **404 Not Found** | `{"error": "..."}` |

Why `Location`? It tells the client "your new thing lives *here*", so the client never has
to guess or build the URL. Build it with `url_for`, never by hand.

## 5. Postman: sending JSON & writing tests

Run the demo:

```bash
flask --app lessons/03-json/demo.py run --debug
```

### Sending a JSON body

1. Method **POST**, URL `{{base_url}}/echo`.
2. **Body** tab → **raw** → in the dropdown at the end pick **JSON**.
3. Type the JSON. Postman auto-adds `Content-Type: application/json` (see Headers → hidden).

Now try the failure modes from section 1 on purpose: switch the dropdown to **Text**,
break the JSON, send a list. Read the status and body each time.

### Tests: let Postman check the response for you

Every request has a **Scripts → Post-response** tab (older Postman versions call it **Tests**).
JavaScript there runs after the response arrives:

```javascript
pm.test("status is 201", () => {
    pm.response.to.have.status(201);
});

pm.test("returns the created note", () => {
    const body = pm.response.json();
    pm.expect(body.title).to.eql("Buy milk");
    pm.expect(body).to.have.property("id");
});

pm.test("Location header points at the note", () => {
    const body = pm.response.json();
    pm.expect(pm.response.headers.get("Location")).to.eql(`/notes/${body.id}`);
});
```

Results appear in the response panel's **Test Results** tab. Use the **Snippets** sidebar on the
right of the script editor to see ready-made examples.

### Saving data for the next request (a preview of lesson 04)

```javascript
pm.collectionVariables.set("note_id", pm.response.json().id);
```

Now another request can use `{{base_url}}/notes/{{note_id}}`. That's how you chain
create → read → update → delete without copy-pasting ids.

---

## Exercises: `exercise.py`

```bash
flask --app lessons/03-json/exercise.py run --debug
pytest lessons/03-json
```

**All errors must be JSON `{"error": "..."}`. Use the exact messages below, since the tests check them.**

### E3.1: `POST /login`

Body: `{"username": "...", "password": "..."}`. Valid users are in `USERS`.

| Case | Status | Body |
|---|---|---|
| Body missing / not JSON / not an object | 400 | `{"error": "request body must be a JSON object"}` |
| Missing fields | 400 | `{"error": "missing field(s): password"}`, comma-separated in the order `username, password` |
| A field that isn't a string | 400 | `{"error": "username and password must be strings"}` |
| Wrong credentials | 401 | `{"error": "invalid username or password"}` |
| Success | 200 | `{"message": "welcome, jonathan"}` |

Note `{"password": 1234}` (a number) must be a **400**, not a 401. You're fixing the old bug properly:
reject the wrong type explicitly instead of letting a comparison silently fail.

### E3.2: `POST /sum`

Body: `{"numbers": [1, 2.5, -3]}` → `200 {"sum": 0.5, "count": 3}`

| Case | Status | Body |
|---|---|---|
| Not a JSON object, or no `numbers` key | 400 | `{"error": "body must be {\"numbers\": [...]}"}` |
| `numbers` isn't a list, or contains a non-number (strings, `null`, **booleans**) | 400 | `{"error": "numbers must be a list of numbers"}` |
| Empty list | 200 | `{"sum": 0, "count": 0}` |

### E3.3: Notes: create & read

- `POST /notes` with `{"title": "Buy milk", "tags": ["home"]}`
  - `title` required, a string, not blank after `.strip()`. Store it **stripped**.
    Otherwise → `400 {"error": "title is required"}`.
  - `tags` optional (default `[]`), must be a list of strings. Otherwise → `400 {"error": "tags must be a list of strings"}`.
  - Success → `201`, body `{"id": 1, "title": "Buy milk", "tags": ["home"]}`, header `Location: /notes/1`.
    Ids start at 1 and go up.
- `GET /notes/<id>` → `200` the note, or `404 {"error": "note 7 not found"}`.
- `GET /notes` → `200` with a JSON **list** of all notes, oldest first.

Hint: you'll check "is this a list of strings" twice in this file. Write one small helper.

### Postman exercises (self-checked)

- **P3.1** In a **03 Exercises** folder, save `POST /login` with the old-bug body `{"username": "jonathan", "password": 1234}`.
  Add a post-response test asserting the status is `400`. Duplicate it for the success case (test for `200` and the message).
- **P3.2** Send `POST /login` with the body type set to **Text** but the same JSON content. What status and error do
  you get, and **why**? Find the request's `Content-Type` in the Postman Console.
- **P3.3** Save `POST /notes` with a test that checks `201`, the `Location` header, and then **saves the id**:
  `pm.collectionVariables.set("note_id", pm.response.json().id)`. Save `GET {{base_url}}/notes/{{note_id}}`
  with a test that the title matches. Send them in order and watch the variable flow from one request to the next.
- **P3.4** Right-click the **03 Exercises** folder → **Run folder**. This is the **Collection Runner**: it sends every
  request in order and shows all test results. Get it fully green.

### Check yourself

1. Why does `get_json()` return `None` with `silent=True` when you choose the Text body type in Postman?
2. A client sends `{"title": "   "}`. Why is that a 400 and not a 201 with an empty title?
3. `isinstance(True, int)` → ? Why does that matter for `/sum`?
4. Why should a failed login say "invalid username or password" instead of "wrong password"?
