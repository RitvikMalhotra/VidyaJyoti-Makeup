import { useMotion } from '../../lib/motion'
import { StudioImage } from './StudioImage'
import { photos, type PhotoId } from '../../content/photos'

/* -------------------------------------------------------------------------
 * A photograph with dimension.
 *
 * Three planes moving at different rates:
 *
 *   background   the photograph, scaled just past the frame so its edges
 *                never swim into view as it drifts
 *   midground    a light sheen tracking the pointer — what sells the surface
 *                as something with depth rather than a flat card
 *   foreground   a vignette moving against the photograph, holding the
 *                subject visually still while the corners give way
 *
 * The travel is a few pixels on purpose. Push it further and the photograph
 * starts to look manipulated, which is exactly what a makeup artist's
 * portfolio must never look like — these are pictures of real clients on real
 * wedding days. The photograph stays the subject; the depth only makes it
 * feel physical.
 *
 * All of it runs on the shared motion loop, so several of these on a page
 * still cost one requestAnimationFrame. Under prefers-reduced-motion the loop
 * never starts and this renders as a plain, complete photograph.
 * ---------------------------------------------------------------------- */

type Props = {
  photo: PhotoId
  alt: string
  className?: string
  sizes?: string
  ratio?: number
  /** Pixels of pointer travel for the photograph plane. */
  strength?: number
  priority?: boolean
}

export function DepthImage({
  photo,
  alt,
  className = '',
  sizes,
  ratio,
  strength = 13,
  priority = false,
}: Props) {
  // The frame MUST reserve a ratio. Its three planes are all absolutely
  // positioned, so without one the container measures zero high and the
  // photograph never appears — falling back to the manifest is what makes
  // `ratio` an override rather than a requirement.
  const frameRatio = ratio ?? photos[photo].ratio

  const plateRef = useMotion<HTMLDivElement>((el, geom, ctx) => {
    const scrollLift = ((geom.top + geom.height / 2 - ctx.vh / 2) / ctx.vh) * -16
    const x = ctx.px * strength
    const y = ctx.py * strength * 0.6 + scrollLift
    el.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) scale(1.09)`
  })

  const sheenRef = useMotion<HTMLDivElement>((el, _geom, ctx) => {
    el.style.transform = `translate3d(${(ctx.px * -26).toFixed(2)}px, ${(
      ctx.py * -18
    ).toFixed(2)}px, 0)`
    // Light strikes the surface from wherever the pointer is.
    el.style.opacity = String(0.1 + Math.abs(ctx.px) * 0.1)
  })

  const vignetteRef = useMotion<HTMLDivElement>((el, _geom, ctx) => {
    el.style.transform = `translate3d(${(ctx.px * -7).toFixed(2)}px, ${(
      ctx.py * -5
    ).toFixed(2)}px, 0) scale(1.05)`
  })

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ aspectRatio: String(frameRatio) }}
    >
      <div ref={plateRef} className="absolute inset-0">
        <StudioImage
          photo={photo}
          alt={alt}
          ratio={frameRatio}
          sizes={sizes}
          priority={priority}
          className="h-full w-full"
        />
      </div>

      <div
        ref={sheenRef}
        aria-hidden="true"
        className="pointer-events-none absolute -inset-8 opacity-10 mix-blend-screen"
        style={{
          background:
            'linear-gradient(115deg, transparent 34%, color-mix(in oklab, var(--color-gold-bright) 60%, transparent) 50%, transparent 66%)',
        }}
      />

      <div
        ref={vignetteRef}
        aria-hidden="true"
        className="pointer-events-none absolute -inset-4"
        style={{
          background:
            'radial-gradient(80% 70% at 50% 45%, transparent 58%, color-mix(in oklab, var(--color-ink) 62%, transparent) 100%)',
        }}
      />
    </div>
  )
}
