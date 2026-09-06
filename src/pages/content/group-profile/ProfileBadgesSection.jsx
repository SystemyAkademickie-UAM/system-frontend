import { useState } from 'react';
import { Badge, CurrencyDisplay } from '../../../components/ui/index.js';
import { DEFAULT_BADGE_EMOJI, normalizeRankBadgeIcon } from '../../../utils/ranks/rankBadgeIcon.js';
import { useProfileStudentProfileContext } from './ProfileStudentProfileContext.js';
import { READLANGUAGECOOKIE } from '../../../utils/LANGUAGECOOKIE.js';
import '../group-activities/shared/activitiesShared.css';
import './ProfileBadgesSection.css';

const BADGES_TITLE__TEXTLABEL = {
  polish: 'Zdobyte odznaki',
  english: 'Earned badges'
};

const EARNED_COUNT_SUFFIX__TEXTLABEL = {
  polish: 'zdobytych',
  english: 'earned'
};

const EMPTY_BADGES_MESSAGE__TEXTLABEL = {
  polish: 'Nie masz jeszcze żadnych odznak w tej grupie.',
  english: 'You don\'t have any badges in this group yet.'
};

export default function ProfileBadgesSection() {
  const { profile, isLoading } = useProfileStudentProfileContext();
  const [LANGUAGE] = useState(READLANGUAGECOOKIE);

  if (isLoading) {
    return null;
  }

  const earnedBadges = profile?.earnedBadges ?? [];

  return (
    <div className="profile-badges-section">
      <div className="profile-badges-section__header">
        <h2 className="profile-badges-section__title">{BADGES_TITLE__TEXTLABEL[LANGUAGE]}</h2>
        <span className="activities-page__count profile-badges-section__count">
          {earnedBadges.length}
          {' '}
          {EARNED_COUNT_SUFFIX__TEXTLABEL[LANGUAGE]}
        </span>
      </div>

      {earnedBadges.length === 0 ? (
        <p className="profile-badges-section__empty">{EMPTY_BADGES_MESSAGE__TEXTLABEL[LANGUAGE]}</p>
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
