-- Funções helper para o sistema de agendamento

-- Função para verificar disponibilidade de slots
CREATE OR REPLACE FUNCTION check_slot_availability(
    p_coach_id UUID,
    p_start_time TIMESTAMPTZ,
    p_end_time TIMESTAMPTZ
) RETURNS BOOLEAN AS $$
DECLARE
    conflicting_slots INTEGER;
BEGIN
    SELECT COUNT(*) INTO conflicting_slots
    FROM coaching_slots
    WHERE coach_id = p_coach_id
    AND status = 'available'
    AND (
        (start_time <= p_start_time AND end_time > p_start_time) OR
        (start_time < p_end_time AND end_time >= p_end_time) OR
        (start_time >= p_start_time AND end_time <= p_end_time)
    );

    RETURN conflicting_slots > 0;
END;
$$ LANGUAGE plpgsql;

-- Função para criar um booking automaticamente quando um slot é reservado
CREATE OR REPLACE FUNCTION create_booking_from_slot()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'booked' THEN
        INSERT INTO bookings (
            slot_id,
            client_id,
            coach_id,
            status,
            session_type,
            created_at
        )
        SELECT
            NEW.id,
            (SELECT id FROM users WHERE id = NEW.coach_id LIMIT 1),
            NEW.coach_id,
            'confirmed',
            'individual',
            NOW()
        WHERE NOT EXISTS (
            SELECT 1 FROM bookings WHERE slot_id = NEW.id
        );
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para criar booking automaticamente
CREATE TRIGGER create_booking_after_slot_update
    AFTER UPDATE ON coaching_slots
    FOR EACH ROW
    WHEN (OLD.status = 'available' AND NEW.status = 'booked')
    EXECUTE FUNCTION create_booking_from_slot();

-- Função para atualizar estatísticas do coach
CREATE OR REPLACE FUNCTION update_coach_stats()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        IF NEW.status = 'completed' THEN
            UPDATE coach_profiles
            SET
                total_sessions = (
                    SELECT COUNT(*)
                    FROM bookings b
                    WHERE b.coach_id = NEW.coach_id
                    AND b.status = 'completed'
                ),
                rating = (
                    SELECT COALESCE(AVG(rating), 0)
                    FROM bookings b
                    WHERE b.coach_id = NEW.coach_id
                    AND b.status = 'completed'
                    AND b.rating IS NOT NULL
                )
            WHERE user_id = NEW.coach_id;
        END IF;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE coach_profiles
        SET
            total_sessions = (
                SELECT COUNT(*)
                FROM bookings b
                WHERE b.coach_id = OLD.coach_id
                AND b.status = 'completed'
            ),
            rating = (
                SELECT COALESCE(AVG(rating), 0)
                FROM bookings b
                WHERE b.coach_id = OLD.coach_id
                AND b.status = 'completed'
                AND b.rating IS NOT NULL
            )
        WHERE user_id = OLD.coach_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar estatísticas
CREATE TRIGGER update_coach_stats_trigger
    AFTER INSERT OR UPDATE OR DELETE ON bookings
    FOR EACH ROW
    EXECUTE FUNCTION update_coach_stats();