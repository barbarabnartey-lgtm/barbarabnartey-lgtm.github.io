"use client";

import { useMemo } from "react";
import * as THREE from "three";

const cache = new Map<string, THREE.CanvasTexture>();

function drawSpaced(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  spacing: number,
) {
  const chars = [...text];
  const widths = chars.map((c) => ctx.measureText(c).width);
  const total = widths.reduce((a, b) => a + b, 0) + spacing * (chars.length - 1);
  let cursor = x - total / 2;
  chars.forEach((c, i) => {
    ctx.fillText(c, cursor, y);
    cursor += widths[i] + spacing;
  });
}

export function getLabelTexture(text: string, color = "#cfe9f2", size = 40) {
  const key = `${text}|${color}|${size}`;
  const hit = cache.get(key);
  if (hit) return hit;

  const dpr = 2;
  const font = `500 ${size * dpr}px "IBM Plex Mono", "SFMono-Regular", Consolas, monospace`;
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;
  ctx.font = font;
  const spaced = text.toUpperCase();
  const width = Math.ceil(
    [...spaced].reduce((sum, c) => sum + ctx.measureText(c).width, 0) +
      spaced.length * 4 * dpr +
      40 * dpr,
  );
  const height = Math.ceil(size * dpr * 1.7);
  canvas.width = width;
  canvas.height = height;
  ctx.font = font;
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillStyle = color;
  ctx.shadowColor = color;
  ctx.shadowBlur = 14 * dpr;
  drawSpaced(ctx, spaced, width / 2, height / 2, 4 * dpr);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.generateMipmaps = false;
  tex.userData.aspect = width / height;
  cache.set(key, tex);
  return tex;
}

type Label3DProps = {
  text: string;
  position?: [number, number, number];
  color?: string;
  size?: number;
  scale?: number;
  opacity?: number;
  rotation?: [number, number, number];
};

export function Label3D({
  text,
  position = [0, 0, 0],
  color = "#cfe9f2",
  size = 40,
  scale = 1,
  opacity = 1,
  rotation,
}: Label3DProps) {
  const texture = useMemo(() => {
    if (typeof document === "undefined") return null;
    return getLabelTexture(text, color, size);
  }, [text, color, size]);

  if (!texture) return null;
  const aspect = (texture.userData.aspect as number) || 6;
  const height = 0.34 * scale;
  return (
    <sprite position={position} scale={[height * aspect, height, 1]} rotation={rotation}>
      <spriteMaterial
        map={texture}
        transparent
        opacity={opacity}
        depthWrite={false}
        toneMapped={false}
      />
    </sprite>
  );
}
