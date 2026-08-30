import { useState } from 'react'
import { services } from '../../content/images'
import { whatsappHref } from '../../content/business'
import { StudioImage } from '../ui/StudioImage'
import { Reveal } from '../ui/Reveal'
import { SectionHead } from '../ui/SectionHead'
import { Ticker } from '../ui/Ticker'
import { ArrowIcon, WhatsAppIcon } from '../ui/Icons'

const enquiry = (what: string) =>
  whatsappHref(`Hello S.L.N. Digital Studio, I'd like to enquire about ${what}.`)

const TICKER_WORDS = [
  'Weddings',
  'Birthdays',
  'Ceremonies',
  'Portraits',
  'Albums',
  'Videography',
  'Passport photos',
]

/**
 * Occasions, presented as one editorial list against a single sticky frame.
 * Hovering a line changes the photograph, so the section stays picture-led
 * without becoming a grid of identical cards.
 */
export function Services() {
  const [active, setActive] = useState(0)

  return (
    <section id="services" className="room relative">
      {/* Drifting band of occasions — introduces the section and reacts to scroll. */}
      <div className="border-y border-rule py-6 text-fg lg:py-8">
        <Ticker items={TICKER_WORDS} />
      </div>

      <div className="mx-auto w-full max-w-[1560px] px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
        <SectionHead
          index="03"
          label="What we photograph"
          title={'Every occasion,\nproperly covered.'}
          intro="From a wedding that runs across several days to a passport photograph on a weekday morning — the same studio, the same care."
        />

        {/* ---------------- Desktop: stage + list ---------------- */}
        <div className="mt-16 hidden gap-16 lg:mt-20 lg:grid lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="sticky top-28">
              <Reveal curtain className="relative aspect-[3/4] w-full overflow-hidden">
                {services.map((service, i) => (
                  <div
                    key={service.id}
                    aria-hidden={active !== i}
                    className={`absolute inset-0 transition-all duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      active === i ? 'scale-100 opacity-100' : 'scale-[1.05] opacity-0'
                    }`}
                  >
                    <StudioImage photo={service.photo} fill sizes="38vw" />
                  </div>
                ))}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(to top, rgba(23,19,16,0.82) 0%, transparent 46%)',
                  }}
                />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6">
                  <p className="font-display text-2xl text-fg">{services[active].title}</p>
                  <p className="font-sans text-[0.7rem] font-semibold text-accent-2">
                    {String(active + 1).padStart(2, '0')}
                    <span className="mx-1 text-fg-3">/</span>
                    <span className="text-fg-3">
                      {String(services.length).padStart(2, '0')}
                    </span>
                  </p>
                </div>
              </Reveal>
            </div>
          </div>

          <div className="lg:col-span-7">
            <ul className="border-t border-rule">
              {services.map((service, i) => (
                <li key={service.id}>
                  <div
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    data-active={active === i}
                    className="group/row relative border-b border-rule py-7 transition-colors duration-500"
                  >
                    {/* Vermillion rule that grows across the active row. */}
                    <span
                      aria-hidden
                      className="absolute inset-x-0 bottom-[-1px] h-px origin-left scale-x-0 bg-accent transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/row:scale-x-100"
                    />
                    <div className="flex items-start gap-6 px-1">
                      <span className="mt-2.5 w-6 shrink-0 font-sans text-[0.7rem] font-semibold text-fg-3 transition-colors duration-400 group-hover/row:text-accent-2">
                        {String(i + 1).padStart(2, '0')}
                      </span>

                      <div className="min-w-0 flex-1">
                        <h3 className="display-sm text-fg transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/row:translate-x-2">
                          {service.title}
                        </h3>
                        <p className="body-base mt-2 max-w-md">{service.blurb}</p>

                        <a
                          href={enquiry(service.enquiry)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-4 inline-flex items-center gap-2 text-[0.8rem] font-semibold text-fg-3 transition-colors duration-400 hover:text-accent-2"
                        >
                          <WhatsAppIcon className="h-3.5 w-3.5" />
                          Enquire
                          <ArrowIcon className="h-3.5 w-3.5 transition-transform duration-500 group-hover/row:translate-x-1" />
                        </a>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ---------------- Mobile: stacked, picture first ---------------- */}
        <div className="mt-14 lg:hidden">
          {services.map((service, i) => (
            <Reveal
              key={service.id}
              delay={40}
              className={`border-t border-rule py-8 ${
                i === services.length - 1 ? 'border-b' : ''
              }`}
            >
              <div className="group relative overflow-hidden">
                <StudioImage
                  photo={service.photo}
                  ratio={4 / 3}
                  zoom
                  compact
                  parallax={26}
                  sizes="92vw"
                  className="w-full"
                />
              </div>

              <div className="mt-5 flex items-baseline gap-4">
                <span className="font-sans text-[0.7rem] font-semibold text-accent-2">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="display-sm text-fg">{service.title}</h3>
              </div>

              <p className="body-base mt-3">{service.blurb}</p>

              <a
                href={enquiry(service.enquiry)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline-light mt-5 px-5 py-3 text-[0.8rem]"
              >
                <WhatsAppIcon className="h-3.5 w-3.5" />
                <span>Enquire on WhatsApp</span>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
