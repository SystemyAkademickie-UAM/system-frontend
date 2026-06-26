const VISIBILITY_LABELS = {
  badge: { public: 'Publiczna', hidden: 'Ukryta' },
  item: { public: 'Publiczny', hidden: 'Ukryty' },
};

/**
 * @param {boolean | undefined} isPublished
 * @param {'badge' | 'item'} [entity='item']
 * @returns {'Publiczna' | 'Ukryta' | 'Publiczny' | 'Ukryty'}
 */
export function getVisibilityStatusLabel(isPublished, entity = 'item') {
  const labels = VISIBILITY_LABELS[entity] ?? VISIBILITY_LABELS.item;
  return isPublished === false ? labels.hidden : labels.public;
}
