# HariPrabodham Annakut RSVP Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a standalone Vite + React landing + free-RSVP site for the HariPrabodham Annakut event ("The Divine Spark"), writing RSVPs directly to Supabase with no payment, auth, or admin UI.

**Architecture:** Single-page React Router app. Every route renders inside a shared `PageShell` (`Navbar` + `main` + `Footer` + `RsvpModal`). The RSVP modal is a one-step MUI `Dialog` toggled by a tiny Zustand store; its form validates locally on submit and calls `submitRsvp()`, which inserts one row into the Supabase `rsvps` table using the anon key. A registration gate compares `Date.now()` to two env-var instants to switch the CTA between "Register Now" and "Learn More" and to swap the form for a closed-notice panel. All editable copy lives in `src/data/data.ts`. A Vercel edge cron pings a `keepalive` table every 3 days.

**Tech Stack:** Vite 7, React 19, TypeScript 5.9 (strict, bundler resolution), MUI 7 + Emotion, React Router 7, Zustand 5, `@supabase/supabase-js` 2, Vitest + @testing-library/react + user-event + jsdom. Deploy target: Vercel (SPA rewrite + edge function).

**Spec:** `docs/superpowers/specs/2026-09-09-hp-annakut-rsvp-site-design.md` — read it alongside this plan. The plan argues from the spec; where they disagree, the spec wins.

**Reference project (read-only, on disk):** `C:\Users\Nikul\hp-landing-page` — the paid-registration site this project is seeded from. Several tasks say "copy reference file X and apply these edits." That repo is a sibling clone; open its files directly. Never modify it.

## Global Constraints

- **Node package manager:** npm (the reference ships `package-lock.json`; this project does too).
- **TypeScript:** `strict: true`, `noUnusedLocals: true`, `noUnusedParameters: true`, `verbatimModuleSyntax: true`, `erasableSyntaxOnly: true`, `moduleResolution: "bundler"`, `allowImportingTsExtensions: true`, `noEmit: true`. Because `verbatimModuleSyntax` is on, **all type-only imports must use `import type { … }`**. Because `allowImportingTsExtensions` is on, local relative imports include the extension (`./theme/theme.ts`, `./App.tsx`) exactly as the reference does.
- **Build command:** `npm run build` = `tsc -b && vite build`. `tsc -b` type-checks `src/**` including test files, so test-only type packages must be resolvable.
- **Lint:** `npm run lint` = `eslint .` must pass with zero errors.
- **Test:** `npm test` = `vitest run` must pass. `npm run test:watch` = `vitest`.
- **Definition of done for every task:** the task's own new/changed tests pass, AND `npm run lint` and `npm run build` are both green. The full `npm test` suite is green at the end of every task from Task 4 onward.
- **Design tokens:** import the `C` token object from `src/theme/theme.ts`; never hardcode hex values in components. Palette is the warm festive "Divine Spark" set defined in Task 3 — maroon / saffron / gold / cream, NOT the reference's lavender / purple.
- **Fonts:** Cormorant Garamond + Inter from Google Fonts (in `index.html`); "Blue Mirage" display face self-hosted from `public/fonts/blue_mirage-webfont.woff2`, `@font-face` in `src/index.css`. Reference `'"Blue Mirage", serif'` font-family strings carry over unchanged.
- **Copy:** all user-visible strings come from `src/data/data.ts`. Placeholder copy is allowed in `data.ts` and the legal pages ONLY, and must be visibly marked (a `// PLACEHOLDER` comment on the line or block). No placeholder copy anywhere else.
- **Base document title:** `HariPrabodham Annakut` (used by `usePageMeta`).
- **No payment, no auth, no admin UI, no QR, no i18n, no email sending** — see spec §10. If a task seems to call for any of these, stop and re-read the spec.

---

## File Structure

**Config / root**
- `package.json` — scripts + deps (no `html5-qrcode`, `xlsx`, `@mui/x-data-grid`).
- `index.html` — SPA entry, meta tags, Google Fonts link.
- `vite.config.ts` — React plugin, manual vendor chunks (react / mui / supabase), Vitest `test` block. No `/api` proxy.
- `eslint.config.js`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json` — copied from reference, `tsconfig.app.json` gains test types.
- `vitest.setup.ts` — imports `@testing-library/jest-dom/vitest`.
- `.gitignore` — the project's current file is already correct (no `docs/` line); leave it.
- `.env.example` — the four `VITE_` vars + a comment listing the Vercel-only server vars.
- `vercel.json` — SPA rewrite, 3 security headers, keepalive cron.

**`api/`**
- `keepalive.ts` — Vercel edge function, unchanged logic from reference.

**`public/`**
- `fonts/blue_mirage-webfont.woff2` — copied from reference.
- `images/logo.png` — placeholder (1×1 or simple mark).
- `favicon.ico` / `og-image.png` — placeholders.
- `robots.txt`, `sitemap.xml` — this project's routes only.

**`src/`**
- `main.tsx` — `BrowserRouter` + `ThemeProvider` + `CssBaseline` + `ScrollToTop` + `<App/>`. No `AuthProvider`, no `consumeInviteParam()`.
- `App.tsx` — `Routes`, `PageShell`, `LandingPage`, `NotFoundPage`, `PageLoader`.
- `index.css` — Blue Mirage `@font-face`, `scroll-behavior`, `.MuiAppBar-root.scrolled` blur, `slideIn` keyframes.
- `vite-env.d.ts` — `/// <reference types="vite/client" />`.
- `theme/theme.ts` — `createTheme` + `responsiveFontSizes`, exported `C`, `HERO_GRADIENT`.
- `data/data.ts` — every editable string and list. One responsibility: content.
- `lib/supabase.ts` — `createClient` from env vars.
- `api/rsvp.ts` — `RsvpInput` type + `submitRsvp()`.
- `store/rsvpStore.ts` — `modalOpen` / `openModal` / `closeModal`.
- `hooks/usePageMeta.ts` — document title + meta description.
- `hooks/useRegistrationOpen.ts` — mount-time snapshot of the gate.
- `hooks/useCountdown.ts` — days/hours/mins/secs to an ISO instant.
- `utils/registrationGate.ts` — `isRegistrationOpenNow()` and helpers.
- `utils/ScrollToTop.tsx` — scroll to top on route change.
- `components/layout/Navbar.tsx` + `Navbar.styles.ts` — fixed AppBar, mobile drawer, CTA.
- `components/layout/Footer.tsx` — tagline + legal + links.
- `components/sections/HeroSection.tsx` + `HeroSection.styles.ts` — typographic hero, countdown, CTA row, wave divider.
- `components/sections/GlanceSection.tsx` — "at a glance" strip from `GLANCE`.
- `components/sections/AboutAnnakutSection.tsx` — about paragraphs + FAQ accordion.
- `components/sections/VenueSection.tsx` — address, map embed, directions, darshan timings.
- `components/sections/ContactSection.tsx` — email card + coordinator cards.
- `components/rsvp/RsvpModal.tsx` — the `Dialog` shell; picks form vs closed-notice.
- `components/rsvp/RsvpForm.tsx` + `RsvpForm.styles.ts` — the one-step form + status machine.
- `components/rsvp/RsvpConfirmation.tsx` — success panel.
- `components/rsvp/RegistrationClosed.tsx` — closed-notice panel.
- `pages/VenuePage.tsx`, `ContactPage.tsx`, `ImpressumPage.tsx`, `DataPrivacyPage.tsx`.
- `supabase/migrations/0001_init.sql` — the schema.

**Tests** (co-located under `src/`)
- `utils/registrationGate.test.ts`
- `api/rsvp.test.ts`
- `components/rsvp/RsvpForm.test.tsx`

---

## Task 1: Toolchain + building skeleton

**Files:**
- Create: `package.json`, `index.html`, `vite.config.ts`, `eslint.config.js`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, `vitest.setup.ts`, `.env.example`
- Create: `src/main.tsx`, `src/App.tsx`, `src/index.css`, `src/vite-env.d.ts`
- Create: `src/theme/theme.ts` (full — see Task 3 for the real palette; here a minimal valid version is fine and Task 3 replaces it)
- Create: `public/fonts/blue_mirage-webfont.woff2` (copy from reference)
- Test: `src/smoke.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: a Vite/React/TS project where `npm install`, `npm run lint`, `npm run build`, and `npm test` all succeed. `src/theme/theme.ts` exports `default` (a theme) and `C` (token object) — Task 3 fills in real values.

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "hp-annakut",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "@emotion/react": "^11.14.0",
    "@emotion/styled": "^11.14.1",
    "@mui/icons-material": "^7.3.9",
    "@mui/material": "^7.3.9",
    "@supabase/supabase-js": "^2.98.0",
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "react-router-dom": "^7.13.1",
    "zustand": "^5.0.11"
  },
  "devDependencies": {
    "@eslint/js": "^9.39.1",
    "@testing-library/dom": "^10.4.0",
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/react": "^16.1.0",
    "@testing-library/user-event": "^14.5.2",
    "@types/node": "^24.10.1",
    "@types/react": "^19.2.7",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react": "^5.1.1",
    "eslint": "^9.39.1",
    "eslint-plugin-react-hooks": "^7.0.1",
    "eslint-plugin-react-refresh": "^0.4.24",
    "globals": "^16.5.0",
    "jsdom": "^25.0.1",
    "typescript": "~5.9.3",
    "typescript-eslint": "^8.48.0",
    "vite": "^7.3.1",
    "vitest": "^3.0.5"
  }
}
```

- [ ] **Step 2: Copy the config files from the reference, with edits**

Copy verbatim from `C:\Users\Nikul\hp-landing-page`:
- `tsconfig.json` — no change.
- `tsconfig.node.json` — no change.
- `eslint.config.js` — no change.

Copy `tsconfig.app.json` then change the `"types"` line to:
```json
    "types": ["vite/client", "vitest/globals", "@testing-library/jest-dom"],
```

- [ ] **Step 3: Create `vite.config.ts`** (reference minus the `/api` proxy and `vendor-qrcode`, plus a Vitest block)

```ts
/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react':    ['react', 'react-dom', 'react-router-dom'],
          'vendor-mui':      ['@mui/material', '@mui/icons-material', '@emotion/react', '@emotion/styled'],
          'vendor-supabase': ['@supabase/supabase-js'],
        },
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    css: false,
  },
})
```

- [ ] **Step 4: Create `vitest.setup.ts`**

```ts
import '@testing-library/jest-dom/vitest'
```

- [ ] **Step 5: Create `src/vite-env.d.ts`**

```ts
/// <reference types="vite/client" />
```

- [ ] **Step 6: Create `index.html`** (adapt the reference; drop the paid-event JSON-LD `offers`, swap titles/paths)

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" href="/favicon.ico" />
    <link rel="apple-touch-icon" href="/images/logo.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="HariPrabodham Annakut — The Divine Spark. Read about the celebration and RSVP for free." />
    <meta property="og:title" content="HariPrabodham Annakut" />
    <meta property="og:description" content="The Divine Spark — join us for the HariPrabodham Annakut celebration." />
    <meta property="og:type" content="website" />
    <meta property="og:image" content="/og-image.png" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="theme-color" content="#7A1E2B" />
    <title>HariPrabodham Annakut</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="true" />
    <link
      href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500;1,600&family=Inter:wght@400;500;600;700&display=swap"
      rel="stylesheet"
    />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 7: Create `src/index.css`** (Blue Mirage face + globals + scrolled blur, retinted to cream per spec §6)

