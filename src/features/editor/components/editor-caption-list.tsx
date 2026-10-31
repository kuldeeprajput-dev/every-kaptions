"use client";

import { useMemo, useState } from "react";
import { ArrowLeftRight, Layers, Play, Search, Share2, Sliders, X } from "lucide-react";
import { cn } from "@/shared/lib/cn";
import { formatClockTimeWithMs } from "../lib/captions";
import type { CaptionSegment } from "../types/captions";

export type CaptionFilterMode = "all" | "questions" | "short" | "long";

export interface EditorCaptionListProps {
  segments: CaptionSegment[];
  activeSegmentId: string | null;
  currentVoiceSegId?: string;
  onSelectSegment: (id: string, start: number) => void;
  onUpdateText: (id: string, text: string) => void;
  onSplit: (id: string) => void;
  onMergeWithNext: (id: string) => void;
  onDelete: (id: string) => void;
  onNudgeTiming: (offset: number) => void;
  onOpenFindReplace?: () => void;
  onOpenSocialMetadata?: () => void;
  className?: string;
}

export function EditorCaptionList({
  segments,
  activeSegmentId,
  currentVoiceSegId,
  onSelectSegment,
  onUpdateText,
  onSplit,
  onMergeWithNext,
  onDelete,
  onNudgeTiming,
  onOpenFindReplace,
  onOpenSocialMetadata,
  className,
}: EditorCaptionListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMode, setFilterMode] = useState<CaptionFilterMode>("all");

  const captionMetrics = useMemo(() => {
    const totalWords = segments.reduce(
      (acc, s) => acc + s.text.trim().split(/\s+/).filter(Boolean).length,
      0,
    );
    const maxEnd = segments.length > 0 ? Math.max(...segments.map((s) => s.end)) : 0;
    const wpm = maxEnd > 0 ? Math.round(totalWords / (maxEnd / 60)) : 0;
    return { totalWords, wpm };
  }, [segments]);

  const filteredSegments = useMemo(() => {
    let result = segments;

    if (filterMode === "questions") {
      result = result.filter((s) => s.text.includes("?"));
    } else if (filterMode === "short") {
      result = result.filter((s) => s.end - s.start <= 2.0);
    } else if (filterMode === "long") {
      result = result.filter((s) => s.end - s.start >= 4.5);
    }

    if (!searchQuery.trim()) return result;
    const q = searchQuery.toLowerCase();
    return result.filter(
      (s, idx) =>
        s.text.toLowerCase().includes(q) ||
        `#${idx + 1}`.includes(q) ||
        formatClockTimeWithMs(s.start).includes(q),
    );
  }, [segments, searchQuery, filterMode]);

  return (
    <section className={cn("flex flex-col h-full bg-surface font-sans", className)}>
      {/* Sticky Panel Header */}
      <div className="sticky top-0 z-10 border-b border-hairline bg-surface/95 backdrop-blur-md p-4 space-y-3 shrink-0">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="grid size-7 place-items-center rounded-lg bg-amber/10 text-amber">
              <Layers size={15} aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-xs font-bold uppercase tracking-[.15em] text-body">Captions</h2>
              <p className="text-sm font-bold text-cream">Review & edit</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {onOpenSocialMetadata ? (
              <button
                type="button"
                onClick={onOpenSocialMetadata}
                title="Generate social copy & tags (Ctrl+M)"
                className="flex items-center gap-1.5 rounded-lg border border-hairline bg-surface-raised px-2 py-1 text-[11px] font-semibold text-body hover:text-amber hover:border-amber/40 transition cursor-pointer"
              >
                <Share2 size={12} className="text-amber" aria-hidden="true" />
                <span className="hidden sm:inline">Social</span>
              </button>
            ) : null}
            {onOpenFindReplace ? (
              <button
                type="button"
                onClick={onOpenFindReplace}
                title="Batch find & replace (Ctrl+F)"
                className="flex items-center gap-1.5 rounded-lg border border-hairline bg-surface-raised px-2 py-1 text-[11px] font-semibold text-body hover:text-amber hover:border-amber/40 transition cursor-pointer"
              >
                <ArrowLeftRight size={12} className="text-amber" aria-hidden="true" />
                <span className="hidden sm:inline">Find</span>
              </button>
            ) : null}
            <span className="rounded-lg border border-amber/40 bg-amber/15 px-2 py-0.5 text-[11px] font-bold text-amber">
              {segments.length} lines{captionMetrics.wpm > 0 ? ` • ${captionMetrics.wpm} wpm` : ""}
            </span>
          </div>
        </div>

        {/* Live Search Bar */}
        <div className="relative flex items-center">
          <Search size={13} className="absolute left-3 text-dim pointer-events-none" aria-hidden="true" />
          <input
            type="text"
            placeholder="Search caption lines..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Filter caption lines"
            className="w-full rounded-xl border border-hairline bg-surface-raised py-1.5 pl-8 pr-7 text-xs text-cream placeholder-dim outline-none focus:border-amber/60 transition"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              aria-label="Clear search"
              className="absolute right-2.5 text-xs text-body hover:text-cream cursor-pointer"
            >
              <X size={12} />
            </button>
          )}
        </div>

        {/* Quick Filter Chips */}
        <div className="flex items-center gap-1 overflow-x-auto pb-0.5" role="tablist" aria-label="Caption filter mode">
          {(
            [
              { id: "all", label: "All" },
              { id: "questions", label: "Questions (?)" },
              { id: "short", label: "Short (<2s)" },
              { id: "long", label: "Long (>4.5s)" },
            ] as const
          ).map((item) => {
            const isSelected = filterMode === item.id;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => setFilterMode(item.id)}
                className={cn(
                  "rounded-md px-2 py-0.5 text-[10px] font-bold whitespace-nowrap transition cursor-pointer",
                  isSelected
                    ? "bg-amber text-black shadow-sm"
                    : "bg-surface-raised border border-hairline text-dim hover:text-cream hover:border-amber/30",
                )}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Voice Sync Nudge Controls */}
        <div className="flex items-center justify-between gap-1 rounded-xl border border-hairline bg-surface-raised px-2.5 py-1.5 text-[11px]">
          <div className="flex items-center gap-1.5 font-semibold text-body">
            <Sliders size={12} className="text-amber" aria-hidden="true" />
            <span>Voice Sync</span>
            {currentVoiceSegId ? (
              <button
                type="button"
                onClick={() => {
                  const card = document.getElementById(`caption-card-${currentVoiceSegId}`);
                  card?.scrollIntoView({ behavior: "smooth", block: "center" });
                }}
                className="ml-1 rounded-md bg-amber/15 px-1.5 py-0.5 text-[9px] font-bold text-amber hover:bg-amber/25 transition cursor-pointer"
                title="Scroll list to currently spoken caption"
              >
                Follow Voice
              </button>
            ) : null}
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onNudgeTiming(-0.2)}
              className="rounded px-1.5 py-0.5 bg-surface-raised hover:bg-amber/20 hover:text-amber text-[11px] font-bold text-cream transition cursor-pointer"
              title="Shift all captions 0.2s earlier"
            >
              -0.2s
            </button>
            <button
              type="button"
              onClick={() => onNudgeTiming(-0.1)}
              className="rounded px-1.5 py-0.5 bg-surface-raised hover:bg-amber/20 hover:text-amber text-[11px] font-bold text-cream transition cursor-pointer"
              title="Shift all captions 0.1s earlier"
            >
              -0.1s
            </button>
            <button
              type="button"
              onClick={() => onNudgeTiming(0.1)}
              className="rounded px-1.5 py-0.5 bg-surface-raised hover:bg-amber/20 hover:text-amber text-[11px] font-bold text-cream transition cursor-pointer"
              title="Shift all captions 0.1s later"
            >
              +0.1s
            </button>
            <button
              type="button"
              onClick={() => onNudgeTiming(0.2)}
              className="rounded px-1.5 py-0.5 bg-surface-raised hover:bg-amber/20 hover:text-amber text-[11px] font-bold text-cream transition cursor-pointer"
              title="Shift all captions 0.2s later"
            >
              +0.2s
            </button>
          </div>
        </div>
      </div>

      {/* Captions Scroll List */}
      <div className="space-y-2.5 p-3 sm:p-4 flex-1 overflow-y-auto custom-scrollbar">
        {filteredSegments.length === 0 ? (
          <div className="py-12 text-center text-xs text-dim">
            <p>No matching captions found.</p>
            {(searchQuery || filterMode !== "all") && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setFilterMode("all");
                }}
                className="mt-2 text-xs font-semibold text-amber hover:underline cursor-pointer"
              >
                Reset filters
              </button>
            )}
          </div>
        ) : null}

        {filteredSegments.map((segment) => {
          const index = segments.findIndex((s) => s.id === segment.id);
          const isVoiceSpeaking = currentVoiceSegId === segment.id;
          const isSelected = segment.id === activeSegmentId;

          return (
            <article
              key={segment.id}
              id={`caption-card-${segment.id}`}
              className={cn(
                "transcript-row group relative rounded-lg border p-3 transition-all duration-150",
                isVoiceSpeaking
                  ? "border-amber/30 bg-amber/5"
                  : isSelected
                  ? "border-hairline bg-surface-raised"
                  : "border-hairline bg-surface hover:border-hairline hover:bg-surface",
              )}
            >
              {isVoiceSpeaking ? (
                <span className="absolute left-0 top-3 bottom-3 w-1 rounded-r-full bg-amber" />
              ) : null}

              <div className="flex items-center justify-between gap-3 text-left pl-1">
                <button
                  type="button"
                  onClick={() => onSelectSegment(segment.id, segment.start)}
                  className="flex items-center gap-2 cursor-pointer group/time"
                >
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-bold transition",
                      isVoiceSpeaking
                        ? "bg-amber text-white border-amber"
                        : "bg-surface-raised border-hairline text-amber group-hover/time:border-amber/50",
                    )}
                  >
                    <Play size={10} className={isVoiceSpeaking ? "fill-white" : "fill-amber"} />
                    {formatClockTimeWithMs(segment.start)}
                  </span>
                  <span className="text-[11px] font-medium text-body whitespace-nowrap">
                    #{index + 1}
                  </span>
                  <span className="text-[10px] text-dim font-mono">
                    ({(segment.end - segment.start).toFixed(1)}s)
                  </span>
                </button>

                <div className="flex items-center gap-1 text-[11px] text-body">
                  <button
                    type="button"
                    onClick={() => onSplit(segment.id)}
                    className="rounded px-1.5 py-0.5 hover:bg-surface-raised hover:text-amber transition cursor-pointer font-medium"
                    title="Split segment at playhead"
                  >
                    Split
                  </button>
                  <span className="text-cream">·</span>
                  <button
                    type="button"
                    onClick={() => onMergeWithNext(segment.id)}
                    className="rounded px-1.5 py-0.5 hover:bg-surface-raised hover:text-amber transition cursor-pointer font-medium"
                    title="Merge with next segment"
                  >
                    Merge
                  </button>
                  <span className="text-cream">·</span>
                  <button
                    type="button"
                    onClick={() => onDelete(segment.id)}
                    className="rounded px-1.5 py-0.5 hover:bg-red-500/20 hover:text-red-400 transition cursor-pointer font-medium"
                    title="Delete caption line"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <textarea
                value={segment.text}
                onChange={(event) => onUpdateText(segment.id, event.target.value)}
                rows={2}
                aria-label={`Caption ${index + 1} text`}
                className="mt-2.5 w-full resize-none rounded-lg bg-surface-raised border-0 p-2 text-sm leading-6 text-cream outline-none focus:outline-none focus:ring-0 focus:border-0 focus:bg-surface-raised placeholder:text-dim transition"
              />
            </article>
          );
        })}
      </div>

      {/* Footer Status Bar */}
      <div className="border-t border-hairline bg-surface/90 px-4 py-2.5 flex items-center justify-between text-[11px] text-dim shrink-0">
        <span className="flex items-center gap-1.5">
          <kbd className="font-mono bg-surface-raised border border-hairline px-1.5 py-0.5 rounded text-[10px] text-cream">
            Ctrl+F
          </kbd>{" "}
          Find & Replace
        </span>
        <span className="font-medium text-body">
          {filteredSegments.length} of {segments.length} lines shown
        </span>
      </div>
    </section>
  );
}
