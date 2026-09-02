import type { ReactNode } from 'react'
import { Reveal } from './Reveal'

export function SectionHead({
  eyebrow,
  title,
  intro,
  align = 'left',
  className = '',
}: {
  eyebrow: string
  title: ReactNode
  intro?: ReactNode
  align?: 'left' | 'centre'
  className?: string
}) {
  const centred = align === 'centre'

  return (
    <header
      className={`${centred ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'} ${className}`}
    >
      <Reveal>
        <p className="eyebrow flex items-center gap-3">
          {centred && <span className="rule-gold hidden h-px w-10 sm:block" />}
          {eyebrow}
          <span className="rule-gold h-px flex-1" />
        </p>
      </Reveal>

      <Reveal delay={80}>
        <h2 className="display-lg mt-6 text-balance text-ivory">{title}</h2>
      </Reveal>

      {intro && (
        <Reveal delay={160}>
          <p className={`body-lg mt-6 text-pretty ${centred ? 'mx-auto' : ''}`}>{intro}</p>
        </Reveal>
      )}
    </header>
  )
}

/** A section shell with the page's standard rhythm and gutters. */
export function Section({
  id,
  children,
  className = '',
  label,
  measure = 'max-w-[84rem]',
}: {
  id?: string
  children: ReactNode
  className?: string
  /** Accessible name, when the visible heading is not the whole story. */
  label?: string
  /**
   * The content measure, as a literal Tailwind class.
   *
   * Narrowing this is how a section's imagery is scaled down: because the
   * head is capped at `max-w-3xl` well inside any value used here, changing
   * it moves nothing but the wide content — and every child keeps the same
   * left edge, so nothing drifts out of alignment with the headline.
   *
   * Written out in full at the call site on purpose. Tailwind scans source
   * text, so a class assembled from a variable is never generated.
   */
  measure?: string
}) {
  return (
    <section
      id={id}
      aria-label={label}
      className={`relative px-5 py-24 sm:px-8 md:py-32 lg:px-12 ${className}`}
    >
      <div className={`mx-auto w-full ${measure}`}>{children}</div>
    </section>
  )
}
