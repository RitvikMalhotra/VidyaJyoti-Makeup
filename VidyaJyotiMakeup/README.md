# Vidya Jyoti — Bridal Makeup Artistry

A production React + Vite site for a bridal makeup artist in Kondapur,
Hyderabad, built so the photography is the subject and the motion stays
underneath it.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # tsc -b && vite build  →  dist/
npm run preview
```

React 19 · Vite 7 · Tailwind 4 · TypeScript (strict). No animation library, no
UI kit, no state manager — the motion is one shared rAF loop in
`src/lib/motion.ts` and everything else is CSS.

---

## Content

Everything real lives in `src/content/` and nothing is invented.

| File | Holds |
|---|---|
| `business.ts` | Phone, WhatsApp, Instagram, address, rating, services, hair list, process |
| `photos.ts` | **Generated.** The photo manifest — widths, ratios, blur placeholders |
| `portfolio.ts` | Which photograph goes in which frame, with alt text and captions |
| `testimonials.ts` | Real Google reviews, quoted verbatim |
| `media.ts` | The optional cinematic asset manifest |

Sources: the photographs, bio and service list come from Vidya Jyoti's own
lookbook (`Look book_vjMUA.pdf`, gitignored — 60MB); the rating, review count
and testimonials come from her public Google Business listing.

**The one gap: no pricing.** Every service renders "Price on enquiry", which
is normal for bridal work. Set `from` on a service in `business.ts` and it
shows a figure instead.

### Regenerating the photographs

`src/content/photos.ts` and everything in `public/photos/` are generated from
the lookbook PDF. Seventeen photographs are extracted, cropped to their frame
ratios, and written out as WebP at up to three widths each, plus a 20-byte-ish
inline blur placeholder. Total: ~4.5 MB for the whole set.

```bash
python -m pip install pypdf pillow
# then re-run the extraction and encode steps documented in git history
```

The crop favours the top of each frame — faces sit in the upper third of every
one of these portraits, so a centred crop cuts foreheads.

---

## Structure

```
src/
  content/      every real-world fact and asset declaration
  lib/
    motion.ts     the shared scroll + pointer rAF loop
    hooks.ts      reveal, media queries, body lock, swipe
    video.ts      the single-playback-slot policy
  components/
    ui/           Cinematic, DepthImage, LiquidVeil, StudioImage, Lightbox…
    sections/     Hero, ProofStrip, Portfolio, Services, Process, About,
                  FeaturedQuote, Testimonials, Location, Enquire, FinalCta
    layout/       Navbar, Footer, MobileActionBar
