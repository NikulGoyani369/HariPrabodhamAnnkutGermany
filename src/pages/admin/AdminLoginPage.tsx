import { useState, type FormEvent } from 'react'
import { Navigate, useLocation, useNavigate, type Location } from 'react-router-dom'
import { Box, Container, TextField, Button, Typography, Alert, Link } from '@mui/material'
import { supabase } from '../../lib/supabase'
import { useAdminSession } from '../../hooks/useAdminSession'
import { usePageMeta } from '../../hooks/usePageMeta'
import { C } from '../../theme/theme'

export default function AdminLoginPage() {
  usePageMeta('Admin Sign In')
  const session = useAdminSession()
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [resetSent, setResetSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  if (session) {
    const from = (location.state as { from?: Location })?.from?.pathname || '/admin'
    return <Navigate to={from} replace />
  }

  const handleSubmit = async (ev: FormEvent) => {
    ev.preventDefault()
    setError('')
    setResetSent(false)
    setSubmitting(true)
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    })
    setSubmitting(false)
    if (signInError) {
      setError('Invalid email or password.')
      return
    }
    navigate('/admin')
  }

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      setError('Enter your email above, then click "Forgot password?".')
      return
    }
    setError('')
    await supabase.auth.resetPasswordForEmail(email.trim())
    setResetSent(true)
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: C.ivory,
        px: 2,
      }}
    >
      <Container maxWidth="xs" disableGutters>
        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={{
            background: '#fff',
            border: `1px solid ${C.shell}`,
            borderRadius: 3,
            p: 4,
          }}
        >
          <Typography variant="h5" sx={{ mb: 3, textAlign: 'center', color: C.ink }}>
            Admin Sign In
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {resetSent && (
            <Alert severity="success" sx={{ mb: 2 }}>
              If that email has an account, a reset link has been sent.
            </Alert>
          )}

          <TextField
            label="Email"
            type="email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mb: 2 }}
            required
            autoFocus
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 2.5 }}
            required
          />

          <Button type="submit" variant="contained" fullWidth size="large" disabled={submitting}>
            {submitting ? 'Signing in…' : 'Sign In'}
          </Button>

          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Link component="button" type="button" onClick={handleForgotPassword} sx={{ fontSize: 13 }}>
              Forgot password?
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}
