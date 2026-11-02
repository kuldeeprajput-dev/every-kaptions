"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Eye, FlipHorizontal, Pause, Play, RotateCcw, X } from "lucide-react";
import { cn } from "@/shared/lib/cn";
import { useDialogFocus } from "@/shared/hooks/use-dialog-focus";
import type { CaptionSegment } from "../types/captions";

export interface EditorTeleprompterModalProps {
  isOpen: boolean;
  onClose: () => void;
  segments: CaptionSegment[];
}

export function EditorTeleprompterModal({
  isOpen,
  onClose,
  segments,
}: EditorTeleprompterModalProps) {
  const dialogId = useId();
  const titleId = `${dialogId}-title`;
  const dialogRef = useRef<HTMLDivElement>(null);
  useDialogFocus(dialogRef, isOpen);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [wordsPerMinute, setWordsPerMinute] = useState<number>(145);
  const [fontSizePx, setFontSizePx] = useState<number>(32);
  const [isMirrored, setIsMirrored] = useState<boolean>(false);
  const [showEyeGuide, setShowEyeGuide] = useState<boolean>(true);
  const [activeSegmentIndex, setActiveSegmentIndex] = useState<number>(0);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      if (scrollContainerRef.current) {
        const pixelsPerTick = (wordsPerMinute / 60) * 1.8;
        scrollContainerRef.current.scrollTop += pixelsPerTick;
      }
    }, 50);
    return () => clearInterval(interval);
  }, [isPlaying, wordsPerMinute]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        setIsPlaying((p) => !p);
      } else if (e.code === "ArrowUp") {
        e.preventDefault();
        setWordsPerMinute((w) => Math.min(240, w + 10));
      } else if (e.code === "ArrowDown") {
        e.preventDefault();
        setWordsPerMinute((w) => Math.max(80, w - 10));
      }
    };
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleReset = () => {
    setIsPlaying(false);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
    setActiveSegmentIndex(0);
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-[fadeIn_0.15s_ease-out]">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="w-full max-w-3xl bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[85vh] relative"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-900/80 z-20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center text-accent">
              <Eye size={18} />
            </div>
            <div>
              <h2 id={titleId} className="text-sm font-semibold text-white">Creator Studio Teleprompter</h2>
              <p className="text-xs text-zinc-400">Press Spacebar to play/pause • Up/Down arrows to change reading pace</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsMirrored(!isMirrored)}
              className={cn(
                "px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer",
                isMirrored ? "border-accent bg-accent/20 text-accent" : "border-zinc-700 text-zinc-400 hover:text-white",
              )}
              title="Flip horizontally for teleprompter glass reflection"
            >
              <FlipHorizontal size={14} /> Mirror Display
            </button>
            <button type="button" onClick={onClose} className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer" aria-label="Close teleprompter">
              <X size={18} />
            </button>
          </div>
        </div>

        {showEyeGuide && (
          <div className="absolute top-1/2 left-0 right-0 z-10 pointer-events-none flex items-center justify-between px-4 border-t border-b border-accent/30 bg-accent/5 py-1">
            <span className="text-[10px] font-mono text-accent uppercase tracking-wider">Reading Eye Level</span>
            <span className="text-[10px] font-mono text-accent uppercase tracking-wider">▲ Focus Here</span>
          </div>
        )}

        <div
          ref={scrollContainerRef}
          style={{ transform: isMirrored ? "scaleX(-1)" : "none" }}
          className="flex-1 overflow-y-auto px-10 py-24 space-y-8 select-none scroll-smooth bg-black relative"
        >
          {segments.map((seg, idx) => {
            const isActive = activeSegmentIndex === idx;
            return (
              <p
                key={seg.id}
                onClick={() => setActiveSegmentIndex(idx)}
                style={{ fontSize: `${fontSizePx}px`, lineHeight: 1.45 }}
                className={cn(
                  "font-bold transition-all cursor-pointer",
                  isActive
                    ? "text-accent drop-shadow-[0_0_14px_rgba(255,75,75,0.5)]"
                    : "text-zinc-500 hover:text-zinc-300",
                )}
              >
                {seg.text}
              </p>
            );
          })}
          <div className="h-64" />
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-800 bg-zinc-900/90 text-xs z-20">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-5 py-2 rounded-xl bg-accent hover:bg-accent/90 text-white font-bold flex items-center gap-2 cursor-pointer shadow-lg transition-transform active:scale-95"
            >
              {isPlaying ? <Pause size={15} /> : <Play size={15} />}
              <span>{isPlaying ? "Pause (Space)" : "Start (Space)"}</span>
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="p-2 rounded-xl border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
              title="Rewind to top"
            >
              <RotateCcw size={15} />
            </button>
            <label className="flex items-center gap-1.5 cursor-pointer text-zinc-400 hover:text-white ml-2">
              <input
                type="checkbox"
                checked={showEyeGuide}
                onChange={(e) => setShowEyeGuide(e.target.checked)}
                className="rounded accent-accent"
              />
              <span className="text-[11px]">Eye Guide</span>
            </label>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-zinc-400">Pace:</span>
              <span className="text-white font-mono">{wordsPerMinute} WPM</span>
              <input
                type="range"
                min="90"
                max="220"
                step="5"
                value={wordsPerMinute}
                onChange={(e) => setWordsPerMinute(parseInt(e.target.value, 10))}
                className="w-24 accent-accent h-1 bg-zinc-800 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-zinc-400">Size:</span>
              <span className="text-white font-mono">{fontSizePx}px</span>
              <input
                type="range"
                min="20"
                max="52"
                step="2"
                value={fontSizePx}
                onChange={(e) => setFontSizePx(parseInt(e.target.value, 10))}
                className="w-24 accent-accent h-1 bg-zinc-800 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
