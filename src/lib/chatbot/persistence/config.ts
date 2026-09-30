/**
 * Server-only MongoDB Atlas configuration for chat persistence.
 */

export class ChatDbConfigError extends Error {
  readonly code: string;

  constructor(message: string, code: string) {
    super(message);
    this.name = "ChatDbConfigError";
    this.code = code;
  }
}

function firstEnv(...names: string[]) {
  for (const name of names) {
    const value = process.env[name]?.trim();
    if (value) return value;
  }
  return undefined;
}

export type ChatMongoConfig = {
  uri: string;
  dbName: string;
};

export function isChatPersistenceConfigured() {
  return Boolean(firstEnv("MONGODB_URI", "MONGO_URI"));
}

export function getChatMongoConfig(): ChatMongoConfig {
  const uri = firstEnv("MONGODB_URI", "MONGO_URI");
  if (!uri) {
    throw new ChatDbConfigError(
      "Missing MONGODB_URI. Set a MongoDB Atlas connection string for chat persistence.",
      "MISSING_URI",
    );
  }

  const dbName =
    firstEnv("MONGODB_DB", "MONGODB_DATABASE") || "computing_yard_chat";

  // MongoDB namespaces reject spaces and most punctuation in db names.
  if (!/^[A-Za-z0-9_-]+$/.test(dbName)) {
    throw new ChatDbConfigError(
      `Invalid MONGODB_DB "${dbName}". Use letters, numbers, underscore, or hyphen only (e.g. computing_yard_chat).`,
      "INVALID_DB_NAME",
    );
  }

  return { uri, dbName };
}
