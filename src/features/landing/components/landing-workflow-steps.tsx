import Image from "next/image";
import { Captions, Download, Upload } from "lucide-react";
import { CaptionCta } from "./landing-ui";

const steps = [
  {
    title: "Upload your video.",
    description:
      "Choose a video or audio file from your device, then select the language you speak.",
    icon: Upload,
  },
  {
    title: "Generate your captions.",
    description:
      "Turn your speech into a transcript. Review the words and make any corrections.",
    icon: Captions,
  },
  {
    title: "Make it yours & export.",
    description:
      "Adjust the timing and style. Download your captioned video or subtitle file.",
    icon: Download,
  },
];

export function LandingWorkflowSteps() {
  return (
    <section
      id="how-it-works"
      className="w-full max-w-[1176px] mx-auto px-7 pt-5 pb-[65px]"
      aria-labelledby="workflow-heading"
    >
      <div className="border border-[#f0f0f2] bg-white rounded-[23px] p-6 sm:p-[35px_28px_25px] shadow-[0_12px_35px_rgba(23,23,25,0.04)]">
        <h2
          id="workflow-heading"
          className="text-center text-[clamp(28px,2.9vw,38px)] font-[780] tracking-[-0.055em] mb-[25px] leading-[1.15] text-[#18181b]"
        >
          From upload to ready-to-post.
        </h2>

        {/* Monochrome workflow banner */}
        <div className="relative grid items-center gap-4 overflow-hidden min-h-[280px] p-6 sm:grid-cols-[1.2fr_0.8fr] sm:p-[35px] rounded-[13px] bg-[#e9e9ee]">
          <Image
            src="/landing/paper-backdrop.webp"
            className="absolute inset-0 object-cover object-[50%_15%] pointer-events-none grayscale"
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 1000px"
          />

          <div className="relative z-[2] w-full">
            <p className="text-[clamp(30px,4.1vw,57px)] font-[800] leading-[1.05] text-[#18181b] tracking-[-0.055em]">
              YOUR STORY.
              <br />
              WITH CAPTIONS.
            </p>
            <CaptionCta
              href="/editor/demo"
              tone="white"
              className="mt-[22px] min-h-[43px] text-xs px-[21px] py-[10px]"
            >
              Explore the editor demo
            </CaptionCta>
          </div>

          <div className="relative z-[1] h-[180px] w-full bg-transparent pointer-events-none sm:h-[250px]">
            <Image
              src="/landing/workflow-quotation-sculpture.webp"
              alt="Sculptural silver quotation marks representing spoken words"
              fill
              sizes="(max-width: 768px) 45vw, 400px"
              className="object-contain object-center"
            />
          </div>
        </div>

        {/* 3 Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mt-4">
          {steps.map(({ title, description, icon: Icon }, index) => {
            const bgClass =
              index === 0
                ? "bg-[#ededf1] text-[#18181b]"
                : index === 1
                ? "bg-[#56565f] text-white"
                : "bg-[#18181b] text-white";

            return (
              <article
                key={title}
                className={`flex items-start gap-2.5 relative p-5 px-4 rounded-[13px] ${bgClass} shadow-xs`}
              >
                <span className="inline-grid w-[25px] h-[25px] shrink-0 place-items-center rounded-full bg-white text-[#18181b] text-xs font-[750]">
                  {index + 1}
                </span>
                <div className="flex-1">
                  <h3 className="text-inherit text-[13px] leading-[1.3] tracking-[-0.025em] font-[650]">
                    {title}
                  </h3>
                  <p className="text-inherit opacity-85 text-[11px] leading-[1.7] mt-2 max-w-[245px]">
                    {description}
                  </p>
                </div>
                <Icon
                  size={22}
                  strokeWidth={1.5}
                  aria-hidden="true"
                  className="self-center opacity-80 shrink-0"
                />
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
