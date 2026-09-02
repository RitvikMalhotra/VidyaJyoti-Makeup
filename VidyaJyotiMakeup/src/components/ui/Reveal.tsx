import type { ElementType, ReactNode } from 'react'
import { useReveal } from '../../lib/hooks'

type Props = {
  children: ReactNode
  /** Milliseconds of stagger. Kept small — a long cascade feels slow, not rich. */
  delay?: number
  className?: string
  as?: ElementType
  /** `curtain` uncovers the element instead of fading it, for imagery. */
  variant?: 'rise' | 'curtain'
  /**
   * Hold the reveal until something else is ready — the hero passes `false`
   * while the opening card is still up, so it animates in behind the card
   * lifting rather than being finished underneath it.
   */
  enabled?: boolean
}

export function Reveal({
  children,
  delay = 0,
  className = '',
  as: Tag = 'div',
  variant = 'rise',
  enabled = true,
}: Props) {
  const ref = useReveal<HTMLDivElement>(enabled)
  const base = variant === 'curtain' ? 'reveal-curtain' : 'reveal'

  return (
    <Tag
      ref={ref}
      className={`${base} ${className}`}
      style={delay ? ({ '--reveal-delay': `${delay}ms` } as React.CSSProperties) : undefined}
    >
      {children}
    </Tag>
  )
}

/**
 * A headline that rises line by line from behind its own baseline.
 *
 * Lines are passed in already broken rather than split from a string:
 * automatic word-splitting sets the breaks wherever the viewport happens to
 * land, and a headline this size is the one place the breaks should be
 * chosen by hand, the way they would be in print.
 */
export function RevealLines({
  lines,
  className = '',
  delay = 0,
  step = 90,
  enabled = true,
}: {
  lines: ReactNode[]
  className?: string
  delay?: number
  step?: number
  enabled?: boolean
}) {
  const ref = useReveal<HTMLSpanElement>(enabled)

  return (
    // One observer for the whole headline, so the lines stagger against each
    // other instead of each waiting for its own intersection.
    <span ref={ref} className={`reveal-lines ${className}`}>
      {lines.map((line, i) => (
        <span
          key={i}
          className="reveal-line"
          style={{ '--reveal-delay': `${delay + i * step}ms` } as React.CSSProperties}
        >
          <span>{line}</span>
        </span>
      ))}
    </span>
  )
}
