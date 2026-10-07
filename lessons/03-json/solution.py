"""Lesson 03: one possible solution. Compare AFTER you've solved it yourself."""
from flask import Flask, request, url_for

app = Flask(__name__)

USERS = {"jonathan": "1234", "admin": "s3cret"}

notes = []
next_note_id = 1


def is_number(value):
    # bool is a subclass of int in Python, so True would otherwise count as 1.
    return isinstance(value, (int, float)) and not isinstance(value, bool)


def is_list_of(value, check):
    """True if `value` is a list and `check(item)` is true for every item."""
    return isinstance(value, list) and all(check(item) for item in value)


@app.post("/login")
def login():
    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        return {"error": "request body must be a JSON object"}, 400

    missing = [field for field in ("username", "password") if field not in data]
    if missing:
        return {"error": f"missing field(s): {', '.join(missing)}"}, 400

    username, password = data["username"], data["password"]
    if not isinstance(username, str) or not isinstance(password, str):
        return {"error": "username and password must be strings"}, 400

    if USERS.get(username) != password:
        return {"error": "invalid username or password"}, 401

    return {"message": f"welcome, {username}"}


@app.post("/sum")
def sum_numbers():
    data = request.get_json(silent=True)
    if not isinstance(data, dict) or "numbers" not in data:
        return {"error": 'body must be {"numbers": [...]}'}, 400

    numbers = data["numbers"]
    if not is_list_of(numbers, is_number):
        return {"error": "numbers must be a list of numbers"}, 400

    return {"sum": sum(numbers), "count": len(numbers)}


@app.post("/notes")
def create_note():
    global next_note_id
    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        return {"error": "request body must be a JSON object"}, 400

    title = data.get("title")
    if not isinstance(title, str) or not title.strip():
        return {"error": "title is required"}, 400

    tags = data.get("tags", [])
    if not is_list_of(tags, lambda tag: isinstance(tag, str)):
        return {"error": "tags must be a list of strings"}, 400

    note = {"id": next_note_id, "title": title.strip(), "tags": tags}
    notes.append(note)
    next_note_id += 1

    return note, 201, {"Location": url_for("get_note", note_id=note["id"])}


@app.get("/notes/<int:note_id>")
def get_note(note_id):
    for note in notes:
        if note["id"] == note_id:
            return note
    return {"error": f"note {note_id} not found"}, 404


@app.get("/notes")
def list_notes():
    return notes
