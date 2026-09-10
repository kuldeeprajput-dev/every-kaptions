import { FileVideo, Upload } from "lucide-react";

type Props = {
  onClick: () => void;
  onFile: (file: File) => void;
};

export function UploadCard({ onClick, onFile }: Props) {
  return (
    <div
      className="mt-5 flex min-h-60 w-full max-w-xl flex-col items-center justify-center rounded-2xl border border-dashed border-white/20 bg-[#111] px-6 py-10 text-center transition hover:border-amber/50 sm:min-h-72"
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        if (file) onFile(file);
      }}
    >
      <span className="grid size-14 place-items-center rounded-2xl bg-amber/10 text-amber">
        <Upload size={24} aria-hidden="true" />
      </span>
      <h2 className="mt-4 text-lg font-bold text-cream">Upload your first video</h2>
      <p className="mt-2 max-w-sm text-sm leading-6 text-[#7b8387]">Drop a recording here, or choose a file. We will turn the speech into captions you can edit.</p>
      <button type="button" onClick={onClick} className="mt-5 flex min-h-11 items-center gap-2 rounded-xl bg-cream px-5 text-sm font-bold text-black">
        <FileVideo size={17} /> Choose video
      </button>
      <p className="mt-4 text-[11px] text-[#626a6e]">MP4, MOV, WebM, MP3, or WAV · maximum 25 MB</p>
    </div>
  );
}
