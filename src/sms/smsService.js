import africasTalking from "africastalking";
import { v4 as uuidv4 } from "uuid";
import { addSmsOutboxRecord, getSmsOutboxHistory, getFarmerPhoneNumbers } from "../repositories.js";
import { getConfig } from "../config.js";

const { config } = getConfig();

/**
 * Initialize Africa's Talking SDK
 */
const initializeAfricaTalking = () => {
  if (!config.africasTalkingApiKey || !config.africasTalkingUsername) {
    throw new Error("Africa's Talking credentials not configured");
  }

  // Dynamic import to handle ESM/CJS compatibility
  return import("africastalking").then(module => {
    const africastalking = module.default || module;
    return africastalking({
      apiKey: config.africasTalkingApiKey,
      username: config.africasTalkingUsername
    });
  });
};

/**
 * Send SMS via Africa's Talking API
 * @param {string} phoneNumber - Farmer's phone number
 * @param {string} message - SMS message content
 * @returns {Promise<Object>} - Delivery result
 */
const sendSmsViaAfricaTalking = async (phoneNumber, message) => {
  try {
    const africastalking = await initializeAfricaTalking();
    const result = await africastalking.SMS.send({
      to: [phoneNumber],
      message,
      from: config.africasTalkingSenderId,
      enqueue: true
    });

    return {
      success: true,
      messageId: JSON.stringify(result),
      provider: "africas_talking"
    };
  } catch (error) {
    throw new Error(`Failed to send SMS: ${error.message}`);
  }
};

/**
 * Log SMS attempt to database
 * @param {Object} smsData - SMS data to log
 * @returns {Promise<void>}
 */
const logSmsAttempt = async (smsData) => {
  try {
    await addSmsOutboxRecord(config, {
      id: smsData.id || uuidv4(),
      farmerId: smsData.farmerId,
      phoneNumber: smsData.phoneNumber,
      message: smsData.message,
      trigger: smsData.trigger,
      provider: smsData.provider || "africas_talking",
      mode: smsData.success ? "success" : "failed",
      createdAt: new Date().toISOString(),
      error: smsData.error || null
    });
  } catch (error) {
    console.error("Failed to log SMS attempt:", error);
  }
};

/**
 * Send harvest prediction readiness alert
 * @param {Object} farmer - Farmer object
 * @param {Object} planting - Planting data
 * @param {Object} forecast - Forecast data
 * @returns {Promise<Object>} - SMS sending result
 */
export const sendHarvestAlert = async (farmer, planting, forecast) => {
  if (!farmer.phoneNumber) {
    return { success: false, error: "Farmer phone number not available" };
  }

  const message = `Hello ${farmer.name}, your ${forecast.crop.name} crop planted on ${new Date(planting.plantingDate).toLocaleDateString()} is expected to be ready for harvest between ${new Date(forecast.harvestWindow.start).toLocaleDateString()} and ${new Date(forecast.harvestWindow.end).toLocaleDateString()}. Please prepare accordingly.`;

  const smsData = {
    id: uuidv4(),
    farmerId: farmer.id,
    phoneNumber: farmer.phoneNumber,
    message,
    trigger: "harvest_prediction_ready"
  };

  try {
    const result = await sendSmsViaAfricaTalking(farmer.phoneNumber, message);
    smsData.success = true;
    smsData.provider = result.provider;
    smsData.messageId = result.messageId;
    await logSmsAttempt(smsData);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    smsData.success = false;
    smsData.error = error.message;
    await logSmsAttempt(smsData);
    return { success: false, error: error.message };
  }
};

/**
 * Send market price increase alert
 * @param {Object} farmer - Farmer object
 * @param {Object} planting - Planting data
 * @param {Object} forecast - Forecast data
 * @returns {Promise<Object>} - SMS sending result
 */
export const sendMarketAlert = async (farmer, planting, forecast) => {
  if (!farmer.phoneNumber) {
    return { success: false, error: "Farmer phone number not available" };
  }

  const priceSeries = Array.isArray(forecast.priceSeries) ? forecast.priceSeries : [];
  const currentPrice = priceSeries.find(item => item.weekOffset === 0) || priceSeries[0];
  const peakPrice = priceSeries.reduce((best, item) => (item.price > best.price ? item : best), priceSeries[0] || {});

  let message = `Hello ${farmer.name},`;
  
  if (currentPrice && currentPrice.price) {
    message += ` the current market price for ${forecast.crop.name} is ${new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', maximumFractionDigits: 0 }).format(currentPrice.price)}.`;
  } else {
    message += ` market price data for ${forecast.crop.name} is currently unavailable.`;
  }

  if (peakPrice && peakPrice.price && peakPrice.price > (currentPrice?.price || 0)) {
    message += ` The expected peak price is ${new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', maximumFractionDigits: 0 }).format(peakPrice.price)} during week ${peakPrice.label || peakPrice.weekOffset}. Consider holding your crop for better returns.`;
  } else {
    message += ` Prices are expected to remain stable or decrease. Consider selling soon to avoid potential losses.`;
  }

  const smsData = {
    id: uuidv4(),
    farmerId: farmer.id,
    phoneNumber: farmer.phoneNumber,
    message,
    trigger: "market_price_alert"
  };

  try {
    const result = await sendSmsViaAfricaTalking(farmer.phoneNumber, message);
    smsData.success = true;
    smsData.provider = result.provider;
    smsData.messageId = result.messageId;
    await logSmsAttempt(smsData);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    smsData.success = false;
    smsData.error = error.message;
    await logSmsAttempt(smsData);
    return { success: false, error: error.message };
  }
};

