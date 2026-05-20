const iconProps = {
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  xmlns: 'http://www.w3.org/2000/svg',
  'aria-hidden': true,
};

export function IconStar({ className }) {
  return (
    <svg {...iconProps} className={className}>
      <path
        d="M12 3 14.2 8.9l5.8.8-4.2 4.1 1 5.8L12 16.9 5.2 19.6l1-5.8L2 9.7l5.8-.8L12 3Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconMoney({ className }) {
  return (
    <svg {...iconProps} className={className} width={30} height={30} viewBox="0 0 30 30">
      <circle cx="15" cy="15" r="11" stroke="currentColor" strokeWidth="1" />
      <path
        d="M15 9v12M12.5 11.5h4a2 2 0 0 1 0 4h-3a2 2 0 0 0 0 4h4"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconSettings({ className }) {
  return (
    <svg {...iconProps} className={className} width={30} height={30} viewBox="0 0 30 30">
      <circle cx="15" cy="15" r="4" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M15 5.5v2M15 22.5v2M7.2 7.2l1.4 1.4M21.4 21.4l1.4 1.4M5.5 15h2M22.5 15h2M7.2 22.8l1.4-1.4M21.4 8.6l1.4-1.4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconUserPlaceholder({ className }) {
  return (
    <svg {...iconProps} className={className} width={24} height={24} viewBox="0 0 24 24">
      <circle cx="12" cy="9" r="3.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M6 19c1.2-2.8 3.4-4 6-4s4.8 1.2 6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
