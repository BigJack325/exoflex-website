"use client";

import { useProgress } from "@react-three/drei";
import { useEffect } from "react";
import { useStore } from "@/hooks/useStore";

export default function DreiProgressHandler() {
  const { progress } = useProgress();
  const setProgress = useStore((s) => s.setProgress);

  useEffect(() => {
    setProgress(progress / 100); 
  }, [progress, setProgress]);

  return null;
}