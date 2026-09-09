# HariPrabodham Annakut — RSVP Site Design

**Date:** 2026-09-09
**Status:** Approved (design), pending spec review
**Repo:** `C:\Users\Nikul\hp-annakut` (new, sibling of the `hp-landing-page` clone)

---

## 1. Purpose

A standalone landing + registration site for the **HariPrabodham Annakut**
event, themed **"The Divine Spark."** Visitors read about the event and
submit a **free RSVP**. There is no payment, no ticketing pipeline, no
admin UI — organisers read submissions in the Supabase dashboard.

The site is seeded from the structure of the existing
`hp-landing-page` project (Vite + React 19 + TypeScript + MUI 7 + React
Router 7 + Zustand + Supabase client) but leaves behind everything tied
to paid registration: the 5-step wizard, Stripe / FastAPI integration,
country quotas, the Berlin city-tour flow, and the admin QR scanner.

---

## 2. Reference project — what carries over

Source of truth for patterns: `C:\Users\Nikul\hp-landing-page` (GitHub:
`Varunt36/hp-landing-page`).

**Carried over (adapted):**

- Toolchain: `vite.config.ts` (minus the FastAPI `/api` proxy and the
  `vendor-qrcode` manual chunk), `tsconfig.json` / `tsconfig.app.json`
  / `tsconfig.node.json`, `eslint.config.js`, `.gitignore`.
- Deploy: `vercel.json` — SPA rewrite `/(.*) -> /`, the three security
  headers (`Referrer-Policy`, `X-Content-Type-Options`,
  `X-Frame-Options`), and the `/api/keepalive` cron
  (`0 6 */3 * *`).
- `.gitignore` — copied, **but drop the reference's trailing `docs/`
  ignore line** so this spec and future design docs stay tracked.
- `api/keepalive.ts` — edge function, unchanged except project env names.
- App shell: `src/main.tsx` (BrowserRouter + ThemeProvider + CssBaseline
  + ScrollToTop), the `PageShell` pattern from `src/App.tsx`, `Navbar`,
  `Footer`, `usePageMeta`, `ScrollToTop`.
- Section component patterns: `HeroSection`, `EventInfoSection`
  ("at a glance" strip), `ContactSection`, `VenueSection`.
