"use client"

import { useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import Section from "@/components/Section"
import MaskReveal from "@/components/MaskReveal"
import Figure from "./Figure"
import { useReducedMotion } from "@/hooks/useReducedMotion"
import { useLang, type Lang } from "@/lib/i18n"

gsap.registerPlugin(ScrollTrigger)

/* A surface-EMG-style line: long quiet baselines, a few activation bursts.
   Drawn in a 1200x80 box, stretched to the section width. */
const EMG_PATH =
  "M0 40 H150 l5 -6 l6 10 l5 -7 H320 l6 -24 l8 38 l6 -28 l8 16 l6 -8 H600 " +
  "l5 -10 l7 16 l5 -9 H830 l6 -30 l9 46 l7 -28 l8 14 l6 -6 H1080 l5 -8 l7 12 l5 -7 H1200"

/* Seconds into .emg-pulse's 7s sweep at which the bright segment reaches each
   column's rule — the offsets that light a rule as the signal gets to it.
   Measured by stepping the pulse's own animation and reading the rendered dash
   against getPointAtLength along EMG_PATH: the segment covers each rule over
   0→0.01s, 1.01→1.41s, 2.82→3.22s and 4.61→5.01s. Not even quarters, because
   the activation bursts eat path length without moving in x — splitting the
   sweep into four equal parts lit each rule up to 0.35s late, most of a
   segment-width after the signal had gone by. Re-measure if EMG_PATH, the dash
   pattern or the column count changes. */
const RULE_LIT_AT = [0, 1.01, 2.82, 4.61]

/**
 * Validation presented as data, not as badges. Large numerals, small labels,
 * hairline rules, no cards.
 *
 * FIGURES — corrected 2026-08 against the CRSNG/PSO application ("info
 * exoflex a jour.docx") and the inBe results one-pager. The survey base is 87
 * clinicians in upper-limb neurorehabilitation across the US and Canada,
 * within 100+ practitioner interviews overall: 88% favourable to using the
 * device, 96% favourable opinions of its value. The "100 clinicians / 77%"
 * previously shown came from the Péladeau deck; 77% appears in neither source
 * document. Note: the two sources swap which of 88/96 is "use" vs "value" —
 * the labels below are worded to hold under either attribution. These remain
 * measures of clinician *perception* and stated intent, pre-market —
 * presenting them as clinical effectiveness would be a claim this company
 * cannot support.
 *
 * Deliberately NOT shown here: market sizing, pricing, margins, financial
 * projections. Investor material, not public-site material.
 */
type FigureRow = { value: number; prefix?: string; unit?: string; label: string }

const FIGURES: Record<Lang, FigureRow[]> = {
  en: [
    {
      value: 100,
      unit: "+",
      label: "Interviews with physiotherapists and occupational therapists",
    },
    {
      value: 88,
      unit: "%",
      label: "Of 87 surveyed clinicians favourable to using ExoFlex in practice",
    },
    {
      value: 96,
      unit: "%",
      label: "Favourable opinions of the concept's clinical value",
    },
    {
      prefix: "$",
      value: 400,
      unit: "K+",
      label: "CAD raised across more than 21 pitch and grant competitions",
    },
  ],
  fr: [
    {
      value: 100,
      unit: "+",
      label: "Entrevues avec des physiothérapeutes et des ergothérapeutes",
    },
    {
      value: 88,
      unit: "%",
      label: "Des 87 cliniciens sondés favorables à utiliser ExoFlex en pratique",
    },
    {
      value: 96,
      unit: "%",
      label: "D'opinions favorables sur la valeur clinique du concept",
    },
    {
      value: 400,
      unit: "k$+",
      label: "Amassés dans plus de 21 concours et bourses",
    },
  ],
}

/* The partner logo strip now lives in the Ticker band (the marquee on the
   lights-up cut) — src/sections/Ticker. */

const COPY = {
  en: {
    label: "Validation",
    heading: "Validation in progress.",
    sub: "The figures below describe clinician-reported perception and development funding. They are not measures of clinical effectiveness.",
  },
  fr: {
    label: "Validation",
    heading: "Validation en cours.",
    sub: "Les chiffres ci-dessous décrivent la perception rapportée par les cliniciens et le financement du développement. Ce ne sont pas des mesures d'efficacité clinique.",
  },
} as const

export default function Evidence() {
  const rootRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const { lang } = useLang()
  const t = COPY[lang]

  useGSAP(
    () => {
      if (!rootRef.current || reduced) return

      gsap.from("[data-sub]", {
        opacity: 0,
        y: 18,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: { trigger: rootRef.current, start: "top 72%", once: true },
      })

      /* same ledger grammar as the Context stats: each tile draws its rule,
         then number and label rise — columns cascade left to right.
         Reversed against DOM order so the numeral leads and its label follows,
         matching the painting order (see the column-reverse note below). */
      gsap.utils
        .toArray<HTMLElement>("[data-tile]", rootRef.current)
        .forEach((tile, i) => {
          const tl = gsap.timeline({
            delay: i * 0.14,
            scrollTrigger: { trigger: tile, start: "top 85%", once: true },
          })
          tl.from(tile.querySelector("[data-rule]"), {
            scaleY: 0,
            duration: 0.9,
            ease: "power4.inOut",
          }, 0).from([...tile.querySelectorAll("[data-rise]")].reverse(), {
            opacity: 0,
            y: 26,
            duration: 0.7,
            stagger: 0.08,
            ease: "power3.out",
          }, 0.15)
        })
    },
    { scope: rootRef, dependencies: [reduced, lang], revertOnUpdate: true }
  )

  return (
    <Section
      id="evidence"
      tone="film"
      className="flex flex-1 flex-col pb-[clamp(3rem,7vh,5.5rem)] pt-[clamp(5.5rem,11vh,7.5rem)]"
      containerClassName="flex flex-1 flex-col"
    >
      {/* full-viewport composition: heading top-left, sub top-right, the
          ledger anchored to the bottom edge — the air in between is the
          layout, not leftover space */}
      {/* `isolate` so the z-index on the trace below resolves here and not in
          whatever ancestor happens to be the nearest stacking context */}
      <div ref={rootRef} className="relative isolate flex flex-1 flex-col justify-center">
        {/* EMG trace: the product's signature drawn across the ledger's air.
            A casing, one faint full path, and one bright segment travelling
            along it (.emg-pulse in globals.css); hidden under reduced motion. */}
        <svg
          aria-hidden="true"
          viewBox="0 0 1200 80"
          preserveAspectRatio="none"
          /* z-10: the ledger columns come later in the DOM, so without it their
             rules painted over the trace and chopped it into segments at every
             crossing. The trace has to read as one continuous signal passing in
             front of the structure. Harmless over the text — it is a hairline
             in a 64px band of empty air, and pointer-events-none.
             lg only: the band of empty air it rides through exists in the
             four-column composition alone. Below lg the tiles stack and 58%
             lands inside a label, where the casing stroke erased the letters
             it crossed. */
          className="pointer-events-none absolute inset-x-0 top-[58%] z-10 hidden h-16 w-full -translate-y-1/2 lg:block"
        >
          {/* The casing, in the section's own ground colour. Stacking order was
              not enough on its own: the trace is 9% white and the column rules
              are 30%, so painting a line three times fainter on top of them
              changed almost nothing and the rules still read as being in front.
              This knocks a short gap out of the rule under the trace, the way a
              map draws a bridge over a road. Drawn first, so the faint path and
              the pulse both sit on top of it. */}
          <path
            d={EMG_PATH}
            fill="none"
            stroke="#363639"
            strokeWidth="6"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <path
            d={EMG_PATH}
            fill="none"
            stroke="rgba(237,236,232,0.09)"
            strokeWidth="1.5"
          />
          <path
            d={EMG_PATH}
            fill="none"
            stroke="rgba(133,184,248,0.5)"
            strokeWidth="1.5"
            className="emg-pulse"
          />
        </svg>
        <div className="grid items-start gap-x-10 gap-y-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <MaskReveal
            text={t.heading}
            className="display text-[length:var(--t-h2)]"
            style={{ maxWidth: "20ch" }}
          />
          <p
            data-sub
            className="text-[length:var(--t-body)] leading-relaxed text-slate lg:justify-self-end lg:pt-3 lg:text-right"
            style={{ maxWidth: "44ch" }}
          >
            {t.sub}
          </p>
        </div>

        {/* tall ledger columns filling everything under the header: the
            numeral holds the top edge, its label the base, and the vertical
            rules structure the air between them.
            column-reverse + justify-between is what puts them that way round,
            and the point is reading order: every label is the tail of a
            sentence the number starts ("100+" / "interviews with…"), so with
            the label on top it was read as a fragment before the figure that
            completes it had arrived. The dl keeps dt before dd in the DOM —
            only the painting order flips. */}
        <dl className="mt-[clamp(2.5rem,6vh,4rem)] grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {FIGURES[lang].map((f, i) => (
            <div
              key={f.label}
              data-tile
              className="relative flex flex-col-reverse gap-5 pl-6 sm:min-h-[clamp(12rem,36svh,22rem)] sm:justify-between"
            >
              {/* the rule takes the pulse from the EMG trace: it lights the
                  moment the bright segment reaches this column, then fades,
                  so the trace and the hairlines read as one signal rather than
                  two graphics that happen to cross (see RULE_LIT_AT). */}
              <div
                data-rule
                aria-hidden="true"
                className="ledger-rule absolute left-0 top-0 h-full w-px origin-top bg-hair-strong"
                style={{ animationDelay: `${RULE_LIT_AT[i]}s` }}
              />
              <dt data-rise className="label" style={{ maxWidth: "22ch" }}>
                {f.label}
              </dt>
              <dd data-rise className="m-0 display text-[length:var(--t-num)] leading-none">
                <Figure value={f.value} prefix={f.prefix} unit={f.unit} />
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </Section>
  )
}
