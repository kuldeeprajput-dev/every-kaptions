"use client";

import Link from "next/link";
import { ArrowUpRight, CheckCircle2, FolderOpen } from "lucide-react";

interface EditorEmptyStateProps {
  type: "in-progress" | "finished";
  onSwitchToInProgress?: () => void;
}

export function EditorEmptyState({
  type,
  onSwitchToInProgress,
}: EditorEmptyStateProps) {
  if (type === "finished") {
    return (
      <div
        className="project-empty"
        role="status"
        aria-label="No finished exports"
      >
        <CheckCircle2
          size={32}
          strokeWidth={1.2}
          className="text-dim"
          aria-hidden="true"
        />
        <h3 className="text-sm font-semibold text-cream">
          Ready when your story is.
        </h3>
        <p className="text-xs text-body">
          Open a project and export your captioned video or subtitle file.
        </p>
        {onSwitchToInProgress && (
          <button
            type="button"
            onClick={onSwitchToInProgress}
            className="inline-flex items-center gap-1 text-xs font-semibold text-amber hover:underline cursor-pointer"
          >
            Back to your projects <ArrowUpRight size={14} aria-hidden="true" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      className="project-empty"
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
        A blank canvas for your next story.
      </h3>
      <p className="text-xs text-body">
        Upload a video to create captions in Telugu, Hindi, or English.
      </p>
      <Link
        href="/editor/demo"
        className="inline-flex items-center gap-1 text-xs font-semibold text-amber hover:underline"
      >
        Take a look around the editor <ArrowUpRight size={14} aria-hidden="true" />
      </Link>
    </div>
  );
}
