"""The smallest useful Flask app. Run with:  flask --app lessons/00-setup/hello.py run --debug"""
from flask import Flask

app = Flask(__name__)


@app.get("/")
def hello() -> None:
    return "Hello from Flask!"

@app.route("/about")
def about() -> None:
    return {"purpose": "this server is for learning"}


