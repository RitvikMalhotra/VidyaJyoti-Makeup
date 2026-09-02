/* -------------------------------------------------------------------------
 * The cinematic video policy.
 *
 * The brief's hard rule is "never load multiple large cinematic videos
 * simultaneously". Left to itself the browser will happily start four
 * autoplaying loops at once, so this module owns the decision instead:
 *
 *  - Only ONE clip holds the floor at any moment. Claiming it pauses whoever
 *    had it. Everything else shows its still frame, which is what the
 *    fallback path renders anyway.
 *
 *  - A clip only claims the floor once it is actually on screen, and gives it
 *    up the moment it leaves. Scrolling past a section therefore hands the
 *    floor along rather than accumulating players.
 *
 *  - The hero outranks everything. While it is on screen nothing else plays,
 *    because the first viewport is the one that has to stay fast.
 *
 * Nothing here is required for the site to work — with no rendered assets the
 * whole module simply never gets a caller.
 * ---------------------------------------------------------------------- */

type Holder = {
  el: HTMLVideoElement
  /** Higher wins. The hero sits above the rest. */
  priority: number
}

let current: Holder | null = null

/**
 * Ask for the single playing slot. Returns true if granted — the caller
 * should only then start the video.
 */
export function claimPlayback(el: HTMLVideoElement, priority = 0): boolean {
  if (current && current.el !== el) {
    // A lower-priority clip never interrupts one already playing above it.
    if (current.priority > priority) return false
    pause(current.el)
  }
  current = { el, priority }
  return true
}

/** Give the slot back. Safe to call for an element that never held it. */
export function releasePlayback(el: HTMLVideoElement) {
  if (current?.el !== el) return
  current = null
}

function pause(el: HTMLVideoElement) {
  try {
    el.pause()
  } catch {
    // A pause on a video that never started is not an error worth surfacing.
  }
}

/**
 * Starts playback, tolerating the autoplay rejection that every browser
 * throws under some combination of battery saver, low power mode and tab
 * policy. A refused play is a normal outcome here, not a failure: the poster
 * stays up and the page is still correct.
 */
export async function tryPlay(el: HTMLVideoElement): Promise<boolean> {
  try {
    await el.play()
    return true
  } catch {
    return false
  }
}
