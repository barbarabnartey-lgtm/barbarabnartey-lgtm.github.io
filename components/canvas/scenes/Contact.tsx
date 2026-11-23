"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useExperience } from "@/lib/store";
import { audio } from "@/lib/audio";
import { consoleTexture } from "@/lib/textures";
import { Label3D } from "../fx/Label3D";
import { SpaceBackdrop } from "../fx/Atmosphere";
import { Glow, HoloRing } from "../fx/primitives";

function TransmissionParticles() {
  const points = useRef<THREE.Points>(null);
  const data = useMemo(() => {
    const count = 420;
    const seeds = new Float32Array(count * 4);
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      seeds[i * 4] = Math.random() * Math.PI * 2;
      seeds[i * 4 + 1] = 3.4 + Math.random() * 6;
      seeds[i * 4 + 2] = (Math.random() - 0.5) * 3.2;
      seeds[i * 4 + 3] = Math.random();
    }
    return { seeds, positions, count };
  }, []);

  useFrame((state) => {
    if (!points.current) return;
    const attr = points.current.geometry.getAttribute("position") as THREE.BufferAttribute;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < data.count; i++) {
      const a = data.seeds[i * 4] + t * 0.12;
      const r = data.seeds[i * 4 + 1] - ((t * 0.18 + data.seeds[i * 4 + 3]) % 1) * 2.4;
      const yOff = data.seeds[i * 4 + 2];
      attr.setXYZ(i, Math.cos(a) * r, 1.4 + Math.sin(a * 2 + i) * 0.6 + yOff * 0.4, Math.sin(a) * r * 0.4 - 2);
    }
    attr.needsUpdate = true;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[data.positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#a5f3fc" size={0.045} transparent opacity={0.55} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
}

function Terminal() {
  const texture = useMemo(() => {
    if (typeof document === "undefined") return null;
    return consoleTexture("terminal", "#a5f3fc");
  }, []);
  const pulse = useRef(0);
  const screen = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    pulse.current = Math.max(0, pulse.current - delta * 1.4);
    if (screen.current) {
      const mat = screen.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.05 + Math.sin(state.clock.elapsedTime * 2.4) * 0.015 + pulse.current * 0.14;
    }
  });

  const openChannel = () => {
    pulse.current = 1;
    audio.play("transmit");
  };

  return (
    <group>
      <mesh
        position={[0, 1.15, 0]}
        onClick={(e) => {
          e.stopPropagation();
          openChannel();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          useExperience.getState().setHoverLabel("Open channel");
          audio.play("hover");
        }}
        onPointerOut={() => useExperience.getState().setHoverLabel(null)}
      >
        <boxGeometry args={[4.9, 3.1, 0.5]} />
        <meshStandardMaterial color="#0a111c" metalness={0.9} roughness={0.25} />
      </mesh>
      <mesh position={[0, 1.15, 0.26]}>
        <planeGeometry args={[4.6, 2.8]} />
        <meshBasicMaterial map={texture ?? undefined} toneMapped={false} transparent opacity={0.92} />
      </mesh>
      <mesh ref={screen} position={[0, 1.15, 0.29]}>
        <planeGeometry args={[4.6, 2.8]} />
        <meshBasicMaterial color="#a5f3fc" transparent opacity={0.05} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh position={[0, -0.42, 0.2]}>
        <planeGeometry args={[4.9, 0.03]} />
        <meshBasicMaterial color="#a5f3fc" transparent opacity={0.8} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <Glow position={[0, 1.2, -0.4]} color="#67e8f9" scale={7} opacity={0.18} />
      <Label3D text="CONTACT PORTAL" position={[0, 3.2, 0]} color="#d8feff" size={28} scale={0.9} />
      <Label3D text="SECURE LINE / RESPONSE WINDOW 24H" position={[0, 2.86, 0]} color="#7fa8b5" size={14} scale={0.42} opacity={0.7} />
    </group>
  );
}

function PortalRing() {
  const group = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    if (group.current) {
      group.current.rotation.z += delta * 0.1;
      group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.08;
    }
  });
  return (
    <group ref={group} position={[0, 1.6, -3.4]}>
      <mesh>
        <torusGeometry args={[3.4, 0.018, 8, 160]} />
        <meshBasicMaterial color="#a5f3fc" transparent opacity={0.6} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh>
        <torusGeometry args={[3.0, 0.007, 6, 160]} />
        <meshBasicMaterial color="#67e8f9" transparent opacity={0.3} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      {Array.from({ length: 24 }).map((_, i) => {
        const a = (i / 24) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(a) * 3.7, Math.sin(a) * 3.7, 0]} rotation={[0, 0, a]}>
            <planeGeometry args={[0.34, 0.014]} />
            <meshBasicMaterial color="#a5f3fc" transparent opacity={0.5} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} />
          </mesh>
        );
      })}
      <Glow scale={9} opacity={0.14} color="#67e8f9" />
    </group>
  );
}

export function Contact() {
  return (
    <>
      <SpaceBackdrop stars={2400} dust={360} dustColor="#a5f3fc" />
      <ambientLight intensity={0.5} />
      <pointLight position={[0, 3, 4]} intensity={26} color="#a5f3fc" distance={16} />

      <PortalRing />
      <TransmissionParticles />
      <Terminal />

      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[1.4, 1.6, 1.1, 8]} />
        <meshStandardMaterial color="#080e17" metalness={0.9} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.66, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.3, 1.36, 64]} />
        <meshBasicMaterial color="#a5f3fc" transparent opacity={0.5} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <HoloRing radius={2.6} rotation={[-Math.PI / 2, 0, 0]} opacity={0.2} position={[0, 0.68, 0]} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.67, 0]}>
        <planeGeometry args={[16, 16]} />
        <meshStandardMaterial color="#04070d" metalness={0.85} roughness={0.4} />
      </mesh>
    </>
  );
}
