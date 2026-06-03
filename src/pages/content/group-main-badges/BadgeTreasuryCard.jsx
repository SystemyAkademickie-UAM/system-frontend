import { Badge } from '../../../components/ui/index.js';
import BadgeEarnersBar from './BadgeEarnersBar.jsx';
import { getBadgeEarners } from './badgeTreasuryModel.js';
import './BadgeTreasuryCard.css';

/**
 * @param {Object} props
 * @param {import('./badgeTreasuryModel.js').TreasuryBadge} props.badge
 * @param {Map<number, import('./badgeTreasuryModel.js').TreasuryStudent[]>} props.earnersByBadgeId
 * @param {number | null} [props.excludeAccountId]
 * @param {string} [props.currencySymbol]
 * @param {boolean} [props.isStudentView]
 */
export default function BadgeTreasuryCard({
  badge,
  earnersByBadgeId,
  excludeAccountId = null,
  currencySymbol,
  isStudentView = false,
}) {
  const earners = getBadgeEarners(earnersByBadgeId, badge.dbId, excludeAccountId);
  const isLocked = isStudentView && !badge.isUnlocked;
  const hasEarners = earners.length > 0;

  return (
    <article className={['badge-treasury-card', hasEarners ? 'badge-treasury-card--has-earners' : ''].filter(Boolean).join(' ')}>
      <div className="badge-treasury-card__main">
        <Badge
          rarity={badge.rarity}
          name={badge.name}
          storyDescription={badge.storyDescription || '—'}
          didacticDescription={badge.didacticDescription || '—'}
          rewardAmount={badge.rewardAmount}
          rewardEmoji={badge.rewardEmoji}
          iconFile={badge.iconFile}
          showEarnedAt={false}
          isLocked={isLocked}
          className="badge-treasury-card__badge maq-badge--grid-fit"
        />
        <BadgeEarnersBar
          students={earners}
          currencySymbol={currencySymbol}
          className="badge-treasury-card__earners"
        />
      </div>
    </article>
  );
}
