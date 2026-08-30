import type { ElementType } from 'react'
import { useReveal } from '../../lib/hooks'
import { Mark } from './Mark'

type Props = {
  /** Use "\n" to force a line break. */
  text: string
  as?: ElementType
  className?: string
  /** Delay before the first word, in ms. */
  delay?: number
  /** Gap between consecutive words, in ms. */
  stagger?: number
  active?: boolean
  /**
   * Exact word to underline with a drawn stroke. The mark wraps outside the
   * clipping box so the stroke is not cut off by the word's own reveal.
   */
  mark?: string
}

/**
 * Headline that swings up word by word, each word clipped by its own box.
 * Words keep their normal inline flow, so the type still wraps and balances
 * exactly as it would without the effect.
 */
export function SplitText({
  text,
  as: Tag = 'span',
  className = '',
  delay = 0,
  stagger = 52,
  active = true,
  mark,
}: Props) {
  const ref = useReveal<HTMLElement>(active)

  const lines = text.split('\n')
  let wordIndex = 0

  return (
    <Tag ref={ref} className={className}>
      {lines.map((line, lineIndex) => (
        <span key={lineIndex} className="block">
          {line.split(' ').map((word, i) => {
            const d = delay + wordIndex++ * stagger
            const clipped = (
              <span
                className="split-word"
                style={{ '--word-delay': `${d}ms` } as React.CSSProperties}
              >
                <span>{word}</span>
              </span>
            )
            return (
              <span key={`${lineIndex}-${i}`}>
                {i > 0 ? ' ' : null}
                {mark === word ? <Mark delay={d + 880}>{clipped}</Mark> : clipped}
              </span>
            )
          })}
        </span>
      ))}
    </Tag>
  )
}
