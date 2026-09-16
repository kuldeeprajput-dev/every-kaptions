"use client";

import { Upload } from "lucide-react";

type Props = {
  onClick: () => void;
  onFile: (file: File) => void;
};

export function UploadCard({ onClick, onFile }: Props) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        if (file) onFile(file);
      }}
      className="group flex min-h-[170px] h-[190px] sm:h-[360px] w-full sm:w-[210px] cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-[#121212] p-5 text-center transition-colors hover:border-white/30"
    >
      <div className="mb-3 sm:mb-3.5 flex size-11 sm:size-12 items-center justify-center rounded-xl bg-[#1c1c1c] text-[#888] transition-colors group-hover:text-white">
        <Upload size={20} strokeWidth={1.8} />
      </div>
      <p className="mb-1 text-sm font-semibold text-white">
        + New caption
      </p>
      <p className="text-[11px] leading-relaxed text-[#6f7b82]">
        MP4 or MOV · up to 3 min · 1080p · up to 300 MB
      </p>
    </div>
  );
}
