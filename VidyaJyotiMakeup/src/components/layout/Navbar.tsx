import { useState } from 'react'
import { business, whatsappLink } from '../../content/business'
import { useActiveSection, useScrolled, useBodyLock } from '../../lib/hooks'
import { CloseIcon } from '../ui/Icons'

const LINKS = [
  { id: 'work', label: 'Work' },
  { id: 'services', label: 'Services' },
  { id: 'process', label: 'Process' },
  { id: 'about', label: 'About' },
  { id: 'studio', label: 'Studio' },
  { id: 'enquire', label: 'Enquire' },
] as const

const IDS = LINKS.map((l) => l.id)

export function Navbar() {
  const scrolled = useScrolled(40)
  const active = useActiveSection(IDS)
  const [menuOpen, setMenuOpen] = useState(false)
  useBodyLock(menuOpen)

  return (
    <>
      <a
        href="#work"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-200 focus:rounded-full focus:bg-gold focus:px-5 focus:py-3 focus:text-sm focus:text-ink"
      >
        Skip to the work
      </a>

      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'border-b border-gold/12 bg-ink/85 backdrop-blur-md'
            : 'border-b border-transparent'
        }`}
      >
        <nav
          aria-label="Primary"
          className="mx-auto flex w-full max-w-[84rem] items-center justify-between px-5 py-4 sm:px-8 lg:px-12"
        >
          <a href="#top" className="group flex flex-col gap-1">
            <span className="wordmark text-2xl text-ivory transition-colors duration-500 group-hover:text-gold-bright sm:text-[1.75rem]">
              {business.name}
            </span>
            <span className="hidden text-[0.52rem] uppercase tracking-[0.42em] text-gold/60 sm:block">
              {business.role}
            </span>
          </a>

          <ul className="hidden items-center gap-8 md:flex">
            {LINKS.map((link) => (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  aria-current={active === link.id ? 'true' : undefined}
                  className={`relative text-[0.7rem] uppercase tracking-[0.26em] transition-colors duration-300 ${
                    active === link.id ? 'text-gold-bright' : 'text-ivory/65 hover:text-ivory'
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute -bottom-1.5 left-0 h-px w-full origin-left bg-gold transition-transform duration-500 ${
                      active === link.id ? 'scale-x-100' : 'scale-x-0'
                    }`}
                  />
                </a>
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            aria-expanded={menuOpen}
            className="flex h-9 w-9 flex-col items-center justify-center gap-[5px] md:hidden"
          >
            <span className="h-px w-5 bg-ivory" />
            <span className="h-px w-5 bg-ivory" />
          </button>
        </nav>
      </header>

      {/* Full-screen menu. A drawer on a page this dark just looks like a bug. */}
      <div
        className={`fixed inset-0 z-90 bg-ink transition-opacity duration-400 md:hidden ${
          menuOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        aria-hidden={!menuOpen}
      >
        <div className="flex items-center justify-between px-5 py-4">
          <span className="wordmark text-2xl text-ivory">{business.name}</span>
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
            className="h-9 w-9 rounded-full border border-gold/25 p-2 text-ivory"
          >
            <CloseIcon />
          </button>
        </div>

        <ul className="mt-10 flex flex-col gap-2 px-6">
          {LINKS.map((link, i) => (
            <li key={link.id}>
              <a
                href={`#${link.id}`}
                onClick={() => setMenuOpen(false)}
                className="block border-b border-ink-line/60 py-5 font-display text-4xl text-ivory transition-colors hover:text-gold-bright"
                style={{
                  transitionDelay: menuOpen ? `${i * 40}ms` : '0ms',
                }}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {whatsappLink() && (
          <div className="px-6 pt-10">
            <a
              href={whatsappLink()!}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex rounded-full bg-gold px-7 py-4 text-[0.75rem] uppercase tracking-[0.22em] text-ink"
            >
              Check my date
            </a>
          </div>
        )}
      </div>
    </>
  )
}
