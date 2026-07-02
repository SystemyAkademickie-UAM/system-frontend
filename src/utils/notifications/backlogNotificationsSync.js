import { fetchGroupBacklogUnreadCount } from '../../services/backlog.api.js';
import { BACKLOG_NEW_NOTIFICATION_POLL_MS } from '../../constants/backlogNotifications.constants.js';

/** @typedef {{ type: 'itemRead', backlogId: number } | { type: 'allRead' } | { type: 'cleared' } | { type: 'partiallyCleared' } | { type: 'newArrived', unreadCount: number }} BacklogNotificationSyncEvent */

/** @type {Map<string, Set<(event: BacklogNotificationSyncEvent) => void>>} */
const listenersByGroup = new Map();

/** @type {Map<string, number>} */
const lastKnownUnreadByGroup = new Map();

/** @type {Map<string, { intervalId: number, refCount: number }>} */
const unreadPollersByGroup = new Map();

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

/**
 * @param {string | number} groupId
 */
export function notifyBacklogNotificationsCleared(groupId) {
  publishBacklogNotificationSync(groupId, { type: 'cleared' });
}

/**
 * Po częściowym wyczyszczeniu (np. oprócz użyć przedmiotów) — tylko odśwież listę,
 * bez zerowania stanu (unikamy fałszywego „newArrived”).
 *
 * @param {string | number} groupId
 */
export function notifyBacklogNotificationsPartiallyCleared(groupId) {
  publishBacklogNotificationSync(groupId, { type: 'partiallyCleared' });
}

/**
 * Raportuje liczbę nieprzeczytanych powiadomień i emituje zdarzenie,
 * gdy wzrośnie względem ostatnio znanego stanu (deduplikacja między instancjami hooka).
 *
 * @param {string | number} groupId
 * @param {number} unreadCount
 */
export function reportBacklogUnreadCount(groupId, unreadCount) {
  const key = String(groupId);
  const previousCount = lastKnownUnreadByGroup.get(key);

  if (previousCount === unreadCount) {
    return;
  }

  lastKnownUnreadByGroup.set(key, unreadCount);

  if (previousCount !== undefined && unreadCount > previousCount) {
    publishBacklogNotificationSync(groupId, { type: 'newArrived', unreadCount });
  }
}

/**
 * @param {string | number | null | undefined} groupId
 */
export function resetBacklogUnreadTracking(groupId) {
  if (groupId == null) {
    return;
  }
  lastKnownUnreadByGroup.delete(String(groupId));
}

/**
 * @param {string | number} groupId
 */
async function pollUnreadCount(groupId) {
  const result = await fetchGroupBacklogUnreadCount(groupId);
  if (result.ok) {
    reportBacklogUnreadCount(groupId, result.count);
  }
}

/**
 * Wspólne odpytywanie liczby nieprzeczytanych — jeden interwał na grupę.
 * Toast i dzwonek reagują na to samo zdarzenie sync.
 *
 * @param {string | number} groupId
 * @param {number} [pollMs]
 * @returns {() => void}
 */
export function ensureBacklogUnreadCountPolling(groupId, pollMs = BACKLOG_NEW_NOTIFICATION_POLL_MS) {
  if (groupId == null || typeof window === 'undefined') {
    return () => {};
  }

  const key = String(groupId);
  const existing = unreadPollersByGroup.get(key);

  if (existing) {
    existing.refCount += 1;
    return () => {
      existing.refCount -= 1;
      if (existing.refCount <= 0) {
        window.clearInterval(existing.intervalId);
        unreadPollersByGroup.delete(key);
        resetBacklogUnreadTracking(groupId);
      }
    };
  }

  void pollUnreadCount(groupId);
  const intervalId = window.setInterval(() => {
    void pollUnreadCount(groupId);
  }, pollMs);

  unreadPollersByGroup.set(key, { intervalId, refCount: 1 });

  return () => {
    const entry = unreadPollersByGroup.get(key);
    if (!entry) {
      return;
    }

    entry.refCount -= 1;
    if (entry.refCount <= 0) {
      window.clearInterval(entry.intervalId);
      unreadPollersByGroup.delete(key);
      resetBacklogUnreadTracking(groupId);
    }
  };
}
