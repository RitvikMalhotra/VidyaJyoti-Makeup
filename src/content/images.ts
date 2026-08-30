/**
 * IMAGE MANIFEST
 * ==============
 * The photography is the design, so every picture on this site has a named
 * slot here rather than being hard-coded into a component.
 *
 * HOW TO ADD THE STUDIO'S REAL PHOTOGRAPHS
 * ----------------------------------------
 * Drop a file into `src/assets/photos/` named after the slot `id` below —
 * e.g. `hero-primary.jpg` fills the hero. Vite hashes and optimises it at
 * build time and the placeholder disappears automatically. No code change,
 * no config change.
 *
 * Supported: .jpg .jpeg .png .webp .avif
 *
 * Until a file exists for a slot, an art-directed placeholder plate renders
 * in its place, printed with the slot name and the brief. We deliberately do
 * NOT substitute stock photography: nothing on this site should imply work
 * that isn't S.L.N.'s own.
 */

const modules = import.meta.glob('../assets/photos/*.{jpg,jpeg,png,webp,avif}', {
  eager: true,
  import: 'default',
}) as Record<string, string>

const byName: Record<string, string> = {}
for (const path of Object.keys(modules)) {
  const base = path.split('/').pop()!.replace(/\.[^.]+$/, '')
  byName[base] = modules[path]
}

export type PhotoCategory =
  | 'Weddings'
  | 'Events'
  | 'Birthdays'
  | 'Portraits'
  | 'Studio'

export type Photo = {
  /** Filename stem to drop into src/assets/photos. */
  id: string
  /** Alt text. Descriptive, never claiming more than the brief. */
  alt: string
  /** Short label printed on the placeholder plate. */
  label: string
  /** Art-direction brief for whoever supplies the file. */
  brief: string
  /** Aspect ratio as width / height. Drives the masonry rhythm. */
  ratio: number
  category?: PhotoCategory
  /** True where the Google listing is known to already carry this shot. */
  onListing?: boolean
}

/** Resolved file URL for a slot, or undefined while it is still empty. */
export function photoSrc(id: string): string | undefined {
  return byName[id]
}

export function hasPhoto(id: string): boolean {
  return id in byName
}

/* ------------------------------------------------------------------------ */
/* Key slots                                                                 */
/* Six of these correspond to photographs already visible on the Google       */
/* listing (studio exterior, interior, bride, portrait, couple, owner).       */
/* ------------------------------------------------------------------------ */

export const hero: Photo = {
  id: 'hero-primary',
  alt: 'Photography by S.L.N. Digital Studio',
  label: 'Hero',
  brief: 'Strongest single frame — the bride or couple portrait from the listing. Shot full-bleed, subject weighted right of centre so the headline sits clear on the left.',
  ratio: 16 / 9,
  onListing: true,
}

export const introPhoto: Photo = {
  id: 'intro-editorial',
  alt: 'A celebration photographed by S.L.N. Digital Studio',
  label: 'Editorial',
  brief: 'Warm, emotive frame — a candid moment between family members. Portrait crop.',
  ratio: 3 / 4,
  onListing: true,
}

export const introPhotoSecondary: Photo = {
  id: 'intro-detail',
  alt: 'Detail from a shoot by S.L.N. Digital Studio',
  label: 'Detail',
  brief: 'Close detail — hands, jewellery, decor. Overlaps the editorial frame.',
  ratio: 1,
}

export const aboutPortrait: Photo = {
  id: 'about-studio-team',
  alt: 'S.L.N. Digital Studio',
  label: 'Studio',
  brief: 'The owner/business photograph from the listing. At work, not posed to camera.',
  ratio: 4 / 5,
  onListing: true,
}

export const aboutInterior: Photo = {
  id: 'about-interior',
  alt: 'Inside S.L.N. Digital Studio, Miyapur',
  label: 'Interior',
  brief: 'The studio interior from the listing — customers describe it as neat and clean, so light it evenly and shoot it wide.',
  ratio: 3 / 2,
  onListing: true,
}

export const storefront: Photo = {
  id: 'location-storefront',
  alt: 'S.L.N. Digital Studio shopfront in Miyapur, Hyderabad',
  label: 'Storefront',
  brief: 'The exterior from the listing. Helps first-time visitors recognise the shop from the street.',
  ratio: 4 / 3,
  onListing: true,
}

