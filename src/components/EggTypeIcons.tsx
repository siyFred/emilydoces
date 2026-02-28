import React from "react";

const svgStyle: React.CSSProperties = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
};

export const EGG_TYPE_ICONS: Record<string, React.ReactNode> = {
  "Ovo de Colher": (
    <svg viewBox="0 0 80 80" style={svgStyle} fill="none">
      {/* Outer shell */}
      <path d="M40 7 C27 7 18 21 18 37 C18 55 27 67 40 67 C53 67 62 55 62 37 C62 21 53 7 40 7Z" fill="#3d2415" stroke="#3d2415" strokeWidth="1"/>
      {/* Shell wall */}
      <path d="M40 12 C29 12 22 24 22 38 C22 54 30 63 40 63 C50 63 58 54 58 38 C58 24 51 12 40 12Z" fill="#6b3d1e"/>
      {/* Cream filling */}
      <path d="M40 16 C31 16 25 26 25 39 C25 54 32 60 40 60 C48 60 55 54 55 39 C55 26 49 16 40 16Z" fill="#f0d9b5"/>
      {/* Filling highlight */}
      <ellipse cx="37" cy="37" rx="7" ry="10" fill="#f8edd5" opacity="0.45"/>
      {/* Spoon handle */}
      <line x1="56" y1="68" x2="48" y2="42" stroke="#c9922a" strokeWidth="2.5" strokeLinecap="round"/>
      {/* Spoon head */}
      <ellipse cx="46" cy="38" rx="4" ry="5.5" fill="#e2b05b" transform="rotate(-20 46 38)"/>
      <ellipse cx="45" cy="37" rx="2.5" ry="3.5" fill="#f5cc6a" opacity="0.5" transform="rotate(-20 45 37)"/>
    </svg>
  ),

  "Ovo Simples": (
    <svg viewBox="0 0 80 72" style={svgStyle} fill="none">
      {/* Whole egg shape */}
      <path d="M40 7 C26 7 17 21 17 37 C17 55 26 67 40 67 C54 67 63 55 63 37 C63 21 54 7 40 7Z" fill="#4a2c1a"/>
      <path d="M40 11 C28 11 21 23 21 37 C21 53 29 63 40 63 C51 63 59 53 59 37 C59 23 52 11 40 11Z" fill="#5c3d2e"/>
      {/* Plastic wrap wave lines */}
      <path d="M22 30 Q31 27 40 30 Q49 33 58 29" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <path d="M19 44 Q30 40 40 43 Q50 46 61 42" stroke="rgba(255,255,255,0.32)" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <path d="M20 57 Q30 53 40 56 Q50 59 60 55" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      {/* Gather at top */}
      <path d="M34 13 Q37 8 40 6 Q43 8 46 13" stroke="rgba(255,255,255,0.3)" strokeWidth="1" fill="none"/>
      {/* Bow wings */}
      <path d="M32 7 C25 3 19 5 20 9 C21 13 27 13 33 10 Z" fill="#c9922a"/>
      <path d="M48 7 C55 3 61 5 60 9 C59 13 53 13 47 10 Z" fill="#c9922a"/>
      {/* Bow knot */}
      <circle cx="40" cy="8" r="4.5" fill="#e2b05b"/>
      <circle cx="40" cy="8" r="2.5" fill="#f5cc6a" opacity="0.55"/>
    </svg>
  ),

  "Ovo Trufado": (
    <svg viewBox="0 0 80 80" style={svgStyle} fill="none">
      {/* Full outer shell */}
      <path d="M40 7 C27 7 18 21 18 37 C18 55 27 67 40 67 C53 67 62 55 62 37 C62 21 53 7 40 7Z" fill="#4a2810"/>
      {/* Right half cross-section: truffle ganache layer */}
      <path d="M40 13 C49 13 56 24 56 38 C56 53 49 62 40 62 L40 13Z" fill="#c47838"/>
      {/* Right half cross-section: inner chocolate shell */}
      <path d="M40 18 C46 18 51 27 51 38 C51 51 46 59 40 59 L40 18Z" fill="#5a3520"/>
      {/* Right half cross-section: hollow void */}
      <path d="M40 23 C44 23 48 30 48 39 C48 50 44 56 40 56 L40 23Z" fill="#1a0c06"/>
      {/* Cut line */}
      <line x1="40" y1="7" x2="40" y2="67" stroke="#2d1a0e" strokeWidth="1.5"/>
      {/* Shine on left side */}
      <ellipse cx="30" cy="28" rx="4" ry="7" fill="white" opacity="0.08"/>
    </svg>
  ),

  /* VERSÃO ANTERIOR — Ovo Trufado (camadas concêntricas, sem corte)
  "Ovo Trufado": (
    <svg viewBox="0 0 80 80" style={svgStyle} fill="none">
      <path d="M40 7 C27 7 18 21 18 37 C18 55 27 67 40 67 C53 67 62 55 62 37 C62 21 53 7 40 7Z" fill="#4a2810"/>
      <circle cx="24" cy="32" r="1.6" fill="#2d1a0e" opacity="0.7"/>
      <circle cx="56" cy="32" r="1.6" fill="#2d1a0e" opacity="0.7"/>
      <circle cx="20" cy="46" r="1.4" fill="#2d1a0e" opacity="0.5"/>
      <circle cx="60" cy="46" r="1.4" fill="#2d1a0e" opacity="0.5"/>
      <path d="M40 13 C29 13 22 25 22 38 C22 54 30 63 40 63 C50 63 58 54 58 38 C58 25 51 13 40 13Z" fill="#6b3d1e"/>
      <path d="M40 18 C31 18 25 28 25 39 C25 54 32 60 40 60 C48 60 55 54 55 39 C55 28 49 18 40 18Z" fill="#c47838"/>
      <path d="M40 23 C33 23 28 31 28 40 C28 52 34 57 40 57 C46 57 52 52 52 40 C52 31 47 23 40 23Z" fill="#2d1a0e"/>
      <path d="M40 27 C34 27 30 34 30 41 C30 51 35 55 40 55 C45 55 50 51 50 41 C50 34 46 27 40 27Z" fill="#1a0c06"/>
    </svg>
  ),
  */

  "Ovo de Pote": (
    <svg viewBox="0 0 80 72" style={svgStyle} fill="none">
      {/* Egg body upright */}
      <path d="M40 68 C25 68 16 57 16 45 C16 30 24 16 40 16 C56 16 64 30 64 45 C64 57 55 68 40 68Z" fill="#4a2c1a"/>
      <path d="M40 64 C27 64 20 55 20 45 C20 32 27 20 40 20 C53 20 60 32 60 45 C60 55 53 64 40 64Z" fill="#5a3520"/>
      {/* Horizontal cut ~20% from top */}
      <line x1="24" y1="29" x2="56" y2="29" stroke="#2d1a0e" strokeWidth="3" strokeLinecap="round"/>
      {/* Cut opening */}
      <ellipse cx="40" cy="29" rx="16" ry="4.5" fill="#2d1a0e"/>
      <ellipse cx="40" cy="29" rx="14" ry="3.5" fill="#1a0c06"/>
      <ellipse cx="40" cy="28" rx="11" ry="2.5" fill="#d4956a" opacity="0.65"/>
      {/* Brigadeiro left */}
      <circle cx="30" cy="21" r="7" fill="#2d1a0e"/>
      <circle cx="30" cy="20" r="3.5" fill="#3d2415" opacity="0.5"/>
      {/* Brigadeiro center */}
      <circle cx="40" cy="17" r="8" fill="#3a2010"/>
      <circle cx="40" cy="16" r="4" fill="#4a2c1a" opacity="0.5"/>
      {/* Brigadeiro right */}
      <circle cx="50" cy="21" r="7" fill="#2d1a0e"/>
      <circle cx="50" cy="20" r="3.5" fill="#3d2415" opacity="0.5"/>
      {/* Gold sprinkles */}
      <line x1="27" y1="18" x2="29" y2="15" stroke="#e2b05b" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="33" y1="20" x2="35" y2="17" stroke="#e2b05b" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="38" y1="12" x2="40" y2="9" stroke="#e2b05b" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="44" y1="13" x2="46" y2="10" stroke="#e2b05b" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="48" y1="18" x2="51" y2="15" stroke="#e2b05b" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),

  "Mini Ovos": (
    <svg viewBox="0 0 80 80" style={svgStyle} fill="none">
      {/* Top-left egg */}
      <path d="M22 8 C15 8 11 14 11 21 C11 29 15 34 22 34 C29 34 33 29 33 21 C33 14 29 8 22 8Z" fill="#3d2415"/>
      <path d="M22 11 C16 11 13 16 13 22 C13 29 16 33 22 33 C28 33 31 29 31 22 C31 16 28 11 22 11Z" fill="#6b3d1e"/>
      <path d="M22 13 C17 13 15 18 15 23 C15 29 17 31 22 31 C27 31 29 29 29 23 C29 18 27 13 22 13Z" fill="#f0d9b5"/>
      {/* Top-right egg */}
      <path d="M58 8 C51 8 47 14 47 21 C47 29 51 34 58 34 C65 34 69 29 69 21 C69 14 65 8 58 8Z" fill="#3d2415"/>
      <path d="M58 11 C52 11 49 16 49 22 C49 29 52 33 58 33 C64 33 67 29 67 22 C67 16 64 11 58 11Z" fill="#6b3d1e"/>
      <path d="M58 13 C53 13 51 18 51 23 C51 29 53 31 58 31 C63 31 65 29 65 23 C65 18 63 13 58 13Z" fill="#f0d9b5"/>
      {/* Bottom-left egg */}
      <path d="M22 46 C15 46 11 52 11 59 C11 67 15 72 22 72 C29 72 33 67 33 59 C33 52 29 46 22 46Z" fill="#3d2415"/>
      <path d="M22 49 C16 49 13 54 13 60 C13 67 16 71 22 71 C28 71 31 67 31 60 C31 54 28 49 22 49Z" fill="#6b3d1e"/>
      <path d="M22 51 C17 51 15 56 15 61 C15 67 17 69 22 69 C27 69 29 67 29 61 C29 56 27 51 22 51Z" fill="#f0d9b5"/>
      {/* Bottom-right egg */}
      <path d="M58 46 C51 46 47 52 47 59 C47 67 51 72 58 72 C65 72 69 67 69 59 C69 52 65 46 58 46Z" fill="#3d2415"/>
      <path d="M58 49 C52 49 49 54 49 60 C49 67 52 71 58 71 C64 71 67 67 67 60 C67 54 64 49 58 49Z" fill="#6b3d1e"/>
      <path d="M58 51 C53 51 51 56 51 61 C51 67 53 69 58 69 C63 69 65 67 65 61 C65 56 63 51 58 51Z" fill="#f0d9b5"/>
    </svg>
  ),
};
