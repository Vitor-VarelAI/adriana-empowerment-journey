# Deployment Readiness – Next.js Migration

## Summary
- ✅ Next.js App Router hosts both the marketing site and API routes (`app/api/**`).
- ✅ Persistência migrada para Supabase via `@supabase/supabase-js` (`auth_tokens`, `bookings`).
- ✅ Build succeeds: `npm run build`.
- ⚠️ Pending production verification on Vercel (env vars + smoke test).

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
SUPABASE_URL=https://...
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
EDGE_CONFIG=https://edge-config.vercel.com/ecv_...
NEXT_PUBLIC_API_BASE_URL=/api
NEXT_PUBLIC_FORMSPREE_ID=
```

## Pre-Deployment Checklist
- [ ] Projeto Supabase provisionado e migrações de `supabase/migrations` aplicadas.
- [ ] Google OAuth redirect URI added for production domain.
- [ ] `.env.local` mirrors the values you will add to Vercel.
- [ ] Google refresh token verified after re-authorizing with production credentials.

## Deployment Steps
1. Connect the repo to Vercel (root project).
2. Adicione todas as variáveis de ambiente (incluindo `SUPABASE_*` e `EDGE_CONFIG`) em Production & Preview.
3. Trigger deployment (push or manual). Default build command (`npm run build`) is already defined.
4. After deploy, run the smoke test:
   - `GET /api/health`
   - `/api/auth/login` OAuth round trip
   - POST `/api/availability` (future date)
   - Complete booking form; confirm Google Calendar event + DB row.

## Post-Deployment
- Enable Vercel Analytics e monitore o painel do Supabase (queries/erros).
- Configure alerts/logging for API errors (optional: Sentry/Logflare).
- Document refresh-token rotation procedure.

## Outstanding Items
| Area | Status | Notes |
| --- | --- | --- |
| Formspree emails | Optional | Configure `NEXT_PUBLIC_FORMSPREE_ID` and test if notifications are required. |
| Bundle size | Warning | Production bundle >500 KB; plan code splitting later. |
| Automated tests | Minimal | Add integration coverage as features stabilize. |

## Ready-To-Ship Verdict
**Conditionally Ready** – Once production env vars are populated and the smoke test passes on Vercel, the project can go live.
