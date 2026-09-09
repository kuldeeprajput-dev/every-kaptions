import Link from "next/link";

const footerLinks = ["Terms", "Privacy", "Refunds", "Contact", "Roadmap", "Support", "Instagram"];

export function SiteFooter() {
  return (
    <footer className="section-shell border-t hairline py-9 text-[10px] text-dim">
      <div className="page-container flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
        <nav className="flex flex-wrap gap-x-5 gap-y-2" aria-label="Footer navigation">
          {footerLinks.map((item) => (
            <Link key={item} href={item === "Roadmap" ? "/roadmap" : item === "Support" || item === "Contact" ? "/support" : "#"} className="hover:text-amber">
              {item}
            </Link>
          ))}
        </nav>
        <p>Made by @ssktechy</p>
      </div>
    </footer>
  );
}
