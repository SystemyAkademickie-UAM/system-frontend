import { compareShopItemsByEffectivePrice } from './shopPricing.js';
import { READLANGUAGECOOKIE } from '../../utils/LANGUAGECOOKIE.js';

export const SHOP_SORT = {
  default: 'default',
  nameAsc: 'nameAsc',
  nameDesc: 'nameDesc',
  priceAsc: 'priceAsc',
  priceDesc: 'priceDesc',
};

const SORTDEFAULT__TEXTLABEL = {
  polish: 'Kolejność domyślna',
  english: 'Default order'
};

const SORTNAMEASC__TEXTLABEL = {
  polish: 'Nazwa A–Z',
  english: 'Name A–Z'
};

const SORTNAMEDESC__TEXTLABEL = {
  polish: 'Nazwa Z–A',
  english: 'Name Z–A'
};

const SORTPRICEASC__TEXTLABEL = {
  polish: 'Cena rosnąco',
  english: 'Price ascending'
};

const SORTPRICEDESC__TEXTLABEL = {
  polish: 'Cena malejąco',
  english: 'Price descending'
};

/**
 * @param {string} [language]
 * @returns {Array<{id: string, label: string}>}
 */
export function getShopSortOptions(language) {
  const lang = language ?? READLANGUAGECOOKIE();
  return [
    { id: SHOP_SORT.default, label: SORTDEFAULT__TEXTLABEL[lang] || SORTDEFAULT__TEXTLABEL.english },
    { id: SHOP_SORT.nameAsc, label: SORTNAMEASC__TEXTLABEL[lang] || SORTNAMEASC__TEXTLABEL.english },
    { id: SHOP_SORT.nameDesc, label: SORTNAMEDESC__TEXTLABEL[lang] || SORTNAMEDESC__TEXTLABEL.english },
    { id: SHOP_SORT.priceAsc, label: SORTPRICEASC__TEXTLABEL[lang] || SORTPRICEASC__TEXTLABEL.english },
    { id: SHOP_SORT.priceDesc, label: SORTPRICEDESC__TEXTLABEL[lang] || SORTPRICEDESC__TEXTLABEL.english },
  ];
}

export const SHOP_SORT_OPTIONS = [
  { id: SHOP_SORT.default, label: SORTDEFAULT__TEXTLABEL.english },
  { id: SHOP_SORT.nameAsc, label: SORTNAMEASC__TEXTLABEL.english },
  { id: SHOP_SORT.nameDesc, label: SORTNAMEDESC__TEXTLABEL.english },
  { id: SHOP_SORT.priceAsc, label: SORTPRICEASC__TEXTLABEL.english },
  { id: SHOP_SORT.priceDesc, label: SORTPRICEDESC__TEXTLABEL.english },
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
export function sortShopItems(items, sortBy = SHOP_SORT.default) {
  const sorted = [...items];

  sorted.sort((left, right) => {
    if (left.isExtraLife && !right.isExtraLife) return -1;
    if (!left.isExtraLife && right.isExtraLife) return 1;

    let comparison = 0;
    const nameLeft = String(left.name ?? '').trim();
    const nameRight = String(right.name ?? '').trim();

    switch (sortBy) {
      case SHOP_SORT.nameDesc:
        comparison = nameRight.localeCompare(nameLeft, 'pl', { sensitivity: 'base', numeric: true });
        break;
      case SHOP_SORT.priceAsc:
        comparison = compareShopItemsByEffectivePrice(left, right);
        break;
      case SHOP_SORT.priceDesc:
        comparison = compareShopItemsByEffectivePrice(right, left);
        break;
      case SHOP_SORT.nameAsc:
        comparison = nameLeft.localeCompare(nameRight, 'pl', { sensitivity: 'base', numeric: true });
        break;
      case SHOP_SORT.default:
      default: {
        const posA = Number(left.position);
        const posB = Number(right.position);
        if (Number.isFinite(posA) && Number.isFinite(posB) && posA !== posB) {
          comparison = posA - posB;
        } else {
          const idA = Number(left.id);
          const idB = Number(right.id);
          if (Number.isFinite(idA) && Number.isFinite(idB) && idA !== idB) {
            comparison = idA - idB;
          }
        }
        break;
      }
    }

    if (comparison !== 0) {
      return comparison;
    }

    // Tie-breakery:
    const posA = Number(left.position);
    const posB = Number(right.position);
    if (Number.isFinite(posA) && Number.isFinite(posB) && posA !== posB) {
      return posA - posB;
    }

    const idA = Number(left.id);
    const idB = Number(right.id);
    if (Number.isFinite(idA) && Number.isFinite(idB) && idA !== idB) {
      return idA - idB;
    }

    return nameLeft.localeCompare(nameRight, 'pl', { sensitivity: 'base', numeric: true });
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
