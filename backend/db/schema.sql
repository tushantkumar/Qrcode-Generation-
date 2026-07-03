CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS qr_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  purpose VARCHAR(32) NOT NULL CHECK (purpose IN ('registration', 'payment', 'event', 'custom')),
  title VARCHAR(120) NOT NULL,
  description TEXT,
  target_url TEXT NOT NULL,
  amount NUMERIC(12,2),
  currency CHAR(3),
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  qr_data_url TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_qr_codes_purpose ON qr_codes(purpose);
CREATE INDEX IF NOT EXISTS idx_qr_codes_created_at ON qr_codes(created_at DESC);
