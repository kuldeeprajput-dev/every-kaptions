"use client";

import { useState } from "react";
import { SiteFooter } from "@/shared/components/site-footer";
import { SiteHeader } from "@/shared/components/site-header";
import { roadmapItems } from "../data/roadmap-data";
import { RoadmapItemCard } from "./roadmap-item-card";

export function RoadmapPage() {
  const [votes, setVotes] = useState<Record<string, "yes" | "no">>({});
  const [idea, setIdea] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const shippedItems = roadmapItems.filter((item) => item.status === "shipped");
  const plannedItems = roadmapItems.filter((item) => item.status === "next");

  return (
    <div className="min-h-screen flex flex-col bg-canvas text-body">
      <SiteHeader />

      <main className="w-full max-w-none px-[var(--page-gutter)] pb-[max(96px,env(safe-area-inset-bottom,0px)+80px)] flex-1" id="main-content">
        {/* Hero Section */}
        <section className="max-w-[720px] mx-auto pt-12 max-[719px]:pt-10 px-[var(--page-gutter)] pb-5 text-center">
          <div className="font-body text-[clamp(10px,0.45vw+8px,13px)] font-semibold tracking-[0.85px] uppercase text-amber mb-3.5 [text-shadow:0_0_18px_rgba(246,196,83,0.18)]">
            Built in public
          </div>
          <h1 className="font-display text-[clamp(1.75rem,4vw,2.5rem)] text-cream leading-[1.15] mb-3">
            What we ship and what is next
          </h1>
          <p className="text-body text-[1.05rem] max-w-[560px] mx-auto">
            Replix Captions is built from creator pain points. Tell us what you like, what you want, and what we should build next.
          </p>
        </section>

        {/* Timeline Wrap */}
        <div className="max-w-[880px] max-[719px]:max-w-[640px] mx-auto pt-2 px-[var(--page-gutter)] max-[719px]:px-[max(var(--page-gutter),20px)]">
          <p className="text-[12px] text-dim text-center mb-7 tracking-[0.02em] mono">
            Last updated Aug 2026
          </p>

          <div className="relative p-0 [--rm-rail:50%] max-[719px]:[--rm-rail:16px]">
            {/* Center spine vertical track */}
            <div className="absolute left-[var(--rm-rail)] top-0 bottom-0 w-[2px] -translate-x-1/2 bg-[rgba(244,236,220,0.08)] rounded-[2px] overflow-hidden z-0" aria-hidden="true">
              <div className="absolute left-0 top-0 w-full h-full bg-gradient-to-b from-[#6ee7a0] to-amber rounded-[2px]" />
            </div>

            {/* Segment 1: Shipped */}
            <section className="relative mb-3 last:mb-0" aria-labelledby="roadmap-shipped">
              <div className="flex justify-center mb-[22px] max-[719px]:mb-[26px] relative z-[2]" id="roadmap-shipped">
                <span className="font-display text-[0.72rem] tracking-[0.08em] uppercase text-cream bg-surface border border-[#6ee7a0]/35 rounded-full py-1.5 px-4 shadow-[var(--card-shadow)]">
                  Shipped
                </span>
              </div>

              <div className="flex flex-col gap-5 mb-8 max-[719px]:mb-10">
                {shippedItems.map((item, idx) => (
                  <RoadmapItemCard
                    key={item.title}
                    item={item}
                    index={idx}
                    vote={votes[item.title]}
                    onVote={(choice) =>
                      setVotes((prev) => ({ ...prev, [item.title]: choice }))
                    }
                  />
                ))}
              </div>
            </section>

            {/* Segment 2: Coming soon / Planned */}
            <section className="relative mb-3 last:mb-0" aria-labelledby="roadmap-planned">
              <div className="flex justify-center mb-[22px] max-[719px]:mb-[26px] relative z-[2]" id="roadmap-planned">
                <span className="font-display text-[0.72rem] tracking-[0.08em] uppercase text-cream bg-surface border border-amber/35 rounded-full py-1.5 px-4 shadow-[var(--card-shadow)]">
                  Coming soon
                </span>
              </div>

              <div className="flex flex-col gap-5 mb-8 max-[719px]:mb-10">
                {plannedItems.map((item, idx) => (
                  <RoadmapItemCard
                    key={item.title}
                    item={item}
                    index={idx}
                    isComingSoon
                    vote={votes[item.title]}
                    onVote={(choice) =>
                      setVotes((prev) => ({ ...prev, [item.title]: choice }))
                    }
                  />
                ))}
              </div>
            </section>
          </div>
        </div>

        <section className="mx-auto mt-20 max-w-[560px] text-center">
          <div className="font-body text-[clamp(10px,0.45vw+8px,13px)] font-semibold tracking-[0.85px] uppercase text-amber mb-3.5">Your turn</div>
          <h2 className="font-display text-3xl text-cream sm:text-4xl">Have an idea we missed?</h2>
          <p className="mt-3 text-sm text-dim">One sentence is enough. We read every submission.</p>
          {submitted ? (
            <div className="mt-7 rounded-2xl border border-emerald-400/25 bg-emerald-400/8 p-8">
              <h3 className="font-bold text-cream">Thanks, we got your idea.</h3>
              <p className="mt-2 text-sm text-dim">We read every submission. Keep the ideas coming.</p>
              <button type="button" onClick={() => { setSubmitted(false); setIdea(""); }} className="mt-5 rounded-full bg-cream px-5 py-2 text-xs font-bold text-canvas">Done</button>
            </div>
          ) : (
            <form className="mt-7 rounded-2xl border border-[var(--hairline)] bg-surface p-4 text-left sm:p-6 shadow-[var(--card-shadow)]" onSubmit={(event) => { event.preventDefault(); if (idea.trim()) setSubmitted(true); }}>
              <label htmlFor="idea" className="sr-only">Your feature idea</label>
              <textarea id="idea" value={idea} onChange={(event) => setIdea(event.target.value)} required rows={4} placeholder="e.g. Auto-split long captions into two lines on export" className="w-full resize-none rounded-xl border border-[var(--hairline)] bg-surface-raised p-4 text-sm text-cream placeholder:text-dim" />
              <div className="mt-4 flex items-center justify-between gap-4">
                <p className="max-w-[340px] text-[11px] leading-4 text-dim">Ideas may be stored and reviewed by our team. Do not submit personal data.</p>
                <button type="submit" className="shrink-0 rounded-full bg-amber px-5 py-2.5 text-xs font-bold text-[#0c0b0a]">Submit idea</button>
              </div>
            </form>
          )}
        </section>

        <SiteFooter />
      </main>
    </div>
  );
}
