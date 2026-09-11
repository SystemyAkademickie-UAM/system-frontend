import { useMemo, useState } from 'react';

import {
  CatalogFilterGroup,
  CatalogFiltersPanel,
  CatalogSortSelect,
  ProductCard,
} from '../../../components/ui/index.js';
import {
  filterShopItems,
  SHOP_SORT,
  getShopSortOptions,
  sortShopItems,
} from '../../../utils/shop/shopModel.js';
import { buildShopCategoryFilters, resolveShopCategoryDetails } from '../../../utils/shop/shopCategories.js';
import { READLANGUAGECOOKIE } from '../../../utils/LANGUAGECOOKIE.js';
import {
  filterCatalogShopItems,
  sortShopItemsWithExtraLifeFirst,
} from '../../../utils/shop/extraLifeItem.js';
import { useGroupShopLivesSystem } from '../../../hooks/shop/useGroupShopLivesSystem.js';
import { useGroupShopItems, useGroupShopOpen } from '../../../hooks/shop/useGroupShop.js';
import { useGroupItemCategories } from '../../../hooks/shop/useGroupItemCategories.js';
import './GroupShopContent.css';

const LOADINGMESSAGE__TEXTLABEL = {
  polish: 'Ładowanie produktów sklepu…',
  english: 'Loading shop products…'
};

const EMPTYMESSAGE__TEXTLABEL = {
  polish: 'Brak produktów spełniających kryteria.',
  english: 'No products match the criteria.'
};

const CATEOGYFILTERLABEL__TEXTLABEL = {
  polish: 'Filtr kategorii produktu',
  english: 'Product category filter'
};

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
  onDoubleClick,
  highlightedItemId = null,
}) {
  const [LANGUAGE] = useState(READLANGUAGECOOKIE);
  const { items, isLoading, error } = useGroupShopItems(groupId);
  const { isShopOpen } = useGroupShopOpen(groupId);
  const { showExtraLifeProduct } = useGroupShopLivesSystem(groupId, {
    isStudentView: !showLecturerActions,
  });
  const { categories, categoriesById } = useGroupItemCategories(groupId);

  const categoryFilters = useMemo(
    () => buildShopCategoryFilters(categories, LANGUAGE),
    [categories, LANGUAGE],
  );

  const sortOptions = useMemo(
    () => getShopSortOptions(LANGUAGE),
    [LANGUAGE],
  );

  const catalogItems = useMemo(() => {
    const source = onlyPublished
      ? items.filter((item) => item.isPublished !== false)
      : items;
    const filtered = filterCatalogShopItems(source, showExtraLifeProduct);
    return sortShopItemsWithExtraLifeFirst(filtered);
  }, [items, onlyPublished, showExtraLifeProduct]);

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
    return <p className="group-shop__empty page-unavailable__notice" role="status">{LOADINGMESSAGE__TEXTLABEL[LANGUAGE]}</p>;
  }

  if (error) {
    return <p className="group-shop__error" role="alert">{error}</p>;
  }

  return (
    <div className="group-shop-page__embedded-catalog">
      {filtersExpanded ? (
        <CatalogFiltersPanel>
          <CatalogFilterGroup
            ariaLabel={CATEOGYFILTERLABEL__TEXTLABEL[LANGUAGE]}
            filters={categoryFilters}
            activeId={categoryFilter}
            onSelect={onCategoryFilterChange}
          />

          <CatalogSortSelect
            value={sortBy}
            onChange={onSortByChange}
            options={sortOptions}
          />
        </CatalogFiltersPanel>
      ) : null}

      <div className={[
        'group-shop__catalog-surface',
        blockCatalog ? 'group-shop__catalog--blocked' : '',
      ].filter(Boolean).join(' ')}>
        {visibleItems.length === 0 ? (
          <p className="group-shop__empty page-unavailable__notice">{EMPTYMESSAGE__TEXTLABEL[LANGUAGE]}</p>
        ) : (
          <div className="group-shop__grid">
            {visibleItems.map((item, index) => (
              <div
                key={`${item.id}-${index}`}
                id={`shop-item-${item.id}`}
                className="group-shop__card-wrapper"
              >
                <ProductCard
                  itemId={item.id}
                  name={item.name}
                  storyDescription={item.storyDescription}
                  didacticDescription={item.didacticDescription}
                  priceAmount={item.priceAmount}
                  minPrice={item.minPrice}
                  salePriceAmount={item.salePriceAmount}
                  rankDiscountedPrice={item.rankDiscountedPrice}
                  imageRef={item.imageRef}
                  categoryDetails={resolveShopCategoryDetails(item.categories, categoriesById)}
                  showLecturerActions={showLecturerActions}
                  hideAddToCart
                  hideActions={showLecturerActions}
                  onEdit={() => onEdit?.(item)}
                  onDelete={() => onDelete?.(item)}
                  onDoubleClick={() => onDoubleClick(item)}
                  isExtraLife={item.isExtraLife}
                  isPublished={item.isPublished}
                  disabled={cardsDisabled || item.isLocked}
                  isRankLocked={!showLecturerActions && item.isLocked}
                  className={[
                    'group-shop__card',
                    highlightedItemId != null && String(highlightedItemId) === String(item.id)
                      ? 'group-shop__card--highlighted'
                      : '',
                  ].filter(Boolean).join(' ')}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
