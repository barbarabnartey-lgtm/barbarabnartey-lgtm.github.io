"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { future } from "@/data/profile";
import { useExperience } from "@/lib/store";
import { audio } from "@/lib/audio";
import { facadeTexture } from "@/lib/textures";
import { Label3D } from "../fx/Label3D";
import { SpaceBackdrop } from "../fx/Atmosphere";
import { Beam, Glow, GridFloor, useHover3D } from "../fx/primitives";

const TOWER_POS: [number, number, number][] = [
  [-7.4, 0, -0.8],
  [-2.6, 0, 1.5],
  [2.6, 0, -1.2],
  [7.4, 0, 1.1],
];

function FutureTower({ item, index }: { item: (typeof future)[number]; index: number }) {
  const selected = useExperience(
    (s) => s.selection?.zone === "future" && s.selection?.id === item.id,
  );
  const select = useExperience((s) => s.select);
  const handlers = useHover3D(item.title);
  const group = useRef<THREE.Group>(null);
  const scan = useRef<THREE.Mesh>(null);
  const pos = TOWER_POS[index % TOWER_POS.length];
  const height = item.height * 0.72;
  const texture = useMemo(() => {
    if (typeof document === "undefined") return null;
    return facadeTexture(item.id, item.accent, index + 7);
  }, [item.id, item.accent, index]);

  useFrame((state, delta) => {
    if (group.current) {
      const target = selected ? 1.05 : handlers.hovered ? 1.025 : 1;
      group.current.scale.lerp(new THREE.Vector3(1, target, 1), 1 - Math.exp(-delta * 7));
    }
    if (scan.current) {
      const t = (state.clock.elapsedTime * 0.18 + index * 0.23) % 1;
      scan.current.position.y = -2 + t * (height - 2);
      (scan.current.material as THREE.MeshBasicMaterial).opacity = 0.35 * (1 - t);
    }
  });

  return (
    <group position={pos}>
      <group ref={group}>
        <group
          {...handlers.handlers}
          onClick={(e) => {
            e.stopPropagation();
            audio.play("open");
            select(item.id);
          }}
        >
          <mesh position={[0, height / 2 - 2, 0]}>
            <boxGeometry args={[2.7, height, 2.7]} />
            <meshStandardMaterial
              map={texture ?? undefined}
              emissiveMap={texture ?? undefined}
              emissive={item.accent}
              emissiveIntensity={selected ? 1.5 : 0.7}
              color="#111a28"
              metalness={0.7}
              roughness={0.4}
            />
          </mesh>
          <mesh position={[0, height - 2, 0]}>
            <boxGeometry args={[2.9, 0.1, 2.9]} />
            <meshBasicMaterial color={item.accent} transparent opacity={0.85} />
          </mesh>
          <mesh position={[0, height - 1.15, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 1.7, 5]} />
            <meshBasicMaterial color={item.accent} transparent opacity={0.7} />
          </mesh>
          <mesh ref={scan} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
            <ringGeometry args={[1.8, 2.0, 48]} />
            <meshBasicMaterial color={item.accent} transparent opacity={0.2} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} depthWrite={false} />
          </mesh>
          <Beam position={[0, height + 4, 0]} radius={0.22} height={11} color={item.accent} opacity={0.05} />
          <Glow position={[0, height - 1.9, 0]} color={item.accent} scale={selected ? 4 : 2.4} opacity={selected ? 0.4 : 0.15} />
        </group>
      </group>
      <Label3D text={item.horizon} position={[0, height - 2.4, 1.6]} color={item.accent} size={30} scale={0.85} />
      <Label3D text={item.title} position={[0, height - 2.95, 1.6]} color="#f4e9ff" size={18} scale={0.5} opacity={0.85} />
      <Label3D text={item.subtitle} position={[0, height - 3.28, 1.6]} color="#b09cc0" size={13} scale={0.38} opacity={0.65} />
    </group>
  );
}

function Skyline() {
  const blocks = useMemo(() => {
    let seed = 47;
    const rand = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };
    const arr: { p: [number, number, number]; s: [number, number, number] }[] = [];
    for (let i = 0; i < 46; i++) {
      const x = (rand() - 0.5) * 56;
      const z = -8 - rand() * 26;
      const h = 2 + rand() * 12;
      arr.push({ p: [x, h / 2 - 2, z], s: [1 + rand() * 2.6, h, 1 + rand() * 2.6] });
    }
    return arr;
  }, []);
  return (
    <group>
      {blocks.map((b, i) => (
        <mesh key={i} position={b.p}>
          <boxGeometry args={b.s} />
          <meshStandardMaterial color="#0c1220" emissive="#f0abfc" emissiveIntensity={0.035} metalness={0.6} roughness={0.5} />
        </mesh>
      ))}
    </group>
  );
}

export function Future() {
  return (
    <>
      <SpaceBackdrop stars={3000} dust={420} dustColor="#f0abfc" />
      <fog attach="fog" args={["#04060e", 28, 85]} />
      <ambientLight intensity={0.36} />
      <directionalLight position={[14, 22, 12]} intensity={0.7} color="#ffe4fb" />
      <pointLight position={[-10, 8, 8]} intensity={30} color="#f0abfc" distance={44} />
      <pointLight position={[14, 4, -4]} intensity={18} color="#67e8f9" distance={36} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.02, 0]}>
        <planeGeometry args={[120, 120]} />
        <meshStandardMaterial color="#050810" metalness={0.8} roughness={0.4} />
      </mesh>
      <GridFloor y={-1.99} color="#f0abfc" opacity={0.35} size={120} />
      <Skyline />
      {future.map((item, i) => (
        <FutureTower key={item.id} item={item} index={i} />
      ))}
      <Label3D text="FUTURE VISION DISTRICT / PROJECTED" position={[2.4, 25.4, -3]} color="#f0abfc" size={24} scale={0.8} opacity={0.5} />
    </>
  );
}
