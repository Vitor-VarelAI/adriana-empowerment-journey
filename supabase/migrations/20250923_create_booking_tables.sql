-- Tabelas de agendamento de sessões

-- Tabela de slots disponíveis
CREATE TABLE coaching_slots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    coach_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    status VARCHAR(50) DEFAULT 'available' CHECK (status IN ('available', 'booked', 'cancelled', 'blocked')),
    location_type VARCHAR(50) DEFAULT 'online' CHECK (location_type IN ('online', 'presencial', 'hybrid')),
    location_details TEXT,
    max_participants INTEGER DEFAULT 1,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de bookings/reservas
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slot_id UUID NOT NULL REFERENCES coaching_slots(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    coach_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'completed', 'no_show')),
    session_type VARCHAR(50) DEFAULT 'individual' CHECK (session_type IN ('individual', 'group', 'package')),
    client_notes TEXT,
    coach_notes TEXT,
    session_link TEXT,
    google_calendar_event_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para melhor performance
CREATE INDEX idx_coaching_slots_coach_id ON coaching_slots(coach_id);
CREATE INDEX idx_coaching_slots_start_time ON coaching_slots(start_time);
CREATE INDEX idx_coaching_slots_status ON coaching_slots(status);
CREATE INDEX idx_bookings_slot_id ON bookings(slot_id);
CREATE INDEX idx_bookings_client_id ON bookings(client_id);
CREATE INDEX idx_bookings_coach_id ON bookings(coach_id);
CREATE INDEX idx_bookings_status ON bookings(status);

-- Triggers para updated_at
CREATE TRIGGER set_timestamp_coaching_slots
    BEFORE UPDATE ON coaching_slots
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_bookings
    BEFORE UPDATE ON bookings
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_timestamp();

-- Constraints
ALTER TABLE coaching_slots ADD CONSTRAINT chk_time_order
    CHECK (start_time < end_time);

-- Habilitar RLS
ALTER TABLE coaching_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança para tabelas de agendamento

-- Políticas para coaching_slots
DROP POLICY IF EXISTS "Users can read available slots" ON coaching_slots;
CREATE POLICY "Users can read available slots" ON coaching_slots
    FOR SELECT USING (status = 'available');

DROP POLICY IF EXISTS "Coaches can manage their slots" ON coaching_slots;
CREATE POLICY "Coaches can manage their slots" ON coaching_slots
    FOR ALL USING (auth.uid()::text = coach_id::text);

-- Políticas para bookings
DROP POLICY IF EXISTS "Clients can read their own bookings" ON bookings;
CREATE POLICY "Clients can read their own bookings" ON bookings
    FOR SELECT USING (auth.uid()::text = client_id::text);

DROP POLICY IF EXISTS "Coaches can read their bookings" ON bookings;
CREATE POLICY "Coaches can read their bookings" ON bookings
    FOR SELECT USING (auth.uid()::text = coach_id::text);

DROP POLICY IF EXISTS "Clients can create bookings" ON bookings;
CREATE POLICY "Clients can create bookings" ON bookings
    FOR INSERT WITH CHECK (auth.uid()::text = client_id::text);

DROP POLICY IF EXISTS "Users can update their bookings" ON bookings;
CREATE POLICY "Users can update their bookings" ON bookings
    FOR UPDATE USING (
        auth.uid()::text = client_id::text OR
        auth.uid()::text = coach_id::text
    );