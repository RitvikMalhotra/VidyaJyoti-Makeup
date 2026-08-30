import {
  business,
  mapsSearchHref,
  telHref,
} from '../../content/business'
import { NAV_LINKS } from './Navbar'
import { GoogleIcon, StarIcon } from '../ui/Icons'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="room relative border-t border-rule">
      <div className="mx-auto w-full max-w-[1560px] px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Identity */}
          <div className="lg:col-span-5">
            <p
              className="font-display text-[2rem] leading-none text-fg"
              style={{ letterSpacing: '0.05em' }}
            >
              {business.logoTop}
            </p>
            <p className="mt-3 text-[0.6rem] font-semibold tracking-[0.28em] uppercase text-fg-3">
              {business.logoBottom}
            </p>
            <p className="body-base mt-6 max-w-xs">
              {business.category}
              <br />
              {business.locality}
            </p>

            <div className="mt-8 inline-flex items-center gap-3 border border-rule px-4 py-2.5">
              <GoogleIcon className="h-4 w-4" />
              <span className="flex items-center gap-1.5 text-sm font-medium text-fg">
                <StarIcon className="h-3 w-3 text-accent-2" />
                {business.rating.value}
              </span>
              <span className="h-3 w-px bg-rule" aria-hidden />
              <span className="meta">{business.rating.countDisplay} reviews</span>
            </div>
          </div>

          {/* Navigate */}
          <div className="lg:col-span-3">
            <p className="label">Navigate</p>
            <ul className="mt-6 space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="link-draw text-[0.9rem] text-fg-2 transition-colors duration-400 hover:text-accent-2"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Studio */}
          <div className="lg:col-span-4">
            <p className="label">Studio</p>
            <address className="body-base mt-6 not-italic">
              {business.address.lines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </address>

            <dl className="mt-6 space-y-3">
              <div className="flex items-baseline gap-4">
                <dt className="w-16 shrink-0 text-[0.6rem] font-semibold tracking-[0.12em] uppercase text-fg-3">
                  Phone
                </dt>
                <dd>
                  <a
                    href={telHref}
                    className="link-draw font-display text-xl text-fg transition-colors duration-400 hover:text-accent-2"
                  >
                    {business.phone.display}
                  </a>
                </dd>
              </div>
              <div className="flex items-baseline gap-4">
                <dt className="w-16 shrink-0 text-[0.6rem] font-semibold tracking-[0.12em] uppercase text-fg-3">
                  Hours
                </dt>
                <dd className="text-[0.9rem] text-fg-2">
                  {business.hours.summary}
                  <span className="mx-1.5 text-fg-3">·</span>
                  {business.hours.range}
                </dd>
              </div>
            </dl>

            <a
              href={mapsSearchHref}
              target="_blank"
              rel="noopener noreferrer"
              className="link-draw mt-6 inline-block text-[0.82rem] font-semibold text-accent-2"
            >
              View on Google Maps
            </a>
          </div>
        </div>

        {/*
          A short, accurate privacy note. The site has no backend, no analytics
          and no cookies of its own, so it says exactly that rather than
          borrowing boilerplate that would not be true.
        */}
        <details id="privacy" className="group mt-14 border-t border-rule pt-6">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[0.68rem] font-semibold tracking-[0.14em] text-fg-3 uppercase transition-colors duration-400 hover:text-fg">
            Privacy
            <span
              aria-hidden
              className="text-base leading-none transition-transform duration-500 group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <div className="mt-5 grid gap-6 pb-2 sm:grid-cols-3">
            <p className="body-base text-[0.8rem]">
              This website does not collect or store personal information. It sets no
              cookies and runs no analytics or tracking of its own.
            </p>
            <p className="body-base text-[0.8rem]">
              The enquiry form does not submit anywhere. It composes a WhatsApp message
              from what you type and opens WhatsApp so you can review and send it
              yourself.
            </p>
            <p className="body-base text-[0.8rem]">
              The map is embedded from Google Maps, and ratings and reviews are shown as
              published on the studio&rsquo;s Google listing. Those services apply their
              own privacy terms.
            </p>
          </div>
        </details>

        <div className="rule mt-8" />

        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[0.72rem] text-fg-3">
            © {year} {business.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a
              href="#privacy"
              className="link-draw text-[0.72rem] text-fg-3 transition-colors duration-400 hover:text-fg-2"
            >
              Privacy
            </a>
            <p className="text-[0.72rem] text-fg-3">
              Ratings and reviews sourced from Google.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
