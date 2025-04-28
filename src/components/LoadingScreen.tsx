// src/components/LoadingScreen.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useStore } from "@/hooks/useStore";

const FADE_MS  = 100;
const COMPLETE = 0.99;

export default function LoadingScreen() {
  const progress = useStore((s) => s.progress);
  const setReady = useStore((s) => s.setReady);

  const [fade,   setFade]   = useState(false);
  const [hidden, setHidden] = useState(false);

  // 1) Tear out the server splash immediately
  useEffect(() => {
    document.getElementById("initial-loader")?.remove();
  }, []);

  // 2) When the 3D canvas progress finishes, start the fade
  useEffect(() => {
    if (fade || progress < COMPLETE) return;
    setFade(true);
  }, [progress, fade]);

  // 3) After FADE_MS, mark ready & unmount
  useEffect(() => {
    if (!fade) return;
    const t = setTimeout(() => {
      setReady();
      setHidden(true);
    }, FADE_MS);
    return () => clearTimeout(t);
  }, [fade, setReady]);

  // 4) Lock scrolling while the loader is visible
  useEffect(() => {
    if (hidden) return;
    const orig = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = orig; };
  }, [hidden]);

  if (hidden) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-black transition-opacity"
      )}
      style={{ transitionDuration: `${FADE_MS}ms`, opacity: fade ? 0 : 1 }}
    >
      <div className="relative animate-pulse">
        <div className="animate-spin-slow">
          <Image
            src="/images/logo_only.png"
            alt="Loading"
            width={120}
            height={120}
            className="relative z-10 select-none"
          />
        </div>
        <div
          className="
            absolute top-1/2 left-1/2
            -translate-x-1/2 -translate-y-1/2
            h-24 w-24 rounded-full
            bg-[#107df4]/20 blur-xl
            animate-pulse
          "
        />
      </div>
    </div>
  );
}