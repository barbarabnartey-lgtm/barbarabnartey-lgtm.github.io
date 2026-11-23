"use client";

import { useEffect, useRef } from "react";
import { useExperience } from "@/lib/store";

export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLDivElement>(null);
  const hoverLabel = useExperience((s) => s.hoverLabel);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    document.body.classList.add("has-custom-cursor");

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ringPos = { ...pos };
    let hovering = false;
    let visible = false;
    let raf = 0;

    const move = (e: PointerEvent) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      const target = e.target as HTMLElement | null;
      hovering = !!target?.closest("button, a, input, [data-cursor]");
      if (dot.current) {
        dot.current.style.transform = `translate(${pos.x}px, ${pos.y}px) translate(-50%, -50%)`;
      }
      if (label.current) {
        label.current.style.transform = `translate(${pos.x + 18}px, ${pos.y + 20}px)`;
      }
      if (!visible) {
        visible = true;
        if (dot.current) dot.current.style.opacity = "1";
        if (ring.current) ring.current.style.opacity = "1";
      }
    };

    const leave = () => {
      visible = false;
      if (dot.current) dot.current.style.opacity = "0";
      if (ring.current) ring.current.style.opacity = "0";
      if (label.current) label.current.style.opacity = "0";
    };

    const loop = () => {
      ringPos.x += (pos.x - ringPos.x) * 0.16;
      ringPos.y += (pos.y - ringPos.y) * 0.16;
      if (ring.current) {
        ring.current.style.transform = `translate(${ringPos.x}px, ${ringPos.y}px) translate(-50%, -50%)`;
        ring.current.dataset.hover = hovering ? "true" : "false";
      }
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerdown", move);
    document.documentElement.addEventListener("pointerleave", leave);
    raf = requestAnimationFrame(loop);
    return () => {
      document.body.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", move);
      document.documentElement.removeEventListener("pointerleave", leave);
      cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    if (label.current) {
      label.current.textContent = hoverLabel ?? "Open";
      label.current.dataset.show = hoverLabel ? "true" : "false";
    }
  }, [hoverLabel]);

  return (
    <>
      <div className="cursor cursor-dot" ref={dot} style={{ opacity: 0 }} />
      <div className="cursor cursor-ring" ref={ring} style={{ opacity: 0 }} />
      <div className="cursor cursor-label" ref={label} style={{ opacity: 0 }} />
    </>
  );
}
