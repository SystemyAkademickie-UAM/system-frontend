/**
 * @param {import('./shopItem.types.js').ShopItem | { priceAmount?: number, salePriceAmount?: number, rankDiscountedPrice?: number }} item
 * @returns {boolean}
 */
export function hasShopItemDiscount(item) {
  const display = getShopItemPriceDisplay(item);
  return display.mode === 'badge' || display.mode === 'rank';
}

/**
 * Cena efektywna (po wszystkich zniżkach).
 *
 * @param {import('./shopItem.types.js').ShopItem | { priceAmount?: number, salePriceAmount?: number, rankDiscountedPrice?: number }} item
 * @returns {number}
 */
export function getShopItemEffectivePrice(item) {
  const display = getShopItemPriceDisplay(item);
  return display.displayPrice;
}

/**
 * @typedef {'none' | 'rank' | 'badge'} ShopItemPriceDisplayMode
 */

/**
 * @typedef {Object} ShopItemPriceDisplay
 * @property {ShopItemPriceDisplayMode} mode
 * @property {number} displayPrice — cena widoczna dla studenta
 * @property {number} [strikePrice] — przekreślana cena (przed zniżką odznak)
 * @property {number} [tooltipBasePrice] — katalogowa cena bazowa (tooltip przy zniżce rangi)
 * @property {Array<{ source: 'rank' | 'badge', name: string, type: 'percent' | 'fixed', value: number, formattedText: string }>} [appliedDiscounts]
 */

/**
 * Zniżka rangi wyświetla się jako zwykła cena (z tooltipem katalogowym).
 * Zniżka odznak — przekreślona cena przed odznaką + złoty kafelek z ceną końcową.
 *
 * @param {import('./shopItem.types.js').ShopItem | { priceAmount?: number, salePriceAmount?: number, rankDiscountedPrice?: number, appliedDiscounts?: Array<{ source: 'rank' | 'badge', name: string, type: 'percent' | 'fixed', value: number, formattedText: string }> }} item
 * @returns {ShopItemPriceDisplay}
 */
export function getShopItemPriceDisplay(item) {
  const catalogBase = Number(item?.priceAmount ?? 0);
  const rankPrice = item?.rankDiscountedPrice != null
    ? Number(item.rankDiscountedPrice)
    : catalogBase;
  const finalPrice = item?.salePriceAmount != null
    ? Number(item.salePriceAmount)
    : rankPrice;
  const appliedDiscounts = Array.isArray(item?.appliedDiscounts) ? item.appliedDiscounts : [];

  const hasBadgeDiscount = finalPrice < rankPrice;
  const hasRankDiscount = rankPrice < catalogBase;

  if (hasBadgeDiscount) {
    return {
      mode: 'badge',
      displayPrice: finalPrice,
      strikePrice: rankPrice,
      tooltipBasePrice: catalogBase,
      appliedDiscounts,
    };
  }

  if (hasRankDiscount) {
    return {
      mode: 'rank',
      displayPrice: finalPrice,
      tooltipBasePrice: catalogBase,
      appliedDiscounts,
    };
  }

  return {
    mode: 'none',
    displayPrice: catalogBase,
    appliedDiscounts,
  };
}

/**
 * @param {ShopItemPriceDisplay | null | undefined} display
 * @returns {string | null}
 */
export function getShopCatalogPriceHint(display) {
  if (!display) {
    return null;
  }

  const basePrice = display.tooltipBasePrice ?? display.displayPrice;
  const appliedDiscounts = Array.isArray(display.appliedDiscounts) ? display.appliedDiscounts : [];

  if (appliedDiscounts.length > 0) {
    const lines = [`Cena katalogowa: ${basePrice}`];
    appliedDiscounts.forEach((discount) => {
      const text = discount.formattedText || `${discount.name}: -${discount.value}${discount.type === 'percent' ? '%' : ''}`;
      lines.push(`- ${text}`);
    });
    return lines.join('\n');
  }

  if (display.tooltipBasePrice != null && Number(display.tooltipBasePrice) !== Number(display.displayPrice)) {
    return `Cena katalogowa: ${display.tooltipBasePrice}`;
  }

  return null;
}

/**
 * Zwraca podpowiedź dla ceny przekreślonej (cena po obniżce rangi przed zniżkami odznak).
 *
 * @param {ShopItemPriceDisplay | null | undefined} display
 * @returns {string | null}
 */
export function getShopStrikePriceHint(display) {
  if (!display || display.tooltipBasePrice == null) {
    return null;
  }

  const basePrice = Number(display.tooltipBasePrice);
  const strikePrice = display.strikePrice != null ? Number(display.strikePrice) : basePrice;

  if (strikePrice >= basePrice) {
    return `Cena katalogowa: ${basePrice}`;
  }

  const appliedDiscounts = Array.isArray(display.appliedDiscounts) ? display.appliedDiscounts : [];
  const rankDiscounts = appliedDiscounts.filter((d) => d.source === 'rank');

  const lines = [`Cena katalogowa: ${basePrice}`];
  if (rankDiscounts.length > 0) {
    rankDiscounts.forEach((discount) => {
      const text = discount.formattedText || `${discount.name}: -${discount.value}${discount.type === 'percent' ? '%' : ''}`;
      lines.push(`- ${text}`);
    });
  } else {
    lines.push(`- Obniżka za rangę: -${basePrice - strikePrice}`);
  }

  return lines.join('\n');
}

/**
 * @param {import('./shopItem.types.js').ShopItem | { priceAmount?: number, salePriceAmount?: number }} left
 * @param {import('./shopItem.types.js').ShopItem | { priceAmount?: number, salePriceAmount?: number }} right
 * @returns {number}
 */
export function compareShopItemsByEffectivePrice(left, right) {
  return getShopItemEffectivePrice(left) - getShopItemEffectivePrice(right);
}
