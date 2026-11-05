import { SiteHeader } from "@/shared/components/site-header";
import { SiteFooter } from "@/shared/components/site-footer";
import "./legal.css";
export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="legal-site font-sans antialiased">
      <SiteHeader compactMobile mobileMenu="general" />
      {children}
      <SiteFooter />
    </div>
  );
}
