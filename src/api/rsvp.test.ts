import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock the supabase module
vi.mock('../lib/supabase', () => ({
  supabase: {
    from: vi.fn(),
  },
}))

import { submitRsvp, normaliseName, type RsvpInput } from './rsvp'
import { supabase } from '../lib/supabase'

const base: RsvpInput = {
  fullName: '  Asha Patel ',
  email: 'asha@example.com',
  dialCode: '+49',
  phone: '030 123-4567',
  extraAdults: 1,
  children: 2,
  consent: true,
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

let mockInsert: ReturnType<typeof vi.fn>

beforeEach(() => {
  vi.clearAllMocks()
  // `insert` returns a thenable that resolves to a PostgREST-style result.
  // No `.select()` / `.single()` — the insert must not request the row back
  // (the table has no anon SELECT policy).
  mockInsert = vi.fn().mockResolvedValue({ error: null })
  vi.mocked(supabase.from).mockReturnValue({ insert: mockInsert } as never)
})

describe('normaliseName', () => {
  it('capitalises names typed in lowercase', () => {
    expect(normaliseName('varun thakar')).toBe('Varun Thakar')
  })

  it('collapses stray whitespace', () => {
    expect(normaliseName('  asha   patel ')).toBe('Asha Patel')
  })

  it('capitalises after hyphens and apostrophes', () => {
    expect(normaliseName('anna-maria')).toBe('Anna-Maria')
    expect(normaliseName("d'souza")).toBe("D'Souza")
  })

  it('leaves a word that already carries a capital alone', () => {
    expect(normaliseName('McDonald')).toBe('McDonald')
    expect(normaliseName('Varun THAKAR')).toBe('Varun THAKAR')
  })
})

describe('submitRsvp', () => {
  it('maps fields to snake_case and composes the phone string', async () => {
    await submitRsvp(base)
    expect(supabase.from).toHaveBeenCalledWith('registrations')
    expect(mockInsert).toHaveBeenCalledTimes(1)
    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        id: expect.stringMatching(UUID_RE),
        name: 'Asha Patel',
        email: 'asha@example.com',
        phone: '49 0301234567',
        extra_adults: 1,
        children: 2,
        consent: true,
      }),
    )
  })

  it('stores a null phone when the field is left blank', async () => {
    await submitRsvp({ ...base, phone: '   ' })
    expect(mockInsert).toHaveBeenCalledWith(expect.objectContaining({ phone: null }))
  })

  it('returns a non-empty id (UUID shape) without asking Supabase for the row back', async () => {
    const result = await submitRsvp(base)
    expect(typeof result.id).toBe('string')
    expect(result.id).toMatch(UUID_RE)
    // the id passed to insert is the same id returned to the caller
    const row = mockInsert.mock.calls[0][0] as { id: string }
    expect(result.id).toBe(row.id)
  })

  it('throws when Supabase returns an error', async () => {
    mockInsert.mockResolvedValue({ error: { message: 'RLS denied' } })
    await expect(submitRsvp(base)).rejects.toThrow('RLS denied')
  })
})
