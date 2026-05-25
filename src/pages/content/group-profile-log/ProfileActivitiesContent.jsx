import { useMemo, useState } from 'react';
import { useProfileStudentProfileContext } from '../group-profile/ProfileStudentProfileContext.js';
import './ProfileActivitiesSection.css';

function formatCompletedAt(value) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleString('pl-PL');
}

export default function ProfileActivitiesContent() {
  const { profile, isLoading } = useProfileStudentProfileContext();
  const [showAll, setShowAll] = useState(false);

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
        <h2 className="profile-activities-section__title">Aktywności</h2>
        {activities.length > 5 ? (
          <button
            type="button"
            className="profile-activities-section__toggle"
            onClick={() => setShowAll((current) => !current)}
          >
            {showAll ? 'Ukryj aktywności' : 'Wszystkie aktywności'}
          </button>
        ) : null}
      </div>

      {activities.length === 0 ? (
        <p className="profile-activities-section__empty">
          Brak ukończonych aktywności w tej grupie.
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
                <span>{activity.currency} pkt</span>
                <span>{formatCompletedAt(activity.completedAt)}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
