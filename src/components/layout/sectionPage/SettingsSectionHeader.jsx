/**
 * @file SettingsSectionHeader.jsx
 * @description Komponent interfejsu użytkownika SettingsSectionHeader.
 */

// === IMPORTY I ZALEŻNOŚCI ===
import './SettingsSectionHeader.css';

// === STAŁE I ETYKIETY JĘZYKOWE ===
/**
 * Nagłówek sekcji na stronach ustawień (np. Ogólne, Awatar).
 *
 * @param {Object} props
 * @param {string} props.title
 * @param {string} [props.id]
 * @param {string} [props.className]
 */

// === GŁÓWNY KOMPONENT WIDOKU ===
export default function SettingsSectionHeader({ title, id, className = '' }) {
  return (
    <h2
      id={id}
      className={['settings-section-header', className].filter(Boolean).join(' ')}
    >
      {title}
    </h2>
  );
}
