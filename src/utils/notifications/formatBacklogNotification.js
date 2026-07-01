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

const LECTURER_STUDENT_EVENT_TYPES = new Set([
  'STUDENT_JOINED',
  'SHOP_PURCHASE',
  'ITEM_USED',
  'ACTIVITY_COMPLETED',
  'BADGE_EARNED',
  'RANK_UP',
  'LIVES_CHANGED',
  'CURRENCY_ADDED',
]);

/**
 * @param {unknown} value
 * @returns {string | null}
 */
function readString(value) {
  if (typeof value !== 'string') {
    return null;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

/**
 * @param {unknown} value
 * @returns {number | null}
 */
function readNumber(value) {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return null;
  }
  return value;
}

/**
 * @param {Record<string, unknown>} payload
 * @returns {string | null}
 */
function resolveStudentLabel(payload) {
  return readString(payload.nickname)
    ?? readString(payload.studentNickname)
    ?? readString(payload.studentName)
    ?? readString(payload.displayName);
}

/**
 * @param {Record<string, unknown>} payload
 * @returns {string[]}
 */
function collectPayloadDetails(payload, { excludeInMessage = [] } = {}) {
  /** @type {string[]} */
  const details = [];
  const excluded = new Set(excludeInMessage.filter(Boolean));

  const pushUnique = (value) => {
    if (!value || excluded.has(value) || details.includes(value)) {
      return;
    }
    details.push(value);
  };

  const itemName = readString(payload.itemName);
  const badgeName = readString(payload.badgeName);
  const rankName = readString(payload.rankName);
  const stageName = readString(payload.stageName);
  const postTitle = readString(payload.postTitle);
  const activityName = readString(payload.activityName);

  pushUnique(itemName);
  pushUnique(badgeName);
  pushUnique(rankName);
  pushUnique(stageName);
  pushUnique(postTitle);
  pushUnique(activityName);

  const price = readNumber(payload.price);
  if (price != null) {
    pushUnique(`Koszt: ${price}`);
  }

  const points = readNumber(payload.points);
  if (points != null) {
    pushUnique(`Punkty: +${points}`);
  }

  const rewardAmount = readNumber(payload.rewardAmount);
  if (rewardAmount != null && rewardAmount !== points) {
    pushUnique(`Nagroda: +${rewardAmount}`);
  }

  const currencyAmount = readNumber(payload.currencyAmount ?? payload.amount);
  if (currencyAmount != null) {
    pushUnique(`Waluta: +${currencyAmount}`);
  }

  const livesDelta = readNumber(payload.livesDelta);
  if (livesDelta != null) {
    pushUnique(livesDelta >= 0 ? `Życia: +${livesDelta}` : `Życia: ${livesDelta}`);
  }

  const newLives = readNumber(payload.newLives ?? payload.lives);
  if (newLives != null && livesDelta == null) {
    pushUnique(`Życia: ${newLives}`);
  }

  return details;
}

/**
 * @param {string} type
 * @param {Record<string, unknown>} payload
 * @param {boolean} isStudentView
 * @param {string | null} studentLabel
 * @returns {string | null}
 */
function buildFallbackTitle(type, payload, isStudentView, studentLabel) {
  const itemName = readString(payload.itemName);
  const badgeName = readString(payload.badgeName);
  const rankName = readString(payload.rankName);
  const stageName = readString(payload.stageName);
  const postTitle = readString(payload.postTitle);
  const activityName = readString(payload.activityName);
  const price = readNumber(payload.price);

  if (!isStudentView && studentLabel) {
    switch (type) {
      case 'STUDENT_JOINED':
        return `${studentLabel} dołączył(a) do grupy`;
      case 'SHOP_PURCHASE':
        return price != null && itemName
          ? `${studentLabel} kupił(a): ${itemName} (${price})`
          : itemName
            ? `${studentLabel} kupił(a): ${itemName}`
            : `${studentLabel} dokonał(a) zakupu w sklepie`;
      case 'ITEM_USED':
        return itemName
          ? `${studentLabel} użył(a): ${itemName}`
          : `${studentLabel} użył(a) przedmiotu`;
      case 'ACTIVITY_COMPLETED':
        return activityName
          ? `${studentLabel} zaliczył(a): ${activityName}`
          : `${studentLabel} zaliczył(a) aktywność`;
      case 'BADGE_EARNED':
        return badgeName
          ? `${studentLabel} zdobył(a) odznakę: ${badgeName}`
          : `${studentLabel} zdobył(a) odznakę`;
      case 'RANK_UP':
        return rankName
          ? `${studentLabel} awansował(a) na rangę: ${rankName}`
          : `${studentLabel} awansował(a) rangę`;
      default:
        break;
    }
  }

  switch (type) {
    case 'SHOP_ITEM_ADDED':
      return itemName ? `Nowy produkt: ${itemName}` : null;
    case 'BADGE_ADDED':
      return badgeName ? `Nowa odznaka: ${badgeName}` : null;
    case 'RANK_ADDED':
      return rankName ? `Nowa ranga: ${rankName}` : null;
    case 'STAGE_ADDED':
      return stageName ? `Nowy etap: ${stageName}` : null;
    case 'POST_ADDED':
      return postTitle ? `Nowy wpis: ${postTitle}` : null;
    case 'BADGE_EARNED':
      return badgeName ? `Zdobyto odznakę: ${badgeName}` : null;
    case 'RANK_UP':
      return rankName ? `Awans na rangę: ${rankName}` : null;
    case 'ACTIVITY_COMPLETED':
      return activityName ? `Zaliczono: ${activityName}` : null;
    case 'SHOP_PURCHASE':
      return itemName && price != null
        ? `Zakup: ${itemName} (${price})`
        : itemName
          ? `Zakup: ${itemName}`
          : null;
    case 'ITEM_USED':
      return itemName ? `Użyto: ${itemName}` : null;
    default:
      return null;
  }
}

/**
 * @param {string | number} groupId
 * @param {import('../../services/backlog.api.js').BacklogItem} item
 * @param {boolean} [isStudentView=false]
 */
export function formatBacklogNotification(groupId, item, isStudentView = false) {
  const payload = parseBacklogPayload(item.value);
  const message = readString(payload.message) ?? '';
  const typeLabel = TYPE_LABELS[item.type] ?? item.type;
  const studentLabel = resolveStudentLabel(payload);
  const fallbackTitle = buildFallbackTitle(item.type, payload, isStudentView, studentLabel);
  const title = message || fallbackTitle || typeLabel;

  const excludeInMessage = [message, title];
  const details = collectPayloadDetails(payload, { excludeInMessage });

  if (!isStudentView && LECTURER_STUDENT_EVENT_TYPES.has(item.type) && studentLabel && !title.includes(studentLabel)) {
    details.unshift(studentLabel);
  }

  let href = null;
  if (isStudentView) {
    switch (item.type) {
      case 'STAGE_ADDED':
      case 'ACTIVITY_COMPLETED':
      case 'STAGE_COMPLETED':
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
      case 'LIVES_CHANGED':
        href = `${groupMainPath(groupId)}#group-notifications`;
        break;
      case 'CURRENCY_ADDED':
        href = groupMainPath(groupId);
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
      case 'STAGE_COMPLETED':
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
      case 'LIVES_CHANGED':
      case 'CURRENCY_ADDED':
        href = groupMembersPath(groupId);
        break;
      default:
        href = null;
    }
  }

  const detailMessage = details.length > 0 ? details.join(' · ') : '';

  return {
    id: item.id,
    type: item.type,
    typeLabel,
    title,
    message: detailMessage && detailMessage !== title ? detailMessage : (message && message !== title ? '' : typeLabel),
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
