"use client";

import { useId, useRef, useState } from "react";
import { Check, Eye, Film, RotateCcw, Sliders, Sparkles, Sun, X } from "lucide-react";
import { cn } from "@/shared/lib/cn";
import { useDialogFocus } from "@/shared/hooks/use-dialog-focus";

export type LutFilterId =
  | "none"
  | "warm-gold"
  | "teal-orange"
  | "crisp-bright"
  | "noir-mono"
  | "vintage-vhs"
  | "cyber-neon";

export interface ColorGradeConfig {
  lutId: LutFilterId;
  intensityPercent: number;
  warmth: number;
  contrastPercent: number;
  saturationPercent: number;
}

export interface EditorLutColorGradeProps {
  isOpen: boolean;
  onClose: () => void;
  config?: ColorGradeConfig;
  onApplyConfig: (config: ColorGradeConfig) => void;
}

const DEFAULT_CONFIG: ColorGradeConfig = {
  lutId: "warm-gold",
  intensityPercent: 80,
  warmth: 15,
  contrastPercent: 110,
  saturationPercent: 115,
};

const LUT_PRESETS: { id: LutFilterId; name: string; desc: string; sampleGradient: string }[] = [
  { id: "none", name: "Natural (Original)", desc: "Raw unprocessed video feed", sampleGradient: "linear-gradient(135deg, #64748b, #94a3b8)" },
  { id: "warm-gold", name: "Warm Golden Hour", desc: "Sunny amber glow with soft skin tones", sampleGradient: "linear-gradient(135deg, #f59e0b, #d97706)" },
  { id: "teal-orange", name: "Teal & Orange", desc: "Blockbuster cinematic Hollywood aesthetic", sampleGradient: "linear-gradient(135deg, #0d9488, #ea580c)" },
  { id: "crisp-bright", name: "Crisp Clean Bright", desc: "Punchy contrast and vibrant high-key whites", sampleGradient: "linear-gradient(135deg, #38bdf8, #818cf8)" },
  { id: "noir-mono", name: "Noir Monochrome", desc: "High-contrast dramatic black and white", sampleGradient: "linear-gradient(135deg, #0f172a, #64748b)" },
  { id: "vintage-vhs", name: "Vintage 90s Film", desc: "Muted retro nostalgia with subtle grain warmth", sampleGradient: "linear-gradient(135deg, #b45309, #78350f)" },
  { id: "cyber-neon", name: "Cyberpunk Neon", desc: "Electric blues and magenta synthwave accents", sampleGradient: "linear-gradient(135deg, #a855f7, #06b6d4)" },
];

export function EditorLutColorGrade({
  isOpen,
  onClose,
  config: initialConfig,
  onApplyConfig,
}: EditorLutColorGradeProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  useDialogFocus(dialogRef, isOpen);

  const [config, setConfig] = useState<ColorGradeConfig>(initialConfig || DEFAULT_CONFIG);
  const [showComparison, setShowComparison] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onApplyConfig(config);
    onClose();
  };

  const activeLut = LUT_PRESETS.find((l) => l.id === config.lutId) || LUT_PRESETS[0];

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
            <div className="p-2 rounded-xl bg-accent/10 text-accent"><Film size={18} /></div>
            <div>
              <h2 id={titleId} className="text-sm font-semibold text-cream">Video LUT Color Grading</h2>
              <p className="text-xs text-dim">Apply cinematic color filters and tonal warmth to reel footage</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg text-dim hover:text-cream hover:bg-surface transition-colors cursor-pointer" aria-label="Close color grade dialog">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="p-5 rounded-xl border border-hairline bg-surface/50 flex flex-col items-center justify-center text-center relative overflow-hidden min-h-[110px]">
            <div
              style={{
                background: showComparison ? LUT_PRESETS[0].sampleGradient : activeLut.sampleGradient,
                filter: showComparison
                  ? "none"
                  : `contrast(${config.contrastPercent}%) saturate(${config.saturationPercent}%)`,
                opacity: (config.intensityPercent / 100) * 0.9 + 0.1,
              }}
              className="w-full h-16 rounded-xl transition-all duration-200 flex items-center justify-center shadow-inner"
            >
              <span className="text-white font-extrabold uppercase tracking-widest text-xs drop-shadow-md">
                {showComparison ? "Original Raw Feed" : `${activeLut.name} (${config.intensityPercent}%)`}
              </span>
            </div>

            <button
              type="button"
              onMouseDown={() => setShowComparison(true)}
              onMouseUp={() => setShowComparison(false)}
              className="mt-2.5 text-[11px] text-accent hover:underline flex items-center gap-1 cursor-pointer font-medium"
            >
              <Eye size={12} /> Hold to Preview Original Raw
            </button>
          </div>

          <div>
            <label className="block text-xs font-semibold text-dim uppercase tracking-wider mb-2">Cinematic LUT Filters</label>
            <div className="grid grid-cols-2 gap-2">
              {LUT_PRESETS.map((lut) => (
                <button
                  key={lut.id}
                  type="button"
                  onClick={() => setConfig({ ...config, lutId: lut.id })}
                  className={cn("p-2.5 rounded-xl border text-left cursor-pointer transition-all flex items-center gap-2.5",
                    config.lutId === lut.id ? "border-accent bg-accent/15" : "border-hairline bg-surface/30 hover:bg-surface")}
                >
                  <div
                    style={{ background: lut.sampleGradient }}
                    className="w-7 h-7 rounded-lg shrink-0 shadow-sm border border-white/20"
                  />
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-cream truncate block">{lut.name}</span>
                    <p className="text-[10px] text-dim truncate">{lut.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-dim flex items-center gap-1"><Sliders size={12} /> Filter Intensity</span>
                <span className="text-xs text-accent font-mono">{config.intensityPercent}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={config.intensityPercent}
                onChange={(e) => setConfig({ ...config, intensityPercent: Number(e.target.value) })}
                className="w-full accent-accent cursor-pointer"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-dim flex items-center gap-1"><Sun size={12} /> Color Warmth</span>
                <span className="text-xs text-accent font-mono">
                  {config.warmth > 0 ? `+${config.warmth}` : config.warmth}
                </span>
              </div>
              <input
                type="range"
                min={-30}
                max={30}
                value={config.warmth}
                onChange={(e) => setConfig({ ...config, warmth: Number(e.target.value) })}
                className="w-full accent-accent cursor-pointer"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-dim">Image Contrast</span>
                <span className="text-xs text-accent font-mono">{config.contrastPercent}%</span>
              </div>
              <input
                type="range"
                min={80}
                max={140}
                value={config.contrastPercent}
                onChange={(e) => setConfig({ ...config, contrastPercent: Number(e.target.value) })}
                className="w-full accent-accent cursor-pointer"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-dim">Color Saturation</span>
                <span className="text-xs text-accent font-mono">{config.saturationPercent}%</span>
              </div>
              <input
                type="range"
                min={60}
                max={150}
                value={config.saturationPercent}
                onChange={(e) => setConfig({ ...config, saturationPercent: Number(e.target.value) })}
                className="w-full accent-accent cursor-pointer"
              />
            </div>
          </div>

          <div className="p-3 rounded-xl border border-hairline bg-surface/30 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-cream">
              <Sparkles size={14} className="text-accent" />
              <span>LUTs are hardware-accelerated directly onto video canvas during export.</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t border-hairline bg-surface/50">
          <button
            type="button"
            onClick={() => setConfig(DEFAULT_CONFIG)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs text-dim hover:text-cream transition-colors cursor-pointer"
          >
            <RotateCcw size={13} /> Reset Grade
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
              <Check size={14} /> Apply Color Grade
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
