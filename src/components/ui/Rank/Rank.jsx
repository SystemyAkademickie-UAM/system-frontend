import AssetSvg from '../AssetSvg/AssetSvg.jsx';
import CurrencyDisplay from '../Currency/CurrencyDisplay.jsx';
import { DEFAULT_RANK_EMOJI, normalizeRankBadgeIcon } from '../../../utils/ranks/rankBadgeIcon.js';
import { SVG_ICONS } from '../../../constants/svgIcons.js';
import { getRankCssVars } from './rankCssVars.js';
import { RANK_THEME } from './rankTheme.js';
import { formatRankDiscountLabel } from '../../../utils/ranks/rankDiscount.js';
import './Rank.css';

/**
 * Kafelek rangi (Figma: Background+VerticalBorder).
 */
export default function Rank({
  name,
  costAmount = 0,
  costEmoji,
  storyDescription,
  shopItems = [],
  discountPercent = 0,
  iconFile,
  icon,
  theme = RANK_THEME.default,
  accentColor,
  isLocked = false,
  className = '',
}) {
  const emoji = normalizeRankBadgeIcon(icon ?? iconFile, DEFAULT_RANK_EMOJI);

  return (
    <article
      className={['maq-rank', isLocked ? 'maq-rank--locked' : '', className].filter(Boolean).join(' ')}
      data-theme={theme}
      style={getRankCssVars(theme, { accentColor, isLocked })}
    >
      <header className="maq-rank__header">
        <div className="maq-rank__icon-circle">
          <span className="maq-rank__icon-emoji" aria-hidden="true">{emoji}</span>
        </div>
        <h3 className="maq-rank__name">{name}</h3>
        <span className="maq-rank__cost">
          <CurrencyDisplay amount={costAmount} symbol={costEmoji} size="md" />
        </span>
      </header>

      <div className="maq-rank__columns">
        <section className="maq-rank__section">
          <span className="maq-rank__label">Status fabularny</span>
          <p className="maq-rank__text">{storyDescription}</p>
        </section>

        <section className="maq-rank__section">
          <span className="maq-rank__label">Odblokowane przedmioty w sklepie</span>
          <ul className="maq-rank__shop-list">
            <li className="maq-rank__shop-item maq-rank__shop-item--discount">
              <AssetSvg
                name={SVG_ICONS.status.checkCircle}
                className="maq-rank__check-icon maq-rank__check-icon--discount"
                width={11}
                height={11}
                alt=""
              />
              <span>{formatRankDiscountLabel(discountPercent)}</span>
            </li>
            {shopItems.map((item, index) => (
              <li key={`rank-shop-item-${index}-${String(item)}`} className="maq-rank__shop-item">
                <AssetSvg
                  name={SVG_ICONS.status.checkCircle}
                  className="maq-rank__check-icon"
                  width={11}
                  height={11}
                  alt=""
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          {shopItems.length === 0 ? (
            <p className="maq-rank__text maq-rank__text--empty maq-rank__text--shop-extra">
              Brak dodatkowych odblokowanych przedmiotów.
            </p>
          ) : null}
        </section>
      </div>
    </article>
  );
}

export { RANK_THEME, getRankThemeConfig } from './rankTheme.js';
