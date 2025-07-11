"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { useStore } from "@/hooks/useStore"
import { cn } from "@/lib/utils"

const FADE_MS = 700
const COMPLETE = 0.99

const stages = [
  "Initializing",
  "Loading Resources",
  "Preparing UI",
  "Establishing Connections",
  "Finalizing Setup",
]

export default function LoadingScreen() {
  const progress = useStore((s) => s.progress)
  const setReady = useStore((s) => s.setReady)
  const [fade, setFade] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [stage, setStage] = useState(0)

  useEffect(() => {
    document.getElementById("initial-loader")?.remove()
  }, [])

  useEffect(() => {
    if (progress < 0.2) setStage(0)
    else if (progress < 0.4) setStage(1)
    else if (progress < 0.6) setStage(2)
    else if (progress < 0.8) setStage(3)
    else setStage(4)
  }, [progress])

  useEffect(() => {
    if (fade || progress < COMPLETE) return
    setFade(true)
  }, [progress, fade])

  useEffect(() => {
    if (!fade) return
    const t = setTimeout(() => {
      setReady()
      setHidden(true)
    }, FADE_MS)
    return () => clearTimeout(t)
  }, [fade, setReady])

    useEffect(() => {
    console.log("Progress:", progress)
  }, [progress])

  useEffect(() => {
    if (hidden) return
    const original = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = original
    }
  }, [hidden])

  if (hidden || progress >= 1) return null

  return (
    <div
      className={cn("fixed inset-0 z-50 bg-black text-white flex flex-col items-center justify-center transition-all duration-700", fade && "opacity-0 scale-95 blur-sm")}
    >
      <Image
        src="/images/logo_only.png"
        alt="Loading"
        width={80}
        height={80}
        className="mb-6 animate-spin-slow"
        style={{ filter: "drop-shadow(0 0 20px rgba(59, 130, 246, 0.5))" }}
      />

      <h1 className="text-xl sm:text-2xl mb-2 font-light tracking-wide">{stages[stage]}</h1>
      <p className="text-sm text-gray-400 mb-6">Please wait while we prepare your experience</p>

      <div className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-300"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
    </div>
  )
}