interface SpinningPriceProps {
  value: string | number;
  currency?: string;
  suffix?: string;
  colorClass?: string;
  triggerKey?: string | number;
  disableSpin?: boolean;
}

const reelDigits = Array.from({ length: 20 }, (_, index) => index % 10);

export function SpinningPrice({
  value,
  currency = "₹",
  suffix,
  colorClass = "text-cream",
  triggerKey,
  disableSpin = false,
}: SpinningPriceProps) {
  return (
    <div className={`price-display tracking-[-.05em] [font-variant-numeric:tabular-nums] items-baseline gap-[5px] text-[44px] font-[600] leading-[1.15] flex [&_small]:[color:var(--dim)] [&_small]:tracking-[0] [&_small]:text-[12px] [&_small]:font-[400] ${colorClass}`} role="img" aria-label={`${currency}${value}${suffix || ""}`}>
      <span key={`${triggerKey ?? "price"}-${value}`} className="price-amount inline-flex items-start" aria-hidden="true">
        <span>{currency}</span>
        {String(value).split("").map((character, index) => (
          /\d/.test(character) && !disableSpin ? (
            <span key={index} className="price-slot inline-block w-[1ch] h-[1.15em] overflow-hidden">
              <span className="price-reel block [transform:translateY(-23em)] [animation:price-reel-settle_750ms_cubic-bezier(.16,_.7,_.2,_1)_both] [&_>_span]:block [&_>_span]:h-[1.15em] [&_>_span]:leading-[1.15] [&_>_span]:text-center motion-reduce:[animation:none]" style={{ animationDuration: `${650 + index * 90}ms` }}>
                {reelDigits.map((digit, row) => <span key={row}>{digit}</span>)}
                <span>{character}</span>
              </span>
            </span>
          ) : <span key={index}>{character}</span>
        ))}
      </span>
      {suffix && <small aria-hidden="true">{suffix}</small>}
    </div>
  );
}
