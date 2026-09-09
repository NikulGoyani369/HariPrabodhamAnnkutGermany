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
    color: C.gold500,
    fontSize: 12,
  },
}
