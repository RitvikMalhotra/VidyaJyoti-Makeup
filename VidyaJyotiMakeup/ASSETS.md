# Cinematic assets — production brief

The website is finished and shippable **without a single one of these files.**
Nothing below is a dependency; each item is one optional moment that upgrades
itself the day the render exists.

This document is the bridge between the Higgsfield generation step and the
code. Follow it in order and the site picks the assets up with a one-line
change per clip.

---

## Status

**Not generated.** The Higgsfield account attached to this project reports
`credits: 0` on the `free` plan, with free-trial unlimited generations
`available: false`. Every `generate_video` call fails until the account is
topped up, so all five slots ship as `available: false` and the site runs on
its still frames and its code-driven motion.

---

## Budget

Costs verified against the live pricing preflight (`get_cost`), Seedance 2.5,
audio off. The model bills per second: **6.5 credits/s at 720p, 9 credits/s at
1080p.**

| Slot | File | Duration | Res | Credits |
|---|---|---|---|---|
| Hero loop | `hero-loop` | 6s | 1080p | 54 |
| Signature veil | `liquid-veil` | 4s | 720p | 26 |
| Portfolio flow A | `flow-a` | 4s | 720p | 26 |
| Portfolio flow B | `flow-b` | 4s | 720p | 26 |
| Atmosphere | `atmosphere` | 8s | 720p | 52 |
| | | | **One take each** | **184** |

Budget for two or three takes per slot in practice — the hero especially,
because it is the one clip where a wrong result is obvious. A realistic figure
is **400–550 credits** for the set.

Seedance accepts durations of 4–30s. Four seconds is the floor, which is why
nothing here is shorter.

---

## The rules that matter

These are the constraints that separate this from "AI effects added to a
website". Every prompt below already encodes them; keep them if you rewrite.

- **The bride's identity is never altered.** For the hero, generate with
  `mode: "omni_reference"` and the real photograph as `start_image`, not from
  text. Text-to-video invents a face. Reject any take where the features,
  skin texture or proportions have shifted — that is a hard fail, not a
  preference.
- **Movement is barely perceptible.** A few percent of camera push, hair and
  fabric responding to air. If a viewer notices the effect before they notice
  the makeup, it is wrong.
- **No gaming VFX.** No explosions, fire, sparks, lens flares, aggressive
  distortion, sci-fi or cyberpunk grading, and no particle storms. The
  reference is a luxury cosmetics campaign, not a game trailer.
- **Fluid means fabric and cosmetics.** Silk, liquid gold, translucent cream,
  champagne, light through a veil. Weightless and slow.
- **Audio off.** `generate_audio: false`. Every clip on this site plays muted,
  and the audio track is dead weight in the file.

---

## The five slots

Each one's prompt also lives in `src/content/media.ts`, next to the slot it
fills, so a re-render months from now matches the original instead of drifting
into a different film.

### 1. `hero-loop` — 6s, 1080p, 16:9

The first viewport. Generate from **`public/photos/hero-2000.webp`** as
`start_image` — the red-silk bridal portrait already on the page. She stays
recognisable while the camera pushes in a few percent, loose hair and the
saree edge drift on a breath of air, warm particles cross the light, and
foreground and background separate slightly in depth. Must loop seamlessly.

This is a real client, photographed on her wedding day. It is the only slot
where identity is at stake, and a take that alters her features is a hard
fail — not a preference.

### 2. `liquid-veil` — 4s, 720p, 16:9

The signature transition between the portfolio and the services. Abstract
translucent liquid in champagne and gold, moving like silk falling through
water, light refracting through it. **Black background** — it composites over
the page. No splash, no impact.

### 3 & 4. `flow-a`, `flow-b` — 4s, 720p, 16:9

The two portfolio wipes. A is flowing silk, ivory into rose gold, crossing
left to right. B is translucent cosmetic cream swirling and clearing, macro,
against black. Both read as transition mattes in a fashion film: luminance
carries the wipe, no hard edges.

