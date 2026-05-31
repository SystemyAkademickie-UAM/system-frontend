import { useCallback, useMemo, useState } from 'react';
import {
  Button,
  CurrencyDisplay,
  DataTable,
  AssetSvg,
  getBadgeRarityConfig,
  InfoTooltip,
  PageHeader,
  SearchBar,
  SubNav,
  useToast,
} from '../../../components/ui/index.js';
import useGroupSubNav from '../../../navigation/useGroupSubNav.js';
import '../../../components/page/PageUnavailable.css';
import { getBadgeCssVars } from '../../../components/ui/Badge/badgeCssVars.js';
import { useGroupBadges } from './useGroupBadges.js';
import RewardsBadgeTableRow from '../group-rewards/shared/RewardsBadgeTableRow.jsx';
import '../group-rewards/shared/rewardsShared.css';
import '../group-rewards/shared/rewardsTablePreview.css';
import BadgeDeleteModal from './modals/BadgeDeleteModal.jsx';
import BadgeFormModal from './modals/BadgeFormModal.jsx';
import BadgeGiveModal from './modals/BadgeGiveModal.jsx';

const BADGE_COLUMNS = [
  {
    key: 'position',
    label: 'Numer',
    sort: 'number',
    width: '90px',
    className: 'rewards-table__th--position',
    render: (badge) => (
      <span className="rewards-table__position">#{badge.position}</span>
    ),
  },
  {
    key: 'name',
    label: 'Nazwa',
    sort: 'text',
    width: '260px',
    render: (badge) => (
      <span className="rewards-table__name">{badge.name}</span>
    ),
  },
  {
    key: '_spacer',
    label: '',
    sort: false,
    className: 'rewards-table__th--spacer',
    colClassName: 'rewards-table__col--spacer',
    cellClassName: 'rewards-table__cell--spacer',
    render: () => '\u00A0',
  },
  {
    key: 'iconFile',
    label: 'Ikona',
    sort: 'text',
    width: '140px',
    cellClassName: 'rewards-table__cell--truncate',
    hiddenBelow: 768,
    render: (badge) => (
      badge.iconFile ? (
        <AssetSvg name={badge.iconFile} className="rewards-table__icon-preview" width={28} height={28} alt="" />
      ) : (
        <span className="rewards-table__cell-text rewards-table__cell-text--muted">—</span>
      )
    ),
  },
  {
    key: 'rarity',
    label: 'Jakość',
    sort: 'text',
    width: '120px',
    cellClassName: 'rewards-table__cell--truncate',
    hiddenBelow: 768,
    render: (badge) => (
      <span
        className="rewards-table__rarity"
        data-rarity={badge.rarity}
        style={getBadgeCssVars(badge.rarity)}
      >
        {getBadgeRarityConfig(badge.rarity).label}
      </span>
    ),
  },
  {
    key: 'storyDescription',
    label: 'Opis fabularny',
    sort: 'text',
    width: '220px',
    cellClassName: 'rewards-table__cell--truncate',
    hiddenBelow: 768,
    render: (badge) => (
      <span className="rewards-table__cell-text">
        {badge.storyDescription}
      </span>
    ),
  },
  {
    key: 'didacticDescription',
    label: 'Opis dydaktyczny',
    sort: 'text',
    width: '200px',
    cellClassName: 'rewards-table__cell--truncate',
    hiddenBelow: 768,
    render: (badge) => (
      <span className="rewards-table__cell-text">
        {badge.didacticDescription}
      </span>
    ),
  },
  {
    key: 'rewardAmount',
    label: 'Nagroda',
    sort: 'number',
    width: '100px',
    render: (badge) => (
      <CurrencyDisplay amount={badge.rewardAmount} symbol={badge.rewardEmoji} size="sm" />
    ),
  },
];

