"use client";

import { useId, useMemo, useRef, useState } from "react";
import { Check, Cpu, HardDrive, RotateCcw, Settings, Video, X } from "lucide-react";
import { cn } from "@/shared/lib/cn";
import { useDialogFocus } from "@/shared/hooks/use-dialog-focus";

export type VideoContainer = "mp4" | "webm" | "mov";
export type VideoCodec = "h264" | "hevc" | "vp9" | "av1";
export type AudioCodec = "aac" | "opus" | "pcm";

export interface ExportProfileConfig {
  container: VideoContainer;
  videoCodec: VideoCodec;
  bitrateMbps: number;
  frameRate: 24 | 30 | 60;
  audioCodec: AudioCodec;
  audioBitrateKbps: number;
  colorSpace: "rec709" | "srgb"; twoPassEncoding: boolean;
}

export interface EditorExportPresetCustomizerProps {
  isOpen: boolean;
  onClose: () => void;
  videoDurationSeconds: number;
  initialConfig?: ExportProfileConfig;
  onApplyConfig: (config: ExportProfileConfig) => void;
}

const DEFAULT_PROFILE: ExportProfileConfig = {
  container: "mp4", videoCodec: "h264", bitrateMbps: 12, frameRate: 30,
  audioCodec: "aac", audioBitrateKbps: 192, colorSpace: "rec709", twoPassEncoding: false,
};

const BITRATE_PRESETS = [
  { label: "Mobile (6 Mbps)", value: 6, desc: "Fast upload & lightweight files" },
  { label: "Full HD (12 Mbps)", value: 12, desc: "Standard for Instagram & TikTok" },
  { label: "High Bitrate (20 Mbps)", value: 20, desc: "Crisp detail & sharp text" }, { label: "Archive Master (32 Mbps)", value: 32, desc: "Near-lossless pristine quality" },
];

export function EditorExportPresetCustomizer({
  isOpen,
  onClose,
  videoDurationSeconds,
  initialConfig,
  onApplyConfig,
}: EditorExportPresetCustomizerProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  useDialogFocus(dialogRef, isOpen);

  const [config, setConfig] = useState<ExportProfileConfig>(initialConfig || DEFAULT_PROFILE);

  const estimatedSizeMb = useMemo(() => {
    const duration = Math.max(videoDurationSeconds || 30, 5);
    const videoBits = config.bitrateMbps * 1_000_000 * duration;
    const audioBits = config.audioBitrateKbps * 1_000 * duration;
    const totalBytes = (videoBits + audioBits) / 8;
    return (totalBytes / (1024 * 1024)).toFixed(1);
  }, [config.bitrateMbps, config.audioBitrateKbps, videoDurationSeconds]);

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
            <div className="p-2 rounded-xl bg-accent/10 text-accent"><Settings size={18} /></div>
            <div>
              <h2 id={titleId} className="text-sm font-semibold text-cream">Export Codec & Profile Settings</h2>
              <p className="text-xs text-dim">Customize compression bitrate, container, and encoder flags</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg text-dim hover:text-cream hover:bg-surface transition-colors cursor-pointer" aria-label="Close export customizer">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="p-4 rounded-xl border border-hairline bg-surface/40 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-mono text-dim tracking-wider">Estimated File Output</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-2xl font-bold text-cream font-mono">~{estimatedSizeMb}</span>
                <span className="text-xs text-dim">MB</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold text-accent font-mono">{config.container.toUpperCase()} &bull; {config.videoCodec.toUpperCase()}</span>
              <p className="text-[10px] text-dim">{videoDurationSeconds.toFixed(1)}s duration at {config.frameRate} fps</p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-dim uppercase tracking-wider mb-2">Video Bitrate Target</label>
            <div className="grid grid-cols-2 gap-2">
              {BITRATE_PRESETS.map((preset) => (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => setConfig({ ...config, bitrateMbps: preset.value })}
                  className={cn("p-2.5 rounded-xl border text-left transition-all cursor-pointer",
                    config.bitrateMbps === preset.value ? "border-accent bg-accent/15" : "border-hairline bg-surface/30 hover:bg-surface")}
                >
                  <div className="text-xs font-bold text-cream mb-0.5">{preset.label}</div>
                  <p className="text-[10px] text-dim leading-tight">{preset.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-dim uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Video size={13} /> Container Format
              </label>
              <div className="flex gap-1.5">
                {(["mp4", "webm", "mov"] as const).map((fmt) => (
                  <button
                    key={fmt}
                    type="button"
                    onClick={() => setConfig({ ...config, container: fmt })}
                    className={cn("flex-1 py-1.5 rounded-lg border text-xs font-semibold uppercase cursor-pointer transition-colors",
                      config.container === fmt ? "border-accent bg-accent text-white" : "border-hairline bg-surface text-dim hover:text-cream")}
                  >
                    .{fmt}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-dim uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Cpu size={13} /> Video Codec
              </label>
              <div className="flex gap-1.5">
                {(["h264", "hevc", "av1"] as const).map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setConfig({ ...config, videoCodec: c })}
                    className={cn("flex-1 py-1.5 rounded-lg border text-xs font-semibold uppercase cursor-pointer transition-colors",
                      config.videoCodec === c ? "border-accent bg-accent text-white" : "border-hairline bg-surface text-dim hover:text-cream")}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-dim uppercase tracking-wider mb-1.5">Export Framerate</label>
              <div className="flex gap-1.5">
                {([24, 30, 60] as const).map((fps) => (
                  <button
                    key={fps}
                    type="button"
                    onClick={() => setConfig({ ...config, frameRate: fps })}
                    className={cn("flex-1 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer transition-colors",
                      config.frameRate === fps ? "border-accent bg-accent text-white" : "border-hairline bg-surface text-dim hover:text-cream")}
                  >
                    {fps} fps
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-dim uppercase tracking-wider mb-1.5">Color Space Flag</label>
              <div className="flex gap-1.5">
                {(["rec709", "srgb"] as const).map((cs) => (
                  <button
                    key={cs}
                    type="button"
                    onClick={() => setConfig({ ...config, colorSpace: cs })}
                    className={cn("flex-1 py-1.5 rounded-lg border text-xs font-semibold uppercase cursor-pointer transition-colors",
                      config.colorSpace === cs ? "border-accent bg-accent text-white" : "border-hairline bg-surface text-dim hover:text-cream")}
                  >
                    {cs}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl border border-hairline bg-surface/30">
            <div className="flex items-center gap-2">
              <HardDrive size={14} className="text-accent" />
              <div>
                <span className="text-xs font-semibold text-cream">Two-Pass Variable Bitrate (VBR)</span>
                <p className="text-[10px] text-dim">Optimizes complex motion scenes for smaller size and fewer artifacts</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={config.twoPassEncoding}
              onChange={(e) => setConfig({ ...config, twoPassEncoding: e.target.checked })}
              className="accent-accent w-4 h-4 cursor-pointer"
            />
          </div>
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t border-hairline bg-surface/50">
          <button
            type="button"
            onClick={() => setConfig(DEFAULT_PROFILE)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs text-dim hover:text-cream transition-colors cursor-pointer"
          >
            <RotateCcw size={13} /> Reset Defaults
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
              <Check size={14} /> Apply Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
