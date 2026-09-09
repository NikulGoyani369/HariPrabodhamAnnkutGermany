import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest'

// The gate reads import.meta.env at call time, so each test stubs the two
// vars then re-imports the module fresh.
async function gateWith(open: string, close: string) {
  vi.stubEnv('VITE_RSVP_OPEN_AT', open)
  vi.stubEnv('VITE_RSVP_CLOSE_AT', close)
  vi.resetModules()
  return await import('./registrationGate')
}

beforeEach(() => {
  vi.useFakeTimers()
  vi.setSystemTime(new Date('2026-06-15T12:00:00Z'))
})
afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllEnvs()
})

describe('isRegistrationOpenNow', () => {
  it('is open when both bounds are blank', async () => {
    const { isRegistrationOpenNow } = await gateWith('', '')
    expect(isRegistrationOpenNow()).toBe(true)
  })

  it('is closed before the open instant', async () => {
    const { isRegistrationOpenNow } = await gateWith('2026-07-01T00:00:00Z', '')
    expect(isRegistrationOpenNow()).toBe(false)
  })

  it('is open within the window', async () => {
    const { isRegistrationOpenNow } = await gateWith('2026-06-01T00:00:00Z', '2026-07-01T00:00:00Z')
    expect(isRegistrationOpenNow()).toBe(true)
  })

  it('is closed after the close instant', async () => {
    const { isRegistrationOpenNow } = await gateWith('', '2026-06-01T00:00:00Z')
    expect(isRegistrationOpenNow()).toBe(false)
  })

  it('treats a blank open bound as "already open"', async () => {
    const { isRegistrationOpenNow } = await gateWith('', '2026-12-01T00:00:00Z')
    expect(isRegistrationOpenNow()).toBe(true)
  })
})
