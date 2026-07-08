"""
The entry point. This is the ONLY place we actually call the factory and get
a real app. Everything else just defines pieces; this file assembles and runs.

Run with:  python run.py
"""
import os

from app import create_app

# Pick the environment from an env var, defaulting to 'dev'.
# Try:  FLASK_ENV=prod python run.py   (on Windows PowerShell: $env:FLASK_ENV="prod")
app = create_app(os.environ.get("FLASK_ENV", "dev"))


if __name__ == "__main__":
    app.run(port=5001)
