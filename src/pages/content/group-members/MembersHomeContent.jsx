import { useCallback, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { READLANGUAGECOOKIE } from '../../../utils/LANGUAGECOOKIE.js';

import { DataTable, CurrencyDisplay, SearchBar, useToast } from '../../../components/ui/index.js';
import { SVG_ICONS } from '../../../constants/svgIcons.js';
import SectionPageLayout from '../../../components/layout/sectionPage/SectionPageLayout.jsx';
import useGroupSubNav from '../../../navigation/useGroupSubNav.js';
import { groupStudentProfilePath } from '../../../routes/pathRegistry.js';
import '../../../components/page/PageUnavailable.css';
import '../shared/groupSectionPage.css';
import '../group-members/MembersHomeContent.css';
import { getAvatarImageClassName } from '../../../utils/avatarDisplay.js';
import { useGroupMembers } from './useGroupMembers.js';
import MembersTableRow from './MembersTableRow.jsx';

import MemberBadgesModal from './modals/MemberBadgesModal.jsx';
import MemberCurrencyModal from './modals/MemberCurrencyModal.jsx';
import MemberTotalEarnedModal from './modals/MemberTotalEarnedModal.jsx';
import MemberDeleteModal from './modals/MemberDeleteModal.jsx';
import MemberProgressModal from './modals/MemberProgressModal.jsx';
import MemberRankModal from './modals/MemberRankModal.jsx';

import './MembersHomeContent.css';

const PARTICIPANT_PROMOTED__TEXTLABEL = { polish: 'Uczestnik awansował na rangę: ${rankName}.', english: 'Participant promoted to rank: ${rankName}.' };
const CURRENCY_UPDATED__TEXTLABEL = { polish: 'Waluta uczestnika została zaktualizowana.', english: 'Participant currency has been updated.' };
const TOTAL_CURRENCY_UPDATED__TEXTLABEL = { polish: 'Zgromadzona waluta uczestnika została zaktualizowana.', english: 'Participant total earned currency has been updated.' };
const AUTO_RANK_ENABLED__TEXTLABEL = { polish: 'Włączono rangę automatyczną. Aktualna ranga: ${rankName}.', english: 'Automatic rank enabled. Current rank: ${rankName}.' };
const RANK_ASSIGNED__TEXTLABEL = { polish: 'Przyznano rangę: ${rankName}.', english: 'Rank assigned: ${rankName}.' };
const PARTICIPANT_REMOVED__TEXTLABEL = { polish: 'Uczestnik został usunięty z grupy.', english: 'Participant has been removed from the group.' };
const COLUMN_POSITION__TEXTLABEL = { polish: 'Numer', english: 'Number' };
const COLUMN_MEMBER__TEXTLABEL = { polish: 'Członek grupy', english: 'Group member' };
const COLUMN_EMAIL__TEXTLABEL = { polish: 'E-mail', english: 'E-mail' };
const COLUMN_RANK__TEXTLABEL = { polish: 'Ranga', english: 'Rank' };
const COLUMN_BADGES__TEXTLABEL = { polish: 'Odznaki', english: 'Badges' };
const COLUMN_CURRENCY__TEXTLABEL = { polish: 'Waluta', english: 'Currency' };
const COLUMN_TOTAL_CURRENCY__TEXTLABEL = { polish: 'Zgromadzona', english: 'Total earned' };
const ROW_DELETE_LABEL__TEXTLABEL = { polish: 'Usuń uczestnika', english: 'Remove participant' };
const ROW_BADGES_LABEL__TEXTLABEL = { polish: 'Przydziel odznakę', english: 'Assign badge' };
const ROW_BADGES_ARIA__TEXTLABEL = { polish: 'Przydziel odznakę uczestnikowi', english: 'Assign badge to participant' };
const ROW_PROGRESS_LABEL__TEXTLABEL = { polish: 'Edytuj postęp', english: 'Edit progress' };
const ROW_PROGRESS_ARIA__TEXTLABEL = { polish: 'Edytuj postęp uczestnika', english: 'Edit participant progress' };
const ROW_RANK_LABEL__TEXTLABEL = { polish: 'Zmień rangę', english: 'Change rank' };
const ROW_RANK_DESC__TEXTLABEL = { polish: 'Ustaw ręcznie rangę uczestnikowi.', english: 'Manually set participant rank.' };
const ROW_CURRENCY_LABEL__TEXTLABEL = { polish: 'Zarządzaj walutą', english: 'Manage currency' };
const ROW_CURRENCY_DESC__TEXTLABEL = { polish: 'Dodaj lub odejmij ręcznie walutę uczestnikowi.', english: 'Add or subtract participant currency manually.' };
const ROW_TOTAL_EARNED_LABEL__TEXTLABEL = { polish: 'Edytuj zgromadzoną walutę', english: 'Edit total earned currency' };
const ROW_TOTAL_EARNED_DESC__TEXTLABEL = { polish: 'Zmień tylko zgromadzoną walutę uczestnika.', english: 'Change only participant total earned currency.' };
const SEARCH_PLACEHOLDER__TEXTLABEL = { polish: 'Szukaj członka grupy…', english: 'Search group member…' };
const SEARCH_ARIA_LABEL__TEXTLABEL = { polish: 'Szukaj członka grupy', english: 'Search group member' };
const LOADING_MESSAGE__TEXTLABEL = { polish: 'Ładowanie członków grupy…', english: 'Loading group members…' };
const EMPTY_MESSAGE__TEXTLABEL = { polish: 'Brak członków w tej grupie.', english: 'No members in this group.' };
const PAGINATION_ARIA_LABEL__TEXTLABEL = { polish: 'Nawigacja stron listy uczestników', english: 'Participants list page navigation' };

function renderMemberNameLines(member) {
  const nickname = member.nickname?.trim() || '';
  const legalName = member.legalName?.trim() || '';
  const primary = nickname || legalName || member.email || member.name;
  const legalLine = nickname && legalName && nickname !== legalName
    ? `(${legalName})`
    : null;

  return (
    <>
      <span className="members-table__name">{primary}</span>
      {legalLine ? <span className="members-table__nickname">{legalLine}</span> : null}
    </>
  );
}

export default function MembersHomeContent() {
  const [LANGUAGE] = useState(READLANGUAGECOOKIE);
  const nav = useGroupSubNav('group-members');
  const { showSuccess } = useToast();
  const {
    groupId,
    members,
    ranks,
    rankNames,
    badges,
    isLoading,
    error,
    refetchWithRankNotice,
    deleteMember,
    updateMemberRank,
    updateMemberCurrency,
    updateMemberTotalEarned,
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

  const notifyRankPromotion = useCallback((promotedRankName) => {
    if (!promotedRankName) return;
    showSuccess(PARTICIPANT_PROMOTED__TEXTLABEL[LANGUAGE].replace('${rankName}', promotedRankName));
  }, [showSuccess, LANGUAGE]);

  const handleBadgesConfirm = useCallback(async () => {
    const member = activeModal?.member ?? null;
    closeModal();
    const promotedRankName = await refetchWithRankNotice(member);
    notifyRankPromotion(promotedRankName);
  }, [activeModal, closeModal, refetchWithRankNotice, notifyRankPromotion]);

  const handleProgressConfirm = useCallback(async () => {
    const member = activeModal?.member ?? null;
    closeModal();
    const promotedRankName = await refetchWithRankNotice(member);
    notifyRankPromotion(promotedRankName);
  }, [activeModal, closeModal, refetchWithRankNotice, notifyRankPromotion]);

  const handleCurrencyConfirm = useCallback(async ({ delta, setValue }) => {
    if (!activeModal?.member) return;

    const member = activeModal.member;
    const nextCurrency = setValue != null
      ? setValue
      : Math.max(0, member.currency + delta);

    setModalLoading(true);
    const result = await updateMemberCurrency(member, nextCurrency);
    setModalLoading(false);

    if (result.ok) {
      showSuccess(CURRENCY_UPDATED__TEXTLABEL[LANGUAGE]);
      notifyRankPromotion(result.promotedRankName);
      closeModal();
    }
  }, [activeModal, updateMemberCurrency, closeModal, notifyRankPromotion, showSuccess, LANGUAGE]);

  const handleTotalEarnedConfirm = useCallback(async ({ delta, setValue }) => {
    if (!activeModal?.member) return;

    const member = activeModal.member;
    const nextTotal = setValue != null
      ? setValue
      : Math.max(0, member.totalCurrency + delta);

    setModalLoading(true);
    const result = await updateMemberTotalEarned(member, nextTotal);
    setModalLoading(false);

    if (result.ok) {
      showSuccess(TOTAL_CURRENCY_UPDATED__TEXTLABEL[LANGUAGE]);
      notifyRankPromotion(result.promotedRankName);
      closeModal();
    }
  }, [activeModal, updateMemberTotalEarned, closeModal, notifyRankPromotion, showSuccess, LANGUAGE]);

  const handleRankConfirm = useCallback(async (selection) => {
    if (!activeModal?.member) return;

    setModalLoading(true);
    const result = await updateMemberRank(activeModal.member, selection);
    setModalLoading(false);

    if (result.ok) {
      if (result.isAutomatic) {
        showSuccess(AUTO_RANK_ENABLED__TEXTLABEL[LANGUAGE].replace('${rankName}', result.assignedRankName));
      } else {
        showSuccess(RANK_ASSIGNED__TEXTLABEL[LANGUAGE].replace('${rankName}', result.assignedRankName));
      }
      closeModal();
    }
  }, [activeModal, updateMemberRank, closeModal, showSuccess, LANGUAGE]);

  const handleDeleteConfirm = useCallback(async () => {
    if (!activeModal?.member) return;

    setModalLoading(true);
    const result = await deleteMember(activeModal.member);
    setModalLoading(false);

    if (result.ok) {
      showSuccess(PARTICIPANT_REMOVED__TEXTLABEL[LANGUAGE]);
      closeModal();
    }
  }, [activeModal, deleteMember, closeModal, showSuccess, LANGUAGE]);

  const memberColumns = useMemo(() => [
    {
      key: 'position',
      label: COLUMN_POSITION__TEXTLABEL[LANGUAGE],
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
      label: COLUMN_MEMBER__TEXTLABEL[LANGUAGE],
      sort: 'text',
      className: 'members-table__th--user',
      colClassName: 'members-table__col--user',
      cellClassName: 'members-table__cell--user',
      render: (member) => (
        <div className="members-table__user">
          <span className="members-table__avatar-wrap">
            <img
              src={member.avatar}
              alt=""
              className={getAvatarImageClassName(member.avatar, 'members-table__avatar-img')}
              loading="lazy"
            />
          </span>
          <div className="members-table__user-main">
            <div className="members-table__user-info">
              {!member.isLecturer && groupId && (member.accountId || member.position) ? (
                <Link
                  className="members-table__profile-link"
                  to={groupStudentProfilePath(groupId, member.accountId ?? member.position)}
                >
                  {renderMemberNameLines(member)}
                </Link>
              ) : (
                renderMemberNameLines(member)
              )}
            </div>
            {!member.isLecturer ? (
              <span className="members-table__mobile-total">
                <CurrencyDisplay amount={member.totalCurrency} size="sm" />
              </span>
            ) : null}
          </div>
        </div>
      ),
    },
    {
      key: 'email',
      label: COLUMN_EMAIL__TEXTLABEL[LANGUAGE],
      sort: 'text',
      className: 'members-table__th--email',
      colClassName: 'members-table__col--email',
      cellClassName: 'members-table__cell--email',
      hiddenBelow: 768,
      mobileHidden: true,
      render: (member) => (
        <span className="members-table__cell-text members-table__cell-text--email">
          {member.email || '—'}
        </span>
      ),
    },
    {
      key: 'rank',
      label: COLUMN_RANK__TEXTLABEL[LANGUAGE],
      sort: { type: 'custom', order: rankNames },
      width: '140px',
      className: 'members-table__th--rank',
      colClassName: 'members-table__col--rank',
      cellClassName: 'members-table__cell--rank',
      hiddenBelow: 768,
      mobileHidden: true,
      render: (member) => (
        <span className="members-table__rank-cell">
          <span className="members-table__cell-text">{member.rank}</span>
          {member.autoRankEnabled === false ? (
            <span className="members-table__rank-manual-note">*przyznawana ręcznie</span>
          ) : null}
        </span>
      ),
    },
    {
      key: 'badgesCount',
      label: COLUMN_BADGES__TEXTLABEL[LANGUAGE],
      sort: 'number',
      width: '100px',
      className: 'members-table__th--badges',
      colClassName: 'members-table__col--badges',
      cellClassName: 'members-table__cell--badges',
      hiddenBelow: 768,
      mobileHidden: true,
      render: (member) => (
        <span className="members-table__stat">
          {member.isLecturer ? '—' : member.badgesCount}
        </span>
      ),
    },
    {
      key: 'currency',
      label: COLUMN_CURRENCY__TEXTLABEL[LANGUAGE],
      sort: 'number',
      width: '110px',
      className: 'members-table__th--currency',
      colClassName: 'members-table__col--currency',
      cellClassName: 'members-table__cell--currency',
      hiddenBelow: 480,
      mobileHidden: true,
      render: (member) => (
        member.isLecturer
          ? <span className="members-table__stat">—</span>
          : <CurrencyDisplay amount={member.currency} size="sm" />
      ),
    },
    {
      key: 'totalCurrency',
      label: COLUMN_TOTAL_CURRENCY__TEXTLABEL[LANGUAGE],
      sort: 'number',
      width: '110px',
      className: 'members-table__th--total',
      colClassName: 'members-table__col--total',
      cellClassName: 'members-table__cell--total',
      hiddenBelow: 768,
      mobileHidden: true,
      render: (member) => (
        member.isLecturer
          ? <span className="members-table__stat">—</span>
          : <CurrencyDisplay amount={member.totalCurrency} size="sm" />
      ),
    },
  ], [groupId, rankNames]);

  const rowActions = useMemo(() => ({
    onDelete: (member) => openModal('delete', member),
    deleteLabel: ROW_DELETE_LABEL__TEXTLABEL[LANGUAGE],
    deleteAriaLabel: (member) => `${ROW_DELETE_LABEL__TEXTLABEL[LANGUAGE]} ${member.name}`,
    inlineActions: [
      {
        id: 'badges',
        label: ROW_BADGES_LABEL__TEXTLABEL[LANGUAGE],
        iconFile: SVG_ICONS.nav.profileBadges,
        iconClassName: 'data-table__inline-icon--badge-award',
        iconSize: 40,
        ariaLabel: ROW_BADGES_ARIA__TEXTLABEL[LANGUAGE],
        onSelect: (member) => openModal('badges', member),
      },
      {
        id: 'progress',
        label: ROW_PROGRESS_LABEL__TEXTLABEL[LANGUAGE],
        iconFile: SVG_ICONS.actions.manageProgress,
        ariaLabel: ROW_PROGRESS_ARIA__TEXTLABEL[LANGUAGE],
        onSelect: (member) => openModal('progress', member),
      },
    ],
    menuItems: [
      {
        id: 'rank',
        label: ROW_RANK_LABEL__TEXTLABEL[LANGUAGE],
        description: ROW_RANK_DESC__TEXTLABEL[LANGUAGE],
        onSelect: (member) => openModal('rank', member),
      },
      {
        id: 'currency',
        label: ROW_CURRENCY_LABEL__TEXTLABEL[LANGUAGE],
        description: ROW_CURRENCY_DESC__TEXTLABEL[LANGUAGE],
        onSelect: (member) => openModal('currency', member),
      },
      {
        id: 'totalEarned',
        label: ROW_TOTAL_EARNED_LABEL__TEXTLABEL[LANGUAGE],
        description: ROW_TOTAL_EARNED_DESC__TEXTLABEL[LANGUAGE],
        onSelect: (member) => openModal('totalEarned', member),
      },
    ],
  }), [openModal, LANGUAGE]);

  const modalMember = activeModal?.member ?? null;

  if (error) {
    return (
      <SectionPageLayout
        className="page-unavailable members-page"
        title={nav.sectionTitle}
        subNavItems={nav.items}
        subNavAriaLabel={nav.ariaLabel}
      >
        <p className="members-page__error" role="alert">{error}</p>
      </SectionPageLayout>
    );
  }

  return (
    <SectionPageLayout
      className="page-unavailable members-page"
      title={nav.sectionTitle}
      subNavItems={nav.items}
      subNavAriaLabel={nav.ariaLabel}
      toolbar={(
        <div className="maq-section-page__toolbar-end">
          <SearchBar
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder={SEARCH_PLACEHOLDER__TEXTLABEL[LANGUAGE]}
            name="member-search"
            className="members-page__search"
            aria-label={SEARCH_ARIA_LABEL__TEXTLABEL[LANGUAGE]}
          />
        </div>
      )}
    >

      {isLoading ? (
        <p className="members-page__loading page-unavailable__notice">{LOADING_MESSAGE__TEXTLABEL[LANGUAGE]}</p>
      ) : members.length === 0 ? (
        <p className="members-page__empty page-unavailable__notice">{EMPTY_MESSAGE__TEXTLABEL[LANGUAGE]}</p>
      ) : (
        <DataTable
          columns={memberColumns}
          data={members}
          rowKey="id"
          tiebreakerKey="position"
          itemsPerPage={10}
          paginationAriaLabel={PAGINATION_ARIA_LABEL__TEXTLABEL[LANGUAGE]}
          search={{
            external: true,
            value: searchQuery,
            filter: (member, query) => (
              member.name.toLowerCase().includes(query)
              || member.nickname?.toLowerCase().includes(query)
              || member.legalName?.toLowerCase().includes(query)
              || member.email?.toLowerCase().includes(query)
            ),
          }}
          rowActions={rowActions}
          renderRow={MembersTableRow}
          shouldRenderRowActions={(member) => !member.isLecturer}
          getMobileItemClassName={(member) => (
            member.isLecturer ? 'members-table__row--lecturer' : ''
          )}
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
        groupId={groupId}
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
      <MemberTotalEarnedModal
        isOpen={activeModal?.type === 'totalEarned'}
        member={modalMember}
        onClose={closeModal}
        onConfirm={handleTotalEarnedConfirm}
        isLoading={modalLoading}
      />
      <MemberRankModal
        isOpen={activeModal?.type === 'rank'}
        member={modalMember}
        ranks={ranks}
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
    </SectionPageLayout>
  );
}
