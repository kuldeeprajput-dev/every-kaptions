"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const COOKIE_CONSENT_KEY = "replix_cookies_accepted";

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
      if (!consent) {
        setIsVisible(true);
      }
    } catch {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    try {
      localStorage.setItem(COOKIE_CONSENT_KEY, "true");
    } catch {
      // Ignore storage errors
    }
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <aside
      role="region"
      aria-label="Cookie consent banner"
      className="fixed bottom-0 inset-x-0 z-[90] bg-[#0c0b0a]/96 border-t border-[rgba(244,236,220,0.14)] backdrop-blur-md px-4 sm:px-6 py-3.5 flex flex-row items-center justify-between gap-4 animate-[fadeUp_0.3s_ease_both]"
    >
      <p className="text-[12px] sm:text-[13px] text-[#a8a195] m-0 leading-[1.5]">
        We use cookies to keep you signed in and tools that measure usage and help
        us fix problems.{" "}
        <Link
          href="/legal/privacy"
          className="text-amber hover:text-cream font-semibold underline underline-offset-2 transition-colors"
        >
          Privacy Policy.
        </Link>
      </p>
      <button
        type="button"
        onClick={handleDismiss}
        className="px-4 sm:px-5 py-2 min-h-[36px] bg-[#f4ecdc] hover:bg-[#ede3ce] text-[#0c0b0a] font-bold text-xs rounded-full transition-all cursor-pointer shrink-0 shadow-sm"
      >
        Got it
      </button>
    </aside>
  );
}
