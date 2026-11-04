import type { Metadata } from "next";
import Link from "next/link";
import { LegalDocument } from "@/features/legal/components/legal-document";
import { SUBPROCESSORS } from "@/features/legal/data/subprocessors";

export const metadata: Metadata = {
  title: "Privacy Policy | EveryKaptions",
  description: "Privacy Policy for EveryKaptions: what information we collect, how we use and share it, and your rights.",
};

export default function PrivacyPage() {
  return (
    <LegalDocument current="privacy" title="Privacy Policy" updated="14 November 2026">

      <p>
        EveryKaptions (&quot;we&quot;, &quot;us&quot;) is a creator-led software service operated by Kuldeep, based in
        India. This policy explains what personal information we collect, how we use it, who we share it with, and the choices you have.
        Features, subprocessors, and data practices may change as the product evolves.
        By using the service, you agree to this policy.
      </p>

      <h2>Information we collect</h2>
      <ul>
        <li><strong>Account information</strong>: email address and sign-in identifiers when you create or access your account.</li>
        <li><strong>Content you provide</strong>: videos and audio you upload, generated transcripts, caption edits, and exported files.</li>
        <li><strong>Usage and technical data</strong>: captioning duration, export counts, and the start of your usage period are stored in your browser. Requests to the service also include technical information needed to process them and troubleshoot errors.</li>
        <li><strong>Browser storage</strong>: sign-in session information, preferences, usage allowance, and the cookie notice preference. Saved projects, including media and caption edits, are stored locally in your browser.</li>
        <li><strong>Payment information</strong>: when a paid purchase is offered, the checkout provider processes payment details. Purchase confirmations and billing information may be needed to manage paid access and refund requests. We do not store full card details.</li>
        <li><strong>Support communications</strong>: the support form opens an email draft in your email app. We receive the details and any attachments only when you send the email. Attach screenshots in your email app if needed.</li>
      </ul>

      <h2>How we use information</h2>
      <p>We use personal information to:</p>
      <ul>
        <li>Provide transcription, caption editing, and video export.</li>
        <li>Authenticate you, manage your account, and apply usage limits or minutes.</li>
        <li>Process payments and respond to billing or refund requests.</li>
        <li>Operate, maintain, and improve the service, including troubleshooting and abuse prevention.</li>
        <li>Communicate with you about the service, security, or support requests.</li>
      </ul>
      <p>
        A small number of authorized team members can view uploaded videos, transcripts, and exports when needed to debug a problem, respond to a support request you raise, or check caption quality. This access is limited to what is needed to fix or improve the service. Processing also involves the service providers listed below. We never publish your videos or use them in marketing without your explicit permission.
      </p>
      <p>We do not use your uploads to train third-party or our own machine-learning models.</p>

      <h2>How the editor processes your files</h2>
      <p>
        For transcription, your selected media is uploaded to private temporary storage and sent
        to our speech processing provider. If you choose translation, transcript text is sent to
        that provider to generate the translated captions. Video export is rendered in your browser.
      </p>
      <p>
        Saved projects stay in the browser where you created them. Clearing this site&apos;s browser
        data can remove your local projects, preferences, and usage records. Save any files you want
        to keep before clearing site data.
      </p>

      <h2>How we share information</h2>
      <p>
        We do not sell your personal information. We share information only as needed to run the
        service, with companies that process data on our behalf under contract-like obligations
        (service providers / subprocessors), including:
      </p>
      <ul>
        {SUBPROCESSORS.map((sp) => (
          <li key={sp.name}>
            <strong>{sp.name}</strong>: {sp.description}
          </li>
        ))}
      </ul>

      <p>
        We may add or change service providers as the product evolves. We will update this policy
        when we materially change how personal information is shared.
      </p>
      <p>
        We may also disclose information if required by law, to protect rights and safety, or in
        connection with a merger, acquisition, or sale of assets (with notice where appropriate).
      </p>

      <h2>Government and legal requests</h2>
      <p>
        Governments and other public authorities sometimes ask companies to hand over user
        information. When we receive such a request, we apply the following practices:
      </p>
      <ul>
        <li>
          <strong>We check that it is lawful.</strong> We review every request to confirm it is
          valid, properly issued, and actually binding on us before we act on it.
        </li>
        <li>
          <strong>We do not comply with requests we believe are invalid.</strong> If a request
          looks unlawful, overbroad, or improperly issued, we will decline it, ask for it to be
          narrowed or clarified, and take legal advice where needed.
        </li>
        <li>
          <strong>We give the minimum necessary.</strong> If we must respond, we disclose only
          the specific information the request actually requires, never more.
        </li>
        <li>
          <strong>We keep a record.</strong> We document each request, what we disclosed, and
          the reasoning behind the decision.
        </li>
        <li>
          <strong>We tell you where we can.</strong> We will notify you about a request for your
          information unless we are legally prohibited from doing so.
        </li>
      </ul>

      <h2>International transfers</h2>
      <p>
        Our service providers may process or store data in countries other than where you live
        (including outside India). Where required, we take reasonable steps designed to protect
        your information in line with applicable law, including India&apos;s Digital Personal Data
        Protection Act, 2023 (DPDP).
      </p>

      <h2>Data retention</h2>
      <ul>
        <li><strong>Temporary uploads</strong>: the service attempts to delete the temporary cloud copy when the transcription request finishes, including when processing fails. If an upload is interrupted before transcription starts or cleanup fails, it may remain until it is cleaned up; immediate deletion is not guaranteed.</li>
        <li><strong>Local projects and exports</strong>: saved projects remain in your browser until you delete them or clear this site&apos;s browser data. Files you download stay on your device until you remove them; account deletion does not delete those copies.</li>
        <li><strong>Account data</strong>: kept while your account is active. If you delete your account or ask us to, we delete or anonymize your personal information within 90 days, except records we must keep longer for legal, billing, or security reasons.</li>
        <li><strong>Purchase and billing records</strong>: payment confirmations, export pack grants, subscription status, and minutes usage are kept as long as needed to provide the service, enforce plan limits, handle billing disputes, and meet legal or tax obligations.</li>
        <li><strong>Support messages</strong>: kept as long as needed to handle your request and maintain a reasonable support history. Screenshot attachments are deleted when the support ticket is resolved.</li>
      </ul>

      <h2>Security</h2>
      <p>
        We use technical and organizational measures appropriate for a SaaS product of our size, including
        encrypted transport (HTTPS) and access controls. No method of transmission or storage is
        completely secure; we cannot guarantee absolute security.
      </p>

      <h2>Your rights and choices</h2>
      <p>Depending on applicable law (including DPDP in India), you may have the right to:</p>
      <ul>
        <li>Access, correct, or delete personal information we hold about you.</li>
        <li>Withdraw consent where processing is consent-based, subject to legal or contractual limits.</li>
        <li>Lodge a complaint with the relevant data protection authority.</li>
      </ul>
      <p>
        To request access, correction, or deletion, email{" "}
        <a href="mailto:hello@everykaptions.com">
          hello@everykaptions.com
        </a>{" "}
        or use our{" "}
        <Link href="/support">
          support form
        </Link>
        . We typically respond within 24 to 48 hours.
        Step-by-step instructions, and the full list of what gets removed, are on our{" "}
        <Link href="/legal/data-deletion">
          data deletion page
        </Link>
        .
      </p>

      <p>
        <strong>Data breach notification:</strong> In the event of a personal data breach that affects
        your rights or safety, we will notify you and, where required, the Data Protection Board of
        India within 72 hours of becoming aware of the breach, as required under India&apos;s Digital
        Personal Data Protection Act, 2023.
      </p>

      <h2>Children</h2>
      <p>
        The service is not directed at anyone under 18. We do not knowingly collect personal
        information from children. If you believe a child has provided us data, contact us and we
        will delete it.
      </p>

      <h2>Changes to this policy</h2>
      <p>
        We may update this policy from time to time. We will post the revised version on this page
        and update the &quot;Last updated&quot; date. Continued use after changes means you accept the updated
        policy where permitted by law.
      </p>

      <h2>Contact</h2>
      <p>
        <strong>Data fiduciary / operator:</strong> EveryKaptions (operator: Kuldeep)
        <br />
        <strong>Email:</strong>{" "}
        <a href="mailto:hello@everykaptions.com">
          hello@everykaptions.com
        </a>
        <br />
        <strong>Support:</strong>{" "}
        <Link href="/support">
          support form
        </Link>
      </p>

    </LegalDocument>
  );
}
