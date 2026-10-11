"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuthStore } from "@/features/auth/store/auth-store";
import { freePlan } from "../data/editor-config";

const BILLING_WINDOW_MS = 30 * 24 * 60 * 60 * 1000;

export type UserPlanUsage = {
  transcriptionSecondsUsed: number;
  exportsUsed: number;
  periodStartedAt: number;
};

function getUserKey(user: { id?: string; email?: string } | null | undefined): string {
  if (!user) return "guest";
  return user.id || user.email || "guest";
}

function periodHasEnded(periodStartedAt: number, now = Date.now()) {
  return periodStartedAt === 0 || now - periodStartedAt >= BILLING_WINDOW_MS;
}

export function getUsageForUser(userKey: string): UserPlanUsage {
  if (typeof window === "undefined") {
    return { transcriptionSecondsUsed: 0, exportsUsed: 0, periodStartedAt: 0 };
  }
  try {
    const raw = localStorage.getItem(`everykaptions_plan_usage_${userKey}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      const periodStart = Number(parsed.periodStartedAt || 0);
      if (periodHasEnded(periodStart)) {
        return { transcriptionSecondsUsed: 0, exportsUsed: 0, periodStartedAt: Date.now() };
      }
      return {
        transcriptionSecondsUsed: Number(parsed.transcriptionSecondsUsed || 0),
        exportsUsed: Number(parsed.exportsUsed || 0),
        periodStartedAt: periodStart || Date.now(),
      };
    }
  } catch {
    // fallback
  }
  return { transcriptionSecondsUsed: 0, exportsUsed: 0, periodStartedAt: Date.now() };
}

export function saveUsageForUser(userKey: string, usage: UserPlanUsage) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(`everykaptions_plan_usage_${userKey}`, JSON.stringify(usage));
  } catch {
    // ignore
  }
}

export function usePlanSummary() {
  const user = useAuthStore((state) => state.user);
  const userKey = getUserKey(user);

  // Read browser usage after hydration so the server and first client render agree.
  const [usage, setUsage] = useState<UserPlanUsage>({
    transcriptionSecondsUsed: 0,
    exportsUsed: 0,
    periodStartedAt: 0,
  });

  // Sync state whenever logged-in user changes (e.g. new Gmail ID logs in)
  useEffect(() => {
    setUsage(getUsageForUser(userKey));
  }, [userKey]);

  const recordTranscription = useCallback((seconds: number) => {
    setUsage((prev) => {
      const now = Date.now();
      const expired = periodHasEnded(prev.periodStartedAt, now);
      const nextUsage: UserPlanUsage = {
        periodStartedAt: expired ? now : (prev.periodStartedAt || now),
        exportsUsed: expired ? 0 : prev.exportsUsed,
        transcriptionSecondsUsed: (expired ? 0 : prev.transcriptionSecondsUsed) + Math.max(0, seconds),
      };
      saveUsageForUser(userKey, nextUsage);
      return nextUsage;
    });
  }, [userKey]);

  const recordExport = useCallback(() => {
    let recorded = false;
    setUsage((prev) => {
      const now = Date.now();
      const expired = periodHasEnded(prev.periodStartedAt, now);
      const currentExports = expired ? 0 : prev.exportsUsed;
      if (currentExports >= freePlan.monthlyExports) {
        return prev;
      }
      recorded = true;
      const nextUsage: UserPlanUsage = {
        periodStartedAt: expired ? now : (prev.periodStartedAt || now),
        transcriptionSecondsUsed: expired ? 0 : prev.transcriptionSecondsUsed,
        exportsUsed: currentExports + 1,
      };
      saveUsageForUser(userKey, nextUsage);
      return nextUsage;
    });
    return recorded;
  }, [userKey]);

  const totalSeconds = freePlan.transcriptionMinutes * 60;
  const remainingSeconds = Math.max(0, totalSeconds - usage.transcriptionSecondsUsed);
  const remainingExports = Math.max(0, freePlan.monthlyExports - usage.exportsUsed);
  const periodStart = usage.periodStartedAt || Date.now();
  const daysRemaining = Math.ceil((periodStart + BILLING_WINDOW_MS - Date.now()) / (24 * 60 * 60 * 1000));

  return {
    planName: freePlan.name,
    remainingMinutes: remainingSeconds / 60,
    remainingExports,
    resetDays: Math.max(1, daysRemaining),
    transcriptionPercent: (remainingSeconds / totalSeconds) * 100,
    exportsPercent: (remainingExports / freePlan.monthlyExports) * 100,
    canTranscribe: remainingSeconds > 0,
    canExport: remainingExports > 0,
    recordTranscription,
    recordExport,
  };
}

// Global store wrapper for backward compatibility
export const usePlanStore = {
  getState: () => ({
    transcriptionSecondsUsed: 0,
    refreshPeriod: () => {},
  }),
  persist: {
    rehydrate: async () => {},
  },
};
