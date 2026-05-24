import { useEffect, useMemo, useState } from 'react';
import ActivityProgressIcon from '../../../../components/ui/ActivityCard/ActivityProgressIcon.jsx';
import { Modal, SearchBar } from '../../../../components/ui/index.js';
import { ACTIVITY_STAGES } from '../membersMockData.js';
import './memberModals.css';

export default function MemberProgressModal({
  isOpen,
  member,
  onClose,
  onConfirm,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [progress, setProgress] = useState({});

  useEffect(() => {
    if (!isOpen || !member) return;
    setSearchQuery('');
    setProgress({ ...(member.activityProgress ?? {}) });
  }, [isOpen, member]);

  const visibleStages = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return ACTIVITY_STAGES;
    }

    return ACTIVITY_STAGES
      .map((stage) => {
        const stageMatches = stage.name.toLowerCase().includes(query);
        const matchingActivities = stage.activities.filter((activity) => (
          activity.name.toLowerCase().includes(query)
          || activity.storyDescription.toLowerCase().includes(query)
          || activity.didacticDescription.toLowerCase().includes(query)
        ));

        if (stageMatches) {
          return stage;
        }

        if (matchingActivities.length === 0) {
          return null;
        }

        return { ...stage, activities: matchingActivities };
      })
      .filter(Boolean);
  }, [searchQuery]);

  const handleToggleActivity = (activityId) => {
    setProgress((prev) => ({
      ...prev,
      [activityId]: !prev[activityId],
    }));
  };

  const handleConfirm = () => {
    onConfirm?.(progress);
    onClose();
  };

  if (!member) {
    return null;
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edytuj postęp"
      subtitle={member.name}
      onConfirm={handleConfirm}
      size="lg"
      className="member-modal"
    >
      <div className="member-modal__toolbar">
        <SearchBar
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Szukaj etapów lub aktywności…"
          name="progress-search"
          className="member-modal__search"
          aria-label="Szukaj etapów lub aktywności"
        />
      </div>

      {visibleStages.length > 0 ? (
        <div className="member-modal__stage-list">
          {visibleStages.map((stage) => (
            <div key={stage.id} className="member-modal__stage-row">
              <span className="member-modal__stage-name">{stage.name}</span>
              <div className="member-modal__stage-activities">
                {stage.activities.map((activity) => (
                  <ActivityProgressIcon
                    key={activity.id}
                    activity={activity}
                    unlocked={Boolean(progress[activity.id])}
                    onToggle={() => handleToggleActivity(activity.id)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="member-modal__empty">Brak etapów spełniających kryteria wyszukiwania.</p>
      )}
    </Modal>
  );
}
