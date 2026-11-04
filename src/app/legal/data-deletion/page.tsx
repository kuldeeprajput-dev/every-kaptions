import type { Metadata } from "next";
import Link from "next/link";
import { LegalDocument } from "@/features/legal/components/legal-document";

export const metadata: Metadata = {
  title: "Data Deletion | EveryKaptions",
  description: "How to delete your EveryKaptions account and data, and what gets removed.",
};

export default function DataDeletionPage() {
  return (
    <LegalDocument current="data-deletion" title="Data Deletion" updated="14 November 2026">

      <p>
        This page explains how to delete your data from EveryKaptions, what gets removed, and how
        long it takes. It supplements our{" "}
        <Link href="/legal/privacy">
          Privacy Policy
        </Link>
        .
      </p>

      <h2>Delete your whole account</h2>
      <p>Send a deletion request using either route below. Both reach the same team.</p>
      <ul>
        <li>
          <strong>Email:</strong> write to{" "}
          <a href="mailto:hello@everykaptions.com">
            hello@everykaptions.com
          </a>{" "}
          from the email address on your account, with the subject line <strong>Delete my account</strong>.
        </li>
        <li>
          <strong>Support form:</strong> submit a request through our{" "}
          <Link href="/support">
            support form
          </Link>{" "}
          and describe your account deletion request in the message.
        </li>
      </ul>
      <p>
        We confirm receipt within 24 to 48 hours. Once we verify the request came from the account
        holder, we delete or anonymize your personal information within 90 days, except records we
        are required to keep longer for legal, billing, or tax reasons.
      </p>

      <h2>What deletion removes</h2>
      <ul>
        <li>Your account, email address, and sign-in identifiers.</li>
        <li>Any videos, audio, transcripts, and exported files still held for your account.</li>
      </ul>
      <p>
        Purchase and billing records are retained where we are legally required to keep them for
        tax and accounting purposes. These are kept as financial records and are not used to
        identify or contact you afterwards.
      </p>

      <h2>Remove data from your device</h2>
      <ul>
        <li><strong>Saved projects:</strong> delete the project in the app to remove its locally saved media and captions from this browser.</li>
        <li><strong>Browser data:</strong> use your browser&apos;s site settings to clear storage for EveryKaptions. This removes local projects, preferences, and session information from that browser. Save any files you need first.</li>
        <li><strong>Downloaded files:</strong> delete exported videos and subtitles from your device yourself. Deleting an account or project cannot remove files you have already downloaded.</li>
      </ul>
      <p>Repeat these steps in each browser or device where you have saved projects.</p>

      <h2>Temporary processing files</h2>
      <p>
        The service attempts to remove temporary cloud uploads after the transcription request
        finishes. Interrupted uploads or failed cleanup may require later removal. Saved browser
        projects and downloaded exports are separate copies that you must remove yourself.
        Read our <Link href="/legal/privacy#data-retention">Privacy Policy</Link> for retention details.
      </p>

      <h2>Questions</h2>
      <p>
        If you are unsure what data we hold, email{" "}
        <a href="mailto:hello@everykaptions.com">
          hello@everykaptions.com
        </a>{" "}
        and ask for a copy before you request deletion. You may also lodge a complaint with the relevant data
        protection authority under India&apos;s Digital Personal Data Protection Act, 2023.
      </p>

    </LegalDocument>
  );
}
