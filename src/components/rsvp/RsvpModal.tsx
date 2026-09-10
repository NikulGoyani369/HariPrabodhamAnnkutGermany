import { useState } from 'react'
import {
  Dialog, DialogTitle, DialogContent, IconButton, Typography, Box,
  useMediaQuery, useTheme,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { useRsvpStore } from '../../store/rsvpStore'
import { isRegistrationOpenNow } from '../../utils/registrationGate'
import { C } from '../../theme/theme'
import RsvpForm from './RsvpForm'
import RegistrationClosed from './RegistrationClosed'

export default function RsvpModal() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const modalOpen = useRsvpStore((s) => s.modalOpen)
  const closeModal = useRsvpStore((s) => s.closeModal)

  // Re-check the registration gate each time the modal transitions to open,
  // snapshotting the result for the lifetime of that open. Uses React's
  // "adjust state during render" pattern rather than an effect (which would
  // trip react-hooks/set-state-in-effect); see brief deviation note.
  const [open, setOpen] = useState(true)
  const [wasOpen, setWasOpen] = useState(false)
  if (modalOpen !== wasOpen) {
    setWasOpen(modalOpen)
    if (modalOpen) setOpen(isRegistrationOpenNow())
  }

  return (
    <Dialog
      open={modalOpen}
      onClose={closeModal}
      maxWidth="sm"
      fullWidth
      fullScreen={isMobile}
      scroll="paper"
      aria-labelledby="rsvp-dialog-title"
      slotProps={{
        paper: {
          sx: {
            borderRadius: isMobile ? 0 : '22px',
            bgcolor: C.cream,
            border: `1px solid ${C.sand200}`,
            boxShadow: '0 8px 40px rgba(92,20,32,0.18)',
            overflow: 'clip',
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0, left: 0, right: 0,
              height: '4px',
              background: `linear-gradient(90deg, ${C.gold500}, ${C.saffron300}, ${C.gold500})`,
              zIndex: 1,
            },
          },
        },
      }}
    >
      <DialogTitle sx={{ textAlign: 'center', pt: { xs: 3.5, md: 4 }, px: { xs: 2, md: 4 }, pb: 0, position: 'relative' }}>
        <IconButton
          onClick={closeModal}
          size="small"
          aria-label="Close"
          sx={{ position: 'absolute', top: 12, right: 12, color: C.muted }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
        <Typography
          component="span"
          sx={{
            display: 'block', fontSize: '0.68rem', letterSpacing: '0.18em',
            textTransform: 'uppercase', color: C.maroon700, fontWeight: 600, mb: 1,
          }}
        >
          {open ? 'Reserve your place' : 'RSVP'}
        </Typography>
        <Typography id="rsvp-dialog-title" variant="h2" component="p" sx={{ fontFamily: '"Blue Mirage", serif', fontSize: { xs: '1.6rem', md: '2rem' }, lineHeight: 1.2 }}>
          RSVP
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.25, mt: 2, mb: 1 }}>
          <Box sx={{ height: '1px', width: 36, background: `linear-gradient(to right, transparent, ${C.gold500}, transparent)` }} />
          <Box component="span" sx={{ color: C.gold500, fontSize: 12 }}>✦</Box>
          <Box sx={{ height: '1px', width: 36, background: `linear-gradient(to left, transparent, ${C.gold500}, transparent)` }} />
        </Box>
      </DialogTitle>
      <DialogContent sx={{ px: { xs: 2, md: 4 }, pb: 4, pt: 2 }}>
        {open ? <RsvpForm onClose={closeModal} /> : <RegistrationClosed onClose={closeModal} />}
      </DialogContent>
    </Dialog>
  )
}
