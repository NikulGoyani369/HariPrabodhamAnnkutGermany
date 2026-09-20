import { EVENT } from "../src/data/data";

/** The `registrations` row Supabase sends in the webhook payload. */
export interface RegistrationRecord {
  name: string;
  email: string;
  /** Additional adults beyond the registrant. */
  extra_adults: number;
  children: number;
}

export function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function buildEmail(record: RegistrationRecord): { subject: string; text: string; html: string } {
  // The registrant is always one adult on top of extra_adults.
  const partySize = 1 + record.extra_adults + record.children;
  const subject = `Your registration is confirmed — ${EVENT.title}`;

  const text = `Jai Swaminarayan ${record.name},

Your registration for ${EVENT.kicker} ${EVENT.title} — ${EVENT.tagline} is confirmed.

Party size: ${partySize}
Date: ${EVENT.dateLabel}
Venue: ${EVENT.venueName}, ${EVENT.city}
Organiser: ${EVENT.organiser}

We look forward to welcoming you.`;

  const html = `<p>Jai Swaminarayan ${escapeHtml(record.name)},</p>
<p>Your registration for <strong>${escapeHtml(EVENT.kicker)} ${escapeHtml(EVENT.title)} — ${escapeHtml(EVENT.tagline)}</strong> is confirmed.</p>
<ul>
  <li><strong>Party size:</strong> ${partySize}</li>
  <li><strong>Date:</strong> ${escapeHtml(EVENT.dateLabel)}</li>
  <li><strong>Venue:</strong> ${escapeHtml(EVENT.venueName)}, ${escapeHtml(EVENT.city)}</li>
  <li><strong>Organiser:</strong> ${escapeHtml(EVENT.organiser)}</li>
</ul>
<p>We look forward to welcoming you.</p>`;

  return { subject, text, html };
}

export const config = { runtime: "edge" };

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  if (!process.env.RSVP_WEBHOOK_SECRET || !process.env.RESEND_API_KEY) {
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

  const { subject, text, html } = buildEmail({
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
        from: "HariPrabodham Annakut <rsvp@thedivinespark.de>",
        to: record.email,
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
