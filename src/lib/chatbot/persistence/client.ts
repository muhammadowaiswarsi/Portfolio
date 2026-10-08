/**
 * MongoDB Atlas client singleton for chat persistence.
 * Never import from client components.
 */

import { MongoClient, type Db } from "mongodb";

import {
  ChatDbConfigError,
  getChatMongoConfig,
  isChatPersistenceConfigured,
} from "@/lib/chatbot/persistence/config";

declare global {
  var __cyMongoClientPromise: Promise<MongoClient> | undefined;
}

let indexesEnsured = false;

/** Ensure Atlas-friendly query params when the URI omits them. */
function normalizeMongoUri(uri: string) {
  const trimmed = uri.trim();
  if (!trimmed) return trimmed;

  const hasQuery = trimmed.includes("?");
  const params: string[] = [];
  if (!/[?&]retryWrites=/.test(trimmed)) params.push("retryWrites=true");
  if (!/[?&]w=/.test(trimmed)) params.push("w=majority");
  if (params.length === 0) return trimmed;

  return hasQuery
    ? `${trimmed}&${params.join("&")}`
    : `${trimmed}?${params.join("&")}`;
}

export async function getMongoClient(): Promise<MongoClient> {
  if (!isChatPersistenceConfigured()) {
    throw new ChatDbConfigError(
      "Chat persistence is not configured.",
      "NOT_CONFIGURED",
    );
  }

  const { uri } = getChatMongoConfig();
  const normalizedUri = normalizeMongoUri(uri);

  if (!global.__cyMongoClientPromise) {
    const client = new MongoClient(normalizedUri, {
      maxPoolSize: 5,
      serverSelectionTimeoutMS: 8_000,
      connectTimeoutMS: 10_000,
    });
    global.__cyMongoClientPromise = client.connect().catch((error) => {
      global.__cyMongoClientPromise = undefined;
      throw error;
    });
  }

  return global.__cyMongoClientPromise;
}

export async function getChatDb(): Promise<Db> {
  const client = await getMongoClient();
  const { dbName } = getChatMongoConfig();
  const db = client.db(dbName);
  await ensureIndexes(db);
  return db;
}

async function ensureIndexes(db: Db) {
  if (indexesEnsured) return;

  await Promise.all([
    db.collection("chat_sessions").createIndex(
      { tokenHash: 1 },
      { unique: true },
    ),
    db.collection("conversations").createIndex({ sessionId: 1, updatedAt: -1 }),
    db.collection("conversations").createIndex({ updatedAt: -1 }),
    db.collection("messages").createIndex({ conversationId: 1, createdAt: 1 }),
  ]);

  indexesEnsured = true;
}
