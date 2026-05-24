import express from "express";
import path from "node:path";
import crypto from "node:crypto";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";
import { buildForecast, getCounty, getCrop, getDatasets } from "./src/forecast-service.js";
import { getConfig } from "./src/config.js";
import { closeDb, initDb, pingDb } from "./src/db.js";
import {
    createFarmer,
    createPlanting,
    createSession,
    deleteExpiredSessions,
    deletePlanting,
    findFarmerByEmail,
    findPlantingById,
    findSessionWithFarmer,
    listPlantingsByFarmer,
    updateFarmer,
    updatePlanting
} from "./src/repositories.js";
import {
    validateLoginInput,
    validatePlantingInput,
    validateProfileInput,
    validateRegistrationInput
} from "./src/validators.js";
import { getWeatherSummary } from "./src/weather-service.js";
import { sendSmsAlert } from "./src/sms-service.js";
import smsRoutes from "./src/sms/smsRoutes.js";
import smsScheduler from "./src/sms/smsScheduler.js";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import { rateLimit } from "express-rate-limit";

const __filename = fileURLToPath(
    import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const { config, warnings } = getConfig();
const cropIds = new Set(getDatasets().crops.map((item) => item.id));
const countyIds = new Set(getDatasets().counties.map((item) => item.id));

const scrypt = promisify(crypto.scrypt);

/**
 * Rate limiter for authentication routes to prevent brute-force attacks.
 */
const authRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 10, // Limit each IP to 10 requests per window
    message: { error: "Too many attempts, please try again after 15 minutes." }
});

app.use(express.json());

// Serve only necessary frontend assets to avoid exposing sensitive backend files
app.use("/scripts", express.static(path.join(__dirname, "scripts")));
app.use("/styles", express.static(path.join(__dirname, "styles")));
app.use("/data", express.static(path.join(__dirname, "data")));
app.use("/src", express.static(path.join(__dirname, "src")));

/**
 * Wraps async route handlers to pass errors to the global error middleware.
 */
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

function sanitizeFarmer(farmer) {
    const { passwordHash, passwordSalt, ...safeFarmer } = farmer;
    return safeFarmer;
}

async function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
    const derivedKey = await scrypt(password, salt, 64);
    return { hash: derivedKey.toString("hex"), salt };
}

const authRequired = asyncHandler(async(req, res, next) => {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

    if (!token) {
        return res.status(401).json({ error: "Authentication required." });
    }

    const session = await findSessionWithFarmer(config, token);
    if (!session?.farmer) {
        return res.status(401).json({ error: "Invalid session." });
    }

    req.farmer = session.farmer;
    req.token = token;
    next();
});

function buildSmsMessage(farmer, planting, forecast) {
    const start = new Date(forecast.harvestWindow.start).toLocaleDateString("en-KE", {
        month: "short",
        day: "numeric"
    });
    const end = new Date(forecast.harvestWindow.end).toLocaleDateString("en-KE", { month: "short", day: "numeric" });
    return `${farmer.name}, ${forecast.crop.name} harvest window is ${start}-${end}. Best sell week: W+${Math.max(forecast.bestSellWeek, 0)}. Risk: ${forecast.riskLabel}.`;
}

// Initialize SMS cron jobs
smsScheduler.setupSmsCronJobs();

// Health check endpoint
app.get(
    "/api/health",
    asyncHandler(async(_req, res) => {
        try {
            const database = await pingDb(config);
            res.json({
                ok: true,
                service: "farm-harvest-price-planner-api",
                environment: config.nodeEnv,
                uptimeSeconds: Math.round(process.uptime()),
                database
            });
        } catch (error) {
            res.status(503).json({
                ok: false,
                service: "farm-harvest-price-planner-api",
                environment: config.nodeEnv,
                uptimeSeconds: Math.round(process.uptime()),
                database: {
                    ok: false,
                    error: error instanceof Error ? error.message : "Database health check failed."
                }
            });
        }
    })
);

app.get("/api/datasets", (_req, res) => {
    res.json(getDatasets());
});

