import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact Us | Replix Captions",
  description: "Contact Replix Captions support: hello@replixcaptions.com and support form.",
};

export default function ContactPage() {
  return (
    <main className="max-w-[42rem] mx-auto pt-[clamp(32px,6vw,56px)] px-[var(--page-gutter,24px)] pb-16 leading-[1.65] font-body text-body text-[0.9375rem]">
      <h1 className="font-['Coolvetica',system-ui,sans-serif] text-[clamp(1.5rem,4vw,1.85rem)] text-cream mb-2 font-normal leading-[1.65]">
        Contact Us
      </h1>
      <p className="text-dim text-[0.875rem] mb-7 leading-[1.65]">Last updated: 19 August 2026</p>

      <p className="text-body text-[0.9375rem] leading-[1.65]">
        Replix Captions is a subscription software service that generates and burns word-by-word
        Telugu captions into short videos. It is a sole proprietorship of Sai Santosh Kumar, registered in India.
      </p>

      <h2 className="text-[1rem] font-semibold text-cream mt-7 mb-2.5 leading-[1.65]">Get in touch</h2>
      <ul className="list-disc pl-5 mb-3 text-body text-[0.9375rem]">
        <li className="mb-1.5 leading-[1.65]">
          <strong className="text-cream font-semibold">Email:</strong>{" "}
          <a
            href="mailto:hello@replixcaptions.com"
            className="text-amber hover:text-cream hover:underline no-underline transition-colors duration-150"
          >
            hello@replixcaptions.com
          </a>
        </li>
        <li className="mb-1.5 leading-[1.65]">
          <strong className="text-cream font-semibold">Support form:</strong>{" "}
          <Link
            href="/support"
            className="text-amber hover:text-cream hover:underline no-underline transition-colors duration-150"
          >
            submit a request
          </Link>
        </li>
      </ul>

      <p className="text-body text-[0.9375rem] leading-[1.65]">
        We typically reply within 24 to 48 hours. For billing or refund questions, include the
        email on your account and your payment reference.
      </p>

      <nav className="mt-9 pt-5 border-t border-[var(--hairline)] text-[0.875rem] leading-[1.65]" aria-label="Legal">
        <Link
          href="/legal/terms"
          className="text-amber hover:text-cream hover:underline mr-4 no-underline inline-block transition-colors duration-150"
        >
          Terms
        </Link>
        <Link
          href="/legal/privacy"
          className="text-amber hover:text-cream hover:underline mr-4 no-underline inline-block transition-colors duration-150"
        >
          Privacy
        </Link>
        <Link
          href="/legal/refund"
          className="text-amber hover:text-cream hover:underline mr-4 no-underline inline-block transition-colors duration-150"
        >
          Refunds
        </Link>
        <Link
          href="/legal/data-deletion"
          className="text-amber hover:text-cream hover:underline mr-4 no-underline inline-block transition-colors duration-150"
        >
          Data deletion
        </Link>
        <Link
          href="/"
          className="text-amber hover:text-cream hover:underline no-underline inline-block transition-colors duration-150"
        >
          Back to home
        </Link>
      </nav>
    </main>
  );
}
