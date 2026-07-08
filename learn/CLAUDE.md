# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Working style

This is a **learning sandbox**, not a production app. The user is working through Flask
fundamentals step by step and typically edits the code themselves while Claude guides and
explains. Favor teaching — explain *why*, one concept at a time, suggest the next small
step — over silently making large rewrites.

## Overview

A single-file Flask learning project (Flask 2.3.3). The entire application is `hello.py`,
which defines route handlers and (via `app.run(debug=True)`) starts Flask's built-in
development server directly. Jinja2 templates live in `templates/`. `server_out.log` is
captured output from a prior run — a scratch artifact, not part of the app.

## Running

From this directory (PowerShell on Windows):

```powershell
python hello.py            # starts the dev server on http://127.0.0.1:5000
```

The bottom of `hello.py` calls `app.run(debug=True)`, so `python hello.py` is the
canonical way to run it. Alternatively use the Flask CLI:

```powershell
$env:FLASK_APP = "hello.py"; flask run --debug
```

`debug=True` enables auto-reload on file changes and the interactive debugger.
Stop the server with `Ctrl+C`.

If Flask is missing: `pip install flask`.

## Architecture notes

- Routes with typed converters share a URL prefix but dispatch by type: `/user/<name>`
  (string) and `/user/<int:age>` (int). Flask matches the `int:` converter first, so
  `/user/25` hits `user_age` and `/user/itay` hits `user_name`. Adding overlapping
  `/user/...` routes requires care about converter precedence.
- Handlers that call `render_template("home.html")` resolve names against `templates/`.
  `home()` passes `name` and `hobbies` into the template; other handlers return a plain
  string (as in `/about`), which is sent as the response body directly.
- `home()` also appends a line to `logs/app.log` on each visit, creating the `logs/`
  folder on demand via `os.makedirs(..., exist_ok=True)`. The `logs/` folder and
  `server_out.log` are generated scratch artifacts, not source — safe to delete.

There is no test suite, linter config, or dependency manifest in this repo.
