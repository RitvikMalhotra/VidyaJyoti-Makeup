import { business, wa } from '../../content/business'
import { hasPhoto, hero } from '../../content/images'
import { useScrollBind } from '../../lib/scroll'
import { StudioImage } from '../ui/StudioImage'
import { Reveal } from '../ui/Reveal'
import { SplitText } from '../ui/SplitText'
import { StarIcon, WhatsAppIcon } from '../ui/Icons'

export function Hero({ started }: { started: boolean }) {
  const awaitingPhoto = !hasPhoto(hero.id)

  // The whole block drifts up and dissolves as the page leaves the hero.
  const contentRef = useScrollBind<HTMLDivElement>((el, rect, ctx) => {
    const p = Math.min(1, Math.max(0, -rect.top / (ctx.vh * 0.75)))
    el.style.transform = `translate3d(0, ${(-p * 70).toFixed(1)}px, 0)`
    el.style.opacity = String(1 - p * 0.9)
  })

  return (
    <section
      id="top"
      className="room relative isolate flex min-h-[100svh] w-full flex-col justify-end overflow-hidden"
    >
      <div className="absolute inset-0 -z-10">
        <StudioImage
          photo={hero}
          fill
          priority
          variant="backdrop"
          parallax={120}
          sizes="100vw"
          position="50% 45%"
        />
      </div>

      {/* Legibility scrims, weighted to the bottom-left where the type sits. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            'linear-gradient(to top, rgba(23,19,16,0.95) 0%, rgba(23,19,16,0.62) 34%, rgba(23,19,16,0.2) 64%, rgba(23,19,16,0.6) 100%)',
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 hidden lg:block"
        style={{
          background:
            'linear-gradient(to right, rgba(23,19,16,0.78) 0%, rgba(23,19,16,0.3) 40%, transparent 64%)',
        }}
      />

      <div
        ref={contentRef}
        className="relative mx-auto w-full max-w-[1560px] px-5 pt-28 pb-16 sm:px-8 lg:px-12 lg:pt-32 lg:pb-20"
      >
        <div className="max-w-4xl">
          <Reveal active={started} delay={60} y={12} className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <span className="label">{business.category}</span>
            <span className="h-3 w-px bg-fg/25" aria-hidden />
            <span className="flex items-center gap-1.5 text-[0.78rem] font-medium text-fg-2">
              <StarIcon className="h-3.5 w-3.5 text-accent-2" />
              {business.rating.value} · {business.rating.countDisplay} Google reviews
            </span>
            {/* Drops on the narrowest screens, where it would wrap to its own
                line and leave the divider stranded. */}
            <span className="hidden h-3 w-px bg-fg/25 sm:block" aria-hidden />
            <span className="hidden text-[0.78rem] font-medium text-fg-3 sm:block">
              {business.locality}
            </span>
          </Reveal>

          <SplitText
            as="h1"
            active={started}
            text={'Your moments.\nBeautifully remembered.'}
            mark="remembered."
            delay={180}
            stagger={70}
            className="display-xl mt-7 lg:mt-9"
          />

          <Reveal active={started} delay={620} y={16} className="mt-8 max-w-xl lg:mt-10">
            <p className="body-lg text-fg-2">
              Photography and visual storytelling for life&rsquo;s most meaningful occasions.
            </p>
          </Reveal>

          <Reveal
            active={started}
            delay={720}
            y={16}
            className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center lg:mt-11"
          >
            <a href="#portfolio" className="btn btn-solid w-full sm:w-auto">
              <span>View our work</span>
            </a>
            <a href="#enquire" className="btn btn-outline-light w-full sm:w-auto">
              <span>Book a shoot</span>
            </a>
            <a
              href={wa.general}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 hidden items-center gap-2.5 pl-2 text-[0.82rem] text-fg-2 transition-colors duration-400 hover:text-accent-2 sm:mt-0 sm:inline-flex"
            >
              <WhatsAppIcon className="h-4 w-4 text-accent-2" />
              <span className="link-draw">or message us on WhatsApp</span>
            </a>
          </Reveal>

          {awaitingPhoto && (
            <Reveal active={started} delay={900} y={10} className="mt-10 flex items-center gap-2.5">
              <span className="h-px w-5 bg-accent" aria-hidden />
              <span className="font-mono text-[0.6rem] text-fg-3">
                {hero.id}.jpg — studio photograph to be placed here
              </span>
            </Reveal>
          )}
        </div>
      </div>

      <div className="pointer-events-none absolute right-8 bottom-10 hidden items-center gap-3 lg:flex">
        <span className="text-[0.6rem] font-semibold tracking-[0.24em] text-fg-3 uppercase">
          Scroll
        </span>
        <span className="relative block h-12 w-px overflow-hidden bg-fg/20">
          <span
            className="absolute inset-x-0 top-0 h-4 bg-accent"
            style={{ animation: 'scroll-hint 2.4s ease-in-out infinite' }}
          />
        </span>
      </div>
    </section>
  )
}
