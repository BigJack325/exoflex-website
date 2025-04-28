"use client";

import { useState, useEffect } from "react";
import { PrismicNextLink } from "@prismicio/next";
import { cn } from "@/lib/utils";
import { SiFacebook, SiLinkedin } from "react-icons/si";
import { HiMenu, HiX } from "react-icons/hi";

import { LinkField } from "@prismicio/client";
import { useStore } from "@/hooks/useStore";

type NavItem = { link: LinkField };

export default function MobileNav({ items }: { items: NavItem[] }) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const ready = useStore((state) => state.ready);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      setActiveIndex(-1);
      return;
    }

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handleEscape);

    const enterTimeout = setTimeout(() => {
      setActiveIndex(0);
      const interval = setInterval(() => {
        setActiveIndex((prev) => {
          if (prev >= items.length - 1) {
            clearInterval(interval);
            return prev;
          }
          return prev + 1;
        });
      }, 100);
      return () => clearInterval(interval);
    }, 300);

    return () => {
      clearTimeout(enterTimeout);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open, items.length]);

  if (!ready) {
    return null;
  }

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        className={cn(
          "pointer-events-auto fixed top-6 right-6 z-[200] flex h-12 w-12 items-center justify-center rounded-full transition-all duration-500 md:top-8 md:right-8 lg:hidden"
        )}
      >
        {open ? (
          <HiX className="h-7 w-7 text-white transition-transform duration-500 rotate-90" />
        ) : (
          <HiMenu className="h-7 w-7 text-white transition-all" />
        )}
      </button>

      {open && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center lg:hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-black via-black/95 to-[#0a1930]" />
          <div className="absolute top-20 left-10 h-40 w-40 rounded-full bg-[#107df4]/10 blur-3xl transition-all duration-1000 opacity-70 translate-x-0" />
          <div className="absolute bottom-20 right-10 h-60 w-60 rounded-full bg-[#107df4]/10 blur-3xl transition-all duration-1000 delay-300 opacity-70 translate-x-0" />

          <nav className="relative z-10 flex flex-col items-start justify-center h-full max-w-md w-full px-12">
            <ul className="w-full space-y-6">
              {items.map((item, i) => (
                <li
                  key={i}
                  className={cn(
                    "transform transition-all duration-500",
                    activeIndex >= i
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 -translate-x-10"
                  )}
                  style={{ transitionDelay: `${(i + 1) * 100}ms` }}
                >
                  <PrismicNextLink
                    field={item.link}
                    onClick={() => setOpen(false)}
                    className="group relative flex items-center text-3xl md:text-4xl font-bold text-white/90 transition-all"
                  >
                    <span className="relative z-10 group-hover:text-[#107df4] transition-colors duration-300">
                      {item.link?.text || "Untitled"}
                    </span>
                    <span className="absolute -left-3 top-1/2 h-[120%] w-0 -translate-y-1/2 bg-white/5 transition-all duration-300 group-hover:w-[calc(100%+1.5rem)]" />
                    <span className="ml-2 text-[#107df4] opacity-0 transition-all duration-300 group-hover:ml-4 group-hover:opacity-100">
                      →
                    </span>
                  </PrismicNextLink>
                </li>
              ))}
            </ul>

            <div className="absolute bottom-16 left-12 flex space-x-6 transition-all duration-700 delay-500 opacity-100 translate-y-0">
              <a
                href="https://www.linkedin.com/company/exoflex/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="hover:text-[#107df4]"
              >
                <SiLinkedin className="h-6 w-6" />
              </a>
              <a
                href="https://www.facebook.com/exoflex66"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="hover:text-[#107df4]"
              >
                <SiFacebook className="h-6 w-6" />
              </a>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}