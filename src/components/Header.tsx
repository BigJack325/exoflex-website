"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { PrismicNextLink } from "@prismicio/next";
import { cn } from "@/lib/utils";
import MobileNav from "./MobileNav";
import { usePathname } from "next/navigation";
import { LinkField } from "@prismicio/client";
import { useStore } from "@/hooks/useStore";

type NavItem = { link: LinkField };

export default function Header({ items }: { items: NavItem[] }) {
  const [scrolled, setScrolled] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const pathname = usePathname();
  const ready = useStore((state) => state.ready);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!ready) {
    return null;
  }

  return (
    <header
      className={cn(
        "pointer-events-none fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "py-4 bg-black/80 bg-gradient-to-b backdrop-blur-md shadow-lg"
          : "py-4 bg-gradient-to-b from-black/50 to-transparent backdrop-blur-sm",
      )}
    >
      <div className="mx-auto flex max-w-screen-xl items-center justify-between px-4 sm:px-6 lg:px-8">

        <a
          href="#"
          onClick={scrollToTop}
          className="pointer-events-auto relative flex-shrink-0 group"
        >
          <div className="absolute -inset-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <Image
            src="/images/logo.png"
            alt="Logo"
            width={120}
            height={36}
            priority
            className="h-auto w-[80px] cursor-pointer transition-transform duration-300 group-hover:scale-105 sm:w-[100px] md:w-[120px]"
          />
        </a>

        <nav className="pointer-events-auto hidden gap-6 lg:flex md:gap-8">
        {items.map((item, idx) => {
          const normalizedLink = (item.link && "url" in item.link && item.link.url)
            ? item.link.url.replace(/^https?:\/\/[^/]+/, '')
            : '/';
          const isActive = normalizedLink === pathname;

          return (
            <div
              key={idx}
              className="relative"
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <PrismicNextLink
                field={item.link && "url" in item.link ? item.link : undefined}
                className="relative z-10 text-sm font-medium text-white/90 transition-colors md:text-base"
              >
                {item.link?.text || "Untitled"}
                <span
                  className={cn(
                    "absolute left-0 right-0 -bottom-1 h-[2px] bg-[#107df4] transition-all duration-300 origin-left",
                    hoveredIndex === idx || isActive ? "scale-x-100" : "scale-x-0"
                  )}
                />
              </PrismicNextLink>
            </div>
          );
        })}
        </nav>

        <div className="pointer-events-auto lg:hidden">
          <MobileNav items={items} />
        </div>
      </div>

      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#107df4]/30 to-transparent transition-opacity duration-300",
          scrolled ? "opacity-100" : "opacity-0",
        )}
      />
    </header>
  );
}