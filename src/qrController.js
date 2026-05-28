import { generateQrPng, getQrTargets, recordScan, getScanStats } from "./qrService.js";

export function handleGenerateQr(req, res) {
    const baseUrl = process.env.BASE_URL || process.env.APP_BASE_URL || "https://farm-harvest-price-planner.onrender.com";
    const targets = getQrTargets(baseUrl);
    const qrType = req.query.type || "dashboard";
    const url = targets[qrType] || targets.dashboard;

    generateQrPng(url, { width: 512 })
        .then(buffer => {
            res.set({
                "Content-Type": "image/png",
                "Content-Disposition": `inline; filename="farm-planner-${qrType}.png"`,
                "Cache-Control": "no-cache"
            });
            res.send(buffer);
        })
        .catch(error => {
            res.status(500).json({ error: error.message });
        });
}

export function handleDownloadQr(req, res) {
    const baseUrl = process.env.BASE_URL || process.env.APP_BASE_URL || "https://farm-harvest-price-planner.onrender.com";
    const targets = getQrTargets(baseUrl);
    const qrType = req.query.type || "dashboard";
    const url = targets[qrType] || targets.dashboard;

    generateQrPng(url, { width: 1024 })
        .then(buffer => {
            res.set({
                "Content-Type": "image/png",
                "Content-Disposition": `attachment; filename="farm-planner-${qrType}.png"`,
                "Cache-Control": "no-cache"
            });
            res.send(buffer);
        })
        .catch(error => {
            res.status(500).json({ error: error.message });
        });
}

export function handleQrInfo(_req, res) {
    const baseUrl = process.env.BASE_URL || process.env.APP_BASE_URL || "https://farm-harvest-price-planner.onrender.com";
    const targets = getQrTargets(baseUrl);
    res.json({
        baseUrl,
        targets,
        stats: getScanStats()
    });
}

export function handleScan(req, res) {
    const qrType = req.query.type || "dashboard";
    const userAgent = req.get("User-Agent") || "";
    const baseUrl = process.env.BASE_URL || process.env.APP_BASE_URL || "https://farm-harvest-price-planner.onrender.com";
    const targets = getQrTargets(baseUrl);
    const targetUrl = targets[qrType] || targets.dashboard;

    recordScan(qrType, userAgent);

    res.redirect(302, targetUrl);
}