"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { useStore } from "@/hooks/useStore"

const FADE_MS = 700
const COMPLETE = 0.99

const loadingStages = [
  { name: "Initializing Application Services", desc: "Starting up necessary services" },
  { name: "Loading Essential Resources", desc: "Fetching critical data and assets" },
  { name: "Preparing User Interface Components", desc: "Rendering and optimizing UI elements" },
  { name: "Establishing Secure Connections", desc: "Setting up encrypted encrypted channels" },
  { name: "Finalizing Application Setup", desc: "Completing the initialization process" },
]

export default function LoadingScreen() {
  const progress = useStore((s) => s.progress)
  const setReady = useStore((s) => s.setReady)
  const [fade, setFade] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [currentStatus, setCurrentStatus] = useState("Initializing...")
  const [loadingStage, setLoadingStage] = useState(0)

  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  // Update status message based on progress
  useEffect(() => {
    if (progress < 0.15) {
      setCurrentStatus("Initializing Application Services")
      setLoadingStage(0)
    } else if (progress < 0.35) {
      setCurrentStatus("Loading Essential Resources")
      setLoadingStage(1)
    } else if (progress < 0.55) {
      setCurrentStatus("Preparing User Interface Components")
      setLoadingStage(2)
    } else if (progress < 0.75) {
      setCurrentStatus("Establishing Secure Connections")
      setLoadingStage(3)
    } else if (progress < 0.95) {
      setCurrentStatus("Finalizing Application Setup")
      setLoadingStage(4)
    } else {
      setCurrentStatus("Application Ready")
      setLoadingStage(5)
    }
  }, [progress])

  useEffect(() => {
    document.getElementById("initial-loader")?.remove()
  }, [])

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
    if (hidden) return
    const orig = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = orig
    }
  }, [hidden])

  if (hidden || progress >= 1) return null

  return (
    <div
      className={cn("fixed inset-0 z-50 bg-black transition-all duration-700 ease-in-out overflow-hidden font-sans")}
      style={{
        opacity: fade ? 0 : 1,
        transform: fade ? "scale(0.95)" : "scale(1)", // This scales it down
        filter: fade ? "blur(5px)" : "blur(0px)", // This blurs it
      }}
    >
      {/* Subtle background pattern: very faint diagonal lines */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(45deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
        }}
      />
      {/* Radial gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-black/50 to-black/90" />

      {/* Main Grid Layout for Desktop */}
      <div className="relative z-10 h-full grid grid-rows-[auto_1fr_auto] lg:grid-rows-[auto_1fr_auto] lg:grid-cols-[320px_1fr_320px] xl:grid-cols-[380px_1fr_380px]">
        {/* Header */}
        <header className="col-span-full border-b border-gray-800/50 bg-black/60 backdrop-blur-sm py-4 px-6 lg:px-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full shadow-md shadow-emerald-500/30" />
              <span className="text-gray-100 font-medium text-sm sm:text-base tracking-wide">
                SYSTEM STATUS: OPERATIONAL
              </span>
            </div>
            <div className="text-gray-400 text-xs sm:text-sm">{currentTime.toLocaleTimeString()}</div>
          </div>
        </header>

        {/* Left Panel (Desktop Only) */}
        <aside className="hidden lg:block border-r border-gray-800/50 bg-black/40 backdrop-blur-sm p-8 xl:p-10 overflow-y-auto">
          <h2 className="text-white font-semibold text-xl mb-8 tracking-wide">APPLICATION OVERVIEW</h2>

          {/* Key Metrics */}
          <div className="space-y-6 mb-10">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-300 text-sm">Current Progress</span>
                <span className="text-blue-400 text-sm">{Math.round(progress * 100)}%</span>
              </div>
              <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-500"
                  style={{ width: `${progress * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-300 text-sm">Estimated Time</span>
                <span className="text-white text-sm">{Math.max(0, Math.round((1 - progress) * 8))}s</span>
              </div>
              <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-green-400 rounded-full transition-all duration-500"
                  style={{ width: `${Math.max(0, (1 - progress) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Loading Stages */}
          <div className="pt-8 border-t border-gray-800/50">
            <h3 className="text-gray-200 font-medium text-lg mb-6 tracking-wide">LOADING SEQUENCE</h3>
            <div className="space-y-5">
              {loadingStages.map((stage, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div
                    className={cn(
                      "w-2.5 h-2.5 rounded-full mt-1.5 transition-all duration-300",
                      index <= loadingStage
                        ? "bg-blue-400 shadow-md shadow-blue-400/50"
                        : index === loadingStage + 1
                          ? "bg-gray-500 animate-pulse"
                          : "bg-gray-700",
                    )}
                  />
                  <div className="flex-1 min-w-0">
                    <p
                      className={cn(
                        "text-sm font-medium transition-colors duration-300 tracking-wide",
                        index <= loadingStage ? "text-white" : "text-gray-500",
                      )}
                    >
                      {stage.name}
                    </p>
                    <p
                      className={cn(
                        "text-xs transition-colors duration-300 text-gray-500",
                        index <= loadingStage ? "text-gray-400" : "text-gray-600",
                      )}
                    >
                      {stage.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Center Content */}
        <main className="flex flex-col items-center justify-center p-6 sm:p-8 lg:p-12">
          {/* Mobile Key Metrics (visible on smaller screens) */}
          <div className="lg:hidden w-full max-w-md mb-10">
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-900/50 rounded-lg backdrop-blur-sm border border-gray-800/50 shadow-lg">
              <div className="text-center">
                <div className="text-xs text-gray-400 mb-1">PROGRESS</div>
                <div className="text-sm font-medium text-white">{Math.round(progress * 100)}%</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-400 mb-1">ETA</div>
                <div className="text-sm font-medium text-white">{Math.max(0, Math.round((1 - progress) * 8))}s</div>
              </div>
            </div>
          </div>

          {/* Spinning Logo (without rings) */}
          <div className="relative mb-12 sm:mb-16">
            <div className="relative animate-spin-slow w-28 h-28 sm:w-32 sm:h-32 lg:w-36 lg:h-36">
              <div className="relative w-full h-full">
                <Image
                  src="/images/logo_only.png"
                  alt="Loading"
                  fill
                  priority
                  className="select-none"
                  style={{
                    objectFit: "contain",
                    filter: "drop-shadow(0 0 30px rgba(59, 130, 246, 0.5))",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Progress Section */}
          <div className="w-full max-w-md sm:max-w-lg lg:max-w-xl">
            {/* Current Status Message */}
            <div className="text-center mb-8">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-light text-white mb-3 tracking-wide">
                {currentStatus}
              </h1>
              <p className="text-sm sm:text-base text-gray-400">Please wait while we prepare your experience</p>
            </div>

            {/* Main Progress Bar */}
            <div className="mb-8">
              <div className="w-full h-3 bg-gray-800/80 rounded-full overflow-hidden backdrop-blur-sm shadow-inner shadow-gray-900/50">
                <div
                  className="h-full bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 rounded-full transition-all duration-500 ease-out relative"
                  style={{ width: `${progress * 100}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                </div>
              </div>
            </div>

            {/* Mobile Loading Stages (visible on smaller screens) */}
            <div className="lg:hidden text-center mb-6">
              <div className="flex justify-center space-x-2">
                {loadingStages.map((_, index) => (
                  <div
                    key={index}
                    className={cn(
                      "w-2.5 h-2.5 rounded-full transition-all duration-300",
                      index <= loadingStage
                        ? "bg-blue-400 shadow-sm shadow-blue-400/50"
                        : index === loadingStage + 1
                          ? "bg-gray-500 animate-pulse"
                          : "bg-gray-700",
                    )}
                  />
                ))}
              </div>
            </div>
          </div>
        </main>

        {/* Right Panel (Desktop Only) */}
        <aside className="hidden xl:block border-l border-gray-800/50 bg-black/40 backdrop-blur-sm p-8 xl:p-10 overflow-y-auto">
          <h2 className="text-white font-semibold text-xl mb-8 tracking-wide">SYSTEM INFORMATION</h2>

          {/* Application Details */}
          <div className="space-y-6 mb-10">
            <div className="flex justify-between">
              <span className="text-gray-300 text-sm">Application Version</span>
              <span className="text-white text-sm">3.2.1</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300 text-sm">Build Date</span>
              <span className="text-white text-sm">{new Date().toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300 text-sm">Deployment Environment</span>
              <span className="text-emerald-400 text-sm">Production</span>
            </div>
          </div>

        </aside>

        {/* Footer */}
        <footer className="col-span-full border-t border-gray-800/50 bg-black/60 backdrop-blur-sm py-3 px-6 lg:px-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="w-2.5 h-2.5 bg-blue-500 rounded-full shadow-md shadow-blue-500/30" />
              <span className="text-gray-400 text-xs sm:text-sm tracking-wide">ALL SYSTEMS NOMINAL</span>
            </div>
            <div className="text-gray-500 text-xs sm:text-sm">
              © {new Date().getFullYear()} ExoFlex Inc. All Rights Reserved.
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
