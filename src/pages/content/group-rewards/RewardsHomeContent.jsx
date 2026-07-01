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
    key: 'icon',
    label: 'Ikona',
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
    label: 'Wymagane pkt',
    sort: 'number',
    width: '120px',
    render: (rank) => (
      <CurrencyDisplay amount={rank.costAmount} size="sm" />
    ),
  },
  {
    key: 'discount',
    label: 'Zniżka',
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

export default function RewardsHomeContent() {
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
      showSuccess('Ranga została utworzona.');
      closeModal();
    } else {
      showError(result.error || 'Nie udało się utworzyć rangi.');
    }
  }, [handleCreate, closeModal, showSuccess, showError]);

  const handleEditConfirm = useCallback(async (values) => {
    if (!activeModal?.rank) return;
    setModalLoading(true);
    const result = await handleUpdate(activeModal.rank.id, values);
    setModalLoading(false);
    if (result.ok) {
      showSuccess('Ranga została zaktualizowana.');
      closeModal();
    } else {
      showError(result.error || 'Nie udało się zaktualizować rangi.');
    }
  }, [activeModal, handleUpdate, closeModal, showSuccess, showError]);

  const handleDeleteConfirm = useCallback(async () => {
    if (!activeModal?.rank) return;
    setModalLoading(true);
    const result = await handleDelete(activeModal.rank.id);
    setModalLoading(false);
    if (result.ok) {
      showSuccess('Ranga została usunięta.');
      closeModal();
    } else {
      showError(result.error || 'Nie udało się usunąć rangi.');
    }
  }, [activeModal, handleDelete, closeModal, showSuccess, showError]);

  const handleAssignConfirm = useCallback(async (selectedStudentIds) => {
    if (!activeModal?.rank) return;
    setModalLoading(true);
    const result = await handleAssign(activeModal.rank.id, selectedStudentIds);
    setModalLoading(false);
    if (result.ok) {
      showSuccess('Przypisanie rangi zostało zapisane.');
      closeModal();
    } else {
      showError(result.error || 'Nie udało się przypisać rangi.');
    }
  }, [activeModal, handleAssign, closeModal, showSuccess, showError]);

  const handleDiscountConfirm = useCallback(async (values) => {
    if (!activeModal?.rank) return;
    setModalLoading(true);
    const result = await handleUpdate(activeModal.rank.id, values);
    setModalLoading(false);
    if (result.ok) {
      showSuccess('Zniżka rangi została zaktualizowana.');
      closeModal();
    } else {
      showError(result.error || 'Nie udało się zaktualizować zniżki.');
    }
  }, [activeModal, handleUpdate, closeModal, showSuccess, showError]);

  const handleUnlockItemsConfirm = useCallback(async (values) => {
    if (!activeModal?.rank) return;
    setModalLoading(true);
    const result = await handleUpdate(activeModal.rank.id, values);
    setModalLoading(false);
    if (result.ok) {
      showSuccess('Odblokowane przedmioty zostały zaktualizowane.');
      closeModal();
    } else {
      showError(result.error || 'Nie udało się zaktualizować przedmiotów.');
    }
  }, [activeModal, handleUpdate, closeModal, showSuccess, showError]);

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
    deleteLabel: 'Usuń rangę',
    deleteAriaLabel: (rank) => `Usuń rangę ${rank.name}`,
    inlineActions: [
      {
        id: 'assign',
        label: 'Przydziel rangę',
        iconFile: SVG_ICONS.actions.assign,
        ariaLabel: 'Przypisz rangę studentom',
        onSelect: (rank) => openModal('assign', rank),
      },
    ],
    menuItems: [
      {
        id: 'edit',
        label: 'Edytuj rangę',
        description: 'Zmień dane rangi w kreatorze.',
        onSelect: (rank) => openModal('edit', rank),
      },
      {
        id: 'discount',
        label: 'Zniżka w sklepie',
        description: 'Ustaw procentową zniżkę dla posiadaczy rangi.',
        onSelect: (rank) => openModal('discount', rank),
      },
      {
        id: 'unlock-items',
        label: 'Odblokowane przedmioty',
        description: 'Wybierz przedmioty sklepu odblokowywane przez rangę.',
        onSelect: (rank) => openModal('unlockItems', rank),
      },
    ],
  }), [openModal]);

  const handleToggleMemberAvatars = useCallback(async () => {
    const wasVisible = showMemberAvatars;
    const result = await toggleShowMemberAvatars();
    if (result.ok) {
      showSuccess(wasVisible
        ? 'Uczestnicy zostali ukryci na ścieżce rang.'
        : 'Uczestnicy są widoczni na ścieżce rang.');
    }
  }, [toggleShowMemberAvatars, showMemberAvatars, showSuccess]);

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
              Dodaj rangę
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
                {showMemberAvatars ? 'Ukryj uczestników' : 'Pokaż uczestników'}
              </Button>
              <InfoTooltip text="Steruje widocznością awatarów uczestników na ścieżce rang w widoku kafelkowym." />
            </div>
            <SearchBar
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Szukaj rangi…"
              name="rank-catalog-search"
              className="rewards-page__search"
              aria-label="Szukaj rangi"
            />
          </div>
        </>
      )}
    >

      {isLoading ? (
        <p className="rewards-page__loading page-unavailable__notice">Ładowanie rang…</p>
      ) : ranks.length === 0 ? (
        <p className="rewards-page__empty page-unavailable__notice">Brak rang w tej grupie. Kliknij „Dodaj rangę”, aby utworzyć pierwszą.</p>
      ) : isTileView ? (
        <GroupMainRanksContent
          embedded
          showMemberAvatars={showMemberAvatars}
          showLecturerActions
          onEditRank={handleTileEditRank}
          onDeleteRank={handleTileDeleteRank}
        />
      ) : (
        <DataTable
          columns={rankColumns}
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
        existingRanks={ranks}
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
