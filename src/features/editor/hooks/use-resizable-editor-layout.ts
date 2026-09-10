"use client";

import type { CSSProperties, PointerEvent as ReactPointerEvent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

export type EditorPanel = "captions" | "styles" | "timeline";

type EditorLayout = {
  captions: number;
  styles: number;
  timeline: number;
};

type DragState = {
  panel: EditorPanel;
  pointerId: number;
  startX: number;
  startY: number;
  startSize: number;
};

const STORAGE_KEY = "everykaptions.editor-layout.v1";
const DEFAULT_LAYOUT: EditorLayout = {
  captions: 320,
  styles: 320,
  timeline: 180,
};

const LIMITS: Record<EditorPanel, { min: number; max: number }> = {
  captions: { min: 250, max: 480 },
  styles: { min: 270, max: 440 },
  timeline: { min: 150, max: 360 },
};

function clampPanelSize(panel: EditorPanel, value: number) {
  const { min, max } = LIMITS[panel];
  return Math.round(Math.min(max, Math.max(min, value)));
}

function readStoredLayout(): EditorLayout {
  if (typeof window === "undefined") return DEFAULT_LAYOUT;

  try {
    const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "{}") as Partial<EditorLayout>;
    return {
      captions: clampPanelSize("captions", Number(stored.captions) || DEFAULT_LAYOUT.captions),
      styles: clampPanelSize("styles", Number(stored.styles) || DEFAULT_LAYOUT.styles),
      timeline: clampPanelSize("timeline", Number(stored.timeline) || DEFAULT_LAYOUT.timeline),
    };
  } catch {
    return DEFAULT_LAYOUT;
  }
}

export function useResizableEditorLayout() {
  const [layout, setLayout] = useState<EditorLayout>(DEFAULT_LAYOUT);
  const [activePanel, setActivePanel] = useState<EditorPanel | null>(null);
  const dragRef = useRef<DragState | null>(null);

  useEffect(() => {
    setLayout(readStoredLayout());
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(layout));
    } catch {
      // The editor still works when browser storage is unavailable.
    }
  }, [layout]);

  const handlePointerMove = useCallback((event: PointerEvent) => {
    const drag = dragRef.current;
    if (!drag || event.pointerId !== drag.pointerId) return;

    const delta = drag.panel === "timeline"
      ? drag.startY - event.clientY
      : event.clientX - drag.startX;
    const directionalDelta = drag.panel === "styles" ? -delta : delta;

    setLayout((current) => ({
      ...current,
      [drag.panel]: clampPanelSize(drag.panel, drag.startSize + directionalDelta),
    }));
  }, []);

  const stopResize = useCallback(() => {
    dragRef.current = null;
    setActivePanel(null);
    document.body.style.removeProperty("cursor");
    document.body.style.removeProperty("user-select");
  }, []);

  useEffect(() => {
    if (!activePanel) return;

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", stopResize);
    window.addEventListener("pointercancel", stopResize);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", stopResize);
      window.removeEventListener("pointercancel", stopResize);
    };
  }, [activePanel, handlePointerMove, stopResize]);

  useEffect(() => () => {
    document.body.style.removeProperty("cursor");
    document.body.style.removeProperty("user-select");
  }, []);

  const beginResize = useCallback((
    panel: EditorPanel,
    event: ReactPointerEvent<HTMLButtonElement>,
  ) => {
    dragRef.current = {
      panel,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startSize: layout[panel],
    };
    setActivePanel(panel);
    document.body.style.cursor = panel === "timeline" ? "row-resize" : "col-resize";
    document.body.style.userSelect = "none";
  }, [layout]);

  const resizeBy = useCallback((panel: EditorPanel, amount: number) => {
    setLayout((current) => ({
      ...current,
      [panel]: clampPanelSize(panel, current[panel] + amount),
    }));
  }, []);

  const resetLayout = useCallback(() => {
    setLayout(DEFAULT_LAYOUT);
  }, []);

  const workspaceStyle = {
    "--editor-captions-width": layout.captions + "px",
    "--editor-styles-width": layout.styles + "px",
    "--editor-timeline-height": layout.timeline + "px",
  } as CSSProperties;

  return {
    layout,
    activePanel,
    workspaceStyle,
    beginResize,
    resizeBy,
    resetLayout,
  };
}
