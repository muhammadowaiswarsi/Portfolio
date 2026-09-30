import type { KnowledgeKind } from "@/lib/chatbot/types";

const STOP_WORDS = new Set([
  "about",
  "and",
  "api",
  "are",
  "can",
  "computing",
  "does",
  "for",
  "from",
  "have",
  "how",
  "ignore",
  "instructions",
  "into",
  "key",
  "keys",
  "many",
  "me",
  "please",
  "provide",
  "provided",
  "secret",
  "some",
  "tell",
  "the",
  "their",
  "them",
  "they",
  "what",
  "which",
  "who",
  "with",
  "work",
  "your",
  "yard",
  "you",
]);

const TITLE_WEAK_WORDS = new Set([
  "build",
  "business",
  "custom",
  "help",
  "need",
  "needs",
  "our",
  "specifically",
]);

const SMALL_TALK =
  /^(hi|hello|hey|howdy|thanks|thank you|good morning|good afternoon|good evening|yo)[\s!.?]*$/i;

export function isSmallTalk(query: string) {
  return SMALL_TALK.test(query.trim());
}

export function tokenize(value: string) {
  return value
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length > 2 && !STOP_WORDS.has(token));
}

export function detectIntentBoosts(query: string): Partial<Record<KnowledgeKind, number>> {
  const q = query.toLowerCase();
  const boosts: Partial<Record<KnowledgeKind, number>> = {};

  if (/\b(service|services|offer|offering|provide|capabilities|do you build|what do you)\b/.test(q)) {
    boosts.service = 5;
    boosts.faq = 2;
  }

  if (/\b(project|projects|portfolio|case study|case studies|your work)\b/.test(q)) {
    boosts.project = 5;
  }

  if (/\b(blog|blogs|article|articles|post|posts|insights)\b/.test(q)) {
    boosts.blog = 5;
  }

  if (/\b(testimonial|testimonials|review|reviews|client|clients|feedback)\b/.test(q)) {
    boosts.testimonial = 5;
  }

  if (/\b(tech|technology|technologies|stack|framework|react|next|node|aws)\b/.test(q)) {
    boosts.technology = 4;
  }

  if (/\b(website|websites|web app|web development|mobile app|chatbot|seo|ui\/?ux)\b/.test(q)) {
    boosts.service = Math.max(boosts.service ?? 0, 5);
  }

  if (/\b(discuss a project|start a project|build a website|build an app|new project)\b/.test(q)) {
    boosts.company = Math.max(boosts.company ?? 0, 4);
    boosts.service = Math.max(boosts.service ?? 0, 3);
  }

  if (/\b(contact|email|phone|address|get started)\b/.test(q)) {
    boosts.company = Math.max(boosts.company ?? 0, 5);
  }

  return boosts;
}

export function titleMatchScore(title: string, terms: string[]) {
  const value = title.toLowerCase();
  let score = 0;

  for (const term of terms) {
    if (TITLE_WEAK_WORDS.has(term)) continue;
    if (value === term) score += 8;
    else if (value.includes(term)) score += 5;
  }

  return score;
}

export function primaryIntent(
  boosts: Partial<Record<KnowledgeKind, number>>,
): KnowledgeKind | null {
  let best: KnowledgeKind | null = null;
  let bestScore = 0;

  for (const [kind, value] of Object.entries(boosts) as Array<
    [KnowledgeKind, number]
  >) {
    if (value > bestScore) {
      best = kind;
      bestScore = value;
    }
  }

  return bestScore > 0 ? best : null;
}

export function scoreDocument(
  document: { title: string; content: string; kind: KnowledgeKind },
  terms: string[],
  boosts: Partial<Record<KnowledgeKind, number>>,
) {
  const content = document.content.toLowerCase();
  let score = (boosts[document.kind] ?? 0) + titleMatchScore(document.title, terms);

  for (const term of terms) {
    if (content.includes(term)) score += 1;
  }

  return score;
}
