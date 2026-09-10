import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="w-full mt-[clamp(40px,4vw,72px)] pt-6 border-t border-[var(--hairline)] flex flex-wrap justify-between items-center gap-4 text-[12px] text-muted animate-[fadeUp_0.7s_ease_0.32s_both]">
      <nav className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[12px]" aria-label="Footer legal and social navigation">
        <Link href="/legal/terms" className="text-dim no-underline transition-colors duration-150 hover:text-cream">Terms</Link>
        <Link href="/legal/privacy" className="text-dim no-underline transition-colors duration-150 hover:text-cream">Privacy</Link>
        <Link href="/legal/refund" className="text-dim no-underline transition-colors duration-150 hover:text-cream">Refunds</Link>
        <Link href="/legal/data-deletion" className="text-dim no-underline transition-colors duration-150 hover:text-cream">Data Deletion</Link>
        <Link href="/legal/contact" className="text-dim no-underline transition-colors duration-150 hover:text-cream">Contact</Link>
        <Link href="/roadmap" className="text-dim no-underline transition-colors duration-150 hover:text-cream">Roadmap</Link>
        <Link href="/support" className="text-dim no-underline transition-colors duration-150 hover:text-cream">Support</Link>
        <a
          href="https://www.instagram.com/replixcaptions/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-dim no-underline transition-colors duration-150 hover:text-cream"
        >
          Instagram
        </a>
      </nav>
      <div className="flex flex-col items-end max-[719px]:items-start max-[719px]:text-left max-[719px]:w-full gap-1 text-right text-[12px] text-dim">
        <span>
          Made by{" "}
          <a
            href="https://www.instagram.com/ssktechy/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-dim no-underline transition-colors duration-150 hover:text-cream"
          >
            @ssktechy
          </a>
        </span>
      </div>
    </footer>
  );
}
