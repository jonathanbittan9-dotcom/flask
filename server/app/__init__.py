"""
The application factory.

`create_app` builds a fully configured Flask app and returns it. Nothing is
created at import time — you get an app only when you CALL this function. That
single change is what makes the app testable, configurable, and splittable
into modules without circular imports.
"""
from flask import Flask

from config import config_by_name


def create_app(config_name="dev"):
    # 1. Create the app object. Still just `Flask(__name__)` under the hood —
    #    but now it happens inside a function, on demand, not at import time.
    app = Flask(__name__)

    # 2. Load configuration from the chosen config class. `from_object`
    #    copies every UPPERCASE attribute of the class into app.config.
    app.config.from_object(config_by_name[config_name])

    # 3. Register blueprints. A blueprint is a self-contained bundle of
    #    routes. The factory wires them into the app here — this is the
    #    "assembly line" where independent pieces get bolted together.
    from app.main import bp as main_bp
    app.register_blueprint(main_bp)

    # 4. Hand back the finished app.
    return app
