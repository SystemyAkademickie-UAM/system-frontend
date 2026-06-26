/**
 * @param {string | number} groupId
 * @param {string} role
 * @returns {string}
 */
function storageKey(groupId, role) {
  return `maq.notifications.lastSeen.${groupId}.${role}`;
}

/**
 * @param {string | number} groupId
 * @param {string} role
 * @returns {Date | null}
 */
export function getNotificationsLastSeen(groupId, role) {
  if (typeof window === 'undefined') {
    return null;
  }

  const raw = window.localStorage.getItem(storageKey(groupId, role));
  if (!raw) {
    return null;
  }

  const date = new Date(raw);
  return Number.isNaN(date.getTime()) ? null : date;
}

/**
 * @param {string | number} groupId
 * @param {string} role
 * @param {Date} [date]
 */
export function setNotificationsLastSeen(groupId, role, date = new Date()) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(storageKey(groupId, role), date.toISOString());
}

/**
 * @param {string} isoDate
 * @param {Date | null | undefined} lastSeenAt
 */
export function isNotificationAfterLastSeen(isoDate, lastSeenAt) {
  if (!lastSeenAt) {
    return false;
  }

  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) {
    return false;
  }

  return date > lastSeenAt;
}
