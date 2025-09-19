# Adriana Empowerment Journey – QA Readiness Snapshot (Next.js Migration)

## Executive Summary
**Status: Needs Verification** – The booking flow now runs fully through Next.js API routes with Drizzle Postgres storage and passes local build checks. Before production we still need to validate Formspree notifications (optional) and run an end-to-end test against the hosted Postgres + Google credentials configured in Vercel.

---

## Build & Automation
- ✅ `npm run build`
- ⚠️ `npm run test` – very limited coverage (utils only)
- ⚠️ Bundle size > 500 KB; same as previous assessment, consider chunking later.

## API & Data Layer
- ✅ Google OAuth, availability, and booking creation now live in `app/api/**` route handlers.
- ✅ Tokens and bookings persist via Drizzle ORM (`src/db/*`).
- ✅ `/api/health` responds locally.
- ⚠️ Requires live Postgres URL + refreshed Google credentials in Vercel before release.

## Frontend
- ✅ Booking wizard calls `/api/availability` and `/api/events/create` successfully.
- ✅ Next.js dev server (`npm run dev`) renders the full booking experience.
- ⚠️ Formspree email notification is optional; configure `NEXT_PUBLIC_FORMSPREE_ID` to enable, otherwise console warning appears.

## Environment Checklist
- `.env.local`
  - ✅ Google OAuth keys (`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REFRESH_TOKEN`, `GOOGLE_CALENDAR_ID`).
  - ✅ `POSTGRES_URL`
  - ✅ `NEXT_PUBLIC_API_BASE_URL`
  - ✅ `NEXT_PUBLIC_FORMSPREE_ID` (optional)
- Vercel: mirror the same keys for Production/Preview before deploying.

## Outstanding Work Before Production
1. Provision Vercel Postgres (or Neon) and run `npm run db:push` against it.
2. Re-authorize Google OAuth in production to ensure refresh token is valid.
3. (Optional) Configure Formspree form ID and verify email notification.
4. Execute a smoke test on Vercel deployment:
   - `/api/health`
   - Google OAuth login/callback
   - Create booking; confirm calendar event + DB row.

## Monitoring & Ops Notes
- Add runtime logging/alerts once deployed (Vercel Analytics, Postgres metrics).
- Keep the Drizzle schema in sync; future changes should be versioned.
- Rotate Google credentials periodically; tokens now live in Postgres.

---
**Next Step**: finish environment setup on Vercel, run the production smoke test, and document the results in this file.
