import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import handler, { buildEmail } from './send-confirmation'

describe('buildEmail', () => {
  it('includes the guest name and party size in the plain-text body', () => {
    const { text } = buildEmail({ full_name: 'Asha Patel', email: 'asha@example.com', adults: 2, children: 1 })
    expect(text).toContain('Asha Patel')
    expect(text).toContain('Party size: 3')
  })

  it('mentions the event title and RSVP confirmation in the subject', () => {
    const { subject } = buildEmail({ full_name: 'Asha Patel', email: 'asha@example.com', adults: 1, children: 0 })
    expect(subject).toMatch(/RSVP is confirmed/i)
  })

  it('escapes HTML in the guest name so it cannot inject markup into the email body', () => {
    const { html } = buildEmail({ full_name: '<script>alert(1)</script>', email: 'x@example.com', adults: 1, children: 0 })
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
  table: 'rsvps',
  record: { full_name: 'Asha Patel', email: 'asha@example.com', adults: 2, children: 1 },
}

describe('send-confirmation handler', () => {
  beforeEach(() => {
    vi.stubEnv('RSVP_WEBHOOK_SECRET', SECRET)
    vi.stubEnv('RESEND_API_KEY', 'test-resend-key')
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
    const badPayload = { type: 'INSERT', table: 'rsvps', record: { adults: 1, children: 0 } }
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
    const expected = buildEmail(validPayload.record)
    expect(sentBody.to).toBe('asha@example.com')
    expect(sentBody.from).toBe('HariPrabodham Annakut <rsvp@thedivinespark.de>')
    expect(sentBody.subject).toBe(expected.subject)
    expect(sentBody.text).toBe(expected.text)
    expect(sentBody.html).toBe(expected.html)
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
})
