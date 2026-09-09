"use client";

import { motion } from "motion/react";
import { useState } from "react";
import { SiteFooter } from "@/shared/components/site-footer";
import { SiteHeader } from "@/shared/components/site-header";
import { Eyebrow } from "@/shared/components/ui";
import { cn } from "@/shared/lib/cn";
import { roadmapItems } from "../data/roadmap-data";

export function RoadmapPage() {
  const [votes, setVotes] = useState<Record<string, "yes" | "no">>({});
  const [idea, setIdea] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <main>
      <SiteHeader />
      <div className="mx-auto w-full max-w-[940px] px-4 pb-20 pt-14 sm:px-8 lg:pt-20">
        <header className="mx-auto max-w-[680px] text-center">
          <Eyebrow>Built in public</Eyebrow>
          <h1 className="display text-4xl leading-[1.06] text-cream sm:text-6xl">What we ship and what is next</h1>
          <p className="mx-auto mt-6 max-w-[600px] text-sm leading-6 text-copy sm:text-base">Replix Captions is built from creator pain points. Tell us what you like, what you want, and what we should build next.</p>
          <p className="mt-5 text-xs text-dim">Last updated Aug 2026</p>
        </header>

        <div className="relative mt-16 sm:mt-20">
          <div className="absolute bottom-0 left-[13px] top-0 w-px bg-gradient-to-b from-emerald-400 via-emerald-400 to-amber sm:left-1/2 sm:-translate-x-1/2" />
          <div className="relative mb-5 ml-[30px] w-fit rounded-full border border-emerald-400/25 bg-emerald-400/10 px-4 py-2 text-[10px] font-extrabold uppercase tracking-[.16em] text-emerald-300 sm:mx-auto">Shipped</div>
          <div className="space-y-5 sm:space-y-6">
            {roadmapItems.map((item, index) => {
              const selected = votes[item.title];
              const isNextStart = index > 0 && roadmapItems[index - 1].status === "shipped" && item.status === "next";
              return (
                <div key={item.title}>
                  {isNextStart ? <div className="relative z-10 mx-0 mb-7 ml-[30px] w-fit rounded-full border border-amber/35 bg-amber/8 px-4 py-2 text-[10px] font-extrabold uppercase tracking-[.16em] text-amber sm:mx-auto">Coming soon</div> : null}
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: .38, delay: .03 }}
                    className={cn("relative pl-[42px] sm:pl-0", index % 2 === 0 ? "sm:mr-[calc(50%+20px)]" : "sm:ml-[calc(50%+20px)]")}
                  >
                    <span className={cn("absolute left-[8px] top-6 size-[11px] rounded-full border-2 bg-canvas shadow-[0_0_0_4px_rgba(12,11,10,1)] sm:left-1/2 sm:-translate-x-1/2", item.status === "shipped" ? "border-emerald-300 shadow-[0_0_12px_rgba(110,231,160,.5)]" : "border-amber")} />
                    <article className="card-shadow rounded-2xl border hairline bg-surface p-5">
                      <p className="text-[10px] font-extrabold uppercase tracking-wider text-amber">{item.category} <span className="ml-2 font-medium normal-case text-dim">{item.date}</span></p>
                      <h2 className="mt-3 text-base font-bold text-cream sm:text-lg">{item.title}</h2>
                      <p className="mt-2 text-xs leading-5 text-copy sm:text-sm">{item.description}</p>
                      <div className="mt-5 flex items-center justify-between gap-3">
                        <span className="text-[10px] text-dim">{item.status === "shipped" ? "Do you like this?" : "Want this?"}</span>
                        {selected ? <span className="text-[10px] font-bold text-emerald-300">Noted</span> : (
                          <div className="flex gap-2">
                            <VoteButton onClick={() => setVotes((current) => ({ ...current, [item.title]: "yes" }))}>{item.status === "shipped" ? "Like it" : "Want it"}</VoteButton>
                            <VoteButton onClick={() => setVotes((current) => ({ ...current, [item.title]: "no" }))}>{item.status === "shipped" ? "Not for me" : "No"}</VoteButton>
                          </div>
                        )}
                      </div>
                    </article>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>

        <section className="mx-auto mt-20 max-w-[560px] text-center">
          <Eyebrow>Your turn</Eyebrow>
          <h2 className="display text-3xl text-cream sm:text-4xl">Have an idea we missed?</h2>
          <p className="mt-3 text-sm text-copy">One sentence is enough. We read every submission.</p>
          {submitted ? (
            <div className="mt-7 rounded-2xl border border-emerald-400/25 bg-emerald-400/8 p-8">
              <h3 className="font-bold text-cream">Thanks, we got your idea.</h3>
              <p className="mt-2 text-sm text-copy">We read every submission. Keep the ideas coming.</p>
              <button type="button" onClick={() => { setSubmitted(false); setIdea(""); }} className="mt-5 rounded-full bg-cream px-5 py-2 text-xs font-bold text-canvas">Done</button>
            </div>
          ) : (
            <form className="card-shadow mt-7 rounded-2xl border hairline bg-raised p-4 text-left sm:p-6" onSubmit={(event) => { event.preventDefault(); if (idea.trim()) setSubmitted(true); }}>
              <label htmlFor="idea" className="sr-only">Your feature idea</label>
              <textarea id="idea" value={idea} onChange={(event) => setIdea(event.target.value)} required rows={4} placeholder="e.g. Auto-split long captions into two lines on export" className="w-full resize-none rounded-xl border hairline bg-white/3 p-4 text-sm text-cream placeholder:text-dim/70" />
              <div className="mt-4 flex items-center justify-between gap-4">
                <p className="max-w-[340px] text-[9px] leading-4 text-dim">Ideas may be stored and reviewed by our team. Do not submit personal data.</p>
                <button type="submit" className="shrink-0 rounded-full bg-amber px-5 py-2.5 text-xs font-bold text-canvas">Submit idea</button>
              </div>
            </form>
          )}
        </section>
      </div>
      <SiteFooter />
    </main>
  );
}

function VoteButton({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return <button type="button" onClick={onClick} className="rounded-full border border-white/15 px-3 py-1.5 text-[9px] font-bold uppercase tracking-wide text-copy hover:border-amber/40 hover:text-cream">{children}</button>;
}
