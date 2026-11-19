# Project Structure

```
reservation-calendar/
├── client/      React + TypeScript frontend
├── server/      Flask + SQLite backend
├── docs/        Submission documents
└── (root files) Shared tooling and project plans
```

## Root

| File | Purpose |
|---|---|
| `package.json` | Root scripts (`dev`, `build`, `lint`, `test`, `format`, `install:all`). Runs client and server together. |
| `.gitignore` | Files Git must not track: secrets, `node_modules`, `.venv`, SQLite files, build output, local Claude files. |
| `.env` | Local secrets and settings. Never committed. |
| `.editorconfig`, `.prettierrc.json`, `.prettierignore` | Shared formatting rules for both developers. |
| `README.md` | Setup and run instructions. |
| `SUMMARY.md` | Project plan: scope, data model, API agreement. |
| `CHECKLIST.md` | Day-by-day build checklist. |
| `STRUCTURE.md` | This file. |

## `client/`: frontend (Vite + React + React Router)

| Path | What goes here |
|---|---|
| `index.html` | Page shell. Normally left alone. |
| `vite.config.ts` | Vite settings, including the `/api` proxy to Flask. |
| `eslint.config.js`, `tsconfig*.json` | Lint and TypeScript settings. |
| `public/` | Static files served as-is (favicon, images). |
| `src/main.tsx` | App entry point. |
| `src/App.tsx` | Mounts the router. |
| `src/router.tsx` | All routes. Add a new page here. |
| `src/pages/` | One component per screen (Schedule, Login, Register, My Bookings). |
| `src/pages/organizer/` | Organizer-only screens. |
| `src/components/` | Reusable UI pieces (layout, session card, forms, buttons). |
| `src/api/` | Fetch helper and one function per API call. Pages call these, never `fetch` directly. |
| `src/types/` | TypeScript types that mirror the API responses. |
| `src/styles/` | CSS files. |

## `server/`: backend (Flask + SQLite)

| Path | What goes here |
|---|---|
| `package.json` | Only wraps Python commands as npm scripts (`npm run dev`, `test`, `lint`). It has no npm dependencies. |
| `requirements.txt` | Python packages needed to run the app. |
| `requirements-dev.txt` | Adds test and lint tools (pytest, ruff). Install this one. |
| `pyproject.toml` | pytest and Ruff settings. |
| `src/__init__.py` | `create_app()`: builds the Flask app and registers routes. |
| `src/config.py` | Settings read from environment variables. |
| `src/db.py` | SQLite connection helpers. |
| `src/schema.sql` | Table definitions and constraints. |
| `src/auth.py` | Login and role checks (`login_required`, organizer-only). |
| `src/errors.py` | The consistent JSON error format. |
| `src/routes/` | One file per API area, all under `/api`: `auth`, `targets`, `slots`, `bookings`, `organizer`. |
| `tests/` | pytest tests. Shared fixtures go in `conftest.py`. |
| `scripts/` | One-off commands: `init_db.py` creates the database, `seed_demo.py` adds demo accounts and sessions. |
| `data/` | The SQLite file lives here. Contents are git-ignored. |

## `docs/`: submission documents

API notes, database diagram, test report and contribution notes.

## Where does new code go?

| I want to... | Put it in |
|---|---|
| Add a screen | `client/src/pages/`, then add its route in `client/src/router.tsx` |
| Add a reusable UI piece | `client/src/components/` |
| Call a new endpoint from the browser | `client/src/api/` and its types in `client/src/types/` |
| Add an API endpoint | the matching file in `server/src/routes/` |
| Change the database | `server/src/schema.sql` |
| Add a business rule or permission check | `server/src/routes/` (shared helpers in `server/src/auth.py`) |
| Test a rule | `server/tests/` |
| Add a setting or secret | `.env`, read through `server/src/config.py` |
