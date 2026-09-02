import { testimonials } from '../../content/testimonials'
import { business } from '../../content/business'
import { Section, SectionHead } from '../ui/SectionHead'
import { Reveal } from '../ui/Reveal'
import { StarIcon } from '../ui/Icons'

/* -------------------------------------------------------------------------
 * The reviews, in a masonry-ish column layout.
 *
 * CSS columns rather than a grid: the quotes are wildly different lengths,
 * and a grid would either clip them or leave a row of half-empty boxes. The
 * column flow packs them the way a print page would.
 * ---------------------------------------------------------------------- */

export function Testimonials() {
  if (!testimonials.length) return null

  return (
    <Section id="words">
      <SectionHead
        eyebrow="In their words"
        title="What they said afterwards."
        intro={
          business.rating !== null
            ? `${business.rating}★ across ${business.reviewCount} Google reviews — brides, their families, dancers, models and one groom.`
            : undefined
        }
        align="centre"
      />

      <div className="mt-14 gap-6 md:mt-20 md:columns-2 lg:columns-3 *:mb-6 *:break-inside-avoid">
        {testimonials.map((t, i) => (
          <Reveal key={t.id} delay={(i % 3) * 80}>
            <figure className="border border-ink-line/70 bg-ink-soft/40 p-7 transition-colors duration-500 hover:border-gold/30">
              <span className="flex items-center gap-0.5 text-gold/80" aria-hidden="true">
                {Array.from({ length: 5 }, (_, s) => (
                  <span key={s} className="h-3 w-3">
                    <StarIcon />
                  </span>
                ))}
              </span>

              <blockquote className="mt-5 text-pretty leading-relaxed text-ivory/80">
                “{t.quote}”
              </blockquote>

              <figcaption className="mt-6 text-sm text-ivory/55">
                {t.name}
                <span className="text-ivory/35"> · {t.context}</span>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
