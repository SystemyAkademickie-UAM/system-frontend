import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Modal, SearchBar, useToast } from '../../../../components/ui/index.js';
import { fetchStudentProgress, toggleStudentActivity } from '../../../../services/students.api.js';
import { READLANGUAGECOOKIE } from '../../../../utils/LANGUAGECOOKIE.js';
import MemberProgressTree from './MemberProgressTree.jsx';
import './memberModals.css';

const MODAL_TITLE__TEXTLABEL = { polish: 'Edytuj postęp', english: 'Edit Progress' };
const SAVING_BUTTON__TEXTLABEL = { polish: 'Zapisywanie…', english: 'Saving…' };
const SAVE_BUTTON__TEXTLABEL = { polish: 'Zapisz', english: 'Save' };
const SEARCH_PLACEHOLDER__TEXTLABEL = { polish: 'Szukaj etapów lub aktywności…', english: 'Search stages or activities…' };
const SEARCH_ARIA_LABEL__TEXTLABEL = { polish: 'Szukaj etapów lub aktywności', english: 'Search stages or activities' };
const LOADING_MESSAGE__TEXTLABEL = { polish: 'Ładowanie aktywności…', english: 'Loading activities…' };
const NO_ACTIVITIES_EMPTY__TEXTLABEL = { polish: 'Brak aktywności w tej grupie.', english: 'No activities in this group.' };
const NO_SEARCH_ACTIVITIES_EMPTY__TEXTLABEL = { polish: 'Brak etapów spełniających kryteria wyszukiwania.', english: 'No stages matching search criteria.' };
const SAVED_SUCCESS__TEXTLABEL = { polish: 'Postęp uczestnika został zapisany.', english: 'Participant progress has been saved.' };
const SAVE_ERROR__TEXTLABEL = { polish: 'Nie udało się zapisać postępu', english: 'Failed to save progress' };
const ACTIVITY_SAVE_ERROR__TEXTLABEL = { polish: 'Nie udało się zapisać postępu aktywności', english: 'Failed to save activity progress' };

function sortProgressStagesNewestFirst(stages) {
  return [...stages]
    .sort((a, b) => b.id - a.id)
    .map((stage) => ({
      ...stage,
      activities: [...stage.activities].sort((a, b) => b.id - a.id),
    }));
}

export default function MemberProgressModal({
  isOpen,
  member,
  groupId,
  onClose,
  onConfirm,
}) {
  const { showSuccess, showError } = useToast();
  const [LANGUAGE] = useState(READLANGUAGECOOKIE);
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
      setStages(sortProgressStagesNewestFirst(progressStages));
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
          throw new Error(result.error || ACTIVITY_SAVE_ERROR__TEXTLABEL[LANGUAGE]);
        }
      }

      const completedCount = Object.values(progress).filter(Boolean).length;
      onConfirm?.({ completedCount, progress });
      showSuccess(SAVED_SUCCESS__TEXTLABEL[LANGUAGE]);
      onClose();
    } catch (err) {
      showError(err instanceof Error ? err.message : SAVE_ERROR__TEXTLABEL[LANGUAGE]);
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
      title={MODAL_TITLE__TEXTLABEL[LANGUAGE]}
      subtitle={member.name}
      onConfirm={handleConfirm}
      confirmLabel={isSaving ? SAVING_BUTTON__TEXTLABEL[LANGUAGE] : SAVE_BUTTON__TEXTLABEL[LANGUAGE]}
      confirmDisabled={isSaving || isLoading}
      size="xl"
      className="member-modal member-modal--progress"
    >
      <div className="member-modal__toolbar">
        <SearchBar
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder={SEARCH_PLACEHOLDER__TEXTLABEL[LANGUAGE]}
          name="progress-search"
          className="member-modal__search"
          aria-label={SEARCH_ARIA_LABEL__TEXTLABEL[LANGUAGE]}
        />
      </div>

      {isLoading ? (
        <p className="member-modal__empty">{LOADING_MESSAGE__TEXTLABEL[LANGUAGE]}</p>
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
            ? NO_ACTIVITIES_EMPTY__TEXTLABEL[LANGUAGE]
            : NO_SEARCH_ACTIVITIES_EMPTY__TEXTLABEL[LANGUAGE]}
        </p>
      ) : null}
    </Modal>
  );
}
