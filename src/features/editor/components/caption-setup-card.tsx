"use client";

import { useEffect, useRef } from "react";
import { AlertCircle, ArrowRight, LoaderCircle } from "lucide-react";
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

  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const media = file.type.startsWith("audio/") ? audioRef.current : videoRef.current;
    if (!media) return;
    const url = URL.createObjectURL(file);
    media.src = url;
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  const currentLang = getLanguageOption(language);
  const outputOptions = getCaptionOutputOptions(language);
  const selectedOutput = getCaptionOutputOption(outputLanguage);

  return (
    <section className="studio-setup-content" aria-busy={isWorking} aria-labelledby="media-setup-title">
        <h1 id="media-setup-title" className="text-xl font-bold tracking-tight text-cream sm:text-2xl">
          Create your captions.
        </h1>
        <p id="media-setup-description" className="mt-1.5 text-center text-xs leading-relaxed text-body">
          Preview your recording, choose a language, and we’ll take care of the first draft.
        </p>

        <div className="studio-setup-columns">
        <div>
        <div className="mt-4 overflow-hidden rounded-2xl border border-hairline bg-black aspect-video flex items-center justify-center relative">
          {file.type.startsWith("audio/") ? (
              <div className="flex flex-col items-center justify-center p-4 text-center">
                <audio ref={audioRef} controls className="w-full max-w-[280px]" />
                <p className="mt-2 text-xs text-body">{file.name}</p>
              </div>
            ) : (
              <video
                ref={videoRef}
                controls
                playsInline
                className="h-full w-full object-contain"
                preload="metadata"
              />
            )}
        </div>

        <div aria-live="polite" className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs">
          <span
            className={isWorking
              ? "flex items-center gap-2 font-medium text-[#b32e2e]"
              : "flex items-center gap-2 font-medium text-[#4d6b43]"}
          >
            {isWorking ? (
              <LoaderCircle size={14} className="animate-spin" aria-hidden="true" />
            ) : (
              <span className="size-1.5 rounded-full bg-[#4d8059]" />
            )}
            {progressStep?.label ?? "Ready for processing"}
          </span>
          <span className="text-body">
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
                      ? "h-1 rounded-lg bg-[#c63838] transition-colors"
                      : "h-1 rounded-lg bg-surface-raised transition-colors"}
                  />
                  <span className={index === progressStep.index
                    ? "mt-1 block truncate text-[9px] font-semibold text-[#b32e2e]"
                    : "mt-1 block truncate text-[9px] text-dim"}
                  >
                    {step}
                  </span>
                </div>
              ))}
            </div>
            {status === "uploading" ? (
              <div className="mt-2 h-1.5 overflow-hidden rounded-lg bg-surface-raised">
                <div
                  className="h-full rounded-lg bg-[#c63838] transition-[width] duration-200"
                  style={{ width: `${Math.max(2, uploadProgress)}%` }}
                />
              </div>
            ) : null}
          </div>
        ) : null}

        </div>
        <div className="studio-setup-settings">
        <div>
          <div className="studio-setup-settings-heading">
            <h2>Caption settings</h2>
            <p>Make the words work for your audience.</p>
          </div>

          <label htmlFor="spoken-lang" className="mt-3 block text-xs font-medium text-cream">
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
              className="w-full h-11 appearance-none rounded-xl border border-hairline bg-surface px-4 text-sm font-semibold text-cream outline-none focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 focus:border-[#c63838] transition cursor-pointer"
            >
              {indianLanguageOptions.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                  disabled={!option.supported}
                  className={option.supported ? "bg-surface text-cream" : "bg-surface text-dim"}
                >
                  {option.nativeName}
                  {!option.supported ? " (Coming soon)" : ""}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-body">
              ▼
            </div>
          </div>
          <p className="mt-1.5 text-[11px] text-body">
            Choose the language actually spoken in your recording.
          </p>

          <div className="mt-4">
            <div className="mb-2 flex items-center justify-between gap-3">
              <label htmlFor="caption-output" className="text-xs font-medium text-cream">
                Caption output
              </label>
              <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#b32e2e]">
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
                className="h-11 w-full cursor-pointer appearance-none rounded-xl border border-hairline bg-surface px-4 pr-10 text-sm font-semibold text-cream outline-none transition focus:border-[#c63838] focus:outline-none focus:ring-0 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {outputOptions.map((option) => (
                  <option key={option.value} value={option.value} className="bg-surface text-cream">
                    {option.value === "same"
                      ? "Same as spoken — " + currentLang.label
                      : option.label + " — " + option.nativeName}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-body">
                ▼
              </span>
            </div>
            <p id="caption-output-help" aria-live="polite" className="mt-2 text-[11px] leading-relaxed text-body">
              {selectedOutput.description}
              {outputLanguage === "same" ? "" : " The original caption timing is preserved."}
            </p>
          </div>
        </div>

        {error ? (
          <p role="alert" className="mt-4 flex items-start gap-2 rounded-xl bg-red-500/10 px-3 py-2.5 text-xs text-red-700">
            <AlertCircle size={15} className="mt-0.5 shrink-0" /> {error}
          </p>
        ) : null}

        <button
          type="button"
          onClick={onGenerate}
          disabled={isWorking || !canTranscribe || !currentLang.supported}
          className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#c63838] text-sm font-bold text-white shadow-sm transition hover:bg-[#ae2d2d] disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
        >
          {isWorking ? (
            <>
              <LoaderCircle size={18} className="animate-spin" aria-hidden="true" />
              <span>{progressStep?.label ?? "Creating captions"}</span>
            </>
          ) : (
            <><span>Generate captions</span><ArrowRight size={16} aria-hidden="true" /></>
          )}
        </button>

        <p className="studio-setup-next-note">Edit the words, timing, and style in the next step.</p>

        <button
          type="button"
          onClick={onReset}
          disabled={isWorking}
          className="mt-2.5 w-full text-center text-xs font-semibold text-body hover:text-cream transition cursor-pointer py-1"
        >
          Back to projects
        </button>
        </div>
      </div>
    </section>
  );
}
