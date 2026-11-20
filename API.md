# Reservation Calendar — API Contract

**Project:** Reservation Calendar for Hobby Groups  
**Backend:** Python, Flask, SQLite  
**Frontend:** React, TypeScript, Vite  
**Deadline:** 24 November 2026  
**Status:** Proposed — requires agreement from both developers

---

## 1. Architecture and general rules

The project uses a separate frontend and backend in the same Git repository.

### Frontend

The frontend is located in `client/` and uses React, TypeScript, and Vite.

During development, Vite runs on `http://localhost:5173` and proxies `/api` requests to Flask at `http://localhost:5000`.

Frontend requests must use relative paths:

```typescript
fetch("/api/slots", {
  credentials: "same-origin",
});
```

### Backend

The backend is located in `server/` and uses:

- Flask application factory (`create_app`)
- Flask Blueprints for organizing routes
- SQLite through Python's `sqlite3` module
- Flask sessions for authentication
- Werkzeug password hashing
- pytest for automated tests

Backend implementation files are located in `server/src/`, with tests in `server/tests/`.

### API conventions

- Every endpoint begins with `/api`.
- Requests containing data use JSON.
- Responses use JSON except for `204 No Content`.
- JSON fields use `snake_case`.
- Resource IDs are integers.
- Timestamps use ISO 8601 with timezone information.
- The database stores timestamps in UTC.
- The API returns UTC timestamps using `Z`.
- The frontend displays timestamps in `Europe/Helsinki`.
- Empty collections are represented as `[]`.
- The API uses standard HTTP status codes.
- Errors follow one consistent JSON structure.

The first release runs locally. Serving the compiled frontend from Flask is optional unless required for submission.

## 2. Authentication and authorization

Authentication uses Flask sessions with cookies.

### User roles

| Role | Permissions |
|---|---|
| Visitor | Browse activities and upcoming sessions |
| Member | Browse, book sessions, view and cancel own bookings |
| Organizer | Create activities and sessions, view own sessions and participants |

Visitors are unauthenticated users, not a stored database role.

### Authentication rules

- Public registration creates `member` accounts only.
- Organizer accounts are created through local application setup.
- Passwords are securely hashed and never returned by the API.
- Login creates an authenticated Flask session.
- Logout clears the authenticated session.
- Protected endpoints require authentication.
- Organizer endpoints require the `organizer` role.
- The backend checks ownership and permissions for every protected action.
- Client-provided roles and user IDs cannot override authenticated account information.

### Session security

Session cookies use appropriate `HttpOnly` and `SameSite` settings.

The `Secure` cookie setting must be enabled when deployed over HTTPS.

The Flask secret key is stored in environment-based configuration and must not be committed to Git.

The frontend uses `credentials: "same-origin"` for authenticated Fetch requests.

### CSRF protection

State-changing requests require CSRF protection.

**GET `/api/csrf`**

Response: `200 OK`

```json
{
  "csrf_token": "example-csrf-token"
}
```

The frontend sends this token in the `X-CSRF-Token` header for POST and DELETE requests.

The backend validates the token before processing the request. Login and registration are included.

The implementation must support session changes during login and logout, including obtaining a fresh token when necessary.

The exact CSRF implementation is to be agreed upon before integrating authenticated write requests.

## 3. Account endpoints

### POST `/api/register`

Creates a new member account.

Request:

```json
{
  "name": "Alex Example",
  "email": "alex@example.com",
  "password": "example-password"
}
```

Success: `201 Created`

```json
{
  "id": 1,
  "name": "Alex Example",
  "email": "alex@example.com",
  "role": "member"
}
```

Validation:
- Name is required and nonempty.
- Email is required and must have a valid format.
- Email must be unique.
- Password is required.
- Role is always assigned by the backend.

Possible errors: `INVALID_INPUT`, `EMAIL_EXISTS`.

Registration does not automatically log the user in.

### POST `/api/login`

Authenticates an existing user.

Request:

```json
{
  "email": "alex@example.com",
  "password": "example-password"
}
```

Success: `200 OK`

```json
{
  "id": 1,
  "name": "Alex Example",
  "email": "alex@example.com",
  "role": "member"
}
```

The backend creates an authenticated Flask session.

Incorrect email or password returns `401 INVALID_CREDENTIALS`.

### GET `/api/me`

Returns information about the currently authenticated user.

Success: `200 OK`

```json
{
  "id": 1,
  "name": "Alex Example",
  "email": "alex@example.com",
  "role": "member"
}
```

Unauthenticated requests return `401 UNAUTHORIZED`.

### POST `/api/logout`

Ends the current authenticated session.

