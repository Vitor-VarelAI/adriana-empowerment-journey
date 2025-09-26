# Reminder Processing Workflow (Draft)

This document captures the Phase 1 automation flow we will implement for reminders and attendance tracking. It assumes the tables added in `20251001_phase1_personalization.sql` and the payload changes introduced in `app/api/events/create/route.ts`.

## Goals

1. Deliver scheduled reminders (email/SMS) ahead of each booking.
2. Track delivery outcomes and update `reminder_logs.status`, `reminder_logs.sent_at`, and `bookings.last_reminder_at`.
3. Feed reminder/attendance signals into `booking_engagements` for later analytics (no-show, follow-up, etc.).

## Components

- **reminder_logs**: seeded during booking creation. Contains `send_at`, channel, and metadata.
- **bookings.last_reminder_at**: updated whenever the most recent reminder is sent.
- **booking_engagements**: one row per booking; reminder processing will flip `engagement_status` from `pending` to `reminded` (and later `attended`/`no_show`).
- **Supabase cron job** (or external worker): runs every 5 minutes to process pending reminders.

## Proposed Job Steps

1. Query `reminder_logs` where `status = 'pending'` and `send_at <= now()`.
2. For each row:
   - Send the reminder via the appropriate channel (initial scope: email via existing Formspree or future provider).
   - Update the row with `status = 'sent'` (or `status = 'error'` + `error_message`) and `sent_at = now()`.
   - Set `bookings.last_reminder_at` to `greatest(current_value, sent_at)`.
   - Optionally update `booking_engagements.engagement_status` to `reminded` for the parent booking.
3. On failures, leave `status = 'error'` and include the provider response for future retries. A follow-up job can retry errors.

## Implementation Options

- **Supabase Edge Function** triggered by cron:
  - Write an Edge Function `process-reminders` that encapsulates the logic above.
  - Schedule it with Supabase Cron (`supabase functions schedule create`).
- **Next.js API route** invoked by a scheduler (e.g., Vercel Cron):
  - Expose `app/api/reminders/run/route.ts` that performs the same logic.
  - Register it with Vercel scheduled tasks.
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

1. Decide on the scheduler (Supabase Edge Function vs Vercel Cron).
2. Implement the worker logic reusing the helper patterns in `app/api/events/create/route.ts`.
3. Extend `booking_engagements` to capture the reminder lifecycle (`reminded_at`, `attended_at`).
4. Add automated tests/integration checks when the reminder loop is finished.

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

- Booking creation now persists customer profiles, reminder plans, and engagement rows.
- Reminder runner (`/api/reminders/run`) emails clients via Formspree and updates `last_reminder_at` / engagement status.
- Analytics API (`/api/admin/analytics/overview`) returns data from the new Supabase views.
- Frontend booking flow fetches customer profiles and sends preference snapshots in the payload.
- Admin dashboard placeholder consumes the analytics endpoint; needs styling + auth hardening before launch.

