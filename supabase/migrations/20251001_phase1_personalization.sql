-- Phase 1 personalization scaffolding

-- Reuse timestamp trigger helper (idempotent)
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Customer profiles capture personalization preferences
CREATE TABLE IF NOT EXISTS customer_profiles (
    customer_email TEXT PRIMARY KEY,
    preferred_session_types TEXT[] DEFAULT '{}',
    preferred_days TEXT[] DEFAULT '{}',
    preferred_time_ranges JSONB DEFAULT '[]'::jsonb,
    last_attended_at TIMESTAMPTZ,
    reminder_opt_in BOOLEAN NOT NULL DEFAULT TRUE,
    locale TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_timestamp_customer_profiles
    BEFORE UPDATE ON customer_profiles
    FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

CREATE INDEX IF NOT EXISTS idx_customer_profiles_last_attended
    ON customer_profiles(last_attended_at DESC NULLS LAST);

ALTER TABLE customer_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "service role can manage customer profiles" ON customer_profiles;
CREATE POLICY "service role can manage customer profiles" ON customer_profiles
    USING (auth.role() = 'service_role')
    WITH CHECK (auth.role() = 'service_role');

DROP POLICY IF EXISTS "customers can manage their profile" ON customer_profiles;
CREATE POLICY "customers can manage their profile" ON customer_profiles
    FOR ALL USING (
        auth.role() = 'authenticated' AND auth.email() = customer_email
    ) WITH CHECK (
        auth.role() = 'authenticated' AND auth.email() = customer_email
    );

-- Booking engagement outcomes (attendance, follow-up)
CREATE TABLE IF NOT EXISTS booking_engagements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    engagement_status TEXT NOT NULL DEFAULT 'pending',
    attended_at TIMESTAMPTZ,
    no_show_reason TEXT,
    follow_up_required BOOLEAN NOT NULL DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_booking_engagements_booking_id
    ON booking_engagements(booking_id);

CREATE INDEX IF NOT EXISTS idx_booking_engagements_status
    ON booking_engagements(engagement_status);

CREATE TRIGGER set_timestamp_booking_engagements
    BEFORE UPDATE ON booking_engagements
    FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

ALTER TABLE booking_engagements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "service role can manage booking engagements" ON booking_engagements;
CREATE POLICY "service role can manage booking engagements" ON booking_engagements
    USING (auth.role() = 'service_role')
    WITH CHECK (auth.role() = 'service_role');

DROP POLICY IF EXISTS "customers can view their booking engagements" ON booking_engagements;
CREATE POLICY "customers can view their booking engagements" ON booking_engagements
    FOR SELECT USING (
        auth.role() = 'authenticated' AND auth.email() IN (
            SELECT customer_email FROM bookings WHERE id = booking_id
        )
    );

-- Reminder delivery audit trail
CREATE TABLE IF NOT EXISTS reminder_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    channel TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    send_at TIMESTAMPTZ NOT NULL,
    sent_at TIMESTAMPTZ,
    error_message TEXT,
    delivery_metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reminder_logs_booking_channel
    ON reminder_logs(booking_id, channel);

CREATE INDEX IF NOT EXISTS idx_reminder_logs_status
    ON reminder_logs(status, send_at);

ALTER TABLE reminder_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "service role can manage reminder logs" ON reminder_logs;
CREATE POLICY "service role can manage reminder logs" ON reminder_logs
    USING (auth.role() = 'service_role')
    WITH CHECK (auth.role() = 'service_role');

DROP POLICY IF EXISTS "customers can view their reminder logs" ON reminder_logs;
CREATE POLICY "customers can view their reminder logs" ON reminder_logs
    FOR SELECT USING (
        auth.role() = 'authenticated' AND auth.email() IN (
            SELECT customer_email FROM bookings WHERE id = booking_id
        )
    );

-- Extend bookings with personalization snapshot + reminder tracking
ALTER TABLE bookings
    ADD COLUMN IF NOT EXISTS preference_snapshot JSONB NOT NULL DEFAULT '{}'::jsonb,
    ADD COLUMN IF NOT EXISTS last_reminder_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_bookings_last_reminder
    ON bookings(last_reminder_at);
