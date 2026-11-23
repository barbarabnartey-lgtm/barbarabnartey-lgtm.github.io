"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { projects } from "@/data/profile";
import { useExperience } from "@/lib/store";
import { audio } from "@/lib/audio";
import { projectTexture } from "@/lib/textures";
import { Label3D } from "../fx/Label3D";
import { SpaceBackdrop } from "../fx/Atmosphere";
import { Glow, GridFloor, useHover3D } from "../fx/primitives";

const LAYOUT = [
  { x: -6.6, y: 2.35, z: -2.6, ry: 0.28 },
  { x: -3.6, y: 1.45, z: -0.9, ry: 0.14 },
  { x: 0, y: 1.9, z: -0.2, ry: 0 },
  { x: 3.6, y: 1.3, z: -0.9, ry: -0.14 },
  { x: 6.6, y: 2.2, z: -2.6, ry: -0.28 },
];

function Panel({ project, index }: { project: (typeof projects)[number]; index: number }) {
  const selected = useExperience((s) => s.selection?.zone === "projects" && s.selection?.id === project.id);
  const select = useExperience((s) => s.select);
  const handlers = useHover3D(project.title);
  const group = useRef<THREE.Group>(null);
  const layout = LAYOUT[index % LAYOUT.length];
  const texture = useMemo(() => {
    if (typeof document === "undefined") return null;
    return projectTexture(project);
  }, [project]);

  useFrame((state, delta) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    const targetScale = selected ? 1.06 : handlers.hovered ? 1.035 : 1;
    group.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      1 - Math.exp(-delta * 8),
    );
    const targetY = layout.y + Math.sin(t * 0.55 + index * 1.4) * 0.1 + (selected || handlers.hovered ? 0.14 : 0);
    group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, targetY, 1 - Math.exp(-delta * 4));
    const targetRx = handlers.hovered ? -0.04 : 0;
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, targetRx, 1 - Math.exp(-delta * 5));
  });

  return (
    <group position={[layout.x, layout.y, layout.z]} rotation={[0, layout.ry, 0]}>
      <group ref={group}>
        <group
          {...handlers.handlers}
          onClick={(e) => {
            e.stopPropagation();
            audio.play("open");
            select(project.id);
          }}
        >
          <mesh position={[0, 0, -0.06]}>
            <boxGeometry args={[3.56, 2.26, 0.1]} />
            <meshStandardMaterial color="#0a1220" metalness={0.8} roughness={0.28} />
          </mesh>
          <mesh>
            <planeGeometry args={[3.4, 2.1]} />
            <meshBasicMaterial map={texture ?? undefined} toneMapped={false} transparent opacity={selected ? 1 : 0.92} />
          </mesh>
          <mesh position={[0, 0, 0.015]}>
            <planeGeometry args={[3.46, 2.16]} />
            <meshBasicMaterial
              color={project.accent}
              transparent
              opacity={selected ? 0.18 : handlers.hovered ? 0.1 : 0.03}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
          <mesh position={[0, -1.19, 0]}>
            <planeGeometry args={[3.56, 0.02]} />
            <meshBasicMaterial color={project.accent} transparent opacity={0.8} blending={THREE.AdditiveBlending} depthWrite={false} />
          </mesh>
        </group>
        <Glow position={[0, -0.4, -0.3]} color={project.accent} scale={selected ? 5.4 : 3.6} opacity={selected ? 0.3 : 0.12} />
        <Label3D
          text={`${project.index} — ${project.year}`}
          position={[0, -1.45, 0]}
          color={project.accent}
          size={18}
          scale={0.5}
          opacity={0.8}
        />
        <Label3D
          text={project.category}
          position={[0, -1.72, 0]}
          color="#93a3b8"
          size={14}
          scale={0.4}
          opacity={0.6}
        />
      </group>
    </group>
  );
}

function FloatingShards() {
  const group = useRef<THREE.Group>(null);
  const shards = useMemo(
    () =>
      Array.from({ length: 18 }).map((_, i) => ({
        p: [
          (Math.random() - 0.5) * 18,
          0.4 + Math.random() * 4.5,
          -4 - Math.random() * 3,
        ] as [number, number, number],
        s: 0.05 + Math.random() * 0.12,
        r: Math.random() * Math.PI,
        speed: 0.1 + Math.random() * 0.3,
        color: i % 3 === 0 ? "#c4b5fd" : "#5eead4",
      })),
    [],
  );
  useFrame((state, delta) => {
    if (!group.current) return;
    group.current.children.forEach((child, i) => {
      child.rotation.x += delta * shards[i].speed;
      child.rotation.y += delta * shards[i].speed * 0.7;
      child.position.y += Math.sin(state.clock.elapsedTime * 0.4 + i) * delta * 0.05;
    });
  });
  return (
    <group ref={group}>
      {shards.map((s, i) => (
        <mesh key={i} position={s.p} rotation={[s.r, s.r, 0]}>
          <boxGeometry args={[s.s, s.s, s.s]} />
          <meshBasicMaterial color={s.color} transparent opacity={0.35} />
        </mesh>
      ))}
    </group>
  );
}

export function Projects() {
  return (
    <>
      <SpaceBackdrop stars={2400} dust={350} dustColor="#5eead4" />
      <ambientLight intensity={0.55} />
      <directionalLight position={[0, 10, 12]} intensity={0.8} color="#dff7ff" />
      <pointLight position={[-8, 4, 7]} intensity={26} color="#5eead4" distance={20} />
      <pointLight position={[8, 2, 7]} intensity={20} color="#c4b5fd" distance={20} />
      <spotLight position={[0, 8, 4]} angle={0.7} penumbra={1} intensity={55} color="#ffffff" />

      <group position={[0, -0.2, 0]}>
        {projects.map((project, i) => (
          <Panel key={project.id} project={project} index={i} />
        ))}
        <FloatingShards />
        <Label3D text="EXHIBITION HALL / SELECTED WORKS" position={[0, 4.9, -3.4]} color="#5eead4" size={20} scale={0.66} opacity={0.6} />
      </group>
      <GridFloor y={-2.4} color="#5eead4" opacity={0.3} />
    </>
  );
}