export const finalCta: Photo = {
  id: 'final-cta',
  alt: 'Photography by S.L.N. Digital Studio',
  label: 'Closing frame',
  brief: 'The most cinematic wide frame available. Dark enough at the centre to hold white type.',
  ratio: 21 / 9,
}

/* ------------------------------------------------------------------------ */
/* Services                                                                  */
/*                                                                           */
/* Every entry below is anchored to something the listing or a review        */
/* actually says — see `evidence`. Maternity sessions are deliberately        */
/* absent: nothing in the supplied information supports them, so they are     */
/* not advertised. Family occasions are covered under Events & Functions.     */
/* ------------------------------------------------------------------------ */

export type Service = {
  id: string
  title: string
  blurb: string
  /** Why we are allowed to list this. Not rendered — an audit trail. */
  evidence: string
  photo: Photo
  enquiry: string
}

export const services: Service[] = [
  {
    id: 'weddings',
    title: 'Weddings',
    blurb:
      'Candid and traditional photography, side by side, for the moments a wedding day only gives you once.',
    evidence:
      'Review (Karthik Tejaswi): "very good at both candid and traditional photography".',
    photo: {
      id: 'service-weddings',
      alt: 'Wedding photography by S.L.N. Digital Studio',
      label: 'Weddings',
      brief: 'Bride portrait or ceremony frame. Vertical crop, low key.',
      ratio: 3 / 4,
      category: 'Weddings',
      onListing: true,
    },
    enquiry: 'wedding photography',
  },
  {
    id: 'events',
    title: 'Events & Functions',
    blurb:
      'Ceremonies, milestones and family functions — covered end to end, including multi-day occasions.',
    evidence:
      'Listing theme "Event photography"; review (Srinivas Mudiganti) describes a two-day Upanayanam.',
    photo: {
      id: 'service-events',
      alt: 'Event photography by S.L.N. Digital Studio',
      label: 'Events',
      brief: 'A ceremony in progress — wide, with guests visible.',
      ratio: 3 / 4,
      category: 'Events',
    },
    enquiry: 'an event or family function',
  },
  {
    id: 'birthdays',
    title: 'Birthdays',
    blurb:
      'First birthdays and every one after — the decorations, the faces, the small moments in between.',
    evidence:
      'Listing theme "Birthday photography"; review (Rohit Goyal) covers a first-birthday celebration.',
    photo: {
      id: 'service-birthdays',
      alt: 'Birthday photography by S.L.N. Digital Studio',
      label: 'Birthdays',
      brief: 'Child mid-celebration, warm colour, shallow depth.',
      ratio: 3 / 4,
      category: 'Birthdays',
    },
    enquiry: 'a birthday shoot',
  },
  {
    id: 'videography',
    title: 'Videography',
    blurb:
      'Film alongside stills, so the day is remembered in movement and sound as well as in frames.',
    evidence: 'Review (Rohit Goyal): "great quality photos and videos".',
    photo: {
      id: 'service-videography',
      alt: 'Videography by S.L.N. Digital Studio',
      label: 'Video',
      brief: 'A frame that reads as cinema — motion blur or a filming setup.',
      ratio: 3 / 4,
      category: 'Events',
    },
    enquiry: 'photography and videography',
  },
  {
    id: 'studio',
    title: 'Studio & Passport',
    blurb:
      'Portrait sittings and passport photographs at the Miyapur studio, seven days a week.',
    evidence:
      'Listing themes "Passport-size photos" and "Neat and clean environment"; portrait photograph on the listing.',
    photo: {
      id: 'service-studio',
      alt: 'Studio portrait by S.L.N. Digital Studio',
      label: 'Studio',
      brief: 'Clean studio-lit portrait against a plain backdrop.',
      ratio: 3 / 4,
      category: 'Studio',
      onListing: true,
    },
    enquiry: 'a studio or passport photo session',
  },
  {
    id: 'albums',
    title: 'Albums',
    blurb:
      'Designed, printed albums — the part customers single out by name in their reviews.',
    evidence:
      'Review (Rohit Goyal): "The album deserves a special mention \u2014 it was beautifully designed"; listing theme "Album quality".',
    photo: {
      id: 'service-albums',
      alt: 'A printed album by S.L.N. Digital Studio',
      label: 'Albums',
      brief: 'A finished album, open, shot at an angle in warm light.',
      ratio: 3 / 4,
    },
    enquiry: 'a printed album',
  },
]

