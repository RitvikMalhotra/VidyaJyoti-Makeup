/**
 * Customer reviews, quoted verbatim from the Google listing.
 *
 * `truncated: true` marks reviews that Google itself cut off with an ellipsis.
 * We show them exactly as far as the listing shows them and label the rest
 * honestly rather than inventing an ending.
 */

export type Review = {
  name: string
  stars: 5
  quote: string
  truncated: boolean
  /** Occasion, only where the reviewer states it themselves. */
  occasion?: string
}

export const reviews: Review[] = [
  {
    name: 'Rohit Goyal',
    stars: 5,
    occasion: "Daughter's 1st birthday",
    quote:
      'We chose SLN Photo Studio for our daughter\u2019s 1st birthday celebration, and it was one of the best decisions. The team delivered great quality photos and videos, capturing every special moment perfectly. The album deserves a special mention \u2014 it was beautifully designed and is something we\u2019ll cherish forever. Highly recommend their work!',
    truncated: false,
  },
  {
    name: 'Srinivas Mudiganti',
    stars: 5,
    occasion: 'Upanayanam, 2 days',
    quote:
      'I took SLN digital services (Photography) for my son\u2019s Upanayanam (2 days). I received a couple of excellent surprises which is quite memorable to me and my family members. Thanks to Ranjith for taking up my requests diligently and',
    truncated: true,
  },
  {
    name: 'Karthik Tejaswi',
    stars: 5,
    quote:
      'The best photography experience we had across Hyderabad.. SLN Photography is pretty good at capturing the best moments.. They are very good at both candid and traditional photography.. They offer you best packages for all the occasions. Unlike',
    truncated: true,
  },
]

/**
 * Recurring themes surfaced on the Google listing itself. Presented as
 * "what customers mention" — never restated as a claim by the studio.
 */
export const reviewThemes: string[] = [
  'Event photography',
  'Album quality',
  'Birthday photography',
  'Passport-size photos',
  'Patient photographer',
  'Competitive rates',
  'Good service',
  'Neat and clean environment',
]
