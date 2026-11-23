"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useExperience } from "@/lib/store";
import { audio } from "@/lib/audio";
import { askGuide, guideIndexCount, type GuideRef } from "@/lib/guide";
import { guidePrompts, profile } from "@/data/profile";

type Message = {
  id: number;
  role: "user" | "guide";
  text: string;
  refs?: GuideRef[];
};

let nextId = 3;

export function Guide() {
  const open = useExperience((s) => s.guideOpen);
  const stage = useExperience((s) => s.stage);
  const setGuide = useExperience((s) => s.setGuide);
  const seed = useExperience((s) => s.guideSeed);
  const go = useExperience((s) => s.go);
  const goToItem = useExperience((s) => s.goToItem);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "guide",
      text: `I'm AURA, the resident guide. I hold ${guideIndexCount} indexed records across ten zones — research, projects, achievements, and everything between. Ask, or choose a prompt below.`,
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const lastSeed = useRef<string | null>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const timer = useRef<number | null>(null);

  const send = (question: string) => {
    const q = question.trim();
    if (!q || typing) return;
    audio.play("select");
    setMessages((m) => [...m, { id: nextId++, role: "user", text: q }]);
    setInput("");
    setTyping(true);
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      const answer = askGuide(q);
      setMessages((m) => [...m, { id: nextId++, role: "guide", text: answer.text, refs: answer.refs }]);
      setTyping(false);
      audio.play("hover");
    }, 700);
  };

  useEffect(() => {
    if (open && seed && seed !== lastSeed.current) {
      lastSeed.current = seed;
      send(seed);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, seed]);

  useEffect(() => {
    if (open) {
      const t = window.setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 350);
      return () => window.clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    const el = bodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, typing]);

  useEffect(() => () => {
    if (timer.current) window.clearTimeout(timer.current);
  }, []);

  const followRef = (ref: GuideRef) => {
    audio.play("open");
    setGuide(false);
    if (ref.id) goToItem(ref.zone, ref.id);
    else go(ref.zone);
  };

  const userCount = messages.filter((m) => m.role === "user").length;

  return (
    <>
      <AnimatePresence>
        {!open && stage === "hub" && (
          <motion.button
            className="guide-dock"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            onClick={() => {
              setGuide(true);
              audio.play("select");
            }}
            aria-label="Open AURA, the virtual guide"
          >
            <span className="guide-dock-label">
              <b>Ask Aura</b>
              <span>Holographic guide</span>
            </span>
            <span className="guide-orb" aria-hidden>
              <span className="guide-orb-core" />
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && stage !== "intro" && (
          <motion.section
            className="panel guide-panel"
            initial={{ opacity: 0, y: 22, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            aria-label="AURA holographic guide"
          >
            <span className="frame-corner tl" />
            <span className="frame-corner tr" />
            <span className="frame-corner bl" />
            <span className="frame-corner br" />
            <div className="guide-head">
              <span className="guide-avatar" aria-hidden>
                <i />
              </span>
              <div className="guide-name">
                <b>AURA</b>
                <span>Knowledge guide · {guideIndexCount} records</span>
              </div>
              <button className="guide-close" onClick={() => setGuide(false)} aria-label="Close guide">
                ESC
              </button>
            </div>
            <div className="guide-body" ref={bodyRef} aria-live="polite">
              {messages.map((m) => (
                <div key={m.id} className={`msg ${m.role}`}>
                  {m.role === "guide" && (
                    <div className="msg-tag">
                      <span className="status-dot" style={{ width: 4, height: 4 }} /> Aura
                    </div>
                  )}
                  {m.text}
                  {m.refs && m.refs.length > 0 && (
                    <div className="msg-refs">
                      {m.refs.map((r, i) => (
                        <button key={i} className="msg-ref" onClick={() => followRef(r)}>
                          {r.label} ↗
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {typing && (
                <div className="msg guide">
                  <div className="typing" aria-label="Aura is thinking">
                    <i />
                    <i />
                    <i />
                  </div>
                </div>
              )}
            </div>
            {userCount < 2 && (
              <div className="guide-suggestions">
                {guidePrompts.map((p) => (
                  <button key={p} className="guide-suggestion" onClick={() => send(p)}>
                    {p}
                  </button>
                ))}
              </div>
            )}
            <form
              className="guide-input"
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={`Ask about ${profile.name.split(" ")[0]}'s record…`}
                aria-label="Ask the guide a question"
                maxLength={160}
              />
              <button className="guide-send" type="submit" aria-label="Send question">
                <svg width="14" height="12" viewBox="0 0 14 12" fill="none" aria-hidden>
                  <path d="M1 6h11M7.5 1.5 12 6l-4.5 4.5" stroke="currentColor" strokeWidth="1.1" />
                </svg>
              </button>
            </form>
          </motion.section>
        )}
      </AnimatePresence>
    </>
  );
}
