import { describe, it, expect } from 'vitest'
import { buildEmail } from './send-confirmation'

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
