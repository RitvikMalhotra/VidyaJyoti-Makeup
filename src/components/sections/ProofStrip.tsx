import { business } from '../../content/business'
import { useStudioOpen } from '../../lib/hours'
import { useScrollBind } from '../../lib/scroll'
import { Reveal } from '../ui/Reveal'
import { GoogleIcon, PinIcon, StarIcon } from '../ui/Icons'

/**
 * Counts a number up from zero as it arrives, then leaves it alone. Driven by
 * the shared scroll loop rather than its own timer.
 */
function useCountUp(target: number, decimals = 0) {
  return useScrollBind<HTMLSpanElement>((el, rect, ctx) => {
    if (el.dataset.done === '1') return
    const entered = (ctx.vh - rect.top) / (ctx.vh * 0.55)
    const p = Math.min(1, Math.max(0, entered))
    // ease-out so the last digits settle rather than snap
    const eased = 1 - Math.pow(1 - p, 3)
    el.textContent = (target * eased).toFixed(decimals)
    if (p >= 1) el.dataset.done = '1'
  })
}

/**
 * Evidence, not a sales line: a rating, a volume of reviews and a real
 * address, set as a measured band rather than three stat cards.
 */
export function ProofStrip() {
  const status = useStudioOpen()
  const ratingRef = useCountUp(Number(business.rating.value), 1)
  const countRef = useCountUp(business.rating.count)

  return (
    <section
      aria-label="Reputation at a glance"
      className="grain relative border-b border-rule bg-surface"
    >
      <div className="mx-auto w-full max-w-[1560px] px-5 sm:px-8 lg:px-12">
        <Reveal className="flex flex-wrap items-center justify-between gap-3 border-b border-rule py-4">
          <span className="flex items-center gap-2.5">
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                status.open ? 'bg-accent' : 'bg-fg-4'
              }`}
              aria-hidden
            />
            <span className="meta font-semibold text-fg">{status.label}</span>
          </span>
          <span className="meta">
            {business.hours.summary} · {business.hours.range}
          </span>
        </Reveal>

        <div className="grid grid-cols-1 divide-y divide-rule sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          <Reveal className="flex flex-col justify-center py-9 sm:pr-8 lg:py-12">
            <p className="font-display text-[3.4rem] leading-none text-fg lg:text-[4.2rem]">
              <span ref={ratingRef}>0.0</span>
              <StarIcon className="ml-2 inline-block h-6 w-6 -translate-y-2 text-accent lg:h-7 lg:w-7" />
            </p>
            <p className="mt-4 flex items-center gap-2">
              <GoogleIcon className="h-3.5 w-3.5" />
              <span className="meta font-semibold">Google rating</span>
            </p>
          </Reveal>

          <Reveal delay={110} className="flex flex-col justify-center py-9 sm:px-8 lg:py-12">
            <p className="font-display text-[3.4rem] leading-none text-fg lg:text-[4.2rem]">
              <span ref={countRef}>0</span>
            </p>
            <p className="mt-4 meta font-semibold">Google reviews</p>
          </Reveal>

          <Reveal delay={220} className="flex flex-col justify-center py-9 sm:pl-8 lg:py-12">
            <p className="font-display text-[2rem] leading-tight text-fg lg:text-[2.4rem]">
              Miyapur,
              <br />
              Hyderabad
            </p>
            <p className="mt-4 flex items-center gap-2">
              <PinIcon className="h-3.5 w-3.5 text-accent" />
              <span className="meta font-semibold">{business.category}</span>
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
