/**
 * @file SearchBar.jsx
 * @description Komponent interfejsu użytkownika SearchBar.
 */

// === IMPORTY I ZALEŻNOŚCI ===
import AssetSvg from '../AssetSvg/AssetSvg.jsx';
import { SVG_ICONS } from '../../../constants/svgIcons.js';
import './SearchBar.css';

// === STAŁE I ETYKIETY JĘZYKOWE ===
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

// === GŁÓWNY KOMPONENT WIDOKU ===
export default function SearchBar({
  value,
  onChange,
  placeholder = 'Szukaj…',
  name = 'search',
  className = '',
  ...rest
}) {

// === RENDEROWANIE WIDOKU ===
return (
    <div className={['maq-search-bar', className].filter(Boolean).join(' ')}>
      <span className="maq-search-bar__icon">
        <AssetSvg
          name={SVG_ICONS.controls.search}
          className="maq-search-bar__icon-svg"
          width={18}
          height={18}
          alt=""
        />
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
