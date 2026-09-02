/* -------------------------------------------------------------------------
 * Every real-world fact about the business lives here and nowhere else.
 *
 * All values below are taken from Vidya Jyoti's own lookbook and her public
 * Google Business listing. Nothing here is invented — where a figure was not
 * available (pricing), the field is null and the UI says "on enquiry" rather
 * than showing a number nobody quoted.
 * ---------------------------------------------------------------------- */

export const business = {
  name: 'Vidya Jyoti',
  fullName: 'Vidya Jyoti Makeup Artistry',
  role: 'Bridal Makeup Artist',

  /** Her own words, from the lookbook. */
  tagline: 'Enhancing natural beauty, revealing the inner radiance.',

  city: 'Hyderabad',
  serviceArea: 'Kondapur, Hyderabad — and across Telangana',

  address: {
    street: 'My Home Mangala Rd, Shilpa Valley',
    locality: 'Kondapur, Serilingampalle (M)',
    region: 'Telangana',
    postalCode: '500084',
    country: 'IN',
  },

  phone: '+91 77319 52859',
  /** Digits only after the country code — used to build the WhatsApp link. */
  whatsapp: '917731952859',
  email: '' as string,
  instagram: 'https://www.instagram.com/vidyajyoti_makeup',
  instagramHandle: '@vidyajyoti_makeup',

  /** From the public Google Business listing. */
  rating: 4.9 as number | null,
  reviewCount: 55 as number | null,

  availability: 'Booking dates for the current wedding season',
} as const

export function whatsappLink(message?: string): string | null {
  if (!business.whatsapp) return null
  const text = encodeURIComponent(
    message ?? `Hi ${business.name}, I'd like to check your availability for my date.`,
  )
  return `https://wa.me/${business.whatsapp.replace(/[^0-9]/g, '')}?text=${text}`
}

export function telLink(): string | null {
  return business.phone ? `tel:${business.phone.replace(/[^0-9+]/g, '')}` : null
}

export function mailLink(subject = 'Bridal makeup enquiry'): string | null {
  return business.email
    ? `mailto:${business.email}?subject=${encodeURIComponent(subject)}`
    : null
}

export function mapsLink(): string {
  const { street, locality, region, postalCode } = business.address
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${business.fullName}, ${street}, ${locality}, ${region} ${postalCode}`,
  )}`
}

/* ---------------------------------------------------------------------- */

export type Service = {
  id: string
  name: string
  summary: string
  /** Exactly what is included — taken from the lookbook, not embellished. */
  includes: string[]
  from: number | null
}

export const services: Service[] = [
  {
    id: 'bridal',
    name: 'Bridal',
    summary:
      'The wedding day itself. The longest booking she does, and the one everything else is built around.',
    includes: [
      'Skin consultation',
      'Makeup',
      'Hairstyle',
      'Draping',
      'Hair extensions',
      'False lashes',
      'Coloured lenses',
    ],
    from: null,
  },
  {
    id: 'occasion',
    name: 'Pre-wedding, Engagement, Cocktail & Reception',
    summary:
      'The events on either side of the wedding, each styled to sit apart from the bridal day rather than repeat it.',
    includes: [
      'Skin consultation',
      'Makeup',
      'Hairstyle',
      'Draping',
      'False lashes',
      'Coloured lenses',
    ],
    from: null,
  },
  {
    id: 'party',
    name: 'Party',
    summary:
      'For the family and friends photographed beside you — and for the evenings that are their own occasion.',
    includes: ['Makeup', 'Hair', 'Draping', 'Coloured lenses'],
    from: null,
  },
  {
    id: 'editorial',
    name: 'Shoot, Editorial & Model',
    summary:
      'Makeup for magazines, fashion spreads and advertising — geared towards a flawless finish that translates on camera.',
    includes: [
      'Camera-tested base',
      'Look continuity across frames',
      'On-set artist for the shoot day',
    ],
    from: null,
  },
]

/** Hair services, listed separately in the lookbook. */
export const hairStyles = [
  'Bun',
  'Braids',
  'Straightening',
  'Blow dry',
  'Crimping',
  'Beach waves',
  'Curls',
]

/** The add-on photoshoot offer, in her own terms. */
export const photoshoot = {
  title: 'Getting-ready photoshoot',
  body: 'A shoot of the bride while she is getting ready, and again once she is ready. Pictures delivered as soft copies within 7–10 days.',
  note: 'Photoshoot charged separately.',
}

/* ---------------------------------------------------------------------- */

export type ProcessStep = { n: string; title: string; body: string }

/**
 * Drawn from what her clients describe in their reviews — the trial, the
 * feedback loop, the timekeeping, the staying power — rather than a generic
 * four-step template.
 */
export const process: ProcessStep[] = [
  {
    n: '01',
    title: 'Skin first, not filters',
    body: 'Every booking opens with a skin consultation. Products are chosen for your skin type and tone before a single look is discussed — which is why brides with sensitive skin get through the day without a breakout.',
  },
  {
    n: '02',
    title: 'The trial, and your feedback',
    body: 'A full run of the look ahead of the day, adjusted until you are happy rather than until it is finished. Clients who arrive certain about what they want are the easiest to work with, and those who are not get talked through the options.',
  },
  {
    n: '03',
    title: 'Enhanced, not transformed',
    body: 'The brief most brides give is that they want to recognise themselves. That means working with the structure of your face — and sometimes advising against a technique, like contouring, when your features do not need it.',
  },
  {
    n: '04',
    title: 'It has to last the day',
    body: 'Bases built to hold through a fourteen-hour wedding, two outfit changes, an eight-hour dance performance, or a shoot under lights — without going heavy or cakey by the evening.',
  },
]
