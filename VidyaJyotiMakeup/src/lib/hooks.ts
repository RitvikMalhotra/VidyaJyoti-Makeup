import { useCallback, useEffect, useRef, useState } from 'react'

/* -------------------------------------------------------------------------
 * One IntersectionObserver serves every reveal on the page. A separate
 * observer per element gets expensive fast; this keeps a single instance and
 * unobserves each element the moment it has fired.
 * ---------------------------------------------------------------------- */

let observer: IntersectionObserver | null = null
const registry = new Map<Element, () => void>()

function getObserver(): IntersectionObserver | null {
  if (typeof IntersectionObserver === 'undefined') return null
  if (observer) return observer
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        const onEnter = registry.get(entry.target)
        if (!onEnter) continue
        onEnter()
        registry.delete(entry.target)
        observer?.unobserve(entry.target)
      }
    },
    // threshold MUST stay 0. A reveal that starts fully clipped reports an
    // intersectionRatio of 0 in Chrome, so any non-zero threshold is never
    // crossed and those elements never appear. rootMargin does the
    // "wait until it is properly in view" job instead.
    { rootMargin: '0px 0px -10% 0px', threshold: 0 },
  )
  return observer
}

/**
 * Adds `is-in` once the element scrolls into view. Elements reveal once and
 * are never re-hidden — re-animating on scroll-up reads as a gimmick.
 */
export function useReveal<T extends HTMLElement>(enabled = true) {
  const ref = useRef<T | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || !enabled) return

    const io = getObserver()
    if (!io) {
      el.classList.add('is-in')
      return
    }

    // Already on screen at mount (the hero, or a reload half-way down the
    // page). Reveal on the second frame rather than immediately: waiting one
    // paint in the hidden state is what lets the transition actually run.
    const rect = el.getBoundingClientRect()
    if (rect.top < window.innerHeight * 0.92 && rect.bottom > 0) {
      let outer = 0
      let inner = 0
      outer = requestAnimationFrame(() => {
        inner = requestAnimationFrame(() => el.classList.add('is-in'))
      })
      return () => {
        cancelAnimationFrame(outer)
        cancelAnimationFrame(inner)
      }
    }

    registry.set(el, () => el.classList.add('is-in'))
    io.observe(el)

    return () => {
      registry.delete(el)
      io.unobserve(el)
    }
  }, [enabled])

  return ref
}

/* ---------------------------------------------------------------------- */

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() =>
    typeof window === 'undefined' ? false : window.matchMedia(query).matches,
  )

  useEffect(() => {
    const mql = window.matchMedia(query)
    const onChange = () => setMatches(mql.matches)
    onChange()
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [query])

  return matches
}

export const usePrefersReducedMotion = () =>
  useMediaQuery('(prefers-reduced-motion: reduce)')

/** Coarse pointer and narrow viewport both mean "do not spend bytes here". */
export const useIsMobile = () => useMediaQuery('(max-width: 767px)')

/**
 * True when the connection is metered or slow, so the cinematic layer can opt
 * out entirely. Undefined on browsers without the Network Information API,
 * which is treated as "fine to load".
 */
export function useSaveData(): boolean {
  const [save, setSave] = useState(false)

  useEffect(() => {
    type Conn = { saveData?: boolean; effectiveType?: string; addEventListener?: (t: string, cb: () => void) => void; removeEventListener?: (t: string, cb: () => void) => void }
    const conn = (navigator as Navigator & { connection?: Conn }).connection
    if (!conn) return

    const read = () =>
      setSave(
        Boolean(conn.saveData) ||
          conn.effectiveType === 'slow-2g' ||
          conn.effectiveType === '2g',
      )
    read()
    conn.addEventListener?.('change', read)
    return () => conn.removeEventListener?.('change', read)
  }, [])

  return save
}

/** Id of whichever section currently owns the viewport, for nav highlighting. */
export function useActiveSection(ids: readonly string[]): string | null {
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    const els = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)
    if (!els.length || typeof IntersectionObserver === 'undefined') return

    const visible = new Map<string, number>()
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) visible.set(e.target.id, e.intersectionRatio)
        let best: string | null = null
        let bestRatio = 0
        for (const [id, ratio] of visible) {
          if (ratio > bestRatio) {
            bestRatio = ratio
            best = id
          }
        }
        if (bestRatio > 0.06) setActive(best)
      },
      { threshold: [0, 0.06, 0.25, 0.5, 0.75, 1], rootMargin: '-20% 0px -40% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [ids])

  return active
}

/** True once the page has scrolled past `threshold` pixels. */
export function useScrolled(threshold = 24): boolean {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    let frame = 0
    const read = () => {
      frame = 0
      setScrolled(window.scrollY > threshold)
    }
    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(read)
    }
    read()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [threshold])

  return scrolled
}

/**
 * Freezes the page behind an overlay without the iOS scroll-to-top jump that
 * `overflow: hidden` alone causes.
 */
export function useBodyLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return
    const { body } = document
    const y = window.scrollY
    const prev = {
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
      overflow: body.style.overflow,
    }
    body.style.position = 'fixed'
    body.style.top = `-${y}px`
    body.style.width = '100%'
    body.style.overflow = 'hidden'
    return () => {
      body.style.position = prev.position
      body.style.top = prev.top
      body.style.width = prev.width
      body.style.overflow = prev.overflow
      window.scrollTo(0, y)
    }
  }, [locked])
}

/** Horizontal swipe detection for the lightbox. */
export function useSwipe(onLeft: () => void, onRight: () => void, min = 45) {
  const start = useRef<{ x: number; y: number } | null>(null)

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    const t = e.touches[0]
    start.current = { x: t.clientX, y: t.clientY }
  }, [])

  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      const s = start.current
      if (!s) return
      start.current = null
      const t = e.changedTouches[0]
      const dx = t.clientX - s.x
      const dy = t.clientY - s.y
      // Ignore mostly-vertical gestures so page scrolling still wins.
      if (Math.abs(dx) < min || Math.abs(dx) < Math.abs(dy) * 1.2) return
      if (dx < 0) onLeft()
      else onRight()
    },
    [onLeft, onRight, min],
  )

  return { onTouchStart, onTouchEnd }
}
