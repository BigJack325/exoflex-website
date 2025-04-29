"use client";

import { FC, useRef } from "react";
import { SliceComponentProps } from "@prismicio/react";
import { Content } from "@prismicio/client";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { asText } from "@prismicio/client";
import { useStore } from "@/hooks/useStore";
import { usePathname } from "next/navigation";

gsap.registerPlugin(ScrollTrigger);

export type FadeInTextProps = SliceComponentProps<Content.FadeInTextSlice>;

const FadeInText: FC<FadeInTextProps> = ({ slice }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const wordsRef = useRef<HTMLDivElement>(null);
  const ready = useStore((state) => state.ready);
  const pathname = usePathname();

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
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 70%",
            end: "25% 30%",
            scrub: true,
          },
        }
      );
    },
    { dependencies: [ready, pathname], scope: containerRef, revertOnUpdate: true }
  );

  const splitWords = (text: string) =>
    text.split(" ").map((word, i) => (
      <span
        key={i}
        className="fade-word inline-block mr-1 opacity-0"
      >
        {word}
        <span>&nbsp;</span>
      </span>
    ));

  return (
    <section
      ref={containerRef}
      className="min-h-screen flex items-center justify-center px-8 py-32 text-center"
    >
      <div
        ref={wordsRef}
        className="max-w-4xl text-m md:text-3xl lg:text-6xl font-extrabold leading-tight flex flex-wrap justify-center text-center"
      >
        {splitWords(asText(slice.primary.body))}
      </div>
    </section>
  );
};

export default FadeInText;