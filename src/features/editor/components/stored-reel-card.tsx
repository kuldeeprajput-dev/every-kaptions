"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Film, Play, Trash2 } from "lucide-react";
import { formatClockTime } from "../lib/captions";
import type { StoredProject } from "../lib/media-db";

type Props = {
  project: StoredProject;
  onDelete: (id: string) => void;
};

export function StoredReelCard({ project, onDelete }: Props) {
  const router = useRouter();
  const [videoUrl, setVideoUrl] = useState<string>("");

  useEffect(() => {
    if (!project.fileBlob) return;
    const url = URL.createObjectURL(project.fileBlob);
    setVideoUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [project.fileBlob]);

  return (
    <div className="group relative flex w-full flex-col justify-between overflow-hidden rounded-2xl border border-hairline bg-surface p-3.5 transition hover:border-amber/40 hover:bg-surface font-sans">
      {/* Project preview */}
      <div
        role="button"
        tabIndex={0}
        aria-label={`Open project ${project.name}`}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            router.push(`/editor/${project.id}`);
          }
        }}
        onClick={() => router.push(`/editor/${project.id}`)}
        className="relative aspect-video h-[180px] w-full cursor-pointer overflow-hidden rounded-xl bg-black flex items-center justify-center border border-hairline"
      >
        {videoUrl ? (
          project.fileType?.startsWith("audio/") ? (
            <div className="flex flex-col items-center justify-center p-3 text-center">
              <Film className="text-amber" size={28} />
              <span className="mt-1 text-[10px] text-body">Audio file</span>
            </div>
          ) : (
            <video
              src={videoUrl}
              muted
              playsInline
              preload="metadata"
              className="h-full w-full object-cover"
            />
          )
        ) : (
          <div className="text-xs text-dim">Loading...</div>
        )}

        {/* Hover play overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-surface-raised opacity-0 group-hover:opacity-100 transition">
          <div className="flex size-10 items-center justify-center rounded-lg bg-amber text-white shadow-lg">
            <Play size={18} className="ml-0.5 fill-black" />
          </div>
        </div>
      </div>

      {/* Title & Info */}
      <div className="mt-3 flex items-start justify-between gap-2">
        <div
          role="button"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              router.push(`/editor/${project.id}`);
            }
          }}
          onClick={() => router.push(`/editor/${project.id}`)}
          className="cursor-pointer overflow-hidden flex-1"
        >
          <h3 className="truncate text-xs font-semibold text-cream group-hover:text-amber transition">
            {project.name}
          </h3>
          <p className="mt-0.5 text-[10px] text-dim">
            {formatClockTime(project.duration || 0)} ·{" "}
            {project.segments?.length || 0} lines
          </p>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(project.id);
          }}
          className="p-1 text-dim hover:text-red-400 transition cursor-pointer"
          title="Delete project"
          aria-label={`Delete ${project.name}`}
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}
