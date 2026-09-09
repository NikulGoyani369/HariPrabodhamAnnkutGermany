import { createTheme, responsiveFontSizes } from '@mui/material/styles'

export const C = {
  maroon700: '#7A1E2B', maroon800: '#5C1420',
  saffron400: '#E8A13C', saffron300: '#F2B84B',
  gold500: '#A07828', gold300: '#C8A86A',
  cream: '#FBF6EC', cream2: '#F6ECD9',
  sand200: '#EADFC6', sand300: '#DFCEA8',
  ink: '#2A1A12', muted: '#6B5138',
  tulsi700: '#3A6B3A',
}

const FONT_SANS  = '"Inter", system-ui, -apple-system, sans-serif'

const baseTheme = createTheme({
  palette: {
    primary:   { main: C.maroon700, dark: C.maroon800, contrastText: C.cream },
    secondary: { main: C.saffron400, dark: C.gold500, contrastText: '#ffffff' },
    background: { default: C.cream, paper: C.cream },
    text: { primary: C.ink, secondary: C.muted },
  },
  typography: { fontFamily: FONT_SANS },
  shape: { borderRadius: 14 },
})

const theme = responsiveFontSizes(baseTheme, { factor: 1.5 })
export default theme

export const HERO_GRADIENT = [
  `radial-gradient(900px 500px at 18% 30%, ${C.saffron300}22, transparent 70%)`,
  `linear-gradient(180deg, ${C.cream} 0%, ${C.cream2} 100%)`,
].join(', ')
