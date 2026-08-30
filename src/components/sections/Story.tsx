import { introPhoto, introPhotoSecondary } from '../../content/images'
import { StudioImage } from '../ui/StudioImage'
import { Reveal } from '../ui/Reveal'
import { SplitText } from '../ui/SplitText'
import { TextLink } from '../ui/Actions'

export function Story() {
  return (
    <section id="story" className="grain relative overflow-hidden bg-surface py-24 lg:py-36">
      <div className="mx-auto w-full max-w-[1560px] px-5 sm:px-8 lg:px-12">
        <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Reveal className="flex items-center gap-4 sm:gap-6">
              <span className="chapter-num text-lg">01</span>
              <span className="label">Why it matters</span>
              <span className="rule hidden flex-1 sm:block" aria-hidden />
            </Reveal>

            <SplitText
              as="h2"
              text={'Some moments\nhappen once.\nThe photographs\nstay.'}
              mark="stay."
              delay={80}
              stagger={58}
              className="display-lg mt-7"
            />

            <Reveal delay={340} className="mt-8 space-y-5">
              <p className="body-lg">
                A wedding morning. A first birthday. A ceremony a family has waited years
                for. None of it comes back — which is why how it was photographed is the
                part you live with.
              </p>
              <p className="body-base">
                S.L.N. Digital Studio photographs celebrations, milestones, portraits and
                special occasions for families across Miyapur and Hyderabad — candid and
                traditional, stills and film, finished in albums made to be kept.
              </p>
            </Reveal>

            <Reveal delay={430} className="mt-10">
              <TextLink href="#services">See what we photograph</TextLink>
            </Reveal>
          </div>

          {/* Overlapped rather than stacked in a grid. */}
          <div className="lg:col-span-6 lg:col-start-7">
            <div className="relative pb-16 pl-10 sm:pb-20 sm:pl-16 lg:pb-24 lg:pl-20">
              <Reveal curtain delay={120}>
                <div className="group relative overflow-hidden">
                  <StudioImage
                    photo={introPhoto}
                    zoom
                    parallax={40}
                    sizes="(max-width: 1024px) 92vw, 42vw"
                    className="w-full"
                  />
                </div>
              </Reveal>

              <Reveal
                curtain
                delay={340}
                className="absolute bottom-0 left-0 w-[46%] max-w-[15rem] sm:w-[42%]"
              >
                <div className="group relative overflow-hidden ring-1 ring-rule-2 shadow-[0_30px_70px_-22px_rgba(0,0,0,0.8)]">
                  <StudioImage
                    photo={introPhotoSecondary}
                    zoom
                    compact
                    parallax={26}
                    sizes="(max-width: 1024px) 40vw, 18vw"
                    className="w-full"
                  />
                </div>
              </Reveal>

              <Reveal
                delay={520}
                className="absolute right-0 bottom-6 hidden max-w-[10rem] text-right lg:block"
              >
                <span className="meta block leading-relaxed">
                  Weddings · Events
                  <br />
                  Birthdays · Portraits
                </span>
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
