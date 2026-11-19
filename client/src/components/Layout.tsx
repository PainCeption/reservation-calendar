import { Link, Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <>
      <header>
        <nav aria-label="Main">
          <Link to="/">Schedule</Link> <Link to="/my-bookings">My Bookings</Link>{" "}
          <Link to="/organizer">Organizer</Link> <Link to="/login">Log in</Link>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
}
