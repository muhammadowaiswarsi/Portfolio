/**
 * Anonymous chat session ownership via httpOnly cookie.
 * Cookie holds the raw token; Mongo stores only SHA-256 hash.
 */

import { createHash, randomBytes } from "node:crypto";

import { cookies } from "next/headers";

import { getChatDb } from "@/lib/chatbot/persistence/client";
import type { StoredChatSession } from "@/lib/chatbot/persistence/types";

export const CHAT_SESSION_COOKIE = "cy_chat_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 180; // 180 days

export function hashSessionToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function createSessionToken() {
  return randomBytes(32).toString("base64url");
}

function cookieOptions() {
  const secure = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure,
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  };
}

export async function ensureChatSession(): Promise<{
  sessionId: string;
  token: string;
  isNew: boolean;
}> {
  const jar = await cookies();
  const existing = jar.get(CHAT_SESSION_COOKIE)?.value?.trim();
  const db = await getChatDb();
  const sessions = db.collection<StoredChatSession>("chat_sessions");

  if (existing && existing.length >= 24) {
    const tokenHash = hashSessionToken(existing);
    const found = await sessions.findOne({ tokenHash });
    if (found) {
      await sessions.updateOne(
        { _id: found._id },
        { $set: { updatedAt: new Date() } },
      );
      // Refresh cookie max-age
      jar.set(CHAT_SESSION_COOKIE, existing, cookieOptions());
      return { sessionId: found._id, token: existing, isNew: false };
    }
  }

  const token = createSessionToken();
  const tokenHash = hashSessionToken(token);
  const now = new Date();
  const sessionId = crypto.randomUUID();

  await sessions.insertOne({
    _id: sessionId,
    tokenHash,
    createdAt: now,
    updatedAt: now,
  });

  jar.set(CHAT_SESSION_COOKIE, token, cookieOptions());
  return { sessionId, token, isNew: true };
}

export async function requireChatSession(): Promise<{ sessionId: string }> {
  const jar = await cookies();
  const token = jar.get(CHAT_SESSION_COOKIE)?.value?.trim();
  if (!token) {
    throw new Error("CHAT_SESSION_REQUIRED");
  }

  const db = await getChatDb();
  const found = await db.collection<StoredChatSession>("chat_sessions").findOne({
    tokenHash: hashSessionToken(token),
  });

  if (!found) {
    throw new Error("CHAT_SESSION_INVALID");
  }

  return { sessionId: found._id };
}
