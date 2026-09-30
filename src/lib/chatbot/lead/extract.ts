import {
  CONTACT_LIMITS,
  isValidEmail,
  type ProjectType,
} from "@/lib/contact";
import type { ChatLead } from "@/lib/chatbot/lead/types";

const EMAIL_FIND = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i;
const NAME_STOP = new Set([
  "a",
  "an",
  "interested",
  "looking",
  "trying",
  "planning",
  "hoping",
  "the",
  "from",
]);

function cleanFragment(value: string) {
  return value.replace(/[.,;:!?]+$/g, "").replace(/\s+/g, " ").trim();
}

function titleCaseName(value: string) {
  return value
    .split(/\s+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

export function inferProjectType(text: string): ProjectType | undefined {
  const value = text.toLowerCase();

  if (/\b(e-?commerce|online store|shopify|woocommerce)\b/.test(value)) {
    return "E-commerce";
  }
  if (/\b(mobile app|ios|android|react native)\b/.test(value)) {
    return "Mobile Development";
  }
  if (/\b(ui\/?ux|user experience|brand(?:ing)?|design)\b/.test(value)) {
    return "UI/UX Design";
  }
  if (/\b(chatbot|ai\b|machine learning|llm)\b/.test(value)) {
    return "AI Solutions";
  }
  if (/\b(backend|api|cloud|server)\b/.test(value)) {
    return "Cloud & Backend";
  }
  if (/\b(website|web app|web development|web site)\b/.test(value)) {
    return "Web Development";
  }

  return undefined;
}

function extractName(text: string): string | undefined {
  const intro = text.match(
    /\b(?:i(?:'m| am)|my name is|this is)\s+([a-z]{2,20})(?:\s+([a-z]{2,20}))?(?=\s+(?:from|at|and|with|,)|[.!]|$)/i,
  );
  if (!intro) return undefined;

  const first = intro[1]?.toLowerCase();
  const second = intro[2]?.toLowerCase();
  if (!first || NAME_STOP.has(first)) return undefined;
  if (second && NAME_STOP.has(second)) {
    return titleCaseName(first);
  }

  const name = titleCaseName([first, second].filter(Boolean).join(" "));
  if (name.length < 2 || name.length > CONTACT_LIMITS.fullName.max) return undefined;
  return name;
}

function extractCompany(text: string): string | undefined {
  const match = text.match(
    /\b(?:from|at|company(?:\s+is)?|we(?:'re| are))\s+([A-Za-z0-9][A-Za-z0-9&.'\-\s]{1,70}?)(?=\s+(?:and|but|who|looking|need|want|,)|[.!]|$)/i,
  );
  if (!match?.[1]) return undefined;

  const company = cleanFragment(match[1]);
  if (company.length < 2 || company.length > CONTACT_LIMITS.company.max) return undefined;
  if (/^(a|an|the|my|our|your)$/i.test(company)) return undefined;
  return company;
}

function extractPhone(text: string): string | undefined {
  const match = text.match(
    /(?:\+|00)?[\d][\d\s().-]{6,}\d/,
  );
  if (!match) return undefined;

  const phone = cleanFragment(match[0]);
  const digits = phone.replace(/\D/g, "");
  if (digits.length < CONTACT_LIMITS.phone.minDigits) return undefined;
  if (phone.length > CONTACT_LIMITS.phone.max) return undefined;
  return phone;
}

function extractBudget(text: string): string | undefined {
  const match = text.match(
    /\bbudget(?:\s+is|\s*:)?\s*([$€£]?\s?\d[\d,]*(?:\.\d+)?(?:\s*(?:k|usd|pkr|eur))?)/i,
  );
  return match?.[1] ? cleanFragment(match[1]).slice(0, 40) : undefined;
}

function extractTimeline(text: string): string | undefined {
  const match = text.match(
    /\b(?:timeline|deadline|need it (?:in|by)|within|asap)\s*[:\-]?\s*([^.]{2,60})/i,
  );
  if (!match) {
    if (/\basap\b/i.test(text)) return "ASAP";
    return undefined;
  }
  return cleanFragment(match[0]).slice(0, 80);
}

export function extractEmailCandidate(text: string): {
  email?: string;
  invalid: boolean;
} {
  const match = text.match(EMAIL_FIND);
  if (!match) {
    return { invalid: text.includes("@") };
  }

  const email = match[0].toLowerCase();
  if (!isValidEmail(email)) {
    return { invalid: true };
  }

  return { email, invalid: false };
}

export function extractLeadFields(message: string): ChatLead {
  const emailResult = extractEmailCandidate(message);
  const projectType = inferProjectType(message);
  const name = extractName(message);
  const company = extractCompany(message);
  const phone = extractPhone(message);
  const budget = extractBudget(message);
  const timeline = extractTimeline(message);

  const lead: ChatLead = {};
  if (name) lead.name = name;
  if (emailResult.email) lead.email = emailResult.email;
  if (company) lead.company = company;
  if (phone) lead.phone = phone;
  if (projectType) lead.projectType = projectType;
  if (budget) lead.budget = budget;
  if (timeline) lead.timeline = timeline;

  const trimmed = message.trim();
  if (trimmed.length >= 12 && (projectType || name || company || /\b(need|want|build|looking)\b/i.test(trimmed))) {
    lead.projectDescription = trimmed.slice(0, CONTACT_LIMITS.message.max);
  }

  return lead;
}

export function mergeLeadData(current: ChatLead, incoming: ChatLead): ChatLead {
  return {
    name: incoming.name || current.name,
    email: incoming.email || current.email,
    phone: incoming.phone || current.phone,
    company: incoming.company || current.company,
    projectType: incoming.projectType || current.projectType,
    projectDescription: incoming.projectDescription
      ? current.projectDescription && incoming.projectDescription !== current.projectDescription
        ? `${current.projectDescription}\n${incoming.projectDescription}`.slice(
            0,
            CONTACT_LIMITS.message.max,
          )
        : incoming.projectDescription
      : current.projectDescription,
    budget: incoming.budget || current.budget,
    timeline: incoming.timeline || current.timeline,
  };
}
