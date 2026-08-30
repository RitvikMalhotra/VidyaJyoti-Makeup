# S.L.N. Digital Studio — website

A production-ready marketing site for **S.L.N. Digital Studio**, a photography
studio in Miyapur, Hyderabad. Built to turn visitors into calls, WhatsApp
enquiries and bookings.

React 19 · TypeScript · Tailwind CSS 4 · Vite 7 — and nothing else.
No animation library, no UI kit, no icon package: the intro sequence, the
scroll parallax, the word-by-word headings and the ticker are all hand-built on
one shared rAF loop.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # -> dist/
npm run preview
```

---

## Content policy

Everything the site says about the business comes from its public Google
listing — the profile details and the customer reviews. Nothing is invented:
no prices, no packages, no awards, no years in business, no client counts, no
team titles, no partnerships, no testimonials beyond the real ones.

Where a fact was missing, the design works around its absence instead of
filling the gap. Two examples:

- **Maternity sessions are not advertised.** Nothing in the supplied
  information supports them. Family occasions are covered under *Events &
  Functions*, which the reviews do support.
- **Two reviews are shown truncated**, exactly as Google truncates them, and
  labelled *"Shown as it appears on Google"* rather than being completed.

Each service in `src/content/images.ts` carries an `evidence` field naming the
review or listing theme that justifies it. It is never rendered — it is there
so any claim on the page can be traced back to its source.

Business facts live in one place: **`src/content/business.ts`**. Change the
phone number there and every `tel:` link, WhatsApp deep link, map URL and
piece of copy follows.

---

## Photographs

The site ships with **no stock photography**. Every picture slot renders an
art-directed placeholder plate, printed with its name and art-direction brief,
until the studio's own work is supplied.

To fill them: drop files into `src/assets/photos/` named after the slot —
`hero-primary.jpg`, `gal-wedding-01.jpg`, and so on. The placeholder
disappears automatically.

**See [`src/assets/photos/README.md`](src/assets/photos/README.md) for the full
slot list**, ratios and briefs. Six slots correspond to photographs already on
the Google listing and can be filled straight from there.

---

## Conversion paths

There is no backend, and the site does not pretend otherwise.

| Path | Where |
| --- | --- |
| **WhatsApp** (primary) | Hero, every service row, testimonials, enquiry form, final CTA, mobile bar, mobile menu |
| **Call** | Sticky nav, enquiry section, location, final CTA, mobile bar, footer |
| **Book a Shoot** | Sticky nav + hero — anchors to the enquiry section |
| **Get Directions** | Location section, deep-linked to Google Maps |

The enquiry form composes a complete WhatsApp message from the four fields and
opens it addressed to the studio's real number. The enquiry genuinely arrives;
nothing is stored on the site. Each service's *Enquire* link opens WhatsApp
pre-filled with that specific occasion, so the studio knows what the enquiry is
about before reading a word.

On mobile a persistent bottom bar keeps **WhatsApp** and **Call** one tap away
from every point on the page.

---

## Structure

```
src/
  content/          the single source of truth — edit copy and facts here
    business.ts       name, address, phone, hours, rating; link builders
    reviews.ts        real Google reviews, quoted verbatim
    images.ts         image manifest: slots, services, gallery
  lib/
    hooks.ts          scroll reveal, sticky nav state, body lock, swipe
    hours.ts          live open/closed, evaluated in Asia/Kolkata
  components/
    ui/               StudioImage, Lightbox, Reveal, Actions, Icons, …
    layout/           Navbar + mobile menu, MobileActionBar, Footer
    sections/         one file per section of the page
  index.css         design tokens, type scale, motion primitives
```

Page order follows the navigation order, so every nav link lands where the
visitor expects.

---

## Design notes

**The idea.** A darkroom and an archive. The page sits in a dark, warm room —
`#17130f`, with deeper rooms (`#0c0a08`) cut into it for the full-bleed frames.
It is genuinely low light but never neutral black: red leads green leads blue
at every level, so it reads as a room with the lamps down rather than as a
void, and the photographs are the only truly bright things on the page. There is exactly one accent, a vermillion (`#d4592e`),
which is both the safelight a darkroom is lit by and the auspicious red of the
weddings this studio photographs.

- **Type.** *Fraunces* for display, with its `SOFT` and `WONK` axes on, so the
  headline letterforms have actual quirk in them. *Bricolage Grotesque* for
  body and UI, set through its `wdth` and `opsz` axes rather than at defaults —
  a grotesque with character, not a neutral system stand-in.
