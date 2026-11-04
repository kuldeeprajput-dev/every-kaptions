import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export type LegalPage = "terms" | "privacy" | "refund" | "data-deletion";

const LEGAL_LINKS = [
  { href: "/legal/terms", label: "Terms of Service", id: "terms" },
  { href: "/legal/privacy", label: "Privacy Policy", id: "privacy" },
  { href: "/legal/refund", label: "Refund Policy", id: "refund" },
  { href: "/legal/data-deletion", label: "Data Deletion", id: "data-deletion" },
] as const;

export function LegalNav({ current }: { current: LegalPage }) {
  return (
    <aside className="legal-sidebar">
      <p className="legal-sidebar-label">Legal &amp; policies</p>
      <nav aria-label="Legal policies" className="legal-navigation">
        {LEGAL_LINKS.map((item) => (
          <Link key={item.id} href={item.href} aria-current={item.id === current ? "page" : undefined}>
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="legal-help">
        <p>Have a question?</p>
        <span>We can help you understand these policies.</span>
        <Link href="/support">Talk to support <ArrowUpRight size={15} aria-hidden="true" /></Link>
      </div>
    </aside>
  );
}
