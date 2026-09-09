import Link from "next/link";
import { cn } from "@/shared/lib/cn";

export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn("mb-3 text-[11px] font-bold uppercase tracking-[0.1em] text-amber", className)}>{children}</p>;
}

export function PrimaryButton({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <Link
      href={href}
      className={cn(
        "gold-glow inline-flex min-h-12 items-center justify-center rounded-full bg-cream px-7 text-sm font-bold text-canvas transition hover:-translate-y-0.5 hover:shadow-[0_0_34px_rgba(246,196,83,.31)]",
        className,
      )}
    >
      {children}
    </Link>
  );
}
