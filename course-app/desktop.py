"""
Run the course as a desktop application.

    python desktop.py          (or double-click Course.bat / the shortcut)

The difference from app.py:

    app.py       a development server. Reloads on save, prints to a terminal,
                 opens a normal browser tab with an address bar.

    desktop.py   an application. Opens a chromeless window with no address bar
                 and no tabs, and when you close that window the server stops
                 too. No reloader, no debug pages.

HOW THE WINDOW WORKS
    There is no separate GUI toolkit here. Chrome and Edge both support
    --app=URL, which opens a single frameless window that looks and behaves
    like a native application. We start one as a child process and wait for
    it; when you close the window, that process ends and so do we.

    If no Chromium-based browser is found, it falls back to your default
    browser and keeps running until you close the console.
"""

import os
import socket
import subprocess
import sys
import threading
import time

from app import PORT, PORT_SEARCH_RANGE, app, resolve_port

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
WINDOW_SIZE = "1440,920"

# Where Chrome and Edge usually live on Windows. The first that exists wins.
BROWSER_CANDIDATES = [
    r"C:\Program Files\Google\Chrome\Application\chrome.exe",
    r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
    r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
    r"C:\Program Files\Microsoft\Edge\Application\msedge.exe",
]


def find_app_browser():
    """A Chromium-based browser that understands --app=, or None."""
    for path in BROWSER_CANDIDATES:
        if os.path.isfile(path):
            return path
    for name in ("chrome", "msedge"):
        found = shutil_which(name)
        if found:
            return found
    return None


def shutil_which(name):
    """shutil.which, kept separate so the import stays local to this helper."""
    import shutil

    return shutil.which(name)


def wait_until_serving(port, timeout=15.0):
    """Block until the server answers, so the window never opens on an error."""
    deadline = time.time() + timeout
    while time.time() < deadline:
        with socket.socket() as probe:
            probe.settimeout(0.3)
            if probe.connect_ex(("127.0.0.1", port)) == 0:
                return True
        time.sleep(0.15)
    return False


def serve(port):
    """Run Flask with no reloader — this process must stay single-threaded."""
    app.run(port=port, debug=False, use_reloader=False, threaded=True)


def main():
    port, already_running = resolve_port(PORT)
    if port is None:
        print("No free port in %d-%d." % (PORT, PORT + PORT_SEARCH_RANGE - 1))
        return 1

    url = "http://127.0.0.1:%d" % port

    # If a copy is already serving, point the window at it rather than
    # starting a second server on a different port -- a different port is a
    # different address, and saved progress is keyed to the address.
    if not already_running:
        # Daemon thread: when main() returns, this dies with the process.
        threading.Thread(target=serve, args=(port,), daemon=True).start()

        if not wait_until_serving(port):
            print("The server did not start in time.")
            return 1

    browser = find_app_browser()
    if not browser:
        print("No Chrome or Edge found — opening your default browser instead.")
        print("Close this window to stop the course.")
        import webbrowser

        webbrowser.open(url)
        try:
            while True:
                time.sleep(3600)
        except KeyboardInterrupt:
            return 0

    # Deliberately NOT passing --user-data-dir. A separate Chrome profile gets
    # its own localStorage, so progress made in the app window would be
    # invisible in a normal browser tab and vice versa. Sharing your default
    # profile means one set of progress however you open the course.
    subprocess.Popen([
        browser,
        "--app=" + url,
        "--window-size=" + WINDOW_SIZE,
    ])

    # We cannot wait on that process. Because we share your normal Chrome
    # profile, Chrome hands the window to the browser that is already running
    # and the process we launched exits straight away -- so its exit tells us
    # nothing. Instead the page itself pings /api/alive every few seconds, and
    # we quit when those stop.
    print("Course running as an app. Close the window to quit.")
    watch_for_close()
    return 0


def watch_for_close(grace=30.0, idle=15.0, poll=2.0):
    """Quit once the page has stopped checking in."""
    import app as server

    started = time.time()
    while True:
        time.sleep(poll)
        waited = time.time() - started
        quiet = time.time() - server.LAST_SEEN["at"]

        # Give the window time to open and load before trusting the signal.
        if waited < grace:
            continue
        if quiet > idle:
            print("Window closed — stopping.")
            sys.stdout.flush()
            # os._exit rather than a normal return: the web server's worker
            # threads would otherwise keep the process alive after main()
            # finishes, leaving a server running with no window.
            os._exit(0)


if __name__ == "__main__":
    sys.exit(main())
