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
  return <Experience />;
}
