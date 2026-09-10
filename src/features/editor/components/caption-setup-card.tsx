"use client";

import { useEffect, useState } from "react";
import { AlertCircle, LoaderCircle, X } from "lucide-react";
import { getCaptionOutputOption, getCaptionOutputOptions, getLanguageOption, indianLanguageOptions } from "../data/editor-config";
import type { CaptionOutputLanguage, TranscriptionState } from "../types/captions";

type Props = {
  file: File;
  language: string;
  outputLanguage: CaptionOutputLanguage;
  status: TranscriptionState;
  uploadProgress: number;
  error: string;
  captionCount?: number;
  remainingMinutes?: number;
  canTranscribe: boolean;
  onLanguageChange: (language: string) => void;
  onOutputLanguageChange: (language: CaptionOutputLanguage) => void;
  onGenerate: () => void;
  onDownload?: () => void;
  onReset: () => void;
};

export function CaptionSetupCard({
  file,
  language,
  outputLanguage,
  status,
  uploadProgress,
  error,
  remainingMinutes,
  canTranscribe,
  onLanguageChange,
  onOutputLanguageChange,
  onGenerate,
  onReset,
}: Props) {
  const isWorking = ["uploading", "transcribing", "translating", "preparing"].includes(status);
  const willTranslate = outputLanguage !== "same";
  const progressSteps = willTranslate
    ? ["Upload", "Transcribe", "Translate", "Prepare"]
    : ["Upload", "Transcribe", "Prepare"];
  const progressStep = status === "uploading"
    ? { label: `Uploading media · ${uploadProgress}%`, index: 0 }
    : status === "transcribing"
      ? { label: "Listening and creating captions", index: 1 }
      : status === "translating"
        ? { label: "Translating into your chosen language", index: 2 }
        : status === "preparing"
          ? { label: "Preparing your editor", index: progressSteps.length - 1 }
          : null;

  const [mediaUrl, setMediaUrl] = useState<string>("");

  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setMediaUrl(url);
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  const currentLang = getLanguageOption(language);
  const outputOptions = getCaptionOutputOptions(language);
  const selectedOutput = getCaptionOutputOption(outputLanguage);

  useEffect(() => {
    if (isWorking) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onReset();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [isWorking, onReset]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 p-0 sm:items-center sm:p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <button
        type="button"
        className="absolute inset-0 w-full h-full cursor-default bg-transparent"
        onClick={() => {
          if (!isWorking) onReset();
        }}
        aria-label="Close modal"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-busy={isWorking}
        aria-labelledby="media-setup-title"
        aria-describedby="media-setup-description"
        className="relative z-10 max-h-[calc(100dvh-1rem)] w-full max-w-[460px] overflow-y-auto rounded-t-[24px] border border-white/10 bg-[#161513] p-5 shadow-2xl font-sans sm:max-h-[calc(100dvh-2rem)] sm:rounded-[24px] sm:p-6">
        <button
          type="button"
          onClick={onReset}
          disabled={isWorking}
          className="absolute right-4 top-4 grid size-8 place-items-center rounded-full text-[#777] hover:bg-white/10 hover:text-white transition cursor-pointer disabled:opacity-40"
          aria-label="Close setup modal"
        >
          <X size={18} />
        </button>

        <h2 id="media-setup-title" className="text-center text-xl font-bold tracking-tight text-white sm:text-2xl">
          Prepare your media
        </h2>
        <p id="media-setup-description" className="mt-1.5 text-center text-xs leading-relaxed text-[#8d8d89]">
          Choose how captions should appear before upload starts.
        </p>

        <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-black aspect-video flex items-center justify-center relative">
          {mediaUrl ? (
            file.type.startsWith("audio/") ? (
              <div className="flex flex-col items-center justify-center p-4 text-center">
                <audio src={mediaUrl} controls className="w-full max-w-[280px]" />
                <p className="mt-2 text-xs text-[#888]">{file.name}</p>
              </div>
            ) : (
              <video
                src={mediaUrl}
                controls
                playsInline
                className="h-full w-full object-contain"
                preload="metadata"
              />
            )
          ) : null}
        </div>

        <div aria-live="polite" className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs">
          <span
            className={isWorking
              ? "flex items-center gap-2 font-medium text-[#f6c453]"
              : "flex items-center gap-2 font-medium text-[#4ade80]"}
          >
            {isWorking ? (
              <LoaderCircle size={14} className="animate-spin" aria-hidden="true" />
            ) : (
              <span className="size-2 rounded-full bg-[#4ade80]" />
            )}
            {progressStep?.label ?? "Ready for processing"}
          </span>
          <span className="text-[#7f878a]">
            {(file.size / (1024 * 1024)).toFixed(1)} MB
            {typeof remainingMinutes === "number" ? " · " + remainingMinutes.toFixed(1) + " min left" : ""}
          </span>
        </div>

        {progressStep ? (
          <div
            className="mt-3"
            aria-label={`Caption creation step ${progressStep.index + 1} of ${progressSteps.length}`}
          >
            <div className={willTranslate ? "grid grid-cols-4 gap-1.5" : "grid grid-cols-3 gap-1.5"}>
              {progressSteps.map((step, index) => (
                <div key={step} className="min-w-0">
                  <div
                    className={index <= progressStep.index
                      ? "h-1 rounded-full bg-[#f6c453] transition-colors"
                      : "h-1 rounded-full bg-white/10 transition-colors"}
                  />
                  <span className={index === progressStep.index
                    ? "mt-1 block truncate text-[9px] font-semibold text-[#d9b95f]"
                    : "mt-1 block truncate text-[9px] text-[#646464]"}
                  >
                    {step}
                  </span>
                </div>
              ))}
            </div>
            {status === "uploading" ? (
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-[#f6c453] transition-[width] duration-200"
                  style={{ width: `${Math.max(2, uploadProgress)}%` }}
                />
              </div>
            ) : null}
          </div>
        ) : null}

        <div className="mt-5">
          <p className="text-[10px] font-bold tracking-[0.14em] uppercase text-[#6f7b82]">
            LANGUAGE SETTINGS
          </p>

          <label htmlFor="spoken-lang" className="mt-3 block text-xs font-medium text-white">
            What language is spoken?
          </label>
          <div className="mt-1.5 relative">
            <select
              id="spoken-lang"
              value={language}
              onChange={(event) => {
                onLanguageChange(event.target.value);
                onOutputLanguageChange("same");
              }}
              disabled={isWorking}
              style={{ outline: "none" }}
              className="w-full h-11 appearance-none rounded-xl border border-[#3e382b] bg-[#141311] px-4 text-sm font-semibold text-white outline-none focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 focus:border-[#f6c453] transition cursor-pointer"
            >
              {indianLanguageOptions.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                  disabled={!option.supported}
                  className={option.supported ? "bg-[#1c1b18] text-white" : "bg-[#1c1b18] text-[#666]"}
                >
                  {option.nativeName}
                  {!option.supported ? " (Coming soon)" : ""}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[#999]">
              ▼
            </div>
          </div>
          <p className="mt-1.5 text-[11px] text-[#788187]">
            Choose the language actually spoken in your recording.
          </p>

          <div className="mt-4">
            <div className="mb-2 flex items-center justify-between gap-3">
              <label htmlFor="caption-output" className="text-xs font-medium text-white">
                Caption output
              </label>
              <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#f6c453]">
                {outputLanguage === "same" ? "Automatic" : "Translate"}
              </span>
            </div>
            <div className="relative">
              <select
                id="caption-output"
                value={outputLanguage}
                onChange={(event) => onOutputLanguageChange(event.target.value as CaptionOutputLanguage)}
                disabled={isWorking}
                aria-describedby="caption-output-help"
                className="h-11 w-full cursor-pointer appearance-none rounded-xl border border-[#3e382b] bg-[#141311] px-4 pr-10 text-sm font-semibold text-white outline-none transition focus:border-[#f6c453] focus:outline-none focus:ring-0 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {outputOptions.map((option) => (
                  <option key={option.value} value={option.value} className="bg-[#1c1b18] text-white">
                    {option.value === "same"
                      ? "Same as spoken — " + currentLang.label
                      : option.label + " — " + option.nativeName}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[#999]">
                ▼
              </span>
            </div>
            <p id="caption-output-help" aria-live="polite" className="mt-2 text-[11px] leading-relaxed text-[#788187]">
              {selectedOutput.description}
              {outputLanguage === "same" ? "" : " The original caption timing is preserved."}
            </p>
          </div>
        </div>

        {error ? (
          <p role="alert" className="mt-4 flex items-start gap-2 rounded-xl bg-red-500/10 px-3 py-2.5 text-xs text-red-300">
            <AlertCircle size={15} className="mt-0.5 shrink-0" /> {error}
          </p>
        ) : null}

        <button
          type="button"
          onClick={onGenerate}
          disabled={isWorking || !canTranscribe || !currentLang.supported}
          className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#f4ecdc] text-sm font-bold text-black shadow-[0_0_24px_rgba(244,236,220,0.22)] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
        >
          {isWorking ? (
            <>
              <LoaderCircle size={18} className="animate-spin" aria-hidden="true" />
              <span>{progressStep?.label ?? "Creating captions"}</span>
            </>
          ) : (
            <span>Continue</span>
          )}
        </button>

        <button
          type="button"
          onClick={onReset}
          disabled={isWorking}
          className="mt-2.5 w-full text-center text-xs font-semibold text-[#888888] hover:text-white transition cursor-pointer py-1"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
