import { useNavigate } from 'react-router-dom';
import AssetSvg from '../../ui/AssetSvg/AssetSvg.jsx';
import { SVG_ICONS } from '../../../constants/svgIcons.js';
import { READLANGUAGECOOKIE } from '../../../utils/LANGUAGECOOKIE.js';
import './SuperBarBackButton.css';

import { useState } from 'react';

/**
 * @param {{
 *   ariaLabel?: string,
 *   fallbackTo: string,
 *   onNavigate?: () => void,
 * }} props
 */
const BACKBUTTON__TEXTLABEL = {
  polish: 'Wróć do poprzedniej strony',
  english: 'Go back to previous page',
};

export default function SuperBarBackButton({
  ariaLabel,
  fallbackTo,
  onNavigate,
}) {
  const [LANGUAGE] = useState(READLANGUAGECOOKIE);
  const navigate = useNavigate();

  const handleClick = () => {
    onNavigate?.();

    if (window.history.state?.idx > 0) {
      navigate(-1);
      return;
    }

    navigate(fallbackTo, { replace: false });
  };

  return (
    <button
      type="button"
      className="super-bar-back"
      aria-label={ariaLabel ?? BACKBUTTON__TEXTLABEL[LANGUAGE]}
      onClick={handleClick}
    >
      <AssetSvg
        name={SVG_ICONS.controls.chevronLeft}
        className="super-bar-back__icon"
        width={28}
        height={28}
        alt=""
      />
    </button>
  );
}
