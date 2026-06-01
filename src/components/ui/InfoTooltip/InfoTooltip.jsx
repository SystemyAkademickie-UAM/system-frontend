import { useId, useState } from 'react';
import AssetSvg from '../AssetSvg/AssetSvg.jsx';
import { SVG_ICONS } from '../../../constants/svgIcons.js';
import './InfoTooltip.css';

/**
 * Mała ikona informacji z podpowiedzią po najechaniu.
 *
 * @param {Object} props
 * @param {string} props.text — treść wyjaśnienia
 * @param {string} [props.iconFile] — SVG w public/assets/svg/ (domyślnie status/info.svg)
 * @param {string} [props.className]
 * @param {string} [props.ariaLabel='Informacja']
 */
export default function InfoTooltip({
  text,
  iconFile = SVG_ICONS.status.info,
  className = '',
  ariaLabel = 'Informacja',
}) {
  const tooltipId = useId();
  const [open, setOpen] = useState(false);

  if (!text) {
    return null;
  }

  return (
    <span
      className={['maq-info-tooltip', className].filter(Boolean).join(' ')}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      <button
        type="button"
        className="maq-info-tooltip__trigger"
        aria-label={ariaLabel}
        aria-describedby={open ? tooltipId : undefined}
      >
        <AssetSvg name={iconFile} className="maq-info-tooltip__icon" width={16} height={16} alt="" />
      </button>
      {open ? (
        <span id={tooltipId} role="tooltip" className="maq-info-tooltip__bubble">
          {text}
        </span>
      ) : null}
    </span>
  );
}
