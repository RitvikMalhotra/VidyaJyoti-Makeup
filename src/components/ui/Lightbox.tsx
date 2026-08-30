import { useCallback, useEffect, useRef } from 'react'
import type { Photo } from '../../content/images'
import { useBodyLock, useSwipe } from '../../lib/hooks'
import { StudioImage } from './StudioImage'
import { ChevronIcon, CloseIcon } from './Icons'

type Props = {
  photos: Photo[]
  /** Index of the open photo, or null when closed. */
  index: number | null
  onClose: () => void
  onIndexChange: (next: number) => void
}

/**
 * Fullscreen viewer. Wraps around at both ends, supports Escape and arrow
 * keys, and swipes horizontally on touch.
 */
export function Lightbox({ photos, index, onClose, onIndexChange }: Props) {
  const open = index !== null
  const dialogRef = useRef<HTMLDivElement>(null)
  const restoreFocus = useRef<HTMLElement | null>(null)

  useBodyLock(open)

  const go = useCallback(
    (delta: number) => {
      if (index === null || photos.length === 0) return
      onIndexChange((index + delta + photos.length) % photos.length)
    },
    [index, photos.length, onIndexChange],
  )

  const next = useCallback(() => go(1), [go])
  const prev = useCallback(() => go(-1), [go])
  const swipe = useSwipe(next, prev)

  useEffect(() => {
    if (!open) return
    restoreFocus.current = document.activeElement as HTMLElement | null
    dialogRef.current?.focus()

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowRight') next()
      else if (e.key === 'ArrowLeft') prev()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      restoreFocus.current?.focus?.()
    }
  }, [open, onClose, next, prev])

  const photo = index === null ? null : photos[index]

  return (
    <div
      className={`fixed inset-0 z-[80] transition-opacity duration-400 ${
        open ? 'opacity-100' : 'pointer-events-none opacity-0'
      }`}
      aria-hidden={!open}
    >
      <div className="absolute inset-0 bg-deep" onClick={onClose} />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal={open}
        aria-label="Photograph viewer"
        tabIndex={-1}
        className="room relative flex h-full w-full flex-col outline-none"
        {...swipe}
      >
        {/* Top bar */}
        <div className="flex shrink-0 items-center justify-between px-5 py-4 sm:px-8">
          <p className="font-mono text-[0.68rem] tracking-[0.18em] text-fg-3">
            {index !== null ? String(index + 1).padStart(2, '0') : '00'}
            <span className="mx-1.5 text-fg-3/60">/</span>
            {String(photos.length).padStart(2, '0')}
          </p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close viewer"
            className="-mr-2 flex h-11 w-11 items-center justify-center text-fg-2 transition-colors duration-300 hover:text-accent-2"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Stage */}
        <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 sm:px-16 lg:px-24">
          <button
            type="button"
            onClick={prev}
            aria-label="Previous photograph"
            className="absolute left-1 z-10 hidden h-12 w-12 items-center justify-center text-fg-2 transition-colors duration-300 hover:text-accent-2 sm:flex lg:left-6"
          >
            <ChevronIcon className="h-7 w-7" />
          </button>

          {photo && (
            <figure key={photo.id} className="flex w-full max-h-full flex-col items-center">
              {/*
                Width is whichever is smaller: the available width, or the width
                the height budget allows at this photograph's ratio. The frame
                then never collapses and never overflows.
              */}
              <div
                className="relative overflow-hidden"
                style={{
                  width: `min(100%, calc(66vh * ${photo.ratio}))`,
                  aspectRatio: String(photo.ratio),
                  animation: 'fade-in 0.5s cubic-bezier(0.22,1,0.36,1)',
                }}
              >
                <StudioImage photo={photo} fill fit="contain" sizes="90vw" priority />
              </div>
              <figcaption className="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-center">
                <span className="label">{photo.category ?? 'Studio'}</span>
                <span className="h-3 w-px bg-rule" aria-hidden />
                <span className="font-display text-lg text-fg">{photo.label}</span>
              </figcaption>
            </figure>
          )}

          <button
            type="button"
            onClick={next}
            aria-label="Next photograph"
            className="absolute right-1 z-10 hidden h-12 w-12 items-center justify-center text-fg-2 transition-colors duration-300 hover:text-accent-2 sm:flex lg:right-6"
          >
            <ChevronIcon className="h-7 w-7 rotate-180" />
          </button>
        </div>

        {/* Bottom rail */}
        <div className="shrink-0 px-5 py-5 text-center sm:px-8">
          <p className="meta">
            <span className="hidden sm:inline">Use arrow keys, or </span>
            <span className="sm:hidden">Swipe, or </span>
            press Esc to close
          </p>
        </div>
      </div>
    </div>
  )
}
