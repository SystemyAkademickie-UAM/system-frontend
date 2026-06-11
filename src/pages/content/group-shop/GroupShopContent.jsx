import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Button,
  PageHeader,
  Pagination,
  ProductCard,
  SearchBar,
  ShopCartPanel,
  ShopClosedOverlay,
  ShopToggleButton,
  useToast,
} from '../../../components/ui/index.js';
import { RoleVisibility } from '../../../components/guards/index.js';
import { useAppRole } from '../../../context/AppRoleContext.jsx';
import { APP_ROLE } from '../../../navigation/shellTemplates.config.js';
import { groupShopAddPath } from '../../../routes/pathRegistry.js';
import { fetchGroupStudentProfile } from '../../../services/studentProfile.api.js';
import { resolveShopCategoryLabels } from './shopCategories.js';
import { getShopItemEffectivePrice } from './shopPricing.js';
import { EXTRA_LIFE_PRODUCT, EXTRA_LIFE_PRODUCT_ID } from './shopExtraLife.js';
import {
  filterShopItems,
  paginateShopItems,
  SHOP_CATEGORY_FILTERS,
  SHOP_SORT,
  SHOP_SORT_OPTIONS,
  sortShopItems,
} from './shopModel.js';
import {
  useGroupShopCart,
  useGroupShopItems,
  useGroupShopLives,
  useGroupShopOpen,
} from './useGroupShop.js';
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
  const isLecturerView = !isStudentView;

  const {
    items,
    isLoading,
    error,
    refetch,
    deleteItem,
    buyItem,
  } = useGroupShopItems(groupId);
  const {
    cartItems,
    cartCount,
    cartTotal,
    cartItemIds,
    addToCart,
    removeFromCart,
    clearCart,
  } = useGroupShopCart(groupId, items);
  const { isShopOpen, toggleShopOpen } = useGroupShopOpen(groupId);
  const { livesBlocked, toggleLivesBlocked, unblockLives } = useGroupShopLives(groupId);

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState(SHOP_SORT.nameAsc);
  const [page, setPage] = useState(1);
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const closeModal = useCallback(() => setActiveModal(null), []);

  const visibleItems = useMemo(() => {
    const filtered = filterShopItems(items, { searchQuery, categoryFilter });
    return sortShopItems(filtered, sortBy);
  }, [items, searchQuery, categoryFilter, sortBy]);

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

  const shopInteractionDisabled = !isShopOpen || livesBlocked;

  const refreshAfterPurchase = useCallback(async () => {
    await refetch();
    if (isStudentView && groupId) {
      await fetchGroupStudentProfile(groupId);
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

  return (
    <section className="page-unavailable members-page group-shop-page" aria-label="Sklep">
      <div className="members-page__header-row group-shop-page__header-row">
        <PageHeader
          title="Sklep"
          description="Przeglądaj i wymieniaj zgromadzoną walutę na bonusy dydaktyczne."
        />

        <div className="group-shop-page__header-actions">
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

          <ShopCartPanel
            cartCount={cartCount}
            cartItems={cartItems.map((item) => ({
              id: item.id,
              name: item.name,
              priceAmount: getShopItemEffectivePrice(item),
              imageUrl: item.imageUrl,
            }))}
            cartTotal={cartTotal}
            disabled={shopInteractionDisabled}
            onBuyAll={() => setActiveModal({ type: 'buyAll' })}
            onRemoveFromCart={removeFromCart}
            className="group-shop__cart"
          />
        </div>
      </div>

      <div className="group-shop-page__toolbar group-shop__toolbar">
        <SearchBar
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Szukaj produktu…"
          name="shop-search"
          className="group-shop__search"
          aria-label="Szukaj produktu po nazwie lub opisie"
        />

        <button
          type="button"
          className={[
            'group-shop__filters-toggle',
            filtersExpanded ? 'group-shop__filters-toggle--active' : '',
          ].join(' ')}
          aria-expanded={filtersExpanded}
          onClick={() => setFiltersExpanded((expanded) => !expanded)}
        >
          Filtry i sortowanie
        </button>
      </div>

      {filtersExpanded ? (
        <div className="group-shop__filters">
          <div
            className="group-shop__filter-group"
            role="group"
            aria-label="Filtr kategorii produktu"
          >
            {SHOP_CATEGORY_FILTERS.map((filter) => (
              <button
                key={filter.id}
                type="button"
                className={[
                  'group-shop__filter',
                  categoryFilter === filter.id ? 'group-shop__filter--active' : '',
                ].join(' ')}
                onClick={() => setCategoryFilter(filter.id)}
              >
                {filter.label}
              </button>
            ))}
          </div>

          <label className="group-shop__sort">
            <span className="group-shop__sort-label">Sortuj:</span>
            <select
              className="group-shop__sort-select"
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
            >
              {SHOP_SORT_OPTIONS.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>
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
          isGameOver={isShopOpen && livesBlocked}
          extraLifeProduct={EXTRA_LIFE_PRODUCT}
          onExtraLifeBuy={() => setActiveModal({ type: 'buy', item: EXTRA_LIFE_PRODUCT })}
        />

        <div className="group-shop__catalog-surface">
          {isLoading ? (
            <p className="group-shop__empty" role="status">Ładowanie produktów sklepu…</p>
          ) : items.length === 0 ? (
            <p className="group-shop__empty" role="status">
              W sklepie nie ma jeszcze żadnych produktów.
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
            <p className="group-shop__empty" role="status">
              Brak produktów spełniających wybrane filtry.
            </p>
          ) : (
            <>
              <div className="group-shop__grid">
                {pagination.pageItems.map((item) => (
                  <ProductCard
                    key={item.id}
                    name={item.name}
                    storyDescription={item.storyDescription}
                    didacticDescription={item.didacticDescription}
                    priceAmount={item.priceAmount}
                    salePriceAmount={item.salePriceAmount}
                    imageUrl={item.imageUrl}
                    categories={resolveShopCategoryLabels(item.categories)}
                    showLecturerActions={isLecturerView}
                    disabled={shopInteractionDisabled || (item.stockQuantity !== null && item.stockQuantity <= 0)}
                    isInCart={cartItemIds.includes(item.id)}
                    onBuy={() => setActiveModal({ type: 'buy', item })}
                    onAddToCart={() => addToCart(item.id)}
                    onEdit={() => showToast({ message: 'Edycja produktu będzie dostępna w kolejnej wersji.' })}
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
    </section>
  );
}
