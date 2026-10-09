import React from 'react';

export default function DufilLogo({ size = 'medium', showTagline = true, className = '' }) {
  // size can be 'small', 'medium', 'large'
  const isSmall = size === 'small';
  
  return (
    <div className={`dufil-brand-container ${className}`} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      {/* Official Dufil Corporate SVG Emblem */}
      <svg 
        width={isSmall ? "110" : "135"} 
        height={isSmall ? "32" : "38"} 
        viewBox="0 0 160 46" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: 'visible', filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.4))' }}
      >
        {/* Stylized Dufil "d" */}
        <path 
          d="M12 40 C6 40 2 35 2 27 C2 19 7 14 13 14 C17 14 20 16 22 19 L22 3 L30 3 L30 39 L23 39 L22.5 35 C20 38 16.5 40 12 40 Z M16 21 C12 21 9.5 24 9.5 27 C9.5 31 12 33.5 16 33.5 C19.5 33.5 22.5 31 22.5 27 C22.5 23.5 19.5 21 16 21 Z" 
          fill="#ef4444" 
        />
        
        {/* Stylized Dufil "u" */}
        <path 
          d="M37 15 L45 15 L45 28 C45 32 47.5 33.5 50.5 33.5 C54 33.5 57 31.5 57 27 L57 15 L65 15 L65 39 L57.5 39 L57 35 C54.5 38 51 40 46.5 40 C40.5 40 37 36 37 29 L37 15 Z" 
          fill="#ef4444" 
        />
        
        {/* Stylized Dufil "f" */}
        <path 
          d="M71 15 L77 15 L77 9 C77 5 80 3 85 3 L88 3 L88 9 L85 9 C83.5 9 83 9.5 83 11 L83 15 L88 15 L87 21 L83 21 L83 39 L75 39 L75 21 L71 21 L71 15 Z" 
          fill="#ef4444" 
        />
        
        {/* Stylized Dufil "i" with Green Leaf Swoosh */}
        <path 
          d="M93 15 L101 15 L101 39 L93 39 L93 15 Z" 
          fill="#ef4444" 
        />
        
        {/* Stylized Dufil "l" */}
        <path 
          d="M106 3 L114 3 L114 39 L106 39 L106 3 Z" 
          fill="#ef4444" 
        />
        
        {/* Dufil Emerald Leaf Swoosh over the "i" and "l" */}
        <path 
          d="M94 8 C94 8 98 1 106 1 C112 1 116 4 117 7 C113 7 106 7 100 11 C96 11 94 9.5 94 8 Z" 
          fill="#10b981" 
        />
        <circle cx="97" cy="8.5" r="2.8" fill="#10b981" />

        {/* Corporate Registered symbol */}
        <circle cx="122" cy="16" r="3.5" stroke="#94a3b8" strokeWidth="0.8" fill="none" />
        <text x="120.2" y="18" fill="#94a3b8" fontSize="4.5" fontWeight="bold">R</text>
      </svg>

      {showTagline && (
        <div style={{ display: 'flex', flexDirection: 'column', borderLeft: '1px solid rgba(255,255,255,0.15)', paddingLeft: '8px' }}>
          <span style={{ 
            color: '#10b981', 
            fontSize: '11px', 
            fontWeight: 800, 
            letterSpacing: '0.08em',
            lineHeight: 1.1,
            textTransform: 'uppercase'
          }}>
            Raffles Oil
          </span>
          <span style={{ 
            color: '#94a3b8', 
            fontSize: '9px', 
            fontWeight: 600, 
            letterSpacing: '0.04em',
            textTransform: 'uppercase'
          }}>
            Complex
          </span>
        </div>
      )}
    </div>
  );
}
