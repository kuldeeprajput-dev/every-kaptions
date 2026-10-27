"use client";

import { useMemo, useState } from "react";
import { Calculator, Clock, Sparkles, TrendingUp, Zap } from "lucide-react";
import type { BillingInterval } from "../data/pricing-data";

export interface PricingCalculatorProps {
  billing: BillingInterval;
  onSelectInterval: (interval: BillingInterval) => void;
  className?: string;
}

export function PricingCalculator({
  billing,
  onSelectInterval,
  className = "",
}: PricingCalculatorProps) {
  const [videosPerMonth, setVideosPerMonth] = useState(12);
  const [avgDurationMinutes, setAvgDurationMinutes] = useState(2);

  const stats = useMemo(() => {
    const totalMinutes = videosPerMonth * avgDurationMinutes;
    // Manual subtitle transcription and sync takes ~15 minutes per 1 minute of video
    const manualHoursSpent = Math.round((totalMinutes * 15) / 60);
    // EveryKaptions takes ~30 seconds of AI processing per video minute
    const everyKaptionsHours = Math.round(((totalMinutes * 0.5) / 60) * 10) / 10;
    const hoursSaved = Math.max(1, Math.round(manualHoursSpent - everyKaptionsHours));
    // Freelance transcription standard rate: ~$1.25 / minute
    const freelanceCost = Math.round(totalMinutes * 1.25);

    let recommendedPlan = "Free";
    let planReason = "Ideal for casual testing and short clips";

    if (totalMinutes > 60) {
      recommendedPlan = "Studio";
      planReason = "High-volume creators publishing multiple long-form reels weekly";
    } else if (totalMinutes > 15) {
      recommendedPlan = "Creator";
      planReason = "Best value for regular creators publishing 2–4 videos weekly";
    }

    return {
      totalMinutes,
      manualHoursSpent,
      hoursSaved,
      freelanceCost,
      recommendedPlan,
      planReason,
    };
  }, [videosPerMonth, avgDurationMinutes]);

  return (
    <section
      aria-label="Creator time savings and plan calculator"
      className={`mx-auto my-12 w-full max-w-4xl rounded-3xl border border-white/10 bg-[#0f1012] p-6 font-sans text-white shadow-2xl sm:p-8 ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/8 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#f6c453]/25 bg-[#f6c453]/10 px-3 py-1 text-xs font-bold text-[#f6c453]">
            <Calculator size={13} aria-hidden="true" />
            <span>Creator Calculator</span>
          </div>
          <h2 className="mt-2 text-xl sm:text-2xl font-bold text-cream">
            Estimate your monthly time saved
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-[#7d868b]">
            See how much editing time and manual subtitle effort you save with EveryKaptions.
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2 rounded-2xl border border-white/10 bg-black/40 p-1.5 self-start sm:self-auto">
          {(["Monthly", "Yearly"] as const).map((interval) => (
            <button
              key={interval}
              type="button"
              onClick={() => onSelectInterval(interval)}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                billing === interval
                  ? "bg-[#f6c453] text-black shadow-sm"
                  : "text-[#888] hover:text-white"
              }`}
            >
              {interval}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Sliders Input Column */}
        <div className="space-y-6">
          {/* Slider 1: Videos per Month */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#788084] mb-2">
              <span>Videos per month</span>
              <span className="font-mono text-sm text-[#f6c453] font-bold">
                {videosPerMonth} {videosPerMonth === 1 ? "video" : "videos"}
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={60}
              step={1}
              value={videosPerMonth}
              onChange={(e) => setVideosPerMonth(Number(e.target.value))}
              aria-label="Videos published per month"
              className="w-full accent-[#f6c453] cursor-pointer"
            />
            <div className="mt-1 flex justify-between text-[10px] text-[#555] font-mono">
              <span>1 video</span>
              <span>30 videos</span>
              <span>60 videos</span>
            </div>
          </div>

          {/* Slider 2: Average Video Duration */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#788084] mb-2">
              <span>Average video length</span>
              <span className="font-mono text-sm text-[#f6c453] font-bold">
                {avgDurationMinutes} {avgDurationMinutes === 1 ? "minute" : "minutes"}
              </span>
            </div>
            <input
              type="range"
              min={0.5}
              max={15}
              step={0.5}
              value={avgDurationMinutes}
              onChange={(e) => setAvgDurationMinutes(Number(e.target.value))}
              aria-label="Average video duration in minutes"
              className="w-full accent-[#f6c453] cursor-pointer"
            />
            <div className="mt-1 flex justify-between text-[10px] text-[#555] font-mono">
              <span>30 sec</span>
              <span>5 min</span>
              <span>15 min</span>
            </div>
          </div>

          {/* Workload Metric Chips */}
          <div className="rounded-2xl border border-white/5 bg-[#141518] p-4 text-xs text-[#888]">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <span>Total video footage per month</span>
              <span className="font-mono font-bold text-cream">{stats.totalMinutes} minutes</span>
            </div>
            <div className="flex items-center justify-between pt-2">
              <span>Est. freelance transcription cost</span>
              <span className="font-mono font-bold text-[#f6c453]">${stats.freelanceCost} / mo</span>
            </div>
            <div className="mt-2 pt-2 border-t border-white/5 text-[10px] text-[#666]">
              Based on standard 15 min manual effort per 1 min video vs 30s AI processing
            </div>
          </div>
        </div>

        {/* Results Outcome Column */}
        <div className="flex flex-col justify-between rounded-2xl border border-[#f6c453]/25 bg-gradient-to-b from-[#181712] to-[#101011] p-6 shadow-inner">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-2xl bg-[#f6c453]/15 text-[#f6c453] border border-[#f6c453]/30">
                <Clock size={20} aria-hidden="true" />
              </span>
              <div>
                <p className="text-xs uppercase tracking-wider text-[#7d868b] font-bold">Estimated Time Saved</p>
                <p className="text-2xl font-black text-cream">
                  ~{stats.hoursSaved} hours <span className="text-xs font-normal text-[#888]">every month</span>
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-black/40 p-3.5 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#f6c453]">
                <Sparkles size={13} aria-hidden="true" />
                <span>Recommended: {stats.recommendedPlan} Plan</span>
              </div>
              <p className="text-xs text-[#888] leading-relaxed">
                {stats.planReason}
              </p>
            </div>

            {billing === "Yearly" ? (
              <div className="flex items-center gap-1.5 rounded-lg border border-[#22c55e]/30 bg-[#22c55e]/10 px-3 py-1.5 text-[11px] font-bold text-[#22c55e]">
                <Sparkles size={12} aria-hidden="true" />
                <span>Yearly billing includes 2 months free</span>
              </div>
            ) : (
              <div className="flex items-center justify-between text-[11px] text-[#788084] pt-1">
                <span>Switch to Yearly billing to save 2 months</span>
                <button
                  type="button"
                  onClick={() => onSelectInterval("Yearly")}
                  className="font-bold text-[#f6c453] hover:underline cursor-pointer"
                >
                  Save now
                </button>
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-white/10">
            <a
              href="#planGrid"
              className="w-full flex h-11 items-center justify-center gap-2 rounded-xl bg-[#f6c453] text-xs font-bold text-black hover:brightness-105 transition cursor-pointer shadow-[0_0_20px_rgba(246,196,83,0.3)]"
            >
              <Zap size={14} aria-hidden="true" /> View {stats.recommendedPlan} Features
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
