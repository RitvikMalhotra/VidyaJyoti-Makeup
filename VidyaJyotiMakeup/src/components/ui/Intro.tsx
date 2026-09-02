import { useEffect, useRef, useState } from 'react'
import { business } from '../../content/business'
import { usePrefersReducedMotion } from '../../lib/hooks'

/* -------------------------------------------------------------------------
 * THE OPENING
 *
 * A title card — V.J, then the name — that the camera flies through into the
 * hero.
 *
 * Entrance, four beats over ~2.6s:
 *
 *   0.0s   the initials fade up, letter-spacing easing closed, as if the two
 *          halves of the monogram are settling together
 *   0.6s   a gold hairline draws outward from the centre beneath them
 *   1.1s   the full name and the role rise underneath the rule
 *   2.6s   the exit begins
 *
 * Exit, ~1.15s:
 *
 *   The card is not faded out. It is passed through. Three sibling layers
 *   share one perspective and move at very different rates:
 *
 *     plane      the ink ground, swelling slightly and clearing
 *     bloom      gold light expanding through the gap it leaves
 *     monogram   travelling four times as far and blurring, so it flies past
 *                the viewer rather than shrinking away
 *
 *   Meanwhile the hero settles out of a push-in behind it. That second half
 *   matters: a card flying off a static picture still reads as two states,
 *   not one continuous camera move.
 *
 *   THE LAYERS ARE SIBLINGS, NOT NESTED, on purpose. `filter` forces
 *   `transform-style: flat` on an element's descendants, so a blurred parent
 *   would collapse any child's translateZ back into the plane and the depth
 *   would silently disappear.
 *
 * Three rules it still obeys, because an opening animation is the easiest
 * thing on a website to get wrong:
 *
 *  1. IT NEVER BLOCKS THE PAGE. The hero is mounted, painted and loading its
 *     photograph the whole time — the card is only an overlay on top.
 *
 *  2. IT HAPPENS ONCE PER SESSION. Charming the first time, an obstacle the
 *     fourth. sessionStorage remembers, and every access is wrapped: Safari
 *     in private mode throws on the property itself, not just on write.
 *
 *  3. IT IS SKIPPABLE AND IT RESPECTS REDUCED MOTION. Any key, click or
 *     scroll dismisses it, and under prefers-reduced-motion it never mounts.
 * ---------------------------------------------------------------------- */

const SEEN_KEY = 'vj:intro-seen'

/**
 * The exit animation's length, for the unmount timer only.
 *
 * The duration is ALSO written literally into the `animate-[…]` classes below
 * and the two must be kept in step. Tailwind scans source text for class
 * names, so a class built from a template literal — `animate-[…${EXIT_MS}ms…]`
 * — is never seen, never generated, and the animation silently does nothing.
 */
const EXIT_MS = 1150

/** sessionStorage access throws outright in some privacy modes. */
function seenThisSession(): boolean {
  try {
    return window.sessionStorage.getItem(SEEN_KEY) === '1'
  } catch {
    return false
  }
}

function markSeen() {
  try {
    window.sessionStorage.setItem(SEEN_KEY, '1')
  } catch {
    // Not being able to remember is not a reason to fail.
  }
}

