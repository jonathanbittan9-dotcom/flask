"""If this passes, your environment is ready."""
from pathlib import Path

from conftest import load_module


def test_flask_is_version_3():
    from importlib.metadata import version

    assert version("flask").startswith("3.")


def test_hello_app_responds():
    module = load_module(Path(__file__).parent / "hello.py")
    response = module.app.test_client().get("/")
    assert response.status_code == 200
