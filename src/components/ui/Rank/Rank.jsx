import AssetSvg from '../AssetSvg/AssetSvg.jsx';
import CurrencyDisplay from '../Currency/CurrencyDisplay.jsx';
import { resolveSvgAssetName } from '../../../utils/svgAssetPath.js';
import { SVG_ICONS } from '../../../constants/svgIcons.js';
import { getRankCssVars } from './rankCssVars.js';
import { RANK_THEME } from './rankTheme.js';
import './Rank.css';

function formatRankDiscountLabel(discount) {
  const value = Number(discount ?? 0);
  const normalized = Number.isFinite(value) ? value : 0;
  const formatted = Number.isInteger(normalized)
    ? String(normalized)
    : normalized.toFixed(2).replace(/\.?0+$/, '');
  return `Zniżka w sklepie: ${formatted}%`;
}

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
  theme = RANK_THEME.default,
  accentColor,
  isLocked = false,
  className = '',
}) {
  const assetName = resolveSvgAssetName(iconFile);

  return (
    <article
      className={['maq-rank', isLocked ? 'maq-rank--locked' : '', className].filter(Boolean).join(' ')}
      data-theme={theme}
      style={getRankCssVars(theme, { accentColor, isLocked })}
    >
      <header className="maq-rank__header">
        <div className="maq-rank__icon-circle">
          <AssetSvg
            name={assetName}
            className="maq-rank__icon-svg"
            alt=""
          />
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
            {shopItems.map((item) => (
              <li key={item} className="maq-rank__shop-item">
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
