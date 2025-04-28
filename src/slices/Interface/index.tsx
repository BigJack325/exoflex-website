"use client";
import { type FC, useEffect, useRef, useState } from "react";
import type { Content } from "@prismicio/client";
import { PrismicRichText, type SliceComponentProps } from "@prismicio/react";
import { Bounded } from "@/components/Bounded";
import { TextSplitter } from "@/components/TextSplitter";
import { asText } from "@prismicio/client";
import Image from "next/image";
import { FiMonitor, FiLayout, FiActivity } from "react-icons/fi";
import gsap from "gsap";

export type InterfaceProps = SliceComponentProps<Content.InterfaceSlice>;

const Interface: FC<InterfaceProps> = ({ slice }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subheadingRef = useRef<HTMLDivElement>(null);
  const featureCardsRef = useRef<HTMLDivElement>(null);
  const [activeSlide, setActiveSlide] = useState(0);

  const menuItems = [
    {
      image: slice.primary.planning_page?.url,
      alt: slice.primary.planning_page?.alt,
      description: slice.primary.planning_description,
      icon: <FiLayout className="w-5 h-5" />,
      title: slice.primary.planning_title || "Planning",
    },
    {
      image: slice.primary.hmi_page?.url,
      alt: slice.primary.hmi_page?.alt,
      description: slice.primary.hmi_description,
      icon: <FiMonitor className="w-5 h-5" />,
      title: slice.primary.hmi_title || "HMI",
    },
    {
      image: slice.primary.activity_page?.url,
      alt: slice.primary.activity_page?.alt,
      description: slice.primary.activity_description,
      icon: <FiActivity className="w-5 h-5" />,
      title: slice.primary.activity_title || "Activity",
    },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom-=100",
          end: "bottom top",
          toggleActions: "play none none none",
          once: true,
        },
        defaults: { ease: "power3.out" },
      });

      tl.to(containerRef.current, { opacity: 1, duration: 0.8 });

      const headingWords = headingRef.current?.querySelectorAll(".interface-header-word");
      if (headingWords) {
        gsap.set(headingWords, { y: 100, opacity: 0 });
        tl.to(headingWords, { y: 0, opacity: 1, stagger: 0.1, duration: 0.8 }, "-=0.4");
      }

      if (subheadingRef.current) {
        gsap.set(subheadingRef.current, { y: 50, opacity: 0 });
        tl.to(subheadingRef.current, { y: 0, opacity: 1, duration: 0.8 }, "-=0.4");
      }

      if (featureCardsRef.current) {
        const cards = featureCardsRef.current.children;
        gsap.set(cards, { y: 50, opacity: 0 });
        tl.to(cards, { y: 0, opacity: 1, stagger: 0.15, duration: 0.8 }, "-=0.6");
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const changeSlide = (index: number) => {
    if (index === activeSlide) return;
    setActiveSlide(index);
  };

  return (
    <Bounded
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="relative"
    >
    <div ref={containerRef} className="min-h-screen w-full flex flex-col items-center justify-center text-center py-12 sm:py-16 md:py-24 px-4 sm:px-6">
      {/* Heading */}
      <div className="mb-6 max-w-5xl w-full mx-auto">
        <h2
          className="font-black italic text-white text-[2rem] sm:text-[2.5rem] md:text-[3.5rem] lg:text-7xl leading-tight lg:leading-[1.25]"
          ref={headingRef}
        >
          <TextSplitter text={asText(slice.primary.heading)} className="interface-header-word" />
        </h2>
        <div
          className="mt-6 text-base sm:text-lg md:text-xl lg:text-2xl text-white max-w-4xl mx-auto"
          ref={subheadingRef}
        >
          <PrismicRichText field={slice.primary.subheading} />
        </div>
      </div>

      {/* Tabs */}
      <div className="w-full overflow-x-auto scrollbar-hide mb-6 sm:mb-8">
        <div className="inline-flex bg-[#1a2a3a]/50 rounded-full p-[2px] mx-auto min-w-max space-x-1 sm:space-x-2">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => changeSlide(index)}
              className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-5 py-1.5 sm:py-2.5 text-xs sm:text-sm rounded-full transition-all duration-300 whitespace-nowrap ${
                activeSlide === index ? "bg-white text-black" : "text-white hover:bg-white/10"
              }`}
            >
              <span className="w-4 h-4">{item.icon}</span>
              <span>{item.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Image Viewer */}
      <div className="relative w-full max-w-5xl mx-auto mb-12">
        <div className="bg-[#0a1525] rounded-xl overflow-hidden border border-white/10 shadow-2xl">
          <div className="h-8 bg-[#0a1525] flex items-center px-4 border-b border-white/10">
            <div className="flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
          </div>
          <div className="relative w-full aspect-[4/3] sm:aspect-[2/1]">
            {menuItems.map((item, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-300 ${
                  activeSlide === index ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                }`}
              >
                <Image
                  src={item.image || "/placeholder.svg?height=500&width=1000"}
                  alt={item.alt ?? "Interface screenshot"}
                  fill
                  className="object-contain"
                  priority={index === 0}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto w-full"
        ref={featureCardsRef}
      >
        {menuItems.map((item, index) => (
          <div
            key={index}
            className="bg-[#0a1525]/50 rounded-xl p-5 sm:p-6 text-left border border-white/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            {item.icon}
            <h3 className="text-lg sm:text-xl font-bold text-white mb-2">{item.title}</h3>
            <div className="text-sm sm:text-base text-white/80">
              <PrismicRichText field={item.description} />
            </div>
          </div>
        ))}
      </div>
    </div>
    </Bounded>
  );
};

export default Interface;