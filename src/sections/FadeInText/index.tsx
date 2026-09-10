"use client";

import { FC, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { usePathname } from "next/navigation";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import Section from "@/components/Section";
import { useLang } from "@/lib/i18n";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

/**
 * Scroll-driven reveal, after the Opal reference the user supplied: the
 * paragraph's words resolve from faint to full ink as you scroll, the block
 * holding on screen while the reveal completes. Per the user, no inline
 * images — the words carry it alone.
 *
 * The hold is `position: sticky` inside a tall wrapper, not a GSAP pin — same
 * visual, cheaper, and under reduced motion the wrapper collapses to natural
 * height. The faint start state lives in the tween, never in the markup, so
 * without animation the paragraph is simply legible.
 */
const COPY = {
  en: {
    label: "Context",
    body: "After a stroke, the upper-limb impairment does not end when the clinic stay does. It is measured in everyday movements like eating, dressing and cooking, long after therapy ends.",
    /* 80% and 65% are the CRSNG/PSO application's epidemiology, which cites
       its refs [3] Langhorne 2009 and [4] Ingram 2021 jointly for the pair —
       hence both rows carry markers 1 and 2. 63% is the inBe clinician survey
       (online, 62 US physiotherapists and occupational therapists in upper-limb
       neurorehab; results one-pager of 2026-02). The previous 720k/50%/80% row
       was unsourced. `refs` are 1-based indices into `sources`. */
    stats: [
      { value: 80, suffix: "%", label: "of stroke survivors present an upper-limb impairment", refs: [1, 2] },
      { value: 65, suffix: "%", label: "still show motor deficits six months after the event", refs: [1, 2] },
      { value: 63, suffix: "%", label: "of patients show low-to-moderate adherence to home exercise programs, as clinicians report", refs: [3] },
    ],
    sourcesLabel: "Sources",
    sources: [
      { text: "Langhorne P, Coupar F, Pollock A. Motor recovery after stroke: a systematic review. Lancet Neurol. 2009;8(8):741–754.", href: "https://doi.org/10.1016/S1474-4422(09)70150-4" },
      { text: "Ingram LA, Butler AA, Brodie MA, Lord SR, Gandevia SC. Quantifying upper limb motor impairment in chronic stroke: a physiological profiling approach. J Appl Physiol. 2021;131(3):949–965.", href: "https://doi.org/10.1152/japplphysiol.00078.2021" },
      { text: "Online survey conducted for ExoFlex among physiotherapists and occupational therapists in upper-limb neurological rehabilitation (United States)." },
    ],
  },
  fr: {
    label: "Contexte",
    body: "Après un AVC, l'atteinte du membre supérieur ne s'arrête pas à la sortie de la clinique. Elle se mesure dans les gestes du quotidien, comme manger, s'habiller et cuisiner, longtemps après la fin des thérapies.",
    stats: [
      { value: 80, suffix: "\u00A0%", label: "des survivants d'un AVC présentent une atteinte d'un membre supérieur", refs: [1, 2] },
      { value: 65, suffix: "\u00A0%", label: "conservent des déficits moteurs six mois après l'événement", refs: [1, 2] },
      { value: 63, suffix: "\u00A0%", label: "des patients ont une adhérence faible à modérée aux exercices à domicile, selon les cliniciens", refs: [3] },
    ],
    sourcesLabel: "Sources",
    sources: [
      { text: "Langhorne P, Coupar F, Pollock A. Motor recovery after stroke: a systematic review. Lancet Neurol. 2009;8(8):741–754.", href: "https://doi.org/10.1016/S1474-4422(09)70150-4" },
      { text: "Ingram LA, Butler AA, Brodie MA, Lord SR, Gandevia SC. Quantifying upper limb motor impairment in chronic stroke: a physiological profiling approach. J Appl Physiol. 2021;131(3):949–965.", href: "https://doi.org/10.1152/japplphysiol.00078.2021" },
      { text: "Sondage en ligne mené pour ExoFlex auprès de physiothérapeutes et d'ergothérapeutes en réadaptation neurologique du membre supérieur (États-Unis)." },
    ],
  },
} as const

const FadeInText: FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const { lang } = useLang();
  const t = COPY[lang];

  useGSAP(
    () => {
      if (!containerRef.current || reduced) return;

      const wrap = containerRef.current.querySelector("[data-hold]");
      const toks = containerRef.current.querySelectorAll(".fade-tok");
      if (!wrap || !toks.length) return;

      gsap.fromTo(
        toks,
        { opacity: 0.13 },
        {
          opacity: 1,
          stagger: 0.6,
          ease: "none",
          scrollTrigger: {
            trigger: wrap,
            start: "top 62%",
            end: "bottom bottom",
            scrub: true,
          },
        }
      );

      /* Ledger rows: each draws its rule, rises, and counts from zero. The
         markup holds the final value, so no-JS and reduced motion read it. */
      containerRef.current
        .querySelectorAll<HTMLElement>("[data-stat]")
        .forEach((row) => {
          const num = row.querySelector<HTMLElement>("[data-count]");
          const target = Number(num?.dataset.target ?? 0);
          const proxy = { v: 0 };
          const tl = gsap.timeline({
            scrollTrigger: { trigger: row, start: "top 82%", once: true },
          });
          tl.from(row.querySelector("[data-rule]"), {
            scaleX: 0,
            duration: 0.9,
            ease: "power4.inOut",
          }, 0)
            .from(row.querySelectorAll("[data-rise]"), {
              opacity: 0,
              y: 26,
              duration: 0.7,
              stagger: 0.08,
              ease: "power3.out",
            }, 0.1)
            .to(proxy, {
              v: target,
              duration: 1.3,
              ease: "power2.out",
              onUpdate: () => {
                if (num) num.textContent = String(Math.round(proxy.v));
              },
            }, 0.15);
        });
    },
    { dependencies: [pathname, reduced, lang], scope: containerRef, revertOnUpdate: true }
  );

  /* shorter bottom padding than the section default: the chapter now ends on
     the small-print sources, and a full --sec-y under them read as a hole
     before the Journey band (which brings its own top padding). */
  return (
    <Section id="context" className="pb-[clamp(2.5rem,6vh,4rem)]">
      <div ref={containerRef}>
        {/* Tall wrapper + sticky block = the hold. Collapses under reduced
            motion so a static paragraph costs no extra scroll. */}
        <div data-hold className={cn(!reduced && "h-[150vh] lg:h-[185vh]")}>
          <div
            className={cn(
              "flex",
              !reduced && "sticky top-0 min-h-[88svh] items-center"
            )}
          >
            <div>
              <p
                className="display text-[clamp(1.7rem,1.1rem+2.6vw,3.4rem)] leading-[1.22]"
                style={{ maxWidth: "34ch" }}
              >
                {t.body.split(" ").map((w, i) => (
                  <span key={i} className="fade-tok inline-block">
                    {w}
                    <span>&nbsp;</span>
                  </span>
                ))}
              </p>
            </div>
          </div>
        </div>

        {/* Plain divs, not a <dl>: this was a definition list with <dd> before
            <dt>, nested two divs deep — which fails both of axe's list audits
            (definition-list and dlitem). A big numeral and its sentence are
            not a term/definition pair anyway, so the honest fix is to stop
            claiming the semantics rather than contort the markup to keep them. */}
        <div data-stats className="mt-[clamp(3.5rem,9vh,6rem)]">
          {t.stats.map((s) => (
            <div key={s.label} data-stat className="relative">
              {/* drawn rule instead of a border, so it can animate */}
              <div
                data-rule
                aria-hidden="true"
                className="h-px w-full origin-left bg-hair-strong"
              />
              <div className="grid items-end gap-x-12 gap-y-4 py-[clamp(1.6rem,4.5vh,3rem)] lg:grid-cols-[minmax(0,0.6fr)_minmax(0,0.4fr)]">
                <p data-rise className="m-0">
                  <span
                    data-count
                    data-target={s.value}
                    className="display text-[clamp(4.5rem,3rem+8vw,11rem)] leading-[0.9] tracking-[-0.03em]"
                  >
                    {s.value}
                  </span>
                  {/* the unit carries the brand blue while the numeral stays
                      ink: the first content screen after the hero gets a touch
                      of the logo colour without an 11rem numeral turning blue.
                      32-72px is large type, where the graphic tuning is cleared
                      to run (3.38:1 on paper). */}
                  <span className="display text-[clamp(2rem,1.4rem+3vw,4.5rem)] leading-none text-accent">
                    {s.suffix}
                  </span>
                </p>
                <p
                  data-rise
                  className="m-0 pb-2 text-[clamp(1.1rem,0.95rem+0.9vw,1.65rem)] leading-relaxed text-slate lg:justify-self-end lg:text-right"
                  style={{ maxWidth: "30ch" }}
                >
                  {s.label}
                  <sup className="ml-1 text-[0.6em] text-slate">{s.refs.join(", ")}</sup>
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* the ledger's receipts: one line per row above, in row order. Static
            on purpose — a reference list is read, not revealed. */}
        <div className="mt-[clamp(2rem,5vh,3.5rem)] border-t border-hair pt-5">
          <p className="label mb-3">{t.sourcesLabel}</p>
          <ol className="max-w-[80ch] list-decimal space-y-1.5 pl-5 text-xs leading-relaxed text-slate">
            {t.sources.map((s) => (
              <li key={s.text}>
                {s.text}
                {"href" in s && (
                  <>
                    {" "}
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent-ink underline decoration-hair-strong underline-offset-4 transition-colors hover:decoration-accent-ink"
                    >
                      {s.href.replace("https://doi.org/", "doi:")}
                    </a>
                  </>
                )}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Section>
  );
};

export default FadeInText;
