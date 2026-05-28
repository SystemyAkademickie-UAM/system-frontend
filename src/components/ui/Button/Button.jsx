import { Link } from 'react-router-dom';
import './Button.css';

/**
 * @param {Object} props
 * @param {import('react').ReactNode} props.children
 * @param {() => void} [props.onClick]
 * @param {string} [props.to] — jeśli podane, renderuje Link zamiast button
 * @param {'button' | 'submit' | 'reset'} [props.type]
 * @param {'primary' | 'secondary' | 'ghost' | 'text' | 'danger'} [props.variant]
 * @param {'sm' | 'md' | 'lg'} [props.size]
 * @param {boolean} [props.disabled]
 * @param {boolean} [props.fullWidth]
 * @param {string} [props.className]
 */
export default function Button({
  children,
  onClick,
  to,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  fullWidth = false,
  className = '',
  ...rest
}) {
  const classNames = [
    'maq-btn',
    `maq-btn--${variant}`,
    `maq-btn--${size}`,
    fullWidth ? 'maq-btn--full' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if (to && !disabled) {
    return (
      <Link to={to} className={classNames} onClick={onClick} {...rest}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={classNames} onClick={onClick} disabled={disabled} {...rest}>
      {children}
    </button>
  );
}
