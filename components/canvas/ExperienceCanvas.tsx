"use client";

import { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { CameraRig } from "./CameraRig";
import { SceneRouter } from "./SceneRouter";
import { Effects } from "./fx/Effects";

export function ExperienceCanvas({ onReady }: { onReady?: () => void }) {
  const [toneSet, setToneSet] = useState(false);

  return (
    <Canvas
      shadows
      dpr={[1, 1.6]}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
        stencil: false,
      }}
      camera={{ position: [0, 0.4, 9], fov: 45, near: 0.1, far: 220 }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.12;
        gl.shadowMap.type = THREE.PCFSoftShadowMap;
        if (!toneSet) {
          setToneSet(true);
          onReady?.();
        }
      }}
      style={{ position: "fixed", inset: 0 }}
    >
      <Suspense fallback={null}>
        <CameraRig />
        <SceneRouter />
        <Effects />
      </Suspense>
    </Canvas>
  );
}
