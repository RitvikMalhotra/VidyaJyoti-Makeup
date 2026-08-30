import { StarIcon } from './Icons'

type Props = {
  count?: number
  className?: string
  label?: string
}

export function Stars({ count = 5, className = 'h-3 w-3', label }: Props) {
  return (
    <span
      className="inline-flex items-center gap-[3px] text-accent"
      role="img"
      aria-label={label ?? `${count} out of 5 stars`}
    >
      {Array.from({ length: count }, (_, i) => (
        <StarIcon key={i} className={className} />
      ))}
    </span>
  )
}
