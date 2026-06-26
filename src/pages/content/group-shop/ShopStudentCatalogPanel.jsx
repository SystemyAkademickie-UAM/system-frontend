import { useMemo, useState } from 'react';
import {
  CatalogFilterGroup,
  CatalogFiltersPanel,
  CatalogFiltersToggle,
  CatalogSortSelect,
  ProductCard,
} from '../../../components/ui/index.js';
import {
  filterShopItems,
  SHOP_CATEGORY_FILTERS,
  SHOP_SORT,
  SHOP_SORT_OPTIONS,
  sortShopItems,
} from '../../../utils/shop/shopModel.js';
import { getShopItemEffectivePrice } from '../../../utils/shop/shopPricing.js';
import { resolveShopCategoryLabels } from '../../../utils/shop/shopCategories.js';
import { useGroupShopItems, useGroupShopOpen } from '../../../hooks/shop/useGroupShop.js';
import './GroupShopContent.css';

/**
 * Kafelkowy katalog produktów sklepu — widok jak na /shop (bez koszyka).
 *
 * @param {Object} props
 * @param {string | number | null | undefined} props.groupId
 * @param {boolean} [props.showLecturerActions]
 * @param {boolean} [props.onlyPublished]
 * @param {string} [props.searchQuery]
 * @param {(item: import('../../../utils/shop/shopItem.types.js').ShopItem) => void} [props.onEdit]
 * @param {(item: import('../../../utils/shop/shopItem.types.js').ShopItem) => void} [props.onDelete]
 */
export default function ShopStudentCatalogPanel({
  groupId,
  showLecturerActions = false,
  onlyPublished = true,
  searchQuery = '',
  onEdit,
  onDelete,
}) {
  const { items, isLoading, error } = useGroupShopItems(groupId);
  const { isShopOpen } = useGroupShopOpen(groupId);

  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState(SHOP_SORT.nameAsc);

  const catalogItems = useMemo(() => {
    if (!onlyPublished) {
      return items;
    }
    return items.filter((item) => item.isPublished !== false);
  }, [items, onlyPublished]);

  const visibleItems = useMemo(() => {
    const filtered = filterShopItems(catalogItems, {
      searchQuery,
      categoryFilter,
    });
    return sortShopItems(filtered, sortBy);
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
      <div className="maq-section-page__toolbar-end group-shop-page__toolbar-actions">
        <CatalogFiltersToggle
          expanded={filtersExpanded}
          onToggle={() => setFiltersExpanded((expanded) => !expanded)}
        />
      </div>

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
                priceAmount={getShopItemEffectivePrice(item)}
                salePriceAmount={item.salePriceAmount}
                imageRef={item.imageRef}
                categories={resolveShopCategoryLabels(item.categories)}
                showLecturerActions={showLecturerActions}
                hideAddToCart
                hideActions={showLecturerActions}
                onEdit={() => onEdit?.(item)}
                onDelete={() => onDelete?.(item)}
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
