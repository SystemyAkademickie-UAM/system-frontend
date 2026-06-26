import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Button,
  CurrencyDisplay,
  DataTable,
  SearchBar,
  useToast,
} from '../../../components/ui/index.js';
import SectionPageLayout from '../../../components/layout/sectionPage/SectionPageLayout.jsx';
import useGroupSubNav from '../../../navigation/useGroupSubNav.js';
import { groupShopAddPath } from '../../../routes/pathRegistry.js';
import { useGroupShopSchedule } from '../../../hooks/groups/useGroupShopSchedule.js';
import ShopAccessModal from '../group-shop/modals/ShopAccessModal.jsx';
import '../../../components/page/PageUnavailable.css';
import { resolveShopCategoryLabels } from '../../../utils/shop/shopCategories.js';
import ShopDeleteModal from '../group-shop/modals/ShopDeleteModal.jsx';
import ShopEditModal from '../group-shop/modals/ShopEditModal.jsx';
import ShopStudentCatalogPanel from '../group-shop/ShopStudentCatalogPanel.jsx';
import { fetchGroupRanks } from '../../../services/ranks.api.js';
import { syncShopItemRankUnlock } from '../../../utils/ranks/rankShopItemUnlock.js';
import { useViewLayoutPreference } from '../../../hooks/useViewLayoutPreference.js';
import ViewLayoutToggle from '../../../components/ui/ViewLayoutToggle/ViewLayoutToggle.jsx';
import { useGroupShopItems, useGroupShopOpen } from '../../../hooks/shop/useGroupShop.js';
import RewardsShopItemTableRow from '../group-rewards/shared/RewardsShopItemTableRow.jsx';
import '../group-rewards/shared/rewardsShared.css';
import '../group-rewards/shared/rewardsTablePreview.css';
import './RewardsShopItemsContent.css';

/**
 * @param {number | null | undefined} value
 * @returns {string}
 */
function formatLimitValue(value) {
  if (value === null || value === undefined) {
    return 'Bez limitu';
  }
  return String(value);
}

/**
 * @param {import('../../../utils/shop/shopItem.types.js').ShopItem} item
 * @param {number} index
 */
function mapShopItemToRow(item, index) {
  const categoryLabels = resolveShopCategoryLabels(item.categories);
  return {
    ...item,
    position: index + 1,
    categoryLabel: categoryLabels.join(', ') || '—',
    stockLabel: formatLimitValue(item.stockQuantity),
    studentLimitLabel: formatLimitValue(item.perStudentLimit),
  };
}

