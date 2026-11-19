# Reservation Calendar

Reservation calendar for hobby groups. Organizers publish sessions; members browse, book, and cancel.

- **client/**: React + TypeScript + React Router (Vite)
- **server/**: Flask API + SQLite (`sqlite3`), tested with pytest
- **docs/**: API notes, database diagram, test report

See [SUMMARY.md](SUMMARY.md) for the project plan and [CHECKLIST.md](CHECKLIST.md) for the build checklist.

## Setup

Requires Node 20+ and Python 3.11+.

```bash
# Python virtual environment (Git Bash on Windows: source server/.venv/Scripts/activate)
python -m venv server/.venv
source server/.venv/bin/activate

npm run install:all
cp .env.example .env     # then edit SECRET_KEY
npm run dev              # Flask on :5000, Vite on :5173
```

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Run the API and the client together |
| `npm run build` | Build the client into `client/dist` |
| `npm run lint` | ESLint (client) and Ruff (server) |
| `npm run test` | pytest (server) |
| `npm run format` | Prettier |
