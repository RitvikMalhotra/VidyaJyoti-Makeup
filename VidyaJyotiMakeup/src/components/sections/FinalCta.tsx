import { business, whatsappLink } from '../../content/business'
import { Reveal, RevealLines } from '../ui/Reveal'
import { PrimaryAction, GhostAction } from '../ui/Actions'
import { WhatsAppIcon } from '../ui/Icons'
import { useMotion } from '../../lib/motion'

export function FinalCta() {
  // The closing block drifts slightly slower than the page, so the section
  // settles into place rather than arriving with it.
  const ref = useMotion<HTMLDivElement>((el, geom, ctx) => {
    const p = Math.max(-1, Math.min(1, (geom.top - ctx.vh * 0.5) / ctx.vh))
    el.style.transform = `translate3d(0, ${(p * 30).toFixed(2)}px, 0)`
  })

  return (
    <section className="relative overflow-hidden px-5 py-28 text-center sm:px-8 md:py-40">
      <div className="mx-auto w-full max-w-4xl">
        <div ref={ref}>
          <Reveal>
            <p className="eyebrow">{business.serviceArea}</p>
          </Reveal>

          <h2 className="display-lg mt-8 text-balance text-ivory">
            <RevealLines
              delay={100}
              lines={[
                'One date, one face,',
                <span key="m" className="foil italic">
                  one morning
                </span>,
                'to get it right.',
              ]}
            />
          </h2>

          <Reveal delay={420}>
            <p className="body-lg mx-auto mt-8 max-w-xl text-pretty">
              Send your date and she will tell you straight away whether it is
              free. Dates around the main season go early.
            </p>
          </Reveal>

          <Reveal delay={520}>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <PrimaryAction href={whatsappLink()} external icon={<WhatsAppIcon />}>
                Check my date
              </PrimaryAction>
              <GhostAction href="#work">See the work again</GhostAction>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
