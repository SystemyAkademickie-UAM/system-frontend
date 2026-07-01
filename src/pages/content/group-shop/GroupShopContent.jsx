import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
import { useAppRole } from '../../../context/AppRoleContext.jsx';
import { useGroupPreview } from '../../../hooks/groups/useGroupPreview.js';
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
import { useGroupCurrency } from '../../../context/GroupCurrencyContext.jsx';
import { groupProfileEqPath } from '../../../routes/pathRegistry.js';
import { setShopPurchaseSummary } from '../group-profile-eq/ProfileEqContentWindow.jsx';
import ShopBuyAllModal from './modals/ShopBuyAllModal.jsx';
import ShopBuyModal from './modals/ShopBuyModal.jsx';
import ShopDeleteModal from './modals/ShopDeleteModal.jsx';
import ShopItemFormModal from './modals/ShopItemFormModal.jsx';
import ShopCategoriesModal from './modals/ShopCategoriesModal.jsx';
import '../../../components/page/PageUnavailable.css';
import '../shared/groupSectionPage.css';
import '../group-members/MembersHomeContent.css';
import './GroupShopContent.css';
import '../group-main/shared/groupMainSubpageHeader.css';

const ITEMS_PER_PAGE = 10;

function buildPurchaseSummaryItem(item) {
  return {
    id: item.id,
    name: item.name,
    storyDescription: item.storyDescription,
    didacticDescription: item.didacticDescription,
    imageRef: item.imageRef,
    imageUrl: item.imageUrl,
    categories: item.categories,
    categoryId: item.categoryId,
    priceAmount: Number(item.priceAmount ?? 0),
    effectivePrice: getShopItemEffectivePrice(item),
  };
}

export default function GroupShopContent() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const { role } = useAppRole();
  const { isOwner } = useGroupPreview(groupId);
  const { showSuccess, showError, showToast } = useToast();
  const { symbol: currencyEmoji } = useGroupCurrency();
  const isStudentView = role === APP_ROLE.STUDENT;
  const isLecturerView = role !== APP_ROLE.STUDENT;
  const canManageShop = isLecturerView && isOwner;

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
  const { isShopOpen, toggleShopOpen } = useGroupShopOpen(groupId);
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

  const shopInteractionDisabled = !isShopOpen || (isStudentView && isGameOver);
  const purchaseDisabled = shopInteractionDisabled || isLecturerView;

  const redirectAfterPurchase = useCallback((purchasedItems) => {
    if (!isStudentView || !groupId || purchasedItems.length === 0) {
      return false;
    }

    setShopPurchaseSummary(groupId, {
      items: purchasedItems,
      currencyEmoji,
    });
    navigate(groupProfileEqPath(groupId));
    return true;
  }, [currencyEmoji, groupId, isStudentView, navigate]);

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

    if (activeModal.item.isExtraLife) {
      await refetchLives();
    }
    closeModal();

    if (redirectAfterPurchase([buildPurchaseSummaryItem(activeModal.item)])) {
      return;
    }

    if (activeModal.item.isExtraLife) {
      await refetchLives();
      showSuccess('Dodatkowe życie zakupione. Sklep został odblokowany.');
    } else {
      showSuccess('Produkt został zakupiony.');
    }
  }, [activeModal, buyItem, closeModal, redirectAfterPurchase, refetchLives, showError, showSuccess]);

  const handleBuyAllConfirm = useCallback(async () => {
    if (cartItems.length === 0) {
      return;
    }

    setIsSubmitting(true);
    const purchasedItems = [];

    for (const item of cartItems) {
      const result = await buyItem(item.id);
      if (!result.ok) {
        setIsSubmitting(false);
        showError(result.error ?? `Nie udało się kupić: ${item.name}`);
        return;
      }
      purchasedItems.push(buildPurchaseSummaryItem(item));
    }
    setIsSubmitting(false);
    clearCart();
    closeModal();

    if (redirectAfterPurchase(purchasedItems)) {
      return;
    }

    showSuccess('Zakup produktów z koszyka został potwierdzony.');
  }, [buyItem, cartItems, clearCart, closeModal, redirectAfterPurchase, showError, showSuccess]);

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
        {canManageShop ? (
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
        ) : null}

        <div className="group-shop__cart-actions">
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
