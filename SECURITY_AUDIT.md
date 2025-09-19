# Security Audit Report

**Date:** 2025-08-16

---

## 1. Unprotected Admin API Endpoints

*   **Status:** Secure
*   **Evidence:** Google Calendar integration, availability, and booking creation now run server-side inside Next.js route handlers (`app/api/**`). These endpoints simply proxy authenticated Google actions and persist data to Postgres; there is no separate “admin” surface exposed to the browser.
*   **Recommended Mitigation:** N/A

---

## 2. Leaked Admin Logic in the Client

*   **Status:** Secure
*   **Evidence:** A thorough search for keywords such as `admin`, `role`, and `isAdmin` did not reveal any administrative logic in the client-side code. The occurrences of the word `role` are related to ARIA attributes for accessibility, which is a recommended practice.
*   **Recommended Mitigation:** N/A

---

## 3. Users Accessing Others' Resources

*   **Status:** Secure
*   **Evidence:** Bookings and OAuth tokens are persisted in Postgres via server-side Drizzle ORM calls. The client only sees per-browser `localStorage` caches for UX purposes; all authoritative data stays behind the Next.js API. There is no multi-user dashboard that would expose other users’ data.
*   **Recommended Mitigation:** N/A. If future features expose booking history to end users, enforce per-user scoping in SQL queries.

---

## 4. Leaked Secrets in Frontend

*   **Status:** Mitigated
*   **Evidence:** Formspree configuration is now resolved via `src/lib/config.ts`, which reads `NEXT_PUBLIC_FORMSPREE_ID` (Next.js) or `VITE_FORMSPREE_ID` (legacy dev server) from environment variables. No IDs are hardcoded in the bundle.
*   **Mitigation Implemented:** Ensure `.env.local` remains gitignored (already in place) and populate the Formspree ID only in environment files.

---

## 5. Users Updating Protected Properties

*   **Status:** Secure
*   **Evidence:** The application does not have user data or protected properties (such as `isAdmin`). The form only submits the information necessary for booking through Formspree. There is no way for a user to modify their "access level" or other protected fields.
*   **Recommended Mitigation:** N/A

---

## 6. Exposed Sitemaps/Endpoint Lists

*   **Status:** Secure
*   **Evidence:** A search for `sitemap.xml` and `robots.txt` found no files. The application does not expose a list of routes or endpoints.
*   **Recommended Mitigation:** N/A

---

## 7. Improper Row-Level Security (RLS)

*   **Status:** Secure (Current Scope)
*   **Evidence:** Postgres is accessed exclusively through server-side code; no direct public access is exposed. RLS is not required because the API does not accept user-authenticated queries—only trusted server logic writes records.
*   **Recommended Mitigation:** If the API evolves to expose read endpoints per user, introduce RLS policies or equivalent application-level checks.

---

## 8. Returning Unnecessary Data

*   **Status:** Secure
*   **Evidence:** Next.js API responses return only availability arrays or simple confirmation payloads. No sensitive tokens or database rows are exposed to the browser.
*   **Recommended Mitigation:** Continue to keep responses minimal; avoid echoing stored OAuth tokens.

---

## 9. Use of Incremented IDs

*   **Status:** Secure
*   **Evidence:** The services in the [`src/components/BookingTable.tsx`](src/components/BookingTable.tsx) component use sequential numeric IDs (1, 2, 3). However, these IDs are only used on the client-side to manage the selection state and are not exposed in the URL or used to access resources. The application's routes, defined in [`src/App.tsx`](src/App.tsx), are static and do not include dynamic parameters.
*   **Recommended Mitigation:** N/A. If the IDs were used in URLs (e.g., `/services/1`), it would be recommended to replace them with UUIDs to prevent resource enumeration.

---

## 10. Vulnerability to Google Dorks

*   **Status:** Mitigated
*   **Evidence:** A search for potentially sensitive files found the `.env` file and a Codacy log file.
*   **Mitigation Implemented:** The `.env` file and the `.codacy` directory have been added to the `.gitignore` file to ensure they are not included in the repository.
