"use client";

import type { RoadmapItem } from "../data/roadmap-data";

interface RoadmapItemCardProps {
  item: RoadmapItem;
  index: number;
  isComingSoon?: boolean;
  vote?: "yes" | "no";
  onVote: (choice: "yes" | "no") => void;
}

export function RoadmapItemCard({
  item,
  index,
  isComingSoon = false,
  vote,
  onVote,
}: RoadmapItemCardProps) {
  const isLeft = isComingSoon ? index % 2 !== 0 : index % 2 === 0;
  const isVoted = Boolean(vote);
  const positiveLabel = isComingSoon ? "Want it" : "Like it";
  const negativeLabel = isComingSoon ? "No" : "Not for me";
  const promptText = isComingSoon ? "Want this?" : "Do you like this?";
  const voteBtnClass =
    "font-body text-[11px] leading-none font-bold tracking-[0.03em] uppercase rounded-lg h-6 px-2.5 inline-flex items-center justify-center cursor-pointer transition-[border-color,background,color] duration-150 hover:border-amber/45 hover:text-amber";

  return (
    <div className="grid grid-cols-[1fr_auto_1fr] max-[719px]:grid-cols-[32px_1fr] gap-x-5 max-[719px]:gap-x-3 items-start relative z-[1]">
      {/* Node circle on spine */}
      <div className="col-start-2 row-start-1 max-[719px]:col-start-1 flex items-center justify-center pt-5 max-[719px]:pt-4 max-[719px]:w-8">
        {isComingSoon ? (
          <span
            className="relative w-4 h-4 rounded-lg shrink-0 z-[2] flex items-center justify-center bg-canvas border-2 border-amber/70 shadow-sm"
            aria-hidden="true"
          />
        ) : (
          <span
            className="relative w-4 h-4 rounded-lg shrink-0 z-[2] flex items-center justify-center bg-surface shadow-sm"
            aria-hidden="true"
          >
            <svg className="block shrink-0" viewBox="0 0 16 16" width="9" height="9" aria-hidden="true">
              <path d="M3.5 8.5 6.5 11.5 12.5 4.5" fill="none" stroke="#0c0b0a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        )}
      </div>

      {/* Card with speech pointer */}
      <article
        className={`relative min-w-0 bg-surface border border-[var(--hairline)] hover:border-hairline rounded-xl pt-3.5 px-4 pb-3 shadow-sm opacity-100 transition-[opacity,transform,border-color] duration-400 ${
          isLeft
            ? "col-start-1 row-start-1 max-[719px]:col-start-2 max-[719px]:transform-none"
            : "col-start-3 row-start-1 max-[719px]:col-start-2 max-[719px]:transform-none"
        }`}
      >
        <span
          className={`absolute top-[22px] w-2.5 h-2.5 bg-surface border border-[var(--hairline)] rotate-45 z-[1] ${
            isLeft
              ? "-right-1.5 border-l-0 border-b-0 max-[719px]:-left-1.5 max-[719px]:right-auto max-[719px]:border-r-0 max-[719px]:border-t-0 max-[719px]:border-l max-[719px]:border-b"
              : "-left-1.5 border-r-0 border-t-0"
          }`}
          aria-hidden="true"
        />
        <div className="mb-2.5">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="text-[10px] font-semibold tracking-[0.05em] uppercase text-amber bg-amber/[0.08] border border-amber/[0.18] rounded-lg px-2 py-0.5">
              {item.category}
            </span>
            <time className="text-[11px] text-dim mono">{item.date}</time>
          </div>
          <h3 className="font-body text-[1rem] font-semibold text-cream mb-1 leading-[1.3]">
            {item.title}
          </h3>
          <p className="font-body text-[0.9rem] text-body leading-[1.45]">
            {item.description}
          </p>
        </div>

        <div className="border-t border-[var(--hairline)] pt-2.5 mt-3.5">
          <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 max-[719px]:flex-col max-[719px]:items-start max-[719px]:gap-2">
            <span className="text-[12px] text-dim">{promptText}</span>
            <div className="group/swap block" data-state={isVoted ? "noted" : "idle"} aria-live="polite">
              <span className="block h-7 overflow-hidden [contain:paint]">
                <span className="block [transform:translate3d(0,0,0)] transition-transform duration-400 ease-[cubic-bezier(0.34,1.45,0.64,1)] will-change-transform group-data-[state=noted]/swap:[transform:translate3d(0,-28px,0)]">
                  <span className="flex items-center justify-end gap-1.5 h-7 min-h-7 overflow-hidden transition-[opacity,visibility] duration-200 group-data-[state=noted]/swap:opacity-0 group-data-[state=noted]/swap:invisible group-data-[state=noted]/swap:pointer-events-none" role="group" aria-label={promptText}>
                    <button
                      type="button"
                      className={`${voteBtnClass} ${vote === "yes" ? "bg-amber/[0.12] border border-amber/50 text-amber" : "text-cream bg-surface-raised border border-[var(--hairline-strong)]"}`}
                      onClick={() => onVote("yes")}
                    >
                      {positiveLabel}
                    </button>
                    <button
                      type="button"
                      className={`${voteBtnClass} ${vote === "no" ? "bg-amber/[0.12] border border-amber/50 text-amber" : "text-cream bg-surface-raised border border-[var(--hairline-strong)]"}`}
                      onClick={() => onVote("no")}
                    >
                      {negativeLabel}
                    </button>
                  </span>
                  <span className="flex items-center justify-end h-7 min-h-7 overflow-hidden text-[11px] font-bold tracking-[0.04em] uppercase text-[#5fbf80] leading-7">
                    Noted
                  </span>
                </span>
              </span>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
