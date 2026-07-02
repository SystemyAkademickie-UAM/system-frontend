/**
 * @param {Array<{ isPublished?: boolean }>} items
 * @returns {boolean}
 */
export function areAllRewardsItemsPublished(items) {
  if (!Array.isArray(items) || items.length === 0) {
    return true;
  }

  return items.every((item) => item.isPublished !== false);
}

/**
 * @param {Array<{ isPublished?: boolean }>} items
 * @returns {'Ukryj wszystkie' | 'Odkryj wszystkie'}
 */
export function getBulkVisibilityToggleLabel(items) {
  return areAllRewardsItemsPublished(items) ? 'Ukryj wszystkie' : 'Odkryj wszystkie';
}

/**
 * @param {Array<{ isPublished?: boolean }>} items
 * @returns {boolean}
 */
export function getBulkVisibilityTargetPublished(items) {
  return !areAllRewardsItemsPublished(items);
}
