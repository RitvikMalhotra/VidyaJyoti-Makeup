/**
 * Single source of truth for everything the site says about the business.
 *
 * PROVENANCE RULE: every value in this file is taken from S.L.N. Digital
 * Studio's public Google Business listing (profile details + customer
 * reviews). Nothing here is invented — no prices, packages, awards, years in
 * business, client counts, team titles or partnerships. If a fact is not in
 * the listing, it is not in this file, and the design works around its
 * absence instead.
 */

export const business = {
  name: 'S.L.N. Digital Studio',
  logoTop: 'S.L.N.',
  logoBottom: 'Digital Studio',
  category: 'Photography Studio',
  locality: 'Miyapur, Hyderabad',

  phone: {
    /** Exactly as shown on the listing. */
    display: '098493 19033',
    /** E.164 for tel: links. */
    tel: '+919849319033',
    /** Digits only, for wa.me links. */
    whatsapp: '919849319033',
  },

  address: {
    lines: [
      'A-9, Shop No. 2',
      'Opposite Heritage Fresh Super Market',
      'DK Enclave',
      'Jaya Prakash Narayan Nagar',
      'Miyapur, Hyderabad',
      'Telangana 500049',
    ],
    /** Flattened for map queries and structured data. */
    oneLine:
      'S.L.N. Digital Studio, A-9, Shop No. 2, Opposite to Heritage Fresh Super Market, DK Enclave, Jaya Prakash Narayan Nagar, Miyapur, Hyderabad, Telangana 500049',
  },

  hours: {
    summary: 'Open daily',
    range: '8:30 AM – 10:00 PM',
    full: 'Open daily · 8:30 AM – 10:00 PM',
  },

  rating: {
    value: '4.6',
    count: 614,
    countDisplay: '614',
  },
} as const

/* ------------------------------------------------------------------------ */
/* Links                                                                     */
/* ------------------------------------------------------------------------ */

export const telHref = `tel:${business.phone.tel}`

/** Contextual WhatsApp deep link. The message is a courteous opener only. */
export function whatsappHref(message: string): string {
  return `https://wa.me/${business.phone.whatsapp}?text=${encodeURIComponent(message)}`
}

export const wa = {
  general: whatsappHref(
    `Hello S.L.N. Digital Studio, I found you online and I'd like to enquire about a shoot.`,
  ),
  booking: whatsappHref(
    `Hello S.L.N. Digital Studio, I'd like to book a shoot. Here are the details:`,
  ),
  wedding: whatsappHref(
    `Hello S.L.N. Digital Studio, I'd like to enquire about wedding photography.`,
  ),
  studio: whatsappHref(
    `Hello S.L.N. Digital Studio, I'd like to enquire about a studio session.`,
  ),
}

export const mapsSearchHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  business.address.oneLine,
)}`

export const mapsDirectionsHref = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
  business.address.oneLine,
)}`

/** Google Maps embed keyed on the address string — no API key required. */
export const mapsEmbedSrc = `https://www.google.com/maps?q=${encodeURIComponent(
  business.address.oneLine,
)}&output=embed`
