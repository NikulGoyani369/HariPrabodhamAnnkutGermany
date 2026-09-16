// src/data/data.ts
// ─── Every editable string for the site lives here. ───
// All values below are PLACEHOLDER content for the organiser to replace.

export const EVENT = {
  title: 'Annakut',
  kicker: 'HariPrabodham',
  tagline: 'The Divine Spark',
  presents: 'HariPrabodham presents',
  dateISO: '2026-10-24T09:00:00+01:00', // PLACEHOLDER
  dateLabel: '24 October 2026', // PLACEHOLDER
  venueName:
    'Lakeside Convention Center Berlin Tegel, Wilkestraße 1, 13507 Berlin', // PLACEHOLDER
  city: 'Berlin, Germany', // PLACEHOLDER
  organiser: 'HariPrabodham Germany',
};

// PLACEHOLDER
export const ABOUT_ANNAKUT = {
  heading: 'About Annakut',
  paragraphs: [
    'Annakut — the "mountain of food" — is offered to the Lord on the day after Diwali in gratitude for the year past.',
    'Join the HariPrabodham family for darshan, kirtan, and prasad as we welcome the new year together.',
  ],
};

// PLACEHOLDER — icon is an emoji rendered as-is
export const GLANCE: { icon: string; title: string; lines: string[] }[] = [
  {
    icon: '📅',
    title: 'Date & Time',
    lines: ['9 November 2026', '09:00 onwards'],
  },
  { icon: '📍', title: 'Venue', lines: ['Venue name', 'City, Germany'] },
  {
    icon: '🍲',
    title: 'Prasad',
    lines: ['Mahaprasad served', 'to all attendees'],
  },
  {
    icon: '🎟️',
    title: 'Entry',
    lines: ['Free — registration requested', 'so we can plan prasad'],
  },
  { icon: '🅿️', title: 'Parking', lines: ['On-site parking', 'available'] },
];

// PLACEHOLDER
export const DARSHAN_SLOTS = [
  'Morning — 09:00–12:00',
  'Afternoon — 14:00–17:00',
  'Evening — 18:00–21:00',
];

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
];

// PLACEHOLDER
export const FAQS = [
  {
    q: 'Do I need to register?',
    a: 'Entry is free, but registering helps us prepare enough prasad and seating.',
  },
  {
    q: 'Can I bring my family?',
    a: 'Yes — enter the number of adults and children in the registration form.',
  },
  { q: 'Is there parking?', a: 'On-site parking is available.' },
];

// PLACEHOLDER
export const PEOPLE = [
  {
    name: 'Varun Thaker',
    phone: 'tel:+4917685645884',
    whatsapp: 'https://wa.me/49176856445884',
  },
  {
    name: 'Nirmal Goyani',
    phone: 'tel:+4917641691513',
    whatsapp: 'https://wa.me/4917641691513',
  },
];

// PLACEHOLDER
export const VENUE = {
  addressLines: [
    'Lakeside Convention Center Berlin Tegel',
    'Wilkestraße 1,',
    '13507 Berlin',
  ],
  mapEmbedUrl: 'https://maps.app.goo.gl/dFfnrjFYaoopEtQEA',
  directions: [
    'By car: parking available on site.',
    'By public transport: nearest stop is a short walk away.',
  ],
};

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
