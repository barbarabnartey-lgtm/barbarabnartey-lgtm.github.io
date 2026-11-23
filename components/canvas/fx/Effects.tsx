"use client";

import { useMemo } from "react";
import {
  Bloom,
  ChromaticAberration,
  EffectComposer,
  Noise,
  Vignette,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";

export function Effects() {
  const offset = useMemo(() => new THREE.Vector2(0.0006, 0.0008), []);
  return (
    <EffectComposer multisampling={0} enableNormalPass={false}>
      <Bloom mipmapBlur intensity={1.05} luminanceThreshold={0.22} luminanceSmoothing={0.32} radius={0.72} />
      <ChromaticAberration offset={offset} radialModulation={false} modulationOffset={0} />
      <Noise premultiply blendFunction={BlendFunction.SOFT_LIGHT} opacity={0.32} />
      <Vignette eskil={false} offset={0.16} darkness={0.74} />
    </EffectComposer>
  );
}
