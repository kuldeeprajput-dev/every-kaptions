"use client";

import { useId, useRef, useState } from "react";
import { Check, Globe, Languages, Loader2, Sparkles, X } from "lucide-react";
import { cn } from "@/shared/lib/cn";
import { useDialogFocus } from "@/shared/hooks/use-dialog-focus";
import type { CaptionSegment } from "../types/captions";

export interface TranslatedTrack {
  languageCode: string;
  languageName: string;
  segments: CaptionSegment[];
  isBilingualOverlay: boolean;
}

export interface EditorTranslationModalProps {
  isOpen: boolean;
  onClose: () => void;
  segments: CaptionSegment[];
  onApplyTranslatedTrack: (track: TranslatedTrack) => void;
}

interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: "es", name: "Spanish", nativeName: "Español", flag: "🇪🇸" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳" },
  { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷" },
  { code: "de", name: "German", nativeName: "Deutsch", flag: "🇩🇪" },
  { code: "ja", name: "Japanese", nativeName: "日本語", flag: "🇯🇵" },
  { code: "pt", name: "Portuguese", nativeName: "Português", flag: "🇧🇷" },
  { code: "ko", name: "Korean", nativeName: "한국어", flag: "🇰🇷" },
  { code: "it", name: "Italian", nativeName: "Italiano", flag: "🇮🇹" },
];

export function EditorTranslationModal({
  isOpen,
  onClose,
  segments,
  onApplyTranslatedTrack,
}: EditorTranslationModalProps) {
  const dialogId = useId();
  const titleId = `${dialogId}-title`;
  const dialogRef = useRef<HTMLDivElement>(null);
  useDialogFocus(dialogRef, isOpen);

  const [selectedLang, setSelectedLang] = useState<string>("es");
  const [isBilingual, setIsBilingual] = useState<boolean>(true);
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [translatedSegments, setTranslatedSegments] = useState<CaptionSegment[]>([]);

  if (!isOpen) return null;

  const currentLang = SUPPORTED_LANGUAGES.find((l) => l.code === selectedLang) ?? SUPPORTED_LANGUAGES[0];

  const handleTranslateAll = () => {
    setIsTranslating(true);
    setTimeout(() => {
      const generated: CaptionSegment[] = segments.map((seg) => ({
        ...seg,
        text: `[${currentLang.code.toUpperCase()}] ${seg.text}`,
      }));
      setTranslatedSegments(generated);
      setIsTranslating(false);
    }, 400);
  };

  const handleSegmentTextChange = (id: string, text: string) => {
    setTranslatedSegments((prev) =>
      prev.map((s) => (s.id === id ? { ...s, text } : s)),
    );
  };

  const handleSave = () => {
    onApplyTranslatedTrack({
      languageCode: currentLang.code,
      languageName: currentLang.name,
      segments: translatedSegments.length > 0 ? translatedSegments : segments,
      isBilingualOverlay: isBilingual,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-[fadeIn_0.15s_ease-out]">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="w-full max-w-2xl bg-surface border border-hairline rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-hairline bg-surface-raised">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-accent-soft flex items-center justify-center text-accent">
              <Languages size={18} />
            </div>
            <div>
              <h2 id={titleId} className="text-sm font-semibold text-cream">Subtitle Translation & Bilingual Track</h2>
              <p className="text-xs text-dim">Translate video captions into regional and international languages</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-dim hover:text-cream hover:bg-surface transition-colors cursor-pointer"
            aria-label="Close translation dialog"
          ><X size={18} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          <section>
            <label className="text-xs font-semibold text-dim uppercase tracking-wider block mb-2.5">Target Language</label>
            <div className="grid grid-cols-4 gap-2">
              {SUPPORTED_LANGUAGES.map((lang) => {
                const isSelected = selectedLang === lang.code;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => { setSelectedLang(lang.code); setTranslatedSegments([]); }}
                    className={cn(
                      "p-2.5 rounded-xl border text-left transition-all cursor-pointer",
                      isSelected
                        ? "border-accent bg-accent-soft text-cream font-medium shadow-sm"
                        : "border-hairline bg-surface-raised/40 hover:bg-surface-raised text-body hover:text-cream",
                    )}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-sm">{lang.flag}</span>
                      <span className="text-xs font-semibold truncate">{lang.name}</span>
                    </div>
                    <span className="text-[10px] text-dim block">{lang.nativeName}</span>
                  </button>
                );
              })}
            </div>
          </section>

          <div className="flex items-center justify-between p-3 rounded-xl bg-surface-raised/60 border border-hairline text-xs">
            <div className="flex items-center gap-2">
              <Globe size={16} className="text-accent" />
              <div>
                <span className="font-semibold text-cream block">Bilingual Subtitles Mode</span>
                <span className="text-[11px] text-dim">Display secondary translation track above original speech</span>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={isBilingual} onChange={(e) => setIsBilingual(e.target.checked)} className="sr-only peer" />
              <div className="w-9 h-5 bg-surface-raised peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-accent" />
            </label>
          </div>

          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-dim uppercase tracking-wider">
                Transcript Preview ({segments.length} segments)
              </span>
              <button
                type="button"
                onClick={handleTranslateAll}
                disabled={isTranslating}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-surface border border-hairline hover:border-accent text-accent hover:bg-accent-soft transition-colors cursor-pointer flex items-center gap-1.5"
              >
                {isTranslating ? <Loader2 size={13} className="animate-spin" /> : <Sparkles size={13} />}
                {translatedSegments.length > 0 ? "Regenerate" : `Translate to ${currentLang.name}`}
              </button>
            </div>

            <div className="max-h-56 overflow-y-auto space-y-2 pr-1 border border-hairline rounded-xl p-3 bg-surface-raised/20">
              {segments.slice(0, 5).map((seg, idx) => {
                const trans = translatedSegments.find((t) => t.id === seg.id);
                return (
                  <div key={seg.id} className="p-2.5 rounded-lg border border-hairline bg-surface text-xs space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] text-dim">
                      <span className="font-mono">#{idx + 1} ({seg.start.toFixed(1)}s - {seg.end.toFixed(1)}s)</span>
                      <span>Original</span>
                    </div>
                    <p className="text-body font-medium">{seg.text}</p>
                    {trans && (
                      <div className="pt-1.5 border-t border-hairline">
                        <span className="text-[10px] text-accent font-semibold block mb-1">{currentLang.name} Translation</span>
                        <input
                          type="text"
                          value={trans.text}
                          onChange={(e) => handleSegmentTextChange(seg.id, e.target.value)}
                          className="w-full px-2 py-1 rounded border border-hairline bg-surface-raised text-xs text-cream outline-none focus:border-accent"
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t border-hairline bg-surface-raised">
          <p className="text-xs text-dim">Creates a dual-language caption layer for international viewers</p>
          <div className="flex items-center gap-2.5">
            <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-semibold text-dim hover:text-cream transition-colors cursor-pointer">
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-accent text-white hover:bg-accent/90 shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Check size={14} /> Apply Translated Subtitles
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
