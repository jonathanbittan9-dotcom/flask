"""
The 'main' blueprint.

A Blueprint is like a mini-app: it collects routes under one name, and the
factory registers it onto the real app. Think of it as a folder for a feature.
We create the blueprint object here, then import routes.py so the @bp.route
decorators in that file attach to this object.
"""
from flask import Blueprint

# name="main" is how url_for refers to these routes: url_for("main.index").
bp = Blueprint("main", __name__)

# Import routes AT THE BOTTOM so `bp` already exists when routes.py uses it.
# This bottom import is the classic Flask pattern for avoiding circular imports.
from app.main import routes  # noqa: E402,F401
