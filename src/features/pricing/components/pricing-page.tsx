"use client";

import { AnimatePresence, motion } from "motion/react";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { SiteFooter } from "@/shared/components/site-footer";
import { SiteHeader } from "@/shared/components/site-header";
import { cn } from "@/shared/lib/cn";
import { comparisons, faqs, plans } from "../data/pricing-data";

type Billing = "Monthly" | "One-time" | "Yearly";

export function PricingPage() {
  const [billing, setBilling] = useState<Billing>("Yearly");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <main>
      <SiteHeader compact />
      <div className="mx-auto w-full max-w-[1120px] px-4 pb-20 pt-12 sm:px-8 lg:pt-16">
        <header>
          <h1 className="display text-4xl text-cream sm:text-5xl">Choose your plan</h1>
          <p className="mt-4 max-w-[620px] text-sm leading-6 text-dim sm:text-base">Start free, then upgrade when you need more. Billed by the minute of video. Cancel anytime.</p>
        </header>

        <div className="mx-auto mt-9 flex w-fit rounded-full border hairline bg-surface p-1">
          {(["Monthly", "One-time", "Yearly"] as const).map((option) => (
            <button
              type="button"
              key={option}
              onClick={() => setBilling(option)}
              className={cn("rounded-full px-5 py-2 text-xs font-bold transition sm:px-7", billing === option ? "bg-cream text-canvas" : "text-dim hover:text-cream")}
            >
              {option}{billingBadge(option)}
            </button>
          ))}
        </div>

        <section id="planGrid" className="mt-8 grid gap-5 lg:grid-cols-3">
          {plans.map((plan) => (
            <article key={plan.name} className="card-shadow flex min-h-[750px] flex-col rounded-2xl border hairline bg-surface p-6 sm:p-7">
              <span className={cn("w-fit rounded-full border px-2 py-1 text-[10px] font-extrabold", plan.badgeColor)}>{plan.badge}</span>
              <h2 className="mt-5 text-xl font-bold text-cream">{plan.name}</h2>
              <p className="mt-3 text-[42px] font-extrabold leading-none text-cream">{getPrice(plan.price, billing)}<span className="ml-1 text-sm font-medium text-dim">{billing === "One-time" || plan.name === "Free" ? "" : "/mo"}</span></p>
              <p className="mt-4 min-h-12 text-xs leading-5 text-dim">{getNote(plan.note, billing, plan.name)}</p>
              <ul className="mt-5 divide-y divide-white/7 border-y border-white/7">
                {plan.features.map((feature) => <li key={feature} className="py-3 text-sm font-medium leading-5 text-copy">{feature}</li>)}
              </ul>
              <button type="button" className={cn("mt-auto min-h-12 rounded-full border text-sm font-bold transition hover:-translate-y-0.5", plan.name === "Free" ? "border-white/20 text-cream hover:border-amber/50" : "border-cream bg-cream text-canvas gold-glow")}>{plan.action}</button>
            </article>
          ))}
        </section>

        <section className="mt-14 sm:mt-20">
          <h2 className="display text-center text-3xl text-cream">What you get</h2>
          <div className="mt-7 overflow-x-auto rounded-2xl border hairline bg-[rgba(26,23,18,.5)]">
            <table className="w-full min-w-[900px] border-collapse text-left text-xs">
              <thead className="text-[10px] uppercase tracking-widest text-dim">
                <tr>{["Feature", "Free", "One-time pack", "Creator", "Studio"].map((heading) => <th key={heading} className="border-b hairline px-5 py-4">{heading}</th>)}</tr>
              </thead>
              <tbody>
                {comparisons.map((row) => (
                  <tr key={row[0]} className="border-b border-white/6 last:border-0">
                    {row.map((cell, index) => <td key={`${row[0]}-${index}`} className={cn("px-5 py-5 align-top leading-5", index === 0 ? "w-[16%] font-bold text-cream" : index === 1 ? "w-[22%] text-copy" : index === 2 ? "w-[20%] font-semibold text-emerald-400" : "w-[21%] font-semibold text-amber")}>{cell}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-5 px-4 text-center text-xs leading-5 text-dim">Studio includes everything in Creator plus 45 min/month, 2 thumbnail options per generation, up to 4K, and 60 credits/mo.</p>
        </section>

        <section className="mt-16 sm:mt-20">
          <h2 className="display text-2xl text-cream sm:text-3xl">Common questions</h2>
          <div className="mt-6 space-y-3">
            {faqs.map(([question, answer], index) => {
              const isOpen = openFaq === index;
              return (
                <article key={question} className="overflow-hidden rounded-xl border hairline bg-surface">
                  <button type="button" onClick={() => setOpenFaq(isOpen ? null : index)} className="flex min-h-16 w-full items-center justify-between gap-4 px-5 py-3 text-left text-sm font-bold text-cream" aria-expanded={isOpen}>
                    {question}<ChevronDown size={16} className={cn("shrink-0 text-dim transition", isOpen && "rotate-180")} />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen ? <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}><p className="border-t hairline px-5 py-4 text-sm leading-6 text-copy">{answer}</p></motion.div> : null}
                  </AnimatePresence>
                </article>
              );
            })}
          </div>
          <p className="mt-12 text-center text-xs text-dim">Questions? <a href="mailto:hello@replixcaptions.com" className="text-amber hover:text-cream">hello@replixcaptions.com</a></p>
        </section>
      </div>
      <SiteFooter />
    </main>
  );
}

function billingBadge(option: Billing) {
  return option === "Yearly" ? <span className="ml-2 rounded-full bg-emerald-200 px-2 py-0.5 text-[9px] text-emerald-900">2 months free</span> : null;
}

function getPrice(base: string, billing: Billing) {
  if (base === "₹0") return base;
  if (billing === "Monthly") return base === "₹333" ? "₹399" : "₹999";
  if (billing === "One-time") return base === "₹333" ? "₹499" : "₹899";
  return base;
}

function getNote(note: string, billing: Billing, name: string) {
  if (name === "Free") return note;
  if (billing === "One-time") return "Pay once. Valid for 60 to 90 days with no auto-renewal.";
  if (billing === "Monthly") return "Billed monthly. Cancel anytime from your account.";
  return note;
}
