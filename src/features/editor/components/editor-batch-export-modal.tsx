"use client";

import { useId, useMemo, useRef, useState } from "react";
import { Download, Video, X } from "lucide-react";
import { cn } from "@/shared/lib/cn";
import { useDialogFocus } from "@/shared/hooks/use-dialog-focus";

export interface BatchExportSettings {
  resolutionId: "1080p" | "4k" | "720p" | "square";
  framerate: 30 | 60;
  bitrateMbps: number;
  burnInSubtitles: boolean;
  exportSeparateSrt: boolean;
  hardwareAcceleration: boolean;
}

export interface EditorBatchExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoDurationSeconds?: number;
  onStartExport: (settings: BatchExportSettings) => void;
}

interface ResolutionOption {
  id: "1080p" | "4k" | "720p" | "square";
  label: string;
  width: number;
  height: number;
  recommendedBitrate: number;
  badge: string;
}

const RESOLUTION_OPTIONS: ResolutionOption[] = [
  { id: "1080p", label: "1080p Full HD", width: 1080, height: 1920, recommendedBitrate: 14, badge: "Recommended" },
  { id: "4k", label: "4K Ultra HD", width: 2160, height: 3840, recommendedBitrate: 32, badge: "Highest Quality" },
  { id: "720p", label: "720p Mobile Fast", width: 720, height: 1280, recommendedBitrate: 8, badge: "Fast Export" },
  { id: "square", label: "1080x1080 Square", width: 1080, height: 1080, recommendedBitrate: 12, badge: "Feed Post" },
];

export function EditorBatchExportModal({
  isOpen,
  onClose,
  videoDurationSeconds = 60,
  onStartExport,
}: EditorBatchExportModalProps) {
  const dialogId = useId();
  const titleId = `${dialogId}-title`;
  const dialogRef = useRef<HTMLDivElement>(null);
  useDialogFocus(dialogRef, isOpen);

  const [resId, setResId] = useState<BatchExportSettings["resolutionId"]>("1080p");
  const [fps, setFps] = useState<30 | 60>(30);
  const [bitrate, setBitrate] = useState<number>(14);
  const [burnIn, setBurnIn] = useState<boolean>(true);
  const [exportSrt, setExportSrt] = useState<boolean>(true);
  const [hardwareAccel, setHardwareAccel] = useState<boolean>(true);

  if (!isOpen) return null;

  const currentRes = RESOLUTION_OPTIONS.find((r) => r.id === resId) ?? RESOLUTION_OPTIONS[0];

  const estimatedFileSizeMb = useMemo(() => {
    const megabytes = ((bitrate * 1000 * 1000) / 8 / (1024 * 1024)) * videoDurationSeconds;
    return Math.round(megabytes * 10) / 10;
  }, [bitrate, videoDurationSeconds]);

  const handleSelectRes = (res: ResolutionOption) => {
    setResId(res.id);
    setBitrate(res.recommendedBitrate);
  };

  const handleExport = () => {
    onStartExport({
      resolutionId: resId,
      framerate: fps,
      bitrateMbps: bitrate,
      burnInSubtitles: burnIn,
      exportSeparateSrt: exportSrt,
      hardwareAcceleration: hardwareAccel,
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
              <Video size={18} />
            </div>
            <div>
              <h2 id={titleId} className="text-sm font-semibold text-cream">Export Queue & Render Settings</h2>
              <p className="text-xs text-dim">Configure resolution, video bitrate, and burning parameters</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg text-dim hover:text-cream hover:bg-surface transition-colors cursor-pointer" aria-label="Close export modal">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          <div className="grid grid-cols-3 gap-2.5 p-3 rounded-xl bg-surface-raised/50 border border-hairline text-center text-xs">
            <div>
              <span className="text-[10px] text-dim uppercase tracking-wider block">Dimensions</span>
              <span className="text-sm font-bold text-cream">{currentRes.width}x{currentRes.height}</span>
            </div>
            <div>
              <span className="text-[10px] text-dim uppercase tracking-wider block">Est. File Size</span>
              <span className="text-sm font-bold text-accent">~{estimatedFileSizeMb} MB</span>
            </div>
            <div>
              <span className="text-[10px] text-dim uppercase tracking-wider block">Duration</span>
              <span className="text-sm font-bold text-emerald-400">{videoDurationSeconds.toFixed(1)}s</span>
            </div>
          </div>

          <section>
            <label className="text-xs font-semibold text-dim uppercase tracking-wider block mb-2">Render Resolution</label>
            <div className="grid grid-cols-2 gap-2">
              {RESOLUTION_OPTIONS.map((r) => {
                const isSelected = resId === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => handleSelectRes(r)}
                    className={cn(
                      "p-3 rounded-xl border text-left text-xs transition-all cursor-pointer",
                      isSelected
                        ? "border-accent bg-accent-soft text-cream font-medium shadow-sm"
                        : "border-hairline bg-surface-raised/40 hover:bg-surface-raised text-body hover:text-cream",
                    )}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold">{r.label}</span>
                      <span className="text-[10px] text-accent font-mono">{r.badge}</span>
                    </div>
                    <span className="text-[10px] text-dim">{r.width} × {r.height} px</span>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="space-y-3.5 pt-2 border-t border-hairline text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-dim font-medium block mb-1">Target Framerate</label>
                <div className="flex items-center gap-2">
                  {([30, 60] as const).map((rate) => (
                    <button
                      key={rate}
                      type="button"
                      onClick={() => setFps(rate)}
                      className={cn(
                        "flex-1 py-1.5 rounded-lg border text-xs font-mono transition-colors cursor-pointer",
                        fps === rate ? "border-accent bg-accent-soft text-accent font-bold" : "border-hairline text-dim hover:text-cream",
                      )}
                    >
                      {rate} FPS
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-dim font-medium">Encoding Bitrate</span>
                  <span className="text-dim font-mono">{bitrate} Mbps</span>
                </div>
                <input
                  type="range"
                  min="6"
                  max="40"
                  step="2"
                  value={bitrate}
                  onChange={(e) => setBitrate(parseInt(e.target.value, 10))}
                  className="w-full accent-accent h-1.5 bg-surface-raised rounded-lg cursor-pointer"
                />
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <label className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-surface-raised cursor-pointer text-body hover:text-cream">
                <input type="checkbox" checked={burnIn} onChange={(e) => setBurnIn(e.target.checked)} className="rounded text-accent accent-accent" />
                <span>Burn kinetic captions permanently into exported MP4 frames</span>
              </label>

              <label className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-surface-raised cursor-pointer text-body hover:text-cream">
                <input type="checkbox" checked={exportSrt} onChange={(e) => setExportSrt(e.target.checked)} className="rounded text-accent accent-accent" />
                <span>Also generate and bundle companion .SRT subtitle file</span>
              </label>

              <label className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-surface-raised cursor-pointer text-body hover:text-cream">
                <input type="checkbox" checked={hardwareAccel} onChange={(e) => setHardwareAccel(e.target.checked)} className="rounded text-accent accent-accent" />
                <span>Enable WebCodecs GPU hardware-accelerated video pipeline</span>
              </label>
            </div>
          </section>
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t border-hairline bg-surface-raised">
          <p className="text-xs text-dim">H.264 / AAC compliant output for all major platforms</p>
          <div className="flex items-center gap-2.5">
            <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-semibold text-dim hover:text-cream transition-colors cursor-pointer">
              Cancel
            </button>
            <button
              type="button"
              onClick={handleExport}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-accent text-white hover:bg-accent/90 shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Download size={14} /> Start Render (~{estimatedFileSizeMb} MB)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
