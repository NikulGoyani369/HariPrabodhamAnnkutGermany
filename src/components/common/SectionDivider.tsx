import { Box } from '@mui/material'

interface Props {
  size?: 'sm' | 'lg'
  sx?: object
}

// Decorative lotus divider (from the event poster) — used under section
// headings ("sm") and as a standalone seam between sections ("lg").
export default function SectionDivider({ size = 'sm', sx }: Props) {
  return (
    <Box
      component="img"
      src="/images/lotus-divider.png"
      alt=""
      aria-hidden="true"
      sx={{
        display: 'block',
        mx: 'auto',
        width: size === 'lg' ? { xs: 220, md: 280 } : { xs: 120, md: 140 },
        height: 'auto',
        ...sx,
      }}
    />
  )
}
