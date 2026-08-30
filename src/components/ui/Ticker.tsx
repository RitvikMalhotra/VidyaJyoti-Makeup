import { useEffect, useRef } from 'react'
import { useScrollBind } from '../../lib/scroll'

/**
 * Continuous band of words that drifts on its own and is pushed along by the
 * page as you scroll, so the section reacts to movement instead of just
 * sitting there.
 */
export function Ticker({
  items,
  speed = 26,
  className = '',
}: {
  items: string[]
  /** Idle drift, in pixels per second. */
  speed?: number
  className?: string
}) {
  const halfWidth = useRef(1)

  const trackRef = useScrollBind<HTMLDivElement>(
    (el, _rect, ctx) => {
      const w = halfWidth.current
      if (w < 2) return
      // Time gives the idle drift; scroll position adds the push.
      const travel = (ctx.t / 1000) * speed + ctx.y * 0.22
      el.style.transform = `translate3d(${-(travel % w)}px, 0, 0)`
    },
    // The only thing on the page that animates without being scrolled.
    { continuous: true },
  )

  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    const measure = () => {
      halfWidth.current = el.scrollWidth / 2
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [trackRef])

  return (
    <div className={`overflow-hidden ${className}`} aria-hidden>
      <div ref={trackRef} className="ticker-track">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 items-center">
            {items.map((item) => (
              <span key={`${copy}-${item}`} className="flex shrink-0 items-center">
                <span className="font-display text-[clamp(1.6rem,3.4vw,2.9rem)] whitespace-nowrap">
                  {item}
                </span>
                <svg
                  viewBox="0 0 24 24"
                  className="mx-7 h-3 w-3 shrink-0 text-accent sm:mx-10"
                  fill="currentColor"
                >
                  <circle cx="12" cy="12" r="5" />
                </svg>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
