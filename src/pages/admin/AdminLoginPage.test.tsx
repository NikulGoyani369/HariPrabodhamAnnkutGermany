import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import AdminLoginPage from './AdminLoginPage'

const mockSession = vi.fn()
vi.mock('../../hooks/useAdminSession', () => ({ useAdminSession: () => mockSession() }))

const signInWithPassword = vi.fn()
const resetPasswordForEmail = vi.fn()
vi.mock('../../lib/supabase', () => ({
  supabase: {
    auth: {
      signInWithPassword: (...a: unknown[]) => signInWithPassword(...a),
      resetPasswordForEmail: (...a: unknown[]) => resetPasswordForEmail(...a),
    },
  },
}))

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/admin/login']}>
      <Routes>
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin" element={<div>Dashboard page</div>} />
      </Routes>
    </MemoryRouter>,
  )
}

beforeEach(() => {
  vi.clearAllMocks()
  mockSession.mockReturnValue(null)
  resetPasswordForEmail.mockResolvedValue({ error: null })
})

describe('AdminLoginPage', () => {
  it('redirects to /admin when already signed in', () => {
    mockSession.mockReturnValue({ user: { email: 'organiser@example.com' } })
    renderPage()
    expect(screen.getByText('Dashboard page')).toBeInTheDocument()
  })

  it('signs in and navigates to /admin on valid credentials', async () => {
    signInWithPassword.mockResolvedValue({ error: null })
    const user = userEvent.setup()
    renderPage()
    await user.type(screen.getByLabelText(/email/i), 'organiser@example.com')
    await user.type(screen.getByLabelText(/password/i), 'correct-horse')
    await user.click(screen.getByRole('button', { name: /sign in/i }))
    expect(await screen.findByText('Dashboard page')).toBeInTheDocument()
    expect(signInWithPassword).toHaveBeenCalledWith({
      email: 'organiser@example.com',
      password: 'correct-horse',
    })
  })

  it('shows an error and does not navigate on invalid credentials', async () => {
    signInWithPassword.mockResolvedValue({ error: { message: 'Invalid login credentials' } })
    const user = userEvent.setup()
    renderPage()
    await user.type(screen.getByLabelText(/email/i), 'organiser@example.com')
    await user.type(screen.getByLabelText(/password/i), 'wrong')
    await user.click(screen.getByRole('button', { name: /sign in/i }))
    expect(await screen.findByText(/invalid email or password/i)).toBeInTheDocument()
    expect(screen.queryByText('Dashboard page')).not.toBeInTheDocument()
  })

  it('asks for an email before sending a reset link', async () => {
    const user = userEvent.setup()
    renderPage()
    await user.click(screen.getByRole('button', { name: /forgot password/i }))
    expect(await screen.findByText(/enter your email above/i)).toBeInTheDocument()
    expect(resetPasswordForEmail).not.toHaveBeenCalled()
  })

  it('sends a reset link once an email is filled in', async () => {
    const user = userEvent.setup()
    renderPage()
    await user.type(screen.getByLabelText(/email/i), 'organiser@example.com')
    await user.click(screen.getByRole('button', { name: /forgot password/i }))
    expect(resetPasswordForEmail).toHaveBeenCalledWith('organiser@example.com')
    expect(await screen.findByText(/reset link has been sent/i)).toBeInTheDocument()
  })
})
