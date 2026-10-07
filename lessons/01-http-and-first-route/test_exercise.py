"""Checks for lesson 01. Run:  pytest lessons/01-http-and-first-route"""


def test_ping(client):
    response = client.get("/ping")
    assert response.status_code == 200
    assert response.get_json() == {"message": "pong"}


def test_ping_is_json(client):
    response = client.get("/ping")
    assert response.content_type == "application/json"


def test_version_body(client):
    response = client.get("/version")
    assert response.status_code == 200
    assert response.get_json() == {"name": "flask-course", "version": "1.0.0"}


def test_version_header(client):
    response = client.get("/version")
    assert response.headers.get("X-App-Version") == "1.0.0"


def test_coffee_is_a_teapot(client):
    response = client.get("/coffee")
    assert response.status_code == 418
    assert response.get_json() == {"error": "I'm a teapot"}


def test_launch_accepts_post(client):
    response = client.post("/launch")
    assert response.status_code == 202
    assert response.get_json() == {"status": "launching"}


def test_launch_rejects_get(client):
    response = client.get("/launch")
    assert response.status_code == 405
    assert "POST" in response.headers["Allow"]


def test_whoami_reads_the_request(client):
    response = client.get("/whoami", headers={"User-Agent": "PostmanRuntime/7.0"})
    assert response.status_code == 200
    assert response.get_json() == {
        "method": "GET",
        "path": "/whoami",
        "user_agent": "PostmanRuntime/7.0",
    }


def test_whoami_without_user_agent(client):
    # The test client normally sends "User-Agent: Werkzeug/...". Remove it.
    client.environ_base.pop("HTTP_USER_AGENT", None)
    response = client.get("/whoami")
    assert response.get_json()["user_agent"] == "unknown"
