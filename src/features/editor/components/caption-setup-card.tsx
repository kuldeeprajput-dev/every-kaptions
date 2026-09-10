"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertCircle, Check, Languages, LoaderCircle, X } from "lucide-react";
import { getCaptionOutputOption, getCaptionOutputOptions, getLanguageOption, indianLanguageOptions } from "../data/editor-config";
import type { CaptionOutputLanguage, TranscriptionState } from "../types/captions";

type Props = {
  file: File;
  language: string;
  outputLanguage: CaptionOutputLanguage;
  status: TranscriptionState;
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
  error,
  remainingMinutes,
  canTranscribe,
  onLanguageChange,
  onOutputLanguageChange,
  onGenerate,
  onReset,
}: Props) {
  const isWorking = status === "transcribing" || status === "uploading";

  const [mediaUrl, setMediaUrl] = useState<string>("");

  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setMediaUrl(url);
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  const currentLang = useMemo(() => getLanguageOption(language), [language]);
  const outputOptions = useMemo(() => getCaptionOutputOptions(language), [language]);
  const selectedOutput = useMemo(() => getCaptionOutputOption(outputLanguage), [outputLanguage]);

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
          <span className="flex items-center gap-2 font-medium text-[#4ade80]">
            <span className="size-2 rounded-full bg-[#4ade80]" />
            Ready for processing
          </span>
          <span className="text-[#7f878a]">
            {(file.size / (1024 * 1024)).toFixed(1)} MB
            {typeof remainingMinutes === "number" ? " · " + remainingMinutes.toFixed(1) + " min left" : ""}
          </span>
        </div>

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
              <p id="caption-output-label" className="text-xs font-medium text-white">Caption output</p>
              <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#f6c453]">Choose one</span>
            </div>
            <div role="radiogroup" aria-labelledby="caption-output-label" className="grid gap-2">
              {outputOptions.map((option) => {
                const isSelected = outputLanguage === option.value;
                const detail = option.value === "same" ? currentLang.nativeName : option.nativeName;

                return (
                  <button
                    key={option.value}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    disabled={isWorking}
                    onClick={() => onOutputLanguageChange(option.value)}
                    className={
                      "flex min-h-[72px] items-center gap-3 rounded-2xl border px-3 py-3 text-left transition " +
                      (isSelected
                        ? "border-[#f6c453]/70 bg-[#1e1b12] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
                        : "border-white/10 bg-[#11110f] hover:border-white/20 hover:bg-[#171613]")
                    }
                  >
                    <span className={
                      "grid size-9 shrink-0 place-items-center rounded-xl " +
                      (isSelected ? "bg-[#f6c453]/12 text-[#f6c453]" : "bg-white/5 text-[#777]")
                    }>
                      <Languages size={17} aria-hidden="true" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold text-white">{option.label}</span>
                      <span className="mt-0.5 block truncate text-[11px] text-[#9a9f9f]">{detail}</span>
                    </span>
                    <span className={
                      "grid size-6 shrink-0 place-items-center rounded-full border " +
                      (isSelected ? "border-[#f6c453] bg-[#f6c453] text-black" : "border-white/15 text-transparent")
                    }>
                      <Check size={14} strokeWidth={3} aria-hidden="true" />
                    </span>
                  </button>
                );
              })}
            </div>
            <p aria-live="polite" className="mt-2 text-[11px] leading-relaxed text-[#788187]">
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
              <LoaderCircle size={18} className="animate-spin" />
              <span>Creating captions...</span>
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
