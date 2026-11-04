import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { brand } from "@/shared/config/brand";
import { LogoWordmark } from "@/shared/components/logo-wordmark";
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
      ["How it works", "/#features"],
      ["Try the editor", "/editor/demo"],
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
    ],
  },
];

export function LandingFooter() {
  return (
    <footer className="w-full select-none bg-[#141414] text-white pt-9 pb-4">
      <div className="w-full max-w-[1296px] mx-auto px-7">
        {/* Footer CTA */}
        <div className="relative flex min-h-[290px] items-center overflow-hidden rounded-[23px] border border-white/10 bg-[#1c1c1c] p-7 sm:min-h-[310px] sm:px-12 sm:py-12">
          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            <Image
              src="/media/landing/footer-paper-shade-v2.webp"
              alt=""
              fill
              unoptimized
              className="object-cover object-center"
            />
          </div>
          <div className="relative z-10 text-white">
            <h2 className="text-[clamp(30px,3.6vw,48px)] font-[780] tracking-[-0.055em] leading-[1.12] text-white">
              Your next video,
              <br />
              ready to be understood.
            </h2>
            <CaptionCta
              tone="white"
              className="mt-7 min-h-[46px] text-xs"
            />
          </div>
        </div>

        {/* Footer Navigation Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.25fr_repeat(3,1fr)] gap-10 sm:gap-14 py-11 px-4.5">
          <div className="flex flex-col">
            <Link href="/" className="w-fit" aria-label="EveryKaptions home">
              <LogoWordmark className="[&>span:first-child]:text-[#e2e2e2] [&>span:last-child]:text-white" />
            </Link>
            <p className="text-[#aaaaaa] text-xs leading-[1.8] mt-4">
              Every word has a story.
              <br />
              Make yours a little clearer.
            </p>
            <a
              href={brand.socialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[#c8c8c8] text-[11px] mt-4 hover:text-white transition-colors"
            >
              Follow the build <ArrowUpRight size={13} />
            </a>
          </div>

          {groups.map((group) => (
            <nav key={group.title} aria-label={group.title} className="flex flex-col gap-2.5">
              <h3 className="text-white text-[13px] font-semibold mb-1 tracking-[-0.01em]">
                {group.title}
              </h3>
              {group.links.map(([label, href]) => (
                <Link
                  href={href}
                  key={href}
                  className="text-[#bcbcbc] text-[11px] leading-[1.55] hover:text-white transition-colors"
                >
                  {label}
                </Link>
              ))}
            </nav>
          ))}
        </div>

        {/* Footer Bottom Bar */}
        <div className="flex flex-col sm:flex-row justify-between gap-5 py-5 px-4.5 border-t border-white/10 text-[10px] text-[#8e8e8e]">
          <span>© {new Date().getFullYear()} EveryKaptions</span>
          <span>Made for every voice.</span>
        </div>

        {/* Big Wordmark */}
        <Link
          href="/"
          className="block text-white text-center text-[clamp(45px,11.7vw,168px)] font-[750] opacity-25 tracking-[-0.075em] leading-[1.25] pt-2.5 hover:opacity-40 transition-opacity font-display"
          aria-label="EveryKaptions home"
        >
          EveryKaptions
        </Link>
      </div>
    </footer>
  );
}