Two only. A transition that happens between every image is a template; one
that happens twice is an edit.

### 5. `atmosphere` — 8s, 720p, 16:9

Behind the featured review and the enquiry section, at 45% and 40% opacity. Very slow drifting haze and
suspended gold dust in a dark warm room. Almost still. Text sits on top of it,
so it must not compete — if it reads as a video, it is too busy.

---

## Encoding

Higgsfield returns a single MP4. The site expects a WebM and an MP4 per slot,
both compressed hard, because these are decoration on a page that has to stay
fast.

```bash
# WebM (VP9) — the primary source, meaningfully smaller
ffmpeg -i hero-loop-raw.mp4 -an \
  -c:v libvpx-vp9 -crf 34 -b:v 0 -row-mt 1 -pix_fmt yuv420p \
  public/media/hero-loop.webm

# MP4 (H.264) — the Safari fallback
ffmpeg -i hero-loop-raw.mp4 -an \
  -c:v libx264 -crf 25 -preset slow -movflags +faststart -pix_fmt yuv420p \
  public/media/hero-loop.mp4

# Poster — the frame the page shows before, instead of, and underneath the video
ffmpeg -i hero-loop-raw.mp4 -vf "select=eq(n\,0)" -q:v 3 \
  public/photos/hero-poster.jpg
```

`-an` strips audio. `+faststart` moves the MP4 index to the front so it can
start streaming before it has fully downloaded.

**Size targets:** hero under 1.5 MB, the rest under 700 KB each. If a clip
misses its target, shorten it before raising the CRF — a shorter loop reads as
deliberate, a mushy one reads as broken.

---

## Wiring a finished clip in

Three steps, per clip:

1. Drop `<base>.webm` and `<base>.mp4` into `public/media/`.
2. Save the poster into `public/photos/` and set `poster` on the slot.
3. Flip `available: false` → `true` in `src/content/media.ts`.

That is the whole integration. `src/components/ui/Cinematic.tsx` reads the
manifest and does the rest.

Note that `public/media/*.mp4` and `*.webm` are **gitignored** — the manifest
is versioned, the binaries are not. Ship them with your deploy, or host them
on a CDN and change `MEDIA_DIR` in `media.ts`.

---

## What the site does with them

`Cinematic.tsx` enforces the performance rules so no individual slot has to.
It refuses to load video when **any** of these hold:

- the asset is `available: false`
- the visitor has `prefers-reduced-motion: reduce`
- the connection reports `saveData`, `2g` or `slow-2g`
- the viewport is under 768px and the caller did not pass `allowOnMobile`

In every one of those cases not one byte of video is requested and the still
frame renders instead.

On top of that, `src/lib/video.ts` holds a **single playback slot**: only one
clip can be playing anywhere on the page, claimed when it scrolls into view
and released when it leaves, with the hero outranking everything else. Only
the hero is allowed `preload="auto"`; every other clip is `preload="none"`.

---

## If these are never generated

The site does not degrade — it was built to stand up on its own:

- **The signature transition** is a canvas of drifting wave bands, drawn in
  `LiquidVeil.tsx`, scrubbed by scroll position and running only while it is
  on screen. That is the real transition, not a stand-in.
- **The dimensional frames** are three-plane parallax in `DepthImage.tsx`,
  driven by pointer and scroll. Three portfolio frames and the artist portrait
  carry it.
- **The portfolio wipes** fall back to a scroll-driven silk sweep, on two
  frames out of fifteen.
- **The hero** is her real bridal photograph, drifting and scaling as the page
  moves.

This is worth being blunt about: the site was reviewed section by section in a
real browser in this state, and it does not read as though anything is
missing. The clips would deepen it. They would not rescue it.

All of it is one shared `requestAnimationFrame` loop that parks itself when
nothing is on screen, and none of it starts at all under reduced motion.
