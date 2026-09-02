import { Fragment, useMemo, useState } from 'react'
import {
  frames,
  categories,
  ratioOf,
  type Category,
  type Frame,
} from '../../content/portfolio'
import { Section, SectionHead } from '../ui/SectionHead'
import { StudioImage } from '../ui/StudioImage'
import { DepthImage } from '../ui/DepthImage'
import { Cinematic } from '../ui/Cinematic'
import { Reveal } from '../ui/Reveal'
import { Lightbox } from '../ui/Lightbox'
import { useParallax, useMotion } from '../../lib/motion'

/* -------------------------------------------------------------------------
 * The work.
 *
 * Fifteen photographs from Vidya Jyoti's lookbook, in an editorial two-column
 * grid with a filter across the top. Two treatments are used sparingly and
 * the reasons are in content/portfolio.ts, next to the flags that switch them
 * on: depth on three frames, a cinematic wipe on two.
 * ---------------------------------------------------------------------- */

/** Sizes hint per cell. Wrong values here are how a grid quietly downloads
    four times the pixels it needs, so both layouts are stated explicitly.
 
    The final entry is a pixel value, not a vw: past 1056px the section's
    60rem measure has capped, so the cells stop growing with the viewport and
    any vw figure would over-request from there on. */
const CELL_SIZES = '(max-width: 639px) 100vw, (max-width: 1055px) 46vw, 460px'
const WIDE_SIZES = '(max-width: 639px) 100vw, (max-width: 1055px) 94vw, 960px'

/** The fallback wipe: silk crossing the frame, driven by scroll position. */
function SilkSweep() {
  const ref = useMotion<HTMLDivElement>((el, geom, ctx) => {
    // 0 as the band enters at the bottom, 1 as it leaves at the top — so the
    // sweep is scrubbed by the reader rather than autoplaying on a timer.
    const p = 1 - (geom.top + geom.height) / (ctx.vh + geom.height)
    el.style.transform = `translate3d(${((p - 0.5) * 170).toFixed(2)}%, 0, 0) skewX(-14deg)`
    el.style.opacity = String(Math.sin(Math.max(0, Math.min(1, p)) * Math.PI) * 0.85)
  })

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div
        ref={ref}
        className="absolute -inset-y-10 left-0 w-[65%] [filter:blur(30px)]"
        style={{
          background:
            'linear-gradient(90deg, transparent, color-mix(in oklab, var(--color-blush) 42%, transparent) 34%, color-mix(in oklab, var(--color-gold-bright) 58%, transparent) 58%, transparent)',
        }}
      />
    </div>
  )
}

function FlowBreak({ frame }: { frame: Frame }) {
  if (!frame.transition) return null

  return (
    <div
      role="presentation"
      className="relative col-span-full my-1 h-[14vh] min-h-[96px] w-full overflow-hidden"
    >
      <Cinematic
        asset={frame.transition}
        className="absolute inset-0"
        fallback={<SilkSweep />}
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-ink to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-ink to-transparent" />
    </div>
  )
}

function Tile({
  frame,
  index,
  onOpen,
}: {
  frame: Frame
  index: number
  onOpen: (id: string) => void
}) {
  // Alternating drift so the two columns never march in lockstep. The wide
  // frame spans both columns, so it gets none.
  const ref = useParallax<HTMLDivElement>(frame.wide ? 0 : index % 2 === 0 ? -24 : 18)
  const ratio = ratioOf(frame)
  const sizes = frame.wide ? WIDE_SIZES : CELL_SIZES

  return (
    <Reveal
      variant="curtain"
      delay={(index % 2) * 90}
      className={`group relative ${frame.wide ? 'sm:col-span-2' : ''}`}
    >
      <div ref={ref}>
        <button
          type="button"
          onClick={() => onOpen(frame.id)}
          className="block w-full cursor-pointer text-left"
        >
          <div className="relative overflow-hidden">
            {frame.depth ? (
              <DepthImage
                photo={frame.photo}
                alt={frame.alt}
                ratio={ratio}
                sizes={sizes}
                className="w-full"
              />
            ) : (
              <StudioImage
                photo={frame.photo}
                alt={frame.alt}
                sizes={sizes}
                className="w-full transition-transform duration-[1400ms] ease-out group-hover:scale-[1.035]"
              />
            )}

            {/* Caption plate, revealed on hover and always present for touch
                users underneath the frame. */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 hidden bg-gradient-to-t from-ink/90 via-ink/40 to-transparent p-5 opacity-0 transition-opacity duration-500 group-hover:opacity-100 sm:block">
              <p className="font-display text-xl text-ivory">{frame.caption}</p>
              <p className="eyebrow mt-1 text-[0.58rem]">{frame.category}</p>
            </div>
          </div>

          <div className="mt-3 flex items-baseline justify-between gap-4 sm:hidden">
            <span className="text-sm tracking-wide text-ivory/70">{frame.caption}</span>
            <span className="eyebrow shrink-0 text-[0.55rem] text-gold/50">
              {frame.category}
            </span>
          </div>
        </button>
      </div>
    </Reveal>
  )
}

export function Portfolio() {
  const [filter, setFilter] = useState<Category | 'All'>('All')
  const [openId, setOpenId] = useState<string | null>(null)

  const shown = useMemo(
    () => (filter === 'All' ? frames : frames.filter((f) => f.category === filter)),
    [filter],
  )

  // The lightbox walks whatever is currently on screen, not the full set —
  // arrowing out of the filter you chose is disorienting.
  const openIndex = openId ? shown.findIndex((f) => f.id === openId) : -1

  return (
    // A narrower measure than the rest of the page, purely to bring the
    // photographs down in scale. The section head is capped at max-w-3xl,
    // well inside this, so only the grid moves — and it keeps the container's
    // left edge, so the tiles stay aligned with the headline above them.
    <Section id="work" measure="max-w-[60rem]">
      <SectionHead
        eyebrow="Selected work"
        title="Faces, on the days that mattered to them."
        intro="Photographed in the studio and on the day. The looks below run from full South Indian bridal through to editorial — every one of them built on a skin consultation first."
      />

      <div className="mt-10 flex flex-wrap items-center gap-2 md:mt-12">
        {(['All', ...categories] as const).map((c) => {
          const active = filter === c
          return (
            <button
              key={c}
              type="button"
              onClick={() => {
                setFilter(c)
                setOpenId(null)
              }}
              aria-pressed={active}
              className={`rounded-full border px-5 py-2.5 text-[0.68rem] uppercase tracking-[0.2em] transition-colors duration-300 ${
                active
                  ? 'border-gold bg-gold text-ink'
                  : 'border-ink-line text-ivory/60 hover:border-gold/60 hover:text-ivory'
              }`}
            >
              {c}
            </button>
          )
        })}
      </div>

      <div className="mt-12 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 md:gap-x-10">
        {shown.map((frame, i) => (
          // A Fragment rather than a wrapper: the break and the tile are
          // siblings in the grid, and a div around them would take a cell.
          <Fragment key={frame.id}>
            {frame.transition && filter === 'All' && <FlowBreak frame={frame} />}
            <Tile frame={frame} index={i} onOpen={setOpenId} />
          </Fragment>
        ))}
      </div>

      <Lightbox
        frames={shown}
        index={openIndex >= 0 ? openIndex : null}
        onClose={() => setOpenId(null)}
        onIndex={(i) => setOpenId(shown[i].id)}
      />
    </Section>
  )
}
