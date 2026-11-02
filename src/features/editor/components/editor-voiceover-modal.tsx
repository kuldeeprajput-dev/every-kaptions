"use client";

import { useId, useRef, useState } from "react";
import { Mic, Sparkles, X } from "lucide-react";
import { cn } from "@/shared/lib/cn";
import { useDialogFocus } from "@/shared/hooks/use-dialog-focus";
import type { CaptionSegment } from "../types/captions";

export interface VoiceoverConfig {
  voiceId: string;
  voiceName: string;
  speedMultiplier: number;
  pitchShiftPercent: number;
  clarityBoostPercent: number;
  sentencePauseSeconds: number;
  replaceOriginalAudio: boolean;
}

export interface EditorVoiceoverModalProps {
  isOpen: boolean;
  onClose: () => void;
  segments: CaptionSegment[];
  onGenerateVoiceover: (config: VoiceoverConfig) => void;
  initialConfig?: Partial<VoiceoverConfig>;
}

interface VoiceModel {
  id: string;
  name: string;
  gender: "Female" | "Male" | "Neutral";
  tone: string;
  accent: string;
}

const AVAILABLE_VOICES: VoiceModel[] = [
  { id: "nova-studio", name: "Nova Studio", gender: "Female", tone: "Crisp, Clear, Professional", accent: "US Standard" },
  { id: "echo-warm", name: "Echo Warm", gender: "Male", tone: "Deep, Friendly, Storyteller", accent: "US Casual" },
  { id: "shimmer-bright", name: "Shimmer Bright", gender: "Female", tone: "Energetic, Enthusiastic, Creator", accent: "UK Natural" },
  { id: "onyx-authoritative", name: "Onyx Broadcaster", gender: "Male", tone: "Authoritative, Documentary, Bold", accent: "US Broadcast" },
];

export function EditorVoiceoverModal({
  isOpen,
  onClose,
  segments,
  onGenerateVoiceover,
  initialConfig,
}: EditorVoiceoverModalProps) {
  const dialogId = useId();
  const titleId = `${dialogId}-title`;
  const dialogRef = useRef<HTMLDivElement>(null);
  useDialogFocus(dialogRef, isOpen);

  const [selectedVoiceId, setSelectedVoiceId] = useState<string>(
    initialConfig?.voiceId ?? "nova-studio",
  );
  const [speed, setSpeed] = useState<number>(initialConfig?.speedMultiplier ?? 1.0);
  const [pitch, setPitch] = useState<number>(initialConfig?.pitchShiftPercent ?? 0);
  const [clarity, setClarity] = useState<number>(initialConfig?.clarityBoostPercent ?? 50);
  const [sentencePause, setSentencePause] = useState<number>(
    initialConfig?.sentencePauseSeconds ?? 0.25,
  );
  const [replaceAudio, setReplaceAudio] = useState<boolean>(
    initialConfig?.replaceOriginalAudio ?? false,
  );

  if (!isOpen) return null;

  const currentVoice =
    AVAILABLE_VOICES.find((v) => v.id === selectedVoiceId) ?? AVAILABLE_VOICES[0];

  const totalWords = segments.reduce(
    (count, s) => count + s.text.trim().split(/\s+/).filter(Boolean).length,
    0,
  );
  const estimatedSeconds = Math.round((totalWords / (145 * speed)) * 60);

  const handleSave = () => {
    onGenerateVoiceover({
      voiceId: currentVoice.id,
      voiceName: currentVoice.name,
      speedMultiplier: speed,
      pitchShiftPercent: pitch,
      clarityBoostPercent: clarity,
      sentencePauseSeconds: sentencePause,
      replaceOriginalAudio: replaceAudio,
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
              <Mic size={18} />
            </div>
            <div>
              <h2 id={titleId} className="text-sm font-semibold text-cream">AI Voiceover & Speech Synthesizer</h2>
              <p className="text-xs text-dim">Generate ultra-natural voice narration from transcript text</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg text-dim hover:text-cream hover:bg-surface transition-colors cursor-pointer" aria-label="Close voiceover modal">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          <section>
            <label className="text-xs font-semibold text-dim uppercase tracking-wider block mb-2">Voice Persona</label>
            <div className="grid grid-cols-2 gap-2">
              {AVAILABLE_VOICES.map((v) => {
                const isSelected = selectedVoiceId === v.id;
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setSelectedVoiceId(v.id)}
                    className={cn(
                      "p-3 rounded-xl border text-left text-xs transition-all cursor-pointer",
                      isSelected
                        ? "border-accent bg-accent-soft text-cream font-medium shadow-sm"
                        : "border-hairline bg-surface-raised/40 hover:bg-surface-raised text-body hover:text-cream",
                    )}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold">{v.name}</span>
                      <span className="text-[10px] text-accent font-mono">{v.gender}</span>
                    </div>
                    <p className="text-[11px] text-dim line-clamp-1">{v.tone}</p>
                    <span className="text-[10px] text-dim/70 block mt-1">{v.accent}</span>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="space-y-3.5 pt-2 border-t border-hairline text-xs">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-cream">Speaking Pacing & Speed</span>
                <span className="text-dim font-mono">{speed.toFixed(2)}x</span>
              </div>
              <input type="range" min="0.8" max="1.4" step="0.05" value={speed} onChange={(e) => setSpeed(parseFloat(e.target.value))} className="w-full accent-accent h-1.5 bg-surface-raised rounded-lg cursor-pointer" />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-cream">Vocal Pitch Adjustment</span>
                <span className="text-dim font-mono">{pitch > 0 ? `+${pitch}` : pitch}%</span>
              </div>
              <input type="range" min="-12" max="12" step="1" value={pitch} onChange={(e) => setPitch(parseInt(e.target.value, 10))} className="w-full accent-accent h-1.5 bg-surface-raised rounded-lg cursor-pointer" />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-cream">Vocal Clarity & Presence</span>
                <span className="text-dim font-mono">{clarity}%</span>
              </div>
              <input type="range" min="0" max="100" step="5" value={clarity} onChange={(e) => setClarity(parseInt(e.target.value, 10))} className="w-full accent-accent h-1.5 bg-surface-raised rounded-lg cursor-pointer" />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-cream">Sentence Pause Gap</span>
                <span className="text-dim font-mono">{sentencePause.toFixed(2)}s</span>
              </div>
              <input type="range" min="0.1" max="0.8" step="0.05" value={sentencePause} onChange={(e) => setSentencePause(parseFloat(e.target.value))} className="w-full accent-accent h-1.5 bg-surface-raised rounded-lg cursor-pointer" />
            </div>

            <div className="p-3 rounded-xl border border-hairline bg-surface-raised/40 space-y-2">
              <label className="flex items-center gap-2 cursor-pointer text-body hover:text-cream">
                <input type="checkbox" checked={replaceAudio} onChange={(e) => setReplaceAudio(e.target.checked)} className="rounded text-accent accent-accent" />
                <span className="font-medium text-cream">Mute camera audio and replace with synthesized voice</span>
              </label>
              <p className="text-[11px] text-dim pl-6">
                Uncheck to keep original background audio and layer voiceover on top.
              </p>
            </div>
          </section>
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t border-hairline bg-surface-raised">
          <p className="text-xs text-dim">~{estimatedSeconds}s audio estimated ({totalWords} words across {segments.length} segments)</p>
          <div className="flex items-center gap-2.5">
            <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-semibold text-dim hover:text-cream transition-colors cursor-pointer">
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-accent text-white hover:bg-accent/90 shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles size={14} /> Synthesize Voiceover
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
