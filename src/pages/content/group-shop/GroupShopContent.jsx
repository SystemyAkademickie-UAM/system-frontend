import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
import GroupMainSubpageHeader from '../group-main/shared/GroupMainSubpageHeader.jsx';
import '../group-main/shared/groupMainSubpageHeader.css';
import { RoleVisibility } from '../../../components/guards/index.js';
import { useAppRole } from '../../../context/AppRoleContext.jsx';
import { APP_ROLE } from '../../../navigation/shellTemplates.config.js';
import { groupShopAddPath } from '../../../routes/pathRegistry.js';
import {
  invalidateGroupInventory,
  invalidateStudentProfile,
} from '../../../services/studentProfileEvents.js';
import { resolveShopCategoryLabels } from '../../../utils/shop/shopCategories.js';
import { getShopItemEffectivePrice } from '../../../utils/shop/shopPricing.js';
import { EXTRA_LIFE_PRODUCT, EXTRA_LIFE_PRODUCT_ID } from './shopExtraLife.js';
import {
  filterShopItems,
  paginateShopItems,
  SHOP_CATEGORY_FILTERS,
  SHOP_SORT,
  SHOP_SORT_OPTIONS,
  sortShopItems,
} from '../../../utils/shop/shopModel.js';
import {
  useGroupShopCart,
  useGroupShopItems,
  useGroupShopLives,
  useGroupShopOpen,
} from '../../../hooks/shop/useGroupShop.js';
import ShopBuyAllModal from './modals/ShopBuyAllModal.jsx';
import ShopBuyModal from './modals/ShopBuyModal.jsx';
import ShopDeleteModal from './modals/ShopDeleteModal.jsx';
import '../../../components/page/PageUnavailable.css';
import '../shared/groupSectionPage.css';
import '../group-members/MembersHomeContent.css';
import './GroupShopContent.css';

const ITEMS_PER_PAGE = 10;

export default function GroupShopContent() {
  const { groupId } = useParams();
  const navigate = useNavigate();
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
    if (!isStudentView) {
      return items;
    }
    return items.filter((item) => item.isPublished !== false);
  }, [items, isStudentView]);

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
  const { livesBlocked, toggleLivesBlocked, unblockLives } = useGroupShopLives(groupId);
  const livesBlockedForView = isLecturerView ? livesBlocked : false;

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState(SHOP_SORT.nameAsc);
  const [page, setPage] = useState(1);
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRefreshingShop, setIsRefreshingShop] = useState(false);

  const closeModal = useCallback(() => setActiveModal(null), []);

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

  const shopInteractionDisabled = !isShopOpen || livesBlockedForView;
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

    if (activeModal.item.id === EXTRA_LIFE_PRODUCT_ID) {
      unblockLives();
      showSuccess('Dodatkowe życie zakupione. Sklep został odblokowany.');
      closeModal();
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
    showSuccess('Produkt został zakupiony.');
    closeModal();
  }, [activeModal, buyItem, closeModal, refreshAfterPurchase, showError, showSuccess, unblockLives]);

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
          <Button
            type="button"
            variant="ghost"
            size="md"
            onClick={toggleLivesBlocked}
            aria-pressed={livesBlocked}
            className="group-shop__lives-toggle"
          >
            System żyć{livesBlocked ? ' (zablokowany)' : ''}
          </Button>
        </RoleVisibility>

        <RoleVisibility allowedRoles={[APP_ROLE.LECTURER, APP_ROLE.ADMIN, APP_ROLE.SUPERADMIN]}>
          <div className="group-shop__lecturer-actions">
            {groupId ? (
              <Button to={groupShopAddPath(groupId)} variant="secondary" size="md">
                Dodaj produkt
              </Button>
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
            filters={SHOP_CATEGORY_FILTERS}
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
          isGameOver={isShopOpen && livesBlockedForView}
          extraLifeProduct={EXTRA_LIFE_PRODUCT}
          onExtraLifeBuy={() => setActiveModal({ type: 'buy', item: EXTRA_LIFE_PRODUCT })}
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
                  <button type="button" className="group-shop__empty-link" onClick={() => navigate(groupShopAddPath(groupId))}>
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
                priceAmount={getShopItemEffectivePrice(item)}
                salePriceAmount={item.salePriceAmount}
                imageRef={item.imageRef}
                categories={resolveShopCategoryLabels(item.categories)}
                showLecturerActions={isLecturerView}
                disabled={purchaseDisabled || (item.stockQuantity !== null && item.stockQuantity <= 0) || item.isLocked}
                isRankLocked={!isLecturerView && item.isLocked}
                    isInCart={cartItemIds.includes(item.id)}
                    onBuy={() => setActiveModal({ type: 'buy', item })}
                    onAddToCart={() => addToCart(item.id)}
                    onEdit={() => navigate(`${groupShopAddPath(groupId)}?itemId=${encodeURIComponent(item.id)}`)}
                    onDelete={() => setActiveModal({ type: 'delete', item })}
                    className="group-shop__card"
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
    </>
  );

  if (isStudentView) {
    return (
      <section className="page-unavailable group-shop-page group-shop-page--student maq-section-page">
        <GroupMainSubpageHeader eyebrow="Targowisko" title="Sklep" />
        <Divider className="maq-section-page__divider" />
        <div className="group-shop-page__student-toolbar maq-section-page__toolbar">
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
