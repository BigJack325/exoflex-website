"use client"

import dynamic from "next/dynamic"
import type React from "react"
import { useRef } from "react"
import { asText, type Content } from "@prismicio/client"
import { PrismicRichText, type SliceComponentProps } from "@prismicio/react"
import { Bounded } from "@/components/Bounded"
import Button from "@/components/Button"
import { TextSplitter } from "@/components/TextSplitter"
import { useScreenType } from "@/hooks/useScreenType"

const LazyVideo = dynamic(() => import("@/components/LazyVideo"), { ssr: false })

export type HeroProps = SliceComponentProps<Content.HeroSlice>

const Hero: React.FC<HeroProps> = ({ slice }) => {
  const heroRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const subheadingRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLDivElement>(null)
  const isMobile = useScreenType() === "mobile"

  return (
    <div ref={heroRef} className="relative h-screen overflow-hidden">
      <LazyVideo
        src={isMobile ? "/videos/video_hero_mobile.mp4" : "/videos/video_hero_desktop.mp4"}
        poster="/images/poster_hero.jpg"
        className="absolute inset-0 -z-10"
        videoClassName="w-full h-full object-cover"
        maskStyle={{
          WebkitMaskImage: "...",
          maskImage: "...",
          filter: "brightness(0.8) blur(0px)",
        }}
      />

      <div className="hero-overlay absolute inset-0 bg-black/20 z-[1]" />

      <Bounded
        data-slice-type={slice.slice_type}
        data-slice-variation={slice.variation}
        className="hero relative z-10 flex h-full flex-col items-center justify-center px-4 text-center"
      >
        <div className="hero-parallax">
          <h1
            ref={headingRef}
            className="hero-header font-black uppercase leading-[1.1] text-white text-5xl sm:text-8xl md:text-9xl"
          >
            <TextSplitter
              text={asText(slice.primary.heading)}
              wordDisplayStyle="block"
              className="hero-header-word"
            />
          </h1>

          <div
            ref={subheadingRef}
            className="hero-subheading mt-4 text-xl sm:text-3xl md:text-4xl font-semibold text-white"
          >
            <PrismicRichText field={slice.primary.subheading} />
          </div>

          <div ref={buttonRef} className="hero-button mt-8 sm:mt-10 md:mt-12">
            <Button
              buttonLink={slice.primary.button_link}
              buttonText={slice.primary.button_text}
              className="relative overflow-hidden group"
            />
          </div>
        </div>
      </Bounded>
    </div>
  )
}

export default Hero