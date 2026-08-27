import { Resend } from "resend";

import { parseContactPayload } from "@/lib/contact";

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

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false }, { status: 400 });
  }

  const parsed = parseContactPayload(body);

  if (!parsed.ok) {
    return Response.json({ ok: false }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY?.trim();
  const fromEmail = process.env.CONTACT_FROM_EMAIL?.trim();
  const toEmail =
    process.env.CONTACT_RECEIVER_EMAIL?.trim() || "zainzeeshan412@gmail.com";

  if (!apiKey || !fromEmail || !fromEmail.includes("@")) {
    console.error("Contact form is missing RESEND_API_KEY or a valid CONTACT_FROM_EMAIL.");
    return Response.json({ ok: false }, { status: 500 });
  }

  const { fullName, email, company, phone, projectType, message } = parsed.data;

  const text = [
    "New website inquiry",
    "",
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
    <h1>New website inquiry</h1>
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
      subject: `New Website Inquiry — ${fullName}`,
      text,
      html,
    });

    if (error || !data?.id) {
      console.error("Contact form email was not accepted.", {
        name: error?.name,
        message: error?.message,
      });
      return Response.json({ ok: false }, { status: 500 });
    }

    console.info("Contact form email accepted.");
    return Response.json({ ok: true });
  } catch {
    console.error("Contact form email failed to send.");
    return Response.json({ ok: false }, { status: 500 });
  }
}
