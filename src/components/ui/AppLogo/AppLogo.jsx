/**
 * @file AppLogo.jsx
 * @description Komponent interfejsu użytkownika AppLogo.
 */

// === IMPORTY I ZALEŻNOŚCI ===
import { appLogoPath } from '../../../utils/publicAssetUrl.js';
import './AppLogo.css';

// === STAŁE I ETYKIETY JĘZYKOWE ===
/**
 * Logo aplikacji (public/assets/icon/maq.ico).
 *
 * @param {Object} props
 * @param {string} [props.className]
 * @param {number} [props.width=46]
 * @param {number} [props.height=46]
 * @param {string} [props.alt='MyAcademyQuest']
 */

// === GŁÓWNY KOMPONENT WIDOKU ===
export default function AppLogo({
  className = '',
  width = 46,
  height = 46,
  alt = 'MyAcademyQuest',
}) {

// === RENDEROWANIE WIDOKU ===
return (
    <img
      className={['maq-app-logo', className].filter(Boolean).join(' ')}
      src={appLogoPath()}
      alt={alt}
      width={width}
      height={height}
      decoding="async"
    />
  );
}
