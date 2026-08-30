import type { ElementType, ReactNode } from 'react'
import { useReveal } from '../../lib/hooks'

type Props = {
  children: ReactNode
  /** Element to render. Defaults to a div. */
  as?: ElementType
  className?: string
  /** Stagger, in ms. */
  delay?: number
  /** Travel distance, in px. */
  y?: number
  /** Wipe open like a frame instead of drifting up. For photographs. */
  curtain?: boolean
  id?: string
  /** Hold the reveal back — used while the intro sequence is still running. */
  active?: boolean
}

export function Reveal({
  children,
  as: Tag = 'div',
  className = '',
  delay = 0,
  y,
  curtain = false,
  id,
  active = true,
}: Props) {
  const ref = useReveal<HTMLElement>(active)

  return (
    <Tag
      ref={ref}
      id={id}
      className={`${curtain ? 'reveal-curtain' : 'reveal'} ${className}`}
      style={
        {
          '--reveal-delay': `${delay}ms`,
          ...(y !== undefined ? { '--reveal-y': `${y}px` } : null),
        } as React.CSSProperties
      }
    >
      {children}
    </Tag>
  )
}
