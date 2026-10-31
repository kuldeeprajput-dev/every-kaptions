"use client";

import { useId, useRef } from "react";
import { Download, Layers, Play, Scissors, Share2, Sparkles, Trash2, X } from "lucide-react";
import { cn } from "@/shared/lib/cn";
import { formatClockTimeWithMs } from "../lib/captions";
import { captionStyles } from "../data/editor-config";
import type { CaptionSegment } from "../types/captions";
import { HIGHLIGHT_COLORS } from "./editor-style-inspector";
import { useDialogFocus } from "@/shared/hooks/use-dialog-focus";

export interface EditorMobileDrawerProps {
  drawer: "captions" | "styles" | null;
  onClose: () => void;
  segments: CaptionSegment[];
  activeSegmentId?: string;
  currentTime: number;
  onSelectSegment: (id: string, start: number) => void;
  onUpdateText: (id: string, text: string) => void;
  onSplitSegment: (id: string) => void;
  onDeleteSegment: (id: string) => void;
  styleId: string;
  onSelectStyle: (id: string) => void;
  highlightColor: string;
  onSelectHighlightColor: (color: string) => void;
  onOpenExport: () => void;
  onOpenSocialMetadata?: () => void;
}

export function EditorMobileDrawer({
  drawer,
  onClose,
  segments,
  activeSegmentId,
  currentTime,
  onSelectSegment,
  onUpdateText,
  onSplitSegment,
  onDeleteSegment,
  styleId,
  onSelectStyle,
  highlightColor,
  onSelectHighlightColor,
  onOpenExport,
  onOpenSocialMetadata,
}: EditorMobileDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  useDialogFocus(drawerRef, Boolean(drawer));

  if (!drawer) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 p-0 backdrop-blur-sm lg:hidden animate-in fade-in duration-150"
      onClick={onClose}
      role="presentation"
    >
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className="relative flex max-h-[85dvh] w-full flex-col rounded-t-3xl border-t border-white/10 bg-[#0c0d0d] p-4 font-sans text-white shadow-2xl overflow-hidden focus-visible:outline-none"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
          <h3 id={titleId} className="flex items-center gap-2 text-sm font-bold text-cream">
            {drawer === "captions" ? (
              <>
                <Layers size={16} className="text-[#f6c453]" aria-hidden="true" />
                Captions Review & Edit
              </>
            ) : (
              <>
                <Sparkles size={16} className="text-[#f6c453]" aria-hidden="true" />
                Styles & Customization
              </>
            )}
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close mobile panel"
            className="grid size-8 place-items-center rounded-full text-[#888] hover:bg-white/10 hover:text-white transition cursor-pointer"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        {/* Captions Tab */}
        {drawer === "captions" ? (
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden space-y-3">
            {onOpenSocialMetadata ? (
              <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-2.5 shrink-0">
                <span className="text-xs text-[#9a9488] flex items-center gap-1.5">
                  <Share2 size={13} className="text-[#f6c453]" />
                  <span>{segments.length} captions loaded</span>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenSocialMetadata();
                  }}
                  className="rounded-lg bg-[#f6c453] px-2.5 py-1 text-[11px] font-bold text-black hover:brightness-105 transition cursor-pointer"
                >
                  Social Post
                </button>
              </div>
            ) : null}
            <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-1">
            {segments.map((segment, index) => {
              const isVoiceSpeaking = currentTime >= segment.start && currentTime <= segment.end;
              const isSelected = segment.id === activeSegmentId;
              const durationSec = (segment.end - segment.start).toFixed(1);

              return (
                <article
                  key={segment.id}
                  className={cn(
                    "group relative rounded-xl border p-3 transition-all duration-150",
                    isVoiceSpeaking
                      ? "border-[#f6c453] bg-[#f6c453]/15 shadow-[0_0_20px_rgba(246,196,83,0.25)]"
                      : isSelected
                      ? "border-[#f6c453]/60 bg-[#f6c453]/5 shadow-[0_0_12px_rgba(246,196,83,0.1)]"
                      : "border-white/8 bg-[#111213]",
                  )}
                >
                  <div className="flex items-center justify-between gap-3 text-left pl-1">
                    <button
                      type="button"
                      onClick={() => onSelectSegment(segment.id, segment.start)}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-bold transition",
                          isVoiceSpeaking
                            ? "bg-[#f6c453] text-black border-[#f6c453]"
                            : "bg-black/40 border-white/10 text-[#f6c453]",
                        )}
                      >
                        <Play size={10} className={isVoiceSpeaking ? "fill-black" : "fill-[#f6c453]"} />
                        {formatClockTimeWithMs(segment.start)}
                      </span>
                      <span className="text-[10px] font-medium text-[#727a7e]">
                        Line {index + 1} ({durationSec}s)
                      </span>
                    </button>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => onSplitSegment(segment.id)}
                        title="Split line into two"
                        className="grid size-7 place-items-center rounded-lg text-[#888] hover:bg-white/10 hover:text-white"
                      >
                        <Scissors size={12} />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteSegment(segment.id)}
                        title="Delete line"
                        className="grid size-7 place-items-center rounded-lg text-[#888] hover:bg-red-500/20 hover:text-red-400"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                  <textarea
                    rows={2}
                    value={segment.text}
                    onChange={(e) => onUpdateText(segment.id, e.target.value)}
                    className="mt-2 w-full resize-none rounded-lg border border-white/5 bg-black/40 p-2 text-xs font-semibold text-white outline-none focus:border-[#f6c453]/40"
                  />
                </article>
              );
            })}
            </div>
          </div>
        ) : (
          /* Styles Tab */
          <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar pr-1 pb-2">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#788084] mb-2">Preset Styles</p>
              <div className="grid grid-cols-2 gap-2">
                {captionStyles.map((style) => (
                  <button
                    key={style.id}
                    type="button"
                    onClick={() => onSelectStyle(style.id)}
                    className={cn(
                      "flex flex-col items-center justify-center rounded-xl border p-2.5 text-center transition cursor-pointer",
                      styleId === style.id
                        ? "border-[#f6c453] bg-[#f6c453]/15 shadow-sm"
                        : "border-white/8 bg-[#111213] hover:border-white/20",
                    )}
                  >
                    <span className="text-xs font-bold text-cream">{style.name}</span>
                    <span className="mt-0.5 text-[10px] text-[#777] capitalize">{style.id.replace("_", " ")}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#788084] mb-2">Highlight Color</p>
              <div className="flex items-center gap-2">
                {HIGHLIGHT_COLORS.map((color) => (
                  <button
                    key={color.id}
                    type="button"
                    onClick={() => onSelectHighlightColor(color.hex)}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                    className={cn(
                      "size-8 rounded-full border transition cursor-pointer transform hover:scale-110",
                      highlightColor === color.hex ? "border-white scale-110 ring-2 ring-white/50" : "border-white/20",
                    )}
                  />
                ))}
              </div>
            </div>

            <div className="pt-2 space-y-2">
              {onOpenSocialMetadata ? (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenSocialMetadata();
                  }}
                  className="w-full flex h-10 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 text-xs font-semibold text-white hover:bg-white/10 transition cursor-pointer"
                >
                  <Share2 size={14} className="text-[#f6c453]" />
                  <span>Generate Social Post & Tags</span>
                </button>
              ) : null}
              <button
                type="button"
                onClick={onOpenExport}
                className="w-full flex h-11 items-center justify-center gap-2 rounded-xl bg-[#f6c453] text-xs font-bold text-black hover:brightness-105 transition cursor-pointer shadow-[0_0_20px_rgba(246,196,83,0.3)]"
              >
                <Download size={15} /> Export Video & Captions
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
