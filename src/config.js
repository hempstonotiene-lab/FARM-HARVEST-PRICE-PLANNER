import "dotenv/config";

function boolFromEnv(value, fallback = false) {
  if (value == null) {
    return fallback;
  }

  return ["1", "true", "yes", "on"].includes(String(value).toLowerCase());
}

export function getConfig() {
  const config = {
    port: Number(process.env.PORT || 3000),
    nodeEnv: process.env.NODE_ENV || "development",
    databaseUrl: process.env.DATABASE_URL || "",
    databaseSsl: boolFromEnv(process.env.DATABASE_SSL, false),
    storageMode: String(process.env.STORAGE_MODE || "postgres").toLowerCase(),
    allowStorageFallback: boolFromEnv(
      process.env.ALLOW_STORAGE_FALLBACK,
      true
    ),
    sessionSecret: process.env.SESSION_SECRET || "dev-secret",
    sessionMaxAgeMs: Number(process.env.SESSION_MAX_AGE_MS || 1000 * 60 * 60 * 24 * 7),
    openMeteoBaseUrl:
      process.env.OPEN_METEO_BASE_URL || "https://api.open-meteo.com/v1/forecast",
    africasTalkingUsername: process.env.AFRICASTALKING_USERNAME || "",
    africasTalkingApiKey: process.env.AFRICASTALKING_API_KEY || "",
    africasTalkingSenderId: process.env.AFRICASTALKING_SENDER_ID || "",
    strictEnv: boolFromEnv(process.env.STRICT_ENV, false)
  };

  const warnings = [];

  if (config.port <= 0 || Number.isNaN(config.port)) {
    throw new Error("PORT must be a valid positive number.");
  }

  if (!["postgres", "json"].includes(config.storageMode)) {
    throw new Error("STORAGE_MODE must be either 'postgres' or 'json'.");
  }

  if (config.storageMode === "postgres" && !config.databaseUrl) {
    if (!config.allowStorageFallback) {
      throw new Error("DATABASE_URL is required for PostgreSQL storage.");
    }

    config.storageMode = "json";
    warnings.push("DATABASE_URL is missing; falling back to local JSON storage.");
  }

  if (config.storageMode === "json") {
    warnings.push("Using local JSON storage instead of PostgreSQL.");
  }

  if (config.sessionMaxAgeMs < 60000 || Number.isNaN(config.sessionMaxAgeMs)) {
    throw new Error("SESSION_MAX_AGE_MS must be at least 60000.");
  }

  if (config.nodeEnv === "production" && config.sessionSecret === "dev-secret") {
    const message = "SESSION_SECRET is using the default development value.";
    if (config.strictEnv) {
      throw new Error(message);
    }
    warnings.push(message);
  }

  if (!config.africasTalkingUsername || !config.africasTalkingApiKey) {
    warnings.push("Africa's Talking credentials are missing; SMS will use preview/fallback mode.");
  }

  return { config, warnings };
}
