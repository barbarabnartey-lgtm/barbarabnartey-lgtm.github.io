"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
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
import { ZONE_MAP } from "@/lib/zones";
import { Dossier } from "./Dossier";

type ListItem = { id: string; index: string; title: string; meta: string };

const ABOUT_ITEMS: ListItem[] = [
  { id: "profile", index: "01", title: "Identity record", meta: "Profile" },
  { id: "interests", index: "02", title: "Academic interests", meta: "05 threads" },
  { id: "statement", index: "03", title: "Personal statement", meta: "Principle" },
  { id: "goals", index: "04", title: "Professional goals", meta: "Next decade" },
];

function zoneItems(zone: ZoneId): ListItem[] {
  switch (zone) {
    case "about":
      return ABOUT_ITEMS;
    case "education":
      return education.map((e) => ({
        id: e.id,
        index: e.stage.slice(0, 3).toUpperCase(),
        title: e.institution,
        meta: e.years,
      }));
    case "projects":
      return projects.map((p) => ({
        id: p.id,
        index: p.index,
        title: p.title,
        meta: p.category,
      }));
    case "research":
      return research.map((r) => ({
        id: r.id,
        index: r.index,
        title: r.title,
        meta: r.status,
      }));
    case "skills":
      return skills.map((s) => ({
        id: s.id,
        index: String(s.level).padStart(2, "0"),
        title: s.name,
        meta: `${s.kind} · ${s.years}`,
      }));
    case "achievements":
      return achievements.map((a) => ({
        id: a.id,
        index: a.index,
        title: a.title,
        meta: a.year,
      }));
    case "leadership":
      return leadership.map((l, i) => ({
        id: l.id,
        index: String(i + 1).padStart(2, "0"),
        title: l.role,
        meta: l.org,
      }));
    case "innovation":
      return innovation.map((x) => ({
        id: x.id,
        index: x.index,
        title: x.title,
        meta: `${x.state} · ${x.progress}%`,
      }));
    case "future":
      return future.map((f) => ({
        id: f.id,
        index: f.index,
        title: f.title,
        meta: `Horizon ${f.horizon}`,
      }));
    default:
      return [];
  }
}

function ContactPanel() {
  const go = useExperience((s) => s.go);
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.contact.email);
      setCopied(true);
      audio.play("chime");
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="contact-panel">
      <div className="eyebrow">Channel directory / 10</div>
      <h2 className="zone-title" style={{ fontSize: 30 }}>
        Open a channel
      </h2>
      <div className="contact-status">
        <span className="status-dot" aria-hidden="true" />
        <span>{profile.status}</span>
      </div>

      <div className="channel-list">
        <a className="channel" href={`mailto:${profile.contact.email}`} onClick={() => audio.play("open")}>
          <span className="channel-idx">01</span>
          <span>
            <span className="channel-name">Email</span>
            <span className="channel-value">{profile.contact.email}</span>
          </span>
          <span className="channel-arrow">↗</span>
        </a>
        <a
          className="channel"
          href={profile.contact.linkedin}
          target="_blank"
          rel="noreferrer"
          onClick={() => audio.play("open")}
        >
          <span className="channel-idx">02</span>
          <span>
            <span className="channel-name">LinkedIn</span>
            <span className="channel-value">Professional record & messages</span>
          </span>
          <span className="channel-arrow">↗</span>
        </a>
        <a
          className="channel"
          href={profile.contact.github}
          target="_blank"
          rel="noreferrer"
          onClick={() => audio.play("open")}
        >
          <span className="channel-idx">03</span>
          <span>
            <span className="channel-name">GitHub</span>
            <span className="channel-value">Code, pipelines, open datasets</span>
          </span>
          <span className="channel-arrow">↗</span>
        </a>
        <a
          className="channel"
          href={profile.contact.cv}
          target="_blank"
          rel="noreferrer"
          onClick={() => audio.play("open")}
        >
          <span className="channel-idx">04</span>
          <span>
            <span className="channel-name">Curriculum vitae</span>
            <span className="channel-value">Full record · print-ready</span>
          </span>
          <span className="channel-arrow">↗</span>
        </a>
        <button className="channel" onClick={copyEmail} type="button">
          <span className="channel-idx">05</span>
          <span>
            <span className="channel-name">{copied ? "Copied to clipboard" : "Copy address"}</span>
            <span className="channel-value">No mail client? Take the address.</span>
          </span>
          <span className="channel-arrow">{copied ? "✓" : "⧉"}</span>
        </button>
      </div>

      <p className="dossier-body" style={{ marginTop: 20 }}>
        Best reached for research collaborations, doctoral supervision conversations, and
        humane-technology projects. Replies usually land within two working days.
      </p>

      <div className="btn-row">
        <a className="btn btn-primary" href={`mailto:${profile.contact.email}?subject=Research%20conversation`}>
          Compose message
        </a>
        <button
          className="btn"
          onClick={() => {
            audio.play("back");
            go("about");
          }}
        >
          Read the profile
        </button>
      </div>
    </div>
  );
}

