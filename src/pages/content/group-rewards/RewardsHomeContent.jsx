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
import { generateRewardsStudents } from './shared/rewardsStudentsMock.js';
import RewardsRankTableRow from './shared/RewardsRankTableRow.jsx';
import './shared/rewardsShared.css';
import './shared/rewardsTablePreview.css';
import {
  createEmptyRank,
  createInitialRanksCatalog,
  reindexRanks,
} from './ranksCatalogMock.js';
import RankAssignModal from './modals/RankAssignModal.jsx';
import RankDeleteModal from './modals/RankDeleteModal.jsx';
import RankFormModal from './modals/RankFormModal.jsx';

const INITIAL_RANKS = createInitialRanksCatalog();
const INITIAL_STUDENTS = generateRewardsStudents(
  [],
  INITIAL_RANKS.map((rank) => rank.id),
);

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
    width: '160px',
    cellClassName: 'rewards-table__cell--truncate',
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
    label: 'Koszt',
    sort: 'number',
    width: '100px',
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
        {rank.shopItems.join(', ')}
      </span>
    ),
  },
];

export default function RewardsHomeContent() {
  const nav = useGroupSubNav('group-rewards');
  const [ranks, setRanks] = useState(INITIAL_RANKS);
  const [students, setStudents] = useState(INITIAL_STUDENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModal, setActiveModal] = useState(null);

  const openModal = useCallback((type, rank = null) => {
    setActiveModal({ type, rank });
  }, []);

  const closeModal = useCallback(() => {
    setActiveModal(null);
  }, []);

  const handleCreateConfirm = useCallback((values) => {
    setRanks((prev) => reindexRanks([
      ...prev,
      { ...createEmptyRank(prev.length + 1), ...values },
    ]));
  }, []);

  const handleEditConfirm = useCallback((values) => {
    if (!activeModal?.rank) return;

    setRanks((prev) => prev.map((rank) => (
      rank.id === activeModal.rank.id ? { ...rank, ...values } : rank
    )));
  }, [activeModal]);

  const handleDeleteConfirm = useCallback(() => {
    if (!activeModal?.rank) return;
    const rankId = activeModal.rank.id;
    const fallbackRankId = ranks.find((rank) => rank.id !== rankId)?.id ?? null;

    setRanks((prev) => reindexRanks(prev.filter((rank) => rank.id !== rankId)));
    setStudents((prev) => prev.map((student) => (
      student.rankId === rankId
        ? { ...student, rankId: fallbackRankId }
        : student
    )));
  }, [activeModal, ranks]);

  const handleAssignConfirm = useCallback((selectedStudentIds) => {
    if (!activeModal?.rank) return;
    const rankId = activeModal.rank.id;
    const selectedSet = new Set(selectedStudentIds);

    setStudents((prev) => prev.map((student) => (
      selectedSet.has(student.id)
        ? { ...student, rankId }
        : student
    )));
  }, [activeModal]);

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
            || rank.shopItems.some((item) => item.toLowerCase().includes(query))
          ),
        }}
        rowActions={rowActions}
        renderRow={RewardsRankTableRow}
      />

      <RankFormModal
        isOpen={activeModal?.type === 'create'}
        onClose={closeModal}
        onConfirm={handleCreateConfirm}
      />
      <RankFormModal
        isOpen={activeModal?.type === 'edit'}
        rank={modalRank}
        onClose={closeModal}
        onConfirm={handleEditConfirm}
      />
      <RankAssignModal
        isOpen={activeModal?.type === 'assign'}
        rank={modalRank}
        students={students}
        onClose={closeModal}
        onConfirm={handleAssignConfirm}
      />
      <RankDeleteModal
        isOpen={activeModal?.type === 'delete'}
        rank={modalRank}
        onClose={closeModal}
        onConfirm={handleDeleteConfirm}
      />
    </section>
  );
}
