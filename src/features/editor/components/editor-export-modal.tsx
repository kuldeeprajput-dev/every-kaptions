"use client";

import { Download, FileText, Film, Loader2, Share2, X } from "lucide-react";
import Link from "next/link";

export interface EditorExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExportVideo: () => void;
  onExportSubtitles: (format: "srt" | "vtt" | "txt") => void;
  onOpenSocialMetadata?: () => void;
  isRenderingVideo: boolean;
  renderProgress: number;
  exportError: string;
  remainingExports: number;
}

export function EditorExportModal({
  isOpen,
  onClose,
  onExportVideo,
  onExportSubtitles,
  onOpenSocialMetadata,
  isRenderingVideo,
  renderProgress,
  exportError,
  remainingExports,
}: EditorExportModalProps) {
  if (!isOpen) return null;

  return (
    <div
      role="presentation"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="export-modal-title"
        className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-hairline bg-surface p-6 text-cream shadow-sm font-sans"
      >
        {/* Dismiss Button */}
        <button
          type="button"
          onClick={() => !isRenderingVideo && onClose()}
          disabled={isRenderingVideo}
          className="absolute right-4 top-4 grid size-9 place-items-center rounded-lg text-body transition hover:bg-surface-raised hover:text-cream cursor-pointer disabled:opacity-30"
          aria-label="Close export dialog"
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-2xl bg-amber/15 text-amber">
            <Download size={20} aria-hidden="true" />
          </span>
          <div>
            <h3 id="export-modal-title" className="text-lg font-bold text-cream">
              Export your story
            </h3>
            <p className="text-xs text-body">
              Choose video format or subtitle files to download.
            </p>
          </div>
        </div>

        {/* Quota Information */}
        <div className="mt-4 flex items-center justify-between rounded-xl border border-hairline bg-surface-raised p-3 text-xs">
          <div>
            <span className="text-body">Exports Remaining: </span>
            <span className="font-bold text-amber">{remainingExports} remaining</span>
          </div>
          <Link
            href="/pricing"
            className="text-[11px] font-bold text-cream underline hover:text-amber"
          >
            Upgrade Plan
          </Link>
        </div>

        {/* Error message */}
        {exportError && (
          <div
            role="alert"
            className="mt-3 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-700"
          >
            {exportError}
          </div>
        )}

        {/* Video Rendering Progress */}
        {isRenderingVideo ? (
          <div className="mt-6 space-y-3 text-center py-6">
            <Loader2
              size={36}
              className="mx-auto text-amber animate-spin"
              aria-hidden="true"
            />
            <h4 className="text-sm font-bold text-cream">
              Rendering Captioned Video...
            </h4>
            <div className="mx-auto max-w-xs space-y-1.5">
              <div
                className="h-2 w-full overflow-hidden rounded-lg bg-surface-raised"
                role="progressbar"
                aria-valuenow={renderProgress}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  className="h-full bg-amber transition-all duration-200"
                  style={{ width: `${renderProgress}%` }}
                />
              </div>
              <p className="text-xs font-mono text-amber">
                {renderProgress}% completed
              </p>
            </div>
            <p className="text-[11px] text-dim">
              Encoding burned-in captions directly into the MP4 file.
            </p>
          </div>
        ) : (
          /* Export Action Cards */
          <div className="mt-6 space-y-4">
            {/* MP4 Video Export */}
            <button
              type="button"
              onClick={onExportVideo}
              className="group flex w-full items-center justify-between rounded-2xl border border-hairline bg-surface-raised p-4 text-left transition hover:border-amber/50 hover:bg-surface cursor-pointer shadow-sm"
            >
              <div className="flex items-center gap-3.5">
                <span className="grid size-11 place-items-center rounded-xl bg-amber/10 text-amber group-hover:scale-105 transition">
                  <Film size={22} aria-hidden="true" />
                </span>
                <div>
                  <h4 className="text-sm font-bold text-cream group-hover:text-amber transition">
                    Captioned Video (.MP4)
                  </h4>
                  <p className="text-xs text-body">
                    Burn styled captions directly onto your video.
                  </p>
                </div>
              </div>
              <Download
                size={18}
                className="text-dim group-hover:text-amber transition"
                aria-hidden="true"
              />
            </button>

            {/* Subtitle File Downloads */}
            <div className="rounded-2xl border border-hairline bg-surface p-4">
              <span className="text-xs font-bold uppercase tracking-wider text-body block mb-3">
                Download Subtitle Files
              </span>
              <div className="grid grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => onExportSubtitles("srt")}
                  className="flex flex-col items-center justify-center rounded-xl border border-hairline bg-surface-raised p-3 text-center transition hover:border-amber hover:text-amber cursor-pointer"
                >
                  <FileText size={18} className="mb-1 text-dim" aria-hidden="true" />
                  <span className="text-xs font-bold text-cream">.SRT</span>
                  <span className="text-[10px] text-body">SubRip format</span>
                </button>

                <button
                  type="button"
                  onClick={() => onExportSubtitles("vtt")}
                  className="flex flex-col items-center justify-center rounded-xl border border-hairline bg-surface-raised p-3 text-center transition hover:border-amber hover:text-amber cursor-pointer"
                >
                  <FileText size={18} className="mb-1 text-dim" aria-hidden="true" />
                  <span className="text-xs font-bold text-cream">.VTT</span>
                  <span className="text-[10px] text-body">Web video</span>
                </button>

                <button
                  type="button"
                  onClick={() => onExportSubtitles("txt")}
                  className="flex flex-col items-center justify-center rounded-xl border border-hairline bg-surface-raised p-3 text-center transition hover:border-amber hover:text-amber cursor-pointer"
                >
                  <FileText size={18} className="mb-1 text-dim" aria-hidden="true" />
                  <span className="text-xs font-bold text-cream">.TXT</span>
                  <span className="text-[10px] text-body">Raw transcript</span>
                </button>
              </div>
            </div>

            {/* Social Post & Metadata Generator */}
            {onOpenSocialMetadata ? (
              <div className="rounded-2xl border border-hairline bg-surface p-4 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-cream flex items-center gap-1.5">
                    <Share2 size={14} className="text-amber" /> Social Post Generator
                  </span>
                  <p className="text-[11px] text-body mt-0.5">Viral hooks, descriptions, and hashtag packages</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenSocialMetadata();
                  }}
                  className="rounded-xl border border-hairline bg-surface-raised px-3 py-1.5 text-xs font-bold text-cream hover:text-amber hover:border-amber/50 transition cursor-pointer"
                >
                  Generate
                </button>
              </div>
            ) : null}
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={isRenderingVideo}
            className="rounded-xl border border-hairline px-4 py-2 text-xs font-semibold text-body hover:bg-surface-raised hover:text-cream transition cursor-pointer disabled:opacity-30"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
