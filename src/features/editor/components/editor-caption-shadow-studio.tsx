"use client";

import { useId, useRef, useState } from "react";
import { Check, Compass, Layers, RotateCcw, Sparkles, Sun, X } from "lucide-react";
import { cn } from "@/shared/lib/cn";
import { useDialogFocus } from "@/shared/hooks/use-dialog-focus";

export type ShadowStyleMode = "soft" | "hard-drop" | "extrude-3d" | "neon-glow";

export interface CaptionShadowConfig {
  mode: ShadowStyleMode;
  color: string;
  blurRadius: number;
  distancePx: number;
  angleDeg: number;
  opacityPercent: number;
  extrusionDepth: number;
}

export interface EditorCaptionShadowStudioProps {
  isOpen: boolean;
  onClose: () => void;
  config?: CaptionShadowConfig;
  onApplyConfig: (config: CaptionShadowConfig) => void;
}

const DEFAULT_CONFIG: CaptionShadowConfig = {
  mode: "hard-drop",
  color: "#000000",
  blurRadius: 4,
  distancePx: 6,
  angleDeg: 135,
  opacityPercent: 90,
  extrusionDepth: 4,
};

export function EditorCaptionShadowStudio({
  isOpen,
  onClose,
  config: initialConfig,
  onApplyConfig,
}: EditorCaptionShadowStudioProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  useDialogFocus(dialogRef, isOpen);

  const [config, setConfig] = useState<CaptionShadowConfig>(initialConfig || DEFAULT_CONFIG);

  if (!isOpen) return null;

  const angleRad = (config.angleDeg * Math.PI) / 180;
  const offsetX = Math.round(Math.cos(angleRad) * config.distancePx);
  const offsetY = Math.round(Math.sin(angleRad) * config.distancePx);

  const computeShadowCSS = () => {
    const opacityHex = Math.round((config.opacityPercent / 100) * 255)
      .toString(16)
      .padStart(2, "0");
    const shadowColor = `${config.color}${opacityHex}`;

    if (config.mode === "extrude-3d") {
      const layers: string[] = [];
      for (let i = 1; i <= config.extrusionDepth; i++) {
        layers.push(`${i}px ${i}px 0px ${shadowColor}`);
      }
      return layers.join(", ");
    }
    if (config.mode === "neon-glow") {
      return `0 0 ${config.blurRadius}px ${shadowColor}, 0 0 ${config.blurRadius * 2}px ${shadowColor}`;
    }
    if (config.mode === "hard-drop") {
      return `${offsetX}px ${offsetY}px 0px ${shadowColor}`;
    }
    return `${offsetX}px ${offsetY}px ${config.blurRadius}px ${shadowColor}`;
  };

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
            <div className="p-2 rounded-xl bg-accent/10 text-accent"><Layers size={18} /></div>
            <div>
              <h2 id={titleId} className="text-sm font-semibold text-cream">Caption Shadow & 3D Extrusion</h2>
              <p className="text-xs text-dim">Add depth, contrast, and retro pop to subtitle letters</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg text-dim hover:text-cream hover:bg-surface transition-colors cursor-pointer" aria-label="Close shadow studio">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="p-6 rounded-xl border border-hairline bg-surface/50 flex flex-col items-center justify-center text-center relative overflow-hidden min-h-[110px]">
            <span className="text-[10px] uppercase font-mono text-dim tracking-wider mb-2">Live Text Shadow Preview</span>
            <div
              style={{
                textShadow: computeShadowCSS(),
                color: "#facc15",
              }}
              className="text-2xl font-black uppercase tracking-tight transition-all duration-150"
            >
              VIRAL REEL HOOK
            </div>
            <span className="text-[10px] text-dim mt-2 font-mono">Offset: ({offsetX}px, {offsetY}px) &bull; Mode: {config.mode}</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-dim uppercase tracking-wider mb-2">Shadow Preset Mode</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: "hard-drop", label: "Hard Retro Drop", desc: "Crisp black outline drop shadow without blur" },
                { id: "extrude-3d", label: "3D Comic Extrusion", desc: "Stacked stepped bevel depth layers" },
                { id: "soft", label: "Soft Ambient Blur", desc: "Natural blurred drop shadow for contrast" },
                { id: "neon-glow", label: "Neon Outer Bloom", desc: "Omnidirectional luminous outer aura" },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setConfig({ ...config, mode: m.id as ShadowStyleMode })}
                  className={cn("p-2.5 rounded-xl border text-left cursor-pointer transition-all",
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
                <span className="text-xs text-dim flex items-center gap-1"><Sun size={12} /> Distance Offset</span>
                <span className="text-xs text-accent font-mono">{config.distancePx}px</span>
              </div>
              <input
                type="range"
                min={0}
                max={20}
                value={config.distancePx}
                onChange={(e) => setConfig({ ...config, distancePx: Number(e.target.value) })}
                className="w-full accent-accent cursor-pointer"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-dim flex items-center gap-1"><Compass size={12} /> Angle Direction</span>
                <span className="text-xs text-accent font-mono">{config.angleDeg}&deg;</span>
              </div>
              <input
                type="range"
                min={0}
                max={360}
                step={15}
                value={config.angleDeg}
                onChange={(e) => setConfig({ ...config, angleDeg: Number(e.target.value) })}
                className="w-full accent-accent cursor-pointer"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-dim">Blur Softness</span>
                <span className="text-xs text-accent font-mono">{config.blurRadius}px</span>
              </div>
              <input
                type="range"
                min={0}
                max={24}
                value={config.blurRadius}
                onChange={(e) => setConfig({ ...config, blurRadius: Number(e.target.value) })}
                className="w-full accent-accent cursor-pointer"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-dim">Shadow Opacity</span>
                <span className="text-xs text-accent font-mono">{config.opacityPercent}%</span>
              </div>
              <input
                type="range"
                min={20}
                max={100}
                value={config.opacityPercent}
                onChange={(e) => setConfig({ ...config, opacityPercent: Number(e.target.value) })}
                className="w-full accent-accent cursor-pointer"
              />
            </div>
          </div>

          <div className="p-3 rounded-xl border border-hairline bg-surface/30 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-cream">
              <Sparkles size={14} className="text-accent" />
              <span>Multi-layer drop shadows guarantee caption legibility over bright footage.</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t border-hairline bg-surface/50">
          <button
            type="button"
            onClick={() => setConfig(DEFAULT_CONFIG)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs text-dim hover:text-cream transition-colors cursor-pointer"
          >
            <RotateCcw size={13} /> Reset Retro Shadow
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
              <Check size={14} /> Apply Shadow
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
