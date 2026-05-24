CREATE TABLE IF NOT EXISTS farmers (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone_number TEXT NOT NULL DEFAULT '',
  county_id TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  password_salt TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS sessions (
  token TEXT PRIMARY KEY,
  farmer_id UUID NOT NULL REFERENCES farmers(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_sessions_farmer_id ON sessions(farmer_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at);

CREATE TABLE IF NOT EXISTS plantings (
  id UUID PRIMARY KEY,
  farmer_id UUID NOT NULL REFERENCES farmers(id) ON DELETE CASCADE,
  crop_id TEXT NOT NULL,
  county_id TEXT NOT NULL,
  planting_date DATE NOT NULL,
  farm_size_acres NUMERIC(10,2) NOT NULL,
  notes TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_plantings_farmer_id ON plantings(farmer_id);
CREATE INDEX IF NOT EXISTS idx_plantings_created_at ON plantings(created_at DESC);

CREATE TABLE IF NOT EXISTS sms_outbox (
  id UUID PRIMARY KEY,
  farmer_id UUID,
  phone_number TEXT NOT NULL,
  message TEXT NOT NULL,
  mode TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
