import { useState } from 'react'
import { business, services, whatsappLink, mailLink, telLink } from '../../content/business'
import { Section, SectionHead } from '../ui/SectionHead'
import { Reveal } from '../ui/Reveal'
import { PrimaryAction, GhostAction } from '../ui/Actions'
import { WhatsAppIcon, PhoneIcon } from '../ui/Icons'
import { Cinematic } from '../ui/Cinematic'
import { cinematics } from '../../content/media'

/* -------------------------------------------------------------------------
 * The enquiry.
 *
 * There is no form POST here and that is deliberate. A contact form needs a
 * server, a spam story and somewhere for the message to land, and a bridal
 * enquiry that silently fails is a booking lost. Instead the fields compose
 * the message and hand it to WhatsApp — which is where this conversation was
 * always going to continue, and which gives the bride a copy of what she sent.
 *
 * With no WhatsApp number configured it composes an email instead, and with
 * neither it degrades to the plain contact details.
 * ---------------------------------------------------------------------- */

const FIELD =
  'w-full border-b border-ink-line bg-transparent py-3 text-ivory placeholder:text-ivory/30 transition-colors focus:border-gold focus:outline-none'

export function Enquire() {
  const [name, setName] = useState('')
  const [date, setDate] = useState('')
  const [venue, setVenue] = useState('')
  const [service, setService] = useState(services[0]?.name ?? '')
  const [note, setNote] = useState('')

  // Only the fields actually filled in reach the message — an enquiry full of
  // blank labels reads worse than a short one.
  const details = [
    name && `My name is ${name}.`,
    date && `My wedding date is ${date}.`,
    venue && `The venue is ${venue}.`,
    service && `I am looking at: ${service}.`,
  ].filter(Boolean)

  const message = [
    `Hi ${business.name},`,
    '',
    ...details,
    ...(note ? ['', note] : []),
    '',
    'Could you let me know if you are free?',
  ].join('\n')

  const wa = whatsappLink(message)
  const mail = mailLink(`Bridal enquiry${date ? ` — ${date}` : ''}`)
  const tel = telLink()

  return (
    <Section id="enquire" className="relative overflow-hidden">
      {/* The atmospheric loop sits behind this section at low opacity. It is
          the last cinematic moment on the page and the least assertive one —
          text has to stay readable over it. */}
      <Cinematic
        asset={cinematics.atmosphere}
        className="pointer-events-none absolute inset-0 opacity-40"
        fallback={
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(70% 60% at 70% 30%, color-mix(in oklab, var(--color-gold) 14%, transparent), transparent 70%)',
            }}
          />
        }
      />

      {/* Sits above the atmospheric layer. An absolutely positioned sibling
          paints over in-flow content, so the copy needs its own z-index
          rather than the backdrop needing a negative one. */}
      <div className="relative z-10 grid gap-14 lg:grid-cols-12 lg:gap-20">
        <div className="lg:col-span-5">
          <SectionHead
            eyebrow="Enquire"
            title="Tell me your date."
            intro={
              business.availability +
              '. Dates around the main season go early, so it is worth asking sooner than feels necessary.'
            }
          />

          <Reveal delay={220}>
            <div className="mt-10 flex flex-wrap gap-4">
              <PrimaryAction href={wa} external icon={<WhatsAppIcon />}>
                Send on WhatsApp
              </PrimaryAction>
              {/* Only surfaces if a WhatsApp number is ever removed. */}
              {!wa && <PrimaryAction href={mail}>Send an email</PrimaryAction>}
              <GhostAction href={tel} icon={<PhoneIcon />}>
                Call
              </GhostAction>
            </div>
          </Reveal>

          <Reveal delay={300}>
            <p className="mt-8 flex items-center gap-3 text-sm text-ivory/45">
              <span aria-hidden="true" className="rule-gold h-px w-8" />
              Usually answers the same day.
            </p>
          </Reveal>
        </div>

        <div className="lg:col-span-7">
          <Reveal delay={120}>
            {/* Not a <form>: nothing is submitted anywhere. The fields build a
                message, and the buttons above carry it. */}
            <div className="grid gap-7 border border-ink-line/70 p-7 sm:grid-cols-2 sm:p-10">
              <label className="flex flex-col gap-2 text-sm text-ivory/60">
                Your name
                <input
                  className={FIELD}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Name"
                  autoComplete="name"
                />
              </label>

              <label className="flex flex-col gap-2 text-sm text-ivory/60">
                Wedding date
                <input
                  className={FIELD}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  placeholder="e.g. 14 February, or not fixed yet"
                />
              </label>

              <label className="flex flex-col gap-2 text-sm text-ivory/60">
                Venue or city
                <input
                  className={FIELD}
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  placeholder="Venue, or Hyderabad"
                />
              </label>

              <label className="flex flex-col gap-2 text-sm text-ivory/60">
                What you are after
                <select
                  className={`${FIELD} [&>option]:bg-ink`}
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                >
                  {services.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col gap-2 text-sm text-ivory/60 sm:col-span-2">
                Anything else
                <textarea
                  className={`${FIELD} resize-none`}
                  rows={3}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Number of people needing makeup, timings, anything you are worried about"
                />
              </label>

              <p className="text-xs leading-relaxed text-ivory/35 sm:col-span-2">
                Nothing is sent from this page. Filling this in writes your
                message, and the button opens it in WhatsApp so you can read it
                before it goes.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  )
}
