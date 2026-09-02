import type { ReactNode } from 'react'

/* -------------------------------------------------------------------------
 * Links and buttons.
 *
 * `href` is deliberately nullable throughout. The contact details in
 * content/business.ts start empty, and a call button pointing at `tel:` with
 * nothing after it is worse than no button — it looks live and fails in the
 * customer's hand. A null href renders nothing at all.
 * ---------------------------------------------------------------------- */

type ActionProps = {
  href: string | null
  children: ReactNode
  className?: string
  /** Leading or trailing glyph. */
  icon?: ReactNode
  external?: boolean
  onClick?: () => void
}

const focusable =
  'inline-flex items-center justify-center gap-3 transition-colors duration-300'

export function PrimaryAction({ href, children, className = '', icon, external }: ActionProps) {
  if (!href) return null

  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className={`${focusable} group relative overflow-hidden rounded-full bg-gold px-8 py-4 text-[0.78rem] font-normal uppercase tracking-[0.22em] text-ink hover:bg-gold-bright ${className}`}
    >
      {icon && <span className="h-4 w-4">{icon}</span>}
      {children}
    </a>
  )
}

export function GhostAction({ href, children, className = '', icon, external }: ActionProps) {
  if (!href) return null

  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className={`${focusable} rounded-full border border-gold/35 px-8 py-4 text-[0.78rem] uppercase tracking-[0.22em] text-ivory hover:border-gold hover:text-gold-bright ${className}`}
    >
      {icon && <span className="h-4 w-4">{icon}</span>}
      {children}
    </a>
  )
}

/** An underlined text link that draws its rule on hover. */
export function TextLink({ href, children, className = '', external }: ActionProps) {
  if (!href) return null

  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className={`group relative inline-block text-ivory/80 transition-colors duration-300 hover:text-gold-bright ${className}`}
    >
      {children}
      <span className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-gold transition-transform duration-500 ease-out group-hover:scale-x-100" />
    </a>
  )
}
