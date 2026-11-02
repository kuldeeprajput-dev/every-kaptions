"use client";

import { useId, useRef, useState } from "react";
import { Check, Eye, Image as ImageIcon, RotateCcw, Shield, Sliders, Type, X } from "lucide-react";
import { cn } from "@/shared/lib/cn";
import { useDialogFocus } from "@/shared/hooks/use-dialog-focus";

export type WatermarkPosition = "top-left" | "top-right" | "bottom-left" | "bottom-right" | "bottom-center";
export type WatermarkBlendMode = "normal" | "overlay" | "soft-light" | "screen";

export interface WatermarkConfig {
  enabled: boolean;
  type: "text" | "image";
  text: string;
  imageUrl: string;
  position: WatermarkPosition;
  opacity: number;
  scalePercent: number;
  marginOffsetPx: number;
  dropShadow: boolean;
  blendMode: WatermarkBlendMode;
}

export interface EditorWatermarkOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  config: WatermarkConfig;
  onApplyConfig: (config: WatermarkConfig) => void;
}

const DEFAULT_CONFIG: WatermarkConfig = {
  enabled: true,
  type: "text",
  text: "@creator_handle",
  imageUrl: "",
  position: "bottom-right",
  opacity: 75,
  scalePercent: 100,
  marginOffsetPx: 24,
  dropShadow: true,
  blendMode: "normal",
};

const POSITION_LABELS: { id: WatermarkPosition; label: string }[] = [
  { id: "top-left", label: "Top Left" }, { id: "top-right", label: "Top Right" },
  { id: "bottom-left", label: "Bottom Left" }, { id: "bottom-right", label: "Bottom Right" },
  { id: "bottom-center", label: "Bottom Center" },
];

export function EditorWatermarkOverlay({
  isOpen,
  onClose,
  config: initialConfig,
  onApplyConfig,
}: EditorWatermarkOverlayProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  useDialogFocus(dialogRef, isOpen);

  const [config, setConfig] = useState<WatermarkConfig>(initialConfig || DEFAULT_CONFIG);
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
            <div className="p-2 rounded-xl bg-accent/10 text-accent"><Shield size={18} /></div>
            <div>
              <h2 id={titleId} className="text-sm font-semibold text-cream">Brand Watermark & Logo Stamp</h2>
              <p className="text-xs text-dim">Protect content and brand your exported reels with an overlay badge</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg text-dim hover:text-cream hover:bg-surface transition-colors cursor-pointer" aria-label="Close watermark dialog">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="flex items-center justify-between p-3 rounded-xl border border-hairline bg-surface/30">
            <div>
              <div className="text-xs font-semibold text-cream">Enable Watermark Badge</div>
              <div className="text-[11px] text-dim">Burn brand stamp permanently onto video exports</div>
            </div>
            <input
              type="checkbox"
              checked={config.enabled}
              onChange={(e) => setConfig({ ...config, enabled: e.target.checked })}
              className="accent-accent w-4 h-4 cursor-pointer"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setConfig({ ...config, type: "text" })}
              className={cn("flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border text-xs font-medium cursor-pointer transition-all",
                config.type === "text" ? "border-accent bg-accent/15 text-cream" : "border-hairline bg-surface text-dim hover:text-cream")}
            >
              <Type size={14} /> Text Handle Stamp
            </button>
            <button
              type="button"
              onClick={() => setConfig({ ...config, type: "image" })}
              className={cn("flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border text-xs font-medium cursor-pointer transition-all",
                config.type === "image" ? "border-accent bg-accent/15 text-cream" : "border-hairline bg-surface text-dim hover:text-cream")}
            >
              <ImageIcon size={14} /> Image Logo Stamp
            </button>
          </div>

          {config.type === "text" ? (
            <div>
              <label className="block text-xs font-semibold text-dim uppercase tracking-wider mb-1.5">Brand Handle / Text</label>
              <input
                type="text"
                value={config.text}
                onChange={(e) => setConfig({ ...config, text: e.target.value })}
                placeholder="@yourchannel"
                className="w-full px-3 py-2 rounded-xl border border-hairline bg-surface text-xs text-cream outline-none focus:border-accent"
              />
            </div>
          ) : (
            <div>
              <label className="block text-xs font-semibold text-dim uppercase tracking-wider mb-1.5">Image Logo URL (PNG/SVG)</label>
              <input
                type="text"
                value={config.imageUrl}
                onChange={(e) => setConfig({ ...config, imageUrl: e.target.value })}
                placeholder="https://example.com/logo.png"
                className="w-full px-3 py-2 rounded-xl border border-hairline bg-surface text-xs text-cream outline-none focus:border-accent"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-dim uppercase tracking-wider mb-2">Corner Placement</label>
            <div className="grid grid-cols-3 gap-2">
              {POSITION_LABELS.map((pos) => (
                <button
                  key={pos.id}
                  type="button"
                  onClick={() => setConfig({ ...config, position: pos.id })}
                  className={cn(
                    "px-3 py-1.5 rounded-xl border text-xs font-medium transition-colors cursor-pointer",
                    config.position === pos.id ? "border-accent bg-accent/20 text-cream font-bold" : "border-hairline bg-surface text-dim hover:text-cream",
                  )}
                >
                  {pos.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-dim flex items-center gap-1.5"><Eye size={12} /> Opacity</label>
                <span className="text-xs text-accent font-mono">{config.opacity}%</span>
              </div>
              <input
                type="range"
                min={15}
                max={100}
                value={config.opacity}
                onChange={(e) => setConfig({ ...config, opacity: Number(e.target.value) })}
                className="w-full accent-accent cursor-pointer"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-dim flex items-center gap-1.5"><Sliders size={12} /> Scale Size</label>
                <span className="text-xs text-accent font-mono">{config.scalePercent}%</span>
              </div>
              <input
                type="range"
                min={40}
                max={160}
                value={config.scalePercent}
                onChange={(e) => setConfig({ ...config, scalePercent: Number(e.target.value) })}
                className="w-full accent-accent cursor-pointer"
              />
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl border border-hairline bg-surface/30">
            <div>
              <div className="text-xs font-semibold text-cream">Drop Shadow Elevation</div>
              <div className="text-[11px] text-dim">Add subtle dark outline for contrast over bright backgrounds</div>
            </div>
            <input
              type="checkbox"
              checked={config.dropShadow}
              onChange={(e) => setConfig({ ...config, dropShadow: e.target.checked })}
              className="accent-accent w-4 h-4 cursor-pointer"
            />
          </div>
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t border-hairline bg-surface/50">
          <button
            type="button"
            onClick={() => setConfig(DEFAULT_CONFIG)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs text-dim hover:text-cream transition-colors cursor-pointer"
          >
            <RotateCcw size={13} /> Reset Defaults
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-dim hover:text-cream transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-accent hover:bg-accent-hover text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              <Check size={14} /> Apply Watermark
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
