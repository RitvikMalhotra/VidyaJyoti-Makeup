import { services, hairStyles, photoshoot } from '../../content/business'
import { Section, SectionHead } from '../ui/SectionHead'
import { Reveal } from '../ui/Reveal'

export function Services() {
  return (
    <Section id="services">
      <SectionHead
        eyebrow="Services"
        title="What a booking includes."
        intro="Taken straight from the studio's own list — makeup, hair, draping, lenses and lashes, with the skin consultation that comes before any of it."
      />

      <ul className="mt-14 divide-y divide-ink-line/70 border-y border-ink-line/70 md:mt-20">
        {services.map((service, i) => (
          <li key={service.id}>
            <Reveal delay={i * 70}>
              {/* A menu row, not a card. Cards in a grid all shout at the same
                  volume; a list lets the eye move down it in order. */}
              <article className="group grid gap-6 py-9 md:grid-cols-12 md:gap-10 md:py-12">
                <div className="md:col-span-1">
                  <span className="font-display text-2xl text-gold/45 transition-colors duration-500 group-hover:text-gold">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>

                <div className="md:col-span-4">
                  <h3 className="display-md text-balance text-ivory transition-colors duration-500 group-hover:text-gold-bright">
                    {service.name}
                  </h3>
                  <p className="mt-3 text-[0.68rem] uppercase tracking-[0.24em] text-gold/70">
                    {service.from === null
                      ? 'Price on enquiry'
                      : `From ₹${service.from.toLocaleString('en-IN')}`}
                  </p>
                </div>

                <div className="md:col-span-7">
                  <p className="max-w-2xl text-pretty leading-relaxed text-ivory/70">
                    {service.summary}
                  </p>
                  <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2">
                    {service.includes.map((item) => (
                      <li
                        key={item}
                        className="flex items-center gap-2.5 text-sm text-ivory/50"
                      >
                        <span
                          aria-hidden="true"
                          className="h-1 w-1 rounded-full bg-gold/60"
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </Reveal>
          </li>
        ))}
      </ul>

      <div className="mt-14 grid gap-6 md:grid-cols-2 md:gap-10">
        <Reveal>
          <div className="h-full border border-ink-line/70 p-8 sm:p-10">
            <p className="eyebrow">Hair</p>
            <h3 className="display-md mt-4 text-ivory">Styled in-house.</h3>
            <ul className="mt-6 flex flex-wrap gap-x-3 gap-y-3">
              {hairStyles.map((style) => (
                <li
                  key={style}
                  className="rounded-full border border-gold/20 px-4 py-1.5 text-sm text-ivory/65"
                >
                  {style}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal delay={90}>
          <div className="flex h-full flex-col justify-between border border-ink-line/70 p-8 sm:p-10">
            <div>
              <p className="eyebrow">Add-on</p>
              <h3 className="display-md mt-4 text-balance text-ivory">
                {photoshoot.title}
              </h3>
              <p className="mt-5 text-pretty leading-relaxed text-ivory/70">
                {photoshoot.body}
              </p>
            </div>
            <p className="mt-6 text-sm text-gold/70">{photoshoot.note}</p>
          </div>
        </Reveal>
      </div>
    </Section>
  )
}
