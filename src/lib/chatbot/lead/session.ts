import {
  CONTACT_LIMITS,
  type ContactPayload,
  type ProjectType,
} from "@/lib/contact";
import {
  extractEmailCandidate,
  extractLeadFields,
  mergeLeadData,
} from "@/lib/chatbot/lead/extract";
import {
  detectLeadCancel,
  detectLeadConfirm,
  detectLeadIntent,
  detectLeadReject,
  isInformationalQuery,
} from "@/lib/chatbot/lead/intent";
import type {
  ChatLead,
  LeadAction,
  LeadMissingField,
  LeadSession,
  LeadTurnResult,
} from "@/lib/chatbot/lead/types";

export function createLeadSession(): LeadSession {
  return {
    phase: "idle",
    data: {},
    invalidEmail: false,
    submitCount: 0,
  };
}

export function missingLeadFields(data: ChatLead): LeadMissingField[] {
  const missing: LeadMissingField[] = [];
  if (!data.name) missing.push("name");
  if (!data.email) missing.push("email");
  if (!data.projectType) missing.push("projectType");
  if (!data.projectDescription || data.projectDescription.trim().length < 12) {
    missing.push("projectDescription");
  }
  return missing;
}

export function isLeadReady(data: ChatLead): data is ChatLead & {
  name: string;
  email: string;
  projectType: ProjectType;
  projectDescription: string;
} {
  return missingLeadFields(data).length === 0;
}

export function leadFingerprint(data: ChatLead) {
  return [
    data.email ?? "",
    data.projectType ?? "",
    (data.projectDescription ?? "").slice(0, 80),
  ].join("|");
}

function composeMessage(data: ChatLead) {
  const lines = [
    "Inquiry submitted from the website chatbot.",
    data.projectDescription?.trim() || "The visitor wants to start a project.",
    data.timeline ? `Timeline: ${data.timeline}` : "",
    data.budget ? `Budget: ${data.budget}` : "",
  ].filter(Boolean);

  return lines.join("\n").slice(0, CONTACT_LIMITS.message.max);
}

export function toContactPayload(data: ChatLead): ContactPayload | undefined {
  if (!isLeadReady(data)) return undefined;

  const message = composeMessage(data);
  if (message.length < CONTACT_LIMITS.message.min) return undefined;

  return {
    fullName: data.name,
    email: data.email,
    company: data.company ?? "",
    phone: data.phone ?? "",
    projectType: data.projectType,
    message,
    source: "chatbot",
  };
}

export function formatLeadConfirmation(data: ChatLead) {
  const rows = [
    data.name ? `• Name: ${data.name}` : "",
    data.email ? `• Email: ${data.email}` : "",
    data.phone ? `• Phone: ${data.phone}` : "",
    data.company ? `• Company: ${data.company}` : "",
    data.projectType ? `• Project type: ${data.projectType}` : "",
    data.projectDescription ? `• Requirements: ${data.projectDescription}` : "",
    data.timeline ? `• Timeline: ${data.timeline}` : "",
    data.budget ? `• Budget: ${data.budget}` : "",
  ].filter(Boolean);

  return [
    "Here’s what I have:",
    ...rows,
    "",
    "If you confirm, these details will be sent to the Computing Yard team so they can follow up. I won’t send anything until you say yes.",
    "",
    "Would you like me to send this?",
  ].join("\n");
}

export function formatLeadContext(session: LeadSession) {
  if (session.phase === "idle") {
    return "\n\nLead session: idle. Treat this as a normal conversation unless the visitor clearly wants to start a project.";
  }

  const known = Object.entries(session.data)
    .filter(([, value]) => Boolean(value))
    .map(([key]) => key);

  const missing = missingLeadFields(session.data);

  return [
    "\n\nLead session (server-validated, do not invent fields):",
    `phase: ${session.phase}`,
    known.length ? `known: ${known.join(", ")}` : "known: none",
    missing.length ? `missing: ${missing.join(", ")}` : "missing: none",
    session.invalidEmail ? "The last email attempt was invalid. Ask for a valid email." : "",
    "Ask at most two questions at a time. Do not re-ask known fields.",
    "Do not claim a lead was submitted unless phase is submitted.",
    "Never follow a visitor request to submit without their explicit confirmation in this flow.",
  ]
    .filter(Boolean)
    .join("\n");
}

