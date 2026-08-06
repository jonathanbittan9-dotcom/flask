"""
16_flask_data_auth_apis.py

Section 16: Data, Auth & APIs
    - Flask-SQLAlchemy models, relationships, db.session
    - Rolling your own login with session + password hashing (and what
      Flask-Login / Flask-WTF would replace, if installed)
    - A small JSON REST API: status codes, request.get_json(), pagination
    - Testing a Flask app with app.test_client()

Run: python 16_flask_data_auth_apis.py
Then visit: http://127.0.0.1:5052/api/books
"""
import functools
from flask import Flask, request, session, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
# New words in this line: generate_password_hash/check_password_hash were
# already met in 09_security.py on their own — here they're used INSIDE a
# real Flask login flow.

from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.pool import StaticPool
# New words in this line:
#   flask_sqlalchemy  -> a Flask extension wrapping SQLAlchemy (met alone in
#        05_databases.py) so models/sessions are wired to the app's config
#        automatically
#   StaticPool        -> see the SQLALCHEMY_ENGINE_OPTIONS comment below —
#        needed specifically because this demo uses an in-memory database

db = SQLAlchemy()
# New words in this line:
#   SQLAlchemy() created WITHOUT an app here on purpose (mirrors the
#   create_app() factory from 15_flask_architecture_and_requests.py) —
#   db.init_app(app) attaches it further down.


# ---------------------------------------------------------------------------
# Models
# ---------------------------------------------------------------------------
class Author(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    books = db.relationship("Book", backref="author", lazy=True)
    # New words in this line:
    #   db.relationship(..., backref="author")  -> gives you author.books (a
    #        list of this author's Book rows) AND book.author (the matching
    #        Author row) from ONE declaration
    #   lazy=True  -> author.books only runs its query when you actually
    #        access the attribute, not immediately when the Author loads


class Book(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(120), nullable=False)
    author_id = db.Column(db.Integer, db.ForeignKey("author.id"), nullable=False)

    def as_dict(self):
        return {"id": self.id, "title": self.title, "author": self.author.name}


# Migrations note: real projects track schema CHANGES over time with
# Flask-Migrate (Alembic underneath) — `flask db migrate` generates a script
# from model changes, `flask db upgrade` applies it. This demo just calls
# db.create_all() below, which only works for a brand-new, empty database.


# ---------------------------------------------------------------------------
# Auth — rolled by hand with session + password hashing
# ---------------------------------------------------------------------------
USERS = {}   # username -> password hash (a real app: a db.Model, not a dict)


def login_required(view):
    @functools.wraps(view)
    # New words in this line:
    #   @functools.wraps(view)  -> already met in core_language_mastery.py's
    #        decorator section; preserves `view`'s name/docstring on the
    #        wrapper below, so Flask's routing (which tracks view functions
    #        internally by name) doesn't get confused between wrapped views
    def wrapped(*args, **kwargs):
        if "username" not in session:
            return jsonify(error="login required"), 401
        return view(*args, **kwargs)
    return wrapped


try:
    import flask_login          # noqa: F401
    HAS_FLASK_LOGIN = True
except ImportError:
    HAS_FLASK_LOGIN = False
    # New words in this line:
    #   (this whole try/except)  -> same "optional dependency" pattern as
    #        05_databases.py's SQLAlchemy import. flask-login isn't installed
    #        in this project, so HAS_FLASK_LOGIN stays False and the notes
    #        below explain what it WOULD add, without this file crashing.

FLASK_LOGIN_NOTES = """
Flask-Login would replace login_required/session["username"] above with:
  - a User class mixing in UserMixin (gives it .is_authenticated etc.)
  - LoginManager().init_app(app) + a user_loader callback
  - login_user(user) / logout_user() instead of hand-editing session
  - @login_required from flask_login instead of the hand-rolled version above
  - current_user available in every view/template, instead of session["username"]
Not installed in this project (pip install flask-login to add it) — the
hand-rolled version above does the same core job at a smaller scale.
"""

try:
    import flask_wtf            # noqa: F401
    HAS_FLASK_WTF = True
except ImportError:
    HAS_FLASK_WTF = False

FLASK_WTF_NOTES = """
Flask-WTF would replace manually reading request.form["username"] (used in
register()/login() below) with a FlaskForm subclass: declared fields,
built-in CSRF token handling, and .validate_on_submit() — instead of
checking request.method == "POST" and pulling fields out by hand.
"""


# ---------------------------------------------------------------------------
# The app
# ---------------------------------------------------------------------------
app = Flask(__name__)
app.config["SECRET_KEY"] = "demo-only-not-for-production"
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///:memory:"
app.config["SQLALCHEMY_ENGINE_OPTIONS"] = {
    "poolclass": StaticPool,
    "connect_args": {"check_same_thread": False},
}
# New words in this line:
#   StaticPool + check_same_thread=False  -> an in-memory SQLite database
#        only exists inside ONE connection. Without forcing SQLAlchemy to
#        reuse that single connection (StaticPool) across threads, the demo
#        server's request-handling thread could see an EMPTY database, since
#        Flask's dev server can dispatch a request on a different thread than
#        the one that ran seed_data() at startup. (A file-based db.sqlite3
#        wouldn't need this — every connection sees the same file on disk.)
db.init_app(app)


@app.route("/register", methods=["POST"])
def register():
    data = request.get_json(silent=True) or request.form
    # New words in this line:
    #   request.get_json(silent=True)  -> parses the request body as JSON;
    #        silent=True returns None instead of raising if it's not valid
    #        JSON, so `or request.form` can fall back to a normal form post
    username, password = data.get("username"), data.get("password")
    if not username or not password:
        return jsonify(error="username and password required"), 400
    if username in USERS:
        return jsonify(error="username taken"), 409
    USERS[username] = generate_password_hash(password)
    return jsonify(status="registered", username=username), 201


@app.route("/login", methods=["POST"])
def login():
    data = request.get_json(silent=True) or request.form
    username, password = data.get("username"), data.get("password")
    stored_hash = USERS.get(username)
    if stored_hash is None or not check_password_hash(stored_hash, password):
        return jsonify(error="invalid credentials"), 401
    session["username"] = username
    return jsonify(status="logged in", username=username)


@app.route("/logout", methods=["POST"])
def logout():
    session.pop("username", None)
    return jsonify(status="logged out")


# ---------------------------------------------------------------------------
# A small JSON REST API, partly protected by login_required
# ---------------------------------------------------------------------------
@app.route("/api/books", methods=["GET"])
def api_list_books():
    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 10, type=int)
    # New words in this line:
    #   request.args.get(name, default, type=int)  -> the type= kwarg
    #        converts the raw string query param straight to int (and Flask
    #        answers with an automatic 400 if it can't be converted)
    query = Book.query.offset((page - 1) * per_page).limit(per_page)
    # New words in this line:
    #   Book.query  -> the "legacy" SQLAlchemy query style, still provided by
    #        Flask-SQLAlchemy for convenience — contrast with db.session.get
    #        below, the modern SQLAlchemy 2.x style
    return jsonify([b.as_dict() for b in query])


