"use client";

import { useRef, useEffect, useMemo } from "react";
import { Group } from "three";
import { Environment } from "@react-three/drei";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import FloatingPrototype from "@/components/FloatingPrototype";
import { useScreenType } from "@/hooks/useScreenType";

export default function Scene() {
  const protoRef = useRef<Group>(null);
  const screenType = useScreenType();
  const isMobile = screenType === "mobile";
  const isTablet = screenType === "tablet";

  const defaultY = isTablet ? -0.55 : -0.9;
  const defaultRotationY = 2.5;
  const defaultScale = isTablet ? 1.5 : 2.5;

  const animations = useMemo(() => [
    { x: 0, y: -0.1, rotationY: 0, scale: 1 },
    { x: 0.2, y: defaultY, rotationY: 3.8, scale: defaultScale },
    { x: 0.65, y: defaultY + 0.2, rotationY: 6.2, scale: defaultScale * 0.6 },
  ], [defaultY, defaultScale]);

  const scrollTl = useRef<gsap.core.Timeline | null>(null);

  useGSAP(() => {
    if (!protoRef.current || isMobile) return;

    const sections = gsap.utils.toArray(".alternating-section");
  
    scrollTl.current?.scrollTrigger?.kill();
    scrollTl.current?.kill();
  
    scrollTl.current = gsap.timeline({
      scrollTrigger: {
        trigger: ".alternating-text-view",
        endTrigger: ".alternating-text-container",
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        pin: true
      },
    });
  
    sections.forEach((section, index) => {
      if (index === 0 || !protoRef.current) return;
      const { x, y, rotationY, scale } = animations[index] || { x: 0, y: 0, rotationY: 0, scale: 1 };
  
      scrollTl.current!.to(protoRef.current.position, { x, duration: 0.5, ease: "circ.inOut" });
      scrollTl.current!.to(protoRef.current.position, { y, duration: 0.5, ease: "circ.inOut" }, "<");
      scrollTl.current!.to(protoRef.current.rotation, { y: rotationY, duration: 0.5, ease: "circ.inOut" }, "<");
      scrollTl.current!.to(protoRef.current.scale, { x: scale, y: scale, z: scale, duration: 0.5, ease: "circ.inOut" }, "<");
    });
  
    return () => {
      scrollTl.current?.scrollTrigger?.kill();
      scrollTl.current?.kill();
      scrollTl.current = null;
    };
  }, [screenType, animations, isMobile]);

  useEffect(() => {
    if (protoRef.current) {
      protoRef.current.position.set(0, defaultY, 0);
      protoRef.current.rotation.set(0, defaultRotationY, 0);
      protoRef.current.scale.set(defaultScale, defaultScale, defaultScale);
    }
  }, [defaultY, defaultRotationY, defaultScale]);

  if (isMobile) return null;

  return (
    <group
      ref={protoRef}
      position={[0, defaultY+0.1, 0]}
      rotation={[0, defaultRotationY, 0]}
      scale={[defaultScale, defaultScale, defaultScale]}
    >
      <FloatingPrototype floatSpeed={1.2} />
      <Environment
        files="/hdr/studio_small.hdr"
        environmentIntensity={1.2}
        resolution={256}
      />
    </group>
  );
}