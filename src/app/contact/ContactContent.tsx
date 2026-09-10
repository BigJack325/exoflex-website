"use client"

import ContactForm from "@/components/ContactForm"
import { useLang } from "@/lib/i18n"

const COPY = {
  en: {
    label: "Contact",
    title: "Start a conversation.",
    sub: "Tell us which conversation you want to have and it will be routed accordingly. Clinical enquiries reach the team that runs the demonstrations.",
    email: "Email",
    basedIn: "Based in",
    location: "Sherbrooke, Québec, Canada",
  },
  fr: {
    label: "Contact",
    title: "Amorcer la conversation.",
    sub: "Dites-nous quelle conversation vous voulez avoir et elle sera acheminée en conséquence. Les demandes cliniques se rendent à l'équipe qui mène les démonstrations.",
    email: "Courriel",
    basedIn: "Établie à",
    location: "Sherbrooke (Québec), Canada",
  },
} as const

export default function ContactContent() {
  const { lang } = useLang()
  const t = COPY[lang]

  return (
    <main className="mx-auto max-w-screen-2xl px-4 pt-36 pb-[var(--sec-y)] md:px-6">
      <div className="grid gap-x-16 gap-y-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)]">
        <div>
          <p className="label">{t.label}</p>
          <h1
            className="display mt-6 text-[length:var(--t-h1)]"
            style={{ maxWidth: "14ch" }}
          >
            {t.title}
          </h1>
          <p
            className="mt-8 text-[length:var(--t-body)] leading-relaxed text-slate"
            style={{ maxWidth: "44ch" }}
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
    </main>
  )
}
