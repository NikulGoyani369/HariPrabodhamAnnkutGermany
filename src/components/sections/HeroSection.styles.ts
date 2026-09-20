import type { SxProps, Theme } from '@mui/material'
import { C } from '../../theme/theme'

export const heroStyles: Record<string, SxProps<Theme>> = {
  outerBox: {
    background: C.ivory,
    overflow: 'hidden',
    pb: { xs: '56px', md: '80px' },
  },

  // The full event poster (2000x1549, ratio 1.29) is the hero background,
  // shown uncropped at its natural width. Its lower ~28% is a blank cream
  // arc built for text, so the content starts there (--w = image width,
  // capped at 1920px) and simply flows on below the image, which fades into
  // the page background.
  poster: {
    '--w': 'min(100vw, 1920px)',
    position: 'relative',
    maxWidth: 1920,
    mx: 'auto',
    pt: 'calc(var(--w) * 0.56)',
    backgroundImage:
      'url("/images/Annkut%20bg%20image%20for%20website%20-%20web.jpg.jpeg")',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '100% auto',
    backgroundPosition: 'top center',
    '&::after': {
      content: '""',
      position: 'absolute',
      left: 0,
      right: 0,
      top: 'calc(var(--w) * 0.62)',
      height: 'calc(var(--w) * 0.155)',
      background: `linear-gradient(180deg, transparent, ${C.ivory})`,
      pointerEvents: 'none',
    },
  },

  content: {
    position: 'relative',
    zIndex: 1,
    textAlign: 'center',
  },

  // The title is now the poster's lockup image (see HeroSection.tsx) — this
  // controls its display width, centered, responsive.
  titleImg: {
    display: 'block',
    mx: 'auto',
    mt: 2.5,
    width: { xs: '86%', sm: 420, md: 620 },
    maxWidth: '100%',
    height: 'auto',
  },

  highlight: {
    mt: { xs: 1.5, md: 2 },
    fontFamily: '"GC Commune", serif',
    fontWeight: 600,
    fontSize: { xs: '2.05rem', md: '1.3rem' },
    letterSpacing: '0.02em',
    color: '#DE7B8E',
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
    fontFamily: '"GC Commune", serif',
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
};
