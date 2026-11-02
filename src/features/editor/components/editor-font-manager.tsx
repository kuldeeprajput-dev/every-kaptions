"use client";

import { useId, useRef, useState } from "react";
import { Check, Type, X } from "lucide-react";
import { cn } from "@/shared/lib/cn";
import { useDialogFocus } from "@/shared/hooks/use-dialog-focus";

export interface CustomFontConfig {
  fontFamily: string;
  fontWeight: number;
  textTransform: "none" | "uppercase" | "capitalize" | "lowercase";
  letterSpacingEm: number;
  lineHeightRatio: number;
  strokeWidthPx: number;
  shadowBlurPx: number;
}

export interface EditorFontManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFont: (config: CustomFontConfig) => void;
  initialConfig?: Partial<CustomFontConfig>;
}

interface FontOption {
  family: string;
  category: "Sans-Serif" | "Display" | "Serif";
  weights: number[];
  sampleText: string;
}

const AVAILABLE_FONTS: FontOption[] = [
  { family: "Inter", category: "Sans-Serif", weights: [400, 600, 700, 900], sampleText: "Modern Clean Dialogue" },
  { family: "Montserrat", category: "Sans-Serif", weights: [500, 700, 800, 900], sampleText: "Bold Punchy Reels" },
  { family: "Oswald", category: "Display", weights: [500, 600, 700], sampleText: "CONDENSED VIRAL HOOKS" },
  { family: "Anton", category: "Display", weights: [900], sampleText: "HIGH RETENTION IMPACT" },
  { family: "Playfair Display", category: "Serif", weights: [600, 700, 900], sampleText: "Editorial Luxury Aesthetic" },
  { family: "Bebas Neue", category: "Display", weights: [700], sampleText: "TITLES & HIGH-ENERGY CLIPS" },
];