app.post(
    "/api/auth/register",
    authRateLimiter,
    asyncHandler(async(req, res) => {
        const parsed = validateRegistrationInput(req.body, countyIds);
        if (parsed.error) {
            return res.status(400).json({ error: parsed.error });
        }
        const { name, email, password, phoneNumber, countyId } = parsed.value;

        const existing = await findFarmerByEmail(config, email);
        if (existing) {
            return res.status(409).json({ error: "An account with this email already exists." });
        }

        const { hash, salt } = await hashPassword(password);
        const farmer = await createFarmer(config, {
            id: crypto.randomUUID(),
            name,
            email,
            phoneNumber: phoneNumber || "",
            countyId,
            createdAt: new Date().toISOString(),
            passwordHash: hash,
            passwordSalt: salt
        });

        const token = await createSession(
            config,
            farmer.id,
            new Date(Date.now() + config.sessionMaxAgeMs).toISOString()
        );
        res.status(201).json({ token, farmer: sanitizeFarmer(farmer) });
    })
);

app.post(
    "/api/auth/login",
    authRateLimiter,
    asyncHandler(async(req, res) => {
        const parsed = validateLoginInput(req.body);
        if (parsed.error) {
            return res.status(400).json({ error: parsed.error });
        }
        const { email, password } = parsed.value;
        const farmer = await findFarmerByEmail(config, email);

        if (!farmer) {
            return res.status(401).json({ error: "Invalid email or password." });
        }

        const { hash } = await hashPassword(password, farmer.passwordSalt);
        if (hash !== farmer.passwordHash) {
            return res.status(401).json({ error: "Invalid email or password." });
        }

        const token = await createSession(
            config,
            farmer.id,
            new Date(Date.now() + config.sessionMaxAgeMs).toISOString()
        );
        res.json({ token, farmer: sanitizeFarmer(farmer) });
    })
);

app.get("/api/me/profile", authRequired, (req, res) => {
    res.json({ farmer: sanitizeFarmer(req.farmer) });
});

app.put(
    "/api/me/profile",
    authRequired,
    asyncHandler(async(req, res) => {
        const parsed = validateProfileInput(req.body, countyIds, req.farmer);
        if (parsed.error) {
            return res.status(400).json({ error: parsed.error });
        }
        const updated = await updateFarmer(config, req.farmer.id, parsed.value);
        if (!updated) {
            return res.status(404).json({ error: "Farmer account not found." });
        }
        res.json({ farmer: sanitizeFarmer(updated) });
    })
);

app.get(
    "/api/me/plantings",
    authRequired,
    asyncHandler(async(req, res) => {
        res.json({ plantings: await listPlantingsByFarmer(config, req.farmer.id) });
    })
);

app.post(
    "/api/me/plantings",
    authRequired,
    asyncHandler(async(req, res) => {
        const parsed = validatePlantingInput(req.body, cropIds, countyIds);
        if (parsed.error) {
            return res.status(400).json({ error: parsed.error });
        }
        const { cropId, countyId, plantingDate, farmSizeAcres, notes } = parsed.value;

        const planting = await createPlanting(config, {
            id: crypto.randomUUID(),
            farmerId: req.farmer.id,
            cropId,
            countyId,
            plantingDate,
            farmSizeAcres: Number(farmSizeAcres),
            notes: notes || "",
            createdAt: new Date().toISOString()
        });

        const weatherSummary = await getWeatherSummary(getCounty(countyId), config);
        const forecast = buildForecast({ planting, weatherSummary });
        res.status(201).json({ planting, forecast });
    })
);

app.put(
    "/api/me/plantings/:plantingId",
    authRequired,
    asyncHandler(async(req, res) => {
        const parsed = validatePlantingInput(req.body, cropIds, countyIds);
        if (parsed.error) {
            return res.status(400).json({ error: parsed.error });
        }

        const updated = await updatePlanting(config, req.params.plantingId, req.farmer.id, parsed.value);
        if (!updated) {
            return res.status(404).json({ error: "Planting record not found." });
        }

        const weatherSummary = await getWeatherSummary(getCounty(updated.countyId), config);
        const forecast = buildForecast({ planting: updated, weatherSummary });
        res.json({ planting: updated, forecast });
    })
);

app.delete(
    "/api/me/plantings/:plantingId",
    authRequired,
    asyncHandler(async(req, res) => {
        const deletedPlantingId = await deletePlanting(config, req.params.plantingId, req.farmer.id);
        if (!deletedPlantingId) {
            return res.status(404).json({ error: "Planting record not found." });
        }
        res.json({ deletedPlantingId });
    })
);

