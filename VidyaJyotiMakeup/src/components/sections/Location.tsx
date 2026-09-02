import { business, mapsLink, telLink, whatsappLink } from '../../content/business'
import { Section } from '../ui/SectionHead'
import { Reveal } from '../ui/Reveal'
import { StudioImage } from '../ui/StudioImage'
import { GhostAction } from '../ui/Actions'
import { MapPinIcon, PhoneIcon, InstagramIcon, WhatsAppIcon } from '../ui/Icons'

export function Location() {
  const { address } = business

  const channels = [
    {
      href: whatsappLink(),
      icon: <WhatsAppIcon />,
      label: 'WhatsApp',
      value: business.phone,
      external: true,
    },
    {
      href: telLink(),
      icon: <PhoneIcon />,
      label: 'Phone',
      value: business.phone,
      external: false,
    },
    {
      href: business.instagram || null,
      icon: <InstagramIcon />,
      label: 'Instagram',
      value: business.instagramHandle,
      external: true,
    },
  ].filter((c) => c.href)

  return (
    <Section id="studio">
      <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <Reveal>
            <p className="eyebrow flex items-center gap-3">
              The studio
              <span className="rule-gold h-px w-16" />
            </p>
          </Reveal>

          <Reveal delay={80}>
            <h2 className="display-lg mt-6 text-balance text-ivory">
              Kondapur, Hyderabad.
            </h2>
          </Reveal>

          <Reveal delay={160}>
            <address className="mt-7 not-italic leading-relaxed text-ivory/70">
              {address.street}
              <br />
              {address.locality}
              <br />
              {address.region} {address.postalCode}
            </address>
          </Reveal>

          <Reveal delay={220}>
            <p className="mt-5 text-sm leading-relaxed text-ivory/45">
              Bridal bookings are usually done at your venue or home on the day.
              Trials and courses happen at the studio.
            </p>
          </Reveal>

          <Reveal delay={280}>
            <div className="mt-8">
              <GhostAction href={mapsLink()} external icon={<MapPinIcon />}>
                Open in Maps
              </GhostAction>
            </div>
          </Reveal>

          <Reveal delay={340}>
            <ul className="mt-10 divide-y divide-ink-line/60 border-y border-ink-line/60">
              {channels.map((c) => (
                <li key={c.label}>
                  <a
                    href={c.href!}
                    {...(c.external
                      ? { target: '_blank', rel: 'noopener noreferrer' }
                      : {})}
                    className="group flex items-center justify-between gap-4 py-5 transition-colors hover:text-gold-bright"
                  >
                    <span className="flex items-center gap-4">
                      <span className="h-4 w-4 text-gold">{c.icon}</span>
                      <span className="text-[0.68rem] uppercase tracking-[0.24em] text-ivory/50">
                        {c.label}
                      </span>
                    </span>
                    <span className="text-sm text-ivory/80 transition-colors group-hover:text-gold-bright">
                      {c.value}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <div className="lg:col-span-7">
          <Reveal variant="curtain" delay={120}>
            <StudioImage
              photo="editorial-wide"
              alt="Close beauty portrait with graphic eyeliner, shot in the studio"
              sizes="(max-width: 1023px) 92vw, 55vw"
              className="w-full"
            />
          </Reveal>
        </div>
      </div>
    </Section>
  )
}
