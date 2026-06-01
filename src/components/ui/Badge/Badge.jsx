import { getBadgeCssVars } from './badgeCssVars.js';
import BadgeIcon from './BadgeIcon.jsx';
import CurrencyDisplay from '../Currency/CurrencyDisplay.jsx';
import { BADGE_RARITY, getBadgeRarityConfig } from './badgeRarity.js';
import './Badge.css';

/**
 * Pełny kafelek odznaki (Figma: Achievement Card).
 *
 * @param {Object} props
 * @param {'common' | 'uncommon' | 'rare' | 'epic'} [props.rarity='common']
 * @param {string} props.name
 * @param {string} props.storyDescription
 * @param {string} props.didacticDescription
 * @param {number} [props.rewardAmount=0]
 * @param {string} [props.rewardEmoji] — nadpisanie symbolu waluty
 * @param {string} [props.earnedAt]
 * @param {boolean} [props.showEarnedAt=true]
 * @param {import('react').ReactNode} [props.icon]
 * @param {string} [props.iconFile]
 * @param {string} [props.className]
 */
export default function Badge({
  rarity = BADGE_RARITY.common,
  name,
  storyDescription,
  didacticDescription,
  rewardAmount = 0,
  rewardEmoji,
  earnedAt,
  showEarnedAt = true,
  icon,
  iconFile,
  className = '',
}) {
  const config = getBadgeRarityConfig(rarity);
  const showFooter = showEarnedAt && earnedAt;

  return (
    <article
      className={['maq-badge', className].filter(Boolean).join(' ')}
      data-rarity={rarity}
      style={getBadgeCssVars(rarity)}
    >
      <span className="maq-badge__rarity">{config.label}</span>

      <div className="maq-badge__body">
        <div className="maq-badge__icon-wrap">
          <BadgeIcon iconFile={iconFile} />
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
            <CurrencyDisplay
              amount={rewardAmount}
              symbol={rewardEmoji}
              size="md"
              className="maq-badge__reward-value"
            />
          </div>

          {showFooter ? (
            <p className="maq-badge__earned-at">{`• ${earnedAt}`}</p>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export { BADGE_RARITY, BADGE_RARITY_LABELS, getBadgeRarityConfig } from './badgeRarity.js';
