import { buildConfirmationEmail } from "./confirmationEmail";

export const config = { runtime: "edge" };

function count(value: string | null, fallback: number): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
}

/**
 * Renders the confirmation email in the browser so the template can be
 * iterated on without sending mail. Dev and preview deployments only.
 *
 * /api/email-preview?name=Asha%20Patel&adults=2&children=1
 */
export default async function handler(req: Request): Promise<Response> {
  if (process.env.VERCEL_ENV === "production") {
    return new Response("Not found", { status: 404 });
  }

  const params = new URL(req.url).searchParams;
  const { html } = buildConfirmationEmail({
    name: params.get("name") ?? "Asha Patel",
    email: "preview@example.com",
    extra_adults: count(params.get("adults"), 2),
    children: count(params.get("children"), 1),
  });

  return new Response(html, {
    headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" },
  });
}
