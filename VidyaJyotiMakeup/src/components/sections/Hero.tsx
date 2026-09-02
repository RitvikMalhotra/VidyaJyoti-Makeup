import { business, whatsappLink } from '../../content/business'
import { cinematics } from '../../content/media'
import { Cinematic } from '../ui/Cinematic'
import { StudioImage } from '../ui/StudioImage'
import { Reveal, RevealLines } from '../ui/Reveal'
import { PrimaryAction, GhostAction } from '../ui/Actions'
import { WhatsAppIcon } from '../ui/Icons'
import { useMotion } from '../../lib/motion'

/* -------------------------------------------------------------------------
 * The first viewport.
 *
 * Its job is to be fast, and to be a photograph. The cinematic loop is
 * layered over a still that is already correct — if the video never arrives,
 * or the visitor is on a phone, or on a metered connection, or has asked for
 * reduced motion, this section is complete without it.
 *
 * The still is not static either: it drifts and scales as the page scrolls,
 * so the frame has life before any video is involved.
 * ---------------------------------------------------------------------- */

function HeroStill({ started }: { started: boolean }) {
  const ref = useMotion<HTMLDivElement>((el, _geom, ctx) => {
    const p = Math.min(1, ctx.y / ctx.vh)
    el.style.transform = `translate3d(0, ${(p * 70).toFixed(2)}px, 0) scale(${(
      1.04 + p * 0.05
    ).toFixed(4)})`
  })

  return (
    // Two wrappers, because they cannot be one. The motion loop writes
    // `transform` on the inner element every frame, so the arrival animation
    // has to live on a separate outer one or the loop overwrites it mid-flight.
    <div
      className={`absolute inset-0 ${
        started
          ? 'animate-[heroArrive_1700ms_cubic-bezier(0.16,1,0.3,1)_both]'
          : 'opacity-0'
      }`}
    >
    <div ref={ref} className="absolute inset-0">
      <StudioImage
        photo="hero"
        alt={`A bride in red silk with temple gold jewellery, makeup by ${business.name}`}
        priority
        sizes="100vw"
        fill
        // The bride sits right of centre in the frame, which leaves the
        // left-hand gradient of the backdrop free for the headline.
        position="72% 22%"
        className="h-full w-full"
      />
    </div>
    </div>
  )
}

export function Hero({ started }: { started: boolean }) {
  return (
    <section id="top" className="relative min-h-[100svh] w-full overflow-hidden">
      <Cinematic
        asset={cinematics.hero}
        priority
        fallback={<HeroStill started={started} />}
        className="absolute inset-0"
      >
        {/* Three scrims. One seats the type, one closes the bottom edge into
            the section below, one deepens the very top behind the nav. */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink via-ink/70 to-transparent md:via-ink/45" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-ink via-ink/70 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-ink/80 to-transparent" />
      </Cinematic>

      <div className="relative flex min-h-[100svh] items-end px-5 pb-24 pt-32 sm:px-8 sm:pb-28 lg:px-12">
        <div className="mx-auto w-full max-w-[84rem]">
          <Reveal enabled={started}>
            <p className="eyebrow flex flex-wrap items-center gap-x-3 gap-y-2">
              {business.role}
              <span className="rule-gold h-px w-12" />
              {business.city}
            </p>
          </Reveal>

          <h1 className="display-xl mt-7 text-ivory">
            <RevealLines
              enabled={started}
              delay={140}
              step={100}
              lines={[
                'Still',
                <span key="y" className="foil italic">
                  yourself.
                </span>,
                'Only lit from within.',
              ]}
            />
          </h1>

          <Reveal enabled={started} delay={620}>
            <p className="body-lg mt-9 max-w-lg text-pretty">
              Bridal makeup built on your own skin — consulted first, trialled
              early, and made to hold from the morning ceremony to the last
              photograph of the night.
            </p>
          </Reveal>

          <Reveal enabled={started} delay={740}>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <PrimaryAction href={whatsappLink()} external icon={<WhatsAppIcon />}>
                Check my date
              </PrimaryAction>
              <GhostAction href="#work">See the work</GhostAction>
            </div>
          </Reveal>
        </div>
      </div>

      {/* Scroll cue. Decorative, so hidden from assistive tech. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-7 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 md:flex"
      >
        <span className="text-[0.58rem] uppercase tracking-[0.32em] text-ivory/35">
          Scroll
        </span>
        <span className="h-12 w-px overflow-hidden bg-ivory/12">
          <span className="block h-1/2 w-full animate-[cue_2.6s_ease-in-out_infinite] bg-gold" />
        </span>
      </div>
    </section>
  )
}
