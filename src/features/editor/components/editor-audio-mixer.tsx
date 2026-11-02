"use client";

import { useId, useRef, useState } from "react";
import { Check, Mic, Music, RotateCcw, Sliders, Volume2, VolumeX, Waves, X } from "lucide-react";
import { cn } from "@/shared/lib/cn";
import { useDialogFocus } from "@/shared/hooks/use-dialog-focus";

export interface AudioChannelConfig {
  volumePercent: number;
  panPercent: number;
  muted: boolean;
  solo: boolean;
}

export interface AudioMixerState {
  dialogue: AudioChannelConfig;
  music: AudioChannelConfig;
  sfx: AudioChannelConfig;
  ambience: AudioChannelConfig;
  masterVolumePercent: number;
  peakLimiter: boolean;
  lufsNormalize: boolean;
}

export interface EditorAudioMixerProps {
  isOpen: boolean;
  onClose: () => void;
  mixerState?: AudioMixerState;
  onApplyMixer: (state: AudioMixerState) => void;
}

const DEFAULT_MIXER: AudioMixerState = {
  dialogue: { volumePercent: 100, panPercent: 0, muted: false, solo: false },
  music: { volumePercent: 35, panPercent: 0, muted: false, solo: false },
  sfx: { volumePercent: 80, panPercent: 0, muted: false, solo: false },
  ambience: { volumePercent: 20, panPercent: 0, muted: false, solo: false },
  masterVolumePercent: 100,
  peakLimiter: true,
  lufsNormalize: true,
};

type ChannelKey = "dialogue" | "music" | "sfx" | "ambience";

const CHANNEL_DEFS: { key: ChannelKey; label: string; icon: typeof Mic; desc: string }[] = [
  { key: "dialogue", label: "Dialogue / Voice", icon: Mic, desc: "Primary speech and vocal tracks" },
  { key: "music", label: "Background Music", icon: Music, desc: "Ambient rhythm and soundtrack" },
  { key: "sfx", label: "Sound Effects", icon: Waves, desc: "Pops, whooshes, and stingers" },
  { key: "ambience", label: "Room Ambience", icon: Volume2, desc: "Atmosphere and spatial room tone" },
];

export function EditorAudioMixer({
  isOpen,
  onClose,
  mixerState: initialMixer,
  onApplyMixer,
}: EditorAudioMixerProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  useDialogFocus(dialogRef, isOpen);

  const [mixer, setMixer] = useState<AudioMixerState>(initialMixer || DEFAULT_MIXER);

  if (!isOpen) return null;

  const updateChannel = (channel: ChannelKey, updates: Partial<AudioChannelConfig>) => {
    setMixer((prev) => ({
      ...prev,
      [channel]: { ...prev[channel], ...updates },
    }));
  };

  const handleReset = () => {
    setMixer(DEFAULT_MIXER);
  };

  const handleSave = () => {
    onApplyMixer(mixer);
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
            <div className="p-2 rounded-xl bg-accent/10 text-accent">
              <Sliders size={18} />
            </div>
            <div>
              <h2 id={titleId} className="text-sm font-semibold text-cream">Multi-Track Audio Mixer</h2>
              <p className="text-xs text-dim">Balance voice, music, and sound effects for broadcast clarity</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg text-dim hover:text-cream hover:bg-surface transition-colors cursor-pointer" aria-label="Close audio mixer">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="space-y-3">
            {CHANNEL_DEFS.map(({ key, label, icon: Icon, desc }) => {
              const ch = mixer[key];
              return (
                <div key={key} className="p-3.5 rounded-xl border border-hairline bg-surface/30 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-surface border border-hairline text-accent">
                        <Icon size={14} />
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-cream">{label}</span>
                        <p className="text-[10px] text-dim">{desc}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => updateChannel(key, { muted: !ch.muted })}
                        className={cn("px-2 py-0.5 rounded text-[10px] font-bold border transition-colors cursor-pointer",
                          ch.muted ? "bg-rose-500/20 text-rose-300 border-rose-500/40" : "bg-surface border-hairline text-dim hover:text-cream")}
                      >
                        {ch.muted ? <VolumeX size={11} className="inline mr-1" /> : null}MUTE
                      </button>
                      <button
                        type="button"
                        onClick={() => updateChannel(key, { solo: !ch.solo })}
                        className={cn("px-2 py-0.5 rounded text-[10px] font-bold border transition-colors cursor-pointer",
                          ch.solo ? "bg-amber-400/20 text-amber-300 border-amber-400/40" : "bg-surface border-hairline text-dim hover:text-cream")}
                      >
                        SOLO
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] text-dim">Channel Level</span>
                        <span className="text-[11px] text-accent font-mono">{ch.muted ? "0%" : `${ch.volumePercent}%`}</span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={140}
                        disabled={ch.muted}
                        value={ch.volumePercent}
                        onChange={(e) => updateChannel(key, { volumePercent: Number(e.target.value) })}
                        className="w-full accent-accent cursor-pointer disabled:opacity-30"
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] text-dim">Stereo Pan</span>
                        <span className="text-[11px] text-dim font-mono">
                          {ch.panPercent === 0 ? "C" : ch.panPercent < 0 ? `L${Math.abs(ch.panPercent)}` : `R${ch.panPercent}`}
                        </span>
                      </div>
                      <input
                        type="range"
                        min={-100}
                        max={100}
                        value={ch.panPercent}
                        onChange={(e) => updateChannel(key, { panPercent: Number(e.target.value) })}
                        className="w-full accent-accent cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3.5 rounded-xl border border-hairline bg-surface/50 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-cream">Master Output Level</span>
                <p className="text-[10px] text-dim">Overall mix gain sent to export encoder</p>
              </div>
              <span className="text-xs font-mono text-accent">{mixer.masterVolumePercent}%</span>
            </div>
            <input
              type="range"
              min={20}
              max={120}
              value={mixer.masterVolumePercent}
              onChange={(e) => setMixer({ ...mixer, masterVolumePercent: Number(e.target.value) })}
              className="w-full accent-accent cursor-pointer"
            />
            <div className="flex items-center justify-between pt-1 border-t border-hairline/60">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-dim hover:text-cream">
                <input
                  type="checkbox"
                  checked={mixer.peakLimiter}
                  onChange={(e) => setMixer({ ...mixer, peakLimiter: e.target.checked })}
                  className="accent-accent w-3.5 h-3.5 cursor-pointer"
                />
                Master Peak Limiter (-0.1 dB ceiling)
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-xs text-dim hover:text-cream">
                <input
                  type="checkbox"
                  checked={mixer.lufsNormalize}
                  onChange={(e) => setMixer({ ...mixer, lufsNormalize: e.target.checked })}
                  className="accent-accent w-3.5 h-3.5 cursor-pointer"
                />
                Broadcast -14 LUFS Target
              </label>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t border-hairline bg-surface/50">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs text-dim hover:text-cream transition-colors cursor-pointer"
          >
            <RotateCcw size={13} /> Reset Mix
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
              <Check size={14} /> Apply Mix
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
