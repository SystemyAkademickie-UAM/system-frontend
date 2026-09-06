import { useCallback, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Button,
  CurrencyDisplay,
  DataTable,
  AssetSvg,
  InfoTooltip,
  SearchBar,
  useToast,
} from '../../../components/ui/index.js';
import { useGroupRankPathSettings } from '../../../hooks/groups/useGroupShopSchedule.js';
import { SVG_ICONS } from '../../../constants/svgIcons.js';
import SectionPageLayout from '../../../components/layout/sectionPage/SectionPageLayout.jsx';
import useGroupSubNav from '../../../navigation/useGroupSubNav.js';
import '../../../components/page/PageUnavailable.css';
import { useGroupRanks } from './useGroupRanks.js';
import { useGroupShopItems } from '../../../hooks/shop/useGroupShop.js';
import { resolveShopItemLabels } from '../../../utils/ranks/rankShopItemUnlock.js';
import RewardsRankTableRow from './shared/RewardsRankTableRow.jsx';
import './shared/rewardsShared.css';
import './shared/rewardsTablePreview.css';
import RankAssignModal from './modals/RankAssignModal.jsx';
import RankDeleteModal from './modals/RankDeleteModal.jsx';
import { useViewLayoutPreference } from '../../../hooks/useViewLayoutPreference.js';
import ViewLayoutToggle from '../../../components/ui/ViewLayoutToggle/ViewLayoutToggle.jsx';
import GroupMainRanksContent from '../group-main-ranks/GroupMainRanksContent.jsx';
import RankFormModal from './modals/RankFormModal.jsx';
import RankDiscountModal from './modals/RankDiscountModal.jsx';
import RankUnlockItemsModal from './modals/RankUnlockItemsModal.jsx';
import { READLANGUAGECOOKIE } from '../../../utils/LANGUAGECOOKIE.js';

const CREATEDSUCCESS__TEXTLABEL = {
  polish: 'Ranga została utworzona.',
  english: 'Rank has been created.'
};

const UPDATEDSUCCESS__TEXTLABEL = {
  polish: 'Ranga została zaktualizowana.',
  english: 'Rank has been updated.'
};

const DELETEDSUCCESS__TEXTLABEL = {
  polish: 'Ranga została usunięta.',
  english: 'Rank has been deleted.'
};

const ASSIGNEDSUCCESS__TEXTLABEL = {
  polish: 'Przypisanie rangi zostało zapisane.',
  english: 'Rank assignment has been saved.'
};

const DISCOUNTUPDATEDSUCCESS__TEXTLABEL = {
  polish: 'Zniżka rangi została zaktualizowana.',
  english: 'Rank discount has been updated.'
};

const ITEMSUPDATEDSUCCESS__TEXTLABEL = {
  polish: 'Odblokowane przedmioty zostały zaktualizowane.',
  english: 'Unlocked items have been updated.'
};

const CREATIONERROR__TEXTLABEL = {
  polish: 'Nie udało się utworzyć rangi.',
  english: 'Failed to create rank.'
};

const UPDATEERROR__TEXTLABEL = {
  polish: 'Nie udało się zaktualizować rangi.',
  english: 'Failed to update rank.'
};

const DELETEERROR__TEXTLABEL = {
  polish: 'Nie udało się usunąć rangi.',
  english: 'Failed to delete rank.'
};

const ASSIGNERROR__TEXTLABEL = {
  polish: 'Nie udało się przypisać rangi.',
  english: 'Failed to assign rank.'
};

const DISCOUNTUPDATEERROR__TEXTLABEL = {
  polish: 'Nie udało się zaktualizować zniżki.',
  english: 'Failed to update discount.'
};

const ITEMSUPDATEERROR__TEXTLABEL = {
  polish: 'Nie udało się zaktualizować przedmiotów.',
  english: 'Failed to update items.'
};

const MEMBERSHIDDEN__TEXTLABEL = {
  polish: 'Uczestnicy zostali ukryci na ścieżce rang.',
  english: 'Participants have been hidden from the rank path.'
};

const MEMBERSVISIBLE__TEXTLABEL = {
  polish: 'Uczestnicy są widoczni na ścieżce rang.',
  english: 'Participants are visible on the rank path.'
};

const LOADING__TEXTLABEL = {
  polish: 'Ładowanie rang…',
  english: 'Loading ranks…'
};

