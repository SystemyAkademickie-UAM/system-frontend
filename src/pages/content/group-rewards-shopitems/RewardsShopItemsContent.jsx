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
import { READLANGUAGECOOKIE } from '../../../utils/LANGUAGECOOKIE.js';
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
  getShopSortOptions,
} from '../../../utils/shop/shopModel.js';
import { getVisibilityStatusLabel } from '../../../utils/rewards/visibilityStatusLabel.js';
import { filterCatalogShopItems } from '../../../utils/shop/extraLifeItem.js';
import { useGroupShopLivesSystem } from '../../../hooks/shop/useGroupShopLivesSystem.js';
import RewardsShopItemTableRow from '../group-rewards/shared/RewardsShopItemTableRow.jsx';
import RewardsBulkVisibilityButton from '../group-rewards/shared/RewardsBulkVisibilityButton.jsx';
import '../group-rewards/shared/rewardsShared.css';
import '../group-rewards/shared/rewardsTablePreview.css';
import './RewardsShopItemsContent.css';

const LIMITNOVALUE__TEXTLABEL = {
  polish: 'Bez limitu',
  english: ''
};

const COLUMNNUMBER__TEXTLABEL = {
  polish: 'Numer',
  english: 'Number'
};

const COLUMNNAME__TEXTLABEL = {
  polish: 'Nazwa',
  english: 'Name'
};

const COLUMNVISIBILITY__TEXTLABEL = {
  polish: 'Widoczność',
  english: 'Visibility'
};

const COLUMNICON__TEXTLABEL = {
  polish: 'Ikona',
  english: 'Icon'
};

const COLUMNPRICE__TEXTLABEL = {
  polish: 'Cena',
  english: 'Price'
};

const COLUMNSTORYDESCRIPTION__TEXTLABEL = {
  polish: 'Opis fabularny',
  english: 'Story Description'
};

const COLUMNDIDACTICDESCRIPTION__TEXTLABEL = {
  polish: 'Opis dydaktyczny',
  english: 'Didactic Description'
};

const COLUMNCATEGORY__TEXTLABEL = {
  polish: 'Kategoria',
  english: 'Category'
};

const COLUMNSTOCK__TEXTLABEL = {
  polish: 'Stan magazynu',
  english: 'Stock'
};

const COLUMNSTUDENTLIMIT__TEXTLABEL = {
  polish: 'Limit / student',
  english: 'Limit / Student'
};

const ADDBUTTON__TEXTLABEL = {
  polish: 'Dodaj produkt',
  english: 'Add Product'
};

const CATEGORIESBUTTON__TEXTLABEL = {
  polish: 'Kategorie',
  english: 'Categories'
};

const ACCESSBUTTON__TEXTLABEL = {
  polish: 'Dostęp do sklepu',
  english: 'Shop Access'
};

const SEARCHPLACEHOLDER__TEXTLABEL = {
  polish: 'Szukaj produktu…',
  english: 'Search product…'
};

const SEARCHARIALABEL__TEXTLABEL = {
  polish: 'Szukaj produktu',
  english: 'Search product'
};

const LOADINGMESSAGE__TEXTLABEL = {
  polish: 'Ładowanie produktów…',
  english: 'Loading products…'
};

const EMPTYMESSAGE__TEXTLABEL = {
  polish: 'Brak produktów w sklepie. Kliknij "Dodaj produkt", aby utworzyć pierwszy.',
  english: 'No products in the shop. Click "Add Product" to create the first one.'
};

const CATEOGYFILTERLABEL__TEXTLABEL = {
  polish: 'Filtr kategorii produktu',
  english: 'Product category filter'
};

const DELETEPRODUCT__TEXTLABEL = {
  polish: 'Usuń produkt',
  english: 'Delete Product'
};

const EDITPRODUCT__TEXTLABEL = {
  polish: 'Edytuj produkt',
  english: 'Edit Product'
};

const EDITDESCRIPTION__TEXTLABEL = {
  polish: 'Otwórz formularz dodawania produktu.',
  english: 'Open the product add form.'
};

