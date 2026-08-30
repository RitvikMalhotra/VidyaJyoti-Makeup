import type { ReactNode } from 'react'
import { business, telHref, whatsappHref } from '../../content/business'
import { ArrowIcon, PhoneIcon, WhatsAppIcon } from './Icons'

type Variant = 'solid' | 'outline' | 'accent' | 'outline-light'

const variantClass: Record<Variant, string> = {
  solid: 'btn-solid',
  outline: 'btn-outline',
  accent: 'btn-accent',
  'outline-light': 'btn-outline-light',
}

/**
 * WhatsApp is the site's functional conversion path: there is no backend, so
 * every enquiry resolves to a real, pre-composed message on a real number.
 */
export function WhatsAppLink({
  message = `Hello S.L.N. Digital Studio, I found you online and I'd like to enquire about a shoot.`,
  variant = 'solid',
  className = '',
  children = 'WhatsApp us',
  showIcon = true,
}: {
  message?: string
  variant?: Variant
  className?: string
  children?: ReactNode
  showIcon?: boolean
}) {
  return (
    <a
      href={whatsappHref(message)}
      target="_blank"
      rel="noopener noreferrer"
      className={`btn ${variantClass[variant]} ${className}`}
    >
      {showIcon && <WhatsAppIcon className="h-4 w-4" />}
      <span>{children}</span>
    </a>
  )
}

export function CallLink({
  variant = 'outline',
  className = '',
  children,
  showIcon = true,
}: {
  variant?: Variant
  className?: string
  children?: ReactNode
  showIcon?: boolean
}) {
  return (
    <a href={telHref} className={`btn ${variantClass[variant]} ${className}`}>
      {showIcon && <PhoneIcon className="h-3.5 w-3.5" />}
      <span>{children ?? `Call ${business.phone.display}`}</span>
    </a>
  )
}

/** Scrolls to the enquiry section rather than opening anything. */
export function BookLink({
  variant = 'solid',
  className = '',
  children = 'Book a shoot',
  showArrow = false,
}: {
  variant?: Variant
  className?: string
  children?: ReactNode
  showArrow?: boolean
}) {
  return (
    <a href="#enquire" className={`btn ${variantClass[variant]} ${className}`}>
      <span>{children}</span>
      {showArrow && <ArrowIcon />}
    </a>
  )
}

/** Quiet text link with a rule that redraws on hover. */
export function TextLink({
  href,
  children,
  external = false,
  className = '',
}: {
  href: string
  children: ReactNode
  external?: boolean
  className?: string
}) {
  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : null)}
      className={`link-draw group inline-flex items-center gap-2.5 text-[0.82rem] font-semibold text-fg transition-colors duration-400 hover:text-accent ${className}`}
    >
      {children}
      <ArrowIcon className="h-3.5 w-3.5 transition-transform duration-400 group-hover:translate-x-1" />
    </a>
  )
}
