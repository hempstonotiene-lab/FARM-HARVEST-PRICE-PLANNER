import crypto from "node:crypto";
import { addSmsOutboxRecord } from "./repositories.js";

export const smsTriggerIds = Object.freeze({
  harvestPredictionReady: "harvest-prediction-ready",
  marketPriceAlert: "market-price-alert",
  weatherWarning: "weather-warning",
  manualAdminSend: "manual-admin-send",
  optimalSellingPeriod: "optimal-selling-period"
});

export const smsTriggerList = Object.values(smsTriggerIds);
export const smsProviderName = "Africa's Talking";

function formatShortDate(value) {
  return new Date(value).toLocaleDateString("en-KE", {
    month: "short",
    day: "numeric"
  });
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0
  }).format(Number(value || 0));
}

function getBestSellWeekText(forecast) {
  return forecast.bestSellWeek > 0 ? `Week ${forecast.bestSellWeek} after harvest` : "Harvest week";
}

function getPriceContext(forecast) {
  const series = Array.isArray(forecast.priceSeries) ? forecast.priceSeries : [];
  if (!series.length) {
    return { current: null, peak: null };
  }

  const current = series.find((item) => item.weekOffset === 0) || series[0];
  const peak = series.reduce((best, item) => (item.price > best.price ? item : best), series[0]);
  return { current, peak };
}

export function buildSmsMessageForTrigger({ trigger, farmer, planting, forecast }) {
  const harvestStart = formatShortDate(forecast.harvestWindow.start);
  const harvestEnd = formatShortDate(forecast.harvestWindow.end);
  const cropName = forecast.crop.name;
  const countyName = forecast.county.name;
  const bestWeekText = getBestSellWeekText(forecast);
  const { current, peak } = getPriceContext(forecast);
  const farmerName = farmer.name;
  const weather = planting.weatherSummary || forecast.weatherSummary || null;

  switch (trigger) {
    case smsTriggerIds.harvestPredictionReady:
      return `${farmerName}, ${cropName} harvest window for ${countyName} is ${harvestStart}-${harvestEnd}. Keep your crop records updated for the next alert.`;
    case smsTriggerIds.marketPriceAlert:
      return `${farmerName}, ${cropName} market outlook: current ${current ? formatCurrency(current.price) : "price unavailable"}, peak ${peak ? `${peak.label} at ${formatCurrency(peak.price)}` : "not available"}.`;
    case smsTriggerIds.weatherWarning:
      return `${farmerName}, weather warning for ${countyName}: ${forecast.riskLabel} field risk. ${forecast.weatherNarrative}`;
    case smsTriggerIds.optimalSellingPeriod:
      return `${farmerName}, best time to sell ${cropName} is ${bestWeekText}. Estimated revenue is about ${formatCurrency(forecast.expectedRevenue)} if field conditions hold.`;
    case smsTriggerIds.manualAdminSend:
    default:
      return `${farmerName}, ${cropName} harvest window is ${harvestStart}-${harvestEnd}. Best sell time: ${bestWeekText}. Weather risk: ${forecast.riskLabel}.`;
  }
}

export function buildTriggeredSmsAlerts({ farmer, planting, forecast, requestedTrigger = null }) {
  const supported = new Set(smsTriggerList);
  if (requestedTrigger) {
    if (!supported.has(requestedTrigger)) {
      throw new Error("Unsupported SMS trigger.");
    }

    return [
      {
        trigger: requestedTrigger,
        phoneNumber: farmer.phoneNumber,
        message: buildSmsMessageForTrigger({ trigger: requestedTrigger, farmer, planting, forecast })
      }
    ];
  }

  const alerts = [
    {
      trigger: smsTriggerIds.harvestPredictionReady,
      phoneNumber: farmer.phoneNumber,
      message: buildSmsMessageForTrigger({
        trigger: smsTriggerIds.harvestPredictionReady,
        farmer,
        planting,
        forecast
      })
    }
  ];

  const { current, peak } = getPriceContext(forecast);
  if (current && peak && peak.price > current.price) {
    alerts.push({
      trigger: smsTriggerIds.marketPriceAlert,
      phoneNumber: farmer.phoneNumber,
      message: buildSmsMessageForTrigger({ trigger: smsTriggerIds.marketPriceAlert, farmer, planting, forecast })
    });
  }

  if (forecast.riskLabel === "High") {
    alerts.push({
      trigger: smsTriggerIds.weatherWarning,
      phoneNumber: farmer.phoneNumber,
      message: buildSmsMessageForTrigger({ trigger: smsTriggerIds.weatherWarning, farmer, planting, forecast })
    });
  }

  if (forecast.bestSellWeek > 0) {
    alerts.push({
      trigger: smsTriggerIds.optimalSellingPeriod,
      phoneNumber: farmer.phoneNumber,
      message: buildSmsMessageForTrigger({
        trigger: smsTriggerIds.optimalSellingPeriod,
        farmer,
        planting,
        forecast
      })
    });
  }

  return alerts;
}

export async function sendSmsAlert({
  message,
  phoneNumber,
  config,
  farmerId = null,
  trigger = smsTriggerIds.manualAdminSend,
  provider = smsProviderName
}) {
  if (!phoneNumber) {
    return {
      delivered: false,
      mode: "skipped",
      trigger,
      provider,
      message,
      phoneNumber
    };
  }

  if (!config.africasTalkingApiKey || !config.africasTalkingUsername) {
    await addSmsOutboxRecord(config, {
      id: crypto.randomUUID(),
      farmerId,
      phoneNumber,
      message,
      trigger,
      provider,
      createdAt: new Date().toISOString(),
      mode: "preview"
    });
    return { delivered: false, mode: "preview", trigger, provider, message, phoneNumber };
  }

  try {
    const { default: africastalking } = await import("africastalking");
    const client = africastalking({
      apiKey: config.africasTalkingApiKey,
      username: config.africasTalkingUsername
    });
    await client.SMS.send({
      to: [phoneNumber],
      message,
      from: config.africasTalkingSenderId || undefined,
      enqueue: true
    });
    return { delivered: true, mode: "africas-talking", trigger, provider, message, phoneNumber };
  } catch {
    await addSmsOutboxRecord(config, {
      id: crypto.randomUUID(),
      farmerId,
      phoneNumber,
      message,
      trigger,
      provider,
      createdAt: new Date().toISOString(),
      mode: "fallback"
    });
    return { delivered: false, mode: "fallback", trigger, provider, message, phoneNumber };
  }
}

export async function dispatchSmsAlerts({ alerts, config, farmerId = null }) {
  const results = [];
  for (const alert of alerts) {
    results.push(
      await sendSmsAlert({
        message: alert.message,
        phoneNumber: alert.phoneNumber,
        config,
        farmerId,
        trigger: alert.trigger
      })
    );
  }

  return results;
}
