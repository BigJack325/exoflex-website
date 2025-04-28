"use client";

import { Float } from "@react-three/drei";
import { forwardRef, ReactNode, Suspense } from "react";
import { Group } from "three";
import dynamic from "next/dynamic";

type FloatingPrototypeProps = {
  floatSpeed?: number;
  rotationIntensity?: number;
  floatIntensity?: number;
  floatingRange?: [number, number];
  children?: ReactNode;
};

const Prototype = dynamic(() => import("./Prototype"), {
  ssr: false,
  loading: () => null,
});

const FloatingPrototype = forwardRef<Group, FloatingPrototypeProps>(
  (
    {
      floatSpeed = 1.5,
      rotationIntensity = 0.2,
      floatIntensity = 0.2,
      floatingRange = [-0.1, 0.1],
      children,
      ...props
    },
    ref
  ) => {
    return (
      <group ref={ref} {...props}>
        <Float
          speed={floatSpeed}
          rotationIntensity={rotationIntensity}
          floatIntensity={floatIntensity}
          floatingRange={floatingRange}
        >
          {children}

          <Suspense fallback={null}>
            <Prototype />
          </Suspense>
        </Float>
      </group>
    );
  }
);

FloatingPrototype.displayName = "FloatingPrototype";

export default FloatingPrototype;