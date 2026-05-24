import { useCallback, useMemo, useState } from 'react';
import {
  Button,
  DataTable,
  getBadgeRarityConfig,
  PageHeader,
  SearchBar,
  SubNav,
} from '../../../components/ui/index.js';
import useGroupSubNav from '../../../navigation/useGroupSubNav.js';
import '../../../components/page/PageUnavailable.css';
import { getBadgeCssVars } from '../../../components/ui/Badge/badgeCssVars.js';
import { generateRewardsStudents } from '../group-rewards/shared/rewardsStudentsMock.js';
import RewardsBadgeTableRow from '../group-rewards/shared/RewardsBadgeTableRow.jsx';
import '../group-rewards/shared/rewardsShared.css';
import '../group-rewards/shared/rewardsTablePreview.css';
import {
  createEmptyBadge,
  createInitialBadgesCatalog,
  reindexBadges,
} from './badgesCatalogMock.js';
import BadgeDeleteModal from './modals/BadgeDeleteModal.jsx';
import BadgeFormModal from './modals/BadgeFormModal.jsx';
import BadgeGiveModal from './modals/BadgeGiveModal.jsx';

const INITIAL_BADGES = createInitialBadgesCatalog();
const INITIAL_STUDENTS = generateRewardsStudents(
  INITIAL_BADGES.map((badge) => badge.id),
  [],
);

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
    width: '180px',
    cellClassName: 'rewards-table__cell--truncate',
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
      <span className="rewards-table__cell-text rewards-table__cell-text--muted">
        {badge.iconFile}
      </span>
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
      <span className="rewards-table__reward">
        {badge.rewardAmount}
        {' '}
        {badge.rewardEmoji}
      </span>
    ),
  },
];

export default function RewardsBadgesContent() {
  const nav = useGroupSubNav('group-rewards');
  const [badges, setBadges] = useState(INITIAL_BADGES);
  const [students, setStudents] = useState(INITIAL_STUDENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModal, setActiveModal] = useState(null);

  const openModal = useCallback((type, badge = null) => {
    setActiveModal({ type, badge });
  }, []);

  const closeModal = useCallback(() => {
    setActiveModal(null);
  }, []);

  const handleCreateConfirm = useCallback((values) => {
    setBadges((prev) => reindexBadges([
      ...prev,
      { ...createEmptyBadge(prev.length + 1), ...values },
    ]));
  }, []);

  const handleEditConfirm = useCallback((values) => {
    if (!activeModal?.badge) return;

    setBadges((prev) => prev.map((badge) => (
      badge.id === activeModal.badge.id ? { ...badge, ...values } : badge
    )));
  }, [activeModal]);

  const handleDeleteConfirm = useCallback(() => {
    if (!activeModal?.badge) return;
    const badgeId = activeModal.badge.id;

    setBadges((prev) => reindexBadges(prev.filter((badge) => badge.id !== badgeId)));
    setStudents((prev) => prev.map((student) => ({
      ...student,
      earnedBadgeIds: student.earnedBadgeIds.filter((id) => id !== badgeId),
    })));
  }, [activeModal]);

  const handleGiveConfirm = useCallback((selectedStudentIds) => {
    if (!activeModal?.badge) return;
    const badgeId = activeModal.badge.id;
    const selectedSet = new Set(selectedStudentIds);

    setStudents((prev) => prev.map((student) => {
      const hasBadge = student.earnedBadgeIds.includes(badgeId);
      const shouldHave = selectedSet.has(student.id);

      if (shouldHave && !hasBadge) {
        return {
          ...student,
          earnedBadgeIds: [...student.earnedBadgeIds, badgeId],
        };
      }

      if (!shouldHave && hasBadge) {
        return {
          ...student,
          earnedBadgeIds: student.earnedBadgeIds.filter((id) => id !== badgeId),
        };
      }

      return student;
    }));
  }, [activeModal]);

  const rowActions = useMemo(() => ({
    onDelete: (badge) => openModal('delete', badge),
    deleteAriaLabel: (badge) => `Usuń odznakę ${badge.name}`,
    menuItems: [
      {
        id: 'edit',
        label: 'Edytuj odznakę',
        description: 'Zmień dane odznaki w kreatorze.',
        onSelect: (badge) => openModal('edit', badge),
      },
      {
        id: 'give',
        label: 'Daj odznakę',
        description: 'Przyznaj odznakę wielu studentom naraz.',
        onSelect: (badge) => openModal('give', badge),
      },
    ],
  }), [openModal]);

  const modalBadge = activeModal?.badge ?? null;

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

      <BadgeFormModal
        isOpen={activeModal?.type === 'create'}
        onClose={closeModal}
        onConfirm={handleCreateConfirm}
      />
      <BadgeFormModal
        isOpen={activeModal?.type === 'edit'}
        badge={modalBadge}
        onClose={closeModal}
        onConfirm={handleEditConfirm}
      />
      <BadgeGiveModal
        isOpen={activeModal?.type === 'give'}
        badge={modalBadge}
        students={students}
        onClose={closeModal}
        onConfirm={handleGiveConfirm}
      />
      <BadgeDeleteModal
        isOpen={activeModal?.type === 'delete'}
        badge={modalBadge}
        onClose={closeModal}
        onConfirm={handleDeleteConfirm}
      />
    </section>
  );
}
