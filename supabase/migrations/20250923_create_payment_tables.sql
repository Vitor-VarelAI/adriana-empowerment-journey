-- Tabelas de sistema de pagamento

-- Tabela de pagamentos
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'BRL',
    payment_method VARCHAR(50) NOT NULL CHECK (payment_method IN ('pix', 'credit_card', 'debit_card', 'bank_transfer')),
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'refunded', 'cancelled')),
    transaction_id TEXT,
    payment_link TEXT,
    payment_proof TEXT,
    payment_date TIMESTAMPTZ,
    due_date TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de transações (para histórico completo)
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payment_id UUID REFERENCES payments(id) ON DELETE SET NULL,
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL CHECK (type IN ('payment', 'refund', 'chargeback', 'fee')),
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'BRL',
    status VARCHAR(50) NOT NULL CHECK (status IN ('completed', 'pending', 'failed', 'cancelled')),
    description TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_payments_booking_id ON payments(booking_id);
CREATE INDEX idx_payments_client_id ON payments(client_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_transaction_id ON payments(transaction_id);
CREATE INDEX idx_transactions_booking_id ON transactions(booking_id);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_status ON transactions(status);

-- Trigger para updated_at
CREATE TRIGGER set_timestamp_payments
    BEFORE UPDATE ON payments
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_timestamp();

-- Habilitar RLS
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança para tabelas de pagamento

-- Políticas para payments
DROP POLICY IF EXISTS "Clients can read their own payments" ON payments;
CREATE POLICY "Clients can read their own payments" ON payments
    FOR SELECT USING (auth.uid()::text = client_id::text);

DROP POLICY IF EXISTS "Coaches can read payments for their bookings" ON payments;
CREATE POLICY "Coaches can read payments for their bookings" ON payments
    FOR SELECT USING (
        auth.uid()::text IN (
            SELECT coach_id::text
            FROM bookings
            WHERE id = payments.booking_id
        )
    );

DROP POLICY IF EXISTS "Users can create payments" ON payments;
CREATE POLICY "Users can create payments" ON payments
    FOR INSERT WITH CHECK (auth.uid()::text = client_id::text);

-- Políticas para transactions
DROP POLICY IF EXISTS "Users can read their own transactions" ON transactions;
CREATE POLICY "Users can read their own transactions" ON transactions
    FOR SELECT USING (auth.uid()::text = user_id::text);

DROP POLICY IF EXISTS "Coaches can read transactions for their bookings" ON transactions;
CREATE POLICY "Coaches can read transactions for their bookings" ON transactions
    FOR SELECT USING (
        auth.uid()::text IN (
            SELECT coach_id::text
            FROM bookings
            WHERE id = transactions.booking_id
        )
    );