import { useCallback, useState } from 'react'
import { Navbar } from './components/layout/Navbar'
import { MobileActionBar } from './components/layout/MobileActionBar'
import { Footer } from './components/layout/Footer'
import { Intro } from './components/ui/Intro'
import { Hero } from './components/sections/Hero'
import { ProofStrip } from './components/sections/ProofStrip'
import { Story } from './components/sections/Story'
import { About } from './components/sections/About'
import { Services } from './components/sections/Services'
import { Portfolio } from './components/sections/Portfolio'
import { WhySln } from './components/sections/WhySln'
import { Testimonials } from './components/sections/Testimonials'
import { Enquire } from './components/sections/Enquire'
import { Location } from './components/sections/Location'
import { FinalCta } from './components/sections/FinalCta'

export default function App() {
  // Held false until the opening sequence lifts, so the hero animates in
  // behind the blinds rather than sitting finished underneath them.
  const [started, setStarted] = useState(false)
  const onIntroDone = useCallback(() => setStarted(true), [])

  return (
    <>
      <Intro onDone={onIntroDone} />
      <Navbar />
      <main className="pb-[var(--bar-h)]">
        <Hero started={started} />
        <ProofStrip />
        <Story />
        <About />
        <Services />
        <Portfolio />
        <WhySln />
        <Testimonials />
        <Enquire />
        <Location />
        <FinalCta />
      </main>
      <Footer />
      <MobileActionBar />
    </>
  )
}
