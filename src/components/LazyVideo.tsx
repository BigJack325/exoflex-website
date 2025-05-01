"use client"

import { useEffect, useState, useRef } from "react"
import Image from "next/image"

export type LazyVideoProps = {
  src: string
  poster: string
  alt?: string
  className?: string
  videoClassName?: string
  maskStyle?: React.CSSProperties
  zIndex?: number
  priority?: boolean
}

export default function LazyVideo({
  src,
  poster,
  alt = "Video background",
  className = "absolute inset-0 overflow-hidden",
  videoClassName="w-full h-full object-contain mx-auto",
  maskStyle,
  zIndex = 0,
  priority = false
}: LazyVideoProps) {
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
    <div
      ref={ref}
      className={`${className} pointer-events-none`}
      style={{ zIndex }}
    >
      {showVideo ? (
        <video
          autoPlay
          loop
          muted
          playsInline
          poster={poster}
          className={videoClassName}
          style={maskStyle}
        >
          <source src={src} type="video/mp4" />
        </video>
      ) : (
      <div className="relative w-full aspect-video">
        <Image
          src={poster}
          alt={alt}
          fill
          priority={priority}
          className="object-cover"
          sizes="100vw"
          style={maskStyle}
        />
      </div>
      )}
    </div>
  )
}