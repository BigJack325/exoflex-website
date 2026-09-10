"use client"

import { useEffect, useState } from "react"
import { NumberTicker } from "@/components/ui/number-ticker"
import { useReducedMotion } from "@/hooks/useReducedMotion"

type Props = {
  value: number
  prefix?: string
  unit?: string
}

/**
 * An evidence figure, counted up with Magic UI's NumberTicker.
 *
 * Two things the bare component would get wrong here:
 *
 * 1. It renders `startValue` (0) until motion animates it. If motion never runs
 *    — reduced motion, JS disabled, a crawler reading the HTML — the page would
 *    claim "0 clinicians surveyed", which is worse than no animation. So the
 *    real number is what renders on the server and what a reduced-motion
 *    visitor keeps; the ticker only takes over after mount.
 * 2. It hardcodes `text-ink dark:text-ink`, and this site does not use a
 *    `dark` class, so `text-ink` would land near-invisible on the ink ground.
 *    The className below overrides it through twMerge.
 *
 * The swap is invisible in practice because this section is far below the fold,
 * so the ticker mounts long before it scrolls into view.
 */
export default function Figure({ value, prefix, unit }: Props) {
  const reduced = useReducedMotion()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const animate = mounted && !reduced

  return (
    <>
      {prefix && <span className="align-super text-[0.42em]">{prefix}</span>}
      {animate ? (
        <NumberTicker
          value={value}
          className="inline-block tracking-[inherit] text-ink"
        />
      ) : (
        <span>{value}</span>
      )}
      {unit && <span className="text-[0.44em]">{unit}</span>}
    </>
  )
}
