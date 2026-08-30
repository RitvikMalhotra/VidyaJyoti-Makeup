import { useEffect, useState } from 'react'

/**
 * Live open/closed state for the studio.
 *
 * Hours are the ones on the listing — 8:30 AM to 10:00 PM, every day — and
 * are evaluated in Asia/Kolkata, so a visitor in another timezone still sees
 * the truth about the shop rather than about their own clock.
 */

const OPEN_MINUTES = 8 * 60 + 30
const CLOSE_MINUTES = 22 * 60

function studioMinutesNow(): number {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(new Date())

  const hour = Number(parts.find((p) => p.type === 'hour')?.value ?? '0')
  const minute = Number(parts.find((p) => p.type === 'minute')?.value ?? '0')
  return hour * 60 + minute
}

export type OpenState = { open: boolean; label: string }

function compute(): OpenState {
  const now = studioMinutesNow()
  if (now >= OPEN_MINUTES && now < CLOSE_MINUTES) {
    return { open: true, label: 'Open now' }
  }
  return {
    open: false,
    label: now < OPEN_MINUTES ? 'Opens at 8:30 AM' : 'Opens tomorrow, 8:30 AM',
  }
}

export function useStudioOpen(): OpenState {
  const [state, setState] = useState<OpenState>(() => compute())

  useEffect(() => {
    const id = setInterval(() => setState(compute()), 60_000)
    return () => clearInterval(id)
  }, [])

  return state
}
