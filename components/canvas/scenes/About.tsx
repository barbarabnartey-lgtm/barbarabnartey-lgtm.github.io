"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useExperience } from "@/lib/store";
import { audio } from "@/lib/audio";
import { portraitParticles } from "@/lib/textures";
import { Label3D } from "../fx/Label3D";
import { SpaceBackdrop } from "../fx/Atmosphere";
import { Glow, HoloRing, useHover3D } from "../fx/primitives";

const PORTRAIT_VERTEX = /* glsl */ `
  attribute float aSeed;
  uniform float uTime;
  uniform float uSize;
  varying float vSeed;
  void main() {
    vSeed = aSeed;
    vec3 p = position;
    p.x += sin(uTime * 0.5 + aSeed * 30.0) * 0.012;
    p.y += cos(uTime * 0.4 + aSeed * 20.0) * 0.009;
    p.z += sin(uTime * 0.7 + aSeed * 12.0) * 0.02;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * (9.0 / max(0.001, -mv.z));
  }
`;

const PORTRAIT_FRAGMENT = /* glsl */ `
  varying float vSeed;
  uniform float uTime;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    if (d > 0.5) discard;
    float a = pow(smoothstep(0.5, 0.0, d), 1.8);
    float scan = 0.65 + 0.35 * sin(gl_FragCoord.y * 0.7 - uTime * 4.0);
    vec3 col = mix(vec3(0.32, 0.9, 1.0), vec3(0.78, 0.72, 1.0), vSeed);
    gl_FragColor = vec4(col, a * 0.55 * scan);
  }
`;

function Portrait() {
  const { positions, random } = useMemo(() => {
    if (typeof document === "undefined") {
      return { positions: new Float32Array(0), random: new Float32Array(0) };
    }
    return portraitParticles();
  }, []);
  const uniforms = useMemo(
    () => ({ uTime: { value: 0 }, uSize: { value: 2.6 } }),
    [],
  );
  const points = useRef<THREE.Points>(null);

  useFrame((state) => {
    uniforms.uTime.value = state.clock.elapsedTime;
    if (points.current) {
      points.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.25) * 0.12;
    }
  });

  return (
    <points ref={points} position={[0, 0, 0]} scale={0.75} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aSeed" args={[random, 1]} />
      </bufferGeometry>
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={PORTRAIT_VERTEX}
        fragmentShader={PORTRAIT_FRAGMENT}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function Waveform() {
  const ref = useRef<THREE.Line>(null);
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const points = 160;
    const pos = new Float32Array(points * 3);
    for (let i = 0; i < points; i++) {
      pos[i * 3] = (i / (points - 1)) * 3.6 - 1.8;
      pos[i * 3 + 1] = 0;
      pos[i * 3 + 2] = 0.9;
    }
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return geo;
  }, []);

  useFrame((state) => {
    const attr = geometry.getAttribute("position") as THREE.BufferAttribute;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < attr.count; i++) {
      const x = (i / (attr.count - 1)) * 3.6 - 1.8;
      const envelope = Math.sin((i / attr.count) * Math.PI);
      attr.setY(
        i,
        (Math.sin(x * 5 + t * 2.4) * 0.12 + Math.sin(x * 13 - t * 1.6) * 0.05) * envelope,
      );
    }
    attr.needsUpdate = true;
  });

  const line = useMemo(() => {
    const material = new THREE.LineBasicMaterial({
      color: "#67e8f9",
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    return new THREE.Line(geometry, material);
  }, [geometry]);

  return <primitive object={line} position={[-0.1, -1.9, 0.9]} />;
}

function Facet({
  id,
  label,
  position,
}: {
  id: string;
  label: string;
  position: [number, number, number];
}) {
  const select = useExperience((s) => s.select);
  const active = useExperience((s) => s.selection?.id === id);
  const handlers = useHover3D(label);
  const group = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!group.current) return;
    const target = handlers.hovered || active ? 1.25 : 1;
    group.current.scale.lerp(new THREE.Vector3(target, target, target), 1 - Math.exp(-delta * 9));
    group.current.rotation.y += delta * (handlers.hovered ? 0.9 : 0.25);
  });

  return (
    <group position={position} ref={group}>
      <group
        {...handlers.handlers}
        onClick={(e) => {
          e.stopPropagation();
          audio.play("open");
          select(id);
        }}
      >
        <mesh>
          <octahedronGeometry args={[0.16, 0]} />
          <meshStandardMaterial
            color={active ? "#ffffff" : "#67e8f9"}
            emissive="#67e8f9"
            emissiveIntensity={active ? 3 : 1.4}
            roughness={0.3}
            metalness={0.4}
          />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.34, 0.006, 4, 48]} />
          <meshBasicMaterial color="#67e8f9" transparent opacity={0.5} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
        <Glow color="#67e8f9" scale={1.2} opacity={0.3} />
      </group>
      <Label3D text={label} position={[0, -0.42, 0]} color="#a5f3fc" size={20} scale={0.5} />
    </group>
  );
}

