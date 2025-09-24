# Adriana Empowerment Journey – QA Readiness Snapshot (Next.js Migration)

## Executive Summary
**Status: Needs Verification** – O fluxo de booking roda via Next.js API + Supabase (`auth_tokens`, `bookings`). Precisamos validar notificações opcionais (Formspree) e executar um teste ponta-a-ponta usando o projeto Supabase + credenciais Google configurados na Vercel.

---

## Build & Automation
- ✅ `npm run build`
- ⚠️ `npm run test` – very limited coverage (utils only)
- ⚠️ Bundle size > 500 KB; same as previous assessment, consider chunking later.

## API & Data Layer
- ✅ Google OAuth, availability, and booking creation now live in `app/api/**` route handlers.
- ✅ Tokens e bookings persistem no Supabase (`supabase/migrations`, `@/db/client`).
- ✅ `/api/health` responde localmente.
- ⚠️ Requer projeto Supabase configurado + refresh token válido em Vercel antes do release.

## Frontend
- ✅ Booking wizard calls `/api/availability` and `/api/events/create` successfully.
- ✅ Next.js dev server (`npm run dev`) renders the full booking experience.
- ⚠️ Formspree email notification is optional; configure `NEXT_PUBLIC_FORMSPREE_ID` to enable, otherwise console warning appears.

## Environment Checklist
- `.env.local`
  - ✅ Google OAuth keys (`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REFRESH_TOKEN`, `GOOGLE_CALENDAR_ID`).
  - ✅ `SUPABASE_URL`
  - ✅ `SUPABASE_ANON_KEY`
  - ✅ `SUPABASE_SERVICE_ROLE_KEY`
  - ✅ `EDGE_CONFIG`
  - ✅ `NEXT_PUBLIC_API_BASE_URL`
  - ✅ `NEXT_PUBLIC_FORMSPREE_ID` (optional)
- Vercel: mirror the same keys for Production/Preview before deploying.

## Outstanding Work Before Production
1. Provisionar Supabase e aplicar as migrações em `supabase/migrations`.
2. Re-authorize Google OAuth in production to ensure refresh token is valid.
3. (Optional) Configure Formspree form ID and verify email notification.
4. Execute a smoke test on Vercel deployment:
   - `/api/health`
   - Google OAuth login/callback
   - Create booking; confirm calendar event + DB row.

## Monitoring & Ops Notes
- Add runtime logging/alerts once deployed (Vercel Analytics + Supabase logs/alerts).
- Manter arquivos SQL em `supabase/migrations` como fonte da verdade do schema.
- Rotate Google credentials periodically; tokens now live in Supabase.

---
**Next Step**: finish environment setup on Vercel, run the production smoke test, and document the results in this file.
