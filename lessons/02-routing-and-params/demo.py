"""
Lesson 02 demo: path params, converters, query strings, validation.

Run:  flask --app lessons/02-routing-and-params/demo.py run --debug
Then send the requests in the Postman folder "02 Routing".
"""
from flask import Flask, request, url_for

app = Flask(__name__)

BOOKS = [
    {"id": 1, "title": "Dune", "genre": "scifi"},
    {"id": 2, "title": "The Hobbit", "genre": "fantasy"},
    {"id": 3, "title": "Neuromancer", "genre": "scifi"},
    {"id": 4, "title": "Sapiens", "genre": "history"},
]
MAX_LIMIT = 50


@app.get("/books")
def list_books():
    # Optional filter: missing → None → no filtering.
    genre = request.args.get("genre")

    # Validate explicitly so the client learns what went wrong.
    raw_limit = request.args.get("limit", "10")
    if not raw_limit.isdigit():
        return {"error": "limit must be a non-negative integer"}, 400
    limit = int(raw_limit)
    if limit > MAX_LIMIT:
        return {"error": f"limit must be at most {MAX_LIMIT}"}, 400

    books = BOOKS
    if genre is not None:
        books = [book for book in books if book["genre"] == genre.lower()]

    return {"items": books[:limit], "count": len(books)}


@app.get("/books/<int:book_id>")
def get_book(book_id):
    # `book_id` is already an int; /books/abc never reaches this function (404).
    for book in BOOKS:
        if book["id"] == book_id:
            # url_for builds "/books/<id>" from the function name: no hard-coded paths.
            return {**book, "url": url_for("get_book", book_id=book_id)}
    return {"error": f"book {book_id} not found"}, 404


@app.get("/temperature/<float:celsius>")
def to_fahrenheit(celsius):
    # Try /temperature/36.6 (works) and /temperature/36 (404: float needs a dot).
    return {"celsius": celsius, "fahrenheit": celsius * 9 / 5 + 32}


@app.get("/tags")
def tags():
    # /tags?tag=python&tag=flask → getlist returns every value for a repeated key.
    return {"tags": request.args.getlist("tag")}


@app.get("/echo-args")
def echo_args():
    # Shows that query values are always strings.
    return {key: {"value": value, "type": type(value).__name__} for key, value in request.args.items()}