export function ZoneChrome() {
  const stage = useExperience((s) => s.stage);
  const selection = useExperience((s) => s.selection);
  const select = useExperience((s) => s.select);
  const clearSelection = useExperience((s) => s.clearSelection);
  const hub = useExperience((s) => s.hub);

  const isZone = stage !== "intro" && stage !== "hub";
  const zone = isZone ? ZONE_MAP[stage as ZoneId] : null;
  const items = isZone && stage !== "contact" ? zoneItems(stage as ZoneId) : [];
  const selected = selection && selection.zone === stage ? selection.id : null;
  const active = selected ? items.find((i) => i.id === selected) : null;

  return (
    <AnimatePresence mode="wait">
      {isZone && zone && (
        <motion.aside
          key={stage}
          className={`zone-panel panel ${selected ? "wide" : ""}`}
          style={{
            ["--accent" as string]: zone.accent,
            ["--accent-rgb" as string]: zone.accentRgb,
          }}
          aria-label={`${zone.title} briefing`}
          initial={{ opacity: 0, x: 26 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 16 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="frame-corner tl" />
          <span className="frame-corner tr" />
          <span className="frame-corner bl" />
          <span className="frame-corner br" />

          <div className="dossier-top">
            <div className="eyebrow">
              Zone {zone.index} / {zone.label}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {selected && stage !== "contact" && (
                <button
                  className="zone-back"
                  onClick={() => {
                    audio.play("back");
                    clearSelection();
                  }}
                >
                  ← Index
                </button>
              )}
              <button
                className="zone-close"
                aria-label="Close zone and return to hub"
                onClick={() => {
                  audio.play("back");
                  hub();
                }}
              >
                ×
              </button>
            </div>
          </div>

          {stage === "contact" ? (
            <div className="dossier-scroll">
              <ContactPanel />
            </div>
          ) : selected && active ? (
            <div className="dossier-scroll" key={selected}>
              <Dossier zone={stage as ZoneId} id={selected} />
            </div>
          ) : (
            <>
              <h2 className="zone-title">{zone.title}</h2>
              <div className="zone-subtitle">{zone.subtitle}</div>
              <p className="zone-brief">{zone.brief}</p>

              <div className="zone-list">
                {items.map((item) => (
                  <button
                    key={item.id}
                    className="zone-list-item"
                    data-selected={selected === item.id}
                    onClick={() => {
                      audio.play("open");
                      select(item.id);
                    }}
                  >
                    <span className="list-index">{item.index}</span>
                    <span className="list-title">{item.title}</span>
                    <span className="list-meta">{item.meta}</span>
                  </button>
                ))}
                {items.length === 0 && (
                  <p className="dossier-body">
                    Nothing listed in this zone yet. Return to the hub and choose another
                    wing of the dimension.
                  </p>
                )}
              </div>

              <div className="zone-panel-foot">
                <span>{zone.instruction}</span>
                <span>ESC / HUB</span>
              </div>
            </>
          )}
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
