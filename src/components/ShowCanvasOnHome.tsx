"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import LoadingScreen from "./LoadingScreen";
import { useStore } from "@/hooks/useStore";
import { useScreenType } from "@/hooks/useScreenType";

const ViewCanvas = dynamic(() => import("./ViewCanvas"), {
  ssr: false,
  loading: () => null,
});

export default function ShowCanvasOnHome() {
  const pathname   = usePathname();
  const isHome     = pathname === "/";
  const screenType = useScreenType();
  const isMobile   = screenType === "mobile";
  const setReady   = useStore((s) => s.setReady);

  // 📌 NEW: only true after this component has mounted
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // 👉 Remove the server splash on *every* route reload
  useEffect(() => {
    document.getElementById("initial-loader")?.remove();
  }, []);

  // 🛠 Skip loader immediately whenever we're NOT on "/" OR we're on mobile
  useEffect(() => {
    if (!isHome || isMobile) {
      setReady();
    }
  }, [isHome, isMobile, setReady]);

  // 📌 Wait until after mount before applying the mobile check
  if (!mounted) return null;

  // only show loader & canvas on desktop home
  if (!isHome || isMobile) return null;

  return (
    <>
      <LoadingScreen />
      <ViewCanvas />
    </>
  );
}