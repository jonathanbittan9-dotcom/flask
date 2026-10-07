"""
Lesson 03 exercises. Read the lesson README first.

Run:    flask --app lessons/03-json/exercise.py run --debug
Test:   pytest lessons/03-json
"""
from flask import Flask, request, url_for

app = Flask(__name__)

USERS = {"jonathan": "1234", "admin": "s3cret"}

notes = []
next_note_id = 1


# E3.1: POST /login
# TODO


# E3.2: POST /sum
# TODO


# E3.3: POST /notes, GET /notes/<id>, GET /notes
# TODO
