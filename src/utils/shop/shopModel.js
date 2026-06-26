import { SHOP_CATEGORY_FILTERS } from './shopCategories.js';
import { compareShopItemsByEffectivePrice } from './shopPricing.js';

export { SHOP_CATEGORY_FILTERS };

export const SHOP_SORT = {
  nameAsc: 'nameAsc',
  nameDesc: 'nameDesc',
  priceAsc: 'priceAsc',
  priceDesc: 'priceDesc',
};

export const SHOP_SORT_OPTIONS = [
  { id: SHOP_SORT.nameAsc, label: 'Nazwa A–Z' },
  { id: SHOP_SORT.nameDesc, label: 'Nazwa Z–A' },
  { id: SHOP_SORT.priceAsc, label: 'Cena rosnąco' },
  { id: SHOP_SORT.priceDesc, label: 'Cena malejąco' },
];

/**
 * @param {import('./shopItem.types.js').ShopItem[]} items
 * @param {{ searchQuery?: string, categoryFilter?: string }} filters
 */
export function filterShopItems(items, { searchQuery = '', categoryFilter = 'all' } = {}) {
  const query = searchQuery.trim().toLowerCase();

  return items.filter((item) => {
    if (categoryFilter !== 'all' && !(item.categories ?? []).includes(categoryFilter)) {
      return false;
    }

    if (!query) {
      return true;
    }

    const haystack = [
      item.name,
      item.storyDescription,
      item.didacticDescription,
      ...(item.categories ?? []),
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    return haystack.includes(query);
  });
}

/**
 * @param {import('./shopItem.types.js').ShopItem[]} items
 * @param {string} sortBy
 */
export function sortShopItems(items, sortBy) {
  const sorted = [...items];

  sorted.sort((left, right) => {
    switch (sortBy) {
      case SHOP_SORT.nameDesc:
        return right.name.localeCompare(left.name, 'pl');
      case SHOP_SORT.priceAsc:
        return compareShopItemsByEffectivePrice(left, right);
      case SHOP_SORT.priceDesc:
        return compareShopItemsByEffectivePrice(right, left);
      case SHOP_SORT.nameAsc:
      default:
        return left.name.localeCompare(right.name, 'pl');
    }
  });

  return sorted;
}

/**
 * @param {import('./shopItem.types.js').ShopItem[]} items
 * @param {number} page
 * @param {number} itemsPerPage
 */
export function paginateShopItems(items, page, itemsPerPage) {
  const totalPages = Math.max(1, Math.ceil(items.length / itemsPerPage));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * itemsPerPage;

  return {
    page: safePage,
    totalPages,
    pageItems: items.slice(start, start + itemsPerPage),
  };
}