export function About() {
  const select = useExperience((s) => s.select);
  const selected = useExperience((s) => s.selection?.id === "profile");
  const chamber = useRef<THREE.Group>(null);
  const beam = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (chamber.current) chamber.current.rotation.y += delta * 0.06;
    if (beam.current) {
      beam.current.position.y = 2.4 - ((state.clock.elapsedTime * 0.55) % 4.8);
    }
  });

  return (
    <>
      <SpaceBackdrop stars={2600} dust={400} dustColor="#67e8f9" />
      <ambientLight intensity={0.5} />
      <pointLight position={[0, 3, 4]} intensity={30} color="#67e8f9" distance={14} />
      <pointLight position={[-3, 0, 2]} intensity={14} color="#c4b5fd" distance={10} />
      <spotLight position={[0, 6, 3]} angle={0.5} penumbra={0.8} intensity={40} color="#e0f7ff" />

      <group position={[0, 0.4, 0]}>
        <group ref={chamber}>
          <mesh>
            <cylinderGeometry args={[2.05, 2.05, 4.9, 64, 1, true]} />
            <meshPhysicalMaterial
              color="#8fe7f5"
              transparent
              opacity={0.035}
              roughness={0.08}
              metalness={0}
              transmission={0.6}
              thickness={0.4}
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>
          <mesh position={[0, 2.44, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <torusGeometry args={[2.05, 0.02, 8, 96]} />
            <meshBasicMaterial color="#67e8f9" transparent opacity={0.55} blending={THREE.AdditiveBlending} depthWrite={false} />
          </mesh>
          <mesh position={[0, -2.44, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <torusGeometry args={[2.05, 0.02, 8, 96]} />
            <meshBasicMaterial color="#67e8f9" transparent opacity={0.4} blending={THREE.AdditiveBlending} depthWrite={false} />
          </mesh>
          {Array.from({ length: 8 }).map((_, i) => {
            const a = (i / 8) * Math.PI * 2;
            return (
              <mesh key={i} position={[Math.cos(a) * 2.05, 0, Math.sin(a) * 2.05]}>
                <boxGeometry args={[0.012, 4.9, 0.012]} />
                <meshBasicMaterial color="#67e8f9" transparent opacity={0.22} blending={THREE.AdditiveBlending} depthWrite={false} />
              </mesh>
            );
          })}
        </group>

        <mesh position={[0, 0.1, 0]}>
          <cylinderGeometry args={[2.3, 2.5, 0.12, 64]} />
          <meshStandardMaterial color="#0a1626" roughness={0.35} metalness={0.7} />
        </mesh>
        <mesh position={[0, 0.17, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.4, 1.46, 96]} />
          <meshBasicMaterial color="#67e8f9" transparent opacity={0.55} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>

        <Portrait />
        <Waveform />

        <mesh ref={beam} rotation={[0, 0, 0]}>
          <planeGeometry args={[3.4, 0.08]} />
          <meshBasicMaterial color="#8be9f7" transparent opacity={0.25} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} />
        </mesh>

        <HoloRing radius={2.9} rotation={[Math.PI / 2.1, 0.18, 0]} opacity={0.22} position={[0, 0.8, 0]} />
        <HoloRing radius={3.5} rotation={[Math.PI / 1.9, -0.22, 0.3]} opacity={0.12} color="#c4b5fd" position={[0, 1.2, 0]} />
        <HoloRing radius={2.4} rotation={[Math.PI / 2, 0, 0]} opacity={0.15} position={[0, -1.6, 0]} />

        <group
          onClick={(e) => {
            e.stopPropagation();
            audio.play("open");
            select("profile");
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            useExperience.getState().setHoverLabel("Identity record");
            audio.play("hover");
          }}
          onPointerOut={() => useExperience.getState().setHoverLabel(null)}
        >
          <mesh position={[0, 0.2, 0.35]}>
            <planeGeometry args={[2.6, 3.8]} />
            <meshBasicMaterial transparent opacity={0} depthWrite={false} colorWrite={false} />
          </mesh>
        </group>

        <Label3D text="ARDEN VALE" position={[0, -2.32, 0]} color="#e6fbff" size={38} scale={1.1} />
        <Label3D text="IDENTITY RECORD / 01" position={[0, -2.62, 0]} color="#67e8f9" size={18} scale={0.62} opacity={0.7} />
        <Label3D
          text={selected ? "RECORD OPEN" : "SELECT THE MONOLITH"}
          position={[0, 3.15, 0]}
          color={selected ? "#f5c97b" : "#8be9f7"}
          size={18}
          scale={0.62}
          opacity={0.8}
        />

        <Facet id="interests" label="ACADEMIC INTERESTS" position={[-2.9, 1.6, 0.7]} />
        <Facet id="statement" label="PERSONAL STATEMENT" position={[2.9, 0.9, 0.7]} />
        <Facet id="goals" label="PROFESSIONAL GOALS" position={[-2.55, -1.1, 0.8]} />
      </group>
    </>
  );
}
