import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { brand } from "@/shared/config/brand";
import { CaptionCta } from "./landing-ui";
const groups = [
  {
    title: "Product",
    links: [
      ["Auto captions", "/#features"],
      ["Caption styles", "/#presets"],
      ["Supported languages", "/#languages"],
      ["Open the studio", "/studio"],
      ["Pricing", "/pricing"],
    ],
  },
  {
    title: "Resources",
    links: [
      ["How it works", "/#how-it-works"],
      ["Try the editor", "/editor/demo"],
      ["Roadmap", "/roadmap"],
      ["Help & support", "/support"],
      ["Frequently asked questions", "/#faq"],
    ],
  },
  {
    title: "Legal",
    links: [
      ["Terms of service", "/legal/terms"],
      ["Privacy policy", "/legal/privacy"],
      ["Refund policy", "/legal/refund"],
      ["Data deletion", "/legal/data-deletion"],
      ["Contact us", "/legal/contact"],
    ],
  },
];
export function LandingFooter() {
  return (
    <footer className="landing-footer">
      <div className="landing-section">
        <div className="footer-cta">
          <Image
            src="/media/landing/paper-backdrop.webp"
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 700px"
          />
          <div>
            <h2>
              Your next video,
              <br />
              ready to be understood.
            </h2>
            <CaptionCta tone="white" />
          </div>
        </div>
        <div className="landing-footer-links">
          <div className="footer-note">
            <span className="footer-mini-brand">ek</span>
            <p>
              Every word has a story.
              <br />
              Make yours a little clearer.
            </p>
            <a href={brand.socialUrl} target="_blank" rel="noopener noreferrer">
              Follow the build <ArrowUpRight size={13} />
            </a>
          </div>
          {groups.map((group) => (
            <nav key={group.title} aria-label={group.title}>
              <h3>{group.title}</h3>
              {group.links.map(([label, href]) => (
                <Link href={href} key={href}>
                  {label}
                </Link>
              ))}
            </nav>
          ))}
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} EveryKaptions</span>
          <span>Made for every voice.</span>
        </div>
        <Link
          href="/"
          className="landing-footer-wordmark"
          aria-label="EveryKaptions home"
        >
          EveryKaptions
        </Link>
      </div>
    </footer>
  );
}
