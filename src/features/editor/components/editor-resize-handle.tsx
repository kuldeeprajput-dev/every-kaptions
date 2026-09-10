"use client";

import { GripHorizontal, GripVertical } from "lucide-react";
import type { KeyboardEvent, PointerEvent } from "react";
import { cn } from "@/shared/lib/cn";
import type { EditorPanel } from "../hooks/use-resizable-editor-layout";

type Props = {
  panel: EditorPanel;
  orientation: "horizontal" | "vertical";
  active: boolean;
  onPointerDown: (panel: EditorPanel, event: PointerEvent<HTMLButtonElement>) => void;
  onResizeBy: (panel: EditorPanel, amount: number) => void;
};

const LABELS: Record<EditorPanel, string> = {
  captions: "Resize caption list",
  styles: "Resize caption style panel",
  timeline: "Resize timeline",
};

export function EditorResizeHandle({
  panel,
  orientation,
  active,
  onPointerDown,
  onResizeBy,
}: Props) {
  const isVertical = orientation === "vertical";

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const direction = panel === "styles" ? -1 : 1;
    const step = event.shiftKey ? 40 : 12;

    if (isVertical && (event.key === "ArrowLeft" || event.key === "ArrowRight")) {
      event.preventDefault();
      onResizeBy(panel, (event.key === "ArrowRight" ? step : -step) * direction);
    }

    if (!isVertical && (event.key === "ArrowUp" || event.key === "ArrowDown")) {
      event.preventDefault();
      onResizeBy(panel, event.key === "ArrowUp" ? step : -step);
    }
  };

  return (
    <button
      type="button"
      role="separator"
      aria-label={LABELS[panel]}
      aria-orientation={isVertical ? "vertical" : "horizontal"}
      aria-valuemin={panel === "timeline" ? 150 : panel === "captions" ? 250 : 270}
      aria-valuemax={panel === "timeline" ? 360 : panel === "captions" ? 480 : 440}
      onPointerDown={(event) => onPointerDown(panel, event)}
      onKeyDown={handleKeyDown}
      className={cn(
        "group hidden touch-none items-center justify-center bg-[#0a0b0a] text-[#596064] outline-none transition hover:bg-[#171713] hover:text-[#f6c453] focus-visible:bg-[#171713] focus-visible:text-[#f6c453] lg:flex",
        isVertical
          ? "h-full w-[7px] cursor-col-resize"
          : "h-[8px] w-full cursor-row-resize border-y border-white/6",
        active && "bg-[#211d12] text-[#f6c453]",
      )}
      title={LABELS[panel] + ". Drag or use arrow keys."}
    >
      {isVertical ? (
        <GripVertical size={12} aria-hidden="true" className="min-w-3" />
      ) : (
        <GripHorizontal size={18} aria-hidden="true" />
      )}
    </button>
  );
}
