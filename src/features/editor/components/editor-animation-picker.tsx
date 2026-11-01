"use client";

import { useId, useRef, useState } from "react";
import { Check, Flame, Play, Sparkles, Wand2, X, Zap } from "lucide-react";
import { cn } from "@/shared/lib/cn";
import { useDialogFocus } from "@/shared/hooks/use-dialog-focus";

export type CaptionMotionStyle = "pop-bounce" | "typewriter" | "slide-up" | "fade-reveal" | "karaoke-pulse";

export interface CaptionAnimationConfig {
  style: CaptionMotionStyle;
  activeScaleMultiplier: number;
  transitionDurationMs: number;
  wordGlowIntensity: number;
  motionEasing: "spring" | "ease-out" | "linear";
  highlightActiveWord: boolean;
}

export interface EditorAnimationPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyConfig: (config: CaptionAnimationConfig) => void;
  initialConfig?: Partial<CaptionAnimationConfig>;
}

interface AnimationPreset {
  id: CaptionMotionStyle;
  name: string;
  badge: string;
  description: string;
  defaultScale: number;
  defaultDurationMs: number;
}

const ANIMATION_PRESETS: AnimationPreset[] = [
  { id: "pop-bounce", name: "Pop & Bounce", badge: "Energetic", description: "Bouncy scale expansion on every spoken word for high retention", defaultScale: 1.25, defaultDurationMs: 180 },
  { id: "typewriter", name: "Typewriter Glow", badge: "Modern", description: "Sequential character glow appearance matching spoken pace", defaultScale: 1.1, defaultDurationMs: 140 },
  { id: "slide-up", name: "Word Slide Up", badge: "Smooth", description: "Clean vertical rise with subtle motion blur for documentary aesthetic", defaultScale: 1.15, defaultDurationMs: 220 },
  { id: "fade-reveal", name: "Fade Reveal", badge: "Minimal", description: "Understated opacity transition for sleek, professional brand reels", defaultScale: 1.05, defaultDurationMs: 260 },
  { id: "karaoke-pulse", name: "Karaoke Pulse", badge: "Viral", description: "Luminous color fill sweeping across words synchronized with audio", defaultScale: 1.2, defaultDurationMs: 160 },
];

