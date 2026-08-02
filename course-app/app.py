"""
Four Tracks to Mastery — a local Flask app.

    pip install -r requirements.txt
    python app.py

then open http://127.0.0.1:5055

Or press F5 in VS Code, which does the same thing with the debugger attached.

WHAT THIS SERVES
    /                 the course itself
    /api/run          runs a snippet of Python for the playground
    /api/run/health   lets the page know the runner is available

SAFETY NOTE
    /api/run executes whatever Python it is sent. That is the whole point of
    a REPL, and it is only ever your own code on your own machine — but it
    means this must stay local. It binds to 127.0.0.1, so nothing outside
    this computer can reach it. Do not add host="0.0.0.0", and do not put
    this on a public server.
"""

import os
import socket
import subprocess
import sys
import tempfile
import threading
import time
import webbrowser

from flask import Flask, jsonify, render_template, request

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Where /api/run executes your snippets. Anything you write to disk from the
# playground lands here rather than in the project root.
SCRATCH_DIR = os.path.join(BASE_DIR, "scratch")

# Set COURSE_PORT to pin it; otherwise the first free port from here is used.
PORT = int(os.environ.get("COURSE_PORT", "5055"))
PORT_SEARCH_RANGE = 12
RUN_TIMEOUT_SECONDS = 8

app = Flask(__name__)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/api/run/health")
def health():
    """The playground probes this to decide whether to offer Python."""
    return jsonify(ok=True, python=sys.version.split()[0])


# The open page pings this every few seconds. desktop.py watches it to know
# when the window has been closed; app.py ignores it entirely.
LAST_SEEN = {"at": time.time()}


@app.route("/api/alive", methods=["POST"])
def alive():
    LAST_SEEN["at"] = time.time()
    return jsonify(ok=True)


@app.route("/api/run", methods=["POST"])
def run_python():
    payload = request.get_json(silent=True) or {}
    code = payload.get("code", "")

    if not isinstance(code, str) or not code.strip():
        return jsonify(stdout="", stderr="Nothing to run.", timed_out=False)

    os.makedirs(SCRATCH_DIR, exist_ok=True)

    # A real file on disk, so tracebacks carry line numbers that line up with
    # what you see in the editor.
    fd, path = tempfile.mkstemp(suffix=".py", prefix="snippet_", dir=SCRATCH_DIR, text=True)
    try:
        with os.fdopen(fd, "w", encoding="utf-8") as handle:
            handle.write(code)

        # Force UTF-8 both ways. Without this, Windows decodes the child's
        # output with the ANSI codepage, which mangles any non-ASCII text --
        # Hebrew you print, and the Hebrew in this project's own path, which
        # then stops the traceback cleanup below from matching.
        child_env = dict(os.environ, PYTHONIOENCODING="utf-8", PYTHONUTF8="1")

        timed_out = False
        try:
            proc = subprocess.run(
                [sys.executable, path],
                capture_output=True,
                encoding="utf-8",
                errors="replace",
                timeout=RUN_TIMEOUT_SECONDS,
                cwd=SCRATCH_DIR,
                env=child_env,
            )
            stdout, stderr = proc.stdout, proc.stderr
        except subprocess.TimeoutExpired as exc:
            timed_out = True
            stdout = _as_text(exc.stdout)
            stderr = _as_text(exc.stderr)

        # The temp path is noise in a traceback — show a name you recognise.
        stderr = stderr.replace(path, "snippet.py")

        return jsonify(stdout=stdout, stderr=stderr, timed_out=timed_out)
    finally:
        try:
            os.remove(path)
        except OSError:
            pass


def _as_text(value):
    """subprocess hands back str or bytes depending on how it failed."""
    if value is None:
        return ""
    if isinstance(value, bytes):
        return value.decode("utf-8", "replace")
    return value


def port_is_taken(port):
    """True if something is already listening — usually an older run."""
    with socket.socket() as probe:
        probe.settimeout(0.4)
        return probe.connect_ex(("127.0.0.1", port)) == 0


def is_this_app(port):
    """True if the thing on this port is another copy of the course."""
    try:
        import json
        import urllib.request

        with urllib.request.urlopen(
            "http://127.0.0.1:%d/api/run/health" % port, timeout=0.8
        ) as response:
            return bool(json.load(response).get("ok"))
    except Exception:
        return False


def first_free_port(start, tries=PORT_SEARCH_RANGE):
    """Walk upward until we find a port nothing is holding."""
    for port in range(start, start + tries):
        if not port_is_taken(port):
            return port
    return None


def resolve_port(preferred=None):
    """
    Decide which port to use, and whether a server is already there.

    The port is part of the address, and browsers key saved progress to the
    address. Drifting to a different port silently strands everything you
    have done, so the rules are:

      free                    -> use it
      already running as us   -> reuse it, do not start a second server
      taken by something else -> move up, and say so loudly

    Returns (port, already_running).
    """
    preferred = preferred or PORT

    if not port_is_taken(preferred):
        return preferred, False

    if is_this_app(preferred):
        return preferred, True

    fallback = first_free_port(preferred + 1)
    if fallback is None:
        return None, False

    print("")
    print("  Port %d is taken by something that is not this course." % preferred)
    print("  Using %d instead -- but note that saved progress is stored" % fallback)
    print("  per address, so anything done on :%d will not appear here." % preferred)
    print("  Free up %d and restart to get it back." % preferred)
    print("")
    return fallback, False


def open_browser_when_ready(url, delay=1.2):
    """Give the server a moment to bind, then pop the page open."""
    threading.Timer(delay, lambda: webbrowser.open(url)).start()


if __name__ == "__main__":
    # With debug=True the reloader runs this file twice: a parent that watches
    # for changes, and a child that actually serves. Only the child has
    # WERKZEUG_RUN_MAIN set -- the same guard you used in hello.py. The port
    # is chosen once by the parent and handed down, so a reload cannot move
    # the server to a different port under you.
    is_reloader_parent = os.environ.get("WERKZEUG_RUN_MAIN") != "true"

    if is_reloader_parent:
        port, already_running = resolve_port(PORT)
        if port is None:
            print("Ports %d-%d are all in use. Set COURSE_PORT to something free:"
                  % (PORT, PORT + PORT_SEARCH_RANGE - 1))
            print('  PowerShell:  $env:COURSE_PORT = "8080"; python app.py')
            sys.exit(1)

        if already_running:
            print("The course is already running at http://127.0.0.1:%d" % port)
            print("Opening that instead of starting a second copy.")
            if os.environ.get("NO_BROWSER") != "1":
                webbrowser.open("http://127.0.0.1:%d" % port)
            sys.exit(0)

        os.environ["COURSE_PORT"] = str(port)     # the reloader child inherits this
    else:
        port = int(os.environ.get("COURSE_PORT", PORT))

    url = "http://127.0.0.1:%d" % port

    if is_reloader_parent:
        print("Course:  %s" % url)
        print("Root:    %s" % BASE_DIR)
        # Opening from the parent means one tab at startup, and no new tab
        # every time you save a file and the child reloads.
        if os.environ.get("NO_BROWSER") != "1":
            open_browser_when_ready(url)

    # host is deliberately omitted, so Flask binds to 127.0.0.1 only.
    app.run(port=port, debug=True)
