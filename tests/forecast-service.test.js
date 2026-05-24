import test from "node:test";
import assert from "node:assert/strict";

import { buildForecast, getDatasets } from "../src/forecast-service.js";

test("getDatasets exposes market prices for API clients", () => {
  const datasets = getDatasets();

  assert.ok(Array.isArray(datasets.counties));
  assert.ok(Array.isArray(datasets.crops));
  assert.ok(Array.isArray(datasets.marketPrices));
  assert.ok(datasets.marketPrices.length > 0);
});

test("buildForecast includes market history and forecast prices", () => {
  const forecast = buildForecast({
    planting: {
      countyId: "nakuru",
      cropId: "maize",
      plantingDate: "2026-01-10",
      farmSizeAcres: 2
    },
    weatherSummary: {
      precipitationSum: 24,
      maxTemp: 27,
      minTemp: 14
    }
  });

  assert.equal(forecast.county.id, "nakuru");
  assert.equal(forecast.crop.id, "maize");
  assert.ok(Array.isArray(forecast.marketHistory));
  assert.ok(forecast.marketHistory.length > 0);
  assert.equal(forecast.priceSeries.length, 6);
  assert.ok(forecast.expectedRevenue > 0);
});
