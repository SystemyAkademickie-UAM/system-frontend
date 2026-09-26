import { useState } from 'react';
import { getBadgeCssVars } from './badgeCssVars.js';
import BadgeIcon from './BadgeIcon.jsx';
import CurrencyDisplay from '../Currency/CurrencyDisplay.jsx';
import { BADGE_RARITY, getBadgeRarityConfig } from './badgeRarity.js';
import { READLANGUAGECOOKIE } from '../../../utils/LANGUAGECOOKIE.js';
import './Badge.css';

const STORYDESCRIPTION__TEXTLABEL = {
  polish: 'Opis fabularny',
  english: 'Story Description',
};

const DIDACTICDESCRIPTIONL__TEXTLABEL = {
  polish: 'Opis dydaktyczny',
  english: 'Didactic Description',
};

const REWARD__TEXTLABEL = {
  polish: 'Nagroda',
  english: 'Reward',
};

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
 * @param {boolean} [props.isLocked=false]

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
  isLocked = false,
  className = '',
}) {
  const [LANGUAGE] = useState(READLANGUAGECOOKIE);
  const config = getBadgeRarityConfig(rarity);
  const showDate = showEarnedAt && Boolean(earnedAt);

  return (
    <article
      className={['maq-badge', isLocked ? 'maq-badge--locked' : '', className].filter(Boolean).join(' ')}
      data-rarity={rarity}
      style={getBadgeCssVars(rarity, { isLocked })}
    >
      <div className="maq-badge__main">
        <header className="maq-badge__header">
          <div className="maq-badge__icon-wrap">
            {icon ?? <BadgeIcon iconFile={iconFile} />}
          </div>

          <div className="maq-badge__heading">
            <h3 className="maq-badge__name">{name}</h3>
            <span className="maq-badge__rarity">{config.label}</span>
          </div>

          {showDate ? (
            <time className="maq-badge__date" dateTime={earnedAt}>
              {`• ${earnedAt}`}
            </time>
          ) : null}
        </header>

        <div className="maq-badge__descriptions">
          <div className="maq-badge__section">
            <span className="maq-badge__section-label">{STORYDESCRIPTION__TEXTLABEL[LANGUAGE]}</span>
            <p className="maq-badge__story-text">{storyDescription}</p>
          </div>

          <div className="maq-badge__section">
            <span className="maq-badge__section-label">{DIDACTICDESCRIPTIONL__TEXTLABEL[LANGUAGE]}</span>
            <p className="maq-badge__didactic-text">{didacticDescription}</p>
          </div>
        </div>
      </div>

      <footer className="maq-badge__reward">
        <span className="maq-badge__section-label">{REWARD__TEXTLABEL[LANGUAGE]}</span>
        <CurrencyDisplay
          amount={rewardAmount}
          symbol={rewardEmoji}
          size="md"
          className="maq-badge__reward-value"
        />
      </footer>
    </article>
  );
}

export { BADGE_RARITY, BADGE_RARITY_LABELS, getBadgeRarityConfig } from './badgeRarity.js';
