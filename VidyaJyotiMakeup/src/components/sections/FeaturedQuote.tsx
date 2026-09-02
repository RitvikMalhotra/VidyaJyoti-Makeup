import { featured } from '../../content/testimonials'
import { cinematics } from '../../content/media'
import { Cinematic } from '../ui/Cinematic'
import { StudioImage } from '../ui/StudioImage'
import { Reveal } from '../ui/Reveal'
import { QuoteIcon } from '../ui/Icons'
import { useMotion } from '../../lib/motion'

/* -------------------------------------------------------------------------
 * One review, given a whole section.
 *
 * Pallavi wrote several hundred words about a wedding day that started at 4am
 * and finished at 3am the next morning, with two complete looks. Buried in a
 * grid of twelve cards it would read like all the others; on its own, with
 * her actual sentences at display size, it does the work that a page of
 * marketing copy cannot.
 *
 * The atmospheric loop sits behind it when it exists. Until then the backdrop
 * is a slow warm gradient drift, which is enough — the words are the subject.
 * ---------------------------------------------------------------------- */

function Backdrop() {
  // Barely-there drift. Anything more and it competes with the text sitting
  // directly on top of it.
  const ref = useMotion<HTMLDivElement>((el, geom, ctx) => {
    const p = (geom.top + geom.height / 2 - ctx.vh / 2) / ctx.vh
    el.style.transform = `translate3d(0, ${(p * -34).toFixed(2)}px, 0) scale(1.08)`
  })

  return (
    <div ref={ref} aria-hidden="true" className="absolute inset-0">
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(58% 52% at 22% 28%, color-mix(in oklab, var(--color-rose) 30%, transparent), transparent 72%),' +
            'radial-gradient(50% 46% at 82% 68%, color-mix(in oklab, var(--color-gold) 22%, transparent), transparent 70%)',
        }}
      />
    </div>
  )
}

export function FeaturedQuote() {
  return (
    <section
      aria-label="Featured client review"
      className="relative overflow-hidden border-y border-ink-line/60"
    >
      <Cinematic
        asset={cinematics.atmosphere}
        className="pointer-events-none absolute inset-0 opacity-45"
        fallback={<Backdrop />}
      />

      <div className="relative z-10 px-5 py-24 sm:px-8 md:py-32 lg:px-12">
        <div className="mx-auto grid w-full max-w-[84rem] gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <Reveal>
              <span className="block h-9 w-9 text-gold/50">
                <QuoteIcon />
              </span>
            </Reveal>

            <Reveal delay={100}>
              <blockquote className="mt-7">
                <p className="font-display text-[clamp(1.6rem,3.4vw,2.9rem)] italic leading-[1.18] text-balance text-ivory">
                  {featured.lead}
                </p>
              </blockquote>
            </Reveal>

            <div className="mt-9 flex max-w-2xl flex-col gap-4 text-pretty leading-relaxed text-ivory/65">
              {featured.body.map((para, i) => (
                <Reveal key={i} delay={220 + i * 80}>
                  <p>{para}</p>
                </Reveal>
              ))}
            </div>

            <Reveal delay={480}>
              <figcaption className="mt-9 flex items-center gap-4">
                <span aria-hidden="true" className="rule-gold h-px w-12" />
                <span className="text-sm tracking-wide text-ivory/80">
                  {featured.name}
                  <span className="text-ivory/40"> · {featured.context}</span>
                </span>
              </figcaption>
            </Reveal>
          </div>

          <div className="lg:col-span-5">
            <Reveal variant="curtain" delay={180}>
              <StudioImage
                photo="bride-mirror"
                alt="A bride seen in a mirror in full bridal makeup before her ceremony"
                sizes="(max-width: 1023px) 90vw, 38vw"
                className="w-full"
              />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