- Content model: a single `src/data/data.ts` holding all editable copy.
- Design language: Cormorant Garamond (italic headings) + Inter (body)
  + the **Blue Mirage** display font (`public/fonts/blue_mirage-webfont.woff2`,
  copied from the reference — same organisation's asset). Pill buttons,
  the `✦` gold divider ornament, wave-SVG section dividers.
- `src/lib/supabase.ts` — `createClient` from `VITE_SUPABASE_URL` /
  `VITE_SUPABASE_ANON_KEY`.

**Left behind:**

- `src/components/form/Step1..5*`, `ProgressStepper`, `RegisterModal`
  (5-step), `RegistrationClosed` (rebuilt simpler).
- `src/api/registrations.ts`, `src/api/cityTour.ts`, `src/api/quotas.ts`,
  `src/api/admin.ts`, `src/utils/paymentFlow.ts`, `src/utils/excel.ts`.
- `src/pages/city-tour/*`, `src/pages/admin/*`, `src/pages/Payment*`,
  `src/pages/Programs*`, `src/pages/Explore*`.
- `src/context/AuthContext.tsx`, `src/components/auth/ProtectedRoute.tsx`.
- `html5-qrcode`, `xlsx`, `@mui/x-data-grid` dependencies.
- The invite-bypass-code mechanism in `registrationGate`.

---

## 3. Site structure & routes

Single-page-app, React Router. Every page renders inside a shared
`PageShell` (`<Navbar/> <main> … </main> <Footer/> <RsvpModal/>`).

| Route | Page | Content |
|---|---|---|
| `/` | `LandingPage` | `HeroSection` + `GlanceSection` + `AboutAnnakutSection` |
| `/venue` | `VenuePage` | `VenueSection` — address, map embed, directions, darshan timings |
| `/contact` | `ContactPage` | `ContactSection` — email card + coordinator phone/WhatsApp cards |
| `/impressum` | `ImpressumPage` | Legal imprint (placeholder copy) |
| `/data-privacy` | `DataPrivacyPage` | Privacy notice (placeholder copy) |
| `*` | `NotFoundPage` | 404 with "Back to Home" |

**Navbar:**

- Links (`NAV_LINKS` in `data.ts`): `Home` `/`, `Venue` `/venue`,
  `Contact` `/contact`.
- A contained **"Register Now"** pill button (desktop: right of the
  links; mobile: bottom of the drawer) that calls `openModal()`.
- When registration is closed, the button reads **"Learn More"** and
  navigates to `/venue` (mirrors the reference's closed-state fallback).
- Fixed `AppBar`, `.scrolled` blur class on `window.scrollY > 20`,
  right-anchored `Drawer` on mobile.
- Brand: logo image (placeholder `public/images/logo.png`) + text
  "HariPrabodham" with "Annakut" sub-line.

`robots.txt`: `User-agent: * / Allow: /` (nothing sensitive to hide — no
`/admin`, no `/payment`). `sitemap.xml` lists `/`, `/venue`, `/contact`.

---

## 4. RSVP modal

**Component:** `src/components/rsvp/RsvpModal.tsx` — a single MUI
`Dialog` (`maxWidth="sm"`, `fullScreen` on `xs`), gold top-border
accent like the reference modal. Opened/closed via a Zustand store.

### 4.1 State store — `src/store/rsvpStore.ts`

```ts
interface RsvpState {
  modalOpen: boolean
  openModal: () => void
  closeModal: () => void
}
```

Form field state is local to the form component (`useState`), not the
store — there is only one step, so there is nothing to persist across
unmounts.

### 4.2 Form fields

Labels, placeholder text, and select options all come from `data.ts`.

| Field | Type | Rules |
|---|---|---|
| Full name | text | required, trimmed, 2–80 chars |
| Email | text | required, valid email shape |
| Dial code | select (`COUNTRIES` in `data.ts`) | required, defaults to `+49` |
| Phone | text | required, 6–15 digits after stripping spaces/dashes |
| City / Mandal | text | required, 2–60 chars |
| Adults | select 1–10 | required, ≥ 1 |
| Children | select 0–10 | default 0 |
| Darshan time slot | select (`DARSHAN_SLOTS` in `data.ts`) | required |
| Notes | multiline text | optional, ≤ 500 chars |
| Consent | checkbox | required — must be checked to submit |
| `company` (honeypot) | hidden text input | must stay empty; if filled, the submit silently no-ops to a fake success |

Validation runs on submit (not per-keystroke); each field shows its
error via `helperText` / `FormHelperText`. The submit button is disabled
while `status === 'submitting'`.

### 4.3 Submit flow

`src/api/rsvp.ts` owns the contract:

```ts
export interface RsvpInput {
  fullName: string; email: string; dialCode: string; phone: string;
  city: string; adults: number; children: number;
  darshanSlot: string; notes?: string; consent: boolean;
}
export async function submitRsvp(input: RsvpInput): Promise<{ id: string }>
```

`submitRsvp` maps camelCase → snake_case, composes
`phone = "<dialCode without +> <digits>"`, and calls
`supabase.from('rsvps').insert({...}).select('id').single()`.

Modal status machine: `idle → submitting → success | error`.

- **success:** the form is replaced in place by a confirmation panel —
  "Jai Swaminarayan 🙏 Your RSVP is received", a summary (name, party
  size, slot), and a "Close" button. `closeModal()` resets status to
  `idle` after the dialog's exit transition.
- **error:** an MUI `Alert severity="error"` above the submit button
  with a friendly message; the form stays filled so the visitor can
  retry. Distinguish:
  - network / fetch failure → "Couldn't reach the server. Check your
    connection and try again."
  - Supabase error (RLS, constraint) → generic "Something went wrong
    submitting your RSVP. Please try again or contact us." (real error
    logged to console only).

### 4.4 Registration gate — `src/utils/registrationGate.ts`

```ts
export function isRegistrationOpenNow(): boolean
```

Compares `Date.now()` against `VITE_RSVP_OPEN_AT` and
`VITE_RSVP_CLOSE_AT` (ISO strings; either may be blank = unbounded).
Consumed by:

- `useRegistrationOpen()` hook (mount-time snapshot) → Navbar + Hero
  choose "Register Now" vs "Learn More".
- `RsvpModal` re-checks on open; if closed, renders
  `RegistrationClosed` (a short panel: "RSVP is now closed — please
  contact us" + link to `/contact`) instead of the form.

No invite-bypass code.

---

## 5. Data layer — Supabase

Frontend writes directly with the anon key. Organiser creates a new
Supabase project and runs the migration below (also committed to
`supabase/migrations/0001_init.sql`).

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

**Reading RSVPs:** Supabase dashboard → Table editor → `rsvps`, or
SQL / CSV export. A convenience view is included:

```sql
create view public.rsvp_summary as
  select created_at, full_name, email, phone, city,
         adults, children, (adults + children) as party_size,
         darshan_slot, notes
  from public.rsvps
  order by created_at desc;
```

**Keepalive:** `api/keepalive.ts` (Vercel edge, unchanged logic) inserts
one row every 3 days via the `crons` entry in `vercel.json`, using
`SUPABASE_SERVICE_ROLE_KEY` + `CRON_SECRET` env vars, so the free-tier
project does not pause during quiet stretches.

**Known limitation:** an insert-only public policy is spammable. Accepted
for a free RSVP form. Mitigations in place: honeypot field, client-side
validation. Future option (out of scope): Cloudflare Turnstile /
hCaptcha verification via a small edge function before insert.

---

## 6. Theme — "The Divine Spark"

`src/theme/theme.ts` — same shape as the reference (MUI `createTheme`
+ `responsiveFontSizes`, exported `C` token object, `HERO_GRADIENT`),
warm festive palette:

| Token | Value | Role |
|---|---|---|
| `maroon700` / `maroon800` | `#7A1E2B` / `#5C1420` | primary, footer gradient |
| `saffron400` / `saffron300` | `#E8A13C` / `#F2B84B` | secondary, accents |
| `gold500` / `gold300` | `#A07828` / `#C8A86A` | dividers, ornaments, focus ring |
| `cream` / `cream2` | `#FBF6EC` / `#F6ECD9` | backgrounds |
| `sand200` / `sand300` | `#EADFC6` / `#DFCEA8` | card borders |
| `ink` / `muted` | `#2A1A12` / `#6B5138` | text |
| `tulsi700` | `#3A6B3A` | overline / small accents |

- `palette.primary = maroon700` (dark `maroon800`), `secondary = saffron400`.
- Typography unchanged: `FONT_SERIF = Cormorant Garamond`,
  `FONT_SANS = Inter`; headings italic serif in `maroon800`; Blue Mirage
  used explicitly per-component as in the reference.
- `shape.borderRadius: 14`; buttons stay fully rounded (`999`) pills;
  `containedPrimary` gets a maroon vertical gradient + shadow;
  `outlinedPrimary` a translucent cream fill.
- `TextField` focused outline → `gold500`.
- `index.css`: Blue Mirage `@font-face`, `scroll-behavior`, and the
  `.MuiAppBar-root.scrolled` blur (retint to `rgba(251,246,236,0.88)`).

**Hero** is typographic — no dependency on the reference's title
artwork:

- Overline: `HARIPRABODHAM PRESENTS`
- Title: **Annakut** (Blue Mirage, large) with `HariPrabodham` kicker
- Tagline: *The Divine Spark* (Cormorant italic)
- Meta row: date · venue · city (from `data.ts`)
- CTA row: "Register Now" (opens modal) + "Learn More" (`/venue`)
- Countdown to `EVENT.dateISO` (same `useCountdown` pattern)
- Placeholder slots: `public/images/logo.png`, optional
  `public/images/hero-cover.jpg`
- Optional subtle radial ember glow behind the title (CSS only, no lib).
- Wave-SVG divider at the section's bottom, recoloured to saffron/gold.

---

## 7. Content model — `src/data/data.ts`

All copy is placeholder, clearly marked, for the organiser to edit.

```ts
export const EVENT = {
  title: 'Annakut',
  kicker: 'HariPrabodham',
  tagline: 'The Divine Spark',
  presents: 'HariPrabodham presents',
  dateISO: '2026-11-09T09:00:00+01:00',   // PLACEHOLDER
  dateLabel: '9 November 2026',            // PLACEHOLDER
  venueName: 'Venue name',                 // PLACEHOLDER
  city: 'City, Germany',                   // PLACEHOLDER
  organiser: 'HariPrabodham',
}

export const ABOUT_ANNAKUT = { heading, paragraphs: string[] }  // PLACEHOLDER
export const GLANCE = [ { icon, title, lines[] } ]  // Date & Time, Venue, Darshan, Prasad, Entry (free), Parking
export const DARSHAN_SLOTS = ['Morning — 09:00–12:00', 'Afternoon — 14:00–17:00', 'Evening — 18:00–21:00']  // PLACEHOLDER
export const COUNTRIES = [ { code, label, flag, dialCode } ]   // reused subset from reference
export const FAQS = [ { q, a } ]                               // PLACEHOLDER
export const PEOPLE = [ { name, phone, whatsapp } ]            // PLACEHOLDER
export const VENUE = { addressLines: string[], mapEmbedUrl, directions: string[] }  // PLACEHOLDER
export const FOOTER = { brand, legal, email, closing: 'Jai Swaminarayan 🙏' }
export const NAV_LINKS = [ {label:'Home',href:'/'}, {label:'Venue',href:'/venue'}, {label:'Contact',href:'/contact'} ]
```

`usePageMeta` base title: `HariPrabodham Annakut`.

---

## 8. Project layout

```
hp-annakut/
  api/keepalive.ts
  public/
    fonts/blue_mirage-webfont.woff2
    images/logo.png            (placeholder)
    favicon / og image         (placeholder)
    robots.txt  sitemap.xml
  src/
    main.tsx  App.tsx  index.css  declarations.d.ts
    theme/theme.ts
    data/data.ts
    lib/supabase.ts
    api/rsvp.ts
    store/rsvpStore.ts
    hooks/  usePageMeta.ts  useRegistrationOpen.ts  useCountdown.ts
    utils/  registrationGate.ts  ScrollToTop.tsx
    components/
      layout/   Navbar.tsx  Navbar.styles.ts  Footer.tsx
      sections/ HeroSection.tsx(.styles)  GlanceSection.tsx
                AboutAnnakutSection.tsx  VenueSection.tsx  ContactSection.tsx
      rsvp/     RsvpModal.tsx  RsvpForm.tsx  RsvpForm.styles.ts
                RsvpConfirmation.tsx  RegistrationClosed.tsx
    pages/  VenuePage.tsx  ContactPage.tsx  ImpressumPage.tsx  DataPrivacyPage.tsx
  supabase/migrations/0001_init.sql
  .env.example
  vercel.json  vite.config.ts  eslint.config.js
  tsconfig*.json  package.json
  docs/superpowers/specs/2026-09-09-hp-annakut-rsvp-site-design.md
```

### Environment variables (`.env.example`)

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_RSVP_OPEN_AT=            # optional ISO; blank = open now
VITE_RSVP_CLOSE_AT=          # optional ISO; blank = no close date
# Vercel-only (not VITE_ exposed): SUPABASE_SERVICE_ROLE_KEY, CRON_SECRET
```

---

## 9. Testing

The reference has no test setup. Add **Vitest + @testing-library/react +
@testing-library/user-event + jsdom**.

`npm test` scripts: `"test": "vitest run"`, `"test:watch": "vitest"`.

**Coverage (behavioural, not snapshot):**

1. `src/utils/registrationGate.test.ts` — open/closed logic across
   before-open, within-window, after-close, and blank-bound cases.
2. `src/api/rsvp.test.ts` — `submitRsvp` maps fields to snake_case,
   composes the phone string, returns the new id; surfaces a thrown
   error when the mocked Supabase insert returns `{ error }`.
   (`src/lib/supabase.ts` mocked via `vi.mock`.)
3. `src/components/rsvp/RsvpForm.test.tsx` —
   - submitting empty → each required field shows an error, no network call;
   - invalid email / short phone → field errors;
   - unchecked consent → submit blocked;
   - valid fill → `submitRsvp` called once with the expected payload;
   - mocked success → confirmation panel shown;
   - mocked error → error alert shown, form still populated;
   - filled honeypot → no `submitRsvp` call, fake success shown.

**Gates before "done":** `npm run lint` &&  `npm run build`
(`tsc -b && vite build`) && `npm test` all green. TDD per feature during
implementation.

---

## 10. Out of scope

- Any payment / ticketing / QR codes / confirmation emails.
- Admin UI (organisers use the Supabase dashboard).
- Auth of any kind.
- i18n (copy is single-language via `data.ts`).
- CMS — content is edited in `data.ts` and redeployed.
- Bot-verification service (Turnstile/hCaptcha) — noted as a future option.
- Real content, real images, real Supabase project — supplied by the
  organiser; the build ships with clearly-marked placeholders.
