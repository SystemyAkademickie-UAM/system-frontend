import { useCallback, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import AssetSvg from '../AssetSvg/AssetSvg.jsx';
import { SVG_ICONS } from '../../../constants/svgIcons.js';
import { positionCenteredTooltip } from '../../../utils/ui/positionTooltipInViewport.js';
import './InfoTooltip.css';

/**
 * Mała ikona informacji z podpowiedzią po najechaniu (portal — zawsze nad oknami).
 * Opcjonalnie `children` — podpowiedź po najechaniu na przekazany element (np. cenę).
 *
 * @param {Object} props
 * @param {string} props.text — treść wyjaśnienia
 * @param {string} [props.iconFile] — SVG w public/assets/svg/ (domyślnie status/info.svg)
 * @param {string} [props.className]
 * @param {string} [props.ariaLabel='Informacja']
 * @param {import('react').ReactNode} [props.children]
 */
export default function InfoTooltip({
  text,
  iconFile = SVG_ICONS.status.info,
  className = '',
  ariaLabel = 'Informacja',
  children = null,
}) {
  const tooltipId = useId();
  const triggerRef = useRef(null);
  const bubbleRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [layout, setLayout] = useState(null);

  const updateLayout = useCallback(() => {
    const trigger = triggerRef.current;
    const bubble = bubbleRef.current;
    if (!trigger || !bubble) {
      return;
    }

    setLayout(positionCenteredTooltip({
      triggerRect: trigger.getBoundingClientRect(),
      bubbleRect: bubble.getBoundingClientRect(),
    }));
  }, []);

  useLayoutEffect(() => {
    if (!open) {
      setLayout(null);
      return undefined;
    }

    updateLayout();
    const rafId = window.requestAnimationFrame(updateLayout);

    window.addEventListener('scroll', updateLayout, true);
    window.addEventListener('resize', updateLayout);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', updateLayout, true);
      window.removeEventListener('resize', updateLayout);
    };
  }, [open, text, updateLayout]);

  if (!text) {
    return children ?? null;
  }

  const usesWrapTrigger = children != null;

  const bubble = open && typeof document !== 'undefined'
    ? createPortal(
        <span
          ref={bubbleRef}
          id={tooltipId}
          role="tooltip"
          className={[
            'maq-info-tooltip__bubble',
            'maq-info-tooltip__bubble--portal',
            layout?.placement === 'bottom' ? 'maq-info-tooltip__bubble--below' : '',
          ].filter(Boolean).join(' ')}
          style={{
            visibility: layout ? 'visible' : 'hidden',
            left: layout ? `${layout.left}px` : 0,
            top: layout ? `${layout.top}px` : 0,
            '--tooltip-arrow-left': layout ? `${layout.arrowLeft}px` : undefined,
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
        className={[
          'maq-info-tooltip',
          usesWrapTrigger ? 'maq-info-tooltip--wrap' : '',
          className,
        ].filter(Boolean).join(' ')}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
      >
        {usesWrapTrigger ? (
          <span
            ref={triggerRef}
            className="maq-info-tooltip__wrap-trigger"
            tabIndex={0}
            aria-describedby={open ? tooltipId : undefined}
          >
            {children}
          </span>
        ) : (
          <button
            ref={triggerRef}
            type="button"
            className="maq-info-tooltip__trigger"
            aria-label={ariaLabel}
            aria-describedby={open ? tooltipId : undefined}
          >
            <AssetSvg name={iconFile} className="maq-info-tooltip__icon" width={16} height={16} alt="" />
          </button>
        )}
      </span>
      {bubble}
    </>
  );
}
