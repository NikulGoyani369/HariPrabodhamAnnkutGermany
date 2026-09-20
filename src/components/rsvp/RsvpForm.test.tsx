import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import RsvpForm from './RsvpForm'

const submitRsvp = vi.fn()
vi.mock('../../api/rsvp', () => ({ submitRsvp: (...a: unknown[]) => submitRsvp(...a) }))

function renderForm(onClose: () => void = () => {}) {
  return render(
    <MemoryRouter>
      <RsvpForm onClose={onClose} />
    </MemoryRouter>,
  )
}

const consentBox = () => screen.getByRole('checkbox', { name: /i consent/i })
const submit = () => screen.getByRole('button', { name: /submit registration/i })

/** Opens a MUI select by its label and picks the option with that text. */
async function pick(
  user: ReturnType<typeof userEvent.setup>,
  label: RegExp,
  option: string,
) {
  await user.click(screen.getByRole('combobox', { name: label }))
  await user.click(within(screen.getByRole('listbox')).getByRole('option', { name: option }))
}

// Fill every required field with valid values.
async function fillValid(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/full name/i), 'Asha Patel')
  await user.type(screen.getByLabelText(/email/i), 'asha@example.com')
  await user.type(screen.getByLabelText(/phone/i), '030 1234567')
  await user.click(consentBox())
}

beforeEach(() => {
  vi.clearAllMocks()
  submitRsvp.mockResolvedValue({ id: 'reg-1' })
})

describe('RsvpForm', () => {
  it('shows errors for every required field on empty submit and does not call the API', async () => {
    const user = userEvent.setup()
    renderForm()
    await user.click(submit())
    expect(await screen.findByText(/enter your name/i)).toBeInTheDocument()
    expect(screen.getByText(/enter a valid email/i)).toBeInTheDocument()
    expect(screen.getByText(/please confirm your consent/i)).toBeInTheDocument()
    expect(submitRsvp).not.toHaveBeenCalled()
  })

  it('accepts a blank phone number', async () => {
    const user = userEvent.setup()
    renderForm()
    await user.type(screen.getByLabelText(/full name/i), 'Asha Patel')
    await user.type(screen.getByLabelText(/email/i), 'asha@example.com')
    await user.click(consentBox())
    await user.click(submit())
    await waitFor(() => expect(submitRsvp).toHaveBeenCalledTimes(1))
    expect(submitRsvp).toHaveBeenCalledWith(expect.objectContaining({ phone: '' }))
  })

  it('still rejects a phone number that was typed but is too short', async () => {
    const user = userEvent.setup()
    renderForm()
    await user.type(screen.getByLabelText(/phone/i), '123')
    await user.click(submit())
    expect(await screen.findByText(/enter a valid phone/i)).toBeInTheDocument()
    expect(submitRsvp).not.toHaveBeenCalled()
  })

  it('rejects an invalid email', async () => {
    const user = userEvent.setup()
    renderForm()
    await user.type(screen.getByLabelText(/email/i), 'not-an-email')
    await user.click(submit())
    expect(await screen.findByText(/enter a valid email/i)).toBeInTheDocument()
    expect(submitRsvp).not.toHaveBeenCalled()
  })

  it('blocks submit while consent is unchecked', async () => {
    const user = userEvent.setup()
    renderForm()
    await user.type(screen.getByLabelText(/full name/i), 'Asha Patel')
    await user.type(screen.getByLabelText(/email/i), 'asha@example.com')
    await user.click(submit())
    expect(await screen.findByText(/please confirm your consent/i)).toBeInTheDocument()
    expect(submitRsvp).not.toHaveBeenCalled()
  })

  it('offers a single consent checkbox linking to the privacy notice', () => {
    renderForm()
    expect(screen.getAllByRole('checkbox')).toHaveLength(1)
    expect(screen.getByRole('link', { name: /privacy notice/i })).toHaveAttribute(
      'href',
      '/data-privacy',
    )
  })

  it('closes the dialog when the privacy notice link is followed', async () => {
    const onClose = vi.fn()
    const user = userEvent.setup()
    renderForm(onClose)
    await user.click(screen.getByRole('link', { name: /privacy notice/i }))
    // Without this the route changes behind a modal that stays on screen.
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('always shows the additional members dropdowns, both defaulting to 0', () => {
    renderForm()
    expect(screen.getByText(/additional members/i)).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: /^adults$/i })).toHaveTextContent('0')
    expect(screen.getByRole('combobox', { name: /^children$/i })).toHaveTextContent('0')
    expect(screen.getByText(/1 attending in total/i)).toBeInTheDocument()
  })

  it('offers at most 3 additional adults and 4 children', async () => {
    const user = userEvent.setup()
    renderForm()

    await user.click(screen.getByRole('combobox', { name: /^adults$/i }))
    expect(within(screen.getByRole('listbox')).getAllByRole('option')).toHaveLength(4) // 0–3
    await user.keyboard('{Escape}')

    await user.click(screen.getByRole('combobox', { name: /^children$/i }))
    expect(within(screen.getByRole('listbox')).getAllByRole('option')).toHaveLength(5) // 0–4
  })

  it('sends the selected counts and shows the running total', async () => {
    const user = userEvent.setup()
    renderForm()
    await fillValid(user)
    await pick(user, /^adults$/i, '3')
    await pick(user, /^children$/i, '4')
    expect(screen.getByText(/8 attending in total/i)).toBeInTheDocument()

    await user.click(submit())
    await waitFor(() => expect(submitRsvp).toHaveBeenCalledTimes(1))
    expect(submitRsvp).toHaveBeenCalledWith(
      expect.objectContaining({ extraAdults: 3, children: 4 }),
    )
  })

  it('calls submitRsvp once with the expected payload on a valid fill', async () => {
    const user = userEvent.setup()
    renderForm()
    await fillValid(user)
    await user.click(submit())
    await waitFor(() => expect(submitRsvp).toHaveBeenCalledTimes(1))
    expect(submitRsvp).toHaveBeenCalledWith({
      fullName: 'Asha Patel',
      email: 'asha@example.com',
      dialCode: '+49',
      phone: '030 1234567',
      extraAdults: 0,
      children: 0,
      consent: true,
    })
  })

  it('shows the confirmation panel with the full member count on success', async () => {
    const user = userEvent.setup()
    renderForm()
    await fillValid(user)
    await pick(user, /^children$/i, '2')
    await user.click(submit())
    expect(await screen.findByText(/your registration is confirmed/i)).toBeInTheDocument()
    expect(screen.getByText(/Asha Patel/)).toBeInTheDocument()
    expect(screen.getByText('Members:').parentElement).toHaveTextContent('3')
  })

  it('shows an error alert and keeps the form filled on failure', async () => {
    submitRsvp.mockRejectedValue(new Error('network'))
    const user = userEvent.setup()
    renderForm()
    await fillValid(user)
    await user.click(submit())
    expect(await screen.findByRole('alert')).toBeInTheDocument()
    expect(screen.getByLabelText(/full name/i)).toHaveValue('Asha Patel')
  })

  it('silently fakes success without calling the API when the honeypot is filled', async () => {
    const user = userEvent.setup()
    const { container } = renderForm()
    await fillValid(user)
    const honeypot = container.querySelector('input[name="company"]') as HTMLInputElement
    await user.type(honeypot, 'spambot')
    await user.click(submit())
    expect(await screen.findByText(/your registration is confirmed/i)).toBeInTheDocument()
    expect(submitRsvp).not.toHaveBeenCalled()
  })
})
