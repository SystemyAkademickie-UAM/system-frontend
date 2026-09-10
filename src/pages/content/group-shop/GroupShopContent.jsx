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
  isExtraLifePurchaseAtLimit,
  isShopItemPurchaseDisabled,
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
import { READLANGUAGECOOKIE } from '../../../utils/LANGUAGECOOKIE.js';

const ITEMS_PER_PAGE = 10;

const SHOP_TITLE_STUDENT__TEXTLABEL = {
  polish: 'Sklep',
  english: 'Shop'
};

const SHOP_EYEBROW__TEXTLABEL = {
  polish: 'Targowisko',
  english: 'Marketplace'
};

const SHOP_SECTION_LABEL__TEXTLABEL = {
  polish: 'Sklep grupy',
  english: 'Group Shop'
};

const SEARCH_PLACEHOLDER__TEXTLABEL = {
  polish: 'Szukaj produktu…',
  english: 'Search product…'
};

const SEARCH_ARIA_LABEL__TEXTLABEL = {
  polish: 'Szukaj produktu po nazwie lub opisie',
  english: 'Search product by name or description'
};

const REFRESH_BUTTON__TEXTLABEL = {
  polish: 'Odśwież sklep',
  english: 'Refresh Shop'
};

const CATEGORIES_BUTTON__TEXTLABEL = {
  polish: 'Kategorie',
  english: 'Categories'
};

const ADD_PRODUCT_BUTTON__TEXTLABEL = {
  polish: 'Dodaj produkt',
  english: 'Add Product'
};

const LOADING_TEXT__TEXTLABEL = {
  polish: 'Ładowanie produktów sklepu…',
  english: 'Loading shop products…'
};

const EMPTY_SHOP_STUDENT__TEXTLABEL = {
  polish: 'Sklep jest pusty — prowadzący nie dodał jeszcze żadnych produktów.',
  english: 'The shop is empty — the lecturer has not added any products yet.'
};

const EMPTY_SHOP_LECTURER__TEXTLABEL = {
  polish: 'W sklepie nie ma jeszcze żadnych produktów.',
  english: 'There are no products in the shop yet.'
};

const ADD_FIRST_PRODUCT__TEXTLABEL = {
  polish: 'Dodaj pierwszy produkt',
  english: 'Add first product'
};

const NO_FILTER_RESULTS__TEXTLABEL = {
  polish: 'Brak produktów spełniających wybrane filtry.',
  english: 'No products match the selected filters.'
};

const PAGINATION_ARIA_LABEL__TEXTLABEL = {
  polish: 'Nawigacja stron listy produktów',
  english: 'Product list page navigation'
};

const SECTION_TITLE__TEXTLABEL = {
  polish: 'Sklep',
  english: 'Shop'
};

const PRODUCT_PURCHASED_SINGLE__TEXTLABEL = {
  polish: 'Produkt „{name}" został zakupiony.',
  english: 'Product "{name}" has been purchased.'
};

const PRODUCT_PURCHASED_MULTI__TEXTLABEL = {
  polish: 'Zakupiono {count} przedmioty.',
  english: '{count} items have been purchased.'
};

const CART_PURCHASE_CONFIRMED__TEXTLABEL = {
  polish: 'Zakup produktów z koszyka został potwierdzony.',
  english: 'Cart purchase has been confirmed.'
};

const PRODUCT_DELETE_SUCCESS__TEXTLABEL = {
  polish: 'Produkt został usunięty ze sklepu.',
  english: 'Product has been deleted from the shop.'
};

const SHOP_CLOSE_SUCCESS__TEXTLABEL = {
  polish: 'Sklep został zamknięty.',
  english: 'The shop has been closed.'
};

const SHOP_OPEN_SUCCESS__TEXTLABEL = {
  polish: 'Sklep został otwarty.',
  english: 'The shop has been opened.'
};

const EXTRA_LIFE_PURCHASED__TEXTLABEL = {
  polish: 'Dodatkowe życie zakupione.',
  english: 'Extra life purchased.'
};

const EXTRA_LIFE_PURCHASED_UNLOCKED__TEXTLABEL = {
  polish: 'Dodatkowe życie zakupione. Sklep został odblokowany.',
  english: 'Extra life purchased. The shop has been unlocked.'
};

const BUY_ERROR__TEXTLABEL = {
  polish: 'Nie udało się kupić produktu.',
  english: 'Failed to buy product.'
};

const DELETE_ERROR__TEXTLABEL = {
  polish: 'Nie udało się usunąć produktu.',
  english: 'Failed to delete product.'
};

