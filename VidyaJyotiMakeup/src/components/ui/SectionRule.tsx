import { useReveal } from '../../lib/hooks'

/* -------------------------------------------------------------------------
 * THE SECTION DIVIDER
 *
 * Every section on this page is `py-24 md:py-32`. Where two of them meet,
 * those paddings add up: measured across the built page, each boundary opened
 * a band roughly 250px tall with nothing in it at all — and on a tall desktop
 * window that is most of a viewport of pure ink. Generous spacing read as a
 * dead gap rather than as breathing room.
 *
 * A hairline in the middle of that band fixes it without taking the space
 * back. The eye gets something deliberate to land on, so the emptiness either
 * side of it becomes margin around a mark instead of a hole in the page.
 *
 * It sits at the section boundary rather than inside either section, which is
 * also the centre of the gap: the paddings above and below are the same, so
 * the boundary is already the midpoint.
 *
 * Gold, and thin enough to stay a whisper — the alternative, a full-strength
 * border, would chop the page into boxes and undo the flow the spacing is
 * there to create.
 * ---------------------------------------------------------------------- */

export function SectionRule({ className = '' }: { className?: string }) {
  const ref = useReveal<HTMLDivElement>()

  return (
    // Aligned to the same gutters and measure as every section's content, so
    // it lines up with the rules in the section heads above and below it.
    <div
      role="presentation"
      className={`px-5 sm:px-8 lg:px-12 ${className}`}
    >
      <div className="mx-auto w-full max-w-[84rem]">
        <div ref={ref} className="reveal-rule rule-gold h-px w-full" />
      </div>
    </div>
  )
}
