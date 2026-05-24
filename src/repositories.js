import crypto from "node:crypto";
import { query } from "./db.js";
import { readJsonStorage, withJsonStorage } from "./json-storage.js";

function normalizeTimestamp(value) {
  return value?.toISOString?.() ?? value ?? null;
}

function mapFarmer(row) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phoneNumber: row.phone_number ?? row.phoneNumber ?? "",
    countyId: row.county_id ?? row.countyId,
    createdAt: normalizeTimestamp(row.created_at ?? row.createdAt),
    updatedAt: normalizeTimestamp(row.updated_at ?? row.updatedAt),
    passwordHash: row.password_hash ?? row.passwordHash,
    passwordSalt: row.password_salt ?? row.passwordSalt
  };
}

function mapPlanting(row) {
  const plantingDateValue = row.planting_date ?? row.plantingDate;
  return {
    id: row.id,
    farmerId: row.farmer_id ?? row.farmerId,
    cropId: row.crop_id ?? row.cropId,
    countyId: row.county_id ?? row.countyId,
    plantingDate:
      plantingDateValue instanceof Date
        ? plantingDateValue.toISOString().slice(0, 10)
        : String(plantingDateValue),
    farmSizeAcres: Number(row.farm_size_acres ?? row.farmSizeAcres),
    notes: row.notes ?? "",
    createdAt: normalizeTimestamp(row.created_at ?? row.createdAt),
    updatedAt: normalizeTimestamp(row.updated_at ?? row.updatedAt)
  };
}

function isJsonMode(config) {
  return config.storageMode === "json";
}

function sortByCreatedAtDesc(items) {
  return [...items].sort((left, right) => {
    const leftTime = Date.parse(left.createdAt || 0);
    const rightTime = Date.parse(right.createdAt || 0);
    return rightTime - leftTime;
  });
}

export async function findFarmerByEmail(config, email) {
  if (isJsonMode(config)) {
    return readJsonStorage(({ farmers }) => {
      const farmer = farmers.find((entry) => entry.email === email);
      return farmer ? mapFarmer(farmer) : null;
    });
  }

  const result = await query(config, "SELECT * FROM farmers WHERE email = $1 LIMIT 1", [email]);
  return result.rows[0] ? mapFarmer(result.rows[0]) : null;
}

export async function findFarmerById(config, id) {
  if (isJsonMode(config)) {
    return readJsonStorage(({ farmers }) => {
      const farmer = farmers.find((entry) => entry.id === id);
      return farmer ? mapFarmer(farmer) : null;
    });
  }

  const result = await query(config, "SELECT * FROM farmers WHERE id = $1 LIMIT 1", [id]);
  return result.rows[0] ? mapFarmer(result.rows[0]) : null;
}

export async function createFarmer(config, farmer) {
  if (isJsonMode(config)) {
    return withJsonStorage((state) => {
      const record = {
        ...farmer,
        updatedAt: farmer.updatedAt || null
      };
      state.farmers.push(record);
      return { value: mapFarmer(record) };
    });
  }

  const result = await query(
    config,
    `INSERT INTO farmers (id, name, email, phone_number, county_id, password_hash, password_salt, created_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [
      farmer.id,
      farmer.name,
      farmer.email,
      farmer.phoneNumber,
      farmer.countyId,
      farmer.passwordHash,
      farmer.passwordSalt,
      farmer.createdAt
    ]
  );
  return mapFarmer(result.rows[0]);
}

export async function updateFarmer(config, farmerId, patch) {
  if (isJsonMode(config)) {
    return withJsonStorage((state) => {
      const farmer = state.farmers.find((entry) => entry.id === farmerId);
      if (!farmer) {
        return { value: null };
      }

      farmer.name = patch.name;
      farmer.phoneNumber = patch.phoneNumber;
      farmer.countyId = patch.countyId;
      farmer.updatedAt = new Date().toISOString();
      return { value: mapFarmer(farmer) };
    });
  }

  const result = await query(
    config,
    `UPDATE farmers
     SET name = $2, phone_number = $3, county_id = $4, updated_at = NOW()
     WHERE id = $1
     RETURNING *`,
    [farmerId, patch.name, patch.phoneNumber, patch.countyId]
  );
  return result.rows[0] ? mapFarmer(result.rows[0]) : null;
}

export async function createSession(config, farmerId, expiresAt) {
  const token = crypto.randomBytes(32).toString("hex");

  if (isJsonMode(config)) {
    await withJsonStorage((state) => {
      state.sessions.push({
        token,
        farmerId,
        createdAt: new Date().toISOString(),
        expiresAt
      });
      return { value: token };
    });
    return token;
  }

  await query(
    config,
    `INSERT INTO sessions (token, farmer_id, expires_at)
     VALUES ($1, $2, $3)`,
    [token, farmerId, expiresAt]
  );
  return token;
}

export async function deleteExpiredSessions(config) {
  if (isJsonMode(config)) {
    await withJsonStorage((state) => {
      const now = Date.now();
      state.sessions = state.sessions.filter((session) => Date.parse(session.expiresAt) > now);
      return { value: undefined };
    });
    return;
  }

  await query(config, "DELETE FROM sessions WHERE expires_at <= NOW()");
}

export async function findSessionWithFarmer(config, token) {
  if (isJsonMode(config)) {
    return readJsonStorage(({ sessions, farmers }) => {
      const session = sessions.find((entry) => entry.token === token);
      if (!session || Date.parse(session.expiresAt) <= Date.now()) {
        return null;
      }

      const farmer = farmers.find((entry) => entry.id === session.farmerId);
      if (!farmer) {
        return null;
      }

      return {
        token: session.token,
        expiresAt: session.expiresAt,
        farmer: mapFarmer(farmer)
      };
    });
  }

  const result = await query(
    config,
    `SELECT
       s.token,
       s.expires_at,
       f.*
     FROM sessions s
     JOIN farmers f ON f.id = s.farmer_id
     WHERE s.token = $1
       AND s.expires_at > NOW()
     LIMIT 1`,
    [token]
  );

  if (!result.rows[0]) {
    return null;
  }

  return {
    token: result.rows[0].token,
    expiresAt: result.rows[0].expires_at?.toISOString?.() ?? result.rows[0].expires_at,
    farmer: mapFarmer(result.rows[0])
  };
}

export async function listPlantingsByFarmer(config, farmerId) {
  if (isJsonMode(config)) {
    return readJsonStorage(({ plantings }) =>
      sortByCreatedAtDesc(plantings.filter((entry) => entry.farmerId === farmerId)).map(mapPlanting)
    );
  }

  const result = await query(
    config,
    `SELECT * FROM plantings
     WHERE farmer_id = $1
     ORDER BY created_at DESC`,
    [farmerId]
  );
  return result.rows.map(mapPlanting);
}

export async function createPlanting(config, planting) {
  if (isJsonMode(config)) {
    return withJsonStorage((state) => {
      const record = {
        ...planting,
        updatedAt: planting.updatedAt || null
      };
      state.plantings.push(record);
      return { value: mapPlanting(record) };
    });
  }

  const result = await query(
    config,
    `INSERT INTO plantings (
       id, farmer_id, crop_id, county_id, planting_date, farm_size_acres, notes, created_at
     )
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [
      planting.id,
      planting.farmerId,
      planting.cropId,
      planting.countyId,
      planting.plantingDate,
      planting.farmSizeAcres,
      planting.notes,
      planting.createdAt
    ]
  );
  return mapPlanting(result.rows[0]);
}

