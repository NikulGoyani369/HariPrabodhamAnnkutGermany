import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AdminDashboardPage from './AdminDashboardPage'

const fetchRsvpSummary = vi.fn()
vi.mock('../../api/adminRsvps', () => ({
  fetchRsvpSummary: (...a: unknown[]) => fetchRsvpSummary(...a),
}))

const row = {
  created_at: '2026-10-24T10:00:00Z',
  full_name: 'Asha Patel',
  email: 'asha@example.com',
  phone: '49 0301234567',
  city: 'Berlin',
  adults: 2,
  children: 1,
  party_size: 3,
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('AdminDashboardPage', () => {
  it('shows totals and the registration row once loaded', async () => {
    fetchRsvpSummary.mockResolvedValue([row])
    render(<AdminDashboardPage />)
    expect(await screen.findByText('Asha Patel')).toBeInTheDocument()
    expect(screen.getByText('Total Registrations').nextSibling).toHaveTextContent('1')
    expect(screen.getByText('Total Attendees').nextSibling).toHaveTextContent('3')
  })

  it('shows an empty state with no registrations', async () => {
    fetchRsvpSummary.mockResolvedValue([])
    render(<AdminDashboardPage />)
    expect(await screen.findByText(/no registrations yet/i)).toBeInTheDocument()
  })

  it('shows an error state with a working retry', async () => {
    fetchRsvpSummary.mockRejectedValueOnce(new Error('network'))
    const user = userEvent.setup()
    render(<AdminDashboardPage />)
    expect(await screen.findByText(/couldn't load registrations/i)).toBeInTheDocument()

    fetchRsvpSummary.mockResolvedValueOnce([row])
    await user.click(screen.getByRole('button', { name: /retry/i }))
    expect(await screen.findByText('Asha Patel')).toBeInTheDocument()
  })
})
