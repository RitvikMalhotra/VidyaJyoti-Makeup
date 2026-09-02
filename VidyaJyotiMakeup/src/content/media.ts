/* -------------------------------------------------------------------------
 * The cinematic asset manifest.
 *
 * This file is the ONLY link between the website and Higgsfield. Every clip
 * the site can play is declared here with `available: false` until its render
 * actually exists in /public/media.
 *
 * While an asset is unavailable the site never requests it, never reserves
 * bandwidth for it and never waits on it — the component falls back to the
 * still frame and the code-driven motion, and the page is complete. Flipping
 * `available` to true is the entire integration step: drop the files in
 * /public/media, flip the flag, and the moment upgrades itself.
 *
 * `prompt` is kept next to each slot on purpose. It is the brief that the
 * render must satisfy, so a re-render months from now matches the original
 * rather than drifting into a different film.
 * ---------------------------------------------------------------------- */

export type CinematicAsset = {
  id: string
  /** Basename, no extension. Expects `<base>.webm` and `<base>.mp4` in /public/media. */
  base: string
  /** Still frame. Also the permanent fallback and the video's poster. */
  poster: string | null
  /** False until the render exists. Nothing is fetched while this is false. */
  available: boolean
  /**
   * Seconds. Short by policy — these are textures, not films. Four is also
   * the hard floor Seedance accepts, so nothing here goes below it.
   */
  duration: number
  /** The generation brief. See ASSETS.md for the full production notes. */
  prompt: string
  model: string
}

const MEDIA_DIR = '/media'

export const cinematics = {
  /* The one asset allowed to preload. Everything else waits its turn. */
  hero: {
    id: 'hero',
    base: 'hero-loop',
    poster: null,
    available: false,
    duration: 6,
    model: 'seedance_2_5',
    prompt:
      'Seamless loop. Bridal portrait, South Asian bride in red and gold, ' +
      'holds absolutely still and recognisable. Camera pushes in a few ' +
      'percent over six seconds. Dupatta edge and loose hair drift on a ' +
      'barely-there breath of air. Fine warm particles float through a shaft ' +
      'of window light. Foreground and background separate slightly in depth. ' +
      'Skin texture untouched, facial features unaltered. Luxury beauty ' +
      'campaign grade, soft key light, warm ivory and gold. No VFX look.',
  },

  /* The signature moment: Portfolio dissolving into Services. */
  liquidVeil: {
    id: 'liquidVeil',
    base: 'liquid-veil',
    poster: null,
    available: false,
    duration: 4,
    model: 'seedance_2_5',
    prompt:
      'Abstract translucent liquid veil in champagne and liquid gold, moving ' +
      'like silk falling through water. Slow, weightless, continuous. Light ' +
      'passes through the fluid and refracts. Black background for screen ' +
      'blending. No splash, no impact, no particles bursting. Luxury cosmetics ' +
      'advertising texture.',
  },

  /* Selective portfolio transitions. Two only — that is what keeps them rare. */
  portfolioFlowA: {
    id: 'portfolioFlowA',
    base: 'flow-a',
    poster: null,
    available: false,
    duration: 4,
    model: 'seedance_2_5',
    prompt:
      'Soft flowing silk wipe, ivory into rose gold, crossing frame left to ' +
      'right. Fabric-like, weightless, slow shutter feel. Designed as a ' +
      'transition matte between two portraits in a fashion film. Luminance ' +
      'carries the wipe. No hard edges.',
  },
  portfolioFlowB: {
    id: 'portfolioFlowB',
    base: 'flow-b',
    poster: null,
    available: false,
    duration: 4,
    model: 'seedance_2_5',
    prompt:
      'Translucent cosmetic cream swirling and clearing, warm neutral tones, ' +
      'shot macro against black. Reads as a dissolve matte between two ' +
      'portraits. Elegant, slow, no turbulence.',
  },

  /* Atmospheric backdrop behind the closing section. Muted, decorative. */
  atmosphere: {
    id: 'atmosphere',
    base: 'atmosphere',
    poster: null,
    available: false,
    duration: 8,
    model: 'seedance_2_5',
    prompt:
      'Very slow drifting haze and suspended gold dust in a dark warm room, ' +
      'single soft light source. Almost still. Background texture for a ' +
      'website section, must not compete with text laid over it.',
  },
} as const satisfies Record<string, CinematicAsset>

export type CinematicId = keyof typeof cinematics

/**
 * Sources for a `<video>`, or null when the asset has not been rendered yet.
 * WebM first — it is meaningfully smaller — with MP4 for Safari.
 */
export function sourcesFor(asset: CinematicAsset) {
  if (!asset.available) return null
  return [
    { src: `${MEDIA_DIR}/${asset.base}.webm`, type: 'video/webm' },
    { src: `${MEDIA_DIR}/${asset.base}.mp4`, type: 'video/mp4' },
  ]
}

/** True when at least one clip exists — used to skip the whole video path. */
export const anyCinematicAvailable = Object.values(cinematics).some((a) => a.available)
