# Deployment Readiness – Next.js Migration

## Summary
- ✅ Next.js App Router hosts both the marketing site and API routes (`app/api/**`).
- ✅ Persistência migrada para Supabase via `@supabase/supabase-js` (`auth_tokens`, `bookings`).
- ✅ Build succeeds: `npm run build`.
- ⚠️ Pending production verification on Vercel (env vars + smoke test).

## Environment Variables
```
SUPABASE_URL=https://...
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_API_BASE_URL=/api
NEXT_PUBLIC_FORMSPREE_ID=
ENCRYPTION_KEY=<>=32 chars>
HOST_TZ=Europe/Lisbon
```

## Pre-Deployment Checklist
- [ ] Projeto Supabase provisionado e migrações de `supabase/migrations` aplicadas.
- [ ] `.env.local` espelha os valores que serão adicionados à Vercel.
- [ ] Formspree configurado (opcional) e testado.

## Deployment Steps
1. Connect the repo to Vercel (root project).
2. Adicione todas as variáveis de ambiente (incluindo `SUPABASE_*` e `EDGE_CONFIG`) em Production & Preview.
3. Trigger deployment (push or manual). Default build command (`npm run build`) is already defined.
4. After deploy, run the smoke test:
   - `GET /api/health`
   - `GET /api/bookings?date=<futuro>`
   - Completar o formulário de agendamento; confirmar inserção na tabela `bookings` e email Formspree (se ativo).

## Post-Deployment
- Enable Vercel Analytics e monitore o painel do Supabase (queries/erros).
- Configure alerts/logging for API errors (optional: Sentry/Logflare).
- Document refresh-token rotation procedure.

## Outstanding Items
| Area | Status | Notes |
| --- | --- | --- |
| Formspree emails | Optional | Configure `NEXT_PUBLIC_FORMSPREE_ID` e testar notificações. |
| Bundle size | Warning | Production bundle >500 KB; planear code splitting posteriormente. |
| Automated tests | Minimal | Adicionar cobertura de integração quando o fluxo estabilizar. |

## Ready-To-Ship Verdict
**Conditionally Ready** – Once production env vars are populated and the smoke test passes on Vercel, the project can go live.
