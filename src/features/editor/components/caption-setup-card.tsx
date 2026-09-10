import { AlertCircle, Check, FileVideo, LoaderCircle, Sparkles, X } from "lucide-react";
import { formatFileSize, languageOptions } from "../data/editor-config";
import type { TranscriptionState } from "../types/captions";

type Props = {
  file: File;
  language: string;
  status: TranscriptionState;
  error: string;
  captionCount: number;
  remainingMinutes: number;
  canTranscribe: boolean;
  onLanguageChange: (language: string) => void;
  onGenerate: () => void;
  onDownload: () => void;
  onReset: () => void;
};

export function CaptionSetupCard({
  file,
  language,
  status,
  error,
  captionCount,
  remainingMinutes,
  canTranscribe,
  onLanguageChange,
  onGenerate,
  onDownload,
  onReset,
}: Props) {
  const isWorking = status === "transcribing" || status === "uploading";
  const isReady = status === "ready";

  return (
    <section className="mt-5 w-full max-w-xl rounded-2xl border border-white/10 bg-[#121313] p-4 shadow-2xl shadow-black/20 sm:p-6">
      <div className="flex items-start gap-3">
        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-amber/10 text-amber">
          <FileVideo size={21} aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-cream">{file.name}</p>
          <p className="mt-1 text-xs text-[#788187]">{formatFileSize(file.size)} · Ready to process</p>
        </div>
        <button
          type="button"
          onClick={onReset}
          disabled={isWorking}
          className="grid size-9 shrink-0 place-items-center rounded-lg text-[#7d8589] transition hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Remove selected file"
        >
          <X size={18} />
        </button>
      </div>

      {!isReady ? (
        <>
          <div className="mt-6">
            <div className="flex items-center justify-between gap-3">
              <label htmlFor="caption-language" className="text-sm font-semibold text-cream">Spoken language</label>
              <span className="text-[10px] font-semibold text-amber">{remainingMinutes.toFixed(1)} min remaining</span>
            </div>
            <p className="mt-1 text-xs leading-5 text-[#788187]">Choose a language for better names and word timing.</p>
            <select
              id="caption-language"
              value={language}
              onChange={(event) => onLanguageChange(event.target.value)}
              disabled={isWorking}
              className="mt-3 min-h-11 w-full rounded-xl border border-white/10 bg-[#0b0c0c] px-3 text-sm text-cream outline-none transition focus:border-amber/60"
            >
              {languageOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          <div className="mt-5 rounded-xl border border-white/8 bg-black/20 p-3">
            <p className="flex items-center gap-2 text-xs font-semibold text-[#a8afb2]">
              <Sparkles size={14} className="text-amber" /> What happens next
            </p>
            <ol className="mt-3 grid gap-2 text-xs text-[#788187] sm:grid-cols-3">
              <li><strong className="text-cream">1.</strong> Upload audio</li>
              <li><strong className="text-cream">2.</strong> Create captions</li>
              <li><strong className="text-cream">3.</strong> Review and export</li>
            </ol>
          </div>

          {error ? (
            <p role="alert" className="mt-4 flex items-start gap-2 rounded-xl bg-red-500/10 px-3 py-2.5 text-xs leading-5 text-red-300">
              <AlertCircle size={16} className="mt-0.5 shrink-0" /> {error}
            </p>
          ) : null}

          <button
            type="button"
            onClick={onGenerate}
            disabled={isWorking || !canTranscribe}
            className="mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-amber px-5 text-sm font-bold text-black transition hover:bg-[#ffd467] disabled:cursor-wait disabled:opacity-70"
          >
            {isWorking ? <LoaderCircle size={18} className="animate-spin" /> : <Sparkles size={17} />}
            {isWorking ? "Listening and creating captions…" : canTranscribe ? "Create captions" : "Transcription limit reached"}
          </button>
          <p className="mt-3 text-center text-[11px] text-[#626a6e]">Your file is sent securely to Groq for transcription.</p>
        </>
      ) : (
        <div className="mt-6 rounded-xl border border-emerald-400/20 bg-emerald-400/5 p-4">
          <p className="flex items-center gap-2 font-semibold text-emerald-300"><Check size={18} /> Captions are ready</p>
          <p className="mt-2 text-sm leading-6 text-[#929a9e]">We found {captionCount} editable caption segments. Download them now or start over with another recording.</p>
          <button type="button" onClick={onDownload} className="mt-4 min-h-11 rounded-xl bg-cream px-5 text-sm font-bold text-black">
            Download .SRT
          </button>
        </div>
      )}
    </section>
  );
}
