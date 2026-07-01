import { useCallback, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Button,
  CatalogFilterGroup,
  CatalogFiltersPanel,
  CatalogFiltersToggle,
  CatalogSortSelect,
  CurrencyDisplay,
  DataTable,
  SearchBar,
  useToast,
} from '../../../components/ui/index.js';
import SectionPageLayout from '../../../components/layout/sectionPage/SectionPageLayout.jsx';
import useGroupSubNav from '../../../navigation/useGroupSubNav.js';
import { buildShopCategoryFilters, resolveShopCategoryLabels } from '../../../utils/shop/shopCategories.js';
import ShopDeleteModal from '../group-shop/modals/ShopDeleteModal.jsx';
import ShopItemFormModal from '../group-shop/modals/ShopItemFormModal.jsx';
import ShopAccessModal from '../group-shop/modals/ShopAccessModal.jsx';
import ShopCategoriesModal from '../group-shop/modals/ShopCategoriesModal.jsx';
import ShopStudentCatalogPanel from '../group-shop/ShopStudentCatalogPanel.jsx';
import { useGroupShopSchedule } from '../../../hooks/groups/useGroupShopSchedule.js';
import { useViewLayoutPreference } from '../../../hooks/useViewLayoutPreference.js';
import ViewLayoutToggle from '../../../components/ui/ViewLayoutToggle/ViewLayoutToggle.jsx';
import { useGroupShopItems, useGroupShopOpen } from '../../../hooks/shop/useGroupShop.js';
import { useGroupItemCategories } from '../../../hooks/shop/useGroupItemCategories.js';
import {
  SHOP_SORT,
  SHOP_SORT_OPTIONS,
} from '../../../utils/shop/shopModel.js';
import { getVisibilityStatusLabel } from '../../../utils/rewards/visibilityStatusLabel.js';
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
function mapShopItemToRow(item, index, categoriesById) {
  const categoryLabels = resolveShopCategoryLabels(item.categories, categoriesById);
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
    key: 'visibility',
    label: 'Widoczność',
    sort: 'text',
    width: '110px',
    accessor: (item) => getVisibilityStatusLabel(item.isPublished),
    render: (item) => (
      <span
        className={[
          'rewards-table__visibility',
          item.isPublished === false
            ? 'rewards-table__visibility--hidden'
            : 'rewards-table__visibility--public',
        ].join(' ')}
      >
        {getVisibilityStatusLabel(item.isPublished)}
      </span>
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
    width: '80px',
    render: (item) => (
      item.imageRef ? (
        <span className="rewards-table__icon-emoji" aria-hidden="true">
          {String(item.imageRef).split('*')[0]}
        </span>
      ) : (
        <span className="rewards-table__cell-text rewards-table__cell-text--muted">—</span>
      )
    ),
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
  const { showSuccess, showError } = useToast();
  const {
    items,
    isLoading,
    error,
    deleteItem,
    refetch,
  } = useGroupShopItems(groupId);
  const { isShopOpen, toggleShopOpen } = useGroupShopOpen(groupId);
  const { shopOpensAt, scheduleShopOpen } = useGroupShopSchedule(groupId);
  const {
    categories,
    categoriesById,
    refetch: refetchCategories,
  } = useGroupItemCategories(groupId);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeModal, setActiveModal] = useState(null);
  const [shopAccessOpen, setShopAccessOpen] = useState(false);
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState(SHOP_SORT.nameAsc);

  const categoryFilters = useMemo(
    () => buildShopCategoryFilters(categories),
    [categories],
  );

  const catalogItems = useMemo(
    () => items.map((item, index) => mapShopItemToRow(item, index, categoriesById)),
    [items, categoriesById],
  );

  const closeModal = useCallback(() => {
    setActiveModal(null);
  }, []);

  const handleItemSaved = useCallback(async () => {
    closeModal();
    await refetch();
    await refetchCategories();
  }, [closeModal, refetch, refetchCategories]);

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
    setActiveModal({ type: 'itemForm', itemId: item.id });
  }, []);

  const openAddModal = useCallback(() => {
    setActiveModal({ type: 'itemForm', itemId: null });
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

  const handleEdit = useCallback((item) => {
    openEditModal(item);
  }, [openEditModal]);

  const handleAddProduct = useCallback(() => {
    if (!groupId) {
      return;
    }
    openAddModal();
  }, [groupId, openAddModal]);

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
            <div className="rewards-shop-items__toolbar-row">
              <Button
                type="button"
                variant="secondary"
                size="md"
                className="rewards-shop-items__access-btn"
                onClick={() => setActiveModal({ type: 'categories' })}
              >
                Kategorie
              </Button>
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
            {isTileView ? (
              <div className="rewards-shop-items__toolbar-row rewards-shop-items__toolbar-row--filters">
                <CatalogFiltersToggle
                  expanded={filtersExpanded}
                  onToggle={() => setFiltersExpanded((expanded) => !expanded)}
                />
              </div>
            ) : null}
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
        <>
          {filtersExpanded ? (
            <CatalogFiltersPanel className="rewards-page__filters">
              <CatalogFilterGroup
                ariaLabel="Filtr kategorii produktu"
                filters={categoryFilters}
                activeId={categoryFilter}
                onSelect={setCategoryFilter}
              />
              <CatalogSortSelect
                value={sortBy}
                onChange={setSortBy}
                options={SHOP_SORT_OPTIONS}
              />
            </CatalogFiltersPanel>
          ) : null}
          <ShopStudentCatalogPanel
            groupId={groupId}
            showLecturerActions
            onlyPublished={false}
            searchQuery={searchQuery}
            filtersExpanded={false}
            categoryFilter={categoryFilter}
            onCategoryFilterChange={setCategoryFilter}
            sortBy={sortBy}
            onSortByChange={setSortBy}
            onEdit={handleEdit}
            onDelete={openDeleteModal}
          />
        </>
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

      <ShopItemFormModal
        isOpen={activeModal?.type === 'itemForm'}
        groupId={groupId}
        itemId={activeModal?.type === 'itemForm' ? activeModal.itemId : null}
        onClose={closeModal}
        onSaved={handleItemSaved}
      />

      <ShopAccessModal
        isOpen={shopAccessOpen}
        isShopOpen={isShopOpen}
        shopOpensAt={shopOpensAt}
        onClose={() => setShopAccessOpen(false)}
        onToggleShopOpen={handleToggleShopOpen}
        onScheduleShopOpen={handleScheduleShopOpen}
      />

      <ShopCategoriesModal
        isOpen={activeModal?.type === 'categories'}
        groupId={groupId}
        categories={categories}
        onClose={closeModal}
        onChanged={refetchCategories}
      />
    </SectionPageLayout>
  );
}
