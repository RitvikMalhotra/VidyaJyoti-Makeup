import { useEffect, useState } from 'react'
import { business, telHref } from '../../content/business'
import { useActiveSection, useBodyLock, useScrolled } from '../../lib/hooks'
import { useScrollBind } from '../../lib/scroll'
import { CloseIcon, MenuIcon, PhoneIcon, WhatsAppIcon } from '../ui/Icons'
import { WhatsAppLink } from '../ui/Actions'

export const NAV_LINKS = [
  { label: 'Home', href: '#top', id: 'top' },
  { label: 'About', href: '#about', id: 'about' },
  { label: 'Services', href: '#services', id: 'services' },
  { label: 'Portfolio', href: '#portfolio', id: 'portfolio' },
  { label: 'Reviews', href: '#reviews', id: 'reviews' },
  { label: 'Contact', href: '#contact', id: 'contact' },
] as const

const SECTION_IDS = NAV_LINKS.map((l) => l.id)

function Wordmark({ light, condensed }: { light: boolean; condensed: boolean }) {
  return (
    <a
      href="#top"
      className="group flex shrink-0 items-center gap-2.5 sm:gap-3.5"
      aria-label={business.name}
    >
      <span
        className={`font-display leading-none transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          condensed ? 'text-[1.15rem] sm:text-[1.35rem]' : 'text-[1.3rem] sm:text-[1.6rem]'
        } text-fg`}
        style={{ letterSpacing: '0.05em' }}
      >
        {business.logoTop}
      </span>
      <span
        aria-hidden
        className={`hidden h-5 w-px transition-colors duration-500 sm:block ${
          light ? 'bg-fg/25' : 'bg-fg/18'
        }`}
      />
      <span
        className="text-[0.5rem] leading-none font-semibold tracking-[0.24em] text-fg-3 uppercase transition-colors duration-500 group-hover:text-accent-2 sm:text-[0.58rem] sm:tracking-[0.26em]"
      >
        {business.logoBottom}
      </span>
    </a>
  )
}

/** Vermillion rule across the foot of the bar, tracking read progress. */
function ProgressRule() {
  const ref = useScrollBind<HTMLSpanElement>(
    (el, _rect, ctx) => {
      const max = ctx.docH - ctx.vh
      const p = max > 0 ? Math.min(1, Math.max(0, ctx.y / max)) : 0
      el.style.transform = `scaleX(${p.toFixed(4)})`
    },
    { always: true },
  )

  return (
    <span
      ref={ref}
      aria-hidden
      className="absolute inset-x-0 bottom-0 h-[2px] origin-left bg-accent"
      style={{ transform: 'scaleX(0)' }}
    />
  )
}

export function Navbar() {
  const scrolled = useScrolled(40)
  const [open, setOpen] = useState(false)
  const active = useActiveSection([...SECTION_IDS])
  useBodyLock(open)

  // The bar floats transparent over the hero, then settles onto the ground.
  const light = !scrolled

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      <a
        href="#story"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[70] focus:bg-deep focus:px-4 focus:py-2 focus:text-xs focus:text-deep"
      >
        Skip to content
      </a>

      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          scrolled
            ? 'border-b border-rule bg-surface/88 backdrop-blur-xl'
            : 'border-b border-transparent'
        }`}
      >
        <nav
          className={`mx-auto flex w-full max-w-[1560px] items-center justify-between px-5 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] sm:px-8 lg:px-12 ${
            scrolled ? 'h-14 lg:h-[62px]' : 'h-16 lg:h-[72px]'
          }`}
        >
          <Wordmark light={light} condensed={scrolled} />

          <ul className="hidden items-center gap-6 lg:flex xl:gap-9">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  data-active={active === link.id}
                  className="link-draw text-[0.82rem] font-medium text-fg-2 transition-colors duration-400 hover:text-fg data-[active=true]:text-accent-2"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="hidden items-center gap-4 lg:flex">
            <a
              href={telHref}
              className="hidden items-center gap-2 text-[0.82rem] font-medium text-fg-2 transition-colors duration-400 hover:text-accent-2 xl:flex"
            >
              <PhoneIcon className="h-3.5 w-3.5" />
              {business.phone.display}
            </a>
            <a
              href="#enquire"
              className={`btn px-5 py-2.5 text-[0.8rem] ${
                light ? 'btn-outline-light' : 'btn-solid'
              }`}
            >
              <span>Book a shoot</span>
            </a>
          </div>

          <button
            type="button"
            onClick={() => setOpen(true)}
            className="-mr-2 flex h-11 w-11 items-center justify-center text-fg transition-colors duration-400 lg:hidden"
            aria-label="Open menu"
            aria-expanded={open}
          >
            <MenuIcon />
          </button>
        </nav>

        {scrolled && <ProgressRule />}
      </header>

      <MobileMenu open={open} onClose={() => setOpen(false)} active={active} />
    </>
  )
}

function MobileMenu({
  open,
  onClose,
  active,
}: {
  open: boolean
  onClose: () => void
  active: string | null
}) {
  return (
    <div
      className={`fixed inset-0 z-[60] lg:hidden ${open ? '' : 'pointer-events-none'}`}
      aria-hidden={!open}
    >
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-deep/50 backdrop-blur-sm transition-opacity duration-500 ${
          open ? 'opacity-100' : 'opacity-0'
        }`}
      />

      <div
        role="dialog"
        aria-modal={open}
        aria-label="Menu"
        className={`room absolute inset-y-0 right-0 flex w-full max-w-sm flex-col transition-transform duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-rule px-5">
          <span className="font-display text-xl text-fg" style={{ letterSpacing: '0.05em' }}>
            {business.logoTop}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="-mr-2 flex h-11 w-11 items-center justify-center text-fg"
            aria-label="Close menu"
          >
            <CloseIcon />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-5 py-8">
          <ul>
            {NAV_LINKS.map((link, i) => (
              <li key={link.href} className="overflow-hidden">
                <a
                  href={link.href}
                  onClick={onClose}
                  data-active={active === link.id}
                  style={{ transitionDelay: open ? `${140 + i * 60}ms` : '0ms' }}
                  className={`flex items-baseline justify-between border-b border-rule py-4 font-display text-[2rem] text-fg transition-all duration-[700ms] ease-[cubic-bezier(0.16,1,0.3,1)] data-[active=true]:text-accent-2 ${
                    open ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                  }`}
                >
                  {link.label}
                  <span className="font-sans text-[0.65rem] font-semibold text-fg-3">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </a>
              </li>
            ))}
          </ul>

          <div
            style={{ transitionDelay: open ? '520ms' : '0ms' }}
            className={`mt-10 transition-all duration-500 ${
              open ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
            }`}
          >
            <p className="label">Get in touch</p>
            <a href={telHref} className="mt-4 flex items-center gap-3 font-display text-2xl text-fg">
              <PhoneIcon className="h-4 w-4 text-accent-2" />
              {business.phone.display}
            </a>
            <p className="body-base mt-3 text-[0.85rem]">
              {business.hours.summary} · {business.hours.range}
            </p>
            <p className="body-base mt-1 text-[0.85rem]">{business.locality}</p>

            <WhatsAppLink className="mt-6 w-full" variant="outline-light" />
          </div>
        </nav>

        <div className="shrink-0 border-t border-rule px-5 py-4">
          <a href="#enquire" onClick={onClose} className="btn btn-accent w-full">
            <WhatsAppIcon className="h-4 w-4" />
            <span>Book a shoot</span>
          </a>
        </div>
      </div>
    </div>
  )
}
