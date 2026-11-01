"use client";

import { useId, useMemo, useRef, useState } from "react";
import { Clock, Scissors, X, Zap } from "lucide-react";
import { cn } from "@/shared/lib/cn";
import { useDialogFocus } from "@/shared/hooks/use-dialog-focus";
import type { CaptionSegment } from "../types/captions";

export interface SilenceGap {
  id: string;
  start: number;
  end: number;
  duration: number;
  previousSegmentText: string;
  nextSegmentText: string;
}

export interface TrimSilenceResult {
  trimmedSegments: CaptionSegment[];
  totalSecondsCut: number;
  detectedGapsCount: number;
}

export interface EditorClipTrimmerProps {
  isOpen: boolean;
  onClose: () => void;
  segments: CaptionSegment[];
  totalDuration?: number;
  onApplyTrim: (result: TrimSilenceResult) => void;
}

function detectSilenceGaps(
  segments: CaptionSegment[],
  thresholdSeconds: number,
): SilenceGap[] {
  const gaps: SilenceGap[] = [];
  for (let i = 0; i < segments.length - 1; i++) {
    const current = segments[i];
    const next = segments[i + 1];
    const gapDuration = next.start - current.end;
    if (gapDuration >= thresholdSeconds) {
      gaps.push({
        id: `gap-${i}`,
        start: current.end,
        end: next.start,
        duration: gapDuration,
        previousSegmentText: current.text,
        nextSegmentText: next.text,
      });
    }
  }
  return gaps;
}

