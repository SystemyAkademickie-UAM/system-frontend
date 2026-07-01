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
 * @returns {number | null}
 */
function resolveLivesDelta(payload) {
  return readNumber(payload.livesDelta ?? payload.delta);
}

/**
 * @param {Record<string, unknown>} payload
 * @returns {number | null}
 */
function resolvePrice(payload) {
  return readNumber(payload.price ?? payload.amount);
}

/**
 * @param {number | null} delta
 * @param {number | null} lives
 * @returns {string | null}
 */
function formatLivesChangeLabel(delta, lives) {
  if (delta != null && lives != null) {
    const deltaLabel = delta >= 0 ? `+${delta}` : String(delta);
    return `Życia: ${deltaLabel} (aktualnie: ${lives})`;
  }
  if (lives != null) {
    return `Aktualna liczba żyć: ${lives}`;
  }
  if (delta != null) {
    return delta >= 0 ? `Życia: +${delta}` : `Życia: ${delta}`;
  }
  return null;
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

  const price = resolvePrice(payload);
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

  const currencyAmount = readNumber(payload.currencyAmount);
  if (currencyAmount != null && currencyAmount !== points && currencyAmount !== price) {
    pushUnique(`Waluta: +${currencyAmount}`);
  }

  const livesDelta = resolveLivesDelta(payload);
  const newLives = readNumber(payload.newLives ?? payload.lives);
  const livesLabel = formatLivesChangeLabel(livesDelta, newLives);
  if (livesLabel) {
    pushUnique(livesLabel);
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
  const price = resolvePrice(payload);
  const points = readNumber(payload.points ?? payload.currencyAmount ?? payload.amount);
  const livesDelta = resolveLivesDelta(payload);
  const lives = readNumber(payload.newLives ?? payload.lives);
  const livesLabel = formatLivesChangeLabel(livesDelta, lives);
  const isExtraLife = payload.isExtraLife === true;

  if (!isStudentView && studentLabel) {
    switch (type) {
      case 'STUDENT_JOINED':
        return `${studentLabel} dołączył(a) do grupy`;
      case 'SHOP_PURCHASE':
        if (isExtraLife) {
          return price != null
            ? `${studentLabel} kupił(a) dodatkowe życie (${price})`
            : `${studentLabel} kupił(a) dodatkowe życie`;
        }
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
      case 'LIVES_CHANGED':
        return livesLabel
          ? `${studentLabel}: ${livesLabel}`
          : `${studentLabel}: zmiana liczby żyć`;
      case 'CURRENCY_ADDED':
        return points != null
          ? `${studentLabel} otrzymał(a) walutę: +${points}`
          : `${studentLabel} otrzymał(a) walutę`;
      default:
        break;
    }
  }

  switch (type) {
    case 'STUDENT_JOINED':
      return 'Dołączyłeś(aś) do grupy';
    case 'SHOP_ITEM_ADDED':
      return itemName ? `Nowy produkt: ${itemName}` : null;
    case 'BADGE_ADDED':
      return badgeName ? `Nowa odznaka: ${badgeName}` : null;
    case 'RANK_ADDED':
      return rankName ? `Nowa ranga: ${rankName}` : null;
    case 'STAGE_ADDED':
      return stageName ? `Nowy etap: ${stageName}` : null;
    case 'STAGE_COMPLETED':
      return stageName ? `Ukończono etap: ${stageName}` : null;
    case 'POST_ADDED':
      return postTitle ? `Nowy wpis: ${postTitle}` : null;
    case 'BADGE_EARNED':
      return badgeName ? `Zdobyto odznakę: ${badgeName}` : null;
    case 'RANK_UP':
      return rankName ? `Awans na rangę: ${rankName}` : null;
    case 'ACTIVITY_COMPLETED':
      return activityName
        ? points != null
          ? `Zaliczono: ${activityName} (+${points} pkt)`
          : `Zaliczono: ${activityName}`
        : points != null
          ? `Zaliczono aktywność (+${points} pkt)`
          : null;
    case 'SHOP_PURCHASE':
      if (isExtraLife) {
        return price != null ? `Kupiono dodatkowe życie (${price})` : 'Kupiono dodatkowe życie';
      }
      return itemName && price != null
        ? `Zakup: ${itemName} (${price})`
        : itemName
          ? `Zakup: ${itemName}`
          : null;
    case 'ITEM_USED':
      return itemName ? `Użyto: ${itemName}` : null;
    case 'LIVES_CHANGED':
      return livesLabel ?? 'Zmiana liczby żyć';
    case 'CURRENCY_ADDED':
      return points != null ? `Zdobyto walutę: +${points}` : null;
    case 'SHOP_STATUS_CHANGED':
      if (payload.shopOpen === true) {
        return 'Sklep grupy został otwarty';
      }
      if (payload.shopOpen === false) {
        return 'Sklep grupy został zamknięty';
      }
      return readString(payload.message);
    case 'LIVES_SYSTEM_CHANGED':
      return readString(payload.message);
    default:
      return null;
  }
}

/**
 * @param {string | null} fallbackTitle
 * @param {string} message
 * @param {string} typeLabel
 * @returns {string}
 */
function resolveNotificationTitle(fallbackTitle, message, typeLabel) {
  if (fallbackTitle) {
    return fallbackTitle;
  }
  if (message) {
    return message;
  }
  return typeLabel;
}

/**
 * @param {string} title
 * @param {string[]} details
 * @returns {string}
 */
function resolveNotificationSubtitle(title, details) {
  if (details.length === 0) {
    return '';
  }

  const subtitle = details
    .filter((detail) => !title.includes(detail))
    .join(' · ');

  return subtitle && subtitle !== title ? subtitle : '';
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
  const title = resolveNotificationTitle(fallbackTitle, message, typeLabel);

  const excludeInMessage = [message, title, fallbackTitle, studentLabel].filter(Boolean);
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

  return {
    id: item.id,
    type: item.type,
    typeLabel,
    title,
    message: resolveNotificationSubtitle(title, details),
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
