-- Analytics views built on Phase 1 tables

create or replace view vw_booking_no_show_rate as
select
  date_trunc('day', b.start_time) as booking_day,
  count(*) filter (where e.engagement_status = 'attended')::numeric / nullif(count(*), 0) as attendance_rate,
  count(*) filter (where e.engagement_status = 'no_show')::numeric / nullif(count(*), 0) as no_show_rate,
  count(*) as total_bookings
from bookings b
left join booking_engagements e on e.booking_id = b.id
where b.start_time >= now() - interval '90 days'
group by booking_day
order by booking_day desc;

create or replace view vw_reminder_effectiveness as
select
  channel,
  count(*) filter (where status = 'sent') as sent,
  count(*) filter (where status = 'error') as failed,
  count(*) as total,
  count(*) filter (where status = 'sent')::numeric / nullif(count(*), 0) as success_rate
from reminder_logs
where send_at >= now() - interval '90 days'
group by channel;

create or replace view vw_slot_utilization as
with slot_hours as (
  select
    date_trunc('hour', start_time) as slot,
    count(*) as bookings
  from bookings
  where start_time >= now() - interval '30 days'
  group by slot
)
select
  slot,
  bookings,
  extract(dow from slot) as weekday,
  extract(hour from slot) as hour
from slot_hours
order by slot desc;