export async function findPlantingById(config, plantingId, farmerId) {
  if (isJsonMode(config)) {
    return readJsonStorage(({ plantings }) => {
      const planting = plantings.find((entry) => entry.id === plantingId && entry.farmerId === farmerId);
      return planting ? mapPlanting(planting) : null;
    });
  }

  const result = await query(
    config,
    `SELECT * FROM plantings
     WHERE id = $1 AND farmer_id = $2
     LIMIT 1`,
    [plantingId, farmerId]
  );
  return result.rows[0] ? mapPlanting(result.rows[0]) : null;
}

export async function updatePlanting(config, plantingId, farmerId, patch) {
  if (isJsonMode(config)) {
    return withJsonStorage((state) => {
      const planting = state.plantings.find((entry) => entry.id === plantingId && entry.farmerId === farmerId);
      if (!planting) {
        return { value: null };
      }

      planting.cropId = patch.cropId;
      planting.countyId = patch.countyId;
      planting.plantingDate = patch.plantingDate;
      planting.farmSizeAcres = patch.farmSizeAcres;
      planting.notes = patch.notes;
      planting.updatedAt = new Date().toISOString();
      return { value: mapPlanting(planting) };
    });
  }

  const result = await query(
    config,
    `UPDATE plantings
     SET crop_id = $3,
         county_id = $4,
         planting_date = $5,
         farm_size_acres = $6,
         notes = $7,
         updated_at = NOW()
     WHERE id = $1 AND farmer_id = $2
     RETURNING *`,
    [plantingId, farmerId, patch.cropId, patch.countyId, patch.plantingDate, patch.farmSizeAcres, patch.notes]
  );
  return result.rows[0] ? mapPlanting(result.rows[0]) : null;
}

export async function deletePlanting(config, plantingId, farmerId) {
  if (isJsonMode(config)) {
    return withJsonStorage((state) => {
      const index = state.plantings.findIndex((entry) => entry.id === plantingId && entry.farmerId === farmerId);
      if (index === -1) {
        return { value: null };
      }

      const [removed] = state.plantings.splice(index, 1);
      return { value: removed.id };
    });
  }

  const result = await query(
    config,
    `DELETE FROM plantings
     WHERE id = $1 AND farmer_id = $2
     RETURNING id`,
    [plantingId, farmerId]
  );
  return result.rows[0]?.id || null;
}

export async function addSmsOutboxRecord(config, record) {
  if (isJsonMode(config)) {
    await withJsonStorage((state) => {
      state.smsOutbox.push(record);
      return { value: undefined };
    });
    return;
  }

  await query(
    config,
    `INSERT INTO sms_outbox (id, farmer_id, phone_number, message, mode, created_at)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [record.id, record.farmerId || null, record.phoneNumber, record.message, record.mode, record.createdAt]
  );
}
