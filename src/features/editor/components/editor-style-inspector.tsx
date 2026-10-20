"use client";

import { useState } from "react";
import { AlignCenter, AlignLeft, AlignRight, Download, Layout, Palette, Sliders, Sparkles } from "lucide-react";
import { cn } from "@/shared/lib/cn";
import { captionStyles } from "../data/editor-config";

export const HIGHLIGHT_COLORS = [
  { id: "yellow", name: "Yellow", hex: "#f6c453" },
  { id: "green", name: "Neon Green", hex: "#22c55e" },
  { id: "cyan", name: "Cyan", hex: "#06b6d4" },
  { id: "pink", name: "Pink", hex: "#ec4899" },
  { id: "red", name: "Red", hex: "#ef4444" },
  { id: "purple", name: "Purple", hex: "#a855f7" },
];

export type PositionMode = "top" | "center" | "bottom" | "custom";
export type FontSizeMode = "sm" | "md" | "lg" | "xl";
export type TextAlignMode = "left" | "center" | "right";
export type TextTransformMode = "uppercase" | "none" | "lowercase";
export type AspectRatioMode = "9:16" | "1:1" | "16:9";
export type ActiveInspectorTab = "styles" | "customize" | "canvas";

export interface EditorStyleInspectorProps {
  styleId: string;
  onSelectStyle: (id: string) => void;
  highlightColor: string;
  onSelectHighlightColor: (color: string) => void;
  textTransform: TextTransformMode;
  onSelectTextTransform: (t: TextTransformMode) => void;
  fontSize: FontSizeMode;
  onSelectFontSize: (sz: FontSizeMode) => void;
  textAlign: TextAlignMode;
  onSelectTextAlign: (al: TextAlignMode) => void;
  aspectRatio: AspectRatioMode;
  onSelectAspectRatio: (r: AspectRatioMode) => void;
  position: PositionMode;
  onSelectPosition: (pos: PositionMode) => void;
  customYPercent: number;
  onCustomYChange: (val: number) => void;
  onOpenExport: () => void;
  className?: string;
}

