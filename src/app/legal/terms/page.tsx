import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service | EveryKaptions",
  description: "Terms of Service for EveryKaptions, a multilingual caption tool for Reels and Shorts.",
};

export default function TermsPage() {
  return (
    <main className="max-w-[42rem] mx-auto pt-[clamp(32px,6vw,56px)] px-[var(--page-gutter,24px)] pb-16 leading-[1.65] font-body text-body text-[0.9375rem]">
      <h1 className="font-['Coolvetica',system-ui,sans-serif] text-[clamp(1.5rem,4vw,1.85rem)] text-cream mb-2 font-normal leading-[1.65]">
        Terms of Service
      </h1>
      <p className="text-dim text-[0.875rem] mb-7 leading-[1.65]">Last updated: 31 August 2026</p>

      <p className="text-body text-[0.9375rem] leading-[1.65]">
        These terms govern your use of EveryKaptions (&quot;Service&quot;), a creator-led software service operated by
        Kuldeep, based in India (&quot;we&quot;, &quot;us&quot;). By accessing or using the
        Service, you agree to these terms and our{" "}
        <Link href="/legal/privacy" className="text-amber hover:text-cream hover:underline no-underline transition-colors duration-150">
          Privacy Policy
        </Link>
        .
      </p>

      <h2 className="text-[1rem] font-semibold text-cream mt-7 mb-2.5 leading-[1.65]">Eligibility</h2>
      <p className="text-body text-[0.9375rem] leading-[1.65]">
        You must be at least 18 years old and able to enter a binding contract. You represent that
        you own or have all rights and permissions needed for content you upload.
      </p>

      <h2 className="text-[1rem] font-semibold text-cream mt-7 mb-2.5 leading-[1.65]">Your content</h2>
      <p className="text-body text-[0.9375rem] leading-[1.65]">
        You retain ownership of your uploads. You grant us a limited, non-exclusive license to host,
        process, and transform your content solely to provide transcription, captioning, export,
        and posting features you request. We do not claim ownership of your creative work.
      </p>
      <p className="text-body text-[0.9375rem] leading-[1.65]">
        Authorized team members may access your uploads, transcripts, and exports for support,
        debugging, and quality checks as described in our{" "}
        <Link href="/legal/privacy" className="text-amber hover:text-cream hover:underline no-underline transition-colors duration-150">
          Privacy Policy
        </Link>
        . We never share your content outside the team.
      </p>
      <p className="text-body text-[0.9375rem] leading-[1.65]">
        You are responsible for your content and must not upload material that is illegal, infringing,
        harmful, or violates others&apos; rights. You agree to indemnify EveryKaptions against claims arising
        from content you upload without proper rights.
      </p>

      <h2 className="text-[1rem] font-semibold text-cream mt-7 mb-2.5 leading-[1.65]">Instagram posting</h2>
      <p className="text-body text-[0.9375rem] leading-[1.65]">
        Posting to Instagram from EveryKaptions is optional. We only post or schedule a Reel when
        you tap Post now or Schedule for later. You need an Instagram professional account (Business
        or Creator). We do not post to personal profiles. You are responsible for the caption and
        video you send, and for following Instagram&apos;s rules.
      </p>

      <h2 className="text-[1rem] font-semibold text-cream mt-7 mb-2.5 leading-[1.65]">Service availability and changes</h2>
      <p className="text-body text-[0.9375rem] leading-[1.65]">
        The product may not always behave exactly as intended. You may encounter bugs, downtime,
        slower performance, or features that change or are removed as we improve the Service.
      </p>
      <p className="text-body text-[0.9375rem] leading-[1.65]">
        Features, limits, pricing, and availability may change. We may suspend or discontinue features
        with reasonable notice when practicable. The Service is provided &quot;as is&quot; and &quot;as available&quot;
        without warranties of any kind, to the fullest extent permitted by law.
      </p>
      <p className="text-body text-[0.9375rem] leading-[1.65]">
        We may add, modify, restrict, or remove features at our discretion, and may make certain
        features, templates, fonts, or capabilities available only on specific plans or billing terms
        (for example, monthly versus annual). Plan inclusions may differ and may change over time.
        Changes apply going forward and do not remove access you have already paid for during your
        current billing cycle.
      </p>
      <p className="text-body text-[0.9375rem] leading-[1.65]">
        If we discontinue a paid feature you relied on, we may offer a pro-rata refund for the
        unused portion of your current billing cycle, per our{" "}
        <Link href="/legal/refund" className="text-amber hover:text-cream hover:underline no-underline transition-colors duration-150">
          Refund Policy
        </Link>
        .
      </p>

      <h2 className="text-[1rem] font-semibold text-cream mt-7 mb-2.5 leading-[1.65]">Accounts and acceptable use</h2>
      <ul className="list-disc pl-5 mb-3 text-body text-[0.9375rem]">
        <li className="mb-1.5 leading-[1.65]">Keep your account credentials secure. You are responsible for activity under your account.</li>
        <li className="mb-1.5 leading-[1.65]">Do not abuse the Service, attempt unauthorized access, or interfere with other users.</li>
        <li className="mb-1.5 leading-[1.65]">Do not use the Service to process content you are not permitted to use.</li>
      </ul>

      <h2 className="text-[1rem] font-semibold text-cream mt-7 mb-2.5 leading-[1.65]">Free trial</h2>
      <p className="text-body text-[0.9375rem] leading-[1.65]">
        New accounts may receive <strong className="text-cream font-semibold">3 free minutes</strong> of captioning to try the Service.
        See{" "}
        <a href="#charging" className="text-amber hover:text-cream hover:underline no-underline transition-colors duration-150">
          How minutes are charged
        </a>{" "}
        and{" "}
        <a href="#free-plan" className="text-amber hover:text-cream hover:underline no-underline transition-colors duration-150">
          Free plan limits
        </a>{" "}
        below for how usage is measured. Uploaded
        files are deleted after processing and are not used to train AI models. See our{" "}
        <Link href="/legal/privacy" className="text-amber hover:text-cream hover:underline no-underline transition-colors duration-150">
          Privacy Policy
        </Link>{" "}
        for retention details.
      </p>

      <h2 id="free-plan" className="text-[1rem] font-semibold text-cream mt-7 mb-2.5 leading-[1.65] scroll-mt-6">Free plan limits</h2>
      <p className="text-body text-[0.9375rem] leading-[1.65]">
        Free accounts include 3 minutes of captioning and 3 exports each calendar month, and up to 5 uploads per day.
        Free exports include a small EveryKaptions watermark. Uploads are limited to 3 minutes per video, 1080p, and 300 MB.
        Minutes and exports reset on the 1st of each month and do not roll over.
      </p>

      <h2 className="text-[1rem] font-semibold text-cream mt-7 mb-2.5 leading-[1.65]">Paid plans</h2>
      <p className="text-body text-[0.9375rem] leading-[1.65]">
        Paid plans include more captioning minutes per billing cycle, watermark-free exports, and higher daily export limits.
        Plan details and pricing are shown in the app at checkout. Paid subscribers may upload without the free-tier daily upload cap.
      </p>

      <h2 id="charging" className="text-[1rem] font-semibold text-cream mt-7 mb-2.5 leading-[1.65] scroll-mt-6">How minutes are charged</h2>
      <p className="text-body text-[0.9375rem] leading-[1.65]">
        You are charged by the length of each video you transcribe. Each upload is rounded up to the
        next <strong className="text-cream font-semibold">15 seconds</strong>, with a <strong className="text-cream font-semibold">30-second minimum</strong> per video. The
        minimum covers the fixed processing cost of every job, so very short clips are billed fairly
        rather than as a full minute.
      </p>
      <ul className="list-disc pl-5 mb-3 text-body text-[0.9375rem]">
        <li className="mb-1.5 leading-[1.65]">Up to 0:30 &rarr; 0.5 min</li>
        <li className="mb-1.5 leading-[1.65]">0:33 &rarr; 0.75 min</li>
        <li className="mb-1.5 leading-[1.65]">0:47 &rarr; 1 min</li>
        <li className="mb-1.5 leading-[1.65]">1:21 &rarr; 1.5 min</li>
      </ul>
      <p className="text-body text-[0.9375rem] leading-[1.65]">
        Minutes are deducted once, when a video is transcribed. Re-exporting the same video does not use more minutes.
        On the free plan, each export, including a re-export of the same video, counts toward your monthly export limit.
        Free minutes and exports refresh on the 1st of each calendar month and do not roll over.
      </p>

      <h2 className="text-[1rem] font-semibold text-cream mt-7 mb-2.5 leading-[1.65]">Subscriptions and billing</h2>
      <p className="text-body text-[0.9375rem] leading-[1.65]">
        Monthly plans renew automatically each month using UPI Autopay or your card until you cancel.
        You can cancel anytime; cancellation stops future charges and your access continues until the end of the current billing period.
        Yearly plans and export packs are one-time purchases and do not auto-renew.
        Refunds are described in our{" "}
        <Link href="/legal/refund" className="text-amber hover:text-cream hover:underline no-underline transition-colors duration-150">
          Refund Policy
        </Link>
        .
      </p>

      <h2 className="text-[1rem] font-semibold text-cream mt-7 mb-2.5 leading-[1.65]">Payments and refunds</h2>
      <p className="text-body text-[0.9375rem] leading-[1.65]">
        Paid features, minutes, and refunds are described in-app and in our{" "}
        <Link href="/legal/refund" className="text-amber hover:text-cream hover:underline no-underline transition-colors duration-150">
          Refund Policy
        </Link>
        . Payments are processed by third-party payment
        providers; their terms may also apply.
      </p>
      <p className="text-body text-[0.9375rem] leading-[1.65]">
        <strong className="text-cream font-semibold">Monthly subscriptions</strong> may be refunded within 7 days of the first charge if
        fewer than 3 minutes were used, as set out in the Refund Policy.{" "}
        <strong className="text-cream font-semibold">One-time purchases</strong> (export packs and yearly plans) are final and
        non-refundable once any captioning minutes are used or paid exports are made, except for a
        confirmed 100% technical failure on our side where the purchase was not delivered at all.
      </p>

      <h2 id="delivery" className="text-[1rem] font-semibold text-cream mt-7 mb-2.5 leading-[1.65] scroll-mt-6">Delivery of service</h2>
      <p className="text-body text-[0.9375rem] leading-[1.65]">
        EveryKaptions is a digital software service. There is no physical product or physical
        shipment. Minutes and subscriptions are delivered electronically to your account after a
        successful payment, and caption exports are available for download after processing completes.
        If minutes or exports are not delivered as expected, contact us and we will resolve it or
        refund the charge per our Refund Policy.
      </p>

      <h2 className="text-[1rem] font-semibold text-cream mt-7 mb-2.5 leading-[1.65]">Limitation of liability</h2>
      <p className="text-body text-[0.9375rem] leading-[1.65]">
        To the maximum extent permitted by law, EveryKaptions will not be liable for indirect,
        incidental, special, consequential, or punitive damages, or for loss of profits, data, or
        goodwill. Our total liability for any claim relating to the Service is limited to the
        amount you paid us in the twelve (12) months before the claim, or ₹1,000, whichever is greater.
      </p>

      <h2 className="text-[1rem] font-semibold text-cream mt-7 mb-2.5 leading-[1.65]">Termination</h2>
      <p className="text-body text-[0.9375rem] leading-[1.65]">
        You may stop using the Service at any time. We may suspend or terminate access if you breach
        these terms or if required for security or legal reasons.
      </p>

      <h2 className="text-[1rem] font-semibold text-cream mt-7 mb-2.5 leading-[1.65]">Governing law</h2>
      <p className="text-body text-[0.9375rem] leading-[1.65]">
        These terms are governed by the laws of India. Courts in India shall have exclusive
        jurisdiction, subject to applicable consumer protection rules.
      </p>

      <h2 className="text-[1rem] font-semibold text-cream mt-7 mb-2.5 leading-[1.65]">Contact and grievances</h2>
      <p className="text-body text-[0.9375rem] leading-[1.65]">
        <Link href="/support" className="text-amber hover:text-cream hover:underline no-underline transition-colors duration-150">
          Support form
        </Link>
        . We typically reply within 24 to 48 hours.
        <br />
        Email:{" "}
        <a href="mailto:hello@everykaptions.com" className="text-amber hover:text-cream hover:underline no-underline transition-colors duration-150">
          hello@everykaptions.com
        </a>
      </p>

      <nav className="mt-9 pt-5 border-t border-[var(--hairline)] text-[0.875rem] leading-[1.65]" aria-label="Legal">
        <Link href="/legal/privacy" className="text-amber hover:text-cream hover:underline mr-4 no-underline inline-block transition-colors duration-150">Privacy</Link>
        <Link href="/legal/refund" className="text-amber hover:text-cream hover:underline mr-4 no-underline inline-block transition-colors duration-150">Refunds</Link>
        <Link href="/legal/contact" className="text-amber hover:text-cream hover:underline mr-4 no-underline inline-block transition-colors duration-150">Contact</Link>
        <Link href="/legal/data-deletion" className="text-amber hover:text-cream hover:underline mr-4 no-underline inline-block transition-colors duration-150">Data deletion</Link>
        <Link href="/" className="text-amber hover:text-cream hover:underline no-underline inline-block transition-colors duration-150">Back to home</Link>
      </nav>
    </main>
  );
}
