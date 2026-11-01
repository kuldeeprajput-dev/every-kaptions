"use client";

import { useId, useRef, useState } from "react";
import { Check, Sliders, X, Zap } from "lucide-react";
import { cn } from "@/shared/lib/cn";
import { useDialogFocus } from "@/shared/hooks/use-dialog-focus";

export interface AudioEnhancerSettings {
  vocalBoostDb: number;
  noiseGateThresholdDb: number;
  deEsserPercent: number;
  targetLufs: -14 | -16 | -23;
  highPassFilter: boolean;
  compressionLimiter: boolean;
  activePresetId: string;
}

export interface EditorAudioEnhancerProps {
  isOpen: boolean;
  onClose: () => void;
  onApplySettings: (settings: AudioEnhancerSettings) => void;
  initialSettings?: Partial<AudioEnhancerSettings>;
}

interface AudioPreset {
  id: string;
  name: string;
  description: string;
  settings: Omit<AudioEnhancerSettings, "activePresetId">;
}

const AUDIO_PRESETS: AudioPreset[] = [
  {
    id: "studio-voice",
    name: "Studio Podcast",
    description: "Warm vocal curve with background noise suppression",
    settings: { vocalBoostDb: 3.5, noiseGateThresholdDb: -42, deEsserPercent: 45, targetLufs: -14, highPassFilter: true, compressionLimiter: true },
  },
  {
    id: "crisp-dialogue",
    name: "Crisp Dialogue",
    description: "Accentuates consonants and vocal presence for phone recordings",
    settings: { vocalBoostDb: 5.0, noiseGateThresholdDb: -36, deEsserPercent: 60, targetLufs: -14, highPassFilter: true, compressionLimiter: true },
  },
  {
    id: "outdoor-vlog",
    name: "Outdoor Vlog",
    description: "Low-frequency rumble cutoff for windy mobile recordings",
    settings: { vocalBoostDb: 2.0, noiseGateThresholdDb: -30, deEsserPercent: 30, targetLufs: -16, highPassFilter: true, compressionLimiter: false },
  },
  {
    id: "broadcast-clean",
    name: "Broadcast Clean",
    description: "Compliant -23 LUFS leveling for streaming audio",
    settings: { vocalBoostDb: 1.0, noiseGateThresholdDb: -48, deEsserPercent: 35, targetLufs: -23, highPassFilter: true, compressionLimiter: true },
  },
];

