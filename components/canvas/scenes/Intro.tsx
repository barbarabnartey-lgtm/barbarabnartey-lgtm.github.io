"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { useExperience } from "@/lib/store";

const TITLE_VERTEX = /* glsl */ `
  attribute vec3 aStart;
  attribute vec3 aTarget;
  attribute float aDelay;
  attribute float aSeed;
  uniform float uProgress;
  uniform float uTime;
  uniform float uSize;
  uniform float uOpacity;
  varying float vAlpha;
  varying float vSeed;
  void main() {
    float p = clamp((uProgress - aDelay * 0.32) / 0.68, 0.0, 1.0);
    p = p * p * (3.0 - 2.0 * p);
    vec3 pos = mix(aStart, aTarget, p);
    float drift = (1.0 - p) * 0.3;
    pos.x += sin(uTime * 0.6 + aSeed * 20.0) * (0.012 + drift);
    pos.y += cos(uTime * 0.5 + aSeed * 13.0) * (0.012 + drift);
    pos.z += sin(uTime * 0.4 + aSeed * 7.0) * (0.02 + drift * 0.5);
    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * (0.65 + 0.55 * (1.0 - p)) * (10.0 / max(0.001, -mv.z));
    vAlpha = smoothstep(0.0, 0.3, p);
    vSeed = aSeed;
  }
`;

const TITLE_FRAGMENT = /* glsl */ `
  varying float vAlpha;
  varying float vSeed;
  uniform float uOpacity;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    if (d > 0.5) discard;
    float a = pow(smoothstep(0.5, 0.0, d), 2.2);
    vec3 cyan = vec3(0.45, 0.95, 1.0);
    vec3 violet = vec3(0.72, 0.62, 1.0);
    vec3 warm = vec3(1.0, 1.0, 1.0);
    vec3 col = mix(mix(cyan, violet, vSeed), warm, smoothstep(0.15, 0.0, d) * 0.75);
    gl_FragColor = vec4(col, a * vAlpha * 0.92 * uOpacity);
  }
`;

function sampleTitle() {
  const canvas = document.createElement("canvas");
  canvas.width = 1500;
  canvas.height = 520;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, 1500, 520);
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = '700 168px "Space Grotesk", "Arial Black", sans-serif';
  ctx.fillText("MY ACADEMIC", 750, 190);
  ctx.font = '300 150px "Space Grotesk", "Arial", sans-serif';
  (ctx as CanvasRenderingContext2D & { letterSpacing?: string }).letterSpacing = "28px";
  ctx.fillText("JOURNEY", 762, 360);

  const data = ctx.getImageData(0, 0, 1500, 520).data;
  const step = 4;
  const collected: [number, number][] = [];
  for (let y = 0; y < 520; y += step) {
    for (let x = 0; x < 1500; x += step) {
      if (data[(y * 1500 + x) * 4 + 3] > 128) collected.push([x, y]);
    }
  }
  for (let i = collected.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [collected[i], collected[j]] = [collected[j], collected[i]];
  }
  const points = collected.slice(0, 8200);
  const target = new Float32Array(points.length * 3);
  const start = new Float32Array(points.length * 3);
  const delay = new Float32Array(points.length);
  const seed = new Float32Array(points.length);

  points.forEach(([x, y], i) => {
    target[i * 3] = (x - 750) / 132;
    target[i * 3 + 1] = -(y - 240) / 132;
    target[i * 3 + 2] = (Math.random() - 0.5) * 0.5;
    const r = 7 + Math.random() * 12;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    start[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    start[i * 3 + 1] = r * Math.cos(phi) * 0.7;
    start[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    const nx = (x - 750) / 750;
    delay[i] = Math.min(1, Math.abs(nx) * 0.45 + Math.random() * 0.55);
    seed[i] = Math.random();
  });

  return { target, start, delay, seed, count: points.length };
}

function NeuralNetwork({ opacityRef }: { opacityRef: React.MutableRefObject<number> }) {
  const { nodes, lines } = useMemo(() => {
    const count = 48;
    const positions: THREE.Vector3[] = [];
    for (let i = 0; i < count; i++) {
      positions.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * 16,
          (Math.random() - 0.5) * 7,
          (Math.random() - 0.5) * 8 - 1,
        ),
      );
    }
    const linePositions: number[] = [];
    positions.forEach((a, i) => {
      for (let j = i + 1; j < positions.length; j++) {
        const b = positions[j];
        if (a.distanceTo(b) < 3.1) {
          linePositions.push(a.x, a.y, a.z, b.x, b.y, b.z);
        }
      }
    });
    const pointPositions = new Float32Array(positions.length * 3);
    positions.forEach((p, i) => {
      pointPositions[i * 3] = p.x;
      pointPositions[i * 3 + 1] = p.y;
      pointPositions[i * 3 + 2] = p.z;
    });
    return { nodes: pointPositions, lines: new Float32Array(linePositions) };
  }, []);

  const lineMat = useRef<THREE.LineBasicMaterial>(null);
  const pointMat = useRef<THREE.PointsMaterial>(null);
  const group = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    const o = opacityRef.current;
    if (lineMat.current) lineMat.current.opacity = 0.38 * o;
    if (pointMat.current) pointMat.current.opacity = 0.8 * o;
    if (group.current) {
      group.current.rotation.y += delta * 0.02;
      group.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.1) * 0.04;
    }
  });

  return (
    <group ref={group}>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[lines, 3]} />
        </bufferGeometry>
        <lineBasicMaterial
          ref={lineMat}
          color="#67e8f9"
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </lineSegments>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[nodes, 3]} />
        </bufferGeometry>
        <pointsMaterial
          ref={pointMat}
          color="#c4b5fd"
          size={0.07}
          transparent
          opacity={0.7}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </points>
    </group>
  );
}

