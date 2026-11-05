"use client";
import { useState } from "react";
import { SiteHeader } from "@/shared/components/site-header";
import { SiteFooter } from "@/shared/components/site-footer";
import {
  type BillingInterval,
  subscriptionTiers,
  getTierPrice,
  getTierNote,
} from "../data/pricing-data";
import { PricingOneTimePacks } from "./pricing-onetime-packs";
import { PricingComparisonTable } from "./pricing-comparison-table";
import { PricingFaqSection } from "./pricing-faq-section";
import { PricingTierCard } from "./pricing-tier-card";
import { PricingCalculator } from "./pricing-calculator";
import { ChevronDown } from "lucide-react";
export function PricingPage() {
  const [billing, setBilling] = useState<BillingInterval>("Monthly");
  return (
    <div className="min-h-screen bg-white font-sans antialiased text-[#18181b]">
      <SiteHeader compactMobile />
      <main id="main-content" className="mx-auto w-full max-w-[1176px] px-5 pb-16 pt-8 sm:px-7 md:pt-12 max-md:px-5">
        <div className="mb-8 text-center sm:mb-10 max-md:mb-6">
          <h1 className="text-[clamp(34px,4.5vw,54px)] max-md:text-[30px] font-bold leading-[1.1] tracking-[-0.055em] text-[#18181b]">A little more room to create.</h1>
          <p className="mx-auto mt-4 max-w-[560px] max-md:mt-3 max-md:text-[14px] text-[15px] leading-[1.8] text-[#71717a]">
            Start with your next video. Find the plan that fits your rhythm.
          </p>
        </div>
        <div
          className="mx-auto mb-8 flex w-fit max-w-full gap-1 rounded-xl border border-[#e4e4e7] bg-[#fafafa] p-1"
          role="tablist"
          aria-label="Billing interval"
        >
          {(["Monthly", "Yearly", "One-time"] as const).map((interval) => (
            <button
              key={interval}
              type="button"
              className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-3 text-[12px] font-semibold transition-colors sm:px-5 ${billing === interval ? "bg-[#c63838] text-white" : "text-[#71717a] hover:bg-[#ededed] hover:text-[#27272a]"}`}
              role="tab"
              aria-selected={billing === interval}
              onClick={() => setBilling(interval)}
            >
              {interval}
              {interval === "Yearly" && <span className={`hidden rounded px-1.5 py-0.5 text-[9px] sm:inline ${billing === interval ? "bg-white/15 text-white" : "bg-[#fbe8e6] text-[#c63838]"}`}>Save 2 months</span>}
            </button>
          ))}
        </div>
        {billing === "One-time" ? (
          <div id="planGrid" className="max-md:scroll-mt-24"><PricingOneTimePacks billingKey={billing} /></div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3 max-md:scroll-mt-24" id="planGrid">
            {subscriptionTiers.map((tier) => (
              <PricingTierCard
                key={tier.id}
                name={tier.name}
                badge={tier.badge}
                badgeClass={tier.badgeClass}
                isRecommended={tier.id === "creator"}
                price={getTierPrice(tier, billing)}
                billingKey={billing}
                note={getTierNote(tier, billing)}
                features={tier.features}
                ctaLabel={
                  tier.id === "free" ? "Start creating" : `Choose ${tier.name}`
                }
                ctaVariant={tier.ctaVariant}
              />
            ))}
          </div>
        )}
        {billing !== "One-time" && <PricingCalculator billing={billing} />}

        <p className="mb-7 mt-5 text-center text-[11px] leading-[1.8] text-[#8b8b95]">
          Billed by the length of your video. Monthly subscriptions can be
          cancelled anytime.
        </p>
        <details id="plan-comparison" className="max-md:scroll-mt-24 max-md:px-4 group overflow-hidden rounded-xl border border-[#e4e4e7] bg-white px-5">
          <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 text-[13px] font-semibold text-[#52525b] [&::-webkit-details-marker]:hidden">
            Compare plan features <ChevronDown size={16} aria-hidden="true" className="transition-transform group-open:rotate-180" />
          </summary>
          <PricingComparisonTable />
        </details>
        <PricingFaqSection />
      </main>
      <SiteFooter />
    </div>
  );
}
