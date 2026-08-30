import { business, mapsSearchHref } from '../../content/business'
import { aboutInterior, aboutPortrait } from '../../content/images'
import { StudioImage } from '../ui/StudioImage'
import { Reveal } from '../ui/Reveal'
import { SplitText } from '../ui/SplitText'
import { TextLink } from '../ui/Actions'

const FACTS: { label: string; value: string }[] = [
  { label: 'Studio', value: business.category },
  { label: 'Where', value: 'DK Enclave, Miyapur, Hyderabad' },
  { label: 'Open', value: `${business.hours.summary} · ${business.hours.range}` },
  {
    label: 'Rated',
    value: `${business.rating.value} from ${business.rating.countDisplay} Google reviews`,
  },
]

/**
 * The studio's story, told only with what the listing supports: where it is,
 * when it opens, what it photographs, and what customers have said. No
 * founding year, no team size, no invented history.
 */
export function About() {
  return (
    <section id="about" className="grain relative bg-surface-2 py-24 lg:py-32">
      <div className="mx-auto w-full max-w-[1560px] px-5 sm:px-8 lg:px-12">
        <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-16">
          {/* Pictures left this time — the page alternates its weight. */}
          <div className="order-2 lg:order-1 lg:col-span-6">
            <div className="relative pr-10 pb-14 sm:pr-16 sm:pb-16">
              <Reveal curtain>
                <div className="group overflow-hidden">
                  <StudioImage
                    photo={aboutPortrait}
                    zoom
                    parallax={42}
                    sizes="(max-width: 1024px) 92vw, 42vw"
                    className="w-full"
                  />
                </div>
              </Reveal>

              <Reveal
                curtain
                delay={260}
                className="absolute right-0 bottom-0 w-[52%] max-w-[19rem]"
              >
                <div className="group overflow-hidden ring-1 ring-rule-2 shadow-[0_30px_70px_-22px_rgba(0,0,0,0.8)]">
                  <StudioImage
                    photo={aboutInterior}
                    zoom
                    compact
                    parallax={26}
                    sizes="(max-width: 1024px) 46vw, 20vw"
                    className="w-full"
                  />
                </div>
              </Reveal>
            </div>
          </div>

          {/* Words */}
          <div className="order-1 lg:order-2 lg:col-span-5 lg:col-start-8">
            <Reveal className="flex items-center gap-4 sm:gap-6">
              <span className="chapter-num text-lg">02</span>
              <span className="label">The studio</span>
              <span className="rule hidden flex-1 sm:block" aria-hidden />
            </Reveal>

            <SplitText
              as="h2"
              text={`A neighbourhood studio,
open every day.`}
              mark="day."
              delay={90}
              className="display-lg mt-6"
            />

            <Reveal delay={160} className="mt-8 space-y-5">
              <p className="body-lg">
                S.L.N. Digital Studio works from a shop at DK Enclave in Miyapur, opposite
                Heritage Fresh Super Market, photographing weddings, ceremonies, birthdays
                and portraits for families here and across Hyderabad.
              </p>
              <p className="body-base">
                The doors are open from half past eight in the morning until ten at night,
                every day of the week — walk in for a passport photograph, or plan a
                ceremony that runs across several days.
              </p>
            </Reveal>

            {/* Pull quote — the one thing we are told about Ranjith, verbatim. */}
            <Reveal delay={230} className="mt-10 border-l-2 border-accent pl-6">
              <p className="font-display text-[1.3rem] leading-[1.45] text-fg sm:text-[1.55rem]">
                Customers have specifically appreciated Ranjith for his attention to their
                requests and service.
              </p>
              <p className="meta mt-3">From the studio&rsquo;s Google reviews</p>
            </Reveal>

            {/* At a glance */}
            <Reveal delay={300} className="mt-10">
              <dl className="border-t border-rule">
                {FACTS.map((fact) => (
                  <div
                    key={fact.label}
                    className="flex items-baseline gap-6 border-b border-rule py-3.5"
                  >
                    <dt className="w-16 shrink-0 text-[0.62rem] font-semibold tracking-[0.1em] text-fg-4 uppercase">
                      {fact.label}
                    </dt>
                    <dd className="text-[0.92rem] text-fg-2">{fact.value}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>

            <Reveal delay={360} className="mt-9">
              <TextLink href={mapsSearchHref} external>
                Find us on Google Maps
              </TextLink>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
