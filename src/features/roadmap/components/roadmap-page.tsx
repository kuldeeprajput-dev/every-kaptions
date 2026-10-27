"use client";

import { useState, useRef, useMemo } from "react";
import { ArrowDown, ArrowUp, Check, Clock3 } from "lucide-react";
import { SiteFooter } from "@/shared/components/site-footer";
import { SiteHeader } from "@/shared/components/site-header";
import { roadmapItems } from "../data/roadmap-data";
import { RoadmapIdeaSection } from "./roadmap-idea-section";
import {
  RoadmapFilterBar,
  type CategoryOption,
  type RoadmapSortOption,
} from "./roadmap-filter-bar";

export function RoadmapPage() {
  const [tab, setTab] = useState<"next" | "shipped">("next");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState<RoadmapSortOption>("newest");
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

  const categories = useMemo(() => {
    const statusItems = roadmapItems.filter((item) => item.status === tab);
    const catMap = new Map<string, number>();
    for (const item of statusItems) {
      catMap.set(item.category, (catMap.get(item.category) || 0) + 1);
    }
    const list: CategoryOption[] = [
      { id: "all", label: "All Categories", count: statusItems.length },
    ];
    for (const [cat, count] of catMap.entries()) {
      list.push({ id: cat, label: cat, count });
    }
    return list;
  }, [tab]);

  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const items = roadmapItems.filter((item) => {
      if (item.status !== tab) return false;
      if (selectedCategory !== "all" && item.category !== selectedCategory) return false;
      if (!q) return true;
      return (
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
      );
    });

    if (sortBy === "alphabetical") {
      return [...items].sort((a, b) => a.title.localeCompare(b.title));
    }
    if (sortBy === "category") {
      return [...items].sort((a, b) => a.category.localeCompare(b.category));
    }
    return items;
  }, [tab, selectedCategory, searchQuery, sortBy]);

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
            onClick={() => {
              setTab("next");
              setSelectedCategory("all");
            }}
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
            onClick={() => {
              setTab("shipped");
              setSelectedCategory("all");
            }}
            onKeyDown={handleTabKeyDown}
          >
            <Check size={14} /> Shipped
          </button>
        </div>

        <RoadmapFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          categories={categories}
          sortBy={sortBy}
          onSortChange={setSortBy}
          totalResults={filteredItems.length}
          onResetFilters={() => {
            setSearchQuery("");
            setSelectedCategory("all");
            setSortBy("newest");
          }}
        />

        <div className="sr-only" aria-live="polite">
          {voteNotice}
        </div>

        <div className="roadmap-list" role="tabpanel" aria-label={`${tab === "next" ? "Coming next" : "Shipped"} features`}>
          {filteredItems.length === 0 ? (
            <div className="text-center py-12 px-4 rounded-2xl border border-white/5 bg-[#121314]">
              <p className="text-sm font-semibold text-cream">No features found</p>
              <p className="mt-1 text-xs text-[#788084]">
                Try adjusting your search terms or clearing category filters.
              </p>
            </div>
          ) : (
            filteredItems.map((item) => (
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