- **Emphasis is drawn, not italicised.** Where a headline needs a beat, a
  vermillion stroke inks itself in underneath the word (`<Mark>`). It is used
  five times across the whole page, deliberately.
- **Labels are sentence case.** Buttons say "Book a shoot", not
  "BOOK A SHOOT" — and they fill from the bottom edge on hover rather than
  crossfading their background.
- **Chapter rules.** Each section opens with a ghosted numeral and a label
  sitting on a rule that runs out to the edge of the measure.
- **Reserved image frames are toned like photographic paper** hung on the dim
  wall, so the page reads as designed before any files land.
- **Surfaces alternate** between `surface`, `surface-2` and the deeper `room`,
  which is what stops a dark page reading as one flat field.

## Motion

Everything runs through `src/lib/scroll.ts` — one `requestAnimationFrame` loop
for the whole page.

| Effect | Where |
| --- | --- |
| Opening sequence | A sheet of photographic paper splits into blinds and lifts off the dim room (~2.2s, `Intro.tsx`) |
| Word-by-word headlines | Every `<h1>`/`<h2>`, each word swinging up out of its own clipping box |
| Drawn emphasis stroke | Five headlines, `stroke-dashoffset` timed to land after the word does |
| Hero drift + dissolve | The hero block parallaxes up and fades as the page leaves it |
| In-frame image parallax | Photographs ease inside their frames; portfolio columns travel at different rates |
| Counting figures | 4.6 and 614 count up once as the proof strip arrives |
| Scroll-reactive ticker | The band of occasions drifts on its own and is pushed along by scrolling |
| Read-progress rule | Vermillion line across the foot of the sticky nav |
| Curtain reveals | Photographs wipe open; text drifts up |

The opening sequence is skipped entirely under `prefers-reduced-motion`, and
the hero renders finished rather than animating in.

### Why the parallax is smooth

Three things, and all three matter:

1. **No layout reads in the loop.** Each element's document offset is measured
   once — on register, on resize, when it scrolls into view, and after web
   fonts settle — and every frame derives its viewport position from `scrollY`
   arithmetic. Calling `getBoundingClientRect()` on twenty frames every tick is
   what makes a wall of images stutter.
2. **Frames keep coming until values settle.** A scroll event wakes the loop
   and the loop re-schedules itself while anything is still easing, so a
   transform is never a frame behind the scroll. It parks when everything has
   settled.
3. **Smoothing is time-based.** Parallax eases toward its target with a
   framerate-independent factor, so it behaves identically at 60Hz and 120Hz.

Two supporting details: `will-change: transform` is added and removed by the
engine as frames enter and leave the viewport rather than being left on
permanently, and there are **no `mix-blend-mode` overlays anywhere** — blended
layers force the compositor to re-blend large areas on every scrolled frame,
which was the single most expensive thing on the page.

Measured over a 140-frame scroll through the portfolio: median frame 16.6ms,
p99 18.9ms, one frame over 20ms, and a distinct transform on 69 of 70 frames
while a given frame is on screen.

### Two more traps in the motion code

`.reveal-curtain` starts at `clip-path: inset(0 0 100% 0)`. Chrome reports
`intersectionRatio: 0` for a fully clipped element, so the observer threshold in
`src/lib/hooks.ts` **must stay `0`** — any higher value is never crossed and
those elements never appear. `rootMargin` does the "wait until it's properly in
view" job instead.

`<Mark>` wraps *outside* the word's clipping box, never inside it: a stroke
positioned below the baseline is otherwise cut off by the very overflow that
makes the word reveal work.

## Accessibility

Semantic landmarks and headings; a skip link; visible focus rings; labelled
form fields; `aria-current` on carousel controls; keyboard-operable lightbox
(`←` `→` `Esc`) that restores focus on close; the mobile menu traps scroll and
closes on `Esc`; tap targets at least 44px. Placeholder plates expose their
brief as an accessible label so the page still describes itself before the
photographs land.

Structured data (`PhotographyBusiness` JSON-LD in `index.html`) carries the
address, phone, daily opening hours and the 4.6/614 aggregate rating — all from
the listing.

---

## Before going live

1. Add the studio's photographs (see the slot list above).
2. Point `<link rel="canonical">` and `og:url` in `index.html` at the real domain.
3. Add an `og:image` once a hero photograph exists — it is deliberately absent
   rather than pointing at a placeholder.
4. Confirm the phone number in `src/content/business.ts` is the one the studio
   wants enquiries on, and that it has WhatsApp.