export function EditorClipTrimmer({
  isOpen,
  onClose,
  segments,
  totalDuration = 60,
  onApplyTrim,
}: EditorClipTrimmerProps) {
  const dialogId = useId();
  const titleId = `${dialogId}-title`;
  const dialogRef = useRef<HTMLDivElement>(null);
  useDialogFocus(dialogRef, isOpen);

  const [threshold, setThreshold] = useState<number>(0.6);
  const [paddingBuffer, setPaddingBuffer] = useState<number>(0.1);
  const [excludedGapIds, setExcludedGapIds] = useState<Set<string>>(new Set());

  const detectedGaps = useMemo(
    () => detectSilenceGaps(segments, threshold),
    [segments, threshold],
  );

  const activeGaps = useMemo(
    () => detectedGaps.filter((g) => !excludedGapIds.has(g.id)),
    [detectedGaps, excludedGapIds],
  );

  const totalCutSeconds = useMemo(
    () => activeGaps.reduce((sum, g) => sum + Math.max(0, g.duration - paddingBuffer * 2), 0),
    [activeGaps, paddingBuffer],
  );

  if (!isOpen) return null;

  const handleToggleGap = (id: string) => {
    setExcludedGapIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleApply = () => {
    let accumulatedCut = 0;
    const sortedActive = [...activeGaps].sort((a, b) => a.start - b.start);
    const trimmed: CaptionSegment[] = segments.map((seg) => {
      let cutBefore = 0;
      for (const gap of sortedActive) {
        if (gap.end <= seg.start) {
          cutBefore += Math.max(0, gap.duration - paddingBuffer * 2);
        }
      }
      return {
        ...seg,
        start: Math.max(0, seg.start - cutBefore),
        end: Math.max(0.1, seg.end - cutBefore),
      };
    });

    onApplyTrim({
      trimmedSegments: trimmed,
      totalSecondsCut: totalCutSeconds,
      detectedGapsCount: activeGaps.length,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-[fadeIn_0.15s_ease-out]">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="w-full max-w-xl bg-surface border border-hairline rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-hairline bg-surface-raised">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-accent-soft flex items-center justify-center text-accent">
              <Scissors size={18} />
            </div>
            <div>
              <h2 id={titleId} className="text-sm font-semibold text-cream">Silence & Dead-Air Trimmer</h2>
              <p className="text-xs text-dim">Automatically remove unnatural pauses between spoken lines</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg text-dim hover:text-cream hover:bg-surface transition-colors cursor-pointer" aria-label="Close silence trimmer">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          <div className="grid grid-cols-3 gap-2.5 p-3 rounded-xl bg-surface-raised/50 border border-hairline text-center">
            <div>
              <span className="text-[10px] text-dim uppercase tracking-wider block">Pauses Found</span>
              <span className="text-sm font-bold text-cream">{detectedGaps.length}</span>
            </div>
            <div>
              <span className="text-[10px] text-dim uppercase tracking-wider block">Time Cut</span>
              <span className="text-sm font-bold text-accent">-{totalCutSeconds.toFixed(1)}s</span>
            </div>
            <div>
              <span className="text-[10px] text-dim uppercase tracking-wider block">New Runtime</span>
              <span className="text-sm font-bold text-emerald-400">{Math.max(0, totalDuration - totalCutSeconds).toFixed(1)}s</span>
            </div>
          </div>

          <section className="space-y-3">
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-medium text-cream">Pause Sensitivity Threshold</span>
                <span className="text-dim font-mono">{threshold.toFixed(2)}s</span>
              </div>
              <input type="range" min="0.3" max="1.8" step="0.05" value={threshold} onChange={(e) => setThreshold(parseFloat(e.target.value))} className="w-full accent-accent h-1.5 bg-surface-raised rounded-lg cursor-pointer" />
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-medium text-cream">Word Cushion Buffer</span>
                <span className="text-dim font-mono">{paddingBuffer.toFixed(2)}s</span>
              </div>
              <input type="range" min="0.05" max="0.3" step="0.05" value={paddingBuffer} onChange={(e) => setPaddingBuffer(parseFloat(e.target.value))} className="w-full accent-accent h-1.5 bg-surface-raised rounded-lg cursor-pointer" />
            </div>
          </section>

          <section className="space-y-2 pt-2 border-t border-hairline">
            <span className="text-xs font-semibold text-dim uppercase tracking-wider block">
              Detected Silence Gaps ({activeGaps.length} selected)
            </span>
            <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1 border border-hairline rounded-xl p-2.5 bg-surface-raised/20">
              {detectedGaps.length === 0 ? (
                <p className="text-xs text-dim text-center py-4">No speech pauses exceeding {threshold.toFixed(2)}s detected.</p>
              ) : (
                detectedGaps.map((gap, idx) => {
                  const isCut = !excludedGapIds.has(gap.id);
                  return (
                    <button
                      key={gap.id}
                      type="button"
                      onClick={() => handleToggleGap(gap.id)}
                      className={cn(
                        "w-full p-2 rounded-lg border text-left text-xs transition-colors cursor-pointer flex items-center justify-between",
                        isCut ? "border-accent/40 bg-accent-soft/40 text-cream" : "border-hairline bg-surface text-dim line-through opacity-60",
                      )}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <Clock size={13} className="text-dim shrink-0" />
                        <span className="font-mono text-[11px]">#{idx + 1} at {gap.start.toFixed(1)}s:</span>
                        <span className="truncate">&quot;{gap.previousSegmentText}&quot;</span>
                      </div>
                      <span className="font-mono text-accent font-semibold ml-2 shrink-0">+{gap.duration.toFixed(2)}s</span>
                    </button>
                  );
                })
              )}
            </div>
          </section>
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t border-hairline bg-surface-raised">
          <p className="text-xs text-dim">Shortens timeline and tightens video pacing</p>
          <div className="flex items-center gap-2.5">
            <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-semibold text-dim hover:text-cream transition-colors cursor-pointer">
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApply}
              disabled={activeGaps.length === 0}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-accent text-white hover:bg-accent/90 disabled:opacity-50 shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Zap size={14} /> Trim {activeGaps.length} Pauses (-{totalCutSeconds.toFixed(1)}s)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
