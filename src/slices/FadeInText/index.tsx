"use client";

import { FC, useRef } from "react";
import { SliceComponentProps } from "@prismicio/react";
import { Content } from "@prismicio/client";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { asText } from "@prismicio/client";
import { useStore } from "@/hooks/useStore";
import { usePathname } from "next/navigation";
import { useScreenType } from "@/hooks/useScreenType";
import { Bounded } from "@/components/Bounded";

export type FadeInTextProps = SliceComponentProps<Content.FadeInTextSlice>;

const FadeInText: FC<FadeInTextProps> = ({ slice }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const wordsRef = useRef<HTMLDivElement>(null);
  const ready = useStore((state) => state.ready);
  const pathname = usePathname();
  const screenType = useScreenType();

  useGSAP(
    () => {
      if (!containerRef.current || !wordsRef.current) return;

      const words = gsap.utils.toArray<HTMLSpanElement>(
        wordsRef.current.querySelectorAll(".fade-word")
      );

      gsap.fromTo(
        words,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.12,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 60%",
            end: "60% 60%",
            scrub: true,
          },
        }
      );
    },
    {
      dependencies: [ready, pathname, screenType],
      scope: containerRef,
      revertOnUpdate: true,
    }
  );

  const splitWords = (text: string) =>
    text.split(" ").map((word, i) => (
      <span key={i} className="fade-word inline-block mr-[0.3ch] opacity-0">
        {word}
        <span>&nbsp;</span>
      </span>
    ));

  return (
    <Bounded
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="fade-in-text min-h-screen flex items-center justify-center px-8 text-center text-white"
    >
      <div
        ref={containerRef}
        className="w-full flex items-center justify-center"
      >
        <div
          ref={wordsRef}
          className="max-w-4xl text-m md:text-3xl lg:text-6xl font-extrabold leading-tight flex flex-wrap justify-center text-justify"
        >
          {splitWords(asText(slice.primary.body))}
        </div>
      </div>
    </Bounded>
  );
};

export default FadeInText;