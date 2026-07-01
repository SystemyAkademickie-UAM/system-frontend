import { Badge } from '../../../components/ui/index.js';
import BadgeEarnersBar from './BadgeEarnersBar.jsx';
import { getBadgeEarners } from './badgeTreasuryModel.js';
import LecturerTileActions from '../group-rewards/shared/LecturerTileActions.jsx';
import '../../../components/ui/ProductCard/ProductCard.css';
import './BadgeTreasuryCard.css';

/**
 * @param {Object} props
 * @param {import('./badgeTreasuryModel.js').TreasuryBadge} props.badge
 * @param {Map<number, import('./badgeTreasuryModel.js').TreasuryStudent[]>} props.earnersByBadgeId
 * @param {number | null} [props.excludeAccountId]
 * @param {string} [props.currencySymbol]
 * @param {boolean} [props.isStudentView]
 * @param {boolean} [props.showLecturerActions]
 * @param {() => void} [props.onEdit]
 * @param {() => void} [props.onDelete]
 */
export default function BadgeTreasuryCard({
  badge,
  earnersByBadgeId,
  excludeAccountId = null,
  isStudentView = false,
  showLecturerActions = false,
  onEdit,
  onDelete,
}) {
  const earners = getBadgeEarners(earnersByBadgeId, badge.dbId, excludeAccountId);
  const isLocked = isStudentView && !badge.isUnlocked;
  const hasEarners = earners.length > 0;

  return (
    <article className={[
      'badge-treasury-card',
      hasEarners ? 'badge-treasury-card--has-earners' : '',
      showLecturerActions ? 'badge-treasury-card--lecturer' : '',
    ].filter(Boolean).join(' ')}>
      {showLecturerActions ? (
        <LecturerTileActions
          entityLabel="odznakę"
          name={badge.name}
          onEdit={onEdit}
          onDelete={onDelete}
          className="badge-treasury-card__actions"
        />
      ) : null}
      <div className="badge-treasury-card__main">
        <Badge
          rarity={badge.rarity}
          name={badge.name}
          storyDescription={badge.storyDescription || '—'}
          didacticDescription={badge.didacticDescription || '—'}
          rewardAmount={badge.rewardAmount}
          iconFile={badge.iconFile}
          showEarnedAt={false}
          isLocked={isLocked}
          className="badge-treasury-card__badge maq-badge--grid-fit"
        />
        <BadgeEarnersBar
          students={earners}
          className="badge-treasury-card__earners"
        />
      </div>
    </article>
  );
}
