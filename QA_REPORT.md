# Adriana Empowerment Journey – QA Readiness Snapshot (Next.js Migration)

## Executive Summary
**Status: Needs Verification** – O fluxo de booking utiliza slots fixos e Supabase (`bookings`, `customer_profiles`). Falta validar notificações opcionais (Formspree) e executar um teste ponta-a-ponta no deploy Vercel.

---

## Build & Automation
- ✅ `npm run build`
- ⚠️ `npm run test` – very limited coverage (utils only)
- ⚠️ Bundle size > 500 KB; same as previous assessment, consider chunking later.

## API & Data Layer
- ✅ Endpoint `/api/bookings` fornece consulta e criação de marcações com Supabase.
- ✅ Dados persistem via `@/db/client` (service role) e migrações versionadas.
- ✅ `/api/health` responde localmente.
- ⚠️ Requer projeto Supabase configurado corretamente antes do release.

## Frontend
- ✅ Booking wizard consome `/api/bookings` (GET/POST) e apresenta horários bloqueados em tempo real.
- ✅ Next.js dev server (`npm run dev`) renderiza toda a experiência.
- ⚠️ Notificação por email (Formspree) é opcional; configure `NEXT_PUBLIC_FORMSPREE_ID` para habilitar.

## Environment Checklist
- `.env.local`
  - ✅ `SUPABASE_URL`
  - ✅ `SUPABASE_ANON_KEY`
  - ✅ `SUPABASE_SERVICE_ROLE_KEY`
  - ✅ `NEXT_PUBLIC_API_BASE_URL`
  - ✅ `NEXT_PUBLIC_FORMSPREE_ID` (opcional)
  - ✅ `ENCRYPTION_KEY`
- Vercel: mirror the same keys for Production/Preview before deploying.

## Outstanding Work Before Production
1. Provisionar Supabase e aplicar as migrações em `supabase/migrations` (inclui UNIQUE em `bookings`).
2. (Opcional) Configurar Formspree e verificar email de confirmação.
3. Executar smoke test no deploy Vercel:
   - `/api/health`
   - `GET /api/bookings?date=<futuro>`
   - Criar booking; confirmar registro na tabela `bookings` + email (se ativo).

## Monitoring & Ops Notes
- Add runtime logging/alerts once deployed (Vercel Analytics + Supabase logs/alerts).
- Manter arquivos SQL em `supabase/migrations` como fonte da verdade do schema.
-- Considerar rotinas de export/backup da tabela `bookings` e alertas no Supabase.

---
**Next Step**: finish environment setup on Vercel, run the production smoke test, and document the results in this file.
