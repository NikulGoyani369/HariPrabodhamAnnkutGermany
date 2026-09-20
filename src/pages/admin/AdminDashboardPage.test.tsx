import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AdminDashboardPage from './AdminDashboardPage'

const fetchRegistrationSummary = vi.fn()
vi.mock('../../api/adminRsvps', () => ({
  fetchRegistrationSummary: (...a: unknown[]) => fetchRegistrationSummary(...a),
}))

const row = {
  id: 'reg-1',
  created_at: '2026-10-24T10:00:00Z',
  name: 'Asha Patel',
  email: 'asha@example.com',
  phone: '49 0301234567',
  adults: 2,
  children: 1,
  party_size: 3,
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('AdminDashboardPage', () => {
  it('shows totals and the registration row once loaded', async () => {
    fetchRegistrationSummary.mockResolvedValue([row])
    render(<AdminDashboardPage />)
    expect(await screen.findByText('Asha Patel')).toBeInTheDocument()
    expect(screen.getByText('Total Registrations').nextSibling).toHaveTextContent('1')
    expect(screen.getByText('Total Attendees').nextSibling).toHaveTextContent('3')
  })

  it('shows an empty state with no registrations', async () => {
    fetchRegistrationSummary.mockResolvedValue([])
    render(<AdminDashboardPage />)
    expect(await screen.findByText(/no registrations yet/i)).toBeInTheDocument()
  })

  it('shows an error state with a working retry', async () => {
    fetchRegistrationSummary.mockRejectedValueOnce(new Error('network'))
    const user = userEvent.setup()
    render(<AdminDashboardPage />)
    expect(await screen.findByText(/couldn't load registrations/i)).toBeInTheDocument()

    fetchRegistrationSummary.mockResolvedValueOnce([row])
    await user.click(screen.getByRole('button', { name: /retry/i }))
    expect(await screen.findByText('Asha Patel')).toBeInTheDocument()
  })
})
