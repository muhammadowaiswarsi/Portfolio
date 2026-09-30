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

export async function getMongoClient(): Promise<MongoClient> {
  if (!isChatPersistenceConfigured()) {
    throw new ChatDbConfigError(
      "Chat persistence is not configured.",
      "NOT_CONFIGURED",
    );
  }

  const { uri } = getChatMongoConfig();

  if (!global.__cyMongoClientPromise) {
    const client = new MongoClient(uri, {
      maxPoolSize: 5,
      serverSelectionTimeoutMS: 8_000,
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