const SHOP_REFRESH_SUCCESS__TEXTLABEL = {
  polish: 'Sklep został odświeżony.',
  english: 'The shop has been refreshed.'
};

const SHOP_REFRESH_ERROR__TEXTLABEL = {
  polish: 'Nie udało się odświeżyć sklepu.',
  english: 'Failed to refresh the shop.'
};

const BUY_ALL_ERROR_TEMPLATE__TEXTLABEL = {
  polish: 'Nie udało się kupić: {name}',
  english: 'Failed to buy: {name}'
};

const CATEGORY_SAVE_ERROR__TEXTLABEL = {
  polish: 'Nie udało się zapisać kategorii.',
  english: 'Failed to save category.'
};

const CATEGORY_DELETE_ERROR__TEXTLABEL = {
  polish: 'Nie udało się usunąć kategorii.',
  english: 'Failed to delete category.'
};

const CATEGORY_CREATE_SUCCESS__TEXTLABEL = {
  polish: 'Kategoria została utworzona.',
  english: 'Category has been created.'
};

const CATEGORY_UPDATE_SUCCESS__TEXTLABEL = {
  polish: 'Kategoria została zaktualizowana.',
  english: 'Category has been updated.'
};

const CATEGORY_DELETE_SUCCESS__TEXTLABEL = {
  polish: 'Kategoria została usunięta.',
  english: 'Category has been deleted.'
};

const ACCESS_CHANGE_ERROR__TEXTLABEL = {
  polish: 'Nie udało się zmienić statusu sklepu.',
  english: 'Failed to change shop status.'
};

const FILTER_CATEGORY_LABEL__TEXTLABEL = {
  polish: 'Filtr kategorii produktu',
  english: 'Product category filter'
};

const SHOP_STATUS_ARIA_LABEL__TEXTLABEL = {
  polish: 'Status sklepu',
  english: 'Shop status'
};

const SHOP_SCHEDULE_ARIA_LABEL__TEXTLABEL = {
  polish: 'Harmonogram otwarcia sklepu',
  english: 'Shop opening schedule'
};

const SCHEDULE_CHECKBOX__TEXTLABEL = {
  polish: 'Ustal datę otwarcia sklepu',
  english: 'Set shop opening date'
};

const OPEN_DATE_LABEL__TEXTLABEL = {
  polish: 'Data otwarcia sklepu',
  english: 'Shop opening date'
};

const OPEN_DATE_ARIA__TEXTLABEL = {
  polish: 'Wybierz datę otwarcia sklepu',
  english: 'Select shop opening date'
};

const OPEN_TIME_ARIA__TEXTLABEL = {
  polish: 'Wybierz godzinę otwarcia sklepu',
  english: 'Select shop opening time'
};

const SAVING_LABEL__TEXTLABEL = {
  polish: 'Zapisywanie…',
  english: 'Saving…'
};

const SAVE_BUTTON__TEXTLABEL = {
  polish: 'Zapisz',
  english: 'Save'
};

const PURCHASE_PRODUCT_ERROR__TEXTLABEL = {
  polish: 'Nie udało się kupić produktu.',
  english: 'Failed to buy product.'
};

const STATUS_LOADING__TEXTLABEL = {
  polish: 'Ładowanie produktów sklepu…',
  english: 'Loading shop products…'
};

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
    isExtraLife: item.isExtraLife === true,
  };
}

function buildStudentPurchaseToastMessage(purchasedItems, LANGUAGE) {
  const inventoryItems = purchasedItems.filter((item) => !item.isExtraLife);
  if (inventoryItems.length === 0) {
    return null;
  }
  if (inventoryItems.length === 1) {
    return PRODUCT_PURCHASED_SINGLE__TEXTLABEL[LANGUAGE]
      .replace('{name}', inventoryItems[0].name);
  }
  return PRODUCT_PURCHASED_MULTI__TEXTLABEL[LANGUAGE]
    .replace('{count}', inventoryItems.length);
}

