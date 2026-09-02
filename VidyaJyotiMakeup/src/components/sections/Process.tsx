import { process } from '../../content/business'
import { Section, SectionHead } from '../ui/SectionHead'
import { Reveal } from '../ui/Reveal'
import { useMotion } from '../../lib/motion'

/* A hairline that draws itself as the section is read. It is the only thing
   on the page tying the four steps together, so it earns its frame budget. */
function Thread() {
  const ref = useMotion<HTMLDivElement>((el, geom, ctx) => {
    const p = Math.max(0, Math.min(1, (ctx.vh * 0.85 - geom.top) / (geom.height * 0.9)))
    el.style.transform = `scaleY(${p.toFixed(3)})`
  })

  return (
    <div
      aria-hidden="true"
      className="absolute left-[7px] top-2 hidden h-[calc(100%-1rem)] w-px bg-ink-line md:block"
    >
      <div ref={ref} className="h-full w-full origin-top bg-gold/70" />
    </div>
  )
}

export function Process() {
  return (
    <Section id="process">
      <SectionHead
        eyebrow="How it works"
        title="Nothing about the morning should be a surprise."
        intro="The wedding day is the worst possible time to find out how a look photographs. So it is settled long before."
      />

      <div className="relative mt-14 md:mt-20 md:pl-14">
        <Thread />

        <ol className="flex flex-col gap-12 md:gap-16">
          {process.map((step, i) => (
            <li key={step.n} className="relative">
              <Reveal delay={i * 80}>
                <div className="md:grid md:grid-cols-12 md:gap-10">
                  <div className="md:col-span-3">
                    <span className="eyebrow">Step {step.n}</span>
                    <h3 className="display-md mt-3 text-ivory">{step.title}</h3>
                  </div>
                  <p className="mt-4 max-w-2xl text-pretty leading-relaxed text-ivory/65 md:col-span-9 md:mt-0">
                    {step.body}
                  </p>
                </div>
              </Reveal>

              {/* The node sits on the thread, aligned to the step heading. */}
              <span
                aria-hidden="true"
                className="absolute -left-14 top-2 hidden h-[15px] w-[15px] rounded-full border border-gold/50 bg-ink md:block"
              >
                <span className="absolute inset-[4px] rounded-full bg-gold" />
              </span>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  )
}
