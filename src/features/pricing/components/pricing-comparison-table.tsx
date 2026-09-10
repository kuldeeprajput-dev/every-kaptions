import { comparisons } from "../data/pricing-data";

export function PricingComparisonTable() {
  return (
    <section className="mt-10" aria-label="Plan comparison">
      <h2 className="text-[22px] font-bold text-center m-0 mb-4 text-[#f4ecdc]">
        What you get
      </h2>

      <p className="text-[12px] text-[#8a8478] text-center mb-3 md:hidden flex items-center justify-center gap-1">
        <svg
          className="w-3.5 h-3.5 inline-block text-amber"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
          />
        </svg>
        <span>Scroll horizontally to compare all features</span>
      </p>

      <div className="overflow-x-auto border border-[rgba(244,236,220,0.1)] rounded-[14px] bg-[rgba(244,236,220,0.03)] focus-within:ring-1 focus-within:ring-amber/30">
        <table className="w-full border-collapse min-w-[520px]" aria-label="Feature comparison across plans">
          <caption className="sr-only">
            Detailed breakdown of features included in Free, One-time, Creator, and Studio plans
          </caption>
          <thead>
            <tr>
              <th
                scope="col"
                className="px-4 py-3 text-left text-[12px] font-bold uppercase tracking-[0.04em] text-[#8a8478] bg-black/20 border-b border-[rgba(244,236,220,0.08)]"
              >
                Feature
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-[12px] font-bold uppercase tracking-[0.04em] text-[#8a8478] bg-black/20 border-b border-[rgba(244,236,220,0.08)]"
              >
                Free
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-[12px] font-bold uppercase tracking-[0.04em] text-[#8a8478] bg-black/20 border-b border-[rgba(244,236,220,0.08)]"
              >
                One-time pack
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-[12px] font-bold uppercase tracking-[0.04em] text-[#8a8478] bg-black/20 border-b border-[rgba(244,236,220,0.08)]"
              >
                Creator
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-[12px] font-bold uppercase tracking-[0.04em] text-[#8a8478] bg-black/20 border-b border-[rgba(244,236,220,0.08)]"
              >
                Studio
              </th>
            </tr>
          </thead>
          <tbody>
            {comparisons.map((row, idx) => (
              <tr
                key={row.feature}
                className={idx === comparisons.length - 1 ? "[&>td]:border-b-0" : ""}
              >
                <td className="px-4 py-3 text-[13px] leading-[1.45] text-[#f4ecdc] font-medium border-b border-[rgba(244,236,220,0.08)]">
                  {row.feature}
                  {"isNew" in row && row.isNew && (
                    <span className="inline-block ml-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[rgba(246,196,83,0.18)] text-[#f6c453] align-middle tracking-[0.03em]">
                      New
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-[13px] leading-[1.45] text-[#c8c2b6] border-b border-[rgba(244,236,220,0.08)]">
                  {row.free}
                </td>
                <td className="px-4 py-3 text-[13px] leading-[1.45] text-[#86efac] border-b border-[rgba(244,236,220,0.08)]">
                  {row.onetime}
                </td>
                <td className="px-4 py-3 text-[13px] leading-[1.45] text-[#f6c453] border-b border-[rgba(244,236,220,0.08)]">
                  {row.creator}
                </td>
                <td className="px-4 py-3 text-[13px] leading-[1.45] text-[#f6c453] border-b border-[rgba(244,236,220,0.08)]">
                  {row.studio}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-[13px] leading-[1.5] text-[#8a8478] text-center">
        <strong className="text-[#f4ecdc]">Studio</strong> includes everything in
        Creator plus 45 min/month, 2 thumbnail options per generation, up to 4K,
        and 60 credits/mo. ₹999/mo or yearly.
      </p>
    </section>
  );
}
