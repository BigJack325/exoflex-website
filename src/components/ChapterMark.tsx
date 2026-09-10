"use client"

import { useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import { useReducedMotion } from "@/hooks/useReducedMotion"

gsap.registerPlugin(ScrollTrigger)

/**
 * Chapter head for a Section: a hairline that draws across the measure, then
 * the numbered label rises under it — the Floema device that makes each
 * section open like a chapter instead of merely starting.
 *
 * gsap.from() only, so a trigger that never fires leaves everything at its
 * natural state; under reduced motion nothing animates at all.
 */
export default function ChapterMark({
  index,
  label,
}: {
  index?: string
  label: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  useGSAP(
    () => {
      if (!ref.current || reduced) return
      const tl = gsap.timeline({
        scrollTrigger: { trigger: ref.current, start: "top 88%", once: true },
      })
      tl.from("[data-rule]", { scaleX: 0, duration: 1.1, ease: "power4.inOut" }).from(
        "[data-lab]",
        { opacity: 0, y: 10, duration: 0.5, ease: "power2.out" },
        0.3
      )
    },
    { scope: ref, dependencies: [reduced], revertOnUpdate: true }
  )

  return (
    <div ref={ref} className="mb-6 md:mb-8">
      <div data-rule aria-hidden="true" className="mb-4 h-px w-full origin-left bg-hair-strong" />
      <p data-lab className="label">
        {/* the chapter counter carries the brand blue: it repeats at the head of
            every section, so it is what threads the logo colour down the whole
            page. accent-ink and not accent because .label is caption-sized, and
            the graphic tuning is only cleared for large type. */}
        {index && (
          <span aria-hidden="true" className="mr-3 text-accent-ink">
            ( {index} )
          </span>
        )}
        {label}
      </p>
    </div>
  )
}
