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
        "group hidden touch-none items-center justify-center bg-surface text-dim outline-none transition hover:bg-surface hover:text-amber focus-visible:bg-surface focus-visible:text-amber lg:flex",
        isVertical
          ? "h-full w-[7px] cursor-col-resize"
          : "h-[8px] w-full cursor-row-resize border-y border-hairline",
        active && "bg-surface text-amber",
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
