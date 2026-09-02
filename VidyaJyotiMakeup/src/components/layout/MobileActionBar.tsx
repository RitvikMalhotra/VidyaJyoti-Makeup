import { business, telLink, whatsappLink } from '../../content/business'
import { useScrolled } from '../../lib/hooks'
import { PhoneIcon, WhatsAppIcon } from '../ui/Icons'

/* -------------------------------------------------------------------------
 * The phone-only action bar.
 *
 * Bridal enquiries arrive from a phone, usually from Instagram, usually while
 * the bride is doing something else. The bar keeps the two actions that
 * matter within thumb reach the whole way down the page.
 *
 * It renders nothing at all until a real phone number or WhatsApp number is
 * configured — a bar of dead buttons is worse than no bar.
 * ---------------------------------------------------------------------- */

export function MobileActionBar() {
  const scrolled = useScrolled(360)
  const wa = whatsappLink()
  const tel = telLink()

  if (!wa && !tel) return null

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-50 border-t border-gold/15 bg-ink/95 backdrop-blur-md transition-transform duration-500 md:hidden ${
        scrolled ? 'translate-y-0' : 'translate-y-full'
      }`}
      // Clears the iOS home indicator.
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="grid grid-cols-2 gap-px">
        {tel && (
          <a
            href={tel}
            className="flex items-center justify-center gap-2.5 py-4 text-[0.72rem] uppercase tracking-[0.2em] text-ivory"
          >
            <span className="h-4 w-4 text-gold">
              <PhoneIcon />
            </span>
            Call
          </a>
        )}
        {wa && (
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center justify-center gap-2.5 bg-gold py-4 text-[0.72rem] uppercase tracking-[0.2em] text-ink ${
              tel ? '' : 'col-span-2'
            }`}
          >
            <span className="h-4 w-4">
              <WhatsAppIcon />
            </span>
            WhatsApp {business.name}
          </a>
        )}
      </div>
    </div>
  )
}
