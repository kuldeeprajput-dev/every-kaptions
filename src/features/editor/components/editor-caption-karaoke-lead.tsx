"use client";

import { useId, useRef, useState } from "react";
import { Check, Mic2, Play, RotateCcw, Sliders, Sparkles, Wand2, X } from "lucide-react";
import { cn } from "@/shared/lib/cn";
import { useDialogFocus } from "@/shared/hooks/use-dialog-focus";

export type KaraokeStyleMode = "progressive-gradient" | "instant-snap" | "glow-bloom" | "bounce-pulse";

export interface KaraokeLeadConfig {
  mode: KaraokeStyleMode;
  leadInMs: number;
  activeScale: number;
  highlightColor: string;
  gradientAngleDeg: number;
  pulseVibration: boolean;
}

export interface EditorCaptionKaraokeLeadProps {
  isOpen: boolean;
  onClose: () => void;
  config?: KaraokeLeadConfig;
  onApplyConfig: (config: KaraokeLeadConfig) => void;
}

const DEFAULT_CONFIG: KaraokeLeadConfig = {
  mode: "progressive-gradient",
  leadInMs: 65,
  activeScale: 1.15,
  highlightColor: "#eab308",
  gradientAngleDeg: 90,
  pulseVibration: true,
};

const DEMO_WORDS = ["SPEECH", "SYNCED", "KARAOKE", "FLOW"];

export function EditorCaptionKaraokeLead({
  isOpen,
  onClose,
  config: initialConfig,
  onApplyConfig,
}: EditorCaptionKaraokeLeadProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  useDialogFocus(dialogRef, isOpen);

  const [config, setConfig] = useState<KaraokeLeadConfig>(initialConfig || DEFAULT_CONFIG);
  const [activeWordIdx, setActiveWordIdx] = useState(1);

  if (!isOpen) return null;

  const handleNextWord = () => {
    setActiveWordIdx((prev) => (prev + 1) % DEMO_WORDS.length);
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
            <div className="p-2 rounded-xl bg-accent/10 text-accent"><Mic2 size={18} /></div>
            <div>
              <h2 id={titleId} className="text-sm font-semibold text-cream">Karaoke Syllable & Rhythm Lead-In</h2>
              <p className="text-xs text-dim">Fine-tune vocal sync anticipation and dynamic syllable wipe</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg text-dim hover:text-cream hover:bg-surface transition-colors cursor-pointer" aria-label="Close karaoke configurator">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="p-5 rounded-xl border border-hairline bg-surface/50 flex flex-col items-center justify-center text-center relative overflow-hidden min-h-[110px]">
            <span className="text-[10px] uppercase font-mono text-dim tracking-wider mb-2">Live Rhythm Preview</span>
            <div className="flex items-center gap-2">
              {DEMO_WORDS.map((w, idx) => {
                const isActive = idx === activeWordIdx;
                return (
                  <span
                    key={w}
                    style={{
                      color: isActive ? config.highlightColor : undefined,
                      transform: isActive ? `scale(${config.activeScale})` : "scale(1)",
                      textShadow: isActive && config.mode === "glow-bloom" ? `0 0 16px ${config.highlightColor}` : "none",
                      transition: `transform ${config.leadInMs + 100}ms cubic-bezier(0.34, 1.56, 0.64, 1), color 120ms ease`,
                    }}
                    className={cn("text-xl font-black tracking-tight", isActive ? "font-extrabold" : "text-dim opacity-70")}
                  >
                    {w}
                  </span>
                );
              })}
            </div>
            <button
              type="button"
              onClick={handleNextWord}
              className="mt-3 text-[11px] text-accent hover:underline flex items-center gap-1 cursor-pointer font-medium"
            >
              <Play size={11} /> Step Syllable Focus
            </button>
          </div>

          <div>
            <label className="block text-xs font-semibold text-dim uppercase tracking-wider mb-2">Syllable Rhythm Engine</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: "progressive-gradient", label: "Progressive Wipe", desc: "Smooth horizontal color fill across characters" },
                { id: "instant-snap", label: "Instant Word Snap", desc: "Instantaneous high-impact color switch per word" },
                { id: "glow-bloom", label: "Luminous Glow", desc: "Neon aura blossoms around the spoken word" },
                { id: "bounce-pulse", label: "Elastic Pulse", desc: "Bouncy zoom pop matched to speech inflection" },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setConfig({ ...config, mode: m.id as KaraokeStyleMode })}
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
                <span className="text-xs text-dim flex items-center gap-1"><Sliders size={12} /> Lead-In Anticipation</span>
                <span className="text-xs text-accent font-mono">{config.leadInMs} ms</span>
              </div>
              <input
                type="range"
                min={0}
                max={180}
                step={5}
                value={config.leadInMs}
                onChange={(e) => setConfig({ ...config, leadInMs: Number(e.target.value) })}
                className="w-full accent-accent cursor-pointer"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-dim flex items-center gap-1"><Sparkles size={12} /> Active Word Zoom</span>
                <span className="text-xs text-accent font-mono">{config.activeScale.toFixed(2)}x</span>
              </div>
              <input
                type="range"
                min={1.0}
                max={1.35}
                step={0.05}
                value={config.activeScale}
                onChange={(e) => setConfig({ ...config, activeScale: Number(e.target.value) })}
                className="w-full accent-accent cursor-pointer"
              />
            </div>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl border border-hairline bg-surface/30">
            <div className="flex items-center gap-2">
              <Wand2 size={14} className="text-accent" />
              <div>
                <span className="text-xs font-semibold text-cream">Slight Word Pulse Vibration</span>
                <p className="text-[10px] text-dim">Subtle tactile spring bounce when word triggers</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={config.pulseVibration}
              onChange={(e) => setConfig({ ...config, pulseVibration: e.target.checked })}
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
            <RotateCcw size={13} /> Reset Natural Flow
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
              <Check size={14} /> Apply Karaoke Style
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
