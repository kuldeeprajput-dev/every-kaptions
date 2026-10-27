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
    <>
      <SiteHeader />
      <main id="main-content" className="page-shell pricing-surface">
        <div className="page-intro">
          <h1>A little more room to create.</h1>
          <p>
            Start with your next video. Find the plan that fits your rhythm.
          </p>
        </div>
        <div
          className="billing-switch"
          role="tablist"
          aria-label="Billing interval"
        >
          {(["Monthly", "Yearly", "One-time"] as const).map((interval) => (
            <button
              key={interval}
              type="button"
              role="tab"
              aria-selected={billing === interval}
              onClick={() => setBilling(interval)}
            >
              {interval}
              {interval === "Yearly" && <span>Save 2 months</span>}
            </button>
          ))}
        </div>
        {billing === "One-time" ? (
          <PricingOneTimePacks billingKey={billing} />
        ) : (
          <div className="pricing-plans" id="planGrid">
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
        <PricingCalculator
          billing={billing === "One-time" ? "Monthly" : billing}
          onSelectInterval={(interval) => setBilling(interval)}
        />

        <p className="pricing-footnote">
          Billed by the length of your video. Monthly subscriptions can be
          cancelled anytime.
        </p>
        <details className="plan-comparison">
          <summary>
            Compare every detail <ChevronDown size={18} />
          </summary>
          <PricingComparisonTable />
        </details>
        <PricingFaqSection />
      </main>
      <SiteFooter />
    </>
  );
}
