import express from "express";
import smsController from "./smsController.js";

const router = express.Router();

// Individual SMS alert endpoints
router.post("/harvest/:farmerId/:plantingId", smsController.sendHarvestAlertController);
router.post("/market/:farmerId/:plantingId", smsController.sendMarketAlertController);
router.post("/weather/:farmerId/:plantingId", smsController.sendWeatherAlertController);
router.post("/selling/:farmerId/:plantingId", smsController.sendSellingRecommendationController);

// Bulk SMS endpoint
router.post("/bulk", smsController.sendBulkSmsController);

// SMS history endpoint
router.get("/history", smsController.getSmsHistoryController);

export default router;