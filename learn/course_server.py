"""
Companion server for course.html.

A browser cannot execute Python, so the playground's Python tab needs a
process on your own machine to run it. This is that process.

    python course_server.py

then open  http://127.0.0.1:5055/course

Everything else in the course (JavaScript, CSS, HTML, all the lessons) works
without this file — open course.html directly and only the Python tab is idle.

SAFETY NOTE
    /api/run executes whatever Python it is sent. That is the entire point of
    a REPL, and it is only ever your own code on your own machine, but it does
    mean this server must stay local. It binds to 127.0.0.1 so nothing outside
    this computer can reach it. Do not put it on a public host, and do not add
    host="0.0.0.0".
"""

import os
import subprocess
import sys
import tempfile

from flask import Flask, jsonify, request, send_from_directory

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PORT = 5055
TIMEOUT_SECONDS = 8

app = Flask(__name__)


@app.route("/course")
def course():
    """Serve the course page itself, so /api/run is same-origin."""
    return send_from_directory(BASE_DIR, "course.html")


@app.route("/api/run/health")
def health():
    """The page probes this to decide whether to show 'runner online'."""
    return jsonify(ok=True, python=sys.version.split()[0])


@app.route("/api/run", methods=["POST"])
def run_python():
    payload = request.get_json(silent=True) or {}
    code = payload.get("code", "")

    if not isinstance(code, str) or not code.strip():
        return jsonify(stdout="", stderr="Nothing to run.", timed_out=False)

    # Write to a real temp file so tracebacks carry line numbers that match
    # what you see in the editor.
    fd, path = tempfile.mkstemp(suffix=".py", prefix="playground_", text=True)
    try:
        with os.fdopen(fd, "w", encoding="utf-8") as f:
            f.write(code)

        timed_out = False
        try:
            proc = subprocess.run(
                [sys.executable, path],
                capture_output=True,
                text=True,
                timeout=TIMEOUT_SECONDS,
                cwd=BASE_DIR,
            )
            stdout, stderr = proc.stdout, proc.stderr
        except subprocess.TimeoutExpired as exc:
            timed_out = True
            stdout = exc.stdout or ""
            stderr = exc.stderr or ""
            if isinstance(stdout, bytes):
                stdout = stdout.decode("utf-8", "replace")
            if isinstance(stderr, bytes):
                stderr = stderr.decode("utf-8", "replace")

        # The temp path is noise in a traceback — show the filename you know.
        stderr = stderr.replace(path, os.path.basename(path))

        return jsonify(stdout=stdout, stderr=stderr, timed_out=timed_out)
    finally:
        try:
            os.remove(path)
        except OSError:
            pass


if __name__ == "__main__":
    print("Course + Python runner:  http://127.0.0.1:%d/course" % PORT)
    print("Serving files from:      %s" % BASE_DIR)
    # host is deliberately omitted so Flask binds to 127.0.0.1 only.
    app.run(port=PORT, debug=False)
