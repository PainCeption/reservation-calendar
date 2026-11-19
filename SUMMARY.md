# Project Plan: Reservation Calendar for Hobby Groups

| | |
|---|---|
| **Deadline** | 24 November 2026 |
| **Team** | Two developers, one backend and one frontend |
| **Working time** | About 5.5 hours per working day per person |
| **Proposed qualification units** | Ohjelmistokehittäjänä toimiminen (45 osp) and Ohjelmiston toteuttaminen ohjelmistokomponenttikirjastolla (30 osp) |

> The mentor and assessor confirm which criteria the project can demonstrate and what evidence is needed.

---

## 1. Purpose

Small hobby groups often organize sessions through group chats and informal lists. This makes it hard for members to know whether a spot is available and for organizers to know who is coming.

The Reservation Calendar gives organizers a place to publish sessions and track attendance. Members can browse upcoming sessions, book an available spot, and cancel their booking if their plans change.

---

## 2. First release

### Visitors
- Browse activities and upcoming sessions.
- Create a member account and log in.

### Members
- See how many spots are left.
- Book one spot per session.
- View their upcoming bookings.
- Cancel their own bookings before a session starts.

### Organizers
- Create activities.
- Schedule sessions for their own activities.
- See booking counts and participant names for their sessions.

### Calendar
The calendar will be a schedule grouped by date. Each session shows the activity, time, location, and availability, such as "3 of 8 booked" or "Full."

### Optional and deferred
- **Optional once the core features work:** month grid, color-coded availability.
- **Deferred:** organizer cancellation of entire sessions, activity editing, email notifications, password reset, an admin panel, and a mobile app.
- **Deployment:** the application will run locally for submission. Deployment is included only if the mentor requires it.

---

## 3. Technology and division of work

### Backend developer
- Build the Flask API and SQLite database.
- Implement registration, login, roles, validation, booking rules, and permission checks.
- Write automated tests with pytest.
- Document the API and database.

### Frontend developer
- Design and build the schedule, account forms, My Bookings page, and organizer screens using HTML, CSS, and JavaScript.
- Connect them to the API with Fetch.
- Handle loading, empty, and error states.
- Check that the interface works with a keyboard and on narrow screens.

### Both developers
- Agree on requirements and the API.
- Work on GitHub feature branches and review each other's pull requests.
- Test the browser flows together.
- Use Windows, VS Code, Git Bash, and a Python virtual environment.

### Architecture
- One Flask application serves both the frontend and the JSON API.
- Werkzeug for password hashing; Python's `sqlite3` module for database access.
- Proposed login approach: a Flask session. Agree on the approach and CSRF protection for write requests before connecting the frontend.
- Create organizer accounts through local setup, so public registration always creates a member.

---

## 4. Data model and booking rules

### Tables

| Table | Fields |
|---|---|
| **Users** | Name, unique email, password hash, role |
| **Targets** | Activity name, description, location, owning organizer |
| **Slots** | Activity, start time, end time, maximum capacity |
| **Bookings** | Session, member, booking creation time |

Use *Activities* and *Sessions* in the interface. Keep *targets* and *slots* as the database and API terms.

### Validation
- Capacity must be a positive whole number.
- The end time must follow the start time.
- The API exchanges timestamps with a timezone offset, the database stores UTC, and the interface displays Helsinki time.

### Booking and permission rules
- A database constraint prevents a member from booking the same session twice.
- The backend checks capacity and saves the booking in one transaction, so two members cannot take the last spot.
- Only the booking owner can cancel it.
- Only the organizer who owns the activity can schedule sessions for it or see its participants.

---

## 5. API agreement

All routes use the `/api` prefix. Before building the screens and endpoints in parallel, agree on an example request and response for each core action.

| Area | Routes |
|---|---|
| **Accounts** | `POST /register`, `POST /login`, `GET /me`, `POST /logout` |
| **Activities** | `GET /targets` (list), `POST /targets` (create) |
| **Sessions** | `GET /slots` (list upcoming), `POST /slots` (schedule) |
| **Bookings** | `POST /bookings` (book), `GET /my-bookings` (list yours), `DELETE /bookings/{id}` (cancel) |
| **Organizer overview** | `GET /organizer/slots` (sessions and booking counts), `GET /slots/{id}/participants` (participant names) |

### Conventions
- Use the same session fields wherever possible: session ID, activity name, location, start and end times, capacity, booking count, and remaining spots.
- Return a consistent error format so the frontend can distinguish:
  - invalid input
  - expired login
  - missing permission
  - a full session
  - a duplicate booking

---

## 6. Schedule and submission

### Schedule

| Date | Goal |
|---|---|
| **19 November** | Agree on the scope and API, set up the project, and connect login in the browser. |
| **20 November** | Publish a session, then book and cancel it through the browser. |
| **23 November** | Finish the organizer overview, test booking and permission rules, and draft the documentation. |
| **24 November** | Verify a fresh installation, rehearse the demo, and submit. |

The schedule uses four weekdays, with up to 22 hours per person. Weekend work is optional. If time gets tight, defer the month grid, fill colors, and visual polish first.

### Definition of done
- A fresh checkout runs from the README.
- Both roles can complete their main flows in the browser.
- Automated tests cover invalid input, duplicate bookings, full sessions, competing requests for the last spot, and ownership checks.

### Deliverables
- README
- API notes
- Database diagram
- Short test report

Keep relevant pull requests, review comments, and individual contribution notes as portfolio evidence.
