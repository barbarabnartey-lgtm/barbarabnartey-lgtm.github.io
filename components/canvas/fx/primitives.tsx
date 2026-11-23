"use client";

import { useMemo, useState } from "react";
import * as THREE from "three";
import { useExperience } from "@/lib/store";
import { audio } from "@/lib/audio";

let glowTex: THREE.Texture | null = null;
export function getGlowTexture() {
  if (glowTex) return glowTex;
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.25, "rgba(255,255,255,0.55)");
  g.addColorStop(0.6, "rgba(255,255,255,0.12)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 256);
  glowTex = new THREE.CanvasTexture(canvas);
  glowTex.colorSpace = THREE.SRGBColorSpace;
  return glowTex;
}

export function Glow({
  position,
  color,
  scale = 3,
  opacity = 0.6,
}: {
  position?: [number, number, number];
  color: string;
  scale?: number;
  opacity?: number;
}) {
  const tex = useMemo(() => (typeof document === "undefined" ? null : getGlowTexture()), []);
  if (!tex) return null;
  return (
    <sprite position={position} scale={[scale, scale, 1]}>
      <spriteMaterial
        map={tex}
        color={color}
        transparent
        opacity={opacity}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        toneMapped={false}
      />
    </sprite>
  );
}

export function HoloRing({
  radius = 2,
  tube = 0.012,
  color = "#67e8f9",
  opacity = 0.5,
  position = [0, 0, 0],
  rotation = [Math.PI / 2, 0, 0],
}: {
  radius?: number;
  tube?: number;
  color?: string;
  opacity?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
}) {
  return (
    <mesh position={position} rotation={rotation}>
      <torusGeometry args={[radius, tube, 6, 128]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={opacity}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  );
}

export function GridFloor({
  y = -2.2,
  color = "#67e8f9",
  opacity = 0.55,
  size = 90,
}: {
  y?: number;
  color?: string;
  opacity?: number;
  size?: number;
}) {
  const uniforms = useMemo(
    () => ({
      uColor: { value: new THREE.Color(color) },
      uOpacity: { value: opacity },
    }),
    [color, opacity],
  );

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, y, 0]}>
      <planeGeometry args={[size, size]} />
      <shaderMaterial
        transparent
        depthWrite={false}
        uniforms={uniforms}
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          varying vec2 vUv;
          uniform vec3 uColor;
          uniform float uOpacity;
          void main() {
            vec2 p = vUv * 80.0;
            vec2 g = abs(fract(p - 0.5) - 0.5) / max(fwidth(p), vec2(0.0001));
            float line = 1.0 - min(min(g.x, g.y), 1.0);
            vec2 p2 = vUv * 16.0;
            vec2 g2 = abs(fract(p2 - 0.5) - 0.5) / max(fwidth(p2), vec2(0.0001));
            float major = 1.0 - min(min(g2.x, g2.y), 1.0);
            float fade = smoothstep(0.58, 0.06, distance(vUv, vec2(0.5)));
            float alpha = (line * 0.22 + major * 0.55) * fade * uOpacity;
            gl_FragColor = vec4(uColor, alpha);
          }
        `}
      />
    </mesh>
  );
}

export function Beam({
  position = [0, 0, 0],
  radius = 0.4,
  height = 14,
  color = "#67e8f9",
  opacity = 0.08,
}: {
  position?: [number, number, number];
  radius?: number;
  height?: number;
  color?: string;
  opacity?: number;
}) {
  return (
    <mesh position={position}>
      <cylinderGeometry args={[radius * 0.35, radius, height, 24, 1, true]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={opacity}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        side={THREE.DoubleSide}
        toneMapped={false}
      />
    </mesh>
  );
}

export function useHover3D(label: string) {
  const [hovered, setHovered] = useState(false);
  const setHoverLabel = useExperience((s) => s.setHoverLabel);
  const handlers = {
    onPointerOver: (e: { stopPropagation: () => void }) => {
      e.stopPropagation();
      setHovered(true);
      setHoverLabel(label);
      audio.play("hover");
    },
    onPointerOut: (e: { stopPropagation: () => void }) => {
      e.stopPropagation();
      setHovered(false);
      setHoverLabel(null);
    },
  };
  return { hovered, handlers };
}