export default function RewardsBadgesContent() {
  const nav = useGroupSubNav('group-rewards');
  const { showSuccess, showError } = useToast();
  const {
    badges,
    students,
    isLoading,
    error,
    handleCreate,
    handleUpdate,
    handleDelete,
  } = useGroupBadges();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeModal, setActiveModal] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  const openModal = useCallback((type, badge = null) => {
    setActiveModal({ type, badge });
  }, []);

  const closeModal = useCallback(() => {
    setActiveModal(null);
  }, []);

  const handleCreateConfirm = useCallback(async (values) => {
    setModalLoading(true);
    const result = await handleCreate(values);
    setModalLoading(false);
    if (result.ok) {
      showSuccess('Odznaka została utworzona.');
      closeModal();
    } else {
      showError(result.error || 'Nie udało się utworzyć odznaki.');
    }
  }, [handleCreate, closeModal, showSuccess, showError]);

  const handleEditConfirm = useCallback(async (values) => {
    if (!activeModal?.badge) return;
    setModalLoading(true);
    const result = await handleUpdate(activeModal.badge.id, values);
    setModalLoading(false);
    if (result.ok) {
      showSuccess('Odznaka została zaktualizowana.');
      closeModal();
    } else {
      showError(result.error || 'Nie udało się zaktualizować odznaki.');
    }
  }, [activeModal, handleUpdate, closeModal, showSuccess, showError]);

  const handleDeleteConfirm = useCallback(async () => {
    if (!activeModal?.badge) return;
    setModalLoading(true);
    const result = await handleDelete(activeModal.badge.id);
    setModalLoading(false);
    if (result.ok) {
      showSuccess('Odznaka została usunięta.');
      closeModal();
    } else {
      showError(result.error || 'Nie udało się usunąć odznaki.');
    }
  }, [activeModal, handleDelete, closeModal, showSuccess, showError]);

  const handleGiveConfirm = useCallback((selectedStudentIds) => {
    if (!activeModal?.badge) return;
    closeModal();
  }, [activeModal, closeModal]);

  const rowActions = useMemo(() => ({
    onDelete: (badge) => openModal('delete', badge),
    deleteLabel: 'Usuń odznakę',
    deleteAriaLabel: (badge) => `Usuń odznakę ${badge.name}`,
    inlineActions: [
      {
        id: 'give',
        label: 'Daj odznakę',
        iconFile: 'ui-badge-give.svg',
        ariaLabel: 'Daj odznakę studentom',
        onSelect: (badge) => openModal('give', badge),
      },
    ],
    menuItems: [
      {
        id: 'edit',
        label: 'Edytuj odznakę',
        description: 'Zmień dane odznaki w kreatorze.',
        onSelect: (badge) => openModal('edit', badge),
      },
    ],
  }), [openModal]);

  const modalBadge = activeModal?.badge ?? null;

  if (error) {
    return (
      <section className="page-unavailable rewards-page" aria-label={nav.sectionTitle}>
        <PageHeader
          title={nav.sectionTitle}
          description="Zarządzaj odznakami kursu — twórz, edytuj i przyznawaj je studentom."
        />
        <p className="rewards-page__error" role="alert">{error}</p>
      </section>
    );
  }

  return (
    <section className="page-unavailable rewards-page" aria-label={nav.sectionTitle}>
      <div className="rewards-page__header-row">
        <PageHeader
          title={nav.sectionTitle}
          description="Zarządzaj odznakami kursu — twórz, edytuj i przyznawaj je studentom."
        />
        <Button
          variant="primary"
          size="md"
          className="rewards-page__add-btn"
          onClick={() => openModal('create')}
        >
          Dodaj odznakę
        </Button>
      </div>

      <div className="rewards-page__nav-row">
        <SubNav
          ariaLabel={nav.ariaLabel}
          items={nav.items}
          className="rewards-page__sub-nav"
        />
        <SearchBar
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Szukaj odznaki…"
          name="badge-catalog-search"
          className="rewards-page__search"
          aria-label="Szukaj odznaki"
        />
      </div>

      {isLoading ? (
        <p className="rewards-page__loading">Ładowanie odznak…</p>
      ) : badges.length === 0 ? (
        <p className="rewards-page__empty">Brak odznak w tej grupie. Kliknij "Dodaj odznakę" aby utworzyć pierwszą.</p>
      ) : (
        <DataTable
          columns={BADGE_COLUMNS}
          data={badges}
          rowKey="id"
          tiebreakerKey="position"
          itemsPerPage={10}
          paginationAriaLabel="Nawigacja stron listy odznak"
          className="rewards-table"
          search={{
            external: true,
            value: searchQuery,
            filter: (badge, query) => (
              badge.name.toLowerCase().includes(query)
              || badge.iconFile.toLowerCase().includes(query)
              || badge.storyDescription.toLowerCase().includes(query)
              || badge.didacticDescription.toLowerCase().includes(query)
            ),
          }}
          rowActions={rowActions}
          renderRow={RewardsBadgeTableRow}
        />
      )}

      <BadgeFormModal
        isOpen={activeModal?.type === 'create'}
        onClose={closeModal}
        onConfirm={handleCreateConfirm}
        isLoading={modalLoading}
      />
      <BadgeFormModal
        isOpen={activeModal?.type === 'edit'}
        badge={modalBadge}
        onClose={closeModal}
        onConfirm={handleEditConfirm}
        isLoading={modalLoading}
      />
      <BadgeGiveModal
        isOpen={activeModal?.type === 'give'}
        badge={modalBadge}
        students={students}
        onClose={closeModal}
        onConfirm={handleGiveConfirm}
        isLoading={modalLoading}
      />
      <BadgeDeleteModal
        isOpen={activeModal?.type === 'delete'}
        badge={modalBadge}
        onClose={closeModal}
        onConfirm={handleDeleteConfirm}
        isLoading={modalLoading}
      />
    </section>
  );
}
