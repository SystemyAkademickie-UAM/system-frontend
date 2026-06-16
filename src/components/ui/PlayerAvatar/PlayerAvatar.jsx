import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

import { Link } from 'react-router-dom';

import { createPortal } from 'react-dom';

import CurrencyDisplay from '../Currency/CurrencyDisplay.jsx';

import { getAvatarImageClassName } from '../../../utils/avatarDisplay.js';
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

  const [tooltipVisible, setTooltipVisible] = useState(tooltipAlwaysVisible);

  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });



  const updateTooltipPosition = useCallback(() => {

    if (!triggerRef.current) {

      return;

    }



    const rect = triggerRef.current.getBoundingClientRect();

    const tooltipWidth = 220;

    let left = rect.left + rect.width / 2 - tooltipWidth / 2;

    let top = rect.bottom + 8;



    if (tooltipPlacement === 'left') {

      left = rect.left - tooltipWidth - 12;

      top = rect.top + rect.height / 2 - 48;

    } else if (tooltipPlacement === 'right') {

      left = rect.right + 12;

      top = rect.top + rect.height / 2 - 48;

    }



    left = Math.max(16, Math.min(left, window.innerWidth - tooltipWidth - 16));

    top = Math.max(16, Math.min(top, window.innerHeight - 120));



    setTooltipPos({ x: left, y: top });

  }, [tooltipPlacement]);



  useEffect(() => {

    if (!tooltipAlwaysVisible) {

      return undefined;

    }



    updateTooltipPosition();

    window.addEventListener('resize', updateTooltipPosition);

    window.addEventListener('scroll', updateTooltipPosition, true);



    return () => {

      window.removeEventListener('resize', updateTooltipPosition);

      window.removeEventListener('scroll', updateTooltipPosition, true);

    };

  }, [tooltipAlwaysVisible, updateTooltipPosition, nickname, totalEarned, currencySymbol]);

  useLayoutEffect(() => {
    if (tooltipAlwaysVisible) {
      updateTooltipPosition();
    }
  }, [tooltipAlwaysVisible, updateTooltipPosition]);

  const handleMouseEnter = () => {

    if (tooltipAlwaysVisible) {

      return;

    }

    updateTooltipPosition();

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

            className={[

              'maq-player-avatar__tooltip',

              `maq-player-avatar__tooltip--${tooltipPlacement}`,

              tooltipPlain ? 'maq-player-avatar__tooltip--plain' : '',

            ].filter(Boolean).join(' ')}

            style={{ left: `${tooltipPos.x}px`, top: `${tooltipPos.y}px` }}

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


