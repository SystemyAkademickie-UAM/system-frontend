/**
 * Fallback glyphs for sidebar navigation when /assets/icons/*.icon is missing or fails to load.
 * Replace with your .icon assets in public/assets/icons/ (see README there).
 */
const commonProps = {
  width: 22,
  height: 22,
  viewBox: '0 0 24 24',
  fill: 'none',
  xmlns: 'http://www.w3.org/2000/svg',
  'aria-hidden': true,
};

export function NavGlyphFallback({ id, className }) {
  const stroke = 'currentColor';
  const strokeWidth = 1.75;

  switch (id) {
    case 'nav-ekran-glowny':
      return (
        <svg {...commonProps} className={className}>
          <rect x="3" y="4" width="18" height="14" rx="2" stroke={stroke} strokeWidth={strokeWidth} />
          <path d="M8 9h8M8 12h5" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" />
        </svg>
      );
    case 'nav-profil':
      return (
        <svg {...commonProps} className={className}>
          <circle cx="12" cy="9" r="3.25" stroke={stroke} strokeWidth={strokeWidth} />
          <path
            d="M6.5 19.25c.9-2.6 3.2-4 5.5-4s4.6 1.4 5.5 4"
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
        </svg>
      );
    case 'nav-sklep':
      return (
        <svg {...commonProps} className={className}>
          <path
            d="M6 7h15l-1.2 9H7.2L6 7Zm0 0L5.2 4H3"
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M9 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm7 0a1 1 0 1 0 0-2 1 1 0 1 0 0 2Z" fill={stroke} />
        </svg>
      );
    case 'nav-ranking':
      return (
        <svg {...commonProps} className={className}>
          <path
            d="M12 3 14.2 8.9l5.8.8-4.2 4.1 1 5.8L12 16.9 5.2 19.6l1-5.8L2 9.7l5.8-.8L12 3Z"
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'nav-ustawienia':
      return (
        <svg {...commonProps} className={className}>
          <path
            d="M12 15.25a3.25 3.25 0 1 0 0-6.5 3.25 3.25 0 0 0 0 6.5Z"
            stroke={stroke}
            strokeWidth={strokeWidth}
          />
          <path
            d="M19.4 12a7.45 7.45 0 0 0-.1-1l2-1.55-2-3.45-2.35 1a7.7 7.7 0 0 0-1.7-1L14.9 3h-5.8L9.75 4.55a7.7 7.7 0 0 0-1.7 1L5.7 4.55l-2 3.45L5.7 9.55a7.5 7.5 0 0 0 0 2L3.7 13.1l2 3.45 2.35-1a7.7 7.7 0 0 0 1.7 1L9.1 21h5.8l.45-1.55a7.7 7.7 0 0 0 1.7-1l2.35 1 2-3.45-2-1.55c.05-.35.1-.7.1-1Z"
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'nav-wyloguj':
      return (
        <svg {...commonProps} className={className}>
          <path d="M10 7V5.5A1.5 1.5 0 0 1 11.5 4h7A1.5 1.5 0 0 1 20 5.5v13A1.5 1.5 0 0 1 18.5 20h-7A1.5 1.5 0 0 1 10 18.5V17" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" />
          <path d="M4 12h11M7 9l-3 3 3 3" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'nav-panel':
      return (
        <svg {...commonProps} className={className}>
          <rect x="4" y="5" width="16" height="11" rx="1.5" stroke={stroke} strokeWidth={strokeWidth} />
          <path d="M8 9h8M8 12h5M8 15h6" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" />
        </svg>
      );
    case 'nav-users':
      return (
        <svg {...commonProps} className={className}>
          <circle cx="9" cy="9" r="2.5" stroke={stroke} strokeWidth={strokeWidth} />
          <circle cx="15" cy="10" r="2" stroke={stroke} strokeWidth={strokeWidth} />
          <path d="M5 18c.8-2.2 2.5-3.5 4-3.5s3.2 1.3 4 3.5M13 18c.6-1.4 1.6-2.3 2.8-2.5" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" />
        </svg>
      );
    case 'nav-courses':
      return (
        <svg {...commonProps} className={className}>
          <path d="M7 4.5h10v15H7z" stroke={stroke} strokeWidth={strokeWidth} strokeLinejoin="round" />
          <path d="M9 8h6M9 12h6M9 16h4" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" />
        </svg>
      );
    case 'nav-stats':
      return (
        <svg {...commonProps} className={className}>
          <path d="M5 19V5M5 19h14" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" />
          <path d="M8 15l3-4 3 2 4-6" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'nav-org':
      return (
        <svg {...commonProps} className={className}>
          <path d="M6 10V8.5A1.5 1.5 0 0 1 7.5 7H11M6 10v8h12v-8M6 10h12" stroke={stroke} strokeWidth={strokeWidth} strokeLinejoin="round" />
          <path d="M11 7V5.5A1.5 1.5 0 0 1 12.5 4h3A1.5 1.5 0 0 1 17 5.5V7" stroke={stroke} strokeWidth={strokeWidth} strokeLinejoin="round" />
        </svg>
      );
    default:
      return (
        <svg {...commonProps} className={className}>
          <circle cx="12" cy="12" r="7" stroke={stroke} strokeWidth={strokeWidth} />
        </svg>
      );
  }
}
