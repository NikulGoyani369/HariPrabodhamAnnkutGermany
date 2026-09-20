import {
  buildConfirmationEmail,
  type RegistrationRecord,
} from "./confirmationEmail";

export { buildConfirmationEmail, escapeHtml } from "./confirmationEmail";
export type { RegistrationRecord } from "./confirmationEmail";

import { FOOTER } from "../src/data/data";

export const config = { runtime: "edge" };

/**
 * Sender address, from RESEND_EMAIL, used verbatim so the inbox shows the
 * address itself rather than a display name. Resend verifies domains exactly,
 * so this must sit on the domain verified in the Resend dashboard — a
 * subdomain such as mail.example.de is NOT covered by a verified example.de.
 */
function fromAddress(): string | null {
  return process.env.RESEND_EMAIL?.trim() || null;
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const from = fromAddress();
  // Fail loudly rather than sending from an unverified domain, which Resend
  // rejects and which quietly costs the registrant their confirmation.
  if (!process.env.RSVP_WEBHOOK_SECRET || !process.env.RESEND_API_KEY || !from) {
    return new Response("Not configured", { status: 500 });
  }

  const secret = req.headers.get("x-webhook-secret");
  if (secret !== process.env.RSVP_WEBHOOK_SECRET) {
    return new Response("Unauthorized", { status: 401 });
  }

  let payload: { type?: string; table?: string; record?: Partial<RegistrationRecord> };
  try {
    payload = await req.json();
  } catch {
    return new Response(JSON.stringify({ ok: false, error: "Invalid JSON" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  if (payload.type && payload.type !== "INSERT") {
    return new Response(JSON.stringify({ ok: true, skipped: payload.type }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  }

  const record = payload.record;
  if (!record || !record.email || !record.name) {
    return new Response(JSON.stringify({ ok: false, error: "Missing required fields" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  const { subject, text, html } = buildConfirmationEmail({
    name: record.name,
    email: record.email,
    extra_adults: record.extra_adults ?? 0,
    children: record.children ?? 0,
  });

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: record.email,
        // noreply senders cannot take replies, so point them at the organisers.
        reply_to: FOOTER.email,
        subject,
        text,
        html,
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error("Resend send failed", res.status, body);
      return new Response(JSON.stringify({ ok: false, error: "Email provider error" }), {
        status: 502,
        headers: { "content-type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { "content-type": "application/json" },
    });
  } catch (error) {
    console.error("Resend send failed", error);
    return new Response(JSON.stringify({ ok: false, error: "Email provider error" }), {
      status: 502,
      headers: { "content-type": "application/json" },
    });
  }
}
