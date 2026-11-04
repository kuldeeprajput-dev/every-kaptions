import type { Metadata } from "next";
import Link from "next/link";
import { LegalDocument } from "@/features/legal/components/legal-document";

export const metadata: Metadata = {
  title: "Refund Policy | EveryKaptions",
  description: "Refund Policy for EveryKaptions subscriptions and minute purchases.",
};

export default function RefundPage() {
  return (
    <LegalDocument current="refund" title="Refund Policy" updated="9 July 2026">

      <p>
        This policy applies to all paid access on EveryKaptions, including monthly subscriptions,
        yearly one-time payments, and one-time export packs. It supplements our{" "}
        <Link href="/legal/terms">
          Terms of Service
        </Link>
        .
      </p>

      <h2>Monthly subscription refunds</h2>
      <p>
        You may request a refund of your monthly subscription fee within <strong>7 days</strong>{" "}
        of your first charge if you have used <strong>fewer than 3 minutes</strong> in that billing
        cycle. The exact amount refunded is the subscription fee you paid for that cycle.
      </p>
      <p>
        Refunds apply to the first billing cycle only unless we agree otherwise in writing.
        Subsequent monthly charges are generally non-refundable once the billing cycle has started,
        except where required by law.
      </p>

      <h2>One-time purchases (export packs and yearly plans)</h2>
      <p>
        <strong>One-time purchases are final and non-refundable</strong> once you have used any
        captioning minutes from that purchase. If even <strong>one minute</strong> (or any partial
        minute billed under our rounding rules) has been consumed, the purchase cannot be refunded.
      </p>
      <p>
        This applies to:
      </p>
      <ul>
        <li><strong>Export packs</strong> (one-time payment for captioning minutes and watermark-free exports during the pack validity period).</li>
        <li><strong>Yearly plans</strong> (one-time payment for 12 months of paid access).</li>
      </ul>
      <p>
        One-time purchases are also non-refundable if you have exported videos using paid access
        granted by that purchase, even if no captioning minutes were consumed.
      </p>
      <p>
        The only exception for one-time purchases is a <strong>100% technical failure on our side</strong>:
        you paid successfully, but we could not deliver the purchased minutes or paid access to your
        account at all (for example, a payment succeeded but the grant never appeared, or a complete
        service failure prevented any use before expiry). In that case, contact us with your receipt
        and we will investigate and refund if we confirm the failure.
      </p>
      <p>
        We do not offer refunds for one-time purchases due to dissatisfaction with caption quality,
        styling, export format, change of mind, unused time remaining before expiry, or issues caused
        by your device, network, or content.
      </p>

      <h2>Cancellation</h2>
      <p>
        You may cancel your monthly subscription at any time. Cancellation stops future billing.
        Access continues until the end of the current paid period. Cancellation alone does not trigger
        a refund for the current period.
      </p>
      <p>
        One-time export packs and yearly plans are not subscriptions. They do not auto-renew.
        There is nothing to cancel; access ends when the pack validity period or yearly term expires.
      </p>

      <h2>Discretionary refunds</h2>
      <p>
        For monthly subscriptions, we may refund charges at our discretion for duplicate payments,
        technical failures that prevented you from using the service, or other exceptional cases.
      </p>
      <p>
        For one-time purchases, discretionary refunds are limited to confirmed 100% technical failures
        as described above, or duplicate payments.
      </p>

      <h2>How to request a refund</h2>
      <p>
        Use our{" "}
        <Link href="/support">
          support form
        </Link>{" "}
        or email{" "}
        <a href="mailto:hello@everykaptions.com">
          hello@everykaptions.com
        </a>{" "}
        with the email on your account and your payment receipt or transaction reference.
      </p>

      <h2>Processing</h2>
      <p>
        Approved refunds are returned to your original payment method via our payment processor,
        typically within <strong>5 to 7 business days</strong>. Timing may vary depending on your
        bank or card issuer.
      </p>

      <h2>Non-refundable cases</h2>
      <ul>
        <li>Any one-time purchase (export pack or yearly plan) after one or more captioning minutes have been used.</li>
        <li>Any one-time purchase after paid exports were made using that purchase.</li>
        <li>Monthly subscription minutes already consumed beyond the refund threshold above.</li>
        <li>Requests made after the applicable refund window unless required by law.</li>
        <li>Partial-month usage after the refund window on recurring monthly subscription charges.</li>
        <li>Unused minutes or unused time remaining on a one-time purchase before expiry.</li>
      </ul>

    </LegalDocument>
  );
}
