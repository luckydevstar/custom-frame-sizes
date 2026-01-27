import { forwardRef, SVGProps } from "react";

interface PostageStampIconProps extends SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const PostageStampIcon = forwardRef<SVGSVGElement, PostageStampIconProps>(
  ({ size = 24, className, ...props }, ref) => {
    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        {...props}
      >
        {/* Main stamp body with scalloped edges using clip-path simulation */}
        {/* Outer scalloped border - top edge perforations */}
        <circle cx="5" cy="2" r="1" fill="currentColor" />
        <circle cx="8" cy="2" r="1" fill="currentColor" />
        <circle cx="11" cy="2" r="1" fill="currentColor" />
        <circle cx="14" cy="2" r="1" fill="currentColor" />
        <circle cx="17" cy="2" r="1" fill="currentColor" />
        <circle cx="20" cy="2" r="1" fill="currentColor" />

        {/* Bottom edge perforations */}
        <circle cx="5" cy="22" r="1" fill="currentColor" />
        <circle cx="8" cy="22" r="1" fill="currentColor" />
        <circle cx="11" cy="22" r="1" fill="currentColor" />
        <circle cx="14" cy="22" r="1" fill="currentColor" />
        <circle cx="17" cy="22" r="1" fill="currentColor" />
        <circle cx="20" cy="22" r="1" fill="currentColor" />

        {/* Left edge perforations */}
        <circle cx="2" cy="5" r="1" fill="currentColor" />
        <circle cx="2" cy="8" r="1" fill="currentColor" />
        <circle cx="2" cy="11" r="1" fill="currentColor" />
        <circle cx="2" cy="14" r="1" fill="currentColor" />
        <circle cx="2" cy="17" r="1" fill="currentColor" />
        <circle cx="2" cy="20" r="1" fill="currentColor" />

        {/* Right edge perforations */}
        <circle cx="22" cy="5" r="1" fill="currentColor" />
        <circle cx="22" cy="8" r="1" fill="currentColor" />
        <circle cx="22" cy="11" r="1" fill="currentColor" />
        <circle cx="22" cy="14" r="1" fill="currentColor" />
        <circle cx="22" cy="17" r="1" fill="currentColor" />
        <circle cx="22" cy="20" r="1" fill="currentColor" />

        {/* Inner stamp rectangle */}
        <rect x="4" y="4" width="16" height="16" rx="0.5" strokeWidth="1.5" />

        {/* Inner design border */}
        <rect x="6" y="6" width="12" height="12" rx="0.25" strokeWidth="1" />

        {/* Simple landscape/mountain design */}
        <path d="M 7 15 L 10 10 L 12 12 L 15 8 L 17 15" strokeWidth="1.5" fill="none" />
      </svg>
    );
  }
);

PostageStampIcon.displayName = "PostageStampIcon";