Success: `204 No Content`

No response body is returned.

## 4. Activities (Targets)

The user interface calls these **Activities**.

The database and API use **Targets**.

### GET `/api/targets`

Public endpoint returning the list of activities.

Success: `200 OK`

```json
[
  {
    "id": 5,
    "name": "Creative Workshop",
    "description": "A weekly group activity.",
    "location": "Community Center",
    "organizer_id": 2
  }
]
```

Returns `[]` if no activities exist.

### POST `/api/targets`

Organizer only.

Request:

```json
{
  "name": "Creative Workshop",
  "description": "A weekly group activity.",
  "location": "Community Center"
}
```

Success: `201 Created`

```json
{
  "id": 5,
  "name": "Creative Workshop",
  "description": "A weekly group activity.",
  "location": "Community Center",
  "organizer_id": 2
}
```

Rules:
- Name and location must be nonempty strings.
- Description may be empty.
- The backend determines `organizer_id` from the logged-in user.
- Members cannot create activities.

## 5. Sessions (Slots)

The user interface calls these **Sessions**.

The database and API use **Slots**.

### GET `/api/slots`

Public endpoint returning upcoming sessions ordered by start time.

Success: `200 OK`

```json
[
  {
    "id": 12,
    "target_id": 5,
    "activity_name": "Creative Workshop",
    "location": "Community Center",
    "start_time": "2026-11-27T15:00:00Z",
    "end_time": "2026-11-27T16:30:00Z",
    "capacity": 8,
    "booking_count": 5,
    "remaining_spots": 3
  }
]
```

The frontend groups sessions by date.

The backend calculates booking counts and remaining availability from the database.

### POST `/api/slots`

Organizer only.

Request:

```json
{
  "target_id": 5,
  "start_time": "2026-11-27T17:00:00+02:00",
  "end_time": "2026-11-27T18:30:00+02:00",
  "capacity": 8
}
```

Success: `201 Created`

```json
{
  "id": 12,
  "target_id": 5,
  "activity_name": "Creative Workshop",
  "location": "Community Center",
  "start_time": "2026-11-27T15:00:00Z",
  "end_time": "2026-11-27T16:30:00Z",
  "capacity": 8,
  "booking_count": 0,
  "remaining_spots": 8
}
```

Rules:
- `target_id` must reference an existing activity.
- Only the activity's owner can schedule sessions for it.
- Capacity must be a positive integer, not a boolean.
- Start and end times must include timezone offsets.
- End time must be after start time.
- New sessions must start in the future.

## 6. Bookings

### POST `/api/bookings`

Member only.

Request:

```json
{
  "slot_id": 12
}
```

Success: `201 Created`

```json
{
  "id": 25,
  "slot_id": 12,
  "user_id": 1,
  "created_at": "2026-11-19T10:00:00Z"
}
```

Rules:
- Only authenticated members can book.
- Members can book a session only once.
- Sessions cannot exceed their maximum capacity.
- A session cannot be booked after it starts.
- The backend determines the user ID from the authenticated session.
- Capacity checking and booking insertion must happen atomically in one database write transaction.
- The database enforces uniqueness for each `(slot_id, user_id)` pair.

Two concurrent booking requests must not cause overbooking.

Possible errors: `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`, `SLOT_FULL`, `ALREADY_BOOKED`.

### GET `/api/my-bookings`

Member only.

Returns the current member's upcoming bookings.

Success: `200 OK`

```json
[
  {
    "id": 25,
    "created_at": "2026-11-19T10:00:00Z",
    "slot": {
      "id": 12,
      "target_id": 5,
      "activity_name": "Creative Workshop",
      "location": "Community Center",
      "start_time": "2026-11-27T15:00:00Z",
      "end_time": "2026-11-27T16:30:00Z",
      "capacity": 8,
      "booking_count": 5,
      "remaining_spots": 3
    }
  }
]
```

Returns `[]` if the member has no upcoming bookings.

### DELETE `/api/bookings/{id}`

Member only.

Cancels an existing booking.

Success: `204 No Content`

Rules:
- Members may cancel only their own bookings.
- Cancellation is allowed only before the session begins.
- Successful cancellation frees the reserved spot.
- Unauthorized access to another member's booking is rejected.

The frontend refreshes session availability after cancellation.

## 7. Organizer endpoints

### GET `/api/organizer/slots`

Organizer only.

Returns upcoming sessions belonging to activities owned by the authenticated organizer.

Success: `200 OK`

Returns an array using the same session object format as `GET /api/slots`.

### GET `/api/slots/{id}/participants`

Organizer only.

