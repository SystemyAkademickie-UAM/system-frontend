/**
 * @param {import('../../../services/groupTemplates.api.js').GroupTemplateListItem[]} templates
 */
export function sortTemplatesWithFavoritesFirst(templates) {
  return [...templates].sort((left, right) => {
    const leftFav = Boolean(left.isFavorite);
    const rightFav = Boolean(right.isFavorite);
    if (leftFav !== rightFav) return leftFav ? -1 : 1;
    return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime();
  });
}
