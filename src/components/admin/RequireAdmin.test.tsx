import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import RequireAdmin from './RequireAdmin'

const mockSession = vi.fn()
vi.mock('../../hooks/useAdminSession', () => ({ useAdminSession: () => mockSession() }))

const renderGuarded = () =>
  render(
    <MemoryRouter initialEntries={['/admin']}>
      <Routes>
        <Route path="/admin" element={<RequireAdmin><div>Secret dashboard</div></RequireAdmin>} />
        <Route path="/admin/login" element={<div>Login page</div>} />
      </Routes>
    </MemoryRouter>,
  )

beforeEach(() => {
  vi.clearAllMocks()
})

describe('RequireAdmin', () => {
  it('shows a loading spinner while the session is being checked', () => {
    mockSession.mockReturnValue(undefined)
    renderGuarded()
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
    expect(screen.queryByText('Secret dashboard')).not.toBeInTheDocument()
  })

  it('redirects to /admin/login when there is no session', () => {
    mockSession.mockReturnValue(null)
    renderGuarded()
    expect(screen.getByText('Login page')).toBeInTheDocument()
    expect(screen.queryByText('Secret dashboard')).not.toBeInTheDocument()
  })

  it('renders the protected content when a session exists', () => {
    mockSession.mockReturnValue({ user: { email: 'organiser@example.com' } })
    renderGuarded()
    expect(screen.getByText('Secret dashboard')).toBeInTheDocument()
  })
})
