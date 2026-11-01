"use client";

import { useId, useMemo, useRef, useState } from "react";
import { Check, Copy, Download, FileCode, FileText, X } from "lucide-react";
import { cn } from "@/shared/lib/cn";
import { useDialogFocus } from "@/shared/hooks/use-dialog-focus";
import type { CaptionSegment } from "../types/captions";

export type SubtitleExportFormat = "srt" | "vtt" | "ass" | "txt";

export interface EditorSubtitleExporterProps {
  isOpen: boolean;
  onClose: () => void;
  segments: CaptionSegment[];
  videoTitle?: string;
}

function formatSrtTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 1000);
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")},${ms.toString().padStart(3, "0")}`;
}

function formatVttTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 1000);
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}.${ms.toString().padStart(3, "0")}`;
}

function generateSubtitleContent(
  segments: CaptionSegment[],
  format: SubtitleExportFormat,
  includeTimestamps: boolean,
): string {
  if (format === "srt") {
    return segments
      .map(
        (seg, i) =>
          `${i + 1}\n${formatSrtTime(seg.start)} --> ${formatSrtTime(seg.end)}\n${seg.text}\n`,
      )
      .join("\n");
  }
  if (format === "vtt") {
    const cues = segments
      .map(
        (seg) =>
          `${formatVttTime(seg.start)} --> ${formatVttTime(seg.end)} line:85%\n${seg.text}\n`,
      )
      .join("\n");
    return `WEBVTT - Exported with EveryKaptions\n\n${cues}`;
  }
  if (format === "ass") {
    const header = `[Script Info]\nTitle: EveryKaptions Export\nScriptType: v4.00+\n\n[V4+ Styles]\nFormat: Name, Fontname, Fontsize, PrimaryColour\nStyle: Default,Inter,24,&H00FFFFFF\n\n[Events]\nFormat: Layer, Start, End, Style, Text\n`;
    const events = segments
      .map(
        (seg) =>
          `Dialogue: 0,${formatVttTime(seg.start)},${formatVttTime(seg.end)},Default,${seg.text}`,
      )
      .join("\n");
    return header + events;
  }
  return segments
    .map((seg) => (includeTimestamps ? `[${formatVttTime(seg.start)}] ${seg.text}` : seg.text))
    .join("\n");
}

export function EditorSubtitleExporter({
  isOpen,
  onClose,
  segments,
  videoTitle = "video-captions",
}: EditorSubtitleExporterProps) {
  const dialogId = useId();
  const titleId = `${dialogId}-title`;
  const dialogRef = useRef<HTMLDivElement>(null);
  useDialogFocus(dialogRef, isOpen);

  const [format, setFormat] = useState<SubtitleExportFormat>("srt");
  const [includeTimestamps, setIncludeTimestamps] = useState(true);
  const [isCopied, setIsCopied] = useState(false);

  const fileContent = useMemo(
    () => generateSubtitleContent(segments, format, includeTimestamps),
    [segments, format, includeTimestamps],
  );

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(fileContent);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownload = () => {
    const ext = format === "txt" ? "txt" : format;
    const blob = new Blob([fileContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${videoTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatList: { id: SubtitleExportFormat; name: string; desc: string }[] = [
    { id: "srt", name: "SubRip (.srt)", desc: "Universal standard for Premiere, Final Cut, and YouTube" },
    { id: "vtt", name: "WebVTT (.vtt)", desc: "HTML5 web video subtitle track with placement coordinates" },
    { id: "ass", name: "Advanced SSA (.ass)", desc: "Styled subtitle script with typography and color styling" },
    { id: "txt", name: "Plain Text (.txt)", desc: "Clean transcript document for blog posts or show notes" },
  ];

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
              <FileCode size={18} />
            </div>
            <div>
              <h2 id={titleId} className="text-sm font-semibold text-cream">Subtitle & Transcript Exporter</h2>
              <p className="text-xs text-dim">Export timed caption files formatted for editing software and web players</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg text-dim hover:text-cream hover:bg-surface transition-colors cursor-pointer" aria-label="Close export dialog">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          <section>
            <label className="text-xs font-semibold text-dim uppercase tracking-wider block mb-2">Export File Format</label>
            <div className="grid grid-cols-2 gap-2">
              {formatList.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFormat(f.id)}
                  className={cn(
                    "p-3 rounded-xl border text-left transition-all cursor-pointer",
                    format === f.id
                      ? "border-accent bg-accent-soft text-cream font-medium shadow-sm"
                      : "border-hairline bg-surface-raised/40 hover:bg-surface-raised text-body hover:text-cream",
                  )}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold">{f.name}</span>
                    {format === f.id && <Check size={14} className="text-accent" />}
                  </div>
                  <p className="text-[11px] text-dim leading-relaxed">{f.desc}</p>
                </button>
              ))}
            </div>
          </section>

          {format === "txt" && (
            <label className="flex items-center gap-2 text-xs text-body hover:text-cream cursor-pointer">
              <input
                type="checkbox"
                checked={includeTimestamps}
                onChange={(e) => setIncludeTimestamps(e.target.checked)}
                className="rounded text-accent accent-accent"
              />
              <span>Include timestamps in text transcript</span>
            </label>
          )}

          <section className="space-y-2 pt-2 border-t border-hairline">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-dim uppercase tracking-wider">File Content Preview</span>
              <button
                type="button"
                onClick={handleCopy}
                className="text-xs font-semibold text-accent hover:text-accent-hover flex items-center gap-1.5 cursor-pointer"
              >
                {isCopied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                {isCopied ? "Copied to Clipboard" : "Copy Content"}
              </button>
            </div>
            <pre className="p-3 rounded-xl border border-hairline bg-black/40 text-[11px] font-mono text-body overflow-x-auto max-h-48 whitespace-pre leading-relaxed select-all">
              {fileContent}
            </pre>
          </section>
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t border-hairline bg-surface-raised">
          <p className="text-xs text-dim">{segments.length} caption cues formatted for {format.toUpperCase()}</p>
          <div className="flex items-center gap-2.5">
            <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-semibold text-dim hover:text-cream transition-colors cursor-pointer">
              Close
            </button>
            <button
              type="button"
              onClick={handleDownload}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-accent text-white hover:bg-accent/90 shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Download size={14} /> Download .{format} File
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
