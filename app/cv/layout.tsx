import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Arden Vale Portfolio — Curriculum Vitae" },
  description:
    "Arden Vale portfolio CV: education, research, projects, skills, achievements, leadership, and future direction.",
  alternates: { canonical: "/cv/" },
  openGraph: {
    title: "Arden Vale Portfolio — Curriculum Vitae",
    description:
      "Arden Vale portfolio CV: education, research, projects, skills, achievements, leadership, and future direction.",
    type: "profile",
    url: "/cv/",
  },
};

export default function CvLayout({ children }: { children: React.ReactNode }) {
  return children;
}
