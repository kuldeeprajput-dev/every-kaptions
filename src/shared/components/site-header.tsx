"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Brand } from "./brand";
import { PrimaryButton } from "./ui";

export function SiteHeader({ compact = false }: { compact?: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b hairline bg-[rgba(12,11,10,.84)] backdrop-blur-xl">
      <div className="flex min-h-16 items-center justify-between gap-4 px-[var(--gutter)]">
        <Brand />
        <nav className="hidden items-center gap-2 md:flex" aria-label="Main navigation">
          {compact ? <Link href="/editor" className="px-3 py-2 text-xs font-semibold text-dim hover:text-cream">Back to editor</Link> : null}
          <Link href="/pricing" className="px-3 py-2 text-xs font-semibold text-amber hover:text-cream">Pricing</Link>
          <Link href="/roadmap" className="px-3 py-2 text-xs font-semibold text-amber hover:text-cream">Roadmap</Link>
          {!compact ? <Link href="/support" className="px-3 py-2 text-xs font-semibold text-amber hover:text-cream">Support</Link> : null}
          <PrimaryButton href="/editor" className="ml-1 min-h-10 px-5 text-xs">{compact ? "Open app" : "Open app"}</PrimaryButton>
        </nav>
        <button
          type="button"
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          className="grid size-11 place-items-center rounded-full border hairline text-cream md:hidden"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>
      {open ? (
        <nav className="border-t hairline bg-canvas px-5 py-4 md:hidden" aria-label="Mobile navigation">
          <div className="flex flex-col gap-1">
            <Link onClick={() => setOpen(false)} href="/pricing" className="rounded-xl px-4 py-3 text-sm font-semibold text-cream hover:bg-surface">Pricing</Link>
            <Link onClick={() => setOpen(false)} href="/roadmap" className="rounded-xl px-4 py-3 text-sm font-semibold text-cream hover:bg-surface">Roadmap</Link>
            <Link onClick={() => setOpen(false)} href="/support" className="rounded-xl px-4 py-3 text-sm font-semibold text-cream hover:bg-surface">Support</Link>
            <Link onClick={() => setOpen(false)} href="/editor" className="mt-2 rounded-xl bg-cream px-4 py-3 text-center text-sm font-bold text-canvas">Open app</Link>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
