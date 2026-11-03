"use client";

import { useId, useMemo, useRef, useState } from "react";
import { Check, Clapperboard, Eye, Sparkles, Trash2, X } from "lucide-react";
import { cn } from "@/shared/lib/cn";
import { useDialogFocus } from "@/shared/hooks/use-dialog-focus";
import type { CaptionSegment } from "../types/captions";

export interface SuggestedBrollClip {
  id: string;
  keyword: string;
  segmentId: string;
  timestamp: number;
  durationSeconds: number;
  clipTitle: string;
  category: "Business" | "Tech" | "Lifestyle" | "Emotion";
  previewColor: string;
}

export interface EditorAutoBrollMatcherProps {
  isOpen: boolean;
  onClose: () => void;
  segments: CaptionSegment[];
  onApplySuggestions: (clips: SuggestedBrollClip[]) => void;
  onSeek?: (timestamp: number) => void;
}

const VISUAL_KEYWORD_MAP: Record<string, { title: string; category: SuggestedBrollClip["category"]; color: string }> = {
  money: { title: "Cash Flow & Finance Graphics", category: "Business", color: "#10b981" },
  growth: { title: "Upward Chart Curve Animation", category: "Business", color: "#3b82f6" },
  focus: { title: "Deep Work Laptop Close-Up", category: "Tech", color: "#8b5cf6" },
  laptop: { title: "Coding & Typing Keystrokes", category: "Tech", color: "#06b6d4" },
  workout: { title: "High Energy Gym Training", category: "Lifestyle", color: "#f97316" },
  danger: { title: "Red Flashing Alert Vignette", category: "Emotion", color: "#ef4444" },
  secret: { title: "Cinematic Mystery Shadow", category: "Emotion", color: "#eab308" },
};

export function EditorAutoBrollMatcher({
  isOpen,
  onClose,
  segments,
  onApplySuggestions,
  onSeek,
}: EditorAutoBrollMatcherProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  useDialogFocus(dialogRef, isOpen);

  const detectedMatches = useMemo<SuggestedBrollClip[]>(() => {
    const list: SuggestedBrollClip[] = [];
    if (!segments || segments.length === 0) return list;

    segments.forEach((seg) => {
      const words = seg.text.toLowerCase().split(/[^a-zA-Z0-9]+/);
      words.forEach((w) => {
        if (VISUAL_KEYWORD_MAP[w]) {
          const meta = VISUAL_KEYWORD_MAP[w];
          if (!list.some((existing) => existing.keyword === w)) {
            list.push({
              id: `broll-${seg.id}-${w}`,
              keyword: w,
              segmentId: seg.id,
              timestamp: seg.start,
              durationSeconds: 2.5,
              clipTitle: meta.title,
              category: meta.category,
              previewColor: meta.color,
            });
          }
        }
      });
    });

    return list;
  }, [segments]);

  const [selectedClips, setSelectedClips] = useState<SuggestedBrollClip[]>(detectedMatches);

  if (!isOpen) return null;

  const handleRemove = (id: string) => {
    setSelectedClips((prev) => prev.filter((c) => c.id !== id));
  };

  const handleUpdateDuration = (id: string, duration: number) => {
    setSelectedClips((prev) => prev.map((c) => (c.id === id ? { ...c, durationSeconds: duration } : c)));
  };

  const handleSave = () => {
    onApplySuggestions(selectedClips);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        className="w-full max-w-xl rounded-2xl border border-hairline bg-surface-raised shadow-2xl overflow-hidden flex flex-col max-h-[90vh] outline-none"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-hairline bg-surface/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-accent/10 text-accent"><Clapperboard size={18} /></div>
            <div>
              <h2 id={titleId} className="text-sm font-semibold text-cream">Semantic B-Roll Matcher</h2>
              <p className="text-xs text-dim">Automatically detects visual keywords and suggests cutaways</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg text-dim hover:text-cream hover:bg-surface transition-colors cursor-pointer" aria-label="Close b-roll matcher">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="p-3.5 rounded-xl border border-hairline bg-surface/40 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-accent" />
              <div>
                <span className="text-xs font-semibold text-cream">{selectedClips.length} Visual Moments Detected</span>
                <p className="text-[10px] text-dim">Keyword triggers matched to royalty-free cutaways</p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-accent">{selectedClips.length} Inserters</span>
          </div>

          <div className="space-y-2">
            {selectedClips.length === 0 ? (
              <div className="text-center py-12 text-xs text-dim">
                No visual keywords matched in current captions. Add words like &ldquo;money&rdquo;, &ldquo;growth&rdquo;, or &ldquo;laptop&rdquo;.
              </div>
            ) : (
              selectedClips.map((clip) => (
                <div key={clip.id} className="p-3.5 rounded-xl border border-hairline bg-surface/30 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        style={{ backgroundColor: `${clip.previewColor}25`, color: clip.previewColor, borderColor: `${clip.previewColor}40` }}
                        className="px-2 py-0.5 rounded border text-[10px] font-bold uppercase tracking-wider shrink-0"
                      >
                        {clip.keyword}
                      </span>
                      <span className="text-xs font-semibold text-cream truncate">{clip.clipTitle}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => onSeek?.(clip.timestamp)}
                        className="p-1 rounded text-dim hover:text-accent cursor-pointer"
                        title="Seek to trigger"
                      >
                        <Eye size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemove(clip.id)}
                        className="p-1 rounded text-dim hover:text-rose-400 cursor-pointer"
                        title="Dismiss suggestion"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-1 border-t border-hairline/40">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-dim">Cutaway Start</span>
                      <span className="text-[11px] text-accent font-mono">{clip.timestamp.toFixed(1)}s</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-dim">Length</span>
                      <div className="flex items-center gap-1">
                        {[1.5, 2.5, 3.5].map((d) => (
                          <button
                            key={d}
                            type="button"
                            onClick={() => handleUpdateDuration(clip.id, d)}
                            className={cn(
                              "px-1.5 py-0.5 rounded text-[10px] font-mono cursor-pointer transition-colors",
                              clip.durationSeconds === d ? "bg-accent text-white font-bold" : "bg-surface border border-hairline text-dim",
                            )}
                          >
                            {d}s
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t border-hairline bg-surface/50">
          <span className="text-[11px] text-dim">{selectedClips.length} cutaway clips queued</span>
          <div className="flex items-center gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-xs font-medium text-dim hover:text-cream transition-colors cursor-pointer">
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-accent hover:bg-accent-hover text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              <Check size={14} /> Apply B-Roll Suggestions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
