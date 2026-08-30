import { useState } from 'react'
import { photoSrc, type Photo } from '../../content/images'
import { useParallax } from '../../lib/scroll'

/**
 * Renders a studio photograph, or — while that slot is still empty — a
 * reserved frame printed with the slot name and its art-direction brief.
 *
 * The reserved frame is deliberately not a picture. We never fill a gap with
 * stock photography, because everything shown here should be work the studio
 * actually shot. It is toned like photographic paper rather than left as a
 * dead grey box, so the page still reads as designed before the files land.
 */

type Props = {
  photo: Photo
  className?: string
  /** Stretch to a positioned parent instead of holding its own ratio. */
  fill?: boolean
  /** Override the manifest ratio (width / height). */
  ratio?: number
  /** Scale slightly when an ancestor with `group` is hovered. */
  zoom?: boolean
  /** Drift within the frame as the page scrolls. Pixels of total travel. */
  parallax?: number
  priority?: boolean
  sizes?: string
  position?: string
  compact?: boolean
  fit?: 'cover' | 'contain'
  /** 'plate' prints the brief; 'backdrop' stays silent behind type. */
  variant?: 'plate' | 'backdrop'
}

/* FNV-1a — a stable, tiny hash so each frame gets its own consistent tone. */
function hash(input: string): number {
  let h = 2166136261
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return Math.abs(h)
}

/**
 * Warm tones, varied per slot but never far apart. Reserved frames are toned
 * like photographic paper; full-bleed backdrops are toned like the dark room
 * they sit in, since headline type has to stay readable over them.
 */
function plateStyle(id: string, dark: boolean): React.CSSProperties {
  const h = hash(id)
  const x = 20 + (h % 58)
  const y = 16 + ((h >> 7) % 60)
  const angle = 115 + ((h >> 13) % 130)

  const stops = dark
    ? [
        `radial-gradient(110% 82% at ${x}% ${y}%, rgba(212,89,46,0.20), transparent 60%)`,
        `radial-gradient(90% 74% at ${100 - x}% ${100 - y}%, rgba(140,112,82,0.22), transparent 62%)`,
        `linear-gradient(${angle}deg, #241a13 0%, #0d0a08 55%, #181109 100%)`,
      ]
    : [
        `radial-gradient(110% 82% at ${x}% ${y}%, rgba(212,89,46,0.17), transparent 62%)`,
        `radial-gradient(88% 72% at ${100 - x}% ${100 - y}%, rgba(18,14,11,0.30), transparent 60%)`,
        `linear-gradient(${angle}deg, #a2947c 0%, #7e7159 52%, #91846c 100%)`,
      ]

  return { backgroundImage: stops.join(',') }
}

export function StudioImage({
  photo,
  className = '',
  fill = false,
  ratio,
  zoom = false,
  parallax = 0,
  priority = false,
  sizes = '100vw',
  position = '50% 50%',
  compact = false,
  fit = 'cover',
  variant = 'plate',
}: Props) {
  const src = photoSrc(photo.id)
  const [loaded, setLoaded] = useState(false)
  const driftRef = useParallax<HTMLDivElement>(parallax)

  const frameClass = [
    'frame relative overflow-hidden bg-surface-3',
    fill ? 'absolute inset-0 h-full w-full' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const frameStyle: React.CSSProperties = fill
    ? {}
    : { aspectRatio: String(ratio ?? photo.ratio) }

  const motion = zoom
    ? 'transition-transform duration-[1.5s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]'
    : ''

  if (src) {
    const img = (
      <img
        src={src}
        alt={photo.alt}
        sizes={sizes}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding="async"
        onLoad={() => setLoaded(true)}
        style={{ objectPosition: position }}
        className={`h-full w-full ${
          fit === 'contain' ? 'object-contain' : 'object-cover'
        } ${motion} transition-opacity duration-700 ${loaded ? 'opacity-100' : 'opacity-0'}`}
      />
    )

    return (
      <div className={frameClass} style={frameStyle}>
        {parallax ? (
          <div ref={driftRef} className="parallax-media">
            {img}
          </div>
        ) : (
          img
        )}
      </div>
    )
  }

  if (variant === 'backdrop') {
    return (
      <div className={`${frameClass} plate-grain`} style={frameStyle} aria-hidden>
        <div
          ref={parallax ? driftRef : undefined}
          className={parallax ? 'parallax-media' : 'absolute inset-0'}
          style={plateStyle(photo.id, true)}
        />
      </div>
    )
  }

  return (
    <div
      className={`${frameClass} plate-grain`}
      style={frameStyle}
      role="img"
      aria-label={`Photograph placeholder — ${photo.label}. ${photo.alt}`}
    >
      <div
        ref={parallax ? driftRef : undefined}
        className={parallax ? 'parallax-media' : 'absolute inset-0'}
        style={plateStyle(photo.id, false)}
      />

      <div className={`absolute inset-0 ${motion}`}>
        {/* Crop marks — a reserved frame, drawn the way a contact sheet is. */}
        <div className="pointer-events-none absolute inset-[6.5%]">
          {(
            [
              'left-0 top-0 border-l border-t',
              'right-0 top-0 border-r border-t',
              'left-0 bottom-0 border-l border-b',
              'right-0 bottom-0 border-r border-b',
            ] as const
          ).map((pos) => (
            <span key={pos} className={`absolute h-5 w-5 border-plate-ink/30 ${pos}`} aria-hidden />
          ))}
        </div>

        <div className="absolute inset-0 flex flex-col items-center justify-center px-5 text-center">
          <span className="mb-2.5 block h-1.5 w-1.5 rounded-full bg-accent/70" aria-hidden />
          <span className="text-[0.62rem] font-semibold tracking-[0.15em] text-plate-ink/75 uppercase">
            {photo.label}
          </span>
          {!compact && (
            <p className="mt-2.5 max-w-[26ch] text-[0.68rem] leading-relaxed text-plate-ink/55">
              {photo.brief}
            </p>
          )}
        </div>

        {!compact && (
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 px-3 pb-3">
            <span className="truncate font-mono text-[0.58rem] text-plate-ink/45">
              {photo.id}.jpg
            </span>
            {photo.onListing && (
              <span className="shrink-0 border border-plate-ink/25 px-1.5 py-0.5 font-mono text-[0.52rem] tracking-wider text-plate-ink/50">
                ON LISTING
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
