import { createTheme, responsiveFontSizes } from '@mui/material/styles'

// ── "Divine Spark" — the real event palette, read from the actual stage
//    backdrop photo: peach-coral lotus petals, seafoam mint, soft lavender
//    and blush pink, warm gold script and lighting, on an ivory ground.
//    A deep gold/espresso anchor (from the backlit "Divine Spark" lettering)
//    carries text and CTAs so contrast stays WCAG-legible; the four petal
//    pastels are used only for washes, gradients and ornaments. ──
export const C = {
  espresso: '#3D2C1A', // headings, footer base — deep warm brown, echoes the gold-lit shadow
  ink:      '#4A3420', // body text
  gold:     '#9C6B2E', // primary — CTA, links, accent text (deep "Divine Spark" gold)
  goldDeep: '#7A5220', // CTA gradient bottom / hover
  sage:     '#3E7A62', // secondary — icons, rules, ✦ ornament, focus ring (deep seafoam)
  sageDeep: '#2F5F4C',
  peach:    '#F4B990', // wash — lotus coral petal
  mint:     '#A9DFC7', // wash — seafoam petal
  lavender: '#C9AEE0', // wash — purple petal
  blossom:  '#F0C4D4', // wash — soft pink petal / curtain
  paper:    '#FBF6EC', // page background — the backdrop's ivory cloth
  paper2:   '#F6EEDF', // input bg, secondary surface
  line:     '#EADFC8', // hairline borders
  line2:    '#DFCEA6', // stronger borders
  muted:    '#6E5A42', // secondary text (AA on paper)
}

const FONT_SERIF = '"Cormorant Garamond", "Cormorant", Georgia, serif'
const FONT_SANS  = '"Inter", system-ui, -apple-system, sans-serif'

const baseTheme = createTheme({
  palette: {
    primary:   { main: C.gold, dark: C.goldDeep, contrastText: '#ffffff' },
    secondary: { main: C.sage, dark: C.sageDeep,  contrastText: '#ffffff' },
    background: { default: C.paper, paper: C.paper },
    text:       { primary: C.ink,  secondary: C.muted },
  },
  typography: {
    fontFamily: FONT_SANS,
    h1: { fontFamily: FONT_SERIF, fontWeight: 500, fontStyle: 'italic', fontSize: '2.75rem', letterSpacing: '-0.01em', color: C.espresso },
    h2: { fontFamily: FONT_SERIF, fontWeight: 500, fontStyle: 'italic', fontSize: '2rem',    letterSpacing: '-0.01em', color: C.espresso },
    h3: { fontFamily: FONT_SERIF, fontWeight: 500, fontStyle: 'italic', fontSize: '1.6rem',  letterSpacing: '-0.01em', color: C.espresso },
    h4: { fontWeight: 600, fontSize: '1.25rem' },
    h5: { fontWeight: 600, fontSize: '1.1rem' },
    h6: { fontWeight: 600, fontSize: '1rem' },
    button: { fontWeight: 600, textTransform: 'none', fontFamily: FONT_SANS },
    overline: { fontFamily: FONT_SANS, fontSize: '0.7rem', letterSpacing: '0.18em', fontWeight: 600, color: C.sage },
  },
  shape: { borderRadius: 14 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 999, padding: '10px 22px', fontWeight: 600 },
        sizeLarge: { padding: '13px 32px', fontSize: '15px' },
        containedPrimary: {
          background: `linear-gradient(180deg, ${C.gold}, ${C.goldDeep})`,
          boxShadow: `0 4px 14px rgba(156,107,46,0.32)`,
          '&:hover': {
            background: `linear-gradient(180deg, ${C.gold}, ${C.goldDeep})`,
            boxShadow: `0 8px 22px rgba(156,107,46,0.42)`,
            transform: 'translateY(-1px)',
          },
        },
        outlinedPrimary: {
          color: C.espresso,
          borderColor: `${C.line2}CC`,
          background: `${C.paper2}99`,
          '&:hover': { background: C.paper2, borderColor: C.line2 },
        },
      },
    },
    MuiContainer: { defaultProps: { maxWidth: 'lg' } },
    MuiCard: {
      styleOverrides: {
        root: {
          border: `1px solid ${C.line}`,
          boxShadow: '0 1px 2px rgba(61,44,26,0.06), 0 6px 20px rgba(61,44,26,0.06)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            background: C.paper2,
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: C.sage,
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

export const PRIMARY   = C.gold
export const SECONDARY = C.sage

export const HERO_GRADIENT = [
  `radial-gradient(880px 480px at 16% 26%, ${C.peach}55, transparent 68%)`,
  `radial-gradient(720px 500px at 84% 58%, ${C.mint}48, transparent 70%)`,
  `radial-gradient(560px 420px at 52% 96%, ${C.lavender}40, transparent 72%)`,
  `linear-gradient(180deg, ${C.paper} 0%, ${C.paper2} 100%)`,
].join(', ')
