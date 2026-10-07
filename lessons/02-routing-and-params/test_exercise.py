"""Checks for lesson 02. Run:  pytest lessons/02-routing-and-params"""
import pytest


# ---- E2.1 /square ------------------------------------------------------------

@pytest.mark.parametrize("n, expected", [(4, 16), (0, 0), (-3, 9)])
def test_square(client, n, expected):
    response = client.get(f"/square/{n}")
    assert response.status_code == 200
    assert response.get_json() == {"n": n, "square": expected}


def test_square_rejects_text(client):
    assert client.get("/square/abc").status_code == 404


# ---- E2.2 /greet -------------------------------------------------------------

def test_greet_defaults_to_english(client):
    response = client.get("/greet/Jonathan")
    assert response.status_code == 200
    assert response.get_json() == {"greeting": "Hello, Jonathan!"}


def test_greet_in_hebrew(client):
    response = client.get("/greet/Jonathan?lang=he")
    assert response.get_json() == {"greeting": "Shalom, Jonathan!"}


def test_greet_unknown_lang(client):
    response = client.get("/greet/Jonathan?lang=fr")
    assert response.status_code == 400
    assert response.get_json() == {"error": "unsupported lang 'fr', use one of: en, he"}


# ---- E2.3 /movies pagination --------------------------------------------------

def test_movies_defaults(client):
    body = client.get("/movies").get_json()
    assert body["limit"] == 3
    assert body["offset"] == 0
    assert body["total"] == 7
    assert [m["title"] for m in body["items"]] == ["Interstellar", "Inception", "Up"]


def test_movies_limit_and_offset(client):
    body = client.get("/movies?limit=2&offset=5").get_json()
    assert [m["title"] for m in body["items"]] == ["Gladiator", "Arrival"]


def test_movies_offset_past_the_end_is_empty_not_an_error(client):
    response = client.get("/movies?offset=100")
    assert response.status_code == 200
    assert response.get_json()["items"] == []


@pytest.mark.parametrize("query", ["limit=abc", "limit=-1", "offset=x", "offset=-2", "limit=11"])
def test_movies_bad_params(client, query):
    response = client.get(f"/movies?{query}")
    assert response.status_code == 400
    assert "error" in response.get_json()


def test_movies_limit_ten_is_allowed(client):
    assert client.get("/movies?limit=10").status_code == 200


# ---- E2.4 /movies genre filter ------------------------------------------------

def test_movies_genre_filter_counts_after_filtering(client):
    body = client.get("/movies?genre=scifi&limit=2").get_json()
    assert body["total"] == 4
    assert [m["title"] for m in body["items"]] == ["Interstellar", "Inception"]


def test_movies_genre_is_case_insensitive(client):
    body = client.get("/movies?genre=ANIMATION").get_json()
    assert body["total"] == 2


def test_movies_unknown_genre_is_empty(client):
    body = client.get("/movies?genre=horror").get_json()
    assert body == {"items": [], "total": 0, "limit": 3, "offset": 0}


# ---- E2.5 /files ---------------------------------------------------------------

def test_files_nested_path(client):
    response = client.get("/files/docs/2026/notes.txt")
    assert response.status_code == 200
    assert response.get_json() == {
        "parts": ["docs", "2026", "notes.txt"],
        "filename": "notes.txt",
        "extension": "txt",
    }


def test_files_no_extension(client):
    body = client.get("/files/bin/run").get_json()
    assert body["filename"] == "run"
    assert body["extension"] is None
