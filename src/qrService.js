import QRCode from "qrcode";
import { readJsonStorage, withJsonStorage } from "./json-storage.js";

let scanStats = {
    dashboard: 0,
    register: 0,
    forecast: 0,
    planner: 0,
    total: 0
};

function generateUuid() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
        const r = Math.random() * 16 | 0;
        const v = c === "x" ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function validateUrl(url) {
    try {
        const parsed = new URL(url);
        if (parsed.protocol !== "https:") {
            return { valid: false, error: "HTTPS required for QR code generation" };
        }
        if (!parsed.hostname) {
            return { valid: false, error: "Invalid URL: missing hostname" };
        }
        return { valid: true };
    } catch {
        return { valid: false, error: "Invalid URL format" };
    }
}

export async function generateQrPng(url, options = {}) {
    const validation = validateUrl(url);
    if (!validation.valid) {
        throw new Error(validation.error);
    }

    const defaultOptions = {
        width: 512,
        margin: 2,
        errorCorrectionLevel: "H",
        color: {
            dark: "#000000",
            light: "#ffffff"
        }
    };

    return await QRCode.toBuffer(url, { ...defaultOptions, ...options });
}

export function getQrTargets(baseUrl) {
    const base = baseUrl.replace(/\/$/, "");
    return {
        dashboard: `${base}/#auth`,
        register: `${base}/#registerForm`,
        forecast: `${base}/#planner`,
        planner: `${base}/#insights`
    };
}

export async function recordScan(qrType, userAgent = "") {
    const deviceType = userAgent.toLowerCase().includes("mobile") || 
        userAgent.toLowerCase().includes("android") || 
        userAgent.toLowerCase().includes("iphone") ? "mobile" : "desktop";

    const scanRecord = {
        id: generateUuid(),
        qrType,
        deviceType,
        timestamp: new Date().toISOString(),
        userAgent: userAgent.substring(0, 200)
    };

    await withJsonStorage(state => {
        state.qrScans = state.qrScans || [];
        state.qrScans.push(scanRecord);
        scanStats[qrType] = (scanStats[qrType] || 0) + 1;
        scanStats.total += 1;
        return { save: true, value: scanRecord };
    });

    return scanRecord;
}

export function getScanStats() {
    return { ...scanStats };
}