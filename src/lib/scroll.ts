import { useEffect, useRef } from 'react'

/**
 * Scroll-driven motion engine.
 *
 * One requestAnimationFrame loop drives every parallax layer, the nav
 * progress rule, the counting figures and the ticker. Three things keep it
 * fluid rather than steppy:
 *
 *  1. NO LAYOUT READS IN THE LOOP. Each element's document offset is measured
 *     once — on register, on resize, and when it scrolls into view — and the
 *     frame derives its viewport position from `scrollY` arithmetic. Calling
 *     getBoundingClientRect() on twenty frames every tick is what made the
 *     portfolio stutter.
 *
 *  2. FRAMES KEEP COMING UNTIL VALUES SETTLE. A scroll event wakes the loop,
 *     and the loop keeps scheduling itself while anything is still easing, so
 *     transforms never trail the scroll by a frame.
 *
 *  3. SMOOTHING IS TIME-BASED. Parallax eases toward its target with a
 *     framerate-independent factor, so it behaves the same at 60Hz and 120Hz.
 *
 * The loop parks itself when everything has settled and nothing is on screen,
 * and never starts at all under prefers-reduced-motion.
 */

export type Ctx = { y: number; vh: number; docH: number; t: number }
export type Geom = { top: number; height: number }

type Binding = {
  el: HTMLElement
  apply: (el: HTMLElement, geom: Geom, ctx: Ctx, value: number) => void
  /** Raw value to ease toward. Omit for bindings that do their own maths. */
  target?: (geom: Geom, ctx: Ctx) => number
  /** 0 snaps; otherwise the fraction of the gap closed per 60Hz frame. */
  smooth: number
  always: boolean
  continuous: boolean
  /** Marks the media layer for compositing only while it is on screen. */
  promote: boolean

  live: boolean
  primed: boolean
  current: number
  offsetTop: number
  height: number
}

const bindings = new Set<Binding>()
const byEl = new WeakMap<Element, Binding>()

let observer: IntersectionObserver | null = null
let rafId = 0
let lastT = 0

function reducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

/** The one place geometry is read. Never called from inside a frame. */
function measure(b: Binding) {
  const rect = b.el.getBoundingClientRect()
  b.offsetTop = rect.top + window.scrollY
  b.height = rect.height
}

function getObserver() {
  if (observer || typeof IntersectionObserver === 'undefined') return observer
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const b = byEl.get(entry.target)
        if (!b) continue
        b.live = entry.isIntersecting
        if (entry.isIntersecting) {
          measure(b)
          if (b.promote) b.el.dataset.live = '1'
        } else if (b.promote) {
          delete b.el.dataset.live
        }
      }
      schedule()
    },
    { rootMargin: '25% 0px 25% 0px' },
  )
  return observer
}

function frame(t: number) {
  rafId = 0
  const dt = lastT ? Math.min(64, t - lastT) : 16.67
  lastT = t

  const vh = window.innerHeight
  const y = window.scrollY
  const ctx: Ctx = { y, vh, docH: document.documentElement.scrollHeight, t }

  let alive = false

  for (const b of bindings) {
    if (!b.always && !b.live) continue

    // Derived, not measured.
    const geom: Geom = { top: b.offsetTop - y, height: b.height }

    if (b.target) {
      const target = b.target(geom, ctx)
      if (!b.primed) {
        b.current = target
        b.primed = true
      } else if (b.smooth > 0) {
        // Framerate-independent easing: same settle time at 60Hz and 120Hz.
        const k = 1 - Math.pow(1 - b.smooth, dt / 16.67)
        b.current += (target - b.current) * k
        if (Math.abs(target - b.current) > 0.0004) alive = true
        else b.current = target
      } else {
        b.current = target
      }
    }

    b.apply(b.el, geom, ctx, b.current)
    if (b.continuous) alive = true
  }

  if (alive) schedule()
}

