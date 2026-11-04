"use client";

import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/shared/lib/cn";
import { useAuth } from "@/features/auth/store/auth-store";

export function EditorDemoCta() {
  return (
    <Link className="inline-flex min-h-[49px] items-center justify-center gap-2.5 rounded-xl border border-[#dedee5] bg-white px-5 py-3 text-[14px] font-semibold text-[#18181b] shadow-xs transition-colors duration-200 hover:bg-[#f5f5f5]" href="/editor/demo">
      <Play size={14} fill="currentColor" aria-hidden="true" />Try the editor
    </Link>
  );
}

export function CaptionCta({
  children = "Create captions for free",
  href = "/studio",
  tone = "primary",
  className,
}: {
  children?: ReactNode;
  href?: string;
  tone?: "primary" | "black" | "white";
  className?: string;
}) {
  const { user } = useAuth();
  const label = user && href === "/studio" ? "Open studio" : children;
  const toneClasses = {
    primary: "bg-[#c63838] hover:bg-[#ac3030] text-white shadow-sm",
    black: "bg-[#18181b] hover:bg-[#29292f] text-white shadow-sm",
    white: "bg-white hover:bg-[#ededf1] text-[#18181b] shadow-sm",
  }[tone];

  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center justify-center gap-3 min-h-[48px] px-6 py-3 rounded-xl text-sm font-semibold transition-colors duration-200 cursor-pointer",
        toneClasses,
        className,
      )}
    >
      <span>{label}</span>
      <ArrowRight size={16} strokeWidth={2.2} />
    </Link>
  );
}
