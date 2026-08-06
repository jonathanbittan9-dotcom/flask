"""
14_web_fundamentals.py

Section 14: Adjacent Web Fundamentals
    - HTTP deeply: status codes, headers, caching, cookies vs. sessions
    - A minimal Flask app to inspect these live
    - WebSocket basics (notes) — relevant given the Discord bot work
      already happening in this workspace

Run: python 14_web_fundamentals.py
Then visit: http://127.0.0.1:5050/  and  http://127.0.0.1:5050/whoami
"""

from flask import Flask, request, make_response, session
# New words in this line (beyond testlearn.py's Flask basics —
# Flask/@app.route/render_template/url_for):
#   request        -> the incoming HTTP request (headers, cookies, form data, ...)
#   make_response  -> builds a Response object explicitly, so you can add
#        headers/cookies to it before returning (used in whoami()/cached_data() below)
#   session        -> a dict-like object backed by a signed cookie, for
#        storing small bits of data tied to one visitor across requests


# ---------------------------------------------------------------------------
# HTTP status codes — reference (not something to memorize, but recognize)
# ---------------------------------------------------------------------------
STATUS_CODE_NOTES = """
2xx Success
  200 OK               - standard success
  201 Created          - a new resource was created (e.g. after POST /books)
  204 No Content        - success, but nothing to return (e.g. after DELETE)

3xx Redirection
  301 Moved Permanently - resource moved, update bookmarks/links
  302 Found              - temporary redirect
  304 Not Modified       - cached version is still valid, don't re-send the body

4xx Client Error (the CALLER did something wrong)
  400 Bad Request        - malformed request (bad JSON, missing field)
  401 Unauthorized        - not authenticated (no/invalid credentials)
  403 Forbidden            - authenticated, but not ALLOWED to do this
  404 Not Found             - resource doesn't exist
  409 Conflict               - request conflicts with current state (e.g. borrowing an already-borrowed book)
  429 Too Many Requests       - rate limited

5xx Server Error (the SERVER did something wrong)
  500 Internal Server Error - unhandled exception
  502 Bad Gateway            - upstream server returned an invalid response
  503 Service Unavailable     - server temporarily can't handle the request (e.g. failed health check)

401 vs 403, the common mix-up:
  401 = "I don't know who you are" (log in)
  403 = "I know who you are, and you're not allowed" (permissions)
"""


def demo_status_codes():
    print("\n--- HTTP Status Codes ---")
    print(STATUS_CODE_NOTES)


# ---------------------------------------------------------------------------
# Cookies vs. Sessions
# ---------------------------------------------------------------------------
COOKIES_VS_SESSIONS_NOTES = """
Cookie: a small piece of data the SERVER asks the BROWSER to store and
send back on every subsequent request to that domain.

Session: server-side state, usually IDENTIFIED by a cookie. Flask's
`session` object stores data server-side (or signed/encrypted in the
cookie itself, for Flask's default), keyed by a session ID cookie the
browser sends back automatically.

  request.cookies       -> read cookies the browser sent
  response.set_cookie()  -> ask the browser to store a NEW cookie
  session['user_id'] = 1  -> Flask handles the cookie plumbing for you

Security notes:
  - Set cookies with `httponly=True` so JavaScript can't read them (XSS mitigation)
  - Set `secure=True` so they're only sent over HTTPS
  - Set `samesite='Lax'` or `'Strict'` to reduce CSRF risk
"""


# ---------------------------------------------------------------------------
# A tiny live Flask app to actually SEE headers/cookies/sessions in the browser
# ---------------------------------------------------------------------------
app = Flask(__name__)
app.config["SECRET_KEY"] = "demo-only-not-for-production"   # fine here: throwaway learning app


@app.route("/")
def index():
    return """
    <h2>14_web_fundamentals demo</h2>
    <p>Open your browser dev tools -> Network tab, then reload this page.</p>
    <p>Look at the Response Headers for this request.</p>
    <p><a href="/whoami">/whoami</a> — sets a cookie and a session value</p>
    <p><a href="/cached-data">/cached-data</a> — demonstrates a Cache-Control header</p>
    """


@app.route("/whoami")
def whoami():
    visit_count = session.get("visits", 0) + 1
    # New words in this line:
    #   session  -> behaves like a dict (.get() with a default, same as any
    #        dict) — but Flask transparently signs and stores it in a
    #        cookie on the response, and reads it back from the request's
    #        cookie on the next visit
    session["visits"] = visit_count

    response = make_response(f"<p>This is visit #{visit_count} in your session.</p>")
    # New words in this line:
    #   make_response(body)  -> wraps a response body in a Response object
    #        you can still modify (add cookies/headers) before it's actually
    #        sent — returning a plain string from a route does this same
    #        wrapping automatically, but without giving you a variable to
    #        attach a cookie to
    response.set_cookie(
        "last_seen", "just now",
        httponly=True,   # JavaScript can't read this cookie
        samesite="Lax",  # reduces CSRF exposure
    )
    # New words in this line:
    #   .set_cookie(name, value, **options)  -> tells the BROWSER to store
    #        this cookie and send it back on future requests
    return response


@app.route("/cached-data")
def cached_data():
    response = make_response('{"leaderboard": ["Alice", "Bob"]}')
    response.headers["Content-Type"] = "application/json"
    # New words in this line:
    #   response.headers[...] = ...  -> .headers behaves like a dict —
    #        assigning a key sets that HTTP response header
    response.headers["Cache-Control"] = "public, max-age=60"   # browser can reuse this for 60s
    return response


def demo_websocket_notes():
    print("\n--- WebSockets (notes) ---")
    print("""
HTTP is request/response: the client always initiates. A WebSocket is a
persistent, two-way connection — either side can push a message anytime
without the other having asked first.

Relevant here: a Discord bot (see discord_bot.py elsewhere in this
workspace) is built on exactly this idea — discord.py holds one
long-lived WebSocket connection to Discord's gateway, so Discord can
PUSH events (a message was sent, a role changed) to the bot instantly,
instead of the bot having to poll "did anything happen yet?" every second.

For a Flask app wanting the same push behavior to a browser (e.g. a live
leaderboard that updates without refreshing), you'd reach for
Flask-SocketIO or plain `websockets`, rather than HTTP polling.
""")


if __name__ == "__main__":
    demo_status_codes()
    print(COOKIES_VS_SESSIONS_NOTES)
    demo_websocket_notes()
    print("\nStarting demo Flask server on http://127.0.0.1:5050 (Ctrl+C to stop)...")
    app.run(port=5050, debug=True, use_reloader=False)
    # New words in this line:
    #   use_reloader=False  -> normally debug=True ALSO starts a background
    #        process that restarts the server whenever a file changes. That
    #        reloader doesn't play well with running this file
    #        non-interactively (as a demo/test run), so it's switched off
    #        here; in everyday dev work you'd usually leave the reloader on