export function Intro({ onDone }: { onDone: () => void }) {
  const reduced = usePrefersReducedMotion()

  // Decided once, before first paint, so the card never flashes for someone
  // who has already seen it.
  const [active, setActive] = useState(() => {
    if (typeof window === 'undefined') return false
    return (
      !seenThisSession() && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    )
  })
  const [leaving, setLeaving] = useState(false)
  const doneRef = useRef(false)

  // Fires onDone exactly once, whether the sequence ran out or was skipped.
  const finish = useRef(() => {})
  finish.current = () => {
    if (doneRef.current) return
    doneRef.current = true
    markSeen()
    setLeaving(true)
    // The hero begins arriving now, not when the card is gone — the two
    // halves of the move have to overlap or it reads as a handover.
    onDone()
    window.setTimeout(() => setActive(false), EXIT_MS + 80)
  }

  useEffect(() => {
    if (!active) {
      // Nothing to play — release the page immediately.
      onDone()
      return
    }

    // The page must not scroll underneath the card. Kept deliberately simple:
    // the overlay is short-lived and always at the top of the document, so the
    // scroll-restoring dance in useBodyLock would be overkill here.
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const timer = window.setTimeout(() => finish.current(), 2600)

    const skip = () => finish.current()
    window.addEventListener('keydown', skip)
    window.addEventListener('pointerdown', skip)
    window.addEventListener('wheel', skip, { passive: true })
    window.addEventListener('touchmove', skip, { passive: true })

    return () => {
      document.body.style.overflow = prev
      window.clearTimeout(timer)
      window.removeEventListener('keydown', skip)
      window.removeEventListener('pointerdown', skip)
      window.removeEventListener('wheel', skip)
      window.removeEventListener('touchmove', skip)
    }
  }, [active, onDone])

  if (!active || reduced) return null

  return (
    <div
      // Decorative: the same name and role are in the nav and the hero
      // underneath, so there is nothing here for a screen reader to gain.
      aria-hidden="true"
      className={`fixed inset-0 z-200 ${leaving ? 'pointer-events-none' : ''}`}
      // The shared viewing volume. Everything below is a sibling inside it.
      style={{ perspective: '1000px' }}
    >
      {/* The ink plane. */}
      <div
        className={`absolute inset-0 bg-ink ${
          leaving
            ? 'animate-[introExitPlane_1150ms_cubic-bezier(0.7,0,0.28,1)_both]'
            : ''
        }`}
      >
        <div
          className="absolute inset-0 animate-[introGlow_2.2s_ease-out_both]"
          style={{
            background:
              'radial-gradient(46% 40% at 50% 46%, color-mix(in oklab, var(--color-gold) 20%, transparent), transparent 70%)',
          }}
        />
      </div>

      {/* Gold light opening up behind the card as it passes. */}
      {leaving && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="h-[46vmin] w-[46vmin] rounded-full animate-[introExitBloom_1150ms_ease-out_both]"
            style={{
              background:
                'radial-gradient(circle, color-mix(in oklab, var(--color-gold-bright) 60%, transparent), transparent 68%)',
            }}
          />
        </div>
      )}

      {/* The monogram block — the layer that actually passes the viewer. */}
      <div
        className={`absolute inset-0 flex flex-col items-center justify-center px-6 ${
          leaving
            ? 'animate-[introExitMark_1150ms_cubic-bezier(0.7,0,0.28,1)_both]'
            : ''
        }`}
      >
        {/* `both` fill mode, not `forwards`, on every entrance beat: the
            delayed ones must hold their 0% state during the delay, or each
            element flashes at full opacity before its turn. */}
        <span className="foil wordmark animate-[introMark_1.5s_cubic-bezier(0.22,1,0.36,1)_both] text-[clamp(5rem,21vw,10rem)] leading-none">
          V.J
        </span>

        {/* The rule draws outward from its centre. */}
        <span className="rule-gold mt-7 h-px w-40 max-w-[60vw] origin-center animate-[introRule_1s_cubic-bezier(0.22,1,0.36,1)_0.6s_both] sm:w-56" />

        <span className="mt-7 animate-[introName_1s_cubic-bezier(0.22,1,0.36,1)_1.1s_both] text-[0.62rem] uppercase tracking-[0.44em] text-ivory/80 sm:text-[0.7rem]">
          {business.name}
        </span>
        <span className="mt-3 animate-[introName_1s_cubic-bezier(0.22,1,0.36,1)_1.35s_both] text-[0.55rem] uppercase tracking-[0.34em] text-gold/70">
          {business.role} · {business.city}
        </span>
      </div>
    </div>
  )
}
