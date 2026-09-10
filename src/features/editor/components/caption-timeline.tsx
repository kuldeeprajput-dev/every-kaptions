"use client";

import { Merge, Minus, Plus, Scissors, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { cn } from "@/shared/lib/cn";
import { formatClockTime } from "../lib/captions";
import type { useCaptionEditor } from "../hooks/use-caption-editor";

const WAVEFORM_BARS = Array.from({ length: 96 }, (_, index) => 20 + ((index * 37) % 68));

type Props = {
  editor: ReturnType<typeof useCaptionEditor>;
  onSeek: (seconds: number) => void;
};

export function CaptionTimeline({ editor, onSeek }: Props) {
  const [zoom, setZoom] = useState(1);
  const selectedIndex = useMemo(
    () => editor.segments.findIndex((segment) => segment.id === editor.selectedSegmentId),
    [editor.segments, editor.selectedSegmentId],
  );
  const hasSelection = selectedIndex >= 0;
  const canMerge = hasSelection && selectedIndex < editor.segments.length - 1;
  const timelineDuration = Math.max(editor.duration, editor.segments.at(-1)?.end ?? 0, 0.1);
  const playhead = Math.min(100, Math.max(0, (editor.currentTime / timelineDuration) * 100));

  return (
    <section className="border-t border-white/10 bg-[#0d0e0e] lg:h-[180px]">
      <div className="flex min-h-14 flex-wrap items-center gap-2 border-b border-white/8 px-3 py-2 sm:px-4">
        <span className="mr-2 text-xs font-semibold tabular-nums text-cream">
          {formatClockTime(editor.currentTime)} <span className="text-[#697277]">/ {formatClockTime(timelineDuration)}</span>
        </span>
        <TimelineAction
          icon={Scissors}
          label="Split"
          disabled={!hasSelection}
          onClick={() => editor.splitSegment(editor.selectedSegmentId)}
        />
        <TimelineAction
          icon={Merge}
          label="Merge next"
          disabled={!canMerge}
          onClick={() => editor.mergeWithNext(editor.selectedSegmentId)}
        />
        <TimelineAction
          icon={Trash2}
          label="Delete"
          disabled={!hasSelection}
          onClick={() => editor.deleteSegment(editor.selectedSegmentId)}
        />
        <p className="hidden text-[11px] text-[#626a6e] md:block">Select a caption, then split at the playhead or merge it with the next line.</p>
        <div className="ml-auto flex items-center gap-1 rounded-lg border border-white/10 p-1">
          <button
            type="button"
            onClick={() => setZoom((value) => Math.max(1, value - 0.5))}
            disabled={zoom === 1}
            className="grid size-8 place-items-center rounded-md text-[#949b9e] hover:bg-white/5 disabled:opacity-30"
            aria-label="Zoom timeline out"
          >
            <Minus size={15} />
          </button>
          <button
            type="button"
            onClick={() => setZoom(1)}
            className="w-9 text-center text-[10px] font-semibold text-[#7b8488] hover:text-white"
            aria-label="Reset timeline zoom"
          >
            {zoom}×
          </button>
          <button
            type="button"
            onClick={() => setZoom((value) => Math.min(3, value + 0.5))}
            disabled={zoom === 3}
            className="grid size-8 place-items-center rounded-md text-[#949b9e] hover:bg-white/5 disabled:opacity-30"
            aria-label="Zoom timeline in"
          >
            <Plus size={15} />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto overscroll-x-contain p-2 sm:p-3">
        <div
          className="relative h-24 min-w-[720px] cursor-crosshair overflow-hidden rounded-lg border border-white/8 bg-black"
          style={{ width: `${zoom * 100}%` }}
          onClick={(event) => {
            const bounds = event.currentTarget.getBoundingClientRect();
            onSeek(((event.clientX - bounds.left) / bounds.width) * timelineDuration);
          }}
        >
          <div className="absolute inset-x-0 top-0 h-11 border-b border-white/8 bg-[#141515]">
            {editor.segments.map((segment, index) => {
              const left = (segment.start / timelineDuration) * 100;
              const width = Math.max(0.7, ((segment.end - segment.start) / timelineDuration) * 100);
              const selected = segment.id === editor.selectedSegmentId;
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
                    "absolute inset-y-1 overflow-hidden rounded border px-2 text-left text-[10px] leading-4",
                    selected ? "z-10 border-amber bg-amber/20 text-cream" : "border-white/15 bg-[#202222] text-[#a1a7aa] hover:border-white/30",
                  )}
                  style={{ left: `${left}%`, width: `${width}%` }}
                  aria-label={`Select caption ${index + 1}: ${segment.text}`}
                >
                  <span className="block truncate">{segment.text}</span>
                </button>
              );
            })}
          </div>

          <div className="absolute inset-x-0 bottom-0 flex h-12 items-end gap-[2px] px-1 opacity-75" aria-hidden="true">
            {WAVEFORM_BARS.map((height, index) => (
              <span key={index} className="min-w-[3px] flex-1 rounded-sm bg-amber/70" style={{ height: `${height}%` }} />
            ))}
          </div>
          <div className="pointer-events-none absolute inset-y-0 z-20 w-px bg-white" style={{ left: `${playhead}%` }}>
            <span className="absolute -left-1 -top-0.5 size-2 rounded-full bg-white" />
          </div>
        </div>
      </div>
    </section>
  );
}

type TimelineActionProps = {
  icon: typeof Scissors;
  label: string;
  disabled: boolean;
  onClick: () => void;
};

function TimelineAction({ icon: Icon, label, disabled, onClick }: TimelineActionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex min-h-9 items-center gap-1.5 rounded-lg border border-white/10 px-2.5 text-[11px] font-semibold text-[#b4b9bb] transition hover:border-white/20 hover:text-white disabled:cursor-not-allowed disabled:opacity-35"
    >
      <Icon size={14} /> {label}
    </button>
  );
}
