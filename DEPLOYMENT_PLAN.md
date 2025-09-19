# Vercel Deployment Plan

## Project Overview
- **Frontend**: Next.js App Router serving the marketing and booking UI (reusing shared components under `src/`).
- **API layer**: Next.js route handlers in `app/api/**` handling Google OAuth, availability checks, and booking creation.
- **Data**: Drizzle ORM targeting Vercel Postgres / Neon for OAuth tokens and booking records.
- **Notifications**: Optional Formspree submission triggered from the booking wizard when `NEXT_PUBLIC_FORMSPREE_ID` is configured.

## Deployment Strategy
| Area | Action |
| --- | --- |
| Hosting | Deploy the root project to Vercel. Next.js will build both the app router pages and API routes. |
| Database | Provision Vercel Postgres (or Neon) and store the connection string as `POSTGRES_URL` in Vercel. |
| OAuth | Configure Google OAuth consent screen + credentials and copy the secrets to Vercel. |
| Env propagation | Mirror the `.env.local` keys (Google, Postgres, Formspree) into Vercel Production and Preview environments. |
| Monitoring | Enable Vercel analytics and database monitoring once production is live. |

## Environment Variables
```
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REFRESH_TOKEN=
GOOGLE_CALENDAR_ID=
GOOGLE_REDIRECT_URI=https://<domain>/auth/google/callback
ADMIN_EMAIL=
HOST_TZ=Europe/London
WORKING_DAYS=MON-FRI
WORKING_HOURS=09:00-17:00
BOOKING_SLOT_MINUTES=30

POSTGRES_URL=postgresql://...
NEXT_PUBLIC_API_BASE_URL=/api
NEXT_PUBLIC_FORMSPREE_ID=              # optional Formspree form id
```

## Deployment Checklist
- [ ] `npm install` succeeds locally (ensures lockfiles are current).
- [ ] `npm run db:push` applied to your Postgres instance.
- [ ] `npm run build` passes.
- [ ] `.env.local` contains the same values you will configure in Vercel.
- [ ] Google OAuth credentials list both the local (`http://localhost:3000/auth/google/callback`) and production redirect URIs.

## Deploying to Vercel
1. **Create/Connect project**: Point Vercel at this repository and select the root directory.
2. **Configure Environment Variables**: Add all keys above for Production and Preview. Copy/paste from `.env.local`.
3. **Database**: Provision Vercel Postgres (or connect an existing Neon DB) and set `POSTGRES_URL` to the direct connection string (`sslmode=require`).
4. **Trigger build**: Push to the deployment branch (or click “Deploy”). The default build command `npm run build` works out of the box.
5. **Post-deploy verification**:
   - Visit `/api/health` to check the API route is live.
   - Hit `/api/auth/login` to ensure OAuth redirects correctly.
   - Complete a booking in production and verify the Google Calendar event plus a `SELECT * FROM bookings` entry.

## Local Testing Workflow
| Step | Command |
| --- | --- |
| Next API + UI | `npm run dev` |
| Database sync | `npm run db:push` |

## Security Notes
- Keep `.env.local` out of version control (already gitignored).
- Google refresh tokens are stored in Postgres; no token data is persisted in the browser.
- Formspree submission is optional; without `NEXT_PUBLIC_FORMSPREE_ID` the booking flow still completes.

## Rollback Plan
- Revert to the previous Git commit and redeploy.
- Restore any environment variable changes in Vercel.
- If the database schema changed, roll back via Drizzle migration or restore from backup.

## Maintenance
- Schedule regular dependency updates (especially Next.js, Drizzle, and Google API clients).
- Monitor Vercel analytics and Postgres metrics.
- Rotate Google OAuth credentials periodically and update the stored `GOOGLE_REFRESH_TOKEN` if revoked.
