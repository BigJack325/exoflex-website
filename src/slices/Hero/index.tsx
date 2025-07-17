"use client"

import dynamic from "next/dynamic"
import { useRef } from "react"
import { asText, type Content } from "@prismicio/client"
import { PrismicRichText, type SliceComponentProps } from "@prismicio/react"
import { Bounded } from "@/components/Bounded"
import Button from "@/components/Button"
import { TextSplitter } from "@/components/TextSplitter"
import { useScreenType } from "@/hooks/useScreenType"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"

const LazyVideo = dynamic(() => import("@/components/LazyVideo"), { ssr: false })
gsap.registerPlugin(ScrollTrigger)

export type HeroProps = SliceComponentProps<Content.HeroSlice>

const Hero: React.FC<HeroProps> = ({ slice }) => {
  const outerRef = useRef<HTMLDivElement>(null)
  const screenType = useScreenType()
  const isMobile = screenType === "mobile"

  useGSAP(
    () => {
      const el = outerRef.current
      if (!el) return

      const pinTarget = el.querySelector(".hero-inner")
      const content = el.querySelector(".hero-parallax")
      const maskedVideo = el.querySelector(".masked-video")
      const blackOverlay = el.querySelector(".hero-black-fade")

      if (!pinTarget || !content || !maskedVideo || !blackOverlay) return

      const scrollEnd = isMobile ? "+=100%" : "+=60%"

      // Set initial mask-stop value
      gsap.set(maskedVideo, { "--mask-stop": "70%" })

      ScrollTrigger.create({
        trigger: el,
        start: "top top",
        end: scrollEnd,
        pin: pinTarget,
        scrub: 1.2,
        anticipatePin: 1,
      })

      gsap.to(content, {
        yPercent: isMobile ? -30 : -50,
        opacity: isMobile ? 0.4 : 0,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: isMobile ? "+=40%" : "+=30%",
          scrub: 1.2,
        },
      })

      gsap.to(maskedVideo, {
        "--mask-stop": "0%",
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: scrollEnd,
          scrub: 1.2,
        },
      })

      gsap.set(blackOverlay, { opacity: 0 })

      gsap.to(blackOverlay, {
        opacity: 1,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: isMobile ? "+=60%" : scrollEnd,
          scrub: 1.2,
        },
      })
    },
    {
      scope: outerRef,
      dependencies: [screenType],
      revertOnUpdate: true,
    }
  )

  return (
    <div ref={outerRef} className="relative min-h-screen">
      <div className="hero-inner sticky top-0 min-h-screen overflow-hidden">
        {/* Video wrapper with animated mask gradient */}
        <div className="masked-video absolute inset-0 -z-10">
          <LazyVideo
            src={isMobile ? "/videos/video_hero_mobile.mp4" : "/videos/video_hero_desktop.mp4"}
            poster="/images/poster_hero.jpg"
            className="w-full h-full object-cover"
            videoClassName="w-full h-full object-cover"
            maskStyle={{
              WebkitMaskImage:
                "linear-gradient(to bottom, black 0%, black var(--mask-stop, 70%), transparent 100%)",
              maskImage:
                "linear-gradient(to bottom, black 0%, black var(--mask-stop, 70%), transparent 100%)",
              filter: "brightness(0.8)",
            }}
          />
        </div>

        <div className="hero-black-fade absolute inset-0 z-[50] bg-black pointer-events-none opacity-0" />

        <Bounded
          data-slice-type={slice.slice_type}
          data-slice-variation={slice.variation}
          className="hero relative z-10 flex min-h-screen flex-col items-center justify-center px-4 text-center"
        >
          <div className="hero-parallax">
            <h1 className="font-black uppercase leading-[1.1] text-white text-4xl sm:text-6xl md:text-7xl lg:text-8xl">
              <TextSplitter
                text={asText(slice.primary.heading)}
                wordDisplayStyle="block"
                className="hero-header-word"
              />
            </h1>
            <div className="mt-4 text-lg sm:text-2xl md:text-3xl font-semibold text-white">
              <PrismicRichText field={slice.primary.subheading} />
            </div>
            <div className="mt-8 sm:mt-10 md:mt-12">
              <Button
                buttonLink={slice.primary.button_link}
                buttonText={slice.primary.button_text}
                className="relative overflow-hidden group"
              />
            </div>
          </div>
        </Bounded>
      </div>
    </div>
  )
}

export default Hero