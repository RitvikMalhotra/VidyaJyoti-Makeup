import type { ReactNode } from 'react'

/**
 * Emphasis for one phrase in a headline: a stroke drawn under it by hand,
 * which inks itself in when the heading arrives.
 *
 * `vector-effect="non-scaling-stroke"` keeps the line an even weight however
 * wide the phrase turns out to be.
 */
export function Mark({
  children,
  delay = 620,
  className = '',
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  return (
    <span className={`relative inline-block ${className}`}>
      <span className="relative z-10">{children}</span>
      <svg
        className="mark-stroke pointer-events-none absolute inset-x-0 -bottom-[0.16em] h-[0.34em] w-full overflow-visible text-accent"
        viewBox="0 0 200 12"
        preserveAspectRatio="none"
        fill="none"
        aria-hidden
        style={{ '--len': 215, '--mark-delay': `${delay}ms` } as React.CSSProperties}
      >
        <path
          d="M2.5 8.4C31 3.6 58 10.2 86 5.4c28-4.8 55 2.4 82.5-1.2 10-1.3 19-0.4 29 2.4"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </span>
  )
}
