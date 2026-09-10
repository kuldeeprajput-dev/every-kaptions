"use client";

import { useEffect, type ReactNode } from "react";
import { useAuthStore } from "../store/auth-store";

export function AuthProvider({ children }: { children: ReactNode }) {
  const initAuth = useAuthStore((state) => state.initAuth);

  useEffect(() => {
    const cleanup = initAuth();
    return cleanup;
  }, [initAuth]);

  return <>{children}</>;
}
