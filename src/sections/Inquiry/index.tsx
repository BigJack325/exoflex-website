"use client"

import ContactForm from "@/components/ContactForm"
import MaskReveal from "@/components/MaskReveal"
import Section from "@/components/Section"
import { useLang } from "@/lib/i18n"

const COPY = {
  en: {
    label: "Contact",
    heading: "Start a conversation.",
    sub: "Tell us which conversation you want to have and it will be routed accordingly. Clinical enquiries reach the team that runs the demonstrations.",
    email: "Email",
    basedIn: "Based in",
    location: "Sherbrooke, Québec, Canada",
  },
  fr: {
    label: "Contact",
    heading: "Amorcer la conversation.",
    sub: "Dites-nous quelle conversation vous voulez avoir et elle sera acheminée en conséquence. Les demandes cliniques se rendent à l'équipe qui mène les démonstrations.",
    email: "Courriel",
    basedIn: "Établie à",
    location: "Sherbrooke (Québec), Canada",
  },
} as const

export default function Inquiry() {
  const { lang } = useLang()
  const t = COPY[lang]

  return (
    <Section id="inquiry" tone="film">
      <div className="grid gap-x-16 gap-y-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)]">
        <div>
          <MaskReveal
            text={t.heading}
            className="display text-[length:var(--t-h2)]"
            style={{ maxWidth: "14ch" }}
          />
          <p
            className="mt-6 text-[length:var(--t-body)] leading-relaxed text-slate"
            style={{ maxWidth: "42ch" }}
          >
            {t.sub}
          </p>

          <dl className="mt-12 space-y-6">
            <div className="border-t border-hair pt-4">
              <dt className="label">{t.email}</dt>
              <dd className="mt-2">
                <a
                  href="mailto:info@exoflex.ca"
                  className="transition-colors hover:text-accent"
                >
                  info@exoflex.ca
                </a>
              </dd>
            </div>
            <div className="border-t border-hair pt-4">
              <dt className="label">{t.basedIn}</dt>
              <dd className="mt-2">{t.location}</dd>
            </div>
          </dl>
        </div>

        <ContactForm />
      </div>
    </Section>
  )
}
