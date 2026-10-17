"use client";

import { ChevronDown, Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/features/auth/store/auth-store";
import { LogoWordmark } from "./logo-wordmark";

const groups = [
  {
    id: "features",
    label: "Features",
    links: [
      { label: "Auto captions", description: "Turn speech into editable captions", href: "/#features" },
      { label: "Caption styles", description: "Find the look that feels like you", href: "/#presets" },
      { label: "Word-level timing", description: "Keep every word in sync", href: "/#word-timing" },
      { label: "Video & subtitle exports", description: "Finish your video or download the words", href: "/#how-it-works" },
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
      { label: "How it works", description: "From upload to ready-to-post", href: "/#how-it-works" },
      { label: "Roadmap", description: "See what’s coming next", href: "/roadmap" },
      { label: "Help & support", description: "Get a little help from the team", href: "/support" },
      { label: "Frequently asked questions", description: "A few helpful answers", href: "/#faq" },
    ],
  },
];

export function SiteHeader() {
  const { user, openAuthModal } = useAuth();
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

  const handleMouseEnter = (groupId: string) => { clearHoverTimeout(); setActiveGroup(groupId); };
  const handleMouseLeave = () => {
    clearHoverTimeout();
    hoverTimeoutRef.current = setTimeout(() => setActiveGroup(null), 150);
  };
  const closeAll = () => { clearHoverTimeout(); setActiveGroup(null); setMobileOpen(false); };

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
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[300] focus:bg-surface focus:p-3"
      >
        Skip to content
      </a>
      <header className="site-header" ref={headerRef}>
        <div className="site-header-inner">
          <Link href="/" aria-label="EveryKaptions homepage" onClick={closeAll}>
            <LogoWordmark />
          </Link>
          <nav className="site-nav" aria-label="Main navigation">
            {groups.map((group) => (
              <div
                className="site-nav-group"
                key={group.id}
                onMouseEnter={() => handleMouseEnter(group.id)}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  id={`desktop-${group.id}-trigger`}
                  type="button"
                  aria-expanded={activeGroup === group.id}
                  aria-controls={`desktop-${group.id}-menu`}
                  onClick={() => {
                    clearHoverTimeout();
                    setActiveGroup(activeGroup === group.id ? null : group.id);
                  }}
                >
                  {group.label}
                  <ChevronDown size={13} />
                </button>
                {activeGroup === group.id && (
                  <div
                    className="site-dropdown"
                    id={`desktop-${group.id}-menu`}
                    onMouseEnter={() => handleMouseEnter(group.id)}
                    onMouseLeave={handleMouseLeave}
                  >
                    {group.links.map((item) => (
                      <Link key={item.label} href={item.href} onClick={closeAll}>
                        <strong>{item.label}</strong>
                        <span>{item.description}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <Link href="/pricing" onClick={closeAll}>Pricing</Link>
          </nav>
          <div className="site-header-actions">
            {!user && <button type="button" className="header-signin" onClick={signIn}>Sign in</button>}
            <Link href="/studio" className="header-studio-link" onClick={closeAll}>Open studio</Link>
            <button
              type="button"
              ref={toggleRef}
              className="header-menu-toggle"
              aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-navigation"
              onClick={() => {
                setMobileOpen(!mobileOpen);
                setActiveGroup(null);
              }}
            >
              {mobileOpen ? <X size={21} /> : <Menu size={21} />}
            </button>
          </div>
        </div>
        {mobileOpen && (
          <nav
            id="mobile-navigation"
            className="mobile-site-nav"
            aria-label="Mobile navigation"
          >
            {groups.map((group) => (
              <div className="mobile-nav-group" key={group.id}>
                <button
                  id={`mobile-${group.id}-trigger`}
                  type="button"
                  onClick={() =>
                    setActiveGroup(activeGroup === group.id ? null : group.id)
                  }
                  aria-expanded={activeGroup === group.id}
                  aria-controls={`mobile-${group.id}-menu`}
                >
                  {group.label}
                  <ChevronDown size={15} />
                </button>
                {activeGroup === group.id && (
                  <div id={`mobile-${group.id}-menu`}>
                    {group.links.map((item) => (
                      <Link key={item.label} href={item.href} onClick={closeAll}>
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <Link href="/pricing" onClick={closeAll}>Pricing</Link>
            {!user && <button type="button" onClick={signIn}>Sign in</button>}
          </nav>
        )}
      </header>
    </>
  );
}
