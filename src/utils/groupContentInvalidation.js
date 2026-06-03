/** @typedef {'ranks' | 'badges' | 'stages' | 'activities' | 'all'} GroupContentScope */

export const GROUP_CONTENT_CHANGED_EVENT = 'maq:group-content-changed';

/**
 * @param {string | number} groupId
 * @param {GroupContentScope | GroupContentScope[]} scope
 */
export function notifyGroupContentChanged(groupId, scope = 'all') {
  if (groupId == null || groupId === '') {
    return;
  }

  const scopes = Array.isArray(scope) ? scope : [scope];

  window.dispatchEvent(new CustomEvent(GROUP_CONTENT_CHANGED_EVENT, {
    detail: {
      groupId: String(groupId),
      scopes,
    },
  }));
}

/**
 * @param {string | number | undefined} groupId
 * @param {GroupContentScope[]} watchedScopes
 * @param {() => void} onInvalidate
 */
export function subscribeGroupContentChanges(groupId, watchedScopes, onInvalidate) {
  if (!groupId) {
    return () => {};
  }

  /** @param {Event} event */
  const handler = (event) => {
    const detail = /** @type {CustomEvent<{ groupId?: string, scopes?: GroupContentScope[] }>} */ (event).detail;
    if (String(detail?.groupId) !== String(groupId)) {
      return;
    }

    const changedScopes = detail?.scopes ?? ['all'];
    const shouldRefresh = changedScopes.includes('all')
      || watchedScopes.some((scope) => changedScopes.includes(scope));

    if (shouldRefresh) {
      onInvalidate();
    }
  };

  window.addEventListener(GROUP_CONTENT_CHANGED_EVENT, handler);
  return () => window.removeEventListener(GROUP_CONTENT_CHANGED_EVENT, handler);
}
