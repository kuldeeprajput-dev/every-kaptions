"use client";

import { useId, useRef, useState } from "react";
import { Activity, Check, Mic2, RotateCcw, Sliders, Volume2, X } from "lucide-react";
import { cn } from "@/shared/lib/cn";
import { useDialogFocus } from "@/shared/hooks/use-dialog-focus";

export interface CompressorConfig {
  thresholdDb: number;
  ratio: number;
  attackMs: number;
  releaseMs: number;
  makeupGainDb: number;
  softKnee: boolean;
}

export interface EditorSilenceCompressorProps {
  isOpen: boolean;
  onClose: () => void;
  config?: CompressorConfig;
  onApplyConfig: (config: CompressorConfig) => void;
}

const DEFAULT_CONFIG: CompressorConfig = {
  thresholdDb: -18,
  ratio: 3.5,
  attackMs: 12,
  releaseMs: 120,
  makeupGainDb: 4.5,
  softKnee: true,
};

const COMPRESSOR_PRESETS = [
  { name: "Podcast Host", desc: "Even, warm vocal levels with moderate clamp", config: { thresholdDb: -18, ratio: 3.0, attackMs: 15, releaseMs: 140, makeupGainDb: 3.5, softKnee: true } },
  { name: "Punchy Reel", desc: "Aggressive short-form voice leveling for noisy feeds", config: { thresholdDb: -22, ratio: 4.5, attackMs: 6, releaseMs: 80, makeupGainDb: 6.0, softKnee: false } },
  { name: "Whisper Booster", desc: "Brings quiet speech up without clipping peaks", config: { thresholdDb: -28, ratio: 5.0, attackMs: 4, releaseMs: 160, makeupGainDb: 8.0, softKnee: true } },
  { name: "Broadcast Radio", desc: "Classic studio broadcast limiter with soft knee", config: { thresholdDb: -14, ratio: 2.5, attackMs: 20, releaseMs: 200, makeupGainDb: 2.0, softKnee: true } },
];

export function EditorSilenceCompressor({
  isOpen,
  onClose,
  config: initialConfig,
  onApplyConfig,
}: EditorSilenceCompressorProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  useDialogFocus(dialogRef, isOpen);

  const [config, setConfig] = useState<CompressorConfig>(initialConfig || DEFAULT_CONFIG);

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
            <div className="p-2 rounded-xl bg-accent/10 text-accent"><Activity size={18} /></div>
            <div>
              <h2 id={titleId} className="text-sm font-semibold text-cream">Audio Dynamic Range Compressor</h2>
              <p className="text-xs text-dim">Level uneven voices and boost vocal punch across mobile speakers</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg text-dim hover:text-cream hover:bg-surface transition-colors cursor-pointer" aria-label="Close compressor">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="p-3.5 rounded-xl border border-hairline bg-surface/40 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mic2 size={16} className="text-accent" />
              <div>
                <span className="text-xs font-semibold text-cream">Voice Leveling Envelope</span>
                <p className="text-[10px] text-dim">Active Ratio {config.ratio}:1 &bull; Gain +{config.makeupGainDb} dB</p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-accent">Auto-Level Active</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-dim uppercase tracking-wider mb-2">Vocal Compressor Presets</label>
            <div className="grid grid-cols-2 gap-2">
              {COMPRESSOR_PRESETS.map((p) => (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => setConfig({ ...p.config })}
                  className={cn("p-2.5 rounded-xl border text-left cursor-pointer transition-all",
                    config.thresholdDb === p.config.thresholdDb && config.ratio === p.config.ratio
                      ? "border-accent bg-accent/15"
                      : "border-hairline bg-surface/30 hover:bg-surface")}
                >
                  <div className="text-xs font-bold text-cream mb-0.5">{p.name}</div>
                  <p className="text-[10px] text-dim leading-tight">{p.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-dim flex items-center gap-1"><Sliders size={12} /> Threshold</span>
                <span className="text-xs text-accent font-mono">{config.thresholdDb} dB</span>
              </div>
              <input
                type="range"
                min={-36}
                max={-6}
                value={config.thresholdDb}
                onChange={(e) => setConfig({ ...config, thresholdDb: Number(e.target.value) })}
                className="w-full accent-accent cursor-pointer"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-dim">Compression Ratio</span>
                <span className="text-xs text-accent font-mono">{config.ratio.toFixed(1)}:1</span>
              </div>
              <input
                type="range"
                min={1.5}
                max={8.0}
                step={0.5}
                value={config.ratio}
                onChange={(e) => setConfig({ ...config, ratio: Number(e.target.value) })}
                className="w-full accent-accent cursor-pointer"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-dim">Attack Time</span>
                <span className="text-xs text-accent font-mono">{config.attackMs} ms</span>
              </div>
              <input
                type="range"
                min={2}
                max={40}
                value={config.attackMs}
                onChange={(e) => setConfig({ ...config, attackMs: Number(e.target.value) })}
                className="w-full accent-accent cursor-pointer"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-dim">Release Time</span>
                <span className="text-xs text-accent font-mono">{config.releaseMs} ms</span>
              </div>
              <input
                type="range"
                min={40}
                max={400}
                step={10}
                value={config.releaseMs}
                onChange={(e) => setConfig({ ...config, releaseMs: Number(e.target.value) })}
                className="w-full accent-accent cursor-pointer"
              />
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-hairline bg-surface/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-cream flex items-center gap-1.5">
                <Volume2 size={13} className="text-accent" /> Makeup Gain
              </span>
              <span className="text-xs font-mono text-accent">+{config.makeupGainDb.toFixed(1)} dB</span>
            </div>
            <input
              type="range"
              min={0}
              max={12}
              step={0.5}
              value={config.makeupGainDb}
              onChange={(e) => setConfig({ ...config, makeupGainDb: Number(e.target.value) })}
              className="w-full accent-accent cursor-pointer"
            />
          </div>
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t border-hairline bg-surface/50">
          <button
            type="button"
            onClick={() => setConfig(DEFAULT_CONFIG)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs text-dim hover:text-cream transition-colors cursor-pointer"
          >
            <RotateCcw size={13} /> Reset Leveler
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
              <Check size={14} /> Apply Compression
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
