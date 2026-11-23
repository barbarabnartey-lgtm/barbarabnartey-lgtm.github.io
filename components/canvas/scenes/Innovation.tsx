"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { innovation } from "@/data/profile";
import { useExperience } from "@/lib/store";
import { audio } from "@/lib/audio";
import { Label3D } from "../fx/Label3D";
import { SpaceBackdrop } from "../fx/Atmosphere";
import { Glow, GridFloor, HoloRing, useHover3D } from "../fx/primitives";

const LAYOUT = [
  { x: -4.5, y: 1.65, z: 0.6, color: "#a3e635" },
  { x: 0, y: 2.05, z: -0.2, color: "#86efac" },
  { x: 4.5, y: 1.55, z: 0.6, color: "#bef264" },
];

function Core({ item, index }: { item: (typeof innovation)[number]; index: number }) {
  const selected = useExperience(
    (s) => s.selection?.zone === "innovation" && s.selection?.id === item.id,
  );
  const select = useExperience((s) => s.select);
  const handlers = useHover3D(item.title);
  const layout = LAYOUT[index % LAYOUT.length];
  const group = useRef<THREE.Group>(null);
  const shell = useRef<THREE.Mesh>(null);
  const rings = useRef<THREE.Group>(null);
  const uniforms = useMemo(
    () => ({ uTime: { value: 0 }, uColor: { value: new THREE.Color(layout.color) } }),
    [layout.color],
  );

  useFrame((state, delta) => {
    uniforms.uTime.value = state.clock.elapsedTime;
    if (shell.current) {
      shell.current.rotation.y += delta * 0.25;
      shell.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3 + index) * 0.2;
    }
    if (rings.current) rings.current.rotation.z += delta * 0.12;
    if (group.current) {
      const target = selected ? 1.15 : handlers.hovered ? 1.07 : 1;
      group.current.scale.lerp(new THREE.Vector3(target, target, target), 1 - Math.exp(-delta * 7));
      group.current.position.y = layout.y + Math.sin(state.clock.elapsedTime * 0.6 + index * 2) * 0.08;
    }
  });

  return (
    <group position={[layout.x, 0, layout.z]}>
      <group ref={group} position={[0, layout.y, 0]}>
        <group
          {...handlers.handlers}
          onClick={(e) => {
            e.stopPropagation();
            audio.play("chime");
            select(item.id);
          }}
        >
          <mesh>
            <sphereGeometry args={[0.72, 48, 48]} />
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
                  vec3 p = position + normal * sin(uTime * 1.4 + position.y * 6.0) * 0.035;
                  vPos = p;
                  vec4 world = modelMatrix * vec4(p, 1.0);
                  vWorld = world.xyz;
                  gl_Position = projectionMatrix * viewMatrix * world;
                }
              `}
              fragmentShader={`
                uniform float uTime;
                uniform vec3 uColor;
                varying vec3 vNormal;
                varying vec3 vWorld;
                varying vec3 vPos;
                void main() {
                  vec3 viewDir = normalize(cameraPosition - vWorld);
                  float fres = pow(1.0 - abs(dot(viewDir, vNormal)), 1.8);
                  float bands = sin(vPos.y * 14.0 + uTime * 1.8) * 0.5 + 0.5;
                  float veins = smoothstep(0.75, 1.0, sin(vPos.x * 9.0 + vPos.y * 6.0 + uTime) * 0.5 + 0.5);
                  vec3 col = mix(uColor * 0.5, vec3(0.95, 1.0, 0.9), bands * 0.65 + veins * 0.4);
                  gl_FragColor = vec4(col, 0.34 + fres * 0.6 + veins * 0.1);
                }
              `}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
          <mesh ref={shell} scale={1.45}>
            <icosahedronGeometry args={[0.72, 1]} />
            <meshBasicMaterial color={layout.color} wireframe transparent opacity={0.18} toneMapped={false} />
          </mesh>
          <group ref={rings}>
            <mesh rotation={[Math.PI / 2.2, 0, 0]}>
              <torusGeometry args={[1.05, 0.007, 4, 80]} />
              <meshBasicMaterial color={layout.color} transparent opacity={0.55} blending={THREE.AdditiveBlending} depthWrite={false} />
            </mesh>
            <mesh rotation={[Math.PI / 1.8, 0.4, 0.2]}>
              <torusGeometry args={[1.35, 0.005, 4, 80]} />
              <meshBasicMaterial color={layout.color} transparent opacity={0.28} blending={THREE.AdditiveBlending} depthWrite={false} />
            </mesh>
          </group>
          <Glow color={layout.color} scale={selected ? 5.2 : 3.6} opacity={selected ? 0.4 : 0.2} />
        </group>
        <Label3D
          text={item.title}
          position={[0, 1.75, 0]}
          color={selected ? "#f4ffd8" : layout.color}
          size={22}
          scale={0.58}
        />
        <Label3D
          text={`${item.state.toUpperCase()} / ${item.progress}%`}
          position={[0, 1.48, 0]}
          color="#93a3b8"
          size={13}
          scale={0.38}
          opacity={0.7}
        />
        <pointLight intensity={selected ? 6 : 2.4} distance={4} color={layout.color} />
      </group>

      <mesh position={[0, 0.12, 0]}>
        <cylinderGeometry args={[0.9, 1.02, 0.18, 6]} />
        <meshStandardMaterial color="#0a1016" metalness={0.8} roughness={0.35} />
      </mesh>
      <mesh position={[0, 0.22, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.7, 0.78, 48]} />
        <meshBasicMaterial color={layout.color} transparent opacity={0.5} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh position={[0, 0.9, 0]}>
        <cylinderGeometry args={[0.35, 0.7, 1.4, 24, 1, true]} />
        <meshBasicMaterial color={layout.color} transparent opacity={0.04} side={THREE.DoubleSide} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
      <HoloRing radius={1.5} rotation={[-Math.PI / 2, 0, 0]} opacity={0.16} color={layout.color} position={[0, 0.24, 0]} />
    </group>
  );
}

function RisingSparks() {
  const points = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const count = 220;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 13;
      const z = (Math.random() - 0.5) * 5;
      arr[i * 3] = x;
      arr[i * 3 + 1] = Math.random() * 5 - 1;
      arr[i * 3 + 2] = z;
    }
    return arr;
  }, []);
  useFrame((_, delta) => {
    if (!points.current) return;
    const attr = points.current.geometry.getAttribute("position") as THREE.BufferAttribute;
    for (let i = 0; i < attr.count; i++) {
      let y = attr.getY(i) + delta * 0.35;
      if (y > 4.6) y = -1;
      attr.setY(i, y);
    }
    attr.needsUpdate = true;
  });
  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#a3e635" size={0.035} transparent opacity={0.45} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
}

export function Innovation() {
  return (
    <>
      <SpaceBackdrop stars={2200} dust={300} dustColor="#a3e635" />
      <ambientLight intensity={0.4} />
      <pointLight position={[0, 4, 5]} intensity={24} color="#a3e635" distance={20} />
      <pointLight position={[-6, 2, 2]} intensity={12} color="#67e8f9" distance={14} />
      {innovation.map((item, i) => (
        <Core key={item.id} item={item} index={i} />
      ))}
      <RisingSparks />
      <Label3D text="INNOVATION CORES" position={[0, 4.3, -1.4]} color="#a3e635" size={22} scale={0.7} opacity={0.55} />
      <Label3D text="CONCEPT LAB / ACTIVE" position={[0, 3.95, -1.4]} color="#8f9c78" size={14} scale={0.42} opacity={0.6} />
      <GridFloor y={-1} color="#a3e635" opacity={0.28} />
    </>
  );
}
