import { useEffect, useState } from 'react'
import { business } from '../../content/business'
import { useBodyLock, usePrefersReducedMotion } from '../../lib/hooks'

type Phase = 'mark' | 'exit' | 'done'

const PANELS = 5

/**
 * Opening sequence: an aperture turns over the wordmark, a vermillion rule
 * inks across beneath it, then a warm sheet of photographic paper splits into
 * vertical blinds and lifts off the dim room underneath.
 *
 * Skipped outright when the visitor prefers reduced motion.
 */
export function Intro({ onDone }: { onDone: () => void }) {
  const reduced = usePrefersReducedMotion()
  const [phase, setPhase] = useState<Phase>(reduced ? 'done' : 'mark')

  useBodyLock(phase !== 'done')

  useEffect(() => {
    if (reduced) {
      onDone()
      return
    }
    const toExit = setTimeout(() => setPhase('exit'), 1050)
    // Fires as the blinds start lifting, so the hero is already moving behind.
    const toHero = setTimeout(onDone, 1300)
    // Must outlast the slowest blind: 1050 + 900 duration + 220 stagger.
    const toEnd = setTimeout(() => setPhase('done'), 2260)
    return () => {
      clearTimeout(toExit)
      clearTimeout(toHero)
      clearTimeout(toEnd)
    }
  }, [reduced, onDone])

  if (phase === 'done') return null

  const leaving = phase === 'exit'

  return (
    <div className="pointer-events-none fixed inset-0 z-[100]" aria-hidden>
      {/* Blinds */}
      <div className="absolute inset-0 flex">
        {Array.from({ length: PANELS }, (_, i) => (
          <span
            key={i}
            className="h-full flex-1 bg-plate transition-transform duration-[900ms] ease-[cubic-bezier(0.76,0,0.24,1)]"
            style={{
              transform: leaving ? 'translate3d(0,-101%,0)' : 'translate3d(0,0,0)',
              transitionDelay: `${i * 55}ms`,
            }}
          />
        ))}
      </div>

      {/* Wordmark */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{
          opacity: leaving ? 0 : 1,
          transform: leaving ? 'translate3d(0,-14px,0)' : 'none',
        }}
      >
        <svg
          viewBox="0 0 48 48"
          className="h-9 w-9 text-accent-3"
          fill="none"
          style={{ animation: 'aperture 9s linear infinite' }}
        >
          <circle cx="24" cy="24" r="21" stroke="currentColor" strokeWidth="1" opacity="0.45" />
          <circle
            cx="24"
            cy="24"
            r="21"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="34 98"
          />
        </svg>

        <span className="mt-6 overflow-hidden">
          <span
            className="block font-display text-4xl text-plate-ink transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] sm:text-5xl"
            style={{
              letterSpacing: '0.06em',
              transform: 'translate3d(0,0,0)',
              animation: 'intro-rise 900ms cubic-bezier(0.16,1,0.3,1) both',
            }}
          >
            {business.logoTop}
          </span>
        </span>

        <span
          className="mt-4 h-px w-28 origin-left bg-accent-3"
          style={{ animation: 'intro-rule 1000ms cubic-bezier(0.16,1,0.3,1) 260ms both' }}
        />

        <span
          className="mt-4 text-[0.6rem] font-semibold tracking-[0.32em] text-plate-ink/60 uppercase"
          style={{ animation: 'fade-in 700ms ease 520ms both' }}
        >
          {business.logoBottom}
        </span>
      </div>
    </div>
  )
}
