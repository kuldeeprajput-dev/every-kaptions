"use client";

import Link from "next/link";
import { SpinningPrice } from "./spinning-price";

interface PricingOneTimePacksProps {
  billingKey?: string;
}

export function PricingOneTimePacks({
  billingKey = "One-time",
}: PricingOneTimePacksProps) {
  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-[720px] mx-auto"
      id="oneTimePlanGrid"
    >
      {/* Starter Pack Card */}
      <article
        className="bg-[#15130f] border border-[rgba(244,236,220,0.14)] rounded-[18px] p-[24px_20px] flex flex-col"
        aria-labelledby="pack-starter-title"
      >
        <div className="flex flex-wrap items-center gap-1.5 mb-3">
          <span className="inline-block text-[10px] font-bold tracking-[0.06em] uppercase rounded-full px-2.5 py-1 text-[#86efac] border border-[rgba(134,239,172,0.35)]">
            One-time
          </span>
          <span className="text-[11px] text-[#8a8478] mono">
            ₹19.9 / min
          </span>
        </div>
        <h2 id="pack-starter-title" className="text-[20px] font-bold text-[#f4ecdc] mb-1">
          Starter
        </h2>
        <div className="plan-price-block mt-[10px] mb-[6px] min-h-[52px]">
          <SpinningPrice value="199" suffix=" one-time" triggerKey={billingKey} />
        </div>
        <p className="text-[13px] text-[#8a8478] leading-[1.5] mb-4 min-h-[40px]">
          10 min captioning · 60 days validity · pay once
        </p>
        <ul className="list-none p-0 m-0 mb-5 flex-1 text-[14px] text-[#f4ecdc] space-y-0 divide-y divide-[rgba(244,236,220,0.08)]">
          <li className="py-2">10 min of captioning (one-time)</li>
          <li className="py-2">Unlimited watermark-free exports</li>
          <li className="py-2">Valid for 60 days from purchase</li>
          <li className="py-2">Priority support</li>
          <li className="py-2">No Creator styles or presets</li>
          <li className="py-2">No saved export library</li>
          <li className="py-2">No Content Pack</li>
        </ul>
        <Link
          href="/editor"
          className="inline-flex items-center justify-center w-full min-h-[48px] px-5 bg-[#f4ecdc] hover:brightness-105 text-[#0c0b0a]! text-[14px] font-semibold rounded-full mt-auto no-underline cursor-pointer transition-all"
        >
          Buy pack
        </Link>
      </article>

      {/* Bulk Pack Card */}
      <article
        className="bg-[#15130f] border border-[rgba(246,196,83,0.45)] ring-1 ring-[rgba(246,196,83,0.12)] rounded-[18px] p-[24px_20px] flex flex-col"
        aria-labelledby="pack-bulk-title"
      >
        <div className="flex flex-wrap items-center gap-1.5 mb-3">
          <span className="inline-block text-[10px] font-bold tracking-[0.06em] uppercase rounded-full px-2.5 py-1 text-[#86efac] border border-[rgba(134,239,172,0.35)]">
            One-time
          </span>
          <span className="inline-block text-[10px] font-bold tracking-[0.06em] uppercase rounded-full px-2.5 py-1 text-[#f4ecdc] bg-[rgba(246,196,83,0.15)] border border-[rgba(246,196,83,0.3)]">
            Best value
          </span>
          <span className="text-[11px] text-[#8a8478] mono ml-auto">
            ₹16.0 / min
          </span>
        </div>
        <h2 id="pack-bulk-title" className="text-[20px] font-bold text-[#f4ecdc] mb-1">
          Bulk
        </h2>
        <div className="plan-price-block mt-[10px] mb-[6px] min-h-[52px]">
          <SpinningPrice value="399" suffix=" one-time" triggerKey={billingKey} />
        </div>
        <p className="text-[13px] text-[#8a8478] leading-[1.5] mb-4 min-h-[40px]">
          25 min captioning · 90 days validity · pay once
        </p>
        <ul className="list-none p-0 m-0 mb-5 flex-1 text-[14px] text-[#f4ecdc] space-y-0 divide-y divide-[rgba(244,236,220,0.08)]">
          <li className="py-2">25 min of captioning (one-time)</li>
          <li className="py-2">Unlimited watermark-free exports</li>
          <li className="py-2">Valid for 90 days from purchase</li>
          <li className="py-2">Priority support</li>
          <li className="py-2">No Creator styles or presets</li>
          <li className="py-2">No saved export library</li>
          <li className="py-2">No Content Pack</li>
        </ul>
        <Link
          href="/editor"
          className="inline-flex items-center justify-center w-full min-h-[48px] px-5 bg-[#f4ecdc] hover:brightness-105 text-[#0c0b0a]! text-[14px] font-semibold rounded-full mt-auto no-underline cursor-pointer transition-all"
        >
          Buy pack
        </Link>
      </article>
    </div>
  );
}
