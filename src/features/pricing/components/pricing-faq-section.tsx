import Link from "next/link";
import { ArrowUpRight, Plus } from "lucide-react";

const questions = [
  { question: "Can I start for free?", answer: <>Yes. The Free plan includes 3 minutes of caption generation and 3 video exports per month, with no card needed. Free video exports include a watermark.</> },
  { question: "Which plan should I choose?", answer: <>Start with Free to try captioning. Creator includes 30 captioning minutes per month, while Studio includes 45. Compare the included styles and export limits above before choosing.</> },
  { question: "What counts as a captioning minute?", answer: <>Captioning usage is based on the length of your recording. For example, twelve two-minute videos add up to 24 minutes of video. Check your remaining usage in the workspace.</> },
  { question: "What’s the difference between monthly and yearly?", answer: <>Monthly prices are shown per month. The Yearly option shows the monthly equivalent, with the full annual amount listed below it. Your captioning allowance remains monthly.</> },
  { question: "Can I buy minutes without a subscription?", answer: <>The One-time tab lists packs you pay for once: Starter includes 10 captioning minutes valid for 60 days, and Bulk includes 25 minutes valid for 90 days. Check the pack’s feature list, as it differs from a subscription.</> },
  { question: "What files can I caption?", answer: <>Upload MP4, MOV, or WebM video, or MP3, WAV, and WebM audio. Files must be smaller than 25 MB. You can download captions as SRT, VTT, or plain text.</> },
  { question: "Where can I get help with billing or a refund?", answer: <>Visit <Link href="/support">Help & support</Link> with your question. You can also review the <Link href="/legal/refund">refund policy</Link> for the applicable conditions.</> },
];

export function PricingFaqSection() {
  return (
    <section className="mx-auto mt-14 max-w-[800px] sm:mt-16" aria-labelledby="pricing-faq-title">
      <div className="mb-8 text-center"><h2 id="pricing-faq-title" className="text-[32px] font-bold leading-[1.15] tracking-[-0.045em] text-[#18181b]">A few helpful answers.</h2><p className="mt-3 text-[13px] leading-[1.8] text-[#71717a]">The essentials, before you choose a plan.</p></div>
      <div className="border-t border-[#e4e4e7]">
        {questions.map(item => <details key={item.question} className="group border-b border-[#e4e4e7]"><summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 py-5 text-[14px] font-semibold text-[#3f3f46] [&::-webkit-details-marker]:hidden"><span>{item.question}</span><Plus size={16} aria-hidden="true" className="shrink-0 text-[#8b8b95] transition-transform group-open:rotate-45 group-open:text-[#c63838]" /></summary><p className="max-w-[690px] pb-5 pr-6 text-[13px] leading-[1.85] text-[#71717a] [&_a]:text-[#c63838] [&_a]:underline [&_a]:underline-offset-4">{item.answer}</p></details>)}
      </div>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-[12px]"><span className="text-[#8b8b95]">Still unsure?</span><Link href="/support" className="inline-flex min-h-9 items-center gap-1 font-semibold text-[#c63838] hover:underline">We can help<ArrowUpRight size={13} aria-hidden="true" /></Link></div>
    </section>
  );
}
