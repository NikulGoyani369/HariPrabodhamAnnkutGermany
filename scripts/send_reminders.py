#!/usr/bin/env python3
"""
Send the Annakut 2026 reminder email to every confirmed attendee in a YDS
registration CSV export, via Resend. Standard library only — nothing to install.

    python3 send_reminders.py registrations.csv                      # dry run: lists who would get it
    python3 send_reminders.py registrations.csv --preview out.html   # writes one email to open in a browser
    python3 send_reminders.py registrations.csv --test you@gmail.com # sends one sample, only to you
    python3 send_reminders.py registrations.csv --send               # sends to everyone

The Resend API key is read from the RESEND_API_KEY environment variable
(export RESEND_API_KEY=re_xxx). If it is not set, it is asked for when sending.

Every successful send is appended to <csv>.sent.log, and addresses in that
log are skipped next time — so an interrupted run can simply be re-run
without anyone getting the reminder twice.
"""

import argparse
import csv
import getpass
import html
import json
import os
import re
import ssl
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime, timezone

# ─── Settings — edit these ───────────────────────────────────────────────────

# Must be on a domain verified in your Resend dashboard.
FROM_EMAIL = "noreply@mail.thedivinespark.de"
REPLY_TO = "info@yds-germany.de"

EVENT_KICKER = "HariPrabodham"
EVENT_TITLE = "Annakut 2026"
EVENT_TAGLINE = "The Divine Spark"
EVENT_WEEKDAY = "Saturday"
EVENT_DATE_LABEL = "24 October 2026"
EVENT_TIME = "05:00 PM to 07:30 PM"
VENUE = "Lakeside Convention Center Berlin Tegel, Wilkestraße 1, 13507 Berlin"
# Leave empty here — never commit the key. Set it in your shell instead:
#   export RESEND_API_KEY=re_xxx
# or leave it unset and the script asks for it (input is hidden).
RESEND_API_KEY = os.environ.get("RESEND_API_KEY", "")

GOOD_TO_KNOW = [
    "Please arrive 15 minutes early so we can begin on time.",
    "Annakut Prasad (dinner) will be served after the event.",
]

FOOTER_LEGAL = "© 2026 Yogi Divine Society e.V. Germany. All rights reserved."

# "Annakut Utsav – The Divine Spark" header artwork (must be publicly reachable).
TITLE_IMAGE_URL = "https://yds-germany.de/wp-content/uploads/2026/10/Title-for-Email-confirmation.png"

# ─────────────────────────────────────────────────────────────────────────────

RESEND_URL = "https://api.resend.com/emails"
SEND_DELAY = 0.6  # seconds between sends, under Resend's default 2 requests/second
MAPS_URL = "https://www.google.com/maps/search/?api=1&query=" + urllib.parse.quote(VENUE)
EMAIL_RE = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")

# Palette mirrors the website. Email clients strip <style>, so all of it is inlined.
INK, INK_SOFT, INK_MUTED = "#4A3728", "#7A6450", "#9C8974"
IVORY, SHELL, SAFFRON, GOLD = "#FBF4E9", "#EFE0CD", "#E98A3C", "#C9A25A"
SERIF = "'Cormorant Garamond',Georgia,'Times New Roman',serif"
SANS = "Inter,-apple-system,'Helvetica Neue',Helvetica,Arial,sans-serif"


# ─── CSV ─────────────────────────────────────────────────────────────────────

def to_count(value):
    try:
        n = int(float((value or "").strip()))
    except ValueError:
        return 0
    return max(n, 0)


