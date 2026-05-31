import { useCallback, useMemo, useState } from 'react';
import { Button, SearchBar } from '../../../components/ui/index.js';
import { useGroupActivities } from './useGroupActivities.js';
import ActivitiesTreeTable from './shared/ActivitiesTreeTable.jsx';
import ActivityFormModal from './modals/ActivityFormModal.jsx';
import ActivityDeleteModal from './modals/ActivityDeleteModal.jsx';
import StageFormModal from './modals/StageFormModal.jsx';
import StageDeleteModal from './modals/StageDeleteModal.jsx';
import './shared/activitiesShared.css';

function filterStages(stages, query) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return stages;

  return stages.reduce((result, stage) => {
    const stageMatches = stage.name.toLowerCase().includes(normalized);
    const matchingActivities = stage.activities.filter((activity) => (
      activity.name.toLowerCase().includes(normalized)
      || (activity.description0 ?? '').toLowerCase().includes(normalized)
      || (activity.description1 ?? '').toLowerCase().includes(normalized)
    ));

    if (stageMatches) {
      result.push(stage);
      return result;
    }

    if (matchingActivities.length > 0) {
      result.push({
        ...stage,
        expanded: true,
        activities: matchingActivities,
      });
    }

    return result;
  }, []);
}

export default function ActivitiesContent() {
  const {
    stages,
    isLoading,
    error,
    toggleStageExpanded,
    createStage,
    updateStage,
    deleteStage,
    copyStage,
    createActivity,
    updateActivity,
    deleteActivity,
  } = useGroupActivities();

  const [searchQuery, setSearchQuery] = useState('');
  const [newStageName, setNewStageName] = useState('');
  const [activeModal, setActiveModal] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  const openModal = useCallback((type, payload = {}) => {
    setActiveModal({ type, ...payload });
  }, []);

  const closeModal = useCallback(() => {
    setActiveModal(null);
  }, []);

  const filteredStages = useMemo(
    () => filterStages(stages, searchQuery),
    [stages, searchQuery],
  );

  const handleAddStage = useCallback(async () => {
    const result = await createStage(newStageName);
    if (result.ok) {
      setNewStageName('');
    }
  }, [createStage, newStageName]);

  const handleStageEditConfirm = useCallback(async ({ name }) => {
    if (!activeModal?.stage) return;
    setModalLoading(true);
    const result = await updateStage(activeModal.stage.id, name);
    setModalLoading(false);
    if (result.ok) closeModal();
  }, [activeModal, updateStage, closeModal]);

  const handleStageDeleteConfirm = useCallback(async () => {
    if (!activeModal?.stage) return;
    setModalLoading(true);
    const result = await deleteStage(activeModal.stage.id);
    setModalLoading(false);
    if (result.ok) closeModal();
  }, [activeModal, deleteStage, closeModal]);

  const handleActivityCreateConfirm = useCallback(async (values) => {
    if (!activeModal?.stage) return;
    setModalLoading(true);
    const result = await createActivity(activeModal.stage.id, values);
    setModalLoading(false);
    if (result.ok) closeModal();
  }, [activeModal, createActivity, closeModal]);

  const handleActivityEditConfirm = useCallback(async (values) => {
    if (!activeModal?.stage || !activeModal?.activity) return;
    setModalLoading(true);
    const result = await updateActivity(
      activeModal.stage.id,
      activeModal.activity.id,
      values,
    );
    setModalLoading(false);
    if (result.ok) closeModal();
  }, [activeModal, updateActivity, closeModal]);

  const handleActivityDeleteConfirm = useCallback(async () => {
    if (!activeModal?.stage || !activeModal?.activity) return;
    setModalLoading(true);
    const result = await deleteActivity(activeModal.stage.id, activeModal.activity.id);
    setModalLoading(false);
    if (result.ok) closeModal();
  }, [activeModal, deleteActivity, closeModal]);

  const stageRowActions = useMemo(() => ({
    menuItems: [
      {
        id: 'edit',
        label: 'Edytuj etap',
        description: 'Zmień nazwę etapu.',
        onSelect: (stage) => openModal('editStage', { stage }),
      },
      {
        id: 'copy',
        label: 'Kopiuj etap',
        description: 'Utwórz kopię etapu wraz z aktywnościami.',
        onSelect: async (stage) => {
          await copyStage(stage.id);
        },
      },
    ],
    onDelete: (stage) => openModal('deleteStage', { stage }),
    deleteLabel: 'Usuń etap',
    deleteAriaLabel: (stage) => `Usuń etap ${stage.name}`,
  }), [openModal, copyStage]);

  const activityRowActions = useMemo(() => ({
    inlineActions: [
      {
        id: 'edit',
        label: 'Edytuj',
        ariaLabel: 'Edytuj aktywność',
        onSelect: ({ stage, activity }) => openModal('editActivity', { stage, activity }),
      },
    ],
    onDelete: ({ stage, activity }) => openModal('deleteActivity', { stage, activity }),
    deleteLabel: 'Usuń aktywność',
    deleteAriaLabel: ({ activity }) => `Usuń aktywność ${activity.name}`,
  }), [openModal]);

  const modalStage = activeModal?.stage ?? null;
  const modalActivity = activeModal?.activity ?? null;

  return (
    <div className="activities-page">
      {error ? (
        <p className="activities-page__error" role="alert">{error}</p>
      ) : null}

      <div className="activities-page__add-panel">
        <p className="activities-page__add-label">Nazwa nowego etapu</p>
        <div className="activities-page__add-row">
          <input
            type="text"
            className="activities-page__add-input"
            value={newStageName}
            onChange={(event) => setNewStageName(event.target.value)}
            placeholder="np. Laboratorium nr 1: Zajęcia organizacyjne"
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                handleAddStage();
              }
            }}
          />
          <Button variant="primary" size="md" onClick={handleAddStage}>
            Dodaj etap
          </Button>
        </div>
      </div>

      <div className="activities-page__toolbar">
        <span className="activities-page__count">
          Etapy
          {' '}
          {stages.length}
        </span>
        <SearchBar
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Szukaj etapów i aktywności…"
          name="activities-search"
          className="activities-page__search"
          aria-label="Szukaj etapów i aktywności"
        />
      </div>

      {isLoading ? (
        <p className="activities-page__loading">Ładowanie etapów…</p>
      ) : filteredStages.length === 0 ? (
        <p className="activities-page__empty">
          {stages.length === 0
            ? 'Brak etapów w tej grupie. Dodaj pierwszy etap powyżej.'
            : 'Brak wyników wyszukiwania.'}
        </p>
      ) : (
        <ActivitiesTreeTable
          stages={filteredStages}
          onToggleExpand={toggleStageExpanded}
          onAddActivity={(stage) => openModal('createActivity', { stage })}
          stageRowActions={stageRowActions}
          activityRowActions={activityRowActions}
        />
      )}

      <StageFormModal
        isOpen={activeModal?.type === 'editStage'}
        stage={modalStage}
        onClose={closeModal}
        onConfirm={handleStageEditConfirm}
        isLoading={modalLoading}
      />

      <StageDeleteModal
        isOpen={activeModal?.type === 'deleteStage'}
        stage={modalStage}
        onClose={closeModal}
        onConfirm={handleStageDeleteConfirm}
        isLoading={modalLoading}
      />

      <ActivityFormModal
        isOpen={activeModal?.type === 'createActivity'}
        stageName={modalStage?.name}
        onClose={closeModal}
        onConfirm={handleActivityCreateConfirm}
        isLoading={modalLoading}
      />

      <ActivityFormModal
        isOpen={activeModal?.type === 'editActivity'}
        activity={modalActivity}
        stageName={modalStage?.name}
        onClose={closeModal}
        onConfirm={handleActivityEditConfirm}
        isLoading={modalLoading}
      />

      <ActivityDeleteModal
        isOpen={activeModal?.type === 'deleteActivity'}
        activity={modalActivity}
        onClose={closeModal}
        onConfirm={handleActivityDeleteConfirm}
        isLoading={modalLoading}
      />
    </div>
  );
}
