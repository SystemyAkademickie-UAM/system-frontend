import AssetSvg from '../ui/AssetSvg/AssetSvg.jsx';

/**
 * @param {Object} props
 * @param {string} props.id — identyfikator ikony nawigacji (np. nav-ekran-glowny)
 */
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