def load_recipients(csv_path):
    """Confirmed, de-duplicated attendees, plus a list of skipped rows with reasons."""
    with open(csv_path, newline="", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        # Header names are matched case-insensitively and ignoring surrounding spaces.
        reader.fieldnames = [(h or "").strip().lower() for h in reader.fieldnames or []]
        required = ["registration id", "registration status", "attendee name",
                    "attendee last name", "attendee email"]
        missing = [c for c in required if c not in reader.fieldnames]
        if missing:
            sys.exit(f"CSV is missing column(s): {', '.join(missing)}")

        recipients, skipped, seen = [], [], set()
        for row in reader:
            reg_id = (row.get("registration id") or "").strip()
            email = (row.get("attendee email") or "").strip()
            status = (row.get("registration status") or "").strip().lower()
            label = f"#{reg_id} {email or '(no email)'}"

            if not reg_id and not email:
                continue  # blank line
            if status != "confirmed":
                skipped.append(f"{label} — status \"{status}\"")
                continue
            if not EMAIL_RE.match(email):
                skipped.append(f"{label} — invalid email")
                continue
            if email.lower() in seen:
                skipped.append(f"{label} — duplicate email")
                continue
            seen.add(email.lower())

            adults = to_count(row.get("adults"))
            children = to_count(row.get("children"))
            recipients.append({
                "id": reg_id,
                "name": f"{(row.get('attendee name') or '').strip()} "
                        f"{(row.get('attendee last name') or '').strip()}".strip() or "Devotee",
                "email": email,
                "members": max(adults, 1) + children if adults + children else None,
            })
    return recipients, skipped


def read_sent_log(path):
    if not os.path.exists(path):
        return set()
    with open(path, encoding="utf-8") as f:
        return {line.split("\t")[0].strip().lower() for line in f if line.strip()}


# ─── Email template ──────────────────────────────────────────────────────────

def esc(value):
    return html.escape(str(value), quote=True)


def build_email(r):
    """Returns (subject, text, html) for one recipient."""
    subject = f"Reminder: {EVENT_KICKER} {EVENT_TITLE} – {EVENT_WEEKDAY}, {EVENT_DATE_LABEL}"
    preheader = f"See you on {EVENT_WEEKDAY}, {EVENT_DATE_LABEL} · {EVENT_TIME} · {VENUE.split(',')[0]}"

    details = [("Name", r["name"]), ("Registration", f"#{r['id']}")]
    if r["members"]:
        details.append(("Members", str(r["members"])))
    details += [("Date", f"{EVENT_WEEKDAY}, {EVENT_DATE_LABEL}"), ("Time", EVENT_TIME), ("Venue", VENUE)]

    text = "\n".join([
        f"Jay Swaminarayan {r['name']},",
        "",
        f"A gentle reminder: {EVENT_KICKER} {EVENT_TITLE} – {EVENT_TAGLINE} is almost here.",
        "",
        f"{EVENT_WEEKDAY}, {EVENT_DATE_LABEL}",
        "",
        *[f"{(label + ':').ljust(14)}{value}" for label, value in details],
        "",
        "Good to know",
        *[f"- {line}" for line in GOOD_TO_KNOW],
        "",
        f"Directions: {MAPS_URL}",
        "",
        f"Questions? Just reply to this email or write to {REPLY_TO}.",
        "",
        FOOTER_LEGAL,
    ])

    detail_rows = "\n".join(
        f'<tr><td style="padding:7px 0;font:600 11px/1.5 {SANS};letter-spacing:.1em;text-transform:uppercase;'
        f'color:{INK_MUTED};white-space:nowrap;vertical-align:top;">{esc(label)}</td>'
        f'<td style="padding:7px 0 7px 18px;font:400 15px/1.55 {SANS};color:{INK};">{esc(value)}</td></tr>'
        for label, value in details
    )
    tips = "\n".join(
        f'<div style="font:400 14px/1.7 {SANS};color:{INK_SOFT};">'
        f'<span style="color:{SAFFRON};">&#10022;</span>&nbsp; {esc(line)}</div>'
        for line in GOOD_TO_KNOW
    )

    body = f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<meta name="x-apple-disable-message-reformatting" />
<title>{esc(subject)}</title>
</head>
<body style="margin:0;padding:0;background:{IVORY};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">{esc(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:{IVORY};">
<tr><td align="center" style="padding:32px 16px;">

<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;background:#FFFFFF;border:1px solid {SHELL};border-radius:18px;overflow:hidden;">

  <tr><td align="center" style="background:{SAFFRON};padding:10px 16px;font:600 11px/1.4 {SANS};letter-spacing:.2em;text-transform:uppercase;color:#FFFFFF;">Event Reminder</td></tr>

  <tr><td align="center" style="padding:28px 32px 4px;">
    <img src="{esc(TITLE_IMAGE_URL)}" width="420" alt="{esc(f"{EVENT_KICKER} Germany – {EVENT_TITLE} – {EVENT_TAGLINE}")}" style="display:block;margin:0 auto;border:0;outline:none;width:420px;max-width:100%;height:auto;" />
  </td></tr>

  <tr><td style="padding:24px 32px 0;">
    <p style="margin:0 0 8px;font:400 15px/1.7 {SANS};color:{INK};">Jay Swaminarayan {esc(r["name"])},</p>
    <p style="margin:0 0 20px;font:400 14px/1.7 {SANS};color:{INK_SOFT};">A gentle reminder that <strong style="color:{INK};">{esc(f"{EVENT_KICKER} {EVENT_TITLE}")}</strong> is almost here. We look forward to welcoming you and your family for darshan, kirtan and prasad.</p>
  </td></tr>

  <tr><td style="padding:0 32px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:{IVORY};border:1px solid {SHELL};border-radius:14px;">
      <tr><td style="padding:16px 20px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
{detail_rows}
        </table>
      </td></tr>
    </table>
  </td></tr>

  <tr><td align="center" style="padding:24px 32px 0;">
    <a href="{esc(MAPS_URL)}" style="display:inline-block;background:{SAFFRON};color:#FFFFFF;font:600 14px/1 {SANS};text-decoration:none;padding:14px 28px;border-radius:999px;">Get Directions</a>
  </td></tr>

  <tr><td style="padding:28px 32px 0;">
    <div style="font:600 11px/1.4 {SANS};letter-spacing:.16em;text-transform:uppercase;color:{GOLD};padding-bottom:8px;">Good to know</div>
{tips}
  </td></tr>

  <tr><td align="center" style="padding:28px 32px 32px;">
    <div style="height:1px;background:{SHELL};font-size:0;line-height:0;margin-bottom:16px;">&nbsp;</div>
    <div style="font:400 13px/1.7 {SANS};color:{INK_MUTED};">Questions? Reply to this email or write to
      <a href="mailto:{esc(REPLY_TO)}" style="color:{INK_SOFT};text-decoration:underline;">{esc(REPLY_TO)}</a>
    </div>
    <div style="font:400 12px/1.7 {SANS};color:{INK_MUTED};padding-top:10px;">{esc(FOOTER_LEGAL)}</div>
  </td></tr>

</table>

</td></tr>
</table>
</body>
</html>"""
    return subject, text, body


# ─── Sending ─────────────────────────────────────────────────────────────────

def ssl_context():
    """
    python.org installs of Python on macOS ship without trusted certificates,
    which fails every HTTPS call with CERTIFICATE_VERIFY_FAILED. Fall back to
    certifi or the certificates macOS itself provides.
    """
    try:
        import certifi
        return ssl.create_default_context(cafile=certifi.where())
    except ImportError:
        pass
    if os.path.exists("/etc/ssl/cert.pem"):
        return ssl.create_default_context(cafile="/etc/ssl/cert.pem")
    return ssl.create_default_context()


SSL_CONTEXT = ssl_context()


def send_one(api_key, to, r):
    """Sends one reminder. Retries on rate limiting; raises on any other Resend error."""
    subject, text, body = build_email(r)
    payload = json.dumps({
        "from": FROM_EMAIL, "to": [to], "reply_to": REPLY_TO,
        "subject": subject, "text": text, "html": body,
    }).encode("utf-8")

    for attempt in range(5):
        req = urllib.request.Request(
            RESEND_URL, data=payload, method="POST",
            headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json",
                     "User-Agent": "annakut-reminders/1.0"},
        )
        try:
            with urllib.request.urlopen(req, timeout=60, context=SSL_CONTEXT) as res:
                res.read()
            return
        except urllib.error.HTTPError as e:
            detail = e.read().decode("utf-8", "replace")
            if e.code == 429 and attempt < 4:
                time.sleep(2 ** attempt)
                continue
            raise RuntimeError(f"Resend responded {e.code}: {detail}") from None


def get_api_key():
    key = RESEND_API_KEY.strip() or getpass.getpass("Resend API key: ").strip()
    if not key:
        sys.exit("No API key given.")
    return key


def main():
    parser = argparse.ArgumentParser(description="Send the Annakut reminder email to confirmed attendees.")
    parser.add_argument("csv", help="YDS registration CSV export")
    mode = parser.add_mutually_exclusive_group()
    mode.add_argument("--send", action="store_true", help="send to everyone (default is a dry run)")
    mode.add_argument("--test", metavar="EMAIL", help="send one sample to this address only")
    mode.add_argument("--preview", metavar="FILE", help="write one rendered email to an HTML file")
    args = parser.parse_args()

    recipients, skipped = load_recipients(args.csv)
    log_path = f"{args.csv}.sent.log"
    already = read_sent_log(log_path)
    pending = [r for r in recipients if r["email"].lower() not in already]

    print(f"{len(recipients)} confirmed attendee(s) in {args.csv}")
    if already:
        print(f"{len(recipients) - len(pending)} already reminded (per {log_path})")
    for s in skipped:
        print(f"  skipped {s}")

    if args.preview:
        if not recipients:
            sys.exit("No confirmed attendees to preview.")
        with open(args.preview, "w", encoding="utf-8") as f:
            f.write(build_email(recipients[0])[2])
        print(f"Wrote preview for {recipients[0]['email']} to {args.preview}")
        return

    if args.test:
        if not recipients:
            sys.exit("No confirmed attendees to base the sample on.")
        send_one(get_api_key(), args.test, recipients[0])
        print(f"Sent sample (rendered for {recipients[0]['email']}) to {args.test}")
        return

    if not args.send:
        print(f"\nDry run — {len(pending)} email(s) would be sent from {FROM_EMAIL}:")
        for r in pending:
            print(f"  #{r['id']}  {r['name']} <{r['email']}>")
        print("\nRe-run with --test <your-email> to send yourself a sample, or --send to send for real.")
        return

    if not pending:
        print("Nothing to send.")
        return
    answer = input(f"\nSend the reminder to {len(pending)} people from {FROM_EMAIL}? Type 'yes': ")
    if answer.strip().lower() != "yes":
        sys.exit("Cancelled.")

    api_key = get_api_key()
    sent = 0
    for r in pending:
        try:
            send_one(api_key, r["email"], r)
        except Exception as e:  # noqa: BLE001 — report and stop; the log makes re-runs safe
            print(f"\nSending to #{r['id']} {r['email']} failed: {e}", file=sys.stderr)
            sys.exit(f"Sent {sent} of {len(pending)}. Fix the problem and re-run; sent addresses are skipped.")
        stamp = datetime.now(timezone.utc).isoformat(timespec="seconds")
        with open(log_path, "a", encoding="utf-8") as f:
            f.write(f"{r['email']}\t{r['id']}\t{stamp}\n")
        sent += 1
        print(f"Sent {sent}/{len(pending)}  {r['email']}")
        time.sleep(SEND_DELAY)
    print(f"Done. {sent} reminder(s) sent; log at {log_path}")


if __name__ == "__main__":
    main()
