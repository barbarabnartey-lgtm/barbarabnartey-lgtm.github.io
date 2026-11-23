"use client";

import Link from "next/link";
import { useState } from "react";
import type { ZoneId } from "@/data/profile";
import {
  achievements,
  education,
  future,
  innovation,
  leadership,
  profile,
  projects,
  research,
  skills,
} from "@/data/profile";
import { useExperience } from "@/lib/store";
import { audio } from "@/lib/audio";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="section-block">
      <h4>{title}</h4>
      {children}
    </div>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="bullet-list">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

function Meta({ items }: { items: [string, string][] }) {
  return (
    <dl className="meta-grid">
      {items.map(([k, v]) => (
        <div className="meta-cell" key={k}>
          <dt>{k}</dt>
          <dd>{v}</dd>
        </div>
      ))}
    </dl>
  );
}

function Tags({ items }: { items: string[] }) {
  return (
    <div className="tag-row">
      {items.map((t) => (
        <span className="tag" key={t}>
          {t}
        </span>
      ))}
    </div>
  );
}

function Meter({ value }: { value: number }) {
  return (
    <div className="meter" aria-label={`Proficiency ${value} percent`}>
      <i style={{ width: `${value}%` }} />
    </div>
  );
}

const INTEREST_NOTES: Record<string, string> = {
  "Adaptive learning interfaces":
    "Systems that infer effort and confusion from behaviour, then change the pace without taking control away from the learner.",
  "Neural decoding & BCI":
    "Turning noisy biological signals into intent — with explicit uncertainty states instead of confident guesses.",
  "Explainable machine learning":
    "Visual grammars that help non-experts reason about model behaviour, including where the model is likely wrong.",
  "Calm technology":
    "Interfaces that hold information at the periphery and earn the right to interrupt.",
  "Scientific visualisation":
    "Data installations that make a finding legible as an experience, not just a chart.",
};

