"use client"

import { type FC, useRef } from "react"
import Image from "next/image"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import Section from "@/components/Section"
import LazyVideo from "@/components/LazyVideo"
import MaskReveal from "@/components/MaskReveal"
import { useReducedMotion } from "@/hooks/useReducedMotion"
import { MEDIA_NOTE } from "@/lib/media"
import { useLang, type Lang } from "@/lib/i18n"
import { cn } from "@/lib/utils"

gsap.registerPlugin(ScrollTrigger)

/**
 * The patient journey — the kitchen pair.
 *
 * Originally four storyboard panels (the set tested in the inBe clinician
 * survey); the two text-only panels (acute phase, shared progress) were cut
 * on 2026-08-05 and the remaining video pair renumbered 01/02.
 *
 * Claim language is deliberately softer than the storyboard's. The storyboard
 * says the device "permet d'optimiser les soins" and lets the patient
 * "retrouver les gestes du quotidien"; on a pre-market page those become
 * design intent ("is designed to", "with the aim of"), which is what the
 * regulatory footing in the footer can actually support.
 *
 * Two AI concept scenes. 01 is the kitchen-bowl clip: the affected hand never
 * grips, so the man traps the bowl against his body and works around it — he
 * gets there, laboriously, spilling pieces. A film where he simply cannot do
 * it without the device would be an efficacy claim this page cannot support,
 * which is why 01 shows an exhausting workaround, not a failure.
 * (01 re-generated 2026-08-20 as kitchen_without_v2 — same scene and beats.
 * Cropped to 1.738:1 to match the reference capture the user supplied,
 * delivered at 1280×736, and trimmed to seconds 5–11.2 of the 15s take: the
 * opening had a camera tripod baked into the scene, and from ~11.4s the
 * source dissolves in a baked-in crossfade toward an idle ending where the
 * bowl has refilled itself — generation artifacts, all three.
 * kitchen_without_trim stays in /videos.)
 *
 * 02 (kitchen_stove, swapped in at the user's request 2026-08-20, replacing
 * kitchen_with.mp4 — that file and task_block.mp4 stay in /videos) is a
 * different man in a different kitchen: cooking at a gas stove, the linkages
 * carrying the affected hand as it works the pan. The earlier 01/02 pairing
 * was the same man, counter and bowl, so the cut read as before/after of one
 * task; that rhyme is gone, and the two panels now argue by register instead —
 * struggle without, ordinary cooking with. The stove clip was delivered
 * 1604×1292 and is pre-cropped to 16:9 in the encode (crop y=80 keeps the
 * head, sheds the stove front), so the poster and the aspect-video frame
 * agree everywhere.
 * Both loop deliberately: the effortful repetition in 01 *is* the pathology.
 */
type Media =
  | { kind: "video"; src: string; poster: string }
  | { kind: "image"; src: string; contain?: boolean }

type Step = {
  n: string
  label: string
  heading: string
  body: string
  media: Media | null
  alt?: string
  /** Overrides MEDIA_NOTE — used for the real application screenshot. */
  note?: string
}

const STEPS: Record<Lang, Step[]> = {
  en: [
    {
      n: "01",
      label: "Back home",
      heading: "Daily life gets harder.",
      body: "Back home, the upper-limb impairment remains. Two-handed tasks like cooking, carrying and pouring take exhausting workarounds, and independence shrinks.",
      media: {
        kind: "video",
        src: "/videos/kitchen_without_v2.mp4",
        poster: "/images/product/kitchen_without_v2.jpg",
      },
      alt: "At a kitchen counter, a man lifts a bowl of chopped vegetables and tips it into a pot on the stove. His affected arm folds inward instead of extending, so he leans his whole body in, swings the arm around and presses the back of his curled hand against the bowl to trap it — he gets there, laboriously, with a few pieces spilling onto the counter",
    },
    {
      n: "02",
      label: "Assisted daily life",
      heading: "The movement stays their own.",
      body: "ExoFlex is an adaptive orthosis: it is designed to detect the movement the person initiates and supply only the support that movement is missing, in everyday tasks, at home and beyond.",
      media: {
        kind: "video",
        src: "/videos/kitchen_stove.mp4",
        poster: "/images/product/kitchen_stove.jpg",
      },
      alt: "Wearing the exoskeleton, a man cooks at a gas stove — the linkages carry his affected hand as it works a utensil in the frying pan, his other hand steadying the handle, while steam rises from the pot beside it",
    },
  ],
  fr: [
    {
      n: "01",
      label: "Retour à domicile",
      heading: "Le quotidien se complique.",
      body: "De retour à domicile, l'atteinte du membre supérieur reste. Les gestes à deux mains, comme cuisiner, porter ou verser, exigent des détours épuisants, et l'autonomie diminue.",
      media: {
        kind: "video",
        src: "/videos/kitchen_without_v2.mp4",
        poster: "/images/product/kitchen_without_v2.jpg",
      },
      alt: "Au comptoir de cuisine, un homme soulève un bol de légumes coupés et le verse dans une casserole. Son bras atteint se replie au lieu de s'étendre, alors il penche tout le buste, contourne avec le bras et presse le dos de sa main recroquevillée contre le bol pour le coincer — il y arrive, laborieusement, en renversant quelques morceaux",
    },
    {
      n: "02",
      label: "Quotidien assisté",
      heading: "Le geste reste le sien.",
      body: "ExoFlex est une orthèse d'adaptation : elle est conçue pour détecter le mouvement que la personne amorce et fournir seulement l'appui qui lui manque, dans les gestes de tous les jours, à la maison comme ailleurs.",
      media: {
        kind: "video",
        src: "/videos/kitchen_stove.mp4",
        poster: "/images/product/kitchen_stove.jpg",
      },
      alt: "Portant l'exosquelette, un homme cuisine à une cuisinière à gaz — les biellettes accompagnent sa main atteinte qui manie un ustensile dans la poêle, l'autre main tenant le manche, tandis que la vapeur monte de la casserole voisine",
    },
  ],
}

