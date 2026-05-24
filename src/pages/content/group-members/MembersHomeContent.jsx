import { useCallback, useMemo, useState } from 'react';

import { DataTable, PageHeader, SearchBar, SubNav } from '../../../components/ui/index.js';
import useGroupSubNav from '../../../navigation/useGroupSubNav.js';
import '../../../components/page/PageUnavailable.css';
import { useGroupMembers } from './useGroupMembers.js';

import MemberBadgesModal from './modals/MemberBadgesModal.jsx';
import MemberCurrencyModal from './modals/MemberCurrencyModal.jsx';
import MemberDeleteModal from './modals/MemberDeleteModal.jsx';
import MemberProgressModal from './modals/MemberProgressModal.jsx';
import MemberRankModal from './modals/MemberRankModal.jsx';

import './MembersHomeContent.css';

export default function MembersHomeContent() {
  const nav = useGroupSubNav('group-members');
  const {
    groupId,
    members,
    ranks,
    rankNames,
    badges,
    isLoading,
    error,
    updateMember,
    deleteMember,
    updateMemberRank,
    updateMemberCurrency,
  } = useGroupMembers();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeModal, setActiveModal] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  const openModal = useCallback((type, member) => {
    setActiveModal({ type, member });
  }, []);

  const closeModal = useCallback(() => {
    setActiveModal(null);
  }, []);

  const handleBadgesConfirm = useCallback((earnedBadgeIds) => {
    if (!activeModal?.member) return;
    updateMember(activeModal.member.id, {
      badgesCount: earnedBadgeIds.length,
    });
    closeModal();
  }, [activeModal, updateMember, closeModal]);

  const handleProgressConfirm = useCallback((activityProgress) => {
    if (!activeModal?.member) return;
    const completedCount = Object.values(activityProgress).filter(Boolean).length;
    updateMember(activeModal.member.id, {
      completedActivitiesCount: completedCount,
    });
    closeModal();
  }, [activeModal, updateMember, closeModal]);

  const handleCurrencyConfirm = useCallback(async ({ delta }) => {
    if (!activeModal?.member) return;

    const member = activeModal.member;
    const nextCurrency = Math.max(0, member.currency + delta);
    const nextTotal = member.totalCurrency + (delta > 0 ? delta : 0);

    setModalLoading(true);
    const result = await updateMemberCurrency(member, nextCurrency, nextTotal);
    setModalLoading(false);

    if (result.ok) {
      closeModal();
    }
  }, [activeModal, updateMemberCurrency, closeModal]);

  const handleRankConfirm = useCallback(async (rankName) => {
    if (!activeModal?.member) return;

    const selectedRank = ranks.find((r) => r.name === rankName);
    const rankId = selectedRank?.id ?? null;

    setModalLoading(true);
    const result = await updateMemberRank(activeModal.member, rankId);
    setModalLoading(false);

    if (result.ok) {
      closeModal();
    }
  }, [activeModal, ranks, updateMemberRank, closeModal]);

  const handleDeleteConfirm = useCallback(async () => {
    if (!activeModal?.member) return;

    setModalLoading(true);
    const result = await deleteMember(activeModal.member);
    setModalLoading(false);

    if (result.ok) {
      closeModal();
    }
  }, [activeModal, deleteMember, closeModal]);

  const memberColumns = useMemo(() => [
    {
      key: 'position',
      label: 'Numer',
      sort: 'number',
      width: '108px',
      className: 'members-table__th--position',
      colClassName: 'members-table__col--position',
      cellClassName: 'members-table__cell--position',
      render: (member) => (
        <span className="members-table__position">#{member.position}</span>
      ),
    },
    {
      key: 'name',
      label: 'Członek grupy',
      sort: 'text',
      className: 'members-table__th--user',
      colClassName: 'members-table__col--user',
      cellClassName: 'members-table__cell--user',
      render: (member) => (
        <div className="members-table__user">
          <img
            src={member.avatar}
            alt=""
            className="members-table__avatar"
            loading="lazy"
          />
          <div className="members-table__user-info">
            <span className="members-table__name">{member.name}</span>
            {member.nickname && member.nickname !== member.name && (
              <span className="members-table__nickname">({member.nickname})</span>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'rank',
      label: 'Ranga',
      sort: { type: 'custom', order: rankNames },
      width: '120px',
      className: 'members-table__th--rank',
      colClassName: 'members-table__col--rank',
      cellClassName: 'members-table__cell--rank',
      hiddenBelow: 768,
      render: (member) => (
        <span className="members-table__rank-badge">{member.rank}</span>
      ),
    },
    {
      key: 'badgesCount',
      label: 'Odznaki',
      sort: 'number',
      width: '100px',
      className: 'members-table__th--badges',
      colClassName: 'members-table__col--badges',
      cellClassName: 'members-table__cell--badges',
      hiddenBelow: 768,
      render: (member) => (
        <span className="members-table__stat">{member.badgesCount}</span>
      ),
    },
    {
      key: 'currency',
      label: 'Waluta',
      sort: 'number',
      width: '110px',
      className: 'members-table__th--currency',
      colClassName: 'members-table__col--currency',
      cellClassName: 'members-table__cell--currency',
      hiddenBelow: 480,
      render: (member) => (
        <span className="members-table__currency">{member.currency}</span>
      ),
    },
    {
      key: 'totalCurrency',
      label: 'Zgromadzona',
      sort: 'number',
      width: '110px',
      className: 'members-table__th--total',
      colClassName: 'members-table__col--total',
      cellClassName: 'members-table__cell--total',
      hiddenBelow: 768,
      render: (member) => (
        <span className="members-table__total-currency">{member.totalCurrency}</span>
      ),
    },
  ], [rankNames]);

  const rowActions = useMemo(() => ({
    onDelete: (member) => openModal('delete', member),
    deleteAriaLabel: (member) => `Usuń ${member.name}`,
    menuItems: [
      {
        id: 'badges',
        label: 'Edytuj odznaki',
        description: 'Przypisz lub odbierz odznaki uczestnikowi.',
        onSelect: (member) => openModal('badges', member),
      },
      {
        id: 'progress',
        label: 'Edytuj postęp',
        description: 'Zmień poziom, XP lub ukończone zadania.',
        onSelect: (member) => openModal('progress', member),
      },
      {
        id: 'rank',
        label: 'Zmień rangę',
        description: 'Ustaw rangę w hierarchii grupy.',
        onSelect: (member) => openModal('rank', member),
      },
      {
        id: 'currency',
        label: 'Zarządzaj walutą',
        description: 'Dodaj lub odejmij punkty waluty uczestnika.',
        onSelect: (member) => openModal('currency', member),
      },
    ],
  }), [openModal]);

  const modalMember = activeModal?.member ?? null;

  if (error) {
    return (
      <section className="page-unavailable members-page" aria-label={nav.sectionTitle}>
        <PageHeader
          title={nav.sectionTitle}
          description="Zarządzaj uczestnikami kursu — edytuj rangi, odznaki, walutę i postęp."
        />
        <p className="members-page__error" role="alert">{error}</p>
      </section>
    );
  }

  return (
    <section className="page-unavailable members-page" aria-label={nav.sectionTitle}>
      <PageHeader
        title={nav.sectionTitle}
        description="Zarządzaj uczestnikami kursu — edytuj rangi, odznaki, walutę i postęp."
      />

      <div className="members-page__nav-row">
        <SubNav
          ariaLabel={nav.ariaLabel}
          items={nav.items}
          className="members-page__sub-nav"
        />
        <SearchBar
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Szukaj członka grupy…"
          name="member-search"
          className="members-page__search"
          aria-label="Szukaj członka grupy"
        />
      </div>

      {isLoading ? (
        <p className="members-page__loading">Ładowanie członków grupy…</p>
      ) : members.length === 0 ? (
        <p className="members-page__empty">Brak członków w tej grupie.</p>
      ) : (
        <DataTable
          columns={memberColumns}
          data={members}
          rowKey="id"
          tiebreakerKey="position"
          itemsPerPage={10}
          paginationAriaLabel="Nawigacja stron listy uczestników"
          search={{
            external: true,
            value: searchQuery,
            filter: (member, query) => member.name.toLowerCase().includes(query),
          }}
          rowActions={rowActions}
        />
      )}

      <MemberBadgesModal
        isOpen={activeModal?.type === 'badges'}
        member={modalMember}
        groupId={groupId}
        badges={badges}
        onClose={closeModal}
        onConfirm={handleBadgesConfirm}
      />
      <MemberProgressModal
        isOpen={activeModal?.type === 'progress'}
        member={modalMember}
        onClose={closeModal}
        onConfirm={handleProgressConfirm}
      />
      <MemberCurrencyModal
        isOpen={activeModal?.type === 'currency'}
        member={modalMember}
        onClose={closeModal}
        onConfirm={handleCurrencyConfirm}
        isLoading={modalLoading}
      />
      <MemberRankModal
        isOpen={activeModal?.type === 'rank'}
        member={modalMember}
        ranks={rankNames}
        onClose={closeModal}
        onConfirm={handleRankConfirm}
        isLoading={modalLoading}
      />
      <MemberDeleteModal
        isOpen={activeModal?.type === 'delete'}
        member={modalMember}
        onClose={closeModal}
        onConfirm={handleDeleteConfirm}
        isLoading={modalLoading}
      />
    </section>
  );
}
