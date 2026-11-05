"use client";
import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
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
  isRecommended = false,
  price,
  priceSuffix = "/mo",
  note,
  features,
  ctaLabel = "Start creating",
  billingKey,
}: PricingTierCardProps) {
  return (
    <article className={`plan-card [background:var(--surface)] border border-(--hairline) border-t-[3px] rounded-[12px] flex-col [padding:28px] flex [&.is-recommended]:[border-top-color:var(--accent)] [&_>_a]:justify-between [&_>_a]:min-h-[42px] [&_>_a]:[padding:9px_15px] [&_>_a]:text-[12px] [&_>_ul]:flex-col [&_>_ul]:gap-[13px] [&_>_ul]:mt-[26px] [&_>_ul]:flex [&_li]:[color:var(--body)] [&_li]:items-start [&_li]:gap-[10px] [&_li]:text-[11px] [&_li]:leading-[1.65] [&_li]:flex [&_li_svg]:[color:var(--accent)] [&_li_svg]:shrink-[0] [&_li_svg]:mt-[3px] product-max-900:[padding:20px] product-max-767:[padding:20px] max-md:[&>ul]:mt-5 max-md:[&>ul]:gap-3 max-md:[&>ul>li]:text-[12px] ${isRecommended ? "is-recommended" : ""}`}>
      <div className="plan-card-heading justify-between items-center gap-[10px] flex [&_h2]:text-[24px] [&_h2]:font-[650] [&_>_span]:[color:var(--accent)] [&_>_span]:[background:var(--accent-soft)] [&_>_span]:rounded-[4px] [&_>_span]:[padding:4px_6px] [&_>_span]:text-[8px] product-max-900:flex-col product-max-900:items-start product-max-900:min-h-[62px] product-max-767:flex-row product-max-767:items-center product-max-767:min-h-[0]">
        <h2>{name}</h2>
        {isRecommended && <span>For regular creators</span>}
      </div>
      <div className="plan-card-price min-h-[65px] mt-[25px] [&_>_strong]:tracking-[-.05em] [&_>_strong]:items-baseline [&_>_strong]:text-[44px] [&_>_strong]:font-[600] [&_>_strong]:leading-[1] [&_>_strong]:flex [&_>_strong_>_span]:[color:var(--dim)] [&_>_strong_>_span]:tracking-[0] [&_>_strong_>_span]:ml-[6px] [&_>_strong_>_span]:text-[12px] [&_>_strong_>_span]:font-[400] product-max-767:min-h-[55px] product-max-767:mt-[18px]">
        <SpinningPrice value={price} suffix={priceSuffix} triggerKey={billingKey} disableSpin={Number(price) === 0} />
      </div>
      <p className="plan-card-note min-h-[65px] [color:var(--dim)] mb-[20px] text-[11px] leading-[1.7] product-max-767:min-h-[0] product-max-767:mb-[18px]">{note}</p>
      <Link
        href="/studio"
        className={`inline-flex w-full items-center justify-between gap-2 rounded-lg border text-[12px] font-semibold transition-colors ${isRecommended ? "border-[#c63838] bg-[#c63838] text-white hover:bg-[#ac3030]" : "border-[#dedee5] bg-white text-[#52525b] hover:bg-[#f5f5f5]"}`}
      >
        {ctaLabel}
        <ArrowUpRight size={15} />
      </Link>
      <ul>
        {features.map((feature) => (
          <li key={feature}>
            <Check size={13} />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}
