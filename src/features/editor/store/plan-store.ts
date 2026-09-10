"use client";

import { useEffect } from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { freePlan } from "../data/editor-config";

const BILLING_WINDOW_MS = 30 * 24 * 60 * 60 * 1000;

type PlanState = {
  transcriptionSecondsUsed: number;
  exportsUsed: number;
  periodStartedAt: number;
  recordTranscription: (seconds: number) => void;
  recordExport: () => boolean;
  refreshPeriod: () => void;
};

function periodHasEnded(periodStartedAt: number, now = Date.now()) {
  return periodStartedAt === 0 || now - periodStartedAt >= BILLING_WINDOW_MS;
}

export const usePlanStore = create<PlanState>()(
  persist(
    (set) => ({
      transcriptionSecondsUsed: 0,
      exportsUsed: 0,
      periodStartedAt: 0,
      recordTranscription: (seconds) => {
        set((state) => {
          const now = Date.now();
          const expired = periodHasEnded(state.periodStartedAt, now);
          return {
            periodStartedAt: expired ? now : state.periodStartedAt,
            exportsUsed: expired ? 0 : state.exportsUsed,
            transcriptionSecondsUsed: (expired ? 0 : state.transcriptionSecondsUsed) + Math.max(0, seconds),
          };
        });
      },
      recordExport: () => {
        let recorded = false;
        set((state) => {
          const now = Date.now();
          const expired = periodHasEnded(state.periodStartedAt, now);
          const exportsUsed = expired ? 0 : state.exportsUsed;
          if (exportsUsed >= freePlan.monthlyExports) return state;
          recorded = true;
          return {
            periodStartedAt: expired ? now : state.periodStartedAt,
            transcriptionSecondsUsed: expired ? 0 : state.transcriptionSecondsUsed,
            exportsUsed: exportsUsed + 1,
          };
        });
        return recorded;
      },
      refreshPeriod: () => {
        set((state) => {
          if (!periodHasEnded(state.periodStartedAt)) return state;
          return {
            periodStartedAt: Date.now(),
            transcriptionSecondsUsed: 0,
            exportsUsed: 0,
          };
        });
      },
    }),
    {
      name: "replix-free-plan-usage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        transcriptionSecondsUsed: state.transcriptionSecondsUsed,
        exportsUsed: state.exportsUsed,
        periodStartedAt: state.periodStartedAt,
      }),
      skipHydration: true,
    },
  ),
);

export function usePlanSummary() {
  const transcriptionSecondsUsed = usePlanStore((state) => state.transcriptionSecondsUsed);
  const exportsUsed = usePlanStore((state) => state.exportsUsed);
  const periodStartedAt = usePlanStore((state) => state.periodStartedAt);
  const refreshPeriod = usePlanStore((state) => state.refreshPeriod);

  useEffect(() => {
    void usePlanStore.persist.rehydrate().then(refreshPeriod);
  }, [refreshPeriod]);

  const totalSeconds = freePlan.transcriptionMinutes * 60;
  const remainingSeconds = Math.max(0, totalSeconds - transcriptionSecondsUsed);
  const remainingExports = Math.max(0, freePlan.monthlyExports - exportsUsed);
  const periodStart = periodStartedAt || Date.now();
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
  };
}
