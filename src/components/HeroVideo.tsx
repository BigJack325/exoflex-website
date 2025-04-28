// components/HeroVideo.tsx
"use client"

import { useEffect, useState, useRef } from "react"
import Image from "next/image"

export default function HeroVideo() {
  const [showVideo, setShowVideo] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShowVideo(true)
          obs.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <div ref={ref} className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      {showVideo ? (
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="/images/video-poster.jpg"      // ← small, optimized JPEG/PNG
          className="w-full h-full object-cover"
        >
          <source src="/videos/video_hero.mp4" type="video/mp4" />
        </video>
      ) : (
        <Image
          src="/images/video-poster.jpg"
          alt="Hero background"
          fill
          priority={false}
          sizes="100vw"
          style={{ objectFit: "cover" }}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/80" />
    </div>
  )
}