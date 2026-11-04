import type { Metadata } from "next";
import Link from "next/link";
import { LegalDocument } from "@/features/legal/components/legal-document";

export const metadata: Metadata = {
  title: "Terms of Service | EveryKaptions",
  description: "Terms of Service for EveryKaptions, a multilingual caption tool for Reels and Shorts.",
};

export default function TermsPage() {
  return (
    <LegalDocument current="terms" title="Terms of Service" updated="14 November 2026">

      <p>
        These terms govern your use of EveryKaptions (&quot;Service&quot;), a creator-led software service operated by
        Kuldeep, based in India (&quot;we&quot;, &quot;us&quot;). By accessing or using the
        Service, you agree to these terms and our{" "}
        <Link href="/legal/privacy">
          Privacy Policy
        </Link>
        .
      </p>

      <h2>Eligibility</h2>
      <p>
        You must be at least 18 years old and able to enter a binding contract. You represent that
        you own or have all rights and permissions needed for content you upload.
      </p>

      <h2>Your content</h2>
      <p>
        You retain ownership of your uploads. You grant us a limited, non-exclusive license to host,
        process, and transform your content solely to provide transcription, captioning, and export features you request. We do not claim ownership of your creative work.
      </p>
      <p>
        Authorized team members may access your uploads, transcripts, and exports for support,
        debugging, and quality checks as described in our{" "}
        <Link href="/legal/privacy">
          Privacy Policy
        </Link>
        .
      </p>
      <p>
        You are responsible for your content and must not upload material that is illegal, infringing,
        harmful, or violates others&apos; rights. You agree to indemnify EveryKaptions against claims arising
        from content you upload without proper rights.
      </p>

      <h2>Sharing your exports</h2>
      <p>
        Download your captioned video or subtitle file from the editor, then upload it to your
        preferred platform yourself. EveryKaptions does not currently connect to social accounts
        or publish or schedule posts. You are responsible for the content you share and for
        following the destination platform&apos;s rules.
      </p>

      <h2>Service availability and changes</h2>
      <p>
        The product may not always behave exactly as intended. You may encounter bugs, downtime,
        slower performance, or features that change or are removed as we improve the Service.
      </p>
      <p>
        Features, limits, pricing, and availability may change. We may suspend or discontinue features
        with reasonable notice when practicable. The Service is provided &quot;as is&quot; and &quot;as available&quot;
        without warranties of any kind, to the fullest extent permitted by law.
      </p>
      <p>
        We may add, modify, restrict, or remove features at our discretion, and may make certain
        features, templates, fonts, or capabilities available only on specific plans or billing terms
        (for example, monthly versus annual). Plan inclusions may differ and may change over time.
        Changes apply going forward and do not remove access you have already paid for during your
        current billing cycle.
      </p>
      <p>
        If we discontinue a paid feature you relied on, we may offer a pro-rata refund for the
        unused portion of your current billing cycle, per our{" "}
        <Link href="/legal/refund">
          Refund Policy
        </Link>
        .
      </p>

      <h2>Accounts and acceptable use</h2>
      <ul>
        <li>Keep your account credentials secure. You are responsible for activity under your account.</li>
        <li>Do not abuse the Service, attempt unauthorized access, or interfere with other users.</li>
        <li>Do not use the Service to process content you are not permitted to use.</li>
      </ul>

      <h2>Free trial</h2>
      <p>
        New accounts may receive <strong>3 free minutes</strong> of captioning to try the Service.
        See{" "}
        <a href="#charging">
          How minutes are counted
        </a>{" "}
        and{" "}
        <a href="#free-plan">
          Free plan limits
        </a>{" "}
        below for how usage is measured. The service attempts to delete temporary cloud uploads after
        the processing request finishes. Saved projects remain in your browser until you remove them.
        Uploads are not used to train AI models. See our{" "}
        <Link href="/legal/privacy">
          Privacy Policy
        </Link>{" "}
        for retention details.
      </p>

      <h2 id="free-plan">Free plan limits</h2>
      <p>
        Free accounts include 3 minutes of captioning and 3 video exports per 30-day usage period.
        The editor shows your remaining minutes, exports, and reset time. Unused allowance does not roll over.
        Files for transcription must be 25 MB or smaller. Supported formats include MP3, MP4, MOV, WAV, and WebM.
        Downloading a subtitle file does not use a video export.
      </p>

      <h2>Paid plans</h2>
      <p>
        Paid plan allowances, features, validity periods, and prices are described on our pricing page
        and, where offered, at checkout. Review the details of your selected plan before making a purchase.
      </p>

      <h2 id="charging">How minutes are counted</h2>
      <p>
        The editor counts the duration returned by transcription against your available captioning
        minutes after a successful transcription. Editing captions or exporting the same project
        does not transcribe it again. Each video export, including a repeat export, counts toward
        the video export allowance; downloading SRT, VTT, or TXT subtitles does not.
      </p>
      <p>
        The free allowance refreshes after your 30-day usage period. Your remaining allowance and
        reset time are shown in the editor.
      </p>

      <h2>Subscriptions and billing</h2>
      <p>
        Monthly plans renew automatically each month using UPI Autopay or your card until you cancel.
        You can cancel anytime; cancellation stops future charges and your access continues until the end of the current billing period.
        Yearly plans and export packs are one-time purchases and do not auto-renew.
        Refunds are described in our{" "}
        <Link href="/legal/refund">
          Refund Policy
        </Link>
        .
      </p>

      <h2>Payments and refunds</h2>
      <p>
        Paid features, minutes, and refunds are described in-app and in our{" "}
        <Link href="/legal/refund">
          Refund Policy
        </Link>
        . Payments are processed by third-party payment
        providers; their terms may also apply.
      </p>
      <p>
        <strong>Monthly subscriptions</strong> may be refunded within 7 days of the first charge if
        fewer than 3 minutes were used, as set out in the Refund Policy.{" "}
        <strong>One-time purchases</strong> (export packs and yearly plans) are final and
        non-refundable once any captioning minutes are used or paid exports are made, except for a
        confirmed 100% technical failure on our side where the purchase was not delivered at all.
      </p>

      <h2 id="delivery">Delivery of service</h2>
      <p>
        EveryKaptions is a digital software service. There is no physical product or physical
        shipment. Minutes and subscriptions are delivered electronically to your account after a
        successful payment, and caption exports are available for download after processing completes.
        If minutes or exports are not delivered as expected, contact us and we will resolve it or
        refund the charge per our Refund Policy.
      </p>

      <h2>Limitation of liability</h2>
      <p>
        To the maximum extent permitted by law, EveryKaptions will not be liable for indirect,
        incidental, special, consequential, or punitive damages, or for loss of profits, data, or
        goodwill. Our total liability for any claim relating to the Service is limited to the
        amount you paid us in the twelve (12) months before the claim, or ₹1,000, whichever is greater.
      </p>

      <h2>Termination</h2>
      <p>
        You may stop using the Service at any time. We may suspend or terminate access if you breach
        these terms or if required for security or legal reasons.
      </p>

      <h2>Governing law</h2>
      <p>
        These terms are governed by the laws of India. Courts in India shall have exclusive
        jurisdiction, subject to applicable consumer protection rules.
      </p>

      <h2>Contact and grievances</h2>
      <p>
        <Link href="/support">
          Support form
        </Link>
        . We typically reply within 24 to 48 hours.
        <br />
        Email:{" "}
        <a href="mailto:hello@everykaptions.com">
          hello@everykaptions.com
        </a>
      </p>

    </LegalDocument>
  );
}
