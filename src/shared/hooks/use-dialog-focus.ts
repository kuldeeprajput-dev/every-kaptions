"use client";
import { useEffect, type RefObject } from "react";

/** Keep keyboard navigation inside an open dialog and restore the trigger on close. */
export function useDialogFocus(
  ref: RefObject<HTMLElement | null>,
  open: boolean,
) {
  useEffect(() => {
    if (!open || !ref.current) return;
    const dialog = ref.current;
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const selector =
      'button:not(:disabled), a[href], input:not(:disabled):not([type="hidden"]), select:not(:disabled), textarea:not(:disabled), [tabindex="0"]';
    const focusable = () =>
      Array.from(dialog.querySelectorAll<HTMLElement>(selector)).filter(
        (node) => node.getClientRects().length > 0,
      );
    (
      dialog.querySelector<HTMLElement>('input[type="email"]') ?? focusable()[0]
    )?.focus();
    const trap = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;
      const controls = focusable();
      const first = controls[0],
        last = controls.at(-1);
      if (!first) {
        event.preventDefault();
        return;
      }
      if (
        event.shiftKey &&
        (document.activeElement === first ||
          !dialog.contains(document.activeElement))
      ) {
        event.preventDefault();
        last?.focus();
      } else if (
        !event.shiftKey &&
        (document.activeElement === last ||
          !dialog.contains(document.activeElement))
      ) {
        event.preventDefault();
        first.focus();
      }
    };
    dialog.addEventListener("keydown", trap);
    return () => {
      document.body.style.overflow = previousOverflow;
      dialog.removeEventListener("keydown", trap);
      if (previousFocus?.isConnected) previousFocus.focus();
    };
  }, [open, ref]);
}
