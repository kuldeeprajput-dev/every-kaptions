"use client";

import { useMemo, useState } from "react";
import { ChevronDown, HelpCircle, Search, Sparkles, X } from "lucide-react";
import { cn } from "@/shared/lib/cn";
import {
  SUPPORT_CATEGORIES,
  SUPPORT_GUIDES,
  type SupportCategory,
} from "../data/support-guides";

export function SupportGuides() {
  const [activeCategory, setActiveCategory] = useState<SupportCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>("accuracy-boost");

  const filteredGuides = useMemo(() => {
    return SUPPORT_GUIDES.filter((guide) => {
      const matchCat = activeCategory === "all" || guide.category === activeCategory;
      const matchSearch =
        !searchQuery.trim() ||
        guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guide.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guide.tag.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <section className="support-guides-section mt-12 w-full font-sans" aria-label="Creator help guides">
      <div className="flex flex-col gap-2 mb-6">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber">
          <Sparkles size={14} aria-hidden="true" />
          <span>Troubleshooting & Guides</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-cream">Common questions answered</h2>
        <p className="text-xs sm:text-sm text-body">
          Explore quick guides for audio sync, transcription accuracy, and subtitle exports.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div className="flex flex-wrap items-center gap-1.5" role="tablist" aria-label="Guide categories">
          {SUPPORT_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              role="tab"
              aria-selected={activeCategory === cat.id}
              onClick={() => setActiveCategory(cat.id as SupportCategory)}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-semibold transition cursor-pointer",
                activeCategory === cat.id ? "bg-amber text-white shadow-sm" : "bg-surface-raised text-body hover:text-cream",
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="relative sm:w-64">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-dim pointer-events-none" aria-hidden="true" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search guides..."
            aria-label="Search help guides"
            className="w-full rounded-xl border border-hairline bg-surface py-2 pl-8 pr-8 text-xs text-cream placeholder-dim outline-none focus:border-amber/60 transition"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              aria-label="Clear search"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-dim hover:text-cream cursor-pointer"
            >
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {filteredGuides.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-hairline p-8 text-center bg-surface">
            <HelpCircle size={24} className="mx-auto text-dim mb-2" aria-hidden="true" />
            <p className="text-xs font-semibold text-cream">No help guides match your search.</p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("all");
              }}
              className="mt-2 text-xs font-bold text-amber hover:underline cursor-pointer"
            >
              Reset filters
            </button>
          </div>
        ) : (
          filteredGuides.map((guide) => {
            const isExpanded = expandedId === guide.id;
            return (
              <div
                key={guide.id}
                className={cn(
                  "rounded-2xl border border-hairline bg-surface transition-all overflow-hidden",
                  isExpanded ? "ring-1 ring-amber/30 shadow-sm" : "hover:border-amber/30",
                )}
              >
                <button
                  type="button"
                  onClick={() => setExpandedId(isExpanded ? null : guide.id)}
                  aria-expanded={isExpanded}
                  className="flex w-full items-start justify-between p-4 sm:p-5 text-left cursor-pointer gap-4"
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="rounded-md bg-surface-raised px-2 py-0.5 text-[10px] font-bold text-dim">{guide.tag}</span>
                      <span className="text-[11px] text-body">{guide.categoryLabel}</span>
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-cream mt-1">{guide.title}</h3>
                    <p className="text-xs text-body">{guide.summary}</p>
                  </div>
                  <ChevronDown
                    size={16}
                    className={cn("shrink-0 text-dim transition-transform duration-200 mt-1", isExpanded && "rotate-180 text-amber")}
                    aria-hidden="true"
                  />
                </button>

                {isExpanded && (
                  <div className="border-t border-hairline bg-surface-raised/40 p-4 sm:p-5 pt-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-body mb-2.5">Recommended Steps:</h4>
                    <ol className="list-decimal list-inside space-y-2 text-xs text-cream leading-relaxed pl-1">
                      {guide.steps.map((step, idx) => (
                        <li key={idx} className="pl-1">
                          <span dangerouslySetInnerHTML={{ __html: step }} />
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
