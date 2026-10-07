# Flask — From Scratch, Properly

A step-by-step Flask course focused on building **real HTTP APIs**, tested with
**Postman** and **pytest**. Each lesson builds on the previous one.

> Your old learning files are archived in git, not lost:
> `git checkout archive/old-learning` to look, `git checkout main` to come back.

---

## How every lesson works

Each folder in `lessons/` has the same shape:

| File               | What it is                                                        |
|--------------------|-------------------------------------------------------------------|
| `README.md`        | The lesson. Read it top to bottom **before** touching code.       |
| `demo.py`          | A small, complete, runnable app showing the concepts. Run it, poke it with Postman. |
| `exercise.py`      | Your work. It has `TODO`s. You fill them in.                      |
| `test_exercise.py` | Automated checks for your exercise. Red → green.                  |
| `solution.py`      | One possible answer. **Only open it after you're done** (or truly stuck for 20+ min). |

The loop for every lesson:

1. Read `README.md`.
2. Run `demo.py`, send its requests from Postman, and **read the code** next to each response.
3. Solve `exercise.py`. Run the tests often:
   ```bash
   pytest lessons/01-http-and-first-route
   ```
4. Do the **Postman exercises** at the bottom of the lesson (these aren't auto-checked — be honest with yourself).
5. Compare with `solution.py`. Different is fine — understand *why* it's different.
6. Commit: `git commit -am "lesson 01 done"`.

To check that the reference solutions pass (useful if you suspect a test is wrong):

```bash
LESSON_TARGET=solution pytest lessons/
```

---

## Course map

| #  | Lesson                                    | Flask                                         | Postman                                         |
|----|-------------------------------------------|-----------------------------------------------|-------------------------------------------------|
| 00 | [Setup](lessons/00-setup/README.md)       | venv, requirements, running the server        | Install, workspace, import collection & environment |
| 01 | [HTTP & your first routes](lessons/01-http-and-first-route/README.md) | request/response, return types, status codes, headers, methods | Send requests, read status/headers/body, Console |
| 02 | [Routing & parameters](lessons/02-routing-and-params/README.md) | path params, converters, query strings, validation | Params tab, path variables, environment variables |
| 03 | [JSON in, JSON out](lessons/03-json/README.md) | request bodies, `get_json`, validation, 201/400/415 | Raw JSON bodies, Tests tab (`pm.test`) |
| 04 | CRUD REST API                              | GET/POST/PUT/PATCH/DELETE on a resource       | Collections, chaining requests with variables   |
| 05 | Errors done right                          | `abort`, error handlers, one error format     | Tests for error cases, Collection Runner        |
| 06 | Project structure                          | app factory, blueprints, config classes       | Multiple environments (dev / prod)              |
| 07 | Testing with pytest                        | test client, fixtures, test isolation         | Newman (Postman from the command line)          |
| 08 | Databases                                  | SQLite + SQLAlchemy, models, migrations       | —                                               |
| 09 | Authentication                             | password hashing, tokens, protected routes    | Auth tab, saving a token from a login response  |
| 10 | Logging & observability                    | structured logs, request IDs, health checks   | —                                               |
| 11 | Server-rendered HTML                       | Jinja templates, forms, sessions (revisited)  | —                                               |
| 12 | Shipping it                                | gunicorn, env vars, Docker                    | Monitoring a deployed API                       |

Lessons 04+ get written once you've finished 03, so each one matches the pace you're actually going.

---

## Conventions used in this course

- Python ≥ 3.11, Flask 3.x.
- Run the dev server with `flask --app <file> run --debug` (explained in lesson 00).
- Our APIs speak **JSON** in and out. Errors always look like `{"error": "message"}`.
- Code style: clear names, small functions, no clever tricks. A beginner should be able to read it.
