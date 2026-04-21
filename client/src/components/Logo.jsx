import React from 'react';

const Logo = ({ className = "w-10 h-10" }) => {
  return (
    <svg 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <filter id="logo-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      
      {/* Stadium Rim - Higher Opacity */}
      <ellipse 
        cx="50" cy="50" rx="42" ry="28" 
        stroke="#3cd7ff" 
        strokeWidth="5" 
        strokeOpacity="0.4"
      />
      
      {/* Dynamic Sync Bolt / Arena Path - Solid Colors for reliability */}
      <path 
        d="M35 45L55 15L45 45L65 35L45 80L55 50L35 45Z" 
        fill="#3cd7ff"
        filter="url(#logo-glow)"
      />
      <path 
        d="M35 45L55 15L45 45L65 35L45 80L55 50L35 45Z" 
        fill="#a9f900"
        fillOpacity="0.5"
      />
      
      {/* Signal Waves */}
      <path 
        d="M85 35C92 45 92 55 85 65" 
        stroke="#3cd7ff" 
        strokeWidth="5" 
        strokeLinecap="round" 
      />
      <path 
        d="M15 35C8 45 8 55 15 65" 
        stroke="#a9f900" 
        strokeWidth="5" 
        strokeLinecap="round" 
      />
    </svg>
  );
};

export default Logo;
