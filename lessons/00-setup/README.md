# Lesson 00 — Setup

**Goal:** a clean, reproducible environment, a running Flask server, and Postman talking to it.

---

## 1. Virtual environments: why and how

Every Python project needs its own set of installed packages. If you `pip install`
globally, project A's Flask 2 and project B's Flask 3 fight each other.
A **virtual environment** (venv) is a private folder of packages for *one* project.

```bash
cd ~/workspace/flask
python -m venv .venv          # create it (once). ".venv" is the folder name.
source .venv/bin/activate     # activate it (every new terminal)
```

When it's active, your prompt shows `(.venv)` and `python` / `pip` point inside `.venv/`.
Check with:

```bash
which python      # → .../flask/.venv/bin/python
```

`deactivate` turns it off. `.venv/` is in `.gitignore`. You never commit it,
because anyone can recreate it from `requirements.txt`.

## 2. requirements.txt: your dependency list

```bash
pip install -r requirements.txt
```

`requirements.txt` lists what the project needs (`flask`, `pytest`) and which versions
are acceptable (`flask>=3.1,<4` means "any 3.x from 3.1 up, never 4"). Upper bounds
protect you from a future major version that breaks your code.

> **Rule:** when you add a package, add it to `requirements.txt` in the same commit.

## 3. Running a Flask app

There are two ways. You've used the first before:

```python
if __name__ == "__main__":
    app.run(debug=True)
```

```bash
python demo.py
```

The **recommended** way is the Flask CLI:

```bash
flask --app lessons/00-setup/hello.py run --debug
```

Why the CLI is better:

- No `app.run()` at the bottom of every file, so importing the file (e.g. in tests)
  never accidentally starts a server.
- Same command for every project. Options like `--port 5001` and `--host 0.0.0.0` live
  on the command line, not hard-coded in the source.

`--debug` turns on two things:

1. **Auto-reload:** save a file and the server restarts by itself.
2. **Interactive debugger:** crashes show a stack trace in the browser.
   **Never** use `--debug` in production, because that debugger can run arbitrary code.

Stop the server with `Ctrl+C`.

## 4. Postman setup

Postman is an HTTP client with a GUI. A browser can only easily send `GET` requests by
typing a URL. Postman can send **any** method, with any headers and body, and shows
you the full response. It's the standard tool for building and debugging APIs.

You already have it installed (`postman` on your PATH).

1. Open Postman and sign in (or use the lightweight client with no account).
2. Create a workspace: **Workspaces → Create Workspace → "Flask Course"**.
3. **Import** both files from this repo's `postman/` folder:
   **Import** (top-left) → drag in
   - `postman/flask-course.postman_collection.json`: saved requests for every lesson
   - `postman/local.postman_environment.json`: the variable `base_url = http://127.0.0.1:5000`
4. Select the environment: top-right dropdown → **Local**.

Every saved request uses `{{base_url}}/...` instead of the full address.
If you later run on port 5001 or deploy to a real server, you change **one variable**,
not 50 requests. That's lesson 02's topic. For now, just notice the `{{ }}`.

---

## Exercises

**E0.1: Environment**

1. Create and activate the venv, then install requirements.
2. Run `pip list` and confirm `Flask 3.x` and `pytest` are there.
3. Run `pytest lessons/00-setup`. It should pass.

**E0.2: First server**

1. Start `hello.py` with the Flask CLI in debug mode.
2. Open `http://127.0.0.1:5000/` in the browser.
3. Change the message in `hello.py`, save, and refresh. Watch the terminal: you'll see
   the auto-reload happen.

**E0.3: First Postman request**

1. In Postman, open the collection → `00 Setup` → `Hello`. Click **Send**.
2. Find these three things in the response panel and write them down:
   - the **status code** (top-right of the response)
   - the **time** in ms
   - the value of the `Content-Type` **header** (Headers tab)
3. Stop the server (`Ctrl+C`) and send the request again. What error does Postman show?
   That's what "nothing is listening on that port" looks like. You'll see it often.

**E0.4: Git**

Commit: `git add -A && git commit -m "lesson 00: setup"`.
