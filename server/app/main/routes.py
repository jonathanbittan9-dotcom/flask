"""
Routes for the 'main' blueprint.

Notice: we decorate with @bp.route, NOT @app.route. There is no `app` in
scope here — and that's the point. These routes don't know or care which app
they'll be attached to. The factory decides that later.
"""
from flask import jsonify

from app.main import bp


@bp.route("/")
def index():
    # Returning a dict/using jsonify sends JSON — we're building a server/API,
    # so JSON is our default response language, not HTML.
    return jsonify(message="Server is alive", service="masterclass")


@bp.route("/health")
def health():
    # A 'health check' endpoint: monitoring tools ping this to ask "are you up?"
    # Real deployments (Docker, Kubernetes, load balancers) require one.
    return jsonify(status="ok")
