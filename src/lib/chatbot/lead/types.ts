import type { ProjectType } from "@/lib/contact";

export type LeadPhase =
  | "idle"
  | "lead_detected"
  | "collecting"
  | "confirmation"
  | "submitting"
  | "submitted"
  | "failed";

export type ChatLead = {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  projectType?: ProjectType;
  projectDescription?: string;
  budget?: string;
  timeline?: string;
};

export type LeadField = keyof ChatLead;

export type LeadSession = {
  phase: LeadPhase;
  data: ChatLead;
  invalidEmail: boolean;
  submitCount: number;
  lastFingerprint?: string;
};

export type LeadAction =
  | "none"
  | "started"
  | "confirm_prompt"
  | "submit"
  | "duplicate"
  | "rejected"
  | "cancelled";

export type LeadTurnResult = {
  session: LeadSession;
  action: LeadAction;
};

export const LEAD_MISSING_FIELDS = [
  "name",
  "email",
  "projectType",
  "projectDescription",
] as const;

export type LeadMissingField = (typeof LEAD_MISSING_FIELDS)[number];
