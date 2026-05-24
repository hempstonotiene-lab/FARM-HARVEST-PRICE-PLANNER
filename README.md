# Smart Farming Assistant

Smart Farming Assistant is a Node.js full-stack project with PostgreSQL storage, authentication, farmer profiles, planting history, backend forecasting, Kenya-focused crop and county datasets, weather integration, and Africa's Talking SMS support.

## What is included

- Farmer registration and login
- Farmer profile management
- Historical planting records with edit and delete support
- PostgreSQL storage for farmers, sessions, plantings, and SMS outbox records
- Backend forecast engine moved out of the browser
- Kenya county, crop, and market price datasets in `data/`
- Live weather lookup through Open-Meteo
- SMS alert integration hook through Africa's Talking
- English and Swahili onboarding toggle for the proposal-driven landing experience
- Responsive frontend served by the backend
- Safer validation for auth, profile, and planting input
- Session expiry handling for a safer local auth flow
- Database-backed health checks for production monitoring
- Graceful shutdown handling for cleaner hosting restarts

## Project structure

```text
.
|-- data/
|   |-- counties.json
|   |-- crops.json
|   `-- market-prices.json
|-- database/
|   `-- schema.sql
|-- scripts/
|   |-- client.js
|   |-- app.js
|   |-- data.js
|   `-- forecast.js
|-- src/
|   |-- db.js
|   |-- forecast-service.js
|   |-- repositories.js
|   |-- sms-service.js
|   |-- storage.js
|   `-- weather-service.js
|-- styles/
|   `-- main.css
|-- .env.example
|-- package.json
|-- server.js
`-- index.html
```

The active frontend entry is `scripts/client.js`. Older browser-only files remain in `scripts/` as legacy references from the first static version.

The current frontend also includes proposal-aligned capability and workflow sections so the app communicates the original project goals more clearly: personalized harvest prediction, market timing, weather-aware recommendations, and inclusive SMS fallback.

## Setup

1. Install Node.js 18 or newer.
2. Create a PostgreSQL database.
3. Copy `.env.example` to `.env`.
4. Update `DATABASE_URL` in `.env` (and set `SESSION_SECRET`).
5. Run `npm install`.
6. Run `npm start`.
7. Open `http://localhost:3000`.

If you use Windows PowerShell and `npm` is blocked by execution policy, run commands through Command Prompt:

```powershell
cmd /c npm install
cmd /c npm start
```

The server initializes the PostgreSQL tables automatically on startup. The SQL is also included in `database/schema.sql`.

## Environment variables

- `PORT`: Server port
- `DATABASE_URL`: PostgreSQL connection string
- `DATABASE_SSL`: Enable SSL for managed PostgreSQL services
- `SESSION_SECRET`: Session secret for local auth flow
- `SESSION_MAX_AGE_MS`: Session expiry duration in milliseconds
- `OPEN_METEO_BASE_URL`: Weather API base URL
- `AFRICASTALKING_USERNAME`: Africa's Talking username
- `AFRICASTALKING_API_KEY`: Africa's Talking API key
- `AFRICASTALKING_SENDER_ID`: Optional sender ID

## Notes

- If Africa's Talking credentials are missing, SMS messages are saved in the PostgreSQL `sms_outbox` table as preview/fallback records.
- If live weather is unavailable, the forecast falls back to county climate assumptions.
- Local JSON storage has been replaced by PostgreSQL-backed repositories.
- `/api/health` now verifies PostgreSQL connectivity, which makes platform health checks more meaningful.

## Deployment

This project is no longer a GitHub Pageprojects-only site because it now includes a backend. Deploy it on platforms that support Node.js apps, such as Render, Railway, or Fly.io.

## Render deployment

This repo now includes [render.yaml](C:/project/render.yaml), so you can deploy it with Render Blueprints.

### What Render will create

- One Node.js web service
- One managed PostgreSQL database
- A generated `SESSION_SECRET`
- A health check on `/api/health`
- Secret placeholders for Africa's Talking credentials

### How to deploy on Render

1. Push the latest code to GitHub.
2. In Render, choose `New` then `Blueprint`.
3. Connect your GitHub repository.
4. Select this repository and let Render read `render.yaml`.
5. Fill in the secret values for:
   - `AFRICASTALKING_USERNAME`
   - `AFRICASTALKING_API_KEY`
   - `AFRICASTALKING_SENDER_ID` if needed
6. Create the Blueprint and wait for the services to build.

### Important notes for Render

- The PostgreSQL tables are initialized automatically when the server starts.
- `DATABASE_SSL=true` is already set in `render.yaml` for managed Render Postgres.
- The free PostgreSQL plan may sleep or have limits, so use a paid plan for more reliable production use.
- Render can use `/api/health` as a real readiness signal because it checks the database connection too.
