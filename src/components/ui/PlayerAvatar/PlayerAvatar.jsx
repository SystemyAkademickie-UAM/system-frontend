import { useCallback, useLayoutEffect, useRef, useState } from 'react';

import { Link } from 'react-router-dom';

import { createPortal } from 'react-dom';

import CurrencyDisplay from '../Currency/CurrencyDisplay.jsx';

import { getAvatarImageClassName } from '../../../utils/avatarDisplay.js';
import { positionSideTooltip } from '../../../utils/ui/positionTooltipInViewport.js';
import './PlayerAvatar.css';



/**

 * Okrągły awatar użytkownika z kafelkiem po najechaniu (nick + zgromadzona waluta).

 *

 * @param {Object} props

 * @param {string} props.nickname

 * @param {string | null | undefined} [props.avatarUrl]

 * @param {number | string} [props.totalEarned]

 * @param {string} [props.currencySymbol]

 * @param {'sm' | 'md' | 'lg'} [props.size='md']

 * @param {'right' | 'left' | 'top'} [props.tooltipPlacement='right']

 * @param {boolean} [props.tooltipAlwaysVisible=false]

 * @param {boolean} [props.tooltipPlain=false]

 * @param {string} [props.className]

 * @param {string} [props.ariaLabel]
 * @param {string} [props.href]
 */

export default function PlayerAvatar({

  nickname,

  avatarUrl,

  totalEarned,

  currencySymbol,

  size = 'md',

  tooltipPlacement = 'right',

  tooltipAlwaysVisible = false,

  tooltipPlain = false,

  className = '',

  ariaLabel,

  href,

}) {

  const triggerRef = useRef(null);
  const bubbleRef = useRef(null);

  const [tooltipVisible, setTooltipVisible] = useState(tooltipAlwaysVisible);
  const [tooltipLayout, setTooltipLayout] = useState(null);

  const updateTooltipPosition = useCallback(() => {
    const trigger = triggerRef.current;
    const bubble = bubbleRef.current;
    if (!trigger || !bubble) {
      return;
    }

    setTooltipLayout(positionSideTooltip({
      triggerRect: trigger.getBoundingClientRect(),
      bubbleRect: bubble.getBoundingClientRect(),
      placement: tooltipPlacement,
    }));
  }, [tooltipPlacement]);

  useLayoutEffect(() => {
    if (!tooltipVisible) {
      setTooltipLayout(null);
      return undefined;
    }

    updateTooltipPosition();
    const rafId = window.requestAnimationFrame(updateTooltipPosition);

    window.addEventListener('resize', updateTooltipPosition);
    window.addEventListener('scroll', updateTooltipPosition, true);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('resize', updateTooltipPosition);
      window.removeEventListener('scroll', updateTooltipPosition, true);
    };
  }, [tooltipVisible, updateTooltipPosition, nickname, totalEarned, currencySymbol]);

  const handleMouseEnter = () => {
    if (tooltipAlwaysVisible) {
      return;
    }

    setTooltipVisible(true);
  };



  const handleMouseLeave = () => {

    if (tooltipAlwaysVisible) {

      return;

    }

    setTooltipVisible(false);

  };



  const displayName = nickname?.trim() || 'Użytkownik';
  const label = ariaLabel ?? `Profil: ${displayName}`;

  const sharedClassName = [
    'maq-player-avatar',
    `maq-player-avatar--${size}`,
    href ? 'maq-player-avatar--link' : '',
    className,
  ].filter(Boolean).join(' ');

  const avatarContent = avatarUrl ? (
    <img
      src={avatarUrl}
      alt=""
      className={getAvatarImageClassName(avatarUrl, 'maq-player-avatar__image')}
      decoding="async"
    />
  ) : (
    <span className="maq-player-avatar__fallback" aria-hidden="true">
      {displayName.charAt(0).toUpperCase()}
    </span>
  );

  return (
    <>
      {href ? (
        <Link
          ref={triggerRef}
          to={href}
          className={sharedClassName}
          aria-label={label}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onFocus={handleMouseEnter}
          onBlur={handleMouseLeave}
        >
          {avatarContent}
        </Link>
      ) : (
        <button
          ref={triggerRef}
          type="button"
          className={sharedClassName}
          aria-label={label}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onFocus={handleMouseEnter}
          onBlur={handleMouseLeave}
        >
          {avatarContent}
        </button>
      )}



      {tooltipVisible
        ? createPortal(
          <div
            ref={bubbleRef}
            className={[
              'maq-player-avatar__tooltip',
              `maq-player-avatar__tooltip--${tooltipLayout?.placement ?? tooltipPlacement}`,
              tooltipPlain ? 'maq-player-avatar__tooltip--plain' : '',
            ].filter(Boolean).join(' ')}
            style={{
              visibility: tooltipLayout ? 'visible' : 'hidden',
              left: tooltipLayout ? `${tooltipLayout.left}px` : 0,
              top: tooltipLayout ? `${tooltipLayout.top}px` : 0,
            }}
            role="tooltip"
          >

            <p className="maq-player-avatar__tooltip-name">{displayName}</p>

            {totalEarned !== undefined && totalEarned !== null ? (

              <div className="maq-player-avatar__tooltip-meta">

                <span className="maq-player-avatar__tooltip-label">Zgromadzona</span>

                <CurrencyDisplay amount={totalEarned} symbol={currencySymbol} size="md" />

              </div>

            ) : null}

          </div>,

          document.body,

        )

        : null}

    </>

  );

}


