"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useExperience } from "@/lib/store";
import { audio } from "@/lib/audio";
import { ZONES } from "@/lib/zones";
import type { ZoneId } from "@/data/profile";
import { Label3D } from "../fx/Label3D";
import { Dust, SpaceBackdrop } from "../fx/Atmosphere";
import { Glow, GridFloor, HoloRing, useHover3D } from "../fx/primitives";

function Core() {
  const core = useRef<THREE.Mesh>(null);
  const shell = useRef<THREE.Mesh>(null);
  const wire = useRef<THREE.Mesh>(null);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColorA: { value: new THREE.Color("#67e8f9") },
      uColorB: { value: new THREE.Color("#a78bfa") },
    }),
    [],
  );

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    uniforms.uTime.value = t;
    if (core.current) {
      core.current.rotation.y += delta * 0.12;
      core.current.rotation.x = Math.sin(t * 0.2) * 0.12;
    }
    if (wire.current) {
      wire.current.rotation.y -= delta * 0.18;
      wire.current.rotation.x += delta * 0.04;
    }
    if (shell.current) {
      shell.current.rotation.z += delta * 0.05;
      const s = 1 + Math.sin(t * 0.8) * 0.02;
      shell.current.scale.setScalar(s);
    }
  });

  return (
    <group>
      <mesh ref={core}>
        <icosahedronGeometry args={[1.25, 6]} />
        <shaderMaterial
          uniforms={uniforms}
          transparent
          vertexShader={`
            uniform float uTime;
            varying vec3 vNormal;
            varying vec3 vPos;
            varying vec3 vWorld;
            void main() {
              vNormal = normalize(normalMatrix * normal);
              vec3 p = position + normal * sin(uTime * 0.7 + position.y * 4.0) * 0.035;
              vPos = p;
              vec4 world = modelMatrix * vec4(p, 1.0);
              vWorld = world.xyz;
              gl_Position = projectionMatrix * viewMatrix * world;
            }
          `}
          fragmentShader={`
            uniform float uTime;
            uniform vec3 uColorA;
            uniform vec3 uColorB;
            varying vec3 vNormal;
            varying vec3 vPos;
            varying vec3 vWorld;
            void main() {
              vec3 viewDir = normalize(cameraPosition - vWorld);
              float fres = pow(1.0 - abs(dot(viewDir, vNormal)), 2.2);
              float bands = smoothstep(0.4, 1.0, sin(vPos.y * 11.0 + uTime * 1.5) * 0.5 + 0.5);
              vec3 col = mix(uColorA, uColorB, bands * 0.7 + fres * 0.3);
              float alpha = 0.16 + fres * 0.8 + bands * 0.06;
              gl_FragColor = vec4(col, alpha);
            }
          `}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <mesh ref={wire} scale={1.03}>
        <icosahedronGeometry args={[1.25, 2]} />
        <meshBasicMaterial color="#8be9f7" wireframe transparent opacity={0.12} toneMapped={false} />
      </mesh>
      <mesh ref={shell}>
        <torusGeometry args={[1.75, 0.008, 6, 140]} />
        <meshBasicMaterial color="#67e8f9" transparent opacity={0.45} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
      </mesh>
      <Glow color="#38bdf8" scale={7.5} opacity={0.3} />
      <pointLight intensity={26} distance={16} color="#67e8f9" />
      <Label3D text="KNOWLEDGE CORE" position={[0, 1.9, 0]} color="#8be9f7" size={26} scale={0.8} opacity={0.75} />
    </group>
  );
}

