import { useMemo } from 'react';
import {
  CatalogFilterGroup,
  CatalogFiltersPanel,
  CatalogSortSelect,
  ProductCard,
} from '../../../components/ui/index.js';
import {
  filterShopItems,
  SHOP_SORT,
  SHOP_SORT_OPTIONS,
  sortShopItems,
} from '../../../utils/shop/shopModel.js';
import { buildShopCategoryFilters, resolveShopCategoryDetails } from '../../../utils/shop/shopCategories.js';
import { sortShopItemsWithExtraLifeFirst } from '../../../utils/shop/extraLifeItem.js';
import { useGroupShopItems, useGroupShopOpen } from '../../../hooks/shop/useGroupShop.js';
import { useGroupItemCategories } from '../../../hooks/shop/useGroupItemCategories.js';
import './GroupShopContent.css';

/**
 * Kafelkowy katalog produktów sklepu — widok jak na /shop (bez koszyka).
 *
 * @param {Object} props
 * @param {string | number | null | undefined} props.groupId
 * @param {boolean} [props.showLecturerActions]
 * @param {boolean} [props.onlyPublished]
 * @param {string} [props.searchQuery]
 * @param {boolean} [props.filtersExpanded=false]
 * @param {string} [props.categoryFilter='all']
 * @param {(value: string) => void} [props.onCategoryFilterChange]
 * @param {string} [props.sortBy]
 * @param {(value: string) => void} [props.onSortByChange]
 * @param {(item: import('../../../utils/shop/shopItem.types.js').ShopItem) => void} [props.onEdit]
 * @param {(item: import('../../../utils/shop/shopItem.types.js').ShopItem) => void} [props.onDelete]
 */
export default function ShopStudentCatalogPanel({
  groupId,
  showLecturerActions = false,
  onlyPublished = true,
  searchQuery = '',
  filtersExpanded = false,
  categoryFilter = 'all',
  onCategoryFilterChange,
  sortBy = SHOP_SORT.nameAsc,
  onSortByChange,
  onEdit,
  onDelete,
}) {
  const { items, isLoading, error } = useGroupShopItems(groupId);
  const { isShopOpen } = useGroupShopOpen(groupId);
  const { categories, categoriesById } = useGroupItemCategories(groupId);

  const categoryFilters = useMemo(
    () => buildShopCategoryFilters(categories),
    [categories],
  );

  const catalogItems = useMemo(() => {
    const source = onlyPublished
      ? items.filter((item) => item.isPublished !== false)
      : items;
    return sortShopItemsWithExtraLifeFirst(source);
  }, [items, onlyPublished]);

  const visibleItems = useMemo(() => {
    const filtered = filterShopItems(catalogItems, {
      searchQuery,
      categoryFilter,
    });
    const sorted = sortShopItems(filtered, sortBy);
    return sortShopItemsWithExtraLifeFirst(sorted);
  }, [catalogItems, searchQuery, categoryFilter, sortBy]);

  const blockCatalog = !showLecturerActions && !isShopOpen;
  const cardsDisabled = !showLecturerActions && !isShopOpen;

  if (isLoading) {
    return <p className="group-shop__empty page-unavailable__notice" role="status">Ładowanie produktów sklepu…</p>;
  }

  if (error) {
    return <p className="group-shop__error" role="alert">{error}</p>;
  }

  return (
    <div className="group-shop-page__embedded-catalog">
      {filtersExpanded ? (
        <CatalogFiltersPanel>
          <CatalogFilterGroup
            ariaLabel="Filtr kategorii produktu"
            filters={categoryFilters}
            activeId={categoryFilter}
            onSelect={onCategoryFilterChange}
          />

          <CatalogSortSelect
            value={sortBy}
            onChange={onSortByChange}
            options={SHOP_SORT_OPTIONS}
          />
        </CatalogFiltersPanel>
      ) : null}

      <div className={[
        'group-shop__catalog-surface',
        blockCatalog ? 'group-shop__catalog--blocked' : '',
      ].filter(Boolean).join(' ')}>
        {visibleItems.length === 0 ? (
          <p className="group-shop__empty page-unavailable__notice">Brak produktów spełniających kryteria.</p>
        ) : (
          <div className="group-shop__grid">
            {visibleItems.map((item) => (
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
                showLecturerActions={showLecturerActions}
                hideAddToCart
                hideActions={showLecturerActions}
                onEdit={() => onEdit?.(item)}
                onDelete={() => onDelete?.(item)}
                isExtraLife={item.isExtraLife}
                disabled={cardsDisabled || item.isLocked}
                isRankLocked={!showLecturerActions && item.isLocked}
                className="group-shop__card"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
