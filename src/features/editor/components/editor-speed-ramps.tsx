"use client";

import { useId, useRef, useState } from "react";
import { Check, Gauge, X } from "lucide-react";
import { cn } from "@/shared/lib/cn";
import { useDialogFocus } from "@/shared/hooks/use-dialog-focus";
import type { CaptionSegment } from "../types/captions";

export interface SpeedRampConfig {
  globalSpeedMultiplier: number;
  preserveAudioPitch: boolean;
  rampCurveType: "smooth-ease" | "linear" | "snap-cut";
  slowDownEmphasisSegments: boolean;
  speedUpSilentGaps: boolean;
  smoothTransitionDurationMs: number;
}

export interface EditorSpeedRampsProps {
  isOpen: boolean;
  onClose: () => void;
  segments: CaptionSegment[];
  onApplySpeedRamp: (config: SpeedRampConfig) => void;
  initialConfig?: Partial<SpeedRampConfig>;
}

const SPEED_PRESETS = [
  { rate: 0.75, label: "0.75x Slow", desc: "Detailed tutorial explanation" },
  { rate: 1.0, label: "1.0x Normal", desc: "Original captured video speed" },
  { rate: 1.15, label: "1.15x Snappy", desc: "Subtle pacing boost for engagement" },
  { rate: 1.25, label: "1.25x Brisk", desc: "Fast-talking TikTok / Shorts pacing" },
  { rate: 1.5, label: "1.5x Speedrun", desc: "High-density coding or demo recap" },
  { rate: 2.0, label: "2.0x Timelapse", desc: "B-roll montage or long process" },
];