function PortalRing({
  z,
  radius,
  color,
  tube,
  spin,
  opacityRef,
}: {
  z: number;
  radius: number;
  color: string;
  tube: number;
  spin: number;
  opacityRef: React.MutableRefObject<number>;
}) {
  const group = useRef<THREE.Group>(null);
  const ringMat = useRef<THREE.MeshBasicMaterial>(null);
  const innerMat = useRef<THREE.MeshBasicMaterial>(null);
  const tickMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide,
        toneMapped: false,
      }),
    [color],
  );

  useFrame((state, delta) => {
    const o = opacityRef.current;
    if (ringMat.current) ringMat.current.opacity = 0.75 * o;
    if (innerMat.current) innerMat.current.opacity = 0.35 * o;
    tickMat.opacity = 0.55 * o;
    if (group.current) {
      group.current.rotation.z = state.clock.elapsedTime * spin;
    }
  });

  return (
    <group ref={group} position={[0, 0, z]}>
      <mesh>
        <torusGeometry args={[radius, tube, 8, 160]} />
        <meshBasicMaterial
          ref={ringMat}
          color={color}
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
      <mesh>
        <torusGeometry args={[radius * 0.92, 0.006, 6, 160]} />
        <meshBasicMaterial
          ref={innerMat}
          color={color}
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
      {Array.from({ length: 12 }).map((_, k) => {
        const a = (k / 12) * Math.PI * 2;
        return (
          <mesh
            key={k}
            position={[Math.cos(a) * (radius + 0.3), Math.sin(a) * (radius + 0.3), 0]}
            rotation={[0, 0, a]}
            material={tickMat}
          >
            <planeGeometry args={[0.28, 0.012]} />
          </mesh>
        );
      })}
    </group>
  );
}

function Portal({ opacityRef }: { opacityRef: React.MutableRefObject<number> }) {
  return (
    <group>
      <PortalRing z={-2.8} radius={2.6} color="#67e8f9" tube={0.02} spin={0.05} opacityRef={opacityRef} />
      <PortalRing z={-6.5} radius={3.4} color="#c4b5fd" tube={0.014} spin={-0.03} opacityRef={opacityRef} />
      <PortalRing z={-10.5} radius={4.4} color="#67e8f9" tube={0.01} spin={0.02} opacityRef={opacityRef} />
    </group>
  );
}

