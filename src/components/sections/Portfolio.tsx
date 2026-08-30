import { useMemo, useState } from 'react'
import {
  gallery,
  galleryCategories,
  type Photo,
  type PhotoCategory,
} from '../../content/images'
import { useMediaQuery } from '../../lib/hooks'
import { StudioImage } from '../ui/StudioImage'
import { Lightbox } from '../ui/Lightbox'
import { Reveal } from '../ui/Reveal'
import { SplitText } from '../ui/SplitText'
import { ExpandIcon } from '../ui/Icons'
import { WhatsAppLink } from '../ui/Actions'

type Filter = 'All' | PhotoCategory

const FILTERS: Filter[] = ['All', ...galleryCategories]

/**
 * The portfolio. A curated wall — mixed aspect ratios flowing through CSS
 * columns — rather than a grid of equal tiles, so it reads like an exhibition
 * hang instead of a product listing.
 */
export function Portfolio() {
  const [filter, setFilter] = useState<Filter>('All')
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const wide = useMediaQuery('(min-width: 1024px)')
  const medium = useMediaQuery('(min-width: 640px)')
  const columnCount = wide ? 3 : medium ? 2 : 1

  const photos = useMemo(
    () => (filter === 'All' ? gallery : gallery.filter((p) => p.category === filter)),
    [filter],
  )

  /**
   * Pack the wall by hand rather than with CSS columns, which fill each column
   * top-to-bottom and so scramble the reading order. Greedy shortest-column
   * placement keeps roughly left-to-right order and balances the column heights
   * — a photograph's height is proportional to 1/ratio.
   */
  const columns = useMemo(() => {
    const cols: { photo: Photo; index: number }[][] = Array.from(
      { length: columnCount },
      () => [],
    )
    const heights = new Array<number>(columnCount).fill(0)

    photos.forEach((photo, index) => {
      let shortest = 0
      for (let i = 1; i < columnCount; i++) {
        if (heights[i] < heights[shortest]) shortest = i
      }
      cols[shortest].push({ photo, index })
      heights[shortest] += 1 / photo.ratio
    })

    return cols
  }, [photos, columnCount])

  return (
    <section id="portfolio" className="grain relative bg-surface py-24 lg:py-32">
      <div className="mx-auto w-full max-w-[1560px] px-5 sm:px-8 lg:px-12">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <Reveal className="flex items-center gap-4 sm:gap-6">
              <span className="chapter-num text-lg">04</span>
              <span className="label">Selected work</span>
              <span className="rule hidden flex-1 sm:block" aria-hidden />
            </Reveal>
            <SplitText
              as="h2"
              text="The portfolio."
              delay={90}
              className="display-lg mt-6"
            />
            <Reveal delay={280} className="mt-6">
              <p className="body-lg">
                Weddings, ceremonies, first birthdays and portraits — photographed in
                Miyapur and across Hyderabad.
              </p>
            </Reveal>
          </div>

          {/* Filters */}
          <Reveal delay={220} className="-mx-5 overflow-x-auto px-5 no-scrollbar sm:mx-0 sm:px-0">
            <div
              role="tablist"
              aria-label="Filter photographs by occasion"
              className="flex items-center gap-7 whitespace-nowrap"
            >
              {FILTERS.map((f) => (
                <button
                  key={f}
                  type="button"
                  role="tab"
                  aria-selected={filter === f}
                  onClick={() => {
                    setFilter(f)
                    setOpenIndex(null)
                  }}
                  data-active={filter === f}
                  className="link-draw pb-1 text-[0.82rem] font-medium text-fg-3 transition-colors duration-400 hover:text-fg data-[active=true]:text-accent"
                >
                  {f}
                </button>
              ))}
            </div>
          </Reveal>
        </div>

        {/* Wall */}
        <div className="mt-14 flex gap-4 sm:gap-5 lg:gap-6">
          {columns.map((column, colIndex) => (
            <div key={colIndex} className="flex min-w-0 flex-1 flex-col gap-4 sm:gap-5 lg:gap-6">
              {column.map(({ photo, index }, rowIndex) => (
                <Reveal key={photo.id} curtain delay={rowIndex === 0 ? colIndex * 90 : 0}>
                  <button
                    type="button"
                    onClick={() => setOpenIndex(index)}
                    aria-label={`Open ${photo.label} — ${photo.alt}`}
                    className="group relative block w-full cursor-pointer overflow-hidden text-left"
                  >
                    <StudioImage
                      photo={photo}
                      zoom
                      parallax={colIndex % 2 === 0 ? 34 : 54}
                      sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 31vw"
                      className="w-full"
                    />

                    {/* Hover veil */}
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-0 bg-deep/55 opacity-0 transition-opacity duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-100"
                    />
                    <span className="pointer-events-none absolute inset-x-0 bottom-0 flex translate-y-3 items-end justify-between gap-3 p-5 opacity-0 transition-all duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0 group-hover:opacity-100">
                      <span>
                        <span className="block text-[0.68rem] font-semibold tracking-[0.12em] text-accent-2 uppercase">
                          {photo.category}
                        </span>
                        <span className="mt-1.5 block font-display text-xl text-fg">
                          {photo.label}
                        </span>
                      </span>
                      <span className="mb-1 flex h-9 w-9 shrink-0 items-center justify-center border border-fg/40 text-fg">
                        <ExpandIcon />
                      </span>
                    </span>
                  </button>
                </Reveal>
              ))}
            </div>
          ))}
        </div>

        <Reveal className="mt-16 flex flex-col items-center gap-5 border-t border-rule pt-14 text-center">
          <p className="body-base max-w-md">
            Looking for something specific? Tell us the occasion and we&rsquo;ll share
            relevant work.
          </p>
          <WhatsAppLink
            variant="outline"
            message="Hello S.L.N. Digital Studio, I'd like to see more of your work. The occasion I'm planning is:"
          >
            Explore Our Work
          </WhatsAppLink>
        </Reveal>
      </div>

      <Lightbox
        photos={photos}
        index={openIndex}
        onClose={() => setOpenIndex(null)}
        onIndexChange={setOpenIndex}
      />
    </section>
  )
}
