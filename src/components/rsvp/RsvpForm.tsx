import { useState, type FormEvent } from 'react'
import {
  Box, TextField, MenuItem, Checkbox, FormControl, FormControlLabel, FormHelperText,
  Button, Alert, Typography, Link,
} from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { submitRsvp, type RsvpInput } from '../../api/rsvp'
import { COUNTRIES } from '../../data/data'
import { C } from '../../theme/theme'
import RsvpConfirmation from './RsvpConfirmation'
import { rsvpFormStyles as s } from './RsvpForm.styles'

type Status = 'idle' | 'submitting' | 'error' | 'success'
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Kill MUI menu open/close transitions in tests and keep interaction snappy.
const SELECT_SLOT_PROPS = { select: { MenuProps: { transitionDuration: 0 } } } as const

interface Props { onClose: () => void }

export default function RsvpForm({ onClose }: Props) {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [dialCode, setDialCode] = useState('+49')
  const [phone, setPhone] = useState('')
  const [city, setCity] = useState('')
  const [adults, setAdults] = useState(1)
  const [children, setChildren] = useState(0)
  const [consent, setConsent] = useState(false)
  const [company, setCompany] = useState('') // honeypot

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [status, setStatus] = useState<Status>('idle')
  const [submitError, setSubmitError] = useState('')

  const validate = () => {
    const e: Record<string, string> = {}
    const name = fullName.trim()
    if (name.length < 2 || name.length > 80) e.fullName = 'Please enter your name (2–80 characters).'
    if (!EMAIL_RE.test(email.trim())) e.email = 'Please enter a valid email address.'
    const digits = phone.replace(/\D/g, '')
    if (!digits) e.phone = 'Please enter your phone number.'
    else if (!/^\d{6,15}$/.test(digits)) e.phone = 'Please enter a valid phone number (6–15 digits).'
    const c = city.trim()
    if (c.length < 2 || c.length > 60) e.city = 'Please enter your city or mandal.'
    if (!consent) e.consent = 'Please confirm your consent to submit.'
    return e
  }

  const handleSubmit = async (ev: FormEvent) => {
    ev.preventDefault()
    const e = validate()
    setErrors(e)
    if (Object.keys(e).length > 0) return

    if (company.trim()) {
      setStatus('success') // honeypot tripped — fake success, no network
      return
    }

    setStatus('submitting')
    setSubmitError('')
    const payload: RsvpInput = {
      fullName, email, dialCode, phone, city, adults, children, consent,
    }
    try {
      await submitRsvp(payload)
      setStatus('success')
    } catch (err) {
      console.error(err)
      const msg = err instanceof Error ? err.message : ''
      setSubmitError(
        /fetch|network|Failed to fetch/i.test(msg)
          ? "Couldn't reach the server. Check your connection and try again."
          : 'Something went wrong submitting your registration. Please try again or contact us.',
      )
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <RsvpConfirmation
        name={fullName.trim()}
        partySize={adults + children}
        onClose={onClose}
      />
    )
  }

  return (
    <Box component="form" noValidate onSubmit={handleSubmit}>
      <Box sx={s.grid}>
        <TextField
          sx={s.full}
          label="Full name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          error={!!errors.fullName}
          helperText={errors.fullName}
          fullWidth
        />
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={!!errors.email}
          helperText={errors.email}
          fullWidth
        />
        <TextField
          label="City / Mandal"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          error={!!errors.city}
          helperText={errors.city}
          fullWidth
        />
        <TextField
          select
          label="Dial code"
          value={dialCode}
          onChange={(e) => setDialCode(e.target.value)}
          slotProps={SELECT_SLOT_PROPS}
          fullWidth
        >
          {COUNTRIES.map((c) => (
            <MenuItem key={c.code} value={c.dialCode}>
              {c.flag} {c.label} ({c.dialCode})
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          error={!!errors.phone}
          helperText={errors.phone}
          fullWidth
        />
        <TextField
          select
          label="Adults"
          value={adults}
          onChange={(e) => setAdults(Number(e.target.value))}
          slotProps={SELECT_SLOT_PROPS}
          fullWidth
        >
          {Array.from({ length: 5 }, (_, i) => i + 1).map((n) => (
            <MenuItem key={n} value={n}>
              {n}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Children"
          value={children}
          onChange={(e) => setChildren(Number(e.target.value))}
          slotProps={SELECT_SLOT_PROPS}
          fullWidth
        >
          {Array.from({ length: 5 }, (_, i) => i).map((n) => (
            <MenuItem key={n} value={n}>
              {n}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      {/* Honeypot — visually hidden, not tab-reachable */}
      <Box sx={s.honeypot} aria-hidden="true">
        <label>
          Company
          <input
            name="company"
            tabIndex={-1}
            autoComplete="off"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
        </label>
      </Box>

      <FormControl
        component="fieldset"
        error={!!errors.consent}
        sx={{ mt: 1, display: 'block' }}
      >
        <FormControlLabel
          control={
            <Checkbox
              id="consent"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              slotProps={{
                input: {
                  'aria-describedby': errors.consent
                    ? 'consent-error'
                    : undefined,
                },
              }}
            />
          }
          label={
            <Typography sx={{ fontSize: 13.5, color: C.inkSoft }}>
              I consent to my details being used to organise this event, per the{' '}
              <Link component={RouterLink} to="/data-privacy">
                privacy notice
              </Link>
              .
            </Typography>
          }
        />
        {errors.consent && (
          <FormHelperText id="consent-error">{errors.consent}</FormHelperText>
        )}
      </FormControl>

      {status === 'error' && (
        <Alert severity="error" role="alert" sx={{ mt: 2 }}>
          {submitError}
        </Alert>
      )}

      <Box sx={s.submitRow}>
        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={status === 'submitting'}
        >
          {status === 'submitting' ? 'Submitting…' : 'Submit Registration'}
        </Button>
      </Box>
    </Box>
  );
}
