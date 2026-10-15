import Link from "next/link";
import { brand } from "@/shared/config/brand";
import { LogoWordmark } from "./logo-wordmark";
const links = [
  ["Terms", "/legal/terms"],
  ["Privacy", "/legal/privacy"],
  ["Refunds", "/legal/refund"],
  ["Data deletion", "/legal/data-deletion"],
  ["Contact", "/legal/contact"],
  ["Support", "/support"],
];
export function SiteFooter() {
  return (
    <footer className="site-footer">
      <Link href="/" aria-label="EveryKaptions home">
        <LogoWordmark />
      </Link>
      <nav aria-label="Footer navigation">
        {links.map(([label, href]) => (
          <Link key={href} href={href}>
            {label}
          </Link>
        ))}
      </nav>
      <p className="footer-credit">
        Made for your words. Built by{" "}
        <a
          href={brand.socialUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-cream"
        >
          {brand.founderHandle}
        </a>
        .
      </p>
    </footer>
  );
}
