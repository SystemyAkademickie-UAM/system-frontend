import { Badge } from '../../../components/ui/index.js';
import BadgeEarnersBar from './BadgeEarnersBar.jsx';
import { getBadgeEarners } from './badgeTreasuryModel.js';
import LecturerTileActions from '../group-rewards/shared/LecturerTileActions.jsx';
import { getTileVisibilityLabel } from '../../../utils/rewards/visibilityStatusLabel.js';
import { READLANGUAGECOOKIE } from '../../../utils/LANGUAGECOOKIE.js';
import '../../../components/ui/ProductCard/ProductCard.css';
import './BadgeTreasuryCard.css';

const ENTITYLABEL__TEXTLABEL = {
  polish: 'odznakę',
  english: 'badge'
};

const ASSIGNLABEL__TEXTLABEL = {
  polish: 'Przydziel odznakę',
  english: 'Assign badge'
};

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
 * @param {() => void} [props.onAssign]
 */
export default function BadgeTreasuryCard({
  badge,
  earnersByBadgeId,
  excludeAccountId = null,
  isStudentView = false,
  showLecturerActions = false,
  LANGUAGE,
  onEdit,
  onDelete,
  onAssign,
}) {
  const earners = getBadgeEarners(earnersByBadgeId, badge.dbId, excludeAccountId);
  const isLocked = isStudentView && !badge.isUnlocked;
  const hasEarners = earners.length > 0;
  const isPublished = badge.isPublished !== false;

  return (
    <article className={[
      'badge-treasury-card',
      hasEarners ? 'badge-treasury-card--has-earners' : '',
      showLecturerActions ? 'badge-treasury-card--lecturer' : '',
    ].filter(Boolean).join(' ')}>
      {showLecturerActions ? (
        <>
          <span
            className={[
              'badge-treasury-card__visibility',
              isPublished
                ? 'badge-treasury-card__visibility--public'
                : 'badge-treasury-card__visibility--hidden',
            ].join(' ')}
          >
            {getTileVisibilityLabel(isPublished, 'badge')}
          </span>
          <LecturerTileActions
            entityLabel={ENTITYLABEL__TEXTLABEL[LANGUAGE]}
            name={badge.name}
            onEdit={onEdit}
            onDelete={onDelete}
            onAssign={onAssign}
            assignLabel={ASSIGNLABEL__TEXTLABEL[LANGUAGE]}
            className="badge-treasury-card__actions"
          />
        </>
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
          LANGUAGE={LANGUAGE}
        />
      </div>
    </article>
  );
}
