import { useCallback, useEffect, useRef } from 'react'
import { useBodyLock, useSwipe } from '../../lib/hooks'
import { CloseIcon, ArrowIcon } from './Icons'
import { type Frame } from '../../content/portfolio'
import { photos, srcSet, largest } from '../../content/photos'

export function Lightbox({
  frames,
  index,
  onClose,
  onIndex,
}: {
  frames: Frame[]
  index: number | null
  onClose: () => void
  onIndex: (i: number) => void
}) {
  const open = index !== null
  useBodyLock(open)

  const closeRef = useRef<HTMLButtonElement | null>(null)
  const restoreTo = useRef<HTMLElement | null>(null)

  const next = useCallback(() => {
    if (index === null) return
    onIndex((index + 1) % frames.length)
  }, [index, frames.length, onIndex])

  const prev = useCallback(() => {
    if (index === null) return
    onIndex((index - 1 + frames.length) % frames.length)
  }, [index, frames.length, onIndex])

  const swipe = useSwipe(next, prev)

  // Remember what had focus, move focus into the dialog, and put it back on
  // close — otherwise a keyboard user lands back at the top of the document.
  useEffect(() => {
    if (!open) return
    restoreTo.current = document.activeElement as HTMLElement | null
    closeRef.current?.focus()
    return () => restoreTo.current?.focus?.()
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowRight') next()
      else if (e.key === 'ArrowLeft') prev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose, next, prev])

  if (index === null) return null
  const frame = frames[index]

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={frame.caption}
      className="fixed inset-0 z-100 flex flex-col bg-ink/97 backdrop-blur-sm"
      onClick={onClose}
      {...swipe}
    >
      <div className="flex items-center justify-between px-5 py-5 sm:px-8">
        <p className="eyebrow text-gold/70">
          {frame.category} · {index + 1} / {frames.length}
        </p>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="h-9 w-9 rounded-full border border-gold/25 p-2 text-ivory transition-colors hover:border-gold hover:text-gold"
        >
          <CloseIcon />
        </button>
      </div>

      <div
        className="flex min-h-0 flex-1 items-center justify-center px-4 pb-4 sm:px-10"
        onClick={(e) => e.stopPropagation()}
      >
        <figure className="flex max-h-full min-h-0 w-full max-w-3xl flex-col items-center">
          {/* A plain contained image rather than the site's ratio-box frame.
              An aspect-ratio box given only a max-height has no definite
              height to derive its width from, so it collapses; object-contain
              against the viewport is what a lightbox actually wants. */}
          <img
            key={frame.id}
            src={largest(photos[frame.photo])}
            srcSet={srcSet(photos[frame.photo])}
            sizes="(max-width: 900px) 92vw, 760px"
            alt={frame.alt}
            width={photos[frame.photo].w}
            height={photos[frame.photo].h}
            decoding="async"
            className="max-h-[72vh] w-auto max-w-full object-contain"
            style={{
              // The blur sits behind while the full file decodes, so stepping
              // through the set never flashes an empty rectangle.
              backgroundImage: `url("${photos[frame.photo].lqip}")`,
              backgroundSize: 'cover',
            }}
          />
          <figcaption className="mt-4 text-center text-sm tracking-wide text-ivory/60">
            {frame.caption}
          </figcaption>
        </figure>
      </div>

      <div
        className="flex items-center justify-center gap-4 pb-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={prev}
          aria-label="Previous photograph"
          className="h-11 w-11 rotate-180 rounded-full border border-gold/25 p-3 text-ivory transition-colors hover:border-gold hover:text-gold"
        >
          <ArrowIcon />
        </button>
        <button
          type="button"
          onClick={next}
          aria-label="Next photograph"
          className="h-11 w-11 rounded-full border border-gold/25 p-3 text-ivory transition-colors hover:border-gold hover:text-gold"
        >
          <ArrowIcon />
        </button>
      </div>
    </div>
  )
}
