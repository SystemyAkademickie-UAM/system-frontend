import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Button,
  CatalogFilterGroup,
  CatalogFiltersPanel,
  CatalogFiltersToggle,
  CatalogSortSelect,
  Divider,
  Pagination,
  ProductCard,
  SearchBar,
  ShopCartPanel,
  ShopClosedOverlay,
  ShopToggleButton,
  useToast,
} from '../../../components/ui/index.js';
import SectionPageLayout from '../../../components/layout/sectionPage/SectionPageLayout.jsx';
import { RoleVisibility } from '../../../components/guards/index.js';
import { useAppRole } from '../../../context/AppRoleContext.jsx';
import { APP_ROLE } from '../../../navigation/shellTemplates.config.js';

import {
  buildShopCategoryFilters,
  resolveShopCategoryDetails,
} from '../../../utils/shop/shopCategories.js';
import { getShopItemEffectivePrice } from '../../../utils/shop/shopPricing.js';
import {
  filterCatalogShopItems,
  findExtraLifeShopItem,
  sortShopItemsWithExtraLifeFirst,
} from '../../../utils/shop/extraLifeItem.js';
import {
  filterShopItems,
  paginateShopItems,
  SHOP_SORT,
  SHOP_SORT_OPTIONS,
  sortShopItems,
} from '../../../utils/shop/shopModel.js';
import { useGroupItemCategories } from '../../../hooks/shop/useGroupItemCategories.js';
import { useGroupShopLivesSystem } from '../../../hooks/shop/useGroupShopLivesSystem.js';
import {
  useGroupShopCart,
  useGroupShopItems,
  useGroupShopOpen,
} from '../../../hooks/shop/useGroupShop.js';
import ShopBuyAllModal from './modals/ShopBuyAllModal.jsx';
import ShopBuyModal from './modals/ShopBuyModal.jsx';
import ShopDeleteModal from './modals/ShopDeleteModal.jsx';
import ShopItemFormModal from './modals/ShopItemFormModal.jsx';
import ShopCategoriesModal from './modals/ShopCategoriesModal.jsx';
import {
  invalidateGroupInventory,
  invalidateStudentProfile,
} from '../../../services/studentProfileEvents.js';
import '../../../components/page/PageUnavailable.css';
import '../shared/groupSectionPage.css';
import '../group-members/MembersHomeContent.css';
import './GroupShopContent.css';
import '../group-main/shared/groupMainSubpageHeader.css';

const ITEMS_PER_PAGE = 10;

