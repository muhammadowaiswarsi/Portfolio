import { parseContactPayload } from "@/lib/contact";
import { sendContactInquiry } from "@/lib/contact-send";

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

  const sent = await sendContactInquiry(parsed.data);

  if (!sent.ok) {
    return Response.json({ ok: false }, { status: 500 });
  }

  return Response.json({ ok: true });
}
