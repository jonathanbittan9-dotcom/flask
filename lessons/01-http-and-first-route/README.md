# Lesson 01 — HTTP & Your First Routes

**Goal:** understand exactly what travels between Postman and Flask, and control every
part of the response: body, status code, and headers.

---

## 1. HTTP in one picture

Every interaction is one **request** followed by one **response**. Both are plain text.

```
REQUEST  (client → server)                RESPONSE  (server → client)
─────────────────────────────            ─────────────────────────────
GET /health HTTP/1.1          ← line     HTTP/1.1 200 OK               ← status line
Host: 127.0.0.1:5000          ← headers  Content-Type: application/json ← headers
Accept: */*                              Content-Length: 16
                              ← blank                                   ← blank
                              ← body     {"status":"ok"}               ← body
```

| Part             | Request                                  | Response                              |
|------------------|------------------------------------------|---------------------------------------|
| First line       | **method** + **path**                    | **status code** + reason              |
| Headers          | metadata (`Content-Type`, `Authorization`…) | metadata (`Content-Type`, `Location`…) |
| Body             | data you send (JSON, form)               | data you get back                     |

### Methods: what you want to do

| Method   | Meaning                         | Has a body? |
|----------|---------------------------------|-------------|
| `GET`    | read something                  | no          |
| `POST`   | create something / run an action | yes         |
| `PUT`    | replace something entirely      | yes         |
| `PATCH`  | change part of something         | yes         |
| `DELETE` | remove something                 | usually no  |

### Status codes: how it went

Learn the families, then the common members:

| Family | Meaning        | Ones you'll use constantly |
|--------|----------------|----------------------------|
| `2xx`  | success        | `200 OK`, `201 Created`, `204 No Content` |
| `3xx`  | go elsewhere   | `302 Found` (redirect) |
| `4xx`  | **client's** fault | `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `405 Method Not Allowed` |
| `5xx`  | **server's** fault | `500 Internal Server Error` |

The 4xx/5xx split matters: a `4xx` says "fix your request", a `5xx` says "we have a bug".
Returning `200` with `{"error": ...}` in the body is a classic mistake. Tools,
browsers, and monitoring all trust the status code, not your body text.

---

## 2. Flask's job: map (method, path) → function

```python
@app.get("/health")          # same as @app.route("/health", methods=["GET"])
def health():
    return {"status": "ok"}
```

Flask 2+ has shortcuts `@app.get`, `@app.post`, `@app.put`, `@app.patch`, `@app.delete`.
They're clearer than `@app.route(..., methods=[...])` because you see the method at a glance.

If a path exists but not for that method, Flask answers **405 Method Not Allowed**
automatically, with an `Allow` header listing the methods that *are* accepted.
If the path doesn't exist at all → **404**.

## 3. What a view function can return

Flask turns your return value into a response. These are the forms you'll use:

```python
return "hello"                          # text/html body, status 200
return {"status": "ok"}                 # dict → JSON body, status 200
return ["a", "b"]                       # list → JSON body, status 200
return {"error": "nope"}, 404           # (body, status)
return {"id": 7}, 201, {"Location": "/users/7"}   # (body, status, headers)
```

That's it. A tuple of **(body, status, headers)**, where status and headers are optional.

> Notice in Postman: Flask **sorts JSON keys alphabetically** by default, so `{"name": .., "id": ..}`
> arrives as `{"id": .., "name": ..}`. JSON objects have no meaningful order, so clients must never
> depend on it.

> You used `jsonify(...)` before. Since Flask 2.2, returning a dict or list does the
> same thing, so we'll just return dicts. `jsonify` still exists and is fine.

### Why JSON?

`"hello"` is text for humans. `{"status": "ok"}` is **data for programs**: a frontend,
a mobile app, or another server can parse it reliably. APIs speak JSON. Its
`Content-Type` is `application/json`, and that header is how the client knows
how to parse the body.

## 4. Reading the request: the `request` object

```python
from flask import request

request.method        # "GET"
request.path          # "/whoami"
request.headers       # dict-like:  request.headers.get("User-Agent")
```

`request` looks global, but Flask makes it point at the *current* request, even with
many requests at once. Use it only inside view functions.

---

## 5. Postman: reading a response properly

Run the demo:

```bash
flask --app lessons/01-http-and-first-route/demo.py run --debug
```

Open the collection folder **01 HTTP** and send each request. For every response, look at:

- **Status** (top-right): the number *and* the reason (`201 CREATED`).
- **Time / Size**: useful later for spotting slow endpoints.
- **Body → Pretty / Raw**: Pretty formats JSON; Raw shows exactly what came over the wire.
- **Headers tab**: `Content-Type`, `Content-Length`, and any custom headers.

### The Postman Console: see the real HTTP

**View → Show Postman Console** (or `Ctrl+Alt+C`). Every request you send is logged
with the full request and response headers. When something "doesn't work",
the Console tells you what was **actually** sent, which is often not what you thought.

---

## Exercises: `exercise.py`

Start the exercise server and the tests side by side:

```bash
flask --app lessons/01-http-and-first-route/exercise.py run --debug
pytest lessons/01-http-and-first-route         # in a second terminal
```

| #    | Endpoint            | Must return |
|------|---------------------|-------------|
| E1.1 | `GET /ping`         | `200`, JSON `{"message": "pong"}` |
| E1.2 | `GET /version`      | `200`, JSON `{"name": "flask-course", "version": "1.0.0"}`, **and** a response header `X-App-Version: 1.0.0` |
| E1.3 | `GET /coffee`       | `418`, JSON `{"error": "I'm a teapot"}` (yes, 418 is real, from an April Fools' RFC) |
| E1.4 | `POST /launch`      | `202`, JSON `{"status": "launching"}`. A `GET /launch` must give `405` (you get that for free, so make sure you understand why) |
| E1.5 | `GET /whoami`       | `200`, JSON `{"method": ..., "path": ..., "user_agent": ...}`, taken from the request. If there's no `User-Agent` header, use `"unknown"` |

### Postman exercises (self-checked)

- **P1.1** Create a new folder in the collection: **01 Exercises**. Save one request for each
  of E1.1–E1.5 there, using `{{base_url}}`.
- **P1.2** Send `GET /launch`. Find the `Allow` header in the response. Which methods does it list,
  and why is `OPTIONS` in there even though you never wrote it? (Hint: search "HTTP OPTIONS
  method CORS preflight". A one-sentence answer is enough.)
- **P1.3** Send `GET /whoami` and note the `user_agent`. Now go to the request's **Headers** tab,
  untick the auto-generated `User-Agent` (click "hidden" headers to see it) and send again.
  You should get `"unknown"`. You just proved the server only knows what the client chooses to send.
- **P1.4** Open the Postman Console and find the raw request line for your last request.

### Check yourself (answer in your head, then verify)

1. You return `{"error": "not found"}` with no status. What status does the client get? Why is that bad?
2. What's the difference between a `404` and a `405`?
3. Which header tells Postman to pretty-print the body as JSON?
