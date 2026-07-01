/** @typedef {{ type: 'itemRead', backlogId: number } | { type: 'allRead' }} BacklogNotificationSyncEvent */

/** @type {Map<string, Set<(event: BacklogNotificationSyncEvent) => void>>} */
const listenersByGroup = new Map();

/**
 * @param {string | number} groupId
 * @param {(event: BacklogNotificationSyncEvent) => void} listener
 */
export function subscribeBacklogNotificationSync(groupId, listener) {
  const key = String(groupId);
  if (!listenersByGroup.has(key)) {
    listenersByGroup.set(key, new Set());
  }

  listenersByGroup.get(key).add(listener);
  return () => {
    listenersByGroup.get(key)?.delete(listener);
  };
}

/**
 * @param {string | number} groupId
 * @param {BacklogNotificationSyncEvent} event
 */
function publishBacklogNotificationSync(groupId, event) {
  listenersByGroup.get(String(groupId))?.forEach((listener) => {
    listener(event);
  });
}

/**
 * @param {string | number} groupId
 * @param {number} backlogId
 */
export function notifyBacklogNotificationRead(groupId, backlogId) {
  publishBacklogNotificationSync(groupId, { type: 'itemRead', backlogId });
}

/**
 * @param {string | number} groupId
 */
export function notifyBacklogNotificationsAllRead(groupId) {
  publishBacklogNotificationSync(groupId, { type: 'allRead' });
}
