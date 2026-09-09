import Link from "next/link";
import { Brand } from "./brand";

const navigation = [
  { label: "Pricing", href: "/pricing", responsive: "max-[360px]:hidden" },
  { label: "Roadmap", href: "/roadmap", responsive: "max-[420px]:hidden" },
  { label: "Support", href: "/support", responsive: "max-[480px]:hidden" },
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 overflow-visible border-b hairline bg-[rgba(12,11,10,.82)] backdrop-blur-[12px]">
      <div className="flex items-center justify-between gap-4 px-[var(--gutter)] py-[14px] max-[420px]:gap-2 max-[420px]:py-3">
        <Brand />
        <nav className="ml-auto flex shrink-0 items-center gap-3.5 max-[480px]:gap-1.5 max-[420px]:gap-1" aria-label="Main navigation">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`inline-flex min-h-11 items-center px-3 text-[13px] font-semibold text-amber transition-colors hover:text-cream max-[480px]:px-2 max-[480px]:text-xs max-[420px]:min-h-10 max-[420px]:px-1.5 ${item.responsive}`}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/editor"
            className="gold-glow pulse-glow inline-flex min-h-11 items-center justify-center whitespace-nowrap rounded-full bg-cream px-[18px] text-[13px] font-semibold text-canvas transition hover:-translate-y-px hover:shadow-[0_0_32px_rgba(246,196,83,.32)] max-[420px]:min-h-10 max-[420px]:px-3.5 max-[420px]:text-xs max-[360px]:px-2.5"
          >
            Open app
          </Link>
        </nav>
      </div>
    </header>
  );
}
