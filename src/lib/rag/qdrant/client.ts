/**
 * Server-only Qdrant client singleton.
 * Never import this module from client components.
 */

import { QdrantClient } from "@qdrant/js-client-rest";

import {
  getQdrantConfig,
  RagConfigError,
  type QdrantRagConfig,
} from "@/lib/rag/qdrant/config";

export class QdrantClientError extends Error {
  readonly code: string;
  readonly status?: number;

  constructor(message: string, code: string, status?: number) {
    super(message);
    this.name = "QdrantClientError";
    this.code = code;
    this.status = status;
  }
}

let cachedClient: QdrantClient | null = null;
let cachedConfigKey: string | null = null;

function configKey(config: QdrantRagConfig) {
  // Include presence of API key, not the key itself.
  return `${config.url}|${config.apiKey ? "auth" : "noauth"}`;
}

export function getQdrantClient(config = getQdrantConfig()): QdrantClient {
  const key = configKey(config);

  if (cachedClient && cachedConfigKey === key) {
    return cachedClient;
  }

  try {
    cachedClient = new QdrantClient({
      url: config.url,
      apiKey: config.apiKey,
      // Compatibility check can fail across local/cloud versions; keep explicit.
      checkCompatibility: false,
      timeout: 15_000,
    });
    cachedConfigKey = key;
    return cachedClient;
  } catch (error) {
    if (error instanceof RagConfigError) {
      throw error;
    }

    throw new QdrantClientError(
      "Failed to initialize the Qdrant client.",
      "CLIENT_INIT_FAILED",
    );
  }
}

/** Test helper — clears the singleton between isolated checks. */
export function resetQdrantClientForTests() {
  cachedClient = null;
  cachedConfigKey = null;
}

export function toQdrantError(error: unknown): QdrantClientError {
  if (error instanceof QdrantClientError) return error;
  if (error instanceof RagConfigError) {
    return new QdrantClientError(error.message, error.code);
  }

  if (error && typeof error === "object") {
    const row = error as {
      status?: number;
      statusText?: string;
      data?: { status?: { error?: string } };
      message?: string;
    };

    const status =
      typeof row.status === "number" ? row.status : undefined;
    const remote =
      row.data?.status?.error ||
      (typeof row.message === "string" ? row.message : undefined);

    // Never echo URLs, API keys, or raw config.
    if (status === 401 || status === 403) {
      return new QdrantClientError(
        "Qdrant rejected the request (authentication/authorization).",
        "AUTH_FAILED",
        status,
      );
    }

    if (status === 404) {
      return new QdrantClientError(
        "Qdrant resource was not found.",
        "NOT_FOUND",
        status,
      );
    }

    if (remote && /fetch failed|ECONNREFUSED|ENOTFOUND|ETIMEDOUT|AbortError|network|socket/i.test(remote)) {
      return new QdrantClientError(
        "Could not reach Qdrant. Check QDRANT_URL and network access.",
        "CONNECTION_FAILED",
        status,
      );
    }

    if (
      error instanceof TypeError ||
      (typeof row.message === "string" && /fetch failed/i.test(row.message))
    ) {
      return new QdrantClientError(
        "Could not reach Qdrant. Check QDRANT_URL and network access.",
        "CONNECTION_FAILED",
        status,
      );
    }

    return new QdrantClientError(
      "Qdrant request failed.",
      "REQUEST_FAILED",
      status,
    );
  }

  return new QdrantClientError(
    "Qdrant request failed.",
    "REQUEST_FAILED",
  );
}
