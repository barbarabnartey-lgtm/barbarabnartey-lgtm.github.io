"use client";

import * as THREE from "three";

const cache = new Map<string, THREE.CanvasTexture>();

function seeded(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function spacedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  spacing: number,
  align: "left" | "center" = "left",
) {
  const chars = [...text];
  const widths = chars.map((c) => ctx.measureText(c).width);
  const total = widths.reduce((a, b) => a + b, 0) + spacing * (chars.length - 1);
  let cursor = align === "center" ? x - total / 2 : x;
  chars.forEach((c, i) => {
    ctx.fillText(c, cursor, y);
    cursor += widths[i] + spacing;
  });
  return total;
}

function wrapLines(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function finish(canvas: HTMLCanvasElement, key: string) {
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  tex.minFilter = THREE.LinearFilter;
  tex.generateMipmaps = false;
  cache.set(key, tex);
  return tex;
}

export function projectTexture(opts: {
  id: string;
  index: string;
  title: string;
  category: string;
  accent: string;
  visual: string;
  year: string;
}) {
  const key = `project|${opts.id}`;
  const hit = cache.get(key);
  if (hit) return hit;
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 640;
  const ctx = canvas.getContext("2d")!;
  const accent = opts.accent;
  const rand = seeded(opts.title.length * 71 + opts.year.length * 13);

  const bg = ctx.createLinearGradient(0, 0, 1024, 640);
  bg.addColorStop(0, "#060b16");
  bg.addColorStop(0.55, "#081321");
  bg.addColorStop(1, "#04070e");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 1024, 640);

  // fine grid
  ctx.strokeStyle = "rgba(255,255,255,0.05)";
  ctx.lineWidth = 1;
  for (let x = 0; x <= 1024; x += 32) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 640);
    ctx.stroke();
  }
  for (let y = 0; y <= 640; y += 32) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(1024, y);
    ctx.stroke();
  }

  // accent glow
  const glow = ctx.createRadialGradient(720, 300, 20, 720, 300, 380);
  glow.addColorStop(0, `${accent}55`);
  glow.addColorStop(1, `${accent}00`);
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, 1024, 640);

  ctx.save();
  ctx.translate(710, 300);
  ctx.strokeStyle = accent;
  ctx.fillStyle = accent;
  if (opts.visual === "constellation") {
    const nodes: [number, number][] = [];
    for (let i = 0; i < 26; i++) {
      const a = rand() * Math.PI * 2;
      const r = 40 + rand() * 170;
      nodes.push([Math.cos(a) * r, Math.sin(a) * r * 0.8]);
    }
    ctx.globalAlpha = 0.4;
    nodes.forEach((n, i) => {
      for (let j = i + 1; j < nodes.length; j++) {
        const d = Math.hypot(n[0] - nodes[j][0], n[1] - nodes[j][1]);
        if (d < 95) {
          ctx.beginPath();
          ctx.moveTo(...n);
          ctx.lineTo(...nodes[j]);
          ctx.stroke();
        }
      }
    });
    ctx.globalAlpha = 0.9;
    nodes.forEach((n) => {
      ctx.beginPath();
      ctx.arc(n[0], n[1], 2.5, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 0.25;
    for (let r = 60; r < 220; r += 60) {
      ctx.beginPath();
      ctx.ellipse(0, 0, r, r * 0.72, -0.3, 0, Math.PI * 2);
      ctx.stroke();
    }
  } else if (opts.visual === "city") {
    for (let i = 0; i < 26; i++) {
      const w = 9 + rand() * 22;
      const h = 30 + rand() * 210;
      const x = -230 + i * 19;
      ctx.globalAlpha = 0.18 + rand() * 0.5;
      ctx.fillRect(x, 200 - h, w, h);
      ctx.globalAlpha = 0.09;
      ctx.fillRect(x, 200 - h, w, 200);
    }
    ctx.globalAlpha = 0.5;
    ctx.beginPath();
    ctx.moveTo(-260, 200);
    ctx.lineTo(260, 200);
    ctx.stroke();
  } else if (opts.visual === "waveform") {
    for (let layer = 0; layer < 9; layer++) {
      ctx.globalAlpha = 0.14 + layer * 0.07;
      ctx.beginPath();
      for (let x = -250; x <= 250; x += 5) {
        const y =
          Math.sin(x * 0.028 + layer * 0.7) * (26 + layer * 5) +
          Math.sin(x * 0.09 + layer) * 8;
        if (x === -250) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    ctx.globalAlpha = 0.35;
    for (let i = 0; i < 40; i++) {
      const x = -250 + i * 12.8;
      const h = 8 + Math.abs(Math.sin(i * 0.9)) * 70;
      ctx.globalAlpha = 0.12 + rand() * 0.4;
      ctx.fillRect(x, -h / 2, 2.5, h);
    }
  } else if (opts.visual === "bloom") {
    for (let ring = 0; ring < 12; ring++) {
      ctx.globalAlpha = 0.12 + ring * 0.03;
      const petals = 7;
      ctx.beginPath();
      for (let p = 0; p <= petals; p++) {
        const a = (p / petals) * Math.PI * 2;
        const r = (60 + ring * 12) * (0.7 + 0.3 * Math.sin(a * 3 + ring));
        const x = Math.cos(a) * r;
        const y = Math.sin(a) * r * 0.8;
        if (p === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
    }
    ctx.globalAlpha = 0.9;
    ctx.beginPath();
    ctx.arc(0, 0, 5, 0, Math.PI * 2);
    ctx.fill();
  } else {
    const cell = 36;
    for (let gy = -5; gy < 5; gy++) {
      for (let gx = -6; gx < 7; gx++) {
        const v = rand();
        ctx.globalAlpha = 0.05 + v * 0.42;
        ctx.fillRect(gx * cell, gy * cell, cell - 2, cell - 2);
      }
    }
    ctx.globalAlpha = 0.7;
    ctx.beginPath();
    ctx.arc(60, -20, 34, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();

  // frame lines
  ctx.globalAlpha = 1;
  ctx.strokeStyle = "rgba(255,255,255,0.14)";
  ctx.lineWidth = 2;
  ctx.strokeRect(24, 24, 976, 592);
  ctx.strokeStyle = accent;
  ctx.globalAlpha = 0.8;
  ctx.beginPath();
  ctx.moveTo(24, 120);
  ctx.lineTo(24, 24);
  ctx.lineTo(160, 24);
  ctx.moveTo(1000, 520);
  ctx.lineTo(1000, 616);
  ctx.lineTo(864, 616);
  ctx.stroke();

  ctx.globalAlpha = 1;
  ctx.font = '500 26px "IBM Plex Mono", monospace';
  ctx.fillStyle = accent;
  spacedText(ctx, opts.index, 56, 78, 4);
  ctx.font = '400 22px "IBM Plex Mono", monospace';
  ctx.fillStyle = "rgba(230,238,248,0.7)";
  const label = opts.category.toUpperCase();
  spacedText(ctx, label, 968 - ctx.measureText(label).width - 20, 78, 3, "left");

  ctx.font = '500 82px "Space Grotesk", Arial, sans-serif';
  ctx.fillStyle = "#f3f7fd";
  ctx.fillText(opts.title, 56, 520);
  ctx.font = '400 24px "IBM Plex Mono", monospace';
  ctx.fillStyle = "rgba(200,212,230,0.62)";
  spacedText(ctx, `SELECTED WORK / ${opts.year}`, 56, 570, 3);

  return finish(canvas, key);
}

export function facadeTexture(id: string, accent: string, seedNo: number) {
  const key = `facade|${id}|${accent}`;
  const hit = cache.get(key);
  if (hit) return hit;
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 512;
  const ctx = canvas.getContext("2d")!;
  const rand = seeded(seedNo * 977 + 31);
  const bg = ctx.createLinearGradient(0, 0, 0, 512);
  bg.addColorStop(0, "#0a1220");
  bg.addColorStop(1, "#05080f");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 256, 512);

  // vertical structure
  ctx.strokeStyle = "rgba(255,255,255,0.09)";
  ctx.lineWidth = 2;
  for (let x = 16; x < 256; x += 32) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 512);
    ctx.stroke();
  }

  const cols = 7;
  const rows = 26;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const lit = rand();
      const w = 18;
      const h = 8;
      const x = 20 + c * 32;
      const y = 18 + r * 18;
      if (lit > 0.62) {
        ctx.fillStyle = `${accent}${lit > 0.9 ? "e6" : lit > 0.78 ? "a6" : "66"}`;
        ctx.fillRect(x, y, w, h);
      } else {
        ctx.fillStyle = "rgba(120,150,185,0.08)";
        ctx.fillRect(x, y, w, h);
      }
    }
  }

  ctx.fillStyle = "rgba(255,255,255,0.1)";
  ctx.fillRect(0, 0, 256, 3);
  ctx.fillStyle = `${accent}44`;
  ctx.fillRect(0, 508, 256, 4);

  return finish(canvas, key);
}

export function documentTexture(opts: {
  id: string;
  index: string;
  title: string;
  type: string;
  accent: string;
}) {
  const key = `doc|${opts.id}`;
  const hit = cache.get(key);
  if (hit) return hit;
  const canvas = document.createElement("canvas");
  canvas.width = 640;
  canvas.height = 860;
  const ctx = canvas.getContext("2d")!;
  const rand = seeded(opts.title.length * 43 + 7);

  const bg = ctx.createLinearGradient(0, 0, 640, 860);
  bg.addColorStop(0, "rgba(8,18,34,0.98)");
  bg.addColorStop(1, "rgba(4,8,16,0.98)");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 640, 860);

  ctx.strokeStyle = "rgba(255,255,255,0.12)";
  ctx.lineWidth = 2;
  ctx.strokeRect(12, 12, 616, 836);

  ctx.fillStyle = opts.accent;
  ctx.font = '500 20px "IBM Plex Mono", monospace';
  spacedText(ctx, opts.index, 48, 66, 4);

  ctx.fillStyle = "rgba(220,232,248,0.5)";
  ctx.font = '400 13px "IBM Plex Mono", monospace';
  spacedText(ctx, opts.type.toUpperCase(), 592, 66, 2, "center");

  ctx.strokeStyle = `${opts.accent}66`;
  ctx.beginPath();
  ctx.moveTo(48, 92);
  ctx.lineTo(592, 92);
  ctx.stroke();

  ctx.fillStyle = "#f0f5fc";
  ctx.font = '600 38px "Space Grotesk", Arial, sans-serif';
  const lines = wrapLines(ctx, opts.title, 540);
  lines.slice(0, 4).forEach((line, i) => ctx.fillText(line, 48, 150 + i * 46));

  const startY = 150 + Math.min(lines.length, 4) * 46 + 26;
  ctx.fillStyle = `${opts.accent}22`;
  ctx.fillRect(48, startY, 544, 150);
  ctx.strokeStyle = `${opts.accent}55`;
  ctx.strokeRect(48, startY, 544, 150);
  ctx.fillStyle = opts.accent;
  ctx.beginPath();
  for (let x = 0; x <= 540; x += 4) {
    const y = startY + 75 + Math.sin(x * 0.034) * 38 * Math.sin(x * 0.007 + 1);
    if (x === 0) ctx.moveTo(48 + x, y);
    else ctx.lineTo(48 + x, y);
  }
  ctx.stroke();

  let y = startY + 200;
  ctx.font = '400 16px "IBM Plex Mono", monospace';
  for (let block = 0; block < 3; block++) {
    ctx.fillStyle = `${opts.accent}bb`;
    ctx.fillRect(48, y, 90 + rand() * 70, 5);
    y += 20;
    for (let row = 0; row < 5; row++) {
      const w = 180 + rand() * 360;
      ctx.fillStyle = "rgba(200,215,235,0.22)";
      ctx.fillRect(48, y, w, 3);
      y += 11;
    }
    y += 18;
  }

  ctx.fillStyle = "rgba(200,215,235,0.35)";
  ctx.font = '400 12px "IBM Plex Mono", monospace';
  spacedText(ctx, "HOLOGRAPHIC PRESENTATION MODE", 48, 806, 2);

  return finish(canvas, key);
}

export function consoleTexture(kind: "command" | "terminal" | "console", accent: string) {
  const key = `console|${kind}|${accent}`;
  const hit = cache.get(key);
  if (hit) return hit;
  const canvas = document.createElement("canvas");
  canvas.width = 768;
  canvas.height = 432;
  const ctx = canvas.getContext("2d")!;
  const rand = seeded(kind.length * 131 + 5);

  ctx.fillStyle = "#050a13";
  ctx.fillRect(0, 0, 768, 432);
  const glow = ctx.createRadialGradient(384, 200, 20, 384, 200, 400);
  glow.addColorStop(0, `${accent}22`);
  glow.addColorStop(1, "transparent");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, 768, 432);

  ctx.strokeStyle = "rgba(255,255,255,0.06)";
  for (let x = 0; x < 768; x += 24) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 432);
    ctx.stroke();
  }
  for (let y = 0; y < 432; y += 24) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(768, y);
    ctx.stroke();
  }

  ctx.font = '500 13px "IBM Plex Mono", monospace';
  ctx.fillStyle = accent;
  const heading =
    kind === "terminal" ? "OPEN CHANNEL / SECURE" : kind === "command" ? "MISSION CONTROL" : "CONSOLE";
  spacedText(ctx, heading, 28, 42, 3);

  ctx.fillStyle = "rgba(240,247,255,0.85)";
  ctx.font = '600 34px "Space Grotesk", Arial, sans-serif';
  const title =
    kind === "terminal" ? "ARDEN VALE" : kind === "command" ? "OPERATIONS OVERVIEW" : "FIELD CONSOLE";
  ctx.fillText(title, 28, 96);

  ctx.strokeStyle = `${accent}66`;
  ctx.beginPath();
  ctx.moveTo(28, 116);
  ctx.lineTo(740, 116);
  ctx.stroke();

  if (kind === "terminal") {
    ctx.fillStyle = "rgba(200,215,235,0.5)";
    ctx.font = '400 14px "IBM Plex Mono", monospace';
    const rows = [
      "> ESTABLISHING UPLINK ......... OK",
      "> RESEARCH COLLABORATION ...... OPEN",
      "> 2027 INTAKE ................. ACTIVE",
      "> RESPONSE WINDOW ............. 24H",
    ];
    rows.forEach((row, i) => {
      ctx.fillStyle = i === 3 ? accent : "rgba(200,215,235,0.5)";
      ctx.fillText(row, 28, 160 + i * 30);
    });
    ctx.strokeStyle = `${accent}88`;
    ctx.strokeRect(28, 300, 712, 96);
    ctx.fillStyle = accent;
    ctx.font = '500 18px "IBM Plex Mono", monospace';
    spacedText(ctx, "AWAITING TRANSMISSION", 384, 352, 4, "center");
  } else {
    for (let i = 0; i < 5; i++) {
      const x = 28 + i * 146;
      const h = 40 + rand() * 100;
      ctx.fillStyle = `${accent}${i % 2 === 0 ? "55" : "33"}`;
      ctx.fillRect(x, 220 - h, 30, h);
      ctx.fillStyle = `${accent}aa`;
      ctx.fillRect(x, 220 - h, 30, 3);
    }
    ctx.strokeStyle = `${accent}44`;
    ctx.beginPath();
    ctx.moveTo(28, 250);
    ctx.lineTo(740, 250);
    ctx.stroke();
    for (let i = 0; i < 6; i++) {
      ctx.fillStyle = "rgba(200,215,235,0.35)";
      ctx.fillRect(28, 280 + i * 18, 200 + rand() * 400, 3);
    }
    ctx.fillStyle = accent;
    ctx.beginPath();
    ctx.arc(700, 330, 42, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(700, 330, 28, 0, Math.PI * 1.4);
    ctx.stroke();
  }

  return finish(canvas, key);
}

export function portraitParticles(): { positions: Float32Array; random: Float32Array } {
  const canvas = document.createElement("canvas");
  canvas.width = 420;
  canvas.height = 560;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, 420, 560);
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.ellipse(210, 190, 92, 112, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(70, 560);
  ctx.quadraticCurveTo(92, 342, 210, 322);
  ctx.quadraticCurveTo(328, 342, 350, 560);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(210, 96, 54, 34, 0, 0, Math.PI * 2);
  ctx.fill();

  const data = ctx.getImageData(0, 0, 420, 560).data;
  const pts: number[] = [];
  for (let y = 0; y < 560; y += 5) {
    for (let x = 0; x < 420; x += 5) {
      const a = data[(y * 420 + x) * 4 + 3];
      if (a > 130) {
        pts.push((x - 210) / 95, -(y - 300) / 95, (Math.random() - 0.5) * 0.22);
      }
    }
  }
  const positions = new Float32Array(pts);
  const random = new Float32Array(positions.length / 3);
  for (let i = 0; i < random.length; i++) random[i] = Math.random();
  return { positions, random };
}