function schedule() {
  if (rafId || typeof window === 'undefined' || document.hidden) return
  rafId = requestAnimationFrame(frame)
}

function register(b: Binding) {
  bindings.add(b)
  byEl.set(b.el, b)
  measure(b)

  if (b.always) {
    b.live = true
    schedule()
  } else {
    getObserver()?.observe(b.el)
  }

  return () => {
    bindings.delete(b)
    byEl.delete(b.el)
    observer?.unobserve(b.el)
    if (b.promote) delete b.el.dataset.live
  }
}

if (typeof window !== 'undefined') {
  let resizeFrame = 0
  window.addEventListener('scroll', () => schedule(), { passive: true })
  window.addEventListener('resize', () => {
    if (resizeFrame) return
    resizeFrame = requestAnimationFrame(() => {
      resizeFrame = 0
      for (const b of bindings) measure(b)
      schedule()
    })
  })
  document.addEventListener('visibilitychange', () => {
    lastT = 0
    schedule()
  })
  // Web fonts land after first paint and reflow the page under every frame.
  if (document.fonts?.ready) {
    document.fonts.ready.then(() => {
      for (const b of bindings) measure(b)
      schedule()
    })
  }
}

/** Signed −1…1 position of an element's centre relative to the viewport centre. */
export function centreProgress(geom: Geom, vh: number) {
  const centre = geom.top + geom.height / 2
  const span = (vh + geom.height) / 2
  return Math.max(-1.3, Math.min(1.3, (centre - vh / 2) / span))
}

type BindOptions = {
  /** Run even while off screen (the nav progress rule). */
  always?: boolean
  enabled?: boolean
  /** Animates on its own clock, not only when the page moves (the ticker). */
  continuous?: boolean
  /** Value to ease toward; `value` in apply is the eased result. */
  target?: (geom: Geom, ctx: Ctx) => number
  /** Fraction of the remaining gap closed per 60Hz frame. */
  smooth?: number
  /** Hint the compositor while on screen. Only for elements that transform. */
  promote?: boolean
}

/**
 * Binds an element to the scroll loop. `apply` is called every frame while the
 * element is on screen — write styles in it, never read layout.
 */
export function useScrollBind<T extends HTMLElement>(
  apply: (el: T, geom: Geom, ctx: Ctx, value: number) => void,
  options: BindOptions = {},
) {
  const ref = useRef<T | null>(null)
  const applyRef = useRef(apply)
  applyRef.current = apply

  const targetRef = useRef(options.target)
  targetRef.current = options.target

  const {
    always = false,
    enabled = true,
    continuous = false,
    smooth = 0,
    promote = false,
  } = options

  const hasTarget = Boolean(options.target)

  useEffect(() => {
    const el = ref.current
    if (!el || !enabled || reducedMotion()) return
    return register({
      el,
      always,
      continuous,
      smooth,
      promote,
      live: false,
      primed: false,
      current: 0,
      offsetTop: 0,
      height: 0,
      target: hasTarget ? (geom, ctx) => targetRef.current!(geom, ctx) : undefined,
      apply: (node, geom, ctx, value) => applyRef.current(node as T, geom, ctx, value),
    })
  }, [always, enabled, continuous, smooth, promote, hasTarget])

  return ref
}

/**
 * Vertical parallax inside a frame. `distance` is the total travel in pixels
 * across the full viewport; the motion eases rather than tracking the scroll
 * rigidly, which is what makes a wall of frames feel fluid instead of stepped.
 */
export function useParallax<T extends HTMLElement>(distance = 60, smooth = 0.16) {
  return useScrollBind<T>(
    (el, _geom, _ctx, p) => {
      el.style.transform = `translate3d(0, ${(p * distance).toFixed(2)}px, 0)`
    },
    {
      target: (geom, ctx) => centreProgress(geom, ctx.vh),
      smooth,
      promote: true,
      enabled: distance !== 0,
    },
  )
}