const PAGINATIONARIALABEL__TEXTLABEL = {
  polish: 'Nawigacja stron listy produktów sklepowych',
  english: 'Shop product list page navigation'
};

const TOGGLEALLVISIBLE__TEXTLABEL = {
  polish: 'Wszystkie produkty są teraz widoczne dla studentów.',
  english: 'All products are now visible to students.'
};

const TOGGLEALLHIDDEN__TEXTLABEL = {
  polish: 'Wszystkie produkty są teraz ukryte przed studentami.',
  english: 'All products are now hidden from students.'
};

const DELETESUCCESSMESSAGE__TEXTLABEL = {
  polish: 'Produkt został usunięty.',
  english: 'Product has been deleted.'
};

const DELETEERRORMESSAGE__TEXTLABEL = {
  polish: 'Nie udało się usunąć produktu.',
  english: 'Failed to delete product.'
};

const SCHEDULESUCCESSMESSAGE__TEXTLABEL = {
  polish: 'Zapisano planowane otwarcie sklepu.',
  english: 'Scheduled shop opening saved.'
};

const STATUSERRORMESSAGE__TEXTLABEL = {
  polish: 'Nie udało się zmienić statusu sklepu.',
  english: 'Failed to change shop status.'
};

const TOGGLEALLERRORMESSAGE__TEXTLABEL = {
  polish: 'Nie udało się zmienić widoczności produktów.',
  english: 'Failed to change product visibility.'
};

const SHOPSHOPACCESSTITLE__TEXTLABEL = {
  polish: 'Sklep został otwarty.',
  english: 'Shop has been opened.'
};

const SHOPCLOSEDTITLE__TEXTLABEL = {
  polish: 'Sklep został zamknięty.',
  english: 'Shop has been closed.'
};

const SCHEDULEERRORMESSAGE__TEXTLABEL = {
  polish: 'Nie udało się zapisać harmonogramu otwarcia.',
  english: 'Failed to save the opening schedule.'
};

/**
 * @param {number | null | undefined} value
 * @param {string} language
 * @returns {string}
 */
function formatLimitValue(value, language) {
  if (value === null || value === undefined) {
    return LIMITNOVALUE__TEXTLABEL[language] || '';
  }
  return String(value);
}

/**
 * @param {import('../../../utils/shop/shopItem.types.js').ShopItem} item
 * @param {number} index
 * @param {Map<string, any>} categoriesById
 * @param {string} language
 */
function mapShopItemToRow(item, index, categoriesById, language) {
  const categoryLabels = resolveShopCategoryLabels(item.categories, categoriesById);
  return {
    ...item,
    position: index + 1,
    categoryLabel: categoryLabels.join(', ') || '—',
    stockLabel: formatLimitValue(item.stockQuantity, language),
    studentLimitLabel: formatLimitValue(item.perStudentLimit, language),
  };
}

/**
 * @param {string} language
 * @returns {Array<any>}
 */
function getShopItemColumns(language) {
  return [
    {
      key: 'position',
      label: COLUMNNUMBER__TEXTLABEL[language],
      sort: 'number',
      width: '90px',
      className: 'rewards-table__th--position',
      render: (item) => (
        <span className="rewards-table__position">#{item.position}</span>
      ),
    },
    {
      key: 'name',
      label: COLUMNNAME__TEXTLABEL[language],
      sort: 'text',
      width: '240px',
      render: (item) => (
        <span className="rewards-table__name">{item.name}</span>
      ),
    },
    {
      key: 'visibility',
      label: COLUMNVISIBILITY__TEXTLABEL[language],
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
      label: COLUMNICON__TEXTLABEL[language],
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
      label: COLUMNPRICE__TEXTLABEL[language],
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
      label: COLUMNSTORYDESCRIPTION__TEXTLABEL[language],
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
      label: COLUMNDIDACTICDESCRIPTION__TEXTLABEL[language],
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
      label: COLUMNCATEGORY__TEXTLABEL[language],
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
      label: COLUMNSTOCK__TEXTLABEL[language],
      sort: 'text',
      width: '130px',
      hiddenBelow: 768,
      render: (item) => (
        <span className="rewards-table__cell-text">{item.stockLabel}</span>
      ),
    },
    {
      key: 'studentLimitLabel',
      label: COLUMNSTUDENTLIMIT__TEXTLABEL[language],
      sort: 'text',
      width: '130px',
      hiddenBelow: 768,
      render: (item) => (
        <span className="rewards-table__cell-text">{item.studentLimitLabel}</span>
      ),
    },
  ];
}

