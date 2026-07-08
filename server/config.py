"""
Configuration lives in classes, not scattered `app.config[...]` lines.

Why classes? Because "dev", "test", and "prod" are variations on the SAME
settings. Inheritance lets each environment override only what differs, and
you pick one by name at startup — no code changes to switch environments.
"""
import os


class Config:
    """Base config: settings shared by every environment."""
    # Never hard-code secrets. Read from the environment, fall back to a
    # dev-only value so the app still boots on a fresh checkout.
    SECRET_KEY = os.environ.get("SECRET_KEY", "dev-only-change-me")

    # A flag we'll read later. Base default = safe/off.
    DEBUG = False


class DevConfig(Config):
    """Local development: verbose errors, auto-reload."""
    DEBUG = True


class TestConfig(Config):
    """Automated tests: isolated, predictable."""
    DEBUG = False
    TESTING = True


class ProdConfig(Config):
    """Production: nothing extra enabled, secret MUST come from env."""
    DEBUG = False


# A lookup table so we can select a config by a short string name,
# e.g. from an environment variable. This is the whole trick.
config_by_name = {
    "dev": DevConfig,
    "test": TestConfig,
    "prod": ProdConfig,
}