```

## The opening card

`Intro.tsx` shows a **V.J** monogram, a gold rule and the name over ~2.6s,
then the camera flies *through* the card into the hero over ~1.15s.

The first version faded a solid ink plane out over a hero that is also
ink-dark. A dark-on-dark crossfade is invisible, so it read as a hard cut. The
fix was depth, not duration — three sibling layers sharing one `perspective`
and moving at very different rates:

| layer | move |
|---|---|
| plane | swells to 1.14 and clears |
| bloom | gold light expanding to 2.9x through the gap it leaves |
| monogram | `translateZ(840px)`, scaling and blurring past the viewer |

The other half is the hero, which settles out of a `scale(1.18)` push-in with
a focus pull over 1.7s, starting at the same instant. Without that the card
flies off a static picture and it still reads as two states rather than one
continuous camera move.

Three things that are load-bearing here:

- **The layers are siblings, not nested.** `filter` forces
  `transform-style: flat` on an element's descendants, so a blurred parent
  would silently collapse a child's `translateZ` back into the plane.
- **`HeroStill` has two wrappers.** The motion loop writes `transform` on the
  inner one every frame, so the arrival animation has to live on a separate
  outer element or the loop overwrites it mid-flight.
- **The durations are written literally into the `animate-[…]` classes.**
  Tailwind scans source text, so a class built from a template literal is
  never seen, never generated, and the animation silently does nothing.
  `EXIT_MS` exists only for the unmount timer and must be kept in step.

The hero's reveals take `enabled={started}` so they fire as the card leaves.
The animation shorthand uses fill mode `both`, not `forwards`: the delayed
entrance beats must hold their 0% state *during* the delay, or each element
flashes at full opacity before its turn.

Other constraints it still obeys: it never blocks the page (the hero is
mounted and loading its photograph throughout), it plays once per session via
a wrapped `sessionStorage` read, any key/click/scroll skips it, and under
`prefers-reduced-motion` it never mounts.

## The motion engine

One `requestAnimationFrame` loop drives every parallax layer, depth frame and
the section transition. It is one file because the alternative — a scroll
handler per component — is what makes a page of images stutter.

- **No layout reads inside the loop.** Offsets are measured on register, on
  resize, on font load and on intersection; frames derive position from
  `scrollY` arithmetic.
- **Time-based smoothing**, so 120Hz settles in the same wall-clock time as
  60Hz.
- **It parks itself** when nothing is on screen and every value has settled.
- **It never starts** under `prefers-reduced-motion` — no loop, no transforms,
  no bindings. The layout is designed to be complete without any of it.

### A trap worth knowing about

`DepthImage` and `Cinematic` build their frames from absolutely positioned
planes, so the container **must** reserve an aspect ratio or it measures zero
high and the photograph silently never appears. `DepthImage` now defaults to
the manifest ratio for this reason. If you add a component in this family,
reserve the ratio.

Relatedly: never hardcode a position utility in a component that also accepts
`className` from its call sites. Tailwind emits `.relative` after `.absolute`,
so the cascade picks `relative` regardless of the order in the attribute.

## Section dividers, and the gaps they fill

Every section is `py-24 md:py-32`. Where two of them meet those paddings add
up, and a pixel scan of the built page found seven bands of roughly 250px
with nothing in them at all — on a tall desktop window, most of a viewport of
pure ink each time. Generous spacing was reading as dead gaps.

`SectionRule.tsx` puts a gold hairline at each of those boundaries. It does
not take the space back; it gives the eye something deliberate to land on, so
the emptiness either side becomes margin around a mark instead of a hole.
Because the paddings above and below are equal, the section boundary is
already the midpoint of the gap, which is where the rule wants to be.

Boundaries that already carry a line of their own are left alone — the
featured quote's `border-y`, the footer's `border-t`. Doubling up reads as a
mistake.

The scan is worth re-running after any spacing change:

```bash
npm run build && npx vite preview --port 4319
# then screenshot the page in chunks and look for rows with no contrast
```

Run it under `prefers-reduced-motion: reduce`. Without that the reveals are
caught mid-flight and half the page measures as empty.

## The signature transition

`LiquidVeil.tsx` draws soft elliptical ribbons drifting across each other
between the work and the services.

An earlier version stacked full-width wave bands. That was wrong: every band
spanned edge to edge, they all centred near the same height, and composited
additively they fused into one hard bright stripe — worst on a short viewport,
where the whole effect compressed into a bar. Radial ribbons have no edges to
begin with, and the blur radius is now proportional to the container height, so
a short section stays as soft as a tall one.

Two things keep it from becoming a gap of its own. **`max-h` is load-bearing:**
sized in `vh` alone the block grew with the window, and at 40vh on a tall
desktop it became 540px of near-black smear. And the ribbons are held at low
alpha with the same gold hairline run through the block's centre — bright
ribbons fused into one lit band and drowned it. The line is what the eye lands
on; the drift is the light behind it.

## Images

The work grid runs at a narrower measure than the rest of the page —
`<Section measure="max-w-[60rem]">` — purely to bring the photographs down in
scale. That prop is the lever to pull if they want resizing again. It is the
right lever because the section head is capped at `max-w-3xl`, well inside any
value used here: narrowing the measure moves the grid and nothing else, and
every child keeps the container's left edge, so the tiles stay aligned with
the headline above them.

Anything that changes cell width has to change `CELL_SIZES` and `WIDE_SIZES`
with it. Both end in a pixel value rather than a `vw`, because past 1056px the
measure has capped and the cells stop growing with the viewport — a `vw`
figure would over-request from there on.

`StudioImage` paints each photograph's blur placeholder as the frame's own
background, so pictures resolve out of their own colours rather than flashing
empty boxes — on a page that is mostly photographs, that is the whole loading
experience. Every call site passes a real `sizes`, because getting that wrong
is the usual way a responsive image downloads four times the pixels it needs.

## The enquiry form

Deliberately not a form POST. There is no server, and a bridal enquiry that
silently fails is a booking lost. The fields compose a message and hand it to
WhatsApp, which is where the conversation was going to continue anyway, and
which leaves the bride holding a copy of what she sent.

## Cinematic assets

Optional throughout. See **[ASSETS.md](ASSETS.md)**.

Short version: no clip has been generated (the Higgsfield account is on the
free plan with zero credits), every slot is `available: false`, and the site
therefore requests no video at all. The signature transition, the dimensional
frames and the hero drift are real, code-driven and finished — not
placeholders waiting on a render.

## Accessibility

Visible focus rings, a skip link, a keyboard-driven lightbox that restores
focus on close, decorative motion hidden from assistive tech, real `alt` text
as a required field in the portfolio data, and a full `prefers-reduced-motion`
path that leaves nothing hidden.

## Before it goes live

- Register the domain, then uncomment the canonical and `og:url` tags in
  `index.html`.
- Confirm the Google rating and review count are still 4.9 / 55; they are in
  `business.ts` **and** in the JSON-LD block in `index.html`, and the two must
  agree or Google penalises the mismatch.
