import { useState, type FormEvent } from 'react'
import { business, telHref, wa, whatsappHref } from '../../content/business'
import { Reveal } from '../ui/Reveal'
import { SplitText } from '../ui/SplitText'
import { PhoneIcon, WhatsAppIcon } from '../ui/Icons'

type Fields = { name: string; phone: string; occasion: string; date: string }

const EMPTY: Fields = { name: '', phone: '', occasion: '', date: '' }

const FIELD_CLASS =
  'w-full border-0 border-b border-plate-ink/25 bg-transparent px-0 py-3 text-[0.98rem] text-fg placeholder:text-fg-3 focus:border-accent focus:outline-none transition-colors duration-400'

const LABEL_CLASS =
  'block text-[0.62rem] font-semibold tracking-[0.12em] uppercase text-fg-3'

/**
 * There is no backend, so the form does not pretend to be one. It composes a
 * complete, readable WhatsApp message and hands it to the studio's real
 * number — the enquiry genuinely arrives, and nothing is stored here.
 */
export function Enquire() {
  const [fields, setFields] = useState<Fields>(EMPTY)

  const set = (key: keyof Fields) => (e: { target: { value: string } }) =>
    setFields((prev) => ({ ...prev, [key]: e.target.value }))

  const compose = (f: Fields) => {
    const lines = [
      `Hello S.L.N. Digital Studio, I'd like to enquire about a shoot.`,
      '',
      `Name: ${f.name.trim()}`,
      f.phone.trim() ? `Phone: ${f.phone.trim()}` : null,
      `Occasion: ${f.occasion.trim()}`,
      f.date ? `Preferred date: ${f.date}` : null,
    ].filter(Boolean)
    return lines.join('\n')
  }

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    window.open(whatsappHref(compose(fields)), '_blank', 'noopener,noreferrer')
  }

  return (
    <section id="enquire" className="grain relative bg-surface py-24 lg:py-32">
      <div className="mx-auto w-full max-w-[1560px] px-5 sm:px-8 lg:px-12">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          {/* Pitch */}
          <div className="lg:col-span-5">
            <Reveal className="flex items-center gap-4 sm:gap-6">
              <span className="chapter-num text-lg">07</span>
              <span className="label">Enquire</span>
              <span className="rule hidden flex-1 sm:block" aria-hidden />
            </Reveal>

            <SplitText
              as="h2"
              text={`Planning
something special?`}
              mark="special?"
              delay={90}
              className="display-lg mt-6"
            />

            <Reveal delay={160} className="mt-6">
              <p className="body-lg max-w-md">
                Tell us what you&rsquo;re celebrating, and let&rsquo;s create something worth
                remembering.
              </p>
            </Reveal>

            <Reveal delay={230} className="mt-10 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
              <a
                href={wa.booking}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-accent"
              >
                <WhatsAppIcon className="h-4 w-4" />
                <span>WhatsApp us</span>
              </a>
              <a href={telHref} className="btn btn-outline">
                <PhoneIcon className="h-3.5 w-3.5" />
                <span>Call {business.phone.display}</span>
              </a>
            </Reveal>

            <Reveal delay={290} className="mt-8">
              <p className="body-base max-w-sm text-[0.82rem]">
                Call or message any day between {business.hours.range}. A quick
                conversation is usually the fastest way to check a date.
              </p>
            </Reveal>
          </div>

          {/* Form */}
          <div className="lg:col-span-6 lg:col-start-7">
            <Reveal delay={120}>
              <form
                onSubmit={onSubmit}
                className="border border-rule bg-surface-3 p-7 shadow-[0_36px_80px_-40px_rgba(0,0,0,0.85)] sm:p-10"
                noValidate={false}
              >
                <p className="label">Send an enquiry</p>

                <div className="mt-8 grid gap-7 sm:grid-cols-2">
                  <div>
                    <label className={LABEL_CLASS} htmlFor="enq-name">
                      Name
                    </label>
                    <input
                      id="enq-name"
                      name="name"
                      type="text"
                      required
                      autoComplete="name"
                      value={fields.name}
                      onChange={set('name')}
                      placeholder="Your name"
                      className={FIELD_CLASS}
                    />
                  </div>

                  <div>
                    <label className={LABEL_CLASS} htmlFor="enq-phone">
                      Phone
                    </label>
                    <input
                      id="enq-phone"
                      name="phone"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      value={fields.phone}
                      onChange={set('phone')}
                      placeholder="So we can call you back"
                      className={FIELD_CLASS}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className={LABEL_CLASS} htmlFor="enq-occasion">
                      What are you planning?
                    </label>
                    <input
                      id="enq-occasion"
                      name="occasion"
                      type="text"
                      required
                      value={fields.occasion}
                      onChange={set('occasion')}
                      placeholder="Wedding, first birthday, ceremony, portraits…"
                      className={FIELD_CLASS}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className={LABEL_CLASS} htmlFor="enq-date">
                      Preferred date
                    </label>
                    <input
                      id="enq-date"
                      name="date"
                      type="date"
                      value={fields.date}
                      onChange={set('date')}
                      className={FIELD_CLASS}
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-solid mt-9 w-full">
                  <WhatsAppIcon className="h-4 w-4" />
                  <span>Send enquiry</span>
                </button>

                <p className="mt-5 text-[0.75rem] leading-relaxed text-fg-3">
                  Opens WhatsApp with your details filled in, addressed to
                  {' '}{business.phone.display}. Nothing is stored on this website.
                </p>
              </form>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
