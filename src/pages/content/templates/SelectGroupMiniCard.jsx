import { useEffect, useState } from 'react';
import AssetSvg from '../../../components/ui/AssetSvg/AssetSvg.jsx';
import { isColorBannerRef, parseColorBannerRef } from '../../../constants/drive.constants.js';
import { SVG_PLACEHOLDER } from '../../../constants/svgIcons.js';
import './SelectGroupMiniCard.css';

/**
 * Mniejszy kafelek grupy do wyboru w kreatorze szablonu.
 *
 * @param {Object} props
 * @param {import('../../../services/groups.api.js').GroupListItem} props.group
 * @param {boolean} [props.isSelected]
 * @param {boolean} [props.isHovered]
 * @param {() => void} props.onSelect
 * @param {(hovered: boolean) => void} [props.onHoverChange]
 */
export default function SelectGroupMiniCard({
  group,
  isSelected = false,
  isHovered = false,
  onSelect,
  onHoverChange,
}) {
  const [bannerFailed, setBannerFailed] = useState(!group.bannerUrl);
  const isColorBanner = isColorBannerRef(group.bannerUrl);
  const colorBannerValue = parseColorBannerRef(group.bannerUrl);
  const showFallback = !isColorBanner && (bannerFailed || !group.bannerUrl);

  useEffect(() => {
    setBannerFailed(!group.bannerUrl || isColorBannerRef(group.bannerUrl));
  }, [group.bannerUrl]);

  return (
    <button
      type="button"
      className={[
        'maq-select-group-mini-card',
        isSelected ? 'maq-select-group-mini-card--selected' : '',
        isHovered ? 'maq-select-group-mini-card--hovered' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      onClick={onSelect}
      onMouseEnter={() => onHoverChange?.(true)}
      onMouseLeave={() => onHoverChange?.(false)}
      onFocus={() => onHoverChange?.(true)}
      onBlur={() => onHoverChange?.(false)}
    >
      <div className="maq-select-group-mini-card__banner-wrap">
        {isColorBanner ? (
          <div
            className="maq-select-group-mini-card__banner maq-select-group-mini-card__banner--color"
            style={{ backgroundColor: colorBannerValue ?? '#3b82f6' }}
            aria-hidden="true"
          />
        ) : showFallback ? (
          <div className="maq-select-group-mini-card__banner-fallback" aria-hidden="true">
            <AssetSvg name={SVG_PLACEHOLDER} width={28} height={28} alt="" />
          </div>
        ) : (
          <img
            className="maq-select-group-mini-card__banner"
            src={group.bannerUrl}
            alt=""
            loading="lazy"
            onError={() => setBannerFailed(true)}
          />
        )}
      </div>
      <div className="maq-select-group-mini-card__body">
        <span className="maq-select-group-mini-card__title">{group.storyName}</span>
        {group.subject ? <span className="maq-select-group-mini-card__subject">{group.subject}</span> : null}
      </div>
    </button>
  );
}