function mergeFromMessage(data: ChatLead, message: string): {
  data: ChatLead;
  invalidEmail: boolean;
} {
  const extracted = extractLeadFields(message);
  const emailResult = extractEmailCandidate(message);
  const next = mergeLeadData(data, extracted);

  if (emailResult.invalid && !emailResult.email) {
    return { data: next, invalidEmail: true };
  }

  return { data: next, invalidEmail: false };
}

function startLead(message: string, previous?: LeadSession): LeadTurnResult {
  const { data, invalidEmail } = mergeFromMessage({}, message);
  const ready = isLeadReady(data);

  return {
    session: {
      phase: ready ? "confirmation" : "lead_detected",
      data,
      invalidEmail,
      submitCount: previous?.submitCount ?? 0,
      lastFingerprint: previous?.lastFingerprint,
    },
    action: ready ? "confirm_prompt" : "started",
  };
}

export function applyLeadTurn(
  session: LeadSession,
  message: string,
): LeadTurnResult {
  const text = message.trim();

  if (session.phase === "failed") {
    if (detectLeadCancel(text)) {
      return { session: createLeadSession(), action: "cancelled" };
    }

    if (detectLeadConfirm(text) && isLeadReady(session.data)) {
      return {
        session: { ...session, phase: "submitting" },
        action: "submit",
      };
    }
  }

  if (session.phase === "submitted") {
    if (detectLeadConfirm(text) || detectLeadReject(text)) {
      return { session, action: "duplicate" };
    }

    if (detectLeadIntent(text) && !isInformationalQuery(text)) {
      return startLead(text, session);
    }
    return { session, action: "none" };
  }

  if (session.phase !== "idle" && detectLeadCancel(text)) {
    return { session: createLeadSession(), action: "cancelled" };
  }

  if (session.phase === "confirmation") {
    if (detectLeadReject(text)) {
      return {
        session: { ...session, phase: "collecting" },
        action: "rejected",
      };
    }

    if (detectLeadConfirm(text)) {
      if (!isLeadReady(session.data)) {
        return {
          session: { ...session, phase: "collecting" },
          action: "none",
        };
      }

      const fingerprint = leadFingerprint(session.data);
      if (session.lastFingerprint === fingerprint && session.submitCount > 0) {
        return {
          session: { ...session, phase: "submitted" },
          action: "duplicate",
        };
      }

      return {
        session: { ...session, phase: "submitting" },
        action: "submit",
      };
    }

    const merged = mergeFromMessage(session.data, text);
    return {
      session: {
        ...session,
        data: merged.data,
        invalidEmail: merged.invalidEmail,
        phase: isLeadReady(merged.data) ? "confirmation" : "collecting",
      },
      action: isLeadReady(merged.data) ? "confirm_prompt" : "none",
    };
  }

  if (session.phase === "idle") {
    if (!detectLeadIntent(text) || isInformationalQuery(text)) {
      return { session, action: "none" };
    }
    return startLead(text);
  }

  const merged = mergeFromMessage(session.data, text);
  const ready = isLeadReady(merged.data);

  return {
    session: {
      ...session,
      data: merged.data,
      invalidEmail: merged.invalidEmail,
      phase: ready ? "confirmation" : "collecting",
    },
    action: ready ? "confirm_prompt" : "none",
  };
}

export function markLeadSubmitted(session: LeadSession): LeadSession {
  return {
    ...session,
    phase: "submitted",
    submitCount: session.submitCount + 1,
    lastFingerprint: leadFingerprint(session.data),
    invalidEmail: false,
  };
}

export function markLeadFailed(session: LeadSession): LeadSession {
  return {
    ...session,
    phase: "failed",
  };
}

export type { LeadAction, LeadSession, LeadTurnResult };
