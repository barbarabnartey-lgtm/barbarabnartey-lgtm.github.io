"use client";

import { create } from "zustand";
import type { Stage, ZoneId } from "@/data/profile";
import { ZONE_ORDER } from "./zones";

type Selection = { zone: ZoneId; id: string } | null;

type State = {
  stage: Stage;
  transitionId: number;
  selection: Selection;
  guideOpen: boolean;
  guideSeed: string | null;
  audioEnabled: boolean;
  soundPromptSeen: boolean;
  hoverLabel: string | null;
  enterHub: () => void;
  go: (zone: ZoneId) => void;
  goToItem: (zone: ZoneId, id: string) => void;
  hub: () => void;
  cycle: (dir: 1 | -1) => void;
  select: (id: string) => void;
  clearSelection: () => void;
  setGuide: (open: boolean, seed?: string | null) => void;
  setAudio: (on: boolean) => void;
  setSoundPromptSeen: () => void;
  setHoverLabel: (label: string | null) => void;
};

export const useExperience = create<State>((set, get) => ({
  stage: "intro",
  transitionId: 0,
  selection: null,
  guideOpen: false,
  guideSeed: null,
  audioEnabled: false,
  soundPromptSeen: false,
  hoverLabel: null,
  enterHub: () =>
    set((s) => ({
      stage: "hub",
      selection: null,
      transitionId: s.transitionId + 1,
      hoverLabel: null,
    })),
  go: (zone) =>
    set((s) => ({
      stage: zone,
      selection: null,
      transitionId: s.transitionId + 1,
      hoverLabel: null,
    })),
  goToItem: (zone, id) =>
    set((s) => ({
      stage: zone,
      selection: { zone, id },
      guideOpen: false,
      transitionId: s.transitionId + 1,
      hoverLabel: null,
    })),
  hub: () =>
    set((s) => ({
      stage: "hub",
      selection: null,
      transitionId: s.transitionId + 1,
      hoverLabel: null,
    })),
  cycle: (dir) => {
    const { stage } = get();
    if (stage === "intro") return;
    const current = ZONE_ORDER.indexOf(stage as ZoneId);
    const next =
      current === -1
        ? dir === 1
          ? 0
          : ZONE_ORDER.length - 1
        : (current + dir + ZONE_ORDER.length) % ZONE_ORDER.length;
    get().go(ZONE_ORDER[next]);
  },
  select: (id) => {
    const { stage } = get();
    if (stage === "intro" || stage === "hub") return;
    set({ selection: { zone: stage, id } });
  },
  clearSelection: () => set({ selection: null }),
  setGuide: (open, seed = null) =>
    set({ guideOpen: open, guideSeed: seed ?? get().guideSeed }),
  setAudio: (on) => set({ audioEnabled: on }),
  setSoundPromptSeen: () => set({ soundPromptSeen: true }),
  setHoverLabel: (label) => set({ hoverLabel: label }),
}));
