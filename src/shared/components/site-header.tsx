"use client";

import { ArrowUpRight, ChevronDown, Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/features/auth/store/auth-store";
import { LogoWordmark } from "./logo-wordmark";
import { cn } from "@/shared/lib/cn";

const groups = [
  {
    id: "features",
    label: "Features",
    links: [
      { label: "Auto captions", description: "Turn speech into editable captions", href: "/#features" },
      { label: "Caption styles", description: "Find the look that feels like you", href: "/#presets" },
      { label: "Word-level timing", description: "Keep every word in sync", href: "/#word-timing" },
      { label: "Video & subtitle exports", description: "Finish your video or download the words", href: "/#features" },
    ],
  },
  {
    id: "languages",
    label: "Languages",
    links: [
      { label: "Telugu captions", description: "For your words in తెలుగు", href: "/#languages" },
      { label: "Hindi captions", description: "Create captions in हिन्दी", href: "/#languages" },
      { label: "English & more", description: "See supported spoken languages", href: "/#languages" },
    ],
  },
  {
    id: "resources",
    label: "Resources",
    links: [
      { label: "How it works", description: "From upload to ready-to-post", href: "/#features" },
      { label: "Help & support", description: "Get a little help from the team", href: "/support" },
      { label: "Frequently asked questions", description: "A few helpful answers", href: "/#faq" },
    ],
  },
];

export function SiteHeader() {
  const { user, openAuthModal, signOut } = useAuth();
  const [profileError, setProfileError] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeGroup, setActiveGroup] = useState<string | null>(null);
  const headerRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const clearHoverTimeout = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
  };

  const handleMouseEnter = (groupId: string) => {
    clearHoverTimeout();
    setActiveGroup(groupId);
  };

  const handleMouseLeave = () => {
    clearHoverTimeout();
    hoverTimeoutRef.current = setTimeout(() => setActiveGroup(null), 150);
  };

  const closeAll = () => {
    clearHoverTimeout();
    setActiveGroup(null);
    setMobileOpen(false);
  };

  useEffect(() => () => clearHoverTimeout(), []);

  useEffect(() => {
    if (!mobileOpen && !activeGroup) return;
    const outside = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) {
        setMobileOpen(false);
        setActiveGroup(null);
      }
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (activeGroup) {
        document
          .getElementById(
            `${mobileOpen ? "mobile" : "desktop"}-${activeGroup}-trigger`,
          )
          ?.focus();
        setActiveGroup(null);
      } else {
        setMobileOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape);
    };
  }, [mobileOpen, activeGroup]);

  const signIn = () => {
    closeAll();
    openAuthModal("signin");
  };

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[300] focus:bg-white focus:text-[#18181b] focus:p-3 focus:rounded-lg focus:shadow-lg focus:border focus:border-zinc-300"
      >
        Skip to content
      </a>
      <header
        ref={headerRef}
        className="sticky top-3 z-50 mx-auto mt-3 h-[64px] w-[calc(100%_-_24px)] max-w-[1184px] rounded-2xl border border-[#e4e4e7] bg-white/95 shadow-[0_6px_24px_-12px_rgba(24,24,27,0.18)] backdrop-blur-xl sm:top-4 sm:mt-4 sm:h-[68px] sm:w-[calc(100%_-_48px)]"
      >
        <div className="mx-auto flex h-full w-full items-center justify-between gap-3 px-3.5 sm:gap-5 sm:px-5">
          {/* Logo */}
          <Link
            href="/"
            aria-label="EveryKaptions homepage"
            onClick={closeAll}
            className="shrink-0 flex items-center"
          >
            <LogoWordmark className="[&>span:last-child]:text-[16px] sm:[&>span:last-child]:text-[20px]" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 text-[#18181b]" aria-label="Main navigation">
            {groups.map((group) => {
              const isOpen = activeGroup === group.id;
              return (
                <div
                  key={group.id}
                  className="relative"
                  onMouseEnter={() => handleMouseEnter(group.id)}
                  onMouseLeave={handleMouseLeave}
                >
                  <button
                    id={`desktop-${group.id}-trigger`}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`desktop-${group.id}-menu`}
                    onClick={() => {
                      clearHoverTimeout();
                      setActiveGroup(isOpen ? null : group.id);
                    }}
                    className={cn(
                      "inline-flex min-h-10 items-center gap-1.5 rounded-lg px-3 text-[13px] font-medium transition-colors cursor-pointer",
                      isOpen ? "bg-[#f5f5f5] text-[#18181b]" : "bg-transparent text-[#52525b] hover:bg-[#f5f5f5] hover:text-[#18181b]",
                    )}
                  >
                    <span>{group.label}</span>
                    <ChevronDown
                      size={13}
                      className={cn("transition-transform duration-200", isOpen && "rotate-180")}
                    />
                  </button>

                  {isOpen && (
                    <div
                      id={`desktop-${group.id}-menu`}
                      onMouseEnter={() => handleMouseEnter(group.id)}
                      onMouseLeave={handleMouseLeave}
                      className="absolute top-[calc(100%+14px)] -left-2 z-50 grid w-[300px] gap-1 rounded-2xl border border-[#e4e4e7] bg-white p-2 shadow-[0_16px_40px_-12px_rgba(24,24,27,0.18)]"
                    >
                      {group.links.map((item) => (
                        <Link
                          key={item.label}
                          href={item.href}
                          onClick={closeAll}
                          className="block rounded-xl p-3 transition-colors hover:bg-[#f7f7f7] no-underline group"
                        >
                          <strong className="block text-[13.5px] font-semibold text-[#18181b] group-hover:text-[#c63838] transition-colors">
                            {item.label}
                          </strong>
                          <span className="block mt-0.5 text-[11.5px] text-[#71717a] leading-[1.45]">
                            {item.description}
                          </span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            <Link
              href="/pricing"
              onClick={closeAll}
              className="inline-flex min-h-10 items-center rounded-lg px-3 text-[13px] font-medium text-[#52525b] transition-colors hover:bg-[#f5f5f5] hover:text-[#18181b]"
            >
              Pricing
            </Link>
          </nav>

          {/* Header Actions */}
          <div className="ml-auto flex items-center gap-1.5 sm:gap-3 lg:ml-0">
            {user && (
              <div className="relative">
                <button
                  id="desktop-account-trigger"
                  type="button"
                  aria-label="Your profile"
                  aria-expanded={activeGroup === "account"}
                  aria-controls="header-profile"
                  onClick={() => {
                    clearHoverTimeout();
                    setMobileOpen(false);
                    setProfileError(null);
                    setActiveGroup(activeGroup === "account" ? null : "account");
                  }}
                  className="inline-flex min-h-10 shrink-0 cursor-pointer items-center gap-1.5 rounded-lg px-2.5 text-[12px] font-medium text-[#52525b] transition-colors hover:bg-[#f5f5f5] hover:text-[#18181b] sm:gap-2 sm:px-3 sm:text-[13px]"
                >
                  <span className="sm:hidden">Account</span>
                  <span className="hidden sm:inline">My account</span>
                  <ChevronDown size={14} aria-hidden="true" className={activeGroup === "account" ? "rotate-180 transition-transform" : "transition-transform"} />
                </button>
                {activeGroup === "account" && (
                  <div id="header-profile" className="absolute right-0 top-[calc(100%+12px)] z-50 w-[260px] max-w-[calc(100vw-32px)] rounded-2xl border border-[#e4e4e7] bg-white p-4 shadow-[0_12px_32px_-12px_rgba(24,24,27,0.2)]">
                    <p className="truncate text-sm font-semibold text-[#18181b]">{user.user_metadata?.full_name || "Your account"}</p>
                    <p className="mt-1 truncate text-xs text-[#71717a]">{user.email}</p>
                    <div className="mt-4 border-t border-[#ededf0] pt-2">
                      <Link href="/studio" onClick={closeAll} className="block rounded-lg px-3 py-2.5 text-[13px] text-[#52525b] hover:bg-[#f5f5f5]">My projects</Link>
                      <Link href="/support" onClick={closeAll} className="block rounded-lg px-3 py-2.5 text-[13px] text-[#52525b] hover:bg-[#f5f5f5]">Help &amp; support</Link>
                      <button type="button" onClick={async () => {
                        const { error } = await signOut();
                        if (error) setProfileError(error.message);
                        else closeAll();
                      }} className="block w-full cursor-pointer rounded-lg px-3 py-2.5 text-left text-[13px] text-[#b32e2e] hover:bg-[#fbeeee]">Sign out</button>
                      {profileError && <p role="alert" className="mt-2 text-xs text-[#b32e2e]">{profileError}</p>}
                    </div>
                  </div>
                )}
              </div>
            )}
            {!user && (
              <button
                type="button"
                onClick={signIn}
                className="hidden min-h-10 items-center rounded-lg px-3 text-[13px] font-medium text-[#52525b] transition-colors hover:bg-[#f5f5f5] hover:text-[#18181b] sm:inline-flex cursor-pointer"
              >
                Sign in
              </button>
            )}

            <Link
              href="/studio"
              onClick={closeAll}
              className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-lg bg-[#c63838] px-3 text-[12px] font-semibold text-white transition-colors hover:bg-[#ac3030] sm:px-4 sm:text-[13px] cursor-pointer"
            >
              <span className="sm:hidden">{user ? "Studio" : "Get started"}</span><span className="hidden sm:inline">{user ? "Open studio" : "Get started free"}</span>
              <ArrowUpRight size={14} className="hidden sm:block" aria-hidden="true" />
            </Link>

            {/* Mobile menu toggle */}
            <button
              type="button"
              ref={toggleRef}
              aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-navigation"
              onClick={() => {
                setMobileOpen(!mobileOpen);
                setActiveGroup(null);
              }}
              className="grid size-9 shrink-0 place-items-center rounded-lg text-[#52525b] transition-colors hover:bg-[#f5f5f5] lg:hidden cursor-pointer"
            >
              {mobileOpen ? <X size={21} /> : <Menu size={21} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileOpen && (
          <nav
            id="mobile-navigation"
            aria-label="Mobile navigation"
            className="absolute inset-x-0 top-[calc(100%+8px)] flex max-h-[calc(100dvh-100px)] flex-col gap-2 overflow-y-auto rounded-2xl border border-[#e4e4e7] bg-white p-5 shadow-[0_16px_36px_-12px_rgba(24,24,27,0.2)] lg:hidden"
          >
            {groups.map((group) => {
              const isOpen = activeGroup === group.id;
              return (
                <div key={group.id} className="flex flex-col border-b border-black/5 pb-1">
                  <button
                    id={`mobile-${group.id}-trigger`}
                    type="button"
                    onClick={() => setActiveGroup(isOpen ? null : group.id)}
                    aria-expanded={isOpen}
                    aria-controls={`mobile-${group.id}-menu`}
                    className="flex items-center justify-between w-full py-2.5 text-base font-semibold text-[#18181b] hover:text-[#c63838] transition cursor-pointer"
                  >
                    <span>{group.label}</span>
                    <ChevronDown
                      size={15}
                      className={cn("transition-transform duration-200", isOpen && "rotate-180")}
                    />
                  </button>

                  {isOpen && (
                    <div id={`mobile-${group.id}-menu`} className="flex flex-col gap-2 pl-3 py-2 bg-black/[0.02] rounded-xl mb-2">
                      {group.links.map((item) => (
                        <Link
                          key={item.label}
                          href={item.href}
                          onClick={closeAll}
                          className="py-1 text-sm font-medium text-[#5b5b65] hover:text-[#c63838] transition"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            <Link
              href="/pricing"
              onClick={closeAll}
              className="py-2.5 text-base font-semibold text-[#18181b] hover:text-[#c63838] transition border-b border-black/5"
            >
              Pricing
            </Link>

            {!user && (
              <button
                type="button"
                onClick={signIn}
                className="text-left py-2.5 text-base font-semibold text-[#18181b] hover:text-[#c63838] transition cursor-pointer"
              >
                Sign in
              </button>
            )}
          </nav>
        )}
      </header>
    </>
  );
}
