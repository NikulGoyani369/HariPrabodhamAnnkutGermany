import { Box, Typography, Button } from '@mui/material'
import { EVENT } from '../../data/data'
import { C } from '../../theme/theme'

interface Props {
  name: string
  partySize: number
  onClose: () => void
}

const EVENT_YEAR = new Date(EVENT.dateISO).getFullYear()

export default function RsvpConfirmation({ name, partySize, onClose }: Props) {
  return (
    <Box sx={{ textAlign: 'center', py: { xs: 2, md: 3 } }}>
      {/* Carries the dialog's accessible name once the header is hidden. */}
      <Typography
        id="rsvp-confirmation-title"
        variant="h3"
        component="p"
        sx={{ fontFamily: '"GC Commune", serif', color: C.ink, mb: 1 }}
      >
        Your registration is confirmed!
      </Typography>
      <Typography
        sx={{
          fontFamily: '"GC Commune", serif',
          fontSize: { xs: '1.25rem', md: '1.4rem' },
          color: C.ink,
          mb: 0.75,
        }}
      >
        {EVENT.title} {EVENT_YEAR}
      </Typography>
      <Typography
        sx={{
          fontSize: 12.5,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: C.gold,
          fontWeight: 600,
          mb: 3,
        }}
      >
        {EVENT.highlight}
      </Typography>
      <Box
        sx={{
          maxWidth: 320,
          mx: 'auto',
          textAlign: 'left',
          border: `1px solid ${C.shell}`,
          borderRadius: '14px',
          p: 2,
          mb: 3,
        }}
      >
        <Typography sx={{ fontSize: 14, color: C.ink }}><strong>Name:</strong> {name}</Typography>
        <Typography sx={{ fontSize: 14, color: C.ink }}>
          <strong>Members:</strong> {partySize}
        </Typography>
      </Box>
      <Button variant="contained" onClick={onClose}>Close</Button>
    </Box>
  )
}
