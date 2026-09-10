import { cn } from "@/shared/lib/cn";

type LogoWordmarkProps = {
  className?: string;
};

export function LogoWordmark({ className }: LogoWordmarkProps) {
  return (
    <span
      className={cn(
        "logo-wordmark inline-flex shrink-0 items-center whitespace-nowrap font-display text-[26px] font-bold leading-none tracking-[-0.055em]",
        className,
      )}
      role="img"
      aria-label="EveryKaptions"
    >
      <span className="text-cream">Every</span>
      <span className="text-amber">Kaptions</span>
    </span>
  );
}