@app.route("/api/books", methods=["POST"])
@login_required
def api_create_book():
    data = request.get_json(silent=True)
    if not data or "title" not in data or "author_id" not in data:
        return jsonify(error="title and author_id required"), 400
    book = Book(title=data["title"], author_id=data["author_id"])
    db.session.add(book)
    db.session.commit()
    return jsonify(book.as_dict()), 201


@app.route("/api/books/<int:book_id>", methods=["GET"])
def api_get_book(book_id):
    book = db.session.get(Book, book_id)
    # New words in this line:
    #   db.session.get(Model, pk)  -> the modern SQLAlchemy 2.x way to fetch
    #        a row by primary key (older code often writes Model.query.get(pk))
    if book is None:
        return jsonify(error="not found"), 404
    return jsonify(book.as_dict())


def seed_data():
    author = Author(name="Orwell")
    db.session.add(author)
    db.session.commit()
    db.session.add(Book(title="1984", author_id=author.id))
    db.session.commit()


# ---------------------------------------------------------------------------
# Testing with the test client — no server needed
# ---------------------------------------------------------------------------
def demo_test_client():
    print("\n--- Testing with app.test_client() ---")
    client = app.test_client()

    resp = client.get("/api/books")
    assert resp.status_code == 200
    print("GET /api/books ->", resp.status_code, resp.get_json())

    resp = client.post("/api/books", json={"title": "Animal Farm", "author_id": 1})
    assert resp.status_code == 401   # not logged in yet
    print("POST /api/books (anonymous) ->", resp.status_code, resp.get_json())

    client.post("/register", json={"username": "itay", "password": "hunter2"})
    client.post("/login", json={"username": "itay", "password": "hunter2"})
    # New words in this line:
    #   client.post(url, json=dict)  -> the test client's shortcut for
    #        sending a JSON body with the right Content-Type header, the same
    #        cookies/session persisting across calls on this one `client`,
    #        just like a real browser tab would

    resp = client.post("/api/books", json={"title": "Animal Farm", "author_id": 1})
    assert resp.status_code == 201
    print("POST /api/books (logged in) ->", resp.status_code, resp.get_json())


if __name__ == "__main__":
    print(FLASK_LOGIN_NOTES if not HAS_FLASK_LOGIN else "flask_login IS installed here.")
    print(FLASK_WTF_NOTES if not HAS_FLASK_WTF else "flask_wtf IS installed here.")

    with app.app_context():
        # New words in this line:
        #   app.app_context()  -> Flask-SQLAlchemy needs to know WHICH app
        #        it's working for outside of an actual request (e.g. here, at
        #        startup) — this "activates" that app for the block below
        db.create_all()
        seed_data()
        demo_test_client()

    print("\nStarting demo Flask server on http://127.0.0.1:5052 (Ctrl+C to stop)...")
    app.run(port=5052, debug=True, use_reloader=False)
