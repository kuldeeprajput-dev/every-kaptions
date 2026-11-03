"use client";

import { useId, useMemo, useRef, useState } from "react";
import { Activity, Check, Play, RotateCcw, Volume2, X, ZoomIn, ZoomOut } from "lucide-react";
import { cn } from "@/shared/lib/cn";
import { useDialogFocus } from "@/shared/hooks/use-dialog-focus";
import type { CaptionSegment } from "../types/captions";

export interface EditorWaveformMinimapProps {
  isOpen: boolean;
  onClose: () => void;
  segments: CaptionSegment[];
  videoDuration: number;
  currentPlayhead: number;
  onSeek: (timestamp: number) => void;
}

export function EditorWaveformMinimap({
  isOpen,
  onClose,
  segments,
  videoDuration,
  currentPlayhead,
  onSeek,
}: EditorWaveformMinimapProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  useDialogFocus(dialogRef, isOpen);

  const [zoomLevel, setZoomLevel] = useState<1 | 2 | 4>(1);
  const [showSegmentHighlights, setShowSegmentHighlights] = useState(true);

  const duration = Math.max(videoDuration || 1, 10);

  const waveformBars = useMemo(() => {
    const barCount = 120 * zoomLevel;
    const bars: { height: number; isSpeech: boolean; time: number }[] = [];

    for (let i = 0; i < barCount; i++) {
      const time = (i / barCount) * duration;
      const isSpeech = segments.some((s) => time >= s.start && time <= s.end);
      const baseHeight = isSpeech ? 0.35 + Math.sin(i * 0.7) * 0.25 + (i % 3) * 0.12 : 0.08 + (i % 2) * 0.04;
      bars.push({
        height: Math.min(1, Math.max(0.06, baseHeight)),
        isSpeech,
        time,
      });
    }
    return bars;
  }, [duration, segments, zoomLevel]);

  if (!isOpen) return null;

  const handleMinimapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percent = Math.max(0, Math.min(1, clickX / rect.width));
    onSeek(percent * duration);
  };

  const playheadPercent = Math.max(0, Math.min(100, (currentPlayhead / duration) * 100));

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
            <div className="p-2 rounded-xl bg-accent/10 text-accent"><Activity size={18} /></div>
            <div>
              <h2 id={titleId} className="text-sm font-semibold text-cream">Audio Waveform Minimap</h2>
              <p className="text-xs text-dim">Navigate speech peaks, pauses, and scrub the full timeline</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg text-dim hover:text-cream hover:bg-surface transition-colors cursor-pointer" aria-label="Close waveform minimap">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-dim uppercase tracking-wider">Playhead Position</span>
              <span className="px-2 py-0.5 rounded border border-hairline bg-surface text-accent font-mono text-xs font-bold">
                {currentPlayhead.toFixed(2)}s / {duration.toFixed(1)}s
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setZoomLevel(zoomLevel === 1 ? 1 : zoomLevel === 2 ? 1 : 2)}
                className="p-1 rounded text-dim hover:text-cream border border-hairline bg-surface cursor-pointer"
                title="Zoom out"
              >
                <ZoomOut size={13} />
              </button>
              <span className="text-[11px] font-mono text-dim w-8 text-center">{zoomLevel}x</span>
              <button
                type="button"
                onClick={() => setZoomLevel(zoomLevel === 1 ? 2 : 4)}
                className="p-1 rounded text-dim hover:text-cream border border-hairline bg-surface cursor-pointer"
                title="Zoom in"
              >
                <ZoomIn size={13} />
              </button>
            </div>
          </div>

          <div
            onClick={handleMinimapClick}
            className="h-28 rounded-xl border border-hairline bg-surface/60 relative overflow-hidden cursor-crosshair p-2 flex items-center group"
          >
            {showSegmentHighlights &&
              segments.map((seg) => {
                const leftPercent = (seg.start / duration) * 100;
                const widthPercent = ((seg.end - seg.start) / duration) * 100;
                return (
                  <div
                    key={seg.id}
                    style={{ left: `${leftPercent}%`, width: `${widthPercent}%` }}
                    className="absolute top-0 bottom-0 bg-accent/15 border-x border-accent/30 pointer-events-none"
                  />
                );
              })}

            <div className="w-full h-full flex items-center justify-between gap-[2px]">
              {waveformBars.map((bar, idx) => (
                <div
                  key={idx}
                  style={{ height: `${bar.height * 100}%` }}
                  className={cn(
                    "flex-1 rounded-full transition-colors",
                    bar.isSpeech ? "bg-accent/80 group-hover:bg-accent" : "bg-hairline/70",
                  )}
                />
              ))}
            </div>

            <div
              style={{ left: `${playheadPercent}%` }}
              className="absolute top-0 bottom-0 w-[2px] bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)] z-10 pointer-events-none"
            >
              <div className="w-2.5 h-2.5 rounded-full bg-white -ml-1 -mt-0.5 shadow-sm" />
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-dim font-mono">
            <span>00:00.0</span>
            <span>Jump anywhere on waveform to seek instantly</span>
            <span>{Math.floor(duration / 60)}:{(duration % 60).toFixed(1).padStart(4, "0")}</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl border border-hairline bg-surface/30">
            <div className="flex items-center gap-2">
              <Volume2 size={14} className="text-accent" />
              <div>
                <span className="text-xs font-semibold text-cream">Highlight Active Caption Bursts</span>
                <p className="text-[10px] text-dim">Shades speech regions with yellow accent glow</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={showSegmentHighlights}
              onChange={(e) => setShowSegmentHighlights(e.target.checked)}
              className="accent-accent w-4 h-4 cursor-pointer"
            />
          </div>

          <div className="p-3 rounded-xl border border-hairline bg-surface/40 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-cream">
              <Play size={13} className="text-accent" />
              <span>Segments Count: <strong className="font-mono text-accent">{segments.length}</strong></span>
            </div>
            <span className="text-[11px] text-dim">Clicking scrubbing lane repositions the video preview</span>
          </div>
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t border-hairline bg-surface/50">
          <button
            type="button"
            onClick={() => { setZoomLevel(1); setShowSegmentHighlights(true); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs text-dim hover:text-cream transition-colors cursor-pointer"
          >
            <RotateCcw size={13} /> Reset View
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-accent hover:bg-accent-hover text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            <Check size={14} /> Done
          </button>
        </div>
      </div>
    </div>
  );
}
