import type { SxProps, Theme } from '@mui/material'
import { C } from '../../theme/theme'

export const rsvpFormStyles: Record<string, SxProps<Theme>> = {
  grid: {
    display: 'grid',
    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
    gap: 2,
  },
  full: { gridColumn: { xs: '1', sm: '1 / -1' } },
  honeypot: {
    position: 'absolute',
    left: '-9999px',
    width: '1px',
    height: '1px',
    overflow: 'hidden',
  },
  submitRow: { mt: 3, display: 'flex', justifyContent: 'flex-end' },
  ornament: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 1.25,
    my: 2,
    color: C.goldLight,
    fontSize: 12,
  },
  phoneRow: {
    gridColumn: { xs: '1', sm: '1 / -1' },
    display: 'grid',
    // A dial code needs far less room than a phone number.
    gridTemplateColumns: { xs: '1fr', sm: 'minmax(0, 0.55fr) minmax(0, 1.45fr)' },
    gap: 2,
  },
  memberHeading: {
    mt: 2.5,
    mb: 1.5,
    fontSize: 13.5,
    fontWeight: 600,
    color: C.ink,
  },
  memberGrid: {
    display: 'grid',
    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
    gap: 2,
  },
  memberCount: {
    fontSize: 12.5,
    color: C.inkSoft,
    mt: 1.5,
  },
}