```css
@font-face {
  font-family: 'Blue Mirage';
  src: url('/fonts/blue_mirage-webfont.woff2') format('woff2');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'Blue Mirage';
  src: url('/fonts/blue_mirage-webfont.woff2') format('woff2');
  font-weight: normal;
  font-style: italic;
  font-display: swap;
}

html {
  scroll-behavior: smooth;
  scroll-padding-top: 80px;
}
body {
  overflow-x: hidden;
}

.MuiAppBar-root.scrolled {
  background-color: rgba(251, 246, 236, 0.88) !important;
  backdrop-filter: saturate(140%) blur(12px) !important;
  -webkit-backdrop-filter: saturate(140%) blur(12px) !important;
  border-bottom-color: rgba(200, 168, 106, 0.5) !important;
  box-shadow: 0 1px 0 rgba(255, 255, 255, 0.6) inset !important;
}

@keyframes slideIn {
  from { opacity: 0; transform: translateX(24px); }
  to   { opacity: 1; transform: translateX(0); }
}
```

- [ ] **Step 8: Create a minimal `src/theme/theme.ts`** (Task 3 replaces the palette; this must compile and export the right names)

```ts
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

const FONT_SERIF = '"Cormorant Garamond", "Cormorant", Georgia, serif'
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
```

- [ ] **Step 9: Create `src/App.tsx`** (minimal — Task 11 fills in real routes)

```tsx
import { Box, Typography } from '@mui/material'

export default function App() {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h1">HariPrabodham Annakut</Typography>
    </Box>
  )
}
```

- [ ] **Step 10: Create `src/main.tsx`**

```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider, CssBaseline } from '@mui/material'
import App from './App.tsx'
import theme from './theme/theme.ts'
import ScrollToTop from './utils/ScrollToTop.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ScrollToTop />
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
```

- [ ] **Step 11: Create `src/utils/ScrollToTop.tsx`** (copy from reference `src/components/utils/ScrollToTop.tsx` verbatim — it has no dependencies)

```tsx
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}
```

- [ ] **Step 12: Create `.env.example`**

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_RSVP_OPEN_AT=
VITE_RSVP_CLOSE_AT=
# Vercel-only (NOT VITE_ exposed): SUPABASE_SERVICE_ROLE_KEY, CRON_SECRET
```

- [ ] **Step 13: Copy the font asset**

Copy `C:\Users\Nikul\hp-landing-page\public\fonts\blue_mirage-webfont.woff2` to `public/fonts/blue_mirage-webfont.woff2`. (The `.woff` fallback and specimen files are not needed.)

- [ ] **Step 14: Create `src/smoke.test.ts`**

```ts
import { describe, it, expect } from 'vitest'
import theme, { C } from './theme/theme'

describe('toolchain', () => {
  it('theme exports tokens and a palette', () => {
    expect(C.maroon700).toBe('#7A1E2B')
    expect(theme.palette.primary.main).toBe('#7A1E2B')
  })
})
```

- [ ] **Step 15: Install and run all gates**

Run: `npm install`
Then run, expecting each to pass:
- `npm run lint` → 0 errors
- `npm run build` → `tsc -b` clean, `vite build` writes `dist/`
- `npm test` → 1 passing test

- [ ] **Step 16: Commit**

```bash
git add -A
git commit -m "chore: scaffold Vite + React + TS + Vitest toolchain"
```

---

## Task 2: Content model — `src/data/data.ts`

**Files:**
- Create: `src/data/data.ts`
- Create: `src/hooks/usePageMeta.ts`
- Test: `src/hooks/usePageMeta.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces:
  - `EVENT` — `{ title: string; kicker: string; tagline: string; presents: string; dateISO: string; dateLabel: string; venueName: string; city: string; organiser: string }`
  - `ABOUT_ANNAKUT` — `{ heading: string; paragraphs: string[] }`
  - `GLANCE` — `{ icon: string; title: string; lines: string[] }[]`
  - `DARSHAN_SLOTS` — `string[]`
  - `COUNTRIES` — `{ code: string; label: string; flag: string; dialCode: string }[]`
  - `FAQS` — `{ q: string; a: string }[]`
  - `PEOPLE` — `{ name: string; phone: string; whatsapp: string }[]` (`phone` is a `tel:` URL, `whatsapp` is a `https://wa.me/…` URL)
  - `VENUE` — `{ addressLines: string[]; mapEmbedUrl: string; directions: string[] }`
  - `FOOTER` — `{ brand: string; legal: string; email: string; closing: string }`
  - `NAV_LINKS` — `{ label: string; href: string }[]`
  - `usePageMeta(title?: string, description?: string): void`

- [ ] **Step 1: Write `src/data/data.ts`**

```ts
// src/data/data.ts
// ─── Every editable string for the site lives here. ───
// All values below are PLACEHOLDER content for the organiser to replace.

export const EVENT = {
  title: 'Annakut',
  kicker: 'HariPrabodham',
  tagline: 'The Divine Spark',
  presents: 'HariPrabodham presents',
  dateISO: '2026-11-09T09:00:00+01:00', // PLACEHOLDER
  dateLabel: '9 November 2026',          // PLACEHOLDER
  venueName: 'Venue name',               // PLACEHOLDER
  city: 'City, Germany',                 // PLACEHOLDER
  organiser: 'HariPrabodham',
}

// PLACEHOLDER
export const ABOUT_ANNAKUT = {
  heading: 'About Annakut',
  paragraphs: [
    'Annakut — the "mountain of food" — is offered to the Lord on the day after Diwali in gratitude for the year past.',
    'Join the HariPrabodham family for darshan, kirtan, and prasad as we welcome the new year together.',
  ],
}

// PLACEHOLDER — icon is an emoji rendered as-is
export const GLANCE: { icon: string; title: string; lines: string[] }[] = [
  { icon: '📅', title: 'Date & Time', lines: ['9 November 2026', '09:00 onwards'] },
  { icon: '📍', title: 'Venue', lines: ['Venue name', 'City, Germany'] },
  { icon: '🪔', title: 'Darshan', lines: ['Open through the day', 'See time slots below'] },
  { icon: '🍲', title: 'Prasad', lines: ['Mahaprasad served', 'to all attendees'] },
  { icon: '🎟️', title: 'Entry', lines: ['Free — RSVP requested', 'so we can plan prasad'] },
  { icon: '🅿️', title: 'Parking', lines: ['On-site parking', 'available'] },
]

// PLACEHOLDER
export const DARSHAN_SLOTS = [
  'Morning — 09:00–12:00',
  'Afternoon — 14:00–17:00',
  'Evening — 18:00–21:00',
]

// Dial-code subset reused from the reference project.
export const COUNTRIES = [
  { code: 'DE', label: 'Germany', flag: '🇩🇪', dialCode: '+49' },
  { code: 'AT', label: 'Austria', flag: '🇦🇹', dialCode: '+43' },
  { code: 'CH', label: 'Switzerland', flag: '🇨🇭', dialCode: '+41' },
  { code: 'GB', label: 'United Kingdom', flag: '🇬🇧', dialCode: '+44' },
  { code: 'FR', label: 'France', flag: '🇫🇷', dialCode: '+33' },
  { code: 'NL', label: 'Netherlands', flag: '🇳🇱', dialCode: '+31' },
  { code: 'BE', label: 'Belgium', flag: '🇧🇪', dialCode: '+32' },
  { code: 'IT', label: 'Italy', flag: '🇮🇹', dialCode: '+39' },
  { code: 'ES', label: 'Spain', flag: '🇪🇸', dialCode: '+34' },
  { code: 'PL', label: 'Poland', flag: '🇵🇱', dialCode: '+48' },
  { code: 'IN', label: 'India', flag: '🇮🇳', dialCode: '+91' },
  { code: 'US', label: 'United States', flag: '🇺🇸', dialCode: '+1' },
]

// PLACEHOLDER
export const FAQS = [
  { q: 'Do I need to RSVP?', a: 'Entry is free, but an RSVP helps us prepare enough prasad and seating.' },
  { q: 'Can I bring my family?', a: 'Yes — enter the number of adults and children in the RSVP form.' },
  { q: 'Is there parking?', a: 'On-site parking is available.' },
]

// PLACEHOLDER
export const PEOPLE = [
  { name: 'Coordinator One', phone: 'tel:+490000000000', whatsapp: 'https://wa.me/490000000000' },
  { name: 'Coordinator Two', phone: 'tel:+490000000001', whatsapp: 'https://wa.me/490000000001' },
]

// PLACEHOLDER
export const VENUE = {
  addressLines: ['Venue name', 'Street 1', '00000 City', 'Germany'],
  mapEmbedUrl: 'https://maps.google.com/maps?q=Berlin&z=13&output=embed',
  directions: [
    'By car: parking available on site.',
    'By public transport: nearest stop is a short walk away.',
  ],
}

export const FOOTER = {
  brand: 'HariPrabodham Annakut',
  legal: `© ${new Date().getFullYear()} HariPrabodham. All rights reserved.`,
  email: 'annakut@example.org', // PLACEHOLDER
  closing: 'Jai Swaminarayan 🙏',
}

export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Venue', href: '/venue' },
  { label: 'Contact', href: '/contact' },
]
```

- [ ] **Step 2: Write `src/hooks/usePageMeta.ts`** (adapt reference; new base title)

```ts
import { useEffect } from 'react'

const BASE_TITLE = 'HariPrabodham Annakut'

export function usePageMeta(title?: string, description?: string) {
  useEffect(() => {
    document.title = title ? `${title} · ${BASE_TITLE}` : BASE_TITLE

    if (description) {
      const tag = document.querySelector<HTMLMetaElement>('meta[name="description"]')
      if (tag) tag.content = description
    }

    return () => {
      document.title = BASE_TITLE
    }
  }, [title, description])
}
```

- [ ] **Step 3: Write the failing test `src/hooks/usePageMeta.test.ts`**

```ts
import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { usePageMeta } from './usePageMeta'

describe('usePageMeta', () => {
  it('sets the base title when no title is given', () => {
    renderHook(() => usePageMeta())
    expect(document.title).toBe('HariPrabodham Annakut')
  })

  it('prefixes a page title before the base title', () => {
    renderHook(() => usePageMeta('Venue'))
    expect(document.title).toBe('Venue · HariPrabodham Annakut')
  })

  it('restores the base title on unmount', () => {
    const { unmount } = renderHook(() => usePageMeta('Contact'))
    unmount()
    expect(document.title).toBe('HariPrabodham Annakut')
  })
})
```

- [ ] **Step 4: Run the test**

Run: `npm test -- src/hooks/usePageMeta.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Run gates**

Run: `npm run lint && npm run build`
Expected: both clean.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add content model and usePageMeta hook"
```

---

## Task 3: Real theme + Supabase client + migration

