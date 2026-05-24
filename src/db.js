import { Pool } from "pg";
import { getJsonStorageInfo, initJsonStorage } from "./json-storage.js";

let pool;

function isConnectionError(error) {
  if (!error || typeof error !== "object") {
    return false;
  }

  const codes = new Set(["ECONNREFUSED", "ENOTFOUND", "EHOSTUNREACH", "ETIMEDOUT"]);
  if (codes.has(error.code)) {
    return true;
  }

  if (Array.isArray(error.errors)) {
    return error.errors.some((entry) => codes.has(entry?.code));
  }

  return false;
}

function createPool(config) {
  if (pool) {
    return pool;
  }

  pool = new Pool({
    connectionString: config.databaseUrl,
    ssl: config.databaseSsl ? { rejectUnauthorized: false } : false
  });

  return pool;
}

export function getDb(config) {
  return createPool(config);
}

export async function query(config, text, params = []) {
  if (config.storageMode === "json") {
    throw new Error("SQL query execution is unavailable while running in JSON storage mode.");
  }

  const db = createPool(config);
  return db.query(text, params);
}

export async function pingDb(config) {
  if (config.storageMode === "json") {
    return {
      ok: true,
      checkedAt: new Date().toISOString(),
      ...getJsonStorageInfo()
    };
  }

  const result = await query(config, "SELECT NOW() AS now");
  return {
    ok: true,
    checkedAt: result.rows[0]?.now?.toISOString?.() ?? result.rows[0]?.now ?? new Date().toISOString()
  };
}

export async function closeDb() {
  if (!pool) {
    return;
  }

  const activePool = pool;
  pool = undefined;
  await activePool.end();
}

export async function initDb(config) {
  if (config.storageMode === "json") {
    await initJsonStorage();
    return getJsonStorageInfo();
  }

  const schema = `
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
      trigger TEXT,
      provider TEXT,
      mode TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    ALTER TABLE sms_outbox ADD COLUMN IF NOT EXISTS trigger TEXT;
    ALTER TABLE sms_outbox ADD COLUMN IF NOT EXISTS provider TEXT;
  `;

  try {
    await query(config, schema);
    await query(config, "DELETE FROM sessions WHERE expires_at <= NOW()");
    return { mode: "postgres" };
  } catch (error) {
    if (config.allowStorageFallback && isConnectionError(error)) {
      config.storageMode = "json";
      await initJsonStorage();
      return {
        ...getJsonStorageInfo(),
        fallbackReason: error.message
      };
    }

    throw error;
  }
}
