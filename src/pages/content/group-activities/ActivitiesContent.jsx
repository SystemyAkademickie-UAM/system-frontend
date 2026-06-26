import { useCallback, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, SearchBar } from '../../../components/ui/index.js';
import { STAGE_NAME_MAX_LENGTH } from '../../../constants/fieldLimits.js';
import { SVG_ICONS } from '../../../constants/svgIcons.js';
import { useGroupActivities } from './useGroupActivities.js';
import ActivitiesTreeTable from './shared/ActivitiesTreeTable.jsx';
import ActivityFormModal from './modals/ActivityFormModal.jsx';
import ActivityDeleteModal from './modals/ActivityDeleteModal.jsx';
import ActivityAssignModal from './modals/ActivityAssignModal.jsx';
import StageFormModal from './modals/StageFormModal.jsx';
import StageDeleteModal from './modals/StageDeleteModal.jsx';
import { buildStageCloneName } from '../../../utils/stages/stageCloneName.js';
import StageCloneModal from './modals/StageCloneModal.jsx';
import './shared/activitiesShared.css';

function filterStages(stages, query) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return stages;

  return stages.reduce((result, stage) => {
    const stageMatches = stage.name.toLowerCase().includes(normalized);
    const matchingActivities = stage.activities.filter((activity) => (
      activity.name.toLowerCase().includes(normalized)
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
    reorderStages,
    createActivity,
    updateActivity,
    deleteActivity,
  } = useGroupActivities();
  const { groupId } = useParams();

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

  const handleToggleExpand = useCallback((stageId) => {
    toggleStageExpanded(stageId);
  }, [toggleStageExpanded]);

  const handleAddStage = useCallback(async () => {
    const result = await createStage(newStageName);
    if (result.ok) {
      setNewStageName('');
    }
  }, [createStage, newStageName]);

  const handleStageEditConfirm = useCallback(async (values) => {
    if (!activeModal?.stage) return;
    setModalLoading(true);
    const result = await updateStage(activeModal.stage.id, values);
    setModalLoading(false);
    if (result.ok) closeModal();
  }, [activeModal, updateStage, closeModal]);

  const handleStageCloneConfirm = useCallback(async (cloneName) => {
    if (!activeModal?.stage) return;
    setModalLoading(true);
    const result = await copyStage(activeModal.stage.id, cloneName);
    setModalLoading(false);
    if (result.ok) closeModal();
  }, [activeModal, copyStage, closeModal]);

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
    inlineActions: [
      {
        id: 'addActivity',
        label: 'Dodaj aktywność',
        iconFile: SVG_ICONS.actions.add,
        ariaLabel: 'Dodaj aktywność do etapu',
        onSelect: (stage) => openModal('createActivity', { stage }),
      },
    ],
    menuItems: [
      {
        id: 'edit',
        label: 'Edytuj etap',
        description: 'Zmień nazwę etapu.',
        onSelect: (stage) => openModal('editStage', { stage }),
      },
      {
        id: 'visibility',
        label: 'Ukryj / upublicznij etap',
        description: 'Zmień widoczność etapu dla studentów.',
        onSelect: async (stageItem) => {
          const nextStatus = stageItem.visibilityStatus === 1 ? 0 : 1;
          await updateStage(stageItem.id, { visibilityStatus: nextStatus });
        },
      },
      {
        id: 'copy',
        label: 'Kopiuj etap',
        description: 'Utwórz kopię etapu wraz z aktywnościami.',
        onSelect: (stageItem) => {
          const defaultName = buildStageCloneName(
            stageItem.name,
            stages.map((item) => item.name),
          );
          openModal('cloneStage', { stage: stageItem, defaultCloneName: defaultName });
        },
      },
    ],
    onDelete: (stage) => openModal('deleteStage', { stage }),
    deleteLabel: 'Usuń etap',
    deleteAriaLabel: (stage) => `Usuń etap ${stage.name}`,
  }), [openModal, copyStage, updateStage, stages]);

  const activityRowActions = useMemo(() => ({
    inlineActions: [
      {
        id: 'assign',
        label: 'Przypisz aktywność',
        iconFile: SVG_ICONS.actions.assign,
        ariaLabel: 'Przypisz aktywność uczestnikom',
        onSelect: ({ stage, activity }) => openModal('assignActivity', { stage, activity }),
      },
    ],
    menuItems: [
      {
        id: 'edit',
        label: 'Edytuj aktywność',
        description: 'Zmień nazwę, opisy lub nagrodę.',
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

      <div className="maq-section-page__toolbar">
        <div className="maq-section-page__toolbar-start">
          <div className="activities-page__add-island">
            <input
              id="new-stage-name"
              type="text"
              className="activities-page__add-input"
              value={newStageName}
              onChange={(event) => setNewStageName(event.target.value)}
              placeholder="Nazwa nowego etapu"
              aria-label="Nazwa nowego etapu"
              maxLength={STAGE_NAME_MAX_LENGTH}
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

        <div className="maq-section-page__toolbar-end">
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
          onToggleExpand={handleToggleExpand}
          stageRowActions={stageRowActions}
          activityRowActions={activityRowActions}
          onReorderStages={reorderStages}
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

      <StageCloneModal
        isOpen={activeModal?.type === 'cloneStage'}
        stage={modalStage}
        defaultName={activeModal?.defaultCloneName ?? ''}
        onClose={closeModal}
        onConfirm={handleStageCloneConfirm}
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

      <ActivityAssignModal
        isOpen={activeModal?.type === 'assignActivity'}
        activity={modalActivity}
        groupId={groupId}
        onClose={closeModal}
      />
    </div>
  );
}
