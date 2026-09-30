/**
 * OpenRouter Cohere rerank provider.
 * Never uses the chat LLM as a fake reranker.
 */

import { getSiteUrl, siteName } from "@/lib/site";
import {
  getRerankConfig,
  OPENROUTER_RERANK_URL,
  type RerankConfig,
} from "@/lib/rag/reranking/config";
import {
  RerankerError,
  type RerankDocument,
  type RerankHit,
  type RerankProvider,
} from "@/lib/rag/reranking/provider";

type OpenRouterRerankResponse = {
  model?: string;
  results?: Array<{
    index?: number;
    relevance_score?: number;
  }>;
  error?: {
    message?: unknown;
    code?: unknown;
  };
};

function formatDocumentText(doc: RerankDocument) {
  return doc.text.slice(0, 4000);
}

export function createDisabledReranker(model: string): RerankProvider {
  return {
    model,
    available: false,
    async rerank() {
      throw new RerankerError(
        "Reranker is disabled or not configured.",
        "DISABLED",
      );
    },
  };
}

export function createOpenRouterReranker(
  config: RerankConfig = getRerankConfig(),
): RerankProvider {
  if (!config.enabled || !config.apiKey) {
    return createDisabledReranker(config.model);
  }

  const apiKey = config.apiKey;
  const model = config.model;

  return {
    model,
    available: true,
    async rerank(query: string, documents: RerankDocument[], topN?: number) {
      if (!query.trim()) {
        throw new RerankerError("Rerank query must not be empty.", "EMPTY_QUERY");
      }
      if (documents.length === 0) return [];

      const limit = topN ?? config.topN ?? documents.length;
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 45_000);

      try {
        const response = await fetch(OPENROUTER_RERANK_URL, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            "HTTP-Referer": getSiteUrl(),
            "X-OpenRouter-Title": `${siteName} RAG Reranker`,
            "X-Title": `${siteName} RAG Reranker`,
          },
          body: JSON.stringify({
            model,
            query: query.trim(),
            documents: documents.map(formatDocumentText),
            top_n: Math.min(limit, documents.length),
          }),
          signal: controller.signal,
        });

        let payload: OpenRouterRerankResponse | null = null;
        try {
          payload = (await response.json()) as OpenRouterRerankResponse;
        } catch {
          payload = null;
        }

        if (!response.ok) {
          const code =
            response.status === 401 || response.status === 403
              ? "AUTH_FAILED"
              : response.status === 429
                ? "RATE_LIMITED"
                : "REQUEST_FAILED";

          console.error("Rerank request failed.", {
            status: response.status,
            code,
          });

          throw new RerankerError(
            code === "AUTH_FAILED"
              ? "Reranker rejected the API key."
              : code === "RATE_LIMITED"
                ? "Reranker rate limit reached. Retry later."
                : "Reranker request failed.",
            code,
            response.status,
          );
        }

        const rows = payload?.results ?? [];
        const hits: RerankHit[] = [];

        for (const row of rows) {
          if (typeof row.index !== "number") continue;
          const doc = documents[row.index];
          if (!doc) continue;
          const score =
            typeof row.relevance_score === "number" &&
            Number.isFinite(row.relevance_score)
              ? row.relevance_score
              : 0;
          hits.push({
            id: doc.id,
            index: row.index,
            score,
          });
        }

        return hits.sort((a, b) => b.score - a.score);
      } catch (error) {
        if (error instanceof RerankerError) throw error;
        if (error instanceof Error && error.name === "AbortError") {
          throw new RerankerError("Reranker request timed out.", "TIMEOUT", 504);
        }
        throw new RerankerError(
          "Reranker is temporarily unavailable.",
          "CONNECTION_FAILED",
        );
      } finally {
        clearTimeout(timeout);
      }
    },
  };
}

export function getRerankProvider(): RerankProvider {
  return createOpenRouterReranker();
}

/**
 * Apply reranker scores onto hybrid candidates.
 * Returns candidates unchanged (with note) when reranker is unavailable.
 */
export async function rerankHybridCandidates(input: {
  query: string;
  candidates: import("@/lib/rag/types").HybridSearchResult[];
  provider?: RerankProvider;
  topN?: number;
}): Promise<{
  results: import("@/lib/rag/types").HybridSearchResult[];
  applied: boolean;
  note?: string;
}> {
  const provider = input.provider ?? getRerankProvider();
  if (!provider.available || input.candidates.length === 0) {
    return {
      results: input.candidates.map((item, index) => ({
        ...item,
        finalRank: index + 1,
      })),
      applied: false,
      note: provider.available
        ? undefined
        : "Reranker disabled or missing API key — returning hybrid order.",
    };
  }

  try {
    const documents = input.candidates.map((candidate) => ({
      id: candidate.id,
      text: [
        `Title: ${candidate.title}`,
        candidate.section ? `Section: ${candidate.section}` : null,
        `Type: ${candidate.documentType}`,
        candidate.text,
      ]
        .filter(Boolean)
        .join("\n"),
    }));

    const hits = await provider.rerank(
      input.query,
      documents,
      input.topN ?? input.candidates.length,
    );

    const byId = new Map(input.candidates.map((c) => [c.id, c]));
    const ordered: import("@/lib/rag/types").HybridSearchResult[] = [];
    const seen = new Set<string>();

    for (const hit of hits) {
      const base = byId.get(hit.id);
      if (!base || seen.has(hit.id)) continue;
      seen.add(hit.id);
      ordered.push({
        ...base,
        rerankScore: hit.score,
        finalRank: ordered.length + 1,
      });
    }

    // Preserve any candidates the reranker omitted, after ranked ones.
    for (const candidate of input.candidates) {
      if (seen.has(candidate.id)) continue;
      ordered.push({
        ...candidate,
        finalRank: ordered.length + 1,
      });
    }

    return { results: ordered, applied: true };
  } catch (error) {
    const message =
      error instanceof RerankerError
        ? error.message
        : "Reranker failed — returning hybrid order.";
    console.error("Rerank stage skipped.", {
      code: error instanceof RerankerError ? error.code : "UNKNOWN",
    });
    return {
      results: input.candidates.map((item, index) => ({
        ...item,
        finalRank: index + 1,
      })),
      applied: false,
      note: message,
    };
  }
}
