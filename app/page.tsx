"use client";

import dynamic from "next/dynamic";

const Experience = dynamic(() => import("@/components/Experience"), {
  ssr: false,
  loading: () => (
    <div className="loader">
      <div className="loader-inner">
        <div className="loader-glyph" />
        <div className="loader-text">Initialising the dimension</div>
        <div className="loader-bar">
          <i />
        </div>
      </div>
    </div>
  ),
});

export default function Page() {
  return (
    <>
      <h1 className="sr-only">Arden Vale Portfolio</h1>
      <p className="sr-only">
        Arden Vale is a computational neuroscientist and human–AI interaction
        designer. Explore research, projects, skills, achievements, leadership,
        and a full curriculum vitae.
      </p>
      <Experience />
    </>
  );
}
