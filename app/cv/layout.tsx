import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Curriculum Vitae — Arden Vale",
  description:
    "Full academic record: education, research, projects, skills, achievements, leadership, and direction.",
};

export default function CvLayout({ children }: { children: React.ReactNode }) {
  return children;
}
