"use client";

import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Merge,
  Minus,
  Move,
  Pause,
  Play,
  Plus,
  Scissors,
  Trash2,
  Type,
} from "lucide-react";
import { useMemo, useState } from "react";
import { cn } from "@/shared/lib/cn";
import { formatClockTime } from "../lib/captions";
import type { useCaptionEditor } from "../hooks/use-caption-editor";

const WAVEFORM_BARS = Array.from({ length: 120 }, (_, index) => 15 + ((index * 41 + 17) % 75));

type Props = {
  editor: ReturnType<typeof useCaptionEditor>;
  onSeek: (seconds: number) => void;
  isPlaying: boolean;
  onTogglePlayback: () => void;
  aspectRatio: "9:16" | "1:1" | "16:9";
  setAspectRatio: (ratio: "9:16" | "1:1" | "16:9") => void;
  textAlign: "left" | "center" | "right";
  setTextAlign: (align: "left" | "center" | "right") => void;
  position: "top" | "center" | "bottom" | "custom";
  setPosition: (pos: "top" | "center" | "bottom" | "custom") => void;
  fontSize: "sm" | "md" | "lg" | "xl";
  setFontSize: (size: "sm" | "md" | "lg" | "xl") => void;
};

export function CaptionTimeline({
  editor,
  onSeek,
  isPlaying,
  onTogglePlayback,
  aspectRatio,
  setAspectRatio,
  textAlign,
  setTextAlign,
  position,
  setPosition,
  fontSize,
  setFontSize,
}: Props) {
  const [zoom, setZoom] = useState(1);

  const currentVoiceId = editor.activeSegment?.id;
  const activeSegmentId = isPlaying
    ? (currentVoiceId || editor.selectedSegmentId)
    : (currentVoiceId || editor.selectedSegmentId || editor.segments[0]?.id);

  const selectedIndex = useMemo(
    () => editor.segments.findIndex((segment) => segment.id === (editor.selectedSegmentId || activeSegmentId)),
    [editor.segments, editor.selectedSegmentId, activeSegmentId],
  );

  const hasSelection = selectedIndex >= 0;
  const canMerge = hasSelection && selectedIndex < editor.segments.length - 1;
  const timelineDuration = Math.max(editor.duration, editor.segments.at(-1)?.end ?? 0, 0.1);
  const playheadPercent = Math.min(100, Math.max(0, (editor.currentTime / timelineDuration) * 100));

  return (
    <section className="bg-[#0a0b0b] font-sans h-full flex flex-col overflow-hidden">
      {/* Studio Action Toolbar */}
      <div className="flex min-h-12 flex-wrap items-center justify-between gap-2.5 border-b border-white/8 bg-[#0d0e0e] px-3 py-2 sm:px-5">
        {/* Left: Playback & Edit Actions (Split, Merge next, Delete) */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onTogglePlayback}
            className="grid size-8 shrink-0 place-items-center rounded-full bg-[#f6c453] text-black hover:scale-105 transition cursor-pointer shadow-[0_0_10px_rgba(246,196,83,0.3)]"
            aria-label={isPlaying ? "Pause video" : "Play video"}
          >
            {isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} className="ml-0.5 fill-currentColor" />}
          </button>

          <div className="flex items-center gap-1 text-xs font-bold tabular-nums text-cream pr-1">
            <span>{formatClockTime(editor.currentTime)}</span>
            <span className="text-[#626a6e]">/ {formatClockTime(timelineDuration)}</span>
          </div>

          <div className="h-4 w-px bg-white/10" />

          {/* Edit Actions: Split, Merge next, Delete */}
          <TimelineAction
            icon={Scissors}
            label="Split"
            hint="Split line at playhead"
            disabled={!hasSelection}
            onClick={() => editor.splitSegment(editor.selectedSegmentId)}
          />
          <TimelineAction
            icon={Merge}
            label="Merge next"
            hint="Combine with next line"
            disabled={!canMerge}
            onClick={() => editor.mergeWithNext(editor.selectedSegmentId)}
          />
          <TimelineAction
            icon={Trash2}
            label="Delete"
            hint="Remove selected line"
            disabled={!hasSelection}
            danger
            onClick={() => editor.deleteSegment(editor.selectedSegmentId)}
          />

          <div className="h-4 w-px bg-white/10 hidden sm:block" />

          {/* Timing Nudge Controls */}
          <div className="flex items-center gap-0.5 rounded-xl border border-white/10 bg-black/40 p-0.5">
            <button
              type="button"
              onClick={() => editor.nudgeTiming(-0.1)}
              className="rounded px-2 py-1 text-[10px] font-bold text-[#b0b0b0] hover:bg-[#f6c453]/20 hover:text-[#f6c453] transition cursor-pointer"
              title="Shift all captions 0.1s earlier"
            >
              -0.1s
            </button>
            <span className="text-[10px] font-bold text-[#666] px-0.5 uppercase">Sync</span>
            <button
              type="button"
              onClick={() => editor.nudgeTiming(0.1)}
              className="rounded px-2 py-1 text-[10px] font-bold text-[#b0b0b0] hover:bg-[#f6c453]/20 hover:text-[#f6c453] transition cursor-pointer"
              title="Shift all captions 0.1s later"
            >
              +0.1s
            </button>
          </div>
        </div>

        {/* Center: Formatting Settings (Ratio, Align, Position, Size) */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Ratio */}
          <div className="flex shrink-0 items-center gap-1 rounded-xl border border-white/10 bg-black/50 p-1">
            <span className="text-[10px] font-bold text-[#777] px-1 uppercase">Ratio</span>
            {(["9:16", "1:1", "16:9"] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setAspectRatio(r)}
                aria-pressed={aspectRatio === r}
                className={cn(
                  "min-h-7 rounded-lg px-2 py-0.5 text-[10px] font-bold transition cursor-pointer",
                  aspectRatio === r ? "bg-[#f6c453] text-black" : "text-[#888] hover:text-white",
                )}
              >
                {r}
              </button>
            ))}
          </div>

          {/* Alignment */}
          <div className="flex shrink-0 items-center gap-0.5 rounded-xl border border-white/10 bg-black/50 p-1">
            <button
              type="button"
              onClick={() => setTextAlign("left")}
              className={cn(
                "grid size-7 place-items-center rounded-lg transition cursor-pointer",
                textAlign === "left" ? "bg-[#f6c453] text-black" : "text-[#888] hover:text-white",
              )}
              title="Align Left"
            >
              <AlignLeft size={13} />
            </button>
            <button
              type="button"
              onClick={() => setTextAlign("center")}
              className={cn(
                "grid size-7 place-items-center rounded-lg transition cursor-pointer",
                textAlign === "center" ? "bg-[#f6c453] text-black" : "text-[#888] hover:text-white",
              )}
              title="Align Center"
            >
              <AlignCenter size={13} />
            </button>
            <button
              type="button"
              onClick={() => setTextAlign("right")}
              className={cn(
                "grid size-7 place-items-center rounded-lg transition cursor-pointer",
                textAlign === "right" ? "bg-[#f6c453] text-black" : "text-[#888] hover:text-white",
              )}
              title="Align Right"
            >
              <AlignRight size={13} />
            </button>
          </div>

          {/* Position */}
          <div className="flex shrink-0 items-center gap-1 rounded-xl border border-white/10 bg-black/50 p-1">
            <span className="text-[10px] font-bold text-[#777] px-1 uppercase flex items-center gap-1">
              <Move size={11} /> Pos
            </span>
            {(["top", "center", "bottom"] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPosition(p)}
                className={cn(
                  "min-h-7 rounded-lg px-2 py-0.5 text-[10px] font-bold capitalize transition cursor-pointer",
                  position === p ? "bg-[#f6c453] text-black" : "text-[#888] hover:text-white",
                )}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Size */}
          <div className="flex shrink-0 items-center gap-1 rounded-xl border border-white/10 bg-black/50 p-1">
            <span className="text-[10px] font-bold text-[#777] px-1 uppercase flex items-center gap-1">
              <Type size={11} /> Size
            </span>
            {(["sm", "md", "lg", "xl"] as const).map((sz) => (
              <button
                key={sz}
                type="button"
                onClick={() => setFontSize(sz)}
                className={cn(
                  "min-h-7 rounded-lg px-2 py-0.5 text-[10px] font-bold uppercase transition cursor-pointer",
                  fontSize === sz ? "bg-[#f6c453] text-black" : "text-[#888] hover:text-white",
                )}
              >
                {sz}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Zoom controls */}
        <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-black/40 p-1">
          <button
            type="button"
            onClick={() => setZoom((value) => Math.max(1, value - 0.5))}
            disabled={zoom === 1}
            className="grid size-7 place-items-center rounded-lg text-[#949b9e] hover:bg-white/10 hover:text-white disabled:opacity-30 transition cursor-pointer"
            aria-label="Zoom timeline out"
            title="Zoom Out"
          >
            <Minus size={13} />
          </button>
          <button
            type="button"
            onClick={() => setZoom(1)}
            className="w-9 text-center text-[10px] font-bold text-[#f6c453] hover:underline cursor-pointer"
            aria-label="Reset timeline zoom"
            title="Reset Zoom to 100%"
          >
            {Math.round(zoom * 100)}%
          </button>
          <button
            type="button"
            onClick={() => setZoom((value) => Math.min(3, value + 0.5))}
            disabled={zoom === 3}
            className="grid size-7 place-items-center rounded-lg text-[#949b9e] hover:bg-white/10 hover:text-white disabled:opacity-30 transition cursor-pointer"
            aria-label="Zoom timeline in"
            title="Zoom In"
          >
            <Plus size={13} />
          </button>
        </div>
      </div>

      {/* Video Seek Slider Bar */}
      <div className="border-b border-white/8 bg-[#0a0b0b] px-3 py-1.5 sm:px-5">
        <input
          type="range"
          min={0}
          max={Math.max(editor.duration, 0.1)}
          step={0.01}
          value={Math.min(editor.currentTime, editor.duration || 0)}
          onChange={(event) => onSeek(Number(event.target.value))}
          aria-label="Video seek position"
          className="w-full accent-[#f6c453] cursor-pointer h-1.5 rounded-lg"
        />
      </div>

      {/* Interactive Timeline Track */}
      <div className="flex-1 min-h-0 overflow-x-auto custom-scrollbar p-2 flex flex-col justify-center">
        <div
          className="relative h-full min-h-[92px] max-h-[110px] min-w-[760px] cursor-crosshair overflow-hidden rounded-xl border border-white/10 bg-[#080808] shadow-inner select-none"
          style={{ width: `${zoom * 100}%` }}
          onClick={(event) => {
            const bounds = event.currentTarget.getBoundingClientRect();
            onSeek(((event.clientX - bounds.left) / bounds.width) * timelineDuration);
          }}
        >
          {/* Top ruler track */}
          <div className="absolute inset-x-0 top-0 h-12 border-b border-white/8 bg-[#111213]">
            {editor.segments.map((segment, index) => {
              const left = (segment.start / timelineDuration) * 100;
              const width = Math.max(0.8, ((segment.end - segment.start) / timelineDuration) * 100);
              const isSpeaking = segment.id === currentVoiceId;
              const isSelected = segment.id === (editor.selectedSegmentId || activeSegmentId);
              const durationSec = (segment.end - segment.start).toFixed(1);

              return (
                <button
                  key={segment.id}
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    editor.setSelectedSegmentId(segment.id);
                    onSeek(segment.start);
                  }}
                  className={cn(
                    "absolute inset-y-1 overflow-hidden rounded-lg border px-2 text-left text-[11px] font-semibold transition-all duration-150 cursor-pointer",
                    isSpeaking
                      ? "z-20 border-[#f6c453] bg-[#f6c453]/35 text-white shadow-[0_0_18px_rgba(246,196,83,0.4)]"
                      : isSelected
                      ? "z-10 border-[#f6c453]/80 bg-[#f6c453]/15 text-white"
                      : "border-white/12 bg-[#1b1c1e] text-[#b8bebd] hover:border-white/30 hover:bg-[#25272a] hover:text-white",
                  )}
                  style={{ left: `${left}%`, width: `${width}%` }}
                  aria-label={`Select caption ${index + 1}: ${segment.text}`}
                  title={`Line ${index + 1} (${durationSec}s): ${segment.text}`}
                >
                  <div className="flex items-center justify-between gap-1 h-full">
                    <span className="truncate">{segment.text}</span>
                    <span className="hidden sm:inline-block shrink-0 rounded bg-black/40 px-1 py-0.2 text-[9px] font-mono text-[#f6c453]">
                      {durationSec}s
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Audio Waveform visualization */}
          <div className="absolute inset-x-0 bottom-0 flex h-11 items-end gap-[3px] px-2 opacity-80" aria-hidden="true">
            {WAVEFORM_BARS.map((height, index) => {
              const barPercent = (index / WAVEFORM_BARS.length) * 100;
              const isPast = barPercent <= playheadPercent;
              return (
                <span
                  key={index}
                  className={cn(
                    "min-w-[2.5px] flex-1 rounded-t-sm transition-colors duration-75",
                    isPast ? "bg-[#f6c453]" : "bg-white/15",
                  )}
                  style={{ height: `${height}%` }}
                />
              );
            })}
          </div>

          {/* Playhead Needle */}
          <div
            className="pointer-events-none absolute inset-y-0 z-30 w-0.5 bg-[#f6c453] shadow-[0_0_10px_#f6c453]"
            style={{ left: `${playheadPercent}%` }}
          >
            <div className="absolute -left-2.5 -top-1 flex h-4 items-center justify-center rounded bg-[#f6c453] px-1 text-[9px] font-black text-black shadow-md">
              {formatClockTime(editor.currentTime)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

type TimelineActionProps = {
  icon: typeof Scissors;
  label: string;
  hint?: string;
  disabled: boolean;
  danger?: boolean;
  onClick: () => void;
};

function TimelineAction({ icon: Icon, label, hint, disabled, danger, onClick }: TimelineActionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={hint}
      className={cn(
        "flex min-h-8 items-center gap-1.5 rounded-lg border px-2.5 text-[11px] font-semibold transition cursor-pointer disabled:cursor-not-allowed disabled:opacity-30",
        danger
          ? "border-red-500/30 bg-red-500/10 text-red-300 hover:bg-red-500/20 hover:border-red-400"
          : "border-white/12 bg-white/5 text-[#c4c9cc] hover:border-[#f6c453]/50 hover:bg-[#f6c453]/10 hover:text-white",
      )}
    >
      <Icon size={13} className={danger ? "text-red-400" : "text-[#f6c453]"} /> {label}
    </button>
  );
}
