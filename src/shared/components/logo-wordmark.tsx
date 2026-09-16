import { cn } from "@/shared/lib/cn";

type LogoWordmarkProps = {
  className?: string;
};

export function LogoWordmark({ className }: LogoWordmarkProps) {
  const hasTextClass = className?.includes("text-");
  return (
    <span
      className={cn(
        "logo-wordmark inline-flex shrink-0 items-center whitespace-nowrap font-display font-bold leading-none tracking-[-0.055em]",
        !hasTextClass && "text-[26px]",
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
