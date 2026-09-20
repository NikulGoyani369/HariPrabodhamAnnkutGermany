import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../lib/supabase', () => ({
  supabase: {
    from: vi.fn(),
  },
}))

import { fetchRegistrationSummary } from './adminRsvps'
import { supabase } from '../lib/supabase'

let mockSelect: ReturnType<typeof vi.fn>

beforeEach(() => {
  vi.clearAllMocks()
  mockSelect = vi.fn()
  vi.mocked(supabase.from).mockReturnValue({ select: mockSelect } as never)
})

describe('fetchRegistrationSummary', () => {
  it('queries the registration_summary view and returns the rows', async () => {
    const rows = [
      {
        id: 'reg-1',
        created_at: '2026-10-24T10:00:00Z',
        name: 'Asha Patel',
        email: 'asha@example.com',
        phone: '49 0301234567',
        adults: 2,
        children: 1,
        party_size: 3,
      },
    ]
    mockSelect.mockResolvedValue({ data: rows, error: null })

    const result = await fetchRegistrationSummary()

    expect(supabase.from).toHaveBeenCalledWith('registration_summary')
    expect(mockSelect).toHaveBeenCalledWith('*')
    expect(result).toEqual(rows)
  })

  it('returns an empty array when data is null', async () => {
    mockSelect.mockResolvedValue({ data: null, error: null })
    expect(await fetchRegistrationSummary()).toEqual([])
  })

  it('throws when Supabase returns an error', async () => {
    mockSelect.mockResolvedValue({ data: null, error: { message: 'permission denied' } })
    await expect(fetchRegistrationSummary()).rejects.toThrow('permission denied')
  })
})
