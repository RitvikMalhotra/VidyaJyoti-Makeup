import { business } from '../../content/business'
import { shortPraise } from '../../content/testimonials'
import { Reveal } from '../ui/Reveal'
import { StarIcon } from '../ui/Icons'

/* -------------------------------------------------------------------------
 * The strip directly under the hero.
 *
 * Its whole job is to answer "is she any good?" before the visitor has to
 * scroll for it. Both halves are load-bearing facts, not decoration: the
 * rating is her real Google figure, and the marquee lines are real review
 * text quoted verbatim.
 * ---------------------------------------------------------------------- */

function Marquee() {
  // The track holds the list twice. Translating exactly -50% lands on the
  // seam between the copies, so the loop has no visible jump.
  const lane = [...shortPraise, ...shortPraise]

  return (
    <div
      className="marquee relative overflow-hidden border-y border-ink-line/60 py-5"
      // Long enough that it reads as drift rather than a scroller.
      style={{ ['--marquee-duration' as string]: '68s' }}
    >
      <div className="marquee-track flex w-max items-center gap-12">
        {lane.map((line, i) => (
          <span key={i} className="flex shrink-0 items-center gap-12">
            <span className="whitespace-nowrap font-display text-lg italic text-ivory/55 sm:text-xl">
              “{line}”
            </span>
            <span aria-hidden="true" className="h-1 w-1 shrink-0 rounded-full bg-gold/50" />
          </span>
        ))}
      </div>

      {/* Fade the ends into the page so the lines arrive and leave rather
          than being cut off at the viewport edge. */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-ink to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-ink to-transparent" />
    </div>
  )
}

export function ProofStrip() {
  const hasRating = business.rating !== null && business.reviewCount !== null

  return (
    <section aria-label="Reputation" className="relative">
      {hasRating && (
        <div className="px-5 py-10 sm:px-8 lg:px-12">
          <Reveal>
            <div className="mx-auto flex w-full max-w-[84rem] flex-col items-center justify-between gap-6 text-center sm:flex-row sm:text-left">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1 text-gold" aria-hidden="true">
                  {Array.from({ length: 5 }, (_, i) => (
                    <span key={i} className="h-4 w-4">
                      <StarIcon />
                    </span>
                  ))}
                </span>
                <p className="text-sm tracking-wide text-ivory/70">
                  <span className="font-display text-2xl text-ivory">
                    {business.rating}
                  </span>{' '}
                  from {business.reviewCount} Google reviews
                </p>
              </div>

              <p className="max-w-md text-sm leading-relaxed text-ivory/45">
                Brides, their mothers, their sisters, fashion shoots and a
                groom who had never worn makeup before.
              </p>
            </div>
          </Reveal>
        </div>
      )}

      <Marquee />
    </section>
  )
}
