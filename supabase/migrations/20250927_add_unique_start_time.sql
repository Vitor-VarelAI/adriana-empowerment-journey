ALTER TABLE bookings
    ADD CONSTRAINT bookings_start_time_unique UNIQUE (start_time);
