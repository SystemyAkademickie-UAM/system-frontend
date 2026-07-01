import { useMemo, useState } from 'react';
import { useProfileStudentProfileContext } from '../group-profile/ProfileStudentProfileContext.js';
import { READLANGUAGECOOKIE } from '../../../utils/LANGUAGECOOKIE.js';
import './ProfileActivitiesSection.css';

function formatCompletedAt(value) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleString('pl-PL');
}

const ACTIVITIESTITLE__TEXTLABEL = {
  polish: 'Aktywności',
  english: 'Activities',
};

const TOGGLEBUTTON__TEXTLABEL = {
  polish: [
    { id: 'hide', label: 'Ukryj aktywności' },
    { id: 'show', label: 'Wszystkie aktywności' },
  ],
  english: [
    { id: 'hide', label: 'Hide activities' },
    { id: 'show', label: 'All activities' },
  ],
};

const EMPTYMESSAGE__TEXTLABEL = {
  polish: 'Brak ukończonych aktywności w tej grupie.',
  english: 'No completed activities in this group.',
};

const POINTSSUFFIX__TEXTLABEL = {
  polish: 'pkt',
  english: 'pts',
};

export default function ProfileActivitiesContent() {
  const { profile, isLoading } = useProfileStudentProfileContext();
  const [showAll, setShowAll] = useState(false);
  const [LANGUAGE] = useState(READLANGUAGECOOKIE);

  const activities = profile?.completedActivities ?? [];
  const visibleActivities = useMemo(
    () => (showAll ? activities : activities.slice(0, 5)),
    [activities, showAll],
  );

  if (isLoading) {
    return null;
  }

  return (
    <div className="profile-activities-section">
      <div className="profile-activities-section__header">
        <h2 className="profile-activities-section__title">{ACTIVITIESTITLE__TEXTLABEL[LANGUAGE]}</h2>
        {activities.length > 5 ? (
          <button
            type="button"
            className="profile-activities-section__toggle"
            onClick={() => setShowAll((current) => !current)}
          >
            {showAll ? TOGGLEBUTTON__TEXTLABEL[LANGUAGE].find((item) => item.id === 'hide').label : TOGGLEBUTTON__TEXTLABEL[LANGUAGE].find((item) => item.id === 'show').label}
          </button>
        ) : null}
      </div>

      {activities.length === 0 ? (
        <p className="profile-activities-section__empty">
          {EMPTYMESSAGE__TEXTLABEL[LANGUAGE]}
        </p>
      ) : (
        <ul className="profile-activities-section__list">
          {visibleActivities.map((activity) => (
            <li key={activity.id} className="profile-activities-section__item">
              <div className="profile-activities-section__item-main">
                <span className="profile-activities-section__item-name">{activity.name}</span>
                <span className="profile-activities-section__item-description">
                  {activity.educationalDescription || activity.storyDescription || '—'}
                </span>
              </div>
              <div className="profile-activities-section__item-meta">
                <span>{activity.currency} {POINTSSUFFIX__TEXTLABEL[LANGUAGE]}</span>
                <span>{formatCompletedAt(activity.completedAt)}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