export default function GroupShopContent() {
  const { groupId } = useParams();
  const { role } = useAppRole();
  const { showSuccess, showError, showToast } = useToast();
  const isStudentView = role === APP_ROLE.STUDENT;
  const isLecturerView = role !== APP_ROLE.STUDENT;

  const {
    items,
    isLoading,
    error,
    refetch,
    deleteItem,
    buyItem,
  } = useGroupShopItems(groupId);

  const catalogItems = useMemo(() => {
    const sourceItems = isStudentView
      ? filterCatalogShopItems(items, true).filter((item) => item.isPublished !== false)
      : sortShopItemsWithExtraLifeFirst(items);

    return sourceItems;
  }, [items, isStudentView]);

  const extraLifeProduct = useMemo(
    () => findExtraLifeShopItem(items),
    [items],
  );

  const {
    cartItems,
    cartCount,
    cartTotal,
    cartItemIds,
    addToCart,
    removeFromCart,
    clearCart,
  } = useGroupShopCart(groupId, catalogItems);
  const { isShopOpen, toggleShopOpen, refetchShopOpen } = useGroupShopOpen(groupId);
  const {
    isGameOver,
    showExtraLifeProduct,
    refetch: refetchLives,
  } = useGroupShopLivesSystem(groupId, { isStudentView });

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState(SHOP_SORT.nameAsc);
  const [page, setPage] = useState(1);
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRefreshingShop, setIsRefreshingShop] = useState(false);

  const {
    categories,
    categoriesById,
    refetch: refetchCategories,
  } = useGroupItemCategories(groupId);

  const categoryFilters = useMemo(
    () => buildShopCategoryFilters(categories),
    [categories],
  );

  const closeModal = useCallback(() => setActiveModal(null), []);

  const handleItemSaved = useCallback(async () => {
    closeModal();
    await refetch();
    await refetchCategories();
  }, [closeModal, refetch, refetchCategories]);

  const visibleItems = useMemo(() => {
    const filtered = filterShopItems(catalogItems, { searchQuery, categoryFilter });
    return sortShopItems(filtered, sortBy);
  }, [catalogItems, searchQuery, categoryFilter, sortBy]);

  const pagination = useMemo(
    () => paginateShopItems(visibleItems, page, ITEMS_PER_PAGE),
    [visibleItems, page],
  );

  useEffect(() => {
    setPage(1);
  }, [searchQuery, categoryFilter, sortBy]);

  useEffect(() => {
    if (page > pagination.totalPages) {
      setPage(pagination.totalPages);
    }
  }, [page, pagination.totalPages]);

  const handleRefreshShop = useCallback(async () => {
    if (isRefreshingShop) {
      return;
    }

    setIsRefreshingShop(true);

    const [itemsResult, openResult] = await Promise.all([
      refetch({ silent: true }),
      refetchShopOpen({ silent: true }),
    ]);

    setIsRefreshingShop(false);

    if (itemsResult.ok && openResult.ok) {
      showSuccess('Sklep został odświeżony.');
      return;
    }

    showError(
      itemsResult.error
      ?? openResult.error
      ?? 'Nie udało się odświeżyć sklepu.',
    );
  }, [isRefreshingShop, refetch, refetchShopOpen, showError, showSuccess]);

  const shopInteractionDisabled = !isShopOpen || (isStudentView && isGameOver);
  const purchaseDisabled = shopInteractionDisabled || isLecturerView;

  const refreshAfterPurchase = useCallback(async () => {
    await refetch();
    if (isStudentView && groupId) {
      invalidateStudentProfile(groupId);
      invalidateGroupInventory(groupId);
    }
  }, [refetch, isStudentView, groupId]);

  const handleBuyConfirm = useCallback(async () => {
    if (!activeModal?.item) {
      return;
    }

    setIsSubmitting(true);
    const result = await buyItem(activeModal.item.id);
    setIsSubmitting(false);

    if (!result.ok) {
      showError(result.error ?? 'Nie udało się kupić produktu.');
      return;
    }

    await refreshAfterPurchase();
    if (activeModal.item.isExtraLife) {
      await refetchLives();
      showSuccess('Dodatkowe życie zakupione. Sklep został odblokowany.');
    } else {
      showSuccess('Produkt został zakupiony.');
    }
    closeModal();
  }, [activeModal, buyItem, closeModal, refetchLives, refreshAfterPurchase, showError, showSuccess]);

  const handleBuyAllConfirm = useCallback(async () => {
    if (cartItems.length === 0) {
      return;
    }

    setIsSubmitting(true);
    for (const item of cartItems) {
      const result = await buyItem(item.id);
      if (!result.ok) {
        setIsSubmitting(false);
        showError(result.error ?? `Nie udało się kupić: ${item.name}`);
        await refreshAfterPurchase();
        return;
      }
    }
    setIsSubmitting(false);
    clearCart();
    await refreshAfterPurchase();
    showSuccess('Zakup produktów z koszyka został potwierdzony.');
    closeModal();
  }, [buyItem, cartItems, clearCart, closeModal, refreshAfterPurchase, showError, showSuccess]);

  const handleDeleteConfirm = useCallback(async () => {
    if (!activeModal?.item) {
      return;
    }

    setIsSubmitting(true);
    const result = await deleteItem(activeModal.item.id);
    setIsSubmitting(false);

    if (!result.ok) {
      showError(result.error ?? 'Nie udało się usunąć produktu.');
      return;
    }

    showSuccess('Produkt został usunięty ze sklepu.');
    closeModal();
  }, [activeModal, closeModal, deleteItem, showError, showSuccess]);

  const handleToggleShopOpen = useCallback(async () => {
    const result = await toggleShopOpen();
    if (!result.ok) {
      showError(result.error ?? 'Nie udało się zmienić statusu sklepu.');
      return;
    }
    showSuccess(isShopOpen ? 'Sklep został zamknięty.' : 'Sklep został otwarty.');
  }, [isShopOpen, showError, showSuccess, toggleShopOpen]);

  const modalItem = activeModal?.type === 'delete'
    || activeModal?.type === 'buy'
    ? activeModal.item
    : null;

  const toolbar = (
    <>
      <div className="maq-section-page__toolbar-start">
        <SearchBar
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Szukaj produktu…"
          name="shop-search"
          className="group-shop__search"
          aria-label="Szukaj produktu po nazwie lub opisie"
        />
      </div>
      <div className="maq-section-page__toolbar-end group-shop-page__toolbar-actions">
        <RoleVisibility allowedRoles={[APP_ROLE.LECTURER, APP_ROLE.ADMIN, APP_ROLE.SUPERADMIN]}>
          <div className="group-shop__lecturer-actions">
            {groupId ? (
              <>
                <Button
                  type="button"
                  variant="secondary"
                  size="md"
                  onClick={() => setActiveModal({ type: 'categories' })}
                >
                  Kategorie
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="md"
                  onClick={() => setActiveModal({ type: 'itemForm', itemId: null })}
                >
                  Dodaj produkt
                </Button>
              </>
            ) : null}
            <ShopToggleButton isShopOpen={isShopOpen} onToggle={handleToggleShopOpen} />
          </div>
        </RoleVisibility>

        <div className="group-shop__cart-actions">
          {isStudentView ? (
            <Button
              type="button"
              variant="secondary"
              size="md"
              className="group-shop__refresh-btn"
              onClick={handleRefreshShop}
              disabled={isRefreshingShop}
            >
              Odśwież sklep
            </Button>
          ) : null}

          <ShopCartPanel
            cartCount={cartCount}
            cartItems={cartItems.map((item) => ({
              id: item.id,
              name: item.name,
              priceAmount: getShopItemEffectivePrice(item),
              imageUrl: item.imageUrl,
            }))}
            cartTotal={cartTotal}
            disabled={purchaseDisabled}
            onBuyAll={() => setActiveModal({ type: 'buyAll' })}
            onRemoveFromCart={removeFromCart}
            className="group-shop__cart"
          />
        </div>

        <CatalogFiltersToggle
          expanded={filtersExpanded}
          onToggle={() => setFiltersExpanded((expanded) => !expanded)}
        />
      </div>
    </>
  );

  const shopBody = (
    <>
      {filtersExpanded ? (
        <CatalogFiltersPanel>
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

      {error ? (
        <p className="group-shop__error" role="alert">{error}</p>
      ) : null}

      <div
        className={[
          'group-shop__catalog',
          shopInteractionDisabled ? 'group-shop__catalog--blocked' : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <ShopClosedOverlay
          isClosed={!isShopOpen}
          isGameOver={isShopOpen && isGameOver}
          extraLifeProduct={showExtraLifeProduct ? extraLifeProduct : null}
          onExtraLifeBuy={() => {
            if (extraLifeProduct) {
              setActiveModal({ type: 'buy', item: extraLifeProduct });
            }
          }}
        />

        <div className="group-shop__catalog-surface">
          {isLoading ? (
            <p className="group-shop__empty page-unavailable__notice" role="status">Ładowanie produktów sklepu…</p>
          ) : catalogItems.length === 0 ? (
            <p className="group-shop__empty page-unavailable__notice" role="status">
              {isStudentView
                ? 'Sklep jest pusty — prowadzący nie dodał jeszcze żadnych produktów.'
                : 'W sklepie nie ma jeszcze żadnych produktów.'}
              {isLecturerView ? (
                <>
                  {' '}
                  <button
                    type="button"
                    className="group-shop__empty-link"
                    onClick={() => setActiveModal({ type: 'itemForm', itemId: null })}
                  >
                    Dodaj pierwszy produkt
                  </button>
                </>
              ) : null}
            </p>
          ) : visibleItems.length === 0 ? (
            <p className="group-shop__empty page-unavailable__notice" role="status">
              Brak produktów spełniających wybrane filtry.
            </p>
          ) : (
            <>
              <div className="group-shop__grid">
                {pagination.pageItems.map((item) => (
                  <ProductCard
                    key={item.id}
                    itemId={item.id}
                    name={item.name}
                    storyDescription={item.storyDescription}
                    didacticDescription={item.didacticDescription}
                    priceAmount={item.priceAmount}
                    salePriceAmount={item.salePriceAmount}
                    rankDiscountedPrice={item.rankDiscountedPrice}
                    imageRef={item.imageRef}
                    categoryDetails={resolveShopCategoryDetails(item.categories, categoriesById)}
                    showLecturerActions={isLecturerView}
                    disabled={purchaseDisabled || (item.stockQuantity !== null && item.stockQuantity <= 0) || item.isLocked}
                    isRankLocked={!isLecturerView && item.isLocked}
                    isInCart={cartItemIds.includes(item.id)}
                    onBuy={() => setActiveModal({ type: 'buy', item })}
                    onAddToCart={() => addToCart(item.id)}
                    onEdit={() => setActiveModal({ type: 'itemForm', itemId: item.id })}
                    onDelete={item.isExtraLife ? undefined : () => setActiveModal({ type: 'delete', item })}
                    className={[
                      'group-shop__card',
                      item.isExtraLife ? 'maq-product-card--extra-life' : '',
                    ].filter(Boolean).join(' ')}
                    hideAddToCart={item.isExtraLife}
                  />
                ))}
              </div>

              {visibleItems.length > ITEMS_PER_PAGE ? (
                <Pagination
                  totalPages={pagination.totalPages}
                  page={pagination.page}
                  onPageChange={setPage}
                  ariaLabel="Nawigacja stron listy produktów"
                  className="group-shop__pagination"
                />
              ) : null}
            </>
          )}
        </div>
      </div>

      <ShopBuyModal
        isOpen={activeModal?.type === 'buy'}
        item={modalItem}
        categoriesById={categoriesById}
        onClose={closeModal}
        onConfirm={handleBuyConfirm}
      />

      <ShopBuyAllModal
        isOpen={activeModal?.type === 'buyAll'}
        cartItems={cartItems}
        cartTotal={cartTotal}
        onClose={closeModal}
        onConfirm={handleBuyAllConfirm}
      />

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

      <ShopCategoriesModal
        isOpen={activeModal?.type === 'categories'}
        groupId={groupId}
        categories={categories}
        onClose={closeModal}
        onChanged={refetchCategories}
      />
    </>
  );

  if (isStudentView) {
    return (
      <section className="group-shop-page group-shop-page--student" aria-label="Sklep grupy">
        <div className="group-shop-page__title-row">
          <header className="group-shop-page__page-header">
            <p className="group-main-subpage__eyebrow">Targowisko</p>
            <h1 className="group-main-subpage__title">Sklep</h1>
          </header>
        </div>

        <Divider className="group-main-subpage__divider" />

        <div className="group-shop-page__student-toolbar">
          {toolbar}
        </div>

        {shopBody}
      </section>
    );
  }

  return (
    <SectionPageLayout
      className="page-unavailable group-shop-page"
      title="Sklep"
      toolbar={toolbar}
    >
      {shopBody}
    </SectionPageLayout>
  );
}
