import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock the supabase module
vi.mock('../lib/supabase', () => ({
  supabase: {
    from: vi.fn(),
  },
}))

import { submitRsvp, type RsvpInput } from './rsvp'
import { supabase } from '../lib/supabase'

const base: RsvpInput = {
  fullName: '  Asha Patel ',
  email: 'asha@example.com',
  dialCode: '+49',
  phone: '030 123-4567',
  city: 'Berlin',
  adults: 2,
  children: 1,
  darshanSlot: 'Morning — 09:00–12:00',
  notes: 'Arriving early',
  consent: true,
}

let mockSingle: ReturnType<typeof vi.fn>
let mockSelect: ReturnType<typeof vi.fn>
let mockInsert: ReturnType<typeof vi.fn>

beforeEach(() => {
  vi.clearAllMocks()
  mockSingle = vi.fn().mockResolvedValue({ data: { id: 'rsvp-1' }, error: null })
  mockSelect = vi.fn().mockReturnValue({ single: mockSingle })
  mockInsert = vi.fn().mockReturnValue({ select: mockSelect })
  vi.mocked(supabase.from).mockReturnValue({ insert: mockInsert } as never)
})

describe('submitRsvp', () => {
  it('maps fields to snake_case and composes the phone string', async () => {
    await submitRsvp(base)
    expect(supabase.from).toHaveBeenCalledWith('rsvps')
    expect(mockInsert).toHaveBeenCalledWith({
      full_name: 'Asha Patel',
      email: 'asha@example.com',
      phone: '49 0301234567',
      city: 'Berlin',
      adults: 2,
      children: 1,
      darshan_slot: 'Morning — 09:00–12:00',
      notes: 'Arriving early',
      consent: true,
    })
    expect(mockSelect).toHaveBeenCalledWith('id')
  })

  it('returns the new id', async () => {
    await expect(submitRsvp(base)).resolves.toEqual({ id: 'rsvp-1' })
  })

  it('omits notes when blank', async () => {
    await submitRsvp({ ...base, notes: '   ' })
    expect(mockInsert).toHaveBeenCalledWith(expect.objectContaining({ notes: null }))
  })

  it('throws when Supabase returns an error', async () => {
    mockSingle.mockResolvedValue({ data: null, error: { message: 'RLS denied' } })
    await expect(submitRsvp(base)).rejects.toThrow('RLS denied')
  })
})
