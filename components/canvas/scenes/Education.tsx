"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { education } from "@/data/profile";
import { useExperience } from "@/lib/store";
import { audio } from "@/lib/audio";
import { facadeTexture } from "@/lib/textures";
import { Label3D } from "../fx/Label3D";
import { SpaceBackdrop } from "../fx/Atmosphere";
import { Glow, GridFloor, useHover3D } from "../fx/primitives";

const POSITIONS: Record<string, [number, number, number]> = {
  primary: [-10.4, 0, 1.4],
  junior: [-5.8, 0, -1.1],
  senior: [-1.3, 0, 1.8],
  university: [3.6, 0, -0.4],
  professional: [8.8, 0, 1.2],
};

function Tower({
  item,
  order,
}: {
  item: (typeof education)[number];
  order: number;
}) {
  const selected = useExperience((s) => s.selection?.zone === "education" && s.selection?.id === item.id);
  const select = useExperience((s) => s.select);
  const handlers = useHover3D(item.institution);
  const mesh = useRef<THREE.Mesh>(null);
  const group = useRef<THREE.Group>(null);
  const pos = POSITIONS[item.id] ?? [0, 0, 0];
  const height = item.height;
  const texture = useMemo(() => {
    if (typeof document === "undefined") return null;
    return facadeTexture(item.id, item.accent, order + 1);
  }, [item.id, item.accent, order]);

  useFrame((state, delta) => {
    const active = selected || handlers.hovered;
    if (group.current) {
      const target = active ? 1.035 : 1;
      group.current.scale.lerp(new THREE.Vector3(1, target, 1), 1 - Math.exp(-delta * 8));
    }
    if (mesh.current) {
      const mat = mesh.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = THREE.MathUtils.lerp(
        mat.emissiveIntensity,
        active ? 1.9 : 0.75,
        1 - Math.exp(-delta * 6),
      );
    }
  });

  return (
    <group position={pos}>
      <group ref={group}>
        <mesh
          ref={mesh}
          position={[0, height / 2 - 2, 0]}
          castShadow
          receiveShadow
          {...handlers.handlers}
          onClick={(e) => {
            e.stopPropagation();
            audio.play("open");
            select(item.id);
          }}
        >
          <boxGeometry args={[2.1, height, 2.1]} />
          <meshStandardMaterial
            map={texture ?? undefined}
            emissiveMap={texture ?? undefined}
            emissive={item.accent}
            emissiveIntensity={0.8}
            color="#16202f"
            roughness={0.5}
            metalness={0.55}
          />
        </mesh>

        <mesh position={[0, height - 2 + 0.06, 0]}>
          <boxGeometry args={[2.34, 0.12, 2.34]} />
          <meshStandardMaterial color="#0b1220" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[0, height - 1.9, 0]}>
          <boxGeometry args={[2.36, 0.02, 2.36]} />
          <meshBasicMaterial color={item.accent} transparent opacity={0.7} />
        </mesh>
        <mesh position={[0, height - 1.3, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 1.4, 6]} />
          <meshBasicMaterial color={item.accent} transparent opacity={0.5} />
        </mesh>
        <Glow position={[0, height - 0.6, 0]} color={item.accent} scale={1.6} opacity={selected ? 0.65 : 0.25} />

        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.96, 0]}>
          <ringGeometry args={[1.9, 2.02, 64]} />
          <meshBasicMaterial
            color={item.accent}
            transparent
            opacity={selected ? 0.85 : handlers.hovered ? 0.6 : 0.25}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      </group>

      <Label3D text={item.stage} position={[0, height - 1.1, 1.15]} color={item.accent} size={26} scale={0.72} />
      <Label3D text={item.years} position={[0, height - 1.55, 1.15]} color="#cfd9e8" size={16} scale={0.5} opacity={0.75} />
      <Label3D
        text={item.institution}
        position={[0, height - 1.95, 1.15]}
        color="#9fb0c6"
        size={14}
        scale={0.44}
        opacity={selected ? 0.95 : 0.55}
      />
    </group>
  );
}

function Skyline() {
  const blocks = useMemo(() => {
    const arr: { p: [number, number, number]; s: [number, number, number]; o: number }[] = [];
    let seed = 11;
    const rand = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };
    for (let i = 0; i < 42; i++) {
      const x = (rand() - 0.5) * 44;
      const z = -12 - rand() * 20;
      const h = 2 + rand() * 9;
      if (Math.abs(x) < 13 && z > -20) continue;
      arr.push({
        p: [x, h / 2 - 2, z],
        s: [1 + rand() * 2.4, h, 1 + rand() * 2.4],
        o: 0.04 + rand() * 0.12,
      });
    }
    return arr;
  }, []);

  return (
    <group>
      {blocks.map((b, i) => (
        <mesh key={i} position={b.p}>
          <boxGeometry args={b.s} />
          <meshBasicMaterial color="#1a2a3f" transparent opacity={0.35} />
        </mesh>
      ))}
      {blocks.map((b, i) => (
        <mesh key={`e${i}`} position={[b.p[0], b.p[1] + b.s[1] / 2, b.p[2]]}>
          <boxGeometry args={[b.s[0] * 0.96, 0.02, b.s[2] * 0.96]} />
          <meshBasicMaterial color="#fbbf77" transparent opacity={b.o} />
        </mesh>
      ))}
    </group>
  );
}

function TimelineRoute() {
  const geometry = useMemo(() => {
    const points = Object.values(POSITIONS).map(
      (p, i) => new THREE.Vector3(p[0], (education[i]?.height ?? 8) - 1.2, p[2] + 1.6),
    );
    return new THREE.BufferGeometry().setFromPoints(points);
  }, []);
  return (
    <primitive object={new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: "#fbbf77", transparent: true, opacity: 0.25, blending: THREE.AdditiveBlending }))} />
  );
}

export function Education() {
  return (
    <>
      <SpaceBackdrop stars={2000} dust={320} dustColor="#fbbf77" />
      <fog attach="fog" args={["#04070e", 24, 62]} />
      <ambientLight intensity={0.58} />
      <directionalLight position={[10, 18, 8]} intensity={1.35} color="#ffe6c2" castShadow shadow-mapSize={[1024, 1024]} />
      <directionalLight position={[-8, 6, 6]} intensity={0.4} color="#7dd3fc" />
      <pointLight position={[-6, 2, 6]} intensity={22} color="#fbbf77" distance={18} />
      <pointLight position={[8, 3, 2]} intensity={16} color="#67e8f9" distance={16} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.02, 0]} receiveShadow>
        <planeGeometry args={[90, 90]} />
        <meshStandardMaterial color="#060b14" roughness={0.32} metalness={0.85} />
      </mesh>
      <GridFloor y={-1.99} color="#fbbf77" opacity={0.38} />
      <Skyline />
      <TimelineRoute />
      {education.map((item, i) => (
        <Tower key={item.id} item={item} order={i} />
      ))}
      <Label3D
        text="EDUCATION / 2010 — 2026"
        position={[-10.4, 6.2, -4]}
        color="#fbbf77"
        size={20}
        scale={0.7}
        opacity={0.7}
      />
    </>
  );
}
