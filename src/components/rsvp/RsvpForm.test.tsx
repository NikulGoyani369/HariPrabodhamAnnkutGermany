import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import RsvpForm from './RsvpForm'

const submitRsvp = vi.fn()
vi.mock('../../api/rsvp', () => ({ submitRsvp: (...a: unknown[]) => submitRsvp(...a) }))

function renderForm() {
  return render(
    <MemoryRouter>
      <RsvpForm onClose={() => {}} />
    </MemoryRouter>,
  )
}

// Fill every required field with valid values. Returns the user-event instance.
async function fillValid(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/full name/i), 'Asha Patel')
  await user.type(screen.getByLabelText(/email/i), 'asha@example.com')
  await user.type(screen.getByLabelText(/phone/i), '030 1234567')
  await user.type(screen.getByLabelText(/city \/ mandal/i), 'Berlin')
  // Adults defaults to 1, children to 0, dial code to +49, darshan slot needs a pick:
  await user.click(screen.getByLabelText(/darshan time slot/i))
  await user.click(screen.getByRole('option', { name: /morning/i }))
  await user.click(screen.getByRole('checkbox', { name: /consent/i }))
}

beforeEach(() => {
  vi.clearAllMocks()
  submitRsvp.mockResolvedValue({ id: 'rsvp-1' })
})

describe('RsvpForm', () => {
  it('shows errors for every required field on empty submit and does not call the API', async () => {
    const user = userEvent.setup()
    renderForm()
    await user.click(screen.getByRole('button', { name: /submit rsvp/i }))
    expect(await screen.findByText(/enter your name/i)).toBeInTheDocument()
    expect(screen.getByText(/enter a valid email/i)).toBeInTheDocument()
    expect(screen.getByText(/enter your phone/i)).toBeInTheDocument()
    expect(screen.getByText(/enter your city/i)).toBeInTheDocument()
    expect(screen.getByText(/choose a darshan/i)).toBeInTheDocument()
    expect(screen.getByText(/please confirm your consent/i)).toBeInTheDocument()
    expect(submitRsvp).not.toHaveBeenCalled()
  })

  it('rejects an invalid email and a too-short phone', async () => {
    const user = userEvent.setup()
    renderForm()
    await user.type(screen.getByLabelText(/email/i), 'not-an-email')
    await user.type(screen.getByLabelText(/phone/i), '123')
    await user.click(screen.getByRole('button', { name: /submit rsvp/i }))
    expect(await screen.findByText(/enter a valid email/i)).toBeInTheDocument()
    expect(screen.getByText(/enter a valid phone/i)).toBeInTheDocument()
    expect(submitRsvp).not.toHaveBeenCalled()
  })

  it('blocks submit while consent is unchecked', async () => {
    const user = userEvent.setup()
    renderForm()
    await user.type(screen.getByLabelText(/full name/i), 'Asha Patel')
    await user.type(screen.getByLabelText(/email/i), 'asha@example.com')
    await user.type(screen.getByLabelText(/phone/i), '030 1234567')
    await user.type(screen.getByLabelText(/city \/ mandal/i), 'Berlin')
    await user.click(screen.getByLabelText(/darshan time slot/i))
    await user.click(screen.getByRole('option', { name: /morning/i }))
    await user.click(screen.getByRole('button', { name: /submit rsvp/i }))
    expect(await screen.findByText(/please confirm your consent/i)).toBeInTheDocument()
    expect(submitRsvp).not.toHaveBeenCalled()
  })

  it('calls submitRsvp once with the expected payload on a valid fill', async () => {
    const user = userEvent.setup()
    renderForm()
    await fillValid(user)
    await user.click(screen.getByRole('button', { name: /submit rsvp/i }))
    await waitFor(() => expect(submitRsvp).toHaveBeenCalledTimes(1))
    expect(submitRsvp).toHaveBeenCalledWith({
      fullName: 'Asha Patel',
      email: 'asha@example.com',
      dialCode: '+49',
      phone: '030 1234567',
      city: 'Berlin',
      adults: 1,
      children: 0,
      darshanSlot: 'Morning — 09:00–12:00',
      notes: '',
      consent: true,
    })
  })

  it('shows the confirmation panel on success', async () => {
    const user = userEvent.setup()
    renderForm()
    await fillValid(user)
    await user.click(screen.getByRole('button', { name: /submit rsvp/i }))
    expect(await screen.findByText(/your rsvp is received/i)).toBeInTheDocument()
    expect(screen.getByText(/Asha Patel/)).toBeInTheDocument()
  })

  it('shows an error alert and keeps the form filled on failure', async () => {
    submitRsvp.mockRejectedValue(new Error('network'))
    const user = userEvent.setup()
    renderForm()
    await fillValid(user)
    await user.click(screen.getByRole('button', { name: /submit rsvp/i }))
    expect(await screen.findByRole('alert')).toBeInTheDocument()
    expect(screen.getByLabelText(/full name/i)).toHaveValue('Asha Patel')
  })

  it('silently fakes success without calling the API when the honeypot is filled', async () => {
    const user = userEvent.setup()
    const { container } = renderForm()
    await fillValid(user)
    const honeypot = container.querySelector('input[name="company"]') as HTMLInputElement
    // jsdom: set the value directly since the field is visually hidden
    await user.type(honeypot, 'spambot')
    await user.click(screen.getByRole('button', { name: /submit rsvp/i }))
    expect(await screen.findByText(/your rsvp is received/i)).toBeInTheDocument()
    expect(submitRsvp).not.toHaveBeenCalled()
  })
})
