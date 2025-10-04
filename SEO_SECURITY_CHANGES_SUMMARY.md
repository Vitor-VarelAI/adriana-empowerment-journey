# SEO and Security Changes Summary (Next.js Migration)

## Security Updates
- ✅ `.gitignore` excludes `.env*`, `dist/`, `.next/`, and other sensitive artefacts.
- ✅ Google OAuth keys e tokens sensíveis continuam em variáveis de ambiente.
- ✅ Supabase foi removido; não há mais persistência de tokens na base de dados. O histórico fica no email enviado via Formspree.
- ✅ Removed the legacy `gcal-server/` Express backend; all Google Calendar calls run server-side inside Next.js API routes.
- ✅ Added shared config helpers (`src/lib/config.ts`) for resolving API and Formspree environment variables in Next.js (with backward-compatible support for legacy Vite env keys if ever needed).

### Outstanding Security Tasks
| Task | Status | Notes |
| --- | --- | --- |
| Google credential rotation | ⚠️ Pending | Rotate periodically and update `.env.local`/Vercel.
| Production monitoring | ⚠️ Pending | Enable Vercel analytics; sem Supabase para monitorizar nesta versão.
| Formspree validation | Optional | Configure `NEXT_PUBLIC_FORMSPREE_ID` if email notifications are required.

## SEO / Content Improvements
- ✅ Modern meta tags live in the marketing UI (shared components served by Next).
- ✅ OpenGraph/Twitter preview assets use local `/og-image.png`.
- ✅ Portuguese copy retained; booking wizard untouched.
- ⚠️ Consider running Lighthouse after deployment to track any regressions introduced by the Next migration.

## Files Touched in This Cleanup
- `src/lib/config.ts` – shared env resolution (`API_BASE_URL`, `FORMSPREE_FORM_ID`).
- `src/components/BookingTable.tsx` – Next-friendly Formspree configuration.
- `README.md`, `CLAUDE.md`, `DEPLOYMENT_PLAN.md`, `QA_REPORT.md` – documentation updates reflecting the Next.js backend sem Supabase.
- Removed `gcal-server/` legacy directory.

## Verification Checklist
- [ ] `.env.local` does **not** contain secrets you do not intend to deploy.
- [ ] (N/A) Supabase removido; nenhuma migração necessária.
- [ ] Google OAuth login/callback tested locally and on Vercel.
- [ ] Optional Formspree ID configured and verified if email alerts are desired.
- [ ] Lighthouse/SEO smoke test executed after the next deployment.

## Impact Assessment
- 🔐 **Security**: Eliminated the separate Express server and token JSON files; fluxo atual usa handlers Next.js + Formspree, sem armazenamento externo.
- 📈 **SEO**: No regressions expected—the UI and metadata are unchanged by the backend migration.

> Keep this document updated if additional security or SEO work is performed after the Next.js migration.
