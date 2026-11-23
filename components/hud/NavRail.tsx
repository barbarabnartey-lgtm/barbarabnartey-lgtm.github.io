"use client";

import { useExperience } from "@/lib/store";
import { audio } from "@/lib/audio";
import { ZONES } from "@/lib/zones";

export function NavRail() {
  const stage = useExperience((s) => s.stage);
  const go = useExperience((s) => s.go);
  const hub = useExperience((s) => s.hub);

  if (stage === "intro") return null;

  return (
    <nav className="nav-rail" aria-label="Dimension map">
      <div className="nav-rail-head">
        <span>Dimension map</span>
        <span>10 zones</span>
      </div>
      <button
        className="nav-item"
        data-active={stage === "hub"}
        onClick={() => {
          audio.play("back");
          hub();
        }}
      >
        <span className="nav-index">00</span>
        <span className="nav-label">Command Hub</span>
        <span className="nav-tick">ESC</span>
      </button>
      {ZONES.map((zone) => (
        <button
          key={zone.id}
          className="nav-item"
          data-active={stage === zone.id}
          style={{ ["--accent" as string]: zone.accent, ["--accent-rgb" as string]: zone.accentRgb }}
          onClick={() => {
            audio.play("select");
            go(zone.id);
          }}
          aria-current={stage === zone.id ? "page" : undefined}
        >
          <span className="nav-index">{zone.index}</span>
          <span className="nav-label">{zone.label}</span>
          <span className="nav-tick">{zone.key}</span>
        </button>
      ))}
      <div className="nav-rail-foot">
        <div>STATUS / ALL ZONES ONLINE</div>
        <div>RECORD / VALE · A.</div>
      </div>
    </nav>
  );
}