**Files:**
- Modify: `src/theme/theme.ts` (replace the minimal version from Task 1)
- Create: `src/lib/supabase.ts`
- Create: `supabase/migrations/0001_init.sql`
- Modify: `src/smoke.test.ts` (still passes — token values unchanged from Task 1's stub)

**Interfaces:**
- Consumes: nothing.
- Produces:
  - `theme` (default export), `C` token object with keys `maroon700 maroon800 saffron400 saffron300 gold500 gold300 cream cream2 sand200 sand300 ink muted tulsi700`, `HERO_GRADIENT` string.
  - `supabase` — a `SupabaseClient` from `@supabase/supabase-js`.

- [ ] **Step 1: Replace `src/theme/theme.ts` with the full "Divine Spark" theme**

```ts
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
```

- [ ] **Step 2: Create `src/lib/supabase.ts`** (copy reference verbatim — env var names are identical)

```ts
import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string

if (!url || !key) throw new Error('Supabase env vars are not set.')

export const supabase = createClient(url, key)
```

- [ ] **Step 3: Create `supabase/migrations/0001_init.sql`** (verbatim from spec §5)

```sql
-- rsvps ---------------------------------------------------------------
create table public.rsvps (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  full_name    text not null,
  email        text not null,
  phone        text not null,
  city         text not null,
  adults       int  not null check (adults  >= 1  and adults  <= 10),
  children     int  not null default 0 check (children >= 0 and children <= 10),
  darshan_slot text not null,
  notes        text,
  consent      boolean not null
);

alter table public.rsvps enable row level security;

-- anon may INSERT only, and only with consent = true
create policy "public can insert rsvp"
  on public.rsvps for insert to anon
  with check (consent = true);
-- (no select / update / delete policy for anon → denied by default)

create view public.rsvp_summary as
  select created_at, full_name, email, phone, city,
         adults, children, (adults + children) as party_size,
         darshan_slot, notes
  from public.rsvps
  order by created_at desc;

-- keepalive ----------------------------------------------------------
create table public.keepalive (
  id         bigint generated always as identity primary key,
  note       text,
  created_at timestamptz not null default now()
);
alter table public.keepalive enable row level security;
-- written only by the edge function using the service-role key,
-- which bypasses RLS; no anon policy.
```

- [ ] **Step 4: Add a `.env` for local dev/tests** (not committed — `.gitignore` already ignores `.env`)

Create `.env` with dummy values so `import.meta.env` reads are defined during `vite build` and any future dev run:
```
VITE_SUPABASE_URL=https://placeholder.supabase.co
VITE_SUPABASE_ANON_KEY=placeholder-anon-key
VITE_RSVP_OPEN_AT=
VITE_RSVP_CLOSE_AT=
```
(Tests mock `src/lib/supabase.ts` entirely, so these values are never used by Vitest — but `supabase.ts` throws at import time without them, and Task 11 imports it transitively.)

- [ ] **Step 5: Run gates**

Run: `npm run lint && npm run build && npm test`
Expected: all green. `smoke.test.ts` still passes (token values match Task 1's stub).

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: Divine Spark theme, Supabase client, initial migration"
```

---

## Task 4: Registration gate + hooks

**Files:**
- Create: `src/utils/registrationGate.ts`
- Create: `src/hooks/useRegistrationOpen.ts`
- Create: `src/hooks/useCountdown.ts`
- Test: `src/utils/registrationGate.test.ts`

**Interfaces:**
- Consumes: `import.meta.env.VITE_RSVP_OPEN_AT`, `import.meta.env.VITE_RSVP_CLOSE_AT` (ISO strings; blank = unbounded on that side).
- Produces:
  - `isRegistrationOpenNow(): boolean` — `true` when now ≥ open (or open blank) AND now < close (or close blank).
  - `useRegistrationOpen(): boolean` — a mount-time snapshot of `isRegistrationOpenNow()`.
  - `useCountdown(targetISO: string): { d: number; h: number; m: number; s: number }` — clamps to zero once the target passes; ticks every 1s.

- [ ] **Step 1: Write the failing test `src/utils/registrationGate.test.ts`**

```ts
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest'

// The gate reads import.meta.env at call time, so each test stubs the two
// vars then re-imports the module fresh.
async function gateWith(open: string, close: string) {
  vi.stubEnv('VITE_RSVP_OPEN_AT', open)
  vi.stubEnv('VITE_RSVP_CLOSE_AT', close)
  vi.resetModules()
  return await import('./registrationGate')
}

beforeEach(() => {
  vi.useFakeTimers()
  vi.setSystemTime(new Date('2026-06-15T12:00:00Z'))
})
afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllEnvs()
})

