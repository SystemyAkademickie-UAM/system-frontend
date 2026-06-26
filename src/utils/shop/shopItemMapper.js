import { parseShopItemImageRef } from './shopItemIcon.js';

/**
 * @param {unknown} raw
 * @returns {import('./shopItem.types.js').ShopItem}
 */
export function mapBackendShopItem(raw) {
  const item = /** @type {Record<string, unknown>} */ (raw ?? {});
  const listing = /** @type {Record<string, unknown>} */ (item.listing ?? {});
  const basePrice = Number(listing.basePrice ?? 0);
  const discountedPrice = listing.discountedPrice;
  const rankDiscountedPrice = listing.rankDiscountedPrice;

  const categoryId = item.categoryId ?? null;
  const categoryIds = Array.isArray(item.categoryIds)
    ? item.categoryIds.map((id) => Number(id)).filter((id) => Number.isFinite(id))
    : (categoryId !== null && categoryId !== undefined ? [Number(categoryId)] : []);
  const imageRef = typeof item.imageRef === 'string' ? item.imageRef : null;
  const icon = parseShopItemImageRef(imageRef);
  const badgePromotions = Array.isArray(listing.badgePromotions) ? listing.badgePromotions : [];
  const rankPromotions = Array.isArray(listing.rankPromotions) ? listing.rankPromotions : [];

  return {
    id: String(item.id ?? ''),
    name: typeof item.name === 'string' ? item.name : '',
    storyDescription: typeof item.storyDescription === 'string' ? item.storyDescription : '',
    didacticDescription: typeof item.educationalDescription === 'string' ? item.educationalDescription : '',
    priceAmount: basePrice,
    salePriceAmount: discountedPrice === null || discountedPrice === undefined
      ? undefined
      : Number(discountedPrice),
    rankDiscountedPrice: rankDiscountedPrice === null || rankDiscountedPrice === undefined
      ? undefined
      : Number(rankDiscountedPrice),
    imageUrl: icon.imageUrl ?? undefined,
    categoryId: categoryIds[0] ?? null,
    stockQuantity: listing.stockQuantity === null || listing.stockQuantity === undefined
      ? null
      : Number(listing.stockQuantity),
    perStudentLimit: listing.perStudentLimit === null || listing.perStudentLimit === undefined
      ? null
      : Number(listing.perStudentLimit),
    categories: categoryIds.map(String),
    imageRef: typeof item.imageRef === 'string' ? item.imageRef : null,
    isPublished: typeof item.isPublished === 'boolean' ? item.isPublished : true,
    isLocked: listing.isLocked === true,
    isExtraLife: item.isExtraLife === true,
    badgePromotions,
    rankPromotions,
  };
}

/**
 * @param {unknown[]} items
 * @returns {import('./shopItem.types.js').ShopItem[]}
 */
export function mapBackendShopItems(items) {
  if (!Array.isArray(items)) {
    return [];
  }
  return items.map(mapBackendShopItem).filter((item) => item.id);
}

/**
 * @param {unknown} raw
 * @returns {import('./shopItem.types.js').InventoryEntry | null}
 */
export function mapBackendInventoryEntry(raw) {
  const row = /** @type {Record<string, unknown>} */ (raw ?? {});
  const itemRaw = row.item;
  if (!itemRaw || typeof itemRaw !== 'object') {
    return null;
  }

  const item = mapBackendShopItem({ ...itemRaw, listing: null });

  return {
    id: Number(row.id ?? 0),
    enrollmentId: Number(row.enrollmentId ?? 0),
    itemId: Number(row.itemId ?? item.id ?? 0),
    quantity: Number(row.quantity ?? 0),
    item,
  };
}

/**
 * @param {unknown[]} entries
 * @returns {import('./shopItem.types.js').InventoryEntry[]}
 */
export function mapBackendInventory(entries) {
  if (!Array.isArray(entries)) {
    return [];
  }
  return entries
    .map(mapBackendInventoryEntry)
    .filter((entry) => entry !== null && entry.quantity > 0);
}

/**
 * @param {unknown} raw
 * @returns {import('./shopItem.types.js').ShopItemTemplate | null}
 */
export function mapBackendShopTemplate(raw) {
  const template = /** @type {Record<string, unknown>} */ (raw ?? {});
  const id = Number(template.id);
  if (!Number.isFinite(id) || id <= 0) {
    return null;
  }

  return {
    id,
    name: typeof template.name === 'string' ? template.name : '',
    storyDescription: typeof template.storyDescription === 'string' ? template.storyDescription : '',
    educationalDescription: typeof template.educationalDescription === 'string' ? template.educationalDescription : '',
    basePrice: Number(template.basePrice ?? 0),
  };
}

/**
 * @param {unknown[]} templates
 * @returns {import('./shopItem.types.js').ShopItemTemplate[]}
 */
export function mapBackendShopTemplates(templates) {
  if (!Array.isArray(templates)) {
    return [];
  }
  return templates
    .map(mapBackendShopTemplate)
    .filter((template) => template !== null);
}