export function EditorAudioEnhancer({
  isOpen,
  onClose,
  onApplySettings,
  initialSettings,
}: EditorAudioEnhancerProps) {
  const dialogId = useId();
  const titleId = `${dialogId}-title`;
  const dialogRef = useRef<HTMLDivElement>(null);
  useDialogFocus(dialogRef, isOpen);

  const [settings, setSettings] = useState<AudioEnhancerSettings>({
    vocalBoostDb: initialSettings?.vocalBoostDb ?? 3.5,
    noiseGateThresholdDb: initialSettings?.noiseGateThresholdDb ?? -42,
    deEsserPercent: initialSettings?.deEsserPercent ?? 45,
    targetLufs: initialSettings?.targetLufs ?? -14,
    highPassFilter: initialSettings?.highPassFilter ?? true,
    compressionLimiter: initialSettings?.compressionLimiter ?? true,
    activePresetId: initialSettings?.activePresetId ?? "studio-voice",
  });

  const [isBypassed, setIsBypassed] = useState(false);

  if (!isOpen) return null;

  const handleSelectPreset = (preset: AudioPreset) => {
    setSettings({ ...preset.settings, activePresetId: preset.id });
  };

  const handleSave = () => {
    onApplySettings(settings);
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
              <Sliders size={18} />
            </div>
            <div>
              <h2 id={titleId} className="text-sm font-semibold text-cream">Audio Vocal Booster & Noise Gate</h2>
              <p className="text-xs text-dim">Enhance spoken voice intelligibility and eliminate background hiss</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-dim hover:text-cream hover:bg-surface transition-colors cursor-pointer"
            aria-label="Close audio settings dialog"
          ><X size={18} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          <section>
            <label className="text-xs font-semibold text-dim uppercase tracking-wider block mb-2.5">Enhancement Presets</label>
            <div className="grid grid-cols-2 gap-2.5">
              {AUDIO_PRESETS.map((preset) => {
                const isSelected = settings.activePresetId === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className={cn(
                      "text-left p-3 rounded-xl border text-xs transition-all cursor-pointer",
                      isSelected
                        ? "border-accent bg-accent-soft text-cream font-medium shadow-sm"
                        : "border-hairline bg-surface-raised/40 hover:bg-surface-raised text-body hover:text-cream",
                    )}
                  >
                    <div className="flex items-center justify-between font-semibold mb-1">
                      <span>{preset.name}</span>
                      {isSelected && <Check size={14} className="text-accent" />}
                    </div>
                    <p className="text-[11px] text-dim line-clamp-2 leading-relaxed">{preset.description}</p>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="space-y-3.5 pt-2 border-t border-hairline">
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-medium text-cream">Vocal Clarity Boost</span>
                <span className="text-dim font-mono">+{settings.vocalBoostDb.toFixed(1)} dB</span>
              </div>
              <input
                type="range"
                min="0"
                max="8"
                step="0.5"
                value={settings.vocalBoostDb}
                onChange={(e) => setSettings({ ...settings, vocalBoostDb: parseFloat(e.target.value), activePresetId: "custom" })}
                className="w-full accent-accent h-1.5 bg-surface-raised rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-medium text-cream">Noise Gate Threshold</span>
                <span className="text-dim font-mono">{settings.noiseGateThresholdDb} dB</span>
              </div>
              <input
                type="range"
                min="-60"
                max="-20"
                step="2"
                value={settings.noiseGateThresholdDb}
                onChange={(e) => setSettings({ ...settings, noiseGateThresholdDb: parseInt(e.target.value, 10), activePresetId: "custom" })}
                className="w-full accent-accent h-1.5 bg-surface-raised rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-medium text-cream">De-Esser Sibilance Reducer</span>
                <span className="text-dim font-mono">{settings.deEsserPercent}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={settings.deEsserPercent}
                onChange={(e) => setSettings({ ...settings, deEsserPercent: parseInt(e.target.value, 10), activePresetId: "custom" })}
                className="w-full accent-accent h-1.5 bg-surface-raised rounded-lg cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <label className="flex items-center gap-2 p-2.5 rounded-lg border border-hairline bg-surface-raised/30 hover:bg-surface-raised cursor-pointer text-xs">
                <input
                  type="checkbox"
                  checked={settings.highPassFilter}
                  onChange={(e) => setSettings({ ...settings, highPassFilter: e.target.checked, activePresetId: "custom" })}
                  className="rounded text-accent accent-accent"
                />
                <span className="text-cream font-medium">80Hz Low-Cut Filter</span>
              </label>
              <label className="flex items-center gap-2 p-2.5 rounded-lg border border-hairline bg-surface-raised/30 hover:bg-surface-raised cursor-pointer text-xs">
                <input
                  type="checkbox"
                  checked={settings.compressionLimiter}
                  onChange={(e) => setSettings({ ...settings, compressionLimiter: e.target.checked, activePresetId: "custom" })}
                  className="rounded text-accent accent-accent"
                />
                <span className="text-cream font-medium">Peak Limiter</span>
              </label>
            </div>
          </section>
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t border-hairline bg-surface-raised">
          <button
            type="button"
            onClick={() => setIsBypassed(!isBypassed)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer",
              isBypassed ? "border-amber bg-amber-soft text-amber" : "border-hairline text-dim hover:text-cream",
            )}
          >
            {isBypassed ? "Enhancer Bypassed" : "Listen Enhanced"}
          </button>
            <div className="flex items-center gap-2.5">
              <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-semibold text-dim hover:text-cream transition-colors cursor-pointer">
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-accent text-white hover:bg-accent/90 shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Zap size={14} /> Apply Audio Filter
              </button>
            </div>
        </div>
      </div>
    </div>
  );
}
