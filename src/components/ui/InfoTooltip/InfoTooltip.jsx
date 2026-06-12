import { useCallback, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import AssetSvg from '../AssetSvg/AssetSvg.jsx';
import { SVG_ICONS } from '../../../constants/svgIcons.js';
import './InfoTooltip.css';

const VIEWPORT_MARGIN = 8;

/**
 * Mała ikona informacji z podpowiedzią po najechaniu (portal — zawsze nad oknami).
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
  const triggerRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState(null);
  const [placement, setPlacement] = useState('top');

  const updatePosition = useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;

    const rect = trigger.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const spaceAbove = rect.top;
    const nextPlacement = spaceAbove < 96 ? 'bottom' : 'top';

    setPlacement(nextPlacement);
    setCoords({
      x: centerX,
      y: nextPlacement === 'top' ? rect.top : rect.bottom,
    });
  }, []);

  useLayoutEffect(() => {
    if (!open) {
      setCoords(null);
      return undefined;
    }

    updatePosition();

    const handleUpdate = () => updatePosition();
    window.addEventListener('scroll', handleUpdate, true);
    window.addEventListener('resize', handleUpdate);

    return () => {
      window.removeEventListener('scroll', handleUpdate, true);
      window.removeEventListener('resize', handleUpdate);
    };
  }, [open, updatePosition]);

  if (!text) {
    return null;
  }

  const bubble = open && coords && typeof document !== 'undefined'
    ? createPortal(
        <span
          id={tooltipId}
          role="tooltip"
          className={[
            'maq-info-tooltip__bubble',
            'maq-info-tooltip__bubble--portal',
            placement === 'bottom' ? 'maq-info-tooltip__bubble--below' : '',
          ].filter(Boolean).join(' ')}
          style={{
            left: `${coords.x}px`,
            top: `${coords.y}px`,
          }}
        >
          {text}
        </span>,
        document.body,
      )
    : null;

  return (
    <>
      <span
        className={['maq-info-tooltip', className].filter(Boolean).join(' ')}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
      >
        <button
          ref={triggerRef}
          type="button"
          className="maq-info-tooltip__trigger"
          aria-label={ariaLabel}
          aria-describedby={open ? tooltipId : undefined}
        >
          <AssetSvg name={iconFile} className="maq-info-tooltip__icon" width={16} height={16} alt="" />
        </button>
      </span>
      {bubble}
    </>
  );
}
