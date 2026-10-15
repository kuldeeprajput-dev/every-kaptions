import Link from "next/link";
import { cn } from "@/shared/lib/cn";
export function Eyebrow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "mb-3 text-[11px] font-semibold uppercase tracking-widest text-amber",
        className,
      )}
    >
      {children}
    </p>
  );
}
export function PrimaryButton({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link href={href} className={cn("action-primary", className)}>
      {children}
    </Link>
  );
}
