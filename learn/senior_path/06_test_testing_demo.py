"""
06_test_testing_demo.py

Section 6: Testing (part 2 — the actual tests)

Tests the code in 06_testing_demo.py, using pytest.

Setup (once):
    pip install pytest

Run:
    pytest 06_test_testing_demo.py -v

Covers:
    - Fixtures (@pytest.fixture) — reusable setup, no copy-pasted init code
    - Parametrize (@pytest.mark.parametrize) — one test, many inputs
    - Mocking (unittest.mock) — faking a dependency (e.g. an email sender)
      instead of actually sending anything during a test run
"""

import pytest
from unittest.mock import Mock

from importlib import import_module

# The source file is named with a leading digit (06_testing_demo.py), which
# isn't a valid Python module name to `import` directly — this is a quirk of
# naming teaching files 01_, 02_, etc. In a real project you would NOT prefix
# module files with digits for this exact reason; here we work around it
# with import_module() so the numbering can stay for teaching purposes.
testing_demo = import_module("06_testing_demo")
# New words in this line:
#   import_module("name")  -> imports a module by its NAME AS A STRING,
#        returning the module object — used here only because "06_testing_demo"
#        starts with a digit and can't be written after a plain `import`
#        keyword (`import 06_testing_demo` would be a syntax error)
Library = testing_demo.Library
Book = testing_demo.Book
BookNotFoundError = testing_demo.BookNotFoundError
BookUnavailableError = testing_demo.BookUnavailableError


# ---------------------------------------------------------------------------
# Fixtures — shared setup, injected into any test that asks for it by name
# ---------------------------------------------------------------------------
@pytest.fixture
# New words in this line:
#   @pytest.fixture  -> marks the function below as reusable SETUP. Any test
#        function that takes a parameter with the SAME NAME as this fixture
#        (here, `library`) automatically receives whatever it returns —
#        pytest calls it fresh for every test, so tests never accidentally
#        share state
def library():
    """A fresh Library with one book, built new for EVERY test that uses it."""
    lib = Library()
    lib.add_book(Book(id="1", title="1984"))
    return lib


def test_borrow_available_book(library):
    # New words in this line:
    #   library (as a parameter)  -> not a plain argument you pass in
    #        yourself — pytest sees the name matches the fixture above and
    #        injects it automatically
    message = library.borrow("1")
    assert message == "You borrowed '1984'"
    # New words in this line:
    #   assert expr  -> if expr is falsy, pytest fails the test and shows
    #        exactly what the actual value was; if truthy, nothing happens
    #        and the test just continues


def test_borrow_already_borrowed_book_raises(library):
    library.borrow("1")   # first borrow succeeds
    with pytest.raises(BookUnavailableError):
        # New words in this line:
        #   pytest.raises(ExceptionType)  -> a context manager (like the
        #        `with` blocks from Section 1) that PASSES the test if the
        #        code inside raises that exception, and FAILS the test if
        #        it doesn't
        library.borrow("1")   # second borrow should raise


def test_borrow_missing_book_raises(library):
    with pytest.raises(BookNotFoundError):
        library.borrow("does-not-exist")


# ---------------------------------------------------------------------------
# Parametrize — run the same test logic against many inputs
# ---------------------------------------------------------------------------
@pytest.mark.parametrize("n, expected", [
    # New words in this block:
    #   @pytest.mark.parametrize("names", [(values...), ...])  -> runs the
    #        SAME test function once per tuple below, substituting n/expected
    #        each time — pytest reports each combination as its own separate
    #        test result instead of one pass/fail for the whole function
    (1, False),
    (2, True),
    (3, True),
    (4, False),
    (17, True),
    (18, False),
])
def test_is_prime_id(library, n, expected):
    assert library.is_prime_id(n) is expected
    # Without parametrize you'd copy-paste this test 6 times with different
    # numbers — parametrize keeps it as ONE test definition.


# ---------------------------------------------------------------------------
# Mocking — replace a real dependency with a fake one for the test
# ---------------------------------------------------------------------------
def test_borrow_sends_notification():
    fake_notifier = Mock()
    # New words in this line:
    #   Mock()  -> creates an object that accepts ANY attribute access or
    #        method call (fake_notifier.send(...), fake_notifier.anything(...),
    #        all "work") and silently records what was called and with what
    #        arguments, instead of doing anything real
    lib = Library(notifier=fake_notifier)
    lib.add_book(Book(id="1", title="1984"))

    lib.borrow("1")

    fake_notifier.send.assert_called_once_with("'1984' was borrowed")
    # New words in this line:
    #   .assert_called_once_with(...)  -> a Mock-specific assertion method:
    #        fails the test unless .send() was called EXACTLY once, with
    #        EXACTLY this argument
    # No real email/Discord message was sent — Mock just recorded the call.
    # This is essential for testing code that has side effects (network,
    # email, payments) without actually triggering them during test runs.
