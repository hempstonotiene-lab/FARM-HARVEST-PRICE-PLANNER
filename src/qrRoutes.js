import { Router } from "express";
import { handleGenerateQr, handleDownloadQr, handleQrInfo, handleScan } from "./qrController.js";

const qrRoutes = Router();

qrRoutes.get("/generate", handleGenerateQr);
qrRoutes.get("/download", handleDownloadQr);
qrRoutes.get("/info", handleQrInfo);
qrRoutes.get("/scan", handleScan);

export default qrRoutes;