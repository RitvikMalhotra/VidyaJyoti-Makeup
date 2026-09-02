import { useState } from 'react'
import { photos, srcSet, largest, type PhotoId } from '../../content/photos'

/* -------------------------------------------------------------------------
 * A photograph.
 *
 * The real makeup work is the point of this website, so the frame is built
 * around not getting in its way:
 *
 *  - The blur placeholder is painted as the frame's own background, so a
 *    photograph resolves out of its own colours rather than flashing an empty
 *    box. On a page that is mostly photographs, that difference is the whole
 *    loading experience.
 *  - The aspect ratio is reserved from the manifest before anything decodes,
 *    so nothing on the page shifts as images arrive.
 *  - `sizes` is passed per use-site. Getting it wrong is the single most
 *    common way a responsive image ends up downloading four times the pixels
 *    it needs, so every call site states its real layout width.
 * ---------------------------------------------------------------------- */

type Props = {
  photo: PhotoId
  alt: string
  className?: string
  /** The hero only. Loads eagerly and skips the fade. */
  priority?: boolean
  sizes?: string
  /** Overrides the manifest ratio when a frame is deliberately cropped. */
  ratio?: number
  /** Fill the parent instead of reserving a ratio — for the full-bleed hero. */
  fill?: boolean
  /** Where to anchor the crop when the frame is tighter than the photo. */
  position?: string
}

export function StudioImage({
  photo,
  alt,
  className = '',
  priority = false,
  sizes = '(max-width: 767px) 100vw, 50vw',
  ratio,
  fill = false,
  position = 'center',
}: Props) {
  const p = photos[photo]
  const [loaded, setLoaded] = useState(false)

  return (
    <div
      className={`relative overflow-hidden bg-ink-soft ${className}`}
      style={{
        // A filling frame takes its height from the parent, so reserving a
        // ratio here would fight it.
        aspectRatio: fill ? undefined : String(ratio ?? p.ratio),
        // Painted underneath the real file, scaled up and slightly clipped so
        // the blur's soft edges never show at the frame's border.
        backgroundImage: `url("${p.lqip}")`,
        backgroundSize: 'cover',
        backgroundPosition: position,
      }}
    >
      <img
        src={largest(p)}
        srcSet={srcSet(p)}
        sizes={sizes}
        alt={alt}
        width={p.w}
        height={p.h}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        fetchPriority={priority ? 'high' : 'auto'}
        onLoad={() => setLoaded(true)}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-out ${
          loaded || priority ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ objectPosition: position }}
      />
    </div>
  )
}
