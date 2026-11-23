"use client";

import Link from "next/link";
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

export default function CvPage() {
  return (
    <div className="cv-shell">
      <main className="cv">
        <div className="cv-topbar no-print">
          <Link href="/">← Return to the dimension</Link>
          <button className="cv-print" onClick={() => window.print()}>
            Print / save as PDF
          </button>
        </div>

        <header className="cv-head">
          <div className="cv-kicker">Curriculum vitae · {profile.location} · 2026</div>
          <h1>{profile.name}</h1>
          <p className="cv-sub">{profile.title}</p>
          <div className="cv-contact">
            <a href={`mailto:${profile.contact.email}`}>{profile.contact.email}</a>
            <a href={profile.contact.linkedin} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
            <a href={profile.contact.github} target="_blank" rel="noreferrer">
              GitHub
            </a>
            <span>{profile.status}</span>
          </div>
          <div className="cv-metrics">
            {profile.metrics.map((m) => (
              <div className="cv-metric" key={m.label}>
                <b>
                  {m.value}
                  <i>{m.suffix}</i>
                </b>
                <span>{m.label}</span>
              </div>
            ))}
          </div>
        </header>

        <section className="cv-section">
          <div className="cv-section-head">
            <h2>Profile</h2>
            <span>01</span>
          </div>
          <p>{profile.bio}</p>
          <p className="cv-statement">“{profile.statement}”</p>
          <p>
            <strong>Academic interests.</strong> {profile.interests.join(" · ")}.
          </p>
          <p>
            <strong>Languages.</strong> {profile.languages.join(" · ")}.
          </p>
        </section>

        <section className="cv-section">
          <div className="cv-section-head">
            <h2>Education</h2>
            <span>02</span>
          </div>
          {education.map((e) => (
            <article className="cv-entry" key={e.id}>
              <div className="cv-entry-head">
                <h3>{e.institution}</h3>
                <span className="cv-meta">{e.years}</span>
              </div>
              <div className="cv-entry-sub">
                <span>{e.credential}</span>
                <span>{e.grade}</span>
              </div>
              <p>{e.summary}</p>
              <ul>
                {e.highlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            </article>
          ))}
        </section>

        <section className="cv-section">
          <div className="cv-section-head">
            <h2>Research</h2>
            <span>03</span>
          </div>
          {research.map((r) => (
            <article className="cv-entry" key={r.id}>
              <div className="cv-entry-head">
                <h3>{r.title}</h3>
                <span className="cv-meta">{r.year}</span>
              </div>
              <div className="cv-entry-sub">
                <span>{r.type}</span>
                <span>{r.status}</span>
              </div>
              <p>{r.abstract}</p>
              <ul>
                {r.findings.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              <p className="cv-cite">{r.citation}</p>
            </article>
          ))}
        </section>

        <section className="cv-section" id="portfolio">
          <div className="cv-section-head">
            <h2>Selected projects</h2>
            <span>04</span>
          </div>
          {projects.map((p) => (
            <article className="cv-entry" key={p.id}>
              <div className="cv-entry-head">
                <h3>{p.title}</h3>
                <span className="cv-meta">
                  {p.index} · {p.year}
                </span>
              </div>
              <div className="cv-entry-sub">
                <span>{p.tagline}</span>
                <span>{p.role}</span>
              </div>
              <p>{p.description}</p>
              <ul>
                {p.results.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
              <div className="cv-tags">
                {p.tech.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
            </article>
          ))}
        </section>

        <section className="cv-section">
          <div className="cv-section-head">
            <h2>Skills</h2>
            <span>05</span>
          </div>
          <div className="cv-skills">
            {skills.map((s) => (
              <div className="cv-skill" key={s.id}>
                <div className="cv-skill-top">
                  <strong>{s.name}</strong>
                  <span>{s.level}%</span>
                </div>
                <div className="cv-skill-bar">
                  <i style={{ width: `${s.level}%` }} />
                </div>
                <div className="cv-skill-meta">
                  {s.kind} · {s.years} · {s.stack.join(", ")}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="cv-section">
          <div className="cv-section-head">
            <h2>Achievements</h2>
            <span>06</span>
          </div>
          {achievements.map((a) => (
            <article className="cv-entry cv-entry-compact" key={a.id}>
              <div className="cv-entry-head">
                <h3>{a.title}</h3>
                <span className="cv-meta">{a.year}</span>
              </div>
              <div className="cv-entry-sub">
                <span>{a.issuer}</span>
                <span>{a.proof}</span>
              </div>
              <p>{a.detail}</p>
            </article>
          ))}
        </section>

        <section className="cv-section">
          <div className="cv-section-head">
            <h2>Leadership</h2>
            <span>07</span>
          </div>
          {leadership.map((l) => (
            <article className="cv-entry cv-entry-compact" key={l.id}>
              <div className="cv-entry-head">
                <h3>
                  {l.role} · {l.org}
                </h3>
                <span className="cv-meta">{l.period}</span>
              </div>
              <div className="cv-entry-sub">
                <span>{l.scope}</span>
              </div>
              <p>{l.mandate}</p>
              <ul>
                {l.impact.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            </article>
          ))}
        </section>

        <section className="cv-section">
          <div className="cv-section-head">
            <h2>Innovation & direction</h2>
            <span>08</span>
          </div>
          {innovation.map((x) => (
            <article className="cv-entry cv-entry-compact" key={x.id}>
              <div className="cv-entry-head">
                <h3>{x.title}</h3>
                <span className="cv-meta">
                  {x.state} · {x.progress}%
                </span>
              </div>
              <p>{x.concept}</p>
            </article>
          ))}
          {future.map((f) => (
            <article className="cv-entry cv-entry-compact" key={f.id}>
              <div className="cv-entry-head">
                <h3>
                  {f.title} — {f.subtitle}
                </h3>
                <span className="cv-meta">{f.horizon}</span>
              </div>
              <p>{f.detail}</p>
            </article>
          ))}
        </section>

        <footer className="cv-foot">
          <span>
            Portfolio record · The Academic Dimension · {profile.location} · 2026
          </span>
          <span className="no-print">
            <a href={`mailto:${profile.contact.email}`}>Write</a> ·{" "}
            <Link href="/">Experience</Link>
          </span>
        </footer>
      </main>
    </div>
  );
}
