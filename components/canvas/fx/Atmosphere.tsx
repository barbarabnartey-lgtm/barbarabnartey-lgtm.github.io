"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import * as THREE from "three";

export function Dust({
  count = 700,
  radius = 22,
  color = "#67e8f9",
  size = 0.035,
  speed = 0.02,
  opacity = 0.55,
}: {
  count?: number;
  radius?: number;
  color?: string;
  size?: number;
  speed?: number;
  opacity?: number;
}) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = radius * (0.25 + Math.random() * 0.75);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.cos(phi) * 0.55;
      arr[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }
    return arr;
  }, [count, radius]);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * speed;
      ref.current.position.y = Math.sin(performance.now() * 0.0001) * 0.15;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={size}
        color={color}
        transparent
        opacity={opacity}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export function SpaceBackdrop({
  stars = 3600,
  dust = 500,
  dustColor = "#7dd3fc",
}: {
  stars?: number;
  dust?: number;
  dustColor?: string;
}) {
  return (
    <>
      <color attach="background" args={["#03050b"]} />
      <fog attach="fog" args={["#03050b", 22, 78]} />
      <Stars radius={90} depth={55} count={stars} factor={4.2} saturation={0} fade speed={0.35} />
      <Dust count={dust} radius={26} color={dustColor} size={0.04} opacity={0.45} />
    </>
  );
}