export function EditorAnimationPicker({
  isOpen,
  onClose,
  onApplyConfig,
  initialConfig,
}: EditorAnimationPickerProps) {
  const dialogId = useId();
  const titleId = `${dialogId}-title`;
  const dialogRef = useRef<HTMLDivElement>(null);
  useDialogFocus(dialogRef, isOpen);

  const [style, setStyle] = useState<CaptionMotionStyle>(initialConfig?.style ?? "pop-bounce");
  const [scale, setScale] = useState<number>(initialConfig?.activeScaleMultiplier ?? 1.2);
  const [duration, setDuration] = useState<number>(initialConfig?.transitionDurationMs ?? 180);
  const [glow, setGlow] = useState<number>(initialConfig?.wordGlowIntensity ?? 65);
  const [easing, setEasing] = useState<"spring" | "ease-out" | "linear">(initialConfig?.motionEasing ?? "spring");
  const [highlight, setHighlight] = useState<boolean>(initialConfig?.highlightActiveWord ?? true);
  const [previewWordIdx, setPreviewWordIdx] = useState<number>(1);

  if (!isOpen) return null;

  const handleSelectPreset = (p: AnimationPreset) => {
    setStyle(p.id);
    setScale(p.defaultScale);
    setDuration(p.defaultDurationMs);
  };

  const handleSave = () => {
    onApplyConfig({
      style,
      activeScaleMultiplier: scale,
      transitionDurationMs: duration,
      wordGlowIntensity: glow,
      motionEasing: easing,
      highlightActiveWord: highlight,
    });
    onClose();
  };

  const sampleWords = ["Create", "viral", "captions", "in", "seconds"];

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
              <Sparkles size={18} />
            </div>
            <div>
              <h2 id={titleId} className="text-sm font-semibold text-cream">Kinetic Caption Animations</h2>
              <p className="text-xs text-dim">Word-by-word motion effects and active voice transition physics</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg text-dim hover:text-cream hover:bg-surface transition-colors cursor-pointer" aria-label="Close animation picker">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          <div className="p-4 rounded-xl border border-hairline bg-black/40 flex flex-col items-center justify-center min-h-[90px] relative overflow-hidden">
            <span className="text-[10px] font-mono text-dim absolute top-2 left-3 uppercase tracking-wider">Live Motion Preview</span>
            <div className="flex items-center gap-2 mt-2">
              {sampleWords.map((word, idx) => {
                const isActive = previewWordIdx === idx;
                return (
                  <span
                    key={word}
                    onClick={() => setPreviewWordIdx(idx)}
                    style={{
                      transform: isActive ? `scale(${scale})` : "scale(1)",
                      transition: `transform ${duration}ms cubic-bezier(0.34, 1.56, 0.64, 1)`,
                      textShadow: isActive && glow > 0 ? `0 0 ${(glow / 10).toFixed(0)}px #ff4b4b` : "none",
                    }}
                    className={cn(
                      "text-sm font-bold cursor-pointer select-none transition-colors duration-150 inline-block",
                      isActive ? "text-accent" : "text-cream/80 hover:text-cream",
                    )}
                  >
                    {word}
                  </span>
                );
              })}
            </div>
            <span className="text-[10px] text-dim/70 mt-2">Click any word to test motion response</span>
          </div>

          <section>
            <label className="text-xs font-semibold text-dim uppercase tracking-wider block mb-2.5">Animation Presets</label>
            <div className="grid grid-cols-2 gap-2">
              {ANIMATION_PRESETS.map((p) => {
                const isSelected = style === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleSelectPreset(p)}
                    className={cn(
                      "p-3 rounded-xl border text-left transition-all cursor-pointer",
                      isSelected ? "border-accent bg-accent-soft text-cream font-medium shadow-sm" : "border-hairline bg-surface-raised/40 hover:bg-surface-raised text-body hover:text-cream",
                    )}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold">{p.name}</span>
                      <span className="text-[10px] font-mono text-accent">{p.badge}</span>
                    </div>
                    <p className="text-[11px] text-dim line-clamp-2 leading-relaxed">{p.description}</p>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="space-y-3 pt-2 border-t border-hairline text-xs">
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-medium text-cream">Word Pop Scale</span>
                <span className="text-dim font-mono">{scale.toFixed(2)}x</span>
              </div>
              <input type="range" min="1.0" max="1.4" step="0.05" value={scale} onChange={(e) => setScale(parseFloat(e.target.value))} className="w-full accent-accent h-1.5 bg-surface-raised rounded-lg cursor-pointer" />
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-medium text-cream">Transition Speed</span>
                <span className="text-dim font-mono">{duration} ms</span>
              </div>
              <input type="range" min="100" max="350" step="10" value={duration} onChange={(e) => setDuration(parseInt(e.target.value, 10))} className="w-full accent-accent h-1.5 bg-surface-raised rounded-lg cursor-pointer" />
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-medium text-cream">Glow Aura Intensity</span>
                <span className="text-dim font-mono">{glow}%</span>
              </div>
              <input type="range" min="0" max="100" step="5" value={glow} onChange={(e) => setGlow(parseInt(e.target.value, 10))} className="w-full accent-accent h-1.5 bg-surface-raised rounded-lg cursor-pointer" />
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-dim">Motion Easing Physics</span>
              <div className="flex items-center gap-1.5">
                {(["spring", "ease-out", "linear"] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setEasing(mode)}
                    className={cn(
                      "px-2.5 py-1 rounded-md text-[11px] border capitalize transition-colors cursor-pointer",
                      easing === mode ? "border-accent bg-accent-soft text-accent font-semibold" : "border-hairline text-dim hover:text-cream",
                    )}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>
          </section>
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t border-hairline bg-surface-raised">
          <p className="text-xs text-dim">Applies smooth transforms during video playback and export</p>
          <div className="flex items-center gap-2.5">
            <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-semibold text-dim hover:text-cream transition-colors cursor-pointer">
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-accent text-white hover:bg-accent/90 shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Check size={14} /> Apply Motion Preset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
