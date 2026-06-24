export const STUDENT_PROFILE_INVALIDATED = 'maq-student-profile-invalidated';
export const GROUP_INVENTORY_INVALIDATED = 'maq-group-inventory-invalidated';

/**
 * @param {string | number | null | undefined} groupId
 */
export function invalidateStudentProfile(groupId) {
  if (typeof window === 'undefined' || groupId == null) {
    return;
  }
  window.dispatchEvent(new CustomEvent(STUDENT_PROFILE_INVALIDATED, {
    detail: { groupId: String(groupId) },
  }));
}

/**
 * @param {string | number | null | undefined} groupId
 */
export function invalidateGroupInventory(groupId) {
  if (typeof window === 'undefined' || groupId == null) {
    return;
  }
  window.dispatchEvent(new CustomEvent(GROUP_INVENTORY_INVALIDATED, {
    detail: { groupId: String(groupId) },
  }));
}

/**
 * @param {string} eventName
 * @param {(groupId: string) => void} handler
 */
export function subscribeGroupScopedEvent(eventName, handler) {
  if (typeof window === 'undefined') {
    return () => {};
  }

  const listener = (event) => {
    const detail = /** @type {CustomEvent<{ groupId?: string }>} */ (event).detail;
    if (detail?.groupId) {
      handler(detail.groupId);
    }
  };

  window.addEventListener(eventName, listener);
  return () => window.removeEventListener(eventName, listener);
}
