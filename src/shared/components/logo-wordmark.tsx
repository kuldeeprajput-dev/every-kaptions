import { cn } from "@/shared/lib/cn";

export function LogoWordmark({ className }: { className?: string }) {
  return (
    <span
      className={cn("brand-lockup", className)}
      role="img"
      aria-label="EveryKaptions"
    >
      <span className="brand-mark" aria-hidden="true">
        ek
      </span>
      <span>EveryKaptions</span>
    </span>
  );
}
