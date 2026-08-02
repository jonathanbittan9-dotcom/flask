"""
Checks for the desktop launcher.

    python tools/test_desktop.py

Covers the two things that decide whether closing the window quits the app,
and the port rule that stops progress being stranded at a second address.
"""

import os
import sys
import threading
import time

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import app as server            # noqa: E402
import desktop                  # noqa: E402

results = []


def check(name, condition, detail=""):
    results.append((name, bool(condition), detail))


class ExitCalled(Exception):
    pass


def run_watchdog(quiet_for, heartbeat=False, timeout=3.0):
    """Return 'exited' or 'kept running' for a given heartbeat state."""
    server.LAST_SEEN["at"] = time.time() - quiet_for

    # The heartbeat is deliberately never stopped. A watchdog thread from the
    # "keeps running" case outlives this call, and if the beat stopped it
    # would eventually decide the window had closed and call os._exit for
    # real -- killing the test run itself.
    if heartbeat:
        def beat():
            while True:
                server.LAST_SEEN["at"] = time.time()
                time.sleep(0.05)
        threading.Thread(target=beat, daemon=True).start()

    outcome = {"value": "kept running"}
    done = threading.Event()

    def fake_exit(code):
        outcome["value"] = "exited"
        raise ExitCalled()

    def watch():
        real_exit, desktop.os._exit = desktop.os._exit, fake_exit
        try:
            desktop.watch_for_close(grace=0.0, idle=0.5, poll=0.05)
        except ExitCalled:
            pass
        finally:
            desktop.os._exit = real_exit
            done.set()

    threading.Thread(target=watch, daemon=True).start()
    done.wait(timeout)
    return outcome["value"]


# 1. No heartbeat for longer than the idle window -> quit.
check("quits when the page stops checking in",
      run_watchdog(quiet_for=5.0) == "exited")

# 2. A live heartbeat -> keep running.
check("keeps running while the page is open",
      run_watchdog(quiet_for=0.0, heartbeat=True, timeout=1.5) == "kept running")

# 3. The alive endpoint actually moves the timestamp.
before = server.LAST_SEEN["at"]
time.sleep(0.02)
with server.app.test_client() as client:
    ok = client.post("/api/alive").get_json().get("ok")
check("/api/alive responds ok", ok is True)
check("/api/alive refreshes the timestamp", server.LAST_SEEN["at"] > before)

# 4. The port rule: a free port is used as-is, so the address never drifts.
free = server.first_free_port(59000)
port, running = server.resolve_port(free)
check("a free preferred port is used unchanged", port == free and running is False,
      "got %s" % port)

# 5. An unrelated listener forces a move, and says so.
blocker = server_socket = None
try:
    import socket
    blocker = socket.socket()
    blocker.bind(("127.0.0.1", 0))
    blocker.listen(1)
    taken = blocker.getsockname()[1]
    port, running = server.resolve_port(taken)
    check("a foreign listener forces a different port",
          port != taken and running is False, "got %s" % port)
finally:
    if blocker:
        blocker.close()

# 6. The launcher must not hand Chrome its own profile — a separate profile
#    means separate localStorage, which is exactly how progress got stranded.
source = open(os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
                           "desktop.py"), encoding="utf-8").read()
check("does not pass --user-data-dir", "--user-data-dir=" not in source)
check("still opens in app mode", '"--app=" + url' in source)

passed = sum(1 for _, ok_, _ in results if ok_)
for name, ok_, detail in results:
    print("  %s  %s%s" % ("PASS" if ok_ else "FAIL", name, (" - " + detail) if detail and not ok_ else ""))
print("\ndesktop: %d/%d" % (passed, len(results)))
sys.exit(0 if passed == len(results) else 1)
