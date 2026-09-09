import Link from "next/link";
import { cn } from "@/shared/lib/cn";

export function Brand({ large = false }: { large?: boolean }) {
  return (
    <Link
      href="/"
      aria-label="Replix Captions home"
      className={cn("display inline-flex tracking-[-0.045em] text-cream", large ? "text-[31px]" : "text-[22px]")}
    >
      Replix<span className="text-amber">Captions</span>
    </Link>
  );
}
