import smsService from "./smsService.js";
import { getConfig } from "../config.js";

const { config } = getConfig();

/**
 * Controller for sending harvest prediction readiness alert
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const sendHarvestAlertController = async (req, res) => {
  try {
    const { farmerId, plantingId } = req.params;
    
    // In a real implementation, you would fetch farmer, planting, and forecast data
    // For now, we'll simulate this data
    const farmer = {
      id: farmerId || "test-farmer-id",
      name: "John Doe",
      phoneNumber: "+254700000000"
    };
    
    const planting = {
      id: plantingId || "test-planting-id",
      farmerId: farmer.id,
      plantingDate: new Date().toISOString(),
      cropId: "maize",
      countyId: "nairobi"
    };
    
    const forecast = {
      crop: { name: "Maize" },
      county: { name: "Nairobi" },
      harvestWindow: {
        start: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
        end: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString()   // 45 days from now
      },
      bestSellWeek: 2,
      riskLabel: "Low",
      weatherNarrative: "Good weather conditions expected",
      expectedRevenue: 50000,
      priceSeries: [
        { weekOffset: 0, label: "Current", price: 3500 },
        { weekOffset: 1, label: "Week 1", price: 3600 },
        { weekOffset: 2, label: "Week 2", price: 3800 }, // Peak price
        { weekOffset: 3, label: "Week 3", price: 3700 }
      ]
    };

    const result = await smsService.sendHarvestAlert(farmer, planting, forecast);
    
    if (result.success) {
      res.status(200).json({
        success: true,
        message: "Harvest alert sent successfully",
        data: result
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Failed to send harvest alert",
        error: result.error
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

/**
 * Controller for sending market price increase alert
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const sendMarketAlertController = async (req, res) => {
  try {
    const { farmerId, plantingId } = req.params;
    
    // In a real implementation, you would fetch farmer, planting, and forecast data
    const farmer = {
      id: farmerId || "test-farmer-id",
      name: "John Doe",
      phoneNumber: "+254700000000"
    };
    
    const planting = {
      id: plantingId || "test-planting-id",
      farmerId: farmer.id,
      plantingDate: new Date().toISOString(),
      cropId: "maize",
      countyId: "nairobi"
    };
    
    const forecast = {
      crop: { name: "Maize" },
      county: { name: "Nairobi" },
      harvestWindow: {
        start: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        end: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString()
      },
      bestSellWeek: 2,
      riskLabel: "Low",
      weatherNarrative: "Good weather conditions expected",
      expectedRevenue: 50000,
      priceSeries: [
        { weekOffset: 0, label: "Current", price: 3500 },
        { weekOffset: 1, label: "Week 1", price: 3600 },
        { weekOffset: 2, label: "Week 2", price: 3800 }, // Peak price
        { weekOffset: 3, label: "Week 3", price: 3700 }
      ]
    };

    const result = await smsService.sendMarketAlert(farmer, planting, forecast);
    
    if (result.success) {
      res.status(200).json({
        success: true,
        message: "Market alert sent successfully",
        data: result
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Failed to send market alert",
        error: result.error
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

/**
 * Controller for sending weather warning alert
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const sendWeatherAlertController = async (req, res) => {
  try {
    const { farmerId, plantingId } = req.params;
    
    // In a real implementation, you would fetch farmer, planting, and forecast data
    const farmer = {
      id: farmerId || "test-farmer-id",
      name: "John Doe",
      phoneNumber: "+254700000000"
    };
    
    const planting = {
      id: plantingId || "test-planting-id",
      farmerId: farmer.id,
      plantingDate: new Date().toISOString(),
      cropId: "maize",
      countyId: "nairobi"
    };
    
    const forecast = {
      crop: { name: "Maize" },
      county: { name: "Nairobi" },
      harvestWindow: {
        start: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        end: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString()
      },
      bestSellWeek: 2,
      riskLabel: "High", // High risk to trigger weather alert
      weatherNarrative: "Heavy rainfall and potential flooding expected in the region",
      expectedRevenue: 50000,
      priceSeries: [
        { weekOffset: 0, label: "Current", price: 3500 },
        { weekOffset: 1, label: "Week 1", price: 3600 },
        { weekOffset: 2, label: "Week 2", price: 3800 },
        { weekOffset: 3, label: "Week 3", price: 3700 }
      ]
    };

    const result = await smsService.sendWeatherAlert(farmer, planting, forecast);
    
    if (result.success) {
      res.status(200).json({
        success: true,
        message: "Weather alert sent successfully",
        data: result
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Failed to send weather alert",
        error: result.error
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

/**
 * Controller for sending best selling time recommendation
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const sendSellingRecommendationController = async (req, res) => {
  try {
    const { farmerId, plantingId } = req.params;
    
    // In a real implementation, you would fetch farmer, planting, and forecast data
    const farmer = {
      id: farmerId || "test-farmer-id",
      name: "John Doe",
      phoneNumber: "+254700000000"
    };
    
    const planting = {
      id: plantingId || "test-planting-id",
      farmerId: farmer.id,
      plantingDate: new Date().toISOString(),
      cropId: "maize",
      countyId: "nairobi"
    };
    
    const forecast = {
      crop: { name: "Maize" },
      county: { name: "Nairobi" },
      harvestWindow: {
        start: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        end: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString()
      },
      bestSellWeek: 2, // > 0 to trigger selling recommendation
      riskLabel: "Low",
      weatherNarrative: "Good weather conditions expected",
      expectedRevenue: 50000,
      priceSeries: [
        { weekOffset: 0, label: "Current", price: 3500 },
        { weekOffset: 1, label: "Week 1", price: 3600 },
        { weekOffset: 2, label: "Week 2", price: 3800 },
        { weekOffset: 3, label: "Week 3", price: 3700 }
      ]
    };

    const result = await smsService.sendSellingRecommendation(farmer, planting, forecast);
    
    if (result.success) {
      res.status(200).json({
        success: true,
        message: "Selling recommendation sent successfully",
        data: result
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Failed to send selling recommendation",
        error: result.error
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

/**
 * Controller for sending bulk SMS notifications
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const sendBulkSmsController = async (req, res) => {
  try {
    const { alertType } = req.body;
    const filters = req.body.filters || {};
    
    // Validate alert type
    const validAlertTypes = ['harvest', 'market', 'weather', 'selling'];
    if (!alertType || !validAlertTypes.includes(alertType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid alert type. Must be one of: harvest, market, weather, selling"
      });
    }
    
    // Get farmers for bulk SMS
    const farmers = await smsService.getFarmersForBulkSms(filters);
    
    if (!farmers || farmers.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No farmers found matching the criteria"
      });
    }
    
    // Select alert function based on type
    let alertFunction;
    switch (alertType) {
      case 'harvest':
        alertFunction = smsService.sendHarvestAlert;
        break;
      case 'market':
        alertFunction = smsService.sendMarketAlert;
        break;
      case 'weather':
        alertFunction = smsService.sendWeatherAlert;
        break;
      case 'selling':
        alertFunction = smsService.sendSellingRecommendation;
        break;
      default:
        alertFunction = smsService.sendHarvestAlert;
    }
    
    // For bulk SMS, we need context data (planting, forecast)
    // In a real implementation, this would come from the request or be generated
    const context = {
      planting: {
        id: "bulk-planting-id",
        plantingDate: new Date().toISOString(),
        cropId: "maize",
        countyId: "nairobi"
      },
      forecast: {
        crop: { name: "Maize" },
        county: { name: "Nairobi" },
        harvestWindow: {
          start: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          end: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString()
        },
        bestSellWeek: 2,
        riskLabel: "Low",
        weatherNarrative: "Good weather conditions expected",
        expectedRevenue: 50000,
        priceSeries: [
          { weekOffset: 0, label: "Current", price: 3500 },
          { weekOffset: 1, label: "Week 1", price: 3600 },
          { weekOffset: 2, label: "Week 2", price: 3800 },
          { weekOffset: 3, label: "Week 3", price: 3700 }
        ]
      }
    };
    
    // Send bulk SMS
    const results = await smsService.sendBulkSmsNotifications(farmers, alertFunction, context);
    
    const successful = results.filter(r => r.success).length;
    const failed = results.length - successful;
    
    res.status(200).json({
      success: true,
      message: `Bulk SMS completed: ${successful} sent, ${failed} failed`,
      data: {
        total: farmers.length,
        successful,
        failed,
        results
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

/**
 * Controller for getting SMS history
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getSmsHistoryController = async (req, res) => {
  try {
    const { limit = 100, offset = 0 } = req.query;
    const filters = {};
    
    // Add any filters from query params
    if (req.query.farmerId) filters.farmerId = req.query.farmerId;
    if (req.query.trigger) filters.trigger = req.query.trigger;
    if (req.query.mode) filters.mode = req.query.mode;
    
    const history = await smsService.getSmsHistory(filters, parseInt(limit), parseInt(offset));
    
    res.status(200).json({
      success: true,
      message: "SMS history retrieved successfully",
      data: history
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve SMS history",
      error: error.message
    });
  }
};

export default {
  sendHarvestAlertController,
  sendMarketAlertController,
  sendWeatherAlertController,
  sendSellingRecommendationController,
  sendBulkSmsController,
  getSmsHistoryController
};