# Reminder Processing Workflow (Draft)

> **Nota**: O armazenamento Supabase foi removido. O conteúdo abaixo fica como referência caso o projeto volte a ter uma base de dados persistente. As rotas atuais (`/api/reminders/run`, `/api/admin/analytics/overview`) respondem `501` indicando que a automação está desativada.

This document captura o fluxo de automação (Phase 1) para lembretes e acompanhamento proposto quando existia persistência via Supabase.

## Goals

1. Deliver scheduled reminders (email/SMS) ahead of each booking.
2. Track delivery outcomes and update `reminder_logs.status`, `reminder_logs.sent_at`, and `bookings.last_reminder_at`.
3. Feed reminder/attendance signals into `booking_engagements` for later analytics (no-show, follow-up, etc.).

## Components

- **reminder_logs**: seeded during booking creation. Contains `send_at`, channel, and metadata.
- **bookings.last_reminder_at**: updated whenever the most recent reminder is sent.
- **booking_engagements**: one row per booking; reminder processing will flip `engagement_status` from `pending` to `reminded` (and later `attended`/`no_show`).
- **Job agendado** (Supabase Cron, Vercel Cron ou worker externo): corria a cada 5 minutos para processar lembretes pendentes.

## Proposed Job Steps

1. Query `reminder_logs` where `status = 'pending'` and `send_at <= now()`.
2. For each row:
   - Send the reminder via the appropriate channel (initial scope: email via existing Formspree or future provider).
   - Update the row with `status = 'sent'` (or `status = 'error'` + `error_message`) and `sent_at = now()`.
   - Set `bookings.last_reminder_at` to `greatest(current_value, sent_at)`.
   - Optionally update `booking_engagements.engagement_status` to `reminded` for the parent booking.
3. On failures, leave `status = 'error'` and include the provider response for future retries. A follow-up job can retry errors.

## Implementation Options

- **Edge Function/worker** (Supabase Edge, Vercel Cron, GitHub Actions, etc.): executa o algoritmo descrito acima.
- **API route em Next.js** (quando existir persistência): `app/api/reminders/run/route.ts` pode ser reativada para correr o mesmo código mediante agendamento externo.
- **External worker** (if more control is needed) running `node scripts/process-reminders.ts` on a separate host.

## Data Contracts

The booking payload already sends `reminderPlan` as:

```ts
[{ channel: 'email', offsetMinutes: number }]
```

The worker should support:

- `channel = 'email'`: use current email template. Later we can add SMS using Twilio, etc.
- Custom `delivery_metadata` in the insert (e.g., message template or link IDs) if needed.

## Next Steps

1. Definir um backend persistente (Supabase, Postgres gerido, etc.) caso a automação volte a ser prioridade.
2. Reintroduzir o schema necessário (reminder logs, engagements) e helpers correspondentes.
3. Reativar o worker/cron e garantir que as rotas protegidas voltam a devolver dados reais.
4. Cobrir o fluxo com testes e observabilidade antes de ligar a automação em produção.

This document will evolve as we implement the worker and tie it into analytics dashboards.

## Scheduled Runner Setup (Draft)

- Deploy `app/api/reminders/run` as a Vercel scheduled function or Supabase Edge Function.
- Configure secret headers:
  - `REMINDER_RUN_SECRET` (used by the run endpoint).
  - `ADMIN_ANALYTICS_SECRET` (protects the analytics API).
- Example Vercel cron entry:

```
{ "path": "/api/reminders/run", "schedule": "*/5 * * * *" }
```

- Ensure environment variables are set in Vercel/Supabase to allow the CLI worker to authenticate.
- Environment variables used by the runner:
  - `REMINDER_RUN_SECRET` — protects the scheduler endpoint.
  - `FORMSPREE_FORM_ID` — reused to deliver email reminders via Formspree.
  - `REMINDER_FROM_EMAIL` (optional) — sender shown in emails; falls back to `FROM_EMAIL` when available.

## Current Status

- Booking creation (sem Supabase) mantém apenas um registo em memória durante a execução do servidor.
- `/api/reminders/run` devolve `501` até existir nova infraestrutura persistente.
- `/api/admin/analytics/overview` também devolve `501` enquanto a camada de dados estiver desativada.
- O frontend continua a enviar preferências no payload para manter compatibilidade futura.
