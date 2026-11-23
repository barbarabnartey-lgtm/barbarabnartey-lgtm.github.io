"use client";

import { useEffect, useState } from "react";
import { useExperience } from "@/lib/store";
import { useKeyboard } from "@/lib/useKeyboard";
import { ExperienceCanvas } from "./canvas/ExperienceCanvas";
import { TopBar } from "./hud/TopBar";
import { NavRail } from "./hud/NavRail";
import { IntroOverlay } from "./hud/IntroOverlay";
import { HubOverlay } from "./hud/HubOverlay";
import { ZoneChrome } from "./hud/ZoneChrome";
import { Guide } from "./hud/Guide";
import { Cursor } from "./hud/Cursor";
import { Transition } from "./hud/Transition";

export function Experience() {  const stage = useExperience((s) => s.stage);
  const guideOpen = useExperience((s) => s.guideOpen);
  const [ready, setReady] = useState(false);
  const [booted, setBooted] = useState(false);

  useKeyboard();

  useEffect(() => {
    if (!ready) return;
    const t = window.setTimeout(() => setBooted(true), 760);
    return () => window.clearTimeout(t);
  }, [ready]);

  return (
    <div className="stage">
      <ExperienceCanvas onReady={() => setReady(true)} />

      <div className="grain" aria-hidden="true" />
      <div className="scanlines" aria-hidden="true" />
      <div className="vignette" aria-hidden="true" />

      <div className={`hud ${guideOpen ? "guide-open" : ""}`}>
        <TopBar />
        <NavRail />
        <IntroOverlay />
        <HubOverlay />
        <ZoneChrome />
        <Guide />

        {stage !== "intro" && (
          <div className="hud-bottom">
            <div className="keyhints">
              <span className="keyhint">
                <kbd>1</kbd>–<kbd>0</kbd> zones
              </span>
              <span className="keyhint">
                <kbd>←</kbd>
                <kbd>→</kbd> cycle
              </span>
              <span className="keyhint">
                <kbd>G</kbd> aura
              </span>
              <span className="keyhint">
                <kbd>M</kbd> audio
              </span>
              <span className="keyhint">
                <kbd>ESC</kbd> back
              </span>
            </div>
            <div style={{ display: "flex", gap: 18 }}>
              <span>Render / WebGL 2</span>
              <span style={{ color: "#8b98ad" }}>Record / Vale · A.</span>
            </div>
          </div>
        )}

        {stage === "hub" && (
          <div className="zone-hint">Drift the core · select a node · AURA holds the index</div>
        )}
      </div>

      <Cursor />
      <Transition />

      <div className="mobile-note">
        The full dimension is built for desktop · a wide viewport and keyboard are recommended
      </div>

      <div className={`loader ${booted ? "is-hidden" : ""}`} aria-hidden={booted}>
        <div className="loader-inner">
          <div className="loader-glyph" />
          <div className="loader-text">Calibrating dimensional interface</div>
          <div className="loader-bar">
            <i />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Experience;
