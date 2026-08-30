import type { ReactNode } from 'react'
import { Reveal } from './Reveal'
import { SplitText } from './SplitText'

type Props = {
  /** Two-digit chapter number. */
  index: string
  label: string
  /** Plain text — it is split into words and animated. Use "\n" to break. */
  title: string
  intro?: ReactNode
  align?: 'left' | 'center'
  className?: string
}

/**
 * Chapter opening: a numeral and label sitting on a rule that runs out to the
 * edge of the measure, then the heading. The rule is the device that makes
 * each section read as a spread in a printed book.
 */
export function SectionHead({
  index,
  label,
  title,
  intro,
  align = 'left',
  className = '',
}: Props) {
  const centred = align === 'center'

  return (
    <div className={`${centred ? 'mx-auto max-w-3xl text-center' : ''} ${className}`}>
      <Reveal
        className={`flex items-center gap-4 sm:gap-6 ${centred ? 'justify-center' : ''}`}
      >
        <span className="chapter-num text-lg">{index}</span>
        <span className="label">{label}</span>
        {!centred && <span className="rule hidden flex-1 sm:block" aria-hidden />}
      </Reveal>

      <SplitText
        as="h2"
        text={title}
        delay={90}
        className={`display-lg mt-6 ${centred ? '' : 'max-w-[18ch]'}`}
      />

      {intro && (
        <Reveal delay={260} className={`mt-6 ${centred ? '' : 'max-w-xl'}`}>
          <p className="body-lg">{intro}</p>
        </Reveal>
      )}
    </div>
  )
}
