import { useCallback, useEffect, useRef, useState } from 'react'
import { business, wa } from '../../content/business'
import { reviews } from '../../content/reviews'
import { Reveal } from '../ui/Reveal'
import { SplitText } from '../ui/SplitText'
import { ChevronIcon, GoogleIcon, StarIcon, WhatsAppIcon } from '../ui/Icons'
import { Stars } from '../ui/Stars'

/**
 * Real Google reviews, quoted exactly. Where Google truncated a review we say
 * so and stop, rather than completing someone else's sentence.
 *
 * Native scroll-snap does the carousel work: it gives correct momentum and
 * swipe behaviour on touch for free, and the arrows just nudge scrollLeft.
 */
export function Testimonials() {
  const trackRef = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)

  const scrollToCard = useCallback((i: number) => {
    const track = trackRef.current
    if (!track) return
    const card = track.children[i] as HTMLElement | undefined
    if (card) track.scrollTo({ left: card.offsetLeft - track.offsetLeft, behavior: 'smooth' })
  }, [])

  // Keep the dots honest about which card is actually centred.
  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    let frame = 0
    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        const cards = Array.from(track.children) as HTMLElement[]
        const mid = track.scrollLeft + track.clientWidth / 2
        let best = 0
        let bestDist = Infinity
        cards.forEach((card, i) => {
          const centre = card.offsetLeft - track.offsetLeft + card.clientWidth / 2
          const dist = Math.abs(centre - mid)
          if (dist < bestDist) {
            bestDist = dist
            best = i
          }
        })
        setIndex(best)
      })
    }
    track.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      track.removeEventListener('scroll', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  const step = (delta: number) =>
    scrollToCard(Math.min(reviews.length - 1, Math.max(0, index + delta)))

  return (
    <section id="reviews" className="room relative py-24 lg:py-32">
      <div className="mx-auto w-full max-w-[1560px] px-5 sm:px-8 lg:px-12">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <Reveal className="flex items-center gap-4 sm:gap-6">
              <span className="chapter-num text-lg">06</span>
              <span className="label">In their words</span>
            </Reveal>
            <SplitText
              as="h2"
              text={`What families
say afterwards.`}
              delay={90}
              className="display-lg mt-6"
            />
          </div>

          <Reveal delay={150} className="flex items-center gap-5">
            <span className="inline-flex items-center gap-3 border border-rule px-4 py-3">
              <GoogleIcon className="h-4 w-4" />
              <span className="flex items-center gap-1.5 text-sm font-medium text-fg">
                {business.rating.value}
                <StarIcon className="h-3 w-3 text-accent-2" />
              </span>
              <span className="h-3 w-px bg-rule" aria-hidden />
              <span className="meta">from {business.rating.countDisplay} Google reviews</span>
            </span>

            <span className="hidden items-center gap-2 lg:flex">
              <button
                type="button"
                onClick={() => step(-1)}
                disabled={index === 0}
                aria-label="Previous review"
                className="flex h-11 w-11 items-center justify-center border border-rule text-fg-2 transition-colors duration-400 hover:border-accent hover:text-accent-2 disabled:opacity-25 disabled:hover:border-rule disabled:hover:text-fg-2"
              >
                <ChevronIcon className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                disabled={index === reviews.length - 1}
                aria-label="Next review"
                className="flex h-11 w-11 items-center justify-center border border-rule text-fg-2 transition-colors duration-400 hover:border-accent hover:text-accent-2 disabled:opacity-25 disabled:hover:border-rule disabled:hover:text-fg-2"
              >
                <ChevronIcon className="h-4 w-4 rotate-180" />
              </button>
            </span>
          </Reveal>
        </div>
      </div>

      {/* Track — bleeds off the right edge so the next card is visibly there. */}
      <Reveal as="div" className="mt-14 w-full">
        <div
          ref={trackRef}
          className="flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-2 no-scrollbar [scroll-padding-left:1.25rem] sm:gap-6 sm:px-8 sm:[scroll-padding-left:2rem] lg:px-12 lg:[scroll-padding-left:3rem]"
        >
          {reviews.map((review) => (
            <figure
              key={review.name}
              className="flex w-[85vw] max-w-[34rem] shrink-0 snap-start flex-col border border-rule bg-surface p-7 transition-colors duration-500 hover:border-accent/55 sm:w-[60vw] sm:p-9 lg:w-[38vw]"
            >
              <Stars label={`${review.stars} out of 5 stars`} />

              <blockquote className="mt-6 flex-1">
                <p className="font-display text-[1.15rem] leading-[1.5] text-fg sm:text-[1.32rem]">
                  &ldquo;{review.quote}
                  {review.truncated ? <span className="text-fg-3">&hellip;</span> : null}
                  {!review.truncated && <>&rdquo;</>}
                </p>
                {review.truncated && (
                  <p className="meta mt-3">Shown as it appears on Google</p>
                )}
              </blockquote>

              <figcaption className="mt-8 flex items-end justify-between gap-4 border-t border-rule pt-6">
                <span>
                  <span className="block font-display text-lg text-fg">{review.name}</span>
                  {review.occasion && (
                    <span className="meta mt-1 block">{review.occasion}</span>
                  )}
                </span>
                <GoogleIcon className="h-4 w-4 shrink-0 opacity-70" />
              </figcaption>
            </figure>
          ))}
        </div>
      </Reveal>

      <div className="mx-auto w-full max-w-[1560px] px-5 sm:px-8 lg:px-12">
        {/* Progress dots */}
        <div className="mt-8 flex items-center gap-2">
          {reviews.map((review, i) => (
            <button
              key={review.name}
              type="button"
              onClick={() => scrollToCard(i)}
              aria-label={`Show review from ${review.name}`}
              aria-current={index === i}
              className="h-6 py-2.5"
            >
              <span
                className={`block h-px transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  index === i ? 'w-12 bg-accent' : 'w-6 bg-rule'
                }`}
              />
            </button>
          ))}
        </div>

        <Reveal className="mt-12 flex flex-col items-start gap-5 border-t border-rule pt-10 sm:flex-row sm:items-center sm:justify-between">
          <p className="body-base max-w-md">
            Every review above is public on Google, written by a customer of the studio.
          </p>
          <a
            href={wa.general}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-accent w-full sm:w-auto"
          >
            <WhatsAppIcon className="h-4 w-4" />
            <span>Talk to the studio</span>
          </a>
        </Reveal>
      </div>
    </section>
  )
}
