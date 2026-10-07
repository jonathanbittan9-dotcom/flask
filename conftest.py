"""
Shared pytest setup for every lesson.

Each lesson's tests use the `client` fixture. It loads `exercise.py` from the
same folder as the test file (or `solution.py` when LESSON_TARGET=solution),
and returns a Flask test client: an object that sends fake HTTP requests to
the app without starting a real server.
"""
import importlib.util
import os
from pathlib import Path

import pytest


def load_module(path: Path):
    """Import a Python file by its path and return the module object."""
    spec = importlib.util.spec_from_file_location(f"lesson_{path.parent.name}_{path.stem}", path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


@pytest.fixture
def client(request):
    target = os.environ.get("LESSON_TARGET", "exercise")
    module = load_module(Path(request.path).parent / f"{target}.py")
    module.app.config["TESTING"] = True
    return module.app.test_client()
