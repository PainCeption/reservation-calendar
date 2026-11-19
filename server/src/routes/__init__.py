"""API blueprints. All routes live under the /api prefix."""

from flask import Flask

from .auth import bp as auth_bp
from .bookings import bp as bookings_bp
from .organizer import bp as organizer_bp
from .slots import bp as slots_bp
from .targets import bp as targets_bp


def register_blueprints(app: Flask) -> None:
    for bp in (auth_bp, targets_bp, slots_bp, bookings_bp, organizer_bp):
        app.register_blueprint(bp, url_prefix="/api")
