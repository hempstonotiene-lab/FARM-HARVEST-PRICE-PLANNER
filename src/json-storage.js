import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const storageDir = path.join(__dirname, "..", "storage");

const storageFiles = {
  farmers: path.join(storageDir, "farmers.json"),
  sessions: path.join(storageDir, "sessions.json"),
  plantings: path.join(storageDir, "plantings.json"),
  smsOutbox: path.join(storageDir, "sms-outbox.json")
};

let storageQueue = Promise.resolve();

async function ensureFile(filePath) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });

  try {
    await fs.access(filePath);
  } catch {
    await fs.writeFile(filePath, "[]\n", "utf8");
  }
}

async function readArray(filePath) {
  await ensureFile(filePath);
  const raw = await fs.readFile(filePath, "utf8");
  const parsed = JSON.parse(raw || "[]");
  return Array.isArray(parsed) ? parsed : [];
}

async function writeArray(filePath, items) {
  await ensureFile(filePath);
  await fs.writeFile(filePath, `${JSON.stringify(items, null, 2)}\n`, "utf8");
}

async function readState() {
  const [farmers, sessions, plantings, smsOutbox] = await Promise.all([
    readArray(storageFiles.farmers),
    readArray(storageFiles.sessions),
    readArray(storageFiles.plantings),
    readArray(storageFiles.smsOutbox)
  ]);

  return { farmers, sessions, plantings, smsOutbox };
}

async function writeState(state) {
  await Promise.all([
    writeArray(storageFiles.farmers, state.farmers),
    writeArray(storageFiles.sessions, state.sessions),
    writeArray(storageFiles.plantings, state.plantings),
    writeArray(storageFiles.smsOutbox, state.smsOutbox)
  ]);
}

function queueStorageTask(task) {
  const run = storageQueue.then(task, task);
  storageQueue = run.then(
    () => undefined,
    () => undefined
  );
  return run;
}

export async function initJsonStorage() {
  await Promise.all(Object.values(storageFiles).map((filePath) => ensureFile(filePath)));
  return { mode: "json", storageDir };
}

export async function readJsonStorage(selector) {
  await initJsonStorage();
  const state = await readState();
  return selector(state);
}

export async function withJsonStorage(mutator) {
  return queueStorageTask(async () => {
    await initJsonStorage();
    const state = await readState();
    const result = await mutator(state);

    if (result?.save !== false) {
      await writeState(state);
    }

    return result?.value;
  });
}

export function getJsonStorageInfo() {
  return {
    mode: "json",
    storageDir
  };
}
