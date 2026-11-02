"use client";

import { useId, useRef, useState } from "react";
import { Check, Music, Volume2, X } from "lucide-react";
import { cn } from "@/shared/lib/cn";
import { useDialogFocus } from "@/shared/hooks/use-dialog-focus";

export interface BackgroundMusicConfig {
  trackId: string;
  trackName: string;
  musicVolumePercent: number;
  autoDuckingEnabled: boolean;
  duckingReductionDb: number;
  duckingFadeSpeedMs: number;
  muteDuringSilence: boolean;
}

export interface EditorMusicDuckingProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyConfig: (config: BackgroundMusicConfig) => void;
  initialConfig?: Partial<BackgroundMusicConfig>;
}

interface RoyaltyFreeTrack {
  id: string;
  title: string;
  genre: string;
  bpm: number;
  duration: string;
}

const STOCK_MUSIC_TRACKS: RoyaltyFreeTrack[] = [
  { id: "lofi-beats", title: "Midnight Lo-Fi Coffee", genre: "Chillhop", bpm: 82, duration: "2:45" },
  { id: "tech-upbeat", title: "Silicon Pulse Groove", genre: "Electronic", bpm: 118, duration: "3:10" },
  { id: "ambient-focus", title: "Serene Morning Flow", genre: "Ambient", bpm: 72, duration: "4:02" },
  { id: "cinematic-lift", title: "Inspiring Dawn Rise", genre: "Orchestral", bpm: 95, duration: "2:55" },
];

export function EditorMusicDucking({
  isOpen,
  onClose,
  onApplyConfig,
  initialConfig,
}: EditorMusicDuckingProps) {
  const dialogId = useId();
  const titleId = `${dialogId}-title`;
  const dialogRef = useRef<HTMLDivElement>(null);
  useDialogFocus(dialogRef, isOpen);

  const [selectedTrackId, setSelectedTrackId] = useState<string>(
    initialConfig?.trackId ?? "lofi-beats",
  );
  const [musicVolume, setMusicVolume] = useState<number>(
    initialConfig?.musicVolumePercent ?? 35,
  );
  const [duckingEnabled, setDuckingEnabled] = useState<boolean>(
    initialConfig?.autoDuckingEnabled ?? true,
  );
  const [reductionDb, setReductionDb] = useState<number>(
    initialConfig?.duckingReductionDb ?? -16,
  );
  const [fadeSpeed, setFadeSpeed] = useState<number>(
    initialConfig?.duckingFadeSpeedMs ?? 200,
  );
  const [muteSilence, setMuteSilence] = useState<boolean>(
    initialConfig?.muteDuringSilence ?? false,
  );

  if (!isOpen) return null;

  const currentTrack =
    STOCK_MUSIC_TRACKS.find((t) => t.id === selectedTrackId) ?? STOCK_MUSIC_TRACKS[0];

  const handleSave = () => {
    onApplyConfig({
      trackId: currentTrack.id,
      trackName: currentTrack.title,
      musicVolumePercent: musicVolume,
      autoDuckingEnabled: duckingEnabled,
      duckingReductionDb: reductionDb,
      duckingFadeSpeedMs: fadeSpeed,
      muteDuringSilence: muteSilence,
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
              <Music size={18} />
            </div>
            <div>
              <h2 id={titleId} className="text-sm font-semibold text-cream">Background Music & Auto-Ducking</h2>
              <p className="text-xs text-dim">Automatically lowers music volume while creator is speaking</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg text-dim hover:text-cream hover:bg-surface transition-colors cursor-pointer" aria-label="Close music settings">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          <section>
            <label className="text-xs font-semibold text-dim uppercase tracking-wider block mb-2">Royalty-Free Audio Track</label>
            <div className="grid grid-cols-2 gap-2">
              {STOCK_MUSIC_TRACKS.map((t) => {
                const isSelected = selectedTrackId === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setSelectedTrackId(t.id)}
                    className={cn(
                      "p-3 rounded-xl border text-left text-xs transition-all cursor-pointer",
                      isSelected
                        ? "border-accent bg-accent-soft text-cream font-medium shadow-sm"
                        : "border-hairline bg-surface-raised/40 hover:bg-surface-raised text-body hover:text-cream",
                    )}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold truncate">{t.title}</span>
                      {isSelected && <Check size={14} className="text-accent shrink-0" />}
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-dim">
                      <span>{t.genre} • {t.bpm} BPM</span>
                      <span>{t.duration}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="space-y-3.5 pt-2 border-t border-hairline text-xs">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-cream flex items-center gap-1.5">
                  <Volume2 size={14} className="text-dim" /> Music Base Volume
                </span>
                <span className="text-dim font-mono">{musicVolume}%</span>
              </div>
              <input type="range" min="5" max="80" step="5" value={musicVolume} onChange={(e) => setMusicVolume(parseInt(e.target.value, 10))} className="w-full accent-accent h-1.5 bg-surface-raised rounded-lg cursor-pointer" />
            </div>

            <div className="p-3.5 rounded-xl border border-hairline bg-surface-raised/40 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-semibold text-cream block">Smart Speech Ducking</span>
                  <span className="text-[11px] text-dim">Dips music automatically whenever speech is active</span>
                </div>
                <input type="checkbox" checked={duckingEnabled} onChange={(e) => setDuckingEnabled(e.target.checked)} className="rounded text-accent accent-accent w-4 h-4" />
              </div>

              {duckingEnabled && (
                <div className="space-y-2.5 pt-2 border-t border-hairline/60">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-dim">Speech Dip Reduction</span>
                    <span className="text-accent font-mono">{reductionDb} dB</span>
                  </div>
                  <input type="range" min="-28" max="-8" step="2" value={reductionDb} onChange={(e) => setReductionDb(parseInt(e.target.value, 10))} className="w-full accent-accent h-1.5 bg-surface-raised rounded cursor-pointer" />

                  <div className="flex items-center justify-between text-[11px] pt-1">
                    <span className="text-dim">Fade Recovery Speed</span>
                    <span className="text-dim font-mono">{fadeSpeed} ms</span>
                  </div>
                  <input type="range" min="100" max="500" step="50" value={fadeSpeed} onChange={(e) => setFadeSpeed(parseInt(e.target.value, 10))} className="w-full accent-accent h-1.5 bg-surface-raised rounded cursor-pointer" />
                </div>
              )}
            </div>

            <label className="flex items-center gap-2 p-2 rounded-lg hover:bg-surface-raised cursor-pointer text-body hover:text-cream">
              <input type="checkbox" checked={muteSilence} onChange={(e) => setMuteSilence(e.target.checked)} className="rounded text-accent accent-accent" />
              <span>Mute background track during extended silent pauses</span>
            </label>
          </section>
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t border-hairline bg-surface-raised">
          <p className="text-xs text-dim">Dynamic gain automation applied during export</p>
          <div className="flex items-center gap-2.5">
            <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-semibold text-dim hover:text-cream transition-colors cursor-pointer">
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-accent text-white hover:bg-accent/90 shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Check size={14} /> Apply Music Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
