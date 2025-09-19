# SEO and Security Changes Summary (Next.js Migration)

## Security Updates
- ✅ `.gitignore` excludes `.env*`, `dist/`, `.next/`, and other sensitive artefacts.
- ✅ Google OAuth keys, refresh tokens, and Postgres credentials live in environment variables (`.env.local` locally, Vercel env in production).
- ✅ OAuth tokens are stored in Postgres via Drizzle (`oauth_tokens` table) – no secrets left in the repository.
- ✅ Removed the legacy `gcal-server/` Express backend; all Google Calendar calls run server-side inside Next.js API routes.
- ✅ Added shared config helpers (`src/lib/config.ts`) for resolving API and Formspree environment variables in Next.js (with backward-compatible support for legacy Vite env keys if ever needed).

### Outstanding Security Tasks
| Task | Status | Notes |
| --- | --- | --- |
| Google credential rotation | ⚠️ Pending | Rotate periodically and update `.env.local`/Vercel.
| Production monitoring | ⚠️ Pending | Enable Vercel analytics & Postgres monitoring before launch.
| Formspree validation | Optional | Configure `NEXT_PUBLIC_FORMSPREE_ID` if email notifications are required.

## SEO / Content Improvements
- ✅ Modern meta tags live in the marketing UI (shared components served by Next).
- ✅ OpenGraph/Twitter preview assets use local `/og-image.png`.
- ✅ Portuguese copy retained; booking wizard untouched.
- ⚠️ Consider running Lighthouse after deployment to track any regressions introduced by the Next migration.

## Files Touched in This Cleanup
- `src/lib/config.ts` – shared env resolution (`API_BASE_URL`, `FORMSPREE_FORM_ID`).
- `src/components/BookingTable.tsx` – Next-friendly Formspree configuration.
- `README.md`, `CLAUDE.md`, `DEPLOYMENT_PLAN.md`, `QA_REPORT.md` – documentation updates reflecting the Next.js backend.
- Removed `gcal-server/` legacy directory.

## Verification Checklist
- [ ] `.env.local` does **not** contain secrets you do not intend to deploy.
- [ ] Drizzle tables (`oauth_tokens`, `bookings`) exist in Postgres (`npm run db:push`).
- [ ] Google OAuth login/callback tested locally and on Vercel.
- [ ] Optional Formspree ID configured and verified if email alerts are desired.
- [ ] Lighthouse/SEO smoke test executed after the next deployment.

## Impact Assessment
- 🔐 **Security**: Eliminated the separate Express server and token JSON files; everything now flows through secured Next.js handlers backed by Postgres.
- 📈 **SEO**: No regressions expected—the UI and metadata are unchanged by the backend migration.

> Keep this document updated if additional security or SEO work is performed after the Next.js migration.
