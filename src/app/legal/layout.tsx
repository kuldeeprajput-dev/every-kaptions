import { SiteHeader } from "@/shared/components/site-header";
import { SiteFooter } from "@/shared/components/site-footer";
import "./legal.css";
export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="legal-site">
      <SiteHeader />
      {children}
      <SiteFooter />
    </div>
  );
}
