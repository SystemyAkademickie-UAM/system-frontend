/**
 * @file NavGlyph.jsx
 * @description Komponent interfejsu użytkownika NavGlyph.
 */

// === IMPORTY I ZALEŻNOŚCI ===
import AssetSvg from '../ui/AssetSvg/AssetSvg.jsx';

// === STAŁE I ETYKIETY JĘZYKOWE ===
/**
 * @param {Object} props
 * @param {string} props.id — ścieżka ikony nawigacji bez rozszerzenia (np. nav/home)
 */

// === GŁÓWNY KOMPONENT WIDOKU ===
export default function NavGlyph({ id }) {
  return (
    <span className="nav-glyph" aria-hidden="true">
      <AssetSvg
        name={`${id}.svg`}
        className="nav-glyph__img"
        width={20}
        height={20}
        alt=""
      />
    </span>
  );
}
