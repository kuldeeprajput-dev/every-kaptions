import Link from "next/link";

interface LegalNavProps {
  current?: "terms" | "privacy" | "refund" | "data-deletion" | "contact";
}

const LEGAL_LINKS = [
  { href: "/legal/terms", label: "Terms", id: "terms" },
  { href: "/legal/privacy", label: "Privacy", id: "privacy" },
  { href: "/legal/refund", label: "Refunds", id: "refund" },
  { href: "/legal/contact", label: "Contact", id: "contact" },
  { href: "/legal/data-deletion", label: "Data deletion", id: "data-deletion" },
  { href: "/", label: "Back to home", id: "home" },
] as const;

export function LegalNav({ current }: LegalNavProps) {
  return (
    <nav
      className="mt-9 pt-5 border-t border-[var(--hairline)] text-[0.875rem] leading-[1.65]"
      aria-label="Legal"
    >
      {LEGAL_LINKS.filter((item) => item.id !== current).map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="text-amber hover:text-cream hover:underline mr-4 no-underline inline-block transition-colors duration-150"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
