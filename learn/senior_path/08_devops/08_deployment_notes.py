"""
08_devops/08_deployment_notes.py

Section 8: DevOps / Deployment (the parts that are actual Python, as
opposed to Dockerfile/docker-compose.yml/ci.yml sitting alongside this file)

    - Structured logging in production (vs. print statements)
    - Environment parity (dev/staging/prod config)
    - Health checks for zero-downtime deploys
    - Graceful rollback strategy (notes)

Run: python 08_deployment_notes.py
"""

import json
import logging
import os


# ---------------------------------------------------------------------------
# Structured logging: machine-parseable, not just human-readable print()
# ---------------------------------------------------------------------------
class JsonFormatter(logging.Formatter):
    # New words in this line:
    #   logging.Formatter (as a base class)  -> subclassing a STDLIB class
    #        and overriding one of its methods. logging calls .format(record)
    #        on whatever formatter is attached to a handler — by defining our
    #        own version below, we control the output shape without needing
    #        to modify Python's logging module itself
    def format(self, record):
        # New words in this line:
        #   record  -> a LogRecord object logging builds automatically for
        #        every log call; .levelname, .name, .getMessage(), and
        #        .formatTime() (used below) are attributes/methods it provides
        payload = {
            "level": record.levelname,
            "message": record.getMessage(),
            "logger": record.name,
            "time": self.formatTime(record),
        }
        return json.dumps(payload)
        # New words in this line:
        #   json.dumps(dict)  -> from the json module; serializes a Python
        #        dict into a JSON-formatted string


def demo_structured_logging():
    print("\n--- Structured (JSON) Logging ---")

    logger = logging.getLogger("deploy_demo")
    # New words in this line:
    #   logging.getLogger("name")  -> gets (or creates) a Logger with this
    #        name; using named loggers instead of the root logger lets
    #        different parts of an app be configured/filtered independently
    logger.setLevel(logging.INFO)
    # New words in this line:
    #   .setLevel(logging.INFO)  -> only messages at INFO severity or higher
    #        (INFO, WARNING, ERROR, CRITICAL) will actually be emitted;
    #        .debug() calls would be silently ignored
    handler = logging.StreamHandler()
    # New words in this line:
    #   logging.StreamHandler()  -> a handler that sends log output to the
    #        console (stdout/stderr) — distinct from the RotatingFileHandler
    #        mentioned in testlearn.py, which writes to a file instead
    handler.setFormatter(JsonFormatter())
    # New words in this line:
    #   .setFormatter(...)  -> attaches a formatter instance to this handler,
    #        so it controls HOW each log line is rendered (here, as JSON)
    logger.handlers = [handler]   # replace any existing handlers for this demo

    logger.info("User borrowed a book")
    logger.warning("Book availability cache miss")

    # Why this matters in production: a log aggregator (Datadog, CloudWatch,
    # ELK) can filter/alert on `level == "WARNING"` reliably. Plain
    # print("something went wrong") gives it nothing structured to query.


# ---------------------------------------------------------------------------
# Environment parity: same code, different config per environment
# ---------------------------------------------------------------------------
class Config:
    def __init__(self, env: str):
        self.env = env
        self.debug = env == "development"
        self.mongo_uri = os.environ.get(
            "MONGO_URI",
            "mongodb://localhost:27017/rtl_dev" if env == "development" else None,
            # New words in this line:
            #   X if CONDITION else Y  -> the "conditional expression" (aka
            #        ternary): evaluates to X when CONDITION is True,
            #        otherwise to Y — a compact inline if/else usable as a
            #        VALUE, here as os.environ.get()'s default argument
        )

    def validate(self):
        if self.env == "production" and self.debug:
            raise RuntimeError("Refusing to start: DEBUG must be False in production")
        if self.env == "production" and not self.mongo_uri:
            raise RuntimeError("MONGO_URI must be set explicitly in production")


def demo_environment_parity():
    print("\n--- Environment Parity ---")

    dev_config = Config("development")
    dev_config.validate()
    print("dev config OK:", dev_config.mongo_uri)

    prod_config = Config("production")   # no MONGO_URI env var set in this demo
    try:
        prod_config.validate()
    except RuntimeError as e:
        print("Expected error (prod caught a misconfiguration before starting):", e)


# ---------------------------------------------------------------------------
# Health checks — what a load balancer polls before routing traffic to you
# ---------------------------------------------------------------------------
def health_check(db_ping_fn) -> dict:
    # New words in this line:
    #   db_ping_fn  -> just a regular parameter name — the NOTABLE part is
    #        that a FUNCTION is being passed in as an argument (see how it's
    #        called below with a lambda), so health_check works with ANY
    #        ping mechanism its caller provides, not one hardcoded database
    """
    In a real Flask app:

        @app.route("/health")
        def health():
            status = health_check(lambda: mongo_client.admin.command("ping"))
            code = 200 if status["ok"] else 503
            return jsonify(status), code

    A load balancer / orchestrator (Kubernetes, Render, etc.) hits this
    endpoint repeatedly. If it returns unhealthy, traffic stops routing to
    that instance — this is what makes zero-downtime deploys possible:
    the old instance keeps serving until the new one reports healthy.
    """
    try:
        db_ping_fn()
        return {"ok": True, "database": "connected"}
    except Exception as e:
        # New words in this line:
        #   except Exception  -> catches almost ANY exception, not just one
        #        specific type — deliberately broad here because a health
        #        check should report ANY failure as "unhealthy" rather than
        #        crash the health-check route itself; normally prefer
        #        catching the SPECIFIC exceptions you expect, as earlier
        #        files did
        return {"ok": False, "database": f"unreachable: {e}"}


def demo_health_check():
    print("\n--- Health Checks ---")
    print("healthy case:", health_check(lambda: None))
    print("unhealthy case:", health_check(lambda: (_ for _ in ()).throw(ConnectionError("timeout"))))
    # New words in this line:
    #   (_ for _ in ())     -> a generator expression that produces ZERO
    #        items (looping over an empty tuple) — `_` is just a
    #        conventional variable name meaning "unused"
    #   .throw(Exception(...))  -> a method every generator has; injects an
    #        exception into it. Combined, this whole expression is a compact
    #        trick to raise an exception from INSIDE a lambda, which
    #        normally can only hold a single expression (no `raise`
    #        statement allowed) — the generator re-raises the exception
    #        immediately since it has no code to catch it. You won't need
    #        this often; it exists here purely to simulate a failing
    #        dependency for the demo.


# ---------------------------------------------------------------------------
# Rollback strategy (notes — this is process, not code)
# ---------------------------------------------------------------------------
def demo_rollback_notes():
    print("\n--- Rollback Strategy (notes) ---")
    print("""
- Tag every deploy (git tag v1.4.2) so "roll back to the last good version"
  is a known, findable commit, not guesswork.
- Prefer deploying a previous known-good container image over trying to
  manually revert code changes under pressure during an incident.
- Database migrations should be backward-compatible for at least one
  release (old code should still run against the new schema) so a
  rollback doesn't ALSO require a database rollback.
""")


if __name__ == "__main__":
    demo_structured_logging()
    demo_environment_parity()
    demo_health_check()
    demo_rollback_notes()
