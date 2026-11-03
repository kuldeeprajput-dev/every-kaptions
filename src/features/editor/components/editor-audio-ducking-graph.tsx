"use client";

import { useId, useRef, useState } from "react";
import { Check, Mic, Music, RotateCcw, Sliders, VolumeX, Waves, X } from "lucide-react";
import { cn } from "@/shared/lib/cn";
import { useDialogFocus } from "@/shared/hooks/use-dialog-focus";

export interface DuckingEnvelopeConfig {
  lookaheadMs: number;
  duckingDepthDb: number;
  holdDurationMs: number;
  releaseDurationMs: number;
  curveShape: "smooth" | "linear" | "exponential";
}

export interface EditorAudioDuckingGraphProps {
  isOpen: boolean;
  onClose: () => void;
  config?: DuckingEnvelopeConfig;
  onApplyConfig: (config: DuckingEnvelopeConfig) => void;
}

const DEFAULT_CONFIG: DuckingEnvelopeConfig = {
  lookaheadMs: 120,
  duckingDepthDb: -14,
  holdDurationMs: 350,
  releaseDurationMs: 600,
  curveShape: "smooth",
};

export function EditorAudioDuckingGraph({
  isOpen,
  onClose,
  config: initialConfig,
  onApplyConfig,
}: EditorAudioDuckingGraphProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  useDialogFocus(dialogRef, isOpen);

  const [config, setConfig] = useState<DuckingEnvelopeConfig>(initialConfig || DEFAULT_CONFIG);

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
            <div className="p-2 rounded-xl bg-accent/10 text-accent"><Waves size={18} /></div>
            <div>
              <h2 id={titleId} className="text-sm font-semibold text-cream">Audio Ducking Envelope Curve</h2>
              <p className="text-xs text-dim">Fine-tune how background music dips when dialogue starts</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg text-dim hover:text-cream hover:bg-surface transition-colors cursor-pointer" aria-label="Close ducking graph">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="p-4 rounded-xl border border-hairline bg-surface/50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-mono text-dim tracking-wider">Ducking Gain Curve Simulation</span>
              <span className="text-xs font-mono font-bold text-accent">{config.duckingDepthDb} dB Drop</span>
            </div>

            <div className="h-28 w-full bg-surface-raised/60 rounded-lg border border-hairline relative flex items-center justify-center overflow-hidden p-2">
              <svg className="w-full h-full" viewBox="0 0 400 100" preserveAspectRatio="none">
                <rect x="0" y="0" width="400" height="100" fill="none" />
                <rect x="120" y="10" width="160" height="80" fill="rgba(234, 179, 8, 0.08)" rx="4" />
                <line x1="0" y1="20" x2="400" y2="20" stroke="rgba(255,255,255,0.1)" strokeDasharray="4 4" />
                <line x1="0" y1="80" x2="400" y2="80" stroke="rgba(255,255,255,0.1)" strokeDasharray="4 4" />
                <path
                  d="M 0 20 L 100 20 C 115 20 120 80 140 80 L 260 80 C 280 80 290 20 320 20 L 400 20"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="3"
                />
              </svg>
              <div className="absolute top-2 left-3 flex items-center gap-1 text-[10px] text-sky-400 font-mono">
                <Music size={11} /> Music Level
              </div>
              <div className="absolute top-2 right-3 flex items-center gap-1 text-[10px] text-amber-400 font-mono">
                <Mic size={11} /> Speech Zone
              </div>
            </div>

            <div className="flex items-center justify-between text-[10px] font-mono text-dim">
              <span>Attack ({config.lookaheadMs}ms)</span>
              <span>Hold ({config.holdDurationMs}ms)</span>
              <span>Release ({config.releaseDurationMs}ms)</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-dim flex items-center gap-1"><VolumeX size={12} /> Ducking Depth</span>
                <span className="text-xs text-accent font-mono">{config.duckingDepthDb} dB</span>
              </div>
              <input
                type="range"
                min={-24}
                max={-6}
                value={config.duckingDepthDb}
                onChange={(e) => setConfig({ ...config, duckingDepthDb: Number(e.target.value) })}
                className="w-full accent-accent cursor-pointer"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-dim flex items-center gap-1"><Sliders size={12} /> Pre-Roll Lookahead</span>
                <span className="text-xs text-accent font-mono">{config.lookaheadMs} ms</span>
              </div>
              <input
                type="range"
                min={20}
                max={300}
                step={10}
                value={config.lookaheadMs}
                onChange={(e) => setConfig({ ...config, lookaheadMs: Number(e.target.value) })}
                className="w-full accent-accent cursor-pointer"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-dim">Hold Duration</span>
                <span className="text-xs text-accent font-mono">{config.holdDurationMs} ms</span>
              </div>
              <input
                type="range"
                min={100}
                max={800}
                step={25}
                value={config.holdDurationMs}
                onChange={(e) => setConfig({ ...config, holdDurationMs: Number(e.target.value) })}
                className="w-full accent-accent cursor-pointer"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-dim">Release Fadeback</span>
                <span className="text-xs text-accent font-mono">{config.releaseDurationMs} ms</span>
              </div>
              <input
                type="range"
                min={200}
                max={1200}
                step={50}
                value={config.releaseDurationMs}
                onChange={(e) => setConfig({ ...config, releaseDurationMs: Number(e.target.value) })}
                className="w-full accent-accent cursor-pointer"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-dim uppercase tracking-wider mb-2">Transition Fade Curve</label>
            <div className="flex gap-2">
              {[
                { id: "smooth", label: "Smooth S-Curve", desc: "Cinematic, non-jarring volume dip" },
                { id: "linear", label: "Linear Slope", desc: "Even, constant attenuation rate" },
                { id: "exponential", label: "Exponential Fast", desc: "Immediate drop for aggressive vocals" },
              ].map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setConfig({ ...config, curveShape: c.id as DuckingEnvelopeConfig["curveShape"] })}
                  className={cn("flex-1 p-2 rounded-xl border text-left cursor-pointer transition-colors",
                    config.curveShape === c.id ? "border-accent bg-accent/15" : "border-hairline bg-surface text-dim hover:text-cream")}
                >
                  <div className="text-xs font-semibold text-cream mb-0.5">{c.label}</div>
                  <p className="text-[10px] text-dim">{c.desc}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t border-hairline bg-surface/50">
          <button
            type="button"
            onClick={() => setConfig(DEFAULT_CONFIG)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs text-dim hover:text-cream transition-colors cursor-pointer"
          >
            <RotateCcw size={13} /> Reset Natural Curve
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
              <Check size={14} /> Apply Ducking Curve
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
