import { useNavigate, Link as RouterLink } from 'react-router-dom'
import { Box, Container, Typography, Button, Stack, Link } from '@mui/material'
import type { SxProps, Theme } from '@mui/material'
import { EVENT } from '../../data/data'
import { useRsvpStore } from '../../store/rsvpStore'
import { useRegistrationOpen } from '../../hooks/useRegistrationOpen'
import { useCountdown } from '../../hooks/useCountdown'
import { C, registerCtaSx } from '../../theme/theme'
import { heroStyles as s } from './HeroSection.styles'

export default function HeroSection() {
  const navigate = useNavigate()
  const openModal = useRsvpStore((st) => st.openModal)
  const registrationOpen = useRegistrationOpen()
  const { d, h, m, s: sec } = useCountdown(EVENT.dateISO)

  // Each countdown cell gets its own pastel tint, in this order.
  const cells = [
    { num: String(d).padStart(3, '0'), label: 'Days',  tint: C.blush, deep: C.blushDeep },
    { num: String(h).padStart(2, '0'), label: 'Hours', tint: C.peach, deep: C.peachDeep },
    { num: String(m).padStart(2, '0'), label: 'Mins',  tint: C.mint,  deep: C.mintDeep },
    { num: String(sec).padStart(2, '0'), label: 'Secs', tint: C.lilac, deep: C.lilacDeep },
  ]

  return (
    <Box component="section" id="hero" sx={s.outerBox}>
      <Box sx={s.poster}>
      <Container maxWidth="md" sx={s.content}>
        <Typography component="h1" sx={{ m: 0 }}>
          <Box
            component="img"
            src="/images/title-lockup.png"
            alt={`${EVENT.title} Utsav — ${EVENT.tagline}`}
            sx={s.titleImg}
          />
        </Typography>

        <Typography sx={s.highlight}>{EVENT.highlight}</Typography>

        <Box sx={s.metaRow}>
          {EVENT.dateLabel}&nbsp;·&nbsp;{EVENT.venueName}&nbsp;·&nbsp;
          {EVENT.city}
        </Box>

        {registrationOpen ? (
          <Stack
            direction="row"
            spacing={1.5}
            sx={s.ctaRow}
            justifyContent="center"
          >
            <Button
              variant="contained"
              size="large"
              onClick={openModal}
              sx={registerCtaSx}
            >
              Register Now
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/venue')}
            >
              Learn More
            </Button>
          </Stack>
        ) : (
          <Typography sx={{ mt: 3, color: C.inkSoft }}>
            Registration is not open at the moment.{' '}
            <Link component={RouterLink} to="/venue" sx={{ fontWeight: 600 }}>
              Learn more
            </Link>
            .
          </Typography>
        )}

        <Box sx={s.countdown}>
          {cells.map(({ num, label, tint, deep }) => (
            <Box
              key={label}
              sx={
                [
                  s.cdCell,
                  {
                    background: `color-mix(in srgb, ${tint} 35%, ${C.cream})`,
                    border: `1px solid ${deep}66`,
                  },
                ] as SxProps<Theme>
              }
            >
              <Typography sx={s.cdNum}>{num}</Typography>
              <Typography sx={s.cdLabel}>{label}</Typography>
            </Box>
          ))}
        </Box>
      </Container>
      </Box>
    </Box>
  );
}
