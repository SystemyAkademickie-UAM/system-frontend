import { Badge } from '../../../components/ui/index.js';
import { useProfileStudentProfileContext } from './ProfileStudentProfileContext.js';
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
        <h2 className="profile-badges-section__title">Odznaki</h2>
        <span className="profile-badges-section__count">
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
              iconFile={badge.icon ? `backend:${badge.icon}` : '🏅'}
              showEarnedAt={false}
              className="maq-badge--grid-fit"
            />
          ))}
        </div>
      )}
    </div>
  );
}
