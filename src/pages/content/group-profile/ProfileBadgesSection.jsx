import { Badge, CurrencyDisplay } from '../../../components/ui/index.js';
import { DEFAULT_BADGE_EMOJI, normalizeRankBadgeIcon } from '../../../utils/ranks/rankBadgeIcon.js';
import { useProfileStudentProfileContext } from './ProfileStudentProfileContext.js';
import '../group-activities/shared/activitiesShared.css';
import './ProfileBadgesSection.css';

export default function ProfileBadgesSection() {
  const { profile, isLoading } = useProfileStudentProfileContext();

  if (isLoading) {
    return null;
  }

  const earnedBadges = profile?.earnedBadges ?? [];

  return (
    <div className="profile-badges-section">
      <div className="profile-badges-section__header">
        <h2 className="profile-badges-section__title">Zdobyte odznaki</h2>
        <span className="activities-page__count profile-badges-section__count">
          {earnedBadges.length}
          {' '}
          zdobytych
        </span>
      </div>

      {earnedBadges.length === 0 ? (
        <p className="profile-badges-section__empty">Nie masz jeszcze żadnych odznak w tej grupie.</p>
      ) : (
        <div className="profile-badges-section__grid">
          {earnedBadges.map((badge) => (
            <Badge
              key={badge.id}
              rarity={badge.rarity || 'common'}
              name={badge.name}
              storyDescription={badge.storyDescription || '—'}
              didacticDescription={badge.educationalDescription || '—'}
              rewardAmount={badge.rewardAmount ?? 0}
              iconFile={normalizeRankBadgeIcon(badge.icon, DEFAULT_BADGE_EMOJI)}
              showEarnedAt={false}
              className="maq-badge--grid-fit"
            />
          ))}
        </div>
      )}
    </div>
  );
}
