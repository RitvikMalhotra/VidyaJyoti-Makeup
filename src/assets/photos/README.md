# Studio photographs — drop them here

Every picture on the site has a **named slot**. To fill one, save the
photograph into this folder using the slot's exact name as the filename.

    src/assets/photos/hero-primary.jpg

That's the whole process. Vite picks the file up, hashes and optimises it at
build time, and the placeholder plate disappears. No code change, no config.

**Accepted formats:** `.jpg` `.jpeg` `.png` `.webp` `.avif`
(`.webp` gives the best quality-to-size ratio; `.jpg` is perfectly fine.)

**Recommended size:** roughly 2000px on the long edge. Larger is wasted;
smaller will look soft on a laptop screen.

---

## Slot list

Six slots correspond to photographs already on the Google listing and are
marked **[on listing]** — those can be filled first, straight from there.

### Key positions

| Filename | Ratio | What belongs here |
| --- | --- | --- |
| `hero-primary` | 16:9 | **[on listing]** The single strongest frame — bride or couple. Full-bleed behind the headline, so keep the subject right of centre and the left side reasonably dark. |
| `intro-editorial` | 3:4 | **[on listing]** Warm, emotive — a candid moment between family members. |
| `intro-detail` | 1:1 | A close detail: hands, jewellery, decor. Sits overlapping the frame above. |
| `about-studio-team` | 4:5 | **[on listing]** The owner/business photograph. At work rather than posed. |
| `about-interior` | 3:2 | **[on listing]** The studio interior. Reviews call it neat and clean — light it evenly. |
| `location-storefront` | 4:3 | **[on listing]** The shopfront, so first-time visitors recognise it from the street. |
| `final-cta` | 21:9 | The most cinematic wide frame available. Dark through the middle so white type reads over it. |

### Services

| Filename | Ratio | What belongs here |
| --- | --- | --- |
| `service-weddings` | 3:4 | **[on listing]** Bride portrait or ceremony frame, vertical, low key. |
| `service-events` | 3:4 | A ceremony in progress, guests visible. |
| `service-birthdays` | 3:4 | Child mid-celebration, warm colour, shallow depth. |
| `service-videography` | 3:4 | A frame that reads as cinema — motion, or a filming setup. |
| `service-studio` | 3:4 | **[on listing]** Clean studio-lit portrait on a plain backdrop. |
| `service-albums` | 3:4 | A finished album, open, at an angle in warm light. |

### Portfolio wall

Mixed ratios on purpose — the wall is meant to look hung, not tiled.

| Filename | Ratio | What belongs here |
| --- | --- | --- |
| `gal-wedding-01` | 2:3 | **[on listing]** The bride portrait. Tall — anchors the wall. |
| `gal-wedding-02` | 3:2 | **[on listing]** The couple frame. Landscape. |
| `gal-wedding-03` | 1:1 | Hands, thread, garland — a close ritual detail. |
| `gal-wedding-04` | 3:4 | An unposed family reaction during the ceremony. |
| `gal-event-01` | 3:2 | Wide establishing frame of a function in full swing. |
| `gal-event-02` | 2:3 | A traditional ceremony frame. Tall. |
| `gal-event-03` | 4:3 | Group frame — several generations together. |
| `gal-birthday-01` | 3:4 | Child at the centre of a decorated setup. |
| `gal-birthday-02` | 3:2 | The cake moment — motion, warm light, real reactions. |
| `gal-birthday-03` | 1:1 | A styled decor detail. |
| `gal-portrait-01` | 2:3 | **[on listing]** The portrait. Tall, low key. |
| `gal-portrait-02` | 1:1 | Close head-and-shoulders, side light. |
| `gal-portrait-03` | 3:4 | Family portrait, warm and relaxed. |
| `gal-studio-01` | 4:3 | **[on listing]** The studio interior. |
| `gal-studio-02` | 3:4 | A subject being photographed on the studio floor. |
| `gal-studio-03` | 3:2 | **[on listing]** The exterior. |

---

## Notes

- **Ratios are a guide, not a rule.** A file that isn't the listed ratio still
  works — it is cropped to fill its frame (and shown whole in the lightbox).
  Matching the ratio just avoids losing anything you wanted in shot.
- **Alt text and briefs** live in `src/content/images.ts`. Change them there,
  and add or remove gallery slots in the same file.
- **No stock photography.** Slots are deliberately left as visible placeholders
  until the studio's own work is supplied — nothing on this site should imply
  work S.L.N. didn't shoot.