function HubNode({
  index,
  id,
  name,
  accent,
  position,
  angle,
}: {
  index: string;
  id: ZoneId;
  name: string;
  accent: string;
  position: [number, number, number];
  angle: number;
}) {
  const group = useRef<THREE.Group>(null);
  const spin = useRef<THREE.Group>(null);
  const go = useExperience((s) => s.go);
  const handlers = useHover3D(name);

  useFrame((state, delta) => {
    if (group.current) {
      const target = handlers.hovered ? 1.25 : 1;
      group.current.scale.lerp(new THREE.Vector3(target, target, target), 1 - Math.exp(-delta * 8));
      group.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.8 + angle) * 0.09;
    }
    if (spin.current) spin.current.rotation.z += delta * 0.4;
  });

  const labelPos: [number, number, number] = [position[0] * 0.16, -0.52, 0];

  return (
    <group ref={group} position={position}>
      <group
        {...handlers.handlers}
        onClick={(e) => {
          e.stopPropagation();
          audio.play("select");
          go(id);
        }}
      >
        <mesh>
          <octahedronGeometry args={[0.24, 0]} />
          <meshStandardMaterial
            color={accent}
            emissive={accent}
            emissiveIntensity={handlers.hovered ? 2.6 : 1.1}
            roughness={0.25}
            metalness={0.6}
          />
        </mesh>
        <group ref={spin}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.46, 0.008, 6, 64]} />
            <meshBasicMaterial color={accent} transparent opacity={0.55} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
          </mesh>
          <mesh rotation={[0, Math.PI / 2.6, 0]}>
            <torusGeometry args={[0.62, 0.005, 6, 64]} />
            <meshBasicMaterial color={accent} transparent opacity={0.28} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
          </mesh>
        </group>
        <Glow color={accent} scale={handlers.hovered ? 2.6 : 1.5} opacity={handlers.hovered ? 0.55 : 0.28} />
        <mesh visible={handlers.hovered}>
          <sphereGeometry args={[0.8, 16, 16]} />
          <meshBasicMaterial color={accent} transparent opacity={0.05} depthWrite={false} />
        </mesh>
      </group>
      <Label3D
        text={`${index} / ${name}`}
        position={labelPos}
        color={handlers.hovered ? "#ffffff" : accent}
        size={22}
        scale={0.62}
        opacity={handlers.hovered ? 1 : 0.72}
      />
      <pointLight intensity={handlers.hovered ? 6 : 2.2} distance={3.5} color={accent} />
    </group>
  );
}

export function Hub() {
  const nodes = useMemo(() => {
    return ZONES.map((zone, i) => {
      const angle = (i / ZONES.length) * Math.PI * 2 - Math.PI / 2;
      const radius = 6.1;
      return {
        ...zone,
        angle,
        position: [
          Math.cos(angle) * radius,
          Math.sin(angle) * radius * 0.68 + 0.5,
          Math.sin(angle * 2.3) * 0.8,
        ] as [number, number, number],
      };
    });
  }, []);

  const coreGlow = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    if (coreGlow.current) coreGlow.current.rotation.y += delta * 0.03;
  });

  const linePositions = useMemo(() => {
    const arr: number[] = [];
    nodes.forEach((n) => {
      arr.push(0, 0.5, 0, ...n.position);
    });
    return new Float32Array(arr);
  }, [nodes]);

  return (
    <>
      <SpaceBackdrop stars={4200} dust={700} dustColor="#8b7dfb" />
      <ambientLight intensity={0.5} />
      <directionalLight position={[8, 12, 10]} intensity={0.6} color="#cfe8ff" />
      <pointLight position={[-8, -4, 4]} intensity={22} color="#a78bfa" distance={22} />

      <group position={[3.2, 0.35, 0]}>
        <Core />
        <CoreGlowRings groupRef={coreGlow} />
        <lineSegments>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
          </bufferGeometry>
          <lineBasicMaterial color="#67e8f9" transparent opacity={0.1} blending={THREE.AdditiveBlending} depthWrite={false} />
        </lineSegments>
        <HoloRing radius={6.4} rotation={[Math.PI / 2.2, 0.22, 0]} opacity={0.16} />
        <HoloRing radius={7.4} rotation={[Math.PI / 2.05, -0.16, 0]} opacity={0.08} color="#c4b5fd" />
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -4.6, 0]}>
          <ringGeometry args={[2.2, 2.23, 96]} />
          <meshBasicMaterial color="#67e8f9" transparent opacity={0.25} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
        {nodes.map((node) => (
          <HubNode
            key={node.id}
            index={node.index}
            id={node.id}
            name={node.label}
            accent={node.accent}
            position={node.position}
            angle={node.angle}
          />
        ))}
      </group>

      <GridFloor y={-5.4} opacity={0.32} />
      <Dust count={260} radius={12} color="#67e8f9" size={0.05} speed={-0.03} opacity={0.35} />
    </>
  );
}

const CoreGlowRings = ({ groupRef }: { groupRef: React.RefObject<THREE.Group | null> }) => (
  <group ref={groupRef}>
    <HoloRing radius={2.6} rotation={[Math.PI / 2, 0, 0]} opacity={0.28} />
    <HoloRing radius={3.1} rotation={[Math.PI / 2.4, 0.5, 0.3]} opacity={0.15} color="#c4b5fd" />
    <HoloRing radius={3.8} rotation={[Math.PI / 1.8, -0.4, 0.6]} opacity={0.08} color="#c4b5fd" />
  </group>
);
