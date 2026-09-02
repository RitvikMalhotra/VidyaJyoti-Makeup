import { useEffect, useRef } from 'react'

/* -------------------------------------------------------------------------
 * The motion engine.
 *
 * One requestAnimationFrame loop drives every parallax layer, every depth
 * frame and the fluid section transition. Four rules keep it fluid instead of
 * steppy, and they are the whole reason this file exists rather than a
 * scroll handler per component:
 *
 *  1. NO LAYOUT READS INSIDE THE LOOP. An element's document offset is
 *     measured once — on register, on resize, on font load, and when it
 *     enters view — and each frame derives its viewport position from
 *     scrollY arithmetic. Calling getBoundingClientRect() on a dozen
 *     elements every tick is what makes a page of images stutter.
 *
 *  2. SMOOTHING IS TIME-BASED. Values ease toward their target with a
 *     framerate-independent factor, so a 120Hz display settles in the same
 *     wall-clock time as a 60Hz one instead of twice as fast.
 *
 *  3. THE LOOP PARKS ITSELF. When nothing is on screen and every value has
 *     settled, no frames are scheduled at all. Scrolling, pointer movement
 *     and resizing wake it.
 *
 *  4. IT NEVER STARTS UNDER prefers-reduced-motion. Not "smaller movement" —
 *     no loop, no transforms, no bindings. The layout is designed to be
 *     complete without any of it.
 * ---------------------------------------------------------------------- */

export type Ctx = {
  y: number
  vh: number
  vw: number
  /** Pointer position, minus-one to one from the viewport centre. Zero on touch. */
  px: number
  py: number
  t: number
}

export type Geom = { top: number; height: number }

type Binding = {
  el: HTMLElement
  apply: (el: HTMLElement, geom: Geom, ctx: Ctx, value: number) => void
  target?: (geom: Geom, ctx: Ctx) => number
  /** 0 snaps to target; otherwise the fraction of the gap closed per 60Hz frame. */
  smooth: number
  always: boolean
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

/** Pointer target and its eased value, shared by every depth frame. */
let pointerTargetX = 0
let pointerTargetY = 0
let pointerX = 0
let pointerY = 0

export function prefersReducedMotion() {
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
        // Promote to its own layer only while it is actually moving. Leaving
        // will-change on permanently costs memory for every offscreen frame.
        if (entry.isIntersecting) {
          measure(b)
          b.el.style.willChange = 'transform'
        } else {
          b.el.style.willChange = ''
        }
      }
      schedule()
    },
    // Start early enough that an element is already in position by the time
    // it is visible, rather than snapping into place at the viewport edge.
    { rootMargin: '25% 0px 25% 0px' },
  )
  return observer
}

function frame(t: number) {
  rafId = 0
  const dt = lastT ? Math.min(64, t - lastT) : 16.67
  lastT = t

  // Pointer eases on the same clock as everything else, so depth frames drift
  // toward the cursor instead of snapping to it.
  const pk = 1 - Math.pow(1 - 0.08, dt / 16.67)
  pointerX += (pointerTargetX - pointerX) * pk
  pointerY += (pointerTargetY - pointerY) * pk
  let alive =
    Math.abs(pointerTargetX - pointerX) > 0.0008 ||
    Math.abs(pointerTargetY - pointerY) > 0.0008

  const ctx: Ctx = {
    y: window.scrollY,
    vh: window.innerHeight,
    vw: window.innerWidth,
    px: pointerX,
    py: pointerY,
    t,
  }

  for (const b of bindings) {
    if (!b.always && !b.live) continue

    // Derived from the cached offset, not measured.
    const geom: Geom = { top: b.offsetTop - ctx.y, height: b.height }

    if (b.target) {
      const target = b.target(geom, ctx)
      if (!b.primed) {
        b.current = target
        b.primed = true
      } else if (b.smooth > 0) {
        const k = 1 - Math.pow(1 - b.smooth, dt / 16.67)
        b.current += (target - b.current) * k
        if (Math.abs(target - b.current) > 0.0004) alive = true
        else b.current = target
      } else {
        b.current = target
      }
    }

    b.apply(b.el, geom, ctx, b.current)
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
    b.el.style.willChange = ''
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

  // Pointer drives the dimensional frames. Ignored on coarse pointers, where
  // there is no hover state and the finger is usually over the image anyway.
  if (window.matchMedia('(pointer: fine)').matches) {
    window.addEventListener(
      'pointermove',
      (e) => {
        pointerTargetX = (e.clientX / window.innerWidth) * 2 - 1
        pointerTargetY = (e.clientY / window.innerHeight) * 2 - 1
        schedule()
      },
      { passive: true },
    )
  }

  document.addEventListener('visibilitychange', () => {
    lastT = 0
    schedule()
  })

  // Web fonts land after first paint and reflow everything underneath.
  if (document.fonts?.ready) {
    document.fonts.ready.then(() => {
      for (const b of bindings) measure(b)
      schedule()
    })
  }
}

/** Signed minus-one to one position of a centre against the viewport centre. */
export function centreProgress(geom: Geom, vh: number) {
  const centre = geom.top + geom.height / 2
  const span = (vh + geom.height) / 2
  return Math.max(-1.3, Math.min(1.3, (centre - vh / 2) / span))
}

/** 0 to 1 progress of an element travelling through the viewport. */
export function throughProgress(geom: Geom, vh: number) {
  const total = vh + geom.height
  const travelled = vh - geom.top
  return Math.max(0, Math.min(1, travelled / total))
}

type BindOptions = {
  always?: boolean
  enabled?: boolean
  target?: (geom: Geom, ctx: Ctx) => number
  smooth?: number
}

/**
 * Binds an element to the loop. `apply` runs every frame while the element is
 * on screen — write styles in it, never read layout.
 */
export function useMotion<T extends HTMLElement>(
  apply: (el: T, geom: Geom, ctx: Ctx, value: number) => void,
  options: BindOptions = {},
) {
  const ref = useRef<T | null>(null)
  const applyRef = useRef(apply)
  applyRef.current = apply

  const targetRef = useRef(options.target)
  targetRef.current = options.target

  const { always = false, enabled = true, smooth = 0 } = options
  const hasTarget = Boolean(options.target)

  useEffect(() => {
    const el = ref.current
    if (!el || !enabled || prefersReducedMotion()) return
    return register({
      el,
      always,
      smooth,
      live: false,
      primed: false,
      current: 0,
      offsetTop: 0,
      height: 0,
      target: hasTarget ? (geom, ctx) => targetRef.current!(geom, ctx) : undefined,
      apply: (node, geom, ctx, value) => applyRef.current(node as T, geom, ctx, value),
    })
  }, [always, enabled, smooth, hasTarget])

  return ref
}

/**
 * Vertical parallax. `distance` is the total travel in pixels across a full
 * viewport pass; the easing is what stops a wall of frames looking stepped.
 */
export function useParallax<T extends HTMLElement>(distance = 60, smooth = 0.16) {
  return useMotion<T>(
    (el, _geom, _ctx, p) => {
      el.style.transform = `translate3d(0, ${(p * distance).toFixed(2)}px, 0)`
    },
    {
      target: (geom, ctx) => centreProgress(geom, ctx.vh),
      smooth,
      enabled: distance !== 0,
    },
  )
}
