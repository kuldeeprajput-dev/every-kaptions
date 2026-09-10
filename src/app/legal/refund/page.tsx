import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Refund Policy | EveryKaptions",
  description: "Refund Policy for EveryKaptions subscriptions and minute purchases.",
};

export default function RefundPage() {
  return (
    <main className="max-w-[42rem] mx-auto pt-[clamp(32px,6vw,56px)] px-[var(--page-gutter,24px)] pb-16 leading-[1.65] font-body text-body text-[0.9375rem]">
      <h1 className="font-['Coolvetica',system-ui,sans-serif] text-[clamp(1.5rem,4vw,1.85rem)] text-cream mb-2 font-normal leading-[1.65]">
        Refund Policy
      </h1>
      <p className="text-dim text-[0.875rem] mb-7 leading-[1.65]">Last updated: 9 July 2026</p>

      <p className="text-body text-[0.9375rem] leading-[1.65]">
        This policy applies to all paid access on EveryKaptions, including monthly subscriptions,
        yearly one-time payments, and one-time export packs. It supplements our{" "}
        <Link href="/legal/terms" className="text-amber hover:text-cream hover:underline no-underline transition-colors duration-150">
          Terms of Service
        </Link>
        .
      </p>

      <h2 className="text-[1rem] font-semibold text-cream mt-7 mb-2.5 leading-[1.65]">Monthly subscription refunds</h2>
      <p className="text-body text-[0.9375rem] leading-[1.65]">
        You may request a refund of your monthly subscription fee within <strong className="text-cream font-semibold">7 days</strong>{" "}
        of your first charge if you have used <strong className="text-cream font-semibold">fewer than 3 minutes</strong> in that billing
        cycle. The exact amount refunded is the subscription fee you paid for that cycle.
      </p>
      <p className="text-body text-[0.9375rem] leading-[1.65]">
        Refunds apply to the first billing cycle only unless we agree otherwise in writing.
        Subsequent monthly charges are generally non-refundable once the billing cycle has started,
        except where required by law.
      </p>

      <h2 className="text-[1rem] font-semibold text-cream mt-7 mb-2.5 leading-[1.65]">One-time purchases (export packs and yearly plans)</h2>
      <p className="text-body text-[0.9375rem] leading-[1.65]">
        <strong className="text-cream font-semibold">One-time purchases are final and non-refundable</strong> once you have used any
        captioning minutes from that purchase. If even <strong className="text-cream font-semibold">one minute</strong> (or any partial
        minute billed under our rounding rules) has been consumed, the purchase cannot be refunded.
      </p>
      <p className="text-body text-[0.9375rem] leading-[1.65]">
        This applies to:
      </p>
      <ul className="list-disc pl-5 mb-3 text-body text-[0.9375rem]">
        <li className="mb-1.5 leading-[1.65]"><strong className="text-cream font-semibold">Export packs</strong> (one-time payment for captioning minutes and watermark-free exports during the pack validity period).</li>
        <li className="mb-1.5 leading-[1.65]"><strong className="text-cream font-semibold">Yearly plans</strong> (one-time payment for 12 months of paid access).</li>
      </ul>
      <p className="text-body text-[0.9375rem] leading-[1.65]">
        One-time purchases are also non-refundable if you have exported videos using paid access
        granted by that purchase, even if no captioning minutes were consumed.
      </p>
      <p className="text-body text-[0.9375rem] leading-[1.65]">
        The only exception for one-time purchases is a <strong className="text-cream font-semibold">100% technical failure on our side</strong>:
        you paid successfully, but we could not deliver the purchased minutes or paid access to your
        account at all (for example, a payment succeeded but the grant never appeared, or a complete
        service failure prevented any use before expiry). In that case, contact us with your receipt
        and we will investigate and refund if we confirm the failure.
      </p>
      <p className="text-body text-[0.9375rem] leading-[1.65]">
        We do not offer refunds for one-time purchases due to dissatisfaction with caption quality,
        styling, export format, change of mind, unused time remaining before expiry, or issues caused
        by your device, network, or content.
      </p>

      <h2 className="text-[1rem] font-semibold text-cream mt-7 mb-2.5 leading-[1.65]">Cancellation</h2>
      <p className="text-body text-[0.9375rem] leading-[1.65]">
        You may cancel your monthly subscription at any time. Cancellation stops future billing.
        Access continues until the end of the current paid period. Cancellation alone does not trigger
        a refund for the current period.
      </p>
      <p className="text-body text-[0.9375rem] leading-[1.65]">
        One-time export packs and yearly plans are not subscriptions. They do not auto-renew.
        There is nothing to cancel; access ends when the pack validity period or yearly term expires.
      </p>

      <h2 className="text-[1rem] font-semibold text-cream mt-7 mb-2.5 leading-[1.65]">Discretionary refunds</h2>
      <p className="text-body text-[0.9375rem] leading-[1.65]">
        For monthly subscriptions, we may refund charges at our discretion for duplicate payments,
        technical failures that prevented you from using the service, or other exceptional cases.
      </p>
      <p className="text-body text-[0.9375rem] leading-[1.65]">
        For one-time purchases, discretionary refunds are limited to confirmed 100% technical failures
        as described above, or duplicate payments.
      </p>

      <h2 className="text-[1rem] font-semibold text-cream mt-7 mb-2.5 leading-[1.65]">How to request a refund</h2>
      <p className="text-body text-[0.9375rem] leading-[1.65]">
        Use our{" "}
        <Link href="/support" className="text-amber hover:text-cream hover:underline no-underline transition-colors duration-150">
          support form
        </Link>{" "}
        or email{" "}
        <a href="mailto:hello@everykaptions.com" className="text-amber hover:text-cream hover:underline no-underline transition-colors duration-150">
          hello@everykaptions.com
        </a>{" "}
        with the email on your account and your payment receipt or transaction reference.
      </p>

      <h2 className="text-[1rem] font-semibold text-cream mt-7 mb-2.5 leading-[1.65]">Processing</h2>
      <p className="text-body text-[0.9375rem] leading-[1.65]">
        Approved refunds are returned to your original payment method via our payment processor,
        typically within <strong className="text-cream font-semibold">5 to 7 business days</strong>. Timing may vary depending on your
        bank or card issuer.
      </p>

      <h2 className="text-[1rem] font-semibold text-cream mt-7 mb-2.5 leading-[1.65]">Thumbnail credits</h2>
      <p className="text-body text-[0.9375rem] leading-[1.65]">
        Thumbnail credits are consumed on successful generation and are non-refundable once images
        are delivered. Failed generations automatically refund credits.
      </p>

      <h2 className="text-[1rem] font-semibold text-cream mt-7 mb-2.5 leading-[1.65]">Non-refundable cases</h2>
      <ul className="list-disc pl-5 mb-3 text-body text-[0.9375rem]">
        <li className="mb-1.5 leading-[1.65]">Any one-time purchase (export pack or yearly plan) after one or more captioning minutes have been used.</li>
        <li className="mb-1.5 leading-[1.65]">Any one-time purchase after paid exports were made using that purchase.</li>
        <li className="mb-1.5 leading-[1.65]">Monthly subscription minutes already consumed beyond the refund threshold above.</li>
        <li className="mb-1.5 leading-[1.65]">Requests made after the applicable refund window unless required by law.</li>
        <li className="mb-1.5 leading-[1.65]">Partial-month usage after the refund window on recurring monthly subscription charges.</li>
        <li className="mb-1.5 leading-[1.65]">Unused minutes or unused time remaining on a one-time purchase before expiry.</li>
        <li className="mb-1.5 leading-[1.65]">Thumbnail credits after images were successfully delivered.</li>
      </ul>

      <nav className="mt-9 pt-5 border-t border-[var(--hairline)] text-[0.875rem] leading-[1.65]" aria-label="Legal">
        <Link href="/legal/terms" className="text-amber hover:text-cream hover:underline mr-4 no-underline inline-block transition-colors duration-150">
          Terms
        </Link>
        <Link href="/legal/privacy" className="text-amber hover:text-cream hover:underline mr-4 no-underline inline-block transition-colors duration-150">
          Privacy
        </Link>
        <Link href="/legal/contact" className="text-amber hover:text-cream hover:underline mr-4 no-underline inline-block transition-colors duration-150">
          Contact
        </Link>
        <Link href="/legal/data-deletion" className="text-amber hover:text-cream hover:underline mr-4 no-underline inline-block transition-colors duration-150">
          Data deletion
        </Link>
        <Link href="/" className="text-amber hover:text-cream hover:underline no-underline inline-block transition-colors duration-150">
          Back to home
        </Link>
      </nav>
    </main>
  );
}
