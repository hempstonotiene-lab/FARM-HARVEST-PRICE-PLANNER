import { seasonalTrend } from "./data.js";

const DAY = 24 * 60 * 60 * 1000;

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function addDays(date, days) {
  return new Date(date.getTime() + days * DAY);
}

function formatDate(date) {
  return new Intl.DateTimeFormat("en-KE", {
    month: "long",
    day: "numeric"
  }).format(date);
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0
  }).format(value);
}

function formatCompactCurrency(value) {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    notation: "compact",
    maximumFractionDigits: 1
  }).format(value);
}

export function buildForecast({ crop, county, plantingDate, farmSize, farmerName, channel }) {
  const plantedOn = new Date(plantingDate);
  const weatherBoost = county.rainfallFactor - crop.weatherSensitivity * 0.08;
  const heatAdjustment = (county.temperatureFactor - 1) * 18;
  const maturityDays = Math.round(crop.maturityDays / weatherBoost - heatAdjustment);
  const harvestStart = addDays(plantedOn, maturityDays - 6);
  const harvestEnd = addDays(plantedOn, maturityDays + 8);

  const baselinePrice = crop.basePrice * county.logisticsFactor;
  const weatherRisk = clamp(
    62 + (county.rainfallFactor - 1) * 120 - (crop.weatherSensitivity - 0.6) * 38,
    44,
    89
  );
  const riskLabel = weatherRisk >= 76 ? "Low" : weatherRisk >= 61 ? "Moderate" : "Elevated";

  const priceSeries = seasonalTrend.map((entry, index) => {
    const volatilityImpact = 1 + crop.priceVolatility * (index / 10);
    const rainfallInfluence = 1 + (county.rainfallFactor - 1) * 0.6;
    const price = Math.round(
      baselinePrice * entry.multiplier * volatilityImpact * rainfallInfluence
    );
    return {
      label: `W${entry.weekOffset >= 0 ? "+" : ""}${entry.weekOffset}`,
      weekOffset: entry.weekOffset,
      price
    };
  });

  const bestPricePoint = priceSeries.reduce((best, current) =>
    current.price > best.price ? current : best
  );

  const estimatedYield = Math.round(
    farmSize *
      crop.yieldPerAcre *
      county.rainfallFactor *
      (1 - Math.max(0, crop.weatherSensitivity - 0.7) * 0.08)
  );

  const lowRevenue = estimatedYield * priceSeries[2].price;
  const highRevenue = estimatedYield * bestPricePoint.price;

  const bestWeekText =
    bestPricePoint.weekOffset <= 0
      ? "Harvest week"
      : `Week ${bestPricePoint.weekOffset} after harvest`;

  const recommendation =
    bestPricePoint.weekOffset >= 2
      ? `Hold ${Math.min(65, 35 + bestPricePoint.weekOffset * 10)}% of produce until ${bestWeekText.toLowerCase()} to capture a stronger price uplift while keeping the rest for immediate cash flow.`
      : "Sell quickly after harvest because the market curve peaks early and later storage adds unnecessary risk.";

  const weatherNarrative = `${county.weatherNote} ${weatherRisk >= 70 ? "Field conditions are supportive for scheduling labor and transport." : "Plan drying and storage carefully because weather pressure may tighten your harvest window."}`;

  const smsPreview = `${farmerName || "Farmer"}, ${crop.name} harvest: ${formatDate(harvestStart)}-${formatDate(harvestEnd)}. Best sell: ${bestWeekText}. Peak price: ${formatCurrency(bestPricePoint.price)}. Channel: ${channel.toUpperCase()}.`;

  return {
    harvestWindow: `${formatDate(harvestStart)} - ${formatDate(harvestEnd)}`,
    bestWeekText,
    recommendation,
    estimatedYieldText: `${estimatedYield} ${crop.id === "tomatoes" || crop.id === "onions" ? "crates" : "bags"}`,
    revenueProjectionText: `${formatCompactCurrency(lowRevenue)} - ${formatCompactCurrency(highRevenue)}`,
    bestPriceText: formatCurrency(bestPricePoint.price),
    riskLabel,
    weatherScore: `${weatherRisk}%`,
    weatherNarrative,
    smsPreview,
    priceSeries,
    weatherTags: [
      `${county.name} outlook`,
      `${crop.name} maturity ${maturityDays} days`,
      `${riskLabel} storage exposure`
    ]
  };
}

export function getDefaultPlantingDate() {
  const today = new Date();
  today.setDate(today.getDate() - 21);
  return today.toISOString().slice(0, 10);
}