export function EditorStyleInspector({
  styleId, onSelectStyle, highlightColor, onSelectHighlightColor,
  textTransform, onSelectTextTransform, fontSize, onSelectFontSize,
  textAlign, onSelectTextAlign, aspectRatio, onSelectAspectRatio,
  position, onSelectPosition, customYPercent, onCustomYChange,
  onOpenExport, className,
}: EditorStyleInspectorProps) {
  const [activeTab, setActiveTab] = useState<ActiveInspectorTab>("styles");

  return (
    <div className={cn("flex flex-col h-full font-sans", className)}>
      <div role="tablist" aria-label="Caption inspector tabs" className="flex items-center gap-1 rounded-xl border border-hairline bg-surface-raised p-1 mb-4 shrink-0">
        <button type="button" role="tab" aria-selected={activeTab === "styles"} onClick={() => setActiveTab("styles")} className={cn("flex-1 flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-bold transition cursor-pointer", activeTab === "styles" ? "bg-amber text-white shadow-sm" : "text-body hover:text-cream")}>
          <Sparkles size={13} aria-hidden="true" /> Styles
        </button>
        <button type="button" role="tab" aria-selected={activeTab === "customize"} onClick={() => setActiveTab("customize")} className={cn("flex-1 flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-bold transition cursor-pointer", activeTab === "customize" ? "bg-amber text-white shadow-sm" : "text-body hover:text-cream")}>
          <Palette size={13} aria-hidden="true" /> Text & Color
        </button>
        <button type="button" role="tab" aria-selected={activeTab === "canvas"} onClick={() => setActiveTab("canvas")} className={cn("flex-1 flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-bold transition cursor-pointer", activeTab === "canvas" ? "bg-amber text-white shadow-sm" : "text-body hover:text-cream")}>
          <Sliders size={13} aria-hidden="true" /> Layout
        </button>
      </div>

      {activeTab === "styles" && (
        <div className="space-y-4 flex-1 overflow-y-auto custom-scrollbar">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[.15em] text-body">Caption style</h3>
            <p className="text-sm font-bold text-cream mt-0.5">Find your caption style</p>
          </div>
          <div className="preset-grid grid grid-cols-2 gap-2.5">
            {captionStyles.map((style) => {
              const isSelected = styleId === style.id;
              return (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => onSelectStyle(style.id)}
                  aria-pressed={isSelected}
                  className={cn("preset-tile group relative rounded-lg border p-2.5 text-left transition cursor-pointer overflow-hidden", isSelected ? "border-amber bg-amber/15 shadow-sm ring-1 ring-amber/50" : "border-hairline bg-surface hover:border-hairline hover:bg-surface")}
                >
                  <span className={cn("block rounded-md bg-black/80 px-1 py-3 text-center text-[11px] font-bold", style.textClass)}>
                    YOUR <span className={style.activeWordClass}>STORY</span>
                  </span>
                  <div className="mt-2.5 flex items-center justify-between">
                    <span className="text-xs font-bold text-cream transition">{style.name}</span>
                    {isSelected && <span className="rounded-lg bg-amber px-2 py-0.5 text-[10px] font-black text-white">ACTIVE</span>}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === "customize" && (
        <div className="space-y-5 flex-1 overflow-y-auto custom-scrollbar">
          <div className="rounded-2xl border border-hairline bg-surface p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-body">Highlight Color</span>
              <span className="text-xs font-mono font-bold text-amber">{highlightColor}</span>
            </div>
            <div className="grid grid-cols-6 gap-2">
              {HIGHLIGHT_COLORS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => onSelectHighlightColor(c.hex)}
                  aria-label={`Use ${c.name} highlight`}
                  aria-pressed={highlightColor === c.hex}
                  style={{ backgroundColor: c.hex }}
                  className={cn("size-9 rounded-lg border border-hairline transition hover:scale-110 cursor-pointer shadow-sm", highlightColor === c.hex && "ring-2 ring-hairline scale-110")}
                  title={c.name}
                />
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-hairline bg-surface p-4 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-body">Text Case</span>
            <div className="grid grid-cols-3 gap-1.5 rounded-xl border border-hairline bg-surface-raised p-1 text-center">
              {(["uppercase", "none", "lowercase"] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => onSelectTextTransform(mode)}
                  aria-pressed={textTransform === mode}
                  className={cn("min-h-9 rounded-lg px-1 py-1 text-[11px] font-bold transition cursor-pointer capitalize", textTransform === mode ? "bg-amber text-white shadow-sm" : "text-body hover:text-cream")}
                >
                  {mode === "none" ? "Original" : mode}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-hairline bg-surface p-4 space-y-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-body">Font Size</span>
              <div className="mt-2 grid grid-cols-4 gap-1.5 rounded-xl border border-hairline bg-surface-raised p-1">
                {(["sm", "md", "lg", "xl"] as const).map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => onSelectFontSize(sz)}
                    className={cn("min-h-9 rounded-lg px-2 py-1 text-xs font-bold uppercase transition cursor-pointer", fontSize === sz ? "bg-amber text-white shadow-sm" : "text-body hover:text-cream")}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-body">Text Alignment</span>
              <div className="mt-2 grid grid-cols-3 gap-1.5 rounded-xl border border-hairline bg-surface-raised p-1">
                <button type="button" onClick={() => onSelectTextAlign("left")} className={cn("flex min-h-9 items-center justify-center gap-1.5 rounded-lg text-xs font-bold transition cursor-pointer", textAlign === "left" ? "bg-amber text-white shadow-sm" : "text-body hover:text-cream")}>
                  <AlignLeft size={14} /> Left
                </button>
                <button type="button" onClick={() => onSelectTextAlign("center")} className={cn("flex min-h-9 items-center justify-center gap-1.5 rounded-lg text-xs font-bold transition cursor-pointer", textAlign === "center" ? "bg-amber text-white shadow-sm" : "text-body hover:text-cream")}>
                  <AlignCenter size={14} /> Center
                </button>
                <button type="button" onClick={() => onSelectTextAlign("right")} className={cn("flex min-h-9 items-center justify-center gap-1.5 rounded-lg text-xs font-bold transition cursor-pointer", textAlign === "right" ? "bg-amber text-white shadow-sm" : "text-body hover:text-cream")}>
                  <AlignRight size={14} /> Right
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "canvas" && (
        <div className="space-y-5 flex-1 overflow-y-auto custom-scrollbar">
          <div className="rounded-2xl border border-hairline bg-surface p-4 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-body">Aspect Ratio</span>
            <div className="grid grid-cols-3 gap-2">
              {(["9:16", "1:1", "16:9"] as const).map((ratio) => (
                <button
                  key={ratio}
                  type="button"
                  onClick={() => onSelectAspectRatio(ratio)}
                  className={cn("flex flex-col items-center justify-center rounded-xl border p-3 transition cursor-pointer", aspectRatio === ratio ? "border-amber bg-amber/15 text-cream font-bold" : "border-hairline bg-surface-raised text-body hover:border-hairline hover:text-cream")}
                >
                  <Layout size={18} className={aspectRatio === ratio ? "text-amber" : "text-dim"} />
                  <span className="mt-1 text-xs font-bold">{ratio}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-hairline bg-surface p-4 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-body">Vertical Position</span>
            <div className="grid grid-cols-3 gap-1.5 rounded-xl border border-hairline bg-surface-raised p-1 text-center">
              {(["top", "center", "bottom"] as const).map((pos) => (
                <button
                  key={pos}
                  type="button"
                  onClick={() => onSelectPosition(pos)}
                  className={cn("min-h-9 rounded-lg px-1 py-1 text-xs font-bold capitalize transition cursor-pointer", position === pos ? "bg-amber text-white shadow-sm" : "text-body hover:text-cream")}
                >
                  {pos}
                </button>
              ))}
            </div>

            <div>
              <div className="flex items-center justify-between text-xs text-body mb-1.5">
                <span>Custom Y Height</span>
                <span className="font-mono text-amber font-bold">{customYPercent}%</span>
              </div>
              <input
                type="range"
                min={10}
                max={90}
                value={customYPercent}
                onChange={(e) => {
                  onCustomYChange(Number(e.target.value));
                  onSelectPosition("custom");
                }}
                className="w-full accent-amber cursor-pointer"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenExport}
            className="w-full flex h-11 items-center justify-center gap-2 rounded-xl bg-amber text-xs font-bold text-white hover:brightness-105 transition cursor-pointer shadow-sm"
          >
            <Download size={15} /> Export Options (.MP4, .SRT, .VTT)
          </button>
        </div>
      )}
    </div>
  );
}
