import { createTheme, responsiveFontSizes } from '@mui/material/styles'

// ── User-specified "pastel mandir-decor" palette. Every color below is one
//    of the given tokens verbatim — nothing invented, nothing carried over
//    from the previous brown/olive-green "Divine Spark" scheme. ──
export const C = {
  // Neutrals / surfaces
  ivory: '#FBF4E9', // page background
  cream: '#F6EADA', // alternate section background
  shell: '#EFE0CD', // card background, subtle borders

  // Pastels — the core identity
  blush:     '#F2C6CE',
  blushDeep: '#E0A3B0',
  lilac:     '#C9A7D0',
  lilacDeep: '#B493BB',
  mint:      '#BFD3C4',
  mintDeep:  '#9EA79C',
  peach:     '#F3C39B',
  peachDeep: '#E2AD8E',

  // Accents
  saffron:     '#E98A3C', // primary CTA / highlights
  saffronDeep: '#fe998b ', // hover state
  gold:        '#C9A25A', // dividers, thin borders, small-caps labels
  goldLight:   '#E3C489',

  // Text
  ink:      '#7a6450', // headings and body
  inkSoft:  '#7A6450', // secondary text
  inkMuted: '#9C8974', // captions, labels
}

const FONT_SERIF = '"Cormorant Garamond", "Cormorant", Georgia, serif'
const FONT_SANS  = '"Inter", system-ui, -apple-system, sans-serif'

const baseTheme = createTheme({
  palette: {
    primary:   { main: C.saffron, dark: C.saffronDeep, contrastText: '#ffffff' },
    secondary: { main: C.mintDeep, contrastText: '#ffffff' },
    background: { default: C.ivory, paper: C.ivory },
    text:       { primary: C.ink,  secondary: C.inkSoft },
  },
  typography: {
    fontFamily: FONT_SANS,
    h1: { fontFamily: FONT_SERIF, fontWeight: 500, fontStyle: 'italic', fontSize: '2.75rem', letterSpacing: '-0.01em', color: C.ink },
    h2: { fontFamily: FONT_SERIF, fontWeight: 500, fontStyle: 'italic', fontSize: '2rem',    letterSpacing: '-0.01em', color: C.ink },
    h3: { fontFamily: FONT_SERIF, fontWeight: 500, fontStyle: 'italic', fontSize: '1.6rem',  letterSpacing: '-0.01em', color: C.ink },
    h4: { fontWeight: 600, fontSize: '1.25rem' },
    h5: { fontWeight: 600, fontSize: '1.1rem' },
    h6: { fontWeight: 600, fontSize: '1rem' },
    button: { fontWeight: 600, textTransform: 'none', fontFamily: FONT_SANS },
    overline: { fontFamily: FONT_SANS, fontSize: '0.7rem', letterSpacing: '0.18em', fontWeight: 600, color: C.mintDeep },
  },
  shape: { borderRadius: 14 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 999, padding: '10px 22px', fontWeight: 600 },
        sizeLarge: { padding: '13px 32px', fontSize: '15px' },
        // Primary CTA: saffron -> saffron-deep gradient, white text, warm shadow.
        containedPrimary: {
          background: `linear-gradient(180deg, ${C.saffron}, ${C.saffronDeep})`,
          boxShadow: `0 4px 14px rgba(233,138,60,0.22)`,
          '&:hover': {
            background: `linear-gradient(180deg, ${C.saffron}, ${C.saffronDeep})`,
            boxShadow: `0 8px 24px rgba(233,138,60,0.28)`,
            transform: 'translateY(-1px)',
          },
        },
        // Secondary ("Learn More"): transparent, 1.5px gold border, ink text.
        outlinedPrimary: {
          color: C.ink,
          borderWidth: '1.5px',
          borderColor: C.gold,
          background: 'transparent',
          '&:hover': { background: C.shell, borderWidth: '1.5px', borderColor: C.gold },
        },
      },
    },
    MuiContainer: { defaultProps: { maxWidth: 'lg' } },
    MuiCard: {
      styleOverrides: {
        root: {
          border: `1px solid ${C.shell}`,
          boxShadow: '0 1px 2px rgba(74,55,40,0.06), 0 6px 20px rgba(74,55,40,0.06)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            background: C.shell,
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: C.mintDeep,
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

export const PRIMARY   = C.saffron
export const SECONDARY = C.mintDeep

// "Register Now" CTA: flat coral. Sets `background` (not bgcolor) so it
// replaces the saffron gradient that containedPrimary paints.
export const CORAL = '#fe998b'

export const registerCtaSx = {
  background: CORAL,
  boxShadow: '0 4px 14px rgba(254,153,139,0.35)',
  '&:hover': {
    background: '#f98a7b',
    boxShadow: '0 8px 22px rgba(254,153,139,0.45)',
  },
}
