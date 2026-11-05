"use client";

import { useMemo, useState } from "react";
import { ChevronDown, Search, X } from "lucide-react";
import { comparisons } from "../data/pricing-data";

type FeatureCategory = "all" | "core" | "styles" | "platform";

const categories: { id: FeatureCategory; label: string }[] = [
  { id: "all", label: "All features" },
  { id: "core", label: "Captions & exports" },
  { id: "styles", label: "Styles & typography" },
  { id: "platform", label: "Storage & platform" },
];

function getCategory(feature: string): FeatureCategory {
  const f = feature.toLowerCase();
  if (f.includes("style") || f.includes("font") || f.includes("emphasis") || f.includes("glow") || f.includes("contrast") || f.includes("animation")) {
    return "styles";
  }
  if (f.includes("upload") || f.includes("storage") || f.includes("support")) {
    return "platform";
  }
  return "core";
}

export function PricingComparisonTable() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<FeatureCategory>("all");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return comparisons.filter((row) => {
      if (category !== "all" && getCategory(row.feature) !== category) return false;
      if (!q) return true;
      return (
        row.feature.toLowerCase().includes(q) ||
        row.free.toLowerCase().includes(q) ||
        row.onetime.toLowerCase().includes(q) ||
        row.creator.toLowerCase().includes(q) ||
        row.studio.toLowerCase().includes(q)
      );
    });
  }, [search, category]);

  return (
    <>
      <section className="pb-4 md:hidden" aria-label="Plan comparison">
        <p className="mb-3 text-[12px] leading-relaxed text-[#71717a]">Tap a feature to compare what’s included in each plan.</p>
        <div className="relative mb-3">
          <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#a1a1aa]" aria-hidden="true" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search features..."
            aria-label="Filter features"
            className="h-9 w-full rounded-lg border border-[#dedee5] bg-[#fafafa] pl-8 pr-8 text-[12px] text-[#27272a] outline-none placeholder:text-[#a1a1aa] focus:border-[#c63838]/50 focus:bg-white"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 grid size-5 -translate-y-1/2 place-items-center rounded text-[#71717a] hover:bg-[#ededed]"
            >
              <X size={12} aria-hidden="true" />
            </button>
          )}
        </div>
        <div className="divide-y divide-[#ededf0]">
          {filtered.map(row => <details key={row.feature} className="group">
            <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 py-3 text-[13px] font-semibold text-[#27272a] [&::-webkit-details-marker]:hidden">
              {row.feature}<ChevronDown size={15} aria-hidden="true" className="shrink-0 text-[#85858f] transition-transform group-open:rotate-180" />
            </summary>
            <dl className="mb-4 grid grid-cols-2 gap-2">
              {[["Free", row.free], ["One-time", row.onetime], ["Creator", row.creator], ["Studio", row.studio]].map(([plan, value]) => <div key={plan} className={`min-w-0 rounded-lg border p-3 ${plan === "Creator" ? "border-[#f2d4d4] bg-[#fdf8f8]" : "border-[#ededf0] bg-[#fafafa]"}`}>
                <dt className={`mb-1 text-[10px] font-semibold ${plan === "Creator" ? "text-[#c63838]" : "text-[#85858f]"}`}>{plan}</dt>
                <dd className="text-[12px] leading-[1.6] text-[#3f3f46] [overflow-wrap:anywhere]">{value}</dd>
              </div>)}
            </dl>
          </details>)}
          {filtered.length === 0 && (
            <div className="py-6 text-center text-[12px] text-[#71717a]">
              No features match your query. <button type="button" onClick={() => { setSearch(""); setCategory("all"); }} className="font-semibold text-[#c63838] underline">Reset filters</button>
            </div>
          )}
        </div>
      </section>

      <section className="mt-10 hidden md:block" aria-label="Plan comparison">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-[22px] font-bold text-center m-0 text-cream">
            What you get
          </h2>
          <div className="flex items-center gap-2">
            <div className="flex rounded-lg border border-[#dedee5] bg-[#fafafa] p-0.5" role="group" aria-label="Feature category">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  aria-pressed={category === cat.id}
                  className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors ${category === cat.id ? "bg-white text-[#18181b] shadow-xs" : "text-[#71717a] hover:text-[#18181b]"}`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
            <div className="relative w-44">
              <Search size={13} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[#a1a1aa]" aria-hidden="true" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                aria-label="Filter comparison table"
                className="h-7 w-full rounded-md border border-[#dedee5] bg-[#fafafa] pl-7 pr-6 text-[11px] text-[#27272a] outline-none placeholder:text-[#a1a1aa] focus:border-[#c63838]/50 focus:bg-white"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                  className="absolute right-1.5 top-1/2 grid size-4 -translate-y-1/2 place-items-center rounded text-[#71717a] hover:bg-[#ededed]"
                >
                  <X size={10} aria-hidden="true" />
                </button>
              )}
            </div>
          </div>
        </div>

      <div className="overflow-x-auto border border-hairline rounded-[14px] bg-white focus-within:ring-1 focus-within:ring-[#c63838]/20">
        <table className="w-full border-collapse min-w-[520px]" aria-label="Feature comparison across plans">
          <caption className="sr-only">
            Detailed breakdown of features included in Free, One-time, Creator, and Studio plans
          </caption>
          <thead>
            <tr>
              <th
                scope="col"
                className="px-4 py-3 text-left text-[12px] font-bold uppercase tracking-[0.04em] text-body bg-[#fafafa] border-b border-hairline"
              >
                Feature
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-[12px] font-bold uppercase tracking-[0.04em] text-body bg-[#fafafa] border-b border-hairline"
              >
                Free
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-[12px] font-bold uppercase tracking-[0.04em] text-body bg-[#fafafa] border-b border-hairline"
              >
                One-time pack
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-[12px] font-bold uppercase tracking-[0.04em] text-body bg-[#fafafa] border-b border-hairline"
              >
                Creator
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-[12px] font-bold uppercase tracking-[0.04em] text-body bg-[#fafafa] border-b border-hairline"
              >
                Studio
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row, idx) => (
              <tr
                key={row.feature}
                className={idx === filtered.length - 1 ? "[&>td]:border-b-0" : ""}
              >
                <td className="px-4 py-3 text-[13px] leading-[1.45] text-cream font-medium border-b border-hairline">
                  {row.feature}
                  {"isNew" in row && row.isNew && (
                    <span className="inline-block ml-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-lg bg-[#fdf0ef] text-[#52525b] align-middle tracking-[0.03em]">
                      New
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-[13px] leading-[1.45] text-cream border-b border-hairline">
                  {row.free}
                </td>
                <td className="px-4 py-3 text-[13px] leading-[1.45] text-[#52525b] border-b border-hairline">
                  {row.onetime}
                </td>
                <td className="px-4 py-3 text-[13px] leading-[1.45] text-[#52525b] border-b border-hairline">
                  {row.creator}
                </td>
                <td className="px-4 py-3 text-[13px] leading-[1.45] text-[#52525b] border-b border-hairline">
                  {row.studio}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-[13px] leading-[1.5] text-body text-center">
        <strong className="text-cream">Studio</strong> includes everything in
        Creator plus 45 minutes of captioning per month, Neon Pop and Gold Luxe
        styles, and Instagram scheduling up to 30 days ahead. ₹999/mo or yearly.
      </p>
    </section>
    </>
  );
}
