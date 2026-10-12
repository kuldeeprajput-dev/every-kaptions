"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
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
        className="bg-surface border border-hairline rounded-[18px] p-[24px_20px] flex flex-col"
        aria-labelledby="pack-starter-title"
      >
        <div className="flex flex-wrap items-center gap-1.5 mb-3">
          <span className="inline-block text-[10px] font-bold tracking-[0.06em] uppercase rounded-lg px-2.5 py-1 text-[#4d6b43] border border-hairline">
            One-time
          </span>
          <span className="text-[11px] text-body mono">
            ₹19.9 / min
          </span>
        </div>
        <h2 id="pack-starter-title" className="text-[20px] font-bold text-cream mb-1">
          Starter
        </h2>
        <div className="plan-price-block mt-[10px] mb-[6px] min-h-[52px]">
          <SpinningPrice value="199" suffix=" one-time" triggerKey={billingKey} />
        </div>
        <p className="text-[13px] text-body leading-[1.5] mb-4 min-h-[40px]">
          10 min captioning · 60 days validity · pay once
        </p>
        <ul className="list-none p-0 m-0 mb-5 flex-1 text-[14px] text-cream space-y-0 divide-y divide-[rgba(244,236,220,0.08)]">
          <li className="py-2">10 min of captioning (one-time)</li>
          <li className="py-2">Unlimited watermark-free exports</li>
          <li className="py-2">Valid for 60 days from purchase</li>
          <li className="py-2">Priority support</li>
          <li className="py-2">No Creator styles or presets</li>
          <li className="py-2">No saved export library</li>
          <li className="py-2">No Content Pack</li>
        </ul>
        <Link
          href="/studio"
          aria-label="Get Starter one-time pack and open studio"
          className="inline-flex items-center justify-center gap-1.5 w-full min-h-[48px] px-5 bg-amber hover:brightness-105 text-white! text-[14px] font-semibold rounded-lg mt-auto no-underline cursor-pointer transition-all"
        >
          <span>Buy pack</span>
          <ArrowUpRight size={15} />
        </Link>
      </article>

      {/* Bulk Pack Card */}
      <article
        className="bg-surface border border-amber ring-1 ring-amber rounded-[18px] p-[24px_20px] flex flex-col"
        aria-labelledby="pack-bulk-title"
      >
        <div className="flex flex-wrap items-center gap-1.5 mb-3">
          <span className="inline-block text-[10px] font-bold tracking-[0.06em] uppercase rounded-lg px-2.5 py-1 text-[#4d6b43] border border-hairline">
            One-time
          </span>
          <span className="inline-block text-[10px] font-bold tracking-[0.06em] uppercase rounded-lg px-2.5 py-1 text-cream bg-amber border border-amber">
            Best value
          </span>
          <span className="text-[11px] text-body mono ml-auto">
            ₹16.0 / min
          </span>
        </div>
        <h2 id="pack-bulk-title" className="text-[20px] font-bold text-cream mb-1">
          Bulk
        </h2>
        <div className="plan-price-block mt-[10px] mb-[6px] min-h-[52px]">
          <SpinningPrice value="399" suffix=" one-time" triggerKey={billingKey} />
        </div>
        <p className="text-[13px] text-body leading-[1.5] mb-4 min-h-[40px]">
          25 min captioning · 90 days validity · pay once
        </p>
        <ul className="list-none p-0 m-0 mb-5 flex-1 text-[14px] text-cream space-y-0 divide-y divide-[rgba(244,236,220,0.08)]">
          <li className="py-2">25 min of captioning (one-time)</li>
          <li className="py-2">Unlimited watermark-free exports</li>
          <li className="py-2">Valid for 90 days from purchase</li>
          <li className="py-2">Priority support</li>
          <li className="py-2">No Creator styles or presets</li>
          <li className="py-2">No saved export library</li>
          <li className="py-2">No Content Pack</li>
        </ul>
        <Link
          href="/studio"
          aria-label="Get Bulk one-time pack and open studio"
          className="inline-flex items-center justify-center gap-1.5 w-full min-h-[48px] px-5 bg-amber hover:brightness-105 text-white! text-[14px] font-semibold rounded-lg mt-auto no-underline cursor-pointer transition-all"
        >
          <span>Buy pack</span>
          <ArrowUpRight size={15} />
        </Link>
      </article>
    </div>
  );
}
