import {
  MIN_FARM_SIZE_ACRES,
  MAX_FARM_SIZE_ACRES,
  MIN_NAME_LENGTH,
  MIN_PASSWORD_LENGTH,
  cleanText,
  isValidEmail,
  isValidFarmSize,
  isValidName,
  isValidPhoneNumber,
  isValidPlantingDate,
  normalizePhoneNumber
} from "./validation-rules.js";
import { smsTriggerList, smsTriggerIds } from "./sms-service.js";

export { normalizePhoneNumber };

export function validateRegistrationInput(payload, availableCountyIds) {
  const name = cleanText(payload.name);
  const email = cleanText(payload.email).toLowerCase();
  const password = String(payload.password || "");
  const phoneNumber = normalizePhoneNumber(payload.phoneNumber);
  const countyId = cleanText(payload.countyId);

  if (!isValidName(name)) {
    return { error: `Full name must be at least ${MIN_NAME_LENGTH} characters long.` };
  }

  if (!isValidEmail(email)) {
    return { error: "Please enter a valid email address." };
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    return { error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters long.` };
  }

  if (!isValidPhoneNumber(phoneNumber)) {
    return { error: "Please enter a valid phone number." };
  }

  if (!availableCountyIds.has(countyId)) {
    return { error: "Please select a valid county." };
  }

  return { value: { name, email, password, phoneNumber, countyId } };
}

export function validateLoginInput(payload) {
  const email = cleanText(payload.email).toLowerCase();
  const password = String(payload.password || "");

  if (!isValidEmail(email) || !password) {
    return { error: "Valid email and password are required." };
  }

  return { value: { email, password } };
}

export function validateProfileInput(payload, availableCountyIds, currentFarmer) {
  const name = cleanText(payload.name || currentFarmer.name);
  const phoneNumber = normalizePhoneNumber(payload.phoneNumber ?? currentFarmer.phoneNumber);
  const countyId = cleanText(payload.countyId || currentFarmer.countyId);

  if (!isValidName(name)) {
    return { error: `Full name must be at least ${MIN_NAME_LENGTH} characters long.` };
  }

  if (!isValidPhoneNumber(phoneNumber)) {
    return { error: "Please enter a valid phone number." };
  }

  if (!availableCountyIds.has(countyId)) {
    return { error: "Please select a valid county." };
  }

  return { value: { name, phoneNumber, countyId } };
}

export function validatePlantingInput(payload, availableCropIds, availableCountyIds) {
  const cropId = cleanText(payload.cropId);
  const countyId = cleanText(payload.countyId);
  const plantingDate = cleanText(payload.plantingDate);
  const farmSizeAcres = Number(payload.farmSizeAcres);
  const notes = cleanText(payload.notes);

  if (!availableCropIds.has(cropId)) {
    return { error: "Please select a valid crop." };
  }

  if (!availableCountyIds.has(countyId)) {
    return { error: "Please select a valid county." };
  }

  if (!plantingDate || Number.isNaN(Date.parse(plantingDate))) {
    return { error: "Please enter a valid planting date." };
  }

  if (!isValidPlantingDate(plantingDate)) {
    return { error: "Planting date cannot be in the future." };
  }

  if (!isValidFarmSize(farmSizeAcres)) {
    return {
      error: `Farm size must be between ${MIN_FARM_SIZE_ACRES} and ${MAX_FARM_SIZE_ACRES} acres.`
    };
  }

  return {
    value: {
      cropId,
      countyId,
      plantingDate,
      farmSizeAcres: Number(farmSizeAcres.toFixed(2)),
      notes
    }
  };
}

export function validateSmsAlertInput(payload) {
  const plantingId = cleanText(payload.plantingId);
  const trigger = cleanText(payload.trigger || smsTriggerIds.manualAdminSend);

  if (!plantingId) {
    return { error: "Planting record is required for SMS alerts." };
  }

  if (!smsTriggerList.includes(trigger)) {
    return { error: "Please select a valid SMS alert trigger." };
  }

  return {
    value: {
      plantingId,
      trigger
    }
  };
}
