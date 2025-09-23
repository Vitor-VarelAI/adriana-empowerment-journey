-- Tabela de perfil do coach
CREATE TABLE coach_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    specialty TEXT[],
    experience_years INTEGER DEFAULT 0,
    bio TEXT,
    credentials TEXT[],
    languages TEXT[] DEFAULT ARRAY['português']::text[],
    session_price DECIMAL(10, 2) DEFAULT 0,
    session_duration INTEGER DEFAULT 60, -- em minutos
    availability_settings JSONB DEFAULT '{}'::jsonb,
    cancellation_policy TEXT DEFAULT '24 horas de antecedência',
    is_available BOOLEAN DEFAULT TRUE,
    rating DECIMAL(2, 1) DEFAULT 0,
    total_sessions INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_coach_profiles_user_id ON coach_profiles(user_id);
CREATE INDEX idx_coach_profiles_availability ON coach_profiles(is_available);
CREATE INDEX idx_coach_profiles_rating ON coach_profiles(rating);

-- Trigger para updated_at
CREATE TRIGGER set_timestamp_coach_profiles
    BEFORE UPDATE ON coach_profiles
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_timestamp();

-- Habilitar RLS
ALTER TABLE coach_profiles ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança para tabela coach_profiles
DROP POLICY IF EXISTS "Users can read all coach profiles" ON coach_profiles;
CREATE POLICY "Users can read all coach profiles" ON coach_profiles
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Coaches can read their own profile" ON coach_profiles;
CREATE POLICY "Coaches can read their own profile" ON coach_profiles
    FOR SELECT USING (auth.uid()::text = user_id::text);

DROP POLICY IF EXISTS "Coaches can update their own profile" ON coach_profiles;
CREATE POLICY "Coaches can update their own profile" ON coach_profiles
    FOR UPDATE USING (auth.uid()::text = user_id::text);

DROP POLICY IF EXISTS "Coaches can insert their own profile" ON coach_profiles;
CREATE POLICY "Coaches can insert their own profile" ON coach_profiles
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);