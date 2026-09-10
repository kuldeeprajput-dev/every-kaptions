import type { Metadata } from "next";
import Link from "next/link";
import { LegalNav } from "@/features/legal/components/legal-nav";

export const metadata: Metadata = {
  title: "Data Deletion | Replix Captions",
  description: "How to delete your Replix Captions account and data, and what gets removed.",
};

export default function DataDeletionPage() {
  return (
    <main className="max-w-[42rem] mx-auto pt-[clamp(32px,6vw,56px)] px-[var(--page-gutter,24px)] pb-16 leading-[1.65] font-body text-body text-[0.9375rem]">
      <h1 className="font-['Coolvetica',system-ui,sans-serif] text-[clamp(1.5rem,4vw,1.85rem)] text-cream mb-2 font-normal leading-[1.65]">
        Data Deletion
      </h1>
      <p className="text-dim text-[0.875rem] mb-7 leading-[1.65]">Last updated: 19 August 2026</p>

      <p className="text-body text-[0.9375rem] leading-[1.65]">
        This page explains how to delete your data from Replix Captions, what gets removed, and how
        long it takes. It supplements our{" "}
        <Link href="/legal/privacy" className="text-amber hover:text-cream hover:underline no-underline transition-colors duration-150">
          Privacy Policy
        </Link>
        .
      </p>

      <h2 className="text-[1rem] font-semibold text-cream mt-7 mb-2.5 leading-[1.65]">Delete your whole account</h2>
      <p className="text-body text-[0.9375rem] leading-[1.65]">Send a deletion request using either route below. Both reach the same team.</p>
      <ul className="list-disc pl-5 mb-3 text-body text-[0.9375rem]">
        <li className="mb-1.5 leading-[1.65]">
          <strong className="text-cream font-semibold">Email:</strong> write to{" "}
          <a href="mailto:hello@replixcaptions.com" className="text-amber hover:text-cream hover:underline no-underline transition-colors duration-150">
            hello@replixcaptions.com
          </a>{" "}
          from the email address on your account, with the subject line <strong className="text-cream font-semibold">Delete my account</strong>.
        </li>
        <li className="mb-1.5 leading-[1.65]">
          <strong className="text-cream font-semibold">Support form:</strong> submit a request through our{" "}
          <Link href="/support" className="text-amber hover:text-cream hover:underline no-underline transition-colors duration-150">
            support form
          </Link>{" "}
          and choose account deletion.
        </li>
      </ul>
      <p className="text-body text-[0.9375rem] leading-[1.65]">
        We confirm receipt within 24 to 48 hours. Once we verify the request came from the account
        holder, we delete or anonymize your personal information within 90 days, except records we
        are required to keep longer for legal, billing, or tax reasons.
      </p>

      <h2 className="text-[1rem] font-semibold text-cream mt-7 mb-2.5 leading-[1.65]">What deletion removes</h2>
      <ul className="list-disc pl-5 mb-3 text-body text-[0.9375rem]">
        <li className="mb-1.5 leading-[1.65]">Your account, email address, and sign-in identifiers.</li>
        <li className="mb-1.5 leading-[1.65]">Any videos, audio, transcripts, and exported files still held for your account.</li>
        <li className="mb-1.5 leading-[1.65]">Your saved profile photo and any thumbnails generated from it.</li>
        <li className="mb-1.5 leading-[1.65]">Your personal caption dictionary entries.</li>
        <li className="mb-1.5 leading-[1.65]">Phone verification records, where phone verification was used.</li>
      </ul>
      <p className="text-body text-[0.9375rem] leading-[1.65]">
        Purchase and billing records are retained where we are legally required to keep them for
        tax and accounting purposes. These are kept as financial records and are not used to
        identify or contact you afterwards.
      </p>

      <h2 className="text-[1rem] font-semibold text-cream mt-7 mb-2.5 leading-[1.65]">Delete individual items yourself</h2>
      <ul className="list-disc pl-5 mb-3 text-body text-[0.9375rem]">
        <li className="mb-1.5 leading-[1.65]">
          <strong className="text-cream font-semibold">Saved photo:</strong> you can delete your saved profile photo in the product at any
          time. Deletion removes it from our storage right away.
        </li>
        <li className="mb-1.5 leading-[1.65]">
          <strong className="text-cream font-semibold">Projects:</strong> you can delete an individual project from the editor, which
          removes its uploaded media and any export still held for it.
        </li>
        <li className="mb-1.5 leading-[1.65]">
          <strong className="text-cream font-semibold">Dictionary entries:</strong> you can remove your own caption dictionary entries in
          the product.
        </li>
      </ul>

      <h2 className="text-[1rem] font-semibold text-cream mt-7 mb-2.5 leading-[1.65]">Data that deletes itself</h2>
      <p className="text-body text-[0.9375rem] leading-[1.65]">
        Most media is removed automatically without any request. Raw uploads are removed from cloud
        storage as soon as processing starts, and exported files are available for a limited window
        before they are cleared. Full retention periods are listed in our{" "}
        <Link href="/legal/privacy" className="text-amber hover:text-cream hover:underline no-underline transition-colors duration-150">
          Privacy Policy
        </Link>
        .
      </p>

      <h2 className="text-[1rem] font-semibold text-cream mt-7 mb-2.5 leading-[1.65]">Questions</h2>
      <p className="text-body text-[0.9375rem] leading-[1.65]">
        If you are unsure what data we hold, email{" "}
        <a href="mailto:hello@replixcaptions.com" className="text-amber hover:text-cream hover:underline no-underline transition-colors duration-150">
          hello@replixcaptions.com
        </a>{" "}
        and ask for a copy before you request deletion. You may also lodge a complaint with the relevant data
        protection authority under India&apos;s Digital Personal Data Protection Act, 2023.
      </p>

      <LegalNav current="data-deletion" />
    </main>
  );
}
