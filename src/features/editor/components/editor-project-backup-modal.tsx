"use client";

import { useId, useRef, useState } from "react";
import { Archive, Check, Download, History, Plus, RotateCcw, Trash2, Upload, X } from "lucide-react";
import { cn } from "@/shared/lib/cn";
import { useDialogFocus } from "@/shared/hooks/use-dialog-focus";
import type { CaptionSegment } from "../types/captions";

export interface ProjectSnapshot {
  id: string;
  name: string;
  createdAt: string;
  segmentCount: number;
  segments: CaptionSegment[];
}

export interface EditorProjectBackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSegments: CaptionSegment[];
  onRestoreSnapshot: (segments: CaptionSegment[]) => void;
}

const DEFAULT_SNAPSHOTS: ProjectSnapshot[] = [
  {
    id: "snap-init",
    name: "Initial AI Transcription",
    createdAt: "Today at 09:30 AM",
    segmentCount: 18,
    segments: [],
  },
];

export function EditorProjectBackupModal({
  isOpen,
  onClose,
  currentSegments,
  onRestoreSnapshot,
}: EditorProjectBackupModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  useDialogFocus(dialogRef, isOpen);

  const [snapshots, setSnapshots] = useState<ProjectSnapshot[]>(DEFAULT_SNAPSHOTS);
  const [snapshotName, setSnapshotName] = useState("");
  const [restoredId, setRestoredId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCreateSnapshot = (e: React.FormEvent) => {
    e.preventDefault();
    const name = snapshotName.trim() || `Draft ${snapshots.length + 1}`;
    const newSnap: ProjectSnapshot = {
      id: `snap-${Date.now()}`,
      name,
      createdAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      segmentCount: currentSegments.length,
      segments: [...currentSegments],
    };
    setSnapshots([newSnap, ...snapshots]);
    setSnapshotName("");
  };

  const handleRestore = (snap: ProjectSnapshot) => {
    onRestoreSnapshot(snap.segments);
    setRestoredId(snap.id);
    setTimeout(() => setRestoredId(null), 2500);
  };

  const handleDelete = (id: string) => {
    setSnapshots(snapshots.filter((s) => s.id !== id));
  };

  const handleExportJson = (snap: ProjectSnapshot) => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(snap, null, 2));
    const dlAnchor = document.createElement("a");
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", `${snap.name.toLowerCase().replace(/\s+/g, "-")}-backup.json`);
    dlAnchor.click();
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
            <div className="p-2 rounded-xl bg-accent/10 text-accent"><Archive size={18} /></div>
            <div>
              <h2 id={titleId} className="text-sm font-semibold text-cream">Project Snapshots & Archives</h2>
              <p className="text-xs text-dim">Create version checkpoints and restore previous subtitle drafts</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg text-dim hover:text-cream hover:bg-surface transition-colors cursor-pointer" aria-label="Close backup modal">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <form onSubmit={handleCreateSnapshot} className="p-3.5 rounded-xl border border-hairline bg-surface/40 flex items-center gap-2">
            <input
              type="text"
              placeholder="Name snapshot (e.g. Before Audio Cuts)..."
              value={snapshotName}
              onChange={(e) => setSnapshotName(e.target.value)}
              className="flex-1 px-3 py-1.5 rounded-lg border border-hairline bg-surface text-xs text-cream outline-none focus:border-accent"
            />
            <button
              type="submit"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent hover:bg-accent-hover text-white text-xs font-semibold cursor-pointer transition-colors shrink-0"
            >
              <Plus size={13} /> Save Snapshot
            </button>
          </form>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-dim uppercase tracking-wider flex items-center gap-1">
                <History size={13} /> Version Checkpoints ({snapshots.length})
              </span>
              <span className="text-[11px] text-dim">Saved locally in browser memory</span>
            </div>

            <div className="space-y-1.5">
              {snapshots.map((snap) => (
                <div
                  key={snap.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-hairline bg-surface/30 hover:bg-surface/50 transition-all"
                >
                  <div className="min-w-0 flex-1 mr-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-cream truncate">{snap.name}</span>
                      {restoredId === snap.id && (
                        <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                          Restored!
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-dim font-mono mt-0.5">
                      {snap.createdAt} &bull; {snap.segmentCount} segments
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleRestore(snap)}
                      className="flex items-center gap-1 px-2 py-1 rounded-lg border border-hairline bg-surface hover:border-accent text-accent text-xs font-semibold cursor-pointer transition-colors"
                      title="Restore this draft"
                    >
                      <RotateCcw size={12} /> Restore
                    </button>
                    <button
                      type="button"
                      onClick={() => handleExportJson(snap)}
                      className="p-1 rounded text-dim hover:text-cream cursor-pointer"
                      title="Export JSON backup"
                    >
                      <Download size={13} />
                    </button>
                    {snapshots.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleDelete(snap.id)}
                        className="p-1 rounded text-dim hover:text-rose-400 cursor-pointer"
                        title="Delete snapshot"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-hairline bg-surface/30 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-cream">
              <Upload size={14} className="text-accent" />
              <span>Project snapshots allow risk-free experimentation and safe rollbacks.</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t border-hairline bg-surface/50">
          <span className="text-[11px] text-dim">{snapshots.length} snapshots available</span>
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-accent hover:bg-accent-hover text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            <Check size={14} /> Done
          </button>
        </div>
      </div>
    </div>
  );
}
