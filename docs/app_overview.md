# Project Overview


## Recent Phase 1 Enhancements

- Added Supabase schema for customer profiles, reminder logs, and booking engagements.
- Booking API now upserts profiles, queues reminders, and seeds engagement entries.
- Frontend pulls profile data to personalize booking and posts reminder plans.
- Reminder runner sends real emails via Formspree and updates Supabase tables.
- Admin analytics endpoint/views expose no-show and reminder metrics for upcoming dashboards.

