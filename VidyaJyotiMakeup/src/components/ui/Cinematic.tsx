import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { sourcesFor, type CinematicAsset } from '../../content/media'
import { usePrefersReducedMotion, useIsMobile, useSaveData } from '../../lib/hooks'
import { claimPlayback, releasePlayback, tryPlay } from '../../lib/video'

/* -------------------------------------------------------------------------
 * A cinematic clip, or the still frame that stands in for it.
 *
 * This component is where "Higgsfield is a creative tool, not a dependency"
 * is actually enforced. It refuses to load video when ANY of these hold:
 *
 *   - the asset has not been rendered yet (available: false)
 *   - the visitor asked for reduced motion
 *   - the connection is metered or slow
 *   - we are on a phone and the caller did not explicitly allow it
 *
 * In every one of those cases `fallback` renders instead and not one byte of
 * video is requested. The clip is an enhancement on top of a page that was
 * already finished.
 *
 * When video does load it is muted, inline, looping and lazy, it never
 * preloads anything but the hero, and it holds the single playback slot from
 * lib/video so two clips can never run at once.
 * ---------------------------------------------------------------------- */

type Props = {
  asset: CinematicAsset
  /** Always rendered underneath. Stays visible until the video is painting. */
  fallback: ReactNode
  className?: string
  /** The hero is the only asset allowed to preload and to outrank others. */
  priority?: boolean
  /** Permit playback on phones. Off by default — the brief's mobile rule. */
  allowOnMobile?: boolean
  /** Sits above the video: gradients, scrims, anything that must not tint the poster. */
  children?: ReactNode
}

export function Cinematic({
  asset,
  fallback,
  className = '',
  priority = false,
  allowOnMobile = false,
  children,
}: Props) {
  const reduced = usePrefersReducedMotion()
  const isMobile = useIsMobile()
  const saveData = useSaveData()
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const hostRef = useRef<HTMLDivElement | null>(null)
  const [painting, setPainting] = useState(false)

  const sources = sourcesFor(asset)
  const allowed =
    sources !== null && !reduced && !saveData && (!isMobile || allowOnMobile)

  useEffect(() => {
    if (!allowed) return
    const host = hostRef.current
    const video = videoRef.current
    if (!host || !video) return

    // Playback follows visibility: claim the slot on the way in, release it on
    // the way out. Scrolling the page therefore hands one player along rather
    // than leaving four of them running behind you.
    if (typeof IntersectionObserver === 'undefined') return

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (claimPlayback(video, priority ? 10 : 0)) void tryPlay(video)
        } else {
          video.pause()
          releasePlayback(video)
        }
      },
      { rootMargin: '10% 0px', threshold: 0.01 },
    )
    io.observe(host)

    return () => {
      io.disconnect()
      video.pause()
      releasePlayback(video)
    }
  }, [allowed, priority])

  return (
    // No position utility of its own. Every call site places this layer
    // itself, and a hardcoded `relative` here would silently beat their
    // `absolute`: Tailwind emits .relative after .absolute, so the cascade
    // picks the later rule regardless of the order in the class attribute.
    <div ref={hostRef} className={`overflow-hidden ${className}`}>
      {/* The fallback is not swapped out — it is covered. If the video stalls
          mid-scroll there is always a finished image underneath it. */}
      <div className="absolute inset-0">{fallback}</div>

      {allowed && (
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          // A cinematic loop is decoration; announcing it to a screen reader
          // would just be noise between the headline and the enquiry link.
          aria-hidden="true"
          tabIndex={-1}
          preload={priority ? 'auto' : 'none'}
          poster={asset.poster ?? undefined}
          onPlaying={() => setPainting(true)}
          onError={() => setPainting(false)}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1600ms] ease-out ${
            painting ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {sources.map((s) => (
            <source key={s.src} src={s.src} type={s.type} />
          ))}
        </video>
      )}

      {children}
    </div>
  )
}
