"use client";

import { useId, useMemo, useRef, useState } from "react";
import { Check, Clock, FastForward, RotateCcw, Wand2, X } from "lucide-react";
import { cn } from "@/shared/lib/cn";
import { useDialogFocus } from "@/shared/hooks/use-dialog-focus";
import type { CaptionSegment } from "../types/captions";

export interface EditorSubtitleSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  segments: CaptionSegment[];
  onApplySyncedSegments: (segments: CaptionSegment[]) => void;
}

export function EditorSubtitleSyncModal({
  isOpen,
  onClose,
  segments,
  onApplySyncedSegments,
}: EditorSubtitleSyncModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  useDialogFocus(dialogRef, isOpen);

  const [offsetMs, setOffsetMs] = useState(0);
  const [driftFactor, setDriftFactor] = useState(1.0);
  const [resolveOverlaps, setResolveOverlaps] = useState(true);
  const [minDurationSec, setMinDurationSec] = useState(0.4);

  const previewSegments = useMemo<CaptionSegment[]>(() => {
    if (!segments || segments.length === 0) return [];
    const offsetSec = offsetMs / 1000;

    let adjusted: CaptionSegment[] = segments.map((seg) => {
      const origStart = seg.start;
      const origEnd = seg.end;
      const scaledStart = Math.max(0, origStart * driftFactor + offsetSec);
      const scaledEnd = Math.max(scaledStart + minDurationSec, origEnd * driftFactor + offsetSec);

      const words = (seg.words || []).map((w) => {
        const wStart = Math.max(0, w.start * driftFactor + offsetSec);
        const wEnd = Math.max(wStart + 0.1, w.end * driftFactor + offsetSec);
        return { ...w, start: Number(wStart.toFixed(2)), end: Number(wEnd.toFixed(2)) };
      });

      return {
        ...seg,
        start: Number(scaledStart.toFixed(2)),
        end: Number(scaledEnd.toFixed(2)),
        words,
      };
    });

    if (resolveOverlaps && adjusted.length > 1) {
      for (let i = 0; i < adjusted.length - 1; i++) {
        if (adjusted[i].end > adjusted[i + 1].start) {
          adjusted[i] = {
            ...adjusted[i],
            end: Math.max(adjusted[i].start + 0.2, Number((adjusted[i + 1].start - 0.05).toFixed(2))),
          };
        }
      }
    }

    return adjusted;
  }, [segments, offsetMs, driftFactor, resolveOverlaps, minDurationSec]);

  if (!isOpen) return null;

  const handleQuickOffset = (deltaMs: number) => {
    setOffsetMs((prev) => prev + deltaMs);
  };

  const handleReset = () => {
    setOffsetMs(0);
    setDriftFactor(1.0);
    setResolveOverlaps(true);
    setMinDurationSec(0.4);
  };

  const handleSave = () => {
    onApplySyncedSegments(previewSegments);
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
            <div className="p-2 rounded-xl bg-accent/10 text-accent"><Clock size={18} /></div>
            <div>
              <h2 id={titleId} className="text-sm font-semibold text-cream">Subtitle Timing & Drift Sync</h2>
              <p className="text-xs text-dim">Fine-tune caption alignment and compensate for audio lag</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg text-dim hover:text-cream hover:bg-surface transition-colors cursor-pointer" aria-label="Close timing sync">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="p-3.5 rounded-xl border border-hairline bg-surface/40 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-cream">Global Time Offset</span>
                <p className="text-[10px] text-dim">Shift all caption timestamps earlier or later</p>
              </div>
              <span className={cn("text-xs font-mono font-bold", offsetMs === 0 ? "text-dim" : "text-accent")}>
                {offsetMs > 0 ? `+${offsetMs}` : offsetMs} ms
              </span>
            </div>

            <input
              type="range"
              min={-2000}
              max={2000}
              step={20}
              value={offsetMs}
              onChange={(e) => setOffsetMs(Number(e.target.value))}
              className="w-full accent-accent cursor-pointer"
            />

            <div className="flex items-center justify-between gap-1.5">
              {[-500, -100, -20, 20, 100, 500].map((delta) => (
                <button
                  key={delta}
                  type="button"
                  onClick={() => handleQuickOffset(delta)}
                  className="flex-1 py-1 rounded-lg border border-hairline bg-surface hover:bg-surface-raised text-[10px] font-mono text-dim hover:text-cream transition-colors cursor-pointer"
                >
                  {delta > 0 ? `+${delta}` : delta}ms
                </button>
              ))}
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-hairline bg-surface/40 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <FastForward size={14} className="text-accent" />
                <div>
                  <span className="text-xs font-semibold text-cream">Linear Drift Rate Factor</span>
                  <p className="text-[10px] text-dim">Compensates for 44.1kHz vs 48kHz audio clock drift</p>
                </div>
              </div>
              <span className="text-xs font-mono text-accent">{driftFactor.toFixed(4)}x</span>
            </div>

            <input
              type="range"
              min={0.96}
              max={1.04}
              step={0.001}
              value={driftFactor}
              onChange={(e) => setDriftFactor(Number(e.target.value))}
              className="w-full accent-accent cursor-pointer"
            />

            <div className="flex gap-2">
              <button type="button" onClick={() => setDriftFactor(44100 / 48000)} className="px-2 py-0.5 rounded border border-hairline bg-surface text-[10px] text-dim hover:text-cream cursor-pointer">
                44.1kHz &rarr; 48kHz (0.9188x)
              </button>
              <button type="button" onClick={() => setDriftFactor(1.001)} className="px-2 py-0.5 rounded border border-hairline bg-surface text-[10px] text-dim hover:text-cream cursor-pointer">
                23.976 &rarr; 24fps (1.001x)
              </button>
              <button type="button" onClick={() => setDriftFactor(1.0)} className="px-2 py-0.5 rounded border border-hairline bg-surface text-[10px] text-dim hover:text-cream cursor-pointer">
                1.0x Exact
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl border border-hairline bg-surface/30">
            <div className="flex items-center gap-2">
              <Wand2 size={14} className="text-accent" />
              <div>
                <span className="text-xs font-semibold text-cream">Resolve Overlapping Collisions</span>
                <p className="text-[10px] text-dim">Prevent subtitle segments from displaying on top of each other</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={resolveOverlaps}
              onChange={(e) => setResolveOverlaps(e.target.checked)}
              className="accent-accent w-4 h-4 cursor-pointer"
            />
          </div>

          <div className="p-3 rounded-xl border border-hairline bg-surface/20">
            <span className="text-[10px] uppercase font-semibold text-dim tracking-wider block mb-1.5">
              Live Alignment Preview (First 3 Segments)
            </span>
            <div className="space-y-1">
              {previewSegments.slice(0, 3).map((seg, idx) => (
                <div key={seg.id} className="flex items-center justify-between text-xs text-dim py-0.5 border-b border-hairline/30 last:border-0">
                  <span className="truncate max-w-[280px] text-cream">#{idx + 1}: &ldquo;{seg.text}&rdquo;</span>
                  <span className="font-mono text-[10px] text-accent shrink-0">
                    {seg.start.toFixed(2)}s &rarr; {seg.end.toFixed(2)}s
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t border-hairline bg-surface/50">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs text-dim hover:text-cream transition-colors cursor-pointer"
          >
            <RotateCcw size={13} /> Reset Alignment
          </button>
          <div className="flex items-center gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-xs font-medium text-dim hover:text-cream transition-colors cursor-pointer">
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-accent hover:bg-accent-hover text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              <Check size={14} /> Apply Sync
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
