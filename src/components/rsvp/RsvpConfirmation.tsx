import { Box, Typography, Button } from '@mui/material'
import { C } from '../../theme/theme'

interface Props {
  name: string
  partySize: number
  slot: string
  onClose: () => void
}

export default function RsvpConfirmation({ name, partySize, slot, onClose }: Props) {
  return (
    <Box sx={{ textAlign: 'center', py: { xs: 2, md: 3 } }}>
      <Typography
        variant="h3"
        component="p"
        sx={{ fontFamily: '"Blue Mirage", serif', color: C.espresso, mb: 1.5 }}
      >
        Jai Swaminarayan 🙏
      </Typography>
      <Typography sx={{ color: C.muted, mb: 2.5 }}>
        Your RSVP is received.
      </Typography>
      <Box
        sx={{
          maxWidth: 320,
          mx: 'auto',
          textAlign: 'left',
          border: `1px solid ${C.line}`,
          borderRadius: '14px',
          p: 2,
          mb: 3,
        }}
      >
        <Typography sx={{ fontSize: 14, color: C.ink }}><strong>Name:</strong> {name}</Typography>
        <Typography sx={{ fontSize: 14, color: C.ink }}><strong>Party size:</strong> {partySize}</Typography>
        <Typography sx={{ fontSize: 14, color: C.ink }}><strong>Darshan slot:</strong> {slot}</Typography>
      </Box>
      <Button variant="contained" onClick={onClose}>Close</Button>
    </Box>
  )
}
