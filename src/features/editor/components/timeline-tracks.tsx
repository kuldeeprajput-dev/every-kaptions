"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/shared/lib/cn";
import { formatClockTime } from "../lib/captions";
import type { CaptionSegment } from "../types/captions";

export const WAVEFORM_BARS = Array.from(
  { length: 120 },
  (_, index) => 15 + ((index * 41 + 17) % 75),
);

export interface TimelineTracksProps {
  segments: CaptionSegment[];
  timelineDuration: number;
  currentTime: number;
  currentVoiceId?: string;
  selectedSegmentId?: string | null;
  zoom: number;
  onSeek: (seconds: number) => void;
  onSelectSegment: (id: string, start: number) => void;
  onTrimSegment?: (id: string, newStart: number, newEnd: number) => void;
  className?: string;
}

export function TimelineTracks({
  segments,
  timelineDuration,
  currentTime,
  currentVoiceId,
  selectedSegmentId,
  zoom,
  onSeek,
  onSelectSegment,
  className,
}: TimelineTracksProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [hoverTime, setHoverTime] = useState<number | null>(null);

  const durationSafe = Math.max(timelineDuration, 0.1);
  const playheadPercent = Math.min(100, Math.max(0, (currentTime / durationSafe) * 100));

  const getTimeFromEvent = (clientX: number) => {
    if (!trackRef.current) return 0;
    const rect = trackRef.current.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    return ratio * durationSafe;
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsScrubbing(true);
    onSeek(getTimeFromEvent(e.clientX));
  };

  useEffect(() => {
    if (!isScrubbing) return;

    const handlePointerMove = (e: PointerEvent) => {
      onSeek(getTimeFromEvent(e.clientX));
    };

    const handlePointerUp = () => {
      setIsScrubbing(false);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [isScrubbing, durationSafe]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    setHoverTime(getTimeFromEvent(e.clientX));
  };

  const rulerMarks = useMemo(() => {
    const marksCount = Math.max(4, Math.floor(durationSafe / 2));
    const step = durationSafe / marksCount;
    return Array.from({ length: marksCount + 1 }, (_, i) => i * step);
  }, [durationSafe]);

  return (
    <div
      className={cn(
        "flex-1 min-h-0 overflow-x-auto custom-scrollbar p-2 flex flex-col justify-center font-sans",
        className,
      )}
    >
      <div
        ref={trackRef}
        onPointerDown={handlePointerDown}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoverTime(null)}
        style={{ width: `${zoom * 100}%` }}
        role="slider"
        aria-label="Timeline scrubber"
        aria-valuemin={0}
        aria-valuemax={durationSafe}
        aria-valuenow={currentTime}
        className="relative h-full min-h-[96px] max-h-[115px] min-w-[760px] cursor-crosshair overflow-hidden rounded-xl border border-hairline bg-surface shadow-sm select-none"
      >
        {/* Track 1: Caption Blocks Track */}
        <div className="absolute inset-x-0 top-0 h-12 border-b border-hairline bg-surface">
          {segments.map((segment, index) => {
            const left = (segment.start / durationSafe) * 100;
            const width = Math.max(
              0.8,
              ((segment.end - segment.start) / durationSafe) * 100,
            );
            const isSpeaking = segment.id === currentVoiceId;
            const isSelected = segment.id === selectedSegmentId;
            const durationSec = (segment.end - segment.start).toFixed(1);

            return (
              <button
                key={segment.id}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectSegment(segment.id, segment.start);
                }}
                className={cn(
                  "absolute inset-y-1 overflow-hidden rounded-lg border px-2 text-left text-[11px] font-semibold transition-all duration-150 cursor-pointer",
                  isSpeaking
                    ? "z-20 border-amber bg-amber/35 text-cream shadow-sm"
                    : isSelected
                    ? "z-10 border-amber/80 bg-amber/15 text-cream"
                    : "border-hairline bg-surface-raised text-cream hover:border-amber/40 hover:bg-surface",
                )}
                style={{ left: `${left}%`, width: `${width}%` }}
                aria-label={`Select caption line ${index + 1}: ${segment.text}`}
                title={`Line ${index + 1} (${durationSec}s): ${segment.text}`}
              >
                <div className="flex h-full flex-col justify-between py-0.5">
                  <div className="flex items-center justify-between text-[9px] font-mono text-body">
                    <span className="font-bold text-amber">#{index + 1}</span>
                    <span>{durationSec}s</span>
                  </div>
                  <p className="truncate text-[10px] leading-tight text-cream">
                    {segment.text}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Track 2: Audio Waveform Track */}
        <div className="absolute inset-x-0 bottom-0 h-11 flex items-end justify-between px-2 pb-1.5 opacity-60">
          {WAVEFORM_BARS.map((height, idx) => {
            const barLeft = (idx / WAVEFORM_BARS.length) * 100;
            const isPlayed = barLeft <= playheadPercent;
            return (
              <span
                key={idx}
                style={{ height: `${height * 0.42}px` }}
                className={cn(
                  "w-1 rounded-full transition-colors",
                  isPlayed ? "bg-amber/90" : "bg-dim/40",
                )}
              />
            );
          })}
        </div>

        {/* Time ruler marks */}
        <div className="absolute inset-x-0 bottom-0 pointer-events-none flex justify-between px-3 text-[9px] font-mono text-dim">
          {rulerMarks.map((time, idx) => (
            <span key={idx}>{formatClockTime(time)}</span>
          ))}
        </div>

        {/* Hover Time Indicator */}
        {hoverTime !== null && !isScrubbing && (
          <div
            style={{ left: `${(hoverTime / durationSafe) * 100}%` }}
            className="pointer-events-none absolute inset-y-0 z-20 -ml-px w-px border-l border-dashed border-dim"
          >
            <span className="absolute -top-1 -translate-x-1/2 rounded bg-surface border border-hairline px-1 text-[8px] font-mono text-body shadow-xs">
              {formatClockTime(hoverTime)}
            </span>
          </div>
        )}

        {/* Playhead needle */}
        <div
          style={{ left: `${playheadPercent}%` }}
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 z-30 -ml-px w-0.5 bg-amber transition-all duration-75"
        >
          <div className="absolute -top-1 -left-1.5 size-3.5 rotate-45 rounded-xs bg-amber shadow-sm" />
          <div className="absolute top-2 -left-3 rounded-full bg-amber px-1 text-[8px] font-mono font-bold text-white shadow-xs">
            {currentTime.toFixed(1)}s
          </div>
        </div>
      </div>
    </div>
  );
}