Returns participants for a session owned by the authenticated organizer.

Success: `200 OK`

```json
[
  {
    "booking_id": 25,
    "user_id": 1,
    "name": "Alex Example"
  }
]
```

Returns `[]` if the session has no participants.

Organizers cannot access participant lists belonging to other organizers.

## 8. Error handling

All errors use this JSON structure:

```json
{
  "error": {
    "code": "SLOT_FULL",
    "message": "This session is fully booked."
  }
}
```

| HTTP status | Error code | Meaning |
|---|---|---|
| 400 | `INVALID_INPUT` | Invalid request data |
| 401 | `UNAUTHORIZED` | Authentication required |
| 401 | `INVALID_CREDENTIALS` | Incorrect login information |
| 403 | `FORBIDDEN` | Insufficient permissions |
| 403 | `CSRF_INVALID` | Missing or invalid CSRF token |
| 404 | `NOT_FOUND` | Requested resource not found |
| 409 | `SLOT_FULL` | Session has no available spots |
| 409 | `ALREADY_BOOKED` | Member already booked the session |
| 409 | `EMAIL_EXISTS` | Email address is already registered |
| 500 | `INTERNAL_ERROR` | Unexpected server error |

Other business-rule failures, including cancellation after a session has started, should return a consistent documented error code before frontend integration.

Error messages must not reveal sensitive information, SQL queries, stack traces, passwords, or secret keys.

## 9. Database contract

The backend uses four primary SQLite tables.

### Users

- `id`
- `name`
- `email`
- `password_hash`
- `role`

### Targets

- `id`
- `name`
- `description`
- `location`
- `organizer_id`

### Slots

- `id`
- `target_id`
- `start_time`
- `end_time`
- `capacity`

### Bookings

- `id`
- `slot_id`
- `user_id`
- `created_at`

### Relationships and constraints

- One organizer can own many targets.
- One target can contain many slots.
- One slot can have many bookings.
- One member can have many bookings.
- A member can book each slot at most once.
- Foreign-key constraints must be enabled on every SQLite connection.
- Booking counts should be calculated from bookings rather than maintained as a separate counter.
- SQLite write transactions must protect capacity checks against concurrent booking requests.

Database connection management is implemented in `server/src/db.py`.

Database table definitions are stored in `server/src/schema.sql`.

Tests use temporary databases and must not modify development or demo data.

## 10. Frontend requirements

The React frontend must support:

- Public activity and session browsing.
- Date-grouped schedule display.
- Registration and login forms.
- Login state and logout.
- Role-dependent navigation.
- Activity and session creation for organizers.
- Booking and cancellation for members.
- Upcoming bookings overview.
- Session capacity and remaining-spot indicators.
- Organizer session overview.
- Organizer participant lists.
- Loading, empty, and error states.
- Disabled action buttons while requests are pending.
- Keyboard accessibility and narrow-screen layouts.

The frontend may use mock JSON responses until the backend endpoints become available.

All mock data should follow the formats defined in this document.

## 11. Testing requirements

The backend uses pytest.

Required tests include:

- Successful registration.
- Invalid registration data.
- Duplicate email rejection.
- Successful login.
- Invalid credentials.
- Authentication-required endpoints.
- Member and organizer permission checks.
- Organizer ownership restrictions.
- Invalid capacity.
- Invalid session dates.
- Duplicate booking attempts.
- Fully booked sessions.
- Cancellation ownership checks.
- Cancellation after session start.
- Concurrent booking attempts for the last available spot.

The frontend and backend developers must also test the complete browser workflow together.

## 12. Git and collaboration rules

- `main` is the shared, reviewed branch.
- Development happens on feature branches.
- Each developer commits and pushes changes to their own feature branches.
- Completed features are submitted through pull requests.
- Relevant pull requests are reviewed and tested before merging.
- Both developers must agree before changing endpoint names, JSON fields, authentication behavior, or error codes.
- This document must be updated whenever the API contract changes.

## 13. First-release scope

The first release includes:

- Member registration and authentication.
- Organizer accounts and role-based permissions.
- Activity creation and listing.
- Session creation and listing.
- Member booking and cancellation.
- Member booking overview.
- Organizer session and participant overview.
- Input validation.
- Automated backend tests.
- Local development and demonstration.

The following are deferred:

- Month-grid calendar.
- Color-coded availability.
- Editing activities.
- Organizer cancellation of entire sessions.
- Email notifications.
- Password reset.
- Administrator panel.
- Mobile application.
- Public deployment unless required for submission.

---

**Agreement:** This contract defines the expected communication between frontend and backend. Both developers should review and approve it before implementation depends on its details.