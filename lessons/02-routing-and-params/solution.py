"""Lesson 02: one possible solution. Compare AFTER you've solved it yourself."""
from flask import Flask, request

app = Flask(__name__)

MOVIES = [
    {"title": "Interstellar", "genre": "scifi"},
    {"title": "Inception", "genre": "scifi"},
    {"title": "Up", "genre": "animation"},
    {"title": "The Matrix", "genre": "scifi"},
    {"title": "Toy Story", "genre": "animation"},
    {"title": "Gladiator", "genre": "drama"},
    {"title": "Arrival", "genre": "scifi"},
]

GREETINGS = {"en": "Hello", "he": "Shalom"}
MAX_LIMIT = 10


@app.get("/square/<int(signed=True):n>")
def square(n):
    return {"n": n, "square": n * n}


@app.get("/greet/<name>")
def greet(name):
    lang = request.args.get("lang", "en")
    if lang not in GREETINGS:
        allowed = ", ".join(GREETINGS)
        return {"error": f"unsupported lang '{lang}', use one of: {allowed}"}, 400
    return {"greeting": f"{GREETINGS[lang]}, {name}!"}


def parse_non_negative_int(name, default):
    """Read a query param as an int >= 0. Returns (value, error_message)."""
    raw = request.args.get(name)
    if raw is None:
        return default, None
    if not raw.isdigit():
        return None, f"{name} must be a non-negative integer"
    return int(raw), None


@app.get("/movies")
def list_movies():
    limit, error = parse_non_negative_int("limit", default=3)
    if error:
        return {"error": error}, 400
    if limit > MAX_LIMIT:
        return {"error": f"limit must be at most {MAX_LIMIT}"}, 400

    offset, error = parse_non_negative_int("offset", default=0)
    if error:
        return {"error": error}, 400

    movies = MOVIES
    genre = request.args.get("genre")
    if genre is not None:
        movies = [movie for movie in movies if movie["genre"] == genre.lower()]

    return {
        "items": movies[offset:offset + limit],
        "total": len(movies),
        "limit": limit,
        "offset": offset,
    }


@app.get("/files/<path:filepath>")
def file_info(filepath):
    parts = filepath.split("/")
    filename = parts[-1]
    # rpartition splits on the LAST dot: "a.tar.gz" → ("a.tar", ".", "gz").
    stem, dot, extension = filename.rpartition(".")
    return {
        "parts": parts,
        "filename": filename,
        "extension": extension if dot and stem else None,
    }
