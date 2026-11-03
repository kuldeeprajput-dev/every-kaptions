"use client";

import { useId, useRef, useState } from "react";
import { Check, Crop, MoveHorizontal, RotateCcw, ScanFace, Sliders, Sparkles, X } from "lucide-react";
import { cn } from "@/shared/lib/cn";
import { useDialogFocus } from "@/shared/hooks/use-dialog-focus";

export type TrackingMode = "face-auto" | "center" | "manual";
export type BackgroundFillMode = "blur" | "black" | "gradient";

export interface SmartReframeConfig {
  mode: TrackingMode;
  manualOffsetPercent: number;
  smoothingFactor: number;
  backgroundFill: BackgroundFillMode;
  edgeBlurStrength: number;
}

export interface EditorSmartReframeModalProps {
  isOpen: boolean;
  onClose: () => void;
  config?: SmartReframeConfig;
  onApplyConfig: (config: SmartReframeConfig) => void;
}

const DEFAULT_CONFIG: SmartReframeConfig = {
  mode: "face-auto",
  manualOffsetPercent: 0,
  smoothingFactor: 65,
  backgroundFill: "blur",
  edgeBlurStrength: 24,
};

export function EditorSmartReframeModal({
  isOpen,
  onClose,
  config: initialConfig,
  onApplyConfig,
}: EditorSmartReframeModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  useDialogFocus(dialogRef, isOpen);

  const [config, setConfig] = useState<SmartReframeConfig>(initialConfig || DEFAULT_CONFIG);

  if (!isOpen) return null;

  const handleSave = () => {
    onApplyConfig(config);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        className="w-full max-w-xl rounded-2xl border border-hairline bg-surface-raised shadow-2xl overflow-hidden flex flex-col max-h-[90vh] outline-none"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-hairline bg-surface/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-accent/10 text-accent"><Crop size={18} /></div>
            <div>
              <h2 id={titleId} className="text-sm font-semibold text-cream">Smart Face Tracking & Reframe</h2>
              <p className="text-xs text-dim">Auto-crop 16:9 widescreen video into 9:16 vertical reels</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg text-dim hover:text-cream hover:bg-surface transition-colors cursor-pointer" aria-label="Close reframe dialog">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="p-4 rounded-xl border border-hairline bg-surface/60 flex flex-col items-center justify-center relative overflow-hidden h-36">
            <div className="w-56 h-28 rounded-lg border border-dashed border-dim/50 bg-surface flex items-center justify-center relative">
              <span className="text-[10px] font-mono text-dim absolute top-1.5 left-2">16:9 Source Widescreen</span>
              <div
                style={{
                  transform: `translateX(${config.manualOffsetPercent * 0.4}px)`,
                  transition: "transform 200ms ease-out",
                }}
                className="w-16 h-28 border-2 border-accent rounded bg-accent/15 flex flex-col items-center justify-center shadow-lg relative"
              >
                <span className="text-[9px] font-mono font-bold text-accent">9:16 Reel</span>
                {config.mode === "face-auto" && (
                  <div className="w-6 h-6 rounded-full border border-accent bg-accent/30 mt-1 flex items-center justify-center animate-pulse">
                    <ScanFace size={12} className="text-accent" />
                  </div>
                )}
              </div>
            </div>
            <span className="text-[10px] text-dim mt-2">Active Subject Crop Region (Vertical Reels Window)</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-dim uppercase tracking-wider mb-2">Subject Tracking Mode</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "face-auto", label: "Auto Face Tracking", desc: "Follows speaker face" },
                { id: "center", label: "Center Fixed", desc: "Locks center 9:16 frame" },
                { id: "manual", label: "Manual Focal Offset", desc: "Custom pan bias" },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setConfig({ ...config, mode: m.id as TrackingMode })}
                  className={cn("p-2.5 rounded-xl border text-left transition-all cursor-pointer",
                    config.mode === m.id ? "border-accent bg-accent/15" : "border-hairline bg-surface/30 hover:bg-surface")}
                >
                  <div className="text-xs font-bold text-cream mb-0.5">{m.label}</div>
                  <p className="text-[10px] text-dim leading-tight">{m.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-dim flex items-center gap-1"><MoveHorizontal size={12} /> Horizontal Pan Bias</span>
                <span className="text-xs text-accent font-mono">
                  {config.manualOffsetPercent > 0 ? `+${config.manualOffsetPercent}%` : `${config.manualOffsetPercent}%`}
                </span>
              </div>
              <input
                type="range"
                min={-50}
                max={50}
                value={config.manualOffsetPercent}
                onChange={(e) => setConfig({ ...config, manualOffsetPercent: Number(e.target.value) })}
                className="w-full accent-accent cursor-pointer"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-dim flex items-center gap-1"><Sliders size={12} /> Motion Smoothing</span>
                <span className="text-xs text-accent font-mono">{config.smoothingFactor}%</span>
              </div>
              <input
                type="range"
                min={10}
                max={100}
                value={config.smoothingFactor}
                onChange={(e) => setConfig({ ...config, smoothingFactor: Number(e.target.value) })}
                className="w-full accent-accent cursor-pointer"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-dim uppercase tracking-wider mb-2">Pillarbox Edge Background</label>
            <div className="flex gap-2">
              {[
                { id: "blur", label: "Gaussian Blur Backdrop", desc: "Mirrors video with heavy blur" },
                { id: "black", label: "Clean Black Pillarbox", desc: "Solid cinematic black bars" },
                { id: "gradient", label: "Gradient Shadow Vignette", desc: "Subtle dark gradient vignette" },
              ].map((fill) => (
                <button
                  key={fill.id}
                  type="button"
                  onClick={() => setConfig({ ...config, backgroundFill: fill.id as BackgroundFillMode })}
                  className={cn("flex-1 p-2 rounded-xl border text-left cursor-pointer transition-colors",
                    config.backgroundFill === fill.id ? "border-accent bg-accent/15" : "border-hairline bg-surface text-dim hover:text-cream")}
                >
                  <div className="text-xs font-semibold text-cream mb-0.5">{fill.label}</div>
                  <p className="text-[10px] text-dim">{fill.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-xl border border-hairline bg-surface/40 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-cream">
              <Sparkles size={14} className="text-accent" />
              <span>Smart Reframe keeps the focal subject centered in 9:16 export.</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t border-hairline bg-surface/50">
          <button
            type="button"
            onClick={() => setConfig(DEFAULT_CONFIG)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs text-dim hover:text-cream transition-colors cursor-pointer"
          >
            <RotateCcw size={13} /> Reset Auto
          </button>
          <div className="flex items-center gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-xs font-medium text-dim hover:text-cream transition-colors cursor-pointer">
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-accent hover:bg-accent-hover text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              <Check size={14} /> Apply Reframe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
