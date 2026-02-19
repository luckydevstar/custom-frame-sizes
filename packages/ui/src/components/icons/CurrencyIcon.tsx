interface CurrencyIconProps {
  className?: string;
}

export function CurrencyIcon({ className }: CurrencyIconProps) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect
        x="4"
        y="14"
        width="56"
        height="36"
        rx="3"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
      <rect
        x="8"
        y="18"
        width="48"
        height="28"
        rx="2"
        stroke="currentColor"
        strokeWidth="1"
        strokeDasharray="3 2"
        fill="none"
        opacity="0.5"
      />
      <circle cx="32" cy="32" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
      <text
        x="32"
        y="37"
        textAnchor="middle"
        fill="currentColor"
        fontSize="14"
        fontWeight="bold"
        fontFamily="serif"
      >
        $
      </text>
      <circle
        cx="14"
        cy="32"
        r="4"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        opacity="0.6"
      />
      <circle
        cx="50"
        cy="32"
        r="4"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        opacity="0.6"
      />
    </svg>
  );
}
