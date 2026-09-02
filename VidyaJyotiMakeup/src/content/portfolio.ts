/* -------------------------------------------------------------------------
 * The work.
 *
 * Every frame points at a real photograph from Vidya Jyoti's lookbook. The
 * captions describe what is actually in the frame — the occasion and the
 * treatment — because they double as the alt text that Google indexes and a
 * screen reader reads aloud.
 *
 * Two treatments are rationed deliberately:
 *
 *   depth       the layered three-plane parallax. Three frames only. Applied
 *               to all sixteen it stops reading as craft and starts reading
 *               as a filter over someone's portfolio.
 *
 *   transition  a cinematic wipe as the reader crosses into the frame. Twice
 *               on the page. A transition that happens everywhere is a
 *               template; one that happens twice is an edit.
 * ---------------------------------------------------------------------- */

import { photos, type PhotoId } from './photos'
import { cinematics, type CinematicAsset } from './media'

export type Category = 'Bridal' | 'Occasion' | 'Party' | 'Editorial'

export type Frame = {
  id: string
  photo: PhotoId
  alt: string
  caption: string
  category: Category
  /** Spans both columns in the editorial grid. */
  wide?: boolean
  depth?: boolean
  transition?: CinematicAsset
}

export const frames: Frame[] = [
  {
    id: 'f1',
    photo: 'bride-mirror',
    alt: 'Bride in a red and magenta lehenga with gold jewellery, seen in a mirror before the ceremony',
    caption: 'Before the ceremony',
    category: 'Bridal',
    depth: true,
  },
  {
    id: 'f2',
    photo: 'bride-red',
    alt: 'South Indian bride in a red silk saree with temple gold jewellery and a maang tikka',
    caption: 'Red silk, temple gold',
    category: 'Bridal',
  },
  {
    id: 'f3',
    photo: 'bride-kanj',
    alt: 'Bride in an orange and pink Kanjeevaram saree with a layered diamond choker',
    caption: 'Kanjeevaram and diamonds',
    category: 'Bridal',
  },
  {
    id: 'f4',
    photo: 'editorial-wide',
    alt: 'Close editorial beauty portrait with graphic eyeliner and a soft nude lip',
    caption: 'Graphic liner, nude lip',
    category: 'Editorial',
    wide: true,
    depth: true,
    transition: cinematics.portfolioFlowA,
  },
  {
    id: 'f5',
    photo: 'engagement',
    alt: 'Engagement look in a blush lehenga with soft mauve eye makeup and a braided half-up hairstyle',
    caption: 'Engagement — a lighter hand',
    category: 'Occasion',
  },
  {
    id: 'f6',
    photo: 'reception',
    alt: 'Reception look in a rose velvet outfit with emerald and pearl jewellery',
    caption: 'Rose velvet, emeralds',
    category: 'Occasion',
  },
  {
    id: 'f7',
    photo: 'bride-teal',
    alt: 'Bride in a teal and pink silk saree with kundan jewellery and jhumka earrings',
    caption: 'Teal and kundan',
    category: 'Bridal',
  },
  {
    id: 'f8',
    photo: 'editorial-red',
    alt: 'Editorial portrait against a deep red backdrop, sculpted brows and a glossy berry lip',
    caption: 'Studio red',
    category: 'Editorial',
    depth: true,
  },
  {
    id: 'f9',
    photo: 'party-purple',
    alt: 'Party look in a lilac floral saree with a diamond choker and soft waves',
    caption: 'Lilac and florals',
    category: 'Party',
  },
  {
    id: 'f10',
    photo: 'bride-kanj-2',
    alt: 'Bride in gold Kanjeevaram silk with a full diamond bridal set',
    caption: 'The full set',
    category: 'Bridal',
  },
  {
    id: 'f11',
    photo: 'editorial-neon',
    alt: 'Fashion portrait under magenta light with a crystal fringe choker',
    caption: 'Under colour',
    category: 'Editorial',
    transition: cinematics.portfolioFlowB,
  },
  {
    id: 'f12',
    photo: 'gown-blue',
    alt: 'Draped cobalt gown with a gold and emerald collar necklace',
    caption: 'Cobalt and gold',
    category: 'Editorial',
  },
  {
    id: 'f13',
    photo: 'bride-teal-2',
    alt: 'Bride in a teal Kanjeevaram saree with pearl and gold Lakshmi jewellery',
    caption: 'Pearl and Lakshmi gold',
    category: 'Bridal',
  },
  {
    id: 'f14',
    photo: 'party-blue',
    alt: 'Evening look in a cobalt embroidered saree with kundan and emerald jewellery',
    caption: 'Embroidered cobalt',
    category: 'Party',
  },
  {
    id: 'f15',
    photo: 'gown-detail',
    alt: 'Detail of a gold and emerald statement collar against a draped blue gown',
    caption: 'Collar detail',
    category: 'Editorial',
  },
]

export const categories: Category[] = ['Bridal', 'Occasion', 'Party', 'Editorial']

/** Aspect ratio of a frame, read from the generated photo manifest. */
export const ratioOf = (f: Frame) => photos[f.photo].ratio
