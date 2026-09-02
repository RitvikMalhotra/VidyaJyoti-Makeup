import { business, mailLink, mapsLink, telLink, whatsappLink } from '../../content/business'
import { InstagramIcon, MailIcon, MapPinIcon, PhoneIcon, WhatsAppIcon } from '../ui/Icons'

export function Footer() {
  const year = new Date().getFullYear()
  const { address } = business

  const channels = [
    { href: whatsappLink(), label: 'WhatsApp', icon: <WhatsAppIcon />, external: true },
    { href: telLink(), label: business.phone, icon: <PhoneIcon />, external: false },
    { href: mailLink(), label: business.email, icon: <MailIcon />, external: false },
    {
      href: business.instagram || null,
      label: business.instagramHandle,
      icon: <InstagramIcon />,
      external: true,
    },
    { href: mapsLink(), label: 'Kondapur, Hyderabad', icon: <MapPinIcon />, external: true },
  ].filter((c) => c.href)

  const nav = [
    { id: 'work', label: 'Work' },
    { id: 'services', label: 'Services' },
    { id: 'process', label: 'Process' },
    { id: 'about', label: 'About' },
    { id: 'studio', label: 'Studio' },
    { id: 'enquire', label: 'Enquire' },
  ]

  return (
    <footer className="border-t border-ink-line/70 px-5 pb-[calc(var(--bar-h)+2rem)] pt-20 sm:px-8 md:pb-16 lg:px-12">
      <div className="mx-auto flex w-full max-w-[84rem] flex-col gap-14">
        <div className="grid gap-10 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-5">
            <p className="wordmark text-3xl text-ivory sm:text-4xl">{business.name}</p>
            <p className="mt-2 text-[0.55rem] uppercase tracking-[0.4em] text-gold/60">
              Makeup Artistry
            </p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-ivory/55">
              {business.tagline}
            </p>
            <address className="mt-6 text-sm not-italic leading-relaxed text-ivory/40">
              {address.street}, {address.locality}
              <br />
              {address.region} {address.postalCode}
            </address>
          </div>

          <nav aria-label="Footer" className="md:col-span-3">
            <p className="eyebrow text-[0.6rem]">Pages</p>
            <ul className="mt-5 flex flex-col gap-3">
              {nav.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className="text-sm text-ivory/65 transition-colors hover:text-gold-bright"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-4">
            <p className="eyebrow text-[0.6rem]">Reach her</p>
            <ul className="mt-5 flex flex-col gap-3">
              {channels.map((c) => (
                <li key={c.label}>
                  <a
                    href={c.href!}
                    {...(c.external
                      ? { target: '_blank', rel: 'noopener noreferrer' }
                      : {})}
                    className="flex items-center gap-3 text-sm text-ivory/65 transition-colors hover:text-gold-bright"
                  >
                    <span className="h-4 w-4 shrink-0 text-gold">{c.icon}</span>
                    {c.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="rule-gold h-px w-full" />

        <div className="flex flex-col gap-4 text-xs tracking-wide text-ivory/35 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {business.fullName}. All photography by and of her clients.
          </p>
          <p>
            <a href="#top" className="transition-colors hover:text-gold-bright">
              Back to top
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