const EMPTYMESSAGE__TEXTLABEL = {
  polish: 'Brak rang w tej grupie. Kliknij „Dodaj rangę”, aby utworzyć pierwszą.',
  english: 'No ranks in this group. Click "Add rank" to create the first one.'
};

const ADDRANKBUTTON__TEXTLABEL = {
  polish: 'Dodaj rangę',
  english: 'Add rank'
};

const HIDEMEMBERSBUTTON__TEXTLABEL = {
  polish: 'Ukryj uczestników',
  english: 'Hide participants'
};

const SHOWMEMBERSBUTTON__TEXTLABEL = {
  polish: 'Pokaż uczestników',
  english: 'Show participants'
};

const MEMBERAVATARTOOLTIP__TEXTLABEL = {
  polish: 'Steruje widocznością awatarów uczestników na ścieżce rang w widoku kafelkowym.',
  english: 'Controls participant avatar visibility on the rank path in tile view.'
};

const SEARCHPLACEHOLDER__TEXTLABEL = {
  polish: 'Szukaj rangi…',
  english: 'Search rank…'
};

const SEARCHARIA__TEXTLABEL = {
  polish: 'Szukaj rangi',
  english: 'Search rank'
};

const COLNUMBER__TEXTLABEL = {
  polish: 'Numer',
  english: '#'
};

const COLNAME__TEXTLABEL = {
  polish: 'Nazwa',
  english: 'Name'
};

const COLICON__TEXTLABEL = {
  polish: 'Ikona',
  english: 'Icon'
};

const COLCOST__TEXTLABEL = {
  polish: 'Wymagane pkt',
  english: 'Points needed'
};

const COLDISCOUNT__TEXTLABEL = {
  polish: 'Zniżka',
  english: 'Discount'
};

const COLSTATUS__TEXTLABEL = {
  polish: 'Status fabularny',
  english: 'Story status'
};

const COLSHOPITEMS__TEXTLABEL = {
  polish: 'Przedmioty sklepu',
  english: 'Shop items'
};

const DELETERANKLABEL__TEXTLABEL = {
  polish: 'Usuń rangę',
  english: 'Delete rank'
};

const ASSIGNLABEL__TEXTLABEL = {
  polish: 'Przydziel rangę',
  english: 'Assign rank'
};

const ASSIGNARIA__TEXTLABEL = {
  polish: 'Przypisz rangę studentom',
  english: 'Assign rank to students'
};

const EDITLABEL__TEXTLABEL = {
  polish: 'Edytuj rangę',
  english: 'Edit rank'
};

const EDITDESC__TEXTLABEL = {
  polish: 'Zmień dane rangi w kreatorze.',
  english: 'Change rank details in the editor.'
};

const DISCOUNTLABEL__TEXTLABEL = {
  polish: 'Zniżka w sklepie',
  english: 'Shop discount'
};

const DISCOUNTDESC__TEXTLABEL = {
  polish: 'Ustaw procentową zniżkę dla posiadaczy rangi.',
  english: 'Set a percentage discount for rank holders.'
};

const UNLOCKITEMSLABEL__TEXTLABEL = {
  polish: 'Odblokowane przedmioty',
  english: 'Unlocked items'
};

const UNLOCKITEMSDESC__TEXTLABEL = {
  polish: 'Wybierz przedmioty sklepu odblokowywane przez rangę.',
  english: 'Select shop items unlocked by the rank.'
};

const PAGINATIONARIA__TEXTLABEL = {
  polish: 'Nawigacja stron listy rang',
  english: 'Rank list page navigation'
};





