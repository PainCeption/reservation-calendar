import { createBrowserRouter } from "react-router-dom";

import Layout from "./components/Layout";
import LoginPage from "./pages/LoginPage";
import MyBookingsPage from "./pages/MyBookingsPage";
import NotFoundPage from "./pages/NotFoundPage";
import RegisterPage from "./pages/RegisterPage";
import SchedulePage from "./pages/SchedulePage";
import OrganizerPage from "./pages/organizer/OrganizerPage";

// TODO: protect /my-bookings and /organizer (login / role checks).
export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <SchedulePage /> },
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
      { path: "my-bookings", element: <MyBookingsPage /> },
      { path: "organizer", element: <OrganizerPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
