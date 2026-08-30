import { business, telHref, wa } from '../../content/business'
import { useScrolled } from '../../lib/hooks'
import { PhoneIcon, WhatsAppIcon } from '../ui/Icons'

/**
 * Persistent mobile conversion bar. Held back over the very top of the hero
 * so the first impression stays clean, then pinned for the rest of the visit.
 */
export function MobileActionBar() {
  const shown = useScrolled(120)

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-rule bg-deep/95 backdrop-blur-xl transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] lg:hidden ${
        shown ? 'translate-y-0' : 'translate-y-full'
      }`}
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="grid h-16 grid-cols-2">
        <a
          href={wa.general}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2.5 text-[0.85rem] font-semibold text-fg active:bg-fg/10"
        >
          <WhatsAppIcon className="h-[18px] w-[18px] text-accent-2" />
          WhatsApp
        </a>
        <a
          href={telHref}
          className="relative flex items-center justify-center gap-2.5 text-[0.85rem] font-semibold text-deep active:opacity-90"
          style={{ background: 'var(--color-accent)' }}
          aria-label={`Call ${business.phone.display}`}
        >
          <PhoneIcon className="h-4 w-4" />
          Call Now
        </a>
      </div>
    </div>
  )
}
