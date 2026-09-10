"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/shared/lib/cn";
import { useAuth } from "../store/auth-store";

export function AuthModal() {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authModalMode,
    setAuthModalMode,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    resetPassword,
  } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Clear messages on modal open / mode switch
  useEffect(() => {
    setErrorMsg(null);
    setSuccessMsg(null);
  }, [authModalMode, isAuthModalOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isAuthModalOpen) {
        closeAuthModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isAuthModalOpen, closeAuthModal]);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsSubmitting(true);

    if (!email) {
      setErrorMsg("Please enter your email address.");
      setIsSubmitting(false);
      return;
    }

    if (authModalMode === "forgot") {
      const { error } = await resetPassword(email);
      setIsSubmitting(false);
      if (error) {
        setErrorMsg(error.message);
      } else {
        setSuccessMsg("Password reset link sent! Check your inbox.");
      }
      return;
    }

    if (!password) {
      setErrorMsg("Please enter your password.");
      setIsSubmitting(false);
      return;
    }

    if (authModalMode === "signin") {
      const { error } = await signInWithEmail(email, password);
      setIsSubmitting(false);
      if (error) {
        setErrorMsg(error.message);
      } else {
        closeAuthModal();
      }
    } else if (authModalMode === "signup") {
      if (password.length < 8) {
        setErrorMsg("Password must be at least 8 characters.");
        setIsSubmitting(false);
        return;
      }
      if (!agreeTerms) {
        setErrorMsg("You must agree to the Terms of Service and Privacy Policy to continue.");
        setIsSubmitting(false);
        return;
      }
      const { error } = await signUpWithEmail(email, password);
      setIsSubmitting(false);
      if (error) {
        setErrorMsg(error.message);
      } else {
        setSuccessMsg("Account created! Check your email to confirm registration.");
      }
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg(null);
    const { error } = await signInWithGoogle();
    if (error) {
      setErrorMsg(error.message);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="authModalTitle"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeAuthModal();
      }}
    >
      <div className="w-full max-w-[420px] bg-[#14120f] border border-[rgba(244,236,220,0.14)] rounded-[24px] p-6 sm:p-7 shadow-[0_24px_80px_rgba(0,0,0,0.85)] flex flex-col my-auto relative animate-[fadeUp_0.2s_ease_both]">
        {/* Title & Subtitle */}
        <h2
          id="authModalTitle"
          className="text-[24px] sm:text-[26px] font-bold text-[#f4ecdc] tracking-[-0.02em] text-center mb-1 font-display"
        >
          {authModalMode === "forgot"
            ? "Reset your password"
            : "Sign in to Replix Captions"}
        </h2>
        <p className="text-[13px] sm:text-[14px] text-[#8a8478] text-center mb-5">
          {authModalMode === "forgot"
            ? "Enter your email to receive a password reset link."
            : "Sign in or create your free account."}
        </p>

        {/* Continue with Google */}
        {authModalMode !== "forgot" && (
          <>
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full min-h-[46px] sm:min-h-[48px] bg-white hover:bg-[#f0ece1] text-[#0c0b0a] font-semibold text-[14px] rounded-full flex items-center justify-center gap-3 transition-colors cursor-pointer shadow-sm"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="my-4 flex items-center justify-center text-[12px] text-[#8a8478]">
              <span className="px-2">or</span>
            </div>

            {/* Segmented Switcher [Sign in | Create account] */}
            <div className="flex p-1 bg-[#1a1714] border border-[rgba(244,236,220,0.08)] rounded-full mb-4">
              <button
                type="button"
                onClick={() => setAuthModalMode("signin")}
                className={cn(
                  "flex-1 py-2 text-[13px] font-semibold rounded-full transition-colors cursor-pointer",
                  authModalMode === "signin"
                    ? "bg-[#f4ecdc] text-[#0c0b0a]"
                    : "text-[#8a8478] hover:text-[#f4ecdc]"
                )}
              >
                Sign in
              </button>
              <button
                type="button"
                onClick={() => setAuthModalMode("signup")}
                className={cn(
                  "flex-1 py-2 text-[13px] font-semibold rounded-full transition-colors cursor-pointer",
                  authModalMode === "signup"
                    ? "bg-[#f4ecdc] text-[#0c0b0a]"
                    : "text-[#8a8478] hover:text-[#f4ecdc]"
                )}
              >
                Create account
              </button>
            </div>
          </>
        )}

        {/* Error / Success feedback */}
        {errorMsg && (
          <div className="mb-3 px-3 py-2 rounded-lg bg-red-950/60 border border-red-500/30 text-red-300 text-xs text-center">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="mb-3 px-3 py-2 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs text-center">
            {successMsg}
          </div>
        )}

        {/* Form fields */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label className="sr-only" htmlFor="authEmail">Email address</label>
            <input
              id="authEmail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full bg-[#0d0c0a] border border-[rgba(244,236,220,0.14)] hover:border-[#cfa663]/70 focus:border-[#cfa663] focus:ring-1 focus:ring-[#cfa663]/40 focus:shadow-[0_0_14px_rgba(207,166,99,0.22)] focus:outline-none rounded-xl px-4 py-3 text-[14px] text-[#f4ecdc] placeholder-[#554f44] transition-all"
            />
          </div>

          {authModalMode !== "forgot" && (
            <div>
              <label className="sr-only" htmlFor="authPassword">Password</label>
              <input
                id="authPassword"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                className="w-full bg-[#0d0c0a] border border-[rgba(244,236,220,0.14)] hover:border-[#cfa663]/70 focus:border-[#cfa663] focus:ring-1 focus:ring-[#cfa663]/40 focus:shadow-[0_0_14px_rgba(207,166,99,0.22)] focus:outline-none rounded-xl px-4 py-3 text-[14px] text-[#f4ecdc] placeholder-[#554f44] transition-all"
              />
            </div>
          )}

          {/* Password requirement for Create account */}
          {authModalMode === "signup" && (
            <div className="flex items-center gap-2 text-[12px] -mt-1 mb-0.5">
              <span
                className={cn(
                  "w-[18px] h-[18px] rounded-full flex items-center justify-center shrink-0 transition-colors",
                  password.length >= 8
                    ? "bg-[#22c55e] text-black"
                    : "border-2 border-[#5c5850] text-transparent"
                )}
              >
                {password.length >= 8 && (
                  <svg
                    className="w-3 h-3"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </span>
              <span
                className={cn(
                  "transition-colors font-medium",
                  password.length >= 8 ? "text-[#22c55e]" : "text-[#8a8478]"
                )}
              >
                At least 8 characters
              </span>
            </div>
          )}

          {/* Checkboxes for Create account */}
          {authModalMode === "signup" && (
            <div className="flex flex-col gap-3 my-1.5 text-left">
              {/* Checkbox 1: Terms of Service & Privacy Policy */}
              <label className="flex items-start gap-3 cursor-pointer select-none group">
                <div
                  role="checkbox"
                  aria-checked={agreeTerms}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === " " || e.key === "Enter") {
                      e.preventDefault();
                      setAgreeTerms(!agreeTerms);
                    }
                  }}
                  onClick={() => setAgreeTerms(!agreeTerms)}
                  className={cn(
                    "w-[18px] h-[18px] rounded-[5px] flex items-center justify-center shrink-0 transition-all mt-0.5 cursor-pointer",
                    agreeTerms
                      ? "bg-white text-black shadow-sm"
                      : "bg-transparent border-2 border-[#5c5850] group-hover:border-[#8a8478]"
                  )}
                >
                  {agreeTerms && (
                    <svg
                      className="w-3.5 h-3.5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
                <span className="text-[12px] sm:text-[13px] text-[#a8a195] leading-[1.45]">
                  I agree to the{" "}
                  <Link
                    href="/legal/terms"
                    target="_blank"
                    className="text-[#f4ecdc] hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/legal/privacy"
                    target="_blank"
                    className="text-[#f4ecdc] hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Privacy Policy
                  </Link>
                  , and I understand the free plan includes 3 minutes of
                  captioning and 3 watermarked exports each month.
                </span>
              </label>

              {/* Checkbox 2: Email product updates */}
              <label className="flex items-center gap-3 cursor-pointer select-none group">
                <div
                  role="checkbox"
                  aria-checked={emailUpdates}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === " " || e.key === "Enter") {
                      e.preventDefault();
                      setEmailUpdates(!emailUpdates);
                    }
                  }}
                  onClick={() => setEmailUpdates(!emailUpdates)}
                  className={cn(
                    "w-[18px] h-[18px] rounded-[5px] flex items-center justify-center shrink-0 transition-all cursor-pointer",
                    emailUpdates
                      ? "bg-white text-black shadow-sm"
                      : "bg-transparent border-2 border-[#5c5850] group-hover:border-[#8a8478]"
                  )}
                >
                  {emailUpdates && (
                    <svg
                      className="w-3.5 h-3.5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
                <span className="text-[12px] sm:text-[13px] text-[#a8a195]">
                  Email me product updates and offers.
                </span>
              </label>
            </div>
          )}

          {/* Forgot password link */}
          {authModalMode === "signin" && (
            <button
              type="button"
              onClick={() => setAuthModalMode("forgot")}
              className="text-[12px] sm:text-[13px] font-medium text-amber hover:underline text-right -mt-1 self-end cursor-pointer"
            >
              Forgot password?
            </button>
          )}

          {/* Action button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full min-h-[46px] sm:min-h-[48px] bg-[#f4ecdc] hover:bg-[#ede3ce] disabled:opacity-50 text-[#0c0b0a] font-bold text-[14px] sm:text-[15px] rounded-full transition-all mt-1 cursor-pointer"
          >
            {isSubmitting
              ? "Please wait..."
              : authModalMode === "signin"
              ? "Sign in"
              : authModalMode === "signup"
              ? "Create account"
              : "Send reset link"}
          </button>
        </form>

        {/* Back to sign in / Cancel */}
        {authModalMode === "forgot" ? (
          <button
            type="button"
            onClick={() => setAuthModalMode("signin")}
            className="mt-3 text-[13px] text-amber hover:underline transition-colors self-center cursor-pointer"
          >
            ← Back to sign in
          </button>
        ) : (
          <button
            type="button"
            onClick={closeAuthModal}
            className="mt-3 text-[13px] text-[#8a8478] hover:text-[#f4ecdc] transition-colors self-center cursor-pointer"
          >
            Cancel
          </button>
        )}

        {/* Terms & Privacy disclaimer */}
        {authModalMode !== "signup" && (
          <p className="text-[11px] text-[#8a8478] text-center mt-4 leading-relaxed">
            By continuing, you agree to the{" "}
            <Link
              href="/legal/terms"
              onClick={closeAuthModal}
              className="text-amber hover:underline font-medium"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/legal/privacy"
              onClick={closeAuthModal}
              className="text-amber hover:underline font-medium"
            >
              Privacy Policy
            </Link>
            .
          </p>
        )}
      </div>
    </div>
  );
}
