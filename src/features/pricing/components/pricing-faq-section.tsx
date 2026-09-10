import Link from "next/link";
import { faqs } from "../data/pricing-data";

export function PricingFaqSection() {
  return (
    <>
      <section className="mt-12" aria-label="Frequently asked questions">
        <h2 className="text-[22px] font-bold text-[#f4ecdc] mb-4 tracking-[-0.01em]">
          Common questions
        </h2>
        {faqs.map((item, idx) => (
          <details
            key={idx}
            className="group border border-[rgba(244,236,220,0.12)] rounded-[12px] bg-[#15130f] mb-2.5"
          >
            <summary className="list-none cursor-pointer px-[18px] py-4 text-[15px] font-semibold text-[#f4ecdc] hover:text-white flex items-center justify-between gap-3 select-none [&::-webkit-details-marker]:hidden after:content-['+'] after:text-[20px] after:font-normal after:text-[#8a8478] after:leading-none after:shrink-0 group-open:after:content-['−'] group-open:after:text-[#f6c453]">
              {item.question}
            </summary>
            <p className="px-[18px] pb-4 text-[14px] text-[#8a8478] leading-[1.6] [&_a]:text-[#f6c453] [&_a]:no-underline hover:[&_a]:underline [&_strong]:text-[#f4ecdc]">
              {"hasHtml" in item && item.hasHtml ? (
                <>
                  <strong>Creator (₹399/mo)</strong> removes the watermark,
                  unlocks Creator presets (Punch, Cove, Spotlight, Reel, Noir,
                  Gradient Fill, Frosted Glass), premium fonts, keyword emphasis,
                  caption animation, saved exports, Content Pack (AI YouTube
                  titles, IG caption, and hashtags from your transcript),
                  priority support, with personalized thumbnails marked as
                  coming soon, and posting Reels to Instagram after export.{" "}
                  <strong>Studio (₹999/mo)</strong> includes everything in
                  Creator plus Neon Pop, Gold Luxe, 45 minutes of captioning per
                  month, more caption styles, and scheduling Instagram posts up
                  to 30 days ahead. Thumbnail tools remain in preview for now.
                </>
              ) : "hasRefundLink" in item && item.hasRefundLink ? (
                <>
                  Monthly plans: refund within 7 days of your first charge if
                  you&apos;ve used fewer than 3 minutes.{" "}
                  <strong>
                    One-time packs and yearly plans are non-refundable
                  </strong>{" "}
                  once any captioning minute is used or a paid export is made,
                  except if we completely failed to deliver your purchase (100%
                  technical failure on our side). Full details are in our{" "}
                  <Link href="/legal/refund">Refund Policy</Link>.
                </>
              ) : item.question === "Are my exports saved?" ? (
                <>
                  On paid plans, your last 50 exported videos are saved in{" "}
                  <strong>My Exports</strong> so you can download them again
                  anytime while subscribed. Free exports are not saved; they
                  expire about 1 hour after export.
                </>
              ) : item.question === "How does monthly billing work with UPI?" ? (
                <>
                  Monthly plans use UPI Autopay or card. PhonePe and Paytm will
                  ask you to set up autopay and confirm with your UPI PIN. If UPI
                  gets stuck, try card or switch to the Yearly tab for a
                  one-time payment.
                </>
              ) : item.question ===
                "What is the difference between a one-time pack and monthly?" ? (
                <>
                  One-time packs give you captioning minutes and unlimited
                  watermark-free exports for 60 to 90 days. They do{" "}
                  <strong>not</strong> unlock Creator presets, premium fonts,
                  saved exports, or Content Pack. Those require a Creator or
                  Studio subscription. New videos need minutes; re-exports of
                  videos you already transcribed are free.
                </>
              ) : item.question === "How are payments handled?" ? (
                <>
                  Securely through Razorpay. <strong>Monthly</strong> plans use
                  UPI Autopay (PhonePe/Paytm will ask you to set up autopay and
                  enter your UPI PIN) or card. If UPI gets stuck, try{" "}
                  <strong>Card</strong> or switch to <strong>Yearly</strong>{" "}
                  (one-time payment, no autopay). Card details are processed by
                  Razorpay, never stored on our servers.
                </>
              ) : (
                item.answer
              )}
            </p>
          </details>
        ))}
      </section>

      <div className="mt-8 p-5 border border-[var(--hairline)] rounded-xl bg-[#15130f] text-center max-w-[560px] mx-auto">
        <h3 className="text-[15px] font-semibold text-[#f4ecdc] mb-1">
          Have more questions about billing or plans?
        </h3>
        <p className="text-[13px] text-[#8a8478] mb-3 leading-normal">
          We are here to help. Reach out directly and we typically reply within a few hours.
        </p>
        <a
          href="mailto:hello@everykaptions.com"
          className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#f6c453] hover:text-[#f4ecdc] transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          hello@everykaptions.com
        </a>
      </div>
    </>
  );
}
