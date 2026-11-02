"use client";

import { useId, useRef, useState } from "react";
import { Check, Crop, Maximize2, Move, Ratio, X } from "lucide-react";
import { cn } from "@/shared/lib/cn";
import { useDialogFocus } from "@/shared/hooks/use-dialog-focus";

export type AspectRatioType = "9:16" | "1:1" | "16:9" | "4:5";
export type CanvasBackgroundType = "blur" | "black" | "white" | "gradient";

export interface CanvasRatioConfig {
  aspectRatio: AspectRatioType;
  backgroundType: CanvasBackgroundType;
  videoScalePercent: number;
  verticalOffsetPercent: number;
  cornerRadiusPx: number;
  applyMotionBlurBorder: boolean;
}

export interface EditorCanvasRatioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyConfig: (config: CanvasRatioConfig) => void;
  initialConfig?: Partial<CanvasRatioConfig>;
}

interface RatioPreset {
  id: AspectRatioType;
  label: string;
  sublabel: string;
  width: number;
  height: number;
}

const RATIO_PRESETS: RatioPreset[] = [
  { id: "9:16", label: "Vertical Story", sublabel: "TikTok, Reels, Shorts", width: 1080, height: 1920 },
  { id: "1:1", label: "Square Feed", sublabel: "Instagram, LinkedIn Post", width: 1080, height: 1080 },
  { id: "4:5", label: "Portrait Feed", sublabel: "Instagram Portrait Post", width: 1080, height: 1350 },
  { id: "16:9", label: "Landscape", sublabel: "YouTube, Desktop Video", width: 1920, height: 1080 },
];

export function EditorCanvasRatioModal({
  isOpen,
  onClose,
  onApplyConfig,
  initialConfig,
}: EditorCanvasRatioModalProps) {
  const dialogId = useId();
  const titleId = `${dialogId}-title`;
  const dialogRef = useRef<HTMLDivElement>(null);
  useDialogFocus(dialogRef, isOpen);

  const [aspectRatio, setAspectRatio] = useState<AspectRatioType>(initialConfig?.aspectRatio ?? "9:16");
  const [backgroundType, setBackgroundType] = useState<CanvasBackgroundType>(initialConfig?.backgroundType ?? "blur");
  const [videoScale, setVideoScale] = useState<number>(initialConfig?.videoScalePercent ?? 100);
  const [verticalOffset, setVerticalOffset] = useState<number>(initialConfig?.verticalOffsetPercent ?? 0);
  const [cornerRadius, setCornerRadius] = useState<number>(initialConfig?.cornerRadiusPx ?? 0);
  const [applyBlur, setApplyBlur] = useState<boolean>(initialConfig?.applyMotionBlurBorder ?? true);

  if (!isOpen) return null;

  const handleSave = () => {
    onApplyConfig({
      aspectRatio,
      backgroundType,
      videoScalePercent: videoScale,
      verticalOffsetPercent: verticalOffset,
      cornerRadiusPx: cornerRadius,
      applyMotionBlurBorder: applyBlur,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-[fadeIn_0.15s_ease-out]">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="w-full max-w-xl bg-surface border border-hairline rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-hairline bg-surface-raised">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-accent-soft flex items-center justify-center text-accent">
              <Ratio size={18} />
            </div>
            <div>
              <h2 id={titleId} className="text-sm font-semibold text-cream">Canvas Aspect Ratio & Cropping</h2>
              <p className="text-xs text-dim">Format video canvas for TikTok, Instagram Reels, and YouTube</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg text-dim hover:text-cream hover:bg-surface transition-colors cursor-pointer" aria-label="Close canvas ratio modal">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          <section>
            <label className="text-xs font-semibold text-dim uppercase tracking-wider block mb-2">Target Aspect Ratio</label>
            <div className="grid grid-cols-2 gap-2">
              {RATIO_PRESETS.map((p) => {
                const isSelected = aspectRatio === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setAspectRatio(p.id)}
                    className={cn(
                      "p-3 rounded-xl border text-left text-xs transition-all cursor-pointer",
                      isSelected
                        ? "border-accent bg-accent-soft text-cream font-medium shadow-sm"
                        : "border-hairline bg-surface-raised/40 hover:bg-surface-raised text-body hover:text-cream",
                    )}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold">{p.label}</span>
                      <span className="font-mono text-[10px] text-accent">{p.id}</span>
                    </div>
                    <span className="text-[10px] text-dim block">{p.sublabel}</span>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="space-y-3.5 pt-2 border-t border-hairline text-xs">
            <div>
              <label className="text-xs font-semibold text-dim uppercase tracking-wider block mb-2">Canvas Fill & Background</label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: "blur", label: "Video Mirror Blur" },
                  { id: "black", label: "Matte Black" },
                  { id: "white", label: "Clean White" },
                  { id: "gradient", label: "Dark Gradient" },
                ].map((bg) => (
                  <button
                    key={bg.id}
                    type="button"
                    onClick={() => setBackgroundType(bg.id as CanvasBackgroundType)}
                    className={cn(
                      "p-2.5 rounded-lg border text-center transition-colors cursor-pointer",
                      backgroundType === bg.id
                        ? "border-accent bg-accent-soft text-accent font-semibold"
                        : "border-hairline text-dim hover:text-cream bg-surface-raised/30",
                    )}
                  >
                    <span className="text-[11px]">{bg.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-cream flex items-center gap-1.5">
                  <Maximize2 size={13} className="text-dim" /> Video Scale / Zoom
                </span>
                <span className="text-dim font-mono">{videoScale}%</span>
              </div>
              <input type="range" min="80" max="140" step="5" value={videoScale} onChange={(e) => setVideoScale(parseInt(e.target.value, 10))} className="w-full accent-accent h-1.5 bg-surface-raised rounded-lg cursor-pointer" />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-cream flex items-center gap-1.5">
                  <Move size={13} className="text-dim" /> Vertical Pan Position
                </span>
                <span className="text-dim font-mono">{verticalOffset > 0 ? `+${verticalOffset}` : verticalOffset}%</span>
              </div>
              <input type="range" min="-30" max="30" step="2" value={verticalOffset} onChange={(e) => setVerticalOffset(parseInt(e.target.value, 10))} className="w-full accent-accent h-1.5 bg-surface-raised rounded-lg cursor-pointer" />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-cream flex items-center gap-1.5">
                  <Crop size={13} className="text-dim" /> Corner Radius Curvature
                </span>
                <span className="text-dim font-mono">{cornerRadius}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="32"
                step="4"
                value={cornerRadius}
                onChange={(e) => setCornerRadius(parseInt(e.target.value, 10))}
                className="w-full accent-accent h-1.5 bg-surface-raised rounded-lg cursor-pointer"
              />
            </div>

            <label className="flex items-center gap-2 p-2 rounded-lg hover:bg-surface-raised cursor-pointer text-body hover:text-cream">
              <input type="checkbox" checked={applyBlur} onChange={(e) => setApplyBlur(e.target.checked)} className="rounded text-accent accent-accent" />
              <span>Apply soft vignette border between video and canvas frame</span>
            </label>
          </section>
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t border-hairline bg-surface-raised">
          <p className="text-xs text-dim">{aspectRatio} canvas export configured</p>
          <div className="flex items-center gap-2.5">
            <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-semibold text-dim hover:text-cream transition-colors cursor-pointer">
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-accent text-white hover:bg-accent/90 shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Check size={14} /> Apply Aspect Ratio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
