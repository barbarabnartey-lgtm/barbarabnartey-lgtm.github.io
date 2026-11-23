"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { research } from "@/data/profile";
import { useExperience } from "@/lib/store";
import { audio } from "@/lib/audio";
import { documentTexture } from "@/lib/textures";
import { Label3D } from "../fx/Label3D";
import { SpaceBackdrop } from "../fx/Atmosphere";
import { Glow, GridFloor, HoloRing, useHover3D } from "../fx/primitives";

const DOC_LAYOUT = [
  { x: -4.6, y: 2.1, z: 0.6, ry: 0.34, rz: -0.05 },
  { x: -1.6, y: 1.55, z: -0.4, ry: 0.12, rz: 0.02 },
  { x: 1.6, y: 1.95, z: -0.4, ry: -0.12, rz: -0.02 },
  { x: 4.6, y: 1.5, z: 0.6, ry: -0.34, rz: 0.05 },
];

function Document({ item, index }: { item: (typeof research)[number]; index: number }) {
  const selected = useExperience((s) => s.selection?.zone === "research" && s.selection?.id === item.id);
  const select = useExperience((s) => s.select);
  const handlers = useHover3D(item.title);
  const group = useRef<THREE.Group>(null);
  const layout = DOC_LAYOUT[index % DOC_LAYOUT.length];
  const texture = useMemo(() => {
    if (typeof document === "undefined") return null;
    return documentTexture(item);
  }, [item]);

  useFrame((state, delta) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    const scale = selected ? 1.08 : handlers.hovered ? 1.04 : 1;
    group.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 1 - Math.exp(-delta * 8));
    group.current.position.y = layout.y + Math.sin(t * 0.5 + index * 1.7) * 0.075;
    group.current.rotation.z = layout.rz + Math.sin(t * 0.3 + index) * 0.015;
    group.current.rotation.y = layout.ry + Math.sin(t * 0.22 + index * 2) * 0.04;
  });

  return (
    <group position={[layout.x, layout.y, layout.z]} ref={group}>
      <group
        {...handlers.handlers}
        onClick={(e) => {
          e.stopPropagation();
          audio.play("open");
          select(item.id);
        }}
      >
        <mesh>
          <planeGeometry args={[1.85, 2.5]} />
          <meshBasicMaterial
            map={texture ?? undefined}
            transparent
            opacity={selected ? 1 : 0.86}
            side={THREE.DoubleSide}
            toneMapped={false}
          />
        </mesh>
        <mesh position={[0, 0, -0.02]}>
          <planeGeometry args={[1.95, 2.6]} />
          <meshBasicMaterial
            color={item.accent}
            transparent
            opacity={selected ? 0.3 : handlers.hovered ? 0.18 : 0.06}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
        <mesh position={[0, 0, 0.03]}>
          <planeGeometry args={[1.85, 0.012]} />
          <meshBasicMaterial color={item.accent} transparent opacity={0.8} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      </group>
      <Glow position={[0, 0, -0.25]} color={item.accent} scale={2.8} opacity={0.16} />
      <Label3D text={`${item.index} / ${item.status.toUpperCase()}`} position={[0, -1.55, 0]} color={item.accent} size={16} scale={0.48} opacity={0.8} />
    </group>
  );
}

function LabTable() {
  const ring = useRef<THREE.Mesh>(null);
  const scan = useRef<THREE.Mesh>(null);
  const particles = useMemo(() => {
    const count = 160;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = Math.random() * 3.4;
      arr[i * 3] = Math.cos(angle) * r;
      arr[i * 3 + 1] = Math.random() * 4 - 0.6;
      arr[i * 3 + 2] = Math.sin(angle) * r;
    }
    return arr;
  }, []);
  const points = useRef<THREE.Points>(null);

  useFrame((state, delta) => {
    if (ring.current) ring.current.rotation.z += delta * 0.2;
    if (scan.current) {
      scan.current.position.y = 0.2 + ((state.clock.elapsedTime * 0.5) % 2.8);
      (scan.current.material as THREE.MeshBasicMaterial).opacity = 0.12 + Math.sin(state.clock.elapsedTime * 2) * 0.04;
    }
    if (points.current) {
      points.current.rotation.y += delta * 0.08;
      const positions = points.current.geometry.getAttribute("position") as THREE.BufferAttribute;
      for (let i = 0; i < positions.count; i++) {
        let y = positions.getY(i) + delta * 0.25;
        if (y > 3.4) y = -0.6;
        positions.setY(i, y);
      }
      positions.needsUpdate = true;
    }
  });

  return (
    <group position={[0, -0.9, 0]}>
      <mesh position={[0, -0.9, 0]}>
        <cylinderGeometry args={[2.9, 3.1, 0.26, 64]} />
        <meshStandardMaterial color="#070d18" metalness={0.9} roughness={0.25} />
      </mesh>
      <mesh position={[0, -0.76, 0]}>
        <cylinderGeometry args={[2.66, 2.66, 0.05, 64]} />
        <meshBasicMaterial color="#93c5fd" transparent opacity={0.22} />
      </mesh>
      <mesh ref={ring} position={[0, -0.71, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.8, 1.86, 96]} />
        <meshBasicMaterial color="#93c5fd" transparent opacity={0.55} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <HoloRing radius={2.45} rotation={[-Math.PI / 2, 0, 0]} opacity={0.18} position={[0, -0.69, 0]} />
      <mesh ref={scan} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.2, 0]}>
        <circleGeometry args={[2.7, 64]} />
        <meshBasicMaterial color="#93c5fd" transparent opacity={0.1} depthWrite={false} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh position={[0, 1.4, 0]}>
        <coneGeometry args={[2.15, 3.0, 48, 1, true]} />
        <meshBasicMaterial color="#93c5fd" transparent opacity={0.025} side={THREE.DoubleSide} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
      <points ref={points}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[particles, 3]} />
        </bufferGeometry>
        <pointsMaterial color="#93c5fd" size={0.03} transparent opacity={0.6} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} />
      </points>
      <Glow position={[0, -0.6, 0]} color="#93c5fd" scale={7} opacity={0.18} />
      <Label3D text="OBSERVATION DECK / LIVE RECORD" position={[0, -1.28, 2.6]} color="#93c5fd" size={17} scale={0.55} />
    </group>
  );
}

export function Research() {
  return (
    <>
      <SpaceBackdrop stars={2600} dust={380} dustColor="#93c5fd" />
      <ambientLight intensity={0.5} />
      <directionalLight position={[6, 10, 8]} intensity={0.7} color="#dbeafe" />
      <pointLight position={[0, 2, 5]} intensity={26} color="#93c5fd" distance={16} />
      <pointLight position={[-6, 1, 3]} intensity={12} color="#c4b5fd" distance={12} />
      <LabTable />
      {research.map((item, i) => (
        <Document key={item.id} item={item} index={i} />
      ))}
      <Label3D text="RESEARCH LABORATORY" position={[0, 4.55, -2]} color="#93c5fd" size={22} scale={0.72} opacity={0.55} />
      <GridFloor y={-3.3} color="#93c5fd" opacity={0.2} />
    </>
  );
}