export default function GroupShopContent() {
  const [LANGUAGE] = useState(READLANGUAGECOOKIE);
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

  const {
    isGameOver,
    showExtraLifeProduct,
    livesMax,
    studentLives,
    refetch: refetchLives,
  } = useGroupShopLivesSystem(groupId, { isStudentView });

  const catalogItems = useMemo(() => {
    if (isStudentView) {
      const publishedItems = items.filter((item) => item.isPublished !== false);
      const sourceItems = filterCatalogShopItems(publishedItems, showExtraLifeProduct);
      return sortShopItemsWithExtraLifeFirst(sourceItems);
    }

    return sortShopItemsWithExtraLifeFirst(items);
  }, [items, isStudentView, showExtraLifeProduct]);

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
    const sorted = sortShopItems(filtered, sortBy);
    return sortShopItemsWithExtraLifeFirst(sorted);
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
      showSuccess(SHOP_REFRESH_SUCCESS__TEXTLABEL[LANGUAGE]);
      return;
    }

    showError(
      itemsResult.error
      ?? openResult.error
      ?? SHOP_REFRESH_ERROR__TEXTLABEL[LANGUAGE],
    );
  }, [isRefreshingShop, refetch, refetchShopOpen, showError, showSuccess]);

  const isExtraLifeAtLimit = useMemo(
    () => isExtraLifePurchaseAtLimit(studentLives, livesMax),
    [studentLives, livesMax],
  );

  const shopInteractionDisabled = !isShopOpen || (isStudentView && isGameOver);
  const purchaseOptions = useMemo(() => ({
    isLecturerView,
    isShopOpen,
    isGameOver,
    isExtraLifeAtLimit,
  }), [isExtraLifeAtLimit, isGameOver, isLecturerView, isShopOpen]);

  const redirectAfterPurchase = useCallback((purchasedItems) => {
    if (!isStudentView || !groupId || purchasedItems.length === 0) {
      return false;
    }

    const inventoryItems = purchasedItems.filter((item) => !item.isExtraLife);
    if (inventoryItems.length === 0) {
      return false;
    }

    const toastMessage = buildStudentPurchaseToastMessage(purchasedItems, LANGUAGE);
    if (toastMessage) {
      showSuccess(toastMessage);
    }

    setShopPurchaseSummary(groupId, {
      items: inventoryItems,
      currencyEmoji,
    });
    navigate(groupProfileEqPath(groupId));
    return true;
  }, [currencyEmoji, groupId, isStudentView, navigate, showSuccess]);

  const handleBuyConfirm = useCallback(async () => {
    if (!activeModal?.item) {
      return;
    }

    setIsSubmitting(true);
    const result = await buyItem(activeModal.item.id);
    setIsSubmitting(false);

    if (!result.ok) {
      showError(result.error ?? BUY_ERROR__TEXTLABEL[LANGUAGE]);
      return;
    }

    const wasGameOver = activeModal.item.isExtraLife && isGameOver;

    if (activeModal.item.isExtraLife) {
      await refetchLives();
    }
    closeModal();

    if (redirectAfterPurchase([buildPurchaseSummaryItem(activeModal.item)])) {
      return;
    }

    if (activeModal.item.isExtraLife) {
      showSuccess(
        wasGameOver
          ? EXTRA_LIFE_PURCHASED_UNLOCKED__TEXTLABEL[LANGUAGE]
          : EXTRA_LIFE_PURCHASED__TEXTLABEL[LANGUAGE],
      );
    } else {
      showSuccess(PRODUCT_PURCHASED_SINGLE__TEXTLABEL[LANGUAGE]
        .replace('{name}', activeModal.item.name));
    }
  }, [activeModal, buyItem, closeModal, isGameOver, redirectAfterPurchase, refetchLives, showError, showSuccess]);

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
        showError(result.error ?? BUY_ALL_ERROR_TEMPLATE__TEXTLABEL[LANGUAGE]
          .replace('{name}', item.name));
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

    showSuccess(CART_PURCHASE_CONFIRMED__TEXTLABEL[LANGUAGE]);
  }, [buyItem, cartItems, clearCart, closeModal, redirectAfterPurchase, showError, showSuccess]);

  const handleDeleteConfirm = useCallback(async () => {
    if (!activeModal?.item) {
      return;
    }

    setIsSubmitting(true);
    const result = await deleteItem(activeModal.item.id);
    setIsSubmitting(false);

    if (!result.ok) {
      showError(result.error ?? DELETE_ERROR__TEXTLABEL[LANGUAGE]);
      return;
    }

    showSuccess(PRODUCT_DELETE_SUCCESS__TEXTLABEL[LANGUAGE]);
    closeModal();
  }, [activeModal, closeModal, deleteItem, showError, showSuccess]);

  const handleToggleShopOpen = useCallback(async () => {
    const result = await toggleShopOpen();
    if (!result.ok) {
      showError(result.error ?? ACCESS_CHANGE_ERROR__TEXTLABEL[LANGUAGE]);
      return;
    }
    showSuccess(isShopOpen
      ? SHOP_CLOSE_SUCCESS__TEXTLABEL[LANGUAGE]
      : SHOP_OPEN_SUCCESS__TEXTLABEL[LANGUAGE]);
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
          placeholder={SEARCH_PLACEHOLDER__TEXTLABEL[LANGUAGE]}
          name="shop-search"
          className="group-shop__search"
          aria-label={SEARCH_ARIA_LABEL__TEXTLABEL[LANGUAGE]}
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
                  onClick={handleRefreshShop}
                  disabled={isRefreshingShop}
                >
                  {REFRESH_BUTTON__TEXTLABEL[LANGUAGE]}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="md"
                  onClick={() => setActiveModal({ type: 'categories' })}
                >
                  {CATEGORIES_BUTTON__TEXTLABEL[LANGUAGE]}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="md"
                  onClick={() => setActiveModal({ type: 'itemForm', itemId: null })}
                >
                  {ADD_PRODUCT_BUTTON__TEXTLABEL[LANGUAGE]}
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
              imageRef: item.imageRef,
              imageUrl: item.imageUrl,
            }))}
            cartTotal={cartTotal}
            disabled={shopInteractionDisabled || isLecturerView}
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
            ariaLabel={FILTER_CATEGORY_LABEL__TEXTLABEL[LANGUAGE]}
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
          extraLifeDisabled={isExtraLifeAtLimit}
          onExtraLifeBuy={() => {
            if (extraLifeProduct && !isExtraLifeAtLimit) {
              setActiveModal({ type: 'buy', item: extraLifeProduct });
            }
          }}
        />

        <div className="group-shop__catalog-surface">
          {isLoading ? (
            <p className="group-shop__empty page-unavailable__notice" role="status">{STATUS_LOADING__TEXTLABEL[LANGUAGE]}</p>
          ) : catalogItems.length === 0 ? (
            <p className="group-shop__empty page-unavailable__notice" role="status">
              {isStudentView
                ? EMPTY_SHOP_STUDENT__TEXTLABEL[LANGUAGE]
                : EMPTY_SHOP_LECTURER__TEXTLABEL[LANGUAGE]}
              {isLecturerView ? (
                <>
                  {' '}
                  <button
                    type="button"
                    className="group-shop__empty-link"
                    onClick={() => setActiveModal({ type: 'itemForm', itemId: null })}
                  >
                    {ADD_FIRST_PRODUCT__TEXTLABEL[LANGUAGE]}
                  </button>
                </>
              ) : null}
            </p>
          ) : visibleItems.length === 0 ? (
            <p className="group-shop__empty page-unavailable__notice" role="status">
              {NO_FILTER_RESULTS__TEXTLABEL[LANGUAGE]}
            </p>
          ) : (
            <>
              <div className="group-shop__grid">
                {pagination.pageItems.map((item, index) => (
                  <ProductCard
                    key={`${item.id}-${index}`}
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
                    disabled={isShopItemPurchaseDisabled(item, purchaseOptions)}
                    isRankLocked={!isLecturerView && item.isLocked}
                    isInCart={cartItemIds.includes(item.id)}
                    onBuy={() => setActiveModal({ type: 'buy', item })}
                    onAddToCart={() => addToCart(item.id)}
                    onEdit={() => setActiveModal({ type: 'itemForm', itemId: item.id })}
                    onDelete={item.isExtraLife ? undefined : () => setActiveModal({ type: 'delete', item })}
                    isExtraLife={item.isExtraLife}
                    isPublished={item.isPublished}
                    className="group-shop__card"
                    hideAddToCart={item.isExtraLife}
                  />
                ))}
              </div>

              {visibleItems.length > ITEMS_PER_PAGE ? (
                <Pagination
                  totalPages={pagination.totalPages}
                  page={pagination.page}
                  onPageChange={setPage}
                  ariaLabel={PAGINATION_ARIA_LABEL__TEXTLABEL[LANGUAGE]}
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
      <section className="group-shop-page group-shop-page--student" aria-label={SHOP_SECTION_LABEL__TEXTLABEL[LANGUAGE]}>
        <div className="group-shop-page__title-row">
          <header className="group-shop-page__page-header">
            <p className="group-main-subpage__eyebrow">{SHOP_EYEBROW__TEXTLABEL[LANGUAGE]}</p>
            <h1 className="group-main-subpage__title">{SHOP_TITLE_STUDENT__TEXTLABEL[LANGUAGE]}</h1>
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
      title={SECTION_TITLE__TEXTLABEL[LANGUAGE]}
      toolbar={toolbar}
    >
      {shopBody}
    </SectionPageLayout>
  );
}
