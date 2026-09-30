/**
 * Deterministic conversation titles from the first meaningful user message.
 * No extra LLM call.
 */

const STOP_PREFIX =
  /^(hi|hello|hey|thanks|thank you|please|can you|could you|would you|i want|i need|tell me|what about)\b[\s,]*/i;

export function generateConversationTitle(message: string) {
  let value = message.replace(/\s+/g, " ").trim();
  if (!value) return "New conversation";

  value = value.replace(STOP_PREFIX, "").trim() || value;

  // Strip trailing punctuation for titles
  value = value.replace(/[?.!]+$/g, "").trim();

  if (value.length <= 48) {
    return value || "New conversation";
  }

  const sliced = value.slice(0, 48);
  const lastSpace = sliced.lastIndexOf(" ");
  const clipped = lastSpace > 20 ? sliced.slice(0, lastSpace) : sliced;
  return `${clipped.trim()}…`;
}
