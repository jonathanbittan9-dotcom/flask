"""Lesson 01: one possible solution. Compare AFTER you've solved it yourself."""
from flask import Flask, request

app = Flask(__name__)

APP_VERSION = "1.0.0"


@app.get("/ping")
def ping():
    return {"message": "pong"}


@app.get("/version")
def version():
    # Keeping the version in one constant means the body and header can never disagree.
    return {"name": "flask-course", "version": APP_VERSION}, 200, {"X-App-Version": APP_VERSION}


@app.get("/coffee")
def coffee():
    return {"error": "I'm a teapot"}, 418


@app.post("/launch")
def launch():
    # 202 Accepted = "I got it, the work happens later". Right for a launch that takes time.
    return {"status": "launching"}, 202


@app.get("/whoami")
def whoami():
    return {
        "method": request.method,
        "path": request.path,
        "user_agent": request.headers.get("User-Agent", "unknown"),
    }
