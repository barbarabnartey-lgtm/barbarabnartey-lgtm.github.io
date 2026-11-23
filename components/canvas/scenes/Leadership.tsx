"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { leadership } from "@/data/profile";
import { useExperience } from "@/lib/store";
import { audio } from "@/lib/audio";
import { consoleTexture } from "@/lib/textures";
import { Label3D } from "../fx/Label3D";
import { SpaceBackdrop } from "../fx/Atmosphere";
import { Glow, HoloRing, useHover3D } from "../fx/primitives";

function Console({ item, index }: { item: (typeof leadership)[number]; index: number }) {
  const selected = useExperience(
    (s) => s.selection?.zone === "leadership" && s.selection?.id === item.id,
  );
  const select = useExperience((s) => s.select);
  const handlers = useHover3D(item.role);
  const group = useRef<THREE.Group>(null);
  const texture = useMemo(() => {
    if (typeof document === "undefined") return null;
    return consoleTexture("console", item.accent);
  }, [item.accent]);
  const angle = (index / Math.max(1, leadership.length - 1) - 0.5) * 1.35;
  const radius = 8.8;
  const x = Math.sin(angle) * radius;
  const z = Math.cos(angle) * radius - radius + 1.2;

  useFrame((state, delta) => {
    if (!group.current) return;
    const target = selected ? 1.06 : handlers.hovered ? 1.03 : 1;
    group.current.scale.lerp(new THREE.Vector3(target, target, target), 1 - Math.exp(-delta * 8));
  });

  return (
    <group ref={group} position={[x, 0, z]} rotation={[0, angle * -0.8, 0]}>
      <group
        {...handlers.handlers}
        onClick={(e) => {
          e.stopPropagation();
          audio.play("open");
          select(item.id);
        }}
      >
        <mesh position={[0, 0.55, 0]}>
          <boxGeometry args={[2.6, 1.1, 0.9]} />
          <meshStandardMaterial color="#0b0f18" metalness={0.85} roughness={0.3} />
        </mesh>
        <mesh position={[0, 1.35, -0.14]} rotation={[-0.24, 0, 0]}>
          <planeGeometry args={[2.34, 1.18]} />
          <meshBasicMaterial map={texture ?? undefined} toneMapped={false} transparent opacity={selected ? 1 : 0.88} />
        </mesh>
        <mesh position={[0, 1.35, -0.16]} rotation={[-0.24, 0, 0]} scale={[1.03, 1.06, 1]}>
          <planeGeometry args={[2.34, 1.18]} />
          <meshBasicMaterial
            color={item.accent}
            transparent
            opacity={selected ? 0.3 : handlers.hovered ? 0.18 : 0.05}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
        <mesh position={[0, 1.15, 0.36]}>
          <planeGeometry args={[2.5, 0.02]} />
          <meshBasicMaterial color={item.accent} transparent opacity={0.7} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
        <Glow position={[0, 1.9, -0.4]} color={item.accent} scale={2.4} opacity={selected ? 0.35 : 0.12} />
      </group>
      <Label3D text={item.role} position={[0, 2.15, 0.1]} color={item.accent} size={20} scale={0.5} />
      <Label3D text={item.scope} position={[0, 1.9, 0.1]} color="#93a3b8" size={13} scale={0.36} opacity={0.7} />
    </group>
  );
}

function Table() {
  const globe = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    if (globe.current) {
      globe.current.rotation.y += delta * 0.18;
      globe.current.position.y = 1.55 + Math.sin(state.clock.elapsedTime * 0.7) * 0.04;
    }
  });
  return (
    <group>
      <mesh position={[0, 0.2, -2.5]}>
        <cylinderGeometry args={[2.1, 2.3, 0.22, 48]} />
        <meshStandardMaterial color="#080d16" metalness={0.9} roughness={0.25} />
      </mesh>
      <mesh position={[0, 0.33, -2.5]}>
        <cylinderGeometry args={[1.96, 1.96, 0.03, 48]} />
        <meshBasicMaterial color="#67e8f9" transparent opacity={0.08} />
      </mesh>
      <group ref={globe} position={[0, 1.55, -2.5]}>
        <mesh>
          <icosahedronGeometry args={[0.7, 2]} />
          <meshBasicMaterial color="#fb923c" wireframe transparent opacity={0.35} />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.63, 24, 24]} />
          <meshBasicMaterial color="#fb923c" transparent opacity={0.06} />
        </mesh>
        <Glow scale={3} opacity={0.18} color="#fb923c" />
      </group>
      <HoloRing radius={2.35} rotation={[-Math.PI / 2, 0, 0]} opacity={0.16} color="#67e8f9" position={[0, 0.35, -2.5]} />
      <HoloRing radius={1.4} rotation={[Math.PI / 2, 0, 0]} opacity={0.2} color="#67e8f9" position={[0, 1.55, -2.5]} />
    </group>
  );
}

function ScreenWall() {
  const texture = useMemo(() => {
    if (typeof document === "undefined") return null;
    return consoleTexture("command", "#fb923c");
  }, []);
  return (
    <group position={[0, 0, -4.4]}>
      {[-4.8, -1.6, 1.6, 4.8].map((x, i) => (
        <mesh key={i} position={[x, 2.5, 0]} rotation={[0, -x * 0.06, 0]}>
          <planeGeometry args={[3.0, 1.7]} />
          <meshBasicMaterial map={texture ?? undefined} toneMapped={false} transparent opacity={0.5} />
        </mesh>
      ))}
      <mesh position={[0, 0.6, 0]}>
        <boxGeometry args={[12, 0.12, 0.4]} />
        <meshBasicMaterial color="#fb923c" transparent opacity={0.16} />
      </mesh>
    </group>
  );
}

export function Leadership() {
  return (
    <>
      <SpaceBackdrop stars={1600} dust={260} dustColor="#fb923c" />
      <fog attach="fog" args={["#04060d", 16, 42]} />
      <ambientLight intensity={0.42} />
      <pointLight position={[0, 4.5, 2]} intensity={32} color="#fb923c" distance={18} />
      <pointLight position={[-6, 3, 4]} intensity={16} color="#67e8f9" distance={14} />
      <directionalLight position={[4, 8, 6]} intensity={0.35} color="#ffe6cf" />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.9, 0]}>
        <planeGeometry args={[40, 30]} />
        <meshStandardMaterial color="#05080f" metalness={0.85} roughness={0.35} />
      </mesh>
      <ScreenWall />
      <Table />
      {leadership.map((item, i) => (
        <Console key={item.id} item={item} index={i} />
      ))}
      <Label3D text="COMMAND ROOM / ACTIVE MANDATES" position={[0, 5.3, -4]} color="#fb923c" size={21} scale={0.66} opacity={0.5} />
      <GridFloorLite />
    </>
  );
}

function GridFloorLite() {
  return (
    <group position={[0, -0.88, 0]}>
      <HoloRing radius={4.6} rotation={[-Math.PI / 2, 0, 0]} opacity={0.14} color="#fb923c" />
      <HoloRing radius={6.2} rotation={[-Math.PI / 2, 0, 0]} opacity={0.07} color="#fb923c" />
    </group>
  );
}
