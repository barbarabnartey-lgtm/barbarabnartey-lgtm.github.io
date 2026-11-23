"use client";

import { motion } from "framer-motion";
import { useExperience } from "@/lib/store";
import { audio } from "@/lib/audio";
import { profile } from "@/data/profile";

export function IntroOverlay() {
  const stage = useExperience((s) => s.stage);
  const enterHub = useExperience((s) => s.enterHub);
  const audioEnabled = useExperience((s) => s.audioEnabled);
  const setAudio = useExperience((s) => s.setAudio);

  if (stage !== "intro") return null;

  const toggleAmbience = async () => {
    const next = !audioEnabled;
    await audio.setEnabled(next);
    setAudio(next);
    if (next) audio.play("select");
  };

  return (
    <div className="intro-overlay">
      <div />
      <motion.div
        className="intro-bottom"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <div>
          <div className="intro-meta">
            <div style={{ color: "#a7b3c6" }}>The Academic Dimension</div>
            <div>A digital exhibition in ten zones</div>
          </div>
          <div style={{ marginTop: 18, fontSize: 22, letterSpacing: "-0.02em" }}>
            {profile.name}
            <span style={{ color: "#5d6a80", margin: "0 10px" }}>/</span>
            <span style={{ color: "#8b98ad", fontSize: 13 }}>{profile.title}</span>
          </div>
          <div className="intro-progress">
            <div className="bar">
              <motion.i
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 8.4, ease: "linear" }}
              />
            </div>
            <div className="intro-meta" style={{ marginTop: 8, fontSize: 8 }}>
              Forming knowledge graph · <span style={{ color: "#67e8f9" }}>please stand by</span>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 18 }}>
          <div className="intro-meta" style={{ textAlign: "right" }}>
            <div>Pointer · parallax</div>
            <div>Scroll · navigate</div>
            <div>Keyboard · explore</div>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <button className="icon-btn" onClick={toggleAmbience} data-active={audioEnabled}>
              <span>{audioEnabled ? "Ambience on" : "Enable ambience"}</span>
            </button>
            <button
              className="skip-btn"
              onClick={() => {
                audio.play("select");
                enterHub();
              }}
            >
              Skip intro
              <svg width="14" height="10" viewBox="0 0 14 10" fill="none" aria-hidden>
                <path d="M0 5h12M8.5 1 12.5 5 8.5 9" stroke="currentColor" strokeWidth="1" />
              </svg>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
