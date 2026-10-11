import type { Metadata } from "next";
import Link from "next/link";
import { LegalNav } from "@/features/legal/components/legal-nav";
import { SUBPROCESSORS } from "@/features/legal/data/subprocessors";

export const metadata: Metadata = {
  title: "Privacy Policy | EveryKaptions",
  description: "Privacy Policy for EveryKaptions: what information we collect, how we use and share it, and your rights.",
};

export default function PrivacyPage() {
  return (
    <main className="max-w-[42rem] mx-auto pt-[clamp(32px,6vw,56px)] px-[var(--page-gutter,24px)] pb-16 leading-[1.65] font-body text-body text-[0.9375rem]">
      <h1 className="font-['Coolvetica',system-ui,sans-serif] text-[clamp(1.5rem,4vw,1.85rem)] text-cream mb-2 font-normal leading-[1.65]">
        Privacy Policy
      </h1>
      <p className="text-dim text-[0.875rem] mb-7 leading-[1.65]">Last updated: 31 August 2026</p>

      <p className="text-body text-[0.9375rem] leading-[1.65]">
        EveryKaptions (&quot;we&quot;, &quot;us&quot;) is a creator-led software service operated by Kuldeep, based in
        India. This policy explains what personal information we collect, how we use it, who we share it with, and the choices you have.
        Features, subprocessors, and data practices may change as the product evolves.
        By using the service, you agree to this policy.
      </p>

      <h2 className="text-[1rem] font-semibold text-cream mt-7 mb-2.5 leading-[1.65]">Information we collect</h2>
      <ul className="list-disc pl-5 mb-3 text-body text-[0.9375rem]">
        <li className="mb-1.5 leading-[1.65]"><strong className="text-cream font-semibold">Account information</strong>: email address and sign-in identifiers when you create or access your account.</li>
        <li className="mb-1.5 leading-[1.65]"><strong className="text-cream font-semibold">Phone number (if phone verification is enabled)</strong>: your phone number and one-time verification codes (stored as hashes, never in plain text), used only to verify your account and prevent duplicate or abusive signups. We do not use your phone number for marketing.</li>
        <li className="mb-1.5 leading-[1.65]"><strong className="text-cream font-semibold">Content you provide</strong>: videos and audio you upload, generated transcripts, caption edits, and exported files.</li>
        <li className="mb-1.5 leading-[1.65]"><strong className="text-cream font-semibold">Usage and technical data</strong>: minutes used, export status, approximate timestamps, basic product events (for example which steps of the editor or checkout you reach), and logs needed to run and secure the service — including your browser type and the IP address used at signup and during phone verification. We keep IP addresses only as long as needed for security and abuse prevention.</li>
        <li className="mb-1.5 leading-[1.65]"><strong className="text-cream font-semibold">Cookies and local storage</strong>: session cookies for sign-in, and local storage for editor drafts and a device fingerprint hash used for abuse prevention when you sign up.</li>
        <li className="mb-1.5 leading-[1.65]"><strong className="text-cream font-semibold">Payment information</strong>: we do not store full card details. Payments are handled by Razorpay; we receive confirmation, purchase type (for example monthly subscription, yearly one-time payment, or export pack), amounts, and billing metadata needed for your account and refund eligibility checks.</li>
        <li className="mb-1.5 leading-[1.65]"><strong className="text-cream font-semibold">Support communications</strong>: information you send through our support form or email, including optional screenshot attachments you upload with a support request.</li>
      </ul>

      <h2 className="text-[1rem] font-semibold text-cream mt-7 mb-2.5 leading-[1.65]">How we use information</h2>
      <p className="text-body text-[0.9375rem] leading-[1.65]">We use personal information to:</p>
      <ul className="list-disc pl-5 mb-3 text-body text-[0.9375rem]">
        <li className="mb-1.5 leading-[1.65]">Provide transcription, caption editing, and video export.</li>
        <li className="mb-1.5 leading-[1.65]">Authenticate you, manage your account, and apply usage limits or minutes.</li>
        <li className="mb-1.5 leading-[1.65]">Process payments and respond to billing or refund requests.</li>
        <li className="mb-1.5 leading-[1.65]">Operate, maintain, and improve the service, including troubleshooting and abuse prevention.</li>
        <li className="mb-1.5 leading-[1.65]">Communicate with you about the service, security, or support requests.</li>
      </ul>
      <p className="text-body text-[0.9375rem] leading-[1.65]">
        A small number of authorized team members can view uploaded videos, transcripts, and exports when needed to debug a problem, respond to a support request you raise, or check caption quality. This access is limited to what is needed to fix or improve the service. We never share your videos with anyone outside the team, never publish them, and never use them in marketing without your explicit permission.
      </p>
      <p className="text-body text-[0.9375rem] leading-[1.65]">We do not use your uploads to train third-party or our own machine-learning models.</p>

      <h2 className="text-[1rem] font-semibold text-cream mt-7 mb-2.5 leading-[1.65]">Usage analytics and error monitoring</h2>
      <p className="text-body text-[0.9375rem] leading-[1.65]">
        We use product analytics to understand how creators use EveryKaptions, such as which pages and editor steps are reached.
        We also use error monitoring to detect crashes and fix problems faster. These tools may record page views, clicks, and limited session replay on some visits.
        We use this data to improve the service, not for advertising.
      </p>
      <p className="text-body text-[0.9375rem] leading-[1.65]">
        When you click &quot;Got it&quot; on our cookie notice, you acknowledge this use. You can contact us to ask questions about how we measure usage.
      </p>

      <h2 className="text-[1rem] font-semibold text-cream mt-7 mb-2.5 leading-[1.65]">How we share information</h2>
      <p className="text-body text-[0.9375rem] leading-[1.65]">
        We do not sell your personal information. We share information only as needed to run the
        service, with companies that process data on our behalf under contract-like obligations
        (service providers / subprocessors), including:
      </p>
      <ul className="list-disc pl-5 mb-3 text-body text-[0.9375rem]">
        {SUBPROCESSORS.map((sp) => (
          <li key={sp.name} className="mb-1.5 leading-[1.65]">
            <strong className="text-cream font-semibold">{sp.name}</strong>: {sp.description}
          </li>
        ))}
      </ul>

      <h3 className="text-[1rem] font-semibold text-cream mt-6 mb-2 leading-[1.65]">If you connect Instagram</h3>
      <p className="text-body text-[0.9375rem] leading-[1.65]">
        Connecting Instagram is optional. If you connect it, we receive your Instagram username,
        profile photo, and account ID from Instagram and store them, along with an encrypted access
        key, so we can show which account you are posting to and publish on your behalf. When you
        choose to publish, we send that video and the caption you wrote to Instagram.
      </p>
      <p className="text-body text-[0.9375rem] leading-[1.65]">
        We never post anything without you asking us to, and we do not read your followers,
        messages, comments, or insights. You can disconnect at any time from Posts →
        Connected accounts, which removes our access and deletes the stored key. You can also
        remove our access from your Instagram settings.
      </p>
      <p className="text-body text-[0.9375rem] leading-[1.65]">
        We may add or change service providers as the product evolves. We will update this policy
        when we materially change how personal information is shared.
      </p>
      <p className="text-body text-[0.9375rem] leading-[1.65]">
        We may also disclose information if required by law, to protect rights and safety, or in
        connection with a merger, acquisition, or sale of assets (with notice where appropriate).
      </p>

      <h2 className="text-[1rem] font-semibold text-cream mt-7 mb-2.5 leading-[1.65]">Government and legal requests</h2>
      <p className="text-body text-[0.9375rem] leading-[1.65]">
        Governments and other public authorities sometimes ask companies to hand over user
        information. When we receive such a request, we apply the following practices:
      </p>
      <ul className="list-disc pl-5 mb-3 text-body text-[0.9375rem]">
        <li className="mb-1.5 leading-[1.65]">
          <strong className="text-cream font-semibold">We check that it is lawful.</strong> We review every request to confirm it is
          valid, properly issued, and actually binding on us before we act on it.
        </li>
        <li className="mb-1.5 leading-[1.65]">
          <strong className="text-cream font-semibold">We do not comply with requests we believe are invalid.</strong> If a request
          looks unlawful, overbroad, or improperly issued, we will decline it, ask for it to be
          narrowed or clarified, and take legal advice where needed.
        </li>
        <li className="mb-1.5 leading-[1.65]">
          <strong className="text-cream font-semibold">We give the minimum necessary.</strong> If we must respond, we disclose only
          the specific information the request actually requires, never more.
        </li>
        <li className="mb-1.5 leading-[1.65]">
          <strong className="text-cream font-semibold">We keep a record.</strong> We document each request, what we disclosed, and
          the reasoning behind the decision.
        </li>
        <li className="mb-1.5 leading-[1.65]">
          <strong className="text-cream font-semibold">We tell you where we can.</strong> We will notify you about a request for your
          information unless we are legally prohibited from doing so.
        </li>
      </ul>

      <h2 className="text-[1rem] font-semibold text-cream mt-7 mb-2.5 leading-[1.65]">International transfers</h2>
      <p className="text-body text-[0.9375rem] leading-[1.65]">
        Our service providers may process or store data in countries other than where you live
        (including outside India). Where required, we take reasonable steps designed to protect
        your information in line with applicable law, including India&apos;s Digital Personal Data
        Protection Act, 2023 (DPDP).
      </p>

      <h2 className="text-[1rem] font-semibold text-cream mt-7 mb-2.5 leading-[1.65]">Data retention</h2>
      <ul className="list-disc pl-5 mb-3 text-body text-[0.9375rem]">
        <li className="mb-1.5 leading-[1.65]"><strong className="text-cream font-semibold">Raw uploads</strong>: cloud copy removed as soon as processing starts; local working files cleared within about one hour for free accounts, or within about one day for paid accounts if you leave a project open in the editor.</li>
        <li className="mb-1.5 leading-[1.65]"><strong className="text-cream font-semibold">Exports</strong>: available for download for a limited time (about one hour on the free plan, or a few hours on paid plans) unless you save them sooner.</li>
        <li className="mb-1.5 leading-[1.65]"><strong className="text-cream font-semibold">Account data</strong>: kept while your account is active. If you delete your account or ask us to, we delete or anonymize your personal information within 90 days, except records we must keep longer for legal, billing, or security reasons.</li>
        <li className="mb-1.5 leading-[1.65]"><strong className="text-cream font-semibold">Purchase and billing records</strong>: payment confirmations, export pack grants, subscription status, and minutes usage are kept as long as needed to provide the service, enforce plan limits, handle billing disputes, and meet legal or tax obligations.</li>
        <li className="mb-1.5 leading-[1.65]"><strong className="text-cream font-semibold">Phone verification records</strong>: one-time code records (phone number, hashed code, IP address, and timestamps) are kept for a limited period for security and rate limiting, then deleted.</li>
        <li className="mb-1.5 leading-[1.65]"><strong className="text-cream font-semibold">Support messages</strong>: kept as long as needed to handle your request and maintain a reasonable support history. Screenshot attachments are deleted when the support ticket is resolved.</li>
      </ul>

      <h2 className="text-[1rem] font-semibold text-cream mt-7 mb-2.5 leading-[1.65]">Security</h2>
      <p className="text-body text-[0.9375rem] leading-[1.65]">
        We use technical and organizational measures appropriate for a SaaS product of our size, including
        encrypted transport (HTTPS) and access controls. No method of transmission or storage is
        completely secure; we cannot guarantee absolute security.
      </p>

      <h2 className="text-[1rem] font-semibold text-cream mt-7 mb-2.5 leading-[1.65]">Your rights and choices</h2>
      <p className="text-body text-[0.9375rem] leading-[1.65]">Depending on applicable law (including DPDP in India), you may have the right to:</p>
      <ul className="list-disc pl-5 mb-3 text-body text-[0.9375rem]">
        <li className="mb-1.5 leading-[1.65]">Access, correct, or delete personal information we hold about you.</li>
        <li className="mb-1.5 leading-[1.65]">Withdraw consent where processing is consent-based, subject to legal or contractual limits.</li>
        <li className="mb-1.5 leading-[1.65]">Lodge a complaint with the relevant data protection authority.</li>
      </ul>
      <p className="text-body text-[0.9375rem] leading-[1.65]">
        To request access, correction, or deletion, email{" "}
        <a href="mailto:hello@everykaptions.com" className="text-amber hover:text-cream hover:underline no-underline transition-colors duration-150">
          hello@everykaptions.com
        </a>{" "}
        or use our{" "}
        <Link href="/support" className="text-amber hover:text-cream hover:underline no-underline transition-colors duration-150">
          support form
        </Link>
        . We typically respond within 24 to 48 hours.
        Step-by-step instructions, and the full list of what gets removed, are on our{" "}
        <Link href="/legal/data-deletion" className="text-amber hover:text-cream hover:underline no-underline transition-colors duration-150">
          data deletion page
        </Link>
        .
      </p>

      <p className="text-body text-[0.9375rem] leading-[1.65]">
        <strong className="text-cream font-semibold">Data breach notification:</strong> In the event of a personal data breach that affects
        your rights or safety, we will notify you and, where required, the Data Protection Board of
        India within 72 hours of becoming aware of the breach, as required under India&apos;s Digital
        Personal Data Protection Act, 2023.
      </p>

      <h2 className="text-[1rem] font-semibold text-cream mt-7 mb-2.5 leading-[1.65]">Children</h2>
      <p className="text-body text-[0.9375rem] leading-[1.65]">
        The service is not directed at anyone under 18. We do not knowingly collect personal
        information from children. If you believe a child has provided us data, contact us and we
        will delete it.
      </p>

      <h2 className="text-[1rem] font-semibold text-cream mt-7 mb-2.5 leading-[1.65]">Changes to this policy</h2>
      <p className="text-body text-[0.9375rem] leading-[1.65]">
        We may update this policy from time to time. We will post the revised version on this page
        and update the &quot;Last updated&quot; date. Continued use after changes means you accept the updated
        policy where permitted by law.
      </p>

      <h2 className="text-[1rem] font-semibold text-cream mt-7 mb-2.5 leading-[1.65]">Contact</h2>
      <p className="text-body text-[0.9375rem] leading-[1.65]">
        <strong className="text-cream font-semibold">Data fiduciary / operator:</strong> EveryKaptions (operator: Kuldeep)
        <br />
        <strong className="text-cream font-semibold">Email:</strong>{" "}
        <a href="mailto:hello@everykaptions.com" className="text-amber hover:text-cream hover:underline no-underline transition-colors duration-150">
          hello@everykaptions.com
        </a>
        <br />
        <strong className="text-cream font-semibold">Support:</strong>{" "}
        <Link href="/support" className="text-amber hover:text-cream hover:underline no-underline transition-colors duration-150">
          contact form
        </Link>
      </p>

      <LegalNav current="privacy" />
    </main>
  );
}