/* ------------------------------------------------------------------------ */
/* Portfolio                                                                 */
/* Varied ratios on purpose — a curated wall, not a grid of identical tiles. */
/* ------------------------------------------------------------------------ */

export const galleryCategories: PhotoCategory[] = [
  'Weddings',
  'Events',
  'Birthdays',
  'Portraits',
  'Studio',
]

export const gallery: Photo[] = [
  { id: 'gal-wedding-01', category: 'Weddings', ratio: 2 / 3, label: 'Bride',
    alt: 'Bridal portrait by S.L.N. Digital Studio',
    brief: 'The bride portrait from the listing. Tall crop — anchors the wall.', onListing: true },
  { id: 'gal-birthday-02', category: 'Birthdays', ratio: 3 / 2, label: 'Celebration',
    alt: 'Birthday celebration photographed by S.L.N. Digital Studio',
    brief: 'Cake moment — motion, warm light, real reactions.' },
  { id: 'gal-portrait-02', category: 'Portraits', ratio: 1, label: 'Profile',
    alt: 'Portrait by S.L.N. Digital Studio',
    brief: 'Close head-and-shoulders, side light.' },
  { id: 'gal-event-01', category: 'Events', ratio: 3 / 2, label: 'Ceremony',
    alt: 'Ceremony photographed by S.L.N. Digital Studio',
    brief: 'Wide establishing frame of a function in full swing.' },
  { id: 'gal-studio-02', category: 'Studio', ratio: 3 / 4, label: 'Sitting',
    alt: 'Studio sitting at S.L.N. Digital Studio',
    brief: 'A subject being photographed on the studio floor.' },
  { id: 'gal-wedding-02', category: 'Weddings', ratio: 3 / 2, label: 'Couple',
    alt: 'Couple photographed by S.L.N. Digital Studio',
    brief: 'The couple frame from the listing. Landscape.', onListing: true },
  { id: 'gal-portrait-01', category: 'Portraits', ratio: 2 / 3, label: 'Portrait',
    alt: 'Portrait by S.L.N. Digital Studio',
    brief: 'The portrait from the listing. Tall, low key.', onListing: true },
  { id: 'gal-birthday-03', category: 'Birthdays', ratio: 1, label: 'Decor',
    alt: 'Birthday decor photographed by S.L.N. Digital Studio',
    brief: 'Styled decor detail. Square.' },
  { id: 'gal-event-03', category: 'Events', ratio: 4 / 3, label: 'Gathering',
    alt: 'Family gathering photographed by S.L.N. Digital Studio',
    brief: 'Group frame — several generations together.' },
  { id: 'gal-wedding-04', category: 'Weddings', ratio: 3 / 4, label: 'Candid',
    alt: 'Candid wedding moment by S.L.N. Digital Studio',
    brief: 'Unposed reaction from the family during the ceremony.' },
  { id: 'gal-birthday-01', category: 'Birthdays', ratio: 3 / 4, label: 'First birthday',
    alt: 'First birthday photographed by S.L.N. Digital Studio',
    brief: 'Child at the centre of a decorated setup.' },
  { id: 'gal-studio-01', category: 'Studio', ratio: 4 / 3, label: 'Studio floor',
    alt: 'Inside S.L.N. Digital Studio',
    brief: 'The studio interior from the listing.', onListing: true },
  { id: 'gal-event-02', category: 'Events', ratio: 2 / 3, label: 'Upanayanam',
    alt: 'Family ceremony photographed by S.L.N. Digital Studio',
    brief: 'A traditional ceremony frame. Tall.' },
  { id: 'gal-portrait-03', category: 'Portraits', ratio: 3 / 4, label: 'Family',
    alt: 'Family portrait by S.L.N. Digital Studio',
    brief: 'Family portrait, warm and relaxed.' },
  { id: 'gal-wedding-03', category: 'Weddings', ratio: 1, label: 'Ritual',
    alt: 'Wedding ritual photographed by S.L.N. Digital Studio',
    brief: 'Hands, thread, garland — a close ritual detail.' },
  { id: 'gal-studio-03', category: 'Studio', ratio: 3 / 2, label: 'Shopfront',
    alt: 'S.L.N. Digital Studio shopfront',
    brief: 'The exterior from the listing.', onListing: true },
]
