import { cn } from "@/shared/lib/cn";

export function LogoWordmark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex gap-2 sm:gap-2.5 items-center whitespace-nowrap text-[#18181b] text-[20px] sm:text-[22px] leading-none font-[800] tracking-[-0.06em] select-none",
        className,
      )}
      role="img"
      aria-label="EveryKaptions"
    >
      <span
        className="inline-grid w-[32px] sm:w-[36px] h-[36px] sm:h-[40px] place-items-center shrink-0 bg-transparent text-[#c63838] text-[30px] sm:text-[34px] font-[850] tracking-[-0.15em] pr-0.5 leading-none"
        aria-hidden="true"
      >
        ek
      </span>
      <span>EveryKaptions</span>
    </span>
  );
}

export function MobileHeaderLogo() {
  return <LogoWordmark className="gap-1.5! font-sans antialiased [&>span:first-child]:w-7! [&>span:first-child]:text-[29px]! [&>span:last-child]:text-[18px]!" />;
}
