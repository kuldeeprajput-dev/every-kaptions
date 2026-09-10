"use client";

import Link from "next/link";
import { useState } from "react";
import { cn } from "@/shared/lib/cn";
import { SiteFooter } from "@/shared/components/site-footer";
import { LogoWordmark } from "@/shared/components/logo-wordmark";
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

export function PricingPage() {
  const [billing, setBilling] = useState<BillingInterval>("Yearly");

  return (
    <>
      <header className="sticky top-0 z-[100] bg-[#0c0b0a]/92 border-b border-[rgba(244,236,220,0.08)] backdrop-blur-md">
        <div className="max-w-[960px] mx-auto px-3.5 sm:px-6 py-3 md:py-4 flex items-center justify-between gap-2 sm:gap-4">
          <Link className="inline-flex items-center gap-2 text-inherit shrink-0 no-underline" href="/" aria-label="EveryKaptions homepage">
            <LogoWordmark className="text-[18px] xs:text-[20px] sm:text-[22px] md:text-[26px] md:h-6 md:w-[calc(24px*268/28)] md:min-w-[calc(24px*268/28)] shrink-0 object-fill object-left" />
          </Link>
          <nav className="flex items-center gap-0.5 sm:gap-2 shrink-0 ml-auto">
            <Link href="/" className="!text-[#8a8478] hover:!text-[#f4ecdc] text-xs sm:text-[13px] font-semibold inline-flex items-center min-h-[36px] sm:min-h-[44px] px-2 sm:px-3 py-1.5 sm:py-2.5 no-underline transition-colors">
              Home
            </Link>
            <Link href="/roadmap" className="!text-[#8a8478] hover:!text-[#f4ecdc] text-xs sm:text-[13px] font-semibold inline-flex items-center min-h-[36px] sm:min-h-[44px] px-2 sm:px-3 py-1.5 sm:py-2.5 no-underline transition-colors">
              Roadmap
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-[960px] mx-auto px-4 sm:px-6 pt-8 pb-20 w-full">
        <div className="mb-6">
          <h1 className="text-[clamp(28px,5vw,36px)] text-[#f4ecdc] mb-2.5 tracking-[-0.02em] font-bold">
            Choose your plan
          </h1>
          <p className="text-[#8a8478] text-[15px] max-w-[640px]">
            Start free, then upgrade when you need more. Billed by the minute of
            video. Cancel anytime.
          </p>
        </div>

        <div className="text-center mb-5 md:mb-6">
          <div
            className="w-full max-w-[390px] md:max-w-none md:w-auto inline-flex items-center justify-between md:justify-start gap-1 p-1 bg-[rgba(244,236,220,0.04)] border border-[rgba(244,236,220,0.1)] rounded-full"
            role="tablist"
            aria-label="Billing interval"
          >
            <button
              type="button"
              className={cn(
                "flex-1 md:flex-initial min-h-[38px] md:min-h-0 px-2 xs:px-3 md:px-[18px] py-2 text-[11px] xs:text-xs md:text-[13px] font-semibold rounded-full border-0 cursor-pointer font-inherit transition-colors duration-200 whitespace-nowrap inline-flex items-center justify-center",
                billing === "Monthly"
                  ? "bg-[#f4ecdc] text-[#0c0b0a]"
                  : "bg-transparent text-[#8a8478] hover:text-[#f4ecdc]"
              )}
              onClick={() => setBilling("Monthly")}
              role="tab"
              aria-selected={billing === "Monthly"}
            >
              Monthly
            </button>
            <button
              type="button"
              className={cn(
                "flex-1 md:flex-initial min-h-[38px] md:min-h-0 px-2 xs:px-3 md:px-[18px] py-2 text-[11px] xs:text-xs md:text-[13px] font-semibold rounded-full border-0 cursor-pointer font-inherit transition-colors duration-200 whitespace-nowrap inline-flex items-center justify-center",
                billing === "One-time"
                  ? "bg-[#f4ecdc] text-[#0c0b0a]"
                  : "bg-transparent text-[#8a8478] hover:text-[#f4ecdc]"
              )}
              onClick={() => setBilling("One-time")}
              role="tab"
              aria-selected={billing === "One-time"}
            >
              One-time
            </button>
            <button
              type="button"
              className={cn(
                "flex-[1.2] md:flex-initial min-h-[38px] md:min-h-0 px-2 xs:px-2.5 md:px-[18px] py-2 text-[11px] xs:text-xs md:text-[13px] font-semibold rounded-full border-0 cursor-pointer font-inherit transition-colors duration-200 whitespace-nowrap inline-flex items-center justify-center",
                billing === "Yearly"
                  ? "bg-[#f4ecdc] text-[#0c0b0a]"
                  : "bg-transparent text-[#8a8478] hover:text-[#f4ecdc]"
              )}
              onClick={() => setBilling("Yearly")}
              role="tab"
              aria-selected={billing === "Yearly"}
            >
              <span>Yearly</span>
              <span
                className={cn(
                  "inline-block ml-1 md:ml-1.5 text-[9px] xs:text-[10px] font-bold px-1.5 py-0.5 rounded-full tracking-[0.02em] shrink-0",
                  billing === "Yearly"
                    ? "bg-[rgba(40,80,40,0.18)] text-[#2c5e2c]"
                    : "bg-[rgba(127,179,127,0.18)] text-[#7fb37f]"
                )}
              >
                2 months free
              </span>
            </button>
          </div>
        </div>

        {billing === "One-time" ? (
          <PricingOneTimePacks billingKey={billing} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4" id="planGrid">
            {subscriptionTiers.map((tier) => (
              <PricingTierCard
                key={tier.id}
                name={tier.name}
                badge={tier.badge}
                badgeClass={tier.badgeClass}
                isRecommended={tier.recommendedInMonthly && billing === "Monthly"}
                price={getTierPrice(tier, billing)}
                billingKey={billing}
                note={getTierNote(tier, billing)}
                features={tier.features}
                ctaLabel={tier.ctaLabel}
                ctaVariant={tier.ctaVariant}
              />
            ))}
          </div>
        )}

        <PricingComparisonTable />
        <PricingFaqSection />
        <SiteFooter />
      </main>
    </>
  );
}
