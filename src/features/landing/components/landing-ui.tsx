import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

export function CaptionCta({
  children = "Create captions for free",
  href = "/studio",
  tone = "primary",
}: {
  children?: ReactNode;
  href?: string;
  tone?: "primary" | "black" | "white";
}) {
  return (
    <Link href={href} className={`landing-button landing-button--${tone}`}>
      {children}
      <ArrowRight size={17} strokeWidth={2} />
    </Link>
  );
}
