"""Checks for lesson 03. Run:  pytest lessons/03-json"""
import pytest

# ---- E3.1 /login ---------------------------------------------------------------


def test_login_success(client):
    response = client.post("/login", json={"username": "jonathan", "password": "1234"})
    assert response.status_code == 200
    assert response.get_json() == {"message": "welcome, jonathan"}


def test_login_wrong_password(client):
    response = client.post("/login", json={"username": "jonathan", "password": "nope"})
    assert response.status_code == 401
    assert response.get_json() == {"error": "invalid username or password"}


def test_login_unknown_user_gets_same_message(client):
    response = client.post("/login", json={"username": "ghost", "password": "1234"})
    assert response.status_code == 401
    assert response.get_json() == {"error": "invalid username or password"}


def test_login_password_as_number_is_400_not_401(client):
    # The bug from the old code: 1234 (number) is not "1234" (string).
    response = client.post("/login", json={"username": "jonathan", "password": 1234})
    assert response.status_code == 400
    assert response.get_json() == {"error": "username and password must be strings"}


def test_login_missing_one_field(client):
    response = client.post("/login", json={"username": "jonathan"})
    assert response.status_code == 400
    assert response.get_json() == {"error": "missing field(s): password"}


def test_login_missing_both_fields(client):
    response = client.post("/login", json={})
    assert response.get_json() == {"error": "missing field(s): username, password"}


@pytest.mark.parametrize(
    "kwargs",
    [
        {},                                                     # no body at all
        {"data": "username=jonathan", "content_type": "text/plain"},  # not JSON
        {"data": '{"username": ', "content_type": "application/json"},  # broken JSON
        {"json": ["jonathan", "1234"]},                         # JSON, but a list
    ],
    ids=["no-body", "text-body", "broken-json", "json-list"],
)
def test_login_rejects_non_object_bodies(client, kwargs):
    response = client.post("/login", **kwargs)
    assert response.status_code == 400
    assert response.get_json() == {"error": "request body must be a JSON object"}


# ---- E3.2 /sum -------------------------------------------------------------------


def test_sum(client):
    response = client.post("/sum", json={"numbers": [1, 2.5, -3]})
    assert response.status_code == 200
    assert response.get_json() == {"sum": 0.5, "count": 3}


def test_sum_empty(client):
    assert client.post("/sum", json={"numbers": []}).get_json() == {"sum": 0, "count": 0}


@pytest.mark.parametrize("body", [None, {}, {"nums": [1]}, [1, 2]])
def test_sum_bad_shape(client, body):
    response = client.post("/sum", json=body)
    assert response.status_code == 400
    assert response.get_json() == {"error": 'body must be {"numbers": [...]}'}


@pytest.mark.parametrize("numbers", ["1,2", 5, [1, "2"], [1, None], [True, 2]])
def test_sum_bad_numbers(client, numbers):
    response = client.post("/sum", json={"numbers": numbers})
    assert response.status_code == 400
    assert response.get_json() == {"error": "numbers must be a list of numbers"}


# ---- E3.3 /notes ------------------------------------------------------------------


def test_create_note(client):
    response = client.post("/notes", json={"title": "Buy milk", "tags": ["home"]})
    assert response.status_code == 201
    assert response.get_json() == {"id": 1, "title": "Buy milk", "tags": ["home"]}
    assert response.headers["Location"] == "/notes/1"


def test_create_note_strips_title_and_defaults_tags(client):
    response = client.post("/notes", json={"title": "  Call mom  "})
    assert response.get_json() == {"id": 1, "title": "Call mom", "tags": []}


def test_ids_increase(client):
    client.post("/notes", json={"title": "first"})
    response = client.post("/notes", json={"title": "second"})
    assert response.get_json()["id"] == 2
    assert response.headers["Location"] == "/notes/2"


@pytest.mark.parametrize("body", [{}, {"title": ""}, {"title": "   "}, {"title": 42}, {"title": None}])
def test_create_note_needs_title(client, body):
    response = client.post("/notes", json=body)
    assert response.status_code == 400
    assert response.get_json() == {"error": "title is required"}


@pytest.mark.parametrize("tags", ["home", [1, 2], ["ok", None], {"a": 1}])
def test_create_note_bad_tags(client, tags):
    response = client.post("/notes", json={"title": "x", "tags": tags})
    assert response.status_code == 400
    assert response.get_json() == {"error": "tags must be a list of strings"}


def test_create_note_rejects_non_object(client):
    response = client.post("/notes", data="hello", content_type="text/plain")
    assert response.status_code == 400


def test_get_note(client):
    client.post("/notes", json={"title": "Buy milk"})
    response = client.get("/notes/1")
    assert response.status_code == 200
    assert response.get_json()["title"] == "Buy milk"


def test_get_missing_note(client):
    response = client.get("/notes/7")
    assert response.status_code == 404
    assert response.get_json() == {"error": "note 7 not found"}


def test_list_notes(client):
    assert client.get("/notes").get_json() == []
    client.post("/notes", json={"title": "a"})
    client.post("/notes", json={"title": "b"})
    titles = [note["title"] for note in client.get("/notes").get_json()]
    assert titles == ["a", "b"]