export function EditorSpeedRamps({
  isOpen,
  onClose,
  segments,
  onApplySpeedRamp,
  initialConfig,
}: EditorSpeedRampsProps) {
  const dialogId = useId();
  const titleId = `${dialogId}-title`;
  const dialogRef = useRef<HTMLDivElement>(null);
  useDialogFocus(dialogRef, isOpen);

  const [speed, setSpeed] = useState<number>(initialConfig?.globalSpeedMultiplier ?? 1.15);
  const [pitchPreserve, setPitchPreserve] = useState<boolean>(initialConfig?.preserveAudioPitch ?? true);
  const [curve, setCurve] = useState<"smooth-ease" | "linear" | "snap-cut">(initialConfig?.rampCurveType ?? "smooth-ease");
  const [smoothDuration, setSmoothDuration] = useState<number>(initialConfig?.smoothTransitionDurationMs ?? 250);
  const [slowEmphasis, setSlowEmphasis] = useState<boolean>(initialConfig?.slowDownEmphasisSegments ?? false);
  const [speedGaps, setSpeedGaps] = useState<boolean>(initialConfig?.speedUpSilentGaps ?? true);

  if (!isOpen) return null;

  const originalDuration = segments.length > 0 ? segments[segments.length - 1].end : 60;
  const newDuration = Math.round((originalDuration / speed) * 10) / 10;
  const timeSaved = Math.max(0, Math.round((originalDuration - newDuration) * 10) / 10);

  const handleSave = () => {
    onApplySpeedRamp({
      globalSpeedMultiplier: speed,
      preserveAudioPitch: pitchPreserve,
      rampCurveType: curve,
      slowDownEmphasisSegments: slowEmphasis,
      speedUpSilentGaps: speedGaps,
      smoothTransitionDurationMs: smoothDuration,
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
              <Gauge size={18} />
            </div>
            <div>
              <h2 id={titleId} className="text-sm font-semibold text-cream">Video Speed Ramps & Tempo</h2>
              <p className="text-xs text-dim">Tune video pacing with pitch-corrected speed curves</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg text-dim hover:text-cream hover:bg-surface transition-colors cursor-pointer" aria-label="Close speed ramps modal">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          <div className="grid grid-cols-3 gap-2.5 p-3 rounded-xl bg-surface-raised/50 border border-hairline text-center text-xs">
            <div>
              <span className="text-[10px] text-dim uppercase tracking-wider block">Playback Speed</span>
              <span className="text-sm font-bold text-accent">{speed.toFixed(2)}x</span>
            </div>
            <div>
              <span className="text-[10px] text-dim uppercase tracking-wider block">New Runtime</span>
              <span className="text-sm font-bold text-cream">{newDuration}s</span>
            </div>
            <div>
              <span className="text-[10px] text-dim uppercase tracking-wider block">Time Saved</span>
              <span className="text-sm font-bold text-emerald-400">-{timeSaved}s</span>
            </div>
          </div>

          <section>
            <label className="text-xs font-semibold text-dim uppercase tracking-wider block mb-2">Pacing Presets</label>
            <div className="grid grid-cols-3 gap-2">
              {SPEED_PRESETS.map((p) => {
                const isSelected = speed === p.rate;
                return (
                  <button
                    key={p.rate}
                    type="button"
                    onClick={() => setSpeed(p.rate)}
                    className={cn(
                      "p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer",
                      isSelected
                        ? "border-accent bg-accent-soft text-cream font-medium shadow-sm"
                        : "border-hairline bg-surface-raised/40 hover:bg-surface-raised text-body hover:text-cream",
                    )}
                  >
                    <span className="font-semibold block mb-0.5">{p.label}</span>
                    <span className="text-[10px] text-dim line-clamp-1">{p.desc}</span>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="space-y-3.5 pt-2 border-t border-hairline text-xs">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-cream">Custom Speed Multiplier</span>
                <span className="text-dim font-mono">{speed.toFixed(2)}x</span>
              </div>
              <input type="range" min="0.6" max="2.0" step="0.05" value={speed} onChange={(e) => setSpeed(parseFloat(e.target.value))} className="w-full accent-accent h-1.5 bg-surface-raised rounded-lg cursor-pointer" />
            </div>

            <div>
              <label className="text-xs font-semibold text-dim uppercase tracking-wider block mb-2">Ramping Transition Curve</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "smooth-ease", label: "Smooth S-Curve", desc: "Cinematic gradual ramp" },
                  { id: "linear", label: "Linear Constant", desc: "Even constant speed" },
                  { id: "snap-cut", label: "Instant Snap", desc: "Direct punchy transition" },
                ].map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCurve(c.id as "smooth-ease" | "linear" | "snap-cut")}
                    className={cn(
                      "p-2.5 rounded-lg border text-left transition-colors cursor-pointer",
                      curve === c.id ? "border-accent bg-accent-soft text-accent font-semibold" : "border-hairline text-dim hover:text-cream",
                    )}
                  >
                    <span className="font-semibold block">{c.label}</span>
                    <span className="text-[10px] text-dim">{c.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <label className="flex items-center gap-2 p-2 rounded-lg hover:bg-surface-raised cursor-pointer text-body hover:text-cream">
                <input type="checkbox" checked={pitchPreserve} onChange={(e) => setPitchPreserve(e.target.checked)} className="rounded text-accent accent-accent" />
                <div>
                  <span className="font-medium text-cream block">Pitch Preservation Lock</span>
                  <span className="text-[11px] text-dim">Prevents voice from sounding like high-pitched chipmunk</span>
                </div>
              </label>

              <label className="flex items-center gap-2 p-2 rounded-lg hover:bg-surface-raised cursor-pointer text-body hover:text-cream">
                <input type="checkbox" checked={speedGaps} onChange={(e) => setSpeedGaps(e.target.checked)} className="rounded text-accent accent-accent" />
                <div>
                  <span className="font-medium text-cream block">Fast-forward silent pauses</span>
                  <span className="text-[11px] text-dim">Accelerates non-vocal gaps to 1.75x while keeping speech natural</span>
                </div>
              </label>

              <label className="flex items-center gap-2 p-2 rounded-lg hover:bg-surface-raised cursor-pointer text-body hover:text-cream">
                <input type="checkbox" checked={slowEmphasis} onChange={(e) => setSlowEmphasis(e.target.checked)} className="rounded text-accent accent-accent" />
                <div>
                  <span className="font-medium text-cream block">Dramatic Slowdown on Punchlines</span>
                  <span className="text-[11px] text-dim">Briefly slows to 0.9x during key emphasized words</span>
                </div>
              </label>
            </div>
          </section>
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t border-hairline bg-surface-raised">
          <p className="text-xs text-dim">Video timeline duration will be scaled by {speed.toFixed(2)}x</p>
          <div className="flex items-center gap-2.5">
            <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-semibold text-dim hover:text-cream transition-colors cursor-pointer">
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-accent text-white hover:bg-accent/90 shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Check size={14} /> Apply Speed Curve
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
