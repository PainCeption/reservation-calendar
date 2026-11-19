"""Flask application factory."""

from flask import Flask

from .config import Config
from .routes import register_blueprints


def create_app(config: type[Config] | dict | None = None) -> Flask:
    app = Flask(__name__)
    app.config.from_object(Config)

    if isinstance(config, dict):
        app.config.update(config)
    elif config is not None:
        app.config.from_object(config)

    # TODO: init database helpers (src/db.py), error handlers (src/errors.py),
    # CSRF protection, and serving the built client from client/dist.

    register_blueprints(app)
    return app
