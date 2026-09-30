/**
 * Typed errors for semantic retrieval. Safe for server logs — no secrets.
 */

export class SemanticSearchError extends Error {
  readonly code: string;
  readonly status?: number;

  constructor(message: string, code: string, status?: number) {
    super(message);
    this.name = "SemanticSearchError";
    this.code = code;
    this.status = status;
  }
}

export function isSemanticSearchError(
  error: unknown,
): error is SemanticSearchError {
  return error instanceof SemanticSearchError;
}
