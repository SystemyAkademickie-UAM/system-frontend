import { getBadgeCssVars } from './badgeCssVars.js';
import BadgeIcon from './BadgeIcon.jsx';
import { BADGE_RARITY, getBadgeRarityConfig } from './badgeRarity.js';
import './Badge.css';
/**
 * Kafelek odznaki z paskiem rzadkości, ikoną, opisami i nagrodą.
 *
 * @param {Object} props
 * @param {'common' | 'uncommon' | 'rare' | 'epic'} [props.rarity='common']
 * @param {string} props.name — nazwa odznaki
 * @param {string} props.storyDescription — opis fabularny
 * @param {string} props.didacticDescription — opis dydaktyczny
 * @param {number} [props.rewardAmount=0]
 * @param {string} [props.rewardEmoji='🥕']
 * @param {string} [props.earnedAt] — tekst czasu zdobycia (np. „Dzisiaj”)
 * @param {boolean} [props.showEarnedAt=true] — wyświetlanie stopki z czasem zdobycia
 * @param {boolean} [props.compact=false] — mniejszy wariant dopasowany do treści
 * @param {import('react').ReactNode} [props.icon] — własna ikona (domyślnie plik SVG z iconFile)
 * @param {string} [props.iconFile] — nazwa pliku w public/assets/svg/
 * @param {string} [props.className]
 */
export default function Badge({
  rarity = BADGE_RARITY.common,
  name,
  storyDescription,
  didacticDescription,
  rewardAmount = 0,
  rewardEmoji = '🥕',
  earnedAt,
  showEarnedAt = true,
  compact = false,
  icon,
  iconFile,
  className = '',
}) {
  const config = getBadgeRarityConfig(rarity);
  const showFooter = showEarnedAt && earnedAt;

  return (
    <article
      className={[
        'maq-badge',
        compact ? 'maq-badge--compact' : '',
        className,
      ].filter(Boolean).join(' ')}
      data-rarity={rarity}
      style={getBadgeCssVars(rarity)}
    >
      <span className="maq-badge__rarity">{config.label}</span>

      <div className="maq-badge__body">
        <div className="maq-badge__icon-wrap">
          <BadgeIcon icon={icon} iconFile={iconFile} />
        </div>

        <div className="maq-badge__content">
          <h3 className="maq-badge__name">{name}</h3>

          <div className="maq-badge__sections">
            <div className="maq-badge__section">
              <span className="maq-badge__section-label">Opis fabularny</span>
              <p className="maq-badge__story-text">{storyDescription}</p>
            </div>

            <div className="maq-badge__section">
              <span className="maq-badge__section-label">Opis dydaktyczny</span>
              <p className="maq-badge__didactic-text">{didacticDescription}</p>
            </div>
          </div>

          <div className="maq-badge__reward">
            <span className="maq-badge__section-label">Nagroda</span>
            <span className="maq-badge__reward-value">
              {rewardAmount}
              {' '}
              <span className="maq-badge__reward-emoji" aria-hidden="true">{rewardEmoji}</span>
            </span>
          </div>

          {showFooter ? (
            <p className="maq-badge__earned-at">{`• ${earnedAt}`}</p>
          ) : null}
        </div>
      </div>    </article>
  );
}

export { BADGE_RARITY, BADGE_RARITY_LABELS, getBadgeRarityConfig } from './badgeRarity.js';