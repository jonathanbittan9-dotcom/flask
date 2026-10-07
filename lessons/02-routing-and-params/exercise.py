"""
Lesson 02 exercises. Read the lesson README first.

Run:    flask --app lessons/02-routing-and-params/exercise.py run --debug
Test:   pytest lessons/02-routing-and-params
"""
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


# E2.1: GET /square/<n>  (negatives allowed)
# TODO


# E2.2: GET /greet/<name>?lang=en|he
# TODO


# E2.3 + E2.4: GET /movies?limit=&offset=&genre=
# TODO


# E2.5: GET /files/<path>
# TODO
