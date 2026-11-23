"use client";

import { motion } from "framer-motion";
import { useExperience } from "@/lib/store";

export function Transition() {
  const id = useExperience((s) => s.transitionId);
  const stage = useExperience((s) => s.stage);

  if (stage === "intro") return null;

  return (
    <motion.div
      key={id}
      className="veil"
      initial={{ opacity: 0.85 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 1.15, ease: "easeOut" }}
      style={{
        background:
          "radial-gradient(ellipse at 50% 60%, rgba(103,232,249,0.2), transparent 45%), linear-gradient(180deg, rgba(103,232,249,0.1), transparent 30%)",
      }}
    />
  );
}
