"""Accounts: POST /register, POST /login, GET /me, POST /logout."""

from flask import Blueprint

bp = Blueprint("auth", __name__)
