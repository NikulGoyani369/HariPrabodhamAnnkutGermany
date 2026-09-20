import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import handler from '../send-confirmation'
import { buildConfirmationEmail } from '../confirmationEmail'
import { FOOTER } from '../../src/data/data'

describe('buildConfirmationEmail', () => {
  it('includes the guest name and party size in the plain-text body', () => {
    const { text } = buildConfirmationEmail({ name: 'Asha Patel', email: 'asha@example.com', extra_adults: 1, children: 1 })
    expect(text).toContain('Asha Patel')
    expect(text).toContain('Members: 3')
  })

  it("uses the site's font stacks, with fallbacks for clients that drop webfonts", () => {
    const { html } = buildConfirmationEmail({ name: 'Asha Patel', email: 'asha@example.com', extra_adults: 0, children: 0 })
    expect(html).toContain("'GC Commune','Cormorant Garamond',Georgia")
    expect(html).toContain('Cormorant+Garamond')
    // Every stack must end in a face Outlook actually has.
    for (const stack of html.match(/font:[^;"]+/g) ?? []) {
      expect(stack).toMatch(/(serif|sans-serif)$/)
    }
  })

  it('names the event, year and guest in the subject', () => {
    const { subject } = buildConfirmationEmail({ name: 'Asha Patel', email: 'asha@example.com', extra_adults: 0, children: 0 })
    expect(subject).toBe('HariPrabodham Annakoot 2026 Registration Confirmation - Asha Patel')
  })

  it('puts the event details and venue in the HTML body', () => {
    const { html } = buildConfirmationEmail({ name: 'Asha Patel', email: 'asha@example.com', extra_adults: 0, children: 0 })
    expect(html).toContain('24 October 2026')
    expect(html).toContain('Lakeside Convention Center Berlin Tegel')
    expect(html).toContain('Dear Asha Patel,')
    expect(html).toContain('Your registration is confirmed.')
    // Layout and colour must be inline; the <style> block is only allowed to
    // carry font loading, which cannot be expressed inline.
    const styleBlock = html.match(/<style>([\s\S]*?)<\/style>/)?.[1] ?? ''
    expect(styleBlock).not.toMatch(/color|background|padding|margin/)
    expect(html).toContain("font:400 14px/1.7 Inter,")
  })

  it('falls back to a text ornament when no absolute site URL is configured', () => {
    const { html } = buildConfirmationEmail({ name: 'Asha Patel', email: 'asha@example.com', extra_adults: 0, children: 0 })
    // A relative <img src> would render broken in every email client.
    expect(html).not.toContain('<img src="/')
  })

  it('escapes HTML in the guest name so it cannot inject markup into the email body', () => {
    const { html } = buildConfirmationEmail({ name: '<script>alert(1)</script>', email: 'x@example.com', extra_adults: 0, children: 0 })
    expect(html).not.toContain('<script>')
    expect(html).toContain('&lt;script&gt;')
  })
})

const SECRET = 'test-secret'

function makeRequest(body: unknown, headers: Record<string, string> = {}, method = 'POST') {
  return new Request('https://example.com/api/send-confirmation', {
    method,
    headers: { 'content-type': 'application/json', ...headers },
    body: method === 'GET' ? undefined : JSON.stringify(body),
  })
}

const validPayload = {
  type: 'INSERT',
  table: 'registrations',
  record: { name: 'Asha Patel', email: 'asha@example.com', extra_adults: 1, children: 1 },
}

describe('send-confirmation handler', () => {
  beforeEach(() => {
    vi.stubEnv('RSVP_WEBHOOK_SECRET', SECRET)
    vi.stubEnv('RESEND_API_KEY', 'test-resend-key')
    vi.stubEnv('RESEND_EMAIL', 'noreply@mail.thedivinespark.de')
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
  })

  it('rejects non-POST requests with 405', async () => {
    const res = await handler(makeRequest(undefined, { 'x-webhook-secret': SECRET }, 'GET'))
    expect(res.status).toBe(405)
    expect(fetch).not.toHaveBeenCalled()
  })

  it('returns 500 when required env vars are missing', async () => {
    vi.stubEnv('RSVP_WEBHOOK_SECRET', '')
    const res = await handler(makeRequest(validPayload, { 'x-webhook-secret': SECRET }))
    expect(res.status).toBe(500)
    expect(fetch).not.toHaveBeenCalled()
  })

  it('rejects requests missing the webhook secret header with 401', async () => {
    const res = await handler(makeRequest(validPayload))
    expect(res.status).toBe(401)
    expect(fetch).not.toHaveBeenCalled()
  })

  it('rejects requests with the wrong webhook secret with 401', async () => {
    const res = await handler(makeRequest(validPayload, { 'x-webhook-secret': 'wrong' }))
    expect(res.status).toBe(401)
    expect(fetch).not.toHaveBeenCalled()
  })

  it('rejects a payload missing required fields with 400', async () => {
    const badPayload = { type: 'INSERT', table: 'registrations', record: { email: 'asha@example.com' } }
    const res = await handler(makeRequest(badPayload, { 'x-webhook-secret': SECRET }))
    expect(res.status).toBe(400)
    expect(fetch).not.toHaveBeenCalled()
  })

  it('sends the email via Resend with the expected fields on a valid payload', async () => {
    vi.mocked(fetch).mockResolvedValue(new Response(JSON.stringify({ id: 'email-1' }), { status: 200 }))
    const res = await handler(makeRequest(validPayload, { 'x-webhook-secret': SECRET }))
    expect(res.status).toBe(200)
    expect(fetch).toHaveBeenCalledTimes(1)

    const [url, init] = vi.mocked(fetch).mock.calls[0] as [string, RequestInit]
    expect(url).toBe('https://api.resend.com/emails')
    expect((init.headers as Record<string, string>).Authorization).toBe('Bearer test-resend-key')

    const sentBody = JSON.parse(init.body as string)
    const expected = buildConfirmationEmail(validPayload.record)
    expect(sentBody.to).toBe('asha@example.com')
    expect(sentBody.from).toBe('noreply@mail.thedivinespark.de')
    expect(sentBody.subject).toBe(expected.subject)
    expect(sentBody.text).toBe(expected.text)
    expect(sentBody.html).toBe(expected.html)
  })

  it('returns 500 without calling Resend when no sender address is configured', async () => {
    vi.stubEnv('RESEND_EMAIL', '')
    const res = await handler(makeRequest(validPayload, { 'x-webhook-secret': SECRET }))
    expect(res.status).toBe(500)
    expect(fetch).not.toHaveBeenCalled()
  })

  it('sends from RESEND_EMAIL verbatim, with no display name prepended', async () => {
    vi.stubEnv('RESEND_EMAIL', 'hello@mail.thedivinespark.de')
    vi.mocked(fetch).mockResolvedValue(new Response(JSON.stringify({ id: 'email-1' }), { status: 200 }))
    await handler(makeRequest(validPayload, { 'x-webhook-secret': SECRET }))
    const sentBody = JSON.parse((vi.mocked(fetch).mock.calls[0][1] as RequestInit).body as string)
    expect(sentBody.from).toBe('hello@mail.thedivinespark.de')
  })

  it('sets reply_to so replies to a noreply sender still reach the organisers', async () => {
    vi.mocked(fetch).mockResolvedValue(new Response(JSON.stringify({ id: 'email-1' }), { status: 200 }))
    await handler(makeRequest(validPayload, { 'x-webhook-secret': SECRET }))
    const sentBody = JSON.parse((vi.mocked(fetch).mock.calls[0][1] as RequestInit).body as string)
    expect(sentBody.reply_to).toBe(FOOTER.email)
  })

  it('returns 502 and does not throw when Resend responds with an error', async () => {
    vi.mocked(fetch).mockResolvedValue(new Response('rate limited', { status: 429 }))
    const res = await handler(makeRequest(validPayload, { 'x-webhook-secret': SECRET }))
    expect(res.status).toBe(502)
  })

  it('returns 400 for a body that is not valid JSON', async () => {
    const req = new Request('https://example.com/api/send-confirmation', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-webhook-secret': SECRET },
      body: 'not json',
    })
    const res = await handler(req)
    expect(res.status).toBe(400)
    expect(fetch).not.toHaveBeenCalled()
  })

  it('returns 502 and does not throw when fetch rejects with a network error', async () => {
    vi.mocked(fetch).mockRejectedValue(new Error('network down'))
    const res = await handler(makeRequest(validPayload, { 'x-webhook-secret': SECRET }))
    expect(res.status).toBe(502)
  })

  it('returns 200 without calling Resend for non-INSERT webhook events (UPDATE)', async () => {
    const updatePayload = { ...validPayload, type: 'UPDATE' }
    const res = await handler(makeRequest(updatePayload, { 'x-webhook-secret': SECRET }))
    expect(res.status).toBe(200)
    expect(fetch).not.toHaveBeenCalled()
    const body = await res.json()
    expect(body).toEqual({ ok: true, skipped: 'UPDATE' })
  })

  it('returns 200 without calling Resend for non-INSERT webhook events (DELETE)', async () => {
    const deletePayload = { ...validPayload, type: 'DELETE' }
    const res = await handler(makeRequest(deletePayload, { 'x-webhook-secret': SECRET }))
    expect(res.status).toBe(200)
    expect(fetch).not.toHaveBeenCalled()
  })

  it('defaults missing counts to a party of one', async () => {
    vi.mocked(fetch).mockResolvedValue(new Response(JSON.stringify({ id: 'email-1' }), { status: 200 }))
    const payload = { type: 'INSERT', table: 'registrations', record: { name: 'Asha Patel', email: 'asha@example.com' } }
    const res = await handler(makeRequest(payload, { 'x-webhook-secret': SECRET }))
    expect(res.status).toBe(200)
    const sentBody = JSON.parse((vi.mocked(fetch).mock.calls[0][1] as RequestInit).body as string)
    expect(sentBody.text).toContain('Members: 1')
  })

  it('counts the registrant on top of the stored extra adults and children', async () => {
    vi.mocked(fetch).mockResolvedValue(new Response(JSON.stringify({ id: 'email-1' }), { status: 200 }))
    const payload = {
      type: 'INSERT',
      table: 'registrations',
      record: { name: 'Asha Patel', email: 'asha@example.com', extra_adults: 3, children: 4 },
    }
    const res = await handler(makeRequest(payload, { 'x-webhook-secret': SECRET }))
    expect(res.status).toBe(200)
    const sentBody = JSON.parse((vi.mocked(fetch).mock.calls[0][1] as RequestInit).body as string)
    expect(sentBody.text).toContain('Members: 8')
  })
})
