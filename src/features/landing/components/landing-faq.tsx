import Link from "next/link";
import { ArrowUpRight, Plus } from "lucide-react";

const questions = [
  {
    question: "How many free minutes do I get?",
    answer: (
      <>
        The free plan includes 3 minutes of caption generation and 3 exports
        every month. Free video exports include a watermark. See{" "}
        <Link href="/pricing">pricing</Link> when you need more room to create.
      </>
    ),
  },
  {
    question: "Which languages are supported?",
    answer: (
      <>
        You can choose English, Hindi, Hinglish, Tamil, Kannada, Malayalam,
        Marathi, Bengali, Gujarati, or Punjabi as your spoken language. Review
        the transcript before exporting, especially names and local expressions.
      </>
    ),
  },
  {
    question: "Can I customize the caption style?",
    answer: (
      <>
        Yes. Edit the wording and timing, choose a caption preset, and adjust
        the text size, highlight color, alignment, and position in the editor.
      </>
    ),
  },
  {
    question: "What export formats are available?",
    answer: (
      <>
        Export a captioned MP4 video or download your words separately as an
        SRT, VTT, or plain TXT file.
      </>
    ),
  },
  {
    question: "Are my projects saved?",
    answer: (
      <>
        Editor projects are saved in the browser where you create them. Return
        using the same browser to continue editing, and download a copy of your
        finished videos and subtitle files.
      </>
    ),
  },
];

export function LandingFaq() {
  return (
    <section
      id="faq"
      className="mx-auto w-full max-w-[1176px] px-5 py-14 sm:px-7 sm:py-20"
      aria-labelledby="faq-heading"
    >
      <div className="mx-auto max-w-[800px]">
        <div className="mb-8 text-center sm:mb-10">
          <h2 id="faq-heading" className="text-[clamp(30px,3.2vw,42px)] font-[780] leading-[1.12] tracking-[-0.055em] text-[#18181b]">
            A few helpful answers.
          </h2>
          <p className="mx-auto mt-4 max-w-[420px] text-[14px] leading-[1.75] text-[#71717a]">
            Plans, languages, and the details that help you get started.
          </p>
        </div>

        <div className="border-t border-[#dcdce3]">
          {questions.map((item, index) => (
            <details key={item.question} open={index === 0} className="group border-b border-[#dcdce3]">
              <summary className="flex min-h-[68px] cursor-pointer list-none items-center justify-between gap-5 py-5 text-[14px] font-semibold text-[#27272a] outline-offset-4 marker:content-none focus-visible:outline-2 focus-visible:outline-[#c63838] [&::-webkit-details-marker]:hidden sm:text-[15px]">
                <span>{item.question}</span>
                <span className="grid size-7 shrink-0 place-items-center rounded-full border border-[#dedee5] text-[#71717a] transition-colors group-open:border-[#18181b] group-open:bg-[#18181b] group-open:text-white">
                  <Plus size={14} aria-hidden="true" className="transition-transform duration-200 group-open:rotate-45 motion-reduce:transition-none" />
                </span>
              </summary>
              <p className="max-w-[660px] pb-6 pr-5 text-[13px] leading-[1.9] text-[#71717a] [&_a]:font-medium [&_a]:text-[#18181b] [&_a]:underline [&_a]:underline-offset-4">
                {item.answer}
              </p>
            </details>
          ))}
        </div>

        <div className="mt-7 flex flex-col items-center justify-center gap-2 text-[13px] sm:flex-row sm:gap-3">
          <span className="text-[#71717a]">Have something else in mind?</span>
          <Link href="/support" className="inline-flex min-h-10 items-center gap-1.5 font-semibold text-[#18181b] transition-colors hover:text-[#c63838]">
            Talk to us <ArrowUpRight size={15} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
