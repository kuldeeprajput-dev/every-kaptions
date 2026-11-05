import Link from "next/link";
import { brand } from "@/shared/config/brand";
import { LogoWordmark } from "./logo-wordmark";
const links = [
  ["Terms", "/legal/terms"],
  ["Privacy", "/legal/privacy"],
  ["Refunds", "/legal/refund"],
  ["Data deletion", "/legal/data-deletion"],
  ["Support", "/support"],
];
export function SiteFooter() {
  return (
    <footer className="w-full font-sans antialiased select-none border-t border-[#e4e4e7] bg-[#fafafa]">
      <div className="mx-auto w-full max-w-[1176px] px-5 py-8 sm:px-7 sm:py-10 max-md:py-6">
        <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center lg:gap-10">
          <div className="shrink-0">
            <Link href="/" aria-label="EveryKaptions home" className="inline-flex">
              <LogoWordmark />
            </Link>
            <p className="mt-2 text-[11px] leading-[1.8] text-[#8b8b95]">
              Made for your words. Built by{" "}
              <a
                href={brand.socialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-[#52525b] transition-colors hover:text-[#18181b]"
              >
                {brand.founderHandle}
              </a>
              .
            </p>
          </div>
          <nav aria-label="Footer navigation" className="flex flex-wrap items-center gap-x-5 gap-y-3 sm:gap-x-6 max-md:gap-x-4 max-md:gap-y-1">
            {links.map(([label, href]) => (
              <Link key={href} href={href} className="text-[12px] leading-6 text-[#71717a] max-md:inline-flex max-md:min-h-10 max-md:items-center transition-colors hover:text-[#18181b]">
                {label}
              </Link>
            ))}
          </nav>
        </div>

      </div>
    </footer>
  );
}
