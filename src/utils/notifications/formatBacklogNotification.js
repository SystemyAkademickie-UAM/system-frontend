import { READLANGUAGECOOKIE } from '../../utils/LANGUAGECOOKIE.js';
import {
  groupActivitiesPath,
  groupMainPath,
  groupMembersPath,
  groupPostsPath,
  groupRewardsPath,
  groupShopItemsPath,
  groupShopPath,
  groupStudentActivityListPath,
  groupStudentBadgesPath,
  groupStudentPostsPath,
  groupStudentRanksPath,
  groupStudentProfilePath,
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
  STUDENT_JOINED: {
    polish: 'Dołączenie do grupy',
    english: 'Group join',
  },
  SHOP_PURCHASE: {
    polish: 'Zakup w sklepie',
    english: 'Shop purchase',
  },
  ITEM_USED: {
    polish: 'Użycie przedmiotu',
    english: 'Item use',
  },
  ACTIVITY_COMPLETED: {
    polish: 'Zaliczenie aktywności',
    english: 'Activity completion',
  },
  RANK_UP: {
    polish: 'Awans rangi',
    english: 'Rank upgrade',
  },
  BADGE_EARNED: {
    polish: 'Zdobyta odznaka',
    english: 'Badge earned',
  },
  STAGE_ADDED: {
    polish: 'Nowy etap',
    english: 'New stage',
  },
  BADGE_ADDED: {
    polish: 'Nowa odznaka',
    english: 'New badge',
  },
  RANK_ADDED: {
    polish: 'Nowa ranga',
    english: 'New rank',
  },
  SHOP_ITEM_ADDED: {
    polish: 'Nowy produkt w sklepie',
    english: 'New shop item',
  },
  LIVES_SYSTEM_CHANGED: {
    polish: 'System żyć',
    english: 'Lives system',
  },
  SHOP_STATUS_CHANGED: {
    polish: 'Status sklepu',
    english: 'Shop status',
  },
  POST_ADDED: {
    polish: 'Nowy wpis',
    english: 'New post',
  },
  STAGE_COMPLETED: {
    polish: 'Ukończono etap',
    english: 'Stage completed',
  },
  CURRENCY_ADDED: {
    polish: 'Zdobyto walutę',
    english: 'Currency earned',
  },
  LIVES_CHANGED: {
    polish: 'Zmiana żyć',
    english: 'Life change',
  },
  OTHER: {
    polish: 'Powiadomienie',
    english: 'Notification',
  },
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

/** Powiadomienia wyróżniane dla prowadzącego (np. złoty akcent w dzienniku i dzwonku). */
export const LECTURER_PRIORITY_NOTIFICATION_TYPES = new Set([
  'ITEM_USED',
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
 * @param {import('../../services/backlog.api.js').BacklogItem} [item]
 * @param {Record<string, unknown>} [payload]
 * @returns {number | null}
 */
function resolveStudentAccountId(item, payload) {
  const itemAccountId = readNumber(item?.accountId);
  if (itemAccountId && itemAccountId > 0) {
    return itemAccountId;
  }
  const payloadStudentAccountId = readNumber(payload?.studentAccountId);
  if (payloadStudentAccountId && payloadStudentAccountId > 0) {
    return payloadStudentAccountId;
  }
  const payloadAccountId = readNumber(payload?.accountId);
  if (payloadAccountId && payloadAccountId > 0) {
    return payloadAccountId;
  }
  const payloadStudentId = readNumber(payload?.studentId);
  if (payloadStudentId && payloadStudentId > 0) {
    return payloadStudentId;
  }
  return null;
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

const LIVESDELTA__TEXTLABEL = {
  polish: 'Życia',
  english: 'Lives',
};

const CURRENTLY__TEXTLABEL = {
  polish: 'aktualnie',
  english: 'currently',
};

const COST__TEXTLABEL = {
  polish: 'Koszt',
  english: 'Cost',
};

const POINTS__TEXTLABEL = {
  polish: 'Punkty',
  english: 'Points',
};

const REWARD__TEXTLABEL = {
  polish: 'Nagroda',
  english: 'Reward',
};

const CURRENCY__TEXTLABEL = {
  polish: 'Waluta',
  english: 'Currency',
};

const BALANCE__TEXTLABEL = {
  polish: 'Stan konta',
  english: 'Balance',
};

const TOTALEARNED__TEXTLABEL = {
  polish: 'Waluta zgromadzona',
  english: 'Total earned',
};

const STUDENTJOINEDSTUDENT__TEXTLABEL = {
  polish: 'dołączył(a) do grupy',
  english: 'joined the group',
};

const STUDENTJOINEDGROUP__TEXTLABEL = {
  polish: 'dołączył(a) do grupy',
  english: 'joined the group',
};

const SHOPEXTRALIFE__TEXTLABEL = {
  polish: 'dodatkowe życie',
  english: 'extra life',
};

const SHOPPURCHASE__TEXTLABEL = {
  polish: 'kupił(a)',
  english: 'purchased',
};

const SHOPPURCHASEPURCHASE__TEXTLABEL = {
  polish: 'dokonał(a) zakupu w sklepie',
  english: 'made a shop purchase',
};

const ITEMUSED__TEXTLABEL = {
  polish: 'użył(a)',
  english: 'used',
};

const ITEMUSEDUSED__TEXTLABEL = {
  polish: 'użył(a) przedmiot',
  english: 'used an item',
};

const ACTIVITYCOMPLETED__TEXTLABEL = {
  polish: 'zaliczył(a)',
  english: 'completed',
};

const ACTIVITYCOMPLETEDCOMPLETED__TEXTLABEL = {
  polish: 'zaliczył(a) aktywność',
  english: 'completed an activity',
};

const BADGEEARNED__TEXTLABEL = {
  polish: 'zdobył(a) odznakę',
  english: 'earned a badge',
};

const BADGEEARNEDEARNED__TEXTLABEL = {
  polish: 'zdobył(a) odznakę',
  english: 'earned a badge',
};

const RANKUP__TEXTLABEL = {
  polish: 'awansował(a) na rangę',
  english: 'ranked up to',
};

const RANKUPRANKUP__TEXTLABEL = {
  polish: 'awansował(a) rangę',
  english: 'ranked up',
};

const LIVESCHANGED__TEXTLABEL = {
  polish: 'zmiana liczby żyć',
  english: 'life change',
};

const CURRENCYADDED__TEXTLABEL = {
  polish: 'otrzymał(a) walutę',
  english: 'received currency',
};

const CURRENCYREMOVED__TEXTLABEL = {
  polish: 'pobrano walutę',
  english: 'currency removed',
};

const CURRENCYUPDATED__TEXTLABEL = {
  polish: 'zaktualizowano stan konta',
  english: 'balance updated',
};

const CURRENCYTOTALINCREASED__TEXTLABEL = {
  polish: 'zwiększono walutę zgromadzoną',
  english: 'total earned increased',
};

const CURRENCYTOTALDECREASED__TEXTLABEL = {
  polish: 'zmniejszono walutę zgromadzoną',
  english: 'total earned decreased',
};

const CURRENCYTOTALUPDATED__TEXTLABEL = {
  polish: 'zaktualizowano walutę zgromadzoną',
  english: 'total earned updated',
};

const JOINEDGROUP__TEXTLABEL = {
  polish: 'Dołączyłeś(aś) do grupy',
  english: 'You joined the group',
};

const NEWPRODUCT__TEXTLABEL = {
  polish: 'Nowy produkt',
  english: 'New product',
};

const NEWBADGE__TEXTLABEL = {
  polish: 'Nowa odznaka',
  english: 'New badge',
};

const NEWRANK__TEXTLABEL = {
  polish: 'Nowa ranga',
  english: 'New rank',
};

const NEWSTAGE__TEXTLABEL = {
  polish: 'Nowy etap',
  english: 'New stage',
};

const STAGECOMPLETED__TEXTLABEL = {
  polish: 'Ukończono etap',
  english: 'Stage completed',
};

const POSTADDED__TEXTLABEL = {
  polish: 'Nowy wpis',
  english: 'New post',
};

const BADGEEARNEDSTUDENT__TEXTLABEL = {
  polish: 'Zdobyto odznakę',
  english: 'Badge earned',
};

const RANKUPSTUDENT__TEXTLABEL = {
  polish: 'Awans na rangę',
  english: 'Rank upgrade',
};

const ACTIVITYCOMPLETEDSTUDENT__TEXTLABEL = {
  polish: 'Zaliczono',
  english: 'Completed',
};

const ACTIVITYCOMPLETEDSTUDENTSTUDENT__TEXTLABEL = {
  polish: 'Zaliczono aktywność',
  english: 'Activity completed',
};

const SHOPPURCHASESTUDENT__TEXTLABEL = {
  polish: 'Zakup',
  english: 'Purchase',
};

const ITEMUSEDSTUDENT__TEXTLABEL = {
  polish: 'Użyto',
  english: 'Used',
};

const LIVESCHANGEDSTUDENT__TEXTLABEL = {
  polish: 'Zmiana liczby żyć',
  english: 'Life change',
};

const CURRENCYADDEDSTUDENT__TEXTLABEL = {
  polish: 'Zdobyto walutę',
  english: 'Currency earned',
};

const CURRENCYREMOVEDSTUDENT__TEXTLABEL = {
  polish: 'Pobrano walutę',
  english: 'Currency removed',
};

const CURRENCYADDEDSTUDENTUPDATED__TEXTLABEL = {
  polish: 'Zaktualizowano stan konta',
  english: 'Balance updated',
};

const CURRENCYTOTALINCREASEDSTUDENT__TEXTLABEL = {
  polish: 'Zwiększono walutę zgromadzoną',
  english: 'Total earned increased',
};

const CURRENCYTOTALDECREASEDSTUDENT__TEXTLABEL = {
  polish: 'Zmniejszono walutę zgromadzoną',
  english: 'Total earned decreased',
};

const CURRENCYTOTALUPDATEDSTUDENT__TEXTLABEL = {
  polish: 'Zaktualizowano walutę zgromadzoną',
  english: 'Total earned updated',
};

const SHOPOPENED__TEXTLABEL = {
  polish: 'Sklep grupy został otwarty',
  english: 'Group shop has been opened',
};

const SHOPCLOSED__TEXTLABEL = {
  polish: 'Sklep grupy został zamknięty',
  english: 'Group shop has been closed',
};

/**
 * @param {number | null} delta
 * @param {number | null} lives
 * @returns {string | null}
 */
function formatLivesChangeLabel(delta, lives) {
  if (delta != null && lives != null) {
    const deltaLabel = delta >= 0 ? `+${delta}` : String(delta);
    return `${LIVESDELTA__TEXTLABEL}: ${deltaLabel} (${CURRENTLY__TEXTLABEL}: ${lives})`;
  }
  if (lives != null) {
    return `${CURRENTLY__TEXTLABEL} liczba żyć: ${lives}`;
  }
  if (delta != null) {
    return delta >= 0 ? `${LIVESDELTA__TEXTLABEL}: +${delta}` : `${LIVESDELTA__TEXTLABEL}: ${delta}`;

  }
  return null;
}

/**
 * @param {Record<string, unknown>} payload
 * @returns {number | null}
 */
function resolveCurrencyDelta(payload) {
  return readNumber(payload.currencyDelta ?? payload.delta ?? payload.points ?? payload.currencyAmount ?? payload.amount);
}

/**
 * @param {Record<string, unknown>} payload
 * @returns {number | null}
 */
function resolveTotalEarnedDelta(payload) {
  return readNumber(payload.totalEarnedDelta ?? payload.totalCurrencyDelta);
}

/**
 * @param {Record<string, unknown>} payload
 * @returns {number | null}
 */
function resolveTotalEarnedBalance(payload) {
  return readNumber(payload.totalEarned ?? payload.totalEarnedAmount ?? payload.totalCurrency);
}

/**
 * @param {Record<string, unknown>} payload
 * @returns {boolean}
 */
function isTotalEarnedPayload(payload) {
  return payload.isTotalEarned === true || payload.totalEarnedDelta != null;
}

/**
 * @param {Record<string, unknown>} payload
 * @returns {number | null}
 */
function resolveCurrencyBalance(payload) {
  return readNumber(payload.currency ?? payload.newCurrency ?? payload.totalCurrency);
}

/**
 * @param {Record<string, unknown>} payload
 * @returns {number | null}
 */
function resolveActivityRewardAmount(payload) {
  return readNumber(payload.points ?? payload.currencyAmount ?? payload.rewardAmount);
}

/**
 * @param {string} title
 * @returns {string}
 */
function stripActivityPointsSuffix(title) {
  return title.replace(/\s*\(\s*\+\s*\d+\s*pkt\s*\)\s*\.?/gi, '').trim();
}

/**
 * @param {Record<string, unknown>} payload
 * @param {{ excludeInMessage?: string[], skipPointsLabel?: boolean }} [options]
 * @returns {string[]}
 */
function collectPayloadDetails(payload, { excludeInMessage = [], skipPointsLabel = false } = {}) {
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
  const storyDescription = readString(payload.storyDescription);
  const educationalDescription = readString(payload.educationalDescription);

  pushUnique(itemName);
  pushUnique(badgeName);
  pushUnique(rankName);
  pushUnique(stageName);
  pushUnique(postTitle);
  pushUnique(activityName);
  pushUnique(storyDescription);
  pushUnique(educationalDescription);

  const price = resolvePrice(payload);
  if (price != null) {
    pushUnique(`${COST__TEXTLABEL}: ${price}`);
  }

  const points = readNumber(payload.points);
  if (points != null && !skipPointsLabel) {
    pushUnique(`${POINTS__TEXTLABEL}: +${points}`);
  }

  const rewardAmount = readNumber(payload.rewardAmount);
  if (rewardAmount != null && rewardAmount !== points) {
    pushUnique(`${REWARD__TEXTLABEL}: +${rewardAmount}`);
  }

  const currencyAmount = readNumber(payload.currencyAmount);
  if (currencyAmount != null && currencyAmount !== points && currencyAmount !== price) {
    pushUnique(`${CURRENCY__TEXTLABEL}: +${currencyAmount}`);
  }

  const currencyDelta = resolveCurrencyDelta(payload);
  const currencyBalance = resolveCurrencyBalance(payload);
  if (currencyBalance != null) {
    pushUnique(`${BALANCE__TEXTLABEL}: ${currencyBalance}`);
  }

  const totalEarned = resolveTotalEarnedBalance(payload);
  if (totalEarned != null && isTotalEarnedPayload(payload)) {
    pushUnique(`${TOTALEARNED__TEXTLABEL}: ${totalEarned}`);
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
function buildFallbackTitle(type, payload, isStudentView, studentLabel, language) {
  const itemName = readString(payload.itemName);
  const badgeName = readString(payload.badgeName);
  const rankName = readString(payload.rankName);
  const stageName = readString(payload.stageName);
  const postTitle = readString(payload.postTitle);
  const activityName = readString(payload.activityName);
  const price = resolvePrice(payload);
  const points = readNumber(payload.points ?? payload.currencyAmount ?? payload.amount);
  const currencyDelta = resolveCurrencyDelta(payload);
  const totalEarnedDelta = resolveTotalEarnedDelta(payload);
  const livesDelta = resolveLivesDelta(payload);
  const lives = readNumber(payload.newLives ?? payload.lives);
  const livesLabel = formatLivesChangeLabel(livesDelta, lives);
  const isExtraLife = payload.isExtraLife === true;

  if (!isStudentView && studentLabel) {
    switch (type) {

      case 'STUDENT_JOINED':
        return `${studentLabel} ${STUDENTJOINEDSTUDENT__TEXTLABEL[language]}`;
      case 'SHOP_PURCHASE':
        if (isExtraLife) {
          return price != null
            ? `${studentLabel} ${SHOPPURCHASE__TEXTLABEL[language]}: ${SHOPEXTRALIFE__TEXTLABEL[language]} (${price})`
            : `${studentLabel} ${SHOPPURCHASE__TEXTLABEL[language]}: ${SHOPEXTRALIFE__TEXTLABEL[language]}`;
        }
        return price != null && itemName
          ? `${studentLabel} ${SHOPPURCHASE__TEXTLABEL[language]}: ${itemName} (${price})`
          : itemName
            ? `${studentLabel} ${SHOPPURCHASE__TEXTLABEL[language]}: ${itemName}`
            : `${studentLabel} ${SHOPPURCHASEPURCHASE__TEXTLABEL[language]}`;
      case 'ITEM_USED':
        return itemName
          ? `${studentLabel} ${ITEMUSED__TEXTLABEL[language]}: ${itemName}`
          : `${studentLabel} ${ITEMUSEDUSED__TEXTLABEL[language]}`;
      case 'ACTIVITY_COMPLETED':
        return activityName
          ? `${studentLabel} ${ACTIVITYCOMPLETED__TEXTLABEL[language]}: ${activityName}`
          : `${studentLabel} ${ACTIVITYCOMPLETEDCOMPLETED__TEXTLABEL[language]}`;
      case 'BADGE_EARNED':
        return badgeName
          ? `${studentLabel} ${BADGEEARNED__TEXTLABEL[language]}: ${badgeName}`
          : `${studentLabel} ${BADGEEARNEDEARNED__TEXTLABEL[language]}`;
      case 'RANK_UP':
        return rankName
          ? `${studentLabel} ${RANKUP__TEXTLABEL[language]}: ${rankName}`
          : `${studentLabel} ${RANKUPRANKUP__TEXTLABEL[language]}`;
      case 'LIVES_CHANGED':
        return livesLabel
          ? `${studentLabel}: ${livesLabel}`
          : `${studentLabel}: ${LIVESCHANGED__TEXTLABEL[language]}`;
      case 'CURRENCY_ADDED':
        if (isTotalEarnedPayload(payload)) {
          if (totalEarnedDelta != null) {
            if (totalEarnedDelta > 0) {
              return `${studentLabel}: ${CURRENCYTOTALINCREASED__TEXTLABEL[language]} (+${totalEarnedDelta})`;
            }
            if (totalEarnedDelta < 0) {
              return `${studentLabel}: ${CURRENCYTOTALDECREASED__TEXTLABEL[language]} (${totalEarnedDelta})`;
            }
            return `${studentLabel}: ${CURRENCYTOTALUPDATED__TEXTLABEL[language]}`;
          }
          return `${studentLabel}: ${CURRENCYTOTALUPDATED__TEXTLABEL[language]}`;
        }
        if (currencyDelta != null) {
          if (currencyDelta > 0) {
            return `${studentLabel} ${CURRENCYADDED__TEXTLABEL[language]} (+${currencyDelta})`;
          }
          if (currencyDelta < 0) {
            return `${studentLabel}: ${CURRENCYREMOVED__TEXTLABEL[language]} (${currencyDelta})`;
          }
          return `${studentLabel}: ${CURRENCYUPDATED__TEXTLABEL[language]}`;
        }
        return points != null
          ? `${studentLabel} ${CURRENCYADDED__TEXTLABEL[language]}: +${points}`
          : `${studentLabel} ${CURRENCYADDED__TEXTLABEL[language]}`;
      default:
        break;
    }
  }

  switch (type) {
    case 'STUDENT_JOINED':
      return JOINEDGROUP__TEXTLABEL[language];
    case 'SHOP_ITEM_ADDED':
      return itemName ? `${NEWPRODUCT__TEXTLABEL[language]}: ${itemName}` : null;
    case 'BADGE_ADDED':
      return badgeName ? `${NEWBADGE__TEXTLABEL[language]}: ${badgeName}` : null;
    case 'RANK_ADDED':
      return rankName ? `${NEWRANK__TEXTLABEL[language]}: ${rankName}` : null;
    case 'STAGE_ADDED':
      return stageName ? `${NEWSTAGE__TEXTLABEL[language]}: ${stageName}` : null;
    case 'STAGE_COMPLETED':
      return stageName ? `${STAGECOMPLETED__TEXTLABEL[language]}: ${stageName}` : null;
    case 'POST_ADDED':
      return postTitle ? `${POSTADDED__TEXTLABEL[language]}: ${postTitle}` : null;
    case 'BADGE_EARNED':
      return badgeName ? `${BADGEEARNEDSTUDENT__TEXTLABEL[language]}: ${badgeName}` : null;
    case 'RANK_UP':
      return rankName ? `${RANKUPSTUDENT__TEXTLABEL[language]}: ${rankName}` : null;
    case 'ACTIVITY_COMPLETED':
      return activityName
        ? `${ACTIVITYCOMPLETEDSTUDENT__TEXTLABEL[language]}: ${activityName}`
        : `${ACTIVITYCOMPLETEDSTUDENTSTUDENT__TEXTLABEL[language]}`;
    case 'SHOP_PURCHASE':
      if (isExtraLife) {
        return price != null ? `${SHOPEXTRALIFE__TEXTLABEL[language]} (${price})` : `${SHOPEXTRALIFE__TEXTLABEL[language]}`;
      }
      return itemName && price != null
        ? `${SHOPPURCHASESTUDENT__TEXTLABEL[language]}: ${itemName} (${price})`
        : itemName
          ? `${SHOPPURCHASESTUDENT__TEXTLABEL[language]}: ${itemName}`
          : null;
    case 'ITEM_USED':
      return itemName ? `${ITEMUSEDSTUDENT__TEXTLABEL[language]}: ${itemName}` : null;
    case 'LIVES_CHANGED':
      return livesLabel ?? `${LIVESCHANGEDSTUDENT__TEXTLABEL[language]}`;
    case 'CURRENCY_ADDED':
      if (isTotalEarnedPayload(payload)) {
        if (totalEarnedDelta != null) {
          if (totalEarnedDelta > 0) {
            return `${CURRENCYTOTALINCREASEDSTUDENT__TEXTLABEL[language]} (+${totalEarnedDelta})`;
          }
          if (totalEarnedDelta < 0) {
            return `${CURRENCYTOTALDECREASEDSTUDENT__TEXTLABEL[language]} (${totalEarnedDelta})`;
          }
          return `${CURRENCYTOTALUPDATEDSTUDENT__TEXTLABEL[language]}`;
        }
        return `${CURRENCYTOTALUPDATEDSTUDENT__TEXTLABEL[language]}`;
      }
      if (currencyDelta != null) {
        if (currencyDelta > 0) {
          return `${CURRENCYADDEDSTUDENT__TEXTLABEL[language]} (+${currencyDelta})`;
        }
        if (currencyDelta < 0) {
          return `${CURRENCYREMOVEDSTUDENT__TEXTLABEL[language]} (${currencyDelta})`;
        }
        return `${CURRENCYADDEDSTUDENTUPDATED__TEXTLABEL[language]}`;
      }
      return points != null ? `${CURRENCYADDEDSTUDENT__TEXTLABEL[language]} (+${points})` : null;
    case 'SHOP_STATUS_CHANGED':
      if (payload.shopOpen === true) {
        return SHOPOPENED__TEXTLABEL[language];
      }
      if (payload.shopOpen === false) {
        return SHOPCLOSED__TEXTLABEL[language];
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

function resolveTypeLabel(type, language) {
  return TYPE_LABELS[type][language];
}

/**
 * @param {string | number} groupId
 * @param {import('../../services/backlog.api.js').BacklogItem} item
 * @param {boolean} [isStudentView=false]
 */
export function formatBacklogNotification(groupId, item, isStudentView = false, language) {
  const resolvedLanguage = language ?? READLANGUAGECOOKIE();
  const payload = parseBacklogPayload(item.value);
  const message = readString(payload.message) ?? '';
  let typeLabel = TYPE_LABELS[item.type][resolvedLanguage];

  if (item.type === 'CURRENCY_ADDED') {
    if (isTotalEarnedPayload(payload)) {
      typeLabel = TOTALEARNED__TEXTLABEL[resolvedLanguage];
    } else {
      const delta = resolveCurrencyDelta(payload);
      if (delta != null) {
        if (delta > 0) {
          typeLabel = CURRENCYADDEDSTUDENT__TEXTLABEL[resolvedLanguage];
        } else if (delta < 0) {
          typeLabel = CURRENCYREMOVEDSTUDENT__TEXTLABEL[resolvedLanguage];
        } else {
          typeLabel = BALANCE__TEXTLABEL[resolvedLanguage];
        }
      } else {
        typeLabel = BALANCE__TEXTLABEL[resolvedLanguage];
      }
    }
  }

  const studentLabel = resolveStudentLabel(payload);
  const isStudentActivityReward = isStudentView && item.type === 'ACTIVITY_COMPLETED';
  const activityRewardAmount = isStudentActivityReward ? resolveActivityRewardAmount(payload) : null;
  const fallbackTitle = buildFallbackTitle(item.type, payload, isStudentView, studentLabel, resolvedLanguage);
  let title = resolveNotificationTitle(fallbackTitle, message, typeLabel);

  if (isStudentActivityReward) {
    title = stripActivityPointsSuffix(title);
  }

  const excludeInMessage = [message, title, fallbackTitle, studentLabel].filter(Boolean);
  const details = collectPayloadDetails(payload, {
    excludeInMessage,
    skipPointsLabel: isStudentActivityReward,
  });

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
        href = groupMainPath(groupId);
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
    const targetAccountId = resolveStudentAccountId(item, payload);
    switch (item.type) {
      case 'STUDENT_JOINED':
        if (targetAccountId) {
          href = groupStudentProfilePath(groupId, targetAccountId);
        } else {
          href = groupMembersPath(groupId);
        }
        break;
      case 'STAGE_ADDED':
      case 'STAGE_COMPLETED':
        href = groupActivitiesPath(groupId);
        break;
      case 'ACTIVITY_COMPLETED':
        if (targetAccountId) {
          href = groupStudentProfilePath(groupId, targetAccountId);
        } else {
          href = groupActivitiesPath(groupId);
        }
        break;
      case 'BADGE_ADDED':
      case 'RANK_ADDED':
        href = groupRewardsPath(groupId);
        break;
      case 'BADGE_EARNED':
      case 'RANK_UP':
        if (targetAccountId) {
          href = groupStudentProfilePath(groupId, targetAccountId);
        } else {
          href = groupRewardsPath(groupId);
        }
        break;
      case 'SHOP_ITEM_ADDED':
        href = groupShopItemsPath(groupId);
        break;
      case 'SHOP_PURCHASE':
      case 'ITEM_USED':
        if (targetAccountId) {
          href = groupStudentProfilePath(groupId, targetAccountId);
        } else {
          href = groupShopItemsPath(groupId);
        }
        break;
      case 'SHOP_STATUS_CHANGED':
        href = groupShopItemsPath(groupId);
        break;
      case 'POST_ADDED':
        href = groupPostsPath(groupId);
        break;
      case 'LIVES_CHANGED':
      case 'CURRENCY_ADDED':
        if (targetAccountId) {
          href = groupStudentProfilePath(groupId, targetAccountId);
        } else {
          href = groupMembersPath(groupId);
        }
        break;
      case 'LIVES_SYSTEM_CHANGED':
        href = groupMainPath(groupId);
        break;
      default:
        href = `${groupMainPath(groupId)}#group-notifications`;
    }
  }

  const rawItemId = payload.itemId ?? payload.shopItemId ?? (payload.id != null && (item.type === 'SHOP_PURCHASE' || item.type === 'ITEM_USED' || item.type === 'SHOP_ITEM_ADDED') ? payload.id : null);
  const itemId = rawItemId != null ? String(rawItemId) : null;
  const itemName = readString(payload.itemName);
  const isExtraLife = payload.isExtraLife === true;
  const resolvedAccountId = resolveStudentAccountId(item, payload);

  return {
    id: item.id,
    type: item.type,
    typeLabel,
    title,
    message: resolveNotificationSubtitle(title, details),
    currencyReward: activityRewardAmount,
    date: item.date,
    isRead: item.isRead,
    href,
    accountId: resolvedAccountId ?? item.accountId,
    highlightVariant: !isStudentView && LECTURER_PRIORITY_NOTIFICATION_TYPES.has(item.type)
      ? 'gold'
      : null,
    itemId,
    itemName,
    isExtraLife,
    rawPayload: payload,
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
