// Fetch helper for the JSON API. Not implemented yet.
// TODO: base URL (VITE_API_BASE), credentials: "include", CSRF header on writes,
// and parsing the consistent error format into typed errors.

export const API_BASE = import.meta.env.VITE_API_BASE ?? "/api";
