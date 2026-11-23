"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { skills } from "@/data/profile";
import { useExperience } from "@/lib/store";
import { audio } from "@/lib/audio";
import { Label3D } from "../fx/Label3D";
import { SpaceBackdrop } from "../fx/Atmosphere";
import { Glow, HoloRing, useHover3D } from "../fx/primitives";

const COLORS = [
  "#c4b5fd",
  "#a78bfa",
  "#8b5cf6",
  "#e0d7ff",
  "#7dd3fc",
  "#f0abfc",
  "#93c5fd",
  "#ddd6fe",
];

const ORBITS = [
  { radius: 3.0, speed: 0.26, tilt: 0.18, offset: 0.2, size: 0.34 },
  { radius: 3.8, speed: 0.2, tilt: -0.14, offset: 2.1, size: 0.42 },
  { radius: 4.6, speed: 0.17, tilt: 0.24, offset: 4.3, size: 0.38 },
  { radius: 5.4, speed: 0.14, tilt: -0.22, offset: 1.2, size: 0.5 },
  { radius: 6.2, speed: 0.12, tilt: 0.1, offset: 3.4, size: 0.36 },
  { radius: 7.0, speed: 0.1, tilt: -0.08, offset: 5.2, size: 0.44 },
  { radius: 7.8, speed: 0.09, tilt: 0.16, offset: 0.9, size: 0.32 },
  { radius: 8.5, speed: 0.08, tilt: -0.2, offset: 2.8, size: 0.4 },
];

function Planet({ skill, index }: { skill: (typeof skills)[number]; index: number }) {
  const selected = useExperience((s) => s.selection?.zone === "skills" && s.selection?.id === skill.id);
  const select = useExperience((s) => s.select);
  const handlers = useHover3D(skill.name);
  const group = useRef<THREE.Group>(null);
  const mesh = useRef<THREE.Mesh>(null);
  const orbit = ORBITS[index % ORBITS.length];
  const color = COLORS[index % COLORS.length];

  useFrame((state, delta) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    const a = orbit.offset + t * orbit.speed;
    group.current.position.set(
      Math.cos(a) * orbit.radius,
      Math.sin(a * 1.7 + orbit.offset) * 0.55 + orbit.tilt * 3,
      Math.sin(a) * orbit.radius,
    );
    const scale = selected ? 1.5 : handlers.hovered ? 1.25 : 1;
    group.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 1 - Math.exp(-delta * 8));
    if (mesh.current) mesh.current.rotation.y += delta * 0.35;
  });

  const size = orbit.size + skill.level / 500;

  return (
    <group ref={group}>
      <group
        {...handlers.handlers}
        onClick={(e) => {
          e.stopPropagation();
          audio.play("open");
          select(skill.id);
        }}
      >
        <mesh ref={mesh}>
          <sphereGeometry args={[size, 32, 32]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={selected ? 1.6 : 0.5}
            roughness={0.45}
            metalness={0.2}
          />
        </mesh>
        <mesh rotation={[Math.PI / 2.4, 0.2, 0]}>
          <torusGeometry args={[size * 1.7, 0.008, 6, 64]} />
          <meshBasicMaterial color={color} transparent opacity={0.6} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
        <Glow color={color} scale={size * 6} opacity={selected ? 0.55 : handlers.hovered ? 0.4 : 0.2} />
        <mesh visible={selected || handlers.hovered}>
          <sphereGeometry args={[size * 2.4, 16, 16]} />
          <meshBasicMaterial color={color} transparent opacity={0.055} depthWrite={false} />
        </mesh>
      </group>
      <Label3D
        text={skill.name}
        position={[0, size + 0.42, 0]}
        color={color}
        size={20}
        scale={0.48}
        opacity={selected ? 1 : 0.7}
      />
      <Label3D
        text={`${skill.level}%`}
        position={[0, size + 0.16, 0]}
        color="#8fa1b8"
        size={13}
        scale={0.38}
        opacity={0.65}
      />
      <pointLight intensity={selected ? 5 : 1.6} distance={2.8} color={color} />
    </group>
  );
}

