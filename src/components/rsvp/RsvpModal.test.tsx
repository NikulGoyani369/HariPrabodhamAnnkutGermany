import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, act, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import RsvpModal from './RsvpModal'
import { useRsvpStore } from '../../store/rsvpStore'

const isOpen = vi.fn()
const submitRsvp = vi.fn()
vi.mock('../../utils/registrationGate', () => ({ isRegistrationOpenNow: () => isOpen() }))
vi.mock('../../api/rsvp', () => ({
  submitRsvp: (...a: unknown[]) => submitRsvp(...a),
  normaliseName: (v: string) => v.trim(),
}))

function renderModal() {
  return render(<MemoryRouter><RsvpModal /></MemoryRouter>)
}

beforeEach(() => {
  vi.clearAllMocks()
  useRsvpStore.setState({ modalOpen: false })
})

describe('RsvpModal', () => {
  it('renders nothing visible while closed', () => {
    isOpen.mockReturnValue(true)
    renderModal()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('shows the form when open and registration is open', async () => {
    isOpen.mockReturnValue(true)
    renderModal()
    act(() => { useRsvpStore.setState({ modalOpen: true }) })
    expect(await screen.findByRole('button', { name: /submit registration/i })).toBeInTheDocument()
  })

  it('drops the "Reserve your place / Registration" header once submitted', async () => {
    isOpen.mockReturnValue(true)
    submitRsvp.mockResolvedValue({ id: 'reg-1' })
    const user = userEvent.setup()
    renderModal()
    act(() => { useRsvpStore.setState({ modalOpen: true }) })

    expect(await screen.findByText(/reserve your place/i)).toBeInTheDocument()

    await user.type(screen.getByLabelText(/full name/i), 'Asha Patel')
    await user.type(screen.getByLabelText(/email/i), 'asha@example.com')
    await user.click(screen.getByRole('checkbox', { name: /i consent/i }))
    await user.click(screen.getByRole('button', { name: /submit registration/i }))

    expect(await screen.findByText(/your registration is confirmed/i)).toBeInTheDocument()
    await waitFor(() => {
      expect(screen.queryByText(/reserve your place/i)).not.toBeInTheDocument()
    })
    // The dialog keeps an accessible name via the confirmation heading.
    expect(screen.getByRole('dialog')).toHaveAccessibleName(/registration is confirmed/i)
  })

  it('shows the closed panel when registration is closed', async () => {
    isOpen.mockReturnValue(false)
    renderModal()
    act(() => { useRsvpStore.setState({ modalOpen: true }) })
    expect(await screen.findByText(/registration is now closed/i)).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /submit registration/i })).not.toBeInTheDocument()
  })
})