export function Dossier({ zone, id }: { zone: ZoneId; id: string }) {
  const goToItem = useExperience((s) => s.goToItem);
  const [copied, setCopied] = useState(false);

  const related = (ids: string[]) =>
    ids
      .map((rid) => {
        const p = projects.find((x) => x.id === rid);
        if (p) return { zone: "projects" as ZoneId, id: rid, label: p.title };
        const r = research.find((x) => x.id === rid);
        if (r) return { zone: "research" as ZoneId, id: rid, label: r.index };
        return null;
      })
      .filter(Boolean) as { zone: ZoneId; id: string; label: string }[];

  const LinkRefs = ({ ids }: { ids: string[] }) => {
    const refs = related(ids);
    return (
      <div className="btn-row">
        {refs.map((r) => (
          <button
            key={r.id}
            className="btn"
            onClick={() => {
              audio.play("open");
              goToItem(r.zone, r.id);
            }}
          >
            {r.label} ↗
          </button>
        ))}
      </div>
    );
  };

  if (zone === "about") {
    if (id === "interests") {
      return (
        <>
          <div className="eyebrow">Facet 02 / Academic interests</div>
          <h3 className="dossier-title">Where the questions live</h3>
          <p className="dossier-body">
            Five threads run through the work. They are not separate topics so much as
            different distances from the same question: how can a machine understand a
            person without pretending to be one?
          </p>
          <div className="section-block">
            <h4>Active threads</h4>
            <ul className="bullet-list">
              {profile.interests.map((interest, i) => (
                <li key={interest}>
                  <strong style={{ color: "#e9eef7", fontWeight: 500 }}>
                    {String(i + 1).padStart(2, "0")} — {interest}
                  </strong>
                  <div style={{ color: "#8b98ad", marginTop: 3 }}>{INTEREST_NOTES[interest]}</div>
                </li>
              ))}
            </ul>
          </div>
        </>
      );
    }
    if (id === "statement") {
      return (
        <>
          <div className="eyebrow">Facet 03 / Personal statement</div>
          <h3 className="dossier-title">A principle, not a slogan</h3>
          <p className="quote" style={{ marginTop: 18 }}>
            “{profile.statement}”
          </p>
          <Section title="What this looks like in practice">
            <Bullets
              items={[
                "Measure before intervening — every adaptive decision needs evidence and a visible fallback.",
                "Show uncertainty. A system that admits doubt is easier to trust than one that performs certainty.",
                "Leave the tools behind: open datasets, documented pipelines, and interfaces other researchers can reuse.",
              ]}
            />
          </Section>
          <Section title="Language">
            <Tags items={profile.languages} />
          </Section>
        </>
      );
    }
    if (id === "goals") {
      return (
        <>
          <div className="eyebrow">Facet 04 / Professional goals</div>
          <h3 className="dossier-title">The next decade</h3>
          <p className="dossier-body">{profile.goals}</p>
          <Section title="Immediate horizon">
            <Bullets
              items={[
                "Complete the honours thesis and publish the follow-up study.",
                "Run the LUMEN classroom pilot with 40 students.",
                "Secure a funded master's place in computational neuroscience for 2027.",
              ]}
            />
          </Section>
          <div className="btn-row">
            <button
              className="btn btn-primary"
              onClick={() => {
                audio.play("select");
                goToItem("future", "masters");
              }}
            >
              Open future district ↗
            </button>
          </div>
        </>
      );
    }
    return (
      <>
        <div className="eyebrow">Identity record / Active profile</div>
        <h3 className="dossier-title">{profile.name}</h3>
        <p className="dossier-tagline">{profile.title}</p>
        <Meta
          items={[
            ["Based in", profile.location],
            ["Status", profile.status],
            ["Languages", profile.languages.join(" · ")],
            ["Record", "Academic Dimension / 2026"],
          ]}
        />
        <p className="dossier-body">{profile.bio}</p>
        <Section title="Personal statement">
          <p className="quote">“{profile.statement}”</p>
        </Section>
        <Section title="Academic interests">
          <Tags items={profile.interests} />
        </Section>
        <Section title="Professional goals">
          <p className="dossier-body" style={{ marginTop: 0 }}>{profile.goals}</p>
        </Section>
        <div className="btn-row">
          <a className="btn btn-primary" href={`mailto:${profile.contact.email}`}>
            Contact Arden
          </a>
          <Link className="btn" href="/cv/" target="_blank" rel="noreferrer">
            Open CV
          </Link>
        </div>
      </>
    );
  }

  if (zone === "education") {
    const item = education.find((x) => x.id === id);
    if (!item) return null;
    return (
      <>
        <div className="eyebrow">{item.stage} / {item.years}</div>
        <h3 className="dossier-title">{item.institution}</h3>
        <p className="dossier-tagline">{item.credential}</p>
        <Meta
          items={[
            ["Stage", item.stage],
            ["Period", item.years],
            ["Result", item.grade],
            ["Record type", "Formal education"],
          ]}
        />
        <p className="dossier-body">{item.summary}</p>
        <Section title="Milestones">
          <Bullets items={item.highlights} />
        </Section>
      </>
    );
  }

  if (zone === "projects") {
    const item = projects.find((x) => x.id === id);
    if (!item) return null;
    return (
      <>
        <div className="eyebrow">{item.index} / {item.category} / {item.year}</div>
        <h3 className="dossier-title">{item.title}</h3>
        <p className="dossier-tagline">{item.tagline}</p>
        <Meta
          items={[
            ["Role", item.role],
            ["Year", item.year],
            ["Category", item.category],
            ["Record", item.index],
          ]}
        />
        <p className="dossier-body">{item.description}</p>
        <Section title="Measured results">
          <Bullets items={item.results} />
        </Section>
        <Section title="Stack">
          <Tags items={item.tech} />
        </Section>
        <Section title="Lesson learned">
          <p className="dossier-body" style={{ marginTop: 0 }}>{item.lessons}</p>
        </Section>
      </>
    );
  }

  if (zone === "research") {
    const item = research.find((x) => x.id === id);
    if (!item) return null;
    return (
      <>
        <div className="eyebrow">Presentation mode / {item.index}</div>
        <h3 className="dossier-title" style={{ fontSize: 25 }}>{item.title}</h3>
        <p className="dossier-tagline">{item.type} · {item.year}</p>
        <Meta
          items={[
            ["Venue", item.venue],
            ["Status", item.status],
            ["Type", item.type],
            ["Year", item.year],
          ]}
        />
        <Section title="Abstract">
          <p className="dossier-body" style={{ marginTop: 0 }}>{item.abstract}</p>
        </Section>
        <Section title="Method">
          <p className="dossier-body" style={{ marginTop: 0 }}>{item.method}</p>
        </Section>
        <Section title="Findings">
          <Bullets items={item.findings} />
        </Section>
        <Section title="Citation">
          <p className="dossier-body" style={{ marginTop: 0, fontSize: 11.5 }}>{item.citation}</p>
          <button
            className="btn"
            style={{ marginTop: 10 }}
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(item.citation);
                setCopied(true);
                audio.play("chime");
                window.setTimeout(() => setCopied(false), 1800);
              } catch {
                setCopied(false);
              }
            }}
          >
            {copied ? "Citation copied" : "Copy citation"}
          </button>
        </Section>
      </>
    );
  }

  if (zone === "skills") {
    const item = skills.find((x) => x.id === id);
    if (!item) return null;
    return (
      <>
        <div className="eyebrow">{item.kind} competency / {String(item.level).padStart(2, "0")}%</div>
        <h3 className="dossier-title">{item.name}</h3>
        <div style={{ marginTop: 14 }}>
          <Meter value={item.level} />
          <div className="eyebrow" style={{ marginTop: 8, display: "flex", justifyContent: "space-between" }}>
            <span>{item.years} of practice</span>
            <span>Proficiency {item.level}%</span>
          </div>
        </div>
        <Meta
          items={[
            ["Domain", item.kind],
            ["Experience", item.years],
            ["Level", `${item.level} / 100`],
            ["Evidence", `${item.evidence.length} records`],
          ]}
        />
        <p className="dossier-body">{item.summary}</p>
        <Section title="Toolkit">
          <Tags items={item.stack} />
        </Section>
        {item.certifications.length > 0 && (
          <Section title="Certifications">
            <Bullets items={item.certifications} />
          </Section>
        )}
        <Section title="Applied evidence">
          <Bullets items={item.evidence} />
        </Section>
        {item.related.length > 0 && (
          <Section title="Where it was tested">
            <LinkRefs ids={item.related} />
          </Section>
        )}
      </>
    );
  }

  if (zone === "achievements") {
    const item = achievements.find((x) => x.id === id);
    if (!item) return null;
    return (
      <>
        <div className="eyebrow">{item.index} / {item.category} / {item.year}</div>
        <h3 className="dossier-title">{item.title}</h3>
        <p className="dossier-tagline">{item.issuer}</p>
        <Meta
          items={[
            ["Category", item.category],
            ["Year", item.year],
            ["Issued by", item.issuer],
            ["Distinction", item.proof],
          ]}
        />
        <p className="dossier-body">{item.detail}</p>
        <Section title="Plaque record">
          <Bullets items={[item.proof, `Filed under ${item.category.toLowerCase()}`, `Awarded ${item.year}`]} />
        </Section>
      </>
    );
  }

  if (zone === "leadership") {
    const item = leadership.find((x) => x.id === id);
    if (!item) return null;
    return (
      <>
        <div className="eyebrow">Mission console / {item.period}</div>
        <h3 className="dossier-title">{item.role}</h3>
        <p className="dossier-tagline">{item.org}</p>
        <Meta
          items={[
            ["Organisation", item.org],
            ["Period", item.period],
            ["Scope", item.scope],
            ["Mandate", "Active"],
          ]}
        />
        <p className="dossier-body">{item.mandate}</p>
        <Section title="Measured impact">
          <Bullets items={item.impact} />
        </Section>
      </>
    );
  }

  if (zone === "innovation") {
    const item = innovation.find((x) => x.id === id);
    if (!item) return null;
    return (
      <>
        <div className="eyebrow">{item.index} / {item.state} / {item.year}</div>
        <h3 className="dossier-title">{item.title}</h3>
        <p className="dossier-tagline">{item.tagline}</p>
        <div style={{ marginTop: 16 }}>
          <Meter value={item.progress} />
          <div className="eyebrow" style={{ marginTop: 8, display: "flex", justifyContent: "space-between" }}>
            <span>Development</span>
            <span>{item.progress}%</span>
          </div>
        </div>
        <Meta
          items={[
            ["Stage", item.state],
            ["Started", item.year],
            ["Progress", `${item.progress}%`],
            ["Next", item.next],
          ]}
        />
        <p className="dossier-body">{item.concept}</p>
        <Section title="Assets">
          <Tags items={item.assets} />
        </Section>
        <Section title="Next milestone">
          <p className="dossier-body" style={{ marginTop: 0 }}>{item.next}</p>
        </Section>
      </>
    );
  }

  if (zone === "future") {
    const item = future.find((x) => x.id === id);
    if (!item) return null;
    return (
      <>
        <div className="eyebrow">{item.index} / Horizon {item.horizon}</div>
        <h3 className="dossier-title">{item.title}</h3>
        <p className="dossier-tagline">{item.subtitle}</p>
        <Meta
          items={[
            ["Horizon", item.horizon],
            ["Track", item.subtitle],
            ["Status", "Projected"],
            ["Record", item.index],
          ]}
        />
        <p className="dossier-body">{item.detail}</p>
        <Section title="Milestone path">
          <Bullets items={item.milestones} />
        </Section>
      </>
    );
  }

  return null;
}
