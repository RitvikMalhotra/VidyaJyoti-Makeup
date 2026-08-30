type IconProps = { className?: string }

const base = 'shrink-0'

export const WhatsAppIcon = ({ className = 'h-4 w-4' }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={`${base} ${className}`}>
    <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.05-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37s-1.04 1.01-1.04 2.47 1.06 2.86 1.21 3.06c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35z" />
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.87 9.87 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91A9.85 9.85 0 0 0 12.04 2zm0 18.14h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.11.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.37c0-4.54 3.7-8.23 8.24-8.23a8.18 8.18 0 0 1 8.22 8.24c0 4.54-3.69 8.22-8.23 8.22z" />
  </svg>
)

export const PhoneIcon = ({ className = 'h-4 w-4' }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
       strokeLinecap="round" strokeLinejoin="round" aria-hidden className={`${base} ${className}`}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
)

export const ArrowIcon = ({ className = 'h-3.5 w-3.5' }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
       strokeLinecap="round" strokeLinejoin="round" aria-hidden className={`${base} ${className}`}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)

export const CloseIcon = ({ className = 'h-5 w-5' }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25"
       strokeLinecap="round" aria-hidden className={`${base} ${className}`}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
)

export const ChevronIcon = ({ className = 'h-5 w-5' }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25"
       strokeLinecap="round" strokeLinejoin="round" aria-hidden className={`${base} ${className}`}>
    <path d="M15 6l-6 6 6 6" />
  </svg>
)

export const PinIcon = ({ className = 'h-4 w-4' }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3"
       strokeLinecap="round" strokeLinejoin="round" aria-hidden className={`${base} ${className}`}>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" />
    <circle cx="12" cy="10" r="2.6" />
  </svg>
)

export const ClockIcon = ({ className = 'h-4 w-4' }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3"
       strokeLinecap="round" strokeLinejoin="round" aria-hidden className={`${base} ${className}`}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3.2 1.9" />
  </svg>
)

export const StarIcon = ({ className = 'h-3.5 w-3.5' }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={`${base} ${className}`}>
    <path d="M12 2.6l2.9 5.9 6.5.95-4.7 4.58 1.11 6.47L12 17.45l-5.81 3.05 1.11-6.47-4.7-4.58 6.5-.95L12 2.6z" />
  </svg>
)

export const GoogleIcon = ({ className = 'h-4 w-4' }: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden className={`${base} ${className}`}>
    <path fill="#4285F4" d="M23.5 12.27c0-.85-.08-1.67-.22-2.45H12v4.63h6.45a5.5 5.5 0 0 1-2.39 3.62v3h3.86c2.26-2.08 3.56-5.15 3.56-8.8z" />
    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.87-3a7.2 7.2 0 0 1-10.72-3.78H1.35v3.09A12 12 0 0 0 12 24z" />
    <path fill="#FBBC05" d="M5.34 14.3a7.19 7.19 0 0 1 0-4.6V6.62H1.35a12 12 0 0 0 0 10.77l3.99-3.09z" />
    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.43-3.43C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.35 6.62l3.99 3.09A7.2 7.2 0 0 1 12 4.75z" />
  </svg>
)

export const MenuIcon = ({ className = 'h-5 w-5' }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25"
       strokeLinecap="round" aria-hidden className={`${base} ${className}`}>
    <path d="M3.5 8h17M3.5 16h17" />
  </svg>
)

export const ExpandIcon = ({ className = 'h-4 w-4' }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"
       strokeLinecap="round" strokeLinejoin="round" aria-hidden className={`${base} ${className}`}>
    <path d="M9 3H3v6M15 21h6v-6M21 9V3h-6M3 15v6h6" />
  </svg>
)
