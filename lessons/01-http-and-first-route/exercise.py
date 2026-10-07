"""
Lesson 01 exercises. Read the lesson README first.

Run:    flask --app lessons/01-http-and-first-route/exercise.py run --debug
Test:   pytest lessons/01-http-and-first-route
"""
from flask import Flask, request

app = Flask(__name__)


# E1.1: GET /ping → 200, {"message": "pong"}
# TODO


# E1.2: GET /version → 200, {"name": "flask-course", "version": "1.0.0"}
#       plus the response header X-App-Version: 1.0.0
# TODO


# E1.3: GET /coffee → 418, {"error": "I'm a teapot"}
# TODO


# E1.4: POST /launch → 202, {"status": "launching"}
# TODO


# E1.5: GET /whoami → 200, {"method": ..., "path": ..., "user_agent": ...}
#       user_agent falls back to "unknown" when the header is missing.
#       Hint: request.headers.get(name, default)
# TODO
