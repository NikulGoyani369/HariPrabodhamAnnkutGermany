import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import RsvpModal from './RsvpModal'
import { useRsvpStore } from '../../store/rsvpStore'

const isOpen = vi.fn()
vi.mock('../../utils/registrationGate', () => ({ isRegistrationOpenNow: () => isOpen() }))
vi.mock('../../api/rsvp', () => ({ submitRsvp: vi.fn() }))

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
    expect(await screen.findByRole('button', { name: /submit rsvp/i })).toBeInTheDocument()
  })

  it('shows the closed panel when registration is closed', async () => {
    isOpen.mockReturnValue(false)
    renderModal()
    act(() => { useRsvpStore.setState({ modalOpen: true }) })
    expect(await screen.findByText(/rsvp is now closed/i)).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /submit rsvp/i })).not.toBeInTheDocument()
  })
})
