"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshReflectorMaterial } from "@react-three/drei";
import * as THREE from "three";
import { achievements } from "@/data/profile";
import { useExperience } from "@/lib/store";
import { audio } from "@/lib/audio";
import { Label3D } from "../fx/Label3D";
import { SpaceBackdrop } from "../fx/Atmosphere";
import { Glow, useHover3D } from "../fx/primitives";

const METALS: Record<string, { color: string; emissive: string }> = {
  gold: { color: "#d9a441", emissive: "#6b4410" },
  silver: { color: "#c3cad6", emissive: "#3a4350" },
  platinum: { color: "#dde7f2", emissive: "#36414f" },
};

const LAYOUT = achievements.map((_, i) => {
  const spread = 1.25;
  const angle = (i / (achievements.length - 1) - 0.5) * spread;
  const radius = 12.5;
  return {
    x: Math.sin(angle) * radius,
    z: Math.cos(angle) * radius - radius + 0.6,
    ry: -angle * 0.55,
  };
});

function Trophy({ item, index }: { item: (typeof achievements)[number]; index: number }) {
  const selected = useExperience(
    (s) => s.selection?.zone === "achievements" && s.selection?.id === item.id,
  );
  const select = useExperience((s) => s.select);
  const handlers = useHover3D(item.title);
  const group = useRef<THREE.Group>(null);
  const spin = useRef<THREE.Group>(null);
  const metal = METALS[item.metal] ?? METALS.gold;
  const layout = LAYOUT[index];

  const cupGeometry = useMemo(() => {
    const points: THREE.Vector2[] = [];
    for (let i = 0; i <= 20; i++) {
      const t = i / 20;
      const radius = 0.02 + Math.sin(t * Math.PI * 0.92) * 0.3 + t * 0.04;
      points.push(new THREE.Vector2(radius, t * 0.7));
    }
    return new THREE.LatheGeometry(points, 40);
  }, []);

  useFrame((state, delta) => {
    if (spin.current) spin.current.rotation.y += delta * (handlers.hovered || selected ? 0.8 : 0.22);
    if (group.current) {
      const target = selected ? 1.12 : handlers.hovered ? 1.06 : 1;
      group.current.scale.lerp(new THREE.Vector3(target, target, target), 1 - Math.exp(-delta * 7));
    }
  });

  return (
    <group position={[layout.x, 0, layout.z]} rotation={[0, layout.ry, 0]}>
      <group ref={group}>
        <group
          {...handlers.handlers}
          onClick={(e) => {
            e.stopPropagation();
            audio.play("chime");
            select(item.id);
          }}
        >
          <mesh position={[0, 0.62, 0]} castShadow>
            <cylinderGeometry args={[0.62, 0.72, 1.24, 6]} />
            <meshStandardMaterial color="#0b111c" metalness={0.85} roughness={0.3} />
          </mesh>
          <mesh position={[0, 1.26, 0]}>
            <cylinderGeometry args={[0.66, 0.66, 0.04, 6]} />
            <meshBasicMaterial color={item.accent} transparent opacity={0.7} />
          </mesh>
          <group ref={spin} position={[0, 1.32, 0]}>
            <mesh position={[0, 0.38, 0]} geometry={cupGeometry} castShadow>
              <meshStandardMaterial color={metal.color} metalness={1} roughness={0.22} emissive={metal.emissive} emissiveIntensity={0.4} />
            </mesh>
            <mesh position={[0, 0.38, 0]}>
              <torusGeometry args={[0.29, 0.022, 12, 48]} />
              <meshStandardMaterial color={metal.color} metalness={1} roughness={0.2} />
            </mesh>
            <mesh position={[0, 0.99, 0]}>
              <octahedronGeometry args={[0.16, 0]} />
              <meshStandardMaterial
                color={item.accent}
                emissive={item.accent}
                emissiveIntensity={1.4}
                metalness={0.5}
                roughness={0.2}
              />
            </mesh>
            <mesh position={[0, 1.18, 0]}>
              <sphereGeometry args={[0.045, 12, 12]} />
              <meshBasicMaterial color="#fff6dd" toneMapped={false} />
            </mesh>
          </group>
          <mesh position={[0, 1.06, 0]}>
            <cylinderGeometry args={[0.1, 0.13, 0.55, 12]} />
            <meshStandardMaterial color={metal.color} metalness={1} roughness={0.28} />
          </mesh>
        </group>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 1.28, 0]}>
          <ringGeometry args={[0.8, 0.83, 64]} />
          <meshBasicMaterial
            color={item.accent}
            transparent
            opacity={selected ? 0.9 : handlers.hovered ? 0.6 : 0.22}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
        <Glow position={[0, 2.2, -0.3]} color={item.accent} scale={selected ? 3.4 : 2.2} opacity={selected ? 0.4 : 0.16} />
        <pointLight position={[0, 2.4, 1.1]} intensity={selected ? 6 : 2.6} distance={4.2} color={item.accent} />
      </group>
      <Label3D text={item.index} position={[0, 0.24, 0.68]} color={item.accent} size={16} scale={0.44} opacity={0.7} />
      {(selected || handlers.hovered) && (
        <Label3D text={item.title} position={[0, 2.78, 0]} color={selected ? "#fff6e2" : "#dfe8f4"} size={18} scale={0.62} />
      )}
      <Label3D text={`${item.category.toUpperCase()} / ${item.year}`} position={[0, 2.46, 0]} color="#93a3b8" size={13} scale={0.36} opacity={0.6} />
      <mesh position={[0, 4.6, 0]}>
        <coneGeometry args={[0.82, 6.2, 24, 1, true]} />
        <meshBasicMaterial
          color={item.accent}
          transparent
          opacity={selected ? 0.032 : 0.014}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

