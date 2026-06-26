export const GROUP_LIVES_INVALIDATED = 'maq-group-lives-invalidated';

/**
 * @param {string | number | null | undefined} groupId
 */
export function invalidateGroupLives(groupId) {
  if (typeof window === 'undefined' || groupId == null) {
    return;
  }
  window.dispatchEvent(new CustomEvent(GROUP_LIVES_INVALIDATED, {
    detail: { groupId: String(groupId) },
  }));
}
