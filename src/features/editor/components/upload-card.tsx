import { Upload } from "lucide-react";

export function UploadCard({ fileName, onClick }: { fileName: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-5 flex h-[320px] w-[180px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/20 bg-[#111] px-5 text-center transition hover:border-amber/50"
    >
      <span className="grid size-14 place-items-center rounded-xl bg-white/4 text-[#676767]">
        <Upload size={25} />
      </span>
      <strong className="mt-4 text-sm text-white">+ New caption</strong>
      <span className="mt-3 text-xs leading-5 text-[#657078]">
        {fileName || "MP4 or MOV · up to 3 min · 1080p · up to 300 MB"}
      </span>
    </button>
  );
}
