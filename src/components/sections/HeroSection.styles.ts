import type { SxProps, Theme } from '@mui/material'
import { C } from '../../theme/theme'

export const heroStyles: Record<string, SxProps<Theme>> = {
  outerBox: {
    background: C.ivory,
    overflow: 'hidden',
    pb: { xs: '56px', md: '80px' },
  },

  // The stage photo from the event poster — a clean, unobstructed band up
  // top (nothing overlaps the murtis), fading into the page background.
  photoBand: {
    position: 'relative',
    height: { xs: 220, sm: 320, md: 460 },
    backgroundImage: 'url(/images/hero-stage.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center 22%',
  },

  photoBandFade: {
    position: 'absolute',
    inset: 0,
    background: `linear-gradient(180deg, transparent 55%, ${C.ivory} 100%)`,
  },

  overline: {
    mt: { xs: 3.5, md: 5 },
    fontSize: { xs: '0.7rem', md: '0.78rem' },
    letterSpacing: '0.22em',
    textTransform: 'uppercase' as const,
    fontWeight: 600,
    color: C.mintDeep,
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

}
