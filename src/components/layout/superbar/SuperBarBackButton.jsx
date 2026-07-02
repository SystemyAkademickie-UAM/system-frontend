import { useNavigate } from 'react-router-dom';
import AssetSvg from '../../ui/AssetSvg/AssetSvg.jsx';
import { SVG_ICONS } from '../../../constants/svgIcons.js';
import './SuperBarBackButton.css';

/**
 * @param {{
 *   ariaLabel?: string,
 *   fallbackTo: string,
 *   onNavigate?: () => void,
 * }} props
 */
export default function SuperBarBackButton({
  ariaLabel = 'Wróć do poprzedniej strony',
  fallbackTo,
  onNavigate,
}) {
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
      aria-label={ariaLabel}
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
