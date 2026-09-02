import { business } from '../../content/business'
import { Section } from '../ui/SectionHead'
import { DepthImage } from '../ui/DepthImage'
import { StudioImage } from '../ui/StudioImage'
import { Reveal, RevealLines } from '../ui/Reveal'
import { useParallax } from '../../lib/motion'

/* -------------------------------------------------------------------------
 * About.
 *
 * The prose is Vidya Jyoti's own, condensed from her lookbook — including the
 * decade in IT before this, which is the most human detail on the whole site
 * and the reason the section exists at all.
 * ---------------------------------------------------------------------- */

export function About() {
  // The small inset frame rises against the portrait, so the pair reads as a
  // spread rather than two images side by side.
  const insetRef = useParallax<HTMLDivElement>(-46, 0.14)

  return (
    <Section id="about">
      <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-20">
        <div className="relative lg:col-span-5">
          <Reveal variant="curtain">
            <DepthImage
              photo="artist"
              alt={`${business.name}, bridal makeup artist in ${business.city}`}
              sizes="(max-width: 1023px) 90vw, 40vw"
              strength={9}
              className="w-full"
            />
          </Reveal>

          {/* A second, smaller frame overlapping the portrait's lower corner.
              Hidden on small screens, where it would only crowd the page. */}
          <div
            ref={insetRef}
            className="pointer-events-none absolute -bottom-14 -right-14 hidden w-36 lg:block xl:w-44"
          >
            <Reveal variant="curtain" delay={280}>
              <StudioImage
                photo="engagement"
                alt="A softer engagement look, mauve eye and braided hair"
                sizes="200px"
                className="w-full border border-ink shadow-2xl shadow-ink"
              />
            </Reveal>
          </div>
        </div>

        <div className="lg:col-span-7">
          <Reveal>
            <p className="eyebrow flex items-center gap-3">
              About
              <span className="rule-gold h-px w-16" />
            </p>
          </Reveal>

          <h2 className="display-lg mt-6 max-w-[16ch] text-balance text-ivory">
            <RevealLines
              delay={80}
              lines={[
                'A solution specialist',
                <span key="w" className="foil italic">
                  who became
                </span>,
                'a makeup artist.',
              ]}
            />
          </h2>

          <div className="mt-8 flex flex-col gap-5 text-pretty leading-relaxed text-ivory/70">
            <Reveal delay={240}>
              <p>
                After nearly a decade in the IT industry, Vidya Jyoti left to do
                the thing she had always come back to. Makeup has always held a
                special place in her heart, and nothing brings her greater joy
                than seeing people delighted with their appearance.
              </p>
            </Reveal>
            <Reveal delay={320}>
              <p>
                Her approach starts before colour does. While filters have their
                place, prioritising skincare is paramount — so every booking
                opens with a consultation about your skin, not a mood board.
                What follows is meant to enhance what is already there and let
                the inner radiance show, rather than replace the face you
                brought.
              </p>
            </Reveal>
            <Reveal delay={400}>
              <p>
                It is why the reviews keep using the same word — natural — for
                everything from a full South Indian bridal look to a fashion
                shoot, and why brides who were nervous about professional makeup
                book her again for the next two events.
              </p>
            </Reveal>
          </div>

          <Reveal delay={480}>
            <blockquote className="mt-10 border-l border-gold/40 pl-6 font-display text-2xl italic leading-snug text-ivory/90 sm:text-3xl">
              “{business.tagline}”
            </blockquote>
          </Reveal>
        </div>
      </div>
    </Section>
  )
}
