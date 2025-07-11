"use client"

import { useProgress } from "@react-three/drei"
import { useEffect, useRef } from "react"
import { useStore } from "@/hooks/useStore"

export default function DreiProgressHandler() {
  const { progress } = useProgress()
  const setProgress = useStore((s) => s.setProgress)
  const lastValidProgress = useRef(0)

  useEffect(() => {
    const normalized = progress / 100

    if (normalized < lastValidProgress.current && normalized !== 0) return

    if (normalized === 1 && lastValidProgress.current < 0.9) return

    lastValidProgress.current = normalized
    setProgress(normalized)
  }, [progress, setProgress])

  return null
}