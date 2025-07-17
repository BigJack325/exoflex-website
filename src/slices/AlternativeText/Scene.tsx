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

  const defaultRotationY = 2.5;

  const {
    xOffset,
    xOffset1,
    xOffset2,
    yOffset,
    yOffset1,
    yOffset2,
    defaultScale,
  } = useMemo(() => {
    switch (screenType) {
      case "tablet":
        return {
          xOffset: 0,
          xOffset1: 0.1,
          xOffset2: 0.4,
          yOffset: -0.35,
          yOffset1: -0.35,
          yOffset2: -0.25,
          defaultScale: 0.7,
        };
      case "laptop":
        return {
          xOffset: -0.1,
          xOffset1: 0.1,
          xOffset2: 0.6,
          yOffset: -0.3,
          yOffset1: -0.4,
          yOffset2: -0.45,
          defaultScale: 1,
        };
      case "desktop":
      default:
        return {
          xOffset: 0,
          xOffset1: 0,
          xOffset2: 1,
          yOffset: -0.8,
          yOffset1: -0.9,
          yOffset2: -0.7,
          defaultScale: 1.7,
        };
    }
  }, [screenType]);

  const animations = useMemo(() => {
    return [
      { x: xOffset, y: yOffset, z: 0, rotationY: 0, scale: defaultScale }, // frame 0
      { x: xOffset1, y: yOffset1, z: 0, rotationY: 3.8, scale: defaultScale }, // frame 1
      { x: xOffset2, y: yOffset2, z: -2, rotationY: 6.2, scale: defaultScale }, // frame 2
    ];
  }, [xOffset, xOffset1, xOffset2, yOffset, yOffset1, yOffset2, defaultScale]);

  useGSAP(
    () => {
      if (!protoRef.current || isMobile) return;

      const sections = gsap.utils.toArray<HTMLElement>(".alternating-section");

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".alternating-text-view",
          endTrigger: ".alternating-text-container",
          start: "top top",
          end: "bottom bottom",
          scrub: true,
          pin: true,
        },
      });

      sections.forEach((_, index) => {
        if (index === 0 || !protoRef.current) return;
        const { x, y, z, rotationY, scale } = animations[index] ?? animations[0];

        tl.to(protoRef.current.position, { x, y, z, duration: 0.5, ease: "circ.inOut" });
        tl.to(protoRef.current.rotation, { y: rotationY, duration: 0.5, ease: "circ.inOut" }, "<");
        tl.to(
          protoRef.current.scale,
          { x: scale, y: scale, z: scale, duration: 0.5, ease: "circ.inOut" },
          "<"
        );
      });
    },
    {
      dependencies: [screenType, animations],
      revertOnUpdate: true,
    }
  );

  useEffect(() => {
    if (protoRef.current) {
      protoRef.current.position.set(xOffset, yOffset, 0);
      protoRef.current.rotation.set(0, defaultRotationY, 0);
      protoRef.current.scale.set(defaultScale, defaultScale, defaultScale); // ✅ Fixed
    }
  }, [xOffset, yOffset, defaultRotationY, defaultScale]);

  if (isMobile) return null;

  return (
    <group
      ref={protoRef}
      position={[xOffset, yOffset, 0]}
      rotation={[0, defaultRotationY, 0]}
      scale={[defaultScale, defaultScale, defaultScale]} // ✅ Fixed
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