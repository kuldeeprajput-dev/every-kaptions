"use client";

import { create } from "zustand";
import type { User, Session } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase-client";

export type AuthModalMode = "signin" | "signup" | "forgot";

export interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  authModalMode: AuthModalMode;

  // Modal actions
  openAuthModal: (mode?: AuthModalMode) => void;
  closeAuthModal: () => void;
  setAuthModalMode: (mode: AuthModalMode) => void;

  // State setters
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setIsLoading: (isLoading: boolean) => void;

  // Supabase Auth Actions
  initAuth: () => () => void;
  signInWithEmail: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUpWithEmail: (email: string, password: string) => Promise<{ error: Error | null; data?: unknown }>;
  signInWithGoogle: () => Promise<{ error: Error | null }>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<{ error: Error | null }>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  isLoading: true,
  isAuthModalOpen: false,
  authModalMode: "signin",

  openAuthModal: (mode: AuthModalMode = "signin") => {
    set({ authModalMode: mode, isAuthModalOpen: true });
  },

  closeAuthModal: () => {
    set({ isAuthModalOpen: false });
  },

  setAuthModalMode: (mode: AuthModalMode) => {
    set({ authModalMode: mode });
  },

  setUser: (user: User | null) => set({ user }),
  setSession: (session: Session | null) => set({ session }),
  setIsLoading: (isLoading: boolean) => set({ isLoading }),

  initAuth: () => {
    let isMounted = true;

    // Fetch initial session
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        if (isMounted) {
          set({
            session,
            user: session?.user ?? null,
            isLoading: false,
          });
        }
      })
      .catch(() => {
        if (isMounted) {
          set({ isLoading: false });
        }
      });

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (isMounted) {
        set((state) => ({
          session,
          user: session?.user ?? null,
          isLoading: false,
          isAuthModalOpen: session ? false : state.isAuthModalOpen,
        }));
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  },

  signInWithEmail: async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { error };
    } catch (err: unknown) {
      return { error: err as Error };
    }
  },

  signUpWithEmail: async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      return { data, error };
    } catch (err: unknown) {
      return { error: err as Error };
    }
  },

  signInWithGoogle: async () => {
    try {
      const redirectUrl =
        typeof window !== "undefined"
          ? `${window.location.origin}${window.location.pathname === "/studio" || window.location.pathname.startsWith("/studio/") || window.location.pathname.startsWith("/editor/") ? window.location.pathname + window.location.search : "/"}`
          : undefined;

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectUrl,
        },
      });
      return { error };
    } catch (err: unknown) {
      return { error: err as Error };
    }
  },

  resetPassword: async (email: string) => {
    try {
      const redirectUrl =
        typeof window !== "undefined"
          ? `${window.location.origin}/`
          : undefined;

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      });
      return { error };
    } catch (err: unknown) {
      return { error: err as Error };
    }
  },

  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (!error) {
        set({ user: null, session: null });
      }
      return { error };
    } catch (err: unknown) {
      return { error: err as Error };
    }
  },
}));

// Convenience hook alias
export const useAuth = useAuthStore;

// Re-export AuthProvider component
export { AuthProvider } from "../components/auth-provider";

