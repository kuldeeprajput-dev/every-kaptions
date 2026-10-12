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
  colorClass = "text-cream",
}: SpinningPriceProps) {
  return (
    <div
      className={`price-display ${colorClass}`}
      aria-label={`${currency}${value}${suffix || ""}`}
    >
      <span>
        {currency}
        {value}
      </span>
      {suffix && <small>{suffix}</small>}
    </div>
  );
}