export default function RewardsHomeContent() {
  const [LANGUAGE] = useState(READLANGUAGECOOKIE);


  const RANK_COLUMNS = [
    {
      key: 'position',
      label: COLNUMBER__TEXTLABEL[LANGUAGE],
      sort: 'number',
      width: '90px',
      render: (rank) => (
        <span className="rewards-table__position">#{rank.position}</span>
      ),
    },
    {
      key: 'name',
      label: COLNAME__TEXTLABEL[LANGUAGE],
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
      key: 'icon',
      label: COLICON__TEXTLABEL[LANGUAGE],
      sort: 'text',
      width: '140px',
      cellClassName: 'rewards-table__cell--truncate',
      hiddenBelow: 768,
      render: (rank) => (
        rank.icon ? (
          <span className="rewards-table__icon-emoji" aria-hidden="true">{rank.icon}</span>
        ) : (
          <span className="rewards-table__cell-text rewards-table__cell-text--muted">—</span>
        )
      ),
    },
    {
      key: 'costAmount',
      label: COLCOST__TEXTLABEL[LANGUAGE],
      sort: 'number',
      width: '120px',
      render: (rank) => (
        <CurrencyDisplay amount={rank.costAmount} size="sm" />
      ),
    },
    {
      key: 'discount',
      label: COLDISCOUNT__TEXTLABEL[LANGUAGE],
      sort: 'number',
      width: '100px',
      render: (rank) => (
        <span className="rewards-table__cell-text rewards-table__cell-text--discount">
          {Number(rank.discount ?? 0)}%
        </span>
      ),
    },
    {
      key: 'storyDescription',
      label: COLSTATUS__TEXTLABEL[LANGUAGE],
      sort: 'text',
      width: '240px',
      cellClassName: 'rewards-table__cell--truncate',
      hiddenBelow: 768,
      render: (rank) => (
        <span className="rewards-table__cell-text">
          <em>{rank.storyDescription}</em>
        </span>
      ),
    },
    {
      key: 'shopItems',
      label: COLSHOPITEMS__TEXTLABEL[LANGUAGE],
      sort: 'text',
      width: '220px',
      cellClassName: 'rewards-table__cell--truncate',
      hiddenBelow: 768,
    },
  ];
  function createRankColumns(resolveShopItems) {
    return RANK_COLUMNS.map((column) => (
      column.key === 'shopItems'
        ? {
          ...column,
          render: (rank) => (
            <span className="rewards-table__cell-text">
              {resolveShopItems(rank.shopItems).join(', ') || '—'}
            </span>
          ),
        }
        : column
    ));
  }

  const nav = useGroupSubNav('group-rewards');
  const { groupId } = useParams();
  const { layout, toggleLayout, isTileView } = useViewLayoutPreference('maq-rewards-ranks-view');
  const { showSuccess, showError } = useToast();
  const { showMemberAvatars, toggleShowMemberAvatars } = useGroupRankPathSettings(groupId);
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
  const { items: shopCatalogItems } = useGroupShopItems(groupId);

  const resolveShopItemNames = useCallback(
    (itemIds = []) => resolveShopItemLabels(itemIds, shopCatalogItems),
    [shopCatalogItems],
  );

  const rankColumns = useMemo(
    () => createRankColumns(resolveShopItemNames),
    [resolveShopItemNames],
  );

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
      showSuccess(CREATEDSUCCESS__TEXTLABEL[LANGUAGE]);
      closeModal();
    } else {
      showError(result.error || CREATIONERROR__TEXTLABEL[LANGUAGE]);
    }
  }, [handleCreate, closeModal, showSuccess, showError, LANGUAGE]);

  const handleEditConfirm = useCallback(async (values) => {
    if (!activeModal?.rank) return;
    setModalLoading(true);
    const result = await handleUpdate(activeModal.rank.id, values);
    setModalLoading(false);
    if (result.ok) {
      showSuccess(UPDATEDSUCCESS__TEXTLABEL[LANGUAGE]);
      closeModal();
    } else {
      showError(result.error || UPDATEERROR__TEXTLABEL[LANGUAGE]);
    }
  }, [activeModal, handleUpdate, closeModal, showSuccess, showError, LANGUAGE]);

  const handleDeleteConfirm = useCallback(async () => {
    if (!activeModal?.rank) return;
    setModalLoading(true);
    const result = await handleDelete(activeModal.rank.id);
    setModalLoading(false);
    if (result.ok) {
      showSuccess(DELETEDSUCCESS__TEXTLABEL[LANGUAGE]);
      closeModal();
    } else {
      showError(result.error || DELETEERROR__TEXTLABEL[LANGUAGE]);
    }
  }, [activeModal, handleDelete, closeModal, showSuccess, showError, LANGUAGE]);

  const handleAssignConfirm = useCallback(async (selectedStudentIds) => {
    if (!activeModal?.rank) return;
    setModalLoading(true);
    const result = await handleAssign(activeModal.rank.id, selectedStudentIds);
    setModalLoading(false);
    if (result.ok) {
      showSuccess(ASSIGNEDSUCCESS__TEXTLABEL[LANGUAGE]);
      closeModal();
    } else {
      showError(result.error || ASSIGNERROR__TEXTLABEL[LANGUAGE]);
    }
  }, [activeModal, handleAssign, closeModal, showSuccess, showError, LANGUAGE]);

  const handleDiscountConfirm = useCallback(async (values) => {
    if (!activeModal?.rank) return;
    setModalLoading(true);
    const result = await handleUpdate(activeModal.rank.id, values);
    setModalLoading(false);
    if (result.ok) {
      showSuccess(DISCOUNTUPDATEDSUCCESS__TEXTLABEL[LANGUAGE]);
      closeModal();
    } else {
      showError(result.error || DISCOUNTUPDATEERROR__TEXTLABEL[LANGUAGE]);
    }
  }, [activeModal, handleUpdate, closeModal, showSuccess, showError, LANGUAGE]);

  const handleUnlockItemsConfirm = useCallback(async (values) => {
    if (!activeModal?.rank) return;
    setModalLoading(true);
    const result = await handleUpdate(activeModal.rank.id, values);
    setModalLoading(false);
    if (result.ok) {
      showSuccess(ITEMSUPDATEDSUCCESS__TEXTLABEL[LANGUAGE]);
      closeModal();
    } else {
      showError(result.error || ITEMSUPDATEERROR__TEXTLABEL[LANGUAGE]);
    }
  }, [activeModal, handleUpdate, closeModal, showSuccess, showError, LANGUAGE]);

  const resolveRankByDbId = useCallback((dbId) => (
    ranks.find((entry) => entry.dbId === dbId) ?? null
  ), [ranks]);

  const handleTileEditRank = useCallback((pathRank) => {
    const rank = resolveRankByDbId(pathRank.dbId);
    if (rank) {
      openModal('edit', rank);
    }
  }, [resolveRankByDbId, openModal]);

  const handleTileDeleteRank = useCallback((pathRank) => {
    const rank = resolveRankByDbId(pathRank.dbId);
    if (rank) {
      openModal('delete', rank);
    }
  }, [resolveRankByDbId, openModal]);

  const handleTileAssignRank = useCallback((pathRank) => {
    const rank = resolveRankByDbId(pathRank.dbId);
    if (rank) {
      openModal('assign', rank);
    }
  }, [resolveRankByDbId, openModal]);

  const handleOpenDiscountFromForm = useCallback((rank) => {
    closeModal();
    openModal('discount', rank);
  }, [closeModal, openModal]);

  const handleOpenUnlockItemsFromForm = useCallback((rank) => {
    closeModal();
    openModal('unlockItems', rank);
  }, [closeModal, openModal]);

  const rowActions = useMemo(() => ({
    onDelete: (rank) => openModal('delete', rank),
    deleteLabel: DELETERANKLABEL__TEXTLABEL[LANGUAGE],
    deleteAriaLabel: (rank) => `${DELETERANKLABEL__TEXTLABEL[LANGUAGE]} ${rank.name}`,
    inlineActions: [
      {
        id: 'assign',
        label: ASSIGNLABEL__TEXTLABEL[LANGUAGE],
        iconFile: SVG_ICONS.actions.assign,
        ariaLabel: ASSIGNARIA__TEXTLABEL[LANGUAGE],
        onSelect: (rank) => openModal('assign', rank),
      },
    ],
    menuItems: [
      {
        id: 'edit',
        label: EDITLABEL__TEXTLABEL[LANGUAGE],
        description: EDITDESC__TEXTLABEL[LANGUAGE],
        onSelect: (rank) => openModal('edit', rank),
      },
      {
        id: 'discount',
        label: DISCOUNTLABEL__TEXTLABEL[LANGUAGE],
        description: DISCOUNTDESC__TEXTLABEL[LANGUAGE],
        onSelect: (rank) => openModal('discount', rank),
      },
      {
        id: 'unlock-items',
        label: UNLOCKITEMSLABEL__TEXTLABEL[LANGUAGE],
        description: UNLOCKITEMSDESC__TEXTLABEL[LANGUAGE],
        onSelect: (rank) => openModal('unlockItems', rank),
      },
    ],
  }), [openModal, LANGUAGE]);

  const handleToggleMemberAvatars = useCallback(async () => {
    const wasVisible = showMemberAvatars;
    const result = await toggleShowMemberAvatars();
    if (result.ok) {
      showSuccess(wasVisible
        ? MEMBERSHIDDEN__TEXTLABEL[LANGUAGE]
        : MEMBERSVISIBLE__TEXTLABEL[LANGUAGE]);
    }
  }, [toggleShowMemberAvatars, showMemberAvatars, showSuccess, LANGUAGE]);

  const modalRank = activeModal?.rank ?? null;

  if (error) {
    return (
      <SectionPageLayout
        className="page-unavailable rewards-page"
        title={nav.sectionTitle}
        subNavItems={nav.items}
        subNavAriaLabel={nav.ariaLabel}
      >
        <p className="rewards-page__error" role="alert">{error}</p>
      </SectionPageLayout>
    );
  }

  return (
    <SectionPageLayout
      className="page-unavailable rewards-page rewards-page--ranks"
      title={nav.sectionTitle}
      subNavItems={nav.items}
      subNavAriaLabel={nav.ariaLabel}
      headerAction={<ViewLayoutToggle layout={layout} onToggle={toggleLayout} />}
      toolbar={(
        <>
          <div className="maq-section-page__toolbar-start">
            <Button
              variant="primary"
              size="md"
              className="rewards-page__add-btn"
              onClick={() => openModal('create')}
            >
              {ADDRANKBUTTON__TEXTLABEL[LANGUAGE]}
            </Button>
          </div>
          <div className="maq-section-page__toolbar-end rewards-page__toolbar-end rewards-page__toolbar-end--ranks">
            <div className="rewards-ranks__members-toggle-wrap">
              <Button
                type="button"
                variant={showMemberAvatars ? 'primary' : 'secondary'}
                size="md"
                className="rewards-ranks__members-toggle"
                onClick={handleToggleMemberAvatars}
              >
                {showMemberAvatars ? HIDEMEMBERSBUTTON__TEXTLABEL[LANGUAGE] : SHOWMEMBERSBUTTON__TEXTLABEL[LANGUAGE]}
              </Button>
              <InfoTooltip text={MEMBERAVATARTOOLTIP__TEXTLABEL[LANGUAGE]} />
            </div>
            <SearchBar
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder={SEARCHPLACEHOLDER__TEXTLABEL[LANGUAGE]}
              name="rank-catalog-search"
              className="rewards-page__search"
              aria-label={SEARCHARIA__TEXTLABEL[LANGUAGE]}
            />
          </div>
        </>
      )}
    >

      {isLoading ? (
        <p className="rewards-page__loading page-unavailable__notice">{LOADING__TEXTLABEL[LANGUAGE]}</p>
      ) : ranks.length === 0 ? (
        <p className="rewards-page__empty page-unavailable__notice">{EMPTYMESSAGE__TEXTLABEL[LANGUAGE]}</p>
      ) : isTileView ? (
        <GroupMainRanksContent
          embedded
          showMemberAvatars={showMemberAvatars}
          showLecturerActions
          onEditRank={handleTileEditRank}
          onDeleteRank={handleTileDeleteRank}
          onAssignRank={handleTileAssignRank}
        />
      ) : (
        <DataTable
          columns={rankColumns}
          data={ranks}
          rowKey="id"
          tiebreakerKey="position"
          itemsPerPage={10}
          paginationAriaLabel={PAGINATIONARIA__TEXTLABEL[LANGUAGE]}
          className="rewards-table rewards-table--ranks"
          search={{
            external: true,
            value: searchQuery,
            filter: (rank, query) => (
              rank.name.toLowerCase().includes(query)
              || rank.storyDescription.toLowerCase().includes(query)
              || String(rank.discount ?? '').includes(query)
              || resolveShopItemNames(rank.shopItems).some((item) => item.toLowerCase().includes(query))
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
        onOpenDiscountModal={handleOpenDiscountFromForm}
        onOpenUnlockItemsModal={handleOpenUnlockItemsFromForm}
        isLoading={modalLoading}
      />
      <RankDiscountModal
        isOpen={activeModal?.type === 'discount'}
        rank={modalRank}
        onClose={closeModal}
        onConfirm={handleDiscountConfirm}
        isLoading={modalLoading}
      />
      <RankUnlockItemsModal
        isOpen={activeModal?.type === 'unlockItems'}
        rank={modalRank}
        existingRanks={ranks}
        shopCatalogItems={shopCatalogItems}
        onClose={closeModal}
        onConfirm={handleUnlockItemsConfirm}
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
    </SectionPageLayout>
  );
}

