"use client";

import { useId, useRef, useState, useEffect, useCallback } from "react";
import { Check, Shield, X } from "lucide-react";
import { cn } from "@/shared/lib/cn";
import { useDialogFocus } from "@/shared/hooks/use-dialog-focus";

export interface CookiePreferences {
  essential: true;
  analytics: boolean;
  performance: boolean;
  functional: boolean;
  updatedAt: number;
}

export const COOKIE_STORAGE_KEY = "everykaptions_cookie_preferences";

export const DEFAULT_COOKIE_PREFERENCES: CookiePreferences = {
  essential: true,
  analytics: true,
  performance: true,
  functional: true,
  updatedAt: 0,
};

export function getStoredCookiePreferences(): CookiePreferences {
  if (typeof window === "undefined") return DEFAULT_COOKIE_PREFERENCES;
  try {
    const raw = localStorage.getItem(COOKIE_STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as Partial<CookiePreferences>) : null;
    return parsed
      ? {
          essential: true,
          analytics: parsed.analytics ?? true,
          performance: parsed.performance ?? true,
          functional: parsed.functional ?? true,
          updatedAt: parsed.updatedAt ?? Date.now(),
        }
      : DEFAULT_COOKIE_PREFERENCES;
  } catch {
    return DEFAULT_COOKIE_PREFERENCES;
  }
}

export function saveStoredCookiePreferences(prefs: CookiePreferences): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(COOKIE_STORAGE_KEY, JSON.stringify(prefs));
  } catch {}
}

export interface CookiePreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved?: (prefs: CookiePreferences) => void;
}

interface CookieCategoryConfig {
  id: keyof Omit<CookiePreferences, "updatedAt">;
  title: string;
  badge: "Required" | "Optional";
  description: string;
  examples: string;
}

const CATEGORIES: CookieCategoryConfig[] = [
  { id: "essential", title: "Strictly Necessary", badge: "Required", description: "Core authentication, session integrity, rate-limiting, and state recovery.", examples: "Auth tokens, csrf headers" },
  { id: "performance", title: "Video Engine & Cache", badge: "Optional", description: "GPU acceleration buffers, canvas rendering cache, and export worker states.", examples: "Canvas frame cache, waveform peaks" },
  { id: "analytics", title: "Usage & Telemetry", badge: "Optional", description: "Aggregated, non-personal metrics used to diagnose pipeline latency.", examples: "Transcription latency telemetry" },
  { id: "functional", title: "Personalization", badge: "Optional", description: "Remembers default aspect ratios, theme customizations, and studio layouts.", examples: "Dock widths, caption preset styles" },
];

export function CookiePreferencesModal({
  isOpen,
  onClose,
  onSaved,
}: CookiePreferencesModalProps) {
  const [preferences, setPreferences] = useState<CookiePreferences>(getStoredCookiePreferences);
  const [showSavedFeedback, setShowSavedFeedback] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  useDialogFocus(modalRef, isOpen);

  useEffect(() => {
    if (isOpen) {
      setPreferences(getStoredCookiePreferences());
      setShowSavedFeedback(false);
    }
  }, [isOpen]);

  const handleToggle = (id: keyof Omit<CookiePreferences, "updatedAt">) => {
    if (id === "essential") return;
    setPreferences((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const persistAndClose = useCallback(
    (newPrefs: CookiePreferences) => {
      saveStoredCookiePreferences(newPrefs);
      setPreferences(newPrefs);
      setShowSavedFeedback(true);
      onSaved?.(newPrefs);
      setTimeout(() => onClose(), 600);
    },
    [onClose, onSaved],
  );

  const handleBatchUpdate = (enabled: boolean) => {
    persistAndClose({
      essential: true,
      analytics: enabled,
      performance: enabled,
      functional: enabled,
      updatedAt: Date.now(),
    });
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
      role="presentation"
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className="relative flex max-h-[90vh] w-full max-w-2xl flex-col rounded-3xl border border-white/10 bg-[#0c0d0d] font-sans text-white shadow-2xl overflow-hidden focus-visible:outline-none"
      >
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-xl bg-[#f6c453]/15 text-[#f6c453] border border-[#f6c453]/20">
              <Shield size={18} aria-hidden="true" />
            </span>
            <div>
              <h2 id={titleId} className="text-base font-bold text-cream">Privacy & Cookie Preferences</h2>
              <p className="text-xs text-[#788084]">Manage telemetry and local storage permissions</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close preferences dialog"
            className="grid size-8 place-items-center rounded-full text-[#888] hover:bg-white/10 hover:text-white transition cursor-pointer"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-3 custom-scrollbar text-xs">
          {CATEGORIES.map((cat) => {
            const isEnabled = preferences[cat.id];
            const isLocked = cat.badge === "Required";

            return (
              <div
                key={cat.id}
                className="rounded-2xl border border-white/8 bg-[#121315] p-4 transition-colors hover:border-white/15"
              >
                <div className="flex items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{cat.title}</span>
                    <span
                      className={cn(
                        "rounded px-2 py-0.5 text-[10px] font-bold uppercase",
                        isLocked
                          ? "bg-white/10 text-[#a8a8a8]"
                          : isEnabled
                          ? "bg-[#f6c453]/20 text-[#f6c453]"
                          : "bg-white/5 text-[#666]",
                      )}
                    >
                      {cat.badge}
                    </span>
                  </div>
                  <button
                    type="button"
                    disabled={isLocked}
                    onClick={() => handleToggle(cat.id)}
                    aria-label={`Toggle ${cat.title}`}
                    aria-pressed={isEnabled}
                    className={cn(
                      "relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out cursor-pointer disabled:cursor-not-allowed disabled:opacity-60",
                      isEnabled ? "bg-[#f6c453]" : "bg-white/20",
                    )}
                  >
                    <span
                      className={cn(
                        "pointer-events-none inline-block size-5 transform rounded-full bg-black shadow-lg ring-0 transition duration-200 ease-in-out",
                        isEnabled ? "translate-x-5" : "translate-x-0",
                      )}
                    />
                  </button>
                </div>
                <p className="text-xs text-[#9a9488] leading-relaxed mb-1.5">{cat.description}</p>
                <p className="text-[11px] text-[#6b6b76] font-mono">Examples: {cat.examples}</p>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-white/10 bg-[#0c0d0d] px-6 py-4">
          <div className="flex items-center gap-2 text-xs">
            {showSavedFeedback ? (
              <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 animate-in fade-in">
                <Check size={14} /> Preferences updated
              </span>
            ) : (
              <button
                type="button"
                onClick={() => handleBatchUpdate(false)}
                className="text-xs text-[#888] hover:text-white transition cursor-pointer underline underline-offset-4"
              >
                Reject Optional
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => persistAndClose({ ...preferences, updatedAt: Date.now() })}
              className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-xs font-bold text-white hover:bg-white/10 transition cursor-pointer"
            >
              Save Custom
            </button>
            <button
              type="button"
              onClick={() => handleBatchUpdate(true)}
              className="rounded-xl bg-[#f6c453] px-4 py-2 text-xs font-bold text-black hover:brightness-105 transition cursor-pointer"
            >
              Accept All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