describe('isRegistrationOpenNow', () => {
  it('is open when both bounds are blank', async () => {
    const { isRegistrationOpenNow } = await gateWith('', '')
    expect(isRegistrationOpenNow()).toBe(true)
  })

  it('is closed before the open instant', async () => {
    const { isRegistrationOpenNow } = await gateWith('2026-07-01T00:00:00Z', '')
    expect(isRegistrationOpenNow()).toBe(false)
  })

  it('is open within the window', async () => {
    const { isRegistrationOpenNow } = await gateWith('2026-06-01T00:00:00Z', '2026-07-01T00:00:00Z')
    expect(isRegistrationOpenNow()).toBe(true)
  })

  it('is closed after the close instant', async () => {
    const { isRegistrationOpenNow } = await gateWith('', '2026-06-01T00:00:00Z')
    expect(isRegistrationOpenNow()).toBe(false)
  })

  it('treats a blank open bound as "already open"', async () => {
    const { isRegistrationOpenNow } = await gateWith('', '2026-12-01T00:00:00Z')
    expect(isRegistrationOpenNow()).toBe(true)
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- src/utils/registrationGate.test.ts`
Expected: FAIL — `Cannot find module './registrationGate'`.

- [ ] **Step 3: Write `src/utils/registrationGate.ts`**

```ts
// Single source of truth for whether the RSVP form is open.
// Bounds come from two env vars; either may be blank (unbounded on that side).

function parse(value: string | undefined): number | null {
  if (!value || !value.trim()) return null
  const t = new Date(value).getTime()
  return Number.isNaN(t) ? null : t
}

export function isRegistrationOpenNow(): boolean {
  const openAt  = parse(import.meta.env.VITE_RSVP_OPEN_AT as string | undefined)
  const closeAt = parse(import.meta.env.VITE_RSVP_CLOSE_AT as string | undefined)
  const now = Date.now()

  if (openAt !== null && now < openAt) return false
  if (closeAt !== null && now >= closeAt) return false
  return true
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test -- src/utils/registrationGate.test.ts`
Expected: PASS (5 tests).

- [ ] **Step 5: Write `src/hooks/useRegistrationOpen.ts`** (adapt reference)

```ts
import { useState } from 'react'
import { isRegistrationOpenNow } from '../utils/registrationGate'

// One-time-per-mount snapshot. Navbar and Hero have no "opening" event to
// re-check against, so mount-time is the right granularity here.
export function useRegistrationOpen(): boolean {
  return useState(() => isRegistrationOpenNow())[0]
}
```

- [ ] **Step 6: Write `src/hooks/useCountdown.ts`**

```ts
import { useEffect, useState } from 'react'

interface Countdown { d: number; h: number; m: number; s: number }

export function useCountdown(targetISO: string): Countdown {
  const [t, setT] = useState<Countdown>({ d: 0, h: 0, m: 0, s: 0 })

  useEffect(() => {
    const target = new Date(targetISO).getTime()
    const tick = () => {
      const diff = target - Date.now()
      if (Number.isNaN(target) || diff <= 0) {
        setT({ d: 0, h: 0, m: 0, s: 0 })
        return
      }
      setT({
        d: Math.floor(diff / 86_400_000),
        h: Math.floor((diff % 86_400_000) / 3_600_000),
        m: Math.floor((diff % 3_600_000) / 60_000),
        s: Math.floor((diff % 60_000) / 1_000),
      })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [targetISO])

  return t
}
```

- [ ] **Step 7: Run all gates**

Run: `npm run lint && npm run build && npm test`
Expected: all green (smoke + usePageMeta + registrationGate).

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: registration gate, useRegistrationOpen, useCountdown"
```

---

## Task 5: RSVP API contract — `src/api/rsvp.ts`

**Files:**
- Create: `src/api/rsvp.ts`
- Test: `src/api/rsvp.test.ts`

**Interfaces:**
- Consumes: `supabase` from `src/lib/supabase.ts` (mocked in tests via `vi.mock`).
- Produces:
  - `interface RsvpInput { fullName: string; email: string; dialCode: string; phone: string; city: string; adults: number; children: number; darshanSlot: string; notes?: string; consent: boolean }`
  - `async function submitRsvp(input: RsvpInput): Promise<{ id: string }>` — maps camelCase → snake_case, composes `phone` as `"<dialCode without leading +> <digits-only phone>"`, inserts into `rsvps`, returns `{ id }`. Throws `Error` if the Supabase call returns `{ error }`.

- [ ] **Step 1: Write the failing test `src/api/rsvp.test.ts`**

```ts
import { describe, it, expect, vi, beforeEach } from 'vitest'

const single = vi.fn()
const select = vi.fn(() => ({ single }))
const insert = vi.fn(() => ({ select }))
const from   = vi.fn(() => ({ insert }))

vi.mock('../lib/supabase', () => ({ supabase: { from } }))

import { submitRsvp, type RsvpInput } from './rsvp'

const base: RsvpInput = {
  fullName: '  Asha Patel ',
  email: 'asha@example.com',
  dialCode: '+49',
  phone: '030 123-4567',
  city: 'Berlin',
  adults: 2,
  children: 1,
  darshanSlot: 'Morning — 09:00–12:00',
  notes: 'Arriving early',
  consent: true,
}

beforeEach(() => {
  vi.clearAllMocks()
  single.mockResolvedValue({ data: { id: 'rsvp-1' }, error: null })
})

describe('submitRsvp', () => {
  it('maps fields to snake_case and composes the phone string', async () => {
    await submitRsvp(base)
    expect(from).toHaveBeenCalledWith('rsvps')
    expect(insert).toHaveBeenCalledWith({
      full_name: 'Asha Patel',
      email: 'asha@example.com',
      phone: '49 0301234567',
      city: 'Berlin',
      adults: 2,
      children: 1,
      darshan_slot: 'Morning — 09:00–12:00',
      notes: 'Arriving early',
      consent: true,
    })
    expect(select).toHaveBeenCalledWith('id')
  })

  it('returns the new id', async () => {
    await expect(submitRsvp(base)).resolves.toEqual({ id: 'rsvp-1' })
  })

  it('omits notes when blank', async () => {
    await submitRsvp({ ...base, notes: '   ' })
    expect(insert).toHaveBeenCalledWith(expect.objectContaining({ notes: null }))
  })

  it('throws when Supabase returns an error', async () => {
    single.mockResolvedValue({ data: null, error: { message: 'RLS denied' } })
    await expect(submitRsvp(base)).rejects.toThrow('RLS denied')
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- src/api/rsvp.test.ts`
Expected: FAIL — `Cannot find module './rsvp'`.

- [ ] **Step 3: Write `src/api/rsvp.ts`**

```ts
import { supabase } from '../lib/supabase'

export interface RsvpInput {
  fullName: string
  email: string
  dialCode: string
  phone: string
  city: string
  adults: number
  children: number
  darshanSlot: string
  notes?: string
  consent: boolean
}

export async function submitRsvp(input: RsvpInput): Promise<{ id: string }> {
  const digits = input.phone.replace(/[^\d]/g, '')
  const dial = input.dialCode.replace(/^\+/, '')
  const notes = input.notes?.trim() ? input.notes.trim() : null

  const row = {
    full_name: input.fullName.trim(),
    email: input.email.trim(),
    phone: `${dial} ${digits}`,
    city: input.city.trim(),
    adults: input.adults,
    children: input.children,
    darshan_slot: input.darshanSlot,
    notes,
    consent: input.consent,
  }

  const { data, error } = await supabase.from('rsvps').insert(row).select('id').single()

  if (error) throw new Error(error.message)
  return { id: (data as { id: string }).id }
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test -- src/api/rsvp.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 5: Run all gates**

Run: `npm run lint && npm run build && npm test`
Expected: all green.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: submitRsvp API contract with field mapping"
```

---

## Task 6: RSVP store — `src/store/rsvpStore.ts`

**Files:**
- Create: `src/store/rsvpStore.ts`
- Test: `src/store/rsvpStore.test.ts`

**Interfaces:**
- Consumes: `zustand`.
- Produces: `useRsvpStore` — a Zustand hook with state `{ modalOpen: boolean; openModal: () => void; closeModal: () => void }`.

- [ ] **Step 1: Write the failing test `src/store/rsvpStore.test.ts`**

```ts
import { describe, it, expect, beforeEach } from 'vitest'
import { useRsvpStore } from './rsvpStore'

beforeEach(() => {
  useRsvpStore.setState({ modalOpen: false })
})

describe('rsvpStore', () => {
  it('starts closed', () => {
    expect(useRsvpStore.getState().modalOpen).toBe(false)
  })

  it('openModal / closeModal toggle modalOpen', () => {
    useRsvpStore.getState().openModal()
    expect(useRsvpStore.getState().modalOpen).toBe(true)
    useRsvpStore.getState().closeModal()
    expect(useRsvpStore.getState().modalOpen).toBe(false)
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- src/store/rsvpStore.test.ts`
Expected: FAIL — `Cannot find module './rsvpStore'`.

- [ ] **Step 3: Write `src/store/rsvpStore.ts`**

```ts
import { create } from 'zustand'

interface RsvpState {
  modalOpen: boolean
  openModal: () => void
  closeModal: () => void
}

export const useRsvpStore = create<RsvpState>((set) => ({
  modalOpen: false,
  openModal: () => set({ modalOpen: true }),
  closeModal: () => set({ modalOpen: false }),
}))
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test -- src/store/rsvpStore.test.ts`
Expected: PASS (2 tests).

- [ ] **Step 5: Run all gates**

Run: `npm run lint && npm run build && npm test`
Expected: all green.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: rsvp modal store"
```

---

## Task 7: RSVP form + confirmation + closed panel (TDD)

This is the largest task. The form is one MUI step with local `useState` per field, submit-time validation, a honeypot, and a status machine `idle → submitting → success | error`.

**Files:**
- Create: `src/components/rsvp/RsvpForm.tsx`
- Create: `src/components/rsvp/RsvpForm.styles.ts`
- Create: `src/components/rsvp/RsvpConfirmation.tsx`
- Create: `src/components/rsvp/RegistrationClosed.tsx`
- Test: `src/components/rsvp/RsvpForm.test.tsx`

**Interfaces:**
- Consumes: `submitRsvp`, `RsvpInput` from `src/api/rsvp.ts` (mocked in tests); `COUNTRIES`, `DARSHAN_SLOTS`, `PEOPLE`, `FOOTER` from `data.ts`; `C` from theme; `useRsvpStore` for `closeModal`.
- Produces:
  - `RsvpForm` — default export, props `{ onClose: () => void }`. Renders the form; on success swaps itself for `<RsvpConfirmation>`.
  - `RsvpConfirmation` — default export, props `{ name: string; partySize: number; slot: string; onClose: () => void }`.
  - `RegistrationClosed` — default export, no props. Short panel: "RSVP is now closed" + coordinator contacts + link to `/contact`.

- [ ] **Step 1: Write `src/components/rsvp/RsvpForm.styles.ts`**

```ts
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
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    gap: 1.25, my: 2, color: C.gold500, fontSize: 12,
  },
}
```

- [ ] **Step 2: Write `src/components/rsvp/RsvpConfirmation.tsx`**

```tsx
import { Box, Typography, Button } from '@mui/material'
import { C } from '../../theme/theme'

interface Props {
  name: string
  partySize: number
  slot: string
  onClose: () => void
}

export default function RsvpConfirmation({ name, partySize, slot, onClose }: Props) {
  return (
    <Box sx={{ textAlign: 'center', py: { xs: 2, md: 3 } }}>
      <Typography
        variant="h3"
        component="p"
        sx={{ fontFamily: '"Blue Mirage", serif', color: C.maroon800, mb: 1.5 }}
      >
        Jai Swaminarayan 🙏
      </Typography>
      <Typography sx={{ color: C.muted, mb: 2.5 }}>
        Your RSVP is received.
      </Typography>
      <Box
        sx={{
          maxWidth: 320,
          mx: 'auto',
          textAlign: 'left',
          border: `1px solid ${C.sand200}`,
          borderRadius: '14px',
          p: 2,
          mb: 3,
        }}
      >
        <Typography sx={{ fontSize: 14, color: C.ink }}><strong>Name:</strong> {name}</Typography>
        <Typography sx={{ fontSize: 14, color: C.ink }}><strong>Party size:</strong> {partySize}</Typography>
        <Typography sx={{ fontSize: 14, color: C.ink }}><strong>Darshan slot:</strong> {slot}</Typography>
      </Box>
      <Button variant="contained" onClick={onClose}>Close</Button>
    </Box>
  )
}
```

- [ ] **Step 3: Write `src/components/rsvp/RegistrationClosed.tsx`** (adapt reference `src/components/form/RegistrationClosed.tsx`; retint, new copy, add `/contact` link)

```tsx
import { Box, Typography, Link } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { C } from '../../theme/theme'
import { PEOPLE } from '../../data/data'

export default function RegistrationClosed() {
  return (
    <Box sx={{ textAlign: 'center', py: { xs: 3, md: 4 } }}>
      <Typography
        variant="h3"
        component="p"
        sx={{ fontFamily: '"Blue Mirage", serif', color: C.maroon800, mb: 1.5 }}
      >
        RSVP is now closed
      </Typography>
      <Typography sx={{ color: C.muted, fontSize: '0.95rem', mb: 2.5, maxWidth: 420, mx: 'auto' }}>
        Jai Swaminarayan. RSVP for the HariPrabodham Annakut has now closed. For any
        queries, please reach out through our{' '}
        <Link component={RouterLink} to="/contact" sx={{ fontWeight: 600 }}>
          Contact page
        </Link>
        .
      </Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, maxWidth: 420, mx: 'auto' }}>
        {PEOPLE.map((p) => (
          <Box key={p.name} sx={{ border: `1px solid ${C.sand200}`, borderRadius: '14px', p: 2 }}>
            <Typography sx={{ fontSize: '0.95rem', fontWeight: 700, color: C.maroon800 }}>{p.name}</Typography>
            <Box component="a" href={p.phone} sx={{ display: 'block', mt: 0.5, fontSize: '0.9rem', color: C.muted, textDecoration: 'none' }}>
              {p.phone.replace('tel:', '')}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  )
}
```

- [ ] **Step 4: Write the failing test `src/components/rsvp/RsvpForm.test.tsx`**

```tsx
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import RsvpForm from './RsvpForm'

const submitRsvp = vi.fn()
vi.mock('../../api/rsvp', () => ({ submitRsvp: (...a: unknown[]) => submitRsvp(...a) }))

function renderForm() {
  return render(
    <MemoryRouter>
      <RsvpForm onClose={() => {}} />
    </MemoryRouter>,
  )
}

// Fill every required field with valid values. Returns the user-event instance.
async function fillValid(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/full name/i), 'Asha Patel')
  await user.type(screen.getByLabelText(/email/i), 'asha@example.com')
  await user.type(screen.getByLabelText(/phone/i), '030 1234567')
  await user.type(screen.getByLabelText(/city \/ mandal/i), 'Berlin')
  // Adults defaults to 1, children to 0, dial code to +49, darshan slot needs a pick:
  await user.click(screen.getByLabelText(/darshan time slot/i))
  await user.click(screen.getByRole('option', { name: /morning/i }))
  await user.click(screen.getByRole('checkbox', { name: /consent/i }))
}

beforeEach(() => {
  vi.clearAllMocks()
  submitRsvp.mockResolvedValue({ id: 'rsvp-1' })
})

describe('RsvpForm', () => {
  it('shows errors for every required field on empty submit and does not call the API', async () => {
    const user = userEvent.setup()
    renderForm()
    await user.click(screen.getByRole('button', { name: /submit rsvp/i }))
    expect(await screen.findByText(/enter your name/i)).toBeInTheDocument()
    expect(screen.getByText(/enter a valid email/i)).toBeInTheDocument()
    expect(screen.getByText(/enter your phone/i)).toBeInTheDocument()
    expect(screen.getByText(/enter your city/i)).toBeInTheDocument()
    expect(screen.getByText(/choose a darshan/i)).toBeInTheDocument()
    expect(screen.getByText(/please confirm your consent/i)).toBeInTheDocument()
    expect(submitRsvp).not.toHaveBeenCalled()
  })

  it('rejects an invalid email and a too-short phone', async () => {
    const user = userEvent.setup()
    renderForm()
    await user.type(screen.getByLabelText(/email/i), 'not-an-email')
    await user.type(screen.getByLabelText(/phone/i), '123')
    await user.click(screen.getByRole('button', { name: /submit rsvp/i }))
    expect(await screen.findByText(/enter a valid email/i)).toBeInTheDocument()
    expect(screen.getByText(/enter a valid phone/i)).toBeInTheDocument()
    expect(submitRsvp).not.toHaveBeenCalled()
  })

  it('blocks submit while consent is unchecked', async () => {
    const user = userEvent.setup()
    renderForm()
    await user.type(screen.getByLabelText(/full name/i), 'Asha Patel')
    await user.type(screen.getByLabelText(/email/i), 'asha@example.com')
    await user.type(screen.getByLabelText(/phone/i), '030 1234567')
    await user.type(screen.getByLabelText(/city \/ mandal/i), 'Berlin')
    await user.click(screen.getByLabelText(/darshan time slot/i))
    await user.click(screen.getByRole('option', { name: /morning/i }))
    await user.click(screen.getByRole('button', { name: /submit rsvp/i }))
    expect(await screen.findByText(/please confirm your consent/i)).toBeInTheDocument()
    expect(submitRsvp).not.toHaveBeenCalled()
  })

  it('calls submitRsvp once with the expected payload on a valid fill', async () => {
    const user = userEvent.setup()
    renderForm()
    await fillValid(user)
    await user.click(screen.getByRole('button', { name: /submit rsvp/i }))
    await waitFor(() => expect(submitRsvp).toHaveBeenCalledTimes(1))
    expect(submitRsvp).toHaveBeenCalledWith({
      fullName: 'Asha Patel',
      email: 'asha@example.com',
      dialCode: '+49',
      phone: '030 1234567',
      city: 'Berlin',
      adults: 1,
      children: 0,
      darshanSlot: 'Morning — 09:00–12:00',
      notes: '',
      consent: true,
    })
  })

  it('shows the confirmation panel on success', async () => {
    const user = userEvent.setup()
    renderForm()
    await fillValid(user)
    await user.click(screen.getByRole('button', { name: /submit rsvp/i }))
    expect(await screen.findByText(/your rsvp is received/i)).toBeInTheDocument()
    expect(screen.getByText(/Asha Patel/)).toBeInTheDocument()
  })

  it('shows an error alert and keeps the form filled on failure', async () => {
    submitRsvp.mockRejectedValue(new Error('network'))
    const user = userEvent.setup()
    renderForm()
    await fillValid(user)
    await user.click(screen.getByRole('button', { name: /submit rsvp/i }))
    expect(await screen.findByRole('alert')).toBeInTheDocument()
    expect(screen.getByLabelText(/full name/i)).toHaveValue('Asha Patel')
  })

  it('silently fakes success without calling the API when the honeypot is filled', async () => {
    const user = userEvent.setup()
    const { container } = renderForm()
    await fillValid(user)
    const honeypot = container.querySelector('input[name="company"]') as HTMLInputElement
    // jsdom: set the value directly since the field is visually hidden
    await user.type(honeypot, 'spambot')
    await user.click(screen.getByRole('button', { name: /submit rsvp/i }))
    expect(await screen.findByText(/your rsvp is received/i)).toBeInTheDocument()
    expect(submitRsvp).not.toHaveBeenCalled()
  })
})
```

- [ ] **Step 5: Run the test to verify it fails**

Run: `npm test -- src/components/rsvp/RsvpForm.test.tsx`
Expected: FAIL — `Cannot find module './RsvpForm'`.

- [ ] **Step 6: Write `src/components/rsvp/RsvpForm.tsx`**

Key requirements the tests lock in:
- Fields (labels must contain the substrings the tests query): **Full name**, **Email**, **Dial code** (`Select`, default `+49`), **Phone**, **City / Mandal**, **Adults** (`Select` 1–10, default 1), **Children** (`Select` 0–10, default 0), **Darshan time slot** (`Select` from `DARSHAN_SLOTS`, no default), **Notes** (multiline, optional, ≤500), **Consent** checkbox (accessible name contains "consent"), hidden **`company`** honeypot `<input name="company">`.
- Validation on submit only. Error strings (case-insensitive substrings the tests need): `enter your name` (also for <2 / >80 chars), `enter a valid email`, `enter your phone` (empty) / `enter a valid phone` (fails 6–15 digit rule), `enter your city`, `choose a darshan`, `please confirm your consent`.
- `MenuItem` options must have a role of `option` and visible text (MUI `Select` renders these as `role="option"` in the listbox).
- On submit with a non-empty `company`: skip `submitRsvp`, set status `success` with the entered name/party/slot.
- Status machine: `idle | submitting | error | success`. Submit button label "Submit RSVP", `disabled` while `submitting`.
- On `error`: render `<Alert severity="error" role="alert">` above the submit button; keep all field state.
- On `success`: render `<RsvpConfirmation name partySize={adults + children} slot={darshanSlot} onClose={onClose} />` in place of the form.
- Distinguish error copy: if the thrown error message looks like a network failure (`/fetch|network|Failed to fetch/i`) → "Couldn't reach the server. Check your connection and try again."; otherwise → "Something went wrong submitting your RSVP. Please try again or contact us." Always `console.error(err)` the real error.

```tsx
import { useState } from 'react'
import {
  Box, TextField, MenuItem, Checkbox, FormControlLabel, FormHelperText,
  Button, Alert, Typography,
} from '@mui/material'
import { submitRsvp, type RsvpInput } from '../../api/rsvp'
import { COUNTRIES, DARSHAN_SLOTS } from '../../data/data'
import { C } from '../../theme/theme'
import RsvpConfirmation from './RsvpConfirmation'
import { rsvpFormStyles as s } from './RsvpForm.styles'

type Status = 'idle' | 'submitting' | 'error' | 'success'
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

interface Props { onClose: () => void }

export default function RsvpForm({ onClose }: Props) {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [dialCode, setDialCode] = useState('+49')
  const [phone, setPhone] = useState('')
  const [city, setCity] = useState('')
  const [adults, setAdults] = useState(1)
  const [children, setChildren] = useState(0)
  const [darshanSlot, setDarshanSlot] = useState('')
  const [notes, setNotes] = useState('')
  const [consent, setConsent] = useState(false)
  const [company, setCompany] = useState('') // honeypot

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [status, setStatus] = useState<Status>('idle')
  const [submitError, setSubmitError] = useState('')

  const validate = () => {
    const e: Record<string, string> = {}
    const name = fullName.trim()
    if (name.length < 2 || name.length > 80) e.fullName = 'Please enter your name (2–80 characters).'
    if (!EMAIL_RE.test(email.trim())) e.email = 'Please enter a valid email address.'
    const digits = phone.replace(/[\s-]/g, '')
    if (!digits) e.phone = 'Please enter your phone number.'
    else if (!/^\d{6,15}$/.test(digits)) e.phone = 'Please enter a valid phone number (6–15 digits).'
    const c = city.trim()
    if (c.length < 2 || c.length > 60) e.city = 'Please enter your city or mandal.'
    if (!darshanSlot) e.darshanSlot = 'Please choose a darshan time slot.'
    if (notes.length > 500) e.notes = 'Notes must be 500 characters or fewer.'
    if (!consent) e.consent = 'Please confirm your consent to submit.'
    return e
  }

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault()
    const e = validate()
    setErrors(e)
    if (Object.keys(e).length > 0) return

    if (company.trim()) {
      setStatus('success') // honeypot tripped — fake success, no network
      return
    }

    setStatus('submitting')
    setSubmitError('')
    const payload: RsvpInput = {
      fullName, email, dialCode, phone, city, adults, children, darshanSlot, notes, consent,
    }
    try {
      await submitRsvp(payload)
      setStatus('success')
    } catch (err) {
      console.error(err)
      const msg = err instanceof Error ? err.message : ''
      setSubmitError(
        /fetch|network|Failed to fetch/i.test(msg)
          ? "Couldn't reach the server. Check your connection and try again."
          : 'Something went wrong submitting your RSVP. Please try again or contact us.',
      )
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <RsvpConfirmation
        name={fullName.trim()}
        partySize={adults + children}
        slot={darshanSlot}
        onClose={onClose}
      />
    )
  }

  return (
    <Box component="form" noValidate onSubmit={handleSubmit}>
      <Box sx={s.grid}>
        <TextField
          sx={s.full}
          label="Full name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          error={!!errors.fullName}
          helperText={errors.fullName}
          fullWidth
        />
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={!!errors.email}
          helperText={errors.email}
          fullWidth
        />
        <TextField
          label="City / Mandal"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          error={!!errors.city}
          helperText={errors.city}
          fullWidth
        />
        <TextField
          select
          label="Dial code"
          value={dialCode}
          onChange={(e) => setDialCode(e.target.value)}
          fullWidth
        >
          {COUNTRIES.map((c) => (
            <MenuItem key={c.code} value={c.dialCode}>
              {c.flag} {c.label} ({c.dialCode})
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          error={!!errors.phone}
          helperText={errors.phone}
          fullWidth
        />
        <TextField
          select
          label="Adults"
          value={adults}
          onChange={(e) => setAdults(Number(e.target.value))}
          fullWidth
        >
          {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
            <MenuItem key={n} value={n}>{n}</MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Children"
          value={children}
          onChange={(e) => setChildren(Number(e.target.value))}
          fullWidth
        >
          {Array.from({ length: 11 }, (_, i) => i).map((n) => (
            <MenuItem key={n} value={n}>{n}</MenuItem>
          ))}
        </TextField>
        <TextField
          select
          sx={s.full}
          label="Darshan time slot"
          value={darshanSlot}
          onChange={(e) => setDarshanSlot(e.target.value)}
          error={!!errors.darshanSlot}
          helperText={errors.darshanSlot}
          fullWidth
        >
          {DARSHAN_SLOTS.map((slot) => (
            <MenuItem key={slot} value={slot}>{slot}</MenuItem>
          ))}
        </TextField>
        <TextField
          sx={s.full}
          label="Notes (optional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          error={!!errors.notes}
          helperText={errors.notes || `${notes.length}/500`}
          multiline
          minRows={2}
          fullWidth
        />
      </Box>

      {/* Honeypot — visually hidden, not tab-reachable */}
      <Box sx={s.honeypot} aria-hidden="true">
        <label>
          Company
          <input
            name="company"
            tabIndex={-1}
            autoComplete="off"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
        </label>
      </Box>

      <Box sx={{ mt: 1 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              inputProps={{ 'aria-label': 'consent' }}
            />
          }
          label={
            <Typography sx={{ fontSize: 13.5, color: C.muted }}>
              I consent to my details being used to organise this event, per the{' '}
              privacy notice.
            </Typography>
          }
        />
        {errors.consent && <FormHelperText error>{errors.consent}</FormHelperText>}
      </Box>

      {status === 'error' && (
        <Alert severity="error" sx={{ mt: 2 }}>{submitError}</Alert>
      )}

      <Box sx={s.submitRow}>
        <Button type="submit" variant="contained" size="large" disabled={status === 'submitting'}>
          {status === 'submitting' ? 'Submitting…' : 'Submit RSVP'}
        </Button>
      </Box>
    </Box>
  )
}
```

> **Note on the label queries:** MUI renders `<TextField label="Full name">` with an associated `<label>`, so `getByLabelText(/full name/i)` resolves. For `select` TextFields, `getByLabelText(/darshan time slot/i)` returns the button-combobox; clicking it opens the listbox where `getByRole('option', { name: /morning/i })` matches. If a query fails in practice, adjust the label text (keep the substring the test needs) rather than the test.

- [ ] **Step 7: Run the test to verify it passes**

Run: `npm test -- src/components/rsvp/RsvpForm.test.tsx`
Expected: PASS (7 tests). If MUI Select interaction is flaky under jsdom, switch those two `Select` fields (`Dial code`, `Adults`, `Children`, `Darshan`) to `native` (`SelectProps={{ native: true }}` with `<option>`s) — native selects are more test-stable and the test's `getByRole('option', …)` still works. Keep validation behaviour identical.

- [ ] **Step 8: Run all gates**

Run: `npm run lint && npm run build && npm test`
Expected: all green.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: one-step RSVP form with validation, honeypot, confirmation"
```

---

## Task 8: RSVP modal shell — `src/components/rsvp/RsvpModal.tsx`

**Files:**
- Create: `src/components/rsvp/RsvpModal.tsx`
- Test: `src/components/rsvp/RsvpModal.test.tsx`

**Interfaces:**
- Consumes: `useRsvpStore` (`modalOpen`, `closeModal`); `isRegistrationOpenNow` from the gate; `RsvpForm`, `RegistrationClosed`; `C`.
- Produces: `RsvpModal` — default export, no props. A single MUI `Dialog` (`maxWidth="sm"`, `fullWidth`, `fullScreen` on `xs`) with a gold top-border accent. Re-checks `isRegistrationOpenNow()` each time it opens: renders `<RsvpForm onClose={closeModal}>` when open, `<RegistrationClosed>` when closed. Content is unmounted while closed (default `Dialog` behaviour) so each open starts a fresh form.

- [ ] **Step 1: Write the failing test `src/components/rsvp/RsvpModal.test.tsx`**

```tsx
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import RsvpModal from './RsvpModal'
import { useRsvpStore } from '../../store/rsvpStore'

const isOpen = vi.fn()
vi.mock('../../utils/registrationGate', () => ({ isRegistrationOpenNow: () => isOpen() }))
vi.mock('../../api/rsvp', () => ({ submitRsvp: vi.fn() }))

function renderModal() {
  return render(<MemoryRouter><RsvpModal /></MemoryRouter>)
}

beforeEach(() => {
  vi.clearAllMocks()
  useRsvpStore.setState({ modalOpen: false })
})

describe('RsvpModal', () => {
  it('renders nothing visible while closed', () => {
    isOpen.mockReturnValue(true)
    renderModal()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('shows the form when open and registration is open', () => {
    isOpen.mockReturnValue(true)
    renderModal()
    useRsvpStore.setState({ modalOpen: true })
    expect(screen.getByRole('button', { name: /submit rsvp/i })).toBeInTheDocument()
  })

  it('shows the closed panel when registration is closed', () => {
    isOpen.mockReturnValue(false)
    renderModal()
    useRsvpStore.setState({ modalOpen: true })
    expect(screen.getByText(/rsvp is now closed/i)).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /submit rsvp/i })).not.toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- src/components/rsvp/RsvpModal.test.tsx`
Expected: FAIL — `Cannot find module './RsvpModal'`.

- [ ] **Step 3: Write `src/components/rsvp/RsvpModal.tsx`** (adapt the reference `RegisterModal.tsx` shell — same gold-accent `slotProps`, retinted)

```tsx
import { useEffect, useState } from 'react'
import {
  Dialog, DialogTitle, DialogContent, IconButton, Typography, Box,
  useMediaQuery, useTheme,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { useRsvpStore } from '../../store/rsvpStore'
import { isRegistrationOpenNow } from '../../utils/registrationGate'
import { C } from '../../theme/theme'
import RsvpForm from './RsvpForm'
import RegistrationClosed from './RegistrationClosed'

export default function RsvpModal() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const modalOpen = useRsvpStore((s) => s.modalOpen)
  const closeModal = useRsvpStore((s) => s.closeModal)

  const [open, setOpen] = useState(true)
  useEffect(() => {
    if (modalOpen) setOpen(isRegistrationOpenNow())
  }, [modalOpen])

  return (
    <Dialog
      open={modalOpen}
      onClose={closeModal}
      maxWidth="sm"
      fullWidth
      fullScreen={isMobile}
      scroll="paper"
      slotProps={{
        paper: {
          sx: {
            borderRadius: isMobile ? 0 : '22px',
            bgcolor: C.cream,
            border: `1px solid ${C.sand200}`,
            boxShadow: '0 8px 40px rgba(92,20,32,0.18)',
            overflow: 'clip',
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0, left: 0, right: 0,
              height: '4px',
              background: `linear-gradient(90deg, ${C.gold500}, ${C.saffron300}, ${C.gold500})`,
              zIndex: 1,
            },
          },
        },
      }}
    >
      <DialogTitle sx={{ textAlign: 'center', pt: { xs: 3.5, md: 4 }, px: { xs: 2, md: 4 }, pb: 0, position: 'relative' }}>
        <IconButton
          onClick={closeModal}
          size="small"
          aria-label="Close"
          sx={{ position: 'absolute', top: 12, right: 12, color: C.muted }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
        <Typography
          component="span"
          sx={{
            display: 'block', fontSize: '0.68rem', letterSpacing: '0.18em',
            textTransform: 'uppercase', color: C.maroon700, fontWeight: 600, mb: 1,
          }}
        >
          {open ? 'Reserve your place' : 'RSVP'}
        </Typography>
        <Typography variant="h2" component="p" sx={{ fontFamily: '"Blue Mirage", serif', fontSize: { xs: '1.6rem', md: '2rem' }, lineHeight: 1.2 }}>
          RSVP
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.25, mt: 2, mb: 1 }}>
          <Box sx={{ height: '1px', width: 36, background: `linear-gradient(to right, transparent, ${C.gold500}, transparent)` }} />
          <Box component="span" sx={{ color: C.gold500, fontSize: 12 }}>✦</Box>
          <Box sx={{ height: '1px', width: 36, background: `linear-gradient(to left, transparent, ${C.gold500}, transparent)` }} />
        </Box>
      </DialogTitle>
      <DialogContent sx={{ px: { xs: 2, md: 4 }, pb: 4, pt: 2 }}>
        {open ? <RsvpForm onClose={closeModal} /> : <RegistrationClosed />}
      </DialogContent>
    </Dialog>
  )
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test -- src/components/rsvp/RsvpModal.test.tsx`
Expected: PASS (3 tests).

- [ ] **Step 5: Run all gates**

Run: `npm run lint && npm run build && npm test`
Expected: all green.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: RSVP modal shell with open/closed switching"
```

---

## Task 9: Layout — Navbar + Footer

**Files:**
- Create: `src/components/layout/Navbar.tsx`
- Create: `src/components/layout/Navbar.styles.ts`
- Create: `src/components/layout/Footer.tsx`
- Create: `public/images/logo.png` (placeholder)
- Test: `src/components/layout/Navbar.test.tsx`

**Interfaces:**
- Consumes: `NAV_LINKS`, `FOOTER` from `data.ts`; `useRsvpStore` (`openModal`); `useRegistrationOpen`; `C`.
- Produces:
  - `Navbar` — default export. Fixed `AppBar`, `.scrolled` class when `window.scrollY > 20`, right-anchored mobile `Drawer`. Renders `NAV_LINKS` + a contained CTA button: label "Register Now" → `openModal()` when `useRegistrationOpen()`; label "Learn More" → `navigate('/venue')` when closed. Brand = `public/images/logo.png` + "HariPrabodham" / "Annakut" sub-line.
  - `Footer` — default export. Tagline (`EVENT.tagline`), `FOOTER.legal`, links to `/impressum` and `/data-privacy`, `mailto:` `FOOTER.email`, closing `FOOTER.closing`.

- [ ] **Step 1: Create the placeholder logo**

Create `public/images/logo.png` — any small PNG (e.g. a 64×64 solid maroon square). If you cannot generate a binary, copy `C:\Users\Nikul\hp-landing-page\public\images\Final Logo.png` to `public/images/logo.png`. Add a `// PLACEHOLDER` note in the commit message.

- [ ] **Step 2: Write `src/components/layout/Navbar.styles.ts`** — copy the reference `Navbar.styles.ts` and swap every token: `C.cream`/`C.cream2` stay; `C.lavender200 → C.sand200`, `C.lavender300 → C.sand300`, `C.lavender50 → C.cream2`, `C.lavender100 → C.cream2`, `C.purple600 → C.maroon700`, `C.purple800 → C.maroon800`. Drop the `rgba(42,85,66,…)` green shadow → `rgba(122,30,43,…)`.

- [ ] **Step 3: Write `src/components/layout/Navbar.tsx`** — copy the reference `Navbar.tsx` and apply:
  - Import from `../../store/rsvpStore` (`useRsvpStore`) instead of `registrationStore`.
  - `openModal` selector: `useRsvpStore((s) => s.openModal)`.
  - Brand image `src="/images/logo.png"`, alt "HariPrabodham Annakut logo". Brand text "HariPrabodham" with sub-line "Annakut".
  - Keep the `useRegistrationOpen()` → "Register Now" / "Learn More" logic verbatim (closed → `navigate('/venue')`).
  - Remove the reference's `'"Blue Mirage", serif'` inline font override only if it fails to build; otherwise keep.
  - Token swaps as in Step 2.

- [ ] **Step 4: Write `src/components/layout/Footer.tsx`** — copy the reference `Footer.tsx` and apply:
  - Footer gradient `linear-gradient(180deg, ${C.maroon700}, ${C.maroon800})`.
  - Replace the two-line Gujarati/English couplet with a single line: `EVENT.tagline` ("The Divine Spark") in Blue Mirage, plus the small overline `FOOTER.closing`.
  - Keep the bottom bar: `FOOTER.legal` on the left; `Impressum` / `Data Privacy` nav + `mailto:${FOOTER.email}` on the right.
  - Import `EVENT`, `FOOTER` from `../../data/data`.
  - Token swaps: `C.purple800 → C.maroon700`, `C.purple900 → C.maroon800`, `C.gold300` stays.

- [ ] **Step 5: Write the failing test `src/components/layout/Navbar.test.tsx`**

```tsx
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import Navbar from './Navbar'
import { useRsvpStore } from '../../store/rsvpStore'

const regOpen = vi.fn()
vi.mock('../../hooks/useRegistrationOpen', () => ({ useRegistrationOpen: () => regOpen() }))

const renderNav = () => render(<MemoryRouter><Navbar /></MemoryRouter>)

beforeEach(() => {
  vi.clearAllMocks()
  useRsvpStore.setState({ modalOpen: false })
})

describe('Navbar', () => {
  it('opens the RSVP modal from the CTA when registration is open', async () => {
    regOpen.mockReturnValue(true)
    const user = userEvent.setup()
    renderNav()
    await user.click(screen.getByRole('button', { name: /register now/i }))
    expect(useRsvpStore.getState().modalOpen).toBe(true)
  })

  it('shows "Learn More" instead when registration is closed', () => {
    regOpen.mockReturnValue(false)
    renderNav()
    expect(screen.getByRole('button', { name: /learn more/i })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /register now/i })).not.toBeInTheDocument()
  })
})
```

> If `useMediaQuery` defaults to desktop under jsdom (it does — `matchMedia` is stubbed by the setup file in the next step), the desktop CTA renders. If not, add the `matchMedia` polyfill from Step 6 first.

- [ ] **Step 6: Add a `matchMedia` polyfill to `vitest.setup.ts`** (MUI `useMediaQuery` needs it under jsdom)

```ts
import '@testing-library/jest-dom/vitest'

if (!window.matchMedia) {
  window.matchMedia = (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }) as unknown as MediaQueryList
}
```

- [ ] **Step 7: Run the test**

Run: `npm test -- src/components/layout/Navbar.test.tsx`
Expected: PASS (2 tests).

- [ ] **Step 8: Run all gates**

Run: `npm run lint && npm run build && npm test`
Expected: all green.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: Navbar and Footer (placeholder logo)"
```

---

## Task 10: Home sections — Hero, Glance, About

**Files:**
- Create: `src/components/sections/HeroSection.tsx`
- Create: `src/components/sections/HeroSection.styles.ts`
- Create: `src/components/sections/GlanceSection.tsx`
- Create: `src/components/sections/AboutAnnakutSection.tsx`
- Test: `src/components/sections/HeroSection.test.tsx`

**Interfaces:**
- Consumes: `EVENT`, `GLANCE`, `ABOUT_ANNAKUT`, `FAQS` from `data.ts`; `useRsvpStore` (`openModal`); `useRegistrationOpen`; `useCountdown`; `C`, `HERO_GRADIENT`.
- Produces: three default-export section components, each a full-width `<Box component="section">`.

- [ ] **Step 1: Write `src/components/sections/HeroSection.styles.ts`** — adapt the reference `HeroSection.styles.ts`, but this hero is **typographic** (spec §6): drop every `*Img` / `swamijiCol` / `rightImgCol` / `grid` 3-column style. Keep `outerBox` (use `HERO_GRADIENT`), `waveBottom`, `metaRow`, `ctaRow`, `countdown`, `cdCell`, `cdNum`, `cdLabel`. Token swaps: purple→maroon, lavender→sand/cream, gold stays. Wave fills recoloured to `C.saffron300` / `C.gold300`.

- [ ] **Step 2: Write `src/components/sections/HeroSection.tsx`**

Layout, top to bottom, centered:
- Overline: `EVENT.presents` (uppercase, letter-spaced, `C.tulsi700`).
- Title: `EVENT.title` ("Annakut") in Blue Mirage, `fontSize: { xs: '3rem', md: '5rem' }`, with `EVENT.kicker` ("HariPrabodham") as a smaller kicker line above it.
- Tagline: `EVENT.tagline` in Cormorant italic (`variant="h3"`).
- Meta row: `EVENT.dateLabel` · `EVENT.venueName` · `EVENT.city`, using the reference `metaRow` gold-rule treatment.
- CTA row (when `useRegistrationOpen()`): contained "Register Now" → `openModal()`, outlined "Learn More" → `navigate('/venue')`. When closed: a single line "RSVP is not open yet" / "RSVP has closed" with a `RouterLink` to `/venue` labelled "Learn more".
- Countdown: `useCountdown(EVENT.dateISO)` → 4 cells (Days/Hours/Mins/Secs), `d` padded to 3, others to 2.
- Optional CSS-only radial ember glow behind the title (a `Box` with `radial-gradient(..., ${C.saffron300}44, transparent)` and `filter: blur(40px)`, `position: absolute`, `zIndex: 0`).
- Wave-SVG divider at the section bottom (copy the reference's two `<path>` shapes, swap `fill` to `C.saffron300` / `C.gold300`).

```tsx
import { useNavigate, Link as RouterLink } from 'react-router-dom'
import { Box, Container, Typography, Button, Stack, Link } from '@mui/material'
import { EVENT } from '../../data/data'
import { useRsvpStore } from '../../store/rsvpStore'
import { useRegistrationOpen } from '../../hooks/useRegistrationOpen'
import { useCountdown } from '../../hooks/useCountdown'
import { C } from '../../theme/theme'
import { heroStyles as s } from './HeroSection.styles'

export default function HeroSection() {
  const navigate = useNavigate()
  const openModal = useRsvpStore((st) => st.openModal)
  const registrationOpen = useRegistrationOpen()
  const { d, h, m, s: sec } = useCountdown(EVENT.dateISO)

  const cells = [
    { num: String(d).padStart(3, '0'), label: 'Days' },
    { num: String(h).padStart(2, '0'), label: 'Hours' },
    { num: String(m).padStart(2, '0'), label: 'Mins' },
    { num: String(sec).padStart(2, '0'), label: 'Secs' },
  ]

  return (
    <Box component="section" id="hero" sx={s.outerBox}>
      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
        <Typography component="p" sx={{ ...s.overline }}>
          {EVENT.presents}
        </Typography>
        <Typography sx={s.kicker}>{EVENT.kicker}</Typography>
        <Typography component="h1" sx={s.title}>{EVENT.title}</Typography>
        <Typography variant="h3" sx={{ mt: 1, color: C.maroon700 }}>{EVENT.tagline}</Typography>

        <Box sx={s.metaRow}>
          {EVENT.dateLabel}&nbsp;·&nbsp;{EVENT.venueName}&nbsp;·&nbsp;{EVENT.city}
        </Box>

        {registrationOpen ? (
          <Stack direction="row" spacing={1.5} sx={s.ctaRow} justifyContent="center">
            <Button variant="contained" size="large" onClick={openModal}>Register Now</Button>
            <Button variant="outlined" size="large" onClick={() => navigate('/venue')}>Learn More</Button>
          </Stack>
        ) : (
          <Typography sx={{ mt: 3, color: C.maroon700 }}>
            RSVP is not open at the moment.{' '}
            <Link component={RouterLink} to="/venue" sx={{ fontWeight: 600 }}>Learn more</Link>.
          </Typography>
        )}

        <Box sx={s.countdown}>
          {cells.map(({ num, label }) => (
            <Box key={label} sx={s.cdCell}>
              <Typography sx={s.cdNum}>{num}</Typography>
              <Typography sx={s.cdLabel}>{label}</Typography>
            </Box>
          ))}
        </Box>
      </Container>

      <Box component="svg" viewBox="0 0 1440 160" preserveAspectRatio="none" aria-hidden="true"
        sx={{ ...s.waveBottom, width: '100%', height: { xs: 50, md: 110 }, display: 'block' }}>
        <path d="M0,80 C360,20 720,130 1080,60 C1260,25 1380,90 1440,60 L1440,160 L0,160 Z" fill={C.saffron300} fillOpacity="0.35" />
        <path d="M0,110 C240,60 480,140 720,100 C960,55 1200,130 1440,90 L1440,160 L0,160 Z" fill={C.gold300} fillOpacity="0.3" />
      </Box>
    </Box>
  )
}
```

Add `overline`, `kicker`, `title` keys to `HeroSection.styles.ts` (title: Blue Mirage, `fontSize: { xs: '3rem', md: '5rem' }`, `color: C.maroon800`, `lineHeight: 1`).

- [ ] **Step 3: Write `src/components/sections/GlanceSection.tsx`** — adapt the reference `EventInfoSection.tsx` structure (heading "Annakut at a Glance" + `✦` gold ornament, desktop row with vertical `Divider`s, mobile 2-col `Grid`), but drive it from `GLANCE` (`{ icon, title, lines }`), rendering `item.icon` as an emoji `Typography` (no MUI icon imports). Drop the reference's `link` / `renderLine` parts machinery — `lines` is `string[]`. Token swaps purple→maroon, lavender→sand.

- [ ] **Step 4: Write `src/components/sections/AboutAnnakutSection.tsx`** — a centered `Container` with `ABOUT_ANNAKUT.heading` (`variant="h2"`, Blue Mirage), the `✦` ornament, `ABOUT_ANNAKUT.paragraphs` as `<Typography>` blocks, then a FAQ list from `FAQS` using MUI `Accordion` (`<Accordion>` / `<AccordionSummary expandIcon={<ExpandMoreIcon/>}>` / `<AccordionDetails>`). Background `C.cream`.

- [ ] **Step 5: Write the failing test `src/components/sections/HeroSection.test.tsx`**

```tsx
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import HeroSection from './HeroSection'
import { useRsvpStore } from '../../store/rsvpStore'

const regOpen = vi.fn()
vi.mock('../../hooks/useRegistrationOpen', () => ({ useRegistrationOpen: () => regOpen() }))

const renderHero = () => render(<MemoryRouter><HeroSection /></MemoryRouter>)

beforeEach(() => {
  vi.clearAllMocks()
  useRsvpStore.setState({ modalOpen: false })
})

describe('HeroSection', () => {
  it('renders the event tagline', () => {
    regOpen.mockReturnValue(true)
    renderHero()
    expect(screen.getByText(/the divine spark/i)).toBeInTheDocument()
  })

  it('opens the modal from "Register Now" when registration is open', async () => {
    regOpen.mockReturnValue(true)
    const user = userEvent.setup()
    renderHero()
    await user.click(screen.getByRole('button', { name: /register now/i }))
    expect(useRsvpStore.getState().modalOpen).toBe(true)
  })

  it('hides the CTA and shows a learn-more link when closed', () => {
    regOpen.mockReturnValue(false)
    renderHero()
    expect(screen.queryByRole('button', { name: /register now/i })).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: /learn more/i })).toBeInTheDocument()
  })
})
```

- [ ] **Step 6: Run the test**

Run: `npm test -- src/components/sections/HeroSection.test.tsx`
Expected: PASS (3 tests).

- [ ] **Step 7: Run all gates**

Run: `npm run lint && npm run build && npm test`
Expected: all green.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: Hero, Glance, and About sections for the landing page"
```

---

## Task 11: Venue + Contact sections

**Files:**
- Create: `src/components/sections/VenueSection.tsx`
- Create: `src/components/sections/ContactSection.tsx`

**Interfaces:**
- Consumes: `VENUE`, `DARSHAN_SLOTS`, `PEOPLE`, `FOOTER`, `EVENT` from `data.ts`; `C`.
- Produces: two default-export section components.

- [ ] **Step 1: Write `src/components/sections/VenueSection.tsx`** — a slimmed-down adaptation of the reference `VenueSection.tsx`. Keep: section header ("Where it happens" / "The Venue" / `✦` ornament — extract the reference's `Ornament()` helper), the two-column venue card (info side + map `<iframe>`). Drop the entire Berlin-specific transit timeline, car-rental list, ticket-guidelines and BVG blocks. Contents:
  - Info side: `EVENT.venueName` as `variant="h2"` Blue Mirage; `VENUE.addressLines` as a `<dl>`; a "Get Directions" contained button linking to `https://www.google.com/maps/dir/?api=1&destination=` + `encodeURIComponent(VENUE.addressLines.join(', '))`, `target="_blank" rel="noopener"`.
  - Map side: `<Box component="iframe" title="Venue location" src={VENUE.mapEmbedUrl} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen>` with the reference's sizing sx.
  - Below the card: a "Getting here" sub-heading + `VENUE.directions` as a bulleted list, and a "Darshan timings" block listing `DARSHAN_SLOTS`.
  - Give the outer `<Box>` `id="venue"`.
  - Token swaps: purple→maroon, lavender→sand/cream, gold stays.

- [ ] **Step 2: Write `src/components/sections/ContactSection.tsx`** — adapt the reference `ContactSection.tsx` nearly verbatim. Keep the "Reach Out" / "Contact" header + `✦` ornament, the two-card grid: an **Email** card (`mailto:${FOOTER.email}`) and a **Phone / WhatsApp** card iterating `PEOPLE` (`person.name`, `person.phone` as a `tel:` link showing `person.phone.replace('tel:', '')`, and a `person.whatsapp` link labelled "WhatsApp", `target="_blank" rel="noopener noreferrer"`). Give the outer `<Box>` `id="contact"`. Token swaps: purple→maroon, lavender→cream2/sand.

- [ ] **Step 3: Run all gates**

Run: `npm run lint && npm run build && npm test`
Expected: all green (no new tests — these are presentational; they're covered indirectly by the page tests in Task 12).

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: Venue and Contact sections"
```

---

## Task 12: Pages + routing

**Files:**
- Modify: `src/App.tsx` (replace the Task 1 stub)
- Create: `src/pages/VenuePage.tsx`
- Create: `src/pages/ContactPage.tsx`
- Create: `src/pages/ImpressumPage.tsx`
- Create: `src/pages/DataPrivacyPage.tsx`
- Test: `src/App.test.tsx`

**Interfaces:**
- Consumes: all section components; `Navbar`, `Footer`, `RsvpModal`; `usePageMeta`; `C`.
- Produces: `App` default export wiring these routes (spec §3):

  | Route | Element |
  |---|---|
  | `/` | `LandingPage` = Hero + Glance + About |
  | `/venue` | `VenuePage` |
  | `/contact` | `ContactPage` |
  | `/impressum` | `ImpressumPage` |
  | `/data-privacy` | `DataPrivacyPage` |
  | `*` | `NotFoundPage` |

- [ ] **Step 1: Write `src/App.tsx`**

```tsx
import { lazy, Suspense } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { Box, CircularProgress, Typography, Button } from '@mui/material'
import { C } from './theme/theme'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import RsvpModal from './components/rsvp/RsvpModal'
import HeroSection from './components/sections/HeroSection'
import GlanceSection from './components/sections/GlanceSection'
import AboutAnnakutSection from './components/sections/AboutAnnakutSection'
import { usePageMeta } from './hooks/usePageMeta'

const VenuePage       = lazy(() => import('./pages/VenuePage'))
const ContactPage     = lazy(() => import('./pages/ContactPage'))
const ImpressumPage   = lazy(() => import('./pages/ImpressumPage'))
const DataPrivacyPage = lazy(() => import('./pages/DataPrivacyPage'))

function PageLoader() {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <CircularProgress size={32} sx={{ color: C.maroon700 }} />
    </Box>
  )
}

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <Box component="main" sx={{ pt: { xs: '64px', md: '72px' } }}>{children}</Box>
      <Footer />
      <RsvpModal />
    </>
  )
}

function LandingPage() {
  usePageMeta(undefined, 'HariPrabodham Annakut — The Divine Spark. Read about the celebration and RSVP for free.')
  return (
    <PageShell>
      <HeroSection />
      <GlanceSection />
      <AboutAnnakutSection />
    </PageShell>
  )
}

function NotFoundPage() {
  const navigate = useNavigate()
  usePageMeta('Page not found')
  return (
    <PageShell>
      <Box sx={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', px: 2 }}>
        <Typography sx={{ fontFamily: '"Blue Mirage", serif', fontSize: { xs: '5rem', md: '8rem' }, color: C.sand300, lineHeight: 1, mb: 1 }}>404</Typography>
        <Typography variant="h4" sx={{ color: C.maroon800, mb: 1.5 }}>Page not found</Typography>
        <Button variant="contained" size="large" onClick={() => navigate('/')}>Back to Home</Button>
      </Box>
    </PageShell>
  )
}

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/venue" element={<VenuePage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/impressum" element={<ImpressumPage />} />
        <Route path="/data-privacy" element={<DataPrivacyPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  )
}
```

- [ ] **Step 2: Write `src/pages/VenuePage.tsx`**

```tsx
import { usePageMeta } from '../hooks/usePageMeta'
import { PageShell } from '../App'
import VenueSection from '../components/sections/VenueSection'

export default function VenuePage() {
  usePageMeta('Venue', 'Venue, directions and darshan timings for the HariPrabodham Annakut.')
  return (
    <PageShell>
      <VenueSection />
    </PageShell>
  )
}
```

> If importing `PageShell` from `../App` causes a circular-import lint/build issue, extract `PageShell` and `PageLoader` into `src/components/layout/PageShell.tsx` and import from there in both `App.tsx` and every page. Prefer the extraction if in doubt.

- [ ] **Step 3: Write `src/pages/ContactPage.tsx`** — same shape as `VenuePage`, `usePageMeta('Contact', 'Contact the HariPrabodham Annakut team.')`, renders `<ContactSection />`.

- [ ] **Step 4: Write `src/pages/ImpressumPage.tsx`** — adapt the reference `ImpressumPage.tsx`: keep the `Section` / `Para` helpers, the page-hero band, and the white content card. Replace all body copy with a single `// PLACEHOLDER` block: one `<Section title="Impressum">` containing `<Para>` lines "Provider information to be completed by the organiser." and the `FOOTER.email` mailto. `usePageMeta('Impressum', 'Legal notice for the HariPrabodham Annakut.')`. Wrap in `<PageShell>`. Token swaps purple→maroon, lavender→sand, green→tulsi.

- [ ] **Step 5: Write `src/pages/DataPrivacyPage.tsx`** — same treatment as Impressum: reference structure, one `// PLACEHOLDER` `<Section title="Data Privacy">` with `<Para>` copy "Privacy notice to be completed by the organiser. RSVP data (name, contact details, party size, darshan slot, notes) is stored solely to organise this event and is not shared." + `FOOTER.email`. `usePageMeta('Data Privacy', …)`. Wrap in `<PageShell>`.

- [ ] **Step 6: Write the failing test `src/App.test.tsx`**

```tsx
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from './App'

vi.mock('./utils/registrationGate', () => ({ isRegistrationOpenNow: () => true }))
vi.mock('./api/rsvp', () => ({ submitRsvp: vi.fn() }))

function renderAt(path: string) {
  return render(<MemoryRouter initialEntries={[path]}><App /></MemoryRouter>)
}

beforeEach(() => vi.clearAllMocks())

describe('routing', () => {
  it('renders the landing hero at /', async () => {
    renderAt('/')
    expect(await screen.findByText(/the divine spark/i)).toBeInTheDocument()
  })

  it('renders the venue page at /venue', async () => {
    renderAt('/venue')
    expect(await screen.findByRole('heading', { name: /venue/i, level: 2 })).toBeInTheDocument()
  })

  it('renders a 404 for an unknown route', async () => {
    renderAt('/nope')
    expect(await screen.findByText(/page not found/i)).toBeInTheDocument()
  })

  it('sets the document title from usePageMeta', async () => {
    renderAt('/contact')
    await screen.findByText(/contact/i)
    expect(document.title).toBe('Contact · HariPrabodham Annakut')
  })
})
```

- [ ] **Step 7: Run the test**

Run: `npm test -- src/App.test.tsx`
Expected: PASS (4 tests). Adjust the `/venue` heading query if your `VenueSection` uses different heading text — keep the assertion meaningful.

- [ ] **Step 8: Run all gates**

Run: `npm run lint && npm run build && npm test`
Expected: all green — full suite.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: pages and React Router wiring"
```

---

## Task 13: Deploy config, static files, keepalive

**Files:**
- Create: `vercel.json`
- Create: `api/keepalive.ts`
- Create: `public/robots.txt`
- Create: `public/sitemap.xml`
- Create: `public/favicon.ico`, `public/og-image.png` (placeholders)

**Interfaces:**
- Consumes: env vars `SUPABASE_SERVICE_ROLE_KEY`, `CRON_SECRET`, `VITE_SUPABASE_URL` (server-side, on Vercel).
- Produces: a deployable Vercel project. No app code depends on this task.

- [ ] **Step 1: Create `vercel.json`** (copy the reference verbatim — SPA rewrite, 3 security headers, keepalive cron `0 6 */3 * *`)

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" }
      ]
    }
  ],
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ],
  "crons": [
    { "path": "/api/keepalive", "schedule": "0 6 */3 * *" }
  ]
}
```

- [ ] **Step 2: Create `api/keepalive.ts`** (copy the reference verbatim — the table name `keepalive` and env vars match)

```ts
import { createClient } from "@supabase/supabase-js";

export const config = { runtime: "edge" };

export default async function handler(req: Request) {
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const supabase = createClient(
    process.env.VITE_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  const { error } = await supabase.from("keepalive").insert({ note: "cron ping" });

  if (error) {
    return new Response(JSON.stringify({ ok: false, error: error.message }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ ok: true, at: new Date().toISOString() }), {
    headers: { "content-type": "application/json" },
  });
}
```

- [ ] **Step 3: Create `public/robots.txt`** (nothing sensitive to hide — spec §3)

```
User-agent: *
Allow: /

Sitemap: https://your-domain.example/sitemap.xml
```

- [ ] **Step 4: Create `public/sitemap.xml`** (this project's routes only)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://your-domain.example/</loc><priority>1.0</priority><changefreq>weekly</changefreq></url>
  <url><loc>https://your-domain.example/venue</loc><priority>0.8</priority><changefreq>monthly</changefreq></url>
  <url><loc>https://your-domain.example/contact</loc><priority>0.6</priority><changefreq>monthly</changefreq></url>
</urlset>
```

- [ ] **Step 5: Create placeholder `public/favicon.ico` and `public/og-image.png`**

Any valid small files. If you cannot author binaries, copy `C:\Users\Nikul\hp-landing-page\public\images\Final Logo.png` to both names (a PNG served as `.ico` still resolves in browsers for dev). Note "PLACEHOLDER" in the commit message.

- [ ] **Step 6: Confirm `tsc -b` does not try to compile `api/`**

`tsconfig.app.json` has `"include": ["src"]` and `tsconfig.node.json` has `"include": ["vite.config.ts"]`, so `api/keepalive.ts` is outside both — `tsc -b` ignores it (Vercel compiles it separately at deploy). No action needed unless `npm run build` errors on it; if it does, add `"exclude": ["api"]` to `tsconfig.json`.

- [ ] **Step 7: Run all gates**

Run: `npm run lint && npm run build && npm test`
Expected: all green.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "chore: Vercel config, keepalive edge function, robots/sitemap (placeholder icons)"
```

---

## Task 14: Manual smoke run + spec-to-build reconciliation

**Files:** none created; may touch any file for small fixes.

- [ ] **Step 1: Dev-server smoke test**

Create a real `.env` (if not already present from Task 3 Step 4) pointing at a scratch Supabase project OR keep the placeholder values and expect the insert to fail gracefully. Run `npm run dev`, then in a browser:
- `/` renders hero + glance + about, no console errors.
- "Register Now" opens the modal; empty submit shows field errors; a full valid submit either succeeds (real Supabase) or shows the friendly error alert (placeholder env) — both are acceptable here.
- `/venue`, `/contact`, `/impressum`, `/data-privacy` render inside the shell; `/nope` shows 404.
- Navbar CTA + mobile drawer work; footer links navigate.
- Set `VITE_RSVP_CLOSE_AT` to a past ISO in `.env`, restart, confirm the CTA becomes "Learn More" and the modal shows the closed panel. Revert.

- [ ] **Step 2: Spec checklist pass**

Re-read spec §§3–9 and tick each requirement against the build. Fix any gap with a focused commit. Known deferred items (allowed): real content/images/Supabase project (organiser supplies), bot-verification (out of scope).

- [ ] **Step 3: Final gates**

Run: `npm run lint && npm run build && npm test`
Expected: all green.

- [ ] **Step 4: Commit any fixes**

```bash
git add -A
git commit -m "fix: smoke-test corrections"
```

---

## Self-Review

**1. Spec coverage**

| Spec section | Covered by |
|---|---|
| §2 toolchain carried over (vite/tsconfig/eslint/gitignore) | Task 1 |
| §2 vercel.json (rewrite, headers, cron) | Task 13 |
| §2 keepalive edge fn | Task 13 |
| §2 app shell (main, PageShell, Navbar, Footer, usePageMeta, ScrollToTop) | Tasks 1, 2, 9, 12 |
| §2 Blue Mirage font + design language | Tasks 1 (font/css), 3 (theme) |
| §2 supabase lib | Task 3 |
| §2 "left behind" (5-step wizard, Stripe, quotas, admin, auth, deps) | Never created — Task 1 dep list omits them |
| §3 routes + PageShell | Task 12 |
| §3 Navbar (links, Register/Learn More, scrolled, drawer, brand) | Task 9 |
| §3 robots.txt / sitemap.xml | Task 13 |
| §4 RsvpModal (Dialog, gold accent, sm/fullScreen) | Task 8 |
| §4.1 rsvpStore | Task 6 |
| §4.2 form fields + rules + honeypot | Task 7 |
| §4.3 submitRsvp contract + status machine + success/error copy | Tasks 5, 7 |
| §4.4 registrationGate + useRegistrationOpen + modal re-check | Tasks 4, 8 |
| §5 migration SQL (rsvps, RLS, rsvp_summary, keepalive) | Task 3 |
| §5 known limitation (honeypot mitigation) | Task 7 |
| §6 theme tokens, typography, button/textfield overrides, index.css blur | Tasks 1, 3 |
| §6 typographic hero + countdown + wave divider + ember glow | Task 10 |
| §7 data.ts content model (all exports) | Task 2 |
| §7 usePageMeta base title | Task 2 |
| §8 project layout | all tasks |
| §8 .env.example | Task 1 |
| §9 Vitest setup + the 3 required test files + gates | Tasks 1, 4, 5, 7 |

FAQ rendering: spec §7 lists `FAQS` in the content model but §3 defines no FAQ route. Resolved by folding a FAQ accordion into `AboutAnnakutSection` (Task 10 Step 4) so the export is consumed.

**2. Placeholder scan** — "PLACEHOLDER" appears only where the spec sanctions it: `data.ts` (Task 2), the legal pages and icons/logo (Tasks 9, 12, 13). Every code step contains real code. No "TBD"/"add error handling"/"similar to Task N" left in.

**3. Type consistency** — `submitRsvp(input: RsvpInput): Promise<{ id: string }>` defined in Task 5, consumed with that exact shape in Task 7. `RsvpInput` field names (`fullName, email, dialCode, phone, city, adults, children, darshanSlot, notes?, consent`) match between Tasks 5 and 7. `useRsvpStore` shape (`modalOpen/openModal/closeModal`) consistent across Tasks 6, 8, 9, 10. `useCountdown(targetISO)` returns `{ d, h, m, s }` in Task 4, destructured as `{ d, h, m, s: sec }` in Task 10. `isRegistrationOpenNow()` (Task 4) mocked with that name in Tasks 8, 12. `PageShell` exported from `App.tsx` (Task 12) with the extraction fallback noted. `C` token keys used in components all exist in the Task 3 token object.

---

## Execution Handoff

**Plan complete and saved to `docs/superpowers/plans/2026-09-09-hp-annakut-rsvp-site.md`. Two execution options:**

**1. Subagent-Driven (recommended)** — a fresh subagent per task, review between tasks, fast iteration.

**2. Inline Execution** — execute tasks in this session using executing-plans, batch execution with checkpoints.

**Which approach?**
