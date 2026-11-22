/**
 * @file Checkbox.jsx
 * @description Uniwersalny komponent checkboxa zgodny z design systemem aplikacji.
 */

import './Checkbox.css';

/**
 * @param {{
 *   id?: string,
 *   name?: string,
 *   checked?: boolean,
 *   onChange?: (checked: boolean, event: React.ChangeEvent<HTMLInputElement>) => void,
 *   label?: React.ReactNode,
 *   disabled?: boolean,
 *   variant?: 'default' | 'danger',
 *   className?: string,
 *   ariaLabel?: string,
 * }} props
 */
export default function Checkbox({
  id,
  name,
  checked = false,
  onChange,
  label,
  disabled = false,
  variant = 'default',
  className = '',
  ariaLabel,
}) {
  const handleChange = (event) => {
    if (disabled) return;
    onChange?.(event.target.checked, event);
  };

  const checkboxClass = [
    'maq-checkbox',
    variant === 'danger' ? 'maq-checkbox--danger' : '',
    checked ? 'maq-checkbox--checked' : '',
    disabled ? 'maq-checkbox--disabled' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <label className={checkboxClass} htmlFor={id}>
      <span className="maq-checkbox__box-wrap">
        <input
          id={id}
          name={name}
          type="checkbox"
          className="maq-checkbox__input"
          checked={checked}
          disabled={disabled}
          onChange={handleChange}
          aria-label={ariaLabel}
        />
        <span className="maq-checkbox__custom-box" aria-hidden="true">
          {checked ? (
            <svg
              className="maq-checkbox__icon"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3.5 8.5L6.5 11.5L12.5 4.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : null}
        </span>
      </span>
      {label ? <span className="maq-checkbox__label">{label}</span> : null}
    </label>
  );
}
