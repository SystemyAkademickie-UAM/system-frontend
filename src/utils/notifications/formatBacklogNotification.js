import {
  groupActivitiesPath,
  groupMainPath,
  groupMembersPath,
  groupPostsPath,
  groupRewardsPath,
  groupShopPath,
  groupStudentActivityListPath,
  groupStudentBadgesPath,
  groupStudentPostsPath,
  groupStudentRanksPath,
} from '../../routes/pathRegistry.js';

/**
 * @param {string | null | undefined} value
 * @returns {Record<string, unknown>}
 */
export function parseBacklogPayload(value) {
  if (!value) {
    return {};
  }

  try {
    const parsed = JSON.parse(value);
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return /** @type {Record<string, unknown>} */ (parsed);
    }
  } catch {
    return { message: value };
  }

  return { message: value };
}

const TYPE_LABELS = {
  STUDENT_JOINED: 'Dołączenie do grupy',
  SHOP_PURCHASE: 'Zakup w sklepie',
  ITEM_USED: 'Użycie przedmiotu',
  ACTIVITY_COMPLETED: 'Zaliczenie aktywności',
  RANK_UP: 'Awans rangi',
  BADGE_EARNED: 'Zdobyta odznaka',
  STAGE_ADDED: 'Nowy etap',
  BADGE_ADDED: 'Nowa odznaka',
  RANK_ADDED: 'Nowa ranga',
  SHOP_ITEM_ADDED: 'Nowy produkt w sklepie',
  LIVES_SYSTEM_CHANGED: 'System żyć',
  SHOP_STATUS_CHANGED: 'Status sklepu',
  POST_ADDED: 'Nowy wpis',
  STAGE_COMPLETED: 'Ukończono etap',
  CURRENCY_ADDED: 'Zdobyto walutę',
  LIVES_CHANGED: 'Zmiana żyć',
  OTHER: 'Powiadomienie',
};

/**
 * @param {string | number} groupId
 * @param {import('../../services/backlog.api.js').BacklogItem} item
 * @param {boolean} [isStudentView=false]
 */
export function formatBacklogNotification(groupId, item, isStudentView = false) {
  const payload = parseBacklogPayload(item.value);
  const message = typeof payload.message === 'string' ? payload.message : '';
  const typeLabel = TYPE_LABELS[item.type] ?? item.type;
  const title = message || typeLabel;

  const details = [];
  if (typeof payload.price === 'number') {
    details.push(`Cena: ${payload.price}`);
  }
  if (typeof payload.points === 'number') {
    details.push(`Punkty: +${payload.points}`);
  }
  if (typeof payload.itemName === 'string' && !message.includes(payload.itemName)) {
    details.push(payload.itemName);
  }
  if (typeof payload.badgeName === 'string' && !message.includes(payload.badgeName)) {
    details.push(payload.badgeName);
  }
  if (typeof payload.rankName === 'string' && !message.includes(payload.rankName)) {
    details.push(payload.rankName);
  }
  if (typeof payload.stageName === 'string' && !message.includes(payload.stageName)) {
    details.push(payload.stageName);
  }
  if (typeof payload.postTitle === 'string' && !message.includes(payload.postTitle)) {
    details.push(payload.postTitle);
  }

  let href = null;
  if (isStudentView) {
    switch (item.type) {
      case 'STAGE_ADDED':
      case 'ACTIVITY_COMPLETED':
        href = groupStudentActivityListPath(groupId);
        break;
      case 'BADGE_ADDED':
      case 'BADGE_EARNED':
        href = groupStudentBadgesPath(groupId);
        break;
      case 'RANK_ADDED':
      case 'RANK_UP':
        href = groupStudentRanksPath(groupId);
        break;
      case 'SHOP_ITEM_ADDED':
      case 'SHOP_PURCHASE':
      case 'ITEM_USED':
      case 'SHOP_STATUS_CHANGED':
        href = groupShopPath(groupId);
        break;
      case 'POST_ADDED':
        href = groupStudentPostsPath(groupId);
        break;
      case 'LIVES_SYSTEM_CHANGED':
        href = `${groupMainPath(groupId)}#group-notifications`;
        break;
      default:
        href = `${groupMainPath(groupId)}#group-notifications`;
    }
  } else {
    switch (item.type) {
      case 'STUDENT_JOINED':
        href = groupMembersPath(groupId);
        break;
      case 'STAGE_ADDED':
      case 'ACTIVITY_COMPLETED':
        href = groupActivitiesPath(groupId);
        break;
      case 'BADGE_ADDED':
      case 'BADGE_EARNED':
      case 'RANK_ADDED':
      case 'RANK_UP':
        href = groupRewardsPath(groupId);
        break;
      case 'SHOP_ITEM_ADDED':
      case 'SHOP_PURCHASE':
      case 'ITEM_USED':
      case 'SHOP_STATUS_CHANGED':
        href = groupShopPath(groupId);
        break;
      case 'POST_ADDED':
        href = groupPostsPath(groupId);
        break;
      default:
        href = null;
    }
  }

  return {
    id: item.id,
    type: item.type,
    typeLabel,
    title,
    message: details.length > 0 ? details.join(' · ') : typeLabel,
    date: item.date,
    isRead: item.isRead,
    href,
    accountId: item.accountId,
  };
}

/**
 * @param {string} isoDate
 * @returns {string}
 */
export function formatNotificationDate(isoDate) {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) {
    return isoDate;
  }

  return date.toLocaleString('pl-PL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