const SHOP_ITEM_COLUMNS = [
  {
    key: 'position',
    label: 'Numer',
    sort: 'number',
    width: '90px',
    className: 'rewards-table__th--position',
    render: (item) => (
      <span className="rewards-table__position">#{item.position}</span>
    ),
  },
  {
    key: 'name',
    label: 'Nazwa',
    sort: 'text',
    width: '240px',
    render: (item) => (
      <span className="rewards-table__name">{item.name}</span>
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
    key: 'priceAmount',
    label: 'Cena',
    sort: 'number',
    width: '120px',
    render: (item) => (
      <CurrencyDisplay
        amount={item.priceAmount}
        size="sm"
      />
    ),
  },
  {
    key: 'storyDescription',
    label: 'Opis fabularny',
    sort: 'text',
    width: '220px',
    cellClassName: 'rewards-table__cell--truncate',
    hiddenBelow: 768,
    render: (item) => (
      <span className="rewards-table__cell-text rewards-table__cell-text--truncate">
        {item.storyDescription || '—'}
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
    render: (item) => (
      <span className="rewards-table__cell-text rewards-table__cell-text--truncate">
        {item.didacticDescription || '—'}
      </span>
    ),
  },
  {
    key: 'categoryLabel',
    label: 'Kategoria',
    sort: 'text',
    width: '160px',
    cellClassName: 'rewards-table__cell--truncate',
    hiddenBelow: 768,
    render: (item) => (
      <span className="rewards-table__cell-text rewards-table__cell-text--truncate">
        {item.categoryLabel}
      </span>
    ),
  },
  {
    key: 'stockLabel',
    label: 'Stan magazynu',
    sort: 'text',
    width: '130px',
    hiddenBelow: 768,
    render: (item) => (
      <span className="rewards-table__cell-text">{item.stockLabel}</span>
    ),
  },
  {
    key: 'studentLimitLabel',
    label: 'Limit / student',
    sort: 'text',
    width: '130px',
    hiddenBelow: 768,
    render: (item) => (
      <span className="rewards-table__cell-text">{item.studentLimitLabel}</span>
    ),
  },
];

export default function RewardsShopItemsContent() {
  const nav = useGroupSubNav('group-rewards');
  const { layout, toggleLayout, isTileView } = useViewLayoutPreference('maq-rewards-shop-view');
  const { groupId } = useParams();
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const {
    items,
    isLoading,
    error,
    deleteItem,
    updateItem,
  } = useGroupShopItems(groupId);
  const { isShopOpen, toggleShopOpen } = useGroupShopOpen(groupId);
  const { shopOpensAt, scheduleShopOpen } = useGroupShopSchedule(groupId);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeModal, setActiveModal] = useState(null);
  const [shopAccessOpen, setShopAccessOpen] = useState(false);
  const [ranks, setRanks] = useState([]);

  const rankOptions = useMemo(
    () => ranks.map((rank, index) => ({
      dbId: rank.id,
      name: rank.name || 'Nieznana ranga',
      shopItems: rank.uniqueStoreItems || [],
      position: index + 1,
    })),
    [ranks],
  );

  useEffect(() => {
    if (!groupId) {
      setRanks([]);
      return;
    }

    let cancelled = false;
    fetchGroupRanks(groupId).then((data) => {
      if (!cancelled) {
        setRanks(data);
      }
    });

    return () => { cancelled = true; };
  }, [groupId]);

  const catalogItems = useMemo(
    () => items.map(mapShopItemToRow),
    [items],
  );

  const handleToggleShopOpen = useCallback(async () => {
    const result = await toggleShopOpen();
    if (!result?.ok) {
      showError(result?.error ?? 'Nie udało się zmienić statusu sklepu.');
      return { ok: false };
    }
    showSuccess(isShopOpen ? 'Sklep został zamknięty.' : 'Sklep został otwarty.');
    return { ok: true };
  }, [isShopOpen, showError, showSuccess, toggleShopOpen]);

  const handleScheduleShopOpen = useCallback(async (isoDate) => {
    const result = await scheduleShopOpen(isoDate);
    if (!result.ok) {
      showError(result.error ?? 'Nie udało się zapisać harmonogramu otwarcia.');
    } else if (isoDate) {
      showSuccess('Zapisano planowane otwarcie sklepu.');
    }
    return result;
  }, [scheduleShopOpen, showError, showSuccess]);

  const openDeleteModal = useCallback((item) => {
    setActiveModal({ type: 'delete', item });
  }, []);

  const openEditModal = useCallback((item) => {
    setActiveModal({ type: 'edit', item });
  }, []);

  const closeModal = useCallback(() => {
    setActiveModal(null);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!activeModal?.item) {
      return;
    }

    const result = await deleteItem(activeModal.item.id);

    if (result.ok) {
      showSuccess('Produkt został usunięty.');
      closeModal();
      return;
    }

    showError(result.error ?? 'Nie udało się usunąć produktu.');
  }, [activeModal, deleteItem, closeModal, showSuccess, showError]);

  const handleEditConfirm = useCallback(async (itemId, payload) => {
    const { unlockRankDbId, ...itemPayload } = payload;
    const item = activeModal?.item;
    if (!item || !groupId) {
      return;
    }

    const result = await updateItem(itemId, itemPayload);
    if (!result.ok) {
      showError(result.error ?? 'Nie udało się zapisać produktu.');
      return;
    }

    const rankResult = await syncShopItemRankUnlock(
      groupId,
      item.id,
      unlockRankDbId ?? null,
      rankOptions,
    );

    if (!rankResult.ok) {
      showError(rankResult.error ?? 'Produkt zapisany, ale nie udało się zaktualizować blokady rangi.');
      return;
    }

    const ranksRefresh = await fetchGroupRanks(groupId);
    setRanks(ranksRefresh);
    showSuccess('Produkt został zaktualizowany.');
    closeModal();
  }, [activeModal, groupId, updateItem, rankOptions, showError, showSuccess, closeModal]);

  const handleEdit = useCallback((item) => {
    openEditModal(item);
  }, [openEditModal]);

  const handleAddProduct = useCallback(() => {
    if (!groupId) {
      return;
    }
    navigate(groupShopAddPath(groupId));
  }, [groupId, navigate]);

  const rowActions = useMemo(() => ({
    onDelete: openDeleteModal,
    deleteLabel: 'Usuń produkt',
    deleteAriaLabel: (item) => `Usuń produkt ${item.name}`,
    menuItems: [
      {
        id: 'edit',
        label: 'Edytuj produkt',
        description: 'Otwórz formularz dodawania produktu.',
        onSelect: handleEdit,
      },
    ],
  }), [openDeleteModal, handleEdit]);

  const modalItem = activeModal?.item ?? null;

  if (error) {
    return (
      <SectionPageLayout
        className="page-unavailable rewards-page rewards-shop-items"
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
      className="page-unavailable rewards-page rewards-shop-items"
      title={nav.sectionTitle}
      subNavItems={nav.items}
      subNavAriaLabel={nav.ariaLabel}
      headerAction={<ViewLayoutToggle layout={layout} onToggle={toggleLayout} />}
      toolbar={(
        <>
          <div className="maq-section-page__toolbar-start rewards-shop-items__toolbar-start">
            <Button
              variant="primary"
              size="md"
              className="rewards-page__add-btn rewards-shop-items__add-btn"
              onClick={handleAddProduct}
            >
              Dodaj produkt
            </Button>
          </div>
          <div className="maq-section-page__toolbar-end rewards-shop-items__toolbar-end">
            <Button
              type="button"
              variant="secondary"
              size="md"
              className="rewards-shop-items__access-btn"
              onClick={() => setShopAccessOpen(true)}
            >
              Dostęp do sklepu
            </Button>
            <SearchBar
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Szukaj produktu…"
              name="shop-item-catalog-search"
              className="rewards-page__search rewards-shop-items__search"
              aria-label="Szukaj produktu"
            />
          </div>
        </>
      )}
    >

      {isLoading ? (
        <p className="rewards-page__loading page-unavailable__notice">Ładowanie produktów…</p>
      ) : catalogItems.length === 0 ? (
        <p className="rewards-page__empty page-unavailable__notice">
          Brak produktów w sklepie. Kliknij „Dodaj produkt”, aby utworzyć pierwszy.
        </p>
      ) : isTileView ? (
        <ShopStudentCatalogPanel
          groupId={groupId}
          showLecturerActions
          onlyPublished={false}
          searchQuery={searchQuery}
          onEdit={handleEdit}
          onDelete={openDeleteModal}
        />
      ) : (
        <DataTable
          columns={SHOP_ITEM_COLUMNS}
          data={catalogItems}
          rowKey="id"
          tiebreakerKey="position"
          itemsPerPage={10}
          paginationAriaLabel="Nawigacja stron listy produktów sklepowych"
          className="rewards-table rewards-table--shop-items"
          search={{
            external: true,
            value: searchQuery,
            filter: (item, query) => (
              item.name.toLowerCase().includes(query)
              || item.storyDescription.toLowerCase().includes(query)
              || item.didacticDescription.toLowerCase().includes(query)
              || item.categoryLabel.toLowerCase().includes(query)
              || item.stockLabel.toLowerCase().includes(query)
              || item.studentLimitLabel.toLowerCase().includes(query)
            ),
          }}
          rowActions={rowActions}
          renderRow={RewardsShopItemTableRow}
        />
      )}

      <ShopDeleteModal
        isOpen={activeModal?.type === 'delete'}
        item={modalItem}
        onClose={closeModal}
        onConfirm={handleDeleteConfirm}
      />

      <ShopEditModal
        isOpen={activeModal?.type === 'edit'}
        item={modalItem}
        ranks={rankOptions}
        onClose={closeModal}
        onConfirm={handleEditConfirm}
      />

      <ShopAccessModal
        isOpen={shopAccessOpen}
        isShopOpen={isShopOpen}
        shopOpensAt={shopOpensAt}
        onClose={() => setShopAccessOpen(false)}
        onToggleShopOpen={handleToggleShopOpen}
        onScheduleShopOpen={handleScheduleShopOpen}
      />
    </SectionPageLayout>
  );
}
