# Build Checklist: Reservation Calendar

**Deadline:** 24 November 2026

> Use a feature branch for each piece of work. Review each other's pull requests and test the relevant browser flow together before merging.

---

## Thursday 19 November: Set up and connect accounts

- [ ] **Both:** Agree on the first release, login approach, timestamp format, API fields, and error codes. Write sample JSON so the frontend can start with mock data.
- [ ] **Backend:** Set up Flask, SQLite, the database schema, and demo accounts. Set up pytest with a temporary test database.
- [ ] **Backend:** Build registration, login, account lookup, and logout. Hash passwords and make public registration member-only. Test successful login and invalid credentials.
- [ ] **Frontend:** Sketch the schedule, My Bookings, and organizer screens. Set up shared styles and a Fetch helper. Build the registration and login forms, navigation, logout, and error messages.

> **Checkpoint:** Both developers can run the app locally. A member can register, sign in, and sign out in the browser. An organizer sees the organizer controls.

---

## Friday 20 November: Publish, book, and cancel

- [ ] **Backend:** Build activity and session creation and listing. Validate dates and capacity, and check that organizers can schedule sessions only for their own activities.
- [ ] **Frontend:** Build the activity and session forms. Connect the date-grouped schedule and show each session's time, location, and remaining spots.
- [ ] **Backend:** Build booking, My Bookings, and cancellation. Enforce capacity in the booking transaction, block duplicates, and check ownership before cancelling.
- [ ] **Frontend:** Connect Book and Cancel. Show upcoming bookings, disable buttons while requests are running, refresh availability after changes, and show a clear message if a session is full.

> **Checkpoint:** An organizer publishes a session. A member finds it, books it, and cancels it from My Bookings. The freed spot appears in the schedule.

---

## Monday 23 November: Finish the organizer view and test

- [ ] **Backend:** Add the organizer's session overview and participant list. Verify that one organizer cannot see another organizer's participants.
- [ ] **Frontend:** Show the organizer's sessions, booking counts, and participant names. Check keyboard navigation, narrow screens, and loading, empty, and error states.
- [ ] **Backend:** Test invalid dates and capacity, duplicate bookings, full sessions, and cancellation permission. Test two members competing for the last spot using separate database connections.
- [ ] **Both:** Prepare demo data and draft the README, API notes, database diagram, and test report. Record your individual contributions and save links to relevant pull requests.

> **Checkpoint:** Both roles work end to end, and the booking and permission tests pass.

---

## Tuesday 24 November: Verify, rehearse, and submit

- [ ] **Backend:** Follow the README from a fresh checkout, set up the demo database, and run pytest.
- [ ] **Frontend:** Retest both roles in the fresh setup. Check that availability updates and errors are clear in the browser.
- [ ] **Both:** Rehearse the one-spot demo:
  1. Member A books the spot.
  2. Member B is told the session is full.
  3. A cancels.
  4. B books.
  5. The organizer sees B in the participant list.
- [ ] **Both:** Fix any issues that block the demo, finish the documentation and self-evaluations, and submit the project and portfolio materials.

---

## If time runs short

If Friday's booking flow is unfinished, make it Monday's first task. Leave the month grid, fill colors, organizer slot cancellation, and visual polish for later.
