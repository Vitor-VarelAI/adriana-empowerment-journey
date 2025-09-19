# Adriana Empowerment Journey

Modern booking experience with Google Calendar integration, built on Next.js, Tailwind CSS, shadcn/ui, and Drizzle ORM.

## Prerequisites

- Node.js ≥ 18 (project runs on Next 14). Check with `node -v`.
- npm (comes with the repo's `package-lock.json`).
- Optional: Vercel CLI for deployments.
- Required: Google Cloud project with OAuth credentials & Calendar API enabled.
- Required: Postgres database (Vercel Postgres / Neon recommended).

## Getting started locally

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Create `.env.local` in project root** (start from `.env.example`)
   ```bash
   GOOGLE_CLIENT_ID=...
   GOOGLE_CLIENT_SECRET=...
   GOOGLE_CALENDAR_ID=...
   GOOGLE_REDIRECT_URI=http://localhost:3000/auth/google/callback
   HOST_TZ=Europe/London
   WORKING_DAYS=MON-FRI
   WORKING_HOURS=09:00-17:00
   BOOKING_SLOT_MINUTES=30
   ADMIN_EMAIL=you@example.com
   POSTGRES_URL=postgres://user:password@host/db?sslmode=require
   NEXT_PUBLIC_API_BASE_URL=/api
   NEXT_PUBLIC_FORMSPREE_ID=
   ```
   - `ADMIN_EMAIL` must match the Google account owning the target calendar.
   - `POSTGRES_URL` should point to your Neon / Vercel Postgres instance.
   - `GOOGLE_REDIRECT_URI` must also be registered in Google Cloud OAuth client settings.
   - `NEXT_PUBLIC_FORMSPREE_ID` (optional) enables Formspree notifications after a booking is created.

3. **Sync database schema**
   ```bash
   npm run db:push
   ```
   Creates `oauth_tokens` and `bookings` tables via Drizzle.

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Build & start for production**
   ```bash
   npm run build
   npm run start
   ```

## Google OAuth setup

1. In Google Cloud Console → APIs & Services → Credentials → OAuth Client:
   - Authorized redirect URIs (local): `http://localhost:3000/auth/google/callback`
   - Production redirect (Vercel): `https://<your-domain>/auth/google/callback`
   - Authorized JavaScript origins: include `http://localhost:3000`.

2. Enable Google Calendar API for the project.

3. Use `/api/auth/login` to complete consent, then `/auth/google/callback` will display a refresh token (store it in `GOOGLE_REFRESH_TOKEN` for production).

## Database schema

- `oauth_tokens`: stores Google OAuth credentials per admin email.
- `bookings`: captures booking metadata synced to Google Calendar.

Manage schema changes with Drizzle:
```bash
npm run db:generate   # generate migrations
npm run db:push       # push schema to database
```

## Deployment (Vercel)

1. Ensure the repo is connected to a Vercel project.
2. Add env vars in Vercel → Project Settings → Environment Variables:
   - Same keys as `.env.local` for each environment (Preview/Production).
3. Provision Vercel Postgres (Neon). Copy the Direct URL as `POSTGRES_URL`.
4. Push your branch or merge into the deploy target (e.g., `main`).
5. Vercel builds the Next.js app; API routes run serverless on Vercel.

## Testing the booking flow

1. Start the dev server (`npm run dev`).
2. Visit `http://localhost:3000`.
3. Trigger OAuth via `/api/auth/login`; authorize the Google account.
4. Use the booking form to create a reservation. Confirm:
   - Google Calendar event is created.
   - `bookings` table receives the new entry.

## Project structure overview

```
app/               # Next.js App Router (pages + API routes)
  api/             # Route handlers for Google OAuth + booking
  providers.tsx    # Global providers (React Query, Booking context, navigation)
  page.tsx         # Landing page (reuses shared components)
src/               # Shared React components/contexts used by the Next app
  components/
  pages/
  contexts/
  db/              # Drizzle schema + client
  lib/config.ts    # Shared env helpers (API base URL, Formspree ID)
```

## Common commands

| Command             | Description                             |
|--------------------|-----------------------------------------|
| `npm run dev`      | Next.js dev server (App Router + API)    |
| `npm run build`    | Production build for Next.js              |
| `npm run start`    | Run the production build locally          |
| `npm run db:push`  | Sync schema to Postgres via Drizzle       |

## Troubleshooting

- **OAuth redirect mismatch**: make sure Google Cloud authorized redirect URIs include `/auth/google/callback` and env vars are set.
- **Missing tokens**: after authorizing, ensure the refresh token is stored in env or persisted in DB.
- **Database connection errors**: confirm `POSTGRES_URL` is reachable; Neon/Vercel requires `sslmode=require`.
- **Double booking submissions**: front-end disables repeat submissions; check console logs for validation errors.

## Security notes

- Never commit `.env.local` (already gitignored).
- Store Google refresh tokens securely (Vercel environment variables, not in repo).
- Review rate limits and quota usage for Google APIs; consider exponential backoff if scaling.

---

Questions or improvements? Open an issue or reach out to the project maintainers.
