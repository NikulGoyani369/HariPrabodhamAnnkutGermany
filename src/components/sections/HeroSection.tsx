import { useNavigate, Link as RouterLink } from 'react-router-dom'
import { Box, Container, Typography, Button, Stack, Link } from '@mui/material'
import type { SxProps, Theme } from '@mui/material'
import { EVENT } from '../../data/data'
import { useRsvpStore } from '../../store/rsvpStore'
import { useRegistrationOpen } from '../../hooks/useRegistrationOpen'
import { useCountdown } from '../../hooks/useCountdown'
import { C } from '../../theme/theme'
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
      <Box aria-hidden="true" sx={s.emberGlow} />

      <Container
        maxWidth="md"
        sx={{ position: 'relative', zIndex: 2, textAlign: 'center' }}
      >
        <Typography component="p" sx={{ ...s.overline }}>
          {EVENT.presents}
        </Typography>
        <Typography sx={s.kicker}>{EVENT.kicker}</Typography>
        <Typography
          component="h1"
          sx={
            [
              s.title,
              {
                background: `linear-gradient(90deg, ${C.ink}, ${C.saffronDeep}, ${C.gold})`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              },
            ] as SxProps<Theme>
          }
        >
          {EVENT.title}
        </Typography>
        <Typography variant="h3" component="p" sx={{ mt: 1, color: C.lilacDeep }}>
          {EVENT.tagline}
        </Typography>

        <Box sx={s.metaRow}>
          {EVENT.dateLabel}&nbsp;·&nbsp;{EVENT.venueName}&nbsp;·&nbsp;{EVENT.city}
        </Box>

        {registrationOpen ? (
          <Stack
            direction="row"
            spacing={1.5}
            sx={s.ctaRow}
            justifyContent="center"
          >
            <Button variant="contained" size="large" onClick={openModal}>
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
            RSVP is not open at the moment.{' '}
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

      <Box
        component="svg"
        viewBox="0 0 1440 160"
        preserveAspectRatio="none"
        aria-hidden="true"
        sx={{
          ...s.waveBottom,
          width: '100%',
          height: { xs: 50, md: 110 },
          display: 'block',
        }}
      >
        <path
          d="M0,70 C300,10 620,120 960,55 C1180,15 1320,80 1440,50 L1440,160 L0,160 Z"
          fill={C.blush}
          fillOpacity="0.3"
        />
        <path
          d="M0,80 C360,20 720,130 1080,60 C1260,25 1380,90 1440,60 L1440,160 L0,160 Z"
          fill={C.mint}
          fillOpacity="0.38"
        />
        <path
          d="M0,110 C240,60 480,140 720,100 C960,55 1200,130 1440,90 L1440,160 L0,160 Z"
          fill={C.lilac}
          fillOpacity="0.34"
        />
      </Box>
    </Box>
  )
}
