"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import type { BillingInterval } from "../data/pricing-data";

export function PricingCalculator({ billing, className = "" }: { billing: BillingInterval; className?: string }) {
  const [videos, setVideos] = useState(12);
  const [minutes, setMinutes] = useState(2);
  const total = videos * minutes;
  const allowance = total <= 3 ? "Free includes 3 minutes per month." : total <= 30 ? "Creator includes 30 minutes per month." : total <= 45 ? "Studio includes 45 minutes per month." : "This is more than Studio’s 45 included monthly minutes. Contact support to discuss your needs.";
  return (
    <section aria-labelledby="caption-estimate-title" className={`mt-10 rounded-2xl border border-[#e4e4e7] bg-[#fafafa] p-5 sm:mt-12 sm:p-7 ${className}`}>
      <div className="grid gap-7 lg:grid-cols-[1.3fr_0.7fr] lg:gap-10">
        <div>
          <h2 id="caption-estimate-title" className="text-[24px] font-bold leading-[1.2] tracking-[-0.04em] text-[#27272a]">How many minutes do you need?</h2>
          <p className="mt-3 text-[13px] leading-[1.8] text-[#71717a]">Use your typical video length to estimate your monthly captioning needs.</p>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <label className="block"><span className="mb-3 flex justify-between gap-3 text-[12px] text-[#71717a]">Videos per month<strong className="font-semibold text-[#c63838]">{videos}</strong></span><input type="range" min={1} max={60} value={videos} onChange={event => setVideos(Number(event.target.value))} className="w-full accent-[#c63838]" /></label>
            <label className="block"><span className="mb-3 flex justify-between gap-3 text-[12px] text-[#71717a]">Minutes per video<strong className="font-semibold text-[#c63838]">{minutes}</strong></span><input type="range" min={0.5} max={15} step={0.5} value={minutes} onChange={event => setMinutes(Number(event.target.value))} className="w-full accent-[#c63838]" /></label>
          </div>
        </div>
        <div className="rounded-xl border border-[#e4e4e7] bg-white p-5" aria-live="polite" aria-atomic="true">
          <p className="text-[11px] text-[#8b8b95]">Your estimated video minutes</p>
          <p className="mt-2 text-[38px] font-bold leading-none tracking-[-0.05em] text-[#27272a]">{total}<span className="ml-2 text-[12px] font-normal tracking-normal text-[#8b8b95]">min / month</span></p>
          <p className="mt-4 text-[12px] leading-[1.8] text-[#71717a]">{allowance}</p>
          <a href={total > 45 ? "/support" : "#planGrid"} className="mt-4 inline-flex min-h-8 items-center gap-2 text-[12px] font-semibold text-[#c63838] hover:underline">{total > 45 ? "Talk to us" : "Compare the plans"}<ArrowRight size={13} aria-hidden="true" /></a>
        </div>
      </div>
      <p className="mt-5 text-[10px] leading-[1.7] text-[#8b8b95]">Estimate based on video length. {billing === "Yearly" ? "Yearly plans still include a monthly minute allowance." : "Check each plan’s included minutes and export limits above."}</p>
    </section>
  );
}
