import React from 'react';

interface EBuyPartnerLogoProps {
  className?: string;
  size?: number | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

export const EBuyPartnerLogo: React.FC<EBuyPartnerLogoProps> = ({
  className = '',
  size = 'md',
  showText = false,
}) => {
  let dimension = 40;
  if (typeof size === 'number') {
    dimension = size;
  } else {
    switch (size) {
      case 'xs':
        dimension = 24;
        break;
      case 'sm':
        dimension = 32;
        break;
      case 'md':
        dimension = 40;
        break;
      case 'lg':
        dimension = 56;
        break;
      case 'xl':
        dimension = 84;
        break;
    }
  }

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      <svg
        width={dimension}
        height={dimension}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-200"
      >
        {/* Outer Circular Ring */}
        <circle
          cx="100"
          cy="100"
          r="92"
          stroke="#FF5000"
          strokeWidth="11"
          fill="#FFFFFF"
        />

        {/* eBuy Logo Text */}
        <g id="ebuy-letters">
          {/* 'e' in Red */}
          <text
            x="48"
            y="98"
            fill="#E53238"
            fontFamily="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif"
            fontWeight="900"
            fontSize="54"
            textAnchor="middle"
            letterSpacing="-1"
          >
            e
          </text>
          {/* 'b' in Blue */}
          <text
            x="81"
            y="98"
            fill="#0064D2"
            fontFamily="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif"
            fontWeight="900"
            fontSize="54"
            textAnchor="middle"
            letterSpacing="-1"
          >
            b
          </text>
          {/* 'u' in Yellow/Amber */}
          <text
            x="117"
            y="98"
            fill="#F5AF02"
            fontFamily="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif"
            fontWeight="900"
            fontSize="54"
            textAnchor="middle"
            letterSpacing="-1"
          >
            u
          </text>
          {/* 'y' in Green */}
          <text
            x="152"
            y="98"
            fill="#86B817"
            fontFamily="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif"
            fontWeight="900"
            fontSize="54"
            textAnchor="middle"
            letterSpacing="-1"
          >
            y
          </text>
        </g>

        {/* 'Partner' in Italic Bold Orange */}
        <text
          x="100"
          y="140"
          fill="#FF5000"
          fontFamily="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif"
          fontWeight="900"
          fontStyle="italic"
          fontSize="33"
          textAnchor="middle"
          letterSpacing="-0.5"
        >
          Partner
        </text>

        {/* Dynamic Curved Underline Swoop */}
        <path
          d="M 38 152 Q 100 138 162 152"
          stroke="#FF5000"
          strokeWidth="4.5"
          strokeLinecap="round"
          fill="none"
        />
      </svg>

      {showText && (
        <div className="flex flex-col text-left">
          <span className="text-base sm:text-lg font-black tracking-tight text-[#171717] leading-none">
            eBuy<span className="text-[#FF5000]">-Partner</span>
          </span>
          <span className="text-[9px] font-bold text-[#666666] uppercase tracking-wider mt-0.5">
            eBay Sister Platform
          </span>
        </div>
      )}
    </div>
  );
};
