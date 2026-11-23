import type { ZoneId } from "@/data/profile";

export type ZoneMeta = {
  id: ZoneId;
  index: string;
  key: string;
  label: string;
  title: string;
  subtitle: string;
  brief: string;
  instruction: string;
  accent: string;
  accentRgb: string;
};

export const ZONES: ZoneMeta[] = [
  {
    id: "about",
    index: "01",
    key: "1",
    label: "Identity",
    title: "Identity Chamber",
    subtitle: "Holographic profile",
    brief:
      "A glass chamber holding the person behind the work. Approach the monolith to open the full identity record.",
    instruction: "Hover the chamber · select a facet to expand",
    accent: "#67e8f9",
    accentRgb: "103,232,249",
  },
  {
    id: "education",
    index: "02",
    key: "2",
    label: "Education",
    title: "Timeline City",
    subtitle: "Five stages, one skyline",
    brief:
      "Every tower is a stage of formal education. Height marks depth of study, not importance. Select a building to read its record.",
    instruction: "Select a tower · scroll the briefing to review",
    accent: "#fbbf77",
    accentRgb: "251,191,119",
  },
  {
    id: "projects",
    index: "03",
    key: "3",
    label: "Projects",
    title: "Exhibition Hall",
    subtitle: "Selected works",
    brief:
      "Five projects suspended in a quiet hall. Each panel carries the problem, the build, the measured result, and what went wrong.",
    instruction: "Select a panel to open the project dossier",
    accent: "#5eead4",
    accentRgb: "94,234,212",
  },
  {
    id: "research",
    index: "04",
    key: "4",
    label: "Research",
    title: "Research Laboratory",
    subtitle: "Papers on the observation deck",
    brief:
      "Thesis, publications, and lab work. Open a document to enter presentation mode: abstract, method, and findings on one surface.",
    instruction: "Select a document · presentation mode",
    accent: "#93c5fd",
    accentRgb: "147,197,253",
  },
  {
    id: "skills",
    index: "05",
    key: "5",
    label: "Skills",
    title: "Skills Galaxy",
    subtitle: "Eight planets, one core",
    brief:
      "Competencies orbit the knowledge core at different radii. Select a planet to see proficiency, evidence, and the projects where it was tested.",
    instruction: "Select a planet · inspect the evidence",
    accent: "#c4b5fd",
    accentRgb: "196,181,253",
  },
  {
    id: "achievements",
    index: "06",
    key: "6",
    label: "Achievements",
    title: "Hall of Achievements",
    subtitle: "Seven objects under light",
    brief:
      "A museum with one instruction: look closely. Each trophy corresponds to a scholarship, competition, or recognition.",
    instruction: "Select a trophy · read the plaque",
    accent: "#f5c97b",
    accentRgb: "245,201,123",
  },
  {
    id: "leadership",
    index: "07",
    key: "7",
    label: "Leadership",
    title: "Command Room",
    subtitle: "Four active mandates",
    brief:
      "Leadership as operations, not titles. Each console holds a role, its scope, and the measurable outcome it produced.",
    instruction: "Select a console · open the mission log",
    accent: "#fb923c",
    accentRgb: "251,146,60",
  },
  {
    id: "innovation",
    index: "08",
    key: "8",
    label: "Innovation",
    title: "Innovation Cores",
    subtitle: "Ideas before products",
    brief:
      "Three energy cores run at different stages of development. Approach one to expand its concept and current progress.",
    instruction: "Select a core · inspect the concept",
    accent: "#a3e635",
    accentRgb: "163,230,53",
  },
  {
    id: "future",
    index: "09",
    key: "9",
    label: "Future",
    title: "Future Vision District",
    subtitle: "A city under construction",
    brief:
      "Four ambitions standing as towers. Each has a date, a milestone path, and a reason it matters.",
    instruction: "Select a tower · read the projected path",
    accent: "#f0abfc",
    accentRgb: "240,171,252",
  },
  {
    id: "contact",
    index: "10",
    key: "0",
    label: "Contact",
    title: "Contact Portal",
    subtitle: "Open a channel",
    brief:
      "The final terminal. Direct channels for research conversations, collaboration, and hiring — plus the full CV.",
    instruction: "Transmit · or browse the terminal record",
    accent: "#a5f3fc",
    accentRgb: "165,243,252",
  },
];

export const ZONE_MAP: Record<ZoneId, ZoneMeta> = Object.fromEntries(
  ZONES.map((z) => [z.id, z]),
) as Record<ZoneId, ZoneMeta>;

export const ZONE_ORDER: ZoneId[] = ZONES.map((z) => z.id);
