import { business, telHref, wa } from '../../content/business'
import { finalCta } from '../../content/images'
import { StudioImage } from '../ui/StudioImage'
import { Reveal } from '../ui/Reveal'
import { SplitText } from '../ui/SplitText'
import { PhoneIcon, WhatsAppIcon } from '../ui/Icons'

export function FinalCta() {
  return (
    <section className="room relative isolate flex min-h-[88svh] items-center overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <StudioImage
          photo={finalCta}
          fill
          variant="backdrop"
          parallax={140}
          sizes="100vw"
          position="50% 40%"
        />
      </div>

      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(88% 68% at 50% 55%, rgba(23,19,16,0.5) 0%, rgba(23,19,16,0.88) 68%, rgba(23,19,16,0.97) 100%)',
        }}
      />

      <div className="mx-auto w-full max-w-[1560px] px-5 py-24 text-center sm:px-8 lg:px-12">
        <Reveal className="mx-auto max-w-3xl">
          <span className="label">{business.locality}</span>
        </Reveal>

        <SplitText
          as="h2"
          text={'Let us capture\nsomething beautiful.'}
          mark="beautiful."
          delay={120}
          stagger={62}
          className="display-xl mx-auto mt-7 max-w-5xl"
        />

        <Reveal delay={480} className="mx-auto mt-9 max-w-lg">
          <p className="body-lg">Your next celebration deserves to be remembered.</p>
        </Reveal>

        <Reveal
          delay={580}
          className="mx-auto mt-11 flex max-w-lg flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center"
        >
          <a
            href={wa.general}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-accent"
          >
            <WhatsAppIcon className="h-4 w-4" />
            <span>WhatsApp us</span>
          </a>
          <a href={telHref} className="btn btn-outline-light">
            <PhoneIcon className="h-3.5 w-3.5" />
            <span>Call now</span>
          </a>
        </Reveal>

        <Reveal delay={660} className="mt-10">
          <p className="meta">
            {business.hours.summary} · {business.hours.range} · {business.phone.display}
          </p>
        </Reveal>
      </div>
    </section>
  )
}
