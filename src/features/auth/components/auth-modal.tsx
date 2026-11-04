"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Eye, EyeOff, X } from "lucide-react";
import { LogoWordmark } from "@/shared/components/logo-wordmark";
import { useDialogFocus } from "@/shared/hooks/use-dialog-focus";
import { useAuth } from "../store/auth-store";

export function AuthModal() {
  const { isAuthModalOpen } = useAuth();
  return isAuthModalOpen ? <AuthModalContent /> : null;
}

function AuthModalContent() {
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
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dialogRef = useRef<HTMLDivElement>(null);
  useDialogFocus(dialogRef, isAuthModalOpen);

  const handleClose = useCallback(() => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setShowPassword(false);
    closeAuthModal();
  }, [closeAuthModal]);

  const changeMode = (mode: typeof authModalMode) => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setShowPassword(false);
    setAuthModalMode(mode);
  };

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isAuthModalOpen) {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isAuthModalOpen, handleClose]);

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
        handleClose();
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

  const isSignup = authModalMode === "signup";
  const isForgot = authModalMode === "forgot";

  return (
    <div className="auth-overlay fixed [inset:0] z-[200] flex items-center justify-center overflow-y-auto [padding:24px] [background:rgba(24,_24,_27,_.48)] [-webkit-backdrop-filter:blur(5px)] [backdrop-filter:blur(5px)] product-max-767:[padding:12px]" onClick={(event) => {
      if (event.target === event.currentTarget) handleClose();
    }}>
      <div ref={dialogRef} className="auth-card relative grid [grid-template-columns:.85fr_1.15fr] w-[860px] max-w-[100%] max-h-[calc(100dvh_-_48px)] [margin:auto] overflow-y-auto [border:1px_solid_#e4e4e7] rounded-[20px] [background:#fff] [box-shadow:0_24px_80px_rgba(24,_24,_27,_.22)] [animation:fadeUp_.2s_both] [&_button:disabled]:opacity-[.6] [&_button:disabled]:cursor-wait [&_input:disabled]:opacity-[.6] [&_input:disabled]:cursor-wait product-max-767:block product-max-767:max-w-[440px] product-max-767:max-h-[calc(100dvh_-_24px)] product-max-767:rounded-[16px] motion-reduce:[animation:none]" role="dialog" aria-modal="true" aria-labelledby="authModalTitle" aria-describedby="authModalDescription">
        <aside className="auth-story flex flex-col justify-between gap-[42px] [padding:32px] [border-right:1px_solid_#eaeaec] [background:#fafafa] [color:#18181b] [&_h2]:[margin:0] [&_h2]:text-[35px] [&_h2]:font-[750] [&_h2]:leading-[1.12] [&_h2]:tracking-[-.055em] [&_p]:[margin:18px_0_0] [&_p]:[color:#71717a] [&_p]:text-[13px] [&_p]:leading-[1.8] [&_>_small]:[color:#8a8a94] [&_>_small]:text-[11px] product-max-767:hidden">
          <LogoWordmark />
          <div className="auth-story-content">
            <h2>Your words.<br />Worth watching.</h2>
            <p>Clean, expressive captions.<br />Made for the way you speak.</p>
            <div className="auth-caption-samples flex flex-col items-start gap-[10px] mt-[32px] [&_span]:[padding:8px_12px] [&_span]:rounded-[7px] [&_span]:[background:#18181b] [&_span]:[color:#fff] [&_span]:text-[21px] [&_span]:font-[600] [&_span]:leading-[1.5] [&_span]:tracking-[-.035em] [&_span:nth-child(2)]:ml-[16px] [&_span:nth-child(2)]:[background:#c63838] [&_span:nth-child(3)]:ml-[7px] [&_span:nth-child(3)]:[border:1px_solid_#e4e4e7] [&_span:nth-child(3)]:[background:#fff] [&_span:nth-child(3)]:[color:#18181b]" aria-label="Caption examples in Telugu, Hindi, and English">
              <span lang="te">మీ కథ</span>
              <span lang="hi">आपकी आवाज़</span>
              <span>Your story.</span>
            </div>
          </div>
          <small>Every word. Your way.</small>
        </aside>

        <div className="auth-form-panel relative flex flex-col [min-width:0] [padding:46px_36px_32px] [background:#fff] [color:#18181b] product-max-767:[padding:30px_24px_26px]">
          <button type="button" aria-label="Close account dialog" onClick={handleClose} className="auth-close absolute [top:14px] [right:14px] grid [place-items:center] w-[32px] h-[32px] [padding:0] [border:0] rounded-[8px] [background:transparent] [color:#71717a] cursor-pointer [&:hover]:[background:#f4f4f5] [&:hover]:[color:#18181b] product-max-767:[top:12px] product-max-767:[right:12px]"><X size={18} aria-hidden="true" /></button>
          <div className="auth-mobile-brand hidden product-max-767:block product-max-767:mb-[30px] product-max-767:[&_>_span]:text-[18px]"><LogoWordmark /></div>
          <header className="auth-heading [&_h2]:[margin:0] [&_h2]:text-[28px] [&_h2]:font-[700] [&_h2]:leading-[1.2] [&_h2]:tracking-[-.045em] [&_p]:[margin:10px_0_0] [&_p]:[color:#71717a] [&_p]:text-[13px] [&_p]:leading-[1.7] [&_+_.auth-feedback]:mt-[24px] product-max-767:[&_h2]:text-[27px]">
            <h2 id="authModalTitle">{isForgot ? "Reset your password." : isSignup ? "Create your account." : "Welcome back."}</h2>
            <p id="authModalDescription">{isForgot ? "We’ll email you a link to choose a new password." : isSignup ? "Start with 3 free minutes of captioning." : "Get back to your captions."}</p>
          </header>

          {!isForgot && (
            <>
              <div className="auth-mode-switch flex gap-[4px] [margin:24px_0_20px] [padding:4px] [border:1px_solid_#e4e4e7] rounded-[11px] [background:#fafafa] [&_button]:[flex:1] [&_button]:min-h-[38px] [&_button]:[padding:8px] [&_button]:[border:0] [&_button]:rounded-[8px] [&_button]:[background:transparent] [&_button]:[color:#71717a] [&_button]:text-[13px] [&_button]:font-[600] [&_button]:cursor-pointer [&_button]:[transition:color_.15s,_background-color_.15s] [&_button:hover]:[color:#18181b] [&_button[aria-pressed=true]]:[background:#c63838] [&_button[aria-pressed=true]]:[color:#fff]" role="group" aria-label="Account access">
                <button type="button" aria-pressed={!isSignup} disabled={isSubmitting} onClick={() => changeMode("signin")}>Sign in</button>
                <button type="button" aria-pressed={isSignup} disabled={isSubmitting} onClick={() => changeMode("signup")}>Create account</button>
              </div>
              <button type="button" onClick={handleGoogleSignIn} disabled={isSubmitting} className="auth-google flex items-center justify-center gap-[11px] w-[100%] min-h-[46px] [padding:10px_14px] [border:1px_solid_#e4e4e7] rounded-[10px] [background:#fff] [color:#3f3f46] text-[13px] font-[600] cursor-pointer [transition:background-color_.15s] [&:hover]:[background:#fafafa] [&_svg]:shrink-[0]">
              <svg width="18" height="18" aria-hidden="true" viewBox="0 0 24 24">
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
              <div className="auth-divider flex items-center gap-[12px] [margin:20px_0] [color:#92929c] text-[11px] [&::before]:[content:''] [&::before]:[flex:1] [&::before]:h-[1px] [&::before]:[background:#ededf0] [&::after]:[content:''] [&::after]:[flex:1] [&::after]:h-[1px] [&::after]:[background:#ededf0] [&_+_.auth-form]:mt-[0]"><span>or use your email</span></div>
            </>
          )}

          {errorMsg && <div role="alert" className="auth-feedback auth-feedback-error [&_+_.auth-form]:mt-[0] mb-[18px] [padding:12px] [border:1px_solid] rounded-[10px] text-[12px] leading-[1.7] [border-color:#f1caca] [background:#fdf3f3] [color:#a52b2b]">{errorMsg}</div>}
          {successMsg && <div role="status" className="auth-feedback auth-feedback-success [&_+_.auth-form]:mt-[0] mb-[18px] [padding:12px] [border:1px_solid] rounded-[10px] text-[12px] leading-[1.7] [border-color:#cce5d7] [background:#f4faf6] [color:#25633e]">{successMsg}</div>}

          <form onSubmit={handleSubmit} className="auth-form flex flex-col gap-[18px] mt-[24px]" aria-busy={isSubmitting}>
            <div className="auth-field flex flex-col gap-[8px] [&_label]:[color:#3f3f46] [&_label]:text-[12px] [&_label]:font-[600] [&_input]:block [&_input]:w-[100%] [&_input]:h-[46px] [&_input]:[padding:11px_13px] [&_input]:[border:1px_solid_#dedee5] [&_input]:rounded-[10px] [&_input]:[background:#fafafa] [&_input]:[color:#18181b] [&_input]:text-[13px] [&_input]:[transition:border-color_.15s,_background-color_.15s] [&_input::placeholder]:[color:#9999a3] [&_input:focus]:[outline:none]! [&_input:focus]:[border-color:#c63838] [&_input:focus]:[background:#fff]">
              <label htmlFor="authEmail">Email address</label>
              <input id="authEmail" type="email" name="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" required disabled={isSubmitting} />
            </div>

            {!isForgot && (
              <div className="auth-field flex flex-col gap-[8px] [&_label]:[color:#3f3f46] [&_label]:text-[12px] [&_label]:font-[600] [&_input]:block [&_input]:w-[100%] [&_input]:h-[46px] [&_input]:[padding:11px_13px] [&_input]:[border:1px_solid_#dedee5] [&_input]:rounded-[10px] [&_input]:[background:#fafafa] [&_input]:[color:#18181b] [&_input]:text-[13px] [&_input]:[transition:border-color_.15s,_background-color_.15s] [&_input::placeholder]:[color:#9999a3] [&_input:focus]:[outline:none]! [&_input:focus]:[border-color:#c63838] [&_input:focus]:[background:#fff]">
                <div className="auth-field-heading flex flex-wrap items-center justify-between gap-[8px]">
                  <label htmlFor="authPassword">Password</label>
                  {!isSignup && <button type="button" className="auth-text-button [padding:0] [border:0] [background:transparent] [color:#b32e2e] text-[11px] font-[500] cursor-pointer [&:hover]:[text-decoration:underline] [&:hover]:[text-underline-offset:3px]" disabled={isSubmitting} onClick={() => changeMode("forgot")}>Forgot password?</button>}
                </div>
                <div className="auth-password relative [&_input]:pr-[44px]">
                  <input id="authPassword" type={showPassword ? "text" : "password"} name="password" autoComplete={isSignup ? "new-password" : "current-password"} value={password} onChange={(event) => setPassword(event.target.value)} placeholder={isSignup ? "Create a password" : "Enter your password"} required minLength={isSignup ? 8 : undefined} disabled={isSubmitting} aria-describedby={isSignup ? "auth-password-hint" : undefined} />
                  <button type="button" className="auth-password-toggle absolute [top:5px] [right:5px] grid [place-items:center] w-[36px] h-[36px] [padding:0] [border:0] rounded-[7px] [background:transparent] [color:#92929c] cursor-pointer [&:hover]:[color:#18181b] [&:hover]:[background:#f0f0f2]" aria-label={showPassword ? "Hide password" : "Show password"} aria-pressed={showPassword} onClick={() => setShowPassword((shown) => !shown)}>
                    {showPassword ? <EyeOff size={17} aria-hidden="true" /> : <Eye size={17} aria-hidden="true" />}
                  </button>
                </div>
                {isSignup && <p id="auth-password-hint" className="auth-field-hint [margin:0] [color:#8a8a94] text-[11px] leading-[1.6]">Use at least 8 characters.</p>}
              </div>
            )}

            {isSignup && (
              <label className="auth-terms flex items-start gap-[10px] [color:#71717a] text-[12px] leading-[1.8] cursor-pointer [&_input]:shrink-[0] [&_input]:w-[16px] [&_input]:h-[16px] [&_input]:[margin:3px_0_0] [&_input]:[accent-color:#c63838] [&_input]:cursor-pointer [&_a]:[color:#b32e2e] [&_a]:[text-decoration:none] [&_a:hover]:[text-decoration:underline] [&_a:hover]:[text-underline-offset:3px]">
                <input type="checkbox" checked={agreeTerms} onChange={(event) => setAgreeTerms(event.target.checked)} required disabled={isSubmitting} />
                <span>I agree to the <Link href="/legal/terms" target="_blank" rel="noopener noreferrer">Terms of Service</Link> and <Link href="/legal/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</Link>.</span>
              </label>
            )}

            <button type="submit" disabled={isSubmitting} className="auth-submit flex items-center justify-center gap-[10px] w-[100%] min-h-[46px] mt-[2px] [padding:11px_16px] [border:0] rounded-[10px] [background:#c63838] [color:#fff] text-[13px] font-[600] cursor-pointer [transition:background-color_.15s] [&:hover]:[background:#ae2d2d]">
              {isSubmitting ? "Please wait…" : isForgot ? "Send reset link" : isSignup ? "Create account" : "Sign in"}
              {!isSubmitting && <ArrowRight size={16} aria-hidden="true" />}
            </button>
          </form>

          {isForgot ? (
            <button type="button" className="auth-back auth-text-button [padding:0] [border:0] [background:transparent] [color:#b32e2e] text-[12px] font-[500] cursor-pointer [&:hover]:[text-decoration:underline] [&:hover]:[text-underline-offset:3px] inline-flex items-center [align-self:center] gap-[8px] min-h-[36px] mt-[14px]" onClick={() => changeMode("signin")}><ArrowLeft size={15} aria-hidden="true" />Back to sign in</button>
          ) : !isSignup && (
            <p className="auth-policy-note [&_a]:[color:#b32e2e] [&_a]:[text-decoration:none] [&_a:hover]:[text-decoration:underline] [&_a:hover]:[text-underline-offset:3px] [margin:20px_0_0] [color:#92929c] text-[11px] leading-[1.8] text-center">By continuing, you agree to our <Link href="/legal/terms" onClick={handleClose}>Terms of Service</Link> and <Link href="/legal/privacy" onClick={handleClose}>Privacy Policy</Link>.</p>
          )}
        </div>
      </div>
    </div>
  );
}
