export const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const phonePattern = /^\+?[0-9]{10,15}$/;
export const MIN_NAME_LENGTH = 3;
export const MIN_PASSWORD_LENGTH = 8;
export const MIN_FARM_SIZE_ACRES = 0.25;
export const MAX_FARM_SIZE_ACRES = 1000;

export function cleanText(value) {
  return String(value || "").trim();
}

export function normalizePhoneNumber(value) {
  const phone = cleanText(value).replace(/\s+/g, "");
  if (!phone) {
    return "";
  }

  if (phone.startsWith("0") && phone.length === 10) {
    return `+254${phone.slice(1)}`;
  }

  if (phone.startsWith("254") && phone.length === 12) {
    return `+${phone}`;
  }

  return phone;
}

export function isValidEmail(value) {
  return emailPattern.test(cleanText(value).toLowerCase());
}

export function isValidPhoneNumber(value) {
  const phoneNumber = normalizePhoneNumber(value);
  return !phoneNumber || phonePattern.test(phoneNumber);
}

export function isValidName(value) {
  return cleanText(value).length >= MIN_NAME_LENGTH;
}

export function isValidPassword(value) {
  return String(value || "").length >= MIN_PASSWORD_LENGTH;
}

export function isValidPlantingDate(value, now = new Date()) {
  const timestamp = Date.parse(cleanText(value));
  if (Number.isNaN(timestamp)) {
    return false;
  }

  return timestamp <= now.getTime();
}

export function isValidFarmSize(value) {
  const size = Number(value);
  return Number.isFinite(size) && size >= MIN_FARM_SIZE_ACRES && size <= MAX_FARM_SIZE_ACRES;
}
