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
  RotateCcw,
  RotateCw,
  Scissors,
  Trash2,
  Type,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/shared/lib/cn";
import { formatClockTime } from "../lib/captions";
import type { useCaptionEditor } from "../hooks/use-caption-editor";
import { TimelineTracks } from "./timeline-tracks";

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

  const timelineDuration = Math.max(editor.duration, 0.1);

  return (
    <section
      role="region"
      aria-label="Caption timing and media controls"
      className="flex flex-col border-t border-hairline bg-surface select-none font-sans shrink-0"
    >
      {/* Top Action & Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-hairline px-3 py-2 sm:px-5">
        {/* Left: Playback & Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Play / Pause Primary Button */}
          <button
            type="button"
            onClick={onTogglePlayback}
            className="flex h-8 items-center gap-1.5 rounded-lg bg-amber px-3 text-xs font-bold text-white transition hover:brightness-105 cursor-pointer shadow-sm"
            aria-label={isPlaying ? "Pause video playback" : "Start video playback"}
          >
            {isPlaying ? (
              <Pause size={14} className="fill-white" />
            ) : (
              <Play size={14} className="fill-white ml-0.5" />
            )}
            <span>{isPlaying ? "Pause" : "Play"}</span>
          </button>

          {/* Skip buttons: Jump -2s / +2s */}
          <div className="flex items-center rounded-lg border border-hairline bg-surface-raised p-0.5">
            <button
              type="button"
              onClick={() => editor.setCurrentTime(Math.max(0, editor.currentTime - 2))}
              className="grid size-7 place-items-center rounded text-body hover:bg-surface hover:text-cream transition cursor-pointer"
              aria-label="Skip backward 2 seconds"
              title="Skip -2s"
            >
              <RotateCcw size={13} />
            </button>
            <button
              type="button"
              onClick={() => editor.setCurrentTime(Math.min(timelineDuration, editor.currentTime + 2))}
              className="grid size-7 place-items-center rounded text-body hover:bg-surface hover:text-cream transition cursor-pointer"
              aria-label="Skip forward 2 seconds"
              title="Skip +2s"
            >
              <RotateCw size={13} />
            </button>
          </div>

          {/* Time Display */}
          <div className="rounded-lg border border-hairline bg-surface-raised px-2.5 py-1 text-xs font-mono font-bold text-cream">
            <span className="text-amber">{formatClockTime(editor.currentTime)}</span>
            <span className="text-dim"> / {formatClockTime(timelineDuration)}</span>
          </div>

          <div className="h-4 w-px bg-hairline hidden sm:block" />

          {/* Segment Edit Actions */}
          <div className="flex items-center gap-1">
            <TimelineAction
              icon={Scissors}
              label="Split"
              hint="Split selected caption at current timecode"
              disabled={!activeSegmentId}
              onClick={() => activeSegmentId && editor.splitSegment(activeSegmentId)}
            />
            <TimelineAction
              icon={Merge}
              label="Merge"
              hint="Merge caption with the next line"
              disabled={!activeSegmentId}
              onClick={() => activeSegmentId && editor.mergeWithNext(activeSegmentId)}
            />
            <TimelineAction
              icon={Trash2}
              label="Delete"
              hint="Remove this caption line"
              disabled={!activeSegmentId}
              danger
              onClick={() => activeSegmentId && editor.deleteSegment(activeSegmentId)}
            />
          </div>
        </div>

        {/* Center: Formatting Quick Settings */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Ratio */}
          <div className="flex shrink-0 items-center gap-1 rounded-xl border border-hairline bg-surface-raised p-1">
            <span className="text-[10px] font-bold text-dim px-1 uppercase">Ratio</span>
            {(["9:16", "1:1", "16:9"] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setAspectRatio(r)}
                aria-pressed={aspectRatio === r}
                className={cn(
                  "min-h-7 rounded-lg px-2 py-0.5 text-[10px] font-bold transition cursor-pointer",
                  aspectRatio === r ? "bg-amber text-white" : "text-body hover:text-cream",
                )}
              >
                {r}
              </button>
            ))}
          </div>

          {/* Alignment */}
          <div className="flex shrink-0 items-center gap-0.5 rounded-xl border border-hairline bg-surface-raised p-1">
            <button
              type="button"
              onClick={() => setTextAlign("left")}
              className={cn(
                "grid size-7 place-items-center rounded-lg transition cursor-pointer",
                textAlign === "left" ? "bg-amber text-white" : "text-body hover:text-cream",
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
                textAlign === "center" ? "bg-amber text-white" : "text-body hover:text-cream",
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
                textAlign === "right" ? "bg-amber text-white" : "text-body hover:text-cream",
              )}
              title="Align Right"
            >
              <AlignRight size={13} />
            </button>
          </div>

          {/* Position */}
          <div className="flex shrink-0 items-center gap-1 rounded-xl border border-hairline bg-surface-raised p-1">
            <span className="text-[10px] font-bold text-dim px-1 uppercase flex items-center gap-1">
              <Move size={11} /> Pos
            </span>
            {(["top", "center", "bottom"] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPosition(p)}
                className={cn(
                  "min-h-7 rounded-lg px-2 py-0.5 text-[10px] font-bold capitalize transition cursor-pointer",
                  position === p ? "bg-amber text-white" : "text-body hover:text-cream",
                )}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Size */}
          <div className="flex shrink-0 items-center gap-1 rounded-xl border border-hairline bg-surface-raised p-1">
            <span className="text-[10px] font-bold text-dim px-1 uppercase flex items-center gap-1">
              <Type size={11} /> Size
            </span>
            {(["sm", "md", "lg", "xl"] as const).map((sz) => (
              <button
                key={sz}
                type="button"
                onClick={() => setFontSize(sz)}
                className={cn(
                  "min-h-7 rounded-lg px-2 py-0.5 text-[10px] font-bold uppercase transition cursor-pointer",
                  fontSize === sz ? "bg-amber text-white" : "text-body hover:text-cream",
                )}
              >
                {sz}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Zoom controls */}
        <div className="flex items-center gap-1 rounded-xl border border-hairline bg-surface-raised p-1">
          <button
            type="button"
            onClick={() => setZoom((value) => Math.max(1, value - 0.5))}
            disabled={zoom === 1}
            className="grid size-7 place-items-center rounded-lg text-body hover:bg-surface-raised hover:text-cream disabled:opacity-30 transition cursor-pointer"
            aria-label="Zoom timeline out"
            title="Zoom Out"
          >
            <Minus size={13} />
          </button>
          <button
            type="button"
            onClick={() => setZoom(1)}
            className="w-9 text-center text-[10px] font-bold text-amber hover:underline cursor-pointer"
            aria-label="Reset timeline zoom"
            title="Reset Zoom to 100%"
          >
            {Math.round(zoom * 100)}%
          </button>
          <button
            type="button"
            onClick={() => setZoom((value) => Math.min(3, value + 0.5))}
            disabled={zoom === 3}
            className="grid size-7 place-items-center rounded-lg text-body hover:bg-surface-raised hover:text-cream disabled:opacity-30 transition cursor-pointer"
            aria-label="Zoom timeline in"
            title="Zoom In"
          >
            <Plus size={13} />
          </button>
        </div>
      </div>

      {/* Video Seek Slider Bar */}
      <div className="border-b border-hairline bg-surface px-3 py-1.5 sm:px-5">
        <input
          type="range"
          min={0}
          max={Math.max(editor.duration, 0.1)}
          step={0.01}
          value={Math.min(editor.currentTime, editor.duration || 0)}
          onChange={(event) => onSeek(Number(event.target.value))}
          aria-label="Video seek position"
          className="w-full accent-amber cursor-pointer h-1.5 rounded-lg"
        />
      </div>

      {/* Modular Multi-Track Timeline */}
      <TimelineTracks
        segments={editor.segments}
        timelineDuration={timelineDuration}
        currentTime={editor.currentTime}
        currentVoiceId={currentVoiceId}
        selectedSegmentId={editor.selectedSegmentId || activeSegmentId}
        zoom={zoom}
        onSeek={onSeek}
        onSelectSegment={(id, start) => {
          editor.setSelectedSegmentId(id);
          onSeek(start);
        }}
      />
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
          ? "border-red-500/30 bg-red-500/10 text-red-700 hover:bg-red-500/20 hover:border-red-400"
          : "border-hairline bg-surface-raised text-cream hover:border-amber/50 hover:bg-amber/10 hover:text-cream",
      )}
    >
      <Icon size={13} className={danger ? "text-red-400" : "text-amber"} /> {label}
    </button>
  );
}
