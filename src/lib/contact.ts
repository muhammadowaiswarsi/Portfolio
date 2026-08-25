export const PROJECT_TYPES = [
  "Web Development",
  "Mobile Development",
  "UI/UX Design",
  "AI Solutions",
  "E-commerce",
  "Cloud & Backend",
  "Other",
] as const;

export type ProjectType = (typeof PROJECT_TYPES)[number];

export type ContactPayload = {
  fullName: string;
  email: string;
  company: string;
  phone: string;
  projectType: ProjectType;
  message: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

export const CONTACT_LIMITS = {
  fullName: { min: 2, max: 80 },
  email: { max: 120 },
  company: { max: 80 },
  phone: { minDigits: 7, max: 40 },
  message: { min: 20, max: 2000 },
} as const;

function clean(value: unknown) {
  if (typeof value !== "string") return "";

  return value.replace(CONTROL_CHARS, "").trim();
}

function isProjectType(value: string): value is ProjectType {
  return (PROJECT_TYPES as readonly string[]).includes(value);
}

export function parseContactPayload(
  input: unknown,
): { ok: true; data: ContactPayload } | { ok: false } {
  if (!input || typeof input !== "object") {
    return { ok: false };
  }

  const body = input as Record<string, unknown>;
  const fullName = clean(body.fullName);
  const email = clean(body.email).toLowerCase();
  const company = clean(body.company);
  const phone = clean(body.phone);
  const projectType = clean(body.projectType);
  const message = clean(body.message);

  if (
    fullName.length < CONTACT_LIMITS.fullName.min ||
    fullName.length > CONTACT_LIMITS.fullName.max
  ) {
    return { ok: false };
  }

  if (!EMAIL_PATTERN.test(email) || email.length > CONTACT_LIMITS.email.max) {
    return { ok: false };
  }

  if (company.length > CONTACT_LIMITS.company.max) {
    return { ok: false };
  }

  if (
    phone.length > CONTACT_LIMITS.phone.max ||
    (phone && phone.replace(/\D/g, "").length < CONTACT_LIMITS.phone.minDigits)
  ) {
    return { ok: false };
  }

  if (!isProjectType(projectType)) {
    return { ok: false };
  }

  if (
    message.length < CONTACT_LIMITS.message.min ||
    message.length > CONTACT_LIMITS.message.max
  ) {
    return { ok: false };
  }

  return {
    ok: true,
    data: {
      fullName,
      email,
      company,
      phone,
      projectType,
      message,
    },
  };
}
