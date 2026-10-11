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
    <article className={`plan-card ${isRecommended ? "is-recommended" : ""}`}>
      <div className="plan-card-heading">
        <h2>{name}</h2>
        {isRecommended && <span>For regular creators</span>}
      </div>
      <div className="plan-card-price">
        {Number(price) === 0 ? (
          <strong>
            ₹0<span>/mo</span>
          </strong>
        ) : (
          <SpinningPrice
            value={price}
            suffix={priceSuffix}
            triggerKey={billingKey}
          />
        )}
      </div>
      <p className="plan-card-note">{note}</p>
      <Link
        href="/studio"
        className={isRecommended ? "action-primary" : "action-secondary"}
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
