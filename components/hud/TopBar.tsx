"use client";

import { useEffect, useRef } from "react";
import { useExperience } from "@/lib/store";
import { audio } from "@/lib/audio";
import { ZONE_MAP } from "@/lib/zones";

function Fps() {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    let frames = 0;
    let last = performance.now();
    let raf = 0;
    const loop = (t: number) => {
      frames++;
      if (t - last >= 1000) {
        if (ref.current) ref.current.textContent = String(Math.round((frames * 1000) / (t - last)));
        frames = 0;
        last = t;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);
  return <span ref={ref}>60</span>;
}

function SpeakerIcon({ on }: { on: boolean }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M2.5 6v4h2.2L8.5 13V3L4.7 6H2.5Z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" />
      {on ? (
        <>
          <path d="M10.5 5.4c.8.7 1.2 1.6 1.2 2.6s-.4 1.9-1.2 2.6" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
          <path d="M12.4 3.6c1.3 1.2 2 2.7 2 4.4s-.7 3.2-2 4.4" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" opacity=".6" />
        </>
      ) : (
        <path d="m10.5 6 4 4m0-4-4 4" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
      )}
    </svg>
  );
}

function GuideIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden>
      <circle cx="8" cy="8" r="5.4" stroke="currentColor" strokeWidth="1.1" />
      <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.1" />
      <path d="M8 .8v2.1M8 13.1v2.1M.8 8h2.1M13.1 8h2.1" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  );
}

export function TopBar() {
  const stage = useExperience((s) => s.stage);
  const hub = useExperience((s) => s.hub);
  const guideOpen = useExperience((s) => s.guideOpen);
  const setGuide = useExperience((s) => s.setGuide);
  const audioEnabled = useExperience((s) => s.audioEnabled);
  const setAudio = useExperience((s) => s.setAudio);
  const zone = stage !== "intro" && stage !== "hub" ? ZONE_MAP[stage] : null;

  const toggleAudio = async () => {
    const next = !audioEnabled;
    await audio.setEnabled(next);
    setAudio(next);
    if (next) audio.play("select");
  };

  const toggleFullscreen = () => {
    audio.play("hover");
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  };

  return (
    <header className="hud-top">
      <button className="brand" onClick={() => stage !== "intro" && hub()} aria-label="Return to the command hub">
        <span className="brand-mark" />
        <span className="brand-text">
          <span className="brand-title">The Academic Dimension</span>
          <span className="brand-sub">Immersive record / 2026</span>
        </span>
      </button>

      <div className="hud-top-center">
        <span className="status-dot" />
        <span>{zone ? `${zone.index} · ${zone.title}` : stage === "intro" ? "Initialising dimension" : "Command hub online"}</span>
        <span style={{ opacity: 0.4 }}>//</span>
        <span>
          <Fps /> fps
        </span>
      </div>

      <div className="hud-top-right">
        <button
          className="icon-btn"
          data-active={audioEnabled}
          onClick={toggleAudio}
          aria-pressed={audioEnabled}
          aria-label={audioEnabled ? "Mute ambience" : "Enable ambience"}
          title="Audio (M)"
        >
          <SpeakerIcon on={audioEnabled} />
          <span>{audioEnabled ? "on" : "off"}</span>
        </button>
        {stage !== "intro" && (
          <button
            className="icon-btn"
            data-active={guideOpen}
            onClick={() => {
              setGuide(!guideOpen);
              audio.play("select");
            }}
            aria-pressed={guideOpen}
            title="Guide (G)"
          >
            <GuideIcon />
            <span>Aura</span>
          </button>
        )}
        <button className="icon-btn" onClick={toggleFullscreen} aria-label="Toggle fullscreen" title="Fullscreen (F)">
          <svg viewBox="0 0 16 16" fill="none" aria-hidden>
            <path d="M2 6V2h4M14 6V2h-4M2 10v4h4M14 10v4h-4" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </header>
  );
}