app.get(
    "/api/me/dashboard",
    authRequired,
    asyncHandler(async(req, res) => {
        const plantings = await listPlantingsByFarmer(config, req.farmer.id);

        const latestPlanting = plantings[0] || null;
        let forecast = null;
        if (latestPlanting) {
            const weatherSummary = await getWeatherSummary(getCounty(latestPlanting.countyId), config);
            forecast = buildForecast({ planting: latestPlanting, weatherSummary });
        }

        res.json({
            farmer: sanitizeFarmer(req.farmer),
            latestPlanting,
            forecast
        });
    })
);

app.post(
    "/api/forecast",
    authRequired,
    asyncHandler(async(req, res) => {
        const parsed = validatePlantingInput(req.body, cropIds, countyIds);
        if (parsed.error) {
            return res.status(400).json({ error: parsed.error });
        }

        const planting = {
            id: crypto.randomUUID(),
            farmerId: req.farmer.id,
            ...parsed.value,
            createdAt: new Date().toISOString()
        };
        const county = getCounty(planting.countyId);
        const crop = getCrop(planting.cropId);
        if (!county || !crop) {
            return res.status(400).json({ error: "Valid crop and county are required." });
        }

        const weatherSummary = await getWeatherSummary(county, config);
        const forecast = buildForecast({ planting, weatherSummary });
        res.json({ planting, forecast });
    })
);

app.post(
    "/api/alerts/sms",
    authRequired,
    asyncHandler(async(req, res) => {
        const planting = await findPlantingById(config, req.body.plantingId, req.farmer.id);
        if (!planting) {
            return res.status(404).json({ error: "Planting record not found." });
        }

        const weatherSummary = await getWeatherSummary(getCounty(planting.countyId), config);
        const forecast = buildForecast({ planting, weatherSummary });
        const result = await sendSmsAlert({
            message: buildSmsMessage(req.farmer, planting, forecast),
            phoneNumber: req.farmer.phoneNumber,
            config,
            farmerId: req.farmer.id
        });

        res.json({ result });
    })
);

// SMS notification routes
app.use("/api/sms", smsRoutes);

// Swagger documentation
const swaggerDocument = YAML.load("./swagger.yaml");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("*", (_req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.use((err, req, res, _next) => {
    console.error(`[server error] ${err.stack || err.message}`);
    const status = err.status || 500;
    res.status(status).json({
        error: status === 500 ? "An internal server error occurred." : err.message
    });
});

let server;
let shuttingDown = false;

async function shutdown(signal) {
    if (shuttingDown) {
        return;
    }

    shuttingDown = true;
    console.log(`Received ${signal}. Shutting down Farm Harvest & Price Planner...`);

    try {
        if (server) {
            await new Promise((resolve, reject) => {
                server.close((error) => {
                    if (error) {
                        reject(error);
                        return;
                    }
                    resolve();
                });
            });
        }

        await closeDb();
        process.exit(0);
    } catch (error) {
        console.error("Shutdown failed.", error);
        process.exit(1);
    }
}

process.on("SIGINT", () => {
    void shutdown("SIGINT");
});

process.on("SIGTERM", () => {
    void shutdown("SIGTERM");
});

// Periodically clean up expired sessions (every hour)
const SESSION_CLEANUP_INTERVAL = 60 * 60 * 1000;

initDb(config)
    .then((storage) => {
        server = app.listen(config.port, "0.0.0.0", () => {
            if (storage?.mode === "json" && !warnings.some((warning) => warning.includes("JSON storage"))) {
                warnings.push("PostgreSQL is unavailable; running with local JSON storage.");
            }
            warnings.forEach((warning) => console.warn(`[config] ${warning}`));
            console.log(`Farm Harvest & Price Planner running on port ${config.port}`);

            setInterval(async() => {
                try {
                    await deleteExpiredSessions(config);
                } catch (err) {
                    console.error("Session cleanup failed:", err);
                }
            }, SESSION_CLEANUP_INTERVAL);
        });
    })
    .catch((error) => {
        console.error("Failed to initialize application storage.", error);
        process.exit(1);
    });
