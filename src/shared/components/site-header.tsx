"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { UserMenu } from "@/features/auth/components/user-menu";
import { cn } from "@/shared/lib/cn";

const navigation = [
  { href: "/pricing", label: "Pricing" },
  { href: "/roadmap", label: "Roadmap" },
  { href: "/support", label: "Support" },
] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[200] focus:rounded-full focus:bg-amber focus:px-4 focus:py-2 focus:font-semibold focus:text-[#0c0b0a] focus:shadow-lg focus:outline-none"
      >
        Skip to content
      </a>
      <header className="sticky top-0 z-[100] overflow-visible border-b border-[var(--hairline)] bg-[#0c0b0ad9] backdrop-blur-xl">
        <div className="flex min-h-16 w-full items-center gap-2 px-[var(--page-gutter)] sm:gap-4">
          <Link
            href="/"
            className="inline-flex shrink-0 items-center whitespace-nowrap font-display text-[clamp(1.15rem,2.1vw,1.65rem)] font-bold leading-none tracking-[-0.055em]"
            aria-label="EveryKaptions homepage"
            title="EveryKaptions home"
          >
            <span className="text-cream">Every</span>
            <span className="text-amber">Kaptions</span>
          </Link>

          <nav className="ml-auto flex shrink-0 items-center gap-1" aria-label="Main navigation">
            <div className="hidden items-center min-[641px]:flex">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={pathname === item.href ? "page" : undefined}
                  className={cn(
                    "inline-flex min-h-11 items-center px-3 text-[13px] font-semibold transition-colors",
                    pathname === item.href ? "text-cream" : "text-amber hover:text-cream",
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <UserMenu />
            <button
              type="button"
              onClick={() => setMenuOpen((current) => !current)}
              className="grid size-10 place-items-center rounded-full border border-[var(--hairline-strong)] text-cream min-[641px]:hidden"
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </nav>
        </div>
        {menuOpen ? (
          <nav id="mobile-navigation" className="absolute inset-x-0 top-full border-b border-[var(--hairline)] bg-[#0c0b0af7] p-3 shadow-2xl min-[641px]:hidden" aria-label="Mobile navigation">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                aria-current={pathname === item.href ? "page" : undefined}
                className={cn(
                  "flex min-h-12 items-center rounded-xl px-4 text-sm font-semibold",
                  pathname === item.href ? "bg-amber/10 text-cream" : "text-amber hover:bg-white/5 hover:text-cream",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        ) : null}
      </header>
    </>
  );
}
