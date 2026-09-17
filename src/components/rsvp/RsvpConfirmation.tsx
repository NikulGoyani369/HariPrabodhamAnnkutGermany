import { Box, Typography, Button } from '@mui/material'
import { C } from '../../theme/theme'

interface Props {
  name: string
  partySize: number
  onClose: () => void
}

export default function RsvpConfirmation({ name, partySize, onClose }: Props) {
  return (
    <Box sx={{ textAlign: 'center', py: { xs: 2, md: 3 } }}>
      <Typography
        variant="h3"
        component="p"
        sx={{ fontFamily: '"GC Commune", serif', color: C.ink, mb: 1.5 }}
      >
        see live share - The divine 🙏
      </Typography>
      <Typography sx={{ color: C.inkSoft, mb: 2.5 }}>
        Your registration is received.
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
        <Typography sx={{ fontSize: 14, color: C.ink }}><strong>Party size:</strong> {partySize}</Typography>
      </Box>
      <Button variant="contained" onClick={onClose}>Close</Button>
    </Box>
  )
}
