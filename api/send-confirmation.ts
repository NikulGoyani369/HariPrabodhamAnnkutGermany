import { EVENT } from "../src/data/data";

export interface RsvpRecord {
  full_name: string;
  email: string;
  adults: number;
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

export function buildEmail(record: RsvpRecord): { subject: string; text: string; html: string } {
  const partySize = record.adults + record.children;
  const subject = `Your RSVP is confirmed — ${EVENT.title}`;

  const text = `Jai Swaminarayan ${record.full_name},

Your RSVP for ${EVENT.kicker} ${EVENT.title} — ${EVENT.tagline} is confirmed.

Party size: ${partySize}
Date: ${EVENT.dateLabel}
Venue: ${EVENT.venueName}, ${EVENT.city}
Organiser: ${EVENT.organiser}

We look forward to welcoming you.`;

  const html = `<p>Jai Swaminarayan ${escapeHtml(record.full_name)},</p>
<p>Your RSVP for <strong>${escapeHtml(EVENT.kicker)} ${escapeHtml(EVENT.title)} — ${escapeHtml(EVENT.tagline)}</strong> is confirmed.</p>
<ul>
  <li><strong>Party size:</strong> ${partySize}</li>
  <li><strong>Date:</strong> ${escapeHtml(EVENT.dateLabel)}</li>
  <li><strong>Venue:</strong> ${escapeHtml(EVENT.venueName)}, ${escapeHtml(EVENT.city)}</li>
  <li><strong>Organiser:</strong> ${escapeHtml(EVENT.organiser)}</li>
</ul>
<p>We look forward to welcoming you.</p>`;

  return { subject, text, html };
}
