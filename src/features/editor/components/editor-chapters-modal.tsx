"use client";

import { useId, useMemo, useRef, useState } from "react";
import { Bookmark, Check, Copy, FileSpreadsheet, FileText, Plus, Trash2, X } from "lucide-react";
import { useDialogFocus } from "@/shared/hooks/use-dialog-focus";
import type { CaptionSegment } from "../types/captions";

export interface VideoChapter {
  id: string;
  seconds: number;
  title: string;
}

export interface EditorChaptersModalProps {
  isOpen: boolean;
  onClose: () => void;
  segments: CaptionSegment[];
  durationSeconds?: number;
}

function formatTimestamp(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

function generateInitialChapters(segments: CaptionSegment[]): VideoChapter[] {
  if (segments.length === 0) {
    return [{ id: "ch-0", seconds: 0, title: "Introduction" }];
  }
  const chapters: VideoChapter[] = [{ id: "ch-0", seconds: 0, title: "Introduction" }];
  const step = Math.max(3, Math.floor(segments.length / 4));
  for (let i = step; i < segments.length; i += step) {
    const seg = segments[i];
    const preview = seg.text.split(/[.?!]/)[0]?.trim() || "Key Discussion";
    chapters.push({
      id: `ch-${i}`,
      seconds: Math.floor(seg.start),
      title: preview.slice(0, 40),
    });
  }
  return chapters;
}

export function EditorChaptersModal({
  isOpen,
  onClose,
  segments,
}: EditorChaptersModalProps) {
  const dialogId = useId();
  const titleId = `${dialogId}-title`;
  const dialogRef = useRef<HTMLDivElement>(null);
  useDialogFocus(dialogRef, isOpen);

  const [chapters, setChapters] = useState<VideoChapter[]>(() =>
    generateInitialChapters(segments),
  );
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

  const youtubeFormatText = useMemo(() => {
    return chapters
      .map((c) => `${formatTimestamp(c.seconds)} ${c.title}`)
      .join("\n");
  }, [chapters]);

  const csvFormatText = useMemo(() => {
    const header = "Timestamp,Seconds,Title\n";
    const rows = chapters.map((c) => `"${formatTimestamp(c.seconds)}",${c.seconds},"${c.title}"`).join("\n");
    return header + rows;
  }, [chapters]);

  if (!isOpen) return null;

  const handleAddChapter = () => {
    const lastSec = chapters.length > 0 ? chapters[chapters.length - 1].seconds + 30 : 0;
    setChapters([
      ...chapters,
      { id: `ch-${Date.now()}`, seconds: lastSec, title: "New Chapter Point" },
    ]);
  };

  const handleUpdate = (id: string, updates: Partial<VideoChapter>) => {
    setChapters((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    );
  };

  const handleRemove = (id: string) => {
    if (chapters.length <= 1) return;
    setChapters((prev) => prev.filter((c) => c.id !== id));
  };

  const handleCopy = (text: string, formatId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFormat(formatId);
    setTimeout(() => setCopiedFormat(null), 2000);
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
              <Bookmark size={18} />
            </div>
            <div>
              <h2 id={titleId} className="text-sm font-semibold text-cream">Video Chapters & Timestamps</h2>
              <p className="text-xs text-dim">Generate YouTube and podcast description timestamp markers</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg text-dim hover:text-cream hover:bg-surface transition-colors cursor-pointer" aria-label="Close chapters dialog">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-dim uppercase tracking-wider">
              Timeline Markers ({chapters.length})
            </label>
            <button
              type="button"
              onClick={handleAddChapter}
              className="text-xs font-semibold text-accent hover:text-accent-hover flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Plus size={14} /> Add Timestamp
            </button>
          </div>

          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {chapters.map((ch) => (
              <div key={ch.id} className="flex items-center gap-2 p-2 rounded-xl border border-hairline bg-surface-raised/40">
                <input
                  type="text"
                  value={formatTimestamp(ch.seconds)}
                  onChange={(e) => {
                    const parts = e.target.value.split(":");
                    if (parts.length === 2) {
                      const m = parseInt(parts[0], 10) || 0;
                      const s = parseInt(parts[1], 10) || 0;
                      handleUpdate(ch.id, { seconds: m * 60 + s });
                    }
                  }}
                  className="w-16 px-2 py-1 rounded-lg border border-hairline bg-surface text-xs text-accent font-mono text-center outline-none focus:border-accent"
                />
                <input
                  type="text"
                  value={ch.title}
                  onChange={(e) => handleUpdate(ch.id, { title: e.target.value })}
                  className="flex-1 px-3 py-1 rounded-lg border border-hairline bg-surface text-xs text-cream outline-none focus:border-accent"
                  placeholder="Chapter Title"
                />
                {chapters.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemove(ch.id)}
                    className="p-1.5 rounded-lg text-dim hover:text-red-400 hover:bg-surface transition-colors cursor-pointer"
                    title="Remove marker"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>

          <section className="space-y-2 pt-2 border-t border-hairline">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-dim uppercase tracking-wider">YouTube Description Format</span>
              <button
                type="button"
                onClick={() => handleCopy(youtubeFormatText, "yt")}
                className="text-xs font-semibold text-accent hover:text-accent-hover flex items-center gap-1.5 cursor-pointer"
              >
                {copiedFormat === "yt" ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                {copiedFormat === "yt" ? "Copied!" : "Copy Description"}
              </button>
            </div>
            <pre className="p-3 rounded-xl border border-hairline bg-black/40 text-[11px] font-mono text-body overflow-x-auto whitespace-pre leading-relaxed select-all">
              {youtubeFormatText}
            </pre>
          </section>
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t border-hairline bg-surface-raised">
          <p className="text-xs text-dim">Compatible with YouTube description, Spotify, and Vimeo</p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleCopy(csvFormatText, "csv")}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-surface border border-hairline hover:border-accent text-dim hover:text-cream transition-colors cursor-pointer flex items-center gap-1.5"
            >
              {copiedFormat === "csv" ? <Check size={13} /> : <FileSpreadsheet size={13} />}
              {copiedFormat === "csv" ? "CSV Copied" : "Copy CSV"}
            </button>
            <button
              type="button"
              onClick={() => handleCopy(JSON.stringify(chapters, null, 2), "json")}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-surface border border-hairline hover:border-accent text-accent hover:bg-accent-soft transition-colors cursor-pointer flex items-center gap-1.5"
            >
              {copiedFormat === "json" ? <Check size={13} /> : <FileText size={13} />}
              {copiedFormat === "json" ? "JSON Copied" : "Export JSON"}
            </button>
            <button type="button" onClick={onClose} className="px-3 py-1.5 text-xs font-semibold text-dim hover:text-cream transition-colors cursor-pointer">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
