"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../store/auth-store";

const DESTINATION_KEY = "everykaptions_signin_destination";
const isWorkspacePath = (path: string) => /^\/(studio|editor)(\/|$)/.test(path);

export function AuthProvider({ children }: { children: ReactNode }) {
  const initAuth = useAuthStore((state) => state.initAuth);
  const user = useAuthStore((state) => state.user);
  const router = useRouter();
  const destination = useRef<string | null>(null);

  useEffect(() => {
    const cleanup = initAuth();
    return cleanup;
  }, [initAuth]);

  useEffect(() => {
    const requireSignIn = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || useAuthStore.getState().user) return;
      const link = event.target instanceof Element ? event.target.closest("a[href]") : null;
      if (!link) return;
      const url = new URL(link.getAttribute("href")!, window.location.href);
      if (url.origin !== window.location.origin || !isWorkspacePath(url.pathname)) return;
      event.preventDefault();
      event.stopPropagation();
      destination.current = url.pathname + url.search + url.hash;
      try { sessionStorage.setItem(DESTINATION_KEY, destination.current); } catch { /* Continue without browser persistence. */ }
      useAuthStore.getState().openAuthModal("signin");
    };
    document.addEventListener("click", requireSignIn, true);
    return () => document.removeEventListener("click", requireSignIn, true);
  }, []);

  useEffect(() => {
    if (!user) return;
    let requested = destination.current;
    try {
      requested ??= sessionStorage.getItem(DESTINATION_KEY);
      sessionStorage.removeItem(DESTINATION_KEY);
    } catch { /* Use the in-memory destination when storage is unavailable. */ }
    destination.current = null;
    if (!requested) return;
    const url = new URL(requested, window.location.origin);
    if (url.origin === window.location.origin && isWorkspacePath(url.pathname)) {
      router.push(url.pathname + url.search + url.hash);
    }
  }, [user, router]);

  return <>{children}</>;
}
