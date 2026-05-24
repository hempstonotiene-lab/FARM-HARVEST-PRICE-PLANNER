import cron from "node-cron";
import smsService from "./smsService.js";
import { listPlantingsByFarmer, findFarmerByEmail } from "../repositories.js";
import { getWeatherSummary } from "../weather-service.js";
import { buildForecast } from "../forecast-service.js";
import { getConfig } from "../config.js";

const { config } = getConfig();

/**
 * Check and send scheduled SMS alerts for all farmers
 * This function runs periodically via cron job
 */
export const checkAndSendScheduledAlerts = async () => {
  try {
    console.log("Running scheduled SMS alert check...");
    
    // In a real implementation, you would get all farmers from the database
    // For now, we'll simulate with a placeholder - you'd replace this with actual DB call
    const farmers = []; // This would come from getAllFarmers() function
    
    // For demonstration, we'll skip if no farmers found
    if (farmers.length === 0) {
      console.log("No farmers found for scheduled alerts");
      return;
    }
    
    for (const farmer of farmers) {
      try {
        // Get farmer's plantings
        const plantings = await listPlantingsByFarmer(config, farmer.id);
        
        for (const planting of plantings) {
          // Get weather summary for the county
          const weatherSummary = await getWeatherSummary(
            { name: planting.countyId }, // Simplified - you'd get actual county object
            config
          );
          
          // Build forecast
          const forecast = buildForecast({ planting, weatherSummary });
          
          // Check conditions and send appropriate alerts
          
          // 1. Harvest prediction readiness (if within 7 days of harvest window)
          const harvestStart = new Date(forecast.harvestWindow.start);
          const now = new Date();
          const daysUntilHarvest = Math.ceil((harvestStart - now) / (1000 * 60 * 60 * 24));
          
          if (daysUntilHarvest <= 7 && daysUntilHarvest > 0) {
            await smsService.sendHarvestAlert(farmer, planting, forecast);
          }
          
          // 2. Market price increase alert (if significant price increase expected)
          const priceSeries = Array.isArray(forecast.priceSeries) ? forecast.priceSeries : [];
          const currentPrice = priceSeries.find(item => item.weekOffset === 0) || priceSeries[0];
          const futurePrices = priceSeries.filter(item => item.weekOffset > 0);
          
          if (currentPrice && futurePrices.length > 0) {
            const maxFuturePrice = Math.max(...futurePrices.map(item => item.price));
            if (maxFuturePrice > currentPrice.price * 1.15) { // 15% increase threshold
              await smsService.sendMarketAlert(farmer, planting, forecast);
            }
          }
          
          // 3. Weather warning (if high risk)
          if (forecast.riskLabel === "High") {
            await smsService.sendWeatherAlert(farmer, planting, forecast);
          }
          
          // 4. Best selling time recommendation (if best sell week is in future)
          if (forecast.bestSellWeek > 0 && forecast.bestSellWeek <= 4) { // Within next 4 weeks
            await smsService.sendSellingRecommendation(farmer, planting, forecast);
          }
        }
      } catch (farmerError) {
        console.error(`Error processing farmer ${farmer.id}:`, farmerError);
        continue; // Continue with next farmer
      }
    }
    
    console.log("Scheduled SMS alert check completed");
  } catch (error) {
    console.error("Error in scheduled SMS alert check:", error);
  }
};

/**
 * Set up cron jobs for SMS alerts
 */
export const setupSmsCronJobs = () => {
  // Run every day at 9:00 AM
  cron.schedule("0 9 * * *", () => {
    checkAndSendScheduledAlerts();
  }, {
    timezone: "Africa/Nairobi"
  });
  
  // Run every day at 3:00 PM for weather alerts (more frequent during rainy season)
  cron.schedule("0 15 * * *", () => {
    checkAndSendScheduledAlerts();
  }, {
    timezone: "Africa/Nairobi"
  });
  
  console.log("SMS cron jobs configured");
};

export default {
  checkAndSendScheduledAlerts,
  setupSmsCronJobs
};