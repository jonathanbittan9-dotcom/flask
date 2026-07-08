# =============================================================
# DYNAMIC FLASK WEBSITE - a tiny Todo app
# =============================================================
# Run:
#     pip install flask
#     python app.py
# Then open http://127.0.0.1:5000
#
# This single file shows the core Flask features:
#   - routes (URL -> Python function)
#   - templates (HTML with placeholders + loops)
#   - template inheritance (a shared layout)
#   - forms + POST handling
#   - redirects (Post/Redirect/Get pattern)
#   - flash messages (one-time notifications)
#   - url_for (build URLs from function names, not hard-coded)
#   - static files (CSS)
# =============================================================

from functools import wraps

from flask import (
    Flask, render_template, request, redirect, url_for, flash, abort, session
)

app = Flask(__name__)
# `secret_key` is needed for flash messages and sessions.
# In a real app, load this from an env var, never hard-code it.
app.secret_key = "dev-only-change-me"


# -------------------------------------------------------------
# "Database" - just an in-memory list of dicts.
# Restarting the server clears it. Good enough for learning.
# -------------------------------------------------------------
tasks = [
    {"id": 1, "title": "Learn Flask routes", "done": True},
    {"id": 2, "title": "Build a dynamic page", "done": False},
    {"id": 3, "title": "Use templates", "done": False},
]
# Tracks the next ID to assign. A real DB would auto-increment.
next_id = 4


def find_task(task_id):
    """Return the task dict with this id, or None."""
    return next((t for t in tasks if t["id"] == task_id), None)


# -------------------------------------------------------------
# HOME - list all tasks and show a form to add one
# -------------------------------------------------------------
@app.route("/")
def index():
    # request.args is a dict-like of query-string values.
    # .get(key, default) returns the default if the key is missing.
    # Visit /?show=done or /?show=open to see filtering in action.
    show = request.args.get("show", "all")

    if show == "done":
        visible = [t for t in tasks if t["done"]]
    elif show == "open":
        visible = [t for t in tasks if not t["done"]]
    else:
        visible = tasks

    return render_template("index.html", tasks=visible)


# -------------------------------------------------------------
# ADD - handle the form submission, then redirect home
# -------------------------------------------------------------
# Only POST is allowed - GET would not make sense here.
@app.route("/add", methods=["POST"])
def add():
    global next_id
    # `request.form` is a dict-like of form field values.
    title = request.form.get("title", "").strip()
    if not title:
        # `flash` queues a one-time message shown on the next page.
        flash("Task title cannot be empty.", "error")
        return redirect(url_for("index"))

    tasks.append({"id": next_id, "title": title, "done": False})
    next_id += 1
    flash(f"Added: {title}", "success")
    # POST/Redirect/GET: after a successful POST, redirect so
    # refreshing the browser doesn't resubmit the form.
    return redirect(url_for("index"))


# -------------------------------------------------------------
# TOGGLE - flip a task's done state
# -------------------------------------------------------------
@app.route("/toggle/<int:task_id>", methods=["POST"])
def toggle(task_id):
    task = find_task(task_id)
    if task is None:
        abort(404)  # Triggers our 404 handler below.
    task["done"] = not task["done"]
    return redirect(url_for("index"))


# -------------------------------------------------------------
# DELETE - remove a task
# -------------------------------------------------------------
@app.route("/delete/<int:task_id>", methods=["POST"])
def delete(task_id):
    task = find_task(task_id)
    if task is None:
        abort(404)
    tasks.remove(task)
    flash(f"Deleted: {task['title']}", "success")
    return redirect(url_for("index"))


# -------------------------------------------------------------
# DETAIL - view a single task on its own page
# -------------------------------------------------------------
# `<int:task_id>` captures the URL part and passes it as int.
@app.route("/task/<int:task_id>")
def detail(task_id):
    task = find_task(task_id)
    if task is None:
        abort(404)
    return render_template("detail.html", task=task)


# -------------------------------------------------------------
# ABOUT - a simple static-ish page, still using the layout
# -------------------------------------------------------------
@app.route("/about")
def about():
    return render_template("about.html")


# -------------------------------------------------------------
# Custom 404 page - runs whenever abort(404) or an unknown URL
# -------------------------------------------------------------
@app.errorhandler(404)
def not_found(err):
    return render_template("404.html"), 404

# =============================================================
# SESSIONS & LOGIN
# =============================================================
# `session` is a dict-like object Flask gives you. Anything you
# put in it is stored in a SIGNED cookie on the user's browser
# (signed with `app.secret_key`, so the user can read it but not
# tamper with it). The cookie comes back on every request, so
# the server "remembers" the user across requests — that's all
# a "login" is.
#
# Real apps store hashed passwords in a database. Here we use a
# tiny dict so the example stays focused on sessions.
# -------------------------------------------------------------

USERS = {
    "itay": "1234",
    "admin": "secret",
}


def login_required(view):
    """Decorator: redirect to /login if no user is in the session."""
    @wraps(view)
    def wrapper(*args, **kwargs):
        if "user" not in session:
            flash("Please log in first.", "error")
            return redirect(url_for("login", next=request.path))
        return view(*args, **kwargs)
    return wrapper


@app.context_processor
def inject_user():
    """Make `current_user` available in every template."""
    return {"current_user": session.get("user")}


@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        username = request.form.get("username", "").strip()
        password = request.form.get("password", "")

        if USERS.get(username) == password:
            # Storing the username in the session "logs them in".
            session["user"] = username
            flash(f"Welcome, {username}!", "success")
            # If the user was redirected here from a protected page,
            # send them back to it after login.
            return redirect(request.args.get("next") or url_for("index"))

        flash("Invalid username or password.", "error")

    return render_template("login.html")


@app.route("/logout", methods=["POST"])
def logout():
    # `pop` removes the key if present; the session cookie updates
    # on the response so the browser forgets the user.
    session.pop("user", None)
    flash("Logged out.", "success")
    return redirect(url_for("index"))


@app.route("/secret")
@login_required
def secret():
    return render_template("secret.html")


@app.route("/favorites/<name>")
def favorite(name):
    items=[
        "pizza" , "shushi" , "chips"
    ]
    return render_template("favorites.html" , name=name , items=items)

@app.route("/profile/<name>/<int:age>")
def profile(name, age):
    hobbies=[
        "coding" , "math" , "mario"
    ]
    return render_template("profile.html", name=name, age=age, hobbies=hobbies)

if __name__ == "__main__":  
    # debug=True: auto-reload on code changes + helpful error pages.
    app.run(debug=True, port=5000)
