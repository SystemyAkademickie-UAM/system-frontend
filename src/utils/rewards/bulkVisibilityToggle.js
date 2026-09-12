import { READLANGUAGECOOKIE } from '../../utils/LANGUAGECOOKIE.js';

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

const HIDEALL__TEXTLABEL = {
  polish: 'Ukryj wszystkie',
  english: 'Hide all'
};

const SHOWALL__TEXTLABEL = {
  polish: 'Odkryj wszystkie',
  english: 'Show all'
};

/**
 * @param {Array<{ isPublished?: boolean }>} items
 * @param {string} [language]
 * @returns {string}
 */
export function getBulkVisibilityToggleLabel(items, language) {
  const lang = language ?? READLANGUAGECOOKIE();
  return areAllRewardsItemsPublished(items) ? HIDEALL__TEXTLABEL[lang] || HIDEALL__TEXTLABEL.english : SHOWALL__TEXTLABEL[lang] || SHOWALL__TEXTLABEL.english;
}

/**
 * @param {Array<{ isPublished?: boolean }>} items
 * @returns {boolean}
 */
export function getBulkVisibilityTargetPublished(items) {
  return !areAllRewardsItemsPublished(items);
}
