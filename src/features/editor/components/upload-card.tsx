import { ArrowUpRight, Upload } from "lucide-react";
type Props = { onClick: () => void; onFile: (file: File) => void };
export function UploadCard({ onClick, onFile }: Props) {
  return (
    <div
      className="studio-upload text-center [background:#ffffff60] [border:1px_dashed_#c7c9be] rounded-[11px] flex-col justify-center items-center min-h-[235px] [padding:32px_25px] [transition:border-color_.2s,_background_.2s] flex [&:focus-within]:[border-color:var(--accent)] [&:focus-within]:[background:#fff] [&:has(button:hover)]:[border-color:var(--accent)] [&:has(button:hover)]:[background:#fff] [&_h2]:tracking-[-.03em] [&_h2]:text-[17px] [&_h2]:font-[650] [&_p]:[color:var(--dim)] [&_p]:mt-[10px] [&_p]:text-[11px] [&_.action-primary]:rounded-[6px] [&_.action-primary]:min-h-[36px] [&_.action-primary]:mt-[20px] [&_.action-primary]:[padding:8px_18px] [&_.action-primary]:text-[11px] product-max-767:min-h-[250px] product-max-767:[padding:28px_18px] product-max-767:[&_h2]:text-[16px] product-max-767:[&_p]:max-w-[235px] product-max-767:[&_p]:text-[10px] product-max-767:[&_p]:leading-[1.8]"
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        if (file) onFile(file);
      }}
    >
      <span className="upload-icon [color:var(--cream)] mb-[13px] inline-flex">
        <Upload size={24} strokeWidth={1.4} />
      </span>
      <h2>Drop a video. We’ll find the words.</h2>
      <p>MP4, MOV, WebM or audio · up to 3 minutes · 300 MB</p>
      <button type="button" onClick={onClick} className="action-primary">
        Choose a file <ArrowUpRight size={15} />
      </button>
    </div>
  );
}
