import test from "node:test";
import assert from "node:assert/strict";

import {
  normalizePhoneNumber,
  validatePlantingInput,
  validateProfileInput,
  validateRegistrationInput
} from "../src/validators.js";

const countyIds = new Set(["nakuru", "kiambu"]);
const cropIds = new Set(["maize", "beans"]);

test("normalizePhoneNumber converts local Kenya format to international", () => {
  assert.equal(normalizePhoneNumber("0712345678"), "+254712345678");
  assert.equal(normalizePhoneNumber("254712345678"), "+254712345678");
});

test("validateRegistrationInput normalizes phone and lowercases email", () => {
  const result = validateRegistrationInput(
    {
      name: "Jane Doe",
      email: "JANE@EXAMPLE.COM",
      password: "password123",
      phoneNumber: "0712345678",
      countyId: "nakuru"
    },
    countyIds
  );

  assert.deepEqual(result, {
    value: {
      name: "Jane Doe",
      email: "jane@example.com",
      password: "password123",
      phoneNumber: "+254712345678",
      countyId: "nakuru"
    }
  });
});

test("validateProfileInput rejects invalid county updates", () => {
  const result = validateProfileInput(
    {
      countyId: "missing-county"
    },
    countyIds,
    {
      name: "Jane Doe",
      phoneNumber: "+254712345678",
      countyId: "nakuru"
    }
  );

  assert.equal(result.error, "Please select a valid county.");
});

test("validatePlantingInput rejects future dates", () => {
  const futureDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const result = validatePlantingInput(
    {
      cropId: "maize",
      countyId: "nakuru",
      plantingDate: futureDate,
      farmSizeAcres: 1
    },
    cropIds,
    countyIds
  );

  assert.equal(result.error, "Planting date cannot be in the future.");
});

test("validatePlantingInput enforces farm size range", () => {
  const result = validatePlantingInput(
    {
      cropId: "maize",
      countyId: "nakuru",
      plantingDate: "2026-01-10",
      farmSizeAcres: 0.1
    },
    cropIds,
    countyIds
  );

  assert.equal(result.error, "Farm size must be between 0.25 and 1000 acres.");
});
