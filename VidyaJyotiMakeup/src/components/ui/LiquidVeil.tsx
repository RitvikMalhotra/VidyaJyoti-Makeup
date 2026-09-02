import { useEffect, useRef } from 'react'
import { Cinematic } from './Cinematic'
import { cinematics } from '../../content/media'
import { usePrefersReducedMotion } from '../../lib/hooks'

/* -------------------------------------------------------------------------
 * THE SIGNATURE TRANSITION
 *
 * One moment on this site, between the work and the offer, where the page
 * dissolves into flowing translucent light and reforms.
 *
 * It is drawn as a handful of soft elliptical ribbons drifting across each
 * other at different speeds and heights. An earlier version stacked
 * full-width wave bands, which was a mistake: every band spanned edge to
 * edge, they all centred near the same height, and composited additively they
 * fused into one hard bright stripe — especially on a short viewport, where
 * the whole effect compressed into a bar. Radial ribbons have no edges to
 * begin with, so they read as light through silk instead of as a rule across
 * the page.
 *
 * Three things keep it elegant:
 *
 *  1. NOTHING TOUCHES AN EDGE. Each ribbon is a radial gradient falling to
 *     zero alpha, so the effect fades out on all four sides on its own.
 *
 *  2. THE HEIGHTS AND SPEEDS ARE SPREAD. Ribbons sit between 0.3 and 0.7 of
 *     the height and drift at different rates in both directions. Shared
 *     rhythm looks mechanical; wildly different looks chaotic. The interest
 *     is in the slow drift between them.
 *
 *  3. SCROLL DRIVES THE PRESENCE. The veil gathers as the boundary enters the
 *     viewport and clears as it leaves, so it belongs to the reader's
 *     movement through the page rather than running on its own clock.
 *
 * When the Higgsfield `liquid-veil` render exists it plays here instead and
 * this becomes its fallback. Until then this IS the transition — finished,
 * not a placeholder.
 * ---------------------------------------------------------------------- */

type Ribbon = {
  /** Vertical centre as a fraction of height. */
  y: number
  /** Radii as fractions of width and height. */
  rx: number
  ry: number
  /** Widths of travel per second. Sign sets the direction. */
  speed: number
  phase: number
  /** `r, g, b` */
  color: string
  alpha: number
}

// Alphas are deliberately low. Brighter, these fused into a single lit smear
// across the width — which is exactly what made this block read as a gap in
// the page rather than as a transition. The hairline through the middle is
// the thing the eye should land on; the ribbons are the light behind it.
const RIBBONS: Ribbon[] = [
  { y: 0.38, rx: 0.30, ry: 0.26, speed: 0.028, phase: 0.05, color: '201, 161, 94', alpha: 0.30 },
  { y: 0.56, rx: 0.38, ry: 0.34, speed: -0.021, phase: 0.42, color: '236, 205, 148', alpha: 0.25 },
  { y: 0.47, rx: 0.24, ry: 0.22, speed: 0.036, phase: 0.74, color: '227, 192, 180', alpha: 0.23 },
  { y: 0.64, rx: 0.33, ry: 0.28, speed: -0.026, phase: 0.20, color: '176, 106, 92', alpha: 0.20 },
  { y: 0.31, rx: 0.27, ry: 0.20, speed: 0.016, phase: 0.60, color: '224, 139, 60', alpha: 0.15 },
]

function draw(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  t: number,
  presence: number,
) {
  ctx.clearRect(0, 0, w, h)
  if (presence <= 0.002) return

  // Overlapping translucent ribbons bloom where they cross, the way light
  // does through layers of fabric.
  ctx.globalCompositeOperation = 'lighter'

  for (const r of RIBBONS) {
    // Travel wraps through a range wider than the canvas, so a ribbon is
    // always fully off-screen before it reappears on the other side.
    const span = 1.6
    const u = (((r.phase + t * r.speed) % span) + span) % span
    const cx = (u - 0.3) * w
    const cy = r.y * h
    const rx = r.rx * w
    const ry = r.ry * h
    if (rx <= 0 || ry <= 0) continue

    ctx.save()
    ctx.translate(cx, cy)
    // Draw a circle under a non-uniform scale — cheaper and smoother than
    // approximating an ellipse with curves.
    ctx.scale(1, ry / rx)

    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, rx)
    const a = r.alpha * presence
    g.addColorStop(0, `rgba(${r.color}, ${a})`)
    g.addColorStop(0.55, `rgba(${r.color}, ${a * 0.45})`)
    g.addColorStop(1, `rgba(${r.color}, 0)`)

    ctx.fillStyle = g
    ctx.beginPath()
    ctx.arc(0, 0, rx, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }

  ctx.globalCompositeOperation = 'source-over'
}

function VeilCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const hostRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const host = hostRef.current
    if (!canvas || !host) return
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    let raf = 0
    let running = false
    let w = 0
    let h = 0
    const start = performance.now()

    // Cap the backing store at 1.5x. Soft gradients gain nothing visible from
    // a 3x buffer and cost fill rate on exactly the phones that can least
    // afford it.
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)

    const resize = () => {
      const rect = host.getBoundingClientRect()
      w = rect.width
      h = rect.height
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      // Blur proportional to the container. A fixed radius that looks soft in
      // a tall section turns into a hard-edged bar in a short one.
      canvas.style.filter = `blur(${Math.max(16, Math.round(h * 0.10))}px) saturate(116%)`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const frame = (now: number) => {
      raf = running ? requestAnimationFrame(frame) : 0
      if (!h) return

      // Presence peaks while the boundary sits mid-viewport and falls away at
      // both ends, so the veil gathers and clears with the scroll instead of
      // being permanently on.
      const rect = host.getBoundingClientRect()
      const centre = rect.top + rect.height / 2
      const vh = window.innerHeight
      const d = Math.abs(centre - vh / 2) / (vh / 2 + rect.height / 2)
      const presence = Math.max(0, Math.min(1, 1 - d * 1.25))

      draw(ctx, w, h, (now - start) / 1000, presence)
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        // The loop exists only while the veil is on screen. Off screen it is
        // not throttled, it is not running.
        if (entry.isIntersecting && !running) {
          running = true
          resize()
          raf = requestAnimationFrame(frame)
        } else if (!entry.isIntersecting && running) {
          running = false
          if (raf) cancelAnimationFrame(raf)
          raf = 0
          ctx.clearRect(0, 0, w, h)
        }
      },
      { rootMargin: '20% 0px' },
    )
    io.observe(host)

    let resizeFrame = 0
    const onResize = () => {
      if (resizeFrame) return
      resizeFrame = requestAnimationFrame(() => {
        resizeFrame = 0
        if (running) resize()
      })
    }
    window.addEventListener('resize', onResize)

    return () => {
      io.disconnect()
      window.removeEventListener('resize', onResize)
      if (raf) cancelAnimationFrame(raf)
      if (resizeFrame) cancelAnimationFrame(resizeFrame)
    }
  }, [])

  return (
    <div ref={hostRef} className="absolute inset-0">
      <canvas ref={canvasRef} aria-hidden="true" className="h-full w-full" />
    </div>
  )
}

/** The still state: what reduced-motion visitors and stalled videos get. */
function VeilStill() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0"
      style={{
        background:
          'radial-gradient(46% 52% at 34% 46%, color-mix(in oklab, var(--color-gold) 20%, transparent), transparent 72%),' +
          'radial-gradient(40% 44% at 68% 58%, color-mix(in oklab, var(--color-rose) 15%, transparent), transparent 72%)',
      }}
    />
  )
}

export function LiquidVeil() {
  const reduced = usePrefersReducedMotion()

  return (
    <div
      // Pulled up into the section above so the veil emerges from the work
      // rather than sitting in a gap of its own making. The exact pull is set
      // by where the hairline lands: it has to sit at the midpoint between the
      // last photograph and the Services eyebrow, and the pull is what moves
      // it there.
      //
      // max-h is doing real work. Sized in vh alone this block grew with the
      // window, and on a tall desktop 40vh became 540px of near-black smear
      // that read as a hole in the page rather than as a transition. The
      // ribbons need enough room to drift and no more.
      className="relative -mt-12 h-[24vh] max-h-[240px] min-h-[150px] w-full overflow-hidden bg-ink"
      role="presentation"
    >
      {/* Ink at both edges so the veil dissolves into the sections rather than
          butting against them with a seam. Kept to a third of the block —
          at the old 80px they consumed most of a short veil and flattened it. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-14 bg-gradient-to-b from-ink to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-14 bg-gradient-to-t from-ink to-transparent" />

      <Cinematic
        asset={cinematics.liquidVeil}
        className="absolute inset-0"
        fallback={reduced ? <VeilStill /> : <VeilCanvas />}
      />

      {/* The same hairline that divides every other pair of sections, run
          through the middle of the veil. The drift alone gave the eye nothing
          definite to land on; the line makes the boundary legible and the
          light behind it becomes the flourish rather than the whole event. */}
      <div className="pointer-events-none absolute inset-x-0 top-1/2 z-20 -translate-y-1/2 px-5 sm:px-8 lg:px-12">
        {/* Brighter at the centre than the plain `rule-gold` used elsewhere,
            because here it has the veil's own glow to hold its own against. */}
        <div
          className="mx-auto h-px w-full max-w-[84rem]"
          style={{
            background:
              'linear-gradient(90deg, transparent, color-mix(in oklab, var(--color-gold) 45%, transparent) 22%, var(--color-gold-bright) 50%, color-mix(in oklab, var(--color-gold) 45%, transparent) 78%, transparent)',
          }}
        />
      </div>
    </div>
  )
}
