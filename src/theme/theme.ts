import { createTheme, responsiveFontSizes } from '@mui/material/styles'

// ── "The Divine Spark" — warm festive palette (spec §6) ──
export const C = {
  maroon700: '#7A1E2B',
  maroon800: '#5C1420',
  saffron400: '#E8A13C',
  saffron300: '#F2B84B',
  gold500: '#A07828',
  gold300: '#C8A86A',
  cream: '#FBF6EC',
  cream2: '#F6ECD9',
  sand200: '#EADFC6',
  sand300: '#DFCEA8',
  ink: '#2A1A12',
  muted: '#6B5138',
  tulsi700: '#3A6B3A',
}

const FONT_SERIF = '"Cormorant Garamond", "Cormorant", Georgia, serif'
const FONT_SANS  = '"Inter", system-ui, -apple-system, sans-serif'

const baseTheme = createTheme({
  palette: {
    primary:   { main: C.maroon700, dark: C.maroon800, contrastText: C.cream },
    secondary: { main: C.saffron400, dark: C.gold500,  contrastText: '#ffffff' },
    background: { default: C.cream, paper: C.cream },
    text:       { primary: C.ink,   secondary: C.muted },
  },
  typography: {
    fontFamily: FONT_SANS,
    h1: { fontFamily: FONT_SERIF, fontWeight: 500, fontStyle: 'italic', fontSize: '2.75rem', letterSpacing: '-0.01em', color: C.maroon800 },
    h2: { fontFamily: FONT_SERIF, fontWeight: 500, fontStyle: 'italic', fontSize: '2rem',    letterSpacing: '-0.01em', color: C.maroon800 },
    h3: { fontFamily: FONT_SERIF, fontWeight: 500, fontStyle: 'italic', fontSize: '1.6rem',  letterSpacing: '-0.01em', color: C.maroon800 },
    h4: { fontWeight: 600, fontSize: '1.25rem' },
    h5: { fontWeight: 600, fontSize: '1.1rem' },
    h6: { fontWeight: 600, fontSize: '1rem' },
    button: { fontWeight: 600, textTransform: 'none', fontFamily: FONT_SANS },
    overline: { fontFamily: FONT_SANS, fontSize: '0.7rem', letterSpacing: '0.18em', fontWeight: 600, color: C.tulsi700 },
  },
  shape: { borderRadius: 14 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 999, padding: '10px 22px', fontWeight: 600 },
        sizeLarge: { padding: '13px 32px', fontSize: '15px' },
        containedPrimary: {
          background: `linear-gradient(180deg, ${C.maroon700}, ${C.maroon800})`,
          boxShadow: `0 4px 14px rgba(122,30,43,0.28)`,
          '&:hover': {
            background: `linear-gradient(180deg, ${C.maroon700}, ${C.maroon800})`,
            boxShadow: `0 8px 22px rgba(122,30,43,0.36)`,
            transform: 'translateY(-1px)',
          },
        },
        outlinedPrimary: {
          color: C.maroon800,
          borderColor: `${C.sand300}88`,
          background: `${C.cream2}99`,
          '&:hover': { background: C.cream2, borderColor: C.sand300 },
        },
      },
    },
    MuiContainer: { defaultProps: { maxWidth: 'lg' } },
    MuiCard: {
      styleOverrides: {
        root: {
          border: `1px solid ${C.sand200}`,
          boxShadow: '0 1px 2px rgba(92,20,32,0.06), 0 2px 8px rgba(92,20,32,0.04)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            background: C.cream2,
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: C.gold500,
              borderWidth: 1,
            },
          },
        },
      },
    },
  },
})

const theme = responsiveFontSizes(baseTheme, { factor: 1.5 })
export default theme

export const PRIMARY   = C.maroon700
export const SECONDARY = C.saffron400

export const HERO_GRADIENT = [
  `radial-gradient(900px 500px at 18% 30%, ${C.saffron300}33, transparent 70%)`,
  `radial-gradient(700px 480px at 80% 60%, ${C.gold300}2E, transparent 72%)`,
  `linear-gradient(180deg, ${C.cream} 0%, ${C.cream2} 100%)`,
].join(', ')
