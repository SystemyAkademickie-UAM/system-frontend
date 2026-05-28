import { useCallback, useMemo, useState } from 'react';
import {
  Button,
  DataTable,
  PageHeader,
  SearchBar,
  SubNav,
} from '../../../components/ui/index.js';
import useGroupSubNav from '../../../navigation/useGroupSubNav.js';
import '../../../components/page/PageUnavailable.css';
import { useGroupRanks } from './useGroupRanks.js';
import RewardsRankTableRow from './shared/RewardsRankTableRow.jsx';
import './shared/rewardsShared.css';
import './shared/rewardsTablePreview.css';
import RankAssignModal from './modals/RankAssignModal.jsx';
import RankDeleteModal from './modals/RankDeleteModal.jsx';
import RankFormModal from './modals/RankFormModal.jsx';

const RANK_COLUMNS = [
  {
    key: 'position',
    label: 'Numer',
    sort: 'number',
    width: '90px',
    render: (rank) => (
      <span className="rewards-table__position">#{rank.position}</span>
    ),
  },
  {
    key: 'name',
    label: 'Nazwa',
    sort: 'text',
    width: '240px',
    render: (rank) => (
      <span className="rewards-table__name">{rank.name}</span>
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
    render: (rank) => (
      <span className="rewards-table__cell-text rewards-table__cell-text--muted">
        {rank.iconFile}
      </span>
    ),
  },
  {
    key: 'costAmount',
    label: 'Wymagane pkt',
    sort: 'number',
    width: '120px',
    render: (rank) => (
      <span className="rewards-table__reward">
        {rank.costAmount}
        {' '}
        {rank.costEmoji}
      </span>
    ),
  },
  {
    key: 'storyDescription',
    label: 'Status fabularny',
    sort: 'text',
    width: '240px',
    cellClassName: 'rewards-table__cell--truncate',
    hiddenBelow: 768,
    render: (rank) => (
      <span className="rewards-table__cell-text">
        {rank.storyDescription}
      </span>
    ),
  },
  {
    key: 'shopItems',
    label: 'Przedmioty sklepu',
    sort: 'text',
    width: '220px',
    cellClassName: 'rewards-table__cell--truncate',
    hiddenBelow: 768,
    render: (rank) => (
      <span className="rewards-table__cell-text">
        {rank.shopItems?.join(', ') || '—'}
      </span>
    ),
  },
];

export default function RewardsHomeContent() {
  const nav = useGroupSubNav('group-rewards');
  const {
    ranks,
    students,
    isLoading,
    error,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleAssign,
  } = useGroupRanks();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeModal, setActiveModal] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  const openModal = useCallback((type, rank = null) => {
    setActiveModal({ type, rank });
  }, []);

  const closeModal = useCallback(() => {
    setActiveModal(null);
  }, []);

  const handleCreateConfirm = useCallback(async (values) => {
    setModalLoading(true);
    const result = await handleCreate(values);
    setModalLoading(false);
    if (result.ok) {
      closeModal();
    }
  }, [handleCreate, closeModal]);

  const handleEditConfirm = useCallback(async (values) => {
    if (!activeModal?.rank) return;
    setModalLoading(true);
    const result = await handleUpdate(activeModal.rank.id, values);
    setModalLoading(false);
    if (result.ok) {
      closeModal();
    }
  }, [activeModal, handleUpdate, closeModal]);

  const handleDeleteConfirm = useCallback(async () => {
    if (!activeModal?.rank) return;
    setModalLoading(true);
    const result = await handleDelete(activeModal.rank.id);
    setModalLoading(false);
    if (result.ok) {
      closeModal();
    }
  }, [activeModal, handleDelete, closeModal]);

  const handleAssignConfirm = useCallback(async (selectedStudentIds) => {
    if (!activeModal?.rank) return;
    setModalLoading(true);
    const result = await handleAssign(activeModal.rank.id, selectedStudentIds);
    setModalLoading(false);
    if (result.ok) {
      closeModal();
    }
  }, [activeModal, handleAssign, closeModal]);

  const rowActions = useMemo(() => ({
    onDelete: (rank) => openModal('delete', rank),
    deleteAriaLabel: (rank) => `Usuń rangę ${rank.name}`,
    menuItems: [
      {
        id: 'edit',
        label: 'Edytuj rangę',
        description: 'Zmień dane rangi w kreatorze.',
        onSelect: (rank) => openModal('edit', rank),
      },
      {
        id: 'assign',
        label: 'Zmień rangę',
        description: 'Przypisz rangę wielu studentom naraz.',
        onSelect: (rank) => openModal('assign', rank),
      },
    ],
  }), [openModal]);

  const modalRank = activeModal?.rank ?? null;

  if (error) {
    return (
      <section className="page-unavailable rewards-page" aria-label={nav.sectionTitle}>
        <PageHeader
          title={nav.sectionTitle}
          description="Zarządzaj rangami kursu — twórz, edytuj i przypisuj je studentom."
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
          description="Zarządzaj rangami kursu — twórz, edytuj i przypisuj je studentom."
        />
        <Button
          variant="primary"
          size="md"
          className="rewards-page__add-btn"
          onClick={() => openModal('create')}
        >
          Dodaj rangę
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
          placeholder="Szukaj rangi…"
          name="rank-catalog-search"
          className="rewards-page__search"
          aria-label="Szukaj rangi"
        />
      </div>

      {isLoading ? (
        <p className="rewards-page__loading">Ładowanie rang…</p>
      ) : ranks.length === 0 ? (
        <p className="rewards-page__empty">Brak rang w tej grupie. Kliknij "Dodaj rangę" aby utworzyć pierwszą.</p>
      ) : (
        <DataTable
          columns={RANK_COLUMNS}
          data={ranks}
          rowKey="id"
          tiebreakerKey="position"
          itemsPerPage={10}
          paginationAriaLabel="Nawigacja stron listy rang"
          className="rewards-table rewards-table--ranks"
          search={{
            external: true,
            value: searchQuery,
            filter: (rank, query) => (
              rank.name.toLowerCase().includes(query)
              || rank.iconFile.toLowerCase().includes(query)
              || rank.storyDescription.toLowerCase().includes(query)
              || (rank.shopItems || []).some((item) => item.toLowerCase().includes(query))
            ),
          }}
          rowActions={rowActions}
          renderRow={RewardsRankTableRow}
        />
      )}

      <RankFormModal
        isOpen={activeModal?.type === 'create'}
        onClose={closeModal}
        onConfirm={handleCreateConfirm}
        isLoading={modalLoading}
      />
      <RankFormModal
        isOpen={activeModal?.type === 'edit'}
        rank={modalRank}
        onClose={closeModal}
        onConfirm={handleEditConfirm}
        isLoading={modalLoading}
      />
      <RankAssignModal
        isOpen={activeModal?.type === 'assign'}
        rank={modalRank}
        students={students}
        onClose={closeModal}
        onConfirm={handleAssignConfirm}
        isLoading={modalLoading}
      />
      <RankDeleteModal
        isOpen={activeModal?.type === 'delete'}
        rank={modalRank}
        onClose={closeModal}
        onConfirm={handleDeleteConfirm}
        isLoading={modalLoading}
      />
    </section>
  );
}
