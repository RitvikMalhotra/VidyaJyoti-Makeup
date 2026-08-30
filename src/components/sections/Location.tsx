import {
  business,
  mapsDirectionsHref,
  mapsEmbedSrc,
  mapsSearchHref,
  telHref,
} from '../../content/business'
import { storefront } from '../../content/images'
import { useStudioOpen } from '../../lib/hours'
import { StudioImage } from '../ui/StudioImage'
import { Reveal } from '../ui/Reveal'
import { SplitText } from '../ui/SplitText'
import { ArrowIcon, ClockIcon, PhoneIcon, PinIcon } from '../ui/Icons'

export function Location() {
  const status = useStudioOpen()

  return (
    <section id="contact" className="grain relative bg-surface-2 py-24 lg:py-32">
      <div className="mx-auto w-full max-w-[1560px] px-5 sm:px-8 lg:px-12">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          {/* Details */}
          <div className="lg:col-span-5">
            <Reveal className="flex items-center gap-4 sm:gap-6">
              <span className="chapter-num text-lg">08</span>
              <span className="label">Visit</span>
              <span className="rule hidden flex-1 sm:block" aria-hidden />
            </Reveal>

            <SplitText
              as="h2"
              text={`Come to
the studio.`}
              delay={90}
              className="display-lg mt-6"
            />

            <Reveal delay={160} className="mt-10">
              <p className="font-display text-2xl text-fg">{business.name}</p>
              <address className="mt-4 flex gap-3 not-italic">
                <PinIcon className="mt-1 h-4 w-4 shrink-0 text-accent" />
                <span className="body-base">
                  {business.address.lines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </span>
              </address>
            </Reveal>

            <Reveal delay={220} className="mt-8 space-y-4 border-t border-rule pt-8">
              <div className="flex items-start gap-3">
                <ClockIcon className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <div>
                  <p className="text-[0.95rem] text-fg-2">{business.hours.full}</p>
                  <p className="mt-1.5 flex items-center gap-2">
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        status.open ? 'bg-accent' : 'bg-fg-4'
                      }`}
                      aria-hidden
                    />
                    <span className={`meta font-semibold ${status.open ? 'text-accent' : ''}`}>
                      {status.label}
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <PhoneIcon className="mt-1 h-4 w-4 shrink-0 text-accent" />
                <a
                  href={telHref}
                  className="link-draw font-display text-2xl text-fg transition-colors duration-400 hover:text-accent"
                >
                  {business.phone.display}
                </a>
              </div>
            </Reveal>

            <Reveal delay={280} className="mt-10 flex flex-col gap-3 sm:flex-row">
              <a
                href={mapsDirectionsHref}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-solid"
              >
                <span>Get directions</span>
                <ArrowIcon />
              </a>
              <a
                href={mapsSearchHref}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline"
              >
                <span>View on Maps</span>
              </a>
            </Reveal>
          </div>

          {/* Storefront + map */}
          <div className="lg:col-span-6 lg:col-start-7">
            <Reveal curtain>
              <div className="group overflow-hidden">
                <StudioImage
                  photo={storefront}
                  ratio={16 / 10}
                  zoom
                  parallax={38}
                  sizes="(max-width: 1024px) 92vw, 46vw"
                  className="w-full"
                />
              </div>
            </Reveal>

            <Reveal delay={140} className="mt-5">
              <div className="relative overflow-hidden border border-rule">
                <iframe
                  src={mapsEmbedSrc}
                  title={`Map showing ${business.name} in Miyapur, Hyderabad`}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-[280px] w-full sm:h-[320px]"
                  style={{
                    border: 0,
                    // Warmed and desaturated so Google's map sits on the paper.
                    filter: 'grayscale(0.4) sepia(0.22) contrast(0.96) brightness(1.02)',
                  }}
                />
              </div>
              <p className="meta mt-3">
                Opposite Heritage Fresh Super Market · Walk-in studio
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
