"use client";

import { motion } from "motion/react";

interface SpinningPriceProps {
  value: string | number;
  currency?: string;
  suffix?: string;
  colorClass?: string;
  triggerKey?: string | number;
  disableSpin?: boolean;
}

export function SpinningPrice({
  value,
  currency = "₹",
  suffix,
  colorClass = "text-[#f4ecdc]",
  triggerKey,
  disableSpin = false,
}: SpinningPriceProps) {
  const strVal = String(value);

  // If spin is disabled or the price is 0, render completely static text without spinning
  if (disableSpin || strVal === "0") {
    return (
      <div
        className={`text-[34px] font-bold leading-[1.1] flex items-baseline select-none ${colorClass}`}
        aria-label={`${currency}${strVal}${suffix || ""}`}
      >
        <span className="shrink-0 mr-0.5">{currency}</span>
        <span>{strVal}</span>
        {suffix && (
          <span className="text-[16px] font-medium text-[#8a8478] ml-0.5">
            {suffix}
          </span>
        )}
      </div>
    );
  }

  const chars = strVal.split("");

  return (
    <div
      className={`text-[34px] font-bold leading-[1.1] flex items-baseline select-none ${colorClass}`}
      aria-label={`${currency}${strVal}${suffix || ""}`}
    >
      <span className="shrink-0 mr-0.5" aria-hidden="true">
        {currency}
      </span>
      <span
        className="inline-flex items-center overflow-hidden h-[1.15em] leading-[1.15em] tabular-nums"
        aria-hidden="true"
      >
        {chars.map((ch, i) => {
          if (!/\d/.test(ch)) {
            return (
              <span key={i} className="inline-block">
                {ch}
              </span>
            );
          }

          const digit = parseInt(ch, 10);
          // 2 cycles + final digit for a smooth, visible reel spin
          const cycles = 2;
          const reel = Array.from(
            { length: cycles * 10 + digit + 1 },
            (_, idx) => idx % 10
          );
          const targetIndex = cycles * 10 + digit;

          return (
            <span
              key={`${triggerKey}-${i}-${ch}`}
              className="relative inline-block overflow-hidden h-[1.15em] leading-[1.15em] w-[1ch] text-center"
            >
              <motion.span
                initial={{ y: "0em" }}
                animate={{ y: `-${targetIndex * 1.15}em` }}
                transition={{
                  duration: 0.95,
                  delay: i * 0.06,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="flex flex-col will-change-transform"
              >
                {reel.map((num, idx) => (
                  <span
                    key={idx}
                    className="h-[1.15em] leading-[1.15em] w-[1ch] text-center block shrink-0"
                  >
                    {num}
                  </span>
                ))}
              </motion.span>
            </span>
          );
        })}
      </span>
      {suffix && (
        <span
          className="text-[16px] font-medium text-[#8a8478] ml-0.5"
          aria-hidden="true"
        >
          {suffix}
        </span>
      )}
    </div>
  );
}
