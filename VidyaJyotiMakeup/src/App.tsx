import { useCallback, useState } from 'react'
import { Navbar } from './components/layout/Navbar'
import { MobileActionBar } from './components/layout/MobileActionBar'
import { Footer } from './components/layout/Footer'
import { Hero } from './components/sections/Hero'
import { ProofStrip } from './components/sections/ProofStrip'
import { Portfolio } from './components/sections/Portfolio'
import { Services } from './components/sections/Services'
import { Process } from './components/sections/Process'
import { About } from './components/sections/About'
import { FeaturedQuote } from './components/sections/FeaturedQuote'
import { Testimonials } from './components/sections/Testimonials'
import { Enquire } from './components/sections/Enquire'
import { Location } from './components/sections/Location'
import { FinalCta } from './components/sections/FinalCta'
import { LiquidVeil } from './components/ui/LiquidVeil'
import { SectionRule } from './components/ui/SectionRule'
import { Intro } from './components/ui/Intro'

export default function App() {
  // Held false until the opening card lifts, so the hero animates in behind
  // it rather than sitting there already finished underneath.
  const [started, setStarted] = useState(false)
  const onIntroDone = useCallback(() => setStarted(true), [])

  return (
    <div className="grain">
      <Intro onDone={onIntroDone} />
      <Navbar />

      <main>
        <Hero started={started} />
        <ProofStrip />
        <Portfolio />

        {/* The one signature transition on the site. It sits here, between the
            work and the offer, because this is the single point on the page
            where the reader changes mode — from looking to deciding. */}
        <LiquidVeil />

        <Services />

        {/* Every boundary below measured ~250px of empty ink once the two
            sections' padding met. The hairline sits at the join, which is the
            middle of that band, and turns the void into a deliberate pause.
            Boundaries that already carry a line of their own — the quote's
            border-y, the footer's border-t — are left alone. */}
        <SectionRule />

        <Process />
        <SectionRule />

        <About />
        <FeaturedQuote />
        <Testimonials />
        <SectionRule />

        <Location />
        <SectionRule />

        <Enquire />
        <SectionRule />

        <FinalCta />
      </main>

      <Footer />
      <MobileActionBar />
    </div>
  )
}
