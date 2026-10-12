"use client";
import { useState, useRef } from "react";
import { ArrowDown, ArrowUp, Check, Clock3 } from "lucide-react";
import { SiteFooter } from "@/shared/components/site-footer";
import { SiteHeader } from "@/shared/components/site-header";
import { roadmapItems } from "../data/roadmap-data";
import { RoadmapIdeaSection } from "./roadmap-idea-section";

export function RoadmapPage() {
  const [tab, setTab] = useState<"next" | "shipped">("next");
  const [votes, setVotes] = useState<Record<string, "yes" | "no">>({});
  const [voteNotice, setVoteNotice] = useState<string | null>(null);
  const nextTabRef = useRef<HTMLButtonElement>(null);
  const shippedTabRef = useRef<HTMLButtonElement>(null);

  const handleTabKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      event.preventDefault();
      if (tab === "next") {
        setTab("shipped");
        shippedTabRef.current?.focus();
      } else {
        setTab("next");
        nextTabRef.current?.focus();
      }
    }
  };

  const handleVote = (title: string, choice: "yes" | "no") => {
    setVotes((prev) => ({ ...prev, [title]: choice }));
    setVoteNotice(
      choice === "yes"
        ? `Upvoted "${title}"`
        : `Marked "${title}" as not interested`,
    );
  };

  const visibleItems = roadmapItems.filter((item) => item.status === tab);

  return (
    <>
      <SiteHeader />
      <main id="main-content" className="page-shell roadmap-surface">
        <div className="page-intro">
          <h1>A better studio, together.</h1>
          <p>Built around the way you create. Here’s what we’re working on.</p>
        </div>
        <div
          className="billing-switch"
          role="tablist"
          aria-label="Roadmap status"
        >
          <button
            ref={nextTabRef}
            type="button"
            role="tab"
            aria-selected={tab === "next"}
            tabIndex={tab === "next" ? 0 : -1}
            onClick={() => setTab("next")}
            onKeyDown={handleTabKeyDown}
          >
            <Clock3 size={14} /> Coming next
          </button>
          <button
            ref={shippedTabRef}
            type="button"
            role="tab"
            aria-selected={tab === "shipped"}
            tabIndex={tab === "shipped" ? 0 : -1}
            onClick={() => setTab("shipped")}
            onKeyDown={handleTabKeyDown}
          >
            <Check size={14} /> Shipped
          </button>
        </div>
        <div className="sr-only" aria-live="polite">
          {voteNotice}
        </div>
        <div className="roadmap-list" role="tabpanel" aria-label={`${tab === "next" ? "Coming next" : "Shipped"} features`}>
          {visibleItems.length === 0 ? (
            <p className="text-center text-sm text-dim py-8">
              No features currently in this section.
            </p>
          ) : (
            visibleItems.map((item) => (
              <article key={item.title}>
                <div className="roadmap-date">
                  <span>{item.category}</span>
                  <time>{item.date}</time>
                </div>
                <div className="roadmap-copy">
                  <h2>{item.title}</h2>
                  <p>{item.description}</p>
                </div>
                <div className="roadmap-votes">
                  <button
                    type="button"
                    aria-label={`Support ${item.title}`}
                    title="Upvote this feature"
                    aria-pressed={votes[item.title] === "yes"}
                    onClick={() => handleVote(item.title, "yes")}
                  >
                    <ArrowUp size={16} />
                  </button>
                  <button
                    type="button"
                    aria-label={`Not interested in ${item.title}`}
                    title="Not interested"
                    aria-pressed={votes[item.title] === "no"}
                    onClick={() => handleVote(item.title, "no")}
                  >
                    <ArrowDown size={16} />
                  </button>
                </div>
              </article>
            ))
          )}
        </div>
        <RoadmapIdeaSection />
      </main>
      <SiteFooter />
    </>
  );
}
