/**
 * Buduje listę elementów paginacji (numery stron + wielokropek).
 *
 * Okno 3 stron: dla strony >= 3 środkowa to bieżąca (np. 6 → 4,5,6).
 * Dla stron 1–2 okno startuje od 1 (np. 3 → 1,2,3).
 * Ostatnia strona dołączana po "…", jeśli nie mieści się w oknie.
 *
 * @param {number} currentPage — 1-based
 * @param {number} totalPages
 * @returns {({ type: 'page', page: number } | { type: 'ellipsis' })[]}
 */
export function buildPaginationItems(currentPage, totalPages) {
  const total = Math.max(0, Math.floor(totalPages));
  if (total <= 0) {
    return [];
  }

  const current = Math.min(Math.max(1, Math.floor(currentPage)), total);
  const windowSize = 3;

  let windowStart = current < 3 ? 1 : current - 2;
  let windowEnd = Math.min(windowStart + windowSize - 1, total);

  if (windowEnd - windowStart + 1 < windowSize) {
    windowStart = Math.max(1, windowEnd - windowSize + 1);
  }

  const items = [];
  for (let page = windowStart; page <= windowEnd; page += 1) {
    items.push({ type: 'page', page });
  }

  const lastInWindow = windowEnd;
  if (lastInWindow < total) {
    if (lastInWindow < total - 1) {
      items.push({ type: 'ellipsis' });
    }
    items.push({ type: 'page', page: total });
  }

  return items;
}
