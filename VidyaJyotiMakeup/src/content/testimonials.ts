/* -------------------------------------------------------------------------
 * Real Google reviews, quoted as written.
 *
 * Wording is verbatim. Where a very long review has been shortened for the
 * page, the cut is marked with an ellipsis and nothing is paraphrased,
 * reordered or "tidied" — these are other people's words about a real
 * business, and the only honest edit is a shorter one.
 * ---------------------------------------------------------------------- */

export type Testimonial = {
  id: string
  quote: string
  name: string
  /** What they booked her for. */
  context: string
}

/**
 * The featured review. Pallavi wrote at length about a 23-hour wedding day
 * with two complete looks, and about the brief that runs through almost every
 * other review on the listing: she wanted to still look like herself.
 */
export const featured = {
  id: 'pallavi',
  name: 'Pallavi',
  context: 'Hindu wedding and evening reception',
  lead: 'I wanted to feel like myself. I wanted to recognise myself in the mirror — just elevated, not transformed into someone else. You were the only one who immediately understood that balance.',
  body: [
    'Having done three trials before the big day — with yours being the final one — I remember feeling like you truly understood what I was looking for. I especially appreciated how thoughtfully you approached my features — even advising against contouring given the structure of my face.',
    'The day itself was long, starting at 4am and going on until 3am the next day, with two completely different looks. Despite the long hours, my makeup never once felt heavy or cakey. My skin felt hydrated, comfortable, and genuinely cared for throughout.',
    'The morning look was soft, mauve, and understated — perfectly complementing my mum’s wedding saree, which is almost 50 years old. It meant so much to me that nothing overpowered it.',
  ],
}

export const testimonials: Testimonial[] = [
  {
    id: 'avanthika',
    quote:
      'My whole family got the makeup done with her and her team and she did a great job! The foundation shade match was awesome and they catered to all skin types. The groom also got his makeup done, for the first time professionally, and he also had a superb experience.',
    name: 'AvanthikaPriya Balu',
    context: 'Sangeet and wedding',
  },
  {
    id: 'sonal',
    quote:
      'I especially want to highlight that I didn’t experience any breakouts or skin irritation, which is a huge deal for me since my skin is incredibly sensitive. The final look was exactly what I had envisioned — very soft, natural, and elegant.',
    name: 'Sonal Garg',
    context: 'Grah Pravesh ceremony',
  },
  {
    id: 'tara',
    quote:
      'I wanted a simple, natural look where I still looked like myself, just a more beautiful version of me, and Vidya truly understood that. She did an exceptional job on my engagement day… Because of that, I chose her for my wedding and reception as well.',
    name: 'palle tara',
    context: 'Engagement, wedding and reception',
  },
  {
    id: 'kanishka',
    quote:
      'Vidya was very attentive to everyone’s skin concerns and made sure the makeup suited each person perfectly. Her team did an amazing job with the hair styling and saree draping as well — everything was done beautifully and looked perfect.',
    name: 'Kanishka Akula',
    context: 'Brother’s wedding',
  },
  {
    id: 'ananya',
    quote:
      'The makeup was absolutely flawless, elegant, long-lasting, and enhanced my features without feeling heavy. I received so many compliments throughout the event, and it stayed perfect from start to finish.',
    name: 'Ananya Srivastava',
    context: 'Wedding',
  },
  {
    id: 'meghana',
    quote:
      'I got this done for a dance performance and it stayed the same for almost 8 hours, even though I was sweating a lot. The hair style is made exactly as I requested.',
    name: 'Meghana Yarasu',
    context: 'Dance performance',
  },
  {
    id: 'akansha',
    quote:
      'I worked with her for a fashion shoot, the makeup base was the Win for me. She didn’t exaggerate but enhanced the features I have and made me look beautiful.',
    name: 'Akansha Vijay',
    context: 'Fashion shoot',
  },
  {
    id: 'srilakshmi',
    quote:
      'From the flawless base to the intricate eye detailing and the perfect lip shade, every element was thoughtfully crafted to reflect tradition and beauty. You didn’t just enhance my features — you captured the essence of the culture.',
    name: 'Srilakshmi Gaddipati',
    context: 'South Indian bridal look',
  },
  {
    id: 'vaishnavi',
    quote:
      'The makeup looked flawless both in person and on camera… What made the experience even more special was Vidya’s thoughtful approach — she played calming music during the session and even offered refreshments in between to keep me hydrated and relaxed.',
    name: 'Vaishnavi V',
    context: 'Shoot',
  },
  {
    id: 'mahua',
    quote:
      'I’ve always been a bit hesitant about makeup, but she made the process fun and comfortable. I wanted a minimalist look — something that enhanced my features naturally — and she understood exactly what I was looking for.',
    name: 'mahua dutta',
    context: 'Wedding makeup trial',
  },
  {
    id: 'swetha',
    quote:
      'Vidya is very professional and knows in and out about makeup techniques and makeup products… She also told us about what products suit our skin and helped us with the information about where we can find them.',
    name: 'swetha maram',
    context: 'Makeup course',
  },
  {
    id: 'sindhura',
    quote:
      'She has a great eye for detail, ensuring the makeup looks perfect in different lighting and lasts beautifully throughout the day. Her technique enhances features without making the makeup feel heavy.',
    name: 'Sindhura Devarakonda',
    context: 'Google review',
  },
]

/** Short lines for the scrolling marquee. Also verbatim. */
export const shortPraise = [
  'One of the best MUA in Hyderabad.',
  'It does not feel like you are wearing makeup.',
  'Worth your money.',
  'Top notch place to get bridal, party makeup done.',
  'She is an expert. Our daughter loved her work.',
  'Very professional and friendly. The makeup looked beautiful.',
  'The products used are all from top brands as well.',
  'Best MUA in town.',
]