export default function RewardsShopItemsContent() {
  const [LANGUAGE] = useState(READLANGUAGECOOKIE);
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
    toggleAllPublished,
  } = useGroupShopItems(groupId);
  const { isShopOpen, setShopOpenStatus } = useGroupShopOpen(groupId);
  const { shopOpensAt, scheduleShopOpen, refetch: refetchShopSchedule } = useGroupShopSchedule(groupId);
  const {
    categories,
    categoriesById,
    refetch: refetchCategories,
  } = useGroupItemCategories(groupId);
  const { showExtraLifeProduct } = useGroupShopLivesSystem(groupId, { isStudentView: false });

  const [searchQuery, setSearchQuery] = useState('');
  const [activeModal, setActiveModal] = useState(null);
  const [shopAccessOpen, setShopAccessOpen] = useState(false);
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState(SHOP_SORT.nameAsc);
  const [bulkVisibilityLoading, setBulkVisibilityLoading] = useState(false);

  const categoryFilters = useMemo(
    () => buildShopCategoryFilters(categories, LANGUAGE),
    [categories, LANGUAGE],
  );

  const catalogItems = useMemo(
    () => filterCatalogShopItems(items, showExtraLifeProduct)
      .map((item, index) => mapShopItemToRow(item, index, categoriesById, LANGUAGE)),
    [items, categoriesById, showExtraLifeProduct, LANGUAGE],
  );

  const columns = useMemo(
    () => getShopItemColumns(LANGUAGE),
    [LANGUAGE],
  );

  const sortOptions = useMemo(
    () => getShopSortOptions(LANGUAGE),
    [LANGUAGE],
  );

  const bulkVisibilityItems = useMemo(
    () => filterCatalogShopItems(items, showExtraLifeProduct),
    [items, showExtraLifeProduct],
  );

  const closeModal = useCallback(() => {
    setActiveModal(null);
  }, []);

  const handleItemSaved = useCallback(async () => {
    closeModal();
    await refetch();
    await refetchCategories();
  }, [closeModal, refetch, refetchCategories]);

  const handleSaveShopAccess = useCallback(async ({ shopOpen, shopOpensAtIso }) => {
    const shopStatusChanged = shopOpen !== isShopOpen;
    const currentScheduleIso = shopOpensAt ?? null;
    const shouldClearSchedule = shopOpen && currentScheduleIso != null;
    const scheduleChanged = !shopOpen && (
      shopOpensAtIso !== currentScheduleIso
      || (shopOpensAtIso == null && currentScheduleIso != null)
    );

    if (shopStatusChanged) {
      const statusResult = await setShopOpenStatus(shopOpen);
      if (!statusResult?.ok) {
        showError(statusResult?.error ?? STATUSERRORMESSAGE__TEXTLABEL[LANGUAGE]);
        return { ok: false };
      }
      showSuccess(shopOpen ? SHOPSHOPACCESSTITLE__TEXTLABEL[LANGUAGE] : SHOPCLOSEDTITLE__TEXTLABEL[LANGUAGE]);
    }

    if (shouldClearSchedule || scheduleChanged) {
      const scheduleResult = await scheduleShopOpen(shouldClearSchedule ? null : shopOpensAtIso);
      if (!scheduleResult.ok) {
        showError(scheduleResult.error ?? SCHEDULEERRORMESSAGE__TEXTLABEL[LANGUAGE]);
        return { ok: false };
      }
      if (!shouldClearSchedule && shopOpensAtIso) {
        showSuccess(SCHEDULESUCCESSMESSAGE__TEXTLABEL[LANGUAGE]);
      }
      await refetchShopSchedule();
    }

    return { ok: true };
  }, [
    isShopOpen,
    refetchShopSchedule,
    scheduleShopOpen,
    setShopOpenStatus,
    shopOpensAt,
    showError,
    showSuccess,
    LANGUAGE,
  ]);

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
      showSuccess(DELETESUCCESSMESSAGE__TEXTLABEL[LANGUAGE]);
      closeModal();
      return;
    }

    showError(result.error ?? DELETEERRORMESSAGE__TEXTLABEL[LANGUAGE]);
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

  const handleToggleAllVisibility = useCallback(async () => {
    setBulkVisibilityLoading(true);
    const result = await toggleAllPublished(bulkVisibilityItems);
    setBulkVisibilityLoading(false);

    if (result.ok) {
      showSuccess(
        result.targetPublished
          ? TOGGLEALLVISIBLE__TEXTLABEL[LANGUAGE]
          : TOGGLEALLHIDDEN__TEXTLABEL[LANGUAGE],
      );
      return;
    }

    showError(result.error || TOGGLEALLERRORMESSAGE__TEXTLABEL[LANGUAGE]);
  }, [bulkVisibilityItems, showError, showSuccess, toggleAllPublished, LANGUAGE]);

  const rowActions = useMemo(() => ({
    onDelete: openDeleteModal,
    canDelete: (item) => !item.isExtraLife,
    deleteLabel: DELETEPRODUCT__TEXTLABEL[LANGUAGE],
    deleteAriaLabel: (item) => `${DELETEPRODUCT__TEXTLABEL[LANGUAGE]} ${item.name}`,
    menuItems: [
      {
        id: 'edit',
        label: EDITPRODUCT__TEXTLABEL[LANGUAGE],
        description: EDITDESCRIPTION__TEXTLABEL[LANGUAGE],
        onSelect: handleEdit,
      },
    ],
  }), [openDeleteModal, handleEdit, LANGUAGE]);

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
              {ADDBUTTON__TEXTLABEL[LANGUAGE]}
            </Button>
            <RewardsBulkVisibilityButton
              items={bulkVisibilityItems}
              isLoading={bulkVisibilityLoading}
              disabled={isLoading}
              onToggleAll={handleToggleAllVisibility}
            />
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
                {CATEGORIESBUTTON__TEXTLABEL[LANGUAGE]}
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="md"
                className="rewards-shop-items__access-btn"
                onClick={() => setShopAccessOpen(true)}
              >
                {ACCESSBUTTON__TEXTLABEL[LANGUAGE]}
              </Button>
              <SearchBar
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder={SEARCHPLACEHOLDER__TEXTLABEL[LANGUAGE]}
                name="shop-item-catalog-search"
                className="rewards-page__search rewards-shop-items__search"
                aria-label={SEARCHARIALABEL__TEXTLABEL[LANGUAGE]}
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
        <p className="rewards-page__loading page-unavailable__notice">{LOADINGMESSAGE__TEXTLABEL[LANGUAGE]}</p>
      ) : catalogItems.length === 0 ? (
        <p className="rewards-page__empty page-unavailable__notice">
          {EMPTYMESSAGE__TEXTLABEL[LANGUAGE]}
        </p>
      ) : isTileView ? (
        <>
          {filtersExpanded ? (
            <CatalogFiltersPanel className="rewards-page__filters">
              <CatalogFilterGroup
                ariaLabel={CATEOGYFILTERLABEL__TEXTLABEL[LANGUAGE]}
                filters={categoryFilters}
                activeId={categoryFilter}
                onSelect={setCategoryFilter}
              />
              <CatalogSortSelect
                value={sortBy}
                onChange={setSortBy}
                options={sortOptions}
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
          columns={columns}
          data={catalogItems}
          rowKey="id"
          tiebreakerKey="position"
          itemsPerPage={10}
          paginationAriaLabel={PAGINATIONARIALABEL__TEXTLABEL[LANGUAGE]}
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
        onSave={handleSaveShopAccess}
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
