"use client";

import { useExperience } from "@/lib/store";
import { Intro } from "./scenes/Intro";
import { Hub } from "./scenes/Hub";
import { About } from "./scenes/About";
import { Education } from "./scenes/Education";
import { Projects } from "./scenes/Projects";
import { Research } from "./scenes/Research";
import { Skills } from "./scenes/Skills";
import { Achievements } from "./scenes/Achievements";
import { Leadership } from "./scenes/Leadership";
import { Innovation } from "./scenes/Innovation";
import { Future } from "./scenes/Future";
import { Contact } from "./scenes/Contact";

export function SceneRouter() {
  const stage = useExperience((s) => s.stage);
  switch (stage) {
    case "intro":
      return <Intro />;
    case "hub":
      return <Hub />;
    case "about":
      return <About />;
    case "education":
      return <Education />;
    case "projects":
      return <Projects />;
    case "research":
      return <Research />;
    case "skills":
      return <Skills />;
    case "achievements":
      return <Achievements />;
    case "leadership":
      return <Leadership />;
    case "innovation":
      return <Innovation />;
    case "future":
      return <Future />;
    case "contact":
      return <Contact />;
    default:
      return null;
  }
}