function Colonnade() {
  return (
    <group>
      {[-11.5, -7.4, 7.4, 11.5].map((x, i) => (
        <group key={i} position={[x, 0, -5.4]}>
          <mesh position={[0, 3, 0]}>
            <boxGeometry args={[0.5, 12, 0.5]} />
            <meshStandardMaterial color="#0a0f19" metalness={0.7} roughness={0.4} />
          </mesh>
          <mesh position={[0, 3, 0.26]}>
            <boxGeometry args={[0.03, 12, 0.02]} />
            <meshBasicMaterial color="#f5c97b" transparent opacity={0.35} />
          </mesh>
        </group>
      ))}
      <mesh position={[0, 9.2, -5.4]}>
        <boxGeometry args={[25, 0.4, 0.6]} />
        <meshStandardMaterial color="#0a0f19" metalness={0.8} roughness={0.3} />
      </mesh>
    </group>
  );
}

export function Achievements() {
  return (
    <>
      <SpaceBackdrop stars={1400} dust={240} dustColor="#f5c97b" />
      <fog attach="fog" args={["#03060c", 18, 52]} />
      <ambientLight intensity={0.36} />
      <directionalLight position={[0, 10, 8]} intensity={0.5} color="#fff2da" />
      <pointLight position={[0, 6, 6]} intensity={40} color="#f5c97b" distance={26} />
      <pointLight position={[0, 2.6, 9]} intensity={14} color="#ffe1ad" distance={16} />
      <Colonnade />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.1, 0]}>
        <planeGeometry args={[40, 24]} />
        <MeshReflectorMaterial
          blur={[220, 90]}
          resolution={512}
          mixBlur={1.2}
          mixStrength={1.6}
          roughness={0.85}
          depthScale={1.1}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#05080f"
          metalness={0.7}
          mirror={0.35}
        />
      </mesh>

      {achievements.map((item, i) => (
        <Trophy key={item.id} item={item} index={i} />
      ))}

      <Label3D text="HALL OF ACHIEVEMENTS" position={[0.8, 6.1, -2.4]} color="#f5c97b" size={24} scale={0.8} opacity={0.55} />
      <Label3D text="SEVEN OBJECTS / ONE RECORD" position={[0.8, 5.74, -2.4]} color="#a08c6a" size={15} scale={0.45} opacity={0.6} />
    </>
  );
}
