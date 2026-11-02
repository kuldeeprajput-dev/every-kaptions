"use client";

import { useId, useMemo, useRef } from "react";
import { AlertTriangle, BarChart3, CheckCircle2, ChevronRight, Gauge, Timer, TrendingUp, X, Zap } from "lucide-react";
import { cn } from "@/shared/lib/cn";
import { useDialogFocus } from "@/shared/hooks/use-dialog-focus";
import type { CaptionSegment } from "../types/captions";

export interface EditorRetentionAnalyzerProps {
  isOpen: boolean;
  onClose: () => void;
  segments: CaptionSegment[];
  videoDurationSeconds: number;
  onSeekToTimestamp?: (seconds: number) => void;
}

interface RetentionReport {
  score: number;
  grade: "S" | "A" | "B" | "C";
  wpm: number;
  speechDuration: number;
  pauseDuration: number;
  speechRatioPercent: number;
  deadPauses: { start: number; end: number; duration: number }[];
  pacingTips: string[];
}

export function EditorRetentionAnalyzer({
  isOpen,
  onClose,
  segments,
  videoDurationSeconds,
  onSeekToTimestamp,
}: EditorRetentionAnalyzerProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  useDialogFocus(dialogRef, isOpen);

  const report = useMemo<RetentionReport>(() => {
    if (!segments || segments.length === 0) {
      return {
        score: 50,
        grade: "C",
        wpm: 0,
        speechDuration: 0,
        pauseDuration: videoDurationSeconds || 0,
        speechRatioPercent: 0,
        deadPauses: [],
        pacingTips: ["Add speech or captions to generate retention insights."],
      };
    }

    let totalWords = 0;
    let speechDuration = 0;
    const deadPauses: { start: number; end: number; duration: number }[] = [];

    const sorted = [...segments].sort((a, b) => a.start - b.start);

    for (let i = 0; i < sorted.length; i++) {
      const seg = sorted[i];
      const segWords = seg.words && seg.words.length > 0 ? seg.words.length : seg.text.trim().split(/\s+/).filter(Boolean).length;
      totalWords += segWords;
      speechDuration += Math.max(0, seg.end - seg.start);

      if (i > 0) {
        const gap = seg.start - sorted[i - 1].end;
        if (gap > 1.2) {
          deadPauses.push({ start: sorted[i - 1].end, end: seg.start, duration: gap });
        }
      }
    }

    const duration = Math.max(videoDurationSeconds, sorted[sorted.length - 1]?.end || 1);
    const pauseDuration = Math.max(0, duration - speechDuration);
    const wpm = speechDuration > 0 ? Math.round((totalWords / speechDuration) * 60) : 0;
    const speechRatioPercent = Math.min(100, Math.round((speechDuration / duration) * 100));

    let score = 70;
    if (wpm >= 140 && wpm <= 180) score += 20;
    else if (wpm >= 120 && wpm < 140) score += 10;
    else if (wpm > 210 || wpm < 100) score -= 15;

    if (deadPauses.length === 0) score += 10;
    else score -= Math.min(25, deadPauses.length * 6);

    const clampedScore = Math.max(15, Math.min(100, score));
    const grade: RetentionReport["grade"] = clampedScore >= 90 ? "S" : clampedScore >= 80 ? "A" : clampedScore >= 65 ? "B" : "C";

    const pacingTips: string[] = [];
    if (deadPauses.length > 0) {
      pacingTips.push(`Detected ${deadPauses.length} dead pauses over 1.2s. Trimming silences keeps swipe-away risk low.`);
    } else {
      pacingTips.push("No dragging dead silences detected! Flow is tight and punchy.");
    }

    if (wpm >= 140 && wpm <= 180) {
      pacingTips.push(`Speech rate is ${wpm} WPM, optimal for Instagram Reels and TikTok viewer retention.`);
    } else if (wpm > 180) {
      pacingTips.push(`Fast delivery at ${wpm} WPM. Ensure caption styling uses 1-2 words per line for easy reading.`);
    } else {
      pacingTips.push(`Moderate pace at ${wpm} WPM. Consider adding dynamic word animations to sustain interest.`);
    }

    return { score: clampedScore, grade, wpm, speechDuration, pauseDuration, speechRatioPercent, deadPauses, pacingTips };
  }, [segments, videoDurationSeconds]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        className="w-full max-w-xl rounded-2xl border border-hairline bg-surface-raised shadow-2xl overflow-hidden flex flex-col max-h-[90vh] outline-none"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-hairline bg-surface/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-accent/10 text-accent"><BarChart3 size={18} /></div>
            <div>
              <h2 id={titleId} className="text-sm font-semibold text-cream">Audience Retention & Pacing Score</h2>
              <p className="text-xs text-dim">Algorithmic pacing audit based on top short-form reel patterns</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg text-dim hover:text-cream hover:bg-surface transition-colors cursor-pointer" aria-label="Close retention modal">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl border border-hairline bg-surface/40">
            <div>
              <span className="text-[11px] font-semibold text-dim uppercase tracking-wider">Estimated Retention Score</span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-3xl font-extrabold text-cream">{report.score}</span>
                <span className="text-xs text-dim">/ 100</span>
                <span className={cn("ml-2 px-2 py-0.5 rounded text-xs font-bold",
                  report.grade === "S" ? "bg-amber-400/20 text-amber-300 border border-amber-400/30" :
                  report.grade === "A" ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" :
                  report.grade === "B" ? "bg-blue-500/20 text-blue-300 border border-blue-500/30" :
                  "bg-rose-500/20 text-rose-300 border border-rose-500/30")}
                >
                  Grade {report.grade}
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs text-accent font-medium flex items-center justify-end gap-1">
                <TrendingUp size={13} /> {report.score >= 80 ? "High Completion Likelihood" : "Room for Pacing Polish"}
              </span>
              <span className="text-[11px] text-dim">{segments.length} caption bursts analyzed</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            <div className="p-3 rounded-xl border border-hairline bg-surface/30">
              <div className="flex items-center gap-1.5 text-xs text-dim mb-1"><Gauge size={13} /> Pace Rate</div>
              <div className="text-sm font-bold text-cream font-mono">{report.wpm} <span className="text-[10px] text-dim font-normal">WPM</span></div>
            </div>
            <div className="p-3 rounded-xl border border-hairline bg-surface/30">
              <div className="flex items-center gap-1.5 text-xs text-dim mb-1"><Timer size={13} /> Speech Density</div>
              <div className="text-sm font-bold text-cream font-mono">{report.speechRatioPercent}% <span className="text-[10px] text-dim font-normal">active</span></div>
            </div>
            <div className="p-3 rounded-xl border border-hairline bg-surface/30">
              <div className="flex items-center gap-1.5 text-xs text-dim mb-1"><Zap size={13} /> Dead Pauses</div>
              <div className={cn("text-sm font-bold font-mono", report.deadPauses.length > 0 ? "text-amber-400" : "text-emerald-400")}>
                {report.deadPauses.length} <span className="text-[10px] text-dim font-normal">&gt;1.2s</span>
              </div>
            </div>
          </div>

          {report.deadPauses.length > 0 && (
            <div className="p-3.5 rounded-xl border border-amber-500/30 bg-amber-500/5 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-300">
                <AlertTriangle size={13} /> Potential Drop-Off Pauses
              </div>
              <div className="space-y-1">
                {report.deadPauses.map((pause, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs text-dim">
                    <span>Silence between {pause.start.toFixed(1)}s &ndash; {pause.end.toFixed(1)}s ({pause.duration.toFixed(1)}s)</span>
                    <button
                      type="button"
                      onClick={() => onSeekToTimestamp?.(pause.start)}
                      className="text-accent hover:underline flex items-center gap-0.5 cursor-pointer text-[11px]"
                    >
                      Jump to gap <ChevronRight size={11} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="p-3.5 rounded-xl border border-hairline bg-surface/40 space-y-2">
            <span className="text-xs font-semibold text-dim uppercase tracking-wider">Algorithm Insights & Tips</span>
            <div className="space-y-1.5">
              {report.pacingTips.map((tip, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-cream/90">
                  <CheckCircle2 size={13} className="text-accent mt-0.5 shrink-0" />
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t border-hairline bg-surface/50">
          <span className="text-[11px] text-dim">Exporting with high score maximizes watch time</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-accent hover:bg-accent-hover text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
