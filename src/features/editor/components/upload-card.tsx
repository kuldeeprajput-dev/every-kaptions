import { ArrowUpRight, Upload } from "lucide-react";
type Props = { onClick: () => void; onFile: (file: File) => void };
export function UploadCard({ onClick, onFile }: Props) {
  return (
    <div
      className="studio-upload"
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        if (file) onFile(file);
      }}
    >
      <span className="upload-icon">
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
