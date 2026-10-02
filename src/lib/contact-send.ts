import { Resend } from "resend";

import type { ContactPayload } from "@/lib/contact";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function displayValue(value: string) {
  return value.trim() ? value : "Not provided";
}

function sourceLabel(source: ContactPayload["source"]) {
  return source === "chatbot" ? "Website Chatbot" : "Website Contact Form";
}

/** Strip wrapping quotes often pasted into host env UIs (Vercel, etc.). */
function envValue(name: string) {
  const raw = process.env[name]?.trim();
  if (!raw) return undefined;
  if (
    (raw.startsWith('"') && raw.endsWith('"')) ||
    (raw.startsWith("'") && raw.endsWith("'"))
  ) {
    return raw.slice(1, -1).trim();
  }
  return raw;
}

export async function sendContactInquiry(
  payload: ContactPayload,
): Promise<{ ok: true } | { ok: false }> {
  const apiKey = envValue("RESEND_API_KEY");
  const fromEmail = envValue("CONTACT_FROM_EMAIL");
  const toEmail = envValue("CONTACT_RECEIVER_EMAIL") || "zainzeeshan412@gmail.com";

  if (!apiKey || !fromEmail || !fromEmail.includes("@")) {
    console.error("Contact form is missing RESEND_API_KEY or a valid CONTACT_FROM_EMAIL.", {
      hasApiKey: Boolean(apiKey),
      hasFromEmail: Boolean(fromEmail),
    });
    return { ok: false };
  }

  const { fullName, email, company, phone, projectType, message, source } = payload;
  const origin = sourceLabel(source);

  const text = [
    `New ${origin} inquiry`,
    "",
    `Source: ${origin}`,
    `Name: ${fullName}`,
    `Email: ${email}`,
    `Company: ${displayValue(company)}`,
    `Phone: ${displayValue(phone)}`,
    `Project Type: ${projectType}`,
    "",
    "Message:",
    message,
  ].join("\n");

  const html = `
    <h1>New ${escapeHtml(origin)} inquiry</h1>
    <p><strong>Source:</strong> ${escapeHtml(origin)}</p>
    <p><strong>Name:</strong> ${escapeHtml(fullName)}</p>
    <p><strong>Email:</strong> ${escapeHtml(email)}</p>
    <p><strong>Company:</strong> ${escapeHtml(displayValue(company))}</p>
    <p><strong>Phone:</strong> ${escapeHtml(displayValue(phone))}</p>
    <p><strong>Project Type:</strong> ${escapeHtml(projectType)}</p>
    <p><strong>Message:</strong></p>
    <p>${escapeHtml(message).replace(/\n/g, "<br />")}</p>
  `;

  try {
    const resend = new Resend(apiKey);
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      replyTo: email,
      subject: `New ${origin} Inquiry — ${fullName}`,
      text,
      html,
    });

    if (error || !data?.id) {
      console.error("Contact inquiry email was not accepted.", {
        source,
        name: error?.name,
        message: error?.message,
        statusCode:
          error && typeof error === "object" && "statusCode" in error
            ? (error as { statusCode?: number }).statusCode
            : undefined,
        toDomain: toEmail.includes("@") ? toEmail.split("@")[1] : undefined,
        fromUsesOnboarding: fromEmail.includes("onboarding@resend.dev"),
      });
      return { ok: false };
    }

    console.info("Contact inquiry email accepted.", { source });
    return { ok: true };
  } catch (error) {
    console.error("Contact inquiry email failed to send.", {
      source,
      message: error instanceof Error ? error.message : "unknown",
    });
    return { ok: false };
  }
}