export function Intro() {
  const enterHub = useExperience((s) => s.enterHub);
  const { camera } = useThree();
  const shader = useRef<THREE.ShaderMaterial>(null);
  const titleGroup = useRef<THREE.Group>(null);
  const camState = useRef({ z: 9, y: 0.4, fov: 45 });
  const progress = useRef(0);
  const portalOpacity = useRef(0);
  const netOpacity = useRef(1);
  const titleOpacity = useRef(1);

  const { target, start, delay, seed, count } = useMemo(() => {
    if (typeof document === "undefined") {
      return {
        target: new Float32Array(0),
        start: new Float32Array(0),
        delay: new Float32Array(0),
        seed: new Float32Array(0),
        count: 0,
      };
    }
    return sampleTitle();
  }, []);

  const uniforms = useMemo(
    () => ({
      uProgress: { value: 0 },
      uTime: { value: 0 },
      uSize: { value: 2.1 },
      uOpacity: { value: 1 },
    }),
    [],
  );

  useEffect(() => {
    camera.position.set(0, 0.4, 9);
    camera.lookAt(0, 0, -10);
    const tl = gsap.timeline({
      onComplete: () => enterHub(),
    });
    tl.to(progress, { current: 1, duration: 3.6, ease: "power2.inOut" }, 0.5);
    tl.to(netOpacity, { current: 0, duration: 2.2, ease: "power2.out" }, 3.6);
    tl.to(portalOpacity, { current: 1, duration: 2.4, ease: "power2.out" }, 2.8);
    tl.to(titleGroup.current!.rotation, { z: 0.05, duration: 3, ease: "sine.inOut" }, 3.4);
    tl.to(camState.current, { z: 6.2, duration: 2.4, ease: "power2.in" }, 4.0);
    tl.to(titleOpacity, { current: 0, duration: 1.4, ease: "power2.in" }, 4.6);
    tl.to(camState.current, { z: -4.2, duration: 2.6, ease: "power3.in" }, 5.8);
    tl.to(camState.current, { fov: 62, duration: 2, ease: "power2.in" }, 6.0);
    tl.to(portalOpacity, { current: 0.2, duration: 1.2, ease: "power2.in" }, 7.2);
    return () => {
      tl.kill();
    };
  }, [camera, enterHub]);

  useFrame((state, delta) => {
    uniforms.uTime.value = state.clock.elapsedTime;
    uniforms.uProgress.value = progress.current;
    if (shader.current) {
      shader.current.uniforms.uProgress.value = progress.current;
      shader.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
    camera.position.set(0, camState.current.y, camState.current.z);
    camera.lookAt(0, 0.1, camState.current.z - 14);
    const perspective = camera as THREE.PerspectiveCamera;
    if (perspective.fov !== camState.current.fov) {
      perspective.fov = camState.current.fov;
      perspective.updateProjectionMatrix();
    }
    if (titleGroup.current) {
      titleGroup.current.position.z = Math.sin(state.clock.elapsedTime * 0.4) * 0.05;
    }
    if (shader.current) {
      shader.current.uniforms.uOpacity.value = titleOpacity.current;
    }
  });

  return (
    <>
      <color attach="background" args={["#020409"]} />
      <fog attach="fog" args={["#020409", 12, 40]} />
      <ambientLight intensity={0.4} />
      <Stars radius={70} depth={50} count={2500} factor={3.6} saturation={0} fade speed={0.25} />
      <NeuralNetwork opacityRef={netOpacity} />
      <Portal opacityRef={portalOpacity} />

      <group ref={titleGroup} scale={1} position={[0, 0.15, 0]}>
        <points frustumCulled={false}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[target, 3]} />
            <bufferAttribute attach="attributes-aStart" args={[start, 3]} />
            <bufferAttribute attach="attributes-aTarget" args={[target, 3]} />
            <bufferAttribute attach="attributes-aDelay" args={[delay, 1]} />
            <bufferAttribute attach="attributes-aSeed" args={[seed, 1]} />
          </bufferGeometry>
          <shaderMaterial
            ref={shader}
            uniforms={uniforms}
            vertexShader={TITLE_VERTEX}
            fragmentShader={TITLE_FRAGMENT}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </points>
      </group>

      <pointLight position={[0, 2, 4]} intensity={30} color="#67e8f9" distance={18} />
      <pointLight position={[4, -2, 2]} intensity={20} color="#a78bfa" distance={16} />
    </>
  );
}
