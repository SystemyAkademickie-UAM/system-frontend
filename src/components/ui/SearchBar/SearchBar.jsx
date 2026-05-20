import './SearchBar.css';

function SearchIcon() {
  return (
    <svg className="maq-search-bar__icon-svg" width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path
        d="M7.875 13.5a5.625 5.625 0 1 0 0-11.25 5.625 5.625 0 0 0 0 11.25Zm7.087 3.338-2.74-2.74"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Pasek wyszukiwania z ikoną lupy.
 *
 * @param {Object} props
 * @param {string} [props.value]
 * @param {(event: import('react').ChangeEvent<HTMLInputElement>) => void} [props.onChange]
 * @param {string} [props.placeholder]
 * @param {string} [props.name]
 * @param {string} [props.className]
 */
export default function SearchBar({
  value,
  onChange,
  placeholder = 'Szukaj…',
  name = 'search',
  className = '',
  ...rest
}) {
  return (
    <div className={['maq-search-bar', className].filter(Boolean).join(' ')}>
      <span className="maq-search-bar__icon">
        <SearchIcon />
      </span>
      <input
        type="search"
        className="maq-search-bar__input"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        {...rest}
      />
    </div>
  );
}
