"use client";

import { motion } from "framer-motion";
import { useExperience } from "@/lib/store";
import { audio } from "@/lib/audio";
import { profile } from "@/data/profile";

export function HubOverlay() {
  const stage = useExperience((s) => s.stage);
  const go = useExperience((s) => s.go);
  const setGuide = useExperience((s) => s.setGuide);
  const hoverLabel = useExperience((s) => s.hoverLabel);

  if (stage !== "hub") return null;

  return (
    <>
      <motion.div
        className="hub-copy"
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="hub-kicker">Digital exhibition / MMXXVI</div>
        <h1 className="hub-title">
          The Academic
          <span>Dimension</span>
        </h1>
        <div className="hub-identity">
          <div>
            <div className="hub-name">{profile.name}</div>
            <div className="hub-role">
              {profile.title}
              <br />
              {profile.location}
            </div>
          </div>
        </div>
        <p className="hub-desc">
          Ten zones. One record. Explore research, projects, skills, and the road ahead
          through an interactive knowledge universe — or ask the resident guide to open
          any dossier.
        </p>
        <div className="btn-row">
          <button
            className="btn btn-primary"
            onClick={() => {
              audio.play("select");
              go("about");
            }}
          >
            Open identity chamber
            <svg viewBox="0 0 12 12" fill="none" aria-hidden>
              <path d="M1 6h9M6.5 2 10 6l-3.5 4" stroke="currentColor" strokeWidth="1.1" />
            </svg>
          </button>
          <button
            className="btn"
            onClick={() => {
              setGuide(true);
              audio.play("select");
            }}
          >
            Ask Aura
          </button>
        </div>
      </motion.div>

      <motion.div
        className="hub-metrics"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.8 }}
      >
        {profile.metrics.map((m) => (
          <div key={m.label}>
            <div className="metric-value">
              {m.value}
              <small>{m.suffix}</small>
            </div>
            <div className="metric-label">{m.label}</div>
          </div>
        ))}
      </motion.div>

      <motion.div
        className="hub-status"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 1 }}
      >
        <div>Location / {profile.location}</div>
        <div>Status / open to collaboration</div>
        <div style={{ color: "#67e8f9" }}>Click a node to enter</div>
      </motion.div>

      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: 78,
          transform: "translateX(-50%)",
          zIndex: 14,
          opacity: hoverLabel ? 1 : 0,
          transition: "opacity .25s",
          pointerEvents: "none",
          textAlign: "center",
        }}
      >
        <div className="eyebrow" style={{ color: "#67e8f9", fontSize: 8 }}>
          Zone selected
        </div>
        <div style={{ fontSize: 13, letterSpacing: "0.12em", textTransform: "uppercase", marginTop: 4 }}>
          {hoverLabel} — click to enter
        </div>
      </div>
    </>
  );
}
