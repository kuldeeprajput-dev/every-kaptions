import { comparisons } from "../data/pricing-data";

export function PricingComparisonTable() {
  return (
    <section className="mt-10" aria-label="Plan comparison">
      <h2 className="text-[22px] font-bold text-center m-0 mb-4 text-cream">
        What you get
      </h2>

      <p className="text-[12px] text-body text-center mb-3 md:hidden flex items-center justify-center gap-1">
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

      <div className="overflow-x-auto border border-hairline rounded-[14px] bg-surface-raised focus-within:ring-1 focus-within:ring-amber/30">
        <table className="w-full border-collapse min-w-[520px]" aria-label="Feature comparison across plans">
          <caption className="sr-only">
            Detailed breakdown of features included in Free, One-time, Creator, and Studio plans
          </caption>
          <thead>
            <tr>
              <th
                scope="col"
                className="px-4 py-3 text-left text-[12px] font-bold uppercase tracking-[0.04em] text-body bg-black/20 border-b border-hairline"
              >
                Feature
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-[12px] font-bold uppercase tracking-[0.04em] text-body bg-black/20 border-b border-hairline"
              >
                Free
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-[12px] font-bold uppercase tracking-[0.04em] text-body bg-black/20 border-b border-hairline"
              >
                One-time pack
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-[12px] font-bold uppercase tracking-[0.04em] text-body bg-black/20 border-b border-hairline"
              >
                Creator
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-[12px] font-bold uppercase tracking-[0.04em] text-body bg-black/20 border-b border-hairline"
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
                <td className="px-4 py-3 text-[13px] leading-[1.45] text-cream font-medium border-b border-hairline">
                  {row.feature}
                  {"isNew" in row && row.isNew && (
                    <span className="inline-block ml-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-lg bg-amber text-amber align-middle tracking-[0.03em]">
                      New
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-[13px] leading-[1.45] text-cream border-b border-hairline">
                  {row.free}
                </td>
                <td className="px-4 py-3 text-[13px] leading-[1.45] text-[#4d6b43] border-b border-hairline">
                  {row.onetime}
                </td>
                <td className="px-4 py-3 text-[13px] leading-[1.45] text-amber border-b border-hairline">
                  {row.creator}
                </td>
                <td className="px-4 py-3 text-[13px] leading-[1.45] text-amber border-b border-hairline">
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
  );
}
