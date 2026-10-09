import React from 'react';

/**
 * DufilLogo — faithful SVG recreation of the Dufil brand identity.
 * Green ellipse badge · gold border ring · white italic "Dufil" wordmark.
 *
 * Props:
 *   height  — rendered height in px (width scales proportionally). Default 36.
 *   style   — optional extra inline styles on the root <svg>.
 */
export default function DufilLogo({ size = 'medium', height, showTagline = false, className = '', style = {} }) {
  let h = height;
  if (!h) {
    if (typeof size === 'number') h = size;
    else if (size === 'small') h = 26;
    else if (size === 'large') h = 48;
    else h = 36; // medium default
  }
  const w = h * 1.9;

  return (
    <div className={`dufil-logo-container ${className}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', ...style }}>
      <svg
        width={w}
        height={h}
        viewBox="0 0 190 100"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Dufil logo"
        style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}
      >
      <defs>
        {/* Main green radial gradient — lighter centre, darker rim */}
        <radialGradient id="dufil-green" cx="50%" cy="42%" r="56%">
          <stop offset="0%"   stopColor="#5ecb3e" />
          <stop offset="55%"  stopColor="#2e9e1a" />
          <stop offset="100%" stopColor="#1a6e0a" />
        </radialGradient>

        {/* Gold / champagne ring gradient */}
        <linearGradient id="dufil-gold" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#f5e17a" />
          <stop offset="40%"  stopColor="#c8960c" />
          <stop offset="70%"  stopColor="#e8c84a" />
          <stop offset="100%" stopColor="#8a6200" />
        </linearGradient>

        {/* Drop shadow filter */}
        <filter id="dufil-shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000" floodOpacity="0.35" />
        </filter>

        {/* Subtle inner highlight on the green oval */}
        <radialGradient id="dufil-shine" cx="50%" cy="28%" r="42%">
          <stop offset="0%"   stopColor="#ffffff" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* ── Outer gold border ring ── */}
      <ellipse
        cx="95" cy="50" rx="92" ry="48"
        fill="url(#dufil-gold)"
        filter="url(#dufil-shadow)"
      />

      {/* ── White inner separation ring ── */}
      <ellipse
        cx="95" cy="50" rx="86" ry="42"
        fill="#ffffff"
      />

      {/* ── Main green oval ── */}
      <ellipse
        cx="95" cy="50" rx="81" ry="38"
        fill="url(#dufil-green)"
      />

      {/* ── Shine highlight overlay ── */}
      <ellipse
        cx="95" cy="50" rx="81" ry="38"
        fill="url(#dufil-shine)"
      />

      {/* ── "Dufil" wordmark — white, italic, bold ── */}
      <text
        x="95"
        y="64"
        textAnchor="middle"
        fontFamily="'Georgia', 'Times New Roman', serif"
        fontStyle="italic"
        fontWeight="900"
        fontSize="42"
        fill="#ffffff"
        letterSpacing="-0.5"
        style={{ textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}
      >
        Dufil
      </text>

      {/* ── Registered trademark symbol ── */}
      <text
        x="170"
        y="31"
        fontFamily="'Georgia', serif"
        fontStyle="normal"
        fontWeight="700"
        fontSize="14"
        fill="#ffffff"
        opacity="0.85"
      >
        ®
      </text>
      </svg>
      {showTagline && (
        <span style={{ 
          fontSize: '12px', 
          fontWeight: 600, 
          color: 'var(--dufil-gold-light, #f5e17a)', 
          letterSpacing: '0.05em', 
          textTransform: 'uppercase',
          whiteSpace: 'nowrap'
        }}>
          Prima Foods
        </span>
      )}
    </div>
  );
}
