"use client";

import { useEffect, type ReactNode } from "react";
import Link from "next/link";
import { useAuth } from "../store/auth-store";

export function StudioAccess({ children, destination = "studio" }: { children: ReactNode; destination?: "studio" | "editor" }) {
  const { user, isLoading, openAuthModal } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) openAuthModal("signin");
  }, [isLoading, user, openAuthModal]);

  if (isLoading) {
    return <main className="grid min-h-screen place-items-center bg-white text-sm text-[#71717a]" role="status">Checking your account…</main>;
  }
  if (user) return children;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-5 bg-white px-6 text-center">
      <h1 className="text-3xl font-bold text-[#18181b]">Open your {destination}.</h1>
      <p className="text-sm text-[#71717a]">Use your account to create captions and manage your projects.</p>
      <button type="button" onClick={() => openAuthModal("signin")} className="cursor-pointer rounded-lg bg-[#c63838] px-6 py-3 text-sm font-semibold text-white hover:bg-[#ac3030]">Sign in or create an account</button>
      <Link href="/" className="text-sm text-[#71717a] hover:underline">Back to home</Link>
    </main>
  );
}
