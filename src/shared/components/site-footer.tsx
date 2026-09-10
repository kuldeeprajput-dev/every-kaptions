import Link from "next/link";
import { brand } from "@/shared/config/brand";

export function SiteFooter() {
  return (
    <footer className="w-full mt-[clamp(40px,4vw,72px)] pt-6 pb-6 md:pb-0 border-t border-[var(--hairline)] flex flex-col md:flex-row flex-wrap justify-center md:justify-between items-center gap-5 md:gap-4 text-[12px] text-muted animate-[fadeUp_0.7s_ease_0.32s_both]">
      <nav className="flex flex-wrap items-center justify-center md:justify-start gap-x-3.5 sm:gap-x-4 gap-y-2.5 md:gap-y-2 text-[12px]" aria-label="Footer legal and social navigation">
        <Link href="/legal/terms" className="text-dim no-underline transition-colors duration-150 hover:text-cream px-1.5 py-0.5 md:p-0 rounded-md hover:bg-white/[0.04] md:hover:bg-transparent">Terms</Link>
        <Link href="/legal/privacy" className="text-dim no-underline transition-colors duration-150 hover:text-cream px-1.5 py-0.5 md:p-0 rounded-md hover:bg-white/[0.04] md:hover:bg-transparent">Privacy</Link>
        <Link href="/legal/refund" className="text-dim no-underline transition-colors duration-150 hover:text-cream px-1.5 py-0.5 md:p-0 rounded-md hover:bg-white/[0.04] md:hover:bg-transparent">Refunds</Link>
        <Link href="/legal/data-deletion" className="text-dim no-underline transition-colors duration-150 hover:text-cream px-1.5 py-0.5 md:p-0 rounded-md hover:bg-white/[0.04] md:hover:bg-transparent">Data Deletion</Link>
        <Link href="/legal/contact" className="text-dim no-underline transition-colors duration-150 hover:text-cream px-1.5 py-0.5 md:p-0 rounded-md hover:bg-white/[0.04] md:hover:bg-transparent">Contact</Link>
        <Link href="/roadmap" className="text-dim no-underline transition-colors duration-150 hover:text-cream px-1.5 py-0.5 md:p-0 rounded-md hover:bg-white/[0.04] md:hover:bg-transparent">Roadmap</Link>
        <Link href="/support" className="text-dim no-underline transition-colors duration-150 hover:text-cream px-1.5 py-0.5 md:p-0 rounded-md hover:bg-white/[0.04] md:hover:bg-transparent">Support</Link>
        <a
          href={brand.socialUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-dim no-underline transition-colors duration-150 hover:text-cream px-1.5 py-0.5 md:p-0 rounded-md hover:bg-white/[0.04] md:hover:bg-transparent"
        >
          {brand.socialLabel}
        </a>
      </nav>
      <div className="flex flex-col items-center md:items-end w-full md:w-auto gap-1 text-center md:text-right text-[12px] text-dim">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 md:p-0 rounded-full bg-white/[0.03] md:bg-transparent border border-white/[0.08] md:border-transparent text-[11px] md:text-[12px] text-dim">
          Made by{" "}
          <a
            href={brand.socialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#f6c453] md:text-dim font-medium md:font-normal no-underline transition-colors duration-150 hover:text-cream"
          >
            {brand.founderHandle}
          </a>
        </span>
      </div>
    </footer>
  );
}