const Journey: FC = () => {
  const rootRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const { lang } = useLang()

  useGSAP(
    () => {
      if (!rootRef.current || reduced) return

      rootRef.current.querySelectorAll<HTMLElement>("[data-step]").forEach((row) => {
        /* from() rather than set()+to(): if a trigger never resolves, the row is
           left at its natural, visible state instead of at opacity 0. */
        gsap.from(row.querySelectorAll("[data-rise]"), {
          opacity: 0,
          y: 22,
          duration: 0.75,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: { trigger: row, start: "top 78%", once: true },
        })
      })
    },
    { scope: rootRef, dependencies: [reduced, lang], revertOnUpdate: true }
  )

  return (
    <Section id="journey" tone="sunk">
      {/* The chapters flow, they never overlap. An earlier revision stuck each
          panel near the top and let the next one cover it as a deck, staggered
          by a per-step top offset. With the storyboard cut from four chapters
          to two, that effect had nothing left to stack: all it produced was 02
          sliding over 01 and slicing its clip in half mid-frame, and the cut
          also dropped the clip under LazyVideo's 80% visibility line, so it
          paused. Alternating surfaces (bg-raised / bg-paper) plus the hairline
          top edge still read as stacked sheets. */}
      <div ref={rootRef} className="space-y-8">
        {STEPS[lang].map((s, i) => (
          <div
            key={s.n}
            data-step
            className={cn(
              // fully rounded, not rounded-t: the square bottom corners were a
              // leftover from the covering-deck revision, where the next sheet
              // hid them — with the panels flowing they read as unfinished
              "rounded-[var(--radius-lg)] border-t border-hair",
              "px-[clamp(1.25rem,4vw,3.5rem)] py-[clamp(2.25rem,6vh,4rem)]",
              i % 2 === 0 ? "bg-raised" : "bg-paper",
              s.media && "grid items-center gap-x-14 gap-y-8 lg:grid-cols-2",
              // alternate which side the media sits on
              s.media && i % 2 === 1 && "lg:[&>figure]:order-first"
            )}
            style={{ minHeight: "min(76svh, 46rem)" }}
          >
            <div>
              <div className="flex items-baseline gap-4" data-rise>
                {/* the graphic tuning, not the darkened one: at --t-h3 this is
                    large type, where the brand blue itself is cleared to run */}
                <span className="display text-[length:var(--t-h3)] text-accent">
                  {s.n}
                </span>
                <span className="label">{s.label}</span>
              </div>

              {/* h2, not h3: these are the first headings after the hero's h1,
                  and skipping a level fails the heading-order audit */}
              <MaskReveal
                text={s.heading}
                as="h2"
                className={cn(
                  "display mt-6",
                  // a step without media can carry a larger line
                  s.media
                    ? "text-[length:var(--t-h3)]"
                    : "text-[clamp(1.9rem,1.2rem+1.9vw,3.1rem)]"
                )}
                style={{ maxWidth: "22ch" }}
              />

              <p
                data-rise
                className="mt-5 text-[length:var(--t-body)] leading-relaxed text-slate"
                style={{ maxWidth: s.media ? "52ch" : "64ch" }}
              >
                {s.body}
              </p>
            </div>

            {s.media && (
              <figure data-rise>
                <div
                  className={cn(
                    "relative w-full overflow-hidden rounded-[var(--radius-lg)]",
                    /* the kitchen pair is framed 16:9 with the bowl at frame
                       right — a 4/3 crop would cut the object of the scene */
                    s.media.kind === "video" ? "aspect-video" : "aspect-[4/3]",
                    s.media.kind === "image" && s.media.contain
                      ? "border border-hair bg-paper"
                      : "bg-raised"
                  )}
                >
                  {s.media.kind === "video" ? (
                    <LazyVideo
                      src={s.media.src}
                      poster={s.media.poster}
                      alt={s.alt ?? ""}
                      className="absolute inset-0"
                      videoClassName="h-full w-full object-cover"
                    />
                  ) : (
                    <Image
                      src={s.media.src}
                      alt={s.alt ?? ""}
                      fill
                      sizes="(min-width: 1024px) 48vw, 92vw"
                      className={s.media.contain ? "object-contain p-3" : "object-cover"}
                    />
                  )}
                </div>
                {(s.note ?? MEDIA_NOTE?.[lang]) && (
                  <figcaption className="label mt-3 text-slate">
                    {s.note ?? MEDIA_NOTE?.[lang]}
                  </figcaption>
                )}
              </figure>
            )}
          </div>
        ))}
      </div>
    </Section>
  )
}

export default Journey
