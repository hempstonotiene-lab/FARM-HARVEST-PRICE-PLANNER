-- Comprehensive Schema for Farm Harvest & Price Planner

CREATE TABLE IF NOT EXISTS farmers (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone_number VARCHAR(25) NOT NULL,
    county_id VARCHAR(50) NOT NULL,
    password_hash TEXT NOT NULL,
    password_salt TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS plantings (
    id UUID PRIMARY KEY,
    farmer_id UUID REFERENCES farmers(id) ON DELETE CASCADE,
    crop_id VARCHAR(50) NOT NULL,
    county_id VARCHAR(50) NOT NULL,
    planting_date DATE NOT NULL,
    farm_size_acres NUMERIC(12, 2) NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS sessions (
    token TEXT PRIMARY KEY,
    farmer_id UUID REFERENCES farmers(id) ON DELETE CASCADE,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sms_outbox (
    id UUID PRIMARY KEY,
    farmer_id UUID REFERENCES farmers(id) ON DELETE SET NULL,
    phone_number VARCHAR(25) NOT NULL,
    message TEXT NOT NULL,
    trigger VARCHAR(50),
    provider VARCHAR(50),
    mode VARCHAR(20) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);