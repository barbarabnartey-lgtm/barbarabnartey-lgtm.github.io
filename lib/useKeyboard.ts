"use client";

import { useEffect } from "react";
import { useExperience } from "@/lib/store";
import { audio } from "@/lib/audio";
import { ZONES } from "@/lib/zones";
import { education, projects, research, skills, achievements, leadership, innovation, future } from "@/data/profile";

export function useKeyboard() {
  useEffect(() => {
    const firstItem: Record<string, string | undefined> = {
      about: "profile",
      education: education[0]?.id,
      projects: projects[0]?.id,
      research: research[0]?.id,
      skills: skills[0]?.id,
      achievements: achievements[0]?.id,
      leadership: leadership[0]?.id,
      innovation: innovation[0]?.id,
      future: future[0]?.id,
    };

    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)) return;
      const s = useExperience.getState();
      const key = e.key.toLowerCase();

      if (s.stage === "intro") {
        if (key === "escape" || key === "enter") {
          e.preventDefault();
          s.enterHub();
        }
        return;
      }

      if (key === "escape") {
        e.preventDefault();
        if (s.guideOpen) {
          s.setGuide(false);
        } else if (s.selection) {
          s.clearSelection();
        } else if (s.stage !== "hub") {
          s.hub();
        }
        return;
      }

      if (key === "g") {
        e.preventDefault();
        s.setGuide(!s.guideOpen);
        audio.play("select");
        return;
      }

      if (key === "m") {
        e.preventDefault();
        const next = !s.audioEnabled;
        audio.setEnabled(next);
        s.setAudio(next);
        if (next) audio.play("select");
        return;
      }

      if (s.guideOpen) return;

      if (key === "arrowleft" || key === ",") {
        e.preventDefault();
        audio.play("back");
        s.cycle(-1);
        return;
      }
      if (key === "arrowright" || key === ".") {
        e.preventDefault();
        audio.play("select");
        s.cycle(1);
        return;
      }
      if (key === "h") {
        e.preventDefault();
        s.hub();
        return;
      }

      const zoneByKey = ZONES.find((z) => z.key === key);
      if (zoneByKey) {
        e.preventDefault();
        audio.play("select");
        s.go(zoneByKey.id);
        return;
      }
      if (s.stage !== "hub" && !s.selection && (key === "enter" || key === " ")) {
        const id = firstItem[s.stage];
        if (id) {
          e.preventDefault();
          audio.play("open");
          s.select(id);
        }
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);
}