function OrbitPath({ radius, tilt, color }: { radius: number; tilt: number; color: string }) {
  const geometry = useMemo(() => {
    const points: THREE.Vector3[] = [];
    for (let i = 0; i <= 128; i++) {
      const a = (i / 128) * Math.PI * 2;
      points.push(new THREE.Vector3(Math.cos(a) * radius, tilt * 3, Math.sin(a) * radius));
    }
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [radius, tilt]);
  const line = useMemo(
    () =>
      new THREE.Line(
        geometry,
        new THREE.LineBasicMaterial({
          color,
          transparent: true,
          opacity: 0.16,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        }),
      ),
    [geometry, color],
  );
  return <primitive object={line} />;
}

function KnowledgeCore() {
  const core = useRef<THREE.Mesh>(null);
  const halo = useRef<THREE.Mesh>(null);
  const uniforms = useMemo(
    () => ({ uTime: { value: 0 } }),
    [],
  );
  useFrame((state, delta) => {
    uniforms.uTime.value = state.clock.elapsedTime;
    if (core.current) {
      core.current.rotation.y += delta * 0.15;
      core.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.15;
    }
    if (halo.current) {
      halo.current.rotation.z += delta * 0.25;
      const s = 1 + Math.sin(state.clock.elapsedTime * 0.9) * 0.03;
      halo.current.scale.setScalar(s);
    }
  });

  return (
    <group>
      <mesh ref={core}>
        <icosahedronGeometry args={[1.15, 5]} />
        <shaderMaterial
          uniforms={uniforms}
          transparent
          vertexShader={`
            uniform float uTime;
            varying vec3 vNormal;
            varying vec3 vWorld;
            varying vec3 vPos;
            void main() {
              vNormal = normalize(normalMatrix * normal);
              vec3 p = position + normal * sin(uTime + position.x * 5.0) * 0.02;
              vPos = p;
              vec4 world = modelMatrix * vec4(p, 1.0);
              vWorld = world.xyz;
              gl_Position = projectionMatrix * viewMatrix * world;
            }
          `}
          fragmentShader={`
            uniform float uTime;
            varying vec3 vNormal;
            varying vec3 vWorld;
            varying vec3 vPos;
            void main() {
              vec3 viewDir = normalize(cameraPosition - vWorld);
              float fres = pow(1.0 - abs(dot(viewDir, vNormal)), 2.0);
              float pulse = sin(vPos.y * 9.0 + uTime * 2.0) * 0.5 + 0.5;
              vec3 col = mix(vec3(0.55, 0.45, 1.0), vec3(0.7, 0.95, 1.0), pulse);
              gl_FragColor = vec4(col, 0.2 + fres * 0.9);
            }
          `}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <mesh ref={halo}>
        <torusGeometry args={[1.75, 0.006, 5, 128]} />
        <meshBasicMaterial color="#c4b5fd" transparent opacity={0.5} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <HoloRing radius={2.15} rotation={[Math.PI / 2.2, 0.3, 0]} opacity={0.22} color="#c4b5fd" />
      <Glow color="#a78bfa" scale={8} opacity={0.35} />
      <Label3D text="KNOWLEDGE CORE" position={[0, 2.1, 0]} color="#e9e2ff" size={23} scale={0.62} opacity={0.8} />
      <pointLight intensity={30} distance={14} color="#a78bfa" />
    </group>
  );
}

function GalaxyDust() {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const count = 1600;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const arm = i % 3;
      const a = Math.random() * Math.PI * 2 + arm * 2.1;
      const r = 1.5 + Math.pow(Math.random(), 1.5) * 12;
      const spread = 0.4 + r * 0.08;
      arr[i * 3] = Math.cos(a) * r + (Math.random() - 0.5) * spread;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 1.4 + Math.sin(a) * 0.3;
      arr[i * 3 + 2] = Math.sin(a) * r + (Math.random() - 0.5) * spread;
    }
    return arr;
  }, []);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.01;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#c4b5fd"
        size={0.055}
        transparent
        opacity={0.55}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export function Skills() {
  return (
    <>
      <SpaceBackdrop stars={4200} dust={600} dustColor="#c4b5fd" />
      <ambientLight intensity={0.4} />
      <pointLight position={[-10, 6, -6]} intensity={20} color="#67e8f9" distance={30} />
      <KnowledgeCore />
      {ORBITS.map((orbit, i) => (
        <OrbitPath key={i} radius={orbit.radius} tilt={orbit.tilt} color={COLORS[i % COLORS.length]} />
      ))}
      {skills.map((skill, i) => (
        <Planet key={skill.id} skill={skill} index={i} />
      ))}
      <GalaxyDust />
    </>
  );
}
