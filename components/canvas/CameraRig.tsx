"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { Stage } from "@/data/profile";
import { useExperience } from "@/lib/store";

type Preset = { pos: [number, number, number]; target: [number, number, number]; fov: number };

const PRESETS: Record<Stage, Preset> = {
  intro: { pos: [0, 0.4, 9], target: [0, 0, 0], fov: 45 },
  hub: { pos: [0, 3.1, 17.6], target: [0, 0.3, 0], fov: 46 },
  about: { pos: [0.5, 1.4, 9.7], target: [0.9, 1.25, 0], fov: 46 },
  education: { pos: [1.4, 18.5, 39], target: [3, 10.2, 0], fov: 48 },
  projects: { pos: [0, 2.6, 15.4], target: [2.2, 1.9, -1.2], fov: 46 },
  research: { pos: [0.4, 3.4, 12.8], target: [1.8, 1.5, 0], fov: 45 },
  skills: { pos: [0, 8.4, 20.5], target: [1, 0, 0], fov: 46 },
  achievements: { pos: [1.2, 3.4, 15.8], target: [2.4, 1.9, -0.6], fov: 44 },
  leadership: { pos: [0.6, 2.9, 12.8], target: [1.7, 1.4, 0], fov: 45 },
  innovation: { pos: [0.8, 2.4, 13.4], target: [1.8, 1.6, 0], fov: 45 },
  future: { pos: [22, 18, 40], target: [3, 11, 0], fov: 50 },
  contact: { pos: [0.4, 1.8, 10.2], target: [1.2, 1.5, 0], fov: 44 },
};

export function CameraRig() {
  const stage = useExperience((s) => s.stage);
  const { camera } = useThree();
  const target = useRef(new THREE.Vector3(0, 0, 0));
  const look = useRef(new THREE.Vector3(0, 0, 0));
  const initialized = useRef(false);
  const lastStage = useRef<Stage>(stage);

  useFrame((state, delta) => {
    if (stage === "intro") {
      lastStage.current = stage;
      return;
    }
    const preset = PRESETS[stage];
    const parallax = state.pointer;
    const t = state.clock.elapsedTime;
    const amp = preset.fov / 50;
    const swayX = Math.sin(t * 0.21) * 0.18 + Math.cos(t * 0.13) * 0.08;
    const swayY = Math.cos(t * 0.17) * 0.12;

    target.current.set(
      preset.pos[0] + parallax.x * 0.9 * amp + swayX,
      preset.pos[1] + parallax.y * 0.55 * amp + swayY,
      preset.pos[2],
    );
    look.current.set(...preset.target);

    const speed = lastStage.current === stage ? 1.7 : 2.6;
    const damp = 1 - Math.exp(-delta * speed);
    camera.position.lerp(target.current, damp);
    const currentLook = new THREE.Vector3();
    camera.getWorldDirection(currentLook);
    const desiredLook = look.current.clone().sub(camera.position).normalize();
    const blended = currentLook.lerp(desiredLook, 1 - Math.exp(-delta * 3.2));
    const lookAt = camera.position.clone().add(blended.multiplyScalar(10));
    camera.lookAt(lookAt);

    const perspective = camera as THREE.PerspectiveCamera;
    if (Math.abs(perspective.fov - preset.fov) > 0.01) {
      perspective.fov = THREE.MathUtils.lerp(perspective.fov, preset.fov, 1 - Math.exp(-delta * 2.4));
      perspective.updateProjectionMatrix();
    }

    initialized.current = true;
    lastStage.current = stage;
  });

  return null;
}
