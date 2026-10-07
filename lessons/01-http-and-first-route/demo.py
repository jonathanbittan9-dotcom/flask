"""
Lesson 01 demo: every way to shape a response.

Run:  flask --app lessons/01-http-and-first-route/demo.py run --debug
Then send the requests in the Postman folder "01 HTTP".
"""
from flask import Flask, request

app = Flask(__name__)


@app.get("/")
def index():
    # A plain string → Content-Type: text/html, status 200.
    return "Hello! Try /health, /status-codes/201, /headers, /request-info"


@app.get("/health")
def health():
    # A dict → Flask converts it to JSON and sets Content-Type: application/json.
    return {"status": "ok"}


@app.get("/fruits")
def fruits():
    # A list is converted to JSON as well.
    return ["apple", "banana", "cherry"]


@app.get("/status-codes/201")
def created_example():
    # (body, status): the status is the second item of the tuple.
    return {"message": "pretend we created something"}, 201


@app.get("/status-codes/404")
def not_found_example():
    # Errors are JSON too, with a 4xx status. Never 200 + an error message.
    return {"error": "this thing does not exist"}, 404


@app.get("/headers")
def custom_headers():
    # (body, status, headers): the third item is a dict of extra response headers.
    # Custom headers traditionally start with "X-".
    return {"message": "check the Headers tab"}, 200, {"X-Course": "flask", "X-Lesson": "01"}


@app.post("/only-post")
def only_post():
    # Send a GET here from Postman and you'll get 405 + an Allow header.
    return {"message": "you used POST"}


@app.get("/request-info")
def request_info():
    # `request` describes the current incoming request.
    return {
        "method": request.method,
        "path": request.path,
        "accept": request.headers.get("Accept"),
        "host": request.headers.get("Host"),
    }
