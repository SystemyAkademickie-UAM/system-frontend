import AssetSvg from '../AssetSvg/AssetSvg.jsx';
import CurrencyDisplay from '../Currency/CurrencyDisplay.jsx';
import { getRankCssVars } from './rankCssVars.js';
import { RANK_THEME } from './rankTheme.js';
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
  icon,
  iconFile,
  theme = RANK_THEME.default,
  className = '',
}) {
  const assetName = iconFile || 'rank-default.svg';

  return (
    <article
      className={['maq-rank', className].filter(Boolean).join(' ')}
      data-theme={theme}
      style={getRankCssVars(theme)}
    >
      <header className="maq-rank__header">
        <div className="maq-rank__icon-circle">
          {icon ?? (
            <AssetSvg
              name={assetName}
              className="maq-rank__icon-svg"
              alt=""
            />
          )}
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
          {shopItems.length > 0 ? (
            <ul className="maq-rank__shop-list">
              {shopItems.map((item) => (
                <li key={item} className="maq-rank__shop-item">
                  <AssetSvg
                    name="ui-check-circle.svg"
                    className="maq-rank__check-icon"
                    width={11}
                    height={11}
                    alt=""
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="maq-rank__text maq-rank__text--empty">Brak odblokowanych przedmiotów.</p>
          )}
        </section>
      </div>
    </article>
  );
}

export { RANK_THEME, getRankThemeConfig } from './rankTheme.js';
