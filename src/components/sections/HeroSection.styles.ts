import type { SxProps, Theme } from '@mui/material'
import { C, HERO_GRADIENT } from '../../theme/theme'

export const heroStyles: Record<string, SxProps<Theme>> = {
  outerBox: {
    background: HERO_GRADIENT,
    overflow: 'hidden',
    position: 'relative',
    isolation: 'isolate',
    pt: { xs: '56px', md: '104px' },
    pb: { xs: '90px', md: '170px' },
  },

  // Soft warm glow behind the title — echoes the uplit stage look.
  emberGlow: {
    position: 'absolute',
    top: { xs: '16%', md: '20%' },
    left: '50%',
    transform: 'translateX(-50%)',
    width: { xs: 300, md: 560 },
    height: { xs: 220, md: 340 },
    background: `radial-gradient(circle at 50% 50%, ${C.peach}26, transparent 70%)`,
    filter: 'blur(40px)',
    pointerEvents: 'none',
    zIndex: 0,
  },

  overline: {
    fontSize: { xs: '0.7rem', md: '0.78rem' },
    letterSpacing: '0.22em',
    textTransform: 'uppercase' as const,
    fontWeight: 600,
    color: C.mintDeep,
  },

  kicker: {
    mt: 1.5,
    fontFamily: '"Cormorant Garamond", "Cormorant", Georgia, serif',
    fontStyle: 'italic',
    fontSize: { xs: '1.4rem', md: '1.9rem' },
    color: C.gold,
    lineHeight: 1.1,
  },

  // Fallback color for browsers that don't support background-clip: text —
  // the gradient fill itself is applied at the call site (HeroSection.tsx).
  title: {
    fontFamily: '"Blue Mirage", serif',
    fontSize: { xs: '3rem', md: '5rem' },
    color: C.ink,
    lineHeight: 1,
  },

  metaRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    flexWrap: 'wrap',
    gap: '18px',
    mt: 2.5,
    color: C.inkSoft,
    fontFamily: '"Blue Mirage", serif',
    fontSize: { xs: '1rem', md: '1.25rem' },
    '&::before, &::after': {
      content: '""',
      height: '1px',
      width: '28px',
      background: C.gold,
      display: 'block',
    },
  },

  ctaRow: {
    display: 'flex',
    gap: 1.5,
    mt: 3,
    flexWrap: 'wrap',
  },

  // Countdown
  countdown: {
    mt: 4,
    mx: 'auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 1.5,
    maxWidth: 420,
  },

  // Shared shape/spacing; background and border are set per-cell (see
  // HeroSection.tsx) so each of the four cells gets its own pastel tint.
  cdCell: {
    borderRadius: '12px',
    px: { xs: 0.5, md: 1 },
    py: { xs: 0.75, md: 1.75 },
    textAlign: 'center',
    backdropFilter: 'blur(6px)',
    WebkitBackdropFilter: 'blur(6px)',
  },

  cdNum: {
    fontFamily: '"Cormorant Garamond", serif',
    fontSize: { xs: '1.2rem', md: '2rem' },
    color: C.ink,
    lineHeight: 1,
    fontVariantNumeric: 'tabular-nums',
    letterSpacing: '-0.02em',
    fontWeight: 500,
  },

  cdLabel: {
    fontSize: { xs: '0.52rem', md: '0.65rem' },
    letterSpacing: '0.12em',
    textTransform: 'uppercase' as const,
    color: C.inkMuted,
    mt: { xs: 0.4, md: 0.75 },
    fontWeight: 600,
  },

  waveBottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: -1,
    pointerEvents: 'none',
  },
}
