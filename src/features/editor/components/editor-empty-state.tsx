"use client";

import Link from "next/link";
import { ArrowUpRight, Download, FolderOpen, Plus } from "lucide-react";

interface EditorEmptyStateProps {
  type: "in-progress" | "finished";
  onSwitchToInProgress?: () => void;
  onUpload?: () => void;
}

export function EditorEmptyState({
  type,
  onSwitchToInProgress,
  onUpload,
}: EditorEmptyStateProps) {
  if (type === "finished") {
    return (
      <div
        className="project-empty text-center flex-col items-center [padding:50px_15px_40px] flex [&_>_svg]:[color:#8a8d80] [&_>_svg]:mb-[17px] [&_h3]:tracking-[-.025em] [&_h3]:text-[16px] [&_h3]:font-[600] [&_p]:[color:var(--dim)] [&_p]:mt-[9px] [&_p]:text-[12px] [&_a]:[color:var(--accent)] [&_a]:items-center [&_a]:gap-[5px] [&_a]:mt-[20px] [&_a]:text-[11px] [&_a]:font-[550] [&_a]:inline-flex [&_button]:[color:var(--accent)] [&_button]:items-center [&_button]:gap-[5px] [&_button]:mt-[20px] [&_button]:text-[11px] [&_button]:font-[550] [&_button]:inline-flex"
        role="status"
        aria-label="No finished exports"
      >
        <Download
          size={32}
          strokeWidth={1.2}
          className="text-dim"
          aria-hidden="true"
        />
        <h3 className="text-sm font-semibold text-cream">
          Your downloads stay on your device.
        </h3>
        <p className="text-xs text-body">
          Open a saved project to export another video or subtitle file. Downloads are not listed here.
        </p>
        {onSwitchToInProgress && (
          <button
            type="button"
            onClick={onSwitchToInProgress}
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#b32e2e] hover:underline cursor-pointer"
          >
            Back to your projects <ArrowUpRight size={14} aria-hidden="true" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      className="project-empty text-center flex-col items-center [padding:50px_15px_40px] flex [&_>_svg]:[color:#8a8d80] [&_>_svg]:mb-[17px] [&_h3]:tracking-[-.025em] [&_h3]:text-[16px] [&_h3]:font-[600] [&_p]:[color:var(--dim)] [&_p]:mt-[9px] [&_p]:text-[12px] [&_a]:[color:var(--accent)] [&_a]:items-center [&_a]:gap-[5px] [&_a]:mt-[20px] [&_a]:text-[11px] [&_a]:font-[550] [&_a]:inline-flex [&_button]:[color:var(--accent)] [&_button]:items-center [&_button]:gap-[5px] [&_button]:mt-[20px] [&_button]:text-[11px] [&_button]:font-[550] [&_button]:inline-flex"
      role="status"
      aria-label="No projects in progress"
    >
      <FolderOpen
        size={32}
        strokeWidth={1.2}
        className="text-dim"
        aria-hidden="true"
      />
      <h3 className="text-sm font-semibold text-cream">
        Your next story starts here.
      </h3>
      <p className="text-xs text-body">
        Choose a video or audio file to create your first captions. Files up to 25 MB are supported.
      </p>
      {onUpload && <button type="button" onClick={onUpload} className="studio-new-project"><Plus size={15} aria-hidden="true" />Create captions</button>}
      <Link
        href="/editor/demo"
        className="inline-flex items-center gap-1 text-xs font-semibold text-[#b32e2e] hover:underline"
      >
        Take a look around the editor <ArrowUpRight size={14} aria-hidden="true" />
      </Link>
    </div>
  );
}