export function EditorFontManager({
  isOpen,
  onClose,
  onApplyFont,
  initialConfig,
}: EditorFontManagerProps) {
  const dialogId = useId();
  const titleId = `${dialogId}-title`;
  const dialogRef = useRef<HTMLDivElement>(null);
  useDialogFocus(dialogRef, isOpen);

  const [family, setFamily] = useState<string>(initialConfig?.fontFamily ?? "Montserrat");
  const [weight, setWeight] = useState<number>(initialConfig?.fontWeight ?? 800);
  const [transform, setTransform] = useState<"none" | "uppercase" | "capitalize" | "lowercase">(
    initialConfig?.textTransform ?? "uppercase",
  );
  const [letterSpacing, setLetterSpacing] = useState<number>(initialConfig?.letterSpacingEm ?? 0.04);
  const [lineHeight, setLineHeight] = useState<number>(initialConfig?.lineHeightRatio ?? 1.25);
  const [strokeWidth, setStrokeWidth] = useState<number>(initialConfig?.strokeWidthPx ?? 2);
  const [shadowBlur, setShadowBlur] = useState<number>(initialConfig?.shadowBlurPx ?? 6);

  if (!isOpen) return null;

  const currentFont = AVAILABLE_FONTS.find((f) => f.family === family) ?? AVAILABLE_FONTS[0];

  const handleSelectFont = (f: FontOption) => {
    setFamily(f.family);
    if (!f.weights.includes(weight)) {
      setWeight(f.weights[f.weights.length - 1]);
    }
  };

  const handleSave = () => {
    onApplyFont({
      fontFamily: family,
      fontWeight: weight,
      textTransform: transform,
      letterSpacingEm: letterSpacing,
      lineHeightRatio: lineHeight,
      strokeWidthPx: strokeWidth,
      shadowBlurPx: shadowBlur,
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
        className="w-full max-w-xl bg-surface border border-hairline rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-hairline bg-surface-raised">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-accent-soft flex items-center justify-center text-accent">
              <Type size={18} />
            </div>
            <div>
              <h2 id={titleId} className="text-sm font-semibold text-cream">Typography & Custom Fonts</h2>
              <p className="text-xs text-dim">Customize font families, weights, spacing, and outline strokes</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg text-dim hover:text-cream hover:bg-surface transition-colors cursor-pointer" aria-label="Close font modal">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          <div className="p-4 rounded-xl border border-hairline bg-black/40 flex flex-col items-center justify-center min-h-[90px] text-center">
            <span
              style={{
                fontFamily: family,
                fontWeight: weight,
                textTransform: transform,
                letterSpacing: `${letterSpacing}em`,
                lineHeight: lineHeight,
                textShadow: `0 2px ${shadowBlur}px rgba(0,0,0,0.8)`,
                WebkitTextStroke: strokeWidth > 0 ? `${strokeWidth}px black` : "none",
              }}
              className="text-lg text-cream select-none leading-tight"
            >
              Every Caption Tells A Story
            </span>
            <span className="text-[10px] text-dim/70 mt-2 font-mono">{family} • {weight} • {transform}</span>
          </div>

          <section>
            <label className="text-xs font-semibold text-dim uppercase tracking-wider block mb-2">Font Families</label>
            <div className="grid grid-cols-2 gap-2">
              {AVAILABLE_FONTS.map((f) => {
                const isSelected = family === f.family;
                return (
                  <button
                    key={f.family}
                    type="button"
                    onClick={() => handleSelectFont(f)}
                    className={cn(
                      "p-3 rounded-xl border text-left text-xs transition-all cursor-pointer",
                      isSelected
                        ? "border-accent bg-accent-soft text-cream font-medium shadow-sm"
                        : "border-hairline bg-surface-raised/40 hover:bg-surface-raised text-body hover:text-cream",
                    )}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-xs">{f.family}</span>
                      <span className="text-[10px] text-accent font-mono">{f.category}</span>
                    </div>
                    <p className="text-[11px] text-dim truncate">{f.sampleText}</p>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="space-y-3.5 pt-2 border-t border-hairline text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-dim font-medium block mb-1">Font Weight</label>
                <div className="flex items-center gap-1">
                  {currentFont.weights.map((w) => (
                    <button
                      key={w}
                      type="button"
                      onClick={() => setWeight(w)}
                      className={cn(
                        "flex-1 py-1 rounded text-center text-xs font-mono border transition-colors cursor-pointer",
                        weight === w ? "border-accent bg-accent-soft text-accent font-bold" : "border-hairline text-dim hover:text-cream",
                      )}
                    >
                      {w}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-dim font-medium block mb-1">Text Casing</label>
                <div className="flex items-center gap-1">
                  {(["none", "uppercase", "capitalize"] as const).map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setTransform(c)}
                      className={cn(
                        "flex-1 py-1 rounded text-center text-xs capitalize border transition-colors cursor-pointer truncate",
                        transform === c ? "border-accent bg-accent-soft text-accent font-bold" : "border-hairline text-dim hover:text-cream",
                      )}
                    >
                      {c === "none" ? "Normal" : c}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-cream">Letter Spacing Tracking</span>
                <span className="text-dim font-mono">{letterSpacing.toFixed(2)}em</span>
              </div>
              <input type="range" min="-0.04" max="0.16" step="0.01" value={letterSpacing} onChange={(e) => setLetterSpacing(parseFloat(e.target.value))} className="w-full accent-accent h-1.5 bg-surface-raised rounded-lg cursor-pointer" />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-cream">Outline Stroke Border</span>
                <span className="text-dim font-mono">{strokeWidth}px</span>
              </div>
              <input type="range" min="0" max="6" step="0.5" value={strokeWidth} onChange={(e) => setStrokeWidth(parseFloat(e.target.value))} className="w-full accent-accent h-1.5 bg-surface-raised rounded-lg cursor-pointer" />
            </div>
          </section>
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t border-hairline bg-surface-raised">
          <p className="text-xs text-dim">Active typography applies to all timeline subtitle cues</p>
          <div className="flex items-center gap-2.5">
            <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-semibold text-dim hover:text-cream transition-colors cursor-pointer">
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-accent text-white hover:bg-accent/90 shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Check size={14} /> Apply Font Style
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
