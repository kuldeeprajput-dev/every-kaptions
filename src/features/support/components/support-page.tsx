import { ArrowRight, Mail } from "lucide-react";
import Link from "next/link";
import { SiteHeader } from "@/shared/components/site-header";
import { SiteFooter } from "@/shared/components/site-footer";
import { SupportContactForm } from "./support-contact-form";
import { SupportGuides } from "./support-guides";

export function SupportPage() {
  return (
    <>
      <SiteHeader />
      <main id="main-content" className="page-shell support-surface">
        <div className="page-intro">
          <h1>Let’s get you back to creating.</h1>
          <p>
            A question, a little feedback, or something that isn’t working.
            We’re here.
          </p>
        </div>

        <div className="support-layout">
          <aside>
            <Mail size={24} strokeWidth={1.3} aria-hidden="true" />
            <h2>
              Real people.
              <br />A little help.
            </h2>
            <p>
              EveryKaptions is a small, creator-led team. We typically reply
              within 24 to 48 hours.
            </p>
            <a href="mailto:hello@everykaptions.com">
              hello@everykaptions.com <ArrowRight size={14} aria-hidden="true" />
            </a>
            <div>
              <span>Need something quick?</span>
              <Link href="/pricing">
                Plans & billing <ArrowRight size={13} aria-hidden="true" />
              </Link>
              <Link href="/legal/data-deletion">
                Managing your data <ArrowRight size={13} aria-hidden="true" />
              </Link>
            </div>
          </aside>

          <SupportContactForm />
        </div>

        <SupportGuides />
      </main>
      <SiteFooter />
    </>
  );
}
