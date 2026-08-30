import { business } from '../../content/business'
import { reviewThemes } from '../../content/reviews'
import { Reveal } from '../ui/Reveal'
import { SplitText } from '../ui/SplitText'
import { GoogleIcon, StarIcon } from '../ui/Icons'
import { TextLink } from '../ui/Actions'

/**
 * Reasons to trust the studio — each one traceable to the Google listing.
 * No superlatives, no invented milestones: the numbers do the work.
 */
const POINTS: { stat?: string; title: string; copy: string }[] = [
  {
    stat: business.rating.countDisplay,
    title: 'Google reviews',
    copy: 'Public, verifiable feedback on the studio’s Google listing — written by customers, not by us.',
  },
  {
    stat: business.rating.value,
    title: 'Average rating',
    copy: 'The average across every review currently on the listing.',
  },
  {
    title: 'Every kind of occasion',
    copy: 'Weddings, ceremonies, birthdays, portraits, passport photographs and albums — under one roof.',
  },
  {
    title: 'Local and easy to reach',
    copy: 'A walk-in studio in Miyapur, opposite Heritage Fresh Super Market, open every day of the week.',
  },
  {
    title: 'Attentive service',
    copy: 'Reviews repeatedly mention a patient photographer, good service, and requests taken seriously.',
  },
]

export function WhySln() {
  return (
    <section className="grain relative bg-surface-2 py-24 lg:py-32">
      <div className="mx-auto w-full max-w-[1560px] px-5 sm:px-8 lg:px-12">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          {/* Anchor column */}
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <Reveal className="flex items-center gap-4 sm:gap-6">
                <span className="chapter-num text-lg">05</span>
                <span className="label">Why S.L.N.</span>
              </Reveal>

              <SplitText
                as="h2"
                text={`${business.rating.countDisplay} reviews.
${business.rating.value} out of five.`}
                mark="five."
                delay={90}
                className="display-lg mt-6"
              />

              <Reveal delay={170} className="mt-8">
                <div className="inline-flex items-center gap-4 border border-rule bg-surface-3 px-5 py-4">
                  <GoogleIcon className="h-5 w-5" />
                  <span className="h-6 w-px bg-rule" aria-hidden />
                  <span>
                    <span className="flex items-center gap-1.5">
                      <span className="font-display text-2xl leading-none text-fg">
                        {business.rating.value}
                      </span>
                      <StarIcon className="h-3.5 w-3.5 text-accent" />
                    </span>
                    <span className="meta mt-1 block">
                      {business.rating.countDisplay} reviews
                    </span>
                  </span>
                </div>
              </Reveal>

              <Reveal delay={240} className="mt-8">
                <TextLink href="#reviews">Read what they wrote</TextLink>
              </Reveal>
            </div>
          </div>

          {/* Points */}
          <div className="lg:col-span-7 lg:col-start-6">
            <ul className="border-t border-rule">
              {POINTS.map((point, i) => (
                <Reveal as="li" key={point.title} delay={i * 70} className="border-b border-rule">
                  <div className="flex items-baseline gap-6 py-7 sm:gap-10">
                    <span className="w-14 shrink-0 text-right sm:w-24">
                      {point.stat ? (
                        <span className="font-display text-3xl leading-none text-accent sm:text-4xl">
                          {point.stat}
                        </span>
                      ) : (
                        <span className="font-sans text-[0.72rem] font-semibold text-fg-4">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <h3 className="display-sm">{point.title}</h3>
                      <p className="body-base mt-2 max-w-lg">{point.copy}</p>
                    </span>
                  </div>
                </Reveal>
              ))}
            </ul>

            {/* Themes, quoted from the listing rather than claimed by us. */}
            <Reveal delay={120} className="mt-10">
              <p className="label">What customers mention on Google</p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {reviewThemes.map((theme) => (
                  <li
                    key={theme}
                    className="border border-rule bg-surface-3 px-3.5 py-2 text-[0.78rem] font-medium text-fg-2 transition-colors duration-400 hover:border-accent/60 hover:text-accent-2"
                  >
                    {theme}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
