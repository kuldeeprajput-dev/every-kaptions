"use client";

import { useId, useRef, useState } from "react";
import { Check, Play, RotateCcw, Sparkles, Wand2, X, Zap } from "lucide-react";
import { cn } from "@/shared/lib/cn";
import { useDialogFocus } from "@/shared/hooks/use-dialog-focus";

export type AnimationType =
  | "bounce"
  | "fade-up"
  | "pop-in"
  | "slide-left"
  | "karaoke-glow"
  | "word-stagger";

export type AnimationEasing = "spring" | "ease-out" | "linear" | "bouncy";

export interface CaptionAnimationConfig {
  type: AnimationType;
  durationMs: number;
  wordScale: number;
  highlightColor: string;
  easing: AnimationEasing;
  glowEnabled: boolean;
  staggerDelayMs: number;
}

export interface EditorCaptionAnimatorProps {
  isOpen: boolean;
  onClose: () => void;
  config?: CaptionAnimationConfig;
  onApplyConfig: (config: CaptionAnimationConfig) => void;
}

const DEFAULT_CONFIG: CaptionAnimationConfig = {
  type: "bounce",
  durationMs: 280,
  wordScale: 1.15,
  highlightColor: "#eab308",
  easing: "spring",
  glowEnabled: true,
  staggerDelayMs: 60,
};

const ANIMATION_PRESETS: { type: AnimationType; label: string; desc: string }[] = [
  { type: "bounce", label: "Dynamic Bounce", desc: "Punchy vertical pop with natural spring bounce" },
  { type: "fade-up", label: "Smooth Fade Up", desc: "Subtle cinematic upward rise with fade" },
  { type: "pop-in", label: "Scale Pop", desc: "Sudden explosive zoom with soft settling" },
  { type: "slide-left", label: "Horizontal Slide", desc: "Smooth lateral motion across line text" },
  { type: "karaoke-glow", label: "Karaoke Glow", desc: "Color wipe with glowing neon highlight bloom" },
  { type: "word-stagger", label: "Word Stagger", desc: "Rapid sequential cascading reveal of each word" },
];

const PREVIEW_WORDS = ["MAKE", "EVERY", "REEL", "POP"];

export function EditorCaptionAnimator({
  isOpen,
  onClose,
  config: initialConfig,
  onApplyConfig,
}: EditorCaptionAnimatorProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  useDialogFocus(dialogRef, isOpen);

  const [config, setConfig] = useState<CaptionAnimationConfig>(initialConfig || DEFAULT_CONFIG);
  const [previewActiveIndex, setPreviewActiveIndex] = useState(1);

  if (!isOpen) return null;

  const handleCyclePreview = () => {
    setPreviewActiveIndex((prev) => (prev + 1) % PREVIEW_WORDS.length);
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
            <div className="p-2 rounded-xl bg-accent/10 text-accent"><Sparkles size={18} /></div>
            <div>
              <h2 id={titleId} className="text-sm font-semibold text-cream">Kinetic Caption Animations</h2>
              <p className="text-xs text-dim">Active word transitions and dynamic motion curves</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg text-dim hover:text-cream hover:bg-surface transition-colors cursor-pointer" aria-label="Close animator dialog">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="p-4 rounded-xl border border-hairline bg-surface/40 flex flex-col items-center justify-center text-center relative overflow-hidden min-h-[100px]">
            <span className="text-[10px] uppercase tracking-wider text-dim font-mono mb-2">Live Animation Preview</span>
            <div className="flex items-center gap-2">
              {PREVIEW_WORDS.map((w, idx) => {
                const isActive = idx === previewActiveIndex;
                return (
                  <span
                    key={w}
                    style={{
                      color: isActive ? config.highlightColor : undefined,
                      transform: isActive ? `scale(${config.wordScale})` : "scale(1)",
                      textShadow: isActive && config.glowEnabled ? `0 0 12px ${config.highlightColor}80` : "none",
                      transition: `all ${config.durationMs}ms cubic-bezier(0.34, 1.56, 0.64, 1)`,
                    }}
                    className={cn("text-lg font-black tracking-tight", isActive ? "font-extrabold" : "text-dim opacity-70")}
                  >
                    {w}
                  </span>
                );
              })}
            </div>
            <button
              type="button"
              onClick={handleCyclePreview}
              className="mt-3 text-[11px] text-accent hover:underline flex items-center gap-1 cursor-pointer font-medium"
            >
              <Play size={11} /> Replay Word Cycle
            </button>
          </div>

          <div>
            <label className="block text-xs font-semibold text-dim uppercase tracking-wider mb-2">Motion Preset</label>
            <div className="grid grid-cols-2 gap-2">
              {ANIMATION_PRESETS.map((preset) => (
                <button
                  key={preset.type}
                  type="button"
                  onClick={() => setConfig({ ...config, type: preset.type })}
                  className={cn("p-2.5 rounded-xl border text-left transition-all cursor-pointer",
                    config.type === preset.type ? "border-accent bg-accent/15" : "border-hairline bg-surface/30 hover:bg-surface")}
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className={cn("text-xs font-bold", config.type === preset.type ? "text-accent" : "text-cream")}>{preset.label}</span>
                    {config.type === preset.type && <Zap size={12} className="text-accent" />}
                  </div>
                  <p className="text-[10px] text-dim leading-tight">{preset.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-dim">Transition Duration</span>
                <span className="text-xs text-accent font-mono">{config.durationMs}ms</span>
              </div>
              <input
                type="range"
                min={150}
                max={600}
                step={10}
                value={config.durationMs}
                onChange={(e) => setConfig({ ...config, durationMs: Number(e.target.value) })}
                className="w-full accent-accent cursor-pointer"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-dim">Word Zoom Scale</span>
                <span className="text-xs text-accent font-mono">{config.wordScale.toFixed(2)}x</span>
              </div>
              <input
                type="range"
                min={1.0}
                max={1.4}
                step={0.05}
                value={config.wordScale}
                onChange={(e) => setConfig({ ...config, wordScale: Number(e.target.value) })}
                className="w-full accent-accent cursor-pointer"
              />
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl border border-hairline bg-surface/30">
            <div className="flex items-center gap-2">
              <Wand2 size={14} className="text-accent" />
              <div>
                <span className="text-xs font-semibold text-cream">Highlight Glow Bloom</span>
                <p className="text-[10px] text-dim">Add luminous neon glow around the spoken active word</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={config.glowEnabled}
              onChange={(e) => setConfig({ ...config, glowEnabled: e.target.checked })}
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
            <RotateCcw size={13} /> Default Motion
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
              <Check size={14} /> Apply Motion
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
