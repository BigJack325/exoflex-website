"use client"

import { useEffect, useRef, type ComponentPropsWithoutRef } from "react"
import { useInView, useMotionValue, useSpring } from "motion/react"

import { cn } from "@/lib/utils"

interface NumberTickerProps extends ComponentPropsWithoutRef<"span"> {
  value: number
  startValue?: number
  direction?: "up" | "down"
  delay?: number
  decimalPlaces?: number
}

export function NumberTicker({
  value,
  startValue = 0,
  direction = "up",
  delay = 0,
  className,
  decimalPlaces = 0,
  ...props
}: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const motionValue = useMotionValue(direction === "down" ? value : startValue)
  /* LOCAL CHANGE (see also the className default below) — a `shadcn add
     --overwrite` of this component will revert it.

     Magic UI ships damping 60 / stiffness 100, which takes over four seconds to
     arrive and asymptotes: measured here, the $400K figure still read "$399K+"
     at 4.8s. These are clinical-validation numbers, so several seconds of wrong
     values is a factual misstatement, not a flourish. Faster spring plus a
     restDelta coarser than the rounding step, so it snaps to the true integer
     instead of creeping toward it. */
  const springValue = useSpring(motionValue, {
    damping: 30,
    stiffness: 260,
    restDelta: 0.4,
  })
  const isInView = useInView(ref, { once: true, margin: "0px" })

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null

    if (isInView) {
      timer = setTimeout(() => {
        motionValue.set(direction === "down" ? startValue : value)
      }, delay * 1000)
    }

    return () => {
      if (timer !== null) {
        clearTimeout(timer)
      }
    }
  }, [motionValue, isInView, delay, value, direction, startValue])

  useEffect(
    () =>
      springValue.on("change", (latest) => {
        if (ref.current) {
          ref.current.textContent = Intl.NumberFormat("en-US", {
            minimumFractionDigits: decimalPlaces,
            maximumFractionDigits: decimalPlaces,
          }).format(Number(latest.toFixed(decimalPlaces)))
        }
      }),
    [springValue, decimalPlaces]
  )

  return (
    <span
      ref={ref}
      className={cn(
        // LOCAL CHANGE: upstream hardcodes `text-black dark:text-white`. This
        // site has no `dark` class, so black landed near-invisible on the ink
        // ground. Inherit instead, and let the caller own tracking.
        // No tabular-nums either: TomatoGrotesk's tabular zero is slashed
        // (see the note in globals.css).
        "inline-block text-current",
        className
      )}
      {...props}
    >
      {startValue}
    </span>
  )
}