/**
 * Send weather warning alert
 * @param {Object} farmer - Farmer object
 * @param {Object} planting - Planting data
 * @param {Object} forecast - Forecast data
 * @returns {Promise<Object>} - SMS sending result
 */
export const sendWeatherAlert = async (farmer, planting, forecast) => {
  if (!farmer.phoneNumber) {
    return { success: false, error: "Farmer phone number not available" };
  }

  const message = `Hello ${farmer.name}, weather alert for ${forecast.county.name}: ${forecast.weatherNarrative || 'Adverse weather conditions expected.'} Risk level: ${forecast.riskLabel}. Please take necessary precautions to protect your ${forecast.crop.name} crop.`;

  const smsData = {
    id: uuidv4(),
    farmerId: farmer.id,
    phoneNumber: farmer.phoneNumber,
    message,
    trigger: "weather_warning"
  };

  try {
    const result = await sendSmsViaAfricaTalking(farmer.phoneNumber, message);
    smsData.success = true;
    smsData.provider = result.provider;
    smsData.messageId = result.messageId;
    await logSmsAttempt(smsData);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    smsData.success = false;
    smsData.error = error.message;
    await logSmsAttempt(smsData);
    return { success: false, error: error.message };
  }
};

/**
 * Send best selling time recommendation
 * @param {Object} farmer - Farmer object
 * @param {Object} planting - Planting data
 * @param {Object} forecast - Forecast data
 * @returns {Promise<Object>} - SMS sending result
 */
export const sendSellingRecommendation = async (farmer, planting, forecast) => {
  if (!farmer.phoneNumber) {
    return { success: false, error: "Farmer phone number not available" };
  }

  const bestWeekText = forecast.bestSellWeek > 0 ? `Week ${forecast.bestSellWeek} after harvest` : "Harvest week";
  const revenueText = forecast.expectedRevenue 
    ? `Estimated revenue: ${new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', maximumFractionDigits: 0 }).format(forecast.expectedRevenue)}`
    : "Revenue estimate unavailable";

  const message = `Hello ${farmer.name}, the best time to sell your ${forecast.crop.name} crop is during ${bestWeekText}. ${revenueText}. Market conditions favor selling at this time for optimal returns.`;

  const smsData = {
    id: uuidv4(),
    farmerId: farmer.id,
    phoneNumber: farmer.phoneNumber,
    message,
    trigger: "selling_recommendation"
  };

  try {
    const result = await sendSmsViaAfricaTalking(farmer.phoneNumber, message);
    smsData.success = true;
    smsData.provider = result.provider;
    smsData.messageId = result.messageId;
    await logSmsAttempt(smsData);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    smsData.success = false;
    smsData.error = error.message;
    await logSmsAttempt(smsData);
    return { success: false, error: error.message };
  }
};

/**
 * Send bulk SMS notifications to multiple farmers
 * @param {Array<Object>} farmers - Array of farmer objects
 * @param {Function} alertFunction - Function to generate SMS content
 * @param {Object} context - Additional context (planting, forecast, etc.)
 * @returns {Promise<Array>} - Results for each SMS sent
 */
export const sendBulkSmsNotifications = async (farmers, alertFunction, context = {}) => {
  const results = [];
  
  for (const farmer of farmers) {
    try {
      const result = await alertFunction(farmer, context.planting, context.forecast);
      results.push({
        farmerId: farmer.id,
        phoneNumber: farmer.phoneNumber,
        success: result.success,
        messageId: result.messageId,
        error: result.error
      });
    } catch (error) {
      results.push({
        farmerId: farmer.id,
        phoneNumber: farmer.phoneNumber,
        success: false,
        error: error.message
      });
    }
  }
  
  return results;
};

/**
 * Get SMS delivery history
 * @param {Object} filters - Filter criteria
 * @param {number} limit - Maximum records to return
 * @param {number} offset - Records to skip
 * @returns {Promise<Array>} - SMS history records
 */
export const getSmsHistory = async (filters = {}, limit = 100, offset = 0) => {
  try {
    return await getSmsOutboxHistory(config, filters, limit, offset);
  } catch (error) {
    console.error("Failed to fetch SMS history:", error);
    throw error;
  }
};

/**
 * Get farmer phone numbers for bulk notifications
 * @param {Object} filters - Filter criteria (e.g., countyId, cropId)
 * @returns {Promise<Array>} - Farmer objects with phone numbers
 */
export const getFarmersForBulkSms = async (filters = {}) => {
  try {
    return await getFarmerPhoneNumbers(config, filters);
  } catch (error) {
    console.error("Failed to fetch farmer phone numbers:", error);
    throw error;
  }
};

export default {
  sendHarvestAlert,
  sendMarketAlert,
  sendWeatherAlert,
  sendSellingRecommendation,
  sendBulkSmsNotifications,
  getSmsHistory,
  getFarmersForBulkSms
};