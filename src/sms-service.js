import crypto from "node:crypto";
import { addSmsOutboxRecord } from "./repositories.js";

export async function sendSmsAlert({ message, phoneNumber, config, farmerId = null }) {
  if (!phoneNumber) {
    return { delivered: false, mode: "skipped" };
  }

  if (!config.africasTalkingApiKey || !config.africasTalkingUsername) {
    await addSmsOutboxRecord(config, {
      id: crypto.randomUUID(),
      farmerId,
      phoneNumber,
      message,
      createdAt: new Date().toISOString(),
      mode: "preview"
    });
    return { delivered: false, mode: "preview" };
  }

  try {
    const { default: africastalking } = await import("africastalking");
    const client = africastalking({
      apiKey: config.africasTalkingApiKey,
      username: config.africasTalkingUsername
    });
    await client.SMS.send({
      to: [phoneNumber],
      message,
      from: config.africasTalkingSenderId || undefined,
      enqueue: true
    });
    return { delivered: true, mode: "africas-talking" };
  } catch {
    await addSmsOutboxRecord(config, {
      id: crypto.randomUUID(),
      farmerId,
      phoneNumber,
      message,
      createdAt: new Date().toISOString(),
      mode: "fallback"
    });
    return { delivered: false, mode: "fallback" };
  }
}
