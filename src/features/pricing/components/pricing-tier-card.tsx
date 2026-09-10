"use client";

import Link from "next/link";
import { cn } from "@/shared/lib/cn";
import { SpinningPrice } from "./spinning-price";

interface PricingTierCardProps {
  name: string;
  badge: string;
  badgeClass?: string;
  isRecommended?: boolean;
  price: string | number;
  priceSuffix?: string;
  note: string;
  features: string[];
  ctaLabel?: string;
  ctaVariant?: "primary" | "outline";
  billingKey?: string;
}

export function PricingTierCard({
  name,
  badge,
  badgeClass = "text-[#c8c2b6] border-[rgba(200,194,182,0.3)]",
  isRecommended = false,
  price,
  priceSuffix = "/mo",
  note,
  features,
  ctaLabel = "Subscribe",
  ctaVariant = "primary",
  billingKey,
}: PricingTierCardProps) {
  return (
    <article
      className={cn(
        "bg-[#15130f] border rounded-[18px] p-[24px_20px] flex flex-col",
        isRecommended
          ? "border-[rgba(246,196,83,0.45)] ring-1 ring-[rgba(246,196,83,0.12)]"
          : "border-[rgba(244,236,220,0.14)]"
      )}
    >
      <div className="flex flex-wrap gap-1.5 mb-3">
        <span
          className={cn(
            "inline-block text-[10px] font-bold tracking-[0.06em] uppercase rounded-full px-2.5 py-1 border",
            badgeClass
          )}
        >
          {badge}
        </span>
        {isRecommended && (
          <span className="inline-block text-[10px] font-bold tracking-[0.06em] uppercase rounded-full px-2.5 py-1 text-[#f4ecdc] bg-[rgba(246,196,83,0.15)] border border-[rgba(246,196,83,0.3)]">
            Recommended
          </span>
        )}
      </div>

      <h2 className="text-[20px] font-bold text-[#f4ecdc] mb-1">{name}</h2>

      <div className="plan-price-block mt-[10px] mb-[6px] min-h-[52px]">
        {price === "0" || price === 0 ? (
          <div className="text-[34px] font-bold text-[#c8c2b6] leading-[1.1]">
            ₹0
          </div>
        ) : (
          <SpinningPrice
            value={price}
            suffix={priceSuffix}
            triggerKey={billingKey}
          />
        )}
      </div>

      <p className="text-[13px] text-[#8a8478] leading-[1.5] mb-4 min-h-[40px]">
        {note}
      </p>

      <ul className="list-none p-0 m-0 mb-5 flex-1">
        {features.map((feature, idx) => (
          <li
            key={idx}
            className={cn(
              "py-2 text-[14px] text-[#f4ecdc]",
              idx < features.length - 1 &&
                "border-b border-[rgba(244,236,220,0.08)]"
            )}
          >
            {feature}
          </li>
        ))}
      </ul>

      <Link
        href="/editor"
        className={cn(
          "inline-flex items-center justify-center w-full min-h-[48px] px-5 text-[14px] font-semibold rounded-full mt-auto no-underline cursor-pointer transition-all",
          ctaVariant === "outline"
            ? "bg-transparent hover:bg-[rgba(244,236,220,0.04)] hover:border-[rgba(244,236,220,0.4)] text-[#f4ecdc]! border border-[rgba(244,236,220,0.22)]"
            : "bg-[#f4ecdc] hover:brightness-105 text-[#0c0b0a]!"
        )}
      >
        {ctaLabel}
      </Link>
    </article>
  );
}
