import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Modal, SearchBar, useToast } from '../../../../components/ui/index.js';
import { fetchStudentProgress, toggleStudentActivity } from '../../../../services/students.api.js';
import MemberProgressTree from './MemberProgressTree.jsx';
import './memberModals.css';

export default function MemberProgressModal({
  isOpen,
  member,
  groupId,
  onClose,
  onConfirm,
}) {
  const { showSuccess, showError } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [progress, setProgress] = useState({});
  const [stages, setStages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const initialProgressRef = useRef({});

  useEffect(() => {
    if (!isOpen || !member || !groupId) {
      return;
    }

    let cancelled = false;

    async function loadProgress() {
      setIsLoading(true);
      setSearchQuery('');

      const progressStages = await fetchStudentProgress(groupId, member.accountId);

      if (cancelled) return;

      const nextProgress = {};
      progressStages.forEach((stage) => {
        stage.activities.forEach((activity) => {
          nextProgress[activity.id] = activity.isCompleted;
        });
      });

      initialProgressRef.current = { ...nextProgress };
      setProgress(nextProgress);
      setStages(progressStages);
      setIsLoading(false);
    }

    loadProgress();

    return () => {
      cancelled = true;
    };
  }, [isOpen, member, groupId]);

  const visibleStages = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return stages;

    return stages
      .map((stage) => {
        const stageMatches = stage.name.toLowerCase().includes(query);
        const matchingActivities = stage.activities.filter((activity) => (
          activity.name.toLowerCase().includes(query)
          || activity.storyDescription.toLowerCase().includes(query)
          || activity.educationalDescription.toLowerCase().includes(query)
        ));

        if (stageMatches) return stage;
        if (matchingActivities.length === 0) return null;
        return { ...stage, activities: matchingActivities };
      })
      .filter(Boolean);
  }, [searchQuery, stages]);

  const handleToggleActivity = useCallback((activityId) => {
    setProgress((prev) => ({
      ...prev,
      [activityId]: !prev[activityId],
    }));
  }, []);

  const handleConfirm = async () => {
    if (!member || !groupId) return;

    setIsSaving(true);

    const initialProgress = initialProgressRef.current;
    const changedActivityIds = Object.keys(progress).filter((activityId) => (
      Boolean(initialProgress[activityId]) !== Boolean(progress[activityId])
    ));

    try {
      for (const activityId of changedActivityIds) {
        const result = await toggleStudentActivity(groupId, member.accountId, Number(activityId));
        if (!result.ok) {
          throw new Error(result.error || 'Nie udało się zapisać postępu aktywności');
        }
      }

      const completedCount = Object.values(progress).filter(Boolean).length;
      onConfirm?.({ completedCount, progress });
      showSuccess('Postęp uczestnika został zapisany.');
      onClose();
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Nie udało się zapisać postępu');
    } finally {
      setIsSaving(false);
    }
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
      confirmLabel={isSaving ? 'Zapisywanie…' : 'Zapisz'}
      confirmDisabled={isSaving || isLoading}
      size="xl"
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

      {isLoading ? (
        <p className="member-modal__empty">Ładowanie aktywności…</p>
      ) : null}

      {!isLoading && visibleStages.length > 0 ? (
        <MemberProgressTree
          stages={visibleStages}
          progress={progress}
          onToggleActivity={handleToggleActivity}
        />
      ) : null}

      {!isLoading && visibleStages.length === 0 ? (
        <p className="member-modal__empty">
          {stages.length === 0
            ? 'Brak aktywności w tej grupie.'
            : 'Brak etapów spełniających kryteria wyszukiwania.'}
        </p>
      ) : null}
    </Modal>
  );
}
